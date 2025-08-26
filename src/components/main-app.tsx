"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Heart, Loader, Pause, Play, Share2, Mic, Info, Upload, Loader2, Image as ImageIcon, Maximize, PlusCircle, Video, Music } from "lucide-react";
import Image from "next/image";
import { useRouter } from 'next/navigation';
import { Poem } from "@/lib/poems-data";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/components/auth-provider";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { playSound } from "@/lib/sound-service";
import { AdBannerPlaceholder } from "@/components/ad-banner-placeholder";
import { uploadImage, uploadAudio } from "@/lib/storage-service";
import { Skeleton } from "@/components/ui/skeleton";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy, limit, updateDoc, where, doc, addDoc, Timestamp, runTransaction, increment } from "firebase/firestore";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";

function convertTimestampToString(timestamp: any): string {
    if (timestamp && typeof timestamp.toDate === 'function') {
        return timestamp.toDate().toISOString();
    }
    return timestamp;
}

type Category = {
  id: string;
  name: string;
  type: 'poema' | 'imagen' | 'multimedia';
  imageUrl?: string | null;
};
type AudioState = { isPlaying: boolean; isLoading: boolean; };
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

export function MainApp() {
  const router = useRouter();
  const { toast } = useToast();
  const { user, loading: authLoading, isAdmin } = useAuth();
  const [dailyPoem, setDailyPoem] = React.useState<Poem | null>(null);
  const [favorites, setFavorites] = React.useState<Set<string>>(new Set());
  const [isUploading, setIsUploading] = React.useState<string | null>(null);
  const fileInputRefs = React.useRef<Record<string, HTMLInputElement | null>>({});
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = React.useState(true);
  
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
  
  const localCategoryImages = React.useMemo(() => {
    return categories.map(cat => `${cat.name.toLowerCase().replace(/\s+/g, '-')}.png`);
  }, [categories]);

  React.useEffect(() => {
    const fetchCategories = async () => {
        setLoadingCategories(true);
        try {
            const categoriesCollection = collection(db, 'categories');
            const q = query(categoriesCollection);
            const querySnapshot = await getDocs(q);
            const fetchedCategories = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Category[];
            setCategories(fetchedCategories);
        } catch (error) {
            console.error("Error fetching categories (client):", error);
            toast({ variant: "destructive", title: "Error", description: "No se pudieron cargar las categorías." });
        } finally {
            setLoadingCategories(false);
        }
    }
    fetchCategories();
  }, [toast]);

  const [speechSynthesis, setSpeechSynthesis] = React.useState<SpeechSynthesis | null>(null);
  const [audioState, setAudioState] = React.useState<AudioState>({ isPlaying: false, isLoading: false });
  const utteranceRef = React.useRef<SpeechSynthesisUtterance | null>(null);
  
  React.useEffect(() => {
    const storedFavorites = localStorage.getItem(FAVORITES_KEY);
    if (storedFavorites) setFavorites(new Set(JSON.parse(storedFavorites)));

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setSpeechSynthesis(window.speechSynthesis);
    }
    
    // --- LÓGICA CORREGIDA PARA CARGAR EL POEMA SUGERIDO ---
    const loadDailyPoem = async () => {
        try {
            const poemsCollection = collection(db, 'poems');
            const q = query(poemsCollection, orderBy('createdAt', 'desc'), limit(50));
            const querySnapshot = await getDocs(q);
            if (querySnapshot.empty) {
                setDailyPoem(null);
                return;
            }

            const poems = querySnapshot.docs
                .map(doc => ({ id: doc.id, ...doc.data() } as Poem & { id: string, category: string }))
                .filter(p => p.poem && typeof p.poem === 'string') 
                .filter(poem => poem.category !== 'Relatos Infidelidad');

            if (poems.length === 0) {
                setDailyPoem(null);
                return;
            }
            
            const randomPoemData = poems[Math.floor(Math.random() * poems.length)];
            // Simplemente usamos los datos del poema como vienen, incluyendo la imageUrl
            const poem = { ...randomPoemData, createdAt: convertTimestampToString(randomPoemData.createdAt) } as Poem;
            setDailyPoem(poem);
            
        } catch (error) {
            console.error("Error loading daily poem (client):", error);
        }
    };
    loadDailyPoem();
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
    if (category.type === 'multimedia') {
        router.push(`/multimedia/${encodeURIComponent(category.name)}`);
    } else if (category.type === 'imagen') {
      router.push(`/images/${encodeURIComponent(category.name)}`);
    } else {
      router.push(`/category/${encodeURIComponent(category.name)}`);
    }
  };

  const handleCopy = (text: string) => { navigator.clipboard.writeText(text); toast({ title: "Copiado", description: "El poema ha sido copiado al portapapeles."}); };

  const handleShare = async (poem: Poem) => {
    const shareText = `${poem.title}\n\n${poem.poem}`;
    if (navigator.share) {
      try { await navigator.share({ title: poem.title, text: shareText }); }
      catch (error) { if ((error as Error).name !== 'AbortError') { toast({ variant: "destructive", title: "Error", description: "No se pudo compartir." }); } }
    } else { handleCopy(shareText); }
  };
  
  const handleToggleFavorite = async (poemId: string) => {
    const newFavorites = new Set(favorites);
    const poemRef = doc(db, "poems", poemId);
    let message = "";

    try {
      if (newFavorites.has(poemId)) {
        newFavorites.delete(poemId);
        await updateDoc(poemRef, { likes: increment(-1) });
        message = "Eliminado de Favoritos";
      } else {
        newFavorites.add(poemId);
        await updateDoc(poemRef, { likes: increment(1) });
        message = "Añadido a Favoritos";
      }
      
      setFavorites(newFavorites);
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(Array.from(newFavorites)));
      toast({ title: message });

      if (dailyPoem && dailyPoem.id === poemId) {
        setDailyPoem(prevPoem => {
          if (!prevPoem) return null;
          return {
            ...prevPoem,
            likes: prevPoem.likes + (newFavorites.has(poemId) ? 1 : -1)
          };
        });
      }

    } catch (error) {
      console.error("Error updating likes:", error);
      toast({ variant: "destructive", title: "Error", description: "No se pudo actualizar el favorito." });
    }
  };

  const playAudio = React.useCallback((text: string) => {
    if (!speechSynthesis) return;
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utteranceRef.current = utterance;
    const voices = speechSynthesis.getVoices();
    const spanishFemaleVoice = voices.find(voice => voice.lang.startsWith('es') && (voice.name.toLowerCase().includes('female') || voice.name.toLowerCase().includes('mujer')));
    utterance.voice = spanishFemaleVoice || voices.find(voice => voice.lang.startsWith('es')) || voices.find(voice => voice.default) || null;
    utterance.onstart = () => setAudioState({ isPlaying: true, isLoading: false });
    utterance.onpause = () => setAudioState(prev => ({ ...prev, isPlaying: false }));
    utterance.onresume = () => setAudioState(prev => ({ ...prev, isPlaying: true }));
    utterance.onend = () => setAudioState({ isPlaying: false, isLoading: false });
    speechSynthesis.speak(utterance);
  }, [speechSynthesis]);

  const handlePlayAudio = (text: string) => {
    if (!speechSynthesis) return;
    if (audioState.isPlaying && utteranceRef.current) return speechSynthesis.pause();
    if (speechSynthesis.paused && utteranceRef.current) return speechSynthesis.resume();
    setAudioState({ isPlaying: false, isLoading: true });
    if (speechSynthesis.getVoices().length === 0) {
        speechSynthesis.onvoiceschanged = () => playAudio(text);
    } else {
        playAudio(text);
    }
  };

  const handleRecite = (poemId: string) => router.push(`/recite/${poemId}`);
  const isNew = (poem: Poem) => new Date(poem.createdAt) > new Date(Date.now() - 24 * 60 * 60 * 1000);

  const handleUpdateCategoryImage = async (category: Category, imageUrl: string, isLocal: boolean) => {
      setIsUploading(category.name);
      const toastId = toast({ title: "Actualizando imagen..." }).id;
      try {
          let finalUrl = imageUrl;
          if (!isLocal) {
              const blob = await (await fetch(imageUrl)).blob();
              const file = new File([blob], `category-image-${Date.now()}.png`, { type: blob.type });
              const fileName = `category-backgrounds/${category.id}-${file.name}`;
              finalUrl = await uploadImage(file, fileName);
          }
          
          await updateDoc(doc(db, "categories", category.id), { imageUrl: finalUrl });
          
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
    const localImagePath = `/image-categorias/${category.name.toLowerCase().replace(/\s+/g, '-')}.png`;
    const effectiveImageUrl = category.imageUrl || localImagePath;
    
    return (
        <Card key={category.id} className="overflow-hidden group relative shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="w-full aspect-[4/3] cursor-pointer relative" onClick={() => { playSound('swoosh'); handleCategoryClick(category); }}>
                <Image 
                    src={effectiveImageUrl} 
                    alt={category.name} 
                    fill 
                    sizes="(max-width: 768px) 50vw, 33vw" 
                    className="object-cover transition-transform group-hover:scale-110"
                    onError={(e) => { e.currentTarget.src = `https://placehold.co/600x400/6366f1/ffffff?text=${encodeURIComponent(category.name)}`; }}
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />
                {!category.imageUrl && (
                    <div className="absolute inset-0 p-4 flex items-center justify-center">
                        <h3 className={`font-headline font-bold text-white text-center text-xl md:text-2xl p-2 text-shadow-md`}>{category.name}</h3>
                    </div>
                )}
            </div>
            {!authLoading && isAdmin && (
                <div className="absolute top-2 right-2 opacity-80 group-hover:opacity-100 transition-opacity">
                   <Dialog>
                        <DialogTrigger asChild>
                            <Button size="sm" variant="secondary" onClick={(e) => e.stopPropagation()} disabled={isCatUploading}>
                                {isCatUploading ? <Loader2 className="w-4 h-4 animate-spin"/> : <ImageIcon className="w-4 h-4" />}
                                <span className="ml-2 hidden sm:inline">{isCatUploading ? "Subiendo..." : "Cambiar"}</span>
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl">
                            <DialogHeader>
                                <DialogTitle>Cambiar imagen para "{category.name}"</DialogTitle>
                                <DialogDescription>
                                    Elige una imagen de la galería local o sube un nuevo archivo. La imagen se guardará en Firebase.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="py-4">
                                <h4 className="font-semibold mb-2">Seleccionar de la galería local</h4>
                                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 max-h-64 overflow-y-auto">
                                    {localCategoryImages.map(imgName => (
                                        <div key={imgName} className="relative aspect-square cursor-pointer rounded-md overflow-hidden border-2 border-transparent hover:border-primary" onClick={() => handleUpdateCategoryImage(category, `/image-categorias/${imgName}`, true)}>
                                            <Image src={`/image-categorias/${imgName}`} alt={imgName} fill sizes="100px" className="object-cover"/>
                                        </div>
                                    ))}
                                </div>
                                <div className="relative my-4">
                                    <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
                                    <div className="relative flex justify-center text-xs uppercase"><span className="bg-background px-2 text-muted-foreground">O</span></div>
                                </div>
                                <input type="file" ref={(el) => { if (el) fileInputRefs.current[category.name] = el; }} className="hidden" accept="image/*" onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if(file) handleUpdateCategoryImage(category, URL.createObjectURL(file), false);
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
                                <Button type="submit" disabled={isAddingMedia}>
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
                                <Button type="submit" disabled={isAddingMedia}>
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
              <TabsTrigger value="poems" className="rounded-none py-3 data-[state=active]:text-primary data-[state=active]:border-b-2 border-primary data-[state=active]:bg-primary/5 font-headline" onClick={() => playSound('swoosh')}>Poemas</TabsTrigger>
              <TabsTrigger value="images" className="rounded-none py-3 data-[state=active]:text-primary data-[state=active]:border-b-2 border-primary data-[state=active]:bg-primary/5 font-headline" onClick={() => playSound('swoosh')}>Imágenes</TabsTrigger>
              <TabsTrigger value="multimedia" className="rounded-none py-3 data-[state=active]:text-primary data-[state=active]:border-b-2 border-primary data-[state=active]:bg-primary/5 font-headline" onClick={() => playSound('swoosh')}>Multimedia</TabsTrigger>
            </TabsList>
            
            <TabsContent value="poems" className="pt-6">
              {dailyPoem ? (
                <section className="mb-8">
                  <h2 className="text-3xl font-headline mb-4 text-primary/90">Poema Sugerido</h2>
                    <Card className="bg-accent/20 border-accent shadow-lg hover:shadow-xl transition-shadow flex flex-col overflow-hidden">
                       <div className="relative aspect-[4/3] w-full">
                          {dailyPoem.imageUrl ? (
                            <Image src={dailyPoem.imageUrl} alt={dailyPoem.title} fill sizes="(max-width: 768px) 100vw, 50vw" priority className="object-cover"/>
                          ): <Skeleton className="h-full w-full" />}
                          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center cursor-pointer" onClick={() => router.push(`/poem/${dailyPoem.id}`)}>
                              <Maximize className="w-10 h-10 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                           {isNew(dailyPoem) && (<Badge className="absolute top-2 right-2">Nuevo</Badge>)}
                           {dailyPoem.photographerName && (
                              <Popover>
                               <PopoverTrigger asChild><Button variant="ghost" size="icon" className="absolute bottom-2 left-2 bg-black/30 hover:bg-black/50 text-white rounded-full h-8 w-8"><Info className="w-4 h-4"/></Button></PopoverTrigger>
                               <PopoverContent className="w-auto text-sm">Foto de <Link href={dailyPoem.photographerUrl || '#'} target="_blank" className="underline hover:text-primary">{dailyPoem.photographerName}</Link></PopoverContent>
                              </Popover>
                           )}
                       </div>
                      <CardContent className="flex-1 p-4"><p className="text-foreground/80 whitespace-pre-line font-body italic py-2 text-base">{dailyPoem.poem}</p></CardContent>
                      <CardFooter className="flex justify-between items-center bg-accent/30 p-2">
                        <div className="flex items-center">
                          <Button variant="ghost" size="icon" onClick={() => handleCopy(`${dailyPoem.title}\n\n${dailyPoem.poem}`)} title="Copiar poema"><Copy className="w-5 h-5" /></Button>
                          <Button variant="ghost" size="icon" onClick={() => handleShare(dailyPoem)} title="Compartir poema"><Share2 className="w-5 h-5" /></Button>
                          <Button variant="ghost" size="icon" onClick={() => handlePlayAudio(`${dailyPoem.title}. ${dailyPoem.poem}`)} disabled={audioState.isLoading} title="Reproducir poema">
                            {audioState.isLoading ? <Loader className="w-5 h-5 animate-spin" /> : audioState.isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                          </Button>
                           <Button variant="ghost" size="icon" onClick={() => handleRecite(dailyPoem.id)} title="Recitar y Grabar"><Mic className="w-5 h-5" /></Button>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => handleToggleFavorite(dailyPoem.id)} title="Añadir a favoritos">
                          <Heart className={`w-6 h-6 transition-colors ${favorites.has(dailyPoem.id) ? 'text-red-500 fill-current' : 'text-muted-foreground'}`} />
                        </Button>
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
                {loadingCategories ? ( Array.from({ length: 8 }).map((_, i) => ( <Card key={i}><Skeleton className="aspect-[4/3] w-full" /></Card> )) ) : ( poemCategories.map(cat => renderCategoryCard(cat)) )}
              </div>
            </TabsContent>
            
            <TabsContent value="images" className="pt-6">
                <h2 className="text-3xl font-headline mb-4 text-primary/90">Categorías de Imágenes</h2>
                <div className="grid grid-cols-2 gap-4">
                    {loadingCategories ? ( Array.from({ length: 8 }).map((_, i) => ( <Card key={i}><Skeleton className="aspect-[4/3] w-full" /></Card> )) ) : ( imageCategories.map(cat => renderCategoryCard(cat)) )}
                </div>
            </TabsContent>

            <TabsContent value="multimedia" className="pt-6">
                <div className="grid grid-cols-2 gap-4">
                    {loadingCategories ? ( Array.from({ length: 4 }).map((_, i) => ( <Card key={i}><Skeleton className="aspect-[4/3] w-full" /></Card> )) ) : ( 
                        multimediaCategories.length > 0 ? (
                            multimediaCategories.map(cat => renderCategoryCard(cat))
                        ) : (
                           <p className="col-span-2 text-center text-muted-foreground">Aún no hay categorías de multimedia. ¡Crea una en el panel de administrador!</p>
                        )
                    )}
                </div>
            </TabsContent>
          </Tabs>
      </div>
      <AdBannerPlaceholder />
    </main>
  );
}
