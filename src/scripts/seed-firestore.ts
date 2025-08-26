
'use server';

// This script is intended to be run from the command line, e.g., `npx tsx src/scripts/seed-firestore.ts`
// It requires the `google-services.json` file for admin authentication.
// Since we have moved to environment variables for the main app, this script's dependency
// on `google-services.json` is now isolated. If you need to re-seed, ensure the service
// account file is present in the project root.

import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import { poemsData } from '../lib/poems-data';
import * as fs from 'fs';
import * as path from 'path';

// Use environment variable if available, otherwise fall back to file
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

// Full list of all categories to ensure they all exist.
const allCategoryNames = [
    "Poemas Cortos",
    "Versos de Amor",
    "Cartas Apasionadas",
    "Frases para Enamorar",
    "Aniversarios",
    "Desamor",
    "Poemas con Nombres",
    "Relatos Infidelidad",
    "Imágenes con nombres",
    "Fondos de pantalla Romantico",
    "Imágenes de Amor",
    "Imágenes Buenos días mi Amor",
    "Imágenes de Buenas Noches",
    "Imágenes románticas para enamorados",
    "Tarjetas de amor para enviar por Whatsapp",
    "Animes con frases bonitas",
    "Como Besa tu signo",
    "Gifs Animados de Rosas con frases",
    "Gifs de Buenos Días Mi Amor",
    "Gifs de Buenas Noches mi Amor",
    "Susurros de Amor",
    "Frases Bonitas para dedicar",
    "Poemas para dedicar",
    "Melodias Romanticas",
];


async function seedDatabase() {
  console.log('Starting to seed the database...');

  // 1. Seed Categories from the master list
  const categoriesCollection = db.collection('categories');
  console.log('Seeding categories...');

  for (const categoryName of allCategoryNames) {
    // Check if category already exists to avoid duplicates
    const categoryQuery = await categoriesCollection.where('name', '==', categoryName).get();
    if (categoryQuery.empty) {
      await categoriesCollection.add({ name: categoryName, imageUrl: null });
      console.log(`  - Added category: ${categoryName}`);
    } else {
      console.log(`  - Category already exists: ${categoryName}`);
    }
  }
  console.log('Categories seeded successfully!');

  // 2. Seed Poems
  const poemsCollection = db.collection('poems');
  console.log('Seeding poems...');

  let poemsAddedCount = 0;
  const poemCategories = Object.keys(poemsData);
  for (const categoryName of poemCategories) {
    const poems = poemsData[categoryName];
    if (!poems) continue;

    for (const poem of poems) {
       // Check if poem already exists by title and category to avoid duplicates
       const poemQuery = await poemsCollection
        .where('title', '==', poem.title)
        .where('category', '==', categoryName)
        .get();

      if (poemQuery.empty) {
          // Destructure to separate the ISO string date
          const { createdAt, ...poemRest } = poem;
          
          await poemsCollection.add({
            ...poemRest,
            category: categoryName,
            // Convert ISO string date to Firestore Timestamp for proper querying
            createdAt: Timestamp.fromDate(new Date(createdAt)), 
          });
          poemsAddedCount++;
      }
    }
  }

  if (poemsAddedCount > 0) {
     console.log(`${poemsAddedCount} new poems added successfully!`);
  } else {
      console.log("No new poems to add. The database is already up to date.");
  }
  
  console.log('Database seeding finished!');
}

seedDatabase().catch((error) => {
  console.error('Error seeding database:', error);
});
