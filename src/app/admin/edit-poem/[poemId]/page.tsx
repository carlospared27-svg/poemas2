// src/app/admin/edit-poem/[poemId]/page.tsx
import { EditPoemClient } from "./EditPoemClient";

// --- CAMBIO CLAVE: Esta página ahora es 'dynamic' y se oculta en producción ---
export const dynamic = 'force-dynamic';

export default async function EditPoemPage({ params }: { params: { poemId: string } }) {
  // Si estamos en producción, esta página no se renderizará, evitando
  // cualquier intento de ejecutar código de servidor no deseado.
  if (process.env.NODE_ENV === 'production') {
    return null;
  }
  
  // En desarrollo, simplemente pasamos el ID al componente cliente.
  // El cliente se encargará de buscar los datos.
  return <EditPoemClient poemId={params.poemId} />;
}
