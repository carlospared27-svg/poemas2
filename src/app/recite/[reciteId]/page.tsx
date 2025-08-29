// src/app/recite/[reciteId]/page.tsx

import { getPoemById, getAllPoems } from "@/lib/actions";
import { Poem } from "@/lib/poems-data";
import dynamic from 'next/dynamic';
import { Skeleton } from "@/components/ui/skeleton";

// --- IMPORTACIÓN DINÁMICA ---
// Esto le dice a Next.js que cargue ReciteClient solo en el navegador.
// La función .then(mod => mod.ReciteClient) es necesaria para que funcione con exportaciones por defecto.
const ReciteClient = dynamic(() => import('./ReciteClient').then(mod => mod.ReciteClient), {
  ssr: false, // Desactivamos la renderización en el servidor (SSR)
  loading: () => <ReciteSkeleton />, // Mostramos un esqueleto de carga mientras el componente se carga
});

export async function generateStaticParams() {
  const poems = await getAllPoems();
  return poems.map((poem) => ({
    reciteId: poem.id,
  }));
}

// La página ahora recibe 'reciteId' en los parámetros
export default async function RecitePage({ params }: { params: { reciteId: string } }) {
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

// --- NUEVO COMPONENTE DE CARGA ---
// Un componente simple para mostrar mientras se carga la página de recitado.
function ReciteSkeleton() {
    return (
        <div className="flex h-screen w-full flex-col bg-gray-900 text-white p-4 sm:p-8">
            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 overflow-y-auto rounded-lg bg-black/30 backdrop-blur-sm p-6">
                <Skeleton className="h-10 w-3/4 rounded-md bg-gray-700" />
                <div className="space-y-2 w-full">
                    <Skeleton className="h-8 w-full rounded-md bg-gray-700" />
                    <Skeleton className="h-8 w-full rounded-md bg-gray-700" />
                    <Skeleton className="h-8 w-5/6 rounded-md bg-gray-700" />
                </div>
            </div>
            <div className="flex-shrink-0 mt-6 space-y-4">
                <Skeleton className="h-32 w-full rounded-lg bg-gray-800" />
                <Skeleton className="h-32 w-full rounded-lg bg-gray-800" />
            </div>
        </div>
    )
}