// Ruta: src/app/search/search-form.tsx
"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowLeft, SearchIcon } from "lucide-react";

export function SearchForm({ initialQuery }: { initialQuery: string }) {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = React.useState(initialQuery);

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const trimmedQuery = searchQuery.trim();
        if (trimmedQuery) {
            router.push(`/search?q=${encodeURIComponent(trimmedQuery)}`);
        } else {
            router.push('/search');
        }
    };

    return (
        <>
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="w-5 h-5" />
              <span className="sr-only">Volver</span>
            </Button>
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Buscar poemas..."
                  className="w-full pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </form>
        </>
    )
}