
'use server';

import { Poem } from './poems-data';

// Define the structure of an API response photo
interface ApiPhoto {
  imageUrl: string;
  photographerName: string;
  photographerUrl: string;
}

// Master list of romantic keywords from user
const romanticKeywords = [
  'romance', 'pasión', 'ternura', 'abrazo', 'beso', 'confianza', 
  'conexión', 'intimidad', 'juntos', 'alma gemela', 'amor eterno', 
  'corazón', 'promesa', 'cartas de amor', 'manos entrelazada', 
  'pareja en la playa', 'pareja bajo la lluvia', 'paseo por el parque', 
  'mirando las estrellas'
];

/**
 * Selects 1 or 2 random keywords from the master list.
 * @returns A query string with 1 or 2 random keywords.
 */
function getRandomKeywordsQuery(): string {
  const shuffled = romanticKeywords.sort(() => 0.5 - Math.random());
  const count = Math.random() < 0.5 ? 1 : 2; // 50% chance for 1 or 2 keywords
  return shuffled.slice(0, count).join(' ');
}


/**
 * Fetches an image from Pexels based on a random selection of romantic keywords.
 */
async function getPexelsImage(): Promise<ApiPhoto | null> {
  const apiKey = process.env.PEXELS_API_KEY;
  if (!apiKey) {
    console.error("Pexels API key is not configured.");
    return null;
  }

  const query = getRandomKeywordsQuery();
  const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&orientation=portrait&size=medium&per_page=5`;

  try {
    const response = await fetch(url, { headers: { Authorization: apiKey } });
    if (!response.ok) throw new Error(`Pexels API request failed with status ${response.status}`);
    
    const data = await response.json();
    if (data.photos && data.photos.length > 0) {
      const randomPhoto = data.photos[Math.floor(Math.random() * data.photos.length)];
      return {
        imageUrl: randomPhoto.src.medium,
        photographerName: randomPhoto.photographer,
        photographerUrl: randomPhoto.photographer_url,
      };
    }
  } catch (error) {
    console.error("Failed to fetch image from Pexels:", error);
  }
  return null;
}

/**
 * Fetches an image from Unsplash based on a random selection of romantic keywords.
 */
async function getUnsplashImage(): Promise<ApiPhoto | null> {
    const accessKey = process.env.UNSPLASH_ACCESS_KEY;
    if (!accessKey) {
        console.error("Unsplash Access Key is not configured.");
        return null;
    }

    const query = getRandomKeywordsQuery();
    const url = `https://api.unsplash.com/photos/random?query=${encodeURIComponent(query)}&orientation=portrait&count=1`;
    
    try {
        const response = await fetch(url, { headers: { Authorization: `Client-ID ${accessKey}` } });
        if (!response.ok) throw new Error(`Unsplash API request failed with status ${response.status}`);

        const data = await response.json();
         if (data && Array.isArray(data) && data.length > 0) {
            const photo = data[0];
            if (photo && photo.urls && photo.user) {
                return {
                    imageUrl: photo.urls.regular,
                    photographerName: photo.user.name,
                    photographerUrl: photo.user.links.html,
                };
            }
        }
    } catch (error) {
        console.error("Failed to fetch image from Unsplash:", error);
    }
    return null;
}

/**
 * Fetches an image from Pixabay based on a random selection of romantic keywords.
 */
async function getPixabayImage(): Promise<ApiPhoto | null> {
    const apiKey = process.env.PIXABAY_API_KEY;
    if (!apiKey) {
        console.error("Pixabay API key is not configured.");
        return null;
    }

    const query = getRandomKeywordsQuery();
    const url = `https://pixabay.com/api/?key=${apiKey}&q=${encodeURIComponent(query)}&image_type=photo&orientation=vertical&per_page=20`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Pixabay API request failed with status ${response.status}`);

        const data = await response.json();
        if (data && data.hits && data.hits.length > 0) {
            const photo = data.hits[Math.floor(Math.random() * data.hits.length)];
            return {
                imageUrl: photo.webformatURL,
                photographerName: photo.user,
                photographerUrl: `https://pixabay.com/users/${photo.user}-${photo.user_id}/`,
            };
        }
    } catch (error) {
        console.error("Failed to fetch image from Pixabay:", error);
    }
    return null;
}


/**
 * Fetches an image from a randomly selected provider (Pexels, Unsplash, or Pixabay).
 * @returns An object with the image URL, photographer's name, and their profile URL.
 */
export async function getImageForPoem(): Promise<Partial<Poem>> {
    const providers = [getPexelsImage, getUnsplashImage, getPixabayImage];
    // Randomly select a provider
    const selectedProvider = providers[Math.floor(Math.random() * providers.length)];

    const imageData = await selectedProvider();

    if (imageData) {
        return {
            imageUrl: imageData.imageUrl,
            photographerName: imageData.photographerName,
            photographerUrl: imageData.photographerUrl,
        };
    }

    // Return empty if no image is found or an error occurs
    return {};
}
