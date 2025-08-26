
"use client";

import * as React from "react";
import { Onboarding } from "@/components/onboarding";
import { MainApp } from "@/components/main-app";
import { MainLayout } from "@/components/layout/main-layout";
import { Loader2 } from "lucide-react";


export default function Home() {
  const [showOnboarding, setShowOnboarding] = React.useState<boolean | null>(null);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
        const onboardingCompleted =
        localStorage.getItem("amor-expressions-onboarding-v1") === "true";
        setShowOnboarding(!onboardingCompleted);
    }
  }, []);

  const handleOnboardingComplete = () => {
    localStorage.setItem("amor-expressions-onboarding-v1", "true");
    setShowOnboarding(false);
  };
  
  if (showOnboarding === null) {
     return (
       <div className="flex items-center justify-center min-h-screen bg-background">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
     )
  }

  if (showOnboarding) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  return (
    <MainLayout>
        <MainApp />
    </MainLayout>
  );
}
