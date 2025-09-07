
"use client";

import * as React from "react";
import Image from "next/image";
import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useAuth } from "@/components/auth-provider";
import { Loader2, Sparkles, Image as ImageIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { generateContent } from "@/ai/flows/dev";

type Category = {
    id: string;
    name: string;
};

type GeneratedPoem = {
    title: string;
    content: string;
    imageUrl?: string;
};

const GeneratePoemsPage = () => {
    const { isAdmin, loading } = useAuth();
    const router = useRouter();
    const { toast } = useToast();

    const [categories, setCategories] = React.useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = React.useState("");
    const [prompt, setPrompt] = React.useState("");
    const [numPoems, setNumPoems] = React.useState(1);
    const [generateImage, setGenerateImage] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);
    const [generatedPoems, setGeneratedPoems] = React.useState<GeneratedPoem[]>([]);
    
    const [selectedTextModel, setSelectedTextModel] = React.useState("gemini-1.5-pro-latest");
    const [selectedImageModel, setSelectedImageModel] = React.useState("imagen-3.0-generate-002");

    React.useEffect(() => {
        if (!loading && !isAdmin) {
            router.push('/');
        }
    }, [isAdmin, loading, router]);

    React.useEffect(() => {
        if (!isAdmin) return;
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
                toast({ variant: "destructive", title: "Error", description: "No se pudieron cargar las categorías." });
            }
        };
        fetchCategories();
    }, [isAdmin, toast]);

    const handleGenerate = async () => {
        if (!prompt || !selectedCategory) {
            toast({ variant: "destructive", title: "Faltan datos", description: "Por favor, escribe una idea y selecciona una categoría." });
            return;
        }

        setIsLoading(true);
        setGeneratedPoems([]);
        toast({ title: "Generando contenido...", description: `La IA está trabajando. Esto puede tardar un momento.` });

        try {
            const results = await generateContent(
                prompt,
                numPoems,
                selectedCategory,
                generateImage,
                selectedTextModel,
                selectedImageModel
            );

            setGeneratedPoems(results);
            toast({ title: "¡Éxito!", description: `${results.length} poema(s) han sido generados y guardados.` });

        } catch (error) {
            console.error("Error generating content:", error);
            toast({ variant: "destructive", title: "Error de generación", description: (error as Error).message });
        } finally {
            setIsLoading(false);
        }
    };

    if (loading || !isAdmin) {
        return <MainLayout><div className="flex items-center justify-center h-full"><Loader2 className="h-8 w-8 animate-spin" /></div></MainLayout>;
    }

    return (
        <MainLayout>
            <div className="container mx-auto py-8 px-4">
                <Card className="max-w-2xl mx-auto">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-2xl font-headline text-primary"><Sparkles />Generador de Poemas (IA)</CardTitle>
                        <CardDescription>Describe una idea y la IA creará poemas originales para ti, con la opción de generar una imagen.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="prompt">Describe tu idea para el poema</Label>
                            <Textarea id="prompt" placeholder="Ej: Un amor que florece en primavera..." value={prompt} onChange={(e) => setPrompt(e.target.value)} rows={4}/>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="category">Categoría</Label>
                                <Select onValueChange={setSelectedCategory} value={selectedCategory}>
                                    <SelectTrigger id="category"><SelectValue placeholder="Categoría del poema" /></SelectTrigger>
                                    <SelectContent>
                                        {categories.map((cat) => (<SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="num-poems">Cantidad</Label>
                                <Input id="num-poems" type="number" value={numPoems} onChange={(e) => setNumPoems(Math.max(1, parseInt(e.target.value, 10)))} min="1" max="5"/>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="text-model">Modelo de Texto</Label>
                                <Select onValueChange={setSelectedTextModel} value={selectedTextModel}>
                                    <SelectTrigger id="text-model"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="gemini-1.5-flash-latest">Gemini 1.5 Flash (Rápido)</SelectItem>
                                        <SelectItem value="gemini-1.5-pro-latest">Gemini 1.5 Pro (Avanzado)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="image-model">Modelo de Imagen</Label>
                                <Select onValueChange={setSelectedImageModel} value={selectedImageModel}>
                                    <SelectTrigger id="image-model"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="imagen-3.0-generate-002">Imagen 3 (Calidad)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Switch id="generate-image" checked={generateImage} onCheckedChange={setGenerateImage} />
                            <Label htmlFor="generate-image" className="flex items-center gap-2 cursor-pointer"><ImageIcon className="h-4 w-4" />Generar imagen con IA (opcional)</Label>
                        </div>
                        <Button onClick={handleGenerate} disabled={isLoading} className="w-full">
                            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                            Generar Contenido
                        </Button>
                        {generatedPoems.length > 0 && (
                            <div className="space-y-4 pt-4 border-t">
                                <h3 className="text-lg font-semibold">Resultados:</h3>
                                {generatedPoems.map((poem, index) => (
                                    <Card key={index} className="bg-muted/50 overflow-hidden">
                                        {poem.imageUrl && (
                                            <div className="relative aspect-video w-full">
                                                <Image src={poem.imageUrl} alt={`Imagen para ${poem.title}`} fill className="object-cover" />
                                            </div>
                                        )}
                                        <CardHeader><CardTitle>{poem.title}</CardTitle></CardHeader>
                                        <CardContent><p className="whitespace-pre-wrap">{poem.content}</p></CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </MainLayout>
    );
}

export default GeneratePoemsPage;
