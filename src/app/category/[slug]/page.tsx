
// src/app/category/[slug]/page.tsx

import { getPoemsForCategory } from "@/lib/actions";
import { CategoryClient } from "./CategoryClient"; 

// Esta es la página del servidor
export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const categoryName = decodeURIComponent(params.slug);
  
  // Obtenemos los poemas iniciales y el cursor para la paginación desde el servicio
  const { poems, lastVisible } = await getPoemsForCategory(categoryName);
  
  // Para evitar problemas de serialización, convertimos el documento a un objeto JSON plano.
  // Es importante manejar el caso en que lastVisible sea null.
  const serializableLastDoc = lastVisible ? JSON.parse(JSON.stringify(lastVisible)) : null;

  // Renderizamos el componente de cliente, pasándole los datos iniciales
  return <CategoryClient initialPoems={poems} initialLastDoc={serializableLastDoc} />;
}
