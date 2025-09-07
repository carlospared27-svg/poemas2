
"use client"

import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AboutPage() {
    const router = useRouter();

    return (
        <MainLayout>
            <header className="container mx-auto flex items-center gap-4 p-4">
                 <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => router.back()}
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span className="sr-only">Volver</span>
                </Button>
                <h1 className="text-2xl font-headline text-primary">Sobre la App</h1>
            </header>
            <main className="flex-1 container mx-auto py-8 px-4">
               <Card>
                <CardHeader>
                    <CardTitle>Poemas & Versos</CardTitle>
                </CardHeader>
                 <CardContent className="space-y-6 text-foreground/80">
                     <div>
                        <h3 className="font-semibold text-lg text-foreground mb-2">Versión</h3>
                        <p>1.0.0</p>
                    </div>
                     <Separator />
                    <div>
                        <h3 className="font-semibold text-lg text-foreground mb-2">Descripción</h3>
                        <p>Poemas & Versos es tu santuario digital para el romance. Un lugar donde puedes descubrir, crear y compartir los más bellos poemas, cartas y frases de amor. Nuestra misión es ayudarte a expresar tus sentimientos más profundos y a mantener viva la llama de la pasión.</p>
                    </div>
                    <Separator />
                    <div>
                        <h3 className="font-semibold text-lg text-foreground mb-2">Política de Privacidad</h3>
                        <div className="space-y-2 prose prose-sm max-w-none">
                            <p>En Poemas & Versos, tu privacidad es nuestra prioridad. Esta política explica qué información recopilamos y cómo la usamos.</p>
                            <p><strong>Información que Recopilamos:</strong></p>
                            <ul>
                                <li><strong>Envíos de Poemas:</strong> Si decides enviar un poema, recopilaremos el contenido que nos proporciones (título, autor y cuerpo del poema). El envío es voluntario y se almacena localmente en tu dispositivo.</li>
                            </ul>
                            <p><strong>Uso de la Información:</strong></p>
                             <ul>
                                <li>Los poemas enviados se utilizan para ser revisados por nuestro equipo con el fin de una posible publicación en la aplicación. No compartimos tu información personal con terceros.</li>
                            </ul>
                             <p><strong>Seguridad:</strong> Tomamos medidas razonables para proteger la información que nos proporcionas, pero ninguna transmisión por internet es 100% segura.</p>
                            <p><strong>Cambios a esta Política:</strong> Podemos actualizar nuestra Política de Privacidad de vez en cuando. Te notificaremos de cualquier cambio publicando la nueva política en esta página.</p>
                        </div>
                    </div>
                 </CardContent>
               </Card>
            </main>
        </MainLayout>
    )
}
