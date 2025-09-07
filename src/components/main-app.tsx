

"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Image as ImageIcon, Maximize, PlusCircle, Video, Music, Upload } from "lucide-react";
import Image from "next/image";
import { useRouter } from 'next/navigation';
import { Poem, Category } from "@/lib/poems-service";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/components/auth-provider";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { playSound } from "@/lib/sound-service";
import { uploadImage, uploadAudio } from "@/lib/storage-service";
import { Skeleton } from "@/components/ui/skeleton";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy, limit, updateDoc, where, doc, addDoc, Timestamp, runTransaction } from "firebase/firestore";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { getPublicImages, getCategoryImages } from "@/lib/actions";
import { PoemActions } from "./poem-actions";

type AudioState = { isPlaying: boolean; isLoading: boolean; poemId: string | null };
const FAVORITES_KEY = 'amor-expressions-favorites-v1';

function parseVideoUrl(url: string): { embedUrl: string; source: 'youtube' | 'dailymotion' } | null {
    let videoId: string | null = null;
    let source: 'youtube' | 'dailymotion' | null = null;
    let embedUrl = "";
    let match = url.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    if (match && match[1]) {
        videoId = match[1];
        source = 'youtube';
        embedUrl = `https://www.youtube.com/embed/${videoId}`;
    } else {
        match = url.match(/(?:https?:\/\/)?(?:www\.)?dailymotion\.com\/(?:video|embed\/video)\/([a-zA-Z0-9]+)/);
        if (match && match[1]) {
            videoId = match[1];
            source = 'dailymotion';
            embedUrl = `https://www.dailymotion.com/embed/video/${videoId}`;
        }
    }
    if (videoId && source) {
        return { embedUrl, source };
    }
    return null;
}

type MainAppProps = {
  initialDailyPoem: Poem | null;
  initialCategories: Category[];
  initialCategoryImages: string[];
};

