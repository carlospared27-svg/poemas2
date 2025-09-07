
"use client";

import { X } from "lucide-react";
import { Button } from "./ui/button";

export function AdBannerPlaceholder() {
  return (
    <div className="sticky bottom-0 left-0 right-0 z-50 w-full flex items-center justify-center h-16 bg-secondary/30 border-t border-border mt-4">
        <p className="text-xs text-muted-foreground">Espacio reservado para anuncio de Banner</p>
    </div>
  );
}

export function InterstitialAdPlaceholder({ onDismiss }: { onDismiss: () => void }) {
    return (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center animate-in fade-in-50">
            <div className="relative bg-background p-8 rounded-lg shadow-2xl w-full max-w-md text-center">
                <Button variant="ghost" size="icon" className="absolute top-2 right-2" onClick={onDismiss}>
                    <X className="w-5 h-5" />
                    <span className="sr-only">Cerrar anuncio</span>
                </Button>
                <h3 className="text-xl font-headline text-primary mb-2">Anuncio</h3>
                <div className="aspect-video bg-muted flex items-center justify-center rounded-md">
                    <p className="text-muted-foreground">Contenido del anuncio intersticial</p>
                </div>
                 <Button onClick={onDismiss} className="mt-4">Cerrar</Button>
            </div>
        </div>
    );
}
