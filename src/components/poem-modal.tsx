"use client";

import * as React from "react";
import { Poem } from "@/lib/poems-data";
import { Button } from "@/components/ui/button";
import { X, Heart, Copy, Share2, Play, Pause, ArrowLeft, ArrowRight, Loader2, Mic } from "lucide-react";

// --- TIPOS Y PROPS PARA EL MODAL ---
type AudioState = {
  isPlaying: boolean;
  isLoading: boolean;
  poemId: string | null;
};

// --- CORRECCIÓN CLAVE: Añadimos 'onRecite' a las props que el componente espera recibir ---
type PoemModalProps = {
    poem: Poem;
    isFavorite: boolean;
    onClose: () => void;
    onToggleFavorite: (e: React.MouseEvent, poemId: string) => void;
    onPlayAudio: (e: React.MouseEvent, text: string, poemId: string) => void;
    onCopy: (e: React.MouseEvent, text: string) => void;
    onShare: (e: React.MouseEvent, title: string, text: string) => void;
    onRecite: (e: React.MouseEvent, poemId: string) => void; // Prop añadida
    audioState: AudioState;
};

const WORDS_PER_PAGE = 80;

export function PoemModal({
    poem,
    isFavorite,
    onClose,
    onToggleFavorite,
    onPlayAudio,
    onCopy,
    onShare,
    onRecite, // Se recibe la prop
    audioState
}: PoemModalProps) {
    const [currentPage, setCurrentPage] = React.useState(0);

    const poemPages = React.useMemo(() => {
        const words = poem.poem.split(/\s+/);
        const pages = [];
        if (words.length <= WORDS_PER_PAGE) {
            return [poem.poem];
        }
        for (let i = 0; i < words.length; i += WORDS_PER_PAGE) {
            pages.push(words.slice(i, i + WORDS_PER_PAGE).join(" "));
        }
        return pages;
    }, [poem.poem]);

    const totalPages = poemPages.length;

    const handleNextPage = () => {
        setCurrentPage(prev => Math.min(prev + 1, totalPages - 1));
    };

    const handlePrevPage = () => {
        setCurrentPage(prev => Math.max(prev - 1, 0));
    };

    React.useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

    const fullPoemText = `${poem.title}\n\n${poem.poem}`;

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in-0" onClick={onClose}>
            <div className="bg-card text-card-foreground rounded-xl w-full max-w-3xl h-full max-h-[90vh] flex flex-col p-6 relative" onClick={(e) => e.stopPropagation()}>
                <Button variant="ghost" size="icon" className="absolute top-4 right-4" onClick={onClose}>
                    <X className="h-6 w-6" />
                </Button>

                <h2 className="text-3xl md:text-4xl font-headline text-primary mb-4 text-center">{poem.title}</h2>

                <div className="flex-1 overflow-y-auto font-body text-lg md:text-xl leading-relaxed whitespace-pre-line text-center flex items-center justify-center p-4">
                    <p>{poemPages[currentPage]}</p>
                </div>

                {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-4 my-4">
                        <Button variant="outline" onClick={handlePrevPage} disabled={currentPage === 0}>
                            <ArrowLeft className="mr-2 h-4 w-4" /> Anterior
                        </Button>
                        <span className="text-sm text-muted-foreground">Página {currentPage + 1} de {totalPages}</span>
                        <Button variant="outline" onClick={handleNextPage} disabled={currentPage === totalPages - 1}>
                            Siguiente <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                )}

                <div className="flex justify-center items-center gap-2 border-t pt-4 mt-4">
                     <Button variant="ghost" size="icon" onClick={(e) => onToggleFavorite(e, poem.id)} title="Añadir a favoritos">
                        <Heart className={`w-6 h-6 transition-colors ${isFavorite ? 'text-red-500 fill-current' : 'text-muted-foreground'}`} />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={(e) => onPlayAudio(e, fullPoemText, poem.id)} title="Reproducir">
                        {audioState.isLoading && audioState.poemId === poem.id ? <Loader2 className="w-6 h-6 animate-spin" /> : (audioState.isPlaying && audioState.poemId === poem.id ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />)}
                    </Button>
                    <Button variant="ghost" size="icon" onClick={(e) => onRecite(e, poem.id)} title="Recitar y Grabar">
                        <Mic className="w-6 h-6" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={(e) => onCopy(e, fullPoemText)} title="Copiar"><Copy className="w-6 h-6" /></Button>
                    <Button variant="ghost" size="icon" onClick={(e) => onShare(e, poem.title, poem.poem)} title="Compartir"><Share2 className="w-6 h-6" /></Button>
                </div>
            </div>
        </div>
    );
}
