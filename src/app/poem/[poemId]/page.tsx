// src/app/poem/[poemId]/page.tsx

import { getPoemById, getAllPoems } from "@/lib/actions";
import { PoemClient } from "./PoemClient";
import { Poem } from "@/lib/poems-data";

export async function generateStaticParams() {
  const poems = await getAllPoems();
  return poems.map((poem) => ({
    poemId: poem.id,
  }));
}

export default async function PoemPage({ params }: { params: { poemId: string } }) {
  const { poemId } = params;
  const poem = await getPoemById(poemId);

  return <PoemClient poem={poem as Poem | null} />;
}
