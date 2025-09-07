

import * as React from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { OnboardingLoader } from "@/components/onboarding-loader";
import { getCategories, getCategoryImages, getAllPoems } from "@/lib/actions";
import { Poem } from "@/lib/poems-service";

// La página principal ahora es un Componente de Servidor que obtiene los datos iniciales.
export default async function Home() {

  // Obtenemos todos los datos necesarios en el servidor una sola vez.
  const [categories, categoryImages, allPoems] = await Promise.all([
    getCategories(),
    getCategoryImages(),
    getAllPoems()
  ]);

  // Lógica para seleccionar un poema sugerido (diario)
  const poemsWithContent = allPoems.filter(p => p.poem && typeof p.poem === 'string' && p.category !== 'Relatos Infidelidad');
  const dailyPoem = poemsWithContent.length > 0 
    ? poemsWithContent[Math.floor(Math.random() * poemsWithContent.length)]
    : null;

  // Pasamos los datos precargados al componente cliente OnboardingLoader.
  // Es CRUCIAL que los datos pasados de un componente de Servidor a uno de Cliente
  // sean "serializables" (convertibles a JSON). Por eso, pasamos los datos directamente
  // ya que nuestro servicio ya se encarga de convertir Timestamps a strings.
  return (
    <MainLayout>
        <OnboardingLoader 
          initialDailyPoem={dailyPoem}
          initialCategories={categories}
          initialCategoryImages={categoryImages}
        />
    </MainLayout>
  );
}
