import { getCategories, getPoemsForCategory } from "@/lib/poems-service";
import { CategoryClient } from "./CategoryClient"; // Importamos el nuevo componente de cliente

// Esta función se ejecuta en el servidor durante la compilación
export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((category: { name: string }) => ({
    slug: encodeURIComponent(category.name),
  }));
}

// Esta es la página del servidor
export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const categoryName = decodeURIComponent(params.slug);
  
  // Obtenemos los poemas iniciales en el servidor
  const initialPoems = await getPoemsForCategory(categoryName);

  // Renderizamos el componente de cliente, pasándole los datos iniciales
  return <CategoryClient initialPoems={initialPoems} />;
}
