// app/multimedia/[categoryName]/page.tsx

import { getCategories, getMultimediaForCategory } from "../../../lib/actions";
import { MultimediaClient } from "./MultimediaClient";

// Esta función genera las páginas estáticas para cada categoría de multimedia
export async function generateStaticParams() {
  const allCategories = await getCategories();
  
  const multimediaCategories = allCategories.filter((cat: any) => cat.type === 'multimedia');
  
  return multimediaCategories.map((category: { name: string }) => ({
    categoryName: encodeURIComponent(category.name),
  }));
}

// Página del servidor que obtiene los datos iniciales
export default async function MultimediaCategoryPage({ params }: { params: { categoryName: string } }) {
  const categoryName = decodeURIComponent(params.categoryName);
  
  // Usamos la función importada para obtener el contenido
  const initialMedia = await getMultimediaForCategory(categoryName);

  // Renderizamos el componente cliente, pasándole los datos
  return <MultimediaClient initialMedia={initialMedia} categoryName={categoryName} />;
}