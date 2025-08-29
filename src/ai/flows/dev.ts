'use server';

import { adminDb, adminTimestamp, adminStorage } from '@/lib/firebase-admin';
import admin from 'firebase-admin';
import fs from 'fs/promises';
import path from 'path';
import { addAdminPoem } from '@/lib/poems-service';

type GeneratedPoem = {
    title: string;
    content: string;
    imageUrl?: string;
    image?: string;
};

async function getPublicImages(): Promise<string[]> {
  try {
    const imageDirectory = path.join(process.cwd(), 'public', 'imagenes-poemas');
    const files = await fs.readdir(imageDirectory);
    return files
      .filter(file => /\.(jpg|jpeg|png|webp)$/i.test(file))
      .map(file => `/imagenes-poemas/${file}`);
  } catch (error) {
    console.error("Error al leer el directorio de imágenes públicas:", error);
    return [];
  }
}

export async function generateContent(
    prompt: string,
    numPoems: number,
    category: string,
    generateImage: boolean,
    textModel: string,
    imageModel: string
): Promise<GeneratedPoem[]> {

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        throw new Error("La API Key de Gemini no está configurada en el servidor.");
    }

    const poemsToSave: GeneratedPoem[] = [];

    for (let i = 0; i < numPoems; i++) {
        console.log(`Generando poema ${i + 1} de ${numPoems}...`);
        
        const textApiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${textModel}:generateContent?key=${apiKey}`;
        const keywordMatch = prompt.match(/"(.*?)"/);
        const keyword = keywordMatch ? keywordMatch[1] : null;
        let titleInstruction = "El título debe ser creativo y estar directamente relacionado con el poema.";
        if (keyword) {
            titleInstruction = `El título debe ser creativo, estar relacionado con el poema e incluir obligatoriamente la palabra "${keyword}".`;
        }
        const generationPrompt = `Actúa como un joven poeta que escribe sobre el amor de una manera sencilla, directa y romántica, ideal para un público de 18 a 25 años. Tu tarea es generar un poema de amor basado en la siguiente idea: "${prompt}".

        Instrucciones Clave:
        1. Estilo y Tono: Usa un lenguaje claro, sincero y muy romántico. Utiliza todos los signos de puntuación necesarios (comas, puntos, signos de exclamación, etc.) para darle emoción al texto. Incorpora emojis de forma natural donde aporten sentimiento.
        2. Formato del Poema: Cada párrafo o estrofa del poema debe ser un bloque de texto continuo, sin saltos de línea internos (sin punto y aparte dentro de una estrofa).
        3. Título: ${titleInstruction}

        Devuelve tu respuesta usando este formato estricto, sin ningún texto introductorio o de cierre:
        TITLE: [Aquí el título]
        CONTENT: [Aquí el contenido del poema]`;

        const textPayload = {
            contents: [{ parts: [{ text: generationPrompt }] }],
            generationConfig: { temperature: 0.9 }
        };

        // --- SECCIÓN CORREGIDA ---
        // Aquí estaba el error. He restaurado la lógica completa para llamar a la IA.
        const textResponse = await fetch(textApiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(textPayload)
        });

        if (!textResponse.ok) {
            console.error("Error en la API de texto:", await textResponse.text());
            continue;
        }

        const textResult = await textResponse.json();
        const rawText = textResult.candidates?.[0]?.content?.parts?.[0]?.text;
        // --- FIN DE LA SECCIÓN CORREGIDA ---

        if (!rawText) {
            console.error("La respuesta de la IA no contiene texto.");
            continue;
        }
        
        const { title, content } = parsePoemFromText(rawText);
        if (!title || !content) continue;
        
        const poem: GeneratedPoem = { title, content };

        if (generateImage) {
            try {
                const imageUrlFromAI = await generateAndUploadImage(poem.title, imageModel, apiKey);
                if (imageUrlFromAI) {
                    poem.imageUrl = imageUrlFromAI;
                }
            } catch (error) {
                console.error(`Fallo en el proceso de imagen para "${poem.title}":`, error);
            }
        }
        
        poemsToSave.push(poem);
    }

    for (const poem of poemsToSave) {
        await addAdminPoem({
            title: poem.title,
            poem: poem.content,
            category: category,
            author: "Generado por IA",
            imageUrl: poem.imageUrl,
        });
    }

    return poemsToSave;
}


// --- FUNCIONES AUXILIARES ---

function parsePoemFromText(rawText: string): { title: string | null; content: string | null } {
    const titleMarker = "TITLE:";
    const contentMarker = "CONTENT:";
    const titleIndex = rawText.indexOf(titleMarker);
    const contentIndex = rawText.indexOf(contentMarker);

    if (titleIndex === -1 || contentIndex === -1 || contentIndex < titleIndex) {
        console.error("Formato de IA inesperado:", rawText);
        return { title: null, content: null };
    }

    const title = rawText.substring(titleIndex + titleMarker.length, contentIndex).trim();
    const content = rawText.substring(contentIndex + contentMarker.length).trim();
    return { title, content };
}

async function generateAndUploadImage(poemTitle: string, imageModel: string, apiKey: string): Promise<string | null> {
    const imageApiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${imageModel}:predict?key=${apiKey}`;
    const imagePrompt = `Una imagen artística y emotiva que represente un poema de amor titulado "${poemTitle}". Estilo: pintura digital, colores suaves.`;
    const imagePayload = { instances: [{ prompt: imagePrompt }], parameters: { "sampleCount": 1 } };
    
    const imageResponse = await fetch(imageApiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(imagePayload)
    });

    if (imageResponse.ok) {
        const imageResult = await imageResponse.json();
        if (imageResult.predictions && imageResult.predictions[0].bytesBase64Encoded) {
            const base64Data = imageResult.predictions[0].bytesBase64Encoded;
            const bucket = admin.storage().bucket();
            const filePath = `poem-images/ai-${Date.now()}-${poemTitle.replace(/\s+/g, '-')}.png`;
            const file = bucket.file(filePath);
            const buffer = Buffer.from(base64Data, 'base64');
            await file.save(buffer, { metadata: { contentType: 'image/png' } });
            await file.makePublic();
            return file.publicUrl();
        }
    }
    return null;
}