export const DOMAIN_KEYWORDS: Record<string, string[]> = {
  audiovisuel: [
    'audiovisuel', 'audiovisuelle', 'cinema', 'cinéma', 'production', 'vidéo', 'video',
    'son', 'image', 'caméra', 'camera', 'cadreur', 'monteur', 'montage', 'réalisateur',
    'realisateur', 'opérateur', 'operateur', 'mixeur', 'motion', 'photographie',
    'post-production', 'post production',
  ],
  commerce: ['commerce', 'commercial', 'vente', 'retail', 'boutique', 'magasin', 'distribution'],
  marketing: ['marketing', 'communication', 'growth', 'publicité', 'publicite', 'agence', 'digital'],
  'ingénierie': [
    'ingénierie', 'ingenierie', 'technique', "bureau d'études", 'r&d',
    'mécanique', 'mecanique', 'recherche', 'développement', 'developpement',
  ],
};

export function normalize(str: string): string {
  return str.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
}

export function matchesDomain(domaine: string, contactRole: string, industry: string): boolean {
  if (!domaine || domaine === 'autre') return true;
  const keywords = DOMAIN_KEYWORDS[domaine] ?? [];
  const text = normalize(`${contactRole} ${industry}`);
  return keywords.some((kw) => text.includes(normalize(kw)));
}
