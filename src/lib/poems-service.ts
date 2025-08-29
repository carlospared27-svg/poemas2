// src/lib/poems-service.ts

'use server';

import { adminDb, adminTimestamp, adminStorage } from './firebase-admin';
import type { Poem } from './poems-data';
import fs from 'fs';
import path from 'path';

// --- NUEVO: AÑADIMOS LA CONFIGURACIÓN DE ALGOLIA AQUÍ ---
import algoliasearch from 'algoliasearch';

// Asegúrate de que tus variables de entorno estén disponibles
const algoliaClient = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID!,
  process.env.ALGOLIA_ADMIN_KEY!
);
const algoliaIndex = algoliaClient.initIndex('poems');

// --- FUNCIÓN PARA OBTENER IMÁGENES PÚBLICAS ---
export async function getPublicImages(): Promise<string[]> {
  try {
    const imageDirectory = path.join(process.cwd(), 'public', 'imagenes-poemas');
    const files = await fs.promises.readdir(imageDirectory);
    const imagePaths = files
      .filter(file => /\.(jpg|jpeg|png|webp)$/i.test(file))
      .map(file => `/imagenes-poemas/${file}`);
    return imagePaths;
  } catch (error) {
    console.error("Error al leer el directorio de imágenes públicas:", error);
    return [];
  }
}

// La función auxiliar sigue siendo útil.
function convertTimestampToString(timestamp: any): string {
    if (timestamp && typeof timestamp.toDate === 'function') {
        return timestamp.toDate().toISOString();
    }
    return timestamp;
}

// --- FUNCIÓN PARA AÑADIR POEMAS COMO ADMIN ---
type NewAdminPoemData = {
    title: string;
    poem: string;
    category: string;
    author: string;
    imageFile?: File | null;
};

// --- FUNCIÓN addAdminPoem MODIFICADA ---
// Ahora también guarda en Algolia
// --- FUNCIÓN addAdminPoem CORREGIDA Y CENTRALIZADA ---
export async function addAdminPoem(data: any): Promise<void> {
    try {
        let finalImageUrl = ""; // Para imágenes externas o generadas por IA
        let finalImage = "";    // Para imágenes locales de /public

        if (data.imageFile) {
            // Caso 1: El usuario sube un archivo manualmente
            const bucket = adminStorage.bucket();
            const filePath = `poemas-admin-imagen/${Date.now()}-${data.imageFile.name}`;
            const buffer = Buffer.from(await data.imageFile.arrayBuffer());
            await bucket.file(filePath).save(buffer, { metadata: { contentType: data.imageFile.type } });
            const file = bucket.file(filePath);
            await file.makePublic();
            finalImageUrl = file.publicUrl();
        } else if (data.imageUrl) {
            // Caso 2: La IA generó una imagen y nos pasa la URL
            finalImageUrl = data.imageUrl;
        } else {
            // Caso 3: No se subió archivo ni se generó con IA -> Asignar una aleatoria
            const publicImages = await getPublicImages();
            if (publicImages.length > 0) {
                const randomIndex = Math.floor(Math.random() * publicImages.length);
                finalImage = publicImages[randomIndex];
            }
        }

        const poemData = {
            title: data.title,
            poem: data.poem,
            category: data.category,
            author: data.author,
            imageUrl: finalImageUrl,
            image: finalImage, // Guardamos la ruta de la imagen local aquí
            createdAt: adminTimestamp.now(),
            likes: 0,
            shares: 0,
        };

        // Guardar en Firestore
        const poemsCollection = adminDb.collection('poems');
        const docRef = await poemsCollection.add(poemData);
        console.log(`Poema guardado en Firestore con ID: ${docRef.id}`);

        // Guardar en Algolia
        const algoliaObject = {
            objectID: docRef.id,
            title: poemData.title,
            poem: poemData.poem,
            author: poemData.author,
            category: poemData.category,
            createdAt: poemData.createdAt.toMillis(),
            image: poemData.image,         // <-- LÍNEA AÑADIDA
            imageUrl: poemData.imageUrl,   // <-- LÍNEA AÑADIDA
        };
        await algoliaIndex.saveObject(algoliaObject);
        console.log(`Poema con ID ${docRef.id} guardado en Algolia.`);

    } catch (error) {
        console.error("Error al añadir un nuevo poema:", error);
        throw new Error("No se pudo añadir el poema a Firestore o Algolia.");
    }
}


