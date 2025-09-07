
// src/lib/poems-service.ts

'use server';

import { getAdminInstances } from './firebase-admin';
import algoliasearch from 'algoliasearch';
import { deleteFileFromStorage } from './storage-service';


// --- DEFINICIÓN DE TIPOS ---
export type Poem = {
  id: string;
  title: string;
  poem: string;
  author?: string;
  createdAt: string; // ISO 8601 format
  likes: number;
  shares: number;
  image: string; // Fallback image
  imageHint: string; 
  imageUrl?: string;
  photographerName?: string;
  photographerUrl?: string;
  category: string;
};

export type Category = {
  id: string;
  name: string;
  type: 'poema' | 'imagen' | 'multimedia';
  imageUrl?: string | null;
};

export type ImageAsset = {
    id: string;
    url: string;
    alt: string;
    category: string;
    createdAt: string;
};

export type MediaItem = {
    id: string;
    title: string;
    type: 'audio' | 'video';
    url: string;
    category: string;
    duration?: number;
    likes: number;
    createdAt: any;
};


// --- SERVICIOS DE TERCEROS (ALGOLIA) ---
function getAlgoliaIndex() {
    const appId = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID;
    const adminKey = process.env.ALGOLIA_ADMIN_KEY;

    if (!appId || !adminKey) {
        console.error("Algolia credentials not found in environment variables.");
        return null;
    }
    
    const algoliaClient = algoliasearch(appId, adminKey);
    return algoliaClient.initIndex('poems');
}

