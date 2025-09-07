
// src/app/poem/[poemId]/page.tsx

import { getPoemById } from "@/lib/actions";
import { PoemClient } from "./PoemClient";
import { Poem } from "@/lib/poems-service";

export default async function PoemPage({ params }: { params: { poemId: string } }) {
  const { poemId } = params;
  const poem = await getPoemById(poemId);

  return <PoemClient poem={poem as Poem | null} />;
}