// --- FUNCIÓN PARA ACTUALIZAR LA IMAGEN DE UN POEMA ---
export async function updatePoemImage(poemId: string, imageUrl: string): Promise<void> {
    try {
        const poemDocRef = adminDb.collection('poems').doc(poemId);
        await poemDocRef.update({ imageUrl });
    } catch (error) {
        console.error(`Error al actualizar la imagen para el poema ${poemId}:`, error);
        throw new Error("No se pudo actualizar la imagen del poema.");
    }
}

// --- FUNCIÓN PARA ACTUALIZAR UN POEMA ---
export async function updatePoem(poemId: string, data: { title: string; poem: string }): Promise<void> {
  try {
      const poemDocRef = adminDb.collection('poems').doc(poemId);
      await poemDocRef.update({
          title: data.title,
          poem: data.poem,
      });
  } catch (error) {
      console.error(`Error al actualizar el poema ${poemId}:`, error);
      throw new Error("No se pudo actualizar el poema en Firestore.");
  }
}

// --- OTRAS FUNCIONES DE LA APLICACIÓN ---

export async function getCategories(): Promise<{ name: string, imageUrl?: string }[]> {
  try {
    const categoriesCollection = adminDb.collection('categories');
    const q = categoriesCollection.orderBy('name');
    const querySnapshot = await q.get();
    const categories = querySnapshot.docs.map(doc => ({ 
        id: doc.id,
        ...doc.data()
    })) as { id: string; name: string; imageUrl?: string }[];
    return categories;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

// --- FUNCIÓN MODIFICADA PARA PAGINACIÓN ---
export async function getPoemsForCategory(categoryName: string, limitNum: number): Promise<Poem[]> {
  try {
    const poemsCollection = adminDb.collection('poems');
    const q = poemsCollection
                .where('category', '==', categoryName)
                .orderBy('createdAt', 'desc')
                .limit(limitNum);

    const querySnapshot = await q.get();
    const poems = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          title: data.title,
          poem: data.poem,
          createdAt: convertTimestampToString(data.createdAt),
          likes: data.likes || 0,
          shares: data.shares || 0,
          imageUrl: data.imageUrl,
          image: data.image,
          photographerName: data.photographerName,
          photographerUrl: data.photographerUrl,
        } as Poem;
    });
    return poems;
  } catch (error) {
    console.error(`Error fetching poems for category ${categoryName}:`, error);
    return [];
  }
}

// --- NUEVA FUNCIÓN PARA POEMAS ALEATORIOS ---
export async function getRandomPoemsForCategory(categoryName: string, limitNum: number, excludeIds: string[]): Promise<Poem[]> {
    try {
        const poemsCollection = adminDb.collection('poems');
        const q = poemsCollection.where('category', '==', categoryName);
        const querySnapshot = await q.get();

        const allPoemIds = querySnapshot.docs.map(doc => doc.id).filter(id => !excludeIds.includes(id));
        
        if (allPoemIds.length === 0) {
            return [];
        }

        for (let i = allPoemIds.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [allPoemIds[i], allPoemIds[j]] = [allPoemIds[j], allPoemIds[i]];
        }

        const randomIdsToFetch = allPoemIds.slice(0, limitNum);
        
        if (randomIdsToFetch.length === 0) {
            return [];
        }

        const poemPromises = randomIdsToFetch.map(id => poemsCollection.doc(id).get());
        const poemDocs = await Promise.all(poemPromises);

        const poems = poemDocs.map(doc => {
            const data = doc.data()!;
            return {
                id: doc.id,
                title: data.title,
                poem: data.poem,
                createdAt: convertTimestampToString(data.createdAt),
                likes: data.likes || 0,
                shares: data.shares || 0,
                imageUrl: data.imageUrl,
                image: data.image,
                photographerName: data.photographerName,
                photographerUrl: data.photographerUrl,
            } as Poem;
        });

        return poems;
    } catch (error) {
        console.error(`Error fetching random poems for category ${categoryName}:`, error);
        return [];
    }
}

