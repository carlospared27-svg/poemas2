"use client"; // Los componentes de error deben ser Componentes de Cliente

import * as React from 'react';
import { Button } from '@/components/ui/button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    // Opcional: Registrar el error en un servicio de reportes
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-4 text-center">
      <h2 className="text-2xl font-bold text-destructive mb-4">¡Ups! Algo salió mal.</h2>
      <p className="mb-4">Ha ocurrido un error inesperado al intentar cargar esta página.</p>
      
      {/* Mostramos el mensaje de error para poder depurarlo */}
      <details className="mb-6 p-4 bg-muted rounded-md text-sm overflow-auto max-w-full text-left">
        <summary className="cursor-pointer font-semibold">Detalles del Error</summary>
        <pre className="mt-2">
          <code>
            {error.message || "No se proporcionó un mensaje de error."}
          </code>
        </pre>
      </details>
      
      <Button
        onClick={
          // Intenta recuperarse volviendo a renderizar el segmento
          () => reset()
        }
      >
        Intentar de nuevo
      </Button>
    </div>
  );
}
