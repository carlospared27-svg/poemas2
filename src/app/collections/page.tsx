"use client";

import * as React from "react";
import { Plus, FolderHeart, Trash2, Share2, Copy, Send, Loader2, Play, Pause, Mic } from "lucide-react";
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
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MainLayout } from "@/components/layout/main-layout";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Poem } from "@/lib/poems-data";
import { useRouter } from "next/navigation";
// --- CORRECCIÓN: Importar la conexión de cliente a Firebase ---
import { db } from "@/lib/firebase";
import { collection, getDocs, query } from "firebase/firestore";

const FAVORITES_KEY = 'amor-expressions-favorites-v1';
const SUBMISSIONS_KEY = 'amor-expressions-submissions';

type LocalPoem = {
  id: string;
  title: string;
  author: string;
  poem: string;
  category: string;
};

type Collection = {
  name: string;
  poems: (Poem | LocalPoem)[];
};

type AudioState = {
  isPlaying: boolean;
  isLoading: boolean;
  poemId: string | null;
};

export default function CollectionsPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [collections, setCollections] = React.useState<Collection[]>([]);
  const [selectedCollection, setSelectedCollection] = React.useState<Collection | null>(null);
  const [loading, setLoading] = React.useState(true);

  const [speechSynthesis, setSpeechSynthesis] = React.useState<SpeechSynthesis | null>(null);
  const [audioState, setAudioState] = React.useState<AudioState>({ isPlaying: false, isLoading: false, poemId: null });
  const utteranceRef = React.useRef<SpeechSynthesisUtterance | null>(null);

  React.useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setSpeechSynthesis(window.speechSynthesis);
    }

    const loadCollections = async () => {
      setLoading(true);
      try {
        const storedFavorites = localStorage.getItem(FAVORITES_KEY);
        const favoriteIds: string[] = storedFavorites ? JSON.parse(storedFavorites) : [];
        
        // --- CORRECCIÓN DEL ERROR: Usar el SDK de cliente para obtener todos los poemas ---
        const poemsCollectionRef = collection(db, 'poems');
        const poemsQuery = query(poemsCollectionRef);
        const poemsSnapshot = await getDocs(poemsQuery);
        const allPoemsList = poemsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Poem[];
        
        const favoritePoems = favoriteIds.map(id => allPoemsList.find(p => p.id === id)).filter(Boolean) as Poem[];

        const storedSubmissions = localStorage.getItem(SUBMISSIONS_KEY);
        const submittedPoems: LocalPoem[] = storedSubmissions ? JSON.parse(storedSubmissions) : [];
        
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
  }, [toast]);
  
  const handleSelectCollection = (collectionName: string) => {
      const collection = collections.find(c => c.name === collectionName);
      setSelectedCollection(collection || null);
  }

  const handleOpenPoem = (poem: Poem | LocalPoem) => {
    const queryParams = new URLSearchParams();
    if ('category' in poem) {
      queryParams.set('category', poem.category);
    }
    router.push(`/poem/${poem.id}?${queryParams.toString()}`);
  };

  const handleCreateCollection = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast({ title: "Funcionalidad Próximamente", description: "Pronto podrás crear tus propias colecciones." });
  };

  const handleCopy = (e: React.MouseEvent, text: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    toast({ title: "Copiado", description: "El poema ha sido copiado." });
  };

  const handleShare = async (e: React.MouseEvent, title: string, text: string) => {
    e.stopPropagation();
    if (navigator.share) {
      try { await navigator.share({ title, text }); } 
      catch (error) { console.error("Share error:", error) }
    } else {
      handleCopy(e, `${title}\n\n${text}`);
    }
  };

  const handleDeleteFavorite = (e: React.MouseEvent, poemId: string) => {
    e.stopPropagation();
    const storedFavorites = localStorage.getItem(FAVORITES_KEY);
    let favoriteIds: string[] = storedFavorites ? JSON.parse(storedFavorites) : [];
    
    favoriteIds = favoriteIds.filter(id => id !== poemId);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favoriteIds));

    const updatedPoems = selectedCollection?.poems.filter(p => p.id !== poemId) || [];
    const updatedCollection = { ...selectedCollection!, poems: updatedPoems };
    
    setCollections(collections.map(c => c.name === "Favoritos" ? updatedCollection : c));
    setSelectedCollection(updatedCollection);

    toast({ title: "Poema Eliminado", description: "El poema ha sido eliminado de tus favoritos." });
  };

  const playAudio = React.useCallback((text: string, poemId: string) => {
    if (!speechSynthesis) return;
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utteranceRef.current = utterance;
    const voices = speechSynthesis.getVoices();
    const spanishFemaleVoice = voices.find(voice => voice.lang.startsWith('es') && (voice.name.toLowerCase().includes('female') || voice.name.toLowerCase().includes('mujer')));
    utterance.voice = spanishFemaleVoice || voices.find(voice => voice.lang.startsWith('es')) || null;
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
        return;
    }
    
    if (speechSynthesis.paused && audioState.poemId === poemId) {
        speechSynthesis.resume();
        setAudioState(prev => ({ ...prev, isPlaying: true }));
        return;
    }

    setAudioState({ isLoading: true, isPlaying: false, poemId });
    if (speechSynthesis.getVoices().length === 0) {
        speechSynthesis.onvoiceschanged = () => playAudio(text, poemId);
    } else {
        playAudio(text, poemId);
    }
  };
  
  const handleRecite = (e: React.MouseEvent, poemId: string) => {
    e.stopPropagation();
    router.push(`/recite/${poemId}`);
  }

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
                                    onClick={() => handleOpenPoem(poem)}
                                >
                                    <CardHeader>
                                        <CardTitle className="font-headline font-bold text-primary">{poem.title}</CardTitle>
                                        {'author' in poem && poem.author && <p className="text-sm text-muted-foreground">de {poem.author}</p>}
                                    </CardHeader>
                                    <CardContent className="flex-1">
                                        <p className="text-foreground/80 whitespace-pre-line font-body italic text-base line-clamp-4">{poem.poem}</p>
                                    </CardContent>
                                    <CardFooter className="gap-2 bg-accent/20 p-2 mt-4 justify-end flex-wrap">
                                        {/* --- BOTONES DE ACCIÓN RESTAURADOS --- */}
                                        {selectedCollection.name === 'Favoritos' && (
                                            <>
                                                <Button variant="outline" size="icon" onClick={(e) => handlePlayAudio(e, `${poem.title}. ${poem.poem}`, poem.id)} title="Reproducir">
                                                    {audioState.isLoading && audioState.poemId === poem.id ? <Loader2 className="w-4 h-4 animate-spin" /> : (audioState.isPlaying && audioState.poemId === poem.id ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />)}
                                                </Button>
                                                <Button variant="outline" size="icon" onClick={(e) => handleRecite(e, poem.id)} title="Recitar y Grabar">
                                                    <Mic className="w-4 h-4" />
                                                </Button>
                                            </>
                                        )}
                                        <Button variant="outline" size="icon" onClick={(e) => handleCopy(e, `${poem.title}\n\n${poem.poem}`)} title="Copiar">
                                            <Copy className="w-4 h-4" />
                                        </Button>
                                        <Button variant="outline" size="icon" onClick={(e) => handleShare(e, poem.title, poem.poem)} title="Compartir">
                                            <Share2 className="w-4 h-4" />
                                        </Button>
                                        {selectedCollection.name === 'Favoritos' && (
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button variant="destructive" size="icon" title="Eliminar de Favoritos" onClick={(e) => e.stopPropagation()}>
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>¿Quitar de Favoritos?</AlertDialogTitle>
                                                        <AlertDialogDescription>El poema se eliminará de tu lista de favoritos en este dispositivo.</AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                        <AlertDialogAction onClick={(e) => handleDeleteFavorite(e, poem.id)}>Quitar</AlertDialogAction>
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
                            <p className="text-sm text-muted-foreground/80 mt-2">
                                {selectedCollection.name === 'Favoritos' 
                                    ? "Usa el icono del corazón ❤️ en un poema para guardarlo aquí." 
                                    : "Los poemas que envíes aparecerán aquí."}
                            </p>
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
