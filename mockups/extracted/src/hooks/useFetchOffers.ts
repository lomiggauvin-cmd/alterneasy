import { useState, useEffect, useRef } from 'react';
import { useStore } from '../stores/store';
import { geocodeCity } from './useGeocode';

const LBA_BASE = 'https://labonnealternance.apprentissage.beta.gouv.fr/api/v1';

const DOMAIN_TO_ROME: Record<string, string> = {
  'Développement Web/Mobile': 'M1805',
  'Marketing Digital':        'M1703',
  'Design':                   'B1805',
  'Commerce/Vente':           'D1406',
  'Comptabilité/Finance':     'M1203',
  'RH':                       'M1501',
  'Audiovisuel':              'L1401',
  'Restauration/Hôtellerie': 'G1603',
  'Ingénierie':               'H1206',
};

export interface FetchedOffer {
  id: string;
  title: string;
  companyName: string;
  companyLogo: string | null;
  location: string;
  publishedAt: string | null;
  rhythmRequired: string | null;
  url: string | null;
}

interface UseFetchOffersResult {
  offers: FetchedOffer[];
  isLoading: boolean;
  error: string | null;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapApiOffer(raw: any): FetchedOffer | null {
  try {
    return {
      id: String(raw.id ?? raw._id ?? Math.random()),
      title: raw.title ?? raw.libelle ?? 'Offre sans titre',
      companyName: raw.company?.name ?? raw.entreprise?.nom ?? 'Entreprise',
      companyLogo: raw.company?.logo ?? null,
      location: raw.place?.city ?? raw.place?.fullAddress ?? '',
      publishedAt: raw.createdAt ?? null,
      rhythmRequired: raw.rythmeAlternance ?? null,
      url: raw.url ?? null,
    };
  } catch {
    return null;
  }
}

export function useFetchOffers(): UseFetchOffersResult {
  const domains   = useStore((s) => s.userPreferences.domains);
  const locations = useStore((s) => s.userPreferences.locations);

  const [offers, setOffers]       = useState<FetchedOffer[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError]         = useState<string | null>(null);

  const abortRef = useRef<AbortController | null>(null);

  // Stable primitive keys to avoid refetching on every render
  const domainsKey   = domains.join(',');
  const locationsKey = locations.join(',');

  useEffect(() => {
    const romes = domains.map((d) => DOMAIN_TO_ROME[d]).filter(Boolean);

    if (romes.length === 0 || locations.length === 0) {
      setOffers([]);
      setIsLoading(false);
      setError(null);
      return;
    }

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    const firstCity = locations.find((l) => l !== 'Remote') ?? locations[0];

    (async () => {
      setIsLoading(true);
      setError(null);

      try {
        const geo = await geocodeCity(firstCity);
        if (controller.signal.aborted) return;

        if (!geo) {
          setError('Impossible de géocoder la localisation.');
          setIsLoading(false);
          return;
        }

        const romesParam = romes.slice(0, 3).join(',');
        const url =
          `${LBA_BASE}/jobs/search` +
          `?romes=${romesParam}` +
          `&latitude=${geo.lat}` +
          `&longitude=${geo.lng}` +
          `&radius=30` +
          `&insee=${geo.insee}`;

        const res = await fetch(url, { signal: controller.signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await res.json();

        // Handle multiple possible response shapes from the LBA API
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const rawItems: any[] = Array.isArray(data)
          ? data
          : (data.results ?? data.jobs?.results ?? data.jobs ?? []);

        const mapped = rawItems
          .map(mapApiOffer)
          .filter((o): o is FetchedOffer => o !== null);

        setOffers(mapped);
      } catch (err: unknown) {
        if ((err as Error).name === 'AbortError') return;
        setError('Impossible de charger les offres, réessaie plus tard.');
        setOffers([]);
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    })();

    return () => { controller.abort(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [domainsKey, locationsKey]);

  return { offers, isLoading, error };
}
