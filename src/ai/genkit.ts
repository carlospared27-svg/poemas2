
// src/ai/genkit.ts

import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

// La inicialización de Genkit ahora depende de que la variable de entorno
// GEMINI_API_KEY esté configurada en el entorno de despliegue.
// Ya no se asigna un valor por defecto en el código para evitar errores en producción.

export const ai = genkit({
  plugins: [googleAI()],
  // El modelo por defecto se puede configurar aquí si se desea.
});
