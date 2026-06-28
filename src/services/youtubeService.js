// Servicio de consumo de API REST externa: YouTube Data API v3 (Google Cloud).
// Permite buscar videos educativos para una materia o tema.
// La API key se lee de .env (VITE_YOUTUBE_API_KEY).
const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY

// Bandera para saber si la key fue configurada.
export const youtubeConfigured = Boolean(API_KEY)

// Realiza una petición REST (GET) al endpoint de búsqueda de YouTube.
export async function searchVideos(text, maxResults = 9) {
  if (!youtubeConfigured) {
    throw new Error('Falta configurar VITE_YOUTUBE_API_KEY en el archivo .env')
  }

  const url = new URL('https://www.googleapis.com/youtube/v3/search')
  url.searchParams.set('part', 'snippet')
  url.searchParams.set('type', 'video')
  url.searchParams.set('maxResults', String(maxResults))
  url.searchParams.set('q', text)
  url.searchParams.set('relevanceLanguage', 'es')
  url.searchParams.set('safeSearch', 'strict')
  url.searchParams.set('key', API_KEY)

  const response = await fetch(url)
  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error(err?.error?.message || `Error HTTP ${response.status}`)
  }

  const data = await response.json()
  // Normalizamos la respuesta para usar solo lo que necesitamos en la UI.
  return data.items.map((item) => ({
    id: item.id.videoId,
    title: item.snippet.title,
    channel: item.snippet.channelTitle,
    thumbnail: item.snippet.thumbnails?.medium?.url,
    publishedAt: item.snippet.publishedAt,
    url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
  }))
}
