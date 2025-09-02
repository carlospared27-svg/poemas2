"use client";

import * as React from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { AudioLines, Trash2, Home } from "lucide-react";
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
import { Skeleton } from "@/components/ui/skeleton";

type RecitedPoem = {
  id: string;
  poemId: string;
  title: string;
  audioBlobUrl: string;
  createdAt: string;
  name: string;
};

const RECITED_POEMS_KEY = 'amor-expressions-recited-v1';

export default function RecitalsPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [recitations, setRecitations] = React.useState<RecitedPoem[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        // Este código solo se ejecuta en el navegador.
        const storedRecitals = localStorage.getItem(RECITED_POEMS_KEY);
        if (storedRecitals) {
            setRecitations(JSON.parse(storedRecitals));
        }
        setIsLoading(false);
    }, []);

    const handleDeleteRecital = (recitalId: string) => {
        const updatedRecitals = recitations.filter(r => r.id !== recitalId);
        setRecitations(updatedRecitals);
        // localStorage solo se accede aquí, que es código de cliente.
        localStorage.setItem(RECITED_POEMS_KEY, JSON.stringify(updatedRecitals));
        toast({
            title: "Recitado Eliminado",
            description: "Tu grabación ha sido eliminada de este dispositivo.",
        });
    };

    if (isLoading) {
        return (
            <MainLayout>
                <div className="container mx-auto py-8 px-4">
                    <h1 className="text-4xl font-headline text-primary mb-8 text-center flex items-center justify-center gap-2">
                        <AudioLines /> Mis Recitados
                    </h1>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <Skeleton className="h-48 w-full" />
                        <Skeleton className="h-48 w-full" />
                        <Skeleton className="h-48 w-full" />
                    </div>
                </div>
            </MainLayout>
        );
    }
    
    return (
        <MainLayout>
            <div className="container mx-auto py-8 px-4">
                <h1 className="text-4xl font-headline text-primary mb-8 text-center flex items-center justify-center gap-2">
                    <AudioLines /> Mis Recitados
                </h1>

                {recitations.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {recitations.map((recital) => (
                            <Card key={recital.id} className="flex flex-col">
                                <CardHeader>
                                    <CardTitle>{recital.name}</CardTitle>
                                    <CardDescription>Poema: {recital.title}</CardDescription>
                                </CardHeader>
                                <CardContent className="flex-grow flex items-center justify-center">
                                    <audio src={recital.audioBlobUrl} controls className="w-full" />
                                </CardContent>
                                <CardContent className="flex justify-end">
                                     <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button variant="destructive" size="icon" title="Eliminar Recitado">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    Esta acción eliminará permanentemente tu grabación de este dispositivo.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                <AlertDialogAction onClick={() => handleDeleteRecital(recital.id)} className="bg-destructive hover:bg-destructive/90">
                                                    Eliminar
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 border-2 border-dashed rounded-lg">
                        <div className="mx-auto h-12 w-12 text-gray-400">
                           <AudioLines className="h-full w-full"/>
                        </div>
                        <h3 className="mt-2 text-sm font-semibold text-gray-900 dark:text-white">Aún no has grabado ningún recitado</h3>
                        <p className="mt-1 text-sm text-gray-500">Usa el icono del micrófono 🎤 en un poema para grabar tu voz.</p>
                        <div className="mt-6">
                            <Button onClick={() => router.push('/')}>
                                <Home className="mr-2 h-4 w-4" />
                                Explorar Poemas
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </MainLayout>
    );
}
