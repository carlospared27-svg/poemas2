// Ruta: src/app/search/page.tsx
import * as React from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { AdBannerPlaceholder } from "@/components/ad-banner-placeholder";
import { SearchClient } from "./search-client"; // Importamos el nuevo componente cliente

export default function SearchPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const query = typeof searchParams?.q === 'string' ? searchParams.q : "";

  return (
    <MainLayout showHeader={false}>
      <div className="flex flex-col min-h-screen">
        {/* El componente SearchClient ahora contiene toda la lógica de búsqueda y la UI */}
        <SearchClient initialQuery={query} />
        <AdBannerPlaceholder />
      </div>
    </MainLayout>
  );
}
