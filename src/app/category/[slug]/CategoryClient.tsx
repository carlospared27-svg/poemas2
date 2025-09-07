
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
import { Poem } from "@/lib/poems-service";
import { Loader2, Trash2, Image as ImageIcon, Dices } from "lucide-react";
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
import { deleteImageFromStorage } from "@/lib/storage-service";
import { ImageGalleryModal } from "@/components/admin/image-gallery-modal";
import { updatePoemImage, getRandomPoemsForCategory } from "@/lib/actions";
import { PoemModal } from "@/components/poem-modal";
import { PoemActions, AudioState } from "@/components/poem-actions";

const FAVORITES_KEY = 'amor-expressions-favorites-v1';
const POEMS_PER_PAGE = 6;

export function CategoryClient({ initialPoems, initialLastDoc }: { initialPoems: Poem[], initialLastDoc: any | null }) {
    const router = useRouter();
    const params = useParams();
    const { toast } = useToast();
    const { isAdmin } = useAuth();

    const [poems, setPoems] = React.useState<Poem[]>(initialPoems);
    const [lastPoemDoc, setLastPoemDoc] = React.useState<any | null>(initialLastDoc);
    const [hasMore, setHasMore] = React.useState(initialPoems.length === POEMS_PER_PAGE);
    const [loadingMore, setLoadingMore] = React.useState(false);
    const [loadingRandom, setLoadingRandom] = React.useState(false);
    
    const [selectedPoem, setSelectedPoem] = React.useState<Poem | null>(null);
    const [poemToEdit, setPoemToEdit] = React.useState<Poem | null>(null);
    const [isChoiceModalOpen, setIsChoiceModalOpen] = React.useState(false);
    const [isGalleryModalOpen, setIsGalleryModalOpen] = React.useState(false);

    const [favorites, setFavorites] = React.useState<Set<string>>(new Set());
    const adminFileInputRefs = React.useRef<Record<string, HTMLInputElement | null>>({});
    
    const [audioState, setAudioState] = React.useState<AudioState>({ isPlaying: false, isLoading: false, poemId: null });

    const categoryName = React.useMemo(() => {
        const slug = params.slug as string;
        return slug ? decodeURIComponent(slug) : "";
    }, [params.slug]);

    React.useEffect(() => {
        const storedFavorites = localStorage.getItem(FAVORITES_KEY);
        if (storedFavorites) setFavorites(new Set(JSON.parse(storedFavorites)));
    }, []);

    const handleLoadMore = async () => {
        if (!lastPoemDoc) {
            setHasMore(false);
            return;
        }

        setLoadingMore(true);
        try {
            const poemsCollection = collection(db, 'poems');
            const q = query(
                poemsCollection, 
                where('category', '==', categoryName), 
                orderBy('createdAt', 'desc'), 
                startAfter(lastPoemDoc), 
                limit(POEMS_PER_PAGE)
            );

            const querySnapshot = await getDocs(q);
            
            if (querySnapshot.empty) {
                setHasMore(false);
                return;
            }

            const newPoems = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })) as Poem[];
            const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];

            setPoems(prevPoems => [...prevPoems, ...newPoems]);
            setLastPoemDoc(lastVisible);
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
                // No actualizamos lastPoemDoc aquí, ya que la paginación secuencial se rompe
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

    const handleAdminImageUpload = async (event: React.ChangeEvent<HTMLInputElement>, poemId: string, currentImageUrl?: string) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const toastId = toast({ title: "Subiendo imagen..." }).id;
        try {
             if (currentImageUrl) {
                await deleteImageFromStorage(currentImageUrl);
            }
            const downloadURL = await updatePoemImage(poemId, file);
            
            setPoems(prevPoems => prevPoems.map(p => p.id === poemId ? { ...p, imageUrl: downloadURL, image: undefined } : p));
            toast({ id: toastId, title: "¡Éxito!", description: "Imagen actualizada." });

        } catch (error) {
            console.error("Error al subir y actualizar la imagen:", error);
            toast({ id: toastId, variant: "destructive", title: "Error", description: "No se pudo subir la imagen." });
        }
    };

    const handleToggleFavorite = (poemId: string) => {
        const newFavorites = new Set(favorites);
        if (newFavorites.has(poemId)) {
            newFavorites.delete(poemId);
        } else {
            newFavorites.add(poemId);
        }
        setFavorites(newFavorites);
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(Array.from(newFavorites)));
        setPoems(poems.map(p => p.id === poemId ? { ...p, likes: (p.likes || 0) + (newFavorites.has(poemId) ? 1 : -1) } : p));
    };
    
    const handleOpenImageChoice = (e: React.MouseEvent, poem: Poem) => {
        e.stopPropagation();
        setPoemToEdit(poem);
        setIsChoiceModalOpen(true);
    };

    const handleSelectFromGallery = async (imageUrl: string) => {
        if (!poemToEdit) return;
        const toastId = toast({ title: "Actualizando imagen..." }).id;
        try {
            if(poemToEdit.imageUrl) {
                await deleteImageFromStorage(poemToEdit.imageUrl);
            }
            await updatePoemImage(poemToEdit.id, imageUrl); 
            setPoems(poems.map(p => p.id === poemToEdit.id ? { ...p, imageUrl: imageUrl, image: undefined } : p));
            toast({ id: toastId, title: "¡Éxito!", description: "La imagen del poema ha sido actualizada." });
        } catch (error) {
             toast({ id: toastId, variant: "destructive", title: "Error", description: "No se pudo actualizar la imagen." });
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

    return (
        <MainLayout>
            {selectedPoem && (
                <PoemModal
                    poem={selectedPoem}
                    isFavorite={favorites.has(selectedPoem.id)}
                    onClose={() => setSelectedPoem(null)}
                    onToggleFavorite={(poemId) => handleToggleFavorite(poemId)}
                    audioState={audioState}
                    setAudioState={setAudioState}
                />
            )}

            <div className="container mx-auto py-8 px-4">
                <h1 className="text-4xl font-headline text-primary mb-8 text-center">{categoryName}</h1>
                {poems.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {poems.map(poem => (
                                <Card key={poem.id} className="flex flex-col overflow-hidden group">
                                    <CardHeader className="p-0 relative" onClick={() => setSelectedPoem(poem)}>
                                        <div className="aspect-video w-full relative cursor-pointer">
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
                                                <input type="file" className="hidden" ref={el => { if(el) adminFileInputRefs.current[poem.id] = el; }} onChange={(e) => handleAdminImageUpload(e, poem.id, poem.imageUrl)} accept="image/*" />
                                                <Button size="icon" variant="secondary" onClick={(e) => handleOpenImageChoice(e, poem)} title="Cambiar imagen (Admin)">
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
                                        <CardTitle className="font-headline text-primary mb-2 cursor-pointer" onClick={() => setSelectedPoem(poem)}>{poem.title}</CardTitle>
                                        <p className="text-foreground/80 whitespace-pre-line font-body italic text-base line-clamp-4 cursor-pointer" onClick={() => setSelectedPoem(poem)}>
                                            {poem.poem}
                                        </p>
                                    </CardContent>
                                    <CardFooter className="p-2 flex-wrap justify-between items-center border-t">
                                        <PoemActions 
                                            poem={poem}
                                            isFavorite={favorites.has(poem.id)}
                                            onToggleFavorite={handleToggleFavorite}
                                            audioState={audioState}
                                            setAudioState={setAudioState}
                                            showEdit={isAdmin}
                                        />
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
