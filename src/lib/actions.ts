
// src/lib/actions.ts

'use server';

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
    deleteImage // Importamos la nueva función
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
    deleteImage // Exportamos la nueva función
};
