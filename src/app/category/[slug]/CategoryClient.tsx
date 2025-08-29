// Ruta: src/app/category/[slug]/CategoryClient.tsx
"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { db } from "@/lib/firebase";
import { collection, query, where, orderBy, getDocs, doc, deleteDoc, updateDoc, increment, limit, startAfter, DocumentData, QueryDocumentSnapshot } from "firebase/firestore";
import { useAuth } from "@/components/auth-provider";
import { Poem } from "@/lib/poems-data";
import { Loader2, Trash2, Heart, Upload, Image as ImageIcon, Copy, Share2, Play, Pause, Mic, Pencil, Dices } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { deleteImageFromStorage, uploadImage } from "@/lib/storage-service";
import { ImageGalleryModal } from "@/components/admin/image-gallery-modal";
import { updatePoemImage, getRandomPoemsForCategory } from "@/lib/actions";
import { PoemModal } from "@/components/poem-modal";

const LOCAL_IMAGES_KEY = 'amor-expressions-local-images-v1';
const FAVORITES_KEY = 'amor-expressions-favorites-v1';
const POEMS_PER_PAGE = 6;

type AudioState = {
  isPlaying: boolean;
  isLoading: boolean;
  poemId: string | null;
};

export function CategoryClient({ initialPoems }: { initialPoems: Poem[] }) {
    const router = useRouter();
    const params = useParams();
    const { toast } = useToast();
    const { isAdmin } = useAuth();

    const [poems, setPoems] = React.useState<Poem[]>(initialPoems);
    const [lastPoemDoc, setLastPoemDoc] = React.useState<QueryDocumentSnapshot<DocumentData> | null>(null);
    const [hasMore, setHasMore] = React.useState(initialPoems.length === POEMS_PER_PAGE);
    const [loadingMore, setLoadingMore] = React.useState(false);
    const [loadingRandom, setLoadingRandom] = React.useState(false); // Nuevo estado para el botón aleatorio
    
    const [selectedPoem, setSelectedPoem] = React.useState<Poem | null>(null);
    const [poemToEdit, setPoemToEdit] = React.useState<Poem | null>(null);
    const [isChoiceModalOpen, setIsChoiceModalOpen] = React.useState(false);
    const [isGalleryModalOpen, setIsGalleryModalOpen] = React.useState(false);

    const [localImages, setLocalImages] = React.useState<Record<string, string>>({});
    const [favorites, setFavorites] = React.useState<Set<string>>(new Set());
    const adminFileInputRefs = React.useRef<Record<string, HTMLInputElement | null>>({});
    const userFileInputRefs = React.useRef<Record<string, HTMLInputElement | null>>({});
    
    const [speechSynthesis, setSpeechSynthesis] = React.useState<SpeechSynthesis | null>(null);
    const [audioState, setAudioState] = React.useState<AudioState>({ isPlaying: false, isLoading: false, poemId: null });
    const utteranceRef = React.useRef<SpeechSynthesisUtterance | null>(null);

    const categoryName = React.useMemo(() => {
        const slug = params.slug as string;
        return slug ? decodeURIComponent(slug) : "";
    }, [params.slug]);

    React.useEffect(() => {
        const storedLocalImages = localStorage.getItem(LOCAL_IMAGES_KEY);
        if (storedLocalImages) setLocalImages(JSON.parse(storedLocalImages));

        const storedFavorites = localStorage.getItem(FAVORITES_KEY);
        if (storedFavorites) setFavorites(new Set(JSON.parse(storedFavorites)));
        
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
          setSpeechSynthesis(window.speechSynthesis);
        }
    }, []);

    const handleLoadMore = async () => {
        setLoadingMore(true);
        try {
            const poemsCollection = collection(db, 'poems');
            let lastVisible = lastPoemDoc;

            if (!lastVisible && poems.length > 0) {
                const initialQuery = query(poemsCollection, where('category', '==', categoryName), orderBy('createdAt', 'desc'), limit(poems.length));
                const initialSnapshot = await getDocs(initialQuery);
                lastVisible = initialSnapshot.docs[initialSnapshot.docs.length - 1];
            }

            if (!lastVisible) {
                setHasMore(false);
                return;
            }

            const q = query(poemsCollection, where('category', '==', categoryName), orderBy('createdAt', 'desc'), startAfter(lastVisible), limit(POEMS_PER_PAGE));
            const querySnapshot = await getDocs(q);
            const newPoems = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })) as Poem[];
            
            setPoems(prevPoems => [...prevPoems, ...newPoems]);
            setLastPoemDoc(querySnapshot.docs[querySnapshot.docs.length - 1] || null);

            if (querySnapshot.docs.length < POEMS_PER_PAGE) {
                setHasMore(false);
            }
        } catch (error) {
            console.error("Error fetching more poems:", error);
            toast({ variant: "destructive", title: "Error", description: "No se pudieron cargar más poemas." });
        } finally {
            setLoadingMore(false);
        }
    };

    const handleLoadRandom = async () => {
        setLoadingRandom(true);
        try {
            const currentPoemIds = poems.map(p => p.id);
            const newRandomPoems = await getRandomPoemsForCategory(categoryName, POEMS_PER_PAGE, currentPoemIds);

            if (newRandomPoems.length === 0) {
                toast({ title: "No hay más poemas", description: "Has visto todos los poemas de esta categoría." });
                setHasMore(false);
            } else {
                setPoems(prevPoems => [...prevPoems, ...newRandomPoems]);
                if (newRandomPoems.length < POEMS_PER_PAGE) {
                    setHasMore(false);
                }
            }
        } catch (error) {
            console.error("Error fetching random poems:", error);
            toast({ variant: "destructive", title: "Error", description: "No se pudieron cargar poemas aleatorios." });
        } finally {
            setLoadingRandom(false);
        }
    };

    const handleDeletePoem = async (poemId: string, poemTitle: string, poemImageUrl?: string) => {
        try {
            if (poemImageUrl) await deleteImageFromStorage(poemImageUrl);
            await deleteDoc(doc(db, "poems", poemId));
            setPoems(prevPoems => prevPoems.filter(p => p.id !== poemId));
            toast({ title: "Poema Eliminado", description: `"${poemTitle}" ha sido eliminado.` });
        } catch (error) {
            console.error("Error deleting poem:", error);
            toast({ variant: "destructive", title: "Error", description: "No se pudo eliminar el poema." });
        }
    };

    const handleAdminImageUpload = async (event: React.ChangeEvent<HTMLInputElement>, poemId: string) => {
        const file = event.target.files?.[0];
        if (!file) return;
        const toastId = toast({ title: "Subiendo imagen..." }).id;
        try {
            const downloadURL = await uploadImage(file, `poem-images/${poemId}/${file.name}`);
            await updateDoc(doc(db, "poems", poemId), { imageUrl: downloadURL });
            setPoems(prevPoems => prevPoems.map(p => p.id === poemId ? { ...p, imageUrl: downloadURL } : p));
            toast({ id: toastId, title: "Éxito", description: "Imagen actualizada." });
        } catch (error) {
            toast({ id: toastId, variant: "destructive", title: "Error", description: "No se pudo subir la imagen." });
        }
    };

    const handleUserImageUpload = (event: React.ChangeEvent<HTMLInputElement>, poemId: string) => {
        const file = event.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            const base64Image = e.target?.result as string;
            const updatedLocalImages = { ...localImages, [poemId]: base64Image };
            setLocalImages(updatedLocalImages);
            localStorage.setItem(LOCAL_IMAGES_KEY, JSON.stringify(updatedLocalImages));
            toast({ title: "Imagen Cambiada", description: "La nueva imagen se guardó en tu dispositivo." });
        };
        reader.readAsDataURL(file);
    };

    const handleToggleFavorite = async (e: React.MouseEvent, poemId: string) => {
        e.stopPropagation();
        
        if (!poemId) {
            console.error("El ID del poema es inválido.");
            return;
        }

        const newFavorites = new Set(favorites);
        const poemRef = doc(db, "poems", poemId);
        let message = "";
        let likesIncrement = 0;

        if (newFavorites.has(poemId)) {
            newFavorites.delete(poemId);
            likesIncrement = -1;
            message = "Eliminado de Favoritos";
        } else {
            newFavorites.add(poemId);
            likesIncrement = 1;
            message = "Añadido a Favoritos";
        }
        
        setFavorites(newFavorites);
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(Array.from(newFavorites)));
        toast({ title: message });

        try {
            await updateDoc(poemRef, { likes: increment(likesIncrement) });
            setPoems(poems.map(p => p.id === poemId ? { ...p, likes: (p.likes || 0) + likesIncrement } : p));
        } catch (error) {
            console.error("Error updating likes:", error);
            toast({ variant: "destructive", title: "Error", description: "No se pudo actualizar el 'Me gusta'." });
        }
    };
    
    const handleOpenImageChoice = (poem: Poem) => {
        setPoemToEdit(poem);
        setIsChoiceModalOpen(true);
    };

    const handleSelectFromGallery = async (imageUrl: string) => {
        if (!poemToEdit) return;
        try {
            await updatePoemImage(poemToEdit.id, imageUrl);
            setPoems(poems.map(p => p.id === poemToEdit.id ? { ...p, imageUrl } : p));
            toast({ title: "Éxito", description: "La imagen del poema ha sido actualizada." });
        } catch (error) {
            toast({ variant: "destructive", title: "Error", description: "No se pudo actualizar la imagen." });
        } finally {
            setIsGalleryModalOpen(false);
            setPoemToEdit(null);
        }
    };

    const handleUploadFromComputer = () => {
        if (!poemToEdit) return;
        adminFileInputRefs.current[poemToEdit.id]?.click();
        setIsChoiceModalOpen(false);
        setPoemToEdit(null);
    };

    const playAudio = React.useCallback((text: string, poemId: string) => {
        if (!speechSynthesis) return;
        speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utteranceRef.current = utterance;
        const voices = speechSynthesis.getVoices();
        const spanishFemaleVoice = voices.find(v => v.lang.startsWith('es') && (v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('mujer')));
        utterance.voice = spanishFemaleVoice || voices.find(v => v.lang.startsWith('es')) || null;
        utterance.onstart = () => setAudioState({ isPlaying: true, isLoading: false, poemId });
        utterance.onend = () => setAudioState({ isPlaying: false, isLoading: false, poemId: null });
        speechSynthesis.speak(utterance);
    }, [speechSynthesis]);

    const handlePlayAudio = (e: React.MouseEvent, text: string, poemId: string) => {
        e.stopPropagation();
        if (!speechSynthesis) return;
        if (audioState.isPlaying && audioState.poemId === poemId) {
            speechSynthesis.pause();
            setAudioState(prev => ({ ...prev, isPlaying: false }));
        } else if (speechSynthesis.paused && audioState.poemId === poemId) {
            speechSynthesis.resume();
            setAudioState(prev => ({ ...prev, isPlaying: true }));
        } else {
            setAudioState({ isLoading: true, isPlaying: false, poemId });
            if (speechSynthesis.getVoices().length === 0) {
                speechSynthesis.onvoiceschanged = () => playAudio(text, poemId);
            } else {
                playAudio(text, poemId);
            }
        }
    };

    const handleCopy = (e: React.MouseEvent, text: string) => { e.stopPropagation(); navigator.clipboard.writeText(text); toast({ title: "Copiado" }); };
    const handleShare = async (e: React.MouseEvent, title: string, text: string) => { e.stopPropagation(); if (navigator.share) { try { await navigator.share({ title, text }); } catch (error) { console.error(error); } } else { handleCopy(e, `${title}\n\n${text}`); } };
    const handleRecite = (e: React.MouseEvent, poemId: string) => { 
        e.stopPropagation(); 
        router.push(`/recite/${poemId}`);
    };

    const handleEditPoem = (e: React.MouseEvent, poemId: string) => {
        e.stopPropagation();
        router.push(`/admin/edit-poem/${poemId}`);
    };

    return (
        <MainLayout>
            {selectedPoem && (
                <PoemModal
                    poem={selectedPoem}
                    isFavorite={favorites.has(selectedPoem.id)}
                    onClose={() => setSelectedPoem(null)}
                    onToggleFavorite={handleToggleFavorite}
                    onPlayAudio={handlePlayAudio}
                    onCopy={handleCopy}
                    onShare={handleShare}
                    onRecite={handleRecite}
                    audioState={audioState}
                />
            )}

            <div className="container mx-auto py-8 px-4">
                <h1 className="text-4xl font-headline text-primary mb-8 text-center">{categoryName}</h1>
                {poems.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {poems.map(poem => (
                                <Card key={poem.id} className="flex flex-col overflow-hidden group">
                                    <CardHeader className="p-0 relative">
                                        <div className="aspect-video w-full relative">
                                            <Image
                                                src={poem.imageUrl || poem.image || 'https://placehold.co/600x400/f87171/ffffff?text=Poema'}
                                                alt={poem.title}
                                                fill
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                className="object-cover"
                                            />
                                            <div className="absolute inset-0 bg-black/20" />
                                        </div>
                                        {isAdmin && (
                                            <div className="absolute top-2 right-2 flex gap-2">
                                                <Button size="icon" variant="secondary" onClick={(e) => handleEditPoem(e, poem.id)} title="Editar Poema">
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <input type="file" className="hidden" ref={el => { if(el) adminFileInputRefs.current[poem.id] = el; }} onChange={(e) => handleAdminImageUpload(e, poem.id)} accept="image/*" />
                                                <Button size="icon" variant="secondary" onClick={(e) => { e.stopPropagation(); handleOpenImageChoice(poem); }} title="Cambiar imagen (Admin)">
                                                    <ImageIcon className="h-4 w-4" />
                                                </Button>
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild><Button size="icon" variant="destructive" title="Eliminar Poema" onClick={(e) => e.stopPropagation()}><Trash2 className="h-4 w-4" /></Button></AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader><AlertDialogTitle>¿Estás seguro?</AlertDialogTitle><AlertDialogDescription>Esta acción eliminará el poema permanentemente.</AlertDialogDescription></AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                            <AlertDialogAction onClick={() => handleDeletePoem(poem.id, poem.title, poem.imageUrl)} className="bg-destructive hover:bg-destructive/90">Eliminar</AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </div>
                                        )}
                                    </CardHeader>
                                    <CardContent className="p-4 flex-1">
                                        <CardTitle className="font-headline text-primary mb-2">{poem.title}</CardTitle>
                                        <p className="text-foreground/80 whitespace-pre-line font-body italic text-base line-clamp-4 cursor-pointer" onClick={() => setSelectedPoem(poem)}>
                                            {poem.poem}
                                        </p>
                                    </CardContent>
                                    <CardFooter className="p-2 flex-wrap justify-between items-center border-t">
                                        <div className="flex items-center gap-1">
                                            <Button variant="ghost" size="icon" onClick={(e) => handleToggleFavorite(e, poem.id)} title="Añadir a favoritos">
                                                <Heart className={`w-5 h-5 transition-colors ${favorites.has(poem.id) ? 'text-red-500 fill-current' : 'text-muted-foreground'}`} />
                                            </Button>
                                            <span className="text-sm font-semibold text-muted-foreground">{poem.likes || 0}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Button variant="ghost" size="icon" onClick={(e) => handlePlayAudio(e, `${poem.title}. ${poem.poem}`, poem.id)} title="Reproducir">
                                                {audioState.isLoading && audioState.poemId === poem.id ? <Loader2 className="w-4 w-4 animate-spin" /> : (audioState.isPlaying && audioState.poemId === poem.id ? <Pause className="w-4 w-4" /> : <Play className="w-4 w-4" />)}
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={(e) => handleRecite(e, poem.id)} title="Recitar y Grabar"><Mic className="w-4 w-4" /></Button>
                                            <Button variant="ghost" size="icon" onClick={(e) => handleCopy(e, `${poem.title}\n\n${poem.poem}`)} title="Copiar"><Copy className="w-4 w-4" /></Button>
                                            <Button variant="ghost" size="icon" onClick={(e) => handleShare(e, poem.title, poem.poem)} title="Compartir"><Share2 className="w-4 w-4" /></Button>
                                            <input type="file" className="hidden" ref={el => { if(el) userFileInputRefs.current[poem.id] = el; }} onChange={(e) => handleUserImageUpload(e, poem.id)} accept="image/*" />
                                            <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); userFileInputRefs.current[poem.id]?.click(); }} title="Cambiar Imagen (Local)"><Upload className="w-4 w-4" /></Button>
                                        </div>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                        
                        {hasMore && (
                            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-8">
                                <Button onClick={handleLoadMore} disabled={loadingMore || loadingRandom} className="w-full sm:w-auto">
                                    {loadingMore ? (
                                        <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Cargando...</>
                                    ) : (
                                        "Mostrar Más"
                                    )}
                                </Button>
                                <Button onClick={handleLoadRandom} disabled={loadingRandom || loadingMore} variant="outline" className="w-full sm:w-auto">
                                    {loadingRandom ? (
                                        <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Cargando...</>
                                    ) : (
                                        <><Dices className="mr-2 h-4 w-4" />Mostrar Aleatorio</>
                                    )}
                                </Button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center py-20 border-2 border-dashed rounded-lg">
                        <p className="text-muted-foreground">No se encontraron poemas en esta categoría.</p>
                    </div>
                )}
            </div>

            {poemToEdit && (
                <>
                    <ImageGalleryModal
                        isOpen={isGalleryModalOpen}
                        onClose={() => { setIsGalleryModalOpen(false); setPoemToEdit(null); }}
                        onImageSelect={handleSelectFromGallery}
                    />
                    <AlertDialog open={isChoiceModalOpen} onOpenChange={setIsChoiceModalOpen}>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Cambiar Imagen del Poema</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Elige una imagen de la galería pública o sube una nueva desde tu ordenador.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter className="sm:justify-center gap-2 pt-4">
                                <Button onClick={() => { setIsChoiceModalOpen(false); setIsGalleryModalOpen(true); }}>
                                    Elegir de la Galería
                                </Button>
                                <Button variant="outline" onClick={handleUploadFromComputer}>
                                    Subir desde Ordenador
                                </Button>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </>
            )}
        </MainLayout>
    );
}