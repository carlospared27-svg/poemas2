// src/app/recite/[reciteId]/page.tsx

import { getPoemById, getAllPoems } from "@/lib/actions";
import { Poem } from "@/lib/poems-data";
import { ReciteLoader } from "./ReciteLoader"; // Importamos el nuevo loader

export async function generateStaticParams() {
  const poems = await getAllPoems();
  return poems.map((poem) => ({
    reciteId: poem.id,
  }));
}

export default async function RecitePage({ params }: { params: { reciteId: string } }) {
  const poemId = params.reciteId;
  const poem = (await getPoemById(poemId)) as Poem | null;

  if (!poem) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-900 text-white">
        <p>Poema no encontrado (ID: {poemId}).</p>
      </div>
    );
  }

  // La página del servidor ahora solo obtiene datos y renderiza el loader,
  // pasándole el poema. El loader se encargará de la carga dinámica en el cliente.
  return <ReciteLoader poem={poem} />;
}
