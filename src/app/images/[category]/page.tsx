
// app/images/[category]/page.tsx

import { getImagesForCategory } from "@/lib/actions";
import { ImageGalleryClient } from "./ImageGalleryClient"; 

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Página del servidor que obtiene los datos iniciales
export default async function ImageCategoryPage({ params }: { params: { category: string } }) {
  const categoryName = decodeURIComponent(params.category);
  
  // Obtenemos las imágenes para esta categoría específica
  const initialImages = await getImagesForCategory(categoryName);

  // Renderizamos el componente cliente, pasándole las imágenes
  // Incluso si initialImages está vacío, el cliente ahora se encarga de mostrar la UI correcta.
  return <ImageGalleryClient initialImages={initialImages} categoryName={categoryName} />;
}
