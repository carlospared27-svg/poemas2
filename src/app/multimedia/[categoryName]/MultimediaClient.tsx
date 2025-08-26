// app/multimedia/[categoryName]/MultimediaClient.tsx

"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { MainLayout } from "../../../components/layout/main-layout"; // Ruta corregida
import { Button } from "../../../components/ui/button"; // Ruta corregida
import { ArrowLeft, Heart, Pause, Play, Share2, Trash2 } from "lucide-react";
import { Card, CardContent } from "../../../components/ui/card"; // Ruta corregida
import { Skeleton } from "../../../components/ui/skeleton"; // Ruta corregida
import { useToast } from "../../../hooks/use-toast"; // Ruta corregida
import { db } from "../../../lib/firebase"; // Ruta corregida
import { doc, deleteDoc } from "firebase/firestore";
import { useAuth } from "../../../components/auth-provider"; // Ruta corregida
import { deleteAudioFromStorage } from "../../../lib/storage-service"; // Ruta corregida
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
} from "../../../components/ui/alert-dialog"; // Ruta corregida

type MediaItem = {
    id: string;
    title: string;
    type: 'audio' | 'video';
    url: string;
    category: string;
    duration?: number;
    likes: number;
    createdAt: any;
}

function formatDuration(seconds: number = 0): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// El componente ahora recibe los datos iniciales como props
export function MultimediaClient({ initialMedia, categoryName }: { initialMedia: MediaItem[], categoryName: string }) {
    const router = useRouter();
    const { toast } = useToast();
    const { isAdmin } = useAuth();

    const [mediaItems, setMediaItems] = React.useState<MediaItem[]>(initialMedia);
    const [loading, setLoading] = React.useState(false); // La carga inicial ya no es necesaria aquí
    const [currentlyPlaying, setCurrentlyPlaying] = React.useState<string | null>(null);
    const audioRef = React.useRef<HTMLAudioElement | null>(null);

    const handlePlayPause = (itemId: string, audioUrl: string) => {
        if (currentlyPlaying === itemId) {
            audioRef.current?.pause();
            setCurrentlyPlaying(null);
        } else {
            if (audioRef.current) {
                audioRef.current.src = audioUrl;
                audioRef.current.play().catch(e => console.error("Error playing audio:", e));
            }
            setCurrentlyPlaying(itemId);
        }
    };

    const handleDeleteMedia = async (item: MediaItem) => {
        if (!isAdmin) return;
        try {
            if (item.type === 'audio') {
                await deleteAudioFromStorage(item.url);
            }
            const mediaDocRef = doc(db, 'multimedia', item.id);
            await deleteDoc(mediaDocRef);

            setMediaItems(prevItems => prevItems.filter(i => i.id !== item.id));
            toast({ title: "Éxito", description: "El contenido ha sido eliminado." });
        } catch (error) {
            console.error("Error deleting media:", error);
            toast({ variant: "destructive", title: "Error", description: "No se pudo eliminar el contenido." });
        }
    };
    
    React.useEffect(() => {
        const audio = audioRef.current;
        const handleAudioEnd = () => setCurrentlyPlaying(null);
        audio?.addEventListener('ended', handleAudioEnd);
        return () => {
            audio?.removeEventListener('ended', handleAudioEnd);
        }
    }, []);

    return (
        <MainLayout showHeader={false}>
            <audio ref={audioRef} />
            <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm p-4 border-b">
                <div className="container mx-auto flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => router.back()}><ArrowLeft className="w-5 h-5" /></Button>
                    <h1 className="text-2xl font-headline text-primary truncate">{categoryName}</h1>
                </div>
            </header>
            <main className="container mx-auto py-8 px-4">
                {loading && (
                    <div className="space-y-4">
                        <Skeleton className="h-24 w-full" />
                        <Skeleton className="h-24 w-full" />
                        <Skeleton className="h-24 w-full" />
                    </div>
                )}
                {!loading && mediaItems.length === 0 && (
                    <div className="text-center py-20 border-2 border-dashed rounded-lg">
                        <p className="text-muted-foreground">No hay contenido multimedia en esta categoría.</p>
                    </div>
                )}
                {!loading && mediaItems.length > 0 && (
                    <div className="space-y-6">
                        {mediaItems.map((item) => (
                            <div key={item.id}>
                                {item.type === 'video' && (
                                    <Card className="overflow-hidden group relative">
                                        <div className="aspect-video">
                                            <iframe
                                                src={`${item.url}?autoplay=0`}
                                                title={item.title}
                                                frameBorder="0"
                                                allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                                className="w-full h-full"
                                            ></iframe>
                                        </div>
                                        <CardContent className="p-4 flex justify-between items-center">
                                            <h2 className="font-bold text-lg">{item.title}</h2>
                                            {isAdmin && (
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild><Button variant="destructive" size="icon" className="h-8 w-8"><Trash2 className="h-4 w-4"/></Button></AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader><AlertDialogTitle>¿Estás seguro?</AlertDialogTitle><AlertDialogDescription>Esta acción es permanente.</AlertDialogDescription></AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                            <AlertDialogAction onClick={() => handleDeleteMedia(item)} className="bg-destructive hover:bg-destructive/90">Eliminar</AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            )}
                                        </CardContent>
                                    </Card>
                                )}
                                {item.type === 'audio' && (
                                    <Card className="flex items-center p-4 gap-4 group relative">
                                        <Button size="icon" className="rounded-full flex-shrink-0" onClick={() => handlePlayPause(item.id, item.url)}>
                                            {currentlyPlaying === item.id ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                                        </Button>
                                        <div className="flex-grow">
                                            <p className="font-semibold">{item.title}</p>
                                            <p className="text-sm text-muted-foreground">{formatDuration(item.duration)}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button variant="ghost" size="icon"><Heart className="w-5 h-5"/></Button>
                                            <Button variant="ghost" size="icon"><Share2 className="w-5 h-5"/></Button>
                                        </div>
                                        {isAdmin && (
                                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild><Button variant="destructive" size="icon" className="h-8 w-8"><Trash2 className="h-4 w-4"/></Button></AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader><AlertDialogTitle>¿Estás seguro?</AlertDialogTitle><AlertDialogDescription>Esta acción es permanente.</AlertDialogDescription></AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                            <AlertDialogAction onClick={() => handleDeleteMedia(item)} className="bg-destructive hover:bg-destructive/90">Eliminar</AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </div>
                                        )}
                                    </Card>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </MainLayout>
    );
}