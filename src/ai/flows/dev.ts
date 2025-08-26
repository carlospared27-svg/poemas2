'use server';

import { adminDb, adminTimestamp } from '@/lib/firebase-admin';
import admin from 'firebase-admin';
import fs from 'fs/promises';
import path from 'path';

// --- TIPOS PARA LA RESPUESTA DE LA IA ---
type GeneratedPoem = {
    title: string;
    content: string;
    imageUrl?: string;
};

// --- NUEVA FUNCIÓN PARA OBTENER IMÁGENES PÚBLICAS ---
async function getPublicImages(): Promise<string[]> {
  try {
    const imageDirectory = path.join(process.cwd(), 'public', 'imagenes-poemas');
    const files = await fs.readdir(imageDirectory);
    const imagePaths = files
      .filter(file => /\.(jpg|jpeg|png|webp)$/i.test(file))
      .map(file => `/imagenes-poemas/${file}`);
    return imagePaths;
  } catch (error) {
    console.error("Error al leer el directorio de imágenes públicas:", error);
    return [];
  }
}


// --- FUNCIÓN PRINCIPAL QUE SE LLAMARÁ DESDE LA PÁGINA ---
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

    // --- BUCLE PARA GENERAR UN POEMA A LA VEZ ---
    for (let i = 0; i < numPoems; i++) {
        console.log(`Generando poema ${i + 1} de ${numPoems}...`);
        
        const textApiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${textModel}:generateContent?key=${apiKey}`;
        
        // --- PROMPT MEJORADO CON LAS NUEVAS INSTRUCCIONES ---
        const keywordMatch = prompt.match(/"(.*?)"/);
        const keyword = keywordMatch ? keywordMatch[1] : null;

        let titleInstruction = "El título debe ser creativo y estar directamente relacionado con el poema.";
        if (keyword) {
            titleInstruction = `El título debe ser creativo, estar relacionado con el poema e incluir obligatoriamente la palabra "${keyword}".`;
        }

        const generationPrompt = `Actúa como un joven poeta que escribe sobre el amor de una manera sencilla, directa y romántica, ideal para un público de 18 a 25 años. Tu tarea es generar un poema de amor basado en la siguiente idea: "${prompt}".

        Instrucciones Clave:
        1.  **Estilo y Tono:** Usa un lenguaje claro, sincero y muy romántico. Utiliza todos los signos de puntuación necesarios (comas, puntos, signos de exclamación, etc.) para darle emoción al texto. Incorpora emojis de forma natural donde aporten sentimiento.
        2.  **Formato del Poema:** Cada párrafo o estrofa del poema debe ser un bloque de texto continuo, sin saltos de línea internos (sin punto y aparte dentro de una estrofa).
        3.  **Título:** ${titleInstruction}

        Devuelve tu respuesta usando este formato estricto, sin ningún texto introductorio o de cierre:
        TITLE: [Aquí el título]
        CONTENT: [Aquí el contenido del poema]`;

        // --- PAYLOAD CON AJUSTE DE CREATIVIDAD (TEMPERATURE) ---
        const textPayload = {
            contents: [{ parts: [{ text: generationPrompt }] }],
            generationConfig: {
                temperature: 0.9, // Valor más alto para mayor creatividad
            }
        };

        const textResponse = await fetch(textApiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(textPayload)
        });

        if (!textResponse.ok) {
            console.error("Error en la API de texto:", await textResponse.text());
            continue; // Si un poema falla, continuamos con el siguiente
        }

        const textResult = await textResponse.json();
        const rawText = textResult.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!rawText) {
            console.error("La respuesta de la IA no contiene texto.");
            continue;
        }

        // --- PARSEO MEJORADO PARA MANEJAR MÚLTIPLES PÁRRAFOS ---
        const titleMarker = "TITLE:";
        const contentMarker = "CONTENT:";

        const titleIndex = rawText.indexOf(titleMarker);
        const contentIndex = rawText.indexOf(contentMarker);

        if (titleIndex === -1 || contentIndex === -1 || contentIndex < titleIndex) {
            console.error("La respuesta de la IA no tuvo el formato esperado (TITLE/CONTENT). Respuesta recibida:", rawText);
            continue;
        }

        const title = rawText.substring(titleIndex + titleMarker.length, contentIndex).trim();
        const content = rawText.substring(contentIndex + contentMarker.length).trim();

        if (!title || !content) {
            console.error("Título o contenido vacíos después del parseo. Respuesta recibida:", rawText);
            continue;
        }
        
        const poem: GeneratedPoem = {
            title: title,
            content: content,
        };

        // --- ASIGNACIÓN O GENERACIÓN DE IMAGEN (SIN CAMBIOS) ---
        if (generateImage) {
            const imageApiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${imageModel}:predict?key=${apiKey}`;
            const imagePrompt = `Una imagen artística y emotiva que represente un poema de amor titulado "${poem.title}". Estilo: pintura digital, colores suaves.`;
            const imagePayload = { instances: [{ prompt: imagePrompt }], parameters: { "sampleCount": 1 } };
            
            try {
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
                        const filePath = `poem-images/ai-${Date.now()}-${poem.title.replace(/\s+/g, '-')}.png`;
                        const file = bucket.file(filePath);
                        const buffer = Buffer.from(base64Data, 'base64');
                        await file.save(buffer, { metadata: { contentType: 'image/png' } });
                        await file.makePublic();
                        poem.imageUrl = file.publicUrl();
                    }
                }
            } catch (error) {
                console.error(`Fallo en el proceso de imagen para "${poem.title}":`, error);
            }
        } else {
            const publicImages = await getPublicImages();
            if (publicImages.length > 0) {
                const randomIndex = Math.floor(Math.random() * publicImages.length);
                poem.imageUrl = publicImages[randomIndex];
            }
        }
        
        poemsToSave.push(poem);
    }

    // --- GUARDAR LOS POEMAS EN FIRESTORE (SIN CAMBIOS) ---
    const poemsCollection = adminDb.collection('poems');
    for (const poem of poemsToSave) {
        const slug = `${category}-${poem.title}`.toLowerCase().replace(/\s+/g, '-').replace(/[?¿!¡.,]/g, '');
        
        await poemsCollection.add({
            title: poem.title,
            poem: poem.content,
            category: category,
            author: "Generado por IA",
            createdAt: adminTimestamp.now(),
            id: slug,
            image: poem.imageUrl || `https://placehold.co/600x400.png`,
            imageUrl: poem.imageUrl || `https://placehold.co/600x400.png`,
            imageHint: prompt.substring(0, 50),
            likes: 0,
            shares: 0,
        });
    }

    return poemsToSave;
}
