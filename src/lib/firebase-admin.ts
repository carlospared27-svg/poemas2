// src/lib/firebase-admin.ts
import admin from 'firebase-admin';
import { getApps } from 'firebase-admin/app';
import * as dotenv from 'dotenv';

// Cargar variables de entorno locales en desarrollo
if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: '.env.local' });
}

// La clave de servicio se lee de las variables de entorno.
const serviceAccountKey = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;

// --- LÓGICA DE INICIALIZACIÓN PEREZOSA ---
// Esta función asegura que Firebase Admin solo se inicialice una vez.
function initializeAdminApp() {
  if (getApps().length === 0) {
    if (!serviceAccountKey) {
      throw new Error('La variable de entorno GOOGLE_SERVICE_ACCOUNT_JSON no está definida.');
    }
    try {
      admin.initializeApp({
        credential: admin.credential.cert(JSON.parse(serviceAccountKey))
      });
      console.log("✅ Firebase Admin SDK inicializado correctamente.");
    } catch (error) {
      console.error("❌ Error CRÍTICO al inicializar Firebase Admin SDK:", error);
      throw error;
    }
  }
  return admin;
}

// Exportamos una función que devuelve la instancia inicializada.
// De esta forma, cualquier servicio que necesite admin, llamará a esta función.
function getAdminInstances() {
    const adminApp = initializeAdminApp();
    return {
        adminDb: adminApp.firestore(),
        adminAuth: adminApp.auth(),
        adminStorage: adminApp.storage(),
        adminTimestamp: adminApp.firestore.Timestamp,
    };
}

export { getAdminInstances };
