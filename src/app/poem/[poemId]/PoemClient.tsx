
// src/app/poem/[poemId]/PoemClient.tsx

"use client";

import * as React from "react";
import Image from "next/image";
import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Poem } from "@/lib/poems-data";
import { PoemActions, AudioState } from "@/components/poem-actions";
import { useAuth } from "@/components/auth-provider";

const FAVORITES_KEY = 'amor-expressions-favorites-v1';

export function PoemClient({ poem }: { poem: Poem | null }) {
  const { isAdmin } = useAuth();
  const [audioState, setAudioState] = React.useState<AudioState>({ isPlaying: false, isLoading: false, poemId: null });
  const [favorites, setFavorites] = React.useState<Set<string>>(new Set());

  React.useEffect(() => {
    const storedFavorites = localStorage.getItem(FAVORITES_KEY);
    if (storedFavorites) {
      setFavorites(new Set(JSON.parse(storedFavorites)));
    }
  }, []);

  const handleToggleFavorite = (poemId: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(poemId)) {
        newFavorites.delete(poemId);
    } else {
        newFavorites.add(poemId);
    }
    setFavorites(newFavorites);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(Array.from(newFavorites)));
  };
  
  if (!poem) {
      return (
        <MainLayout>
            <div className="flex items-center justify-center h-[calc(100vh-57px)]">
                <p>Poema no encontrado.</p>
            </div>
        </MainLayout>
      )
  }

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
          <CardFooter className="p-2 flex justify-center items-center border-t bg-muted/50">
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
      </div>
    </MainLayout>
  );
}
