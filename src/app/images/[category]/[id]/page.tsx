
// src/app/images/[category]/[id]/page.tsx

import { getCategories, getImagesForCategory } from "../../../../lib/actions";
import { ImageAsset } from "../../../../lib/poems-service";
import { ImageViewerClient } from "./ImageViewerClient"; 

export async function generateStaticParams() {
  const allCategories = await getCategories();
  
  const imageCategories = allCategories.filter((cat: any) => cat.type === 'imagen');
  
  const params: { category: string; id: string }[] = [];

  for (const category of imageCategories) {
    const images = await getImagesForCategory(category.name);
    for (const image of images) {
      params.push({
        category: encodeURIComponent(category.name),
        id: image.id,
      });
    }
  }
  
  return params;
}

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
