// src/app/poem/[poemId]/PoemClient.tsx

"use client";

import * as React from "react";
import Image from "next/image";
import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Poem } from "@/lib/poems-data";
import { Copy, Share2, Heart, Mic, Play, Pause, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

type AudioState = {
  isPlaying: boolean;
  isLoading: boolean;
};

export function PoemClient({ poem }: { poem: Poem }) {
  const router = useRouter();
  const { toast } = useToast();
  const [speechSynthesis, setSpeechSynthesis] = React.useState<SpeechSynthesis | null>(null);
  const [audioState, setAudioState] = React.useState<AudioState>({ isPlaying: false, isLoading: false });

  React.useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setSpeechSynthesis(window.speechSynthesis);
    }
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(`${poem.title}\n\n${poem.poem}`);
    toast({ title: "Copiado", description: "El poema se copió al portapapeles." });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: poem.title, text: poem.poem });
    } else {
      handleCopy();
    }
  };

  const handleRecite = () => {
    router.push(`/recite/${poem.id}`);
  };
  
  const handlePlayAudio = () => {
    toast({ title: "Función de audio pendiente" });
  };

  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4">
        <Card className="max-w-2xl mx-auto overflow-hidden">
          {poem.imageUrl && (
            <div className="relative aspect-video w-full">
              <Image
                src={poem.imageUrl}
                alt={poem.title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
                priority
              />
            </div>
          )}
          <CardContent className="p-6">
            <h1 className="text-3xl font-headline text-primary mb-4">{poem.title}</h1>
            <p className="text-foreground/80 whitespace-pre-line font-body text-lg leading-relaxed">
              {poem.poem}
            </p>
          </CardContent>
          <CardFooter className="p-2 flex justify-between items-center border-t bg-muted/50">
            <div className="flex items-center">
              <Button variant="ghost" size="icon" title="Añadir a favoritos">
                <Heart className="w-5 h-5" />
              </Button>
            </div>
            <div className="flex items-center">
              <Button variant="ghost" size="icon" onClick={handlePlayAudio} title="Escuchar poema">
                {audioState.isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (audioState.isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />)}
              </Button>
              <Button variant="ghost" size="icon" onClick={handleRecite} title="Recitar y Grabar">
                <Mic className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleCopy} title="Copiar poema">
                <Copy className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleShare} title="Compartir poema">
                <Share2 className="w-5 h-5" />
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </MainLayout>
  );
}