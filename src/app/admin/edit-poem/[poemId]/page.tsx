
// src/app/admin/edit-poem/[poemId]/page.tsx
import { EditPoemClient } from "./EditPoemClient";

export const dynamic = 'force-dynamic';

export default async function EditPoemPage({ params }: { params: { poemId: string } }) {
  // El componente de servidor ahora solo se encarga de pasar los parámetros
  // al componente cliente, que contiene toda la lógica de autenticación y renderizado.
  return <EditPoemClient poemId={params.poemId} />;
}
