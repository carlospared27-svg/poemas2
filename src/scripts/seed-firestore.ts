

'use server';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import { poemsData } from '../lib/poems-data';
import algoliasearch from 'algoliasearch';
import fs from 'fs';
import path from 'path';

// --- INICIALIZACIÓN SEGURA DE ALGOLIA ---
const algoliaClient = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID && process.env.ALGOLIA_ADMIN_KEY
  ? algoliasearch(
      process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
      process.env.ALGOLIA_ADMIN_KEY
    )
  : null;

const algoliaIndex = algoliaClient ? algoliaClient.initIndex('poems') : null;

// --- INICIALIZACIÓN DE FIREBASE ADMIN ---
const serviceAccountKey = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
if (!getApps().length) {
    if (!serviceAccountKey) {
        throw new Error('La variable de entorno GOOGLE_SERVICE_ACCOUNT_JSON no está configurada.');
    }
    initializeApp({
        credential: cert(JSON.parse(serviceAccountKey)),
    });
}
const db = getFirestore();

const allCategoryData = [
    { name: "Poemascortos", type: 'poema', image: 'poemas-cortos.png' },
    { name: "Versosdeamor", type: 'poema', image: 'versos-amor.png' },
    { name: "Cartasapasionadas", type: 'poema', image: 'cartas-apasionadas.png' },
    { name: "Frasesparaenamorar", type: 'poema', image: 'frases-de-amor.png' },
    { name: "Aniversarios", type: 'poema', image: 'aniversarios.png' },
    { name: "Desamor", type: 'poema', image: 'poemas-desamor.png' },
    { name: "Poemasconnombres", type: 'poema', image: 'poemas-con-nombres.png' },
    { name: "Relatosinfidelidad", type: 'poema', image: 'relatos-infidelidad.png' },
    { name: "Imagenesconnombres", type: 'imagen', image: 'imágenes-con-nombres.png' },
    { name: "Fondosdepantallaromantico", type: 'imagen', image: 'fondos-de-pantalla-romantico.png' },
    { name: "Imagenesdeamor", type: 'imagen', image: 'imágenes-de-amor.png' },
    { name: "Imagenesbuenosdiasmiamor", type: 'imagen', image: 'imágenes-buenos-días-mi-amor.png' },
    { name: "Imagenesdebuenasnoches", type: 'imagen', image: 'imágenes-de-buenas-noches.png' },
    { name: "Imagenesromanticasparaenamorados", type: 'imagen', image: 'imágenes-románticas-para-enamorados.png' },
    { name: "Tarjetasdeamorparaenviarporwhatsapp", type: 'imagen', image: 'tarjetas-de-amor-para-enviar-por-whatsapp.png' },
    { name: "Animesconfrasesbonitas", type: 'imagen', image: 'animes-con-frases-bonitas.png' },
    { name: "Comobesatusigno", type: 'imagen', image: 'como-besa-tu-signo.png' },
    { name: "Gifsanimadosderosasconfrases", type: 'multimedia', image: 'gifs-animados-de-rosas-con-frases.png' },
    { name: "Gifsdebuenosdiasmiamor", type: 'multimedia', image: 'gifs-de-buenos-días-mi-amor.png' },
    { name: "Gifsdebuenasnochesmiamor", type: 'multimedia', image: 'gifs-de-buenas-noches-mi-amor.png' },
    { name: "Susurrosdeamor", type: 'multimedia', image: 'susurros-de-amor.png' },
    { name: "Frasesbonitasparadedicar", type: 'poema', image: 'frases-de-amor.png' },
    { name: "Poemasparadedicar", type: 'poema', image: 'poemas-cortos.png' },
    { name: "Melodiasromanticas", type: 'multimedia', image: 'melodias-romanticas.png' },
    { name: "Videodedicatorias", type: 'multimedia', image: 'video-dedicatorias.png' },
    { name: "Videosmotivadores", type: 'multimedia', image: 'videos-motivadores.png' },
];


async function seedDatabase() {
  if (!algoliaIndex) {
    console.error("Error: Algolia client not initialized. Check your environment variables.");
    return;
  }
  console.log('Starting to seed the database...');

  const categoriesCollection = db.collection('categories');
  console.log('Seeding categories...');
  for (const catData of allCategoryData) {
    const categoryQuery = await categoriesCollection.where('name', '==', catData.name).get();
    
    // Construir la URL de la imagen si se proporciona una
    const imageUrl = catData.image ? `/image-categorias/${catData.image}` : null;

    if (categoryQuery.empty) {
      await categoriesCollection.add({ 
        name: catData.name, 
        type: catData.type, 
        imageUrl: imageUrl 
      });
      console.log(`  - Category added: ${catData.name} with image ${imageUrl}`);
    } else {
      // Opcional: Actualizar la imagen si la categoría ya existe
      const docId = categoryQuery.docs[0].id;
      await categoriesCollection.doc(docId).update({ imageUrl: imageUrl });
      console.log(`  - Category updated: ${catData.name} with image ${imageUrl}`);
    }
  }
  console.log('Categories seeded successfully!');

  const publicImagesCollection = db.collection('public_images');
  console.log('Seeding public images...');
  try {
      const imageDirectory = path.join(process.cwd(), 'public', 'imagenes-poemas');
      const files = fs.readdirSync(imageDirectory);
      const imagePaths = files
        .filter(file => /\.(jpg|jpeg|png|webp)$/i.test(file))
        .map(file => `/imagenes-poemas/${file}`);

      const batch = db.batch();
      const snapshot = await publicImagesCollection.get();
      snapshot.docs.forEach(doc => batch.delete(doc.ref));
      await batch.commit();
      
      const newBatch = db.batch();
      imagePaths.forEach(url => {
          const docRef = publicImagesCollection.doc();
          newBatch.set(docRef, { url });
      });
      await newBatch.commit();
      console.log(`  - ${imagePaths.length} public images seeded.`);
  } catch (error) {
      console.error("Error seeding public images:", error);
  }
  console.log('Public images seeded successfully!');


  const poemsCollection = db.collection('poems');
  console.log('Seeding and syncing poems...');

  let poemsToSyncWithAlgolia: any[] = [];
  
  for (const categoryName in poemsData) {
    const poems = poemsData[categoryName];
    if (!poems || poems.length === 0) continue;

    for (const poem of poems) {
        const { id, createdAt, ...poemRest } = poem;
        const poemDocRef = poemsCollection.doc(id);

        const poemPayload = {
            ...poemRest,
            category: categoryName,
            createdAt: Timestamp.fromDate(new Date(createdAt)),
        };
        
        await poemDocRef.set(poemPayload, { merge: true });

        poemsToSyncWithAlgolia.push({
            objectID: id,
            ...poemPayload,
            createdAt: new Date(createdAt).getTime(),
        });
    }
  }
  
  console.log(`Processed ${poemsToSyncWithAlgolia.length} poems for sync.`);

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
