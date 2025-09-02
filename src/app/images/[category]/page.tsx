// app/images/[category]/page.tsx

import { getCategories, getImagesForCategory } from "@/lib/actions";
import { ImageGalleryClient } from "./ImageGalleryClient"; 

export const dynamic = 'force-dynamic';
export const revalidate = 0;

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

  // Renderizamos el componente cliente, pasándole las imágenes
  // Incluso si initialImages está vacío, el cliente ahora se encarga de mostrar la UI correcta.
  return <ImageGalleryClient initialImages={initialImages} categoryName={categoryName} />;
}
