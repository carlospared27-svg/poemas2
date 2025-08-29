'use server';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import { poemsData } from '../lib/poems-data';
import * as fs from 'fs';
import * as path from 'path';

// --- CORRECTION: Changed import method for compatibility ---
const algoliasearch = require('algoliasearch');

// --- ALGOLIA CONFIGURATION ---
const algoliaClient = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID!,
  process.env.ALGOLIA_ADMIN_KEY!
);
const algoliaIndex = algoliaClient.initIndex('poems');

// Firebase Admin authentication logic (no changes)
const serviceAccountString = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
let serviceAccount: any;

if (serviceAccountString) {
    try {
        serviceAccount = JSON.parse(serviceAccountString);
    } catch (e) {
        console.error('Could not parse GOOGLE_SERVICE_ACCOUNT_JSON environment variable.', e);
        process.exit(1);
    }
} else {
    const serviceAccountPath = path.join(process.cwd(), 'google-services.json');
    if (fs.existsSync(serviceAccountPath)) {
        try {
            serviceAccount = require(path.resolve(serviceAccountPath));
        } catch(e) {
            console.error('Could not parse google-services.json file.', e);
            process.exit(1);
        }
    } else {
        console.error('Error: GOOGLE_SERVICE_ACCOUNT_JSON env var is not set and google-services.json file was not found.');
        console.error('Please provide service account credentials to run the seed script.');
        process.exit(1);
    }
}

if (getApps().length === 0) {
    initializeApp({
        credential: cert(serviceAccount),
    });
}

const db = getFirestore();

// Your list of categories (no changes)
const allCategoryNames = [
    "Poemas Cortos", "Versos de Amor", "Cartas Apasionadas", "Frases para Enamorar",
    "Aniversarios", "Desamor", "Poemas con Nombres", "Relatos Infidelidad",
    "Imágenes con nombres", "Fondos de pantalla Romantico", "Imágenes de Amor",
    "Imágenes Buenos días mi Amor", "Imágenes de Buenas Noches", "Imágenes románticas para enamorados",
    "Tarjetas de amor para enviar por Whatsapp", "Animes con frases bonitas", "Como Besa tu signo",
    "Gifs Animados de Rosas con frases", "Gifs de Buenos Días Mi Amor", "Gifs de Buenas Noches mi Amor",
    "Susurros de Amor", "Frases Bonitas para dedicar", "Poemas para dedicar", "Melodias Romanticas",
];

async function seedDatabase() {
  console.log('Starting to seed the database...');

  // 1. Seed Categories (no changes)
  const categoriesCollection = db.collection('categories');
  console.log('Seeding categories...');
  for (const categoryName of allCategoryNames) {
    const categoryQuery = await categoriesCollection.where('name', '==', categoryName).get();
    if (categoryQuery.empty) {
      await categoriesCollection.add({ name: categoryName, imageUrl: null });
      console.log(`  - Category added: ${categoryName}`);
    } else {
      console.log(`  - Category already exists: ${categoryName}`);
    }
  }
  console.log('Categories seeded successfully!');

  // 2. Seed Poems and sync with Algolia
  const poemsCollection = db.collection('poems');
  console.log('Seeding and syncing poems...');

  let poemsAddedCount = 0;
  const poemsToSyncWithAlgolia: any[] = [];
  let totalPoemsProcessed = 0;

  for (const categoryName in poemsData) {
    const poems = poemsData[categoryName];
    if (!poems) continue;

    for (const poem of poems) {
      const poemDocRef = poemsCollection.doc(poem.id);
      const docSnapshot = await poemDocRef.get();

      // Contamos solo si el poema es nuevo
      if (!docSnapshot.exists) {
          poemsAddedCount++;
      }
      
      // *** CAMBIO PRINCIPAL ***
      // Ahora, la escritura se hace SIEMPRE, fuera del 'if'.
      // Esto crea el poema si no existe y lo actualiza si ya existe.
      const { id, createdAt, ...poemRest } = poem;
      await poemDocRef.set({
        ...poemRest,
        category: categoryName,
        createdAt: Timestamp.fromDate(new Date(createdAt)), 
      });
      
      // El código para Algolia se mantiene igual
      poemsToSyncWithAlgolia.push({
        objectID: poem.id,
        ...poemRest,
        category: categoryName,
        createdAt: new Date(createdAt).getTime(),
      });
      totalPoemsProcessed++;
    }
  }

  // Mensaje final mejorado
  console.log(`Firestore sync complete. Processed ${totalPoemsProcessed} poems.`);
  if (poemsAddedCount > 0) {
     console.log(`  - Added ${poemsAddedCount} new poems.`);
     const poemsUpdatedCount = totalPoemsProcessed - poemsAddedCount;
     if (poemsUpdatedCount > 0) {
        console.log(`  - Updated ${poemsUpdatedCount} existing poems.`);
     }
  } else {
      console.log("  - No new poems were added. All existing poems have been updated.");
  }
  
  // 3. Bulk upload to Algolia (no changes)
  if (poemsToSyncWithAlgolia.length > 0) {
    console.log(`Syncing ${poemsToSyncWithAlgolia.length} poems with Algolia...`);
    try {
      await algoliaIndex.clearObjects();
      await algoliaIndex.saveObjects(poemsToSyncWithAlgolia);
      console.log('Poems synced with Algolia successfully!');
    } catch (error) {
      console.error('Error syncing with Algolia:', error);
    }
  }
  
  console.log('Database seeding finished!');
}

seedDatabase().catch((error) => {
  console.error('Error seeding database:', error);
});