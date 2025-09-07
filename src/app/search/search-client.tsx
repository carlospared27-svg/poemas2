
// Ruta: src/app/search/search-client.tsx
"use client";

import * as React from "react";
import algoliasearch from "algoliasearch/lite";
import { InstantSearch, SearchBox, useHits, Configure } from "react-instantsearch";
import { useRouter } from "next/navigation";
import { Poem } from "@/lib/poems-service";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { SearchResultsDisplay } from "./search-results-display";

// Inicializa el cliente de Algolia de forma segura
const searchClient = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID!,
  process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY!
);

export function SearchClient({ initialQuery }: { initialQuery: string }) {
  const router = useRouter();

  return (
    <InstantSearch
      searchClient={searchClient}
      indexName="poems"
      initialUiState={{
        poems: {
          query: initialQuery,
        },
      }}
    >
      <Configure hitsPerPage={12} />
      
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm p-4 border-b">
        <div className="container mx-auto flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="w-5 h-5" />
            <span className="sr-only">Volver</span>
          </Button>

          <SearchBox
            placeholder="Buscar poemas, autores o frases..."
            className="flex-1"
            classNames={{
                root: 'w-full',
                input: 'w-full pl-10 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
                submitIcon: 'hidden',
                resetIcon: 'hidden',
            }}
          />
        </div>
      </header>
      
      <main className="flex-1 container mx-auto py-8 px-4">
        <CustomHits />
      </main>
    </InstantSearch>
  );
}

function CustomHits() {
  const { hits, results } = useHits();
  const searchQuery = results?.query || "";
  
  // Se pasan los 'hits' directamente como están.
  // El componente de visualización se encargará de mapear objectID a id.
  const poems = hits as unknown as (Poem & { category: string, objectID: string })[];

  return <SearchResultsDisplay poems={poems} searchQuery={searchQuery} />;
}
