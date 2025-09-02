// src/app/category/[slug]/page.tsx

import { getCategories, getPoemsForCategory } from "@/lib/poems-service";
import { CategoryClient } from "./CategoryClient"; 
import { Poem } from "@/lib/poems-data";

// Define la cantidad de poemas por página como una constante
const POEMS_PER_PAGE = 6;

// Esta función se ejecuta en el servidor durante la compilación
export async function generateStaticParams() {
  const categories = await getCategories();
  return categories
    .filter((category: any) => category.type === 'poema') // Asegurarnos de que solo sean categorías de poemas
    .map((category: { name: string }) => ({
      slug: encodeURIComponent(category.name),
    }));
}

// Esta es la página del servidor
export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const categoryName = decodeURIComponent(params.slug);
  
  // Obtenemos SOLO los poemas iniciales en el servidor
  const initialPoems: Poem[] = await getPoemsForCategory(categoryName, POEMS_PER_PAGE);

  // Renderizamos el componente de cliente, pasándole los datos iniciales
  return <CategoryClient initialPoems={initialPoems} />;
}
