"use client";

import {
  Heart,
  Home,
  Info,
  Share2,
  Star,
  Moon,
  Sun,
  Send,
  AudioLines,
  LogIn,
  LogOut,
  UserCircle,
  Sparkles,
  Loader2,
  Mail,
  KeyRound,
  ShieldCheck,
  FilePlus2, // 1. Importamos el nuevo ícono
} from "lucide-react";
import Image from "next/image";
import {
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useTheme } from "next-themes";
import { useToast } from "@/hooks/use-toast";
import { useRouter, usePathname } from "next/navigation";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useSidebar } from "../ui/sidebar";
import { playSound } from "@/lib/sound-service";
import * as React from "react";
import { Skeleton } from "../ui/skeleton";
import { useAuth } from "../auth-provider";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";


export function SidebarNav() {
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const router = useRouter();
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();
  const [isMounted, setIsMounted] = React.useState(false);
  const { user, isAdmin, signInWithGoogle, signInWithEmail, signOut, loading, isSigningIn } = useAuth();
  
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);


  React.useEffect(() => {
    setIsMounted(true);
  }, []);


  const handleNavigation = (path: string) => {
    if (pathname !== path) {
      router.push(path);
    }
    setOpenMobile(false);
  };
  
  const handleRateApp = () => {
    toast({
      title: "Abriendo tienda de aplicaciones...",
      description: "Serás redirigido para calificar la aplicación.",
    });
    setOpenMobile(false);
  };

  const handleShareApp = async () => {
    setOpenMobile(false);
    try {
      if (navigator.share) {
        await navigator.share({
          title: "Poemas & Versos",
          text: "¡Descubre miles de poemas y frases de amor en esta increíble aplicación!",
          url: window.location.origin,
        });
      } else {
        throw new Error("Web Share API not supported");
      }
    } catch (error) {
      navigator.clipboard.writeText(window.location.origin);
      toast({
        title: "Enlace copiado",
        description: "El enlace a la app ha sido copiado a tu portapapeles.",
      });
    }
  };

  const handleAuthAction = async () => {
    setOpenMobile(false);
    if(user) {
      await signOut();
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const loggedInUser = await signInWithEmail(email, password);
    if (loggedInUser) {
      setIsDialogOpen(false);
      setEmail("");
      setPassword("");
    }
  };

  const handleGoogleLogin = async () => {
    const loggedInUser = await signInWithGoogle();
     if (loggedInUser) {
      setIsDialogOpen(false);
    }
  }


  const menuItems = [
    { path: "/", icon: <Home />, label: "Inicio" },
    { path: "/collections", icon: <Heart />, label: "Mis Colecciones" },
    { path: "/recitals", icon: <AudioLines />, label: "Mis Recitados" },
    { path: "/submit", icon: <Send />, label: "Enviar Poema" },
    { path: "#", icon: <Star />, label: "Califícanos", action: handleRateApp },
    { path: "#", icon: <Share2 />, label: "Compartir App", action: handleShareApp },
    { path: "/about", icon: <Info />, label: "Sobre la App" },
  ];
  
  const renderAuthButton = () => {
      if (loading) return <Skeleton className="h-9 w-full" />;

      if (user) {
          return (
             <SidebarMenuItem>
                <SidebarMenuButton onClick={handleAuthAction} className="justify-start font-body text-base">
                    <LogOut />
                    <span>Cerrar Sesión</span>
                </SidebarMenuButton>
            </SidebarMenuItem>
          )
      }

      return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <SidebarMenuItem>
              <SidebarMenuButton className="justify-start font-body text-base">
                <LogIn />
                <span>Login Admin</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Acceso de Administrador</DialogTitle>
              <DialogDescription>
                Inicia sesión para administrar el contenido de la aplicación.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <Button onClick={handleGoogleLogin} disabled={isSigningIn} variant="outline">
                {isSigningIn ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 381.5 512 244 512 110.3 512 0 398.4 0 256S110.3 0 244 0c73 0 135.8 29.1 182.4 75.3l-65.8 64.2C335.5 113.5 293.6 95.2 244 95.2 156.1 95.2 86.1 165.2 86.1 253.9s70 158.7 157.9 158.7c66.2 0 111.4-28.9 132.9-49.8 17.9-17.9 29.1-41.4 34.9-73.1H244V261.8h244z"></path></svg>}
                Iniciar sesión con Google
              </Button>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">O continúa con</span>
                </div>
              </div>
              <form onSubmit={handleEmailLogin} className="space-y-4">
                <div className="relative">
                   <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                   <Input id="email" type="email" placeholder="correo@ejemplo.com" value={email} onChange={(e) => setEmail(e.target.value)} required className="pl-10" />
                </div>
                <div className="relative">
                   <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                   <Input id="password" type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} required className="pl-10" />
                </div>
                <Button type="submit" className="w-full" disabled={isSigningIn}>
                  {isSigningIn && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Iniciar Sesión
                </Button>
              </form>
            </div>
          </DialogContent>
        </Dialog>
      )
  }


  const renderThemeToggle = () => {
    if (!isMounted) {
      return <Skeleton className="h-6 w-full" />;
    }
    return (
        <div className="flex items-center justify-between">
          <Label htmlFor="dark-mode" className="flex items-center gap-2 cursor-pointer font-body">
            {theme === "dark" ? <Moon /> : <Sun />}
            <span>Modo Oscuro</span>
          </Label>
          <Switch
            id="dark-mode"
            checked={theme === "dark"}
            onCheckedChange={(checked) => {
              playSound('toggle');
              setTheme(checked ? "dark" : "light")
            }}
            aria-label="Toggle dark mode"
          />
        </div>
    )
  }

  return (
    <>
      <SidebarHeader>
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
            <div className="relative h-10 w-10">
                <Image 
                  src="/logo.png" 
                  alt="Logo de Poemas & Versos" 
                  fill 
                  sizes="40px"
                  className="object-contain"
                />
            </div>
            <h2 className="font-headline text-2xl text-primary">
                Poemas & Versos
            </h2>
            </div>
        </div>
        {user && (
           <div className="flex items-center gap-3 pt-4 border-t border-border/50 mt-4">
              <Avatar className="h-10 w-10">
                <AvatarImage src={user.photoURL || undefined} alt={user.displayName || "User"}/>
                <AvatarFallback>
                    <UserCircle />
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-foreground">{isAdmin ? "Admin" : user.displayName}</span>
                <span className="text-xs text-muted-foreground">{user.email}</span>
              </div>
           </div>
        )}
      </SidebarHeader>
      <SidebarContent className="p-2 flex-1">
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.label}>
              <SidebarMenuButton
                onClick={item.action || (() => handleNavigation(item.path))}
                isActive={pathname === item.path}
                className="justify-start font-body text-base"
              >
                {item.icon}
                <span>{item.label}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
          
          {isAdmin && (
            <>
              <SidebarSeparator className="my-2" />
              <div className="px-3 py-1 text-xs font-semibold text-muted-foreground tracking-wider uppercase">
                Admin
              </div>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => handleNavigation('/admin/generate-poems')}
                  isActive={pathname === '/admin/generate-poems'}
                  className="justify-start font-body text-base"
                >
                  <Sparkles />
                  <span>Generar Poemas (IA)</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              {/* --- 2. NUEVO ENLACE AÑADIDO --- */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => handleNavigation('/admin/add-poem')}
                  isActive={pathname === '/admin/add-poem'}
                  className="justify-start font-body text-base"
                >
                  <FilePlus2 />
                  <span>Agregar Poema</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => handleNavigation('/admin/moderation')}
                  isActive={pathname === '/admin/moderation'}
                  className="justify-start font-body text-base"
                >
                  <ShieldCheck />
                  <span>Moderar Envíos</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </>
          )}

        </SidebarMenu>
      </SidebarContent>
       <SidebarFooter className="p-4 space-y-4">
          <SidebarSeparator />
          <div className="space-y-2">
            {renderAuthButton()}
            {renderThemeToggle()}
          </div>
      </SidebarFooter>
    </>
  );
}
