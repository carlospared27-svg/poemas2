
// app/images/[category]/[id]/ImageViewerClient.tsx

"use client";

import * as React from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { Heart, Download, Share2, X, Wallpaper, Trash2 } from "lucide-react";
// --- CORRECCIÓN: Rutas ajustadas para subir de nivel ---
import { Button } from "../../../../components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "../../../../components/ui/carousel";
import { useToast } from "../../../../hooks/use-toast";
import { useAuth } from "../../../../components/auth-provider";
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
} from "../../../../components/ui/alert-dialog";
import { deleteImageFromStorage } from "../../../../lib/storage-service";
import { db } from "../../../../lib/firebase";
import { doc, deleteDoc } from "firebase/firestore";
import { ImageAsset } from "../../../../lib/poems-service";

// El resto del componente permanece igual, ya que la lógica era correcta.
export function ImageViewerClient({ initialImages }: { initialImages: ImageAsset[] }) {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const { isAdmin } = useAuth();

  const [api, setApi] = React.useState<CarouselApi>();
  const [images, setImages] = React.useState<ImageAsset[]>(initialImages);
  const [showTools, setShowTools] = React.useState(true);
  const [isFavorite, setIsFavorite] = React.useState(false);

  const imageId = params.id as string;

  React.useEffect(() => {
    if (!api || images.length === 0) return;
    const initialIndex = images.findIndex((img) => img.id === imageId);
    if (initialIndex !== -1) {
      api.scrollTo(initialIndex, true);
    }
  }, [api, images, imageId]);
  
  const handleDownload = async () => {
    const currentImage = images[api?.selectedScrollSnap() || 0];
    if (!currentImage) return;
    try {
      const response = await fetch(currentImage.url);
      if (!response.ok) throw new Error("Network response was not ok.");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${currentImage.id}.png`; 
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      toast({ title: "Descargada", description: "La imagen se ha guardado en tu dispositivo." });
    } catch (error) {
      console.error("Error al descargar la imagen:", error);
      toast({ variant: "destructive", title: "Error", description: "No se pudo descargar la imagen." });
    }
  };
  
  const handleShare = async () => {
    const currentImage = images[api?.selectedScrollSnap() || 0];
    if (!currentImage) return;
    if (navigator.share) {
        try {
            const response = await fetch(currentImage.url);
            const blob = await response.blob();
            const file = new File([blob], `${currentImage.id}.png`, { type: 'image/png' });
            await navigator.share({
                title: 'Mira esta imagen increíble',
                text: `Te comparto esta imagen desde Amor Expressions.`,
                files: [file],
            });
        } catch (error) {
            if ((error as Error).name !== 'AbortError') {
                toast({ variant: "destructive", title: "Error", description: "No se pudo compartir la imagen." });
            }
        }
    } else {
        toast({ variant: "destructive", title: "No compatible", description: "Tu navegador no soporta compartir archivos." });
    }
  };
  
  const handleSetWallpaper = () => {
      toast({
          title: "¡Casi listo!",
          description: "Descarga la imagen primero y luego establécela como fondo de pantalla desde la galería de tu teléfono.",
      });
  }

  const handleDeleteImage = async () => {
    const currentImage = images[api?.selectedScrollSnap() || 0];
    if (!currentImage) return;
    try {
        await deleteImageFromStorage(currentImage.url);
        const imageDocRef = doc(db, 'images', currentImage.id);
        await deleteDoc(imageDocRef);
        
        toast({ title: "Imagen eliminada", description: "La imagen ha sido eliminada permanentemente." });
        
        const newImages = images.filter(img => img.id !== currentImage.id);
        setImages(newImages); // Actualizamos el estado para remover la imagen del carrusel

        if (newImages.length > 0) {
            // Si quedan imágenes, no hacemos nada, el carrusel se ajusta solo.
        } else {
            // Si no quedan imágenes, volvemos a la página anterior (la galería)
            router.back();
        }
    } catch (error) {
        toast({ variant: "destructive", title: "Error", description: "No se pudo eliminar la imagen." });
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center" onClick={() => setShowTools(!showTools)}>
      <Button
        variant="ghost"
        size="icon"
        className={`absolute top-4 right-4 z-20 text-white hover:bg-white/10 hover:text-white transition-opacity ${showTools ? 'opacity-100' : 'opacity-0'}`}
        onClick={(e) => { e.stopPropagation(); router.back(); }}
      >
        <X />
      </Button>

      <Carousel setApi={setApi} className="w-full h-full">
        <CarouselContent>
          {images.map((image, index) => (
            <CarouselItem key={image.id}>
              <div className="w-full h-full flex items-center justify-center p-4">
                <Image
                  src={image.url}
                  alt={image.alt}
                  width={1080}
                  height={1920}
                  className="object-contain w-auto h-auto max-w-full max-h-full"
                  priority={index === images.findIndex(img => img.id === imageId)}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        {images.length > 1 && <>
            <CarouselPrevious className={`left-4 text-white bg-black/30 border-none hover:bg-white/20 hover:text-white transition-opacity ${showTools ? 'opacity-100' : 'opacity-0'}`} />
            <CarouselNext className={`right-4 text-white bg-black/30 border-none hover:bg-white/20 hover:text-white transition-opacity ${showTools ? 'opacity-100' : 'opacity-0'}`} />
        </>}
      </Carousel>

      <div
        className={`absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/70 via-black/50 to-transparent p-4 transition-transform ${
          showTools ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="container mx-auto flex justify-evenly items-center">
            <Button variant="ghost" size="lg" className="flex-col h-auto text-white hover:bg-white/10 hover:text-white" onClick={(e) => { e.stopPropagation(); setIsFavorite(!isFavorite); }}>
                <Heart className={`w-7 h-7 mb-1 ${isFavorite ? 'text-red-500 fill-current' : ''}`} />
                <span className="text-xs">Favorito</span>
            </Button>
             <Button variant="ghost" size="lg" className="flex-col h-auto text-white hover:bg-white/10 hover:text-white" onClick={(e) => { e.stopPropagation(); handleDownload(); }}>
                <Download className="w-7 h-7 mb-1" />
                <span className="text-xs">Descargar</span>
            </Button>
            <Button variant="ghost" size="lg" className="flex-col h-auto text-white hover:bg-white/10 hover:text-white" onClick={(e) => { e.stopPropagation(); handleSetWallpaper(); }}>
                <Wallpaper className="w-7 h-7 mb-1" />
                <span className="text-xs">Fondo</span>
            </Button>
            <Button variant="ghost" size="lg" className="flex-col h-auto text-white hover:bg-white/10 hover:text-white" onClick={(e) => { e.stopPropagation(); handleShare(); }}>
                <Share2 className="w-7 h-7 mb-1" />
                <span className="text-xs">Compartir</span>
            </Button>
             {isAdmin && (
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                         <Button variant="ghost" size="lg" className="flex-col h-auto text-destructive/80 hover:bg-destructive/20 hover:text-destructive" onClick={(e) => { e.stopPropagation(); }}>
                            <Trash2 className="w-7 h-7 mb-1" />
                            <span className="text-xs">Eliminar</span>
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                        <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción eliminará la imagen permanentemente de la base de datos y del almacenamiento. No se puede deshacer.
                        </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteImage} className="bg-destructive hover:bg-destructive/90">Eliminar</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            )}
        </div>
      </div>
    </div>
  );
}
