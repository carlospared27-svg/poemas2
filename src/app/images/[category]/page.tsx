// app/images/[category]/page.tsx

import { getCategories, getImagesForCategory } from "@/lib/actions";
import { ImageGalleryClient } from "./ImageGalleryClient"; // Cambiamos el nombre del cliente

// Le dice a Next.js qué categorías de imágenes existen para crear las páginas de galería
export async function generateStaticParams() {
  const allCategories = await getCategories();
  
  // Filtramos solo las categorías que son de tipo 'imagen'
  const imageCategories = allCategories.filter((cat: any) => cat.type === 'imagen');
  
  // Devolvemos un array con el 'slug' de cada categoría
  return imageCategories.map((category: { name: string }) => ({
    category: encodeURIComponent(category.name),
  }));
}

// Página del servidor que obtiene los datos iniciales
export default async function ImageCategoryPage({ params }: { params: { category: string } }) {
  const categoryName = decodeURIComponent(params.category);
  
  // Obtenemos las imágenes para esta categoría específica
  const initialImages = await getImagesForCategory(categoryName);

  if (!initialImages || initialImages.length === 0) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background text-foreground">
        <p>No se encontraron imágenes en la categoría "{categoryName}".</p>
      </div>
    );
  }

  // Renderizamos el componente cliente de la galería, pasándole las imágenes
  return <ImageGalleryClient initialImages={initialImages} categoryName={categoryName} />;
}