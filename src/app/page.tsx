// src/app/page.tsx

import * as React from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { OnboardingLoader } from "@/components/onboarding-loader";

// La página principal ahora es un Componente de Servidor puro.
// Su única responsabilidad es definir la estructura de la página.
export default function Home() {
  
  // Delegamos toda la lógica de cliente (onboarding, carga de datos en cliente)
  // al nuevo componente OnboardingLoader.
  return (
    <MainLayout>
        <OnboardingLoader />
    </MainLayout>
  );
}
