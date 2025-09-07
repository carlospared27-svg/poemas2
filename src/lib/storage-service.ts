
import { ref, uploadBytes, getDownloadURL, StorageError, deleteObject } from "firebase/storage";
import { storage } from "./firebase"; // Import the initialized storage instance

/**
 * Uploads an image file or a Blob to Firebase Storage.
 * @param file The image file or Blob to upload.
 * @param path The path in Firebase Storage where the file will be stored.
 * @returns The download URL of the uploaded file.
 */
export const uploadImage = async (file: File | Blob, path: string): Promise<string> => {
  if (!file) {
    throw new Error("No se proporcionó ningún archivo para subir.");
  }

  try {
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    return downloadURL;
  } catch (error) {
    console.error("Error during image upload:", error);
    
    let errorMessage = "Ocurrió un error desconocido al subir la imagen.";
    if (error instanceof StorageError) {
        switch (error.code) {
            case 'storage/unauthorized':
                errorMessage = "No tienes permiso para subir archivos. Revisa las reglas de seguridad de Firebase Storage.";
                break;
            case 'storage/canceled':
                errorMessage = "La subida ha sido cancelada.";
                break;
            case 'storage/unknown':
                errorMessage = "Ocurrió un error desconocido en el servidor. Inténtalo de nuevo.";
                break;
             default:
                errorMessage = `Error de Firebase Storage: ${error.message}`;
        }
    } else if (error instanceof Error) {
        errorMessage = error.message;
    }
    
    throw new Error(errorMessage);
  }
};

/**
 * Uploads an audio file to Firebase Storage.
 * @param file The audio file to upload.
 * @param path The path in Firebase Storage where the file will be stored.
 * @returns The download URL of the uploaded file.
 */
export const uploadAudio = async (file: File, path: string): Promise<string> => {
  if (!file) {
    throw new Error("No se proporcionó ningún archivo de audio para subir.");
  }

  try {
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    return downloadURL;
  } catch (error) {
    console.error("Error during audio upload:", error);
    
    let errorMessage = "Ocurrió un error desconocido al subir el audio.";
    if (error instanceof StorageError) {
        switch (error.code) {
            case 'storage/unauthorized':
                errorMessage = "No tienes permiso para subir archivos. Revisa las reglas de seguridad de Firebase Storage.";
                break;
            case 'storage/canceled':
                errorMessage = "La subida ha sido cancelada.";
                break;
            case 'storage/unknown':
                errorMessage = "Ocurrió un error desconocido en el servidor. Inténtalo de nuevo.";
                break;
             default:
                errorMessage = `Error de Firebase Storage: ${error.message}`;
        }
    } else if (error instanceof Error) {
        errorMessage = error.message;
    }

    throw new Error(errorMessage);
  }
};


/**
 * Deletes a file from Firebase Storage using its download URL.
 * @param url The download URL of the file to delete.
 */
export const deleteFileFromStorage = async (url: string): Promise<void> => {
    if (!url || !url.includes('firebasestorage')) {
        console.warn(`URL inválida o no es de Firebase Storage: ${url}`);
        return;
    }
    try {
        const fileRef = ref(storage, url);
        await deleteObject(fileRef);
    } catch (error) {
        if (error instanceof StorageError && error.code === 'storage/object-not-found') {
            console.warn(`Archivo no encontrado en ${url}, puede que ya haya sido eliminado.`);
        } else {
            console.error(`Error al eliminar el archivo de Storage: ${url}`, error);
            throw new Error("No se pudo eliminar el archivo de Storage.");
        }
    }
};

// --- Mantenemos las funciones específicas por retrocompatibilidad o claridad ---

export const deleteImageFromStorage = deleteFileFromStorage;
export const deleteAudioFromStorage = deleteFileFromStorage;
