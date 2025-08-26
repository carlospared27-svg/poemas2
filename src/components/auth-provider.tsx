"use client";

import * as React from "react";
import { 
  onAuthStateChanged, 
  User, 
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
// Importamos la nueva lista de correos
import { ADMIN_EMAILS } from "@/lib/config";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  isSigningIn: boolean;
  signInWithGoogle: () => Promise<User | null>;
  signInWithEmail: (email: string, password: string) => Promise<User | null>;
  signOut: () => Promise<void>;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [isAdmin, setIsAdmin] = React.useState(false);
  const [isSigningIn, setIsSigningIn] = React.useState(false);
  const { toast } = useToast();

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      // **LA CORRECCIÓN ESTÁ AQUÍ**
      // Se ha simplificado la lógica para evitar cambios de estado innecesarios.
      if (currentUser && currentUser.email) {
        setUser(currentUser);
        setIsAdmin(ADMIN_EMAILS.includes(currentUser.email));
      } else {
        setUser(null);
        setIsAdmin(false);
      }
      // Se actualiza el estado de carga una sola vez al final.
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);
  
  const signInWithGoogle = async (): Promise<User | null> => {
    if (isSigningIn) return null;
    setIsSigningIn(true);
    const provider = new GoogleAuthProvider();
    try {
        const result = await signInWithPopup(auth, provider);
        toast({ title: "¡Bienvenido/a!", description: "Has iniciado sesión correctamente." });
        return result.user;
    } catch (error: any) {
        if (error.code !== 'auth/cancelled-popup-request') {
            console.error("Error signing in with Google:", error);
            toast({ 
              variant: "destructive", 
              title: "Error de inicio de sesión", 
              description: "No se pudo iniciar sesión con Google.",
            });
        }
        return null;
    } finally {
        setIsSigningIn(false);
    }
  };

  const signInWithEmail = async (email: string, password: string): Promise<User | null> => {
    if (isSigningIn) return null;
    setIsSigningIn(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      toast({ title: "¡Bienvenido/a!", description: "Has iniciado sesión correctamente." });
      return userCredential.user;
    } catch (error: any) {
      console.error("Error signing in with email:", error);
      toast({
        variant: "destructive",
        title: "Error de inicio de sesión",
        description: "El correo o la contraseña son incorrectos.",
      });
      return null;
    } finally {
      setIsSigningIn(false);
    }
  };

  const signOut = async () => {
    try {
        await firebaseSignOut(auth);
        toast({ title: "Has cerrado sesión." });
    } catch (error) {
        console.error("Error signing out:", error);
        toast({ variant: "destructive", title: "Error", description: "No se pudo cerrar la sesión." });
    }
  };

  const value = { user, loading, isAdmin, isSigningIn, signInWithGoogle, signInWithEmail, signOut };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
