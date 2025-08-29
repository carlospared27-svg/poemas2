// src/lib/firebase-admin.ts
import admin from 'firebase-admin';
import { getApps } from 'firebase-admin/app';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
const serviceAccountKey = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;

// Log para verificar si la variable de entorno está cargada
console.log("--- Verificando Firebase Admin SDK ---");
console.log("¿Variable GOOGLE_SERVICE_ACCOUNT_JSON encontrada?", !!serviceAccountKey);

if (!getApps().length) {
  if (!serviceAccountKey) {
    // Si la clave no existe, lanzamos un error claro en la terminal
    console.error('ERROR CRÍTICO: La variable de entorno GOOGLE_SERVICE_ACCOUNT_JSON no está configurada.');
  } else {
    try {
      admin.initializeApp({
        credential: admin.credential.cert(JSON.parse(serviceAccountKey))
      });
      console.log("✅ Firebase Admin SDK inicializado por primera vez.");
    } catch (error) {
      console.error("❌ Error al inicializar Firebase Admin SDK:", error);
    }
  }
}

const adminDb = admin.firestore();
const adminAuth = admin.auth();
const adminStorage = admin.storage();
const adminTimestamp = admin.firestore.Timestamp;

export { adminDb, adminAuth, adminStorage, adminTimestamp };