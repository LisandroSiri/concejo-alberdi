

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
const YOUTUBE_SEARCH_URL = 'https://www.googleapis.com/youtube/v3/search';

/**
 * Decodifica entidades HTML devueltas por YouTube API.
 */
function decodeHtmlEntities(text = '') {
  const parser = new DOMParser();
  const doc = parser.parseFromString(text, 'text/html');
  return doc.body.textContent || text;
}

/**
 * Formatea una fecha ISO a formato local en español (ej: "15 de mayo de 2026").
 */
function formatSpanishDate(isoDateString) {
  if (!isoDateString) return '';
  try {
    const date = new Date(isoDateString);
    return date.toLocaleDateString('es-AR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  } catch {
    return isoDateString;
  }
}

/**
 * Consulta transmisiones. Primero intenta consultar al Backend (/api/youtube/broadcasts)
 * que cuenta con memoria CACHÉ DE 60 MINUTOS para ahorrar cuota de Google.
 * Si el backend no responde o no está configurado, utiliza la API directa o fallback.
 *
 * @param {Object} options
 * @param {'live' | 'completed'} options.eventType
 * @param {number} [options.maxResults=8]
 */
export async function fetchYouTubeBroadcasts({ eventType = 'completed', maxResults = 8 } = {}) {
  // 1. INTENTO VÍA BACKEND (con Caché de 60 minutos)
  try {
    const backendRes = await fetch(
      `${API_BASE_URL}/youtube/broadcasts?eventType=${eventType}&maxResults=${maxResults}`
    );

    if (backendRes.ok) {
      const data = await backendRes.json();
      if (data.items && data.items.length > 0) {
        return {
          items: data.items,
          isFallback: false,
          cached: data.cached,
          cacheExpiresInMinutes: data.cacheExpiresInMinutes
        };
      }
      // Si el backend respondió pero sin items (o faltan credenciales en backend),
      // revisamos si tiene un mensaje
      if (data.isFallback) {
        console.info('[youtubeService] Backend en modo fallback:', data.message);
      }
    }
  } catch {
    console.warn('[youtubeService] Backend no disponible, evaluando conexión directa.');
  }

  // 2. INTENTO VÍA FRONTEND DIRECTO (si el usuario puso VITE_YOUTUBE_API_KEY en frontend)
  const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY;
  const channelId = import.meta.env.VITE_YOUTUBE_CHANNEL_ID;

  if (apiKey && channelId) {
    try {
      const queryParams = new URLSearchParams({
        part: 'snippet',
        channelId: channelId.trim(),
        type: 'video',
        eventType,
        order: 'date',
        maxResults: String(maxResults),
        key: apiKey.trim()
      });

      const response = await fetch(`${YOUTUBE_SEARCH_URL}?${queryParams.toString()}`);
      if (response.ok) {
        const data = await response.json();
        const items = (data.items || []).map((item) => {
          const videoId = item.id?.videoId;
          const snippet = item.snippet || {};

          return {
            id: videoId,
            youtubeId: videoId,
            title: decodeHtmlEntities(snippet.title || 'Sesión del Concejo Deliberante'),
            description: decodeHtmlEntities(snippet.description || 'Transmisión oficial del Concejo Deliberante.'),
            date: snippet.publishedAt,
            dateDisplay: formatSpanishDate(snippet.publishedAt),
            duration: eventType === 'live' ? 'En Vivo' : 'Directo finalizado',
            category: eventType === 'live' ? 'En Vivo' : 'Sesión Grabada',
            locationName: 'Recinto del Concejo Deliberante',
            thumbnailUrl:
              snippet.thumbnails?.high?.url ||
              snippet.thumbnails?.medium?.url ||
              snippet.thumbnails?.default?.url ||
              `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
            isLive: eventType === 'live'
          };
        });

        return { items, isFallback: false };
      }
    } catch (e) {
      console.error('[youtubeService] Error en petición directa:', e);
    }
  }

  // 3. FALLBACK SEGURO (Datos de demostración para que nunca se rompa la vista)
  if (eventType === 'live') {
    return {
      items: [],
      isFallback: true,
      message: 'No hay transmisiones en directo en este momento.'
    };
  }

  return {
    items: broadcastsData.map((item) => ({ ...item, isFallback: true })),
    isFallback: true,
    message: 'Modo demostración: Configura YOUTUBE_API_KEY en el backend (.env) para activar la caché de 60 min.'
  };
}
