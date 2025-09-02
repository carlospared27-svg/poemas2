
// src/lib/poems-service.ts

'use server';

import { getAdminInstances } from './firebase-admin';
import type { Poem } from './poems-data';
import algoliasearch from 'algoliasearch';
import fs from 'fs';
import path from 'path';


// Inicializamos los servicios aquí, llamando a la función getAdminInstances
const { adminDb, adminTimestamp, adminStorage } = getAdminInstances();

const algoliaClient = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID && process.env.ALGOLIA_ADMIN_KEY
  ? algoliasearch(
      process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
      process.env.ALGOLIA_ADMIN_KEY
    )
  : null;

const algoliaIndex = algoliaClient ? algoliaClient.initIndex('poems') : null;

export async function syncPoemToAlgolia(poemData: any) {
    if (!algoliaIndex) {
        console.error("Algolia client not initialized. Skipping sync.");
        return;
    }
    try {
        await algoliaIndex.saveObject(poemData);
        console.log(`Poem with ID ${poemData.objectID} synced with Algolia.`);
    } catch(error) {
        console.error(`Error syncing poem ${poemData.objectID} to Algolia:`, error);
        throw new Error("Could not sync poem to Algolia.");
    }
}

export async function getCategoryImages(): Promise<string[]> {
    try {
        const imageDirectory = path.join(process.cwd(), 'public', 'image-categorias');
        const files = fs.readdirSync(imageDirectory);
        return files
            .filter(file => /\.(jpg|jpeg|png|webp)$/i.test(file))
            .map(file => `/image-categorias/${file}`);
    } catch (error) {
        console.error("Error al leer las imágenes de categorías:", error);
        // Devuelve un array vacío en caso de error para que la UI no se rompa.
        return [];
    }
}

export async function getPublicImages(): Promise<string[]> {
  try {
    const snapshot = await adminDb.collection('public_images').get();
    if (snapshot.empty) {
        console.warn("La colección 'public_images' está vacía o no existe.");
        return [];
    }
    const imagePaths = snapshot.docs.map(doc => doc.data().url as string);
    return imagePaths;
  } catch (error) {
    console.error("Error al leer las imágenes públicas desde Firestore:", error);
    return [];
  }
}


function convertTimestampToString(timestamp: any): string {
    if (!timestamp) return new Date().toISOString();
    if (timestamp instanceof adminTimestamp) {
        return timestamp.toDate().toISOString();
    }
    if (timestamp && typeof timestamp.toDate === 'function') {
        return timestamp.toDate().toISOString();
    }
    if (typeof timestamp === 'string') {
        return timestamp;
    }
    if (timestamp._seconds) {
        return new Date(timestamp._seconds * 1000).toISOString();
    }
    return new Date().toISOString();
}

type NewAdminPoemData = {
    title: string;
    poem: string;
    category: string;
    author: string;
    imageFile?: File | null;
    imageUrl?: string;
};

export async function addAdminPoem(data: NewAdminPoemData): Promise<Poem> {
    if (!algoliaIndex) throw new Error("Algolia client not initialized.");
    try {
        let finalImageUrl = "";
        let finalImage = "";

        if (data.imageUrl && data.imageUrl.startsWith('data:image')) {
            const bucket = adminStorage.bucket(process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET);
            const safeTitle = data.title.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9-]/g, '');
            const filePath = `poem-images/ai-${safeTitle}-${Date.now()}.png`;
            const file = bucket.file(filePath);
            
            const base64EncodedImageString = data.imageUrl.split(',')[1];
            const buffer = Buffer.from(base64EncodedImageString, 'base64');
            const mimeType = data.imageUrl.match(/data:(image\/[^;]+);/)?.[1] || 'image/png';

            await file.save(buffer, { metadata: { contentType: mimeType } });
            await file.makePublic();
            finalImageUrl = file.publicUrl();
        } 
        else if (data.imageFile) {
            const bucket = adminStorage.bucket(process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET);
            const filePath = `poemas-admin-imagen/${Date.now()}-${data.imageFile.name}`;
            const buffer = Buffer.from(await data.imageFile.arrayBuffer());
            await bucket.file(filePath).save(buffer, { metadata: { contentType: data.imageFile.type } });
            const file = bucket.file(filePath);
            await file.makePublic();
            finalImageUrl = file.publicUrl();
        } 
        else if (data.imageUrl) { // Si se proporciona una URL directa (no data URI)
            finalImageUrl = data.imageUrl;
        }
        else {
            const publicImages = await getPublicImages();
            if (publicImages.length > 0) {
                finalImage = publicImages[Math.floor(Math.random() * publicImages.length)];
            }
        }

        const poemData = {
            title: data.title,
            poem: data.poem,
            category: data.category,
            author: data.author,
            imageUrl: finalImageUrl,
            image: finalImage,
            createdAt: adminTimestamp.now(),
            likes: 0,
            shares: 0,
        };

        const docRef = await adminDb.collection('poems').add(poemData);
        console.log(`Poema guardado en Firestore con ID: ${docRef.id}`);

        await syncPoemToAlgolia({
            objectID: docRef.id,
            ...poemData,
            createdAt: poemData.createdAt.toMillis(),
        });
        
        return {
            id: docRef.id,
            ...poemData,
            createdAt: convertTimestampToString(poemData.createdAt),
        } as Poem;

    } catch (error) {
        console.error("Error al añadir un nuevo poema:", error);
        throw new Error("No se pudo añadir el poema.");
    }
}