// --- FUNCIÓN REINCORPORADA ---
export async function getPoemById(poemId: string): Promise<(Poem & { category: string }) | null> {
    try {
        const poemDocRef = adminDb.collection('poems').doc(poemId);
        const poemDoc = await poemDocRef.get();

        if (!poemDoc.exists) {
            console.warn(`Poem with id ${poemId} not found.`);
            return null;
        }

        const data = poemDoc.data()!;
        return {
            id: poemDoc.id,
            title: data.title,
            poem: data.poem,
            category: data.category,
            createdAt: convertTimestampToString(data.createdAt),
            likes: data.likes || 0,
            shares: data.shares || 0,
            imageUrl: data.imageUrl,
            image: data.image,
            photographerName: data.photographerName,
            photographerUrl: data.photographerUrl,
        } as (Poem & { category: string });

    } catch (error) {
        console.error(`Error fetching poem with id ${poemId}:`, error);
        return null;
    }
}


export async function deletePoem(poemId: string): Promise<void> {
    try {
        const poemDocRef = adminDb.collection('poems').doc(poemId);
        await poemDocRef.delete();
    } catch (error) {
        console.error(`Error deleting poem with id ${poemId}:`, error);
        throw new Error("Failed to delete poem from Firestore.");
    }
}

export async function getAllPoems(): Promise<Poem[]> {
    try {
        const poemsCollection = adminDb.collection('poems');
        const querySnapshot = await poemsCollection.orderBy('createdAt', 'desc').get();
        
        return querySnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                createdAt: convertTimestampToString(data.createdAt),
            } as Poem;
        });

    } catch (error: any) {
        console.error("Error fetching all poems:", error);
        return [];
    }
}

export type ImageAsset = {
    id: string;
    url: string;
    alt: string;
    category: string;
    createdAt: string;
}

export async function getImagesForCategory(categoryName: string): Promise<ImageAsset[]> {
  try {
    const imagesCollection = adminDb.collection('images');
    const q = imagesCollection.where('category', '==', categoryName);
    const querySnapshot = await q.get();
    
    const images = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          url: data.url,
          alt: data.alt,
          category: data.category,
          createdAt: convertTimestampToString(data.createdAt),
        } as ImageAsset;
    });
    
    return images;

  } catch (error) {
    console.error(`Error fetching images for category ${categoryName}:`, error);
    return [];
  }
}

export async function getImageById(imageId: string): Promise<ImageAsset | null> {
    try {
        const imageDocRef = adminDb.collection('images').doc(imageId);
        const imageDoc = await imageDocRef.get();

        if (!imageDoc.exists) {
            console.warn(`Image with id ${imageId} not found.`);
            return null;
        }

        const data = imageDoc.data()!;
        return {
            id: imageDoc.id,
            url: data.url,
            alt: data.alt,
            category: data.category,
            createdAt: convertTimestampToString(data.createdAt),
        } as ImageAsset;

    } catch (error) {
        console.error(`Error fetching image with id ${imageId}:`, error);
        return null;
    }
}

export async function getMultimediaForCategory(categoryName: string): Promise<any[]> {
  try {
    const mediaCollection = adminDb.collection('multimedia');
    const q = mediaCollection.where('category', '==', categoryName).orderBy('createdAt', 'desc');
    const querySnapshot = await q.get();

    return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return { 
            id: doc.id, 
            ...data,
            createdAt: convertTimestampToString(data.createdAt), 
        };
    });
  } catch (error) {
    console.error(`Error fetching multimedia for category ${categoryName}:`, error);
    return [];
  }
}