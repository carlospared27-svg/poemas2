

"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";
import { Onboarding } from "@/components/onboarding";
import { MainApp } from "@/components/main-app";
import { Poem, Category } from "@/lib/poems-service";

type OnboardingLoaderProps = {
    initialDailyPoem: Poem | null;
    initialCategories: Category[];
    initialCategoryImages: string[];
};

// Este componente es el responsable de manejar la lógica del lado del cliente
// para decidir si muestra la pantalla de Onboarding o la aplicación principal.
export function OnboardingLoader({ initialDailyPoem, initialCategories, initialCategoryImages }: OnboardingLoaderProps) {
    const [showOnboarding, setShowOnboarding] = React.useState<boolean | null>(null);

    React.useEffect(() => {
        // Se asegura de que este código solo se ejecute en el navegador.
        if (typeof window !== 'undefined') {
            const onboardingCompleted = localStorage.getItem("amor-expressions-onboarding-v1") === "true";
            setShowOnboarding(!onboardingCompleted);
        }
    }, []);

    const handleOnboardingComplete = () => {
        localStorage.setItem("amor-expressions-onboarding-v1", "true");
        setShowOnboarding(false);
    };
    
    // Muestra un indicador de carga mientras se verifica el estado del onboarding.
    if (showOnboarding === null) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-background">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    // Si el onboarding no se ha completado, lo muestra.
    if (showOnboarding) {
        return <Onboarding onComplete={handleOnboardingComplete} />;
    }

    // Si el onboarding ya se completó, muestra la aplicación principal
    // con los datos precargados desde el servidor.
    return (
        <MainApp 
            initialDailyPoem={initialDailyPoem} 
            initialCategories={initialCategories}
            initialCategoryImages={initialCategoryImages}
        />
    );
}
