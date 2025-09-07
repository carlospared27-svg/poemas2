
// src/scripts/sync-firestore-to-algolia.ts

import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { getAdminInstances } from '../lib/firebase-admin';
import algoliasearch from 'algoliasearch';

const { adminDb } = getAdminInstances();

// 1. Conectar a Algolia con la clave de administrador
const algoliaClient = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID!,
  process.env.ALGOLIA_ADMIN_KEY!
);
const algoliaIndex = algoliaClient.initIndex('poems');

async function syncFirestoreToAlgolia() {
  try {
    console.log('--- Iniciando la sincronización de Firestore a Algolia ---');

    // 2. Obtener TODOS los poemas directamente de la colección de Firestore
    const poemsCollection = adminDb.collection('poems');
    const snapshot = await poemsCollection.get();

    if (snapshot.empty) {
      console.log('No se encontraron poemas en Firestore. Terminando.');
      return;
    }

    // 3. Formatear los datos para que sean compatibles con Algolia
    const poemsToSync = snapshot.docs.map(doc => {
      const poemData = doc.data();
      return {
        objectID: doc.id, // Muy importante: usamos el ID de Firestore
        title: poemData.title,
        poem: poemData.poem,
        author: poemData.author,
        category: poemData.category,
        image: poemData.image,
        imageUrl: poemData.imageUrl,
        createdAt: poemData.createdAt.toMillis(), // Convertimos el timestamp
      };
    });

    console.log(`Se encontraron ${poemsToSync.length} poemas en Firestore para sincronizar.`);

    // 4. Limpiar el índice de Algolia para evitar datos antiguos
    console.log('🗑️  Limpiando el índice de Algolia...');
    await algoliaIndex.clearObjects();

    // 5. Subir los nuevos datos a Algolia en un solo lote
    console.log('🔼 Subiendo todos los poemas a Algolia...');
    await algoliaIndex.saveObjects(poemsToSync);

    console.log('✅ ¡Éxito! El índice de Algolia ha sido sincronizado con los datos de Firestore.');

  } catch (error) {
    console.error('🔥 Ocurrió un error durante la sincronización:', error);
    process.exit(1);
  } finally {
    console.log('--- Proceso de sincronización finalizado ---');
  }
}

// Ejecutar la función
syncFirestoreToAlgolia();
