
// src/app/collections/page.tsx

"use client";

import * as React from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { AudioLines, Trash2, Home, FolderHeart, Send, Loader2, Play, Pause, Mic, Copy, Share2, Image as ImageIcon } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Poem } from "@/lib/poems-data";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where, documentId } from "firebase/firestore";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { getPublicImages } from "@/lib/actions";

type Collection = {
  name: string;
  poems: Poem[];
};

type AudioState = {
  isPlaying: boolean;
  isLoading: boolean;
  poemId: string | null;
};

const FAVORITES_KEY = 'amor-expressions-favorites-v1';
const SUBMISSIONS_KEY = 'amor-expressions-submissions';
const LOCAL_IMAGE_PREFIX = 'data:image';

export default function CollectionsPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [collections, setCollections] = React.useState<Collection[]>([]);
    const [selectedCollection, setSelectedCollection] = React.useState<Collection | null>(null);
    const [loading, setLoading] = React.useState(true);
    const [speechSynthesis, setSpeechSynthesis] = React.useState<SpeechSynthesis | null>(null);
    const [audioState, setAudioState] = React.useState<AudioState>({ isPlaying: false, isLoading: false, poemId: null });
    const [publicImages, setPublicImages] = React.useState<string[]>([]);
    
    // --- CORRECCIÓN: Estado para almacenar el origen de la URL de forma segura ---
    const [pageOrigin, setPageOrigin] = React.useState("");

    // --- CORRECCIÓN: Toda la lógica que depende del navegador se queda dentro de useEffect ---
    React.useEffect(() => {
        // Asignamos las APIs del navegador a los estados solo cuando el componente se monta en el cliente
        if (typeof window !== 'undefined') {
          if ('speechSynthesis' in window) {
            setSpeechSynthesis(window.speechSynthesis);
          }
          setPageOrigin(window.location.origin);

          const loadCollections = async () => {
            setLoading(true);
            try {
              const fetchedPublicImages = await getPublicImages();
              setPublicImages(fetchedPublicImages);
  
              // localStorage solo se accede aquí, dentro de useEffect
              const storedFavorites = localStorage.getItem(FAVORITES_KEY);
              const favoriteIds: string[] = storedFavorites ? JSON.parse(storedFavorites) : [];
              let favoritePoems: Poem[] = [];
  
              if (favoriteIds.length > 0) {
                  const poemsCollectionRef = collection(db, 'poems');
                  const chunks = [];
                  for (let i = 0; i < favoriteIds.length; i += 30) {
                      chunks.push(favoriteIds.slice(i, i + 30));
                  }
                  const promises = chunks.map(chunk => {
                      const poemsQuery = query(poemsCollectionRef, where(documentId(), 'in', chunk));
                      return getDocs(poemsQuery);
                  });
                  const snapshots = await Promise.all(promises);
                  snapshots.forEach(snapshot => {
                      favoritePoems.push(...snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Poem[]);
                  });
              }
  
              const storedSubmissions = localStorage.getItem(SUBMISSIONS_KEY);
              const submittedPoems: Poem[] = storedSubmissions ? JSON.parse(storedSubmissions) : [];
              
              const allCollections: Collection[] = [
                { name: "Favoritos", poems: favoritePoems },
                { name: "Mis Envíos", poems: submittedPoems },
              ];
  
              setCollections(allCollections);
              setSelectedCollection(allCollections[0] || null);
            } catch (error) {
              console.error("Error loading collections:", error);
              toast({ variant: "destructive", title: "Error", description: "No se pudieron cargar las colecciones." });
            } finally {
              setLoading(false);
            }
          }
          loadCollections();
        }
    }, [toast]);
    
    const getPoemDisplayImage = React.useCallback((poem: Poem): string => {
        if (typeof poem.image === 'string' && poem.image.startsWith(LOCAL_IMAGE_PREFIX)) {
            return poem.image;
        }
        if (poem.imageUrl) {
            return poem.imageUrl;
        }
        if (typeof poem.image === 'string') {
            return poem.image;
        }
        if (publicImages.length > 0) {
            const randomIndex = Math.floor(Math.random() * publicImages.length);
            return publicImages[randomIndex];
        }
        return `https://placehold.co/600x400/f87171/ffffff?text=Poema`;
    }, [publicImages]);

    const handleSelectCollection = (collectionName: string) => {
        const collection = collections.find(c => c.name === collectionName);
        setSelectedCollection(collection || null);
    }

    const handleOpenPoem = (poemId: string) => {
        router.push(`/poem/${poemId}`);
    };

    const handleDeleteFavorite = (e: React.MouseEvent, poemId: string) => {
        e.stopPropagation();
        const storedFavorites = localStorage.getItem(FAVORITES_KEY);
        const favoriteIds: string[] = storedFavorites ? JSON.parse(storedFavorites) : [];
        const newFavoriteIds = favoriteIds.filter(id => id !== poemId);
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavoriteIds));

        const newCollections = collections.map(collection => {
            if (collection.name === "Favoritos") {
                return { ...collection, poems: collection.poems.filter(p => p.id !== poemId) };
            }
            return collection;
        });

        setCollections(newCollections);
        setSelectedCollection(newCollections.find(c => c.name === "Favoritos") || null);
        toast({ title: "Poema Eliminado", description: "El poema ha sido eliminado de tus favoritos." });
    };

    const handleDeleteSubmission = (e: React.MouseEvent, poemId: string) => {
        e.stopPropagation();
        const storedSubmissions = localStorage.getItem(SUBMISSIONS_KEY);
        const submittedPoems: Poem[] = storedSubmissions ? JSON.parse(storedSubmissions) : [];
        const newSubmittedPoems = submittedPoems.filter(p => p.id !== poemId);
        localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(newSubmittedPoems));

        const newCollections = collections.map(collection => {
            if (collection.name === "Mis Envíos") {
                return { ...collection, poems: newSubmittedPoems };
            }
            return collection;
        });

        setCollections(newCollections);
        setSelectedCollection(newCollections.find(c => c.name === "Mis Envíos") || null);
        toast({ title: "Envío Eliminado", description: "El poema ha sido eliminado de tus envíos." });
    };

    const handleRecite = (e: React.MouseEvent, poemId: string, poemText: string) => {
        e.stopPropagation();
        if (!speechSynthesis) {
          toast({ variant: "destructive", title: "Error", description: "La síntesis de voz no está disponible en tu navegador." });
          return;
        }
      
        if (audioState.isPlaying && audioState.poemId === poemId) {
          speechSynthesis.cancel();
          setAudioState({ isPlaying: false, isLoading: false, poemId: null });
        } else {
          setAudioState({ isPlaying: false, isLoading: true, poemId: poemId });
          speechSynthesis.cancel();
      
          const utterance = new SpeechSynthesisUtterance(poemText);
          utterance.lang = 'es-ES';
          
          utterance.onend = () => setAudioState({ isPlaying: false, isLoading: false, poemId: null });
          utterance.onerror = (event) => {
            console.error("Error en la síntesis de voz:", event);
            toast({ variant: "destructive", title: "Error de voz", description: "No se pudo reproducir el poema." });
            setAudioState({ isPlaying: false, isLoading: false, poemId: null });
          };
      
          speechSynthesis.speak(utterance);
          setAudioState({ isPlaying: true, isLoading: false, poemId: poemId });
        }
    };

    const handleShare = (e: React.MouseEvent, poem: Poem) => {
        e.stopPropagation();
        if (navigator.share) {
            navigator.share({
                title: poem.title,
                text: `${poem.title}\n\n${poem.poem}\n\nPor: ${poem.author || 'Anónimo'}`,
                // --- CORRECCIÓN: Usamos el estado 'pageOrigin' ---
                url: `${pageOrigin}/poem/${poem.id}`,
            })
            .then(() => toast({ title: "Compartido", description: "El poema ha sido compartido." }))
            .catch((error) => console.error('Error al compartir:', error));
        } else {
            // --- CORRECCIÓN: Usamos el estado 'pageOrigin' ---
            navigator.clipboard.writeText(`${poem.title}\n\n${poem.poem}\n\nPor: ${poem.author || 'Anónimo'}\n${pageOrigin}/poem/${poem.id}`);
            toast({ title: "Enlace Copiado", description: "El enlace y contenido del poema han sido copiados al portapapeles." });
        }
    };

    const handleChangeImageLocally = (e: React.ChangeEvent<HTMLInputElement>, poemId: string, collectionName: string) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onloadend = () => {
          const base64String = reader.result as string;

          setCollections(prevCollections => {
              return prevCollections.map(col => {
                  if (col.name === collectionName) {
                      const updatedPoems = col.poems.map(p => 
                          p.id === poemId ? { ...p, image: base64String, imageUrl: undefined } : p
                      );
                      if (collectionName === "Mis Envíos") {
                        localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(updatedPoems));
                      }
                      return { ...col, poems: updatedPoems };
                  }
                  return col;
              });
          });
          toast({ title: "Imagen Cambiada", description: "La imagen del poema ha sido actualizada localmente." });
      };
      reader.readAsDataURL(file);
    };

    return (
      <MainLayout>
          <div className="flex flex-col md:flex-row h-[calc(100vh-57px)]">
            <aside className="w-full md:w-64 lg:w-72 xl:w-80 border-b md:border-r md:border-b-0 p-4">
              <h2 className="text-2xl font-headline text-primary mb-4">Colecciones</h2>
              <nav className="flex flex-row md:flex-col gap-2">
                {collections.map((collection) => (
                  <Button
                    key={collection.name}
                    variant={selectedCollection?.name === collection.name ? "secondary" : "ghost"}
                    className="justify-start"
                    onClick={() => handleSelectCollection(collection.name)}
                  >
                    {collection.name === 'Favoritos' ? <FolderHeart className="mr-2 h-4 w-4" /> : <Send className="mr-2 h-4 w-4" />}
                    <span className="flex-1 text-left">{collection.name}</span>
                    <Badge variant="outline" className="text-xs">{collection.poems.length}</Badge>
                  </Button>
                ))}
              </nav>
            </aside>

            <main className="flex-1 p-4 md:p-8 overflow-auto">
                {loading ? (
                    <div className="flex items-center justify-center h-full"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
                ) : selectedCollection ? (
                    <div>
                         <h1 className="text-3xl font-headline text-primary mb-6">{selectedCollection.name}</h1>
                         {selectedCollection.poems.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {selectedCollection.poems.map((poem) => (
                                    <Card
                                        key={poem.id}
                                        className="flex flex-col bg-accent/30 border-accent cursor-pointer hover:shadow-lg hover:border-primary transition-all"
                                        onClick={() => handleOpenPoem(poem.id)}
                                    >
                                        <div className="relative aspect-video w-full overflow-hidden">
                                            {getPoemDisplayImage(poem) ? (
                                                <Image
                                                    src={getPoemDisplayImage(poem)}
                                                    alt={poem.title}
                                                    fill
                                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <Skeleton className="h-full w-full" />
                                            )}
                                        </div>
                                        <CardHeader>
                                            <CardTitle className="font-headline font-bold text-primary">{poem.title}</CardTitle>
                                            {poem.author && (
                                                <CardDescription>de {poem.author}</CardDescription>
                                            )}
                                        </CardHeader>
                                        <CardContent className="flex-1">
                                            <p className="text-foreground/80 whitespace-pre-line font-body italic text-base line-clamp-4">{poem.poem}</p>
                                        </CardContent>
                                        <CardFooter className="gap-2 bg-accent/20 p-2 mt-auto justify-end flex-wrap">
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                onClick={(e) => handleRecite(e, poem.id, poem.poem)}
                                                title={audioState.isPlaying && audioState.poemId === poem.id ? "Detener" : "Reproducir"}
                                                disabled={audioState.isLoading && audioState.poemId !== poem.id}
                                            >
                                                {audioState.isLoading && audioState.poemId === poem.id ? (
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                ) : audioState.isPlaying && audioState.poemId === poem.id ? (
                                                    <Pause className="h-4 w-4" />
                                                ) : (
                                                    <Play className="h-4 w-4" />
                                                )}
                                            </Button>

                                            <Button variant="outline" size="icon" onClick={(e) => handleShare(e, poem)} title="Compartir">
                                                <Share2 className="w-4 w-4" />
                                            </Button>

                                            <Button variant="outline" size="icon" onClick={(e) => { e.stopPropagation(); router.push(`/recite/${poem.id}`); }} title="Recitar y Grabar">
                                                <Mic className="w-4 w-4" />
                                            </Button>
                                            
                                            <Button variant="outline" size="icon" onClick={(e) => { e.stopPropagation(); navigator.clipboard.writeText(`${poem.title}\n\n${poem.poem}`); toast({title: 'Copiado'}); }} title="Copiar">
                                                <Copy className="w-4 w-4" />
                                            </Button>

                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button variant="outline" size="icon" onClick={(e) => e.stopPropagation()} title="Cambiar Imagen">
                                                        <ImageIcon className="w-4 h-4" />
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-2">
                                                    <Input
                                                        id={`image-upload-${poem.id}`}
                                                        type="file"
                                                        accept="image/*"
                                                        className="w-full text-sm"
                                                        onChange={(e) => handleChangeImageLocally(e, poem.id, selectedCollection.name)}
                                                        onClick={(e) => e.stopPropagation()}
                                                    />
                                                </PopoverContent>
                                            </Popover>

                                            {(selectedCollection.name === 'Favoritos' || selectedCollection.name === 'Mis Envíos') && (
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button variant="destructive" size="icon" title={`Eliminar de ${selectedCollection.name}`} onClick={(e) => e.stopPropagation()}>
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                {selectedCollection.name === 'Favoritos' 
                                                                    ? "El poema se eliminará de tu lista de favoritos en este dispositivo."
                                                                    : "El poema se eliminará de tu lista de envíos en este dispositivo."
                                                                }
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                            <AlertDialogAction onClick={(e) => {
                                                                if (selectedCollection.name === 'Favoritos') {
                                                                    handleDeleteFavorite(e, poem.id);
                                                                } else {
                                                                    handleDeleteSubmission(e, poem.id);
                                                                }
                                                            }}>
                                                                Eliminar
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            )}
                                        </CardFooter>
                                    </Card>
                                ))}
                            </div>
                         ) : (
                            <div className="text-center py-10 border-2 border-dashed rounded-lg">
                                <p className="text-muted-foreground">Aún no has añadido poemas a esta colección.</p>
                            </div>
                         )}
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-xl text-muted-foreground">Selecciona una colección</p>
                    </div>
                )}
            </main>
          </div>
        </MainLayout>
    );
}
