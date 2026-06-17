const GEO_API = 'https://geo.api.gouv.fr/communes';

export interface GeoResult {
  lat: number;
  lng: number;
  insee: string;
}

export async function geocodeCity(city: string): Promise<GeoResult | null> {
  try {
    const url = `${GEO_API}?nom=${encodeURIComponent(city)}&fields=nom,code,centre&limit=1`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json() as Array<{
      nom: string;
      code: string;
      centre: { type: string; coordinates: [number, number] };
    }>;
    if (!data.length) return null;
    const [commune] = data;
    // GeoJSON coordinates are [longitude, latitude]
    const [lng, lat] = commune.centre.coordinates;
    return { lat, lng, insee: commune.code };
  } catch {
    return null;
  }
}
