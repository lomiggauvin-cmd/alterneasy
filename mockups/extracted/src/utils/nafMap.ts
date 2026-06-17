// Codes NAF officiels (avec le point, format français APE)
// Un appel API est émis par code → garder la liste courte par domaine
export const NAF_MAP: Record<string, string[]> = {
  audiovisuel: [
    '59.11A', // Production films/programmes TV
    '59.11B', // Production films institutionnels/pub
    '59.11C', // Production films cinéma
    '59.12Z', // Post-production
    '59.13A', // Distribution films cinéma
    '59.13B', // Édition et distribution vidéo
    '59.14Z', // Projection cinématographique
    '59.20Z', // Enregistrement sonore
    '60.10Z', // Édition/diffusion radio
    '60.20A', // Édition chaînes généralistes
    '60.20B', // Édition chaînes thématiques
  ],
  commerce: [
    '47.11C', // Supermarchés
    '47.11D', // Supérettes
    '47.11F', // Hypermarchés
    '47.19A', // Grands magasins
    '47.19B', // Autres commerces non spécialisés
    '47.25Z', // Commerce de détail de boissons
    '47.42Z', // Commerce de détail équipements communication
    '47.91A', // Vente par correspondance
    '46.90Z', // Commerce de gros non spécialisé
  ],
  marketing: [
    '73.11Z', // Agences de publicité
    '73.12Z', // Régie publicitaire de médias
    '70.21Z', // Relations publiques et communication
    '74.10Z', // Activités de design
  ],
  'ingénierie': [
    '71.11Z', // Activités d'architecture
    '71.12A', // Activités des géomètres
    '71.12B', // Ingénierie et études techniques
    '72.19Z', // R&D autres sciences
    '74.90B', // Activités spécialisées scientifiques
  ],
  autre: [
    '70.22Z', // Conseil pour les affaires
    '82.11Z', // Services administratifs
    '62.01Z', // Programmation informatique
  ],
};

export function nafCodesForDomain(domaine: string): string[] {
  return NAF_MAP[domaine.toLowerCase()] ?? [];
}
