// Ruta: src/app/search/page.tsx
import * as React from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { AdBannerPlaceholder } from "@/components/ad-banner-placeholder";
import { getAllPoems } from "@/lib/poems-service";
import { SearchResults } from "./search-results";
import { SearchForm } from "./search-form";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

// Esta página ahora es un Componente de Servidor
export default function SearchPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const query = typeof searchParams?.q === 'string' ? searchParams.q : "";

  return (
    <MainLayout showHeader={false}>
      <div className="flex flex-col min-h-screen">
        <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm p-4 border-b">
          <div className="container mx-auto flex items-center gap-4">
             <SearchForm initialQuery={query} />
          </div>
        </header>
        <main className="flex-1 container mx-auto py-8 px-4">
            <Suspense fallback={<div className="flex justify-center"><Loader2 className="h-8 w-8 animate-spin"/></div>}>
                <SearchComponent serverQuery={query} />
            </Suspense>
        </main>
         <AdBannerPlaceholder />
      </div>
    </MainLayout>
  );
}

// Componente intermedio para que la búsqueda de datos se beneficie del Suspense
async function SearchComponent({ serverQuery }: { serverQuery: string }) {
    const initialPoems = await getAllPoems(serverQuery);
    return <SearchResults initialPoems={initialPoems} searchQuery={serverQuery} />;
}