export function MainApp({ initialDailyPoem, initialCategories, initialCategoryImages }: MainAppProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { user, loading: authLoading, isAdmin } = useAuth();
  
  // Usamos los datos iniciales, pero permitimos que se actualicen
  const [dailyPoem, setDailyPoem] = React.useState<Poem | null>(initialDailyPoem);
  const [categories, setCategories] = React.useState<Category[]>(initialCategories);
  const [categoryImages, setCategoryImages] = React.useState<string[]>(initialCategoryImages);
  
  const [favorites, setFavorites] = React.useState<Set<string>>(new Set());
  const [audioState, setAudioState] = React.useState<AudioState>({ isPlaying: false, isLoading: false, poemId: null });
  const [isUploading, setIsUploading] = React.useState<string | null>(null);
  const fileInputRefs = React.useRef<Record<string, HTMLInputElement | null>>({});
  
  const [newCategoryName, setNewCategoryName] = React.useState("");
  const [newCategoryType, setNewCategoryType] = React.useState<'poema' | 'imagen' | 'multimedia'>('poema');
  const [isAddingCategory, setIsAddingCategory] = React.useState(false);

  const [isAddingMedia, setIsAddingMedia] = React.useState(false);
  const [newVideoTitle, setNewVideoTitle] = React.useState("");
  const [newVideoCategory, setNewVideoCategory] = React.useState("");
  const [newVideoUrl, setNewVideoUrl] = React.useState("");
  const [newAudioTitle, setNewAudioTitle] = React.useState("");
  const [newAudioCategory, setNewAudioCategory] = React.useState("");
  const [newAudioFile, setNewAudioFile] = React.useState<File | null>(null);

  const poemCategories = React.useMemo(() => categories.filter(c => c.type === 'poema').sort((a, b) => a.name.localeCompare(b.name)), [categories]);
  const imageCategories = React.useMemo(() => categories.filter(c => c.type === 'imagen').sort((a, b) => a.name.localeCompare(b.name)), [categories]);
  const multimediaCategories = React.useMemo(() => categories.filter(c => c.type === 'multimedia').sort((a, b) => a.name.localeCompare(b.name)), [categories]);

  React.useEffect(() => {
    // La carga de datos inicial ya no es necesaria, solo la de favoritos del localStorage
    const storedFavorites = localStorage.getItem(FAVORITES_KEY);
    if (storedFavorites) setFavorites(new Set(JSON.parse(storedFavorites)));
  }, []);

  const handleAddCategory = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!newCategoryName.trim() || !newCategoryType || !isAdmin) return;
    setIsAddingCategory(true);
    try {
        const categoryExists = categories.some(cat => cat.name.toLowerCase() === newCategoryName.trim().toLowerCase());
        if (categoryExists) {
            toast({ variant: "destructive", title: "Error", description: "Esa categoría ya existe." });
            setIsAddingCategory(false);
            return;
        }
        const categoriesCollection = collection(db, 'categories');
        const docRef = await addDoc(categoriesCollection, { name: newCategoryName.trim(), type: newCategoryType, imageUrl: null });
        const newCategory: Category = { id: docRef.id, name: newCategoryName.trim(), type: newCategoryType, imageUrl: null };
        setCategories(prevCategories => [...prevCategories, newCategory]);
        setNewCategoryName("");
        toast({ title: "Éxito", description: `Categoría "${newCategory.name}" creada.` });
    } catch (error) {
        console.error("Error adding category:", error);
        toast({ variant: "destructive", title: "Error", description: "No se pudo crear la categoría." });
    } finally {
        setIsAddingCategory(false);
    }
  };

  const handleAddVideo = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!newVideoTitle.trim() || !newVideoCategory || !newVideoUrl.trim() || !isAdmin) {
        toast({ variant: "destructive", title: "Error", description: "Todos los campos son obligatorios." });
        return;
    }
    const videoData = parseVideoUrl(newVideoUrl);
    if (!videoData) {
        toast({ variant: "destructive", title: "URL Inválida", description: "Por favor, introduce una URL válida de YouTube o Dailymotion." });
        return;
    }
    setIsAddingMedia(true);
    try {
        const multimediaCollection = collection(db, 'multimedia');
        await addDoc(multimediaCollection, {
            title: newVideoTitle.trim(),
            category: newVideoCategory,
            type: 'video',
            url: videoData.embedUrl,
            source: videoData.source,
            likes: 0,
            createdAt: Timestamp.now(),
            imageUrl: null,
        });
        setNewVideoTitle("");
        setNewVideoCategory("");
        setNewVideoUrl("");
        toast({ title: "Éxito", description: "El video ha sido añadido a la sección Multimedia." });
    } catch (error) {
        console.error("Error adding video:", error);
        toast({ variant: "destructive", title: "Error", description: "No se pudo guardar el video." });
    } finally {
        setIsAddingMedia(false);
    }
  };
  
  const handleUploadAudio = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!newAudioTitle.trim() || !newAudioCategory || !newAudioFile || !isAdmin) {
        toast({ variant: "destructive", title: "Error", description: "Todos los campos son obligatorios." });
        return;
    }
    setIsAddingMedia(true);
    try {
        const fileName = `audios/${Date.now()}-${newAudioFile.name}`;
        const audioUrl = await uploadAudio(newAudioFile, fileName);
        const audio = document.createElement('audio');
        audio.src = URL.createObjectURL(newAudioFile);
        let duration = 0;
        await new Promise<void>((resolve) => {
            audio.onloadedmetadata = () => {
                duration = audio.duration;
                URL.revokeObjectURL(audio.src);
                resolve();
            };
        });
        const multimediaCollection = collection(db, 'multimedia');
        await addDoc(multimediaCollection, {
            title: newAudioTitle.trim(),
            category: newAudioCategory,
            type: 'audio',
            url: audioUrl,
            duration: Math.round(duration),
            likes: 0,
            createdAt: Timestamp.now(),
            imageUrl: null,
        });
        setNewAudioTitle("");
        setNewAudioCategory("");
        setNewAudioFile(null);
        toast({ title: "Éxito", description: "El audio ha sido subido." });
    } catch (error) {
        console.error("Error uploading audio:", error);
        toast({ variant: "destructive", title: "Error", description: "No se pudo subir el audio." });
    } finally {
        setIsAddingMedia(false);
    }
  };

  const handleCategoryClick = (category: Category) => {
    playSound('swoosh');
    if (category.type === 'multimedia') {
        router.push(`/multimedia/${encodeURIComponent(category.name)}`);
    } else if (category.type === 'imagen') {
      router.push(`/images/${encodeURIComponent(category.name)}`);
    } else {
      router.push(`/category/${encodeURIComponent(category.name)}`);
    }
  };

  const handleToggleFavorite = (poemId: string) => {
    if (!poemId) return;

    const newFavorites = new Set(favorites);
    let likesChange = 0;

    if (newFavorites.has(poemId)) {
      newFavorites.delete(poemId);
      likesChange = -1;
      toast({ title: "Eliminado de Favoritos" });
    } else {
      newFavorites.add(poemId);
      likesChange = 1;
      toast({ title: "Añadido a Favoritos" });
    }
    
    setFavorites(newFavorites);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(Array.from(newFavorites)));

    if (dailyPoem && dailyPoem.id === poemId) {
        setDailyPoem(prev => prev ? { ...prev, likes: (prev.likes || 0) + likesChange } : null);
    }

    const poemRef = doc(db, "poems", poemId);
    runTransaction(db, async (transaction) => {
        const poemDoc = await transaction.get(poemRef);
        if (!poemDoc.exists()) {
            throw new Error("El poema no existe.");
        }
        const newLikes = (poemDoc.data().likes || 0) + likesChange;
        transaction.update(poemRef, { likes: newLikes });
    }).catch(error => {
        console.error("Error updating likes:", error);
    });
  };

  const isNew = (poem: Poem) => {
    if (!poem.createdAt) return false;
    return new Date(poem.createdAt) > new Date(Date.now() - 24 * 60 * 60 * 1000);
  };

  const handleUpdateCategoryImage = async (category: Category, imageSource: File | string) => {
      setIsUploading(category.name);
      const toastId = toast({ title: "Actualizando imagen..." }).id;
      try {
          const categoriesCollection = collection(db, "categories");
          const categoryQuery = await getDocs(query(categoriesCollection, where("name", "==", category.name)));

          if (categoryQuery.empty) throw new Error("Category not found");
          
          const categoryDocRef = categoryQuery.docs[0].ref;
          
          let finalUrl = "";
          if (typeof imageSource === 'string') {
              finalUrl = imageSource;
          } else {
              const fileName = `category-backgrounds/${category.id}-${Date.now()}-${imageSource.name}`;
              finalUrl = await uploadImage(imageSource, fileName);
          }
          
          await updateDoc(categoryDocRef, { imageUrl: finalUrl });
          
          setCategories(prev => prev.map(cat => cat.id === category.id ? { ...cat, imageUrl: finalUrl } : cat));
          toast({ id: toastId, title: "¡Éxito!", description: "La imagen de la categoría ha sido actualizada." });
      } catch (error) {
          console.error("Error updating category image:", error);
          toast({ id: toastId, variant: "destructive", title: "Error", description: "No se pudo actualizar la imagen." });
      } finally {
          setIsUploading(null);
      }
  };

  const renderCategoryCard = (category: Category) => {
    const isCatUploading = isUploading === category.name;
    const hasImage = !!category.imageUrl;
    const effectiveImageUrl = hasImage ? category.imageUrl! : `https://placehold.co/600x400/6366f1/ffffff?text=${encodeURIComponent(category.name)}`;
    
    return (
        <Card key={category.id} className="overflow-hidden group relative shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="w-full aspect-[4/3] cursor-pointer relative" onClick={() => handleCategoryClick(category)}>
                <Image 
                    src={effectiveImageUrl} 
                    alt={category.name} 
                    fill 
                    sizes="(max-width: 768px) 50vw, 33vw" 
                    className="object-cover transition-transform group-hover:scale-110"
                    onError={(e) => { e.currentTarget.src = `https://placehold.co/600x400/6366f1/ffffff?text=${encodeURIComponent(category.name)}`; }}
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />
                <div className="absolute inset-0 p-4 flex items-center justify-center">
                    {!hasImage && (
                        <h3 className={`font-headline font-bold text-white text-center text-xl md:text-2xl p-2 text-shadow-md`}>{category.name}</h3>
                    )}
                </div>
            </div>
            {isAdmin && (
                <div className="absolute top-2 right-2 opacity-80 group-hover:opacity-100 transition-opacity">
                   <Dialog>
                        <DialogTrigger asChild>
                            <Button size="icon" variant="secondary" className="h-8 w-8" onClick={(e) => e.stopPropagation()} disabled={isCatUploading}>
                                {isCatUploading ? <Loader2 className="w-4 h-4 animate-spin"/> : <ImageIcon className="w-4 h-4" />}
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl">
                            <DialogHeader>
                                <DialogTitle>Cambiar imagen para "{category.name}"</DialogTitle>
                                <DialogDescription>
                                    Elige una imagen de la galería pública o sube un nuevo archivo. La imagen se guardará en Firebase.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="py-4">
                                <h4 className="font-semibold mb-2">Seleccionar de la galería de categorías</h4>
                                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 max-h-64 overflow-y-auto">
                                    {categoryImages.map(imgUrl => (
                                        <div key={imgUrl} className="relative aspect-square cursor-pointer rounded-md overflow-hidden border-2 border-transparent hover:border-primary" onClick={() => handleUpdateCategoryImage(category, imgUrl)}>
                                            <Image src={imgUrl} alt={imgUrl} fill sizes="100px" className="object-cover"/>
                                        </div>
                                    ))}
                                </div>
                                <div className="relative my-4">
                                    <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
                                    <div className="relative flex justify-center text-xs uppercase"><span className="bg-background px-2 text-muted-foreground">O</span></div>
                                </div>
                                <input type="file" ref={(el) => { if (el) fileInputRefs.current[category.name] = el; }} className="hidden" accept="image/*" onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if(file) handleUpdateCategoryImage(category, file);
                                }}/>
                                <Button className="w-full" variant="outline" onClick={() => fileInputRefs.current[category.name]?.click()}>
                                    <Upload className="mr-2 h-4 w-4"/> Subir una imagen nueva
                                </Button>
                            </div>
                        </DialogContent>
                   </Dialog>
                </div>
            )}
        </Card>
    );
  };

  return (
    <main className="flex-1">
      <div className="container mx-auto py-8 px-4">
          {isAdmin && (
              <Card className="mb-8 border-primary/20">
                <CardHeader><CardTitle className="font-headline text-primary">Panel de Administrador</CardTitle></CardHeader>
                <CardContent>
                    <Tabs defaultValue="add-category">
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="add-category">Añadir Categoría</TabsTrigger>
                            <TabsTrigger value="add-audio">Subir Audio</TabsTrigger>
                            <TabsTrigger value="add-video">Añadir Video</TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="add-category" className="pt-4">
                             <form onSubmit={handleAddCategory} className="space-y-4">
                                <Input 
                                    type="text"
                                    placeholder="Nombre de la nueva categoría"
                                    value={newCategoryName}
                                    onChange={(e) => setNewCategoryName(e.target.value)}
                                    disabled={isAddingCategory}
                                />
                                <Select onValueChange={(value) => setNewCategoryType(value as any)} value={newCategoryType}>
                                    <SelectTrigger><SelectValue placeholder="Selecciona un tipo" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="poema">Poema</SelectItem>
                                        <SelectItem value="imagen">Imagen</SelectItem>
                                        <SelectItem value="multimedia">Multimedia</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Button type="submit" disabled={isAddingCategory || !newCategoryName.trim()}>
                                    {isAddingCategory ? <Loader2 className="h-4 w-4 animate-spin" /> : <PlusCircle className="h-4 w-4" />}
                                    <span className="ml-2">Añadir Categoría</span>
                                </Button>
                            </form>
                        </TabsContent>

                        <TabsContent value="add-audio" className="pt-4">
                            <form onSubmit={handleUploadAudio} className="space-y-4">
                                <Input 
                                    placeholder="Título del audio" 
                                    value={newAudioTitle}
                                    onChange={(e) => setNewAudioTitle(e.target.value)}
                                    disabled={isAddingMedia}
                                />
                                <Select onValueChange={setNewAudioCategory} value={newAudioCategory} disabled={isAddingMedia}>
                                    <SelectTrigger><SelectValue placeholder="Selecciona una categoría de multimedia" /></SelectTrigger>
                                    <SelectContent>
                                        {multimediaCategories.map(cat => ( <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem> ))}
                                    </SelectContent>
                                </Select>
                                <Input 
                                    type="file" 
                                    accept="audio/mp3,audio/mpeg"
                                    onChange={(e) => e.target.files && setNewAudioFile(e.target.files[0])}
                                    disabled={isAddingMedia}
                                />
                                <Button type="submit" disabled={isAddingMedia || !newAudioFile || !newAudioCategory || !newAudioTitle}>
                                    {isAddingMedia ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Music className="mr-2 h-4 w-4" />}
                                    Guardar Audio
                                </Button>
                            </form>
                        </TabsContent>

                        <TabsContent value="add-video" className="pt-4">
                            <form onSubmit={handleAddVideo} className="space-y-4">
                                <Input 
                                    placeholder="Título del video" 
                                    value={newVideoTitle}
                                    onChange={(e) => setNewVideoTitle(e.target.value)}
                                    disabled={isAddingMedia}
                                />
                                <Select onValueChange={setNewVideoCategory} value={newVideoCategory} disabled={isAddingMedia}>
                                    <SelectTrigger><SelectValue placeholder="Selecciona una categoría de multimedia" /></SelectTrigger>
                                    <SelectContent>
                                        {multimediaCategories.map(cat => ( <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem> ))}
                                    </SelectContent>
                                </Select>
                                <Input 
                                    type="url" 
                                    placeholder="Pega aquí la URL de YouTube o Dailymotion" 
                                    value={newVideoUrl}
                                    onChange={(e) => setNewVideoUrl(e.target.value)}
                                    disabled={isAddingMedia}
                                />
                                <Button type="submit" disabled={isAddingMedia || !newVideoUrl || !newVideoCategory || !newVideoTitle}>
                                    {isAddingMedia ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Video className="mr-2 h-4 w-4" />}
                                    Guardar Video
                                </Button>
                            </form>
                        </TabsContent>
                    </Tabs>
                </CardContent>
              </Card>
          )}

          <Tabs defaultValue="poems" className="w-full">
            <TabsList className="grid w-full grid-cols-3 h-auto rounded-none -mt-px bg-primary/10">
              <TabsTrigger value="poems" className="rounded-none py-3 data-[state=active]:text-primary data-[state=active]:border-b-2 border-primary data-[state=active]:bg-primary/5 font-headline">Poemas</TabsTrigger>
              <TabsTrigger value="images" className="rounded-none py-3 data-[state=active]:text-primary data-[state=active]:border-b-2 border-primary data-[state=active]:bg-primary/5 font-headline">Imágenes</TabsTrigger>
              <TabsTrigger value="multimedia" className="rounded-none py-3 data-[state=active]:text-primary data-[state=active]:border-b-2 border-primary data-[state=active]:bg-primary/5 font-headline">Multimedia</TabsTrigger>
            </TabsList>
            
            <TabsContent value="poems" className="pt-6">
              {dailyPoem ? (
                <section className="mb-8">
                  <h2 className="text-3xl font-headline mb-4 text-primary/90">Poema Sugerido</h2>
                    <Card className="bg-accent/20 border-accent shadow-lg hover:shadow-xl transition-shadow flex flex-col overflow-hidden">
                        <div 
                            className="relative aspect-[4/3] w-full bg-cover bg-center group"
                            style={{ backgroundImage: `url(${dailyPoem.imageUrl || dailyPoem.image || 'https://placehold.co/600x400/f87171/ffffff?text=Poema'})` }}
                        >
                            <div 
                                className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center cursor-pointer" 
                                onClick={() => router.push(`/poem/${dailyPoem.id}`)}
                            >
                                <Maximize className="w-10 h-10 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                            {isNew(dailyPoem) && (<Badge className="absolute top-2 right-2">Nuevo</Badge>)}
                        </div>
                      <CardHeader className="p-4 flex-1">
                        <CardTitle className="font-headline text-primary mb-2">{dailyPoem.title}</CardTitle>
                        <p className="text-foreground/80 whitespace-pre-line font-body italic py-2 text-base">{dailyPoem.poem}</p>
                      </CardHeader>
                      <CardFooter className="flex justify-center items-center bg-accent/30 p-2 border-t">
                        <PoemActions
                            poem={dailyPoem}
                            isFavorite={favorites.has(dailyPoem.id)}
                            onToggleFavorite={handleToggleFavorite}
                            audioState={audioState}
                            setAudioState={setAudioState}
                            showEdit={isAdmin}
                        />
                      </CardFooter>
                    </Card>
                </section>
              ) : (
                   <section className="mb-8">
                      <h2 className="text-3xl font-headline mb-4 text-primary/90">Poema Sugerido</h2>
                      <Card className="bg-accent/20 border-accent shadow-lg flex flex-col overflow-hidden">
                         <Skeleton className="aspect-[4/3] w-full" />
                         <CardContent className="flex-1 p-4"><Skeleton className="h-4 w-full mb-2" /><Skeleton className="h-4 w-full mb-2" /><Skeleton className="h-4 w-3/4" /></CardContent>
                         <CardFooter className="bg-accent/30 p-2 h-14"/>
                      </Card>
                   </section>
              )}
              <h2 className="text-3xl font-headline mb-4 text-primary/90">Categorías de Poemas</h2>
              <div className="grid grid-cols-2 gap-4">
                {poemCategories.map(cat => renderCategoryCard(cat))}
              </div>
            </TabsContent>
            
            <TabsContent value="images" className="pt-6">
                <h2 className="text-3xl font-headline mb-4 text-primary/90">Categorías de Imágenes</h2>
                <div className="grid grid-cols-2 gap-4">
                    {imageCategories.map(cat => renderCategoryCard(cat))}
                </div>
            </TabsContent>

            <TabsContent value="multimedia" className="pt-6">
                <h2 className="text-3xl font-headline mb-4 text-primary/90">Categorías de Multimedia</h2>
                <div className="grid grid-cols-2 gap-4">
                    {multimediaCategories.length > 0 ? (
                        multimediaCategories.map(cat => renderCategoryCard(cat))
                    ) : (
                       <p className="col-span-2 text-center text-muted-foreground">Aún no hay categorías de multimedia. ¡Crea una en el panel de administrador!</p>
                    )}
                </div>
            </TabsContent>
          </Tabs>
      </div>
    </main>
  );
}
