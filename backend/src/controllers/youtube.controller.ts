import { Request, Response } from 'express';

const YOUTUBE_SEARCH_URL = 'https://www.googleapis.com/youtube/v3/search';
const CACHE_DURATION_MS = 60 * 60 * 1000; // 60 minutos (1 hora)

interface CacheEntry {
  timestamp: number;
  data: any[];
}

const memoryCache: Record<string, CacheEntry> = {};

function decodeHtmlEntities(text = ''): string {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'");
}

function formatSpanishDate(isoDateString: string): string {
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

export async function getBroadcasts(req: Request, res: Response) {
  const eventType = (req.query.eventType === 'live' ? 'live' : 'completed') as 'live' | 'completed';
  const maxResults = Math.min(Number(req.query.maxResults) || 8, 20);

  const apiKey = process.env.YOUTUBE_API_KEY;
  const channelId = process.env.YOUTUBE_CHANNEL_ID;

  const cacheKey = `${eventType}_${maxResults}`;
  const now = Date.now();
  const cached = memoryCache[cacheKey];

  // 1. Si existe en caché y no han pasado 60 minutos, respondemos inmediatamente sin gastar cuota
  if (cached && now - cached.timestamp < CACHE_DURATION_MS) {
    return res.json({
      items: cached.data,
      cached: true,
      cacheExpiresInMinutes: Math.round((CACHE_DURATION_MS - (now - cached.timestamp)) / 60000)
    });
  }

  // 2. Si no hay claves configuradas en backend
  if (!apiKey || !channelId) {
    return res.json({
      items: [],
      cached: false,
      isFallback: true,
      message: 'Faltan configurar YOUTUBE_API_KEY y YOUTUBE_CHANNEL_ID en el backend (.env).'
    });
  }

  // 3. Consultar a Google YouTube Data API v3
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

    if (!response.ok) {
      const errData: any = await response.json().catch(() => ({}));
      const errMsg = errData?.error?.message || response.statusText;
      console.error(`[YouTube Backend Error] ${response.status}: ${errMsg}`);

      // Si teníamos algo previo en caché (aunque haya vencido), lo devolvemos como salvavidas
      if (cached) {
        return res.json({
          items: cached.data,
          cached: true,
          warning: 'Error en YouTube API, entregando versión en caché previa.'
        });
      }

      return res.status(502).json({
        items: [],
        error: `Error al consultar YouTube API: ${errMsg}`
      });
    }

    const data: any = await response.json();
    const items = (data.items || []).map((item: any) => {
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

    // Guardar en cuaderno de notas (memoria caché) por 60 minutos
    memoryCache[cacheKey] = {
      timestamp: now,
      data: items
    };

    return res.json({
      items,
      cached: false,
      cacheExpiresInMinutes: 60
    });
  } catch (error: any) {
    console.error('[YouTube Controller Exception]:', error);
    if (cached) {
      return res.json({
        items: cached.data,
        cached: true,
        warning: 'Excepción de red, entregando caché previa.'
      });
    }
    return res.status(500).json({ items: [], error: 'Error interno conectando con YouTube' });
  }
}
