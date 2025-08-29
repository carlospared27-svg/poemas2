// Ruta: src/app/search/search-results-display.tsx
"use client";

import * as React from "react";
import { useState } from "react"; 
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Poem } from "@/lib/poems-data";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Copy, Share2, Heart, Play, Loader, Pause, Info, ImageIcon, Mic, Maximize, Trash2 } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import Link from "next/link";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/components/auth-provider";
import { deletePoem as deletePoemFromServer } from "@/lib/poems-service";
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
import { Skeleton } from "@/components/ui/skeleton";
import { useInstantSearch } from "react-instantsearch";

type AudioState = {
  isPlaying: boolean;
  isLoading: boolean;
  poemIndex: number | null;
};

const PEXELS_CACHE_KEY = 'amor-expressions-pexels-cache-v4';

export function SearchResultsDisplay({ poems, searchQuery }: { poems: (Poem & { category: string })[], searchQuery: string }) {
  const router = useRouter();
  const { toast } = useToast();
  const { isAdmin } = useAuth();
  const { refresh } = useInstantSearch();

  const [poemToDelete, setPoemToDelete] = useState<(Poem & { category: string }) | null>(null);
  const [speechSynthesis, setSpeechSynthesis] = React.useState<SpeechSynthesis | null>(null);
  const [audioState, setAudioState] = React.useState<AudioState>({ isPlaying: false, isLoading: false, poemIndex: null });
  const utteranceRef = React.useRef<SpeechSynthesisUtterance | null>(null);
  const fileInputRefs = React.useRef<Record<string, HTMLInputElement | null>>({});

  React.useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setSpeechSynthesis(window.speechSynthesis);
    }
  }, []);

  const handleDeletePoem = async (poemId: string) => {
    try {
        await deletePoemFromServer(poemId);
        toast({ title: "Poema eliminado", description: "El poema ha sido eliminado con éxito." });
        refresh();
    } catch (error) {
        toast({ variant: "destructive", title: "Error al eliminar", description: "No se pudo eliminar el poema." });
    } finally {
        setPoemToDelete(null);
    }
  };
  
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copiado",
      description: "El poema ha sido copiado al portapapeles.",
    });
  };

  const handleShare = async (poem: Poem) => {
    const shareText = `${poem.title}\n\n${poem.poem}`;
    if (!navigator.share) {
        handleCopy(shareText);
        toast({ title: "Navegador no compatible", description: "Tu navegador no soporta la función de compartir. El poema ha sido copiado." });
        return;
    }
    try {
        let shareData: { title: string; text: string; files?: File[] } = { title: poem.title, text: shareText };
        if (poem.imageUrl && !poem.imageUrl.startsWith('data:')) {
            try {
                const response = await fetch(poem.imageUrl);
                const blob = await response.blob();
                const file = new File([blob], `${poem.title.replace(/\s+/g, '-')}.jpg`, { type: blob.type });
                if (navigator.canShare && navigator.canShare({ files: [file] })) {
                    shareData.files = [file];
                }
            } catch (imageError) {
                console.error("Error fetching image for sharing:", imageError);
                toast({ variant: "destructive", title: "Error de imagen", description: "No se pudo cargar la imagen para compartir. Se compartirá solo el texto." });
            }
        }
        await navigator.share(shareData);
    } catch (error) {
        if ((error as Error).name !== 'AbortError') {
            console.error("Error al compartir:", error);
            toast({ variant: "destructive", title: "Error al compartir", description: "No se pudo compartir el poema. Se ha copiado el texto en su lugar." });
            handleCopy(shareText);
        }
    }
  };

 const playAudio = React.useCallback((text: string, index: number) => {
    if (!speechSynthesis) return;
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utteranceRef.current = utterance;
    const voices = speechSynthesis.getVoices();
    const spanishFemaleVoice = voices.find(voice => voice.lang.startsWith('es') && (voice.name.toLowerCase().includes('female') || voice.name.toLowerCase().includes('mujer')));
    utterance.voice = spanishFemaleVoice || voices.find(voice => voice.lang.startsWith('es')) || voices.find(voice => voice.default) || null;
    utterance.pitch = 1;
    utterance.rate = 1;
    utterance.onstart = () => setAudioState({ isPlaying: true, isLoading: false, poemIndex: index });
    utterance.onpause = () => setAudioState(prev => ({ ...prev, isPlaying: false }));
    utterance.onresume = () => setAudioState(prev => ({ ...prev, isPlaying: true }));
    utterance.onend = () => {
        setAudioState({ isPlaying: false, isLoading: false, poemIndex: null });
        utteranceRef.current = null;
    };
    utterance.onerror = (event) => {
        console.error("SpeechSynthesisUtterance.onerror", event);
        toast({ variant: "destructive", title: "Error de audio", description: "No se pudo reproducir el poema. Intenta de nuevo." });
        setAudioState({ isPlaying: false, isLoading: false, poemIndex: null });
    };
    try {
        speechSynthesis.speak(utterance);
    } catch (error) {
        console.error("Error calling speechSynthesis.speak:", error);
        toast({ variant: "destructive", title: "Error de audio", description: "No se pudo iniciar la reproducción." });
        setAudioState({ isPlaying: false, isLoading: false, poemIndex: null });
    }
  }, [speechSynthesis, toast]);

  const handlePlayAudio = (text: string, index: number) => {
    if (!speechSynthesis) {
        toast({ variant: "destructive", title: "Error", description: "Tu navegador no soporta la síntesis de voz." });
        return;
    }
    if (audioState.isPlaying && audioState.poemIndex === index) {
        speechSynthesis.pause();
        return;
    }
    if (speechSynthesis.paused && audioState.poemIndex === index) {
        speechSynthesis.resume();
        return;
    }
    setAudioState({ isPlaying: false, isLoading: true, poemIndex: index });
    if (speechSynthesis.getVoices().length === 0) {
        speechSynthesis.onvoiceschanged = () => playAudio(text, index);
    } else {
        playAudio(text, index);
    }
  };

  const handleRecite = (poemId: string) => router.push(`/recite/${poemId}`);
  const handleOpenPoem = (poemId: string, category: string) => router.push(`/poem/${poemId}?category=${encodeURIComponent(category)}`);
  
  const handleImageChangeClick = (poemId: string) => {
    fileInputRefs.current[poemId]?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>, poemId: string) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast({ variant: "destructive", title: "Imagen demasiado grande", description: "Por favor, elige una imagen de menos de 2MB." });
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
        const base64String = reader.result as string;
        const newPoemData = { imageUrl: base64String, photographerName: "Tú", photographerUrl: "#" };
        const storedImageCache = localStorage.getItem(PEXELS_CACHE_KEY);
        const imageCache: Record<string, Partial<Poem>> = storedImageCache ? JSON.parse(storedImageCache) : {};
        imageCache[poemId] = { ...imageCache[poemId], ...newPoemData };
        localStorage.setItem(PEXELS_CACHE_KEY, JSON.stringify(imageCache));
        toast({ title: "Previsualización", description: "La imagen del poema se ha actualizado localmente." });
    };
    reader.onerror = (error) => {
        console.error("Error reading file:", error);
        toast({ variant: "destructive", title: "Error", description: "No se pudo leer la imagen." });
    };
  };
  
  const getEmojiForTitle = (title: string) => {
    const titleEmojis: Record<string, string> = { /* ...tu lista de emojis... */ };
    const titleEmoji = Object.keys(titleEmojis).find(t => title.includes(t))
    return titleEmoji ? titleEmojis[titleEmoji] : ""
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {poems.map((poem, index) => (
          <Card key={poem.id} className="overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 group flex flex-col">
              <div className="relative aspect-[4/3] w-full overflow-hidden cursor-pointer" onClick={() => handleOpenPoem(poem.id, poem.category)}>
                {/* --- SECCIÓN CORREGIDA --- */}
                {(poem.imageUrl || poem.image) ? (
                    <Image 
                        src={poem.imageUrl || poem.image} 
                        alt={poem.title} 
                        fill 
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                ) : <Skeleton className="h-full w-full" />}
                {/* --- FIN DE LA SECCIÓN CORREGIDA --- */}
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                    <Maximize className="w-10 h-10 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                {isAdmin && (
                  <Button 
                    variant="destructive" 
                    size="icon" 
                    className="absolute top-2 left-2 opacity-80 hover:opacity-100" 
                    onClick={(e) => {
                      e.stopPropagation();
                      setPoemToDelete(poem);
                    }}
                  >
                    <Trash2 className="w-4 h-4"/>
                  </Button>
                )}
              </div>
              <CardContent className="p-4 bg-background flex flex-col flex-1">
                <h2 className="text-xl font-headline font-bold text-primary mb-2 truncate">{getEmojiForTitle(poem.title)} {poem.title}</h2>
                <div className="h-24" onDoubleClick={() => handleOpenPoem(poem.id, poem.category)}>
                    <ScrollArea className="h-full"><p className="text-foreground/80 whitespace-pre-line font-body italic text-base pr-4">{poem.poem}</p></ScrollArea>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-border mt-4">
                    <div className="flex items-center">
                        <Button variant="ghost" size="icon" onClick={() => handleCopy(`${poem.title}\n\n${poem.poem}`)} title="Copiar poema"><Copy className="w-5 h-5" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => handleShare(poem)} className="ml-1" title="Compartir tarjeta"><Share2 className="w-5 h-5" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => handlePlayAudio(`${poem.title}. ${poem.poem}`, index)} className="ml-1" disabled={audioState.isLoading && audioState.poemIndex === index} title="Reproducir poema">
                        {audioState.isLoading && audioState.poemIndex === index ? <Loader className="w-5 h-5 animate-spin" /> : audioState.isPlaying && audioState.poemIndex === index ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleRecite(poem.id)} className="ml-1" title="Recitar y Grabar"><Mic className="w-5 h-5" /></Button>
                        <input type="file" ref={el => { if(el) fileInputRefs.current[poem.id] = el; }} onChange={(e) => handleFileChange(e, poem.id)} className="hidden" accept="image/*"/>
                        <Button variant="ghost" size="icon" className="ml-1" onClick={() => handleImageChangeClick(poem.id)} title="Cambiar imagen"><ImageIcon className="w-5 h-5" /></Button>
                    </div>
                    <Button variant="ghost" size="icon" title="Añadir a favoritos (Próximamente)"><Heart className="w-6 h-6 text-muted-foreground" /></Button>
                </div>
              </CardContent>
          </Card>
        ))}
      </div>

      <AlertDialog
        open={!!poemToDelete}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setPoemToDelete(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción es permanente. Se eliminará el poema titulado "{poemToDelete?.title}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => handleDeletePoem(poemToDelete!.id)} 
              className="bg-destructive hover:bg-destructive/90"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {searchQuery && poems.length === 0 && (
        <div className="text-center py-20 col-span-full">
          <p className="text-xl text-muted-foreground">No se encontraron poemas para "{searchQuery}".</p>
          <Button onClick={() => router.push('/')} className="mt-4">Volver al inicio</Button>
        </div>
      )}
      {!searchQuery && poems.length === 0 && (
         <div className="text-center py-20 col-span-full">
          <p className="text-xl text-muted-foreground">Escribe algo en la barra de búsqueda para empezar.</p>
        </div>
      )}
    </>
  );
}