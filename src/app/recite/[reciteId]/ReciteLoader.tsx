// src/app/recite/[reciteId]/ReciteLoader.tsx

"use client"; // Muy importante: declaramos que este es un componente de cliente

import dynamic from "next/dynamic";
import { Poem } from "@/lib/poems-data";
import { Skeleton } from "@/components/ui/skeleton";

// Aquí movemos la lógica de carga dinámica que estaba en page.tsx
const ReciteClientWithNoSSR = dynamic(
  () => import("./ReciteClient").then((mod) => mod.ReciteClient),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-screen w-full flex-col bg-gray-900 text-white p-4 sm:p-8 items-center justify-center">
        <Skeleton className="w-full max-w-2xl h-3/4" />
        <p className="mt-4 text-lg">Cargando grabadora...</p>
      </div>
    ),
  }
);

// Este componente simplemente recibe los datos y renderiza el componente dinámico
export function ReciteLoader({ poem }: { poem: Poem }) {
  return <ReciteClientWithNoSSR poem={poem} />;
}