export async function updatePoemImage(poemId: string, imageSource: File | string): Promise<string> {
    if (!algoliaIndex) throw new Error("Algolia client not initialized.");
    let downloadURL = "";
    
    try {
        if (typeof imageSource === 'string') {
            // Asumimos que es una URL pública y solo la asignamos
            downloadURL = imageSource;
        } else {
            // Es un archivo, lo subimos
            const bucket = adminStorage.bucket(process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET);
            const filePath = `poem-images/${poemId}-${Date.now()}-${imageSource.name}`;
            const buffer = Buffer.from(await imageSource.arrayBuffer());
            const file = bucket.file(filePath);
            
            await file.save(buffer, {
                metadata: { contentType: imageSource.type }
            });
            await file.makePublic();
            downloadURL = file.publicUrl();
        }

        const poemDocRef = adminDb.collection('poems').doc(poemId);
        await poemDocRef.update({ imageUrl: downloadURL, image: '' }); // Vaciamos 'image' para dar prioridad a 'imageUrl'
        await algoliaIndex.partialUpdateObject({ objectID: poemId, imageUrl: downloadURL, image: '' });
        
        return downloadURL;

    } catch (error) {
        console.error(`Error al actualizar la imagen para el poema ${poemId}:`, error);
        throw new Error("No se pudo actualizar la imagen del poema.");
    }
}

export async function updatePoem(poemId: string, data: { title: string; poem: string }): Promise<void> {
  if (!algoliaIndex) throw new Error("Algolia client not initialized.");
  try {
      const poemDocRef = adminDb.collection('poems').doc(poemId);
      await poemDocRef.update({
          title: data.title,
          poem: data.poem,
      });
      await algoliaIndex.partialUpdateObject({
          objectID: poemId,
          title: data.title,
          poem: data.poem,
      });
  } catch (error) {
      console.error(`Error al actualizar el poema ${poemId}:`, error);
      throw new Error("No se pudo actualizar el poema.");
  }
}

export async function getCategories(): Promise<{ id: string; name: string, type: string, imageUrl?: string }[]> {
  try {
    const categoriesCollection = adminDb.collection('categories');
    const q = categoriesCollection.orderBy('name');
    const querySnapshot = await q.get();
    return querySnapshot.docs.map(doc => ({ 
        id: doc.id,
        name: doc.data().name,
        type: doc.data().type,
        imageUrl: doc.data().imageUrl || null
    }));
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

export async function getPoemsForCategory(categoryName: string, limitNum: number): Promise<Poem[]> {
  try {
    const poemsCollection = adminDb.collection('poems');
    const q = poemsCollection
                .where('category', '==', categoryName)
                .orderBy('createdAt', 'desc')
                .limit(limitNum);

    const querySnapshot = await q.get();
    return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: convertTimestampToString(data.createdAt),
        } as Poem;
    });
  } catch (error) {
    console.error(`Error fetching poems for category ${categoryName}:`, error);
    return [];
  }
}

