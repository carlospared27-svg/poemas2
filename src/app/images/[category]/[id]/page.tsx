
// src/app/images/[category]/[id]/page.tsx

import { getCategories, getImagesForCategory } from "@/lib/actions";
import { ImageAsset } from "@/lib/poems-service";
import { ImageViewerClient } from "./ImageViewerClient"; 

// Se elimina generateStaticParams para forzar el renderizado dinámico en el servidor.
// Esto soluciona errores 500 en producción donde las variables de entorno
// necesarias para la base de datos no están disponibles durante la compilación (build).

// La página del servidor que obtiene los datos
export default async function ImageViewPage({ params }: { params: { category: string; id: string } }) {
  const categoryName = decodeURIComponent(params.category);
  const allImagesInCategory = await getImagesForCategory(categoryName);

  if (!allImagesInCategory || allImagesInCategory.length === 0) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-black text-white">
        <p>No se encontraron imágenes.</p>
      </div>
    );
  }
  
  return <ImageViewerClient initialImages={allImagesInCategory as ImageAsset[]} />;
}
