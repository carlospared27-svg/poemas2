
// src/app/images/[category]/ImageGalleryClient.tsx

"use client";

import * as React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { MainLayout } from "../../../components/layout/main-layout";
import { ImageAsset } from "../../../lib/poems-service";
import { Button } from "../../../components/ui/button";
import { Upload, Loader2, Trash2 } from "lucide-react";
import { useAuth } from "../../../components/auth-provider";
import { useToast } from "../../../hooks/use-toast";
import { uploadImage } from "../../../lib/storage-service";
import { addDoc, collection, Timestamp, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { Skeleton } from "@/components/ui/skeleton";
import { deleteImage } from "@/lib/actions";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

export function ImageGalleryClient({ initialImages, categoryName }: { initialImages: ImageAsset[], categoryName:string }) {
  const router = useRouter();
  const { isAdmin } = useAuth();
  const { toast } = useToast();
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const [isUploading, setIsUploading] = React.useState(false);
  const [images, setImages] = React.useState(initialImages);
  
  const [imageToDelete, setImageToDelete] = React.useState<ImageAsset | null>(null);


  const handleImageClick = (imageId: string) => {
    router.push(`/images/${encodeURIComponent(categoryName)}/${imageId}`);
  };
  
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;
      if (!files || files.length === 0 || !isAdmin) return;

      setIsUploading(true);
      const toastId = toast({ title: `Subiendo ${files.length} imagen(es)...` }).id;
      
      try {
        const uploadPromises = Array.from(files).map(async (file) => {
          const fileName = `images/${categoryName}/${Date.now()}-${file.name}`;
          const downloadURL = await uploadImage(file, fileName);
          
          const imagesCollection = collection(db, 'images');
          const docRef = await addDoc(imagesCollection, {
              url: downloadURL,
              alt: file.name,
              category: categoryName,
              createdAt: Timestamp.now(),
          });

          return {
              id: docRef.id,
              url: downloadURL,
              alt: file.name,
              category: categoryName,
              createdAt: new Date().toISOString()
          };
        });

        const newUploadedImages = await Promise.all(uploadPromises);
          
        setImages(prevImages => [...newUploadedImages, ...prevImages]);

        toast({ id: toastId, title: "¡Éxito!", description: `${files.length} imagen(es) subida(s) correctamente.` });

      } catch (error) {
          console.error("Error subiendo imagen:", error);
          toast({ id: toastId, variant: "destructive", title: "Error", description: "No se pudieron subir las imágenes." });
      } finally {
          setIsUploading(false);
          if(event.target) event.target.value = '';
      }
  };

  const handleDelete = async () => {
    if (!imageToDelete || !isAdmin) return;
    
    const { id, url } = imageToDelete;
    
    const toastId = toast({ title: "Eliminando imagen..." }).id;
    try {
        // Llamada a la acción del servidor
        await deleteImage(id, url);

        // Actualizar el estado local para reflejar la eliminación
        setImages(prevImages => prevImages.filter(img => img.id !== id));
        
        toast({ id: toastId, title: "¡Éxito!", description: "La imagen ha sido eliminada." });
    } catch (error) {
        console.error("Error al eliminar la imagen:", error);
        toast({ id: toastId, variant: "destructive", title: "Error", description: "No se pudo eliminar la imagen." });
    } finally {
        setImageToDelete(null); // Cierra el diálogo
    }
  };


  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
            <h1 className="text-4xl font-headline text-primary text-center sm:text-left">{categoryName}</h1>
            
            {isAdmin && (
                <div className="flex-shrink-0">
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      className="hidden" 
                      accept="image/*" 
                      onChange={handleImageUpload}
                      multiple // Permite seleccionar varios archivos
                    />
                    <Button onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
                        {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                        {isUploading ? "Subiendo..." : `Subir a "${categoryName}"`}
                    </Button>
                </div>
            )}
        </div>

        {images.length > 0 ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map(image => (
                <div key={image.id} className="group relative aspect-square overflow-hidden rounded-lg shadow-lg">
                    <div className="w-full h-full cursor-pointer" onClick={() => handleImageClick(image.id)}>
                        <Image
                            src={image.url}
                            alt={image.alt}
                            fill
                            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                            className="object-cover transition-transform duration-300 group-hover:scale-110"
                            onError={(e) => { e.currentTarget.src = `https://placehold.co/600x600/6366f1/ffffff?text=${encodeURIComponent(categoryName)}`; }}
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
                    </div>
                    {isAdmin && (
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button
                                    variant="destructive"
                                    size="icon"
                                    className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <Trash2 className="h-4 w-4"/>
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
                                    <AlertDialogCancel onClick={(e) => e.stopPropagation()}>Cancelar</AlertDialogCancel>
                                    <AlertDialogAction
                                        className="bg-destructive hover:bg-destructive/90"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setImageToDelete(image); // Guardamos la imagen a eliminar
                                            handleDelete(); // Ejecutamos la eliminación
                                        }}
                                    >
                                        Eliminar
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    )}
                </div>
              ))}
            </div>
          </>
        ) : (
          <div>
            <p className="text-center text-muted-foreground mb-8">Aún no hay imágenes en esta categoría. ¡Sube la primera!</p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="relative aspect-square">
                  <Skeleton className="h-full w-full rounded-lg" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
