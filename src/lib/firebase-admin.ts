// src/lib/firebase-admin.ts
import admin from 'firebase-admin';

// Definimos la estructura de las instancias para tener un tipado fuerte.
interface AdminInstances {
    adminDb: admin.firestore.Firestore;
    adminAuth: admin.auth.Auth;
    adminStorage: admin.storage.Storage;
    adminTimestamp: typeof admin.firestore.Timestamp;
}

// Usamos una variable global para almacenar la única instancia (patrón Singleton).
let instances: AdminInstances | undefined;

function initializeAdminApp(): AdminInstances {
    // La inicialización solo ocurre una vez.
    if (!admin.apps.length) {
        try {
            const serviceAccount = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON!);
            
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount)
            });
            
            console.log("Firebase Admin SDK inicializado exitosamente.");

        } catch (error: any) {
            console.error("Error CRÍTICO al inicializar Firebase Admin SDK:", error);
            // Lanzamos el error para detener la ejecución si la inicialización falla.
            throw new Error("No se pudo inicializar Firebase Admin SDK.");
        }
    }
    
    // Guardamos las instancias para reutilizarlas en llamadas futuras.
    return {
        adminDb: admin.firestore(),
        adminAuth: admin.auth(),
        adminStorage: admin.storage(),
        adminTimestamp: admin.firestore.Timestamp,
    };
}

/**
 * Obtiene las instancias de los servicios de Firebase Admin,
 * inicializando la app si es necesario.
 * Este patrón asegura que la inicialización ocurra solo una vez.
 * @returns {AdminInstances} - Un objeto con las instancias de los servicios de Admin.
 */
export function getAdminInstances(): AdminInstances {
    if (!instances) {
        instances = initializeAdminApp();
    }
    return instances;
}

// Exportamos las instancias directamente para los casos donde no hay riesgo de dependencia circular (ej. scripts)
// pero la función getAdminInstances es la forma preferida y más segura.
const { adminDb, adminAuth, adminStorage, adminTimestamp } = getAdminInstances();
export { adminDb, adminAuth, adminStorage, adminTimestamp };
