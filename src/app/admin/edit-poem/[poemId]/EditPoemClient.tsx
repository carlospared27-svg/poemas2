
// src/app/admin/edit-poem/[poemId]/EditPoemClient.tsx
"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/auth-provider";
import { Loader2, Save } from "lucide-react";
import { updatePoem, getPoemById } from "@/lib/actions";
import { Poem } from "@/lib/poems-service";

type PoemWithCategory = Poem & {
    category: string;
};

// El componente ahora recibe el ID del poema como prop
export function EditPoemClient({ poemId }: { poemId: string }) {
    const { isAdmin, loading: authLoading } = useAuth();
    const router = useRouter();
    const { toast } = useToast();

    // Estados para los datos del poema y el estado de carga/guardado
    const [poem, setPoem] = React.useState<PoemWithCategory | null>(null);
    const [title, setTitle] = React.useState("");
    const [content, setContent] = React.useState("");
    const [isLoading, setIsLoading] = React.useState(true);
    const [isSaving, setIsSaving] = React.useState(false);

    // Efecto para redirigir si no es admin
    React.useEffect(() => {
        if (!authLoading && !isAdmin) {
            toast({ variant: "destructive", title: "Acceso denegado" });
            router.push('/');
        }
    }, [isAdmin, authLoading, router, toast]);

    // Efecto para buscar los datos del poema en el cliente
    React.useEffect(() => {
        if (!poemId || !isAdmin) return;
        
        const fetchPoem = async () => {
            setIsLoading(true);
            try {
                const fetchedPoem = await getPoemById(poemId) as PoemWithCategory | null;
                if (fetchedPoem) {
                    setPoem(fetchedPoem);
                    setTitle(fetchedPoem.title);
                    setContent(fetchedPoem.poem);
                } else {
                    toast({ variant: "destructive", title: "Error", description: "No se encontró el poema." });
                    router.push("/");
                }
            } catch (error) {
                console.error("Error fetching poem:", error);
                toast({ variant: "destructive", title: "Error", description: "No se pudo cargar el poema." });
            } finally {
                setIsLoading(false);
            }
        };

        fetchPoem();
    }, [poemId, isAdmin, router, toast]);

    const handleSaveChanges = async () => {
        if (!poem?.id || !title || !content) {
            toast({ variant: "destructive", title: "Faltan datos", description: "El título y el contenido no pueden estar vacíos." });
            return;
        }

        setIsSaving(true);
        try {
            await updatePoem(poem.id, { title, poem: content });
            toast({ title: "¡Éxito!", description: "El poema ha sido actualizado." });
            router.push(`/category/${encodeURIComponent(poem?.category || '')}`);
            router.refresh();
        } catch (error) {
            toast({ variant: "destructive", title: "Error", description: "No se pudieron guardar los cambios." });
        } finally {
            setIsSaving(false);
        }
    };
    
    if (authLoading || isLoading || !isAdmin) {
        return <MainLayout><div className="flex items-center justify-center h-[80vh]"><Loader2 className="h-8 w-8 animate-spin" /></div></MainLayout>;
    }
    
    return (
        <MainLayout>
            <div className="container mx-auto py-8 px-4">
                <Card className="max-w-2xl mx-auto">
                    <CardHeader>
                        <CardTitle>Editar Poema</CardTitle>
                        <CardDescription>
                            Realiza los cambios necesarios en el título y el contenido del poema.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="title">Título del Poema</Label>
                            <Input
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="content">Contenido del Poema</Label>
                            <Textarea
                                id="content"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                rows={15}
                                className="resize-y"
                            />
                        </div>
                        <Button onClick={handleSaveChanges} disabled={isSaving} className="w-full">
                            {isSaving ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <Save className="mr-2 h-4 w-4" />
                            )}
                            Guardar Cambios
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </MainLayout>
    );
}
