// src/scripts/assign-images.ts

import * as fs from 'fs';
import * as path from 'path';

// --- LÍNEA CORREGIDA ---
// Se ha añadido 'src' a la ruta para que coincida con tu estructura de proyecto.
const poemsDataPath = path.join(process.cwd(), 'src', 'lib', 'poems-data.ts');

// Ruta a tu carpeta de imágenes públicas (esta ya era correcta)
const imagesDirPath = path.join(process.cwd(), 'public', 'imagenes-poemas');

async function assignRandomImages() {
  console.log('--- Iniciando asignación de imágenes aleatorias ---');

  try {
    // 1. Leer todos los nombres de archivo de tu carpeta de imágenes
    const imageFiles = fs.readdirSync(imagesDirPath).filter(file =>
      /\.(jpg|jpeg|png|webp)$/i.test(file)
    );

    if (imageFiles.length === 0) {
      console.error("❌ No se encontraron imágenes en la carpeta /public/imagenes-poemas.");
      return;
    }

    console.log(`🖼️  Se encontraron ${imageFiles.length} imágenes disponibles.`);

    // 2. Leer todo el contenido de tu archivo de datos como texto
    let fileContent = fs.readFileSync(poemsDataPath, 'utf-8');

    // 3. Buscar y reemplazar todas las ocurrencias del placeholder
    const placeholderUrl = "https://placehold.co/600x400.png";
    let replacementsCount = 0;

    const updatedContent = fileContent.replace(new RegExp(placeholderUrl, 'g'), () => {
      // Por cada placeholder encontrado, elegimos una imagen al azar de la lista
      const randomImage = imageFiles[Math.floor(Math.random() * imageFiles.length)];
      replacementsCount++;
      // Devolvemos la ruta web correcta que usará Next.js
      return `/imagenes-poemas/${randomImage}`;
    });

    // 4. Si se hizo al menos un reemplazo, sobrescribir el archivo
    if (replacementsCount > 0) {
      fs.writeFileSync(poemsDataPath, updatedContent, 'utf-8');
      console.log(`✅ ¡Éxito! Se actualizaron ${replacementsCount} imágenes en lib/poems-data.ts.`);
    } else {
      console.log("🟡 No se encontraron placeholders para reemplazar. El archivo ya podría estar actualizado.");
    }

  } catch (error) {
    console.error("🔥 Ocurrió un error durante el proceso:", error);
  } finally {
    console.log('--- Proceso finalizado ---');
  }
}

// Ejecutamos la función
assignRandomImages();