"use client";

import * as React from "react";
import { Poem } from "@/lib/poems-data";
import { Button } from "@/components/ui/button";
import { X, ArrowLeft, ArrowRight } from "lucide-react";
import { PoemActions, AudioState } from "./poem-actions";
import { useAuth } from "@/components/auth-provider";

const isProduction = process.env.NODE_ENV === 'production';

type PoemModalProps = {
    poem: Poem;
    isFavorite: boolean;
    onClose: () => void;
    onToggleFavorite: (poemId: string) => void;
    audioState: AudioState;
    setAudioState: React.Dispatch<React.SetStateAction<AudioState>>;
};

const WORDS_PER_PAGE = 80;

export function PoemModal({
    poem,
    isFavorite,
    onClose,
    onToggleFavorite,
    audioState,
    setAudioState
}: PoemModalProps) {
    const { isAdmin } = useAuth();
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
            if (speechSynthesis.speaking) {
                speechSynthesis.cancel();
            }
        };
    }, []);

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
                     <PoemActions
                        poem={poem}
                        isFavorite={isFavorite}
                        onToggleFavorite={onToggleFavorite}
                        audioState={audioState}
                        setAudioState={setAudioState}
                        showEdit={!isProduction && isAdmin}
                     />
                </div>
            </div>
        </div>
    );
}
