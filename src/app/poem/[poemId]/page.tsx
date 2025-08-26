// src/app/poem/[poemId]/page.tsx

import { getPoemById, getAllPoems } from "@/lib/actions";
import { PoemClient } from "./PoemClient";
import { Poem } from "@/lib/poems-data";

// Esta función genera una página estática para cada poema
export async function generateStaticParams() {
  const poems = await getAllPoems();
  return poems.map((poem) => ({
    poemId: poem.id,
  }));
}

// Esta es la página del servidor que obtiene los datos
export default async function PoemPage({ params }: { params: { poemId: string } }) {
  const { poemId } = params;
  const poem = await getPoemById(poemId) as Poem | null;

  if (!poem) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background text-foreground">
        <p>Poema no encontrado.</p>
      </div>
    );
  }

  // Pasa los datos al componente de cliente para que los muestre
  return <PoemClient poem={poem} />;
}