export async function syncPoemToAlgolia(poemData: any) {
    const algoliaIndex = getAlgoliaIndex();
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


// --- HELPERS ---
function convertTimestampToString(timestamp: any): string {
    const { adminTimestamp } = getAdminInstances();
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

// --- FUNCIONES DE SERVICIO (LÓGICA DE BASE DE DATOS) ---

export async function getCategoryImages(): Promise<string[]> {
    const { adminDb } = getAdminInstances();
    try {
        const snapshot = await adminDb.collection('categories').where('imageUrl', '!=', null).get();
        const imagePaths = snapshot.docs
            .map(doc => doc.data().imageUrl as string)
            .filter(Boolean); // Filtra cualquier valor nulo o indefinido
        return imagePaths;
    } catch (error) {
        console.error("Error al leer las imágenes de categorías desde Firestore:", error);
        return [];
    }
}

export async function getPublicImages(): Promise<string[]> {
    const { adminDb } = getAdminInstances();
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

type NewAdminPoemData = {
    title: string;
    poem: string;
    category: string;
    author: string;
    imageFile?: File | null;
    imageUrl?: string | null;
    imageHint?: string;
};

export async function addAdminPoem(data: NewAdminPoemData): Promise<Poem> {
    const { adminDb, adminTimestamp, adminStorage } = getAdminInstances();
    const algoliaIndex = getAlgoliaIndex();
    if (!algoliaIndex) throw new Error("Algolia client not initialized.");

    try {
        let finalImageUrl: string | null = data.imageUrl || null;

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
        } else if (data.imageFile) {
             const bucket = adminStorage.bucket(process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET);
            const filePath = `poemas-admin-imagen/${Date.now()}-${data.imageFile.name}`;
            const buffer = Buffer.from(await data.imageFile.arrayBuffer());
            await bucket.file(filePath).save(buffer, { metadata: { contentType: data.imageFile.type } });
            const file = bucket.file(filePath);
            await file.makePublic();
            finalImageUrl = file.publicUrl();
        }

        const poemData = {
            title: data.title,
            poem: data.poem,
            category: data.category,
            author: data.author,
            imageUrl: finalImageUrl,
            image: "", // Consistent with Firestore data structure
            imageHint: data.imageHint || "",
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
            imageUrl: finalImageUrl || undefined,
            createdAt: convertTimestampToString(poemData.createdAt),
        } as Poem;

    } catch (error) {
        console.error("Error al añadir un nuevo poema:", error);
        throw new Error("No se pudo añadir el poema.");
    }
}


export async function updatePoemImage(poemId: string, imageSource: File | string): Promise<string> {
    const { adminDb, adminStorage } = getAdminInstances();
    const algoliaIndex = getAlgoliaIndex();
    if (!algoliaIndex) throw new Error("Algolia client not initialized.");
    let downloadURL = "";
    
    try {
        if (typeof imageSource === 'string') {
            downloadURL = imageSource;
        } else {
            const bucket = adminStorage.bucket(process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!);
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
        await poemDocRef.update({ imageUrl: downloadURL, image: '' });
        await algoliaIndex.partialUpdateObject({ objectID: poemId, imageUrl: downloadURL, image: '' });
        
        return downloadURL;

    } catch (error) {
        console.error(`Error al actualizar la imagen para el poema ${poemId}:`, error);
        throw new Error("No se pudo actualizar la imagen del poema.");
    }
}

export async function updatePoem(poemId: string, data: { title: string; poem: string }): Promise<void> {
    const { adminDb } = getAdminInstances();
    const algoliaIndex = getAlgoliaIndex();
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

export async function getCategories(): Promise<Category[]> {
    const { adminDb } = getAdminInstances();
    try {
        const categoriesCollection = adminDb.collection('categories');
        const q = categoriesCollection.orderBy('name');
        const querySnapshot = await q.get();
        return querySnapshot.docs.map(doc => ({ 
            id: doc.id,
            ...doc.data()
        } as Category));
    } catch (error) {
        console.error("Error fetching categories:", error);
        return [];
    }
}

export async function getPoemsForCategory(categoryName: string) {
    const { adminDb } = getAdminInstances();
    const POEMS_PER_PAGE = 6;
    try {
        const poemsCollection = adminDb.collection('poems');
        const q = poemsCollection
                .where('category', '==', categoryName)
                .orderBy('createdAt', 'desc')
                .limit(POEMS_PER_PAGE);

        const querySnapshot = await q.get();

        const poems = querySnapshot.docs.map(doc => {
            const data = doc.data();
            return {
              id: doc.id,
              ...data,
              createdAt: convertTimestampToString(data.createdAt),
            } as Poem;
        });

        const lastVisible = querySnapshot.docs.length > 0 ? querySnapshot.docs[querySnapshot.docs.length - 1] : null;
        
        return { poems, lastVisible };

    } catch (error) {
        console.error(`Error fetching poems for category ${categoryName}:`, error);
        return { poems: [], lastVisible: null };
    }
}

export async function getRandomPoemsForCategory(categoryName: string, limitNum: number, excludeIds: string[] = []): Promise<Poem[]> {
    const { adminDb } = getAdminInstances();
    try {
        const poemsCollection = adminDb.collection('poems');
        const q = poemsCollection.where('category', '==', categoryName);
        const snapshot = await q.get();

        if (snapshot.empty) return [];

        const allPoemIds = snapshot.docs.map(doc => doc.id);
        const availablePoemIds = allPoemIds.filter(id => !excludeIds.includes(id));
        
        if (availablePoemIds.length === 0) return [];

        const shuffledIds = availablePoemIds.sort(() => 0.5 - Math.random());
        const idsToFetch = shuffledIds.slice(0, limitNum);

        if (idsToFetch.length === 0) return [];

        const poemsPromises = idsToFetch.map(id => poemsCollection.doc(id).get());
        const poemDocs = await Promise.all(poemsPromises);

        return poemDocs
          .filter(doc => doc.exists)
          .map(doc => {
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

export async function getPoemById(poemId: string): Promise<Poem | null> {
    const { adminDb } = getAdminInstances();
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
            createdAt: convertTimestampToString(data.createdAt),
        } as Poem;

    } catch (error) {
        console.error(`Error fetching poem with id ${poemId}:`, error);
        return null;
    }
}

export async function deletePoem(poemId: string): Promise<void> {
    const { adminDb } = getAdminInstances();
    const algoliaIndex = getAlgoliaIndex();
    if (!algoliaIndex) throw new Error("Algolia client not initialized.");
    try {
        const poemRef = adminDb.collection('poems').doc(poemId);
        const poemDoc = await poemRef.get();
        if (poemDoc.exists && poemDoc.data()?.imageUrl) {
            await deleteFileFromStorage(poemDoc.data()!.imageUrl);
        }
        await poemRef.delete();
        await algoliaIndex.deleteObject(poemId);
    } catch (error) {
        console.error(`Error deleting poem with id ${poemId}:`, error);
        throw new Error("Failed to delete poem from Firestore and/or Algolia.");
    }
}

export async function getAllPoems(): Promise<Poem[]> {
    const { adminDb } = getAdminInstances();
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

export async function getImagesForCategory(categoryName: string): Promise<ImageAsset[]> {
    const { adminDb } = getAdminInstances();
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
    const { adminDb } = getAdminInstances();
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
    const { adminDb } = getAdminInstances();
    try {
        const imageDocRef = adminDb.collection('images').doc(imageId);
        await imageDocRef.delete();
        await deleteFileFromStorage(imageUrl);
    } catch (error) {
        console.error(`Error deleting image ${imageId}:`, error);
        throw new Error('Failed to delete image.');
    }
}


export async function getMultimediaForCategory(categoryName: string): Promise<MediaItem[]> {
    const { adminDb } = getAdminInstances();
    try {
        const querySnapshot = await adminDb.collection('multimedia').where('category', '==', categoryName).orderBy('createdAt', 'desc').get();
        return querySnapshot.docs.map(doc => {
            const data = doc.data();
            return { 
                id: doc.id, 
                ...data,
                createdAt: convertTimestampToString(data.createdAt), 
            } as MediaItem;
        });
    } catch (error) {
        console.error(`Error fetching multimedia for category ${categoryName}:`, error);
        return [];
    }
}

export async function getAllPoemsWithImages(): Promise<Poem[]> {
    const { adminDb } = getAdminInstances();
    try {
        const log = (message: string) => console.log(`[${new Date().toISOString()}] ${message}`);

        log("Iniciando getAllPoemsWithImages");
        const poemsSnapshot = await adminDb.collection('poems').get();
        log(`Se encontraron ${poemsSnapshot.docs.length} poemas.`);

        const publicImagesSnapshot = await adminDb.collection('public_images').get();
        const publicImages = publicImagesSnapshot.docs.map(doc => doc.data().url as string);
        log(`Se encontraron ${publicImages.length} imágenes públicas.`);
        
        let poemsWithImages: Poem[] = [];

        for (const doc of poemsSnapshot.docs) {
            let data = doc.data();
            let imageUrl = data.imageUrl;

            if (!imageUrl && publicImages.length > 0) {
                // Asigna una imagen aleatoria SOLO si no tiene una
                imageUrl = publicImages[Math.floor(Math.random() * publicImages.length)];
            }

            poemsWithImages.push({
                id: doc.id,
                ...data,
                imageUrl: imageUrl,
                createdAt: convertTimestampToString(data.createdAt),
            } as Poem);
        }
        
        log(`Se procesaron ${poemsWithImages.length} poemas con imágenes.`);
        return poemsWithImages;
    } catch (error) {
        console.error("Error en getAllPoemsWithImages:", error);
        return [];
    }
}
