
// Ruta: src/app/search/search-results-display.tsx
"use client";

import * as React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Poem } from "@/lib/poems-service";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Maximize, Trash2 } from "lucide-react";
import Link from "next/link";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/components/auth-provider";
import { deletePoem } from "@/lib/actions";
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
import { PoemActions, AudioState } from "@/components/poem-actions";

type SearchPoem = Poem & { category: string, objectID: string };
const FAVORITES_KEY = 'amor-expressions-favorites-v1';

export function SearchResultsDisplay({ poems: searchHits, searchQuery }: { poems: SearchPoem[], searchQuery: string }) {
  const router = useRouter();
  const { toast } = useToast();
  const { isAdmin } = useAuth();
  const { refresh } = useInstantSearch();

  const [poemToDelete, setPoemToDelete] = React.useState<SearchPoem | null>(null);
  const [audioState, setAudioState] = React.useState<AudioState>({ isPlaying: false, isLoading: false, poemId: null });
  const [favorites, setFavorites] = React.useState<Set<string>>(new Set());

  React.useEffect(() => {
    const storedFavorites = localStorage.getItem(FAVORITES_KEY);
    if (storedFavorites) {
      setFavorites(new Set(JSON.parse(storedFavorites)));
    }
  }, []);

  const poems = searchHits.map(hit => ({
    ...hit,
    id: hit.objectID,
  }));
  
  const handleDeletePoem = async (poemId: string) => {
    if (!poemId) return;
    try {
        await deletePoem(poemId);
        toast({ title: "Poema eliminado", description: "El poema ha sido eliminado con éxito." });
        refresh();
    } catch (error) {
        toast({ variant: "destructive", title: "Error al eliminar", description: "No se pudo eliminar el poema." });
    } finally {
        setPoemToDelete(null);
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
  };
  
  const handleOpenPoem = (poemId: string) => router.push(`/poem/${poemId}`);
  
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {poems.map((poem) => (
          <Card key={poem.id} className="overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 group flex flex-col">
              <div className="relative aspect-[4/3] w-full overflow-hidden cursor-pointer" onClick={() => handleOpenPoem(poem.id)}>
                {(poem.imageUrl || poem.image) ? (
                    <Image 
                        src={poem.imageUrl || poem.image} 
                        alt={poem.title} 
                        fill 
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                ) : <Skeleton className="h-full w-full" />}
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                    <Maximize className="w-10 h-10 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                {isAdmin && (
                  <Button 
                    variant="destructive" 
                    size="icon" 
                    className="absolute top-2 left-2 opacity-80 hover:opacity-100 h-8 w-8" 
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
                <h2 className="text-xl font-headline font-bold text-primary mb-2 truncate">{poem.title}</h2>
                <div className="h-24" onDoubleClick={() => handleOpenPoem(poem.id)}>
                    <ScrollArea className="h-full"><p className="text-foreground/80 whitespace-pre-line font-body italic text-base pr-4">{poem.poem}</p></ScrollArea>
                </div>
                 <div className="flex justify-between items-center pt-2 border-t border-border mt-auto">
                    <PoemActions
                        poem={poem}
                        isFavorite={favorites.has(poem.id)}
                        onToggleFavorite={handleToggleFavorite}
                        audioState={audioState}
                        setAudioState={setAudioState}
                        showEdit={false} // No mostramos editar en los resultados de búsqueda
                    />
                    <Link href={`/category/${encodeURIComponent(poem.category)}`} passHref>
                        <Button variant="link" size="sm" className="text-xs">Ver en Categoría</Button>
                    </Link>
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
