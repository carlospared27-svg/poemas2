
// app/multimedia/[categoryName]/page.tsx

import { getMultimediaForCategory } from "@/lib/actions";
import { MultimediaClient } from "./MultimediaClient";

// Página del servidor que obtiene los datos iniciales
export default async function MultimediaCategoryPage({ params }: { params: { categoryName: string } }) {
  const categoryName = decodeURIComponent(params.categoryName);
  
  // Usamos la función importada para obtener el contenido
  const initialMedia = await getMultimediaForCategory(categoryName);

  // Renderizamos el componente cliente, pasándole los datos
  return <MultimediaClient initialMedia={initialMedia} categoryName={categoryName} />;
}
