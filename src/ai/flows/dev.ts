
'use server';

import { z } from 'zod';
import { ai } from '@/ai/genkit';
import { addAdminPoem } from '@/lib/poems-service';
import { adminStorage } from '@/lib/firebase-admin';
import admin from 'firebase-admin';

// Esquema de entrada para el flujo de generación
const GenerateContentInputSchema = z.object({
    prompt: z.string(),
    numPoems: z.number().min(1).max(5),
    category: z.string(),
    generateImage: z.boolean(),
    textModel: z.string(),
    imageModel: z.string(),
});

// Esquema para un único poema generado
const GeneratedPoemSchema = z.object({
    title: z.string(),
    content: z.string(),
});

// Esquema de salida para el flujo
const GenerateContentOutputSchema = z.array(
    GeneratedPoemSchema.extend({
        imageUrl: z.string().optional(),
    })
);

type GenerateContentInput = z.infer<typeof GenerateContentInputSchema>;
type GeneratedPoem = z.infer<typeof GeneratedPoemSchema>;
type GenerateContentOutput = z.infer<typeof GenerateContentOutputSchema>;

// Función pública que invoca el flujo de Genkit
export async function generateContent(
    prompt: string,
    numPoems: number,
    category: string,
    generateImage: boolean,
    textModel: string,
    imageModel: string
): Promise<GenerateContentOutput> {
    return generateContentFlow({ prompt, numPoems, category, generateImage, textModel, imageModel });
}

// Prompt para generar el poema
const poemPrompt = ai.definePrompt({
    name: 'poemPrompt',
    input: { schema: z.object({ prompt: z.string(), keyword: z.string().optional() }) },
    output: { schema: GeneratedPoemSchema },
    prompt: `Actúa como un joven poeta que escribe sobre el amor de una manera sencilla, directa y romántica, ideal para un público de 18 a 25 años. Tu tarea es generar un poema de amor basado en la siguiente idea: "{{prompt}}".

    Instrucciones Clave:
    1. Estilo y Tono: Usa un lenguaje claro, sincero y muy romántico. Utiliza todos los signos de puntuación necesarios (comas, puntos, signos de exclamación, etc.) para darle emoción al texto. Incorpora emojis de forma natural donde aporten sentimiento.
    2. Formato del Poema: Cada párrafo o estrofa del poema debe ser un bloque de texto continuo, sin saltos de línea internos (sin punto y aparte dentro de una estrofa).
    {{#if keyword}}
    3. Título: El título debe ser creativo, estar relacionado con el poema e incluir obligatoriamente la palabra "{{keyword}}".
    {{else}}
    3. Título: El título debe ser creativo y estar directamente relacionado con el poema.
    {{/if}}

    Devuelve solo el objeto JSON con "title" y "content", sin texto adicional.`,
});

// Flujo principal de Genkit
const generateContentFlow = ai.defineFlow(
  {
    name: 'generateContentFlow',
    inputSchema: GenerateContentInputSchema,
    outputSchema: GenerateContentOutputSchema,
  },
  async (input) => {
    const poemsToSave: GenerateContentOutput = [];
    const keywordMatch = input.prompt.match(/"(.*?)"/);
    const keyword = keywordMatch ? keywordMatch[1] : undefined;

    for (let i = 0; i < input.numPoems; i++) {
        console.log(`Generando poema ${i + 1} de ${input.numPoems}...`);

        const { output: poem } = await poemPrompt(
          { prompt: input.prompt, keyword },
          { model: input.textModel }
        );
        if (!poem?.title || !poem?.content) continue;

        let generatedImageUri: string | undefined = undefined;

        if (input.generateImage) {
            try {
                const imagePromptText = `Una imagen artística y emotiva que represente un poema de amor titulado "${poem.title}". Estilo: pintura digital, colores suaves, romántico.`;
                const { media } = await ai.generate({
                    model: input.imageModel, 
                    prompt: imagePromptText,
                });
                
                if (media.url) {
                  generatedImageUri = media.url; // La URL de datos Base64
                }
            } catch (error) {
                console.error(`Fallo en el proceso de imagen para "${poem.title}":`, error);
            }
        }
        
        // Delegamos la subida y el guardado al servicio
        const newPoem = await addAdminPoem({
            title: poem.title,
            poem: poem.content,
            category: input.category,
            author: "Generado por IA",
            // Pasamos la URL de datos Base64 al servicio
            imageUrl: generatedImageUri, 
        });

        poemsToSave.push({ 
          title: newPoem.title,
          content: newPoem.poem,
          imageUrl: newPoem.imageUrl 
        });
    }

    return poemsToSave;
  }
);
