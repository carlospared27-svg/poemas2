// src/lib/actions.ts

'use server';

import { 
    getPublicImages,
    updatePoemImage,
    getPoemById,
    updatePoem,
    getCategories,
    addAdminPoem,
    getAllPoems,
    getImagesForCategory,
    getImageById,
    getMultimediaForCategory // <- 1. AÑADIDA A LA LISTA DE IMPORTACIÓN
} from './poems-service';

export { 
    getPublicImages, 
    updatePoemImage, 
    getPoemById, 
    updatePoem,
    getCategories,
    addAdminPoem,
    getAllPoems,
    getImagesForCategory,
    getImageById,
    getMultimediaForCategory // <- 2. AÑADIDA A LA LISTA DE EXPORTACIÓN
};