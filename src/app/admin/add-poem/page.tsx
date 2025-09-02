// src/app/admin/add-poem/page.tsx
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
import { Loader2, Send } from "lucide-react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { addAdminPoem } from "@/lib/poems-service";

type Category = {
    id: string;
    name: string;
};

const AdminAddPoemPage = () => {
    // Si estamos en producción, esta página no estará disponible.
    if (process.env.NODE_ENV === 'production') {
      return null;
    }
    
    const { isAdmin, user } = useAuth();
    const router = useRouter();
    const { toast } = useToast();

    const [title, setTitle] = React.useState("");
    const [author, setAuthor] = React.useState("Poemas & Versos"); // Admin default
    const [poemContent, setPoemContent] = React.useState("");
    const [categories, setCategories] = React.useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = React.useState("");
    const [imageFile, setImageFile] = React.useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    React.useEffect(() => {
        if (user && !isAdmin) {
            toast({
                title: "Acceso denegado",
                description: "Debes ser administrador para acceder a esta página.",
                variant: "destructive"
            });
            router.push('/');
        }
    }, [isAdmin, user, router, toast]);

    React.useEffect(() => {
        const fetchCategories = async () => {
            try {
                const categoriesCollection = collection(db, 'categories');
                const q = query(categoriesCollection, where('type', '==', 'poema'));
                const querySnapshot = await getDocs(q);
                const fetchedCategories = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    name: doc.data().name,
                })) as Category[];
                setCategories(fetchedCategories);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };
        fetchCategories();
    }, []);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!title || !poemContent || !selectedCategory) {
            toast({ variant: "destructive", title: "Faltan datos", description: "Por favor, completa todos los campos requeridos." });
            return;
        }
        
        setIsSubmitting(true);
        
        const poemData = {
            title: title,
            poem: poemContent,
            category: selectedCategory,
            author: author || "Poemas & Versos",
            imageFile: imageFile,
        };

        try {
            await addAdminPoem(poemData);

            toast({ title: "¡Éxito!", description: "El poema ha sido añadido correctamente." });
            router.push(`/category/${selectedCategory}`);
        } catch (error) {
            console.error("Error submitting poem:", error);
            toast({ variant: "destructive", title: "Error", description: "No se pudo añadir el poema." });
        } finally {
            setIsSubmitting(false);
        }
    };
    
    if (!isAdmin) {
        return (
            <MainLayout>
                <div className="flex h-[calc(100vh-57px)] items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin" />
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <div className="container mx-auto py-8 px-4">
                <Card className="max-w-2xl mx-auto">
                    <CardHeader>
                        <CardTitle>Agregar Nuevo Poema</CardTitle>
                        <CardDescription>
                            Completa el formulario para añadir un nuevo poema a la colección.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="title">Título del Poema</Label>
                                <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ej: Corazón en tus manos" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="author">Tu Nombre o Seudónimo (Opcional)</Label>
                                <Input id="author" value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Ej: Un Poeta Anónimo" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="category">Categoría</Label>
                                <Select onValueChange={setSelectedCategory} value={selectedCategory}>
                                    <SelectTrigger id="category"><SelectValue placeholder="Selecciona una categoría" /></SelectTrigger>
                                    <SelectContent>
                                        {categories.map((cat) => (<SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="image">Imagen (Opcional)</Label>
                                <Input id="image" type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files ? e.target.files[0] : null)} />
                                <p className="text-sm text-muted-foreground">Si no seleccionas una, se usará una imagen aleatoria de la galería.</p>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="poem">Cuerpo del Poema</Label>
                                <Textarea id="poem" value={poemContent} onChange={(e) => setPoemContent(e.target.value)} placeholder="Escribe tu poema aquí..." rows={10} />
                            </div>
                            <Button type="submit" disabled={isSubmitting} className="w-full">
                                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                                Agregar Poema
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </MainLayout>
    );
};

export default AdminAddPoemPage;
