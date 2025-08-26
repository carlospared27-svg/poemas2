// src/app/recite/[reciteId]/page.tsx

import { getPoemById, getAllPoems } from "@/lib/actions";
import { ReciteClient } from "./ReciteClient";
import { Poem } from "@/lib/poems-data";

export async function generateStaticParams() {
  const poems = await getAllPoems();

  // Devolvemos un array de objetos donde la clave AHORA es 'reciteId'
  return poems.map((poem) => ({
    reciteId: poem.id,
  }));
}

// La página ahora recibe 'reciteId' en los parámetros
export default async function RecitePage({ params }: { params: { reciteId: string } }) {
  // Usamos el nuevo nombre del parámetro para buscar el poema
  const poemId = params.reciteId;
  
  const poem = await getPoemById(poemId) as Poem | null;

  if (!poem) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-900 text-white">
        <p>Poema no encontrado (ID: {poemId}).</p>
      </div>
    );
  }

  return <ReciteClient poem={poem} />;
}