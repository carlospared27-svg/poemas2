// src/lib/config.ts

// Ahora puedes añadir todos los correos de administradores que quieras en esta lista.
export const ADMIN_EMAILS = [
    "carlospared27@gmail.com",
    "uptcarlos@gmail.com",
    "maribel_19_388@hotmail.com",
    // Añade más correos aquí si es necesario
  ];
  
  // Mantenemos la variable original por si se usa en otro lugar, 
  // aunque la lógica principal usará la lista.
  export const ADMIN_EMAIL = ADMIN_EMAILS[0]; 
  