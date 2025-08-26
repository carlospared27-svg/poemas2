"use client";

import * as React from "react";
import {
  Sidebar,
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import { SidebarNav } from "./sidebar-nav";
import { Heart, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "../ui/input";
import { AdBannerPlaceholder } from "@/components/ad-banner-placeholder"; // 1. Importa tu componente

type MainLayoutProps = {
  children: React.ReactNode;
  showHeader?: boolean;
};

export function MainLayout({ children, showHeader = true }: MainLayoutProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = React.useState("");

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarNav />
      </Sidebar>
      <SidebarInset>
        <div className="flex flex-col min-h-screen">
          {showHeader && (
            <header className="sticky top-0 z-20 bg-background/80 backdrop-blur-sm border-b">
              <div className="container mx-auto flex h-16 items-center justify-between gap-4 px-4">
                <div className="flex items-center gap-2">
                   <SidebarTrigger className="text-primary hover:bg-primary/10" />
                   <h1 className="text-xl font-headline text-primary">Poemas & Versos</h1>
                </div>
                <div className="flex items-center gap-2">
                   <form onSubmit={handleSearch} className="relative hidden md:block">
                     <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                     <Input 
                        type="search"
                        placeholder="Buscar poemas..."
                        className="pl-9 w-48 lg:w-64"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                     />
                   </form>
                   <Button variant="ghost" size="icon" className="text-primary hover:bg-primary/10 md:hidden" onClick={() => router.push('/search')}>
                     <Search className="h-5 w-5" />
                   </Button>
                   <Button variant="ghost" size="icon" className="text-primary hover:bg-primary/10" onClick={() => router.push('/collections')}>
                     <Heart className="h-5 w-5" />
                   </Button>
                </div>
              </div>
            </header>
          )}
          {/* 2. El contenido principal ahora está envuelto en un 'main' que se expande */}
          <main className="flex-1">{children}</main>
          {/* 3. El banner se añade al final, fuera del área de scroll */}
          <div className="w-full flex-shrink-0">
            <AdBannerPlaceholder />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}