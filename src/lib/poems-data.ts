

export type Poem = {
  id: string;
  title: string;
  poem: string;
  author?: string; // <--- LÍNEA AÑADIDA
  createdAt: string; // ISO 8601 format
  likes: number;
  shares: number;
  image: string; // Fallback image
  imageHint: string; 
  imageUrl?: string; // For Pexels image
  photographerName?: string;
  photographerUrl?: string;
};

export type PoemsByCategory = Record<string, Omit<Poem, 'id' | 'imageUrl' | 'photographerName' | 'photographerUrl'>[]>;

// Helper function to generate a unique ID
const generateId = (title: string, category: string) => {
  const slug = title.toLowerCase().replace(/[^a-zA-Z0-9- ]/g, '').replace(/\s+/g, '-');
  return `${category.toLowerCase().replace(/\s+/g, '-')}-${slug}`;
};

const rawPoemsData: PoemsByCategory = {
  "Poemascortos": [
    {
      "title": "Instante",
      "poem": "Un suspiro, una mirada...\n¡el universo en tu ser!",
      "createdAt": new Date().toISOString(),
      "likes": 15,
      "shares": 5,
      "image": "/imagenes-poemas/imagen107.png",
      "imageHint": "universe eye"
    },
    {
      "title": "Faro",
      "poem": "Tu risa, luz en la noche...\nguía mi alma perdida.",
       "createdAt": new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      "likes": 25,
      "shares": 10,
      "image": "/imagenes-poemas/imagen96.png",
      "imageHint": "lighthouse night"
    },
     {
      "title": "Eco",
      "poem": "Tus palabras, eco dulce...\nresuenan en mi silencio.",
       "createdAt": new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      "likes": 18,
      "shares": 7,
      "image": "/imagenes-poemas/imagen39.png",
      "imageHint": "silent forest"
    },
    {
      "title": "Mar",
      "poem": "Eres mar y soy la arena,\ndonde tus besos naufragan.",
       "createdAt": new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      "likes": 30,
      "shares": 12,
      "image": "/imagenes-poemas/imagen79.png",
      "imageHint": "sea sand"
    },
    {
      "title": "Sol",
      "poem": "Despiertas, y el sol te imita...\ntan radiante como tú.",
       "createdAt": new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      "likes": 22,
      "shares": 8,
      "image": "/imagenes-poemas/imagen26.png",
      "imageHint": "radiant sun"
    },
    {
        "title": "Vuelo",
        "poem": "A tu lado, el tiempo vuela...\ncada segundo, ¡un cielo!",
        "createdAt": "2024-07-20T10:00:00.000Z",
        "likes": 19,
        "shares": 6,
        "image": "/imagenes-poemas/imagen28.png",
        "imageHint": "time flying"
    },
    {
        "title": "Ancla",
        "poem": "Tu amor, mi ancla segura...\nen la tormenta más brava.",
        "createdAt": "2024-07-19T10:00:00.000Z",
        "likes": 28,
        "shares": 14,
        "image": "/imagenes-poemas/imagen27.png",
        "imageHint": "anchor storm"
    },
    {
        "title": "Lluvia",
        "poem": "Tus besos, lluvia de mayo...\n¡florece mi corazón!",
        "createdAt": "2024-07-18T10:00:00.000Z",
        "likes": 21,
        "shares": 9,
        "image": "/imagenes-poemas/imagen106.png",
        "imageHint": "may rain"
    },
    {
        "title": "Pausa",
        "poem": "Eres la pausa que anhelo...\nen mi mundo de carreras.",
        "createdAt": "2024-07-17T10:00:00.000Z",
        "likes": 31,
        "shares": 11,
        "image": "/imagenes-poemas/imagen60.png",
        "imageHint": "calm pause"
    },
    {
        "title": "Clave",
        "poem": "Tienes la clave de mi alma...\nabres todas las puertas.",
        "createdAt": "2024-07-16T10:00:00.000Z",
        "likes": 26,
        "shares": 13,
        "image": "/imagenes-poemas/imagen107.png",
        "imageHint": "soul key"
    },
    {
        "title": "Nido",
        "poem": "Tu abrazo, mi nido...\ndonde mi alma descansa.",
        "createdAt": "2024-07-15T11:00:00.000Z",
        "likes": 23,
        "shares": 9,
        "image": "/imagenes-poemas/imagen47.png",
        "imageHint": "cozy nest"
    },
    {
        "title": "Brujula",
        "poem": "Tus ojos, mi norte...\nNo necesito más guía.",
        "createdAt": "2024-07-14T11:00:00.000Z",
        "likes": 27,
        "shares": 11,
        "image": "/imagenes-poemas/imagen23.png",
        "imageHint": "compass eyes"
    },
    {
        "title": "Silencio",
        "poem": "Contigo, el silencio...\nhabla más que mil palabras.",
        "createdAt": "2024-07-13T11:00:00.000Z",
        "likes": 20,
        "shares": 8,
        "image": "/imagenes-poemas/imagen9.png",
        "imageHint": "speaking silence"
    },
    {
        "title": "Rio",
        "poem": "Fluyo hacia ti, amor...\ncomo el río hacia el mar.",
        "createdAt": "2024-07-12T11:00:00.000Z",
        "likes": 29,
        "shares": 15,
        "image": "/imagenes-poemas/imagen10.png",
        "imageHint": "river sea"
    },
    {
        "title": "Luz de luna",
        "poem": "Bajo la luna, tu rostro...\nes un poema de plata.",
        "createdAt": "2024-07-11T11:00:00.000Z",
        "likes": 24,
        "shares": 10,
        "image": "/imagenes-poemas/imagen53.png",
        "imageHint": "moonlit face"
    },
    {
        "title": "Color",
        "poem": "Pintas mi mundo gris...\ncon el color de tus besos.",
        "createdAt": "2024-07-10T11:00:00.000Z",
        "likes": 32,
        "shares": 14,
        "image": "/imagenes-poemas/imagen86.png",
        "imageHint": "colorful kisses"
    },
    {
        "title": "Certeza",
        "poem": "Mi única certeza...\neres tú en este caos.",
        "createdAt": "2024-07-09T11:00:00.000Z",
        "likes": 18,
        "shares": 9,
        "image": "/imagenes-poemas/imagen53.png",
        "imageHint": "certainty chaos"
    },
    {
        "title": "Hogar",
        "poem": "Mi hogar no es un lugar...\n¡es donde tú estás!",
        "createdAt": "2024-07-08T11:00:00.000Z",
        "likes": 33,
        "shares": 16,
        "image": "/imagenes-poemas/imagen2.png",
        "imageHint": "home you"
    },
    {
        "title": "Verso",
        "poem": "Cada latido tuyo...\nun verso que me enamora.",
        "createdAt": "2024-07-07T11:00:00.000Z",
        "likes": 25,
        "shares": 12,
        "image": "/imagenes-poemas/imagen20.png",
        "imageHint": "heartbeat verse"
    },
    {
        "title": "Magia",
        "poem": "Tu simple existencia...\nes mi truco de magia favorito.",
        "createdAt": "2024-07-06T11:00:00.000Z",
        "likes": 28,
        "shares": 13,
        "image": "/imagenes-poemas/imagen38.png",
        "imageHint": "magic existence"
    },
    {
        "title": "Eden",
        "poem": "A tu lado encontré...\nel Edén que perdí.",
        "createdAt": "2024-07-05T11:00:00.000Z",
        "likes": 22,
        "shares": 7,
        "image": "/imagenes-poemas/imagen40.png",
        "imageHint": "lost eden"
    },
    {
        "title": "Piel",
        "poem": "Mi piel te reconoce...\naún antes de tocarte.",
        "createdAt": "2024-07-04T11:00:00.000Z",
        "likes": 31,
        "shares": 11,
        "image": "/imagenes-poemas/imagen71.png",
        "imageHint": "skin recognition"
    },
    {
        "title": "Aroma",
        "poem": "Tu aroma se quedó...\nimpregnado en mi alma.",
        "createdAt": "2024-07-03T11:00:00.000Z",
        "likes": 26,
        "shares": 10,
        "image": "/imagenes-poemas/imagen44.png",
        "imageHint": "soul aroma"
    },
    {
        "title": "Destino",
        "poem": "Fuiste el mejor desvío...\nde mi planeado destino.",
        "createdAt": "2024-07-02T11:00:00.000Z",
        "likes": 35,
        "shares": 17,
        "image": "/imagenes-poemas/imagen41.png",
        "imageHint": "destiny detour"
    },
    {
        "title": "Refugio",
        "poem": "Eres mi refugio eterno...\nen medio de la tormenta.",
        "createdAt": "2024-07-01T11:00:00.000Z",
        "likes": 29,
        "shares": 14,
        "image": "/imagenes-poemas/imagen66.png",
        "imageHint": "eternal refuge"
    },
    {
        "title": "Estrella",
        "poem": "En mi noche más oscura...\ntú, mi estrella polar.",
        "createdAt": "2024-06-30T11:00:00.000Z",
        "likes": 27,
        "shares": 13,
        "image": "/imagenes-poemas/imagen60.png",
        "imageHint": "polar star"
    },
    {
        "title": "Tregua",
        "poem": "El mundo pide tregua...\ncuando nuestras miradas chocan.",
        "createdAt": "2024-06-29T11:00:00.000Z",
        "likes": 24,
        "shares": 9,
        "image": "/imagenes-poemas/imagen67.png",
        "imageHint": "world truce"
    },
    {
        "title": "Seda",
        "poem": "Tu voz, caricia de seda...\nen mis noches de insomnio.",
        "createdAt": "2024-06-28T11:00:00.000Z",
        "likes": 21,
        "shares": 8,
        "image": "/imagenes-poemas/imagen64.png",
        "imageHint": "silk voice"
    },
    {
        "title": "Puzzle",
        "poem": "Eres la pieza que faltaba...\nen el puzzle de mi vida.",
        "createdAt": "2024-06-27T11:00:00.000Z",
        "likes": 34,
        "shares": 18,
        "image": "/imagenes-poemas/imagen66.png",
        "imageHint": "puzzle piece"
    },
    {
        "title": "Raiz",
        "poem": "Nuestro amor echó raíces...\n¡imposibles de arrancar!",
        "createdAt": "2024-06-26T11:00:00.000Z",
        "likes": 30,
        "shares": 15,
        "image": "/imagenes-poemas/imagen92.png",
        "imageHint": "love roots"
    },
    {
      "title": "Huella 🐾",
      "poem": "Dejas huella en mi alma,\ncomo la arena en la playa.",
      "createdAt": new Date().toISOString(),
      "likes": 12,
      "shares": 4,
      "image": "/imagenes-poemas/imagen35.png",
      "imageHint": "footprint sand"
    },
    {
      "title": "Brújula 🧭",
      "poem": "Perdido en tu mirada,\nmi única brújula.",
      "createdAt": new Date().toISOString(),
      "likes": 20,
      "shares": 8,
      "image": "/imagenes-poemas/imagen7.png",
      "imageHint": "compass eyes"
    },
    {
      "title": "Fuego 🔥",
      "poem": "Tu beso: un incendio\nque no quiero apagar.",
      "createdAt": new Date().toISOString(),
      "likes": 25,
      "shares": 10,
      "image": "/imagenes-poemas/imagen20.png",
      "imageHint": "fire kiss"
    },
    {
      "title": "Música 🎶",
      "poem": "Tu risa es la música\nque le faltaba a mis días.",
      "createdAt": new Date().toISOString(),
      "likes": 30,
      "shares": 12,
      "image": "/imagenes-poemas/imagen18.png",
      "imageHint": "laughing music"
    },
    {
      "title": "Olas 🌊",
      "poem": "Como las olas al mar,\nasí vuelvo siempre a ti.",
      "createdAt": new Date().toISOString(),
      "likes": 28,
      "shares": 11,
      "image": "/imagenes-poemas/imagen69.png",
      "imageHint": "ocean waves"
    },
    {
      "title": "Cielo 🌌",
      "poem": "Me robaste el aliento,\ny me regalaste el cielo.",
      "createdAt": new Date().toISOString(),
      "likes": 35,
      "shares": 15,
      "image": "/imagenes-poemas/imagen80.png",
      "imageHint": "sky gift"
    },
    {
      "title": "Poema 📜",
      "poem": "Eres el poema\nque nunca supe escribir.",
      "createdAt": new Date().toISOString(),
      "likes": 22,
      "shares": 9,
      "image": "/imagenes-poemas/imagen106.png",
      "imageHint": "poem writing"
    },
    {
      "title": "Imán 🧲",
      "poem": "Somos dos polos opuestos,\nunidos por un imán invisible.",
      "createdAt": new Date().toISOString(),
      "likes": 18,
      "shares": 7,
      "image": "/imagenes-poemas/imagen66.png",
      "imageHint": "invisible magnet"
    },
    {
      "title": "Ancla ⚓",
      "poem": "En mi mar de dudas,\ntu amor es mi ancla.",
      "createdAt": new Date().toISOString(),
      "likes": 26,
      "shares": 13,
      "image": "/imagenes-poemas/imagen102.png",
      "imageHint": "love anchor"
    },
    {
      "title": "Café ☕",
      "poem": "Tu amor me despierta,\nmás que cualquier café.",
      "createdAt": new Date().toISOString(),
      "likes": 32,
      "shares": 14,
      "image": "/imagenes-poemas/imagen66.png",
      "imageHint": "love coffee"
    },
    {
      "title": "Lluvia 💧",
      "poem": "Amo la lluvia,\nporque me recuerda a tus besos.",
      "createdAt": new Date().toISOString(),
      "likes": 19,
      "shares": 6,
      "image": "/imagenes-poemas/imagen3.png",
      "imageHint": "rain kisses"
    },
    {
      "title": "Constelación ✨",
      "poem": "Tus lunares son la constelación\nque guía mis noches.",
      "createdAt": new Date().toISOString(),
      "likes": 27,
      "shares": 11,
      "image": "/imagenes-poemas/imagen74.png",
      "imageHint": "mole constellation"
    },
    {
      "title": "Latido ❤️",
      "poem": "Mi corazón late a tu ritmo,\nuna canción para dos.",
      "createdAt": new Date().toISOString(),
      "likes": 38,
      "shares": 18,
      "image": "/imagenes-poemas/imagen88.png",
      "imageHint": "heartbeat song"
    },
    {
      "title": "Refugio 🏡",
      "poem": "Tu abrazo es mi casa,\nmi refugio en la tormenta.",
      "createdAt": new Date().toISOString(),
      "likes": 40,
      "shares": 20,
      "image": "/imagenes-poemas/imagen10.png",
      "imageHint": "hug home"
    },
    {
      "title": "Vértigo 🎢",
      "poem": "Mirarte a los ojos\nes sentir un vértigo dulce.",
      "createdAt": new Date().toISOString(),
      "likes": 24,
      "shares": 9,
      "image": "/imagenes-poemas/imagen57.png",
      "imageHint": "sweet vertigo"
    },
    {
      "title": "Puzle 🧩",
      "poem": "Contigo, las piezas de mi vida\nfinalmente encajan.",
      "createdAt": new Date().toISOString(),
      "likes": 33,
      "shares": 16,
      "image": "/imagenes-poemas/imagen23.png",
      "imageHint": "life puzzle"
    },
    {
      "title": "Silencio 🤫",
      "poem": "Nuestro silencio acompasado\nes mi conversación favorita.",
      "createdAt": new Date().toISOString(),
      "likes": 21,
      "shares": 8,
      "image": "/imagenes-poemas/imagen72.png",
      "imageHint": "favorite conversation"
    },
    {
      "title": "Magia 🪄",
      "poem": "No eres un truco,\neres magia de verdad.",
      "createdAt": new Date().toISOString(),
      "likes": 29,
      "shares": 12,
      "image": "/imagenes-poemas/imagen12.png",
      "imageHint": "real magic"
    },
    {
      "title": "Norte ⭐",
      "poem": "Si me pierdo,\ntú siempre eres mi norte.",
      "createdAt": new Date().toISOString(),
      "likes": 31,
      "shares": 13,
      "image": "/imagenes-poemas/imagen105.png",
      "imageHint": "my north"
    },
    {
      "title": "Eco 🍃",
      "poem": "Te digo 'te quiero',\ny el eco me lo devuelve tu alma.",
      "createdAt": new Date().toISOString(),
      "likes": 23,
      "shares": 10,
      "image": "/imagenes-poemas/imagen64.png",
      "imageHint": "soul echo"
    },
    {
      "title": "Isla 🏝️",
      "poem": "Eres mi isla desierta\nen medio del caos.",
      "createdAt": new Date().toISOString(),
      "likes": 36,
      "shares": 17,
      "image": "/imagenes-poemas/imagen78.png",
      "imageHint": "desert island"
    },
    {
      "title": "Amanecer 🌅",
      "poem": "Despertar contigo\nes ver el amanecer dos veces.",
      "createdAt": new Date().toISOString(),
      "likes": 42,
      "shares": 22,
      "image": "/imagenes-poemas/imagen35.png",
      "imageHint": "sunrise twice"
    },
    {
      "title": "Raíces 🌱",
      "poem": "Mi amor por ti tiene raíces,\nprofundas, inamovibles.",
      "createdAt": new Date().toISOString(),
      "likes": 34,
      "shares": 15,
      "image": "/imagenes-poemas/imagen88.png",
      "imageHint": "deep roots"
    },
    {
      "title": "Oxígeno 💨",
      "poem": "Tu amor es el oxígeno\nque no sabía que necesitaba.",
      "createdAt": new Date().toISOString(),
      "likes": 39,
      "shares": 19,
      "image": "/imagenes-poemas/imagen49.png",
      "imageHint": "love oxygen"
    },
    {
      "title": "Gravedad 🍎",
      "poem": "La única gravedad que siento\nes la que me atrae hacia ti.",
      "createdAt": new Date().toISOString(),
      "likes": 28,
      "shares": 11,
      "image": "/imagenes-poemas/imagen28.png",
      "imageHint": "gravity attraction"
    },
    {
      "title": "Universo 💫",
      "poem": "Todo mi universo cabe\nen la curva de tu sonrisa.",
      "createdAt": new Date().toISOString(),
      "likes": 45,
      "shares": 25,
      "image": "/imagenes-poemas/imagen77.png",
      "imageHint": "smile universe"
    },
    {
      "title": "Reloj ⏳",
      "poem": "Contigo, el tiempo se detiene...\nojala para siempre.",
      "createdAt": new Date().toISOString(),
      "likes": 37,
      "shares": 18,
      "image": "/imagenes-poemas/imagen70.png",
      "imageHint": "time stops"
    },
    {
      "title": "Tinta ✒️",
      "poem": "Eres la tinta indeleble\ncon la que se escribe mi historia.",
      "createdAt": new Date().toISOString(),
      "likes": 26,
      "shares": 10,
      "image": "/imagenes-poemas/imagen101.png",
      "imageHint": "indelible ink"
    },
    {
      "title": "Llave 🔑",
      "poem": "No sabía que mi corazón\nestaba cerrado... hasta que llegaste tú con la llave.",
      "createdAt": new Date().toISOString(),
      "likes": 41,
      "shares": 21,
      "image": "/imagenes-poemas/imagen23.png",
      "imageHint": "heart key"
    },
    {
      "title": "Adicción 💘",
      "poem": "Eres mi adicción favorita,\nla que no pienso dejar.",
      "createdAt": new Date().toISOString(),
      "likes": 44,
      "shares": 24,
      "image": "/imagenes-poemas/imagen38.png",
      "imageHint": "favorite addiction"
    },
    {
      "title": "Foto 📸",
      "poem": "Eres la foto que mi mente\nmira una y otra vez.",
      "createdAt": new Date().toISOString(),
      "likes": 32,
      "shares": 13,
      "image": "/imagenes-poemas/imagen40.png",
      "imageHint": "mind photo"
    },
    {
      "title": "Girasol 🌻",
      "poem": "Yo soy el girasol,\ny tú eres mi sol.",
      "createdAt": new Date().toISOString(),
      "likes": 36,
      "shares": 16,
      "image": "/imagenes-poemas/imagen69.png",
      "imageHint": "sunflower sun"
    },
    {
      "title": "Infinito ∞",
      "poem": "Te quiero de aquí\nal infinito, ida y vuelta.",
      "createdAt": new Date().toISOString(),
      "likes": 48,
      "shares": 28,
      "image": "/imagenes-poemas/imagen76.png",
      "imageHint": "infinity love"
    },
    {
      "title": "Pintura 🎨",
      "poem": "Pintas de colores\nmi mundo en blanco y negro.",
      "createdAt": new Date().toISOString(),
      "likes": 35,
      "shares": 15,
      "image": "/imagenes-poemas/imagen100.png",
      "imageHint": "color painting"
    },
    {
      "title": "Tesoro 💎",
      "poem": "Eres el tesoro\nque no buscaba pero encontré.",
      "createdAt": new Date().toISOString(),
      "likes": 43,
      "shares": 23,
      "image": "/imagenes-poemas/imagen107.png",
      "imageHint": "found treasure"
    },
    {
      "title": "Calma 🧘",
      "poem": "Eres la calma\nque mi caos necesitaba.",
      "createdAt": new Date().toISOString(),
      "likes": 39,
      "shares": 20,
      "image": "/imagenes-poemas/imagen98.png",
      "imageHint": "chaos calm"
    },
    {
      "title": "Canción 🎤",
      "poem": "Tu voz es una canción de cuna\nque adormece mis miedos.",
      "createdAt": new Date().toISOString(),
      "likes": 30,
      "shares": 12,
      "image": "/imagenes-poemas/imagen49.png",
      "imageHint": "lullaby voice"
    },
    {
      "title": "Hogar 💖",
      "poem": "Hogar es cualquier sitio\ndonde esté contigo.",
      "createdAt": new Date().toISOString(),
      "likes": 50,
      "shares": 30,
      "image": "/imagenes-poemas/imagen105.png",
      "imageHint": "home together"
    },
    {
      "title": "Luz 💡",
      "poem": "Cuando llegaste,\nse hizo la luz.",
      "createdAt": new Date().toISOString(),
      "likes": 46,
      "shares": 26,
      "image": "/imagenes-poemas/imagen73.png",
      "imageHint": "made light"
    },
    {
      "title": "Sueño 💭",
      "poem": "Eres el sueño\nque no quiero que termine.",
      "createdAt": new Date().toISOString(),
      "likes": 47,
      "shares": 27,
      "image": "/imagenes-poemas/imagen19.png",
      "imageHint": "dream end"
    }
  ],
  "Versosdeamor": [
    {
      "title": "Tu Geografia",
      "poem": "Recorro el mapa de tu piel...\ncada lunar, una ciudad que anhelo conquistar.\nTu espalda, cordillera de secretos,\ny tus labios... ¡el mar donde quiero naufragar!",
      "createdAt": new Date().toISOString(),
      "likes": 40,
      "shares": 20,
      "image": "/imagenes-poemas/imagen55.png",
      "imageHint": "skin map"
    },
    {
      "title": "Lenguaje de Miradas",
      "poem": "No necesitamos palabras, amor mío...\n¡nos basta el lenguaje de las miradas!\nEn ellas se esconde el universo entero,\nun diálogo de almas... enamoradas.",
       "createdAt": new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      "likes": 35,
      "shares": 15,
      "image": "/imagenes-poemas/imagen69.png",
      "imageHint": "lovers gaze"
    },
     {
      "title": "Arquitecto de Suenos",
      "poem": "Eres el arquitecto de mis sueños...\nconstruyes palacios en mi mente.\nCada noche te espero en mis anhelos,\npara amarte... ¡eternamente!",
      "createdAt": new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
      "likes": 28,
      "shares": 11,
      "image": "/imagenes-poemas/imagen95.png",
      "imageHint": "dream architect"
    },
    {
      "title": "La Cura de tu Abrazo",
      "poem": "Si el mundo me hiere con su prisa,\ny la melancolía me quiere atrapar...\n¡corro a buscar la cura en tu sonrisa\ny en el refugio tibio de tu abrazar!",
       "createdAt": new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      "likes": 45,
      "shares": 25,
      "image": "/imagenes-poemas/imagen52.png",
      "imageHint": "healing hug"
    },
    {
      "title": "Melodia",
      "poem": "Eres la melodía que mi alma tararea...\nla canción que nunca quiero que termine.",
      "createdAt": "2024-07-15T12:00:00.000Z",
      "likes": 33,
      "shares": 18,
      "image": "/imagenes-poemas/imagen41.png",
      "imageHint": "soul melody"
    },
    {
      "title": "Universo",
      "poem": "En tus ojos cabe el universo entero...\ny yo solo quiero ser tu astronauta.",
      "createdAt": "2024-07-14T12:00:00.000Z",
      "likes": 42,
      "shares": 22,
      "image": "/imagenes-poemas/imagen7.png",
      "imageHint": "universe eyes"
    },
    {
      "title": "Poesia Involuntaria",
      "poem": "No sé si te das cuenta, vida mía,\nque cuando hablas, ¡haces poesía!\nCada gesto tuyo es una rima perfecta,\nen el poema de amor que mi alma proyecta.",
      "createdAt": "2024-07-13T12:00:00.000Z",
      "likes": 38,
      "shares": 19,
      "image": "/imagenes-poemas/imagen80.png",
      "imageHint": "involuntary poetry"
    },
    {
      "title": "Naufragio Dulce",
      "poem": "Quisiera ser un barco a la deriva...\npara perderme en el mar de tu boca.\nUn naufragio dulce, sin despedida,\n¡que en cada beso, más amor provoca!",
      "createdAt": "2024-07-12T12:00:00.000Z",
      "likes": 41,
      "shares": 21,
      "image": "/imagenes-poemas/imagen66.png",
      "imageHint": "sweet shipwreck"
    },
    {
      "title": "Tatuaje de Sol",
      "poem": "Tu recuerdo es un tatuaje de sol en mi piel...\nuna marca imborrable de un verano eterno.\nAunque llegue el invierno y el frío sea cruel,\nme abriga la memoria de tu amor tierno.",
      "createdAt": "2024-07-11T12:00:00.000Z",
      "likes": 36,
      "shares": 17,
      "image": "/imagenes-poemas/imagen75.png",
      "imageHint": "sun tattoo"
    },
    {
      "title": "Codigo Secreto",
      "poem": "Tu risa tiene un código secreto...\nque solo mi corazón sabe descifrar.\nEs la clave que abre mi mundo completo,\nla contraseña para empezar a soñar.",
      "createdAt": "2024-07-10T12:00:00.000Z",
      "likes": 39,
      "shares": 23,
      "image": "/imagenes-poemas/imagen98.png",
      "imageHint": "secret code"
    },
    {
      "title": "Reloj Detenido",
      "poem": "Cuando estoy contigo, detengo el reloj...\nlas horas se convierten en instantes fugaces.\nNo existe el tiempo, no hay un adiós,\nsolo el presente lleno de tus audaces besos.",
      "createdAt": "2024-07-09T12:00:00.000Z",
      "likes": 44,
      "shares": 24,
      "image": "/imagenes-poemas/imagen15.png",
      "imageHint": "stopped clock"
    },
    {
      "title": "Ladron de Estrellas",
      "poem": "Anoche le robé una estrella al cielo...\npara ponerla en el brillo de tu mirada.\nAhora entiendo por qué tu luz es mi desvelo...\n¡eres la constelación más anhelada!",
      "createdAt": "2024-07-08T12:00:00.000Z",
      "likes": 37,
      "shares": 16,
      "image": "/imagenes-poemas/imagen38.png",
      "imageHint": "star thief"
    },
    {
      "title": "Mi Vicio Confesable",
      "poem": "Eres mi vicio, mi dulce condena...\nla adicción que no quiero superar.\nBeber de tus labios vale la pena,\n¡es un veneno que me quiero tomar!",
      "createdAt": "2024-07-07T12:00:00.000Z",
      "likes": 46,
      "shares": 26,
      "image": "/imagenes-poemas/imagen73.png",
      "imageHint": "sweet addiction"
    },
    {
      "title": "Gravedad Cero",
      "poem": "A tu lado siento la gravedad cero...\nmis pies se despegan, mi alma flota.\nTu amor me eleva al universo entero,\ny cada problema... se vuelve una anécdota remota.",
      "createdAt": "2024-07-06T12:00:00.000Z",
      "likes": 34,
      "shares": 14,
      "image": "/imagenes-poemas/imagen79.png",
      "imageHint": "zero gravity"
    },
    {
      "title": "Acuarela",
      "poem": "Si mi vida fuera un lienzo en blanco,\ntú serías la acuarela que le da color.\nCada caricia, un trazo franco,\npintando un paisaje de puro amor.",
      "createdAt": "2024-07-05T12:00:00.000Z",
      "likes": 43,
      "shares": 23,
      "image": "/imagenes-poemas/imagen30.png",
      "imageHint": "watercolor life"
    },
    {
      "title": "Jardin Prohibido",
      "poem": "Tus labios son la fruta del jardín prohibido...\ny yo soy el pecador que anhela tu sabor.\nQue me condenen por haberte querido,\n¡pero moriré feliz, embriagado de tu amor!",
      "createdAt": "2024-07-04T12:00:00.000Z",
      "likes": 48,
      "shares": 28,
      "image": "/imagenes-poemas/imagen2.png",
      "imageHint": "forbidden garden"
    },
    {
      "title": "Mi Patria",
      "poem": "He recorrido el mundo en mil viajes,\npero mi única patria es tu abrazo.\nAllí encuentro los más bellos paisajes,\ny me quedo a vivir, pedazo a pedazo.",
      "createdAt": "2024-07-03T12:00:00.000Z",
      "likes": 47,
      "shares": 27,
      "image": "/imagenes-poemas/imagen56.png",
      "imageHint": "embrace homeland"
    },
    {
      "title": "El Eco de tu Nombre",
      "poem": "Mi corazón grita tu nombre en silencio...\ny el eco resuena en cada rincón de mi ser.\nEs un mantra, un dulce sortilegio,\nque me hace amarte más cada amanecer.",
      "createdAt": "2024-07-02T12:00:00.000Z",
      "likes": 39,
      "shares": 20,
      "image": "/imagenes-poemas/imagen39.png",
      "imageHint": "name echo"
    },
    {
      "title": "Efecto Mariposa",
      "poem": "El leve aleteo de tus pestañas...\ndesata un huracán dentro de mi pecho.\nEs el efecto mariposa, las mañas\nde tu amor, que me deja satisfecho.",
      "createdAt": "2024-07-01T12:00:00.000Z",
      "likes": 41,
      "shares": 22,
      "image": "/imagenes-poemas/imagen59.png",
      "imageHint": "butterfly effect"
    },
    {
      "title": "Tu Voz",
      "poem": "Tu voz es el hilo musical de mis días...\nuna sinfonía de notas perfectas.\nAhuyenta mis miedos, mis melancolías,\ny mis tristezas... se vuelven obsoletas.",
      "createdAt": "2024-06-30T12:00:00.000Z",
      "likes": 38,
      "shares": 18,
      "image": "/imagenes-poemas/imagen6.png",
      "imageHint": "voice soundtrack"
    },
    {
      "title": "Mi Religion",
      "poem": "No creo en dioses ni en altares...\nmi única religión es adorarte.\nMis plegarias son besos a millares,\n¡y mi único templo... poder amarte!",
      "createdAt": "2024-06-29T12:00:00.000Z",
      "likes": 49,
      "shares": 29,
      "image": "/imagenes-poemas/imagen85.png",
      "imageHint": "love religion"
    },
    {
      "title": "La Medida del Tiempo",
      "poem": "No mido el tiempo en horas ni en años...\nlo mido en la cantidad de veces que te pienso.\nEn los momentos que no hay desengaños,\ny nuestro amor... es un lienzo inmenso.",
      "createdAt": "2024-06-28T12:00:00.000Z",
      "likes": 44,
      "shares": 24,
      "image": "/imagenes-poemas/imagen66.png",
      "imageHint": "time measure"
    },
    {
      "title": "Fuego y Hielo",
      "poem": "Somos el equilibrio perfecto, el yin y el yang...\ntú el fuego que me enciende, yo el hielo que te calma.\nUna danza eterna, un único plan,\ndos almas gemelas que se entregan el alma.",
      "createdAt": "2024-06-27T12:00:00.000Z",
      "likes": 45,
      "shares": 25,
      "image": "/imagenes-poemas/imagen9.png",
      "imageHint": "fire ice"
    },
    {
      "title": "Mi Suerte",
      "poem": "Dicen que la suerte es para quien la busca,\npero yo te encontré sin buscarte...\nY ahora mi vida es menos brusca,\n¡porque mi mayor suerte fue encontrarte!",
      "createdAt": "2024-06-26T12:00:00.000Z",
      "likes": 50,
      "shares": 30,
      "image": "/imagenes-poemas/imagen64.png",
      "imageHint": "my luck"
    },
    {
      "title": "Versos en tu Piel 💖",
      "poem": "Quiero escribir versos en tu piel con mis besos,\ndejar que mis caricias rimen con tus suspiros.\nQue nuestros cuerpos sean poemas, sin excesos,\nunidos en el arte de nuestros giros.",
      "createdAt": new Date().toISOString(),
      "likes": 42,
      "shares": 18,
      "image": "/imagenes-poemas/imagen20.png",
      "imageHint": "skin poetry"
    },
    {
      "title": "Danza de Almas 💃🕺",
      "poem": "Nuestras almas danzan un vals silencioso,\nun baile que solo nosotros entendemos.\nTu corazón lleva el ritmo, armonioso,\ny en cada paso, más nos queremos.",
      "createdAt": new Date().toISOString(),
      "likes": 38,
      "shares": 16,
      "image": "/imagenes-poemas/imagen99.png",
      "imageHint": "soul dance"
    },
    {
      "title": "Eclipse de Amor 🌘",
      "poem": "Eres la luna que eclipsa mis tristezas,\nel sol que ilumina mi existir.\nContigo, todas son bellezas,\ny no hay nada que me haga sufrir.",
      "createdAt": new Date().toISOString(),
      "likes": 45,
      "shares": 20,
      "image": "/imagenes-poemas/imagen90.png",
      "imageHint": "love eclipse"
    },
    {
      "title": "Tu Risa, mi Canción 🎵",
      "poem": "Tu risa es la melodía que me enamora,\nla canción de cuna que calma mi ser.\nSuena en mi mente a toda hora,\ny me hace volver a nacer.",
      "createdAt": new Date().toISOString(),
      "likes": 40,
      "shares": 17,
      "image": "/imagenes-poemas/imagen58.png",
      "imageHint": "laugh song"
    },
    {
      "title": "El Faro de tus Ojos 💡",
      "poem": "En el mar tempestuoso de la vida,\ntus ojos son el faro que me guía.\nCon tu luz, no hay alma perdida,\nsolo un puerto seguro, ¡vida mía!",
      "createdAt": new Date().toISOString(),
      "likes": 48,
      "shares": 22,
      "image": "/imagenes-poemas/imagen53.png",
      "imageHint": "eyes lighthouse"
    },
    {
      "title": "El Idioma de la Piel 🤫",
      "poem": "Hablamos un idioma que nadie entiende,\nescrito en la piel, con caricias y calor.\nEs un lenguaje que el alma defiende,\nun pacto secreto de eterno amor.",
      "createdAt": new Date().toISOString(),
      "likes": 50,
      "shares": 25,
      "image": "/imagenes-poemas/imagen94.png",
      "imageHint": "skin language"
    },
    {
      "title": "Construyendo un 'Nosotros' 🏗️",
      "poem": "Cada día, un ladrillo; cada beso, el cemento.\nConstruimos un 'nosotros' a fuego lento.\nUn refugio de amor, nuestro monumento,\na prueba de dudas, a prueba del viento.",
      "createdAt": new Date().toISOString(),
      "likes": 43,
      "shares": 19,
      "image": "/imagenes-poemas/imagen5.png",
      "imageHint": "building us"
    },
    {
      "title": "Vino Añejo 🍷",
      "poem": "Nuestro amor es como el vino añejo,\ncon cada año que pasa, sabe mejor.\nEs un tesoro, mi más fiel reflejo,\nde un sentimiento puro y superior.",
      "createdAt": new Date().toISOString(),
      "likes": 46,
      "shares": 21,
      "image": "/imagenes-poemas/imagen75.png",
      "imageHint": "aged wine"
    },
    {
      "title": "El Hilo Rojo del Destino 🧵",
      "poem": "Un hilo rojo nos une desde el nacimiento,\ny aunque a veces se enrede, nunca se romperá.\nEres mi destino, mi único argumento,\nla persona que mi alma siempre amará.",
      "createdAt": new Date().toISOString(),
      "likes": 52,
      "shares": 28,
      "image": "/imagenes-poemas/imagen60.png",
      "imageHint": "red thread"
    },
    {
      "title": "Tu Nombre en mis Labios 🗣️",
      "poem": "Llevo tu nombre grabado en mis labios,\nlo repito en silencio, como una oración.\nEs el más dulce de los resabios,\nla causa y efecto de mi adoración.",
      "createdAt": new Date().toISOString(),
      "likes": 39,
      "shares": 15,
      "image": "/imagenes-poemas/imagen91.png",
      "imageHint": "name lips"
    },
    {
      "title": "Sinfonía Perfecta 🎼",
      "poem": "Nuestros corazones laten al mismo compás,\ncreando una sinfonía, perfecta y audaz.\nEl director es el amor, y no pide más\nque seguir sonando, en un tiempo fugaz.",
      "createdAt": new Date().toISOString(),
      "likes": 41,
      "shares": 18,
      "image": "/imagenes-poemas/imagen105.png",
      "imageHint": "perfect symphony"
    },
    {
      "title": "El Color de tu Mirada 🎨",
      "poem": "No sé de qué color es tu mirada,\npero ha pintado mi alma de felicidad.\nEs una obra de arte, anhelada,\nque admiro en silencio, en la inmensidad.",
      "createdAt": new Date().toISOString(),
      "likes": 47,
      "shares": 23,
      "image": "/imagenes-poemas/imagen2.png",
      "imageHint": "gaze color"
    },
    {
      "title": "El Sabor de tus Besos 🍓",
      "poem": "Tus besos saben a fresas en verano,\na chocolate caliente en el frío invierno.\nSon mi alimento, mi postre soberano,\nla gloria en la tierra, mi paraíso eterno.",
      "createdAt": new Date().toISOString(),
      "likes": 55,
      "shares": 30,
      "image": "/imagenes-poemas/imagen69.png",
      "imageHint": "kiss flavor"
    },
    {
      "title": "Mi Pedazo de Cielo ☁️",
      "poem": "Si el cielo se pudiera partir en pedazos,\nuno de ellos sería, sin duda, tu sonrisa.\nEl más brillante, el que une nuestros lazos,\nel que me da vida, amor, y prisa... por amarte.",
      "createdAt": new Date().toISOString(),
      "likes": 49,
      "shares": 24,
      "image": "/imagenes-poemas/imagen84.png",
      "imageHint": "piece heaven"
    },
    {
      "title": "El Ladrón de mis Sueños 💭",
      "poem": "Eres el ladrón que entra en mis sueños sin permiso,\npara robarme suspiros y llenarme de anhelos.\nNo llames a la puerta, tienes mi compromiso,\nde ser el único dueño de mis desvelos.",
      "createdAt": new Date().toISOString(),
      "likes": 44,
      "shares": 20,
      "image": "/imagenes-poemas/imagen51.png",
      "imageHint": "dream thief"
    },
    {
      "title": "Mi Punto Cardinal 📍",
      "poem": "No importa dónde esté, si al norte o al sur,\ntú siempre eres mi punto cardinal.\nMi destino, mi más brillante cianur,\nun amor que es perfecto y no tiene rival.",
      "createdAt": new Date().toISOString(),
      "likes": 37,
      "shares": 14,
      "image": "/imagenes-poemas/imagen20.png",
      "imageHint": "cardinal point"
    },
    {
      "title": "El Eco del Corazón ❤️",
      "poem": "Cuando te digo 'te amo', no es solo mi voz,\nes el eco de mi corazón que te llama.\nUna vibración que nos une a los dos,\nla prueba irrefutable de esta llama.",
      "createdAt": new Date().toISOString(),
      "likes": 51,
      "shares": 26,
      "image": "/imagenes-poemas/imagen1.png",
      "imageHint": "heart echo"
    },
    {
      "title": "La Paz de tu Abrazo 🤗",
      "poem": "El mundo puede ser un caos, un ruido constante,\npero en tus brazos encuentro mi paz.\nUn silencio bendito, un refugio amante,\ndonde todo lo malo se queda detrás.",
      "createdAt": new Date().toISOString(),
      "likes": 53,
      "shares": 27,
      "image": "/imagenes-poemas/imagen21.png",
      "imageHint": "hug peace"
    },
    {
      "title": "El Sol de mis Días ☀️",
      "poem": "Puedes ser la luna de mis noches, lo entiendo,\npero prefiero que seas el sol de todos mis días.\nEl que me despierta con su amor tremendo,\ny llena mis horas de bellas alegrías.",
      "createdAt": new Date().toISOString(),
      "likes": 56,
      "shares": 32,
      "image": "/imagenes-poemas/imagen36.png",
      "imageHint": "sun days"
    },
    {
      "title": "El Pozo de tus Ojos 👀",
      "poem": "Me caí en el pozo de tus ojos, sin remedio,\ny no quiero que nadie me rescate.\nEs un lugar profundo, mi dulce asedio,\ndonde mi amor por ti, sin cesar, late.",
      "createdAt": new Date().toISOString(),
      "likes": 46,
      "shares": 22,
      "image": "/imagenes-poemas/imagen65.png",
      "imageHint": "eyes well"
    }
  ],
  "Cartasapasionadas": [
    {
      "title": "Mi Adorada Tortura",
      "poem": "Eres la más dulce de las torturas, la fiebre que me consume y me da vida... Cada noche, tu recuerdo me visita en la penumbra, y mi cuerpo arde en una hoguera encendida. Anhelo el roce de tu piel contra la mía, el sabor de tus besos que me roban la razón... ¡Esta distancia es una cruel agonía, pero alimenta la llama de esta inmensa pasión!",
      "createdAt": new Date().toISOString(),
      "likes": 50,
      "shares": 30,
      "image": "/imagenes-poemas/imagen5.png",
      "imageHint": "sweet torture"
    },
    {
      "title": "Tinta y Deseo",
      "poem": "Esta carta va manchada de deseo... mis dedos tiemblan al escribir tu nombre. Eres la musa de este amor, mi trofeo, la fantasía que de mi razón se esconde. Imagino tus manos recorriendo mi cuerpo, desatando tormentas, calmando mi sed... Que estas palabras sean el puente, el puerto, donde nuestras almas se encuentren otra vez.",
       "createdAt": new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      "likes": 48,
      "shares": 28,
      "image": "/imagenes-poemas/imagen78.png",
      "imageHint": "ink desire"
    },
    {
      "title": "Confesion Nocturna",
      "poem": "Mi amor, te escribo en la complicidad de la noche... cuando el silencio grita tu nombre. No puedo más que rendirme a este derroche de sentimientos que por ti no se esconden. Eres mi norte, mi sur, mi guía y mi perdición... Y en esta dulce condena, ¡encuentro mi salvación!.",
      "createdAt": "2024-07-10T22:00:00.000Z",
      "likes": 55,
      "shares": 35,
      "image": "/imagenes-poemas/imagen21.png",
      "imageHint": "night confession"
    },
    {
      "title": "Mapa de Lunares",
      "poem": "Mi vida, esta noche me dedico a estudiar el mapa de tu cuerpo en mi memoria. Cada lunar es una estrella que me guía hacia el tesoro de tu gloria. Recuerdo el camino de mis besos por tu cuello, el surco de mis dedos en tu espalda... Y esta ausencia se siente como un atropello a mi alma, que sin ti se acobarda. ¡Vuelve pronto, que mi expedición te necesita! Mi amor por ti es una urgencia infinita.",
      "createdAt": "2024-07-09T22:00:00.000Z",
      "likes": 52,
      "shares": 32,
      "image": "/imagenes-poemas/imagen7.png",
      "imageHint": "moles map"
    },
    {
      "title": "Sed Insaciable",
      "poem": "Tengo una sed que solo tus labios pueden calmar... una sed de ti que me atormenta y me enloquece. Es un desierto mi boca si no te puede besar, un páramo donde nada florece. Eres el oasis que mi alma anhela encontrar, la fuente de vida que me estremece. No tardes, amor mío, en venir a regar este corazón que te pertenece.",
      "createdAt": "2024-07-08T22:00:00.000Z",
      "likes": 58,
      "shares": 38,
      "image": "/imagenes-poemas/imagen43.png",
      "imageHint": "insatiable thirst"
    },
    {
      "title": "Incendio Privado",
      "poem": "He cerrado las puertas y ventanas para que nadie vea el incendio que has provocado en mí. Es un fuego privado, una hoguera de ganas que arde sin control desde que te conocí. Me consumo en el recuerdo de tu calor, en la imagen de tus ojos llenos de deseo. Te has convertido en mi incendiario, mi amor... ¡y arder en tu fuego es mi único empleo!",
      "createdAt": "2024-07-07T22:00:00.000Z",
      "likes": 60,
      "shares": 40,
      "image": "/imagenes-poemas/imagen66.png",
      "imageHint": "private fire"
    },
    {
      "title": "Prisionero Voluntario",
      "poem": "Soy prisionero voluntario de tu encanto... cautivo en la cárcel de tu piel. Y no quiero rescate, ni sufro con mi quebranto, porque estar atrapado en ti es más dulce que la miel. Tus brazos son los barrotes que me impiden escapar, tus besos, la condena que acepto con placer. En tu amor he encontrado mi verdadero lugar, y aquí me quedaré... hasta el amanecer.",
      "createdAt": "2024-07-06T22:00:00.000Z",
      "likes": 56,
      "shares": 36,
      "image": "/imagenes-poemas/imagen18.png",
      "imageHint": "voluntary prisoner"
    },
    {
      "title": "Droga de Diseno",
      "poem": "Eres mi droga de diseño, hecha a la medida de mis anhelos. La sustancia que altera mi sueño y me eleva a los más altos cielos. Tu efecto es potente, duradero, y el síndrome de abstinencia es fatal. Sin tu dosis de amor, yo desespero... Eres mi adicción, ¡sublime y mortal!",
      "createdAt": "2024-07-05T22:00:00.000Z",
      "likes": 62,
      "shares": 42,
      "image": "/imagenes-poemas/imagen78.png",
      "imageHint": "designer drug"
    },
    {
      "title": "Rendicion Incondicional",
      "poem": "Mi amor, te entrego mi rendición incondicional. He luchado contra este sentimiento, pero es una batalla perdida. Tu amor es un ejército celestial contra el que mi corazón no tiene salida. Levanto la bandera blanca, me rindo a tu poder. Conquista cada rincón de mi ser, ¡haz conmigo lo que quieras hacer!",
      "createdAt": "2024-07-04T22:00:00.000Z",
      "likes": 59,
      "shares": 39,
      "image": "/imagenes-poemas/imagen6.png",
      "imageHint": "unconditional surrender"
    },
    {
      "title": "Lenguaje Corporal",
      "poem": "Ojalá estuvieras aquí para que nuestras pieles conversaran en su propio idioma. Para que mis manos te leyeran en braille y tus suspiros me contaran la más bella historia. Las palabras se quedan cortas para expresar esta pasión que me desborda... Solo nuestro lenguaje corporal tiene la elocuencia que mi alma necesita ahora.",
      "createdAt": "2024-07-03T22:00:00.000Z",
      "likes": 54,
      "shares": 34,
      "image": "/imagenes-poemas/imagen46.png",
      "imageHint": "body language"
    },
    {
      "title": "Gravedad de tu Cuerpo",
      "poem": "La ley de la gravedad más fuerte no es la de Newton... ¡es la que ejerce tu cuerpo sobre el mío! Una fuerza de atracción que me arrastra sin opción, un campo magnético que me saca de quicio. Caigo y caigo hacia ti, en una espiral sin fin, y estrellarme contra tus labios es mi único destino.",
      "createdAt": "2024-07-02T22:00:00.000Z",
      "likes": 61,
      "shares": 41,
      "image": "/imagenes-poemas/imagen106.png",
      "imageHint": "body gravity"
    },
    {
      "title": "Pacto Secreto",
      "poem": "Hagamos un pacto secreto, sellado con besos y caricias prohibidas. Donde la noche sea nuestro único boleto a un mundo donde no existen las despedidas. Seré tu cómplice, tu ladrón, tu amante... tú serás mi refugio, mi pecado constante. Un pacto de piel y alma, un juramento apasionado, de amarnos en secreto, por siempre a tu lado.",
      "createdAt": "2024-07-01T22:00:00.000Z",
      "likes": 57,
      "shares": 37,
      "image": "/imagenes-poemas/imagen89.png",
      "imageHint": "secret pact"
    },
    {
      "title": "Insomnio Bendito",
      "poem": "Este insomnio lleva tu nombre y apellido... Es una bendita tortura pasar la noche en vela, imaginando tu cuerpo junto al mío, encendido, bajo la luz tenue de una vela. Prefiero mil veces no dormir que dejar de pensarte, porque en mis desvelos te siento más cerca. Eres el sueño que no quiero que acabe, la pasión que mi alma terca alimenta.",
      "createdAt": "2024-06-30T22:00:00.000Z",
      "likes": 53,
      "shares": 33,
      "image": "/imagenes-poemas/imagen105.png",
      "imageHint": "blessed insomnia"
    },
    {
      "title": "Voracidad",
      "poem": "Te quiero con una voracidad que asusta... con un hambre que no se sacia con migajas. Quiero devorar cada parte de ti que me gusta, sin dejar espacio para quejas. Quiero beberme tus suspiros, comerme tus miedos, ser el festín de tus noches más oscuras... Este amor es un apetito sin remedio, ¡una de las más deliciosas locuras!",
      "createdAt": "2024-06-29T22:00:00.000Z",
      "likes": 63,
      "shares": 43,
      "image": "/imagenes-poemas/imagen80.png",
      "imageHint": "voracity love"
    },
    {
      "title": "Cicatrices",
      "poem": "Quiero besar cada una de tus cicatrices... las visibles y las que esconde tu alma. Contarte al oído que tus días grises conmigo encontrarán la calma. Dejar que mis labios sanen tus heridas, que mi amor sea el bálsamo, la cura... Y demostrarte que todas tus caídas te preparaban para esta nueva altura.",
      "createdAt": "2024-06-28T22:00:00.000Z",
      "likes": 58,
      "shares": 38,
      "image": "/imagenes-poemas/imagen96.png",
      "imageHint": "kissing scars"
    },
    {
      "title": "Revolucion",
      "poem": "Llegaste a mi vida como una revolución... derribando mis murallas, cambiando mis esquemas. Incitaste a mi corazón a la insurrección, y ahora mi único lema es resolver tus dilemas. Eres la líder de este motín de sentimientos, la causa por la que lucho con todas mis fuerzas. Y me declaro un fiel seguidor de tus movimientos, aunque me lleven a las más locas empresas.",
      "createdAt": "2024-06-27T22:00:00.000Z",
      "likes": 55,
      "shares": 35,
      "image": "/imagenes-poemas/imagen59.png",
      "imageHint": "love revolution"
    },
    {
      "title": "Partitura",
      "poem": "Tu cuerpo es la partitura más compleja y bella... y mis manos, ansiosas, quieren ser el director. Tocar cada nota, seguir cada huella, en una sinfonía de pasión y de amor. Tus gemidos, el coro que acompaña la pieza, tus latidos, el ritmo que marca mi compás. ¡Eres la obra maestra, mi única certeza, la melodía que no quiero dejar jamás!",
      "createdAt": "2024-06-26T22:00:00.000Z",
      "likes": 60,
      "shares": 40,
      "image": "/imagenes-poemas/imagen45.png",
      "imageHint": "body score"
    },
    {
      "title": "Arquitectura del Deseo",
      "poem": "Deseo construir un refugio en el hueco de tu clavícula, un palacio en la curva de tu cintura... Levantar torres de besos sin ninguna curricula, y perderme en la arquitectura de tu figura. Ser el arquitecto de tus noches y tus días, diseñar un amor a prueba de despedidas. Y que nuestra pasión desafíe todas las leyes frías de la física, uniendo para siempre nuestras vidas.",
      "createdAt": "2024-06-25T22:00:00.000Z",
      "likes": 56,
      "shares": 36,
      "image": "/imagenes-poemas/imagen91.png",
      "imageHint": "desire architecture"
    },
    {
      "title": "Equilibrista",
      "poem": "Ando por la cuerda floja de tu sonrisa... tratando de no caer al abismo de tu ausencia. Es un acto de equilibrio, una carrera sin prisa, que pone a prueba toda mi paciencia. Tus ojos son la red que me salvaría, si tropiezo y caigo en este juego. Por eso te miro, amor, noche y día, ¡y a tu amor, sin dudarlo, me entrego!",
      "createdAt": "2024-06-24T22:00:00.000Z",
      "likes": 52,
      "shares": 32,
      "image": "/imagenes-poemas/imagen104.png",
      "imageHint": "tightrope walker"
    },
    {
      "title": "Contrasena",
      "poem": "He intentado todas las combinaciones, pero no encuentro la contraseña de tus miedos. Quiero acceder a tus preocupaciones, para calmarlas con mis besos y mis dedos. Dame una pista, una señal, una clave, para hackear tu alma y proteger tu corazón. Te juro que mi amor es el antivirus más suave, y mi única intención es darte protección.",
      "createdAt": "2024-06-23T22:00:00.000Z",
      "likes": 54,
      "shares": 34,
      "image": "/imagenes-poemas/imagen69.png",
      "imageHint": "soul password"
    },
    {
      "title": "Vertigo",
      "poem": "Asomarme al balcón de tus ojos me da vértigo... Un abismo de luz y misterio profundo. Pero es un riesgo que gustoso contigo sigo, ¡porque saltar a tu amor es lo mejor de este mundo! Caer en tu mirada es volar sin tener alas, es descubrir que el paraíso no estaba arriba. Es la sensación más pura que regalas, una caída libre que me reaviva.",
      "createdAt": "2024-06-22T22:00:00.000Z",
      "likes": 59,
      "shares": 39,
      "image": "/imagenes-poemas/imagen87.png",
      "imageHint": "eye vertigo"
    },
    {
      "title": "Ecuacion Irresoluble",
      "poem": "Nuestro amor es una ecuación irresoluble... con incógnitas que solo se despejan en tu piel. Un problema complejo, deliciosamente insoluble, que nos ata con la fuerza de un imán y la dulzura de la miel. No busco la respuesta en libros ni en la ciencia, la única solución es perderme en tu boca. Porque en el caos de tu amor encuentro mi conciencia, y es la única locura que no me parece poca.",
      "createdAt": "2024-06-21T22:00:00.000Z",
      "likes": 57,
      "shares": 37,
      "image": "/imagenes-poemas/imagen63.png",
      "imageHint": "love equation"
    },
    {
      "title": "Coreografia",
      "poem": "Nuestros cuerpos conocen una coreografía secreta, una danza que solo nosotros dos bailamos... Sin música, sin público, en nuestra alcoba quieta, piel con piel, en un ritmo que solo nosotros marcamos. Cada movimiento es una palabra de amor, cada roce, una declaración apasionada. Somos dos bailarines entregados al fulgor de una noche que no queremos que sea acabada.",
      "createdAt": "2024-06-20T22:00:00.000Z",
      "likes": 61,
      "shares": 41,
      "image": "/imagenes-poemas/imagen19.png",
      "imageHint": "secret choreography"
    },
    {
      "title": "Hechizo",
      "poem": "No sé qué hechizo me lanzaste aquella tarde... pero vivo embrujado por tu presencia. Es una magia que en mi pecho arde, y domina mi alma y mi conciencia. Eres la bruja buena de mi cuento, la que con una poción de besos me encantó. Y yo, feliz con este sentimiento, al poder de tu magia me entrego hoy.",
      "createdAt": "2024-06-19T22:00:00.000Z",
      "likes": 55,
      "shares": 35,
      "image": "/imagenes-poemas/imagen107.png",
      "imageHint": "love spell"
    },
    {
      "title": "Oceano Privado",
      "poem": "Tus ojos son mi océano privado... donde me sumerjo para huir del mundo. Un universo líquido, azul y salado, de un misterio insondable y profundo. Buceo en tus pupilas buscando tesoros, encuentro perlas de ternura y corales de pasión. Y me quedo a vivir entre tus lloros de alegría, en el fondo de tu corazón.",
      "createdAt": "2024-06-18T22:00:00.000Z",
      "likes": 58,
      "shares": 38,
      "image": "/imagenes-poemas/imagen58.png",
      "imageHint": "private ocean"
    },
    {
      "title": "Relampago",
      "poem": "Tu llegada fue un relámpago en mi noche serena... un estruendo de luz que lo cambió todo. Iluminaste mi alma, rompiste mi condena, y me sacaste del más profundo lodo. Ahora vivo esperando la próxima tormenta, la de tus besos, la de tu piel contra la mía... Porque esa electricidad que tu amor fomenta es la única energía que necesito día a día.",
      "createdAt": "2024-06-17T22:00:00.000Z",
      "likes": 62,
      "shares": 42,
      "image": "/imagenes-poemas/imagen97.png",
      "imageHint": "love lightning"
    },
    {
      "title": "Ancla y Vela",
      "poem": "Eres el ancla que me sujeta en la tormenta, pero también la vela que me impulsa a navegar. La calma que a mi espíritu alimenta, y la aventura que me invita a soñar. Contigo tengo el puerto y tengo el mar abierto, la seguridad del hogar y la emoción de partir. ¡Eres mi contradicción, mi desierto florido, la razón por la que quiero vivir!",
      "createdAt": "2024-06-16T22:00:00.000Z",
      "likes": 60,
      "shares": 40,
      "image": "/imagenes-poemas/imagen78.png",
      "imageHint": "anchor sail"
    },
    {
      "title": "A Corazón Abierto 💌",
      "poem": "Te escribo esta carta con el corazón en la mano, un músculo que solo sabe latir a tu nombre. La distancia es un tirano, pero mi amor por ti es una lumbre que no se apaga. Cada palabra es un beso que te envío, cada punto, un abrazo que te espera. Vuelve pronto, amor mío, antes de que la espera me consuma por entera.",
      "createdAt": new Date().toISOString(),
      "likes": 58,
      "shares": 35,
      "image": "/imagenes-poemas/imagen94.png",
      "imageHint": "open heart"
    },
    {
      "title": "Urgencia de Ti 🔥",
      "poem": "Tengo una urgencia de ti que no se calma con nada. Es un hambre en la piel, una sed en el alma. Necesito el mapa de tu cuerpo, la geografía de tu calma. Te necesito aquí, ahora, sin más demora, mi dulce flama. No es deseo, es necesidad, es la vida que me llama.",
      "createdAt": new Date().toISOString(),
      "likes": 65,
      "shares": 42,
      "image": "/imagenes-poemas/imagen77.png",
      "imageHint": "urgent desire"
    },
    {
      "title": "El Crimen Perfecto 😈",
      "poem": "Planeemos el crimen perfecto: robemos un fin de semana al calendario, secuestremos las horas y pidamos como rescate solo besos y abrazos. Que nuestros cuerpos sean la escena del crimen y nuestras coartadas, el recuerdo de esta pasión. Seremos cómplices, amantes, reos de este dulce desvarío. ¿Aceptas el trato, corazón mío?",
      "createdAt": new Date().toISOString(),
      "likes": 70,
      "shares": 45,
      "image": "/imagenes-poemas/imagen18.png",
      "imageHint": "perfect crime"
    },
    {
      "title": "Receta para la Locura 📝",
      "poem": "Ingredientes: tus ojos, mi boca, una noche estrellada. Preparación: mezclar una mirada intensa con un beso lento. Añadir caricias hasta que la piel hierva. Dejar reposar los cuerpos juntos hasta el amanecer. Advertencia: esta receta puede causar una locura de amor incurable. ¡Atrévete a cocinarla conmigo!",
      "createdAt": new Date().toISOString(),
      "likes": 68,
      "shares": 40,
      "image": "/imagenes-poemas/imagen55.png",
      "imageHint": "madness recipe"
    },
    {
      "title": "Contrato de Piel 📜",
      "poem": "Por la presente, te ofrezco un contrato vinculante. Cláusula primera: mis labios se comprometen a explorar cada rincón de tu piel. Cláusula segunda: tus manos tienen derecho exclusivo sobre mi cuerpo. Cláusula final: este contrato se renueva automáticamente con cada beso. Fírmalo con tu boca sobre la mía.",
      "createdAt": new Date().toISOString(),
      "likes": 66,
      "shares": 38,
      "image": "/imagenes-poemas/imagen32.png",
      "imageHint": "skin contract"
    },
    {
      "title": "Memorias de Futuro 💫",
      "poem": "Cierro los ojos y te imagino aquí. Siento el peso de tu cabeza en mi pecho, el calor de tu aliento en mi cuello. No es un recuerdo, es una memoria del futuro que anhelo, una premonición de la felicidad que nos espera. Estoy creando recuerdos de momentos que aún no hemos vivido, pero que sé que llegarán. Apresúrate, que mi futuro te reclama.",
      "createdAt": new Date().toISOString(),
      "likes": 62,
      "shares": 36,
      "image": "/imagenes-poemas/imagen9.png",
      "imageHint": "future memories"
    },
    {
      "title": "Advertencia Sanitaria ⚠️",
      "poem": "El Ministerio de mi Corazón advierte: el contacto prolongado con tu ser puede causar dependencia severa, taquicardia crónica y una sonrisa incurable. Soy un caso perdido, un adicto sin remedio a la droga de tu amor. Y no quiero, ni busco, la cura. Quiero una sobredosis de ti.",
      "createdAt": new Date().toISOString(),
      "likes": 72,
      "shares": 48,
      "image": "/imagenes-poemas/imagen44.png",
      "imageHint": "health warning"
    },
    {
      "title": "El Idioma del Deseo 🫦",
      "poem": "Olvidemos las palabras, que a menudo mienten. Dejemos que nuestros cuerpos hablen el único idioma que es verdaderamente honesto: el del deseo. Que mis manos te digan lo que mi boca calla, que tus suspiros me cuenten tus secretos. Iniciemos esta conversación, mi amor, y que dure hasta el alba.",
      "createdAt": new Date().toISOString(),
      "likes": 69,
      "shares": 41,
      "image": "/imagenes-poemas/imagen106.png",
      "imageHint": "desire language"
    },
    {
      "title": "Notificación Urgente 📲",
      "poem": "Tienes una nueva notificación de mi alma: se requiere tu presencia inmediata para una actualización de besos y caricias. La falta de tu afecto está causando errores en mi sistema. Por favor, acude a la mayor brevedad. Mi corazón depende de ello.",
      "createdAt": new Date().toISOString(),
      "likes": 64,
      "shares": 37,
      "image": "/imagenes-poemas/imagen69.png",
      "imageHint": "urgent notification"
    },
    {
      "title": "El Incendio de tu Nombre 🔥",
      "poem": "Tu nombre es un incendio en mi boca. Lo pronuncio y quema, lo callo y me consume por dentro. Eres la fiebre que delirio, la llama que me provoca. Anhelo el día en que tu fuego y el mío se hagan un solo epicentro. Ven y aviva las llamas, que esta pasión me desboca.",
      "createdAt": new Date().toISOString(),
      "likes": 67,
      "shares": 39,
      "image": "/imagenes-poemas/imagen44.png",
      "imageHint": "name fire"
    },
    {
      "title": "Diagnóstico: Amor Agudo 🩺",
      "poem": "He ido al médico y el diagnóstico es claro: padezco un caso agudo de amor por ti. Síntomas: pulso acelerado al verte, temperatura elevada al pensarte, y una necesidad vital de tus besos. Tratamiento: aplicación de tus abrazos cada tres horas. Sin tu medicina, mi caso es terminal.",
      "createdAt": new Date().toISOString(),
      "likes": 71,
      "shares": 46,
      "image": "/imagenes-poemas/imagen98.png",
      "imageHint": "love diagnosis"
    },
    {
      "title": "Propuesta Indecente... y Necesaria 😏",
      "poem": "Te hago una propuesta que no podrás rechazar: abandonemos el mundo por una noche. Sin teléfonos, sin relojes, sin ropa... Solo tú, yo, y la luna como testigo. Que nuestros cuerpos escriban una historia que la razón no se atreva a juzgar. Es una propuesta indecente, sí, pero absolutamente necesaria para mi cordura.",
      "createdAt": new Date().toISOString(),
      "likes": 75,
      "shares": 50,
      "image": "/imagenes-poemas/imagen101.png",
      "imageHint": "indecent proposal"
    },
    {
      "title": "Embargo de Sentimientos 💔",
      "poem": "Te comunico que he embargado todos mis sentimientos a tu favor. Mis besos, mis caricias y mis pensamientos ahora te pertenecen. No hay posibilidad de recurso. Eres el único propietario de este corazón en bancarrota que solo tú puedes rescatar. Tómalo, es tuyo.",
      "createdAt": new Date().toISOString(),
      "likes": 63,
      "shares": 34,
      "image": "/imagenes-poemas/imagen60.png",
      "imageHint": "feelings embargo"
    },
    {
      "title": "S.O.S. de un Náufrago 🌊",
      "poem": "Este es un S.O.S. lanzado en una botella. Estoy náufrago en un mar de deseo por ti. La isla de tu piel es mi único destino posible. Si recibes este mensaje, por favor, ven a rescatarme. Mi vida depende de la marea de tus caricias. ¡Te necesito!",
      "createdAt": new Date().toISOString(),
      "likes": 65,
      "shares": 38,
      "image": "/imagenes-poemas/imagen54.png",
      "imageHint": "castaway sos"
    },
    {
      "title": "Asignatura Pendiente 📚",
      "poem": "Eres mi asignatura pendiente. La que más me apetece estudiar y la que más miedo me da suspender. Quiero aprender de memoria la lección de tus labios, sacar matrícula de honor en la química de nuestros cuerpos. ¿Me das una clase particular esta noche? Prometo ser el alumno más aplicado.",
      "createdAt": new Date().toISOString(),
      "likes": 68,
      "shares": 41,
      "image": "/imagenes-poemas/imagen68.png",
      "imageHint": "pending subject"
    }
  ],
  "Frasesparaenamorar": [
     {
      "title": "Mi Cafe Favorito",
      "poem": "Mi café favorito... siempre será el de tus ojos.",
      "createdAt": new Date().toISOString(),
      "likes": 100,
      "shares": 50,
      "image": "/imagenes-poemas/imagen69.png",
      "imageHint": "coffee eyes"
    },
    {
      "title": "Google y Tu",
      "poem": "Si te busco en Google, ¿aparecerás como 'el resultado que he estado buscando toda mi vida'?",
       "createdAt": new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
      "likes": 90,
      "shares": 45,
      "image": "/imagenes-poemas/imagen89.png",
      "imageHint": "google search"
    },
    {
      "title": "Plan Perfecto",
      "poem": "No sé besar... ¿tú me enseñas? Es para un plan perfecto que tengo contigo...",
      "createdAt": "2024-07-05T18:00:00.000Z",
      "likes": 85,
      "shares": 48,
      "image": "/imagenes-poemas/imagen66.png",
      "imageHint": "perfect plan"
    },
    {
      "title": "Obra de Arte",
      "poem": "¿Eres un museo? ¡Porque eres una obra de arte que quiero admirar muy de cerca!",
      "createdAt": "2024-07-01T18:00:00.000Z",
      "likes": 95,
      "shares": 55,
      "image": "/imagenes-poemas/imagen75.png",
      "imageHint": "art museum"
    },
    {
      "title": "Multa por Exceso",
      "poem": "Disculpa, ¿tienes hora? Es que al verte, mi corazón aceleró y creo que me van a poner una multa por exceso de velocidad.",
      "createdAt": "2024-06-30T18:00:00.000Z",
      "likes": 88,
      "shares": 42,
      "image": "/imagenes-poemas/imagen40.png",
      "imageHint": "speeding heart"
    },
    {
      "title": "Pronostico del Tiempo",
      "poem": "El pronóstico del tiempo decía que hoy no habría sol... ¡pero entonces te vi sonreír!",
      "createdAt": "2024-06-29T18:00:00.000Z",
      "likes": 92,
      "shares": 52,
      "image": "/imagenes-poemas/imagen66.png",
      "imageHint": "weather forecast"
    },
    {
      "title": "Wi-Fi",
      "poem": "¿Te llamas Wi-Fi? Porque de verdad siento una conexión muy fuerte entre nosotros.",
      "createdAt": "2024-06-28T18:00:00.000Z",
      "likes": 82,
      "shares": 40,
      "image": "/imagenes-poemas/imagen18.png",
      "imageHint": "wifi connection"
    },
    {
      "title": "Estrella Fugaz",
      "poem": "No necesito pedirle un deseo a una estrella fugaz, porque el único que tengo ya se cumplió al conocerte.",
      "createdAt": "2024-06-27T18:00:00.000Z",
      "likes": 98,
      "shares": 60,
      "image": "/imagenes-poemas/imagen47.png",
      "imageHint": "shooting star"
    },
    {
      "title": "Ladron",
      "poem": "¡Debería llamar a la policía! Porque es ilegal que me hayas robado el corazón así.",
      "createdAt": "2024-06-26T18:00:00.000Z",
      "likes": 86,
      "shares": 44,
      "image": "/imagenes-poemas/imagen47.png",
      "imageHint": "heart thief"
    },
    {
      "title": "Arquitecto/a",
      "poem": "¿Eres arquitecto/a? Porque acabas de construir un palacio en mi corazón.",
      "createdAt": "2024-06-25T18:00:00.000Z",
      "likes": 89,
      "shares": 47,
      "image": "/imagenes-poemas/imagen70.png",
      "imageHint": "heart palace"
    },
    {
      "title": "Asignatura Favorita",
      "poem": "Si fueras una asignatura, serías mi favorita. ¡Estudiaría cada detalle de ti!",
      "createdAt": "2024-06-24T18:00:00.000Z",
      "likes": 84,
      "shares": 41,
      "image": "/imagenes-poemas/imagen86.png",
      "imageHint": "favorite subject"
    },
    {
      "title": "Magia",
      "poem": "¿Crees en la magia? Porque desde que te vi, todo lo demás desapareció.",
      "createdAt": "2024-06-23T18:00:00.000Z",
      "likes": 93,
      "shares": 53,
      "image": "/imagenes-poemas/imagen84.png",
      "imageHint": "magic trick"
    },
    {
      "title": "Sol y Luna",
      "poem": "Dicen que el sol y la luna están destinados a no encontrarse... ¡pero nosotros rompimos esa regla!",
      "createdAt": "2024-06-22T18:00:00.000Z",
      "likes": 96,
      "shares": 58,
      "image": "/imagenes-poemas/imagen105.png",
      "imageHint": "sun moon"
    },
    {
      "title": "Primer Beso",
      "poem": "Perdona mi atrevimiento, pero creo que nos debemos un beso. ¿O son dos?",
      "createdAt": "2024-06-21T18:00:00.000Z",
      "likes": 87,
      "shares": 46,
      "image": "/imagenes-poemas/imagen36.png",
      "imageHint": "first kiss"
    },
    {
      "title": "Menu",
      "poem": "Si fueras un plato del menú, serías el principal. ¡Porque eres todo lo que quiero!",
      "createdAt": "2024-06-20T18:00:00.000Z",
      "likes": 91,
      "shares": 51,
      "image": "/imagenes-poemas/imagen73.png",
      "imageHint": "main course"
    },
    {
      "title": "Superpoder",
      "poem": "Mi superpoder es pensar en ti. ¿Cuál es el tuyo?",
      "createdAt": "2024-06-19T18:00:00.000Z",
      "likes": 83,
      "shares": 39,
      "image": "/imagenes-poemas/imagen105.png",
      "imageHint": "superpower thinking"
    },
    {
      "title": "Netflix & Chill?",
      "poem": "Olvídate de Netflix. Mi plan perfecto es 'vernos' toda la noche.",
      "createdAt": "2024-06-18T18:00:00.000Z",
      "likes": 94,
      "shares": 56,
      "image": "/imagenes-poemas/imagen60.png",
      "imageHint": "netflix plan"
    },
    {
      "title": "Terremoto",
      "poem": "¿Acaba de temblar, o eres tú que has movido todo mi mundo?",
      "createdAt": "2024-06-17T18:00:00.000Z",
      "likes": 90,
      "shares": 49,
      "image": "/imagenes-poemas/imagen99.png",
      "imageHint": "earthquake world"
    },
    {
      "title": "Futuro",
      "poem": "Me gusta tu sonrisa... ¿puedo verla todos los días de mi futuro?",
      "createdAt": "2024-06-16T18:00:00.000Z",
      "likes": 99,
      "shares": 62,
      "image": "/imagenes-poemas/imagen78.png",
      "imageHint": "future smile"
    },
    {
      "title": "Pizza",
      "poem": "¿Te gusta la pizza? Porque te daría un 'pedazo' de mi corazón.",
      "createdAt": "2024-06-15T18:00:00.000Z",
      "likes": 81,
      "shares": 38,
      "image": "/imagenes-poemas/imagen58.png",
      "imageHint": "pizza heart"
    },
    {
      "title": "Suenos",
      "poem": "Anoche soñé contigo... ¿qué hacemos para que se haga realidad?",
      "createdAt": "2024-06-14T18:00:00.000Z",
      "likes": 97,
      "shares": 59,
      "image": "/imagenes-poemas/imagen55.png",
      "imageHint": "dream reality"
    },
    {
      "title": "Ortografia Perfecta",
      "poem": "Tienes una sonrisa con una ortografía perfecta. Me dejas sin palabras.",
      "createdAt": "2024-06-13T18:00:00.000Z",
      "likes": 89,
      "shares": 48,
      "image": "/imagenes-poemas/imagen11.png",
      "imageHint": "perfect smile"
    },
    {
      "title": "Manual de Instrucciones",
      "poem": "Me he perdido en tus ojos... ¿vienes con manual de instrucciones?",
      "createdAt": "2024-06-12T18:00:00.000Z",
      "likes": 91,
      "shares": 50,
      "image": "/imagenes-poemas/imagen16.png",
      "imageHint": "lost eyes"
    },
    {
      "title": "Bateria",
      "poem": "Eres como el cargador de mi móvil. Sin ti, mi vida se queda al 1%.",
      "createdAt": "2024-06-11T18:00:00.000Z",
      "likes": 85,
      "shares": 43,
      "image": "/imagenes-poemas/imagen22.png",
      "imageHint": "phone charger"
    },
    {
      "title": "Octava Maravilla",
      "poem": "Creía que había Siete Maravillas en el mundo, pero al verte, supe que eran ocho.",
      "createdAt": "2024-06-10T18:00:00.000Z",
      "likes": 101,
      "shares": 65,
      "image": "/imagenes-poemas/imagen104.png",
      "imageHint": "eighth wonder"
    },
    {
      "title": "Nombre",
      "poem": "Tienes el nombre más bonito. ¿Me lo prestas para mis futuros hijos?",
      "createdAt": "2024-06-09T18:00:00.000Z",
      "likes": 88,
      "shares": 45,
      "image": "/imagenes-poemas/imagen84.png",
      "imageHint": "beautiful name"
    },
    {
      "title": "Fin del Mundo",
      "poem": "Si el mundo se acabara mañana, yo vendría a pasar mis últimas horas contigo.",
      "createdAt": "2024-06-08T18:00:00.000Z",
      "likes": 96,
      "shares": 57,
      "image": "/imagenes-poemas/imagen15.png",
      "imageHint": "end world"
    },
    {
      "title": "Playlist",
      "poem": "Si fueras una canción, estarías en mi playlist de 'repetir todo el día'.",
      "createdAt": "2024-06-07T18:00:00.000Z",
      "likes": 92,
      "shares": 54,
      "image": "/imagenes-poemas/imagen20.png",
      "imageHint": "repeat playlist"
    },
    {
      "title": "Permiso",
      "poem": "¿Tienes un momento? Quiero pedirte permiso para ocupar tus pensamientos.",
      "createdAt": "2024-06-06T18:00:00.000Z",
      "likes": 86,
      "shares": 42,
      "image": "/imagenes-poemas/imagen73.png",
      "imageHint": "ask permission"
    },
    {
      "title": "Amor a primera vista?",
      "poem": "¿Crees en el amor a primera vista... o tengo que volver a pasar?",
      "createdAt": "2024-06-05T18:00:00.000Z",
      "likes": 105,
      "shares": 70,
      "image": "/imagenes-poemas/imagen47.png",
      "imageHint": "love first sight"
    },
    {
      "title": "Acento Perfecto 😍",
      "poem": "Tu sonrisa es el único acento que mi corazón entiende a la perfección.",
      "createdAt": new Date().toISOString(),
      "likes": 95,
      "shares": 55,
      "image": "/imagenes-poemas/imagen102.png",
      "imageHint": "perfect accent"
    },
    {
      "title": "Gravedad Alterada 🪐",
      "poem": "No sé si eres astronauta, pero desde que llegaste, mi mundo está patas arriba.",
      "createdAt": new Date().toISOString(),
      "likes": 88,
      "shares": 48,
      "image": "/imagenes-poemas/imagen84.png",
      "imageHint": "altered gravity"
    },
    {
      "title": "Crimen y Castigo 😏",
      "poem": "Si besarte fuera un crimen, estaría dispuesto a pasarme la vida en la cárcel.",
      "createdAt": new Date().toISOString(),
      "likes": 102,
      "shares": 65,
      "image": "/imagenes-poemas/imagen20.png",
      "imageHint": "crime punishment"
    },
    {
      "title": "Llamada Perdida 📞",
      "poem": "Perdona, ¿me acabas de llamar? Porque he sentido una conexión especial.",
      "createdAt": new Date().toISOString(),
      "likes": 85,
      "shares": 42,
      "image": "/imagenes-poemas/imagen83.png",
      "imageHint": "missed call"
    },
    {
      "title": "Receta Secreta 🧁",
      "poem": "Debes tener una receta secreta, porque has cocinado un amor a fuego lento en mi corazón.",
      "createdAt": new Date().toISOString(),
      "likes": 93,
      "shares": 52,
      "image": "/imagenes-poemas/imagen97.png",
      "imageHint": "secret recipe"
    },
    {
      "title": "GPS del Amor 🗺️",
      "poem": "Mi corazón se había perdido, pero al parecer, tú eres su destino final en el GPS.",
      "createdAt": new Date().toISOString(),
      "likes": 90,
      "shares": 50,
      "image": "/imagenes-poemas/imagen49.png",
      "imageHint": "love GPS"
    },
    {
      "title": "Noticia de Última Hora 📰",
      "poem": "Noticia de última hora: un ángel se ha escapado del cielo. Tranquilo/a, no le diré a nadie dónde estás.",
      "createdAt": new Date().toISOString(),
      "likes": 110,
      "shares": 75,
      "image": "/imagenes-poemas/imagen19.png",
      "imageHint": "breaking news"
    },
    {
      "title": "Predicción del Futuro 🔮",
      "poem": "No soy adivino, pero veo un futuro increíble... y curiosamente, tú estás en él.",
      "createdAt": new Date().toISOString(),
      "likes": 98,
      "shares": 60,
      "image": "/imagenes-poemas/imagen13.png",
      "imageHint": "future prediction"
    },
    {
      "title": "Temperatura Corporal 🌡️",
      "poem": "¿No tienes calor? Porque has mantenido mi corazón ardiendo todo el día.",
      "createdAt": new Date().toISOString(),
      "likes": 89,
      "shares": 47,
      "image": "/imagenes-poemas/imagen105.png",
      "imageHint": "body temperature"
    },
    {
      "title": "Mi Flor Favorita 🌸",
      "poem": "Si las flores compitieran por ser la más bella, tú ganarías sin dudarlo.",
      "createdAt": new Date().toISOString(),
      "likes": 96,
      "shares": 58,
      "image": "/imagenes-poemas/imagen15.png",
      "imageHint": "favorite flower"
    }
  ],
  "Aniversarios": [
    {
      "title": "Un Ano de Nosotros",
      "poem": "Hoy celebramos un año... ¡365 días de tu mano! Cada día a tu lado, un regalo inesperado. Gracias por este viaje, por cada risa y cada detalle. Que este sea el primero de muchos, mi amor.",
      "createdAt": new Date().toISOString(),
      "likes": 70,
      "shares": 40,
      "image": "/imagenes-poemas/imagen2.png",
      "imageHint": "one year"
    },
    {
      "title": "El Hilo de Nuestro Tiempo",
      "poem": "El tiempo a tu lado es un hilo de oro... que teje la historia de nuestro tesoro. Cada mes, una perla; cada año, un collar... Un adorno que mi corazón no deja de anhelar. ¡Feliz aniversario, mi vida, mi todo! Sigamos tejiendo este amor, codo con codo.",
      "createdAt": new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      "likes": 65,
      "shares": 35,
      "image": "/imagenes-poemas/imagen64.png",
      "imageHint": "golden thread"
    },
    {
      "title": "Cinco Anos",
      "poem": "Cinco años de amor, ¡un lustro de felicidad! Gracias por cada momento, por tu infinita bondad. Sigamos construyendo juntos este sueño hecho realidad.",
      "createdAt": "2024-06-20T11:00:00.000Z",
      "likes": 80,
      "shares": 60,
      "image": "/imagenes-poemas/imagen9.png",
      "imageHint": "five years"
    },
    {
      "title": "Diez Anos de Complicidad",
      "poem": "Una década juntos, ¡mil historias que contar! Diez años de risas, de aprender y de amar. Eres mi refugio, mi puerto, mi faro en la oscuridad. Brindo por nuestro pasado y por la eternidad que nos espera.",
      "createdAt": "2024-06-19T11:00:00.000Z",
      "likes": 90,
      "shares": 70,
      "image": "/imagenes-poemas/imagen86.png",
      "imageHint": "ten years"
    },
    {
      "title": "Nuestra Primera Cita",
      "poem": "¿Recuerdas aquel día? Los nervios, la emoción... Quién diría que esa cita sería el inicio de esta canción. Hoy celebramos ese momento que nos unió, y cada día doy gracias por el amor que nació.",
      "createdAt": "2024-06-18T11:00:00.000Z",
      "likes": 75,
      "shares": 45,
      "image": "/imagenes-poemas/imagen32.png",
      "imageHint": "first date"
    },
    {
      "title": "Bodas de Papel",
      "poem": "Un año, bodas de papel. Frágil como el inicio, pero lleno de la miel de tus besos, de tu cariño. Escribamos en esta hoja en blanco mil capítulos más, mi amor... ¡que nuestra historia no tenga final!",
      "createdAt": "2024-06-17T11:00:00.000Z",
      "likes": 72,
      "shares": 42,
      "image": "/imagenes-poemas/imagen35.png",
      "imageHint": "paper anniversary"
    },
    {
      "title": "El Mejor Si",
      "poem": "El 'sí, quiero' más importante de mi vida no fue en un altar... ¡fue el que me diste con la mirada la primera vez que te invité a bailar! Hoy celebramos ese 'sí' que lo empezó todo. ¡Te amo más cada día!",
      "createdAt": "2024-06-16T11:00:00.000Z",
      "likes": 78,
      "shares": 50,
      "image": "/imagenes-poemas/imagen29.png",
      "imageHint": "best yes"
    },
    {
      "title": "Cimientos de Amor",
      "poem": "Cada año a tu lado es un ladrillo más en la construcción de nuestro hogar. Un edificio de amor, confianza y paz, que ninguna tormenta podrá derribar. ¡Feliz aniversario, arquitecto/a de mi felicidad!",
      "createdAt": "2024-06-15T11:00:00.000Z",
      "likes": 82,
      "shares": 55,
      "image": "/imagenes-poemas/imagen56.png",
      "imageHint": "love foundations"
    },
    {
      "title": "Coleccionando Momentos",
      "poem": "Nuestra vida juntos es un álbum de momentos inolvidables. Cada aniversario, una página nueva que añadimos, llena de fotos, de risas y de instantes adorables. Gracias por coleccionar recuerdos conmigo.",
      "createdAt": "2024-06-14T11:00:00.000Z",
      "likes": 77,
      "shares": 48,
      "image": "/imagenes-poemas/imagen85.png",
      "imageHint": "collecting moments"
    },
    {
      "title": "Mas que Ayer",
      "poem": "Te quiero más que ayer, pero menos que mañana... Esa es la promesa que te renuevo cada aniversario, cada semana. Nuestro amor crece como un árbol, fuerte y sin prisa... Gracias por ser la razón de mi sonrisa.",
      "createdAt": "2024-06-13T11:00:00.000Z",
      "likes": 85,
      "shares": 65,
      "image": "/imagenes-poemas/imagen85.png",
      "imageHint": "love growing"
    },
    {
      "title": "Nuestro Baile",
      "poem": "La vida es un baile y tú eres mi pareja perfecta. A veces un vals lento, otras una salsa que nos conecta. No importa el ritmo, mientras bailemos juntos. Felices años, mi amor, por todos nuestros puntos de encuentro.",
      "createdAt": "2024-06-12T11:00:00.000Z",
      "likes": 79,
      "shares": 52,
      "image": "/imagenes-poemas/imagen53.png",
      "imageHint": "our dance"
    },
    {
      "title": "Brindis por Nosotros",
      "poem": "Levanto mi copa por los años compartidos... por las batallas ganadas y los sueños cumplidos. Brindo por ti, por mí, por este amor tan nuestro. ¡Que la vida nos regale mil aniversarios más, mi maestro/a!",
      "createdAt": "2024-06-11T11:00:00.000Z",
      "likes": 81,
      "shares": 58,
      "image": "/imagenes-poemas/imagen99.png",
      "imageHint": "toast us"
    },
    {
      "title": "El Puzzle Encajado",
      "poem": "Éramos dos piezas de puzzles diferentes, buscando nuestro lugar en mundos distintos. Pero un día nos encontramos, y de repente, encajamos... creando un paisaje con nuevos instintos. ¡Feliz aniversario, mi pieza perfecta!",
      "createdAt": "2024-06-10T11:00:00.000Z",
      "likes": 76,
      "shares": 46,
      "image": "/imagenes-poemas/imagen37.png",
      "imageHint": "puzzle fit"
    },
    {
      "title": "La Aventura Continua",
      "poem": "Nuestro matrimonio es la mejor aventura en la que me he embarcado. Contigo cada día es un nuevo mapa inexplorado. Gracias por ser mi compañero/a de viaje, mi brújula y mi ancla. ¡Te amo con todo mi coraje!",
      "createdAt": "2024-06-09T11:00:00.000Z",
      "likes": 83,
      "shares": 61,
      "image": "/imagenes-poemas/imagen102.png",
      "imageHint": "adventure continues"
    },
    {
      "title": "Viaje en el Tiempo",
      "poem": "Si pudiera viajar en el tiempo, volvería al día en que te conocí. No para cambiar nada, sino para revivir la alegría de saber que eras para mí. Feliz aniversario, amor de mi vida.",
      "createdAt": "2024-06-08T11:00:00.000Z",
      "likes": 88,
      "shares": 68,
      "image": "/imagenes-poemas/imagen38.png",
      "imageHint": "time travel"
    },
    {
      "title": "Equipo Imbatible",
      "poem": "En el juego de la vida, ¡somos un equipo imbatible! Juntos superamos obstáculos, hacemos lo imposible. Gracias por ser mi co-capitán/a, mi mejor estrategia. Celebremos nuestra victoria, nuestra magia.",
      "createdAt": "2024-06-07T11:00:00.000Z",
      "likes": 84,
      "shares": 59,
      "image": "/imagenes-poemas/imagen25.png",
      "imageHint": "unbeatable team"
    },
    {
      "title": "Banda Sonora",
      "poem": "Nuestra historia de amor tiene la mejor banda sonora. Tu risa es la melodía, tus susurros el coro que enamora. Cada 'te quiero' es un estribillo que no me canso de escuchar. Feliz aniversario, ¡que la música no pare de sonar!",
      "createdAt": "2024-06-06T11:00:00.000Z",
      "likes": 80,
      "shares": 53,
      "image": "/imagenes-poemas/imagen88.png",
      "imageHint": "love soundtrack"
    },
    {
      "title": "Mi Estacion Favorita",
      "poem": "Contigo, la vida siempre está en mi estación favorita. No importa si llueve o si el sol aprieta, a tu lado todo es una fiesta. Eres mi primavera en invierno, mi verano en el frío. ¡Feliz aniversario, amor mío!",
      "createdAt": "2024-06-05T11:00:00.000Z",
      "likes": 78,
      "shares": 51,
      "image": "/imagenes-poemas/imagen94.png",
      "imageHint": "favorite season"
    },
    {
      "title": "Contando Estrellas",
      "poem": "Dicen que es imposible contar las estrellas del cielo... pero yo prefiero contar los momentos felices a tu lado. Cada uno es un brillo, un consuelo. Gracias por un año más, mi ser amado.",
      "createdAt": "2024-06-04T11:00:00.000Z",
      "likes": 86,
      "shares": 64,
      "image": "/imagenes-poemas/imagen64.png",
      "imageHint": "counting stars"
    },
    {
      "title": "El Faro de mi Vida",
      "poem": "En los mares a veces turbulentos de la vida, tú has sido siempre mi faro, mi guía. Tu luz me muestra el camino de vuelta a casa, a la calma de tu abrazo que todo lo amasa. Feliz aniversario, mi luz eterna.",
      "createdAt": "2024-06-03T11:00:00.000Z",
      "likes": 89,
      "shares": 69,
      "image": "/imagenes-poemas/imagen41.png",
      "imageHint": "life lighthouse"
    },
    {
      "title": "Receta Perfecta",
      "poem": "Nuestro amor es la receta perfecta: una pizca de locura, dos tazas de ternura, paciencia a cucharadas y pasión sin mesura. El resultado es delicioso, único... un plato que quiero saborear toda la vida contigo.",
      "createdAt": "2024-06-02T11:00:00.000Z",
      "likes": 82,
      "shares": 57,
      "image": "/imagenes-poemas/imagen95.png",
      "imageHint": "perfect recipe"
    },
    {
      "title": "Hogar es Contigo",
      "poem": "He aprendido que 'hogar' no es un lugar con cuatro paredes, sino un sentimiento. Y mi hogar está donde tú estés, donde calmas mis ansias y mis quejas. Gracias por ser mi hogar. Feliz aniversario.",
      "createdAt": "2024-06-01T11:00:00.000Z",
      "likes": 91,
      "shares": 72,
      "image": "/imagenes-poemas/imagen21.png",
      "imageHint": "home with you"
    },
    {
      "title": "Mi Loteria",
      "poem": "Dicen que el amor es una lotería... ¡y contigo, yo gané el premio mayor! Cada día a tu lado es una nueva alegría. Gracias por tanto, tanto amor. Feliz aniversario, mi gran suerte.",
      "createdAt": "2024-05-31T11:00:00.000Z",
      "likes": 87,
      "shares": 66,
      "image": "/imagenes-poemas/imagen33.png",
      "imageHint": "love lottery"
    },
    {
      "title": "El Jardin de Nuestro Amor",
      "poem": "Nuestro amor es un jardín que hemos cuidado día a día. Lo regamos con risas, lo abonamos con confianza. Y hoy florece más bello que nunca, vida mía. ¡Feliz aniversario, que siga esta hermosa danza!",
      "createdAt": "2024-05-30T11:00:00.000Z",
      "likes": 84,
      "shares": 62,
      "image": "/imagenes-poemas/imagen46.png",
      "imageHint": "love garden"
    },
    {
      "title": "Paginas de un Libro",
      "poem": "Si nuestra vida fuera un libro, cada año sería un capítulo emocionante. Y hoy, al empezar uno nuevo, sé que la trama seguirá siendo fascinante. Gracias por escribir esta historia conmigo. Feliz aniversario.",
      "createdAt": "2024-05-29T11:00:00.000Z",
      "likes": 81,
      "shares": 56,
      "image": "/imagenes-poemas/imagen35.png",
      "imageHint": "book pages"
    },
    {
      "title": "Quince Primaveras",
      "poem": "Quince años, quince primaveras a tu lado... Nuestro amor adolescente se ha vuelto maduro y calmado. Pero la chispa sigue viva, más fuerte que nunca. Feliz aniversario, mi amor... ¡que nuestro amor no se trunca!",
      "createdAt": "2024-05-28T11:00:00.000Z",
      "likes": 95,
      "shares": 75,
      "image": "/imagenes-poemas/imagen104.png",
      "imageHint": "fifteen springs"
    },
    {
      "title": "Veinte Inviernos",
      "poem": "Veinte inviernos juntos, y tu abrazo sigue siendo mi mejor abrigo. El frío de afuera no importa si me acurruco contigo. Gracias por dos décadas de calor y compañía. ¡Te amo, vida mía!",
      "createdAt": "2024-05-27T11:00:00.000Z",
      "likes": 98,
      "shares": 80,
      "image": "/imagenes-poemas/imagen73.png",
      "imageHint": "twenty winters"
    },
    {
      "title": "Bodas de Plata",
      "poem": "Veinticinco años, bodas de plata. Un cuarto de siglo de amor que nos ata. Nuestro amor brilla más que el metal más precioso. Gracias por este viaje, mi amado esposo/a.",
      "createdAt": "2024-05-26T11:00:00.000Z",
      "likes": 100,
      "shares": 85,
      "image": "/imagenes-poemas/imagen46.png",
      "imageHint": "silver wedding"
    },
    {
      "title": "El Mismo Sueno",
      "poem": "Empezamos este camino con un sueño en común... y hoy, años después, seguimos persiguiéndolo con la misma ilusión. Eres mi socio, mi cómplice, mi mejor decisión. Feliz aniversario, amor de mi corazón.",
      "createdAt": "2024-05-25T11:00:00.000Z",
      "likes": 92,
      "shares": 73,
      "image": "/imagenes-poemas/imagen96.png",
      "imageHint": "same dream"
    },
    {
      "title": "Otro Año, Misma Sonrisa 😊",
      "poem": "Otro año más, y mi corazón sigue acelerando al ver tu sonrisa. Eres mi motivo, mi alegría, mi eterna prisa por volver a casa. ¡Feliz aniversario, amor! Por mil sonrisas más.",
      "createdAt": new Date().toISOString(),
      "likes": 88,
      "shares": 60,
      "image": "/imagenes-poemas/imagen95.png",
      "imageHint": "same smile"
    },
    {
      "title": "El Contrato del Corazón 💖",
      "poem": "Hoy renovamos nuestro contrato de amor, sin cláusulas pequeñas ni condiciones. Solo un acuerdo: amarnos con más fervor cada día. Firmado con un beso y sellado con dos corazones. ¡Feliz aniversario!",
      "createdAt": new Date().toISOString(),
      "likes": 95,
      "shares": 68,
      "image": "/imagenes-poemas/imagen18.png",
      "imageHint": "heart contract"
    },
    {
      "title": "Mapa de Recuerdos 🗺️",
      "poem": "Nuestra vida es un mapa lleno de lugares felices: el parque de nuestro primer beso, el cine de nuestra primera cita... Hoy celebramos otro punto en el mapa, otro año increíble. Gracias por ser mi mejor geografía. ¡Feliz aniversario!",
      "createdAt": new Date().toISOString(),
      "likes": 92,
      "shares": 65,
      "image": "/imagenes-poemas/imagen54.png",
      "imageHint": "memory map"
    },
    {
      "title": "Bodas de Risa 😂",
      "poem": "No sé qué bodas son, si de oro o de algodón. Solo sé que son 'bodas de risa', porque a tu lado, la vida es una bendición y una constante diversión. ¡Feliz aniversario, mi comediante favorito/a!",
      "createdAt": new Date().toISOString(),
      "likes": 90,
      "shares": 62,
      "image": "/imagenes-poemas/imagen60.png",
      "imageHint": "laughing wedding"
    },
    {
      "title": "Años de Vuelo ✈️",
      "poem": "El tiempo a tu lado no pasa, ¡vuela! Y cada año es un nuevo destino, una nueva estela de amor. Gracias por ser el mejor piloto en este viaje llamado vida. ¡Feliz aniversario y a por el siguiente despegue!",
      "createdAt": new Date().toISOString(),
      "likes": 85,
      "shares": 58,
      "image": "/imagenes-poemas/imagen26.png",
      "imageHint": "flying years"
    },
    {
      "title": "Nuestro Propio Universo 🌌",
      "poem": "Hemos creado nuestro propio universo, con constelaciones de recuerdos y galaxias de sueños. Y en el centro, nuestro amor, un sol que nunca se apaga. Feliz aniversario, mi cosmonauta. Sigamos explorando.",
      "createdAt": new Date().toISOString(),
      "likes": 98,
      "shares": 72,
      "image": "/imagenes-poemas/imagen89.png",
      "imageHint": "our universe"
    },
    {
      "title": "La Llama Sigue Viva 🔥",
      "poem": "Dicen que con el tiempo la llama se apaga, pero la nuestra es una hoguera que se hace más grande y fuerte. Gracias por mantener vivo este fuego con tu amor y tu magia. Feliz aniversario, mi eterna llama.",
      "createdAt": new Date().toISOString(),
      "likes": 100,
      "shares": 75,
      "image": "/imagenes-poemas/imagen38.png",
      "imageHint": "flame alive"
    },
    {
      "title": "El Mejor 'Sí' de mi Vida 💍",
      "poem": "Hoy celebro el aniversario del mejor 'sí' que he pronunciado. Un 'sí' que me trajo risas, apoyo y un amor que no tiene precio. Gracias por hacer de cada día una luna de miel. ¡Te amo!",
      "createdAt": new Date().toISOString(),
      "likes": 110,
      "shares": 80,
      "image": "/imagenes-poemas/imagen2.png",
      "imageHint": "best yes"
    },
    {
      "title": "Capítulo Nuevo 📖",
      "poem": "Nuestra historia de amor es mi libro favorito. Y hoy, empezamos un nuevo capítulo. No sé qué pasará, pero sé que será emocionante mientras lo escribamos juntos. ¡Feliz aniversario, mi co-protagonista!",
      "createdAt": new Date().toISOString(),
      "likes": 93,
      "shares": 66,
      "image": "/imagenes-poemas/imagen75.png",
      "imageHint": "new chapter"
    },
    {
      "title": "Brindis por lo Vivido y lo que Viene 🥂",
      "poem": "Brindo por cada risa, por cada abrazo, por cada obstáculo superado. Brindo por ti, por mí, por nuestro increíble pasado. Y brindo por el futuro, que sé que será aún mejor a tu lado. ¡Feliz aniversario!",
      "createdAt": new Date().toISOString(),
      "likes": 96,
      "shares": 70,
      "image": "/imagenes-poemas/imagen38.png",
      "imageHint": "cheers future"
    }
  ],
  "Desamor": [
    {
      "title": "Cenizas de un Fuego",
      "poem": "Lo que un día fue un incendio de pasión... hoy son solo cenizas en el suelo. Un recuerdo frío en el corazón, y un amargo sabor a desconsuelo... Ya no hay llamas, solo el humo del ayer; un eco de risas que se lleva el viento. Y la certeza de que nunca más volveré a sentir por ti lo que un día siento.",
       "createdAt": new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(),
      "likes": 5,
      "shares": 2,
      "image": "/imagenes-poemas/imagen79.png",
      "imageHint": "fire ashes"
    },
    {
      "title": "El Espacio Vacio",
      "poem": "Hay un espacio vacío en esta cama... un hueco que tu cuerpo solía llenar. Ahora es un abismo que me llama, un recordatorio de mi soledad. Intento llenarlo con almohadas, con sueños rotos, con llanto y con insomnio... Pero tu ausencia, a puñaladas, me recuerda que he perdido mi patrimonio.",
      "createdAt": new Date(Date.now() - 50 * 24 * 60 * 60 * 1000).toISOString(),
      "likes": 10,
      "shares": 3,
      "image": "/imagenes-poemas/imagen71.png",
      "imageHint": "empty space"
    },
    {
      "title": "Fotografia Rota",
      "poem": "Encontré tu foto, la partí en dos. Un lado tu sonrisa; en el otro, mi adiós. Quizás algún día el pegamento sea el perdón, pero hoy solo hay trozos de una rota ilusión.",
      "createdAt": "2024-06-10T15:00:00.000Z",
      "likes": 8,
      "shares": 1,
      "image": "/imagenes-poemas/imagen55.png",
      "imageHint": "broken photograph"
    },
    {
      "title": "Direccion Equivocada",
      "poem": "Creí que caminábamos en la misma dirección... pero en algún cruce, tomaste otro desvío. Me dejaste solo/a en esta estación, con un billete de ida hacia el hastío. Sigo esperando un tren que nunca llega, mientras tu recuerdo me ancla a este andén.",
      "createdAt": "2024-06-09T15:00:00.000Z",
      "likes": 12,
      "shares": 4,
      "image": "/imagenes-poemas/imagen75.png",
      "imageHint": "wrong direction"
    },
    {
      "title": "Tinta Invisible",
      "poem": "Escribiste 'te quiero' con tinta invisible... y yo, iluso/a, lo leí con el corazón. Ahora las páginas están en blanco, es terrible, y me doy cuenta de tu cruel traición. El papel de mi alma está manchado de nada, de promesas que el tiempo ha borrado.",
      "createdAt": "2024-06-08T15:00:00.000Z",
      "likes": 7,
      "shares": 2,
      "image": "/imagenes-poemas/imagen79.png",
      "imageHint": "invisible ink"
    },
    {
      "title": "Cancion Desafinada",
      "poem": "Nuestro amor era una canción perfectamente afinada... pero desafinaste en el estribillo final. Dejaste la melodía inacabada, y ahora solo hay un silencio sepulcral. Intento tararear los versos que cantamos, pero mi voz se quiebra, no puedo continuar.",
      "createdAt": "2024-06-07T15:00:00.000Z",
      "likes": 11,
      "shares": 5,
      "image": "/imagenes-poemas/imagen6.png",
      "imageHint": "untuned song"
    },
    {
      "title": "El Ladron de Veranos",
      "poem": "Te llevaste mis veranos, mis risas, mis planes... Dejaste un invierno perpetuo en mi alma. Robaste mis sueños, mis más dulces afanes, y ahora vivo en una inquietante calma... Una calma que precede a la tormenta de lágrimas.",
      "createdAt": "2024-06-06T15:00:00.000Z",
      "likes": 15,
      "shares": 6,
      "image": "/imagenes-poemas/imagen97.png",
      "imageHint": "summer thief"
    },
    {
      "title": "Castillo de Arena",
      "poem": "Construimos un castillo de arena junto al mar... sólido, hermoso, a prueba de vientos. Pero llegó la marea de tu falsedad y se llevó nuestros cimientos. Ahora solo quedan ruinas de lo que fue... un recordatorio de la fragilidad.",
      "createdAt": "2024-06-05T15:00:00.000Z",
      "likes": 9,
      "shares": 3,
      "image": "/imagenes-poemas/imagen72.png",
      "imageHint": "sand castle"
    },
    {
      "title": "Jardin Marchito",
      "poem": "Regué con esmero el jardín de nuestro amor... pero tus mentiras fueron la helada que todo lo mató. Ahora solo hay flores marchitas, sin color, y un jardinero triste que de ti se olvidó... o eso intentó.",
      "createdAt": "2024-06-04T15:00:00.000Z",
      "likes": 13,
      "shares": 4,
      "image": "/imagenes-poemas/imagen99.png",
      "imageHint": "withered garden"
    },
    {
      "title": "El Eco de un Adios",
      "poem": "Tu 'adiós' retumba en las paredes de mi mente... un eco constante que no me deja dormir. Me persigue tu fantasma, cruelmente, recordándome lo que no pudo ser y me hace sufrir.",
      "createdAt": "2024-06-03T15:00:00.000Z",
      "likes": 18,
      "shares": 8,
      "image": "/imagenes-poemas/imagen30.png",
      "imageHint": "goodbye echo"
    },
    {
      "title": "Ancla Oxidada",
      "poem": "Fuiste mi ancla en la peor de las tormentas, pero te oxidaste con el tiempo y la sal de mis lágrimas. Me dejaste a la deriva, con las velas rotas y lentas, naufragando en un mar de falsas calmas.",
      "createdAt": "2024-06-02T15:00:00.000Z",
      "likes": 14,
      "shares": 7,
      "image": "/imagenes-poemas/imagen101.png",
      "imageHint": "rusty anchor"
    },
    {
      "title": "Conversacion Pendiente",
      "poem": "Nos quedó una conversación pendiente... mil palabras que se ahogaron en el orgullo. Ahora el silencio es el muro más hiriente entre tu vida y el murmullo del corazón mío.",
      "createdAt": "2024-06-01T15:00:00.000Z",
      "likes": 16,
      "shares": 9,
      "image": "/imagenes-poemas/imagen32.png",
      "imageHint": "pending conversation"
    },
    {
      "title": "El Veneno de tu Recuerdo",
      "poem": "Tu recuerdo es un veneno lento y dulce... que me consume por dentro sin que nadie lo note. Cada memoria es una gota que me induce a un estado de tristeza que no se rompe ni con el bote de la esperanza.",
      "createdAt": "2024-05-31T15:00:00.000Z",
      "likes": 19,
      "shares": 10,
      "image": "/imagenes-poemas/imagen27.png",
      "imageHint": "memory poison"
    },
    {
      "title": "El Fantasma de tu Perfume",
      "poem": "A veces, el viento trae el fantasma de tu perfume... y por un segundo, mi corazón se detiene y te presume a mi lado. Luego, la realidad me consume, y me doy cuenta de que solo es un truco de mi cerebro enamorado... y ahora abandonado.",
      "createdAt": "2024-05-30T15:00:00.000Z",
      "likes": 20,
      "shares": 11,
      "image": "/imagenes-poemas/imagen97.png",
      "imageHint": "perfume ghost"
    },
    {
      "title": "Extrano Conocido",
      "poem": "Es increíble cómo puedes pasar de serlo todo a ser un extraño conocido. Cruzarnos por la calle y bajar la mirada, fingir que el pasado nunca ha existido... ¡Qué frágil es el hilo que une dos vidas!",
      "createdAt": "2024-05-29T15:00:00.000Z",
      "likes": 22,
      "shares": 12,
      "image": "/imagenes-poemas/imagen21.png",
      "imageHint": "known stranger"
    },
    {
      "title": "La Mitad de la Cama",
      "poem": "La mitad de la cama se ha vuelto un desierto helado. Tu ausencia pesa más que tu presencia, es absurdo. El frío de las sábanas me recuerda que me has dejado, y en esta soledad, mi dolor es un eco mudo.",
      "createdAt": "2024-05-28T15:00:00.000Z",
      "likes": 17,
      "shares": 8,
      "image": "/imagenes-poemas/imagen45.png",
      "imageHint": "half bed"
    },
    {
      "title": "Punto y Final.",
      "poem": "Pusiste el punto y final a nuestra historia, pero te olvidaste de que a veces hay epílogos. Y este epílogo es mi memoria, torturándome con nuestros diálogos.",
      "createdAt": "2024-05-27T15:00:00.000Z",
      "likes": 14,
      "shares": 6,
      "image": "/imagenes-poemas/imagen18.png",
      "imageHint": "final point"
    },
    {
      "title": "El Luto del Corazon",
      "poem": "Mi corazón está de luto, vestido de negro y de silencio. No acepta visitas, no quiere consuelo. Solo quiere llorar en su propio exilio la pérdida de tu amor, su único anhelo.",
      "createdAt": "2024-05-26T15:00:00.000Z",
      "likes": 21,
      "shares": 11,
      "image": "/imagenes-poemas/imagen91.png",
      "imageHint": "heart mourning"
    },
    {
      "title": "La Cicatriz de tu Nombre",
      "poem": "Tu nombre es una cicatriz en mi boca. Cada vez que intento pronunciarlo, duele. Es la herida que no cierra, que me provoca un ardor que el tiempo no diluye.",
      "createdAt": "2024-05-25T15:00:00.000Z",
      "likes": 18,
      "shares": 9,
      "image": "/imagenes-poemas/imagen78.png",
      "imageHint": "name scar"
    },
    {
      "title": "El Arte de Olvidar",
      "poem": "Estoy intentando aprender el difícil arte de olvidar... pero cada lección me recuerda más a ti. Olvidarte es como intentar no respirar; es simplemente imposible para mí.",
      "createdAt": "2024-05-24T15:00:00.000Z",
      "likes": 23,
      "shares": 13,
      "image": "/imagenes-poemas/imagen94.png",
      "imageHint": "art forgetting"
    },
    {
      "title": "Las Ruinas de un Nosotros",
      "poem": "Paseo por las ruinas de lo que un día fue 'nosotros'. Veo los escombros de nuestros sueños, los restos de nuestras risas... Y en este paisaje desolador, me doy cuenta de que soy un turista de mis propias desdichas.",
      "createdAt": "2024-05-23T15:00:00.000Z",
      "likes": 16,
      "shares": 7,
      "image": "/imagenes-poemas/imagen54.png",
      "imageHint": "we ruins"
    },
    {
      "title": "El Ultimo Baile",
      "poem": "Recuerdo nuestro último baile, la forma en que me sostenías. No sabía que era una despedida, que mientras sonreías, ya te ibas... Fue la danza más triste, el preludio del fin.",
      "createdAt": "2024-05-22T15:00:00.000Z",
      "likes": 19,
      "shares": 10,
      "image": "/imagenes-poemas/imagen52.png",
      "imageHint": "last dance"
    },
    {
      "title": "Telefono Silencioso",
      "poem": "Miro el teléfono esperando una llamada que sé que no llegará. Es la esperanza tonta, la fe malgastada, en un amor que ya no está. El silencio de mi móvil grita tu ausencia.",
      "createdAt": "2024-05-21T15:00:00.000Z",
      "likes": 15,
      "shares": 5,
      "image": "/imagenes-poemas/imagen76.png",
      "imageHint": "silent phone"
    },
    {
      "title": "El Sabor de la Derrota",
      "poem": "En el amor, a veces se pierde. Y hoy me toca saborear la amarga derrota. Tu indiferencia es la copa que mi alma vierte, y bebo de ella hasta la última gota.",
      "createdAt": "2024-05-20T15:00:00.000Z",
      "likes": 12,
      "shares": 4,
      "image": "/imagenes-poemas/imagen101.png",
      "imageHint": "taste defeat"
    },
    {
      "title": "El Peso del Quizas",
      "poem": "Lo que más duele no es el adiós, sino el 'quizás'. El '¿qué hubiera pasado si...?'. Ese peso me aplasta, me deja sin paz, y me ancla a un pasado que ya no es para mí.",
      "createdAt": "2024-05-19T15:00:00.000Z",
      "likes": 24,
      "shares": 14,
      "image": "/imagenes-poemas/imagen98.png",
      "imageHint": "maybe weight"
    },
    {
      "title": "Las Llaves de mi Alma",
      "poem": "Te di las llaves de mi alma y te fuiste, cerrando la puerta por fuera sin mirar atrás. Y ahora vivo encerrado en esta jaula triste, sin poder escapar, sin poder amar más.",
      "createdAt": "2024-05-18T15:00:00.000Z",
      "likes": 20,
      "shares": 9,
      "image": "/imagenes-poemas/imagen8.png",
      "imageHint": "soul keys"
    },
    {
      "title": "Borrar tu Huella",
      "poem": "Intento borrar tu huella de mi piel... de mi memoria, de mis sábanas. Pero está impregnada, es una cruel historia, que me recuerda cuánto me amabas... o eso decías.",
      "createdAt": "2024-05-17T15:00:00.000Z",
      "likes": 18,
      "shares": 8,
      "image": "/imagenes-poemas/imagen47.png",
      "imageHint": "erase footprint"
    },
    {
      "title": "El Invierno Llego",
      "poem": "Contigo siempre era primavera, pero te fuiste y el invierno llegó de repente. Ahora mi corazón hiberna, esperando un sol que no sea tan indiferente.",
      "createdAt": "2024-05-16T15:00:00.000Z",
      "likes": 17,
      "shares": 7,
      "image": "/imagenes-poemas/imagen20.png",
      "imageHint": "winter came"
    },
    {
      "title": "Nuestro 'Para Siempre' 💔",
      "poem": "Nuestro 'para siempre' duró muy poco, ¿verdad?\nSe rompió en mil pedazos, como un espejo.\nAhora cada trozo refleja mi soledad,\ny tu rostro es solo un vago y cruel reflejo.",
      "createdAt": new Date().toISOString(),
      "likes": 25,
      "shares": 10,
      "image": "/imagenes-poemas/imagen50.png",
      "imageHint": "broken mirror"
    },
    {
      "title": "El Sabor del Olvido 🍷",
      "poem": "Dicen que el tiempo todo lo cura,\npero el sabor de tu olvido es amargo.\nEs una copa de lenta tortura\nque bebo a diario, en un trago muy largo.",
      "createdAt": new Date().toISOString(),
      "likes": 30,
      "shares": 12,
      "image": "/imagenes-poemas/imagen42.png",
      "imageHint": "bitter wine"
    },
    {
      "title": "La Casa Vacía 🏠",
      "poem": "La casa sigue en pie, pero el hogar se ha ido.\nLas paredes gritan tu nombre en silencio.\nCada rincón guarda un recuerdo dolido,\nun fantasma que es mi único reencuentro.",
      "createdAt": new Date().toISOString(),
      "likes": 28,
      "shares": 11,
      "image": "/imagenes-poemas/imagen2.png",
      "imageHint": "empty house"
    },
    {
      "title": "Promesas de Papel 📄",
      "poem": "Tus promesas eran de papel, ligeras...\nSe las llevó el primer viento de duda.\nAhora son cenizas, tristes y pasajeras,\nde una historia que mi alma repudia.",
      "createdAt": new Date().toISOString(),
      "likes": 22,
      "shares": 8,
      "image": "/imagenes-poemas/imagen89.png",
      "imageHint": "paper promises"
    },
    {
      "title": "El Último Mensaje 📱",
      "poem": "Releo tu último mensaje, frío y cortante.\nUn punto y final sin ninguna emoción.\nQué fácil es destruir, en solo un instante,\nlo que costó tanto construir al corazón.",
      "createdAt": new Date().toISOString(),
      "likes": 35,
      "shares": 15,
      "image": "/imagenes-poemas/imagen35.png",
      "imageHint": "last message"
    },
    {
      "title": "Corazón en Reparación 🛠️",
      "poem": "Cerrado por derribo. Mi corazón está en obras.\nNo se admiten visitas, ni falsas maniobras.\nEstoy reconstruyendo las ruinas, las sobras,\nde un amor que me dejó lleno de zozobras.",
      "createdAt": new Date().toISOString(),
      "likes": 40,
      "shares": 18,
      "image": "/imagenes-poemas/imagen50.png",
      "imageHint": "heart construction"
    },
    {
      "title": "El Lado Frío de la Cama 🥶",
      "poem": "El lado frío de la cama es un desierto polar,\nun recordatorio constante de que ya no estás.\nMi cuerpo busca tu calor, sin poderlo hallar,\ny en la soledad, mi alma se congela más y más.",
      "createdAt": new Date().toISOString(),
      "likes": 38,
      "shares": 16,
      "image": "/imagenes-poemas/imagen32.png",
      "imageHint": "cold bed"
    },
    {
      "title": "Tu Risa, un Eco Lejano 🍃",
      "poem": "A veces creo escuchar tu risa en la distancia,\nun eco lejano que me hace girar.\nPero es solo el viento, en su cruel instancia,\nrecordándome que ya no vas a estar.",
      "createdAt": new Date().toISOString(),
      "likes": 32,
      "shares": 13,
      "image": "/imagenes-poemas/imagen13.png",
      "imageHint": "distant echo"
    },
    {
      "title": "Aprendiendo a Estar sin Ti 🚶‍♀️",
      "poem": "Estoy aprendiendo a tomar café para uno,\na dormir en diagonal, a no esperarte.\nA caminar sin tu mano, es un arte importuno,\nel triste y difícil arte de olvidarte.",
      "createdAt": new Date().toISOString(),
      "likes": 45,
      "shares": 20,
      "image": "/imagenes-poemas/imagen42.png",
      "imageHint": "learning alone"
    },
    {
      "title": "Fuimos... ⌛",
      "poem": "Fuimos canción, fuimos poesía, fuimos un 'para siempre'.\nHoy solo somos dos extraños con recuerdos en común.\nEl tiempo nos convirtió en un 'diciembre'\nsin Navidad, sin luces, sin ningún runrún.",
      "createdAt": new Date().toISOString(),
      "likes": 42,
      "shares": 19,
      "image": "/imagenes-poemas/imagen75.png",
      "imageHint": "we were"
    }
  ],
  "Poemasconnombres": [
    {
      "title": "Para Sofia",
      "poem": "Sofía, tu nombre es sabiduría,\nuna melodía que alegra mi día.\nEn tus ojos, un universo de filosofía,\ny en tu sonrisa, la más pura alegría.",
      "createdAt": "2024-07-28T10:00:00.000Z",
      "likes": 50,
      "shares": 15,
      "image": "/imagenes-poemas/imagen29.png",
      "imageHint": "wisdom smile"
    },
    {
      "title": "Para Mateo",
      "poem": "Mateo, regalo de Dios, don divino,\ntu llegada ha marcado mi destino.\nEres fuerza, nobleza, un ser genuino,\nque ilumina con su luz mi camino.",
      "createdAt": "2024-07-27T10:00:00.000Z",
      "likes": 48,
      "shares": 18,
      "image": "/imagenes-poemas/imagen70.png",
      "imageHint": "divine gift"
    },
    {
      "title": "Para Valentina",
      "poem": "Valentina, valiente y soñadora,\ncon tu fuerza interior, todo lo mejoras.\nCorazón noble, de todos protectora,\na cada instante, de ti mi alma se enamora.",
      "createdAt": "2024-07-26T10:00:00.000Z",
      "likes": 55,
      "shares": 20,
      "image": "/imagenes-poemas/imagen10.png",
      "imageHint": "brave heart"
    },
    {
      "title": "Para Sebastian",
      "poem": "Sebastián, tu nombre inspira respeto,\nun hombre leal, de gran intelecto.\nEn tu mirada, un océano de afecto,\neres mi amor, mi proyecto perfecto.",
      "createdAt": "2024-07-25T10:00:00.000Z",
      "likes": 52,
      "shares": 17,
      "image": "/imagenes-poemas/imagen92.png",
      "imageHint": "ocean eyes"
    },
    {
      "title": "Para Isabella",
      "poem": "Isabella, belleza que promete,\nun juramento de amor que compromete.\nElegancia pura, dulce florete,\nmi corazón por siempre te somete.",
      "createdAt": "2024-07-24T10:00:00.000Z",
      "likes": 60,
      "shares": 25,
      "image": "/imagenes-poemas/imagen14.png",
      "imageHint": "pure elegance"
    },
    {
      "title": "Para Santiago",
      "poem": "Santiago, firme como una montaña,\ntu amor es la más grande de las hazañas.\nContigo, la vida nunca me engaña,\ny alejas de mí todas las patrañas.",
      "createdAt": "2024-07-23T10:00:00.000Z",
      "likes": 49,
      "shares": 16,
      "image": "/imagenes-poemas/imagen63.png",
      "imageHint": "firm mountain"
    },
    {
      "title": "Para Camila",
      "poem": "Camila, libre, vuelas como el viento,\nperfecta obra de arte, sin un solo invento.\nEres música, calma, eres mi sustento,\nla dueña absoluta de mi pensamiento.",
      "createdAt": "2024-07-22T10:00:00.000Z",
      "likes": 58,
      "shares": 22,
      "image": "/imagenes-poemas/imagen69.png",
      "imageHint": "art music"
    },
    {
      "title": "Para Nicolas",
      "poem": "Nicolás, victorioso, líder nato,\ntu sonrisa es mi más preciado retrato.\nPor tu amor, firmo cualquier contrato,\ny te entrego mi corazón sin recato.",
      "createdAt": "2024-07-21T10:00:00.000Z",
      "likes": 51,
      "shares": 19,
      "image": "/imagenes-poemas/imagen15.png",
      "imageHint": "precious portrait"
    },
    {
      "title": "Para Valeria",
      "poem": "Valeria, sana y fuerte como ninguna,\nbrillas con más fuerza que el sol y la luna.\nComo tú, te lo juro, no hay ninguna,\neres mi más grande y bella fortuna.",
      "createdAt": "2024-07-20T10:00:00.000Z",
      "likes": 56,
      "shares": 21,
      "image": "/imagenes-poemas/imagen40.png",
      "imageHint": "sun moon"
    },
    {
      "title": "Para Alejandro",
      "poem": "Alejandro, defensor de la humanidad,\nen tus brazos encuentro mi seguridad.\nEres la calma en mi tempestad,\ny a tu lado, todo es felicidad.",
      "createdAt": "2024-07-19T10:00:00.000Z",
      "likes": 53,
      "shares": 18,
      "image": "/imagenes-poemas/imagen58.png",
      "imageHint": "calm storm"
    },
    {
      "title": "Para Lucía",
      "poem": "Lucía, tu nombre es luz y es guía,\nla estrella que anuncia un nuevo día.\nTu presencia es paz y es armonía,\nllenando de gozo el alma mía.",
      "createdAt": "2024-07-18T10:00:00.000Z",
      "likes": 45,
      "shares": 14,
      "image": "/imagenes-poemas/imagen23.png",
      "imageHint": "star light"
    },
    {
      "title": "Para Daniel",
      "poem": "Daniel, con tu juicio sabio y sereno,\nhaces de mi mundo un lugar más bueno.\nTu amor es un bálsamo, dulce veneno,\nque me llena el corazón por completo, ¡lleno!",
      "createdAt": "2024-07-17T10:00:00.000Z",
      "likes": 47,
      "shares": 15,
      "image": "/imagenes-poemas/imagen35.png",
      "imageHint": "wise judgment"
    },
    {
      "title": "Para Gabriela",
      "poem": "Gabriela, mujer de fuerza divina,\ncon tu gracia y tu encanto me iluminas.\nEn el jardín de mi vida, eres la flor más fina,\nla que con su aroma todas mis penas difuminas.",
      "createdAt": "2024-07-16T10:00:00.000Z",
      "likes": 54,
      "shares": 23,
      "image": "/imagenes-poemas/imagen35.png",
      "imageHint": "divine flower"
    },
    {
      "title": "Para David",
      "poem": "David, amado, mi rey, mi valiente,\ntu amor en mi pecho es lava ardiente.\nContigo a mi lado, todo es diferente,\neres mi hoy, mi siempre, mi presente.",
      "createdAt": "2024-07-15T10:00:00.000Z",
      "likes": 50,
      "shares": 19,
      "image": "/imagenes-poemas/imagen7.png",
      "imageHint": "brave king"
    },
    {
      "title": "Para Ana",
      "poem": "Ana, tu nombre es gracia y compasión,\nun refugio seguro para mi corazón.\nEres la más dulce y bella canción,\nque me llena de infinita emoción.",
      "createdAt": "2024-07-14T10:00:00.000Z",
      "likes": 49,
      "shares": 18,
      "image": "/imagenes-poemas/imagen79.png",
      "imageHint": "sweet song"
    },
    {
      "title": "Para Javier",
      "poem": "Javier, tu casa nueva es mi hogar,\nun nuevo comienzo, un nuevo lugar.\nA tu lado quiero siempre estar,\ny juntos un nuevo mundo explorar.",
      "createdAt": "2024-07-13T10:00:00.000Z",
      "likes": 46,
      "shares": 17,
      "image": "/imagenes-poemas/imagen75.png",
      "imageHint": "new home"
    },
    {
      "title": "Para Paula",
      "poem": "Paula, pequeña, humilde y tenaz,\nen tu simpleza encuentro mi paz.\nEres un tesoro, un amor capaz,\nde hacer que el tiempo vuele fugaz.",
      "createdAt": "2024-07-12T10:00:00.000Z",
      "likes": 51,
      "shares": 20,
      "image": "/imagenes-poemas/imagen69.png",
      "imageHint": "humble peace"
    },
    {
      "title": "Para Carlos",
      "poem": "Carlos, hombre fuerte, viril y audaz,\ntu presencia a mi lado es un antifaz\nque oculta mis miedos y me da solaz,\nen este amor que crece y es voraz.",
      "createdAt": "2024-07-11T10:00:00.000Z",
      "likes": 48,
      "shares": 16,
      "image": "/imagenes-poemas/imagen57.png",
      "imageHint": "strong man"
    },
    {
      "title": "Para Andrea",
      "poem": "Andrea, valiente, de gran corazón,\ntu espíritu guerrero me llena de razón.\nLuchas por tus sueños con firme convicción,\neres mi más grande y bella inspiración.",
      "createdAt": "2024-07-10T10:00:00.000Z",
      "likes": 53,
      "shares": 21,
      "image": "/imagenes-poemas/imagen93.png",
      "imageHint": "warrior spirit"
    },
    {
      "title": "Para Fernando",
      "poem": "Fernando, audaz, aventurero y leal,\ntu amor es un viaje, un trance ideal.\nContigo la vida no tiene igual,\neres mi puerto, mi destino final.",
      "createdAt": "2024-07-09T10:00:00.000Z",
      "likes": 49,
      "shares": 19,
      "image": "/imagenes-poemas/imagen9.png",
      "imageHint": "adventurous journey"
    },
    {
        "title": "Para Mariana",
        "poem": "Mariana, mar y gracia en tu mirar,\nestrella de los mares, luz particular.\nTu nombre es un verso que quiero cantar,\nla calma en la orilla, mi faro estelar.",
        "createdAt": "2024-08-01T10:00:00.000Z",
        "likes": 45,
        "shares": 15,
        "image": "/imagenes-poemas/imagen15.png",
        "imageHint": "sea star"
    },
    {
        "title": "Para Leonardo",
        "poem": "Leonardo, fuerte león, noble y audaz,\ntu coraje y tu arte me llenan de paz.\nEn cada gesto tuyo, un trazo tenaz,\nde un amor que es refugio y es solaz.",
        "createdAt": "2024-08-01T10:05:00.000Z",
        "likes": 48,
        "shares": 17,
        "image": "/imagenes-poemas/imagen107.png",
        "imageHint": "brave lion"
    },
    {
        "title": "Para Daniela",
        "poem": "Daniela, tu juicio es luz, tu voz es miel,\nDios es tu juez, tu alma un fiel corcel.\nEn tu sonrisa encuentro mi anhelado vergel,\ny en tu abrazo, el más dulce dosel.",
        "createdAt": "2024-08-01T10:10:00.000Z",
        "likes": 52,
        "shares": 20,
        "image": "/imagenes-poemas/imagen86.png",
        "imageHint": "sweet smile"
    },
    {
        "title": "Para Ricardo",
        "poem": "Ricardo, rey valiente, líder audaz,\ntu poder es tu risa, tu ley es la paz.\nEn tu reino de afecto, siempre hay solaz,\ny amarte, mi rey, es mi sino fugaz.",
        "createdAt": "2024-08-01T10:15:00.000Z",
        "likes": 46,
        "shares": 16,
        "image": "/imagenes-poemas/imagen100.png",
        "imageHint": "brave king"
    },
    {
        "title": "Para Carolina",
        "poem": "Carolina, fuerte y libre como una canción,\ntu inteligencia brilla con clara emoción.\nEres melodía en mi corazón,\ny la más dulce y bella tentación.",
        "createdAt": "2024-08-01T10:20:00.000Z",
        "likes": 55,
        "shares": 22,
        "image": "/imagenes-poemas/imagen15.png",
        "imageHint": "sweet song"
    },
    {
        "title": "Para Felipe",
        "poem": "Felipe, amigo de caballos, noble ser,\ntu lealtad es un río que me vio crecer.\nEn tu amistad encuentro mi amanecer,\ny a tu lado, la vida es un placer.",
        "createdAt": "2024-08-01T10:25:00.000Z",
        "likes": 47,
        "shares": 18,
        "image": "/imagenes-poemas/imagen98.png",
        "imageHint": "loyal friend"
    },
    {
        "title": "Para Adriana",
        "poem": "Adriana, del mar Adriático venida,\ntu presencia es calma, mi alma rendida.\nEn tus ojos oscuros, la noche encendida,\neres la costa de mi vida.",
        "createdAt": "2024-08-01T10:30:00.000Z",
        "likes": 51,
        "shares": 19,
        "image": "/imagenes-poemas/imagen3.png",
        "imageHint": "dark sea"
    },
    {
        "title": "Para Eduardo",
        "poem": "Eduardo, guardián de toda riqueza,\nla más grande que guardas es tu nobleza.\nTu sonrisa es mi única certeza,\ny tu amor, mi más grande fortaleza.",
        "createdAt": "2024-08-01T10:35:00.000Z",
        "likes": 49,
        "shares": 15,
        "image": "/imagenes-poemas/imagen42.png",
        "imageHint": "great strength"
    },
    {
        "title": "Para Marcela",
        "poem": "Marcela, guerrera nacida en marzo,\ntu espíritu de lucha me da un abrazo.\nEn el mar de la vida, eres mi barco,\ny en tu amor encuentro mi regazo.",
        "createdAt": "2024-08-01T10:40:00.000Z",
        "likes": 53,
        "shares": 21,
        "image": "/imagenes-poemas/imagen29.png",
        "imageHint": "warrior spirit"
    },
    {
        "title": "Para Jorge",
        "poem": "Jorge, que labras la tierra con honor,\ncultivas en mi pecho la más bella flor.\nTu trabajo es constancia, tu vida es amor,\neres mi agricultor, mi eterno sembrador.",
        "createdAt": "2024-08-01T10:45:00.000Z",
        "likes": 48,
        "shares": 14,
        "image": "/imagenes-poemas/imagen89.png",
        "imageHint": "beautiful flower"
    },
    {
        "title": "Para Patricia",
        "poem": "Patricia, mujer noble, de alta cuna,\ntu elegancia brilla más que la luna.\nComo tú, Patricia, no hay ninguna,\neres mi amor, mi bella fortuna.",
        "createdAt": "2024-08-01T10:50:00.000Z",
        "likes": 54,
        "shares": 23,
        "image": "/imagenes-poemas/imagen54.png",
        "imageHint": "noble woman"
    },
    {
        "title": "Para Alberto",
        "poem": "Alberto, nobleza que brilla y destaca,\ntu ilustre presencia de mí no se sonsaca.\nTu corazón de oro nunca se opaca,\ny en mi alma tu amor es una estaca.",
        "createdAt": "2024-08-01T10:55:00.000Z",
        "likes": 47,
        "shares": 16,
        "image": "/imagenes-poemas/imagen82.png",
        "imageHint": "golden heart"
    },
    {
        "title": "Para Claudia",
        "poem": "Claudia, tu paso es frágil, tu andar es luz,\ncojeando de amores, cargas tu cruz.\nPero en tu mirada un brillo se trasluz,\ny en tu nombre, mi amor, no hay capuz.",
        "createdAt": "2024-08-01T11:00:00.000Z",
        "likes": 50,
        "shares": 18,
        "image": "/imagenes-poemas/imagen96.png",
        "imageHint": "shining light"
    },
    {
        "title": "Para Miguel",
        "poem": "Miguel, ¿quién como Dios?, clama tu nombre,\nun arcángel de fuerza que de mí no se esconde.\nLuchas mis batallas, eres mi hombre,\ny tu amor es el eco que siempre responde.",
        "createdAt": "2024-08-01T11:05:00.000Z",
        "likes": 52,
        "shares": 20,
        "image": "/imagenes-poemas/imagen25.png",
        "imageHint": "archangel strength"
    },
    {
        "title": "Para Sandra",
        "poem": "Sandra, protectora, de gran corazón,\ndefiendes lo tuyo con fe y con razón.\nEn tu regazo encuentro mi consolación,\ny en tu amor, mi eterna salvación.",
        "createdAt": "2024-08-01T11:10:00.000Z",
        "likes": 55,
        "shares": 24,
        "image": "/imagenes-poemas/imagen14.png",
        "imageHint": "great heart"
    },
    {
        "title": "Para Francisco",
        "poem": "Francisco, hombre libre, que vienes de Francia,\ntu alma no sabe de odios ni rancia.\nMe amas con locura y con elegancia,\ny tu aroma es mi más pura fragancia.",
        "createdAt": "2024-08-01T11:15:00.000Z",
        "likes": 49,
        "shares": 17,
        "image": "/imagenes-poemas/imagen39.png",
        "imageHint": "free man"
    },
    {
        "title": "Para Monica",
        "poem": "Mónica, solitaria, única y sin par,\ntu espíritu libre es digno de admirar.\nA tu lado aprendí lo que es amar,\ny en tu soledad, encontré mi lugar.",
        "createdAt": "2024-08-01T11:20:00.000Z",
        "likes": 51,
        "shares": 19,
        "image": "/imagenes-poemas/imagen31.png",
        "imageHint": "free spirit"
    },
    {
        "title": "Para Luis",
        "poem": "Luis, guerrero ilustre, de gran esplendor,\nluchas por tus sueños con fe y con valor.\nEn la batalla de la vida eres vencedor,\ny en la guerra del amor, mi único señor.",
        "createdAt": "2024-08-01T11:25:00.000Z",
        "likes": 50,
        "shares": 18,
        "image": "/imagenes-poemas/imagen46.png",
        "imageHint": "illustrious warrior"
    },
    {
        "title": "Para Natalia",
        "poem": "Natalia, nacida en la Navidad,\ntu llegada a mi vida fue una claridad.\nTrajiste contigo la felicidad,\ny un amor que durará una eternidad.",
        "createdAt": "2024-08-01T11:30:00.000Z",
        "likes": 56,
        "shares": 25,
        "image": "/imagenes-poemas/imagen38.png",
        "imageHint": "christmas birth"
    },
    {
        "title": "Para Roberto",
        "poem": "Roberto, cuya fama brilla con fulgor,\ntu nombre es sinónimo de gloria y honor.\nPero para mí, eres simplemente mi amor,\nel que llena mis días de un nuevo color.",
        "createdAt": "2024-08-01T11:35:00.000Z",
        "likes": 48,
        "shares": 16,
        "image": "/imagenes-poemas/imagen43.png",
        "imageHint": "shining fame"
    },
    {
      "title": "Para Laura",
      "poem": "Laura, laurel de victoria y honor,\ntu presencia en mi vida disipa el temor.\nEres la melodía, el más dulce sabor,\nla dueña absoluta de mi eterno amor.",
      "createdAt": "2024-08-02T10:00:00.000Z",
      "likes": 58,
      "shares": 22,
      "image": "/imagenes-poemas/imagen28.png",
      "imageHint": "sweet victory"
    },
    {
      "title": "Para Manuel",
      "poem": "Manuel, 'Dios con nosotros', fiel compañía,\ntu fuerza tranquila me llena de alegría.\nEres mi refugio, mi sol de mediodía,\nla paz que mi alma tanto quería.",
      "createdAt": "2024-08-02T10:05:00.000Z",
      "likes": 50,
      "shares": 18,
      "image": "/imagenes-poemas/imagen32.png",
      "imageHint": "quiet strength"
    },
    {
      "title": "Para Elena",
      "poem": "Elena, antorcha brillante en la oscuridad,\ntu luz resplandece, llena de bondad.\nIluminas mi senda con tu claridad,\ny a tu lado encuentro la felicidad.",
      "createdAt": "2024-08-02T10:10:00.000Z",
      "likes": 55,
      "shares": 21,
      "image": "/imagenes-poemas/imagen56.png",
      "imageHint": "shining torch"
    },
    {
      "title": "Para Diego",
      "poem": "Diego, hombre docto, de gran saber,\ntus consejos me ayudan siempre a crecer.\nA tu lado aprendo un nuevo amanecer,\ny mi amor por ti no deja de florecer.",
      "createdAt": "2024-08-02T10:15:00.000Z",
      "likes": 48,
      "shares": 17,
      "image": "/imagenes-poemas/imagen63.png",
      "imageHint": "wise man"
    },
    {
      "title": "Para Maria",
      "poem": "María, la elegida, llena de gracia,\ntu nombre es un rezo, una dulce fragancia.\nEn tu ser encuentro la paz y la eficacia,\npara alejar de mí toda malacia.",
      "createdAt": "2024-08-02T10:20:00.000Z",
      "likes": 60,
      "shares": 25,
      "image": "/imagenes-poemas/imagen32.png",
      "imageHint": "sweet grace"
    },
    {
      "title": "Para Ivan",
      "poem": "Iván, compasivo, de don agraciado,\ntu corazón noble me tiene enamorado.\nA tu lado, el mundo es menos complicado,\ny cada momento es un sueño dorado.",
      "createdAt": "2024-08-02T10:25:00.000Z",
      "likes": 49,
      "shares": 16,
      "image": "/imagenes-poemas/imagen40.png",
      "imageHint": "golden dream"
    },
    {
      "title": "Para Cristina",
      "poem": "Cristina, seguidora de Cristo, fiel,\ntu amor es más dulce que la pura miel.\nPintas mi existencia con un nuevo pincel,\ny me salvas del tedio y del mundo cruel.",
      "createdAt": "2024-08-02T10:30:00.000Z",
      "likes": 53,
      "shares": 20,
      "image": "/imagenes-poemas/imagen20.png",
      "imageHint": "sweet honey"
    },
    {
      "title": "Para Sergio",
      "poem": "Sergio, guardián atento, mi protector,\ntu abrazo es un muro contra el dolor.\nContigo me siento seguro, mi amor,\neres mi héroe, mi eterno defensor.",
      "createdAt": "2024-08-02T10:35:00.000Z",
      "likes": 51,
      "shares": 19,
      "image": "/imagenes-poemas/imagen81.png",
      "imageHint": "guardian hero"
    },
    {
      "title": "Para Marta",
      "poem": "Marta, mi señora, mi dueña, mi dama,\ntu amor es la chispa que mi ser inflama.\nMi corazón rendido tu nombre aclama,\ny mi alma por siempre de ti se derrama.",
      "createdAt": "2024-08-02T10:40:00.000Z",
      "likes": 56,
      "shares": 23,
      "image": "/imagenes-poemas/imagen39.png",
      "imageHint": "my lady"
    },
    {
      "title": "Para Pablo",
      "poem": "Pablo, hombre humilde, pequeño y genial,\ntu grandeza reside en tu trato cordial.\nTu amor es un tesoro, un don sin igual,\nque me llena la vida de forma total.",
      "createdAt": "2024-08-02T10:45:00.000Z",
      "likes": 52,
      "shares": 18,
      "image": "/imagenes-poemas/imagen13.png",
      "imageHint": "humble treasure"
    },
    {
      "title": "Para Sara",
      "poem": "Sara, princesa de risa encantada,\ntu alegría es la luz de mi alborada.\nPor tenerte a mi lado no pido más nada,\nmi princesa hermosa, mi dulce amada.",
      "createdAt": "2024-08-02T10:50:00.000Z",
      "likes": 59,
      "shares": 24,
      "image": "/imagenes-poemas/imagen8.png",
      "imageHint": "beautiful princess"
    },
    {
      "title": "Para Hector",
      "poem": "Héctor, hombre cauto, de gran posesión,\nla mayor que posees es este corazón.\nLo ganaste con creces, con justa razón,\ny ahora es tuyo sin ninguna condición.",
      "createdAt": "2024-08-02T10:55:00.000Z",
      "likes": 47,
      "shares": 15,
      "image": "/imagenes-poemas/imagen12.png",
      "imageHint": "my heart"
    },
    {
      "title": "Para Victoria",
      "poem": "Victoria, triunfadora, tu nombre es destino,\nvences cualquier pena, cualquier desatino.\nA tu lado, el triunfo es mi camino,\ny nuestro amor, un vino añejo y fino.",
      "createdAt": "2024-08-02T11:00:00.000Z",
      "likes": 57,
      "shares": 22,
      "image": "/imagenes-poemas/imagen12.png",
      "imageHint": "fine wine"
    },
    {
      "title": "Para Mario",
      "poem": "Mario, hombre de mar, de fuerte entereza,\ntu amor es un ancla, pura fortaleza.\nMe salvas del naufragio, de toda tristeza,\ny me enseñas del mundo su gran belleza.",
      "createdAt": "2024-08-02T11:05:00.000Z",
      "likes": 50,
      "shares": 17,
      "image": "/imagenes-poemas/imagen100.png",
      "imageHint": "sea anchor"
    },
    {
      "title": "Para Alba",
      "poem": "Alba, aurora de luz, blanco amanecer,\ntu llegada a mi vida fue un renacer.\nContigo la noche empieza a desaparecer,\ny a tu lado solo quiero envejecer.",
      "createdAt": "2024-08-02T11:10:00.000Z",
      "likes": 54,
      "shares": 20,
      "image": "/imagenes-poemas/imagen35.png",
      "imageHint": "white dawn"
    },
    {
      "title": "Para Oscar",
      "poem": "Óscar, lanza divina, guerrero de honor,\ntu lucha es mi lucha, tu valor es mi valor.\nJuntos enfrentamos cualquier sinsabor,\nporque nuestra arma secreta es el amor.",
      "createdAt": "2024-08-02T11:15:00.000Z",
      "likes": 48,
      "shares": 16,
      "image": "/imagenes-poemas/imagen67.png",
      "imageHint": "divine spear"
    },
    {
      "title": "Para Noa",
      "poem": "Noa, delicia y paz, calma y reposo,\ntu ser es un bálsamo, un Edén hermoso.\nEn tu compañía todo es más dichoso,\ny mi amor por ti, un río caudaloso.",
      "createdAt": "2024-08-02T11:20:00.000Z",
      "likes": 52,
      "shares": 19,
      "image": "/imagenes-poemas/imagen15.png",
      "imageHint": "beautiful peace"
    },
    {
      "title": "Para Hugo",
      "poem": "Hugo, hombre de gran inteligencia y luz,\ntu mente brillante es mi mejor arcabuz.\nDespejas mis dudas, cargas con mi cruz,\ny me guías por sendas de paz y de luz.",
      "createdAt": "2024-08-02T11:25:00.000Z",
      "likes": 51,
      "shares": 18,
      "image": "/imagenes-poemas/imagen52.png",
      "imageHint": "great mind"
    },
    {
      "title": "Para Julia",
      "poem": "Julia, de raíces fuertes, siempre jovial,\ntu risa es un himno, un canto celestial.\nTu espíritu joven es un manantial,\nde alegría y amor, un don providencial.",
      "createdAt": "2024-08-02T11:30:00.000Z",
      "likes": 56,
      "shares": 23,
      "image": "/imagenes-poemas/imagen40.png",
      "imageHint": "celestial song"
    },
    {
      "title": "Para Martin",
      "poem": "Martín, guerrero de Marte, luchador,\ncombates mis penas, vences mi temor.\nEres de mi vida el gran triunfador,\ny de mi corazón, el único morador.",
      "createdAt": "2024-08-02T11:35:00.000Z",
      "likes": 53,
      "shares": 19,
      "image": "/imagenes-poemas/imagen90.png",
      "imageHint": "great warrior"
    },
    {
      "title": "Para Lola",
      "poem": "Lola, dolor y fuerza, contradicción,\neres la herida y la dulce curación.\nEn tu nombre se esconde una revolución,\nla de un amor que es pura devoción.",
      "createdAt": new Date().toISOString(),
      "likes": 55,
      "shares": 20,
      "image": "/imagenes-poemas/imagen44.png",
      "imageHint": "sweet pain"
    },
    {
      "title": "Para Adrian",
      "poem": "Adrián, hombre de mar, de alma serena,\ntu calma me envuelve y mis males drena.\nEres la playa donde muere mi pena,\ny la ola que de amor mi vida llena.",
      "createdAt": new Date().toISOString(),
      "likes": 50,
      "shares": 18,
      "image": "/imagenes-poemas/imagen39.png",
      "imageHint": "calm sea"
    },
    {
      "title": "Para Clara",
      "poem": "Clara, brillante, tu nombre es un faro,\nque ilumina mi sendero, mi desamparo.\nTu transparencia es el don más caro,\nun amor sin dobleces, puro y claro.",
      "createdAt": new Date().toISOString(),
      "likes": 58,
      "shares": 22,
      "image": "/imagenes-poemas/imagen89.png",
      "imageHint": "bright lighthouse"
    },
    {
      "title": "Para Alvaro",
      "poem": "Álvaro, guardián previsor y total,\ndefiendes nuestro amor de cualquier vendaval.\nTu abrazo es un muro, un fuerte portal,\ndonde me siento a salvo de todo mal.",
      "createdAt": new Date().toISOString(),
      "likes": 52,
      "shares": 19,
      "image": "/imagenes-poemas/imagen54.png",
      "imageHint": "strong wall"
    },
    {
      "title": "Para Irene",
      "poem": "Irene, tu nombre es paz, la calma anhelada,\nque llega a mi vida como una alborada.\nContigo, la guerra está terminada,\ny mi alma por siempre, de ti enamorada.",
      "createdAt": new Date().toISOString(),
      "likes": 60,
      "shares": 25,
      "image": "/imagenes-poemas/imagen80.png",
      "imageHint": "desired peace"
    },
    {
      "title": "Para Enzo",
      "poem": "Enzo, príncipe de sus tierras, señor,\ntú reinas en el vasto feudo de mi amor.\nNo hay vasallo más fiel, con más ardor,\nque este corazón que te nombra su emperador.",
      "createdAt": new Date().toISOString(),
      "likes": 54,
      "shares": 20,
      "image": "/imagenes-poemas/imagen80.png",
      "imageHint": "prince love"
    },
    {
      "title": "Para Carmen",
      "poem": "Carmen, jardín de Dios, viña y canción,\neres la cosecha que alegra mi razón.\nTu fruto es la dicha, tu voz, la emoción,\ny tu amor, el vino de mi corazón.",
      "createdAt": new Date().toISOString(),
      "likes": 59,
      "shares": 24,
      "image": "/imagenes-poemas/imagen58.png",
      "imageHint": "gods garden"
    },
    {
      "title": "Para Marcos",
      "poem": "Marcos, hombre de Marte, dios de la guerra,\ntus batallas son besos que a mi piel se aferra.\nConquistas mi alma, mi cielo, mi tierra,\ny en tu victoria, mi amor se destierra... hacia ti.",
      "createdAt": new Date().toISOString(),
      "likes": 51,
      "shares": 17,
      "image": "/imagenes-poemas/imagen64.png",
      "imageHint": "love war"
    },
    {
      "title": "Para Ines",
      "poem": "Inés, casta y pura, cordero de amor,\ntu inocencia es un bálsamo para mi dolor.\nEres un lienzo en blanco, lleno de candor,\nque pinto con besos de todo color.",
      "createdAt": new Date().toISOString(),
      "likes": 56,
      "shares": 21,
      "image": "/imagenes-poemas/imagen96.png",
      "imageHint": "pure love"
    },
    {
      "title": "Para Leo",
      "poem": "Leo, pequeño león, de fiero rugido,\ntu fuerza es la ternura que me ha conmovido.\nEres rey de mi selva, mi amor preferido,\nel único por quien he enloquecido.",
      "createdAt": new Date().toISOString(),
      "likes": 57,
      "shares": 23,
      "image": "/imagenes-poemas/imagen98.png",
      "imageHint": "little lion"
    }
  ],
  "Relatosinfidelidad": [
    {
      "title": "La corazonada de las 2 de la mañana y el perfume que no era el mío",
      "poem": "La infidelidad no llega con una carta certificada ni con un aviso en el periódico. No, al menos no la mía. La mía llegó en susurros, en pequeñas astillas que se te clavan en el alma y que tratas de ignorar porque arrancarlas dolería demasiado. La mía empezó, o mejor dicho, yo empecé a darme cuenta, una noche de martes a las dos y pico de la mañana.\n\nLlevábamos cinco años juntos, Daniel y yo. Cinco años de construir algo que yo creía sólido como una pared de ladrillos. Teníamos nuestro apartamento, nuestro perro, nuestras manías y hasta un plan borroso de casarnos 'algún día'. Para mí, él era mi casa. El lugar al que volvía siempre, sin importar qué tan feo se pusiera el mundo afuera. Pero desde hacía unos meses, las paredes de esa casa se sentían frías, llenas de corrientes de aire que no sabía de dónde venían.\n\nEran cosas pequeñas, casi invisibles. Su celular, que antes era un objeto más en la casa, ahora parecía una extensión de su mano, siempre boca abajo sobre la mesa. Las 'reuniones hasta tarde' se habían vuelto el pan de cada día. 'Es que cerramos un proyecto grande, Valeria, ya sabes cómo es esto', me decía. Y yo le creía. O quería creerle. Porque la alternativa era un abismo al que no me atrevía a mirar.\n\nEsa noche de martes, llegó a las dos y cuarto. Entró de puntillas, pensando que yo dormía. Me quedé quieta, con los ojos cerrados, escuchando el sonido de su ropa cayendo al suelo. Cuando se metió en la cama, el frío de sus pies rozó los míos, pero fue otro frío el que me heló la sangre. Un olor. Un perfume de mujer, dulce y floral, que definitivamente no era el mío, que era más cítrico. Se mezclaba con el olor a cigarrillo, y él no fumaba. No desde que lo conocí.\n\n'¿Dónde estabas?', le pregunté en un susurro, sin abrir los ojos.\n\nSe sobresaltó. 'Me despertaste. Con clientes, mi amor. Te dije que era una cena importante'.\n\n'Olía a que fue muy importante', pensé, pero no dije nada. Me di la vuelta, dándole la espalda, y sentí cómo el espacio entre nosotros en la cama se convertía en un océano. Esa noche no dormí. Me la pasé mirando el techo, un lienzo en blanco donde mi cabeza proyectaba las peores películas.\n\nLa mañana siguiente fue el detonante. Él se metió a bañar, y su teléfono, ese objeto maldito, empezó a vibrar sobre la mesita de noche. Una, dos, tres veces. No era una llamada, eran mensajes. La pantalla se iluminó con una notificación de WhatsApp que decía: 'Anoche fue increíble. ¿Repetimos pronto? 😉'. Y debajo, el nombre: 'Andrea'.\n\nEl aire se me fue de los pulmones. Se siente exactamente como te lo cuentan: como un puñetazo en el estómago que te deja sin aire, pero el dolor sube hasta la garganta y se convierte en un nudo que no te deja ni tragar saliva. Mis manos temblaban tanto que casi no podía sostener el celular. Desbloquearlo fue un impulso, una traición a la confianza que, irónicamente, él ya había hecho polvo. Su clave era la fecha de nuestro aniversario. Qué cruel. Qué cliché tan doloroso.\n\nAhí estaba todo. El chat con Andrea. No tuve que bajar mucho. Semanas de conversaciones. 'Te extraño', 'No dejo de pensar en ti', fotos de ella que no me atreví a abrir, planes para 'escapadas de trabajo' que ahora entendía perfectamente. Hablaban de mí. 'Valeria ni se entera', 'Está muy metida en su trabajo'. Cada palabra era una puñalada. Me llamaban 'la rutina', 'el compromiso'. Y yo, mientras tanto, le preparaba su comida favorita y le compraba esas camisas que tanto le gustaban.\n\nUna de esas camisas, la azul claro que le regalé para su cumpleaños, aparecía en una foto que sí abrí. Estaba en un bar que yo no conocía, y al lado de él, una mujer con el pelo rojo y una sonrisa que parecía devorarlo. Andrea. Sentí náuseas. Salí del cuarto de baño justo cuando él salía de la ducha, envuelto en una toalla, con el pelo mojado y una sonrisa en la cara.\n\n'Buenos días, dormilona', me dijo, acercándose para darme un beso.\n\nLo esquivé. Levanté su celular. No tuve que decir nada. Su cara se transformó. La sonrisa se borró y fue reemplazada por una máscara de pánico. El color se le fue del rostro. Ese fue el momento. El momento en que la negación se rinde y la verdad, horrible y afilada, toma su lugar. \n\n'Valeria... yo te lo puedo explicar'. La frase más inútil del mundo. ¿Explicar qué? ¿Qué cada 'te quiero' de los últimos meses había sido una mentira? ¿Que cada noche que llegaba tarde no era por trabajo, sino porque estaba enredado en otras sábanas, en otros brazos, en otra vida?\n\nLa conversación que siguió fue un desastre. Un huracán de gritos, lágrimas y excusas patéticas. 'Fue un error', 'Estaba confundido', 'Tú y yo estábamos distanciados'. Culpas, culpas por todas partes, rebotando en las paredes de nuestro apartamento, que de repente se sentía ajeno, contaminado.\n\nLo eché de casa. Metí su ropa en bolsas de basura mientras él me suplicaba que no lo hiciera. Cada prenda que tocaba tenía un recuerdo pegado, y arrancarlo era como despellejarme viva. Cuando cerré la puerta detrás de él, el silencio fue ensordecedor. Miré nuestro hogar, nuestra 'fortaleza', y vi las ruinas. El cuadro que pintamos juntos, el sofá donde vimos tantas películas, el perro que nos miraba sin entender nada... todo estaba roto.\n\nEsa noche, cuando la adrenalina bajó, llegó el dolor de verdad. Un dolor físico, profundo, que se instala en el pecho y no te deja respirar. Te preguntas qué hiciste mal, en qué fallaste. Repasas cada momento, cada discusión, buscando una pista que te perdiste. Te sientes estúpida, ingenua. La confianza, una vez que se rompe, no se puede pegar. Quedan las grietas, recordándote siempre que una vez estuvo hecha pedazos.\n\nLa infidelidad no es solo el sexo, o los besos con otra persona. Es la mentira. Es el tejido de engaños que construyen a tus espaldas. Es saber que la persona en la que confiabas ciegamente te ha estado mirando a los ojos y mintiéndote sin pestañear. Es el asesinato de un futuro que creías seguro. Y ese duelo, el duelo por la vida que no será, es el más largo y solitario de todos.",
      "createdAt": new Date().toISOString(),
      "likes": 25,
      "shares": 10,
      "image": "/imagenes-poemas/imagen56.png",
      "imageHint": "broken relationship"
    },
    {
      "title": "El Post-it amarillo y el castillo de naipes que llamábamos 'nosotros'",
      "poem": "Nadie empieza una infidelidad pensando 'hoy voy a destrozar mi vida y la de la persona que amo'. Empieza de una forma mucho más tonta, más inofensiva. La mía empezó con un café. Con Sofía, la diseñadora nueva de la oficina. Conectamos al toque. Teníamos el mismo humor ácido, nos reíamos de las mismas tonterías de la oficina, y criticábamos las mismas películas. Con Laura, mi novia de hace ocho años, ya no había mucho de eso. Lo nuestro era... cómodo. Como un par de zapatos viejos que te encantan, pero que ya no te emocionan. Era una rutina aceitada de '¿qué comemos hoy?', '¿viste dónde dejé las llaves?' y silencios largos mientras veíamos una serie que a ninguno de los dos nos mataba.\n\nEl café con Sofía se convirtió en almuerzos. Los almuerzos en 'vamos a tomar una cerveza al salir'. Y la cerveza, una noche, se convirtió en un beso. Fue en su carro, con la lluvia golpeando el parabrisas y la música de una emisora cualquiera de fondo. Fue torpe, eléctrico y se sintió como una bocanada de aire fresco después de años de respirar aire reciclado. 'Esto es un error', dijimos los dos. Y lo repetimos la noche siguiente, cuando el error se repitió en un motel barato a las afueras de la ciudad.\n\nAhí empezó mi doble vida. El Javier que llegaba a casa con Laura, cansado del 'trabajo', y el Javier que se sentía vivo, ingenioso y deseado con Sofía. Me convertí en un experto en mentir. No solo en las mentiras grandes ('tengo una reunión fuera de la ciudad'), sino en las pequeñas, las que te carcomen por dentro. Mentía sobre a qué olía mi ropa, sobre por qué tenía una sonrisa estúpida en la cara, sobre por qué de repente me importaba más ir al gimnasio. Me convertí en un actor de tiempo completo, y mi vida, en un castillo de naipes. Cada carta era una mentira, y yo rezaba para que no soplara el viento.\n\nLaura no era tonta. Las mujeres tienen un sexto sentido para estas cosas, una especie de radar para la infelicidad del otro. Empezó a preguntar. 'Estás distinto, Javi. Estás... lejos'. Y yo, en lugar de confesar, redoblaba la apuesta. 'Es el estrés del trabajo, amor. Ya pasará'. Le compraba flores, la invitaba a cenar a su restaurante favorito... intentaba tapar las grietas con parches de normalidad. Me sentía un monstruo, pero la adrenalina, la emoción de lo prohibido, era una droga muy fuerte. Sofía me hacía sentir como el hombre que siempre quise ser. Con ella era divertido, audaz. Con Laura, era solo Javier. El que no saca la basura a tiempo.\n\nEl castillo se derrumbó de la forma más estúpida posible. Por un Post-it amarillo. Una de esas notitas adhesivas. Tenía un viaje de 'trabajo' a Cartagena por tres días. Obviamente, el viaje era con Sofía. Laura, tan detallista como siempre, me había preparado la maleta la noche anterior. 'Para que no se te olvide nada', me dijo con una sonrisa que, en retrospectiva, ya se veía triste.\n\nEsa mañana, mientras me vestía, encontré el Post-it pegado en el espejo del baño. Con su letra redondita, perfecta, decía: 'No te olvides de las pastillas para la acidez, están en el bolsillo de adentro de la maleta. Te voy a extrañar mucho. Te amo, Lau'.\n\nAhí mismo, parado frente al espejo, el castillo de naipes se vino abajo. No fue un derrumbe ruidoso, fue un colapso silencioso y devastador. Vi mi reflejo, el de un tipo de 32 años que estaba a punto de irse a revolcar con otra mujer mientras su novia, la que lo cuidaba y lo amaba de verdad, le dejaba notitas para que no le diera acidez. La culpa me golpeó con la fuerza de un camión. Me sentí la basura más grande del mundo.\n\nLe dije a Sofía que no podía ir, que algo 'urgente' había pasado en mi familia. Su decepción al otro lado del teléfono fue evidente, pero en ese momento no me importó. Cancelé todo. Volví a la habitación, me senté en la cama y esperé a que Laura volviera de comprar el pan para el desayuno. \n\nCuando entró por la puerta, con su sonrisa de siempre y la bolsa de la panadería en la mano, supo que algo andaba mal. '¿Javi? ¿Qué pasó? ¿Perdiste el vuelo?'.\n\nNo pude más. Me quebré. Lloré como un niño chiquito, con mocos y todo. 'Te engañé, Laura', le solté, sin anestesia, sin excusas. 'Te he estado engañando'.\n\nEl silencio que siguió fue lo más aterrador que he vivido. La bolsa del pan se le cayó de las manos. Su cara... su cara pasó de la confusión a la incredulidad, y de ahí a un dolor tan profundo que sentí que la había apuñalado. Vi cómo se rompía frente a mí, cómo ocho años de historia se hacían añicos por mi culpa, por mi egoísmo, por mi cobardía.\n\n'¿Quién es?', fue lo único que pudo preguntar, con la voz hecha un hilo.\n\n'Sofía. La del trabajo'.\n\nNo gritó. No me insultó. Simplemente asintió, lentamente, mientras las lágrimas le caían por las mejillas. Se sentó en el sofá, nuestro sofá, y se quedó mirando a la nada. Yo me quedé ahí, de rodillas en el suelo, sintiendo que no merecía ni respirar el mismo aire que ella.\n\nLa conversación que tuvimos después duró horas. Le conté todo, cada mentira, cada detalle sórdido. Cada respuesta suya era una nueva dosis de realidad que me mostraba el tamaño del desastre que había creado. No hubo gritos, solo un dolor tranquilo y desgarrador. Había matado algo. Algo que era bueno y puro. Y lo había matado por nada. Por la emoción barata de sentirme deseado por alguien nuevo.\n\nObviamente, me fui de la casa esa misma noche. Agarré una maleta, esta vez hecha por mí, y me fui a un hotel. La primera noche solo, en esa habitación impersonal, entendí la verdadera soledad. No era estar sin Sofía. Era estar sin Laura. Sin mi hogar. Sin la única persona que, a pesar de todo, se preocupaba de que no me dieran agruras.\n\nLa infidelidad te convierte en el villano de tu propia historia. Y lo peor es que no hay marcha atrás. Puedes pedir perdón mil veces, pero no puedes borrar el dolor que causaste. No puedes reconstruir un castillo de naipes con cartas marcadas y arrugadas. Solo puedes quedarte ahí, viendo las ruinas, y aprender a vivir con el eco de lo que destruiste. Y con la imagen de un Post-it amarillo que te recordará para siempre el precio de una traición.",
      "createdAt": "2024-07-29T10:00:00.000Z",
      "likes": 30,
      "shares": 15,
      "image": "/imagenes-poemas/imagen106.png",
      "imageHint": "house of cards"
    },
    {
      "title": "El eco de un 'like' a medianoche",
      "poem": "Todo comenzó con algo tan trivial, tan estúpidamente moderno: un 'like'. No era un 'like' cualquiera. Eran las 11:30 de una noche de jueves y yo estaba viendo una serie tonta mientras Marcos, mi novio desde hacía cuatro años, supuestamente dormía a mi lado. Su teléfono vibró suavemente sobre la mesita de noche. No le di importancia. Pero volvió a vibrar. Y otra vez. La curiosidad es un monstruo, y esa noche, el mío estaba hambriento. Deslicé un ojo y vi la pantalla iluminarse. Una notificación de Instagram. 'A @srtamartinez94 le ha gustado tu foto'. ¿Quién era la señorita Martínez y por qué le gustaban las fotos de mi novio a esas horas? El corazón me dio un vuelco. Entré a su perfil. Era público. Y lo que vi fue un puñetazo en el estómago. No era solo una foto. Eran... todas. Fotos de hacía semanas, meses. La señorita Martínez era una fan devota. Y lo peor: Marcos también lo era de ella. Comentarios como 'Guapísima 😉', 'Esa sonrisa 😍' y 'A ver cuándo nos vemos' decoraban sus publicaciones. El aire se me escapó. Miré a Marcos, durmiendo tan plácidamente, ajeno al terremoto que acababa de desatar en mi mundo. Esa noche entendí que la infidelidad ya no necesita sábanas ajenas; a veces, empieza con un doble toque en una pantalla y crece en la oscuridad, alimentada por emojis y promesas vacías.",
      "createdAt": new Date().toISOString(),
      "likes": 40,
      "shares": 20,
      "image": "/imagenes-poemas/imagen42.png",
      "imageHint": "phone notification"
    },
    {
      "title": "El ticket de gasolina de un viaje que nunca hicimos",
      "poem": "La confianza es un cristal. Una vez roto, puedes pegar los trozos, pero las grietas siempre estarán ahí, recordándote la caída. La mía se rompió por un ticket de gasolina. Estaba limpiando el carro, una tarea mundana de domingo. Al vaciar la guantera, encontré un recibo arrugado. Era de una gasolinera de un pueblo costero a tres horas de aquí. La fecha era de un martes del mes pasado, un día en que David, mi esposo, supuestamente había tenido 'un día de perros en la oficina, sin poder moverse'. Le pregunté esa misma tarde, con la voz más casual que pude fingir. 'Cariño, ¿fuiste a la costa el mes pasado?'. Se puso pálido. Balbuceó algo sobre un cliente, una reunión de última hora que no me había mencionado para no preocuparme. Pero sus ojos... sus ojos no sabían mentir. Más tarde esa noche, mientras él dormía, su computadora portátil me llamó como un faro. No me siento orgullosa, pero la abrí. En el historial de búsqueda, las piezas del rompecabezas encajaron de la forma más dolorosa posible: 'hoteles románticos en [nombre del pueblo]', 'los mejores restaurantes para parejas [nombre del pueblo]'. No tuve que buscar más. El ticket de gasolina no era solo un papel; era la prueba irrefutable de un viaje, de una vida paralela, de un 'nosotros' que no me incluía. Esa noche, el ruido del cristal de nuestra confianza rompiéndose fue ensordecedor.",
      "createdAt": new Date().toISOString(),
      "likes": 45,
      "shares": 25,
      "image": "/imagenes-poemas/imagen40.png",
      "imageHint": "gas receipt"
    },
    {
      "title": "La playlist de Spotify que no era para mí",
      "poem": "Compartíamos todo, o eso creía yo. Hasta la cuenta de Spotify. Una tarde, mientras trabajaba, puse nuestra playlist compartida, 'Nuestras Canciones ❤️'. Pero algo me llevó a mirar su perfil. Y ahí estaba: una playlist nueva, creada hacía dos semanas. Se llamaba 'Para mis noches...'. El corazón me dio un vuelco. La curiosidad fue más fuerte. La abrí. No había ninguna de 'nuestras' canciones. Eran baladas que yo no conocía, canciones de pop sensual, letras que hablaban de encuentros furtivos y deseos prohibidos. Cada canción era una puñalada. Era la banda sonora de su otra vida. La que tenía con 'ella'. ¿Quién era 'ella'? No lo sabía. Pero en ese momento, escuchando esas canciones, sentí que la conocía íntimamente. Conocía su risa, sus besos, las noches que le dedicaba mi novio. Apagué la música. El silencio que quedó fue más doloroso que cualquier canción triste. Entendí que él había compuesto una sinfonía para otra, mientras a mí me dejaba las repeticiones de una vieja melodía desgastada.",
      "createdAt": new Date().toISOString(),
      "likes": 38,
      "shares": 18,
      "image": "/imagenes-poemas/imagen54.png",
      "imageHint": "music playlist"
    },
    {
      "title": "'El amigo' que sabía demasiado",
      "poem": "A veces, la verdad no viene de quien te miente, sino de quien ya no soporta la mentira. Llevaba meses sintiendo a Carla distante, pegada al celular, con 'noches de chicas' que se alargaban hasta la madrugada. Yo me tragaba mis dudas, me decía a mí mismo que eran inseguridades mías. Hasta que una noche, en un asado, su 'mejor amigo', Miguel, se me acercó. Había bebido un par de cervezas de más, y sus ojos tenían esa mezcla de pena y coraje. 'Tío, no sé si deba decirte esto...', empezó. Y ahí mismo, supe que mi mundo estaba a punto de derrumbarse. 'Carla... no está siendo honesta contigo. Lo de las 'noches de chicas'... no siempre es con chicas'. Cada palabra caía como una gota de ácido. Me contó de un compañero de su trabajo, de cenas, de risas que ya no eran para mí. Miguel no entró en detalles sórdidos, no hacía falta. Su lealtad hacia mí, o su incapacidad para seguir siendo cómplice de la mentira, fue suficiente. Miré al otro lado del patio, donde Carla reía a carcajadas con sus amigas, y la vi por primera vez como una extraña. Esa noche no le dije nada. Solo la observé, buscando una grieta en su actuación. Y la encontré. En la forma en que evitaba mi mirada, en el nerviosismo de sus manos. A veces, la traición es tan obvia que nos negamos a verla hasta que alguien, con más valor que nosotros, enciende la luz.",
      "createdAt": new Date().toISOString(),
      "likes": 42,
      "shares": 22,
      "image": "/imagenes-poemas/imagen6.png",
      "imageHint": "friend secret"
    },
    {
      "title": "La marca de lápiz labial en el cuello de la camisa",
      "poem": "Es un cliché, lo sé. Suena a película de los años 50. Pero a veces, la realidad es así de torpe y predecible. Era lunes por la mañana, estaba recogiendo la ropa para lavar. Y ahí estaba, en el cuello de la camisa blanca que Alejandro había usado el viernes para la 'cena de la empresa'. Una mancha rosada, inconfundible. Un beso fantasma. Mi primer impulso fue negarlo. 'Será una mancha de comida', me dije. Pero al acercarme, olí un perfume dulce que no era el mío. El corazón se me detuvo. Durante todo el fin de semana, él había sido el novio perfecto: me trajo flores, vimos películas, hicimos el amor... y todo mientras llevaba el beso de otra mujer marcado en la ropa. Sentí una oleada de rabia y asco. Sostuve la camisa en mis manos como si fuera una prueba de un crimen. Y lo era. Era la prueba de que el 'te amo' del sábado por la noche había sido la mentira más cruel. No le grité. No lloré. Simplemente doblé la camisa con cuidado, la puse sobre su almohada y empaqué mis cosas. A veces, el silencio y una mancha de lápiz labial son la declaración de guerra más elocuente.",
      "createdAt": new Date().toISOString(),
      "likes": 50,
      "shares": 30,
      "image": "/imagenes-poemas/imagen33.png",
      "imageHint": "lipstick stain"
    }
  ],
  // Empty categories for images, to be populated by the seed script
  "Imagenesconnombres": [],
  "Fondosdepantallaromantico": [],
  "Imagenesdeamor": [],
  "Imagenesbuenosdiasmiamor": [],
  "Imagenesdebuenasnoches": [],
  "Imagenesromanticasparaenamorados": [],
  "Tarjetasdeamorparaenviarporwhatsapp": [],
  "Animesconfrasesbonitas": [],
  "Comobesatusigno": [],
  "Gifsanimadosderosasconfrases": [],
  "Gifsdebuenosdiasmiamor": [],
  "Gifsdebuenasnochesmiamor": [],
};

// Process raw data to add unique IDs
export const poemsData: Record<string, Poem[]> = Object.entries(rawPoemsData).reduce((acc, [category, poems]) => {
    acc[category] = poems.map(poem => ({
        ...poem,
        id: generateId(poem.title, category),
    }));
    return acc;
}, {} as Record<string, Poem[]>);


    