

"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Poem } from "@/lib/poems-service";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Heart, Copy, Share2, Play, Pause, Loader2, Mic, Pencil } from "lucide-react";
import { doc, updateDoc, increment } from "firebase/firestore";
import { db } from "@/lib/firebase";

export type AudioState = {
  isPlaying: boolean;
  isLoading: boolean;
  poemId: string | null;
};

type PoemActionsProps = {
  poem: Poem;
  isFavorite: boolean;
  onToggleFavorite: (poemId: string) => void;
  audioState: AudioState;
  setAudioState: React.Dispatch<React.SetStateAction<AudioState>>;
  showEdit: boolean;
};

let audio: HTMLAudioElement | null = null;
let currentUtterance: SpeechSynthesisUtterance | null = null;

export function PoemActions({
  poem,
  isFavorite,
  onToggleFavorite,
  audioState,
  setAudioState,
  showEdit
}: PoemActionsProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [speechSynthesis, setSpeechSynthesis] = React.useState<SpeechSynthesis | null>(null);

  React.useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setSpeechSynthesis(window.speechSynthesis);
    }
  }, []);

  const handleCopy = (e: React.MouseEvent, text: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    toast({ title: "Copiado" });
  };

  const handleShare = async (e: React.MouseEvent, title: string, text: string) => {
    e.stopPropagation();
    if (navigator.share) {
      try {
        await navigator.share({ title, text });
      } catch (error) {
        console.error(error);
      }
    } else {
      handleCopy(e, `${title}\n\n${text}`);
    }
  };

  const handleRecite = (e: React.MouseEvent, poemId: string) => {
    e.stopPropagation();
    router.push(`/recite/${poemId}`);
  };

  const handleEditPoem = (e: React.MouseEvent, poemId: string) => {
    e.stopPropagation();
    router.push(`/admin/edit-poem/${poemId}`);
  };

  const playAudio = React.useCallback((text: string, poemId: string) => {
    if (!speechSynthesis) return;

    if (currentUtterance && speechSynthesis.speaking) {
      speechSynthesis.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    currentUtterance = utterance;
    const voices = speechSynthesis.getVoices();
    const spanishFemaleVoice = voices.find(v => v.lang.startsWith('es') && (v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('mujer')));
    utterance.voice = spanishFemaleVoice || voices.find(v => v.lang.startsWith('es')) || null;
    
    utterance.onstart = () => setAudioState({ isPlaying: true, isLoading: false, poemId });
    utterance.onend = () => {
      setAudioState({ isPlaying: false, isLoading: false, poemId: null });
      currentUtterance = null;
    };
    utterance.onerror = () => {
      toast({variant: "destructive", title: "Error de audio", description: "No se pudo reproducir el poema."});
      setAudioState({ isPlaying: false, isLoading: false, poemId: null });
    };

    speechSynthesis.speak(utterance);
  }, [speechSynthesis, setAudioState, toast]);

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

  const handleFavoriteClick = async (e: React.MouseEvent, poemId: string) => {
    e.stopPropagation();
    if (!poemId) return;
    
    onToggleFavorite(poemId);
    // The database update logic is now handled by the parent component (e.g., MainApp)
    // to avoid duplication.
  };

  return (
    <>
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" onClick={(e) => handleFavoriteClick(e, poem.id)} title="Añadir a favoritos">
          <Heart className={`w-5 h-5 transition-colors ${isFavorite ? 'text-red-500 fill-current' : 'text-muted-foreground'}`} />
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
        {showEdit && (
            <Button variant="ghost" size="icon" onClick={(e) => handleEditPoem(e, poem.id)} title="Editar Poema">
                <Pencil className="h-4 w-4" />
            </Button>
        )}
      </div>
    </>
  );
}