export async function getRandomPoemsForCategory(categoryName: string, limitNum: number, excludeIds: string[]): Promise<Poem[]> {
    try {
        const poemsCollection = adminDb.collection('poems');
        const q = poemsCollection.where('category', '==', categoryName);
        const querySnapshot = await q.get();

        let allPoemIds = querySnapshot.docs.map(doc => doc.id);
        if (excludeIds.length > 0) {
            allPoemIds = allPoemIds.filter(id => !excludeIds.includes(id));
        }
        
        if (allPoemIds.length === 0) return [];

        const shuffledIds = allPoemIds.sort(() => 0.5 - Math.random());
        const randomIdsToFetch = shuffledIds.slice(0, limitNum);
        
        if (randomIdsToFetch.length === 0) return [];

        const poemDocs = await adminDb.getAll(...randomIdsToFetch.map(id => poemsCollection.doc(id)));

        return poemDocs.map(doc => {
            const data = doc.data()!;
            return {
                id: doc.id,
                ...data,
                createdAt: convertTimestampToString(data.createdAt),
            } as Poem;
        });

    } catch (error) {
        console.error(`Error fetching random poems for category ${categoryName}:`, error);
        return [];
    }
}

export async function getPoemById(poemId: string): Promise<(Poem & { category: string }) | null> {
    try {
        const poemDoc = await adminDb.collection('poems').doc(poemId).get();
        if (!poemDoc.exists) {
            console.warn(`Poem with id ${poemId} not found.`);
            return null;
        }

        const data = poemDoc.data()!;
        return {
            ...data,
            id: poemDoc.id,
            category: data.category,
            createdAt: convertTimestampToString(data.createdAt),
        } as (Poem & { category: string });

    } catch (error) {
        console.error(`Error fetching poem with id ${poemId}:`, error);
        return null;
    }
}

export async function deletePoem(poemId: string): Promise<void> {
    if (!algoliaIndex) throw new Error("Algolia client not initialized.");
    try {
        const poemRef = adminDb.collection('poems').doc(poemId);
        const poemDoc = await poemRef.get();
        if (poemDoc.exists && poemDoc.data()?.imageUrl) {
            // No se puede eliminar la imagen de storage desde el backend de forma segura y simple
            // La lógica para esto debería estar en un cloud function o manejarse de otra forma.
            // Por ahora, solo borramos de la DB y Algolia.
        }
        await poemRef.delete();
        await algoliaIndex.deleteObject(poemId);
    } catch (error) {
        console.error(`Error deleting poem with id ${poemId}:`, error);
        throw new Error("Failed to delete poem from Firestore and/or Algolia.");
    }
}

export async function getAllPoems(): Promise<Poem[]> {
    try {
        const querySnapshot = await adminDb.collection('poems').orderBy('createdAt', 'desc').get();
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: convertTimestampToString(doc.data().createdAt),
        } as Poem));
    } catch (error) {
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
    const querySnapshot = await adminDb.collection('images').where('category', '==', categoryName).orderBy('createdAt', 'desc').get();
    return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: convertTimestampToString(data.createdAt),
        } as ImageAsset;
    });
  } catch (error) {
    console.error(`Error fetching images for category ${categoryName}:`, error);
    return [];
  }
}

export async function getImageById(imageId: string): Promise<ImageAsset | null> {
    try {
        const imageDoc = await adminDb.collection('images').doc(imageId).get();
        if (!imageDoc.exists) return null;
        const data = imageDoc.data()!;
        return {
            id: imageDoc.id,
            ...data,
            createdAt: convertTimestampToString(data.createdAt),
        } as ImageAsset;
    } catch (error) {
        console.error(`Error fetching image with id ${imageId}:`, error);
        return null;
    }
}

export async function deleteImage(imageId: string, imageUrl: string): Promise<void> {
    try {
        // Eliminar de Firestore
        const imageDocRef = adminDb.collection('images').doc(imageId);
        await imageDocRef.delete();

        // Eliminar de Storage
        const bucket = adminStorage.bucket(process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET);
        // Extraer la ruta del archivo desde la URL de descarga
        const url = new URL(imageUrl);
        const filePath = decodeURIComponent(url.pathname.split('/').pop()!).split('?')[0].split('/').slice(2).join('/');

        if (filePath) {
            await bucket.file(filePath).delete();
        }

    } catch (error) {
        console.error(`Error deleting image ${imageId}:`, error);
        throw new Error('Failed to delete image.');
    }
}


export async function getMultimediaForCategory(categoryName: string): Promise<any[]> {
  try {
    const querySnapshot = await adminDb.collection('multimedia').where('category', '==', categoryName).orderBy('createdAt', 'desc').get();
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
