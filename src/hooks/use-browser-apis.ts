// src/hooks/use-browser-apis.ts
"use client";

import * as React from "react";

export const useBrowserAPIs = () => {
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    // Este efecto solo se ejecuta en el lado del cliente,
    // garantizando que cualquier lógica dependiente de APIs de navegador
    // solo se ejecute después del montaje del componente.
    setIsClient(true);
  }, []);

  return {
    isClient,
    // Devolvemos las APIs del navegador solo si estamos en el cliente,
    // de lo contrario, devolvemos null para evitar errores de SSR.
    speechSynthesis: isClient ? window.speechSynthesis : null,
    localStorage: isClient ? window.localStorage : null,
    navigator: isClient ? window.navigator : null,
    pageOrigin: isClient ? window.location.origin : "",
  };
};

export const useLocalStorage = <T>(key: string, defaultValue: T): [T, React.Dispatch<React.SetStateAction<T>>, boolean] => {
  const [value, setValue] = React.useState<T>(defaultValue);
  const [isLoaded, setIsLoaded] = React.useState(false);

  React.useEffect(() => {
    // Aseguramos que el código solo se ejecute en el cliente.
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(key);
        if (stored !== null) {
          setValue(JSON.parse(stored));
        }
      } catch (error) {
        console.error(`Error loading ${key} from localStorage:`, error);
      } finally {
        // Marcamos como cargado solo después de intentar leer de localStorage.
        setIsLoaded(true);
      }
    }
  }, [key]);

  const setStoredValue: React.Dispatch<React.SetStateAction<T>> = (newValue) => {
    if (typeof window !== 'undefined') {
        try {
          const valueToStore = newValue instanceof Function ? newValue(value) : newValue;
          setValue(valueToStore);
          localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (error) {
          console.error(`Error saving ${key} to localStorage:`, error);
        }
    }
  };

  return [value, setStoredValue, isLoaded];
};
