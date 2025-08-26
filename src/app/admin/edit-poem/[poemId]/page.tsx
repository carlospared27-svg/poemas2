// src/app/admin/edit-poem/[poemId]/page.tsx

import { getAllPoems } from "@/lib/actions";
import { EditPoemClient } from "./EditPoemClient";

// --- FUNCIÓN AÑADIDA PARA SOLUCIONAR EL ERROR DE BUILD ---
export async function generateStaticParams() {
  const poems = await getAllPoems();
  
  // Devolvemos un array con el ID de cada poema para que Next.js construya cada página de edición
  return poems.map((poem) => ({
    poemId: poem.id,
  }));
}

// Página del servidor que pasa el ID del poema al cliente
export default function EditPoemPage({ params }: { params: { poemId: string } }) {
  return <EditPoemClient poemId={params.poemId} />;
}