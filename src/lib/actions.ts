
// src/lib/actions.ts

'use server';

// Este archivo actúa como una "fachada" segura para las acciones del servidor.
// Su única responsabilidad es re-exportar las funciones del servicio de poemas.
// Esto previene dependencias circulares y mantiene una arquitectura limpia.

import { 
    getPublicImages,
    updatePoemImage,
    getPoemById,
    updatePoem,
    getCategories,
    getAllPoems,
    getImagesForCategory,
    getImageById,
    getMultimediaForCategory,
    getRandomPoemsForCategory,
    deletePoem,
    addAdminPoem,
    syncPoemToAlgolia,
    getCategoryImages,
    deleteImage,
    getPoemsForCategory
} from './poems-service';

export { 
    getPublicImages, 
    updatePoemImage, 
    getPoemById, 
    updatePoem,
    getCategories,
    getAllPoems,
    getImagesForCategory,
    getImageById,
    getMultimediaForCategory,
    getRandomPoemsForCategory,
    deletePoem,
    addAdminPoem,
    syncPoemToAlgolia,
    getCategoryImages,
    deleteImage,
    getPoemsForCategory
};
