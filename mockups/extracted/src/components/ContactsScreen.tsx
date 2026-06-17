import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Icons from 'lucide-react';
import toast from 'react-hot-toast';
import { useStore } from '../stores/store';
import { DOMAINES, DomaineType } from '../types';
import { CompanyResult, searchCompanies } from '../utils/companySearch';
import { nafCodesForDomain } from '../utils/nafMap';

// ─── Sidebar ──────────────────────────────────────────────────────────────────

const Sidebar: React.FC = () => {
  const { currentScreen, navigateTo, isDarkMode, toggleDarkMode, currentUser } = useStore();
  const navItems = [
    { id: 'dashboard',        icon: Icons.LayoutDashboard, screen: 'dashboard'        as const },
    { id: 'pipeline',         icon: Icons.Kanban,          screen: 'pipeline'         as const },
    { id: 'contacts',         icon: Icons.Users,           screen: 'contacts'         as const },
    { id: 'messageGenerator', icon: Icons.MessageSquare,   screen: 'messageGenerator' as const },
  ];
  return (
    <aside className="w-[72px] h-full bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex flex-col items-center py-6 z-20 flex-shrink-0 transition-colors duration-300">
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
        className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center mb-8 shadow-lg cursor-pointer"
        onClick={() => navigateTo('dashboard')}>
        <Icons.Zap className="w-5 h-5 text-white" />
      </motion.div>
      <nav className="flex flex-col gap-2">
        {navItems.map((item) => (
          <motion.button key={item.id} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={() => navigateTo(item.screen)}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
              currentScreen === item.screen
                ? 'bg-indigo-600 shadow-md'
                : 'bg-slate-100 dark:bg-slate-700/50 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}>
            <item.icon className={`w-5 h-5 ${currentScreen === item.screen ? 'text-white' : 'text-slate-600 dark:text-slate-400'}`} />
          </motion.button>
        ))}
      </nav>
      <div className="mt-auto flex flex-col gap-3 items-center">
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={toggleDarkMode}
          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${isDarkMode ? 'bg-indigo-600' : 'bg-slate-100 dark:bg-slate-700/50 hover:bg-slate-200'}`}>
          {isDarkMode ? <Icons.Sun className="w-5 h-5 text-white" /> : <Icons.Moon className="w-5 h-5 text-slate-600 dark:text-slate-400" />}
        </motion.button>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => navigateTo('profile')}
          className="w-10 h-10 rounded-full bg-indigo-400 flex items-center justify-center shadow-md">
          <span className="text-[13px] font-bold text-white">
            {currentUser?.firstName?.charAt(0)}{currentUser?.lastName?.charAt(0)}
          </span>
        </motion.button>
      </div>
    </aside>
  );
};

// ─── Labels domaine ───────────────────────────────────────────────────────────

const DOMAINE_LABELS: Record<DomaineType, string> = {
  audiovisuel:  '🎬 Audiovisuel',
  commerce:     '🛍️ Commerce',
  marketing:    '📣 Marketing',
  'ingénierie': '⚙️ Ingénierie',
  autre:        '✨ Autre',
};

// ─── Effectif helper ──────────────────────────────────────────────────────────

function fmtEffectif(code: string | null): string | null {
  if (!code) return null;
  const map: Record<string, string> = {
    '00': '0 sal.', '01': '1-2', '02': '3-5', '03': '6-9',
    '11': '10-19', '12': '20-49', '21': '50-99', '22': '100-199',
    '31': '200-249', '32': '250-499', '41': '500-999',
    '42': '1 000-1 999', '51': '2 000-4 999', '52': '5 000-9 999', '53': '10 000+',
  };
  return map[code] ?? null;
}

// ─── Skeleton card ────────────────────────────────────────────────────────────

const SkeletonCard: React.FC = () => (
  <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 shadow-sm animate-pulse">
    <div className="flex items-start gap-3 mb-3">
      <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-700 flex-shrink-0" />
      <div className="flex-1 space-y-2 pt-0.5">
        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
        <div className="h-2.5 bg-slate-200 dark:bg-slate-700 rounded w-full" />
        <div className="h-2.5 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
      </div>
    </div>
    <div className="flex gap-1.5 mb-3">
      <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded-full w-16" />
      <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded-full w-12" />
    </div>
    <div className="pt-3 border-t border-slate-100 dark:border-slate-700">
      <div className="h-7 bg-slate-200 dark:bg-slate-700 rounded-lg" />
    </div>
  </div>
);

// ─── Company card ─────────────────────────────────────────────────────────────

interface CompanyCardProps {
  company: CompanyResult;
  alreadyAdded: boolean;
  onAdd: (c: CompanyResult) => void;
  onDismiss: (c: CompanyResult) => void;
}

const AVATAR_COLORS = [
  'bg-indigo-400', 'bg-violet-400', 'bg-sky-400',
  'bg-emerald-400', 'bg-rose-400', 'bg-amber-400',
];

const CompanyCard: React.FC<CompanyCardProps> = ({ company: c, alreadyAdded, onAdd, onDismiss }) => {
  const initials = c.nomComplet.slice(0, 2).toUpperCase();
  const color = AVATAR_COLORS[c.siren.charCodeAt(0) % AVATAR_COLORS.length];
  const effectif = fmtEffectif(c.effectif);
  const dirigeant = [c.dirigeantPrenom, c.dirigeantNom].filter(Boolean).join(' ');

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 shadow-sm hover:shadow-md hover:border-indigo-200 dark:hover:border-indigo-700 transition-all"
    >
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center flex-shrink-0`}>
          <span className="text-[13px] font-bold text-white">{initials}</span>
        </div>
        <div className="flex-1 min-w-0">
          {c.activite && (
            <p className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold truncate mb-0.5">
              {c.activite}
            </p>
          )}
          <p className="text-[14px] font-semibold text-slate-900 dark:text-white truncate leading-snug">
            {c.nomComplet}
          </p>
          {dirigeant && (
            <p className="text-[12px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
              {dirigeant}
              {c.dirigeantQualite && c.dirigeantQualite !== 'Contact' && (
                <span className="text-slate-400 dark:text-slate-500"> · {c.dirigeantQualite}</span>
              )}
            </p>
          )}
        </div>
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-1.5 mt-3">
        {c.ville && (
          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-[11px] text-slate-600 dark:text-slate-400">
            <Icons.MapPin className="w-2.5 h-2.5" />
            {c.ville}{c.codePostal ? ` (${c.codePostal.slice(0, 2)})` : ''}
          </span>
        )}
        {effectif && (
          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-[11px] text-slate-600 dark:text-slate-400">
            <Icons.Users className="w-2.5 h-2.5" />
            {effectif}
          </span>
        )}
      </div>

      {/* Actions */}
      <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700">
        {alreadyAdded ? (
          <div className="flex items-center gap-1.5 text-[12px] text-emerald-600 dark:text-emerald-400 font-medium">
            <Icons.CheckCircle2 className="w-3.5 h-3.5" />
            Dans le pipeline
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              onClick={() => onAdd(c)}
              className="flex-1 py-1.5 px-3 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 text-[12px] font-semibold hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition-colors flex items-center justify-center gap-1.5"
            >
              <Icons.Plus className="w-3.5 h-3.5" />
              Ajouter au suivi
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={() => onDismiss(c)}
              title="Pas intéressé"
              className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-500 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 dark:hover:text-red-400 transition-colors flex items-center justify-center flex-shrink-0"
            >
              <Icons.X className="w-3.5 h-3.5" />
            </motion.button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// ─── Domain selector (si absent du profil) ───────────────────────────────────

const DomainSelector: React.FC<{ onSelect: (d: DomaineType) => void }> = ({ onSelect }) => (
  <div className="flex flex-col items-center justify-center py-20 gap-6">
    <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center">
      <Icons.Filter className="w-8 h-8 text-indigo-500" />
    </div>
    <div className="text-center">
      <h2 className="font-['Fraunces'] text-[22px] font-semibold text-slate-900 dark:text-white">
        Quel domaine recherches-tu ?
      </h2>
      <p className="text-[13px] text-slate-500 dark:text-slate-400 mt-1">
        Ce choix sera sauvegardé dans ton profil.
      </p>
    </div>
    <div className="flex flex-wrap gap-2 justify-center max-w-md">
      {DOMAINES.map((d) => (
        <motion.button key={d} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
          onClick={() => onSelect(d)}
          className="px-5 py-2.5 rounded-xl border-2 border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[13px] font-semibold hover:border-indigo-400 hover:text-indigo-600 dark:hover:border-indigo-500 dark:hover:text-indigo-400 transition-colors">
          {DOMAINE_LABELS[d]}
        </motion.button>
      ))}
    </div>
  </div>
);

// ─── ContactsScreen ───────────────────────────────────────────────────────────

type SearchState = 'idle' | 'loading' | 'done' | 'error';

const CITY_KEY = 'tandem_last_city';

export default function ContactsScreen() {
  const {
    candidatures, addCandidature,
    dismissedSirens, dismissSiren, restoreSiren,
    studentProfile, setStudentProfile,
  } = useStore();

  const [ville,        setVille]        = useState(() => localStorage.getItem(CITY_KEY) ?? '');
  const [results,      setResults]      = useState<CompanyResult[]>([]);
  const [searchState,  setSearchState]  = useState<SearchState>('idle');
  const [errorMsg,     setErrorMsg]     = useState('');
  const [progress,     setProgress]     = useState({ done: 0, total: 0 });
  const [showDismissed, setShowDismissed] = useState(false);
  const abortRef = useRef(false);

  const domaine = studentProfile.domaine;

  const handleSelectDomain = (d: DomaineType) => {
    setStudentProfile({ domaine: d });
    toast.success(`Domaine "${DOMAINE_LABELS[d]}" enregistré`);
  };

  // Exclure les SIRENs ignorés des résultats
  const dismissedSet = useMemo(() => new Set(dismissedSirens), [dismissedSirens]);
  const visible = useMemo(
    () => results.filter((c) => !dismissedSet.has(c.siren)),
    [results, dismissedSet]
  );
  const dismissed = useMemo(
    () => results.filter((c) => dismissedSet.has(c.siren)),
    [results, dismissedSet]
  );

  // SIRENs déjà dans le pipeline
  const addedSirens = useMemo(() => {
    const names = new Set(Object.values(candidatures).map((c) => c.entreprise.toLowerCase()));
    return new Set(results.filter((c) => names.has(c.nomComplet.toLowerCase())).map((c) => c.siren));
  }, [results, candidatures]);

  // useCallback pour que l'effet de montage capture toujours la version courante
  const handleSearch = useCallback(async (villeCible = ville, domaineCible = domaine) => {
    if (!villeCible.trim()) { toast.error('Saisis une ville pour lancer la recherche.'); return; }
    if (!domaineCible)      { toast.error('Définis ton domaine dans ton profil d\'abord.'); return; }

    const nafCodes = nafCodesForDomain(domaineCible);
    if (!nafCodes.length) {
      toast.error(`Aucun code NAF défini pour le domaine "${domaineCible}".`);
      return;
    }

    localStorage.setItem(CITY_KEY, villeCible.trim());
    setSearchState('loading');
    setErrorMsg('');
    setResults([]);
    setProgress({ done: 0, total: nafCodes.length });
    abortRef.current = false;

    console.log(`[ContactsScreen] Recherche → ville="${villeCible}" domaine="${domaineCible}" codes NAF:`, nafCodes);

    const { results: found, error } = await searchCompanies(
      villeCible.trim(),
      nafCodes,
      (done, total) => setProgress({ done, total })
    );

    if (abortRef.current) return;

    console.log(`[ContactsScreen] Résultats reçus (${found.length}) → stockage dans results state`);

    if (error) {
      setSearchState('error');
      setErrorMsg(error);
    } else {
      setResults(found);  // ← seule source d'alimentation des cartes
      setSearchState('done');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ville, domaine]);

  // Auto-recherche si une ville est sauvegardée et qu'on arrive sur l'écran
  useEffect(() => {
    if (domaine && ville && results.length === 0 && searchState === 'idle') {
      handleSearch(ville, domaine);
    }
    return () => { abortRef.current = true; };
  }, [handleSearch]); // handleSearch se met à jour quand ville/domaine changent

  const handleAdd = (c: CompanyResult) => {
    const dirigeant = [c.dirigeantPrenom, c.dirigeantNom].filter(Boolean).join(' ');
    const notesParts = [`Activité : ${c.activite}`];
    const effectif = fmtEffectif(c.effectif);
    if (effectif) notesParts.push(`Effectif : ${effectif}`);
    if (c.codePostal) notesParts.push(`Code postal : ${c.codePostal}`);

    addCandidature({
      entreprise:         c.nomComplet,
      contactNom:         dirigeant,
      contactRole:        c.dirigeantQualite !== 'Contact' ? c.dirigeantQualite : '',
      posteVise:          '',
      canal:              'LinkedIn',
      statut:             'À contacter',
      dateDernierContact: null,
      dateRelancePrevue:  null,
      notes:              notesParts.join('\n'),
    });
    toast.success(`${c.nomComplet} ajouté au pipeline !`);
  };

  const handleDismiss = (c: CompanyResult) => {
    dismissSiren(c.siren);
    toast(
      (t) => (
        <div className="flex items-center gap-3">
          <span className="text-[13px] text-slate-800">{c.nomComplet} ignoré</span>
          <button
            onClick={() => { restoreSiren(c.siren); toast.dismiss(t.id); }}
            className="text-[12px] font-semibold text-indigo-600 hover:text-indigo-800 underline"
          >
            Annuler
          </button>
        </div>
      ),
      { duration: 5000, icon: '🚫' }
    );
  };

  const handleRestore = (siren: string) => {
    restoreSiren(siren);
    toast.success('Profil restauré');
  };

  return (
    <div className="w-full h-full flex font-['Plus_Jakarta_Sans'] bg-slate-50 dark:bg-slate-900 overflow-hidden relative transition-colors duration-300">
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{ backgroundImage: `radial-gradient(circle at 1px 1px, #0F172A 1px, transparent 0)`, backgroundSize: '24px 24px' }} />

      <Sidebar />

      <main className="flex-1 flex flex-col p-8 z-10 overflow-y-auto">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>

          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="font-['Fraunces'] text-[28px] font-semibold text-slate-900 dark:text-white leading-tight">
                Marché caché
              </h1>
              <p className="text-[14px] text-slate-500 dark:text-slate-400 mt-0.5">
                Entreprises proches · source : API État (sans clé)
              </p>
            </div>

            {/* Chip domaine */}
            {domaine && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 text-[13px] text-indigo-700 dark:text-indigo-300">
                <Icons.Filter className="w-4 h-4" />
                <span className="capitalize font-semibold">{domaine}</span>
                <button onClick={() => setStudentProfile({ domaine: '' })}
                  className="ml-1 text-[11px] underline text-indigo-500 hover:text-indigo-700 dark:hover:text-indigo-200">
                  Changer
                </button>
              </div>
            )}
          </div>

          {/* Cas : pas de domaine */}
          {!domaine && <DomainSelector onSelect={handleSelectDomain} />}

          {domaine && (
            <>
              {/* Barre de recherche */}
              <div className="flex items-center gap-3 mb-6">
                <div className="relative flex-1 max-w-sm">
                  <Icons.MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    value={ville}
                    onChange={(e) => setVille(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    placeholder="Paris, Lyon, Bordeaux…"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-[14px] text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent shadow-sm"
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                  onClick={() => handleSearch()}
                  disabled={searchState === 'loading'}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-[13px] font-semibold hover:bg-indigo-700 transition-colors shadow-md disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {searchState === 'loading' ? (
                    <>
                      <Icons.Loader2 className="w-4 h-4 animate-spin" />
                      {progress.total > 0
                        ? `${progress.done}/${progress.total}`
                        : 'Recherche…'}
                    </>
                  ) : (
                    <>
                      <Icons.Search className="w-4 h-4" />
                      Rechercher
                    </>
                  )}
                </motion.button>
              </div>

              {/* Info rayon */}
              {searchState === 'done' && visible.length > 0 && (
                <p className="text-[13px] text-slate-500 dark:text-slate-400 mb-4">
                  <strong className="text-slate-700 dark:text-slate-300">{visible.length}</strong> entreprise{visible.length > 1 ? 's' : ''} trouvée{visible.length > 1 ? 's' : ''} dans un rayon de 30 km autour de <strong className="capitalize">{ville}</strong>
                </p>
              )}

              <AnimatePresence mode="popLayout">

                {/* Skeleton */}
                {searchState === 'loading' && (
                  <motion.div key="skeleton" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                    {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
                  </motion.div>
                )}

                {/* Erreur */}
                {searchState === 'error' && (
                  <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center py-16 gap-4 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 flex items-center justify-center">
                      <Icons.WifiOff className="w-8 h-8 text-red-500" />
                    </div>
                    <p className="text-[15px] font-semibold text-slate-700 dark:text-slate-300">Recherche impossible</p>
                    <p className="text-[13px] text-slate-500 dark:text-slate-400 max-w-sm">{errorMsg}</p>
                    <motion.button
                      whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                      onClick={() => handleSearch()}
                      className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-[13px] font-semibold hover:bg-indigo-700 transition-colors shadow-md mt-2">
                      Réessayer
                    </motion.button>
                  </motion.div>
                )}

                {/* État initial */}
                {searchState === 'idle' && (
                  <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center py-16 gap-4 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center">
                      <Icons.Building2 className="w-8 h-8 text-indigo-500" />
                    </div>
                    <p className="text-[15px] font-semibold text-slate-700 dark:text-slate-300">
                      Saisis une ville pour commencer
                    </p>
                    <p className="text-[13px] text-slate-500 dark:text-slate-400 max-w-xs">
                      L'app va chercher les entreprises <strong>{domaine}</strong> dans un rayon de 30 km.
                    </p>
                  </motion.div>
                )}

                {/* Résultats vides */}
                {searchState === 'done' && visible.length === 0 && dismissed.length === 0 && (
                  <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center py-16 gap-4 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 flex items-center justify-center">
                      <Icons.SearchX className="w-8 h-8 text-amber-500" />
                    </div>
                    <p className="text-[15px] font-semibold text-slate-700 dark:text-slate-300">
                      Aucune entreprise trouvée
                    </p>
                    <p className="text-[13px] text-slate-500 dark:text-slate-400 max-w-xs">
                      Essaie une ville plus grande ou proche d'un bassin économique.
                    </p>
                  </motion.div>
                )}

                {/* Grille de résultats */}
                {searchState === 'done' && visible.length > 0 && (
                  <motion.div key="grid" layout
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                    {/* DEBUG — à retirer après validation */}
                    {console.log('AFFICHAGE →', visible) as unknown as null}
                    {visible.map((c) => (
                      <CompanyCard
                        key={c.siren}
                        company={c}
                        alreadyAdded={addedSirens.has(c.siren)}
                        onAdd={handleAdd}
                        onDismiss={handleDismiss}
                      />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ── Section "Profils ignorés" ── */}
              {dismissed.length > 0 && searchState === 'done' && (
                <div className="mt-8">
                  <button
                    onClick={() => setShowDismissed((v) => !v)}
                    className="flex items-center gap-2 text-[12px] text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors mb-3"
                  >
                    <motion.span animate={{ rotate: showDismissed ? 90 : 0 }} transition={{ duration: 0.15 }} className="inline-block">
                      <Icons.ChevronRight className="w-3.5 h-3.5" />
                    </motion.span>
                    Profils ignorés ({dismissed.length})
                  </button>

                  <AnimatePresence>
                    {showDismissed && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                        <div className="flex flex-col gap-2 pb-4">
                          {dismissed.map((c) => (
                            <div key={c.siren} className="flex items-center gap-3 px-4 py-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 opacity-60">
                              <div className="flex-1 min-w-0">
                                <p className="text-[13px] font-medium text-slate-700 dark:text-slate-300 truncate">{c.nomComplet}</p>
                                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{c.activite || c.ville}</p>
                              </div>
                              <button onClick={() => handleRestore(c.siren)}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 text-[11px] font-medium hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex-shrink-0">
                                <Icons.RotateCcw className="w-3 h-3" />
                                Restaurer
                              </button>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </>
          )}

        </motion.div>
      </main>

      <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-indigo-500 opacity-[0.03] rounded-full blur-3xl translate-y-1/4 translate-x-1/4 pointer-events-none" />
    </div>
  );
}
