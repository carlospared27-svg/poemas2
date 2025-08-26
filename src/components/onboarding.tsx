"use client";

import * as React from "react";
import Image from "next/image";
import { type CarouselApi } from "@/components/ui/carousel";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type OnboardingStep = {
  illustration: {
    src: string;
    alt: string;
  };
  title: string;
  text: string;
};

// --- CORRECCIÓN: Actualizadas las rutas de las imágenes ---
const onboardingSteps: OnboardingStep[] = [
  {
    illustration: {
      src: "/intro/copiar-pegar.png",
      alt: "Ilustración sobre copiar y pegar poemas.",
    },
    title: "Copiar y Pegar",
    text: "Puedes copiar el texto y pegarlo en tu aplicación favorita si deseas editarlo o compartirlo de una vez.",
  },
  {
    illustration: {
      src: "/intro/compartir.png",
      alt: "Ilustración sobre compartir poemas.",
    },
    title: "Compartir",
    text: "Puedes enviar de una vez el texto compartiéndolo con tu aplicación favorita.",
  },
  {
    illustration: {
      src: "/intro/favoritos.png",
      alt: "Ilustración sobre guardar poemas en favoritos.",
    },
    title: "Favoritos",
    text: "Puedes tener el texto que más te guste como favorito en el menú.",
  },
];

type OnboardingProps = {
  onComplete: () => void;
};

export function Onboarding({ onComplete }: OnboardingProps) {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  const handleNext = () => {
    api?.scrollNext();
  };

  const isLastStep = current === count && count > 0;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background p-4 animate-in fade-in-50">
      <Button
        variant="ghost"
        className="absolute top-4 right-4 font-headline text-lg"
        onClick={onComplete}
      >
        Saltar
      </Button>
      <div className="w-full max-w-md">
        <Carousel setApi={setApi} className="w-full">
          <CarouselContent>
            {onboardingSteps.map((step, index) => (
              <CarouselItem key={index}>
                <div className="p-1">
                  <Card className="overflow-hidden border-0 shadow-none bg-transparent">
                    <CardContent className="flex flex-col h-[65svh] items-center justify-center p-6 text-center gap-8">
                      <Image
                        src={step.illustration.src}
                        alt={step.illustration.alt}
                        width={280}
                        height={280}
                        className="rounded-xl object-contain shadow-lg"
                      />
                      <div className="space-y-3">
                        <h2 className="text-3xl font-headline text-primary">
                          {step.title}
                        </h2>
                        <p className="text-foreground/80 text-lg">{step.text}</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>

      <div className="absolute bottom-12 flex flex-col items-center gap-6 w-full px-8">
        <div className="flex gap-2">
          {Array.from({ length: count }).map((_, i) => (
            <button
              key={i}
              onClick={() => api?.scrollTo(i)}
              className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${
                current === i + 1 ? "w-6 bg-primary" : "bg-primary/30"
              }`}
              aria-label={`Ir a la diapositiva ${i + 1}`}
              aria-current={current === i + 1}
            />
          ))}
        </div>
        {isLastStep ? (
          <Button size="lg" className="w-full max-w-xs font-headline text-lg rounded-full" onClick={onComplete}>
            Empezar
          </Button>
        ) : (
          <Button size="lg" className="w-full max-w-xs font-headline text-lg rounded-full" onClick={handleNext}>
            Siguiente →
          </Button>
        )}
      </div>
    </div>
  );
}
