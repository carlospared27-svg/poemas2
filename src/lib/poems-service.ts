// src/lib/poems-service.ts

'use server';

import { adminDb, adminTimestamp, adminStorage } from './firebase-admin';
import type { Poem } from './poems-data';
import fs from 'fs';
import path from 'path';

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

export async function addAdminPoem(data: NewAdminPoemData): Promise<void> {
    try {
        let finalImageUrl = "";

        if (data.imageFile) {
            const bucket = adminStorage.bucket();
            const filePath = `poemas-admin-imagen/${Date.now()}-${data.imageFile.name}`;
            const buffer = Buffer.from(await data.imageFile.arrayBuffer());

            await bucket.file(filePath).save(buffer, {
                metadata: { contentType: data.imageFile.type },
            });
            
            const file = bucket.file(filePath);
            await file.makePublic();
            finalImageUrl = file.publicUrl();

        } else {
            const publicImages = await getPublicImages();
            if (publicImages.length > 0) {
                const randomIndex = Math.floor(Math.random() * publicImages.length);
                finalImageUrl = publicImages[randomIndex];
            } else {
                finalImageUrl = `https://placehold.co/600x400/f87171/ffffff?text=Poema`;
            }
        }

        const poemData = {
            title: data.title,
            poem: data.poem,
            category: data.category,
            author: data.author,
            imageUrl: finalImageUrl,
            createdAt: adminTimestamp.now(),
            likes: 0,
            shares: 0,
        };

        const poemsCollection = adminDb.collection('poems');
        await poemsCollection.add(poemData);

    } catch (error) {
        console.error("Error al añadir un nuevo poema (admin):", error);
        throw new Error("No se pudo añadir el poema a Firestore.");
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

export async function getPoemsForCategory(categoryName: string): Promise<(Poem & { categoryImageUrl?: string })[]> {
  try {
    const poemsCollection = adminDb.collection('poems');
    const categoriesCollection = adminDb.collection('categories');
    const categoryQuery = categoriesCollection.where('name', '==', categoryName).limit(1);
    const categorySnapshot = await categoryQuery.get();
    const categoryImageUrl = categorySnapshot.docs[0]?.data().imageUrl;

    const q = poemsCollection.where('category', '==', categoryName);
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
          photographerName: data.photographerName,
          photographerUrl: data.photographerUrl,
          categoryImageUrl: categoryImageUrl || null
        } as Poem & { categoryImageUrl?: string };
    });
    return poems;
  } catch (error) {
    console.error(`Error fetching poems for category ${categoryName}:`, error);
    return [];
  }
}

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
            photographerName: data.photographerName,
            photographerUrl: data.photographerUrl,
        } as (Poem & { category: string });

    } catch (error) {
        console.error(`Error fetching poem with id ${poemId}:`, error);
        return null;
    }
}

// Reemplaza tu función deletePoem con esta
export async function deletePoem(poemId: string): Promise<void> {
    try {
        // Con el SDK de Admin, se accede al documento directamente
        const poemDocRef = adminDb.collection('poems').doc(poemId);
        await poemDocRef.delete();
    } catch (error) {
        console.error(`Error deleting poem with id ${poemId}:`, error);
        throw new Error("Failed to delete poem from Firestore.");
    }
}

export async function getAllPoems(): Promise<Poem[]> {
    const logFilePath = path.join(process.cwd(), 'debug_log.txt');
    try {
        const poemsCollection = adminDb.collection('poems');
        const querySnapshot = await poemsCollection.orderBy('createdAt', 'desc').get();
        
        // Escribimos en el archivo de log cuántos poemas se encontraron
        const logMessage = `[${new Date().toISOString()}] ÉXITO en getAllPoems: Se encontraron ${querySnapshot.docs.length} poemas.\n`;
        fs.appendFileSync(logFilePath, logMessage);

        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as Poem[];

    } catch (error: any) {
        // Si hay un error, lo escribimos en el archivo de log
        const errorMessage = `[${new Date().toISOString()}] ERROR en getAllPoems: ${error.message}\n`;
        fs.appendFileSync(logFilePath, errorMessage);

        console.error("Error fetching all poems:", error);
        return [];
    }
}
// --- CORRECCIÓN: Añadimos 'export' para que el tipo sea accesible desde otros archivos ---
export type ImageAsset = {
    id: string;
    url: string;
    alt: string;
    category: string;
    createdAt: string;
}

// --- NUEVA FUNCIÓN AÑADIDA PARA SOLUCIONAR EL ERROR ---
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

// --- FUNCIÓN PARA MULTIMEDIA AÑADIDA CORRECTAMENTE ---
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
            // Nos aseguramos que la fecha sea un string
            createdAt: convertTimestampToString(data.createdAt), 
        };
    });
  } catch (error) {
    console.error(`Error fetching multimedia for category ${categoryName}:`, error);
    return [];
  }
}