"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where, addDoc, Timestamp } from "firebase/firestore";
import { uploadImage } from "@/lib/storage-service";
import NextImage from "next/image";
import ReCAPTCHA from "react-google-recaptcha";

type FormData = {
  title: string;
  author: string;
  poem: string;
  category: string;
  image: FileList;
  recaptcha: string; // Nuevo campo para el token de reCAPTCHA
};

type Category = {
  id: string;
  name: string;
};

const SUBMISSIONS_KEY = 'amor-expressions-submissions';

export default function SubmitPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { register, handleSubmit, formState: { isSubmitting, errors }, control, reset, watch } = useForm<FormData>();
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = React.useState(true);
  const [imagePreview, setImagePreview] = React.useState<string | null>(null);
  const [isCaptchaVerified, setIsCaptchaVerified] = React.useState(false);

  const imageFile = watch("image");

  React.useEffect(() => {
    if (imageFile && imageFile.length > 0) {
      const file = imageFile[0];
      const reader = new FileReader();
      reader.onloadend = () => { setImagePreview(reader.result as string); };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  }, [imageFile]);

  React.useEffect(() => {
    const fetchCategories = async () => {
        setLoadingCategories(true);
        try {
            const categoriesCollection = collection(db, 'categories');
            const q = query(categoriesCollection, where('type', '==', 'poema'));
            const querySnapshot = await getDocs(q);
            const fetchedCategories = querySnapshot.docs.map(doc => ({ id: doc.id, name: doc.data().name })) as Category[];
            setCategories(fetchedCategories);
        } catch (error) {
            toast({ variant: "destructive", title: "Error", description: "No se pudieron cargar las categorías." });
        } finally {
            setLoadingCategories(false);
        }
    }
    fetchCategories();
  }, [toast]);

  const onSubmit = async (data: FormData) => {
    try {
      const storedSubmissions = localStorage.getItem(SUBMISSIONS_KEY);
      const submissions = storedSubmissions ? JSON.parse(storedSubmissions) : [];
      const newSubmission = { ...data, id: new Date().toISOString(), poem: data.poem };
      submissions.unshift(newSubmission);
      localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(submissions));

      let imageUrl = null;
      if (data.image && data.image.length > 0) {
        const file = data.image[0];
        const fileName = `submitted-images/${Date.now()}-${file.name}`;
        imageUrl = await uploadImage(file, fileName);
      }

      const submissionsCollection = collection(db, 'submissions');
      await addDoc(submissionsCollection, {
        title: data.title,
        poem: data.poem,
        category: data.category,
        author: data.author || "Anónimo",
        imageUrl: imageUrl,
        submittedAt: Timestamp.now(),
      });

      toast({
        title: "¡Gracias por tu envío!",
        description: "Tu poema ha sido enviado para revisión y guardado en 'Mis Envíos'.",
      });

      reset();
      router.push('/collections');

    } catch (error) {
      console.error("Error submitting poem:", error);
      toast({
        variant: "destructive",
        title: "Error al enviar",
        description: "No se pudo procesar tu envío. Inténtalo de nuevo.",
      });
    }
  };

  return (
    <MainLayout>
        <header className="container mx-auto flex items-center gap-4 p-4">
             <Button variant="ghost" size="icon" onClick={() => router.back()}><ArrowLeft className="w-5 h-5" /></Button>
            <h1 className="text-2xl font-headline text-primary">Enviar Poema</h1>
        </header>
         <main className="flex-1 container mx-auto py-8 px-4 flex justify-center">
            <Card className="w-full max-w-2xl">
                 <form onSubmit={handleSubmit(onSubmit)}>
                    <CardHeader>
                        <CardTitle>Envía tu Creación</CardTitle>
                        <CardDescription>Comparte tu talento. Los poemas que envíes se guardarán en tu dispositivo y serán revisados por un administrador antes de ser públicos.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="title">Título del Poema</Label>
                            <Input id="title" placeholder="Ej: Corazón en tus manos" {...register("title", { required: "El título es obligatorio." })} />
                            {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="author">Tu Nombre o Seudónimo (Opcional)</Label>
                            <Input id="author" placeholder="Ej: Un Poeta Anónimo" {...register("author")} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="category">Categoría</Label>
                            <Controller name="category" control={control} rules={{ required: "Debes seleccionar una categoría." }} render={({ field }) => (
                                <Select onValueChange={field.onChange} defaultValue={field.value} disabled={loadingCategories}>
                                    <SelectTrigger><SelectValue placeholder={loadingCategories ? "Cargando..." : "Selecciona una categoría"} /></SelectTrigger>
                                    <SelectContent>
                                        {categories.map((cat) => <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            )} />
                             {errors.category && <p className="text-sm text-destructive">{errors.category.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="image">Imagen (Opcional)</Label>
                            <Input id="image" type="file" accept="image/*" {...register("image")} />
                            {imagePreview && (
                                <div className="mt-4 relative w-full aspect-video rounded-md overflow-hidden">
                                    <NextImage src={imagePreview} alt="Vista previa de la imagen" fill className="object-cover" />
                                </div>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="poem">Cuerpo del Poema</Label>
                            <Textarea id="poem" placeholder="Escribe tu poema aquí..." {...register("poem", { required: "El poema no puede estar vacío." })} rows={10} />
                             {errors.poem && <p className="text-sm text-destructive">{errors.poem.message}</p>}
                        </div>
                         {/* --- NUEVO CAMPO DE RECAPTCHA --- */}
                        <div className="space-y-2">
                            <Label>Verificación</Label>
                             <Controller
                                name="recaptcha"
                                control={control}
                                rules={{ required: "Por favor, completa la verificación." }}
                                render={({ field }) => (
                                    <ReCAPTCHA
                                        sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
                                        onChange={(token) => {
                                            field.onChange(token);
                                            setIsCaptchaVerified(!!token);
                                        }}
                                    />
                                )}
                            />
                            {errors.recaptcha && <p className="text-sm text-destructive">{errors.recaptcha.message}</p>}
                        </div>
                    </CardContent>
                    <CardFooter>
                         <Button type="submit" disabled={isSubmitting || loadingCategories || !isCaptchaVerified} className="w-full">
                            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4"/>}
                            Enviar Poema para Revisión
                        </Button>
                    </CardFooter>
                 </form>
            </Card>
        </main>
    </MainLayout>
  )
}
