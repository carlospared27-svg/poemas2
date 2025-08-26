// src/app/images/[category]/ImageGalleryClient.tsx

"use client";

import * as React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { MainLayout } from "../../../components/layout/main-layout";
import { ImageAsset } from "../../../lib/poems-service";
import { Card } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Upload, Loader2 } from "lucide-react";
import { useAuth } from "../../../components/auth-provider";
import { useToast } from "../../../hooks/use-toast";
import { uploadImage } from "../../../lib/storage-service";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { db } from "../../../lib/firebase";

// La clave es esta línea: "export function..."
// Esto hace que el componente esté disponible para ser importado desde otros archivos.
export function ImageGalleryClient({ initialImages, categoryName }: { initialImages: ImageAsset[], categoryName: string }) {
  const router = useRouter();
  const { isAdmin } = useAuth();
  const { toast } = useToast();
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const [isUploading, setIsUploading] = React.useState(false);
  const [images, setImages] = React.useState(initialImages);

  const handleImageClick = (imageId: string) => {
    router.push(`/images/${encodeURIComponent(categoryName)}/${imageId}`);
  };
  
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file || !isAdmin) return;

      setIsUploading(true);
      const toastId = toast({ title: "Subiendo imagen..." }).id;
      
      try {
          const fileName = `images/${categoryName}/${Date.now()}-${file.name}`;
          const downloadURL = await uploadImage(file, fileName);
          
          const imagesCollection = collection(db, 'images');
          const docRef = await addDoc(imagesCollection, {
              url: downloadURL,
              alt: file.name,
              category: categoryName,
              createdAt: Timestamp.now(),
          });

          const newImage: ImageAsset = {
              id: docRef.id,
              url: downloadURL,
              alt: file.name,
              category: categoryName,
              createdAt: new Date().toISOString()
          };
          
          setImages(prevImages => [newImage, ...prevImages]);

          toast({ id: toastId, title: "¡Éxito!", description: "La imagen se ha subido correctamente." });

      } catch (error) {
          console.error("Error subiendo imagen:", error);
          toast({ id: toastId, variant: "destructive", title: "Error", description: "No se pudo subir la imagen." });
      } finally {
          setIsUploading(false);
          // Limpiar el input para poder subir el mismo archivo de nuevo si se desea
          if(event.target) event.target.value = '';
      }
  };


  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-4xl font-headline text-primary mb-8 text-center">{categoryName}</h1>
        
        {isAdmin && (
             <Card className="mb-8 p-4 flex flex-col items-center gap-4 border-primary/20">
                <p className="font-semibold text-lg text-primary/90">Panel de Administrador</p>
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
                <Button onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
                    {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                    {isUploading ? "Subiendo..." : `Subir imagen a "${categoryName}"`}
                </Button>
             </Card>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map(image => (
            <div key={image.id} className="group relative aspect-square cursor-pointer overflow-hidden rounded-lg shadow-lg" onClick={() => handleImageClick(image.id)}>
              <Image
                src={image.url}
                alt={image.alt}
                fill
                sizes="(max-width: 768px) 50vw, 33vw"
                className="object-cover transition-transform duration-300 group-hover:scale-110"
                onError={(e) => { e.currentTarget.src = `https://placehold.co/600x400/6366f1/ffffff?text=${encodeURIComponent(categoryName)}`; }}
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}