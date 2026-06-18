export interface CompanyResult {
  siren:             string;
  nomComplet:        string;
  activite:          string;
  nafCode:           string;
  dirigeantPrenom:   string;
  dirigeantNom:      string;
  dirigeantQualite:  string;
  ville:             string;
  codePostal:        string;
  effectif:          string | null;
  siteWeb?:          string;
  telephone?:        string;
}

// ─── Types réponse API ────────────────────────────────────────────────────────

interface ApiDirigeant {
  nom?:     string;
  prenoms?: string;
  qualite?: string;
}

interface ApiSiege {
  commune?:       string;
  code_postal?:   string;
  site_internet?: string;
  telephone?:     string;
}

interface ApiCompany {
  siren:                        string;
  nom_complet?:                 string;
  nom_raison_sociale?:          string;
  activite_principale?:         string;
  libelle_activite_principale?: string;
  siege?:                       ApiSiege;
  dirigeants?:                  ApiDirigeant[];
  tranche_effectif_salarie?:    string;
}

interface ApiSearchResponse {
  results?: ApiCompany[];
}

interface GeoCommune {
  nom?:          string;
  centre?:       { coordinates: [number, number] };
  departement?:  { code: string; nom: string };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const delay = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

function mapCompany(raw: ApiCompany): CompanyResult {
  const d = raw.dirigeants?.[0];
  return {
    siren:            raw.siren,
    nomComplet:       raw.nom_complet ?? raw.nom_raison_sociale ?? '',
    activite:         raw.libelle_activite_principale ?? raw.activite_principale ?? '',
    nafCode:          raw.activite_principale ?? '',
    dirigeantPrenom:  d?.prenoms ?? '',
    dirigeantNom:     d?.nom ?? '',
    dirigeantQualite: d?.qualite ?? 'Contact',
    ville:            raw.siege?.commune ?? '',
    codePostal:       raw.siege?.code_postal ?? '',
    effectif:         raw.tranche_effectif_salarie ?? null,
    siteWeb:          raw.siege?.site_internet || undefined,
    telephone:        raw.siege?.telephone || undefined,
  };
}

// ─── Géocodage — renvoie aussi le code département ───────────────────────────

interface GeoResult {
  lat:         number;
  lon:         number;
  departement: string; // ex: "59" pour le Nord, "75" pour Paris
}

export async function geocodeCity(ville: string): Promise<GeoResult | null> {
  const url = `https://geo.api.gouv.fr/communes?nom=${encodeURIComponent(ville)}&fields=centre,departement&limit=1`;
  try {
    const resp = await fetch(url);
    if (!resp.ok) {
      console.warn(`[geocodeCity] HTTP ${resp.status}`, url);
      return null;
    }
    const data = (await resp.json()) as GeoCommune[];
    const first = data[0];
    const c = first?.centre?.coordinates;
    if (!c) {
      console.warn(`[geocodeCity] Pas de coordonnées pour "${ville}"`, data);
      return null;
    }
    const departement = first?.departement?.code ?? '';
    if (!departement) {
      console.warn(`[geocodeCity] Pas de département pour "${ville}"`, first);
    }
    return { lat: c[1], lon: c[0], departement };
  } catch (err) {
    console.warn(`[geocodeCity] Erreur réseau`, err);
    return null;
  }
}

// ─── Recherche par code NAF + département ─────────────────────────────────────
// Endpoint /search avec code_naf (avec le point) + departement (code à 2 chiffres)
// Doc confirmée : search?code_naf=47.11D&departement=59&per_page=25

async function searchOneNaf(
  nafCode: string,
  departement: string,
  perPage = 25
): Promise<CompanyResult[]> {
  const params = new URLSearchParams({
    activite_principale: nafCode,
    departement,
    per_page:            String(perPage),
  });
  const url = `https://recherche-entreprises.api.gouv.fr/search?${params}`;
  try {
    const resp = await fetch(url);
    if (!resp.ok) {
      console.warn(`[companySearch] activite_principale=${nafCode} dept=${departement} → HTTP ${resp.status}`, url);
      return [];
    }
    const data = (await resp.json()) as ApiSearchResponse;
    const results = (data.results ?? []).map(mapCompany);
    console.debug(`[companySearch] activite_principale=${nafCode} dept=${departement} → ${results.length} résultats`);
    return results;
  } catch (err) {
    console.warn(`[companySearch] ${nafCode}/dept${departement} → fetch error`, err);
    return [];
  }
}

// ─── Point d'entrée principal ─────────────────────────────────────────────────

export interface SearchResult {
  results:      CompanyResult[];
  ville:        string;
  departement?: string;
  error?:       string;
}

/**
 * Géocode la ville → extrait le département → un appel /search par code NAF.
 * Résultats dédoublonnés par SIREN, throttlés à ≤6 req/s.
 */
export async function searchCompanies(
  ville: string,
  nafCodes: string[],
  onProgress?: (done: number, total: number) => void
): Promise<SearchResult> {
  if (!nafCodes.length) {
    return { results: [], ville, error: 'Aucun code NAF défini pour ce domaine.' };
  }

  const geo = await geocodeCity(ville);
  if (!geo) {
    return {
      results: [],
      ville,
      error: `Impossible de localiser "${ville}". Essaie un autre nom de ville.`,
    };
  }
  if (!geo.departement) {
    return {
      results: [],
      ville,
      error: `Département introuvable pour "${ville}". Essaie le nom complet de la commune.`,
    };
  }

  const allResults: CompanyResult[] = [];
  const seen = new Set<string>();

  for (let i = 0; i < nafCodes.length; i++) {
    if (onProgress) onProgress(i, nafCodes.length);

    const batch = await searchOneNaf(nafCodes[i], geo.departement);
    for (const c of batch) {
      if (c.siren && !seen.has(c.siren)) {
        seen.add(c.siren);
        allResults.push(c);
      }
    }

    // Throttle : 175 ms → ~5-6 req/s
    if (i < nafCodes.length - 1) await delay(175);
  }

  if (onProgress) onProgress(nafCodes.length, nafCodes.length);

  return { results: allResults, ville, departement: geo.departement };
}
