import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Icons from 'lucide-react';
import Papa from 'papaparse';
import toast from 'react-hot-toast';
import { useStore } from '../stores/store';
import { normalize, matchesDomain } from '../utils/domainFilter';

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

// ─── Types ────────────────────────────────────────────────────────────────────

interface PreviewRow {
  prenom:       string;
  nom:          string;
  contactRole:  string;
  entreprise:   string;
  industry:     string;
  email:        string;
  linkedinUrl:  string;
  ville:        string;
  inDomain:     boolean;
  isDuplicate:  boolean;
}

// ─── CSV template ─────────────────────────────────────────────────────────────

const TEMPLATE_CSV = `First Name,Last Name,Title,Company,Email,Person Linkedin Url,City,Industry
Marie,Dupont,Directrice de la photographie,NordProd Films,m.dupont@nordprod.fr,linkedin.com/in/marie-dupont,Lille,Audiovisuel / Cinéma`;

function downloadTemplate() {
  const blob = new Blob([TEMPLATE_CSV], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'modele_apollo_import.csv';
  a.click();
  URL.revokeObjectURL(url);
}

// ─── ImportScreen ─────────────────────────────────────────────────────────────

type Step = 'upload' | 'preview' | 'done';

export default function ImportScreen() {
  const { navigateTo, contacts, addContact, studentProfile } = useStore();

  const [step,        setStep]        = useState<Step>('upload');
  const [isDragging,  setIsDragging]  = useState(false);
  const [preview,     setPreview]     = useState<PreviewRow[]>([]);
  const [fileName,    setFileName]    = useState('');
  const [importCount, setImportCount] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const domaine = studentProfile.domaine;

  const handleFile = useCallback((file: File) => {
    if (!file.name.endsWith('.csv') && file.type !== 'text/csv') {
      toast.error('Fichier CSV requis (.csv)');
      return;
    }
    setFileName(file.name);

    const existingKeys = new Set(
      Object.values(contacts).map(
        (c) => `${normalize(c.prenom + ' ' + c.nom)}|${normalize(c.entreprise)}`
      )
    );

    Papa.parse<Record<string, string>>(file, {
      header: true,
      skipEmptyLines: true,
      encoding: 'UTF-8',
      complete: ({ data, errors }) => {
        if (errors.length && data.length === 0) {
          toast.error('Impossible de lire le fichier CSV');
          return;
        }

        const rows: PreviewRow[] = data.map((row) => {
          const prenom      = (row['First Name']          ?? row['Prénom']        ?? '').trim();
          const nom         = (row['Last Name']           ?? row['Nom']           ?? '').trim();
          const contactRole = (row['Title']               ?? row['Titre']         ?? '').trim();
          const entreprise  = (row['Company']             ?? row['Entreprise']    ?? '').trim();
          const industry    = (row['Industry']            ?? row['Secteur']       ?? '').trim();
          const email       = (row['Email']               ?? '').trim();
          const linkedinUrl = (row['Person Linkedin Url'] ?? row['LinkedIn URL']  ?? '').trim();
          const ville       = (row['City']                ?? row['Ville']         ?? '').trim();

          const key         = `${normalize(prenom + ' ' + nom)}|${normalize(entreprise)}`;
          const isDuplicate = existingKeys.has(key);
          const inDomain    = matchesDomain(domaine, contactRole, industry);

          return { prenom, nom, contactRole, entreprise, industry, email, linkedinUrl, ville, inDomain, isDuplicate };
        }).filter((r) => r.entreprise !== '' || r.prenom !== '');

        if (rows.length === 0) {
          toast.error('Aucun contact valide trouvé dans ce fichier');
          return;
        }

        setPreview(rows);
        setStep('preview');
        toast.success(`${rows.length} lignes lues`);
      },
      error: (err: Error) => toast.error(`Erreur de lecture : ${err.message}`),
    });
  }, [contacts, domaine]);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  // Tous les non-doublons sont importés (filtre domaine appliqué dans ContactsScreen)
  const toImport    = preview.filter((r) => !r.isDuplicate);
  const outOfDomain = preview.filter((r) => !r.inDomain && !r.isDuplicate);
  const duplicates  = preview.filter((r) => r.isDuplicate);

  const handleImport = () => {
    toImport.forEach((r) => {
      addContact({
        prenom:          r.prenom,
        nom:             r.nom,
        contactRole:     r.contactRole,
        entreprise:      r.entreprise,
        industry:        r.industry,
        email:           r.email,
        linkedinUrl:     r.linkedinUrl,
        ville:           r.ville,
        addedToPipeline: false,
      });
    });
    setImportCount(toImport.length);
    setStep('done');
    toast.success(`${toImport.length} contact${toImport.length > 1 ? 's' : ''} importé${toImport.length > 1 ? 's' : ''} !`);
  };

  const reset = () => { setStep('upload'); setPreview([]); setFileName(''); setImportCount(0); };

  return (
    <div className="w-full h-full flex font-['Plus_Jakarta_Sans'] bg-slate-50 dark:bg-slate-900 overflow-hidden relative transition-colors duration-300">
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{ backgroundImage: `radial-gradient(circle at 1px 1px, #0F172A 1px, transparent 0)`, backgroundSize: '24px 24px' }} />

      <Sidebar />

      <main className="flex-1 flex flex-col p-8 z-10 overflow-y-auto">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>

          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="font-['Fraunces'] text-[28px] font-semibold text-slate-900 dark:text-white leading-tight">
                Import CSV Apollo
              </h1>
              <p className="text-[14px] text-slate-500 dark:text-slate-400 mt-0.5">
                Tous les contacts sont importés · le filtre par domaine s'applique dans "Marché caché"
              </p>
            </div>
            <button onClick={downloadTemplate}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[13px] font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm">
              <Icons.Download className="w-4 h-4" />
              Modèle CSV
            </button>
          </div>

          {/* Domaine actif (info) */}
          {domaine ? (
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 mb-6 text-[13px] text-indigo-700 dark:text-indigo-300 w-fit">
              <Icons.Info className="w-4 h-4 flex-shrink-0" />
              Domaine actif : <strong className="capitalize">{domaine}</strong> — les contacts hors domaine sont importés mais masqués dans "Marché caché"
              <button onClick={() => navigateTo('profile')} className="ml-2 text-[11px] underline text-indigo-500 hover:text-indigo-700 dark:hover:text-indigo-200">
                Modifier
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 mb-6 text-[13px] text-amber-700 dark:text-amber-300 w-fit">
              <Icons.AlertCircle className="w-4 h-4 flex-shrink-0" />
              Aucun domaine défini — tous les contacts importés s'afficheront dans "Marché caché".{' '}
              <button onClick={() => navigateTo('profile')} className="underline ml-1 hover:text-amber-900 dark:hover:text-amber-100">
                Définir mon domaine
              </button>
            </div>
          )}

          <AnimatePresence mode="wait">

            {/* ── Step 1: Upload ── */}
            {step === 'upload' && (
              <motion.div key="upload" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                <div
                  className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all ${
                    isDragging
                      ? 'border-indigo-400 bg-indigo-50 dark:bg-indigo-900/20'
                      : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500 hover:bg-indigo-50/30 dark:hover:bg-indigo-900/10'
                  }`}
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={onDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center mx-auto mb-4">
                    <Icons.Upload className="w-8 h-8 text-indigo-500" />
                  </div>
                  <p className="text-[16px] font-semibold text-slate-800 dark:text-slate-200 mb-2">
                    Glisse ton export Apollo ici
                  </p>
                  <p className="text-[13px] text-slate-500 dark:text-slate-400">
                    ou clique pour sélectionner — Format CSV, encodage UTF-8
                  </p>
                  <input ref={fileInputRef} type="file" accept=".csv,text/csv" className="hidden"
                    onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
                </div>

                <div className="mt-6 p-4 rounded-xl bg-sky-50 dark:bg-sky-900/20 border border-sky-200 dark:border-sky-800 flex gap-3">
                  <Icons.Info className="w-5 h-5 text-sky-600 dark:text-sky-400 flex-shrink-0 mt-0.5" />
                  <div className="text-[13px] text-sky-800 dark:text-sky-300">
                    <p className="font-semibold mb-1">Colonnes Apollo reconnues automatiquement</p>
                    <p className="font-mono text-[12px] bg-sky-100 dark:bg-sky-900/30 px-2 py-1 rounded mt-1">
                      First Name · Last Name · Title · Company · Email · Person Linkedin Url · City · Industry
                    </p>
                    <p className="mt-2">
                      Tous les contacts valides (non doublons) sont importés. Le filtre domaine s'applique dans{' '}
                      <button onClick={() => navigateTo('contacts')} className="underline font-semibold">Marché caché</button>.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── Step 2: Preview ── */}
            {step === 'preview' && (
              <motion.div key="preview" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>

                {/* Stats bar */}
                <div className="grid grid-cols-3 gap-3 mb-5">
                  {[
                    {
                      label: 'À importer',
                      count: toImport.length,
                      color: 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400',
                      icon: Icons.CheckCircle2,
                    },
                    {
                      label: `Hors domaine${domaine ? ` (${domaine})` : ''}`,
                      count: outOfDomain.length,
                      color: 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400',
                      icon: Icons.EyeOff,
                    },
                    {
                      label: 'Doublons ignorés',
                      count: duplicates.length,
                      color: 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400',
                      icon: Icons.Copy,
                    },
                  ].map(({ label, count, color, icon: I }) => (
                    <div key={label} className={`flex items-center gap-3 p-3.5 rounded-xl border ${color}`}>
                      <I className="w-5 h-5 flex-shrink-0" />
                      <div>
                        <p className="text-[20px] font-bold font-['Fraunces'] leading-none">{count}</p>
                        <p className="text-[11px] font-medium mt-0.5 leading-tight">{label}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                  <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                    <div>
                      <p className="text-[14px] font-semibold text-slate-900 dark:text-white">{fileName}</p>
                      <p className="text-[12px] text-slate-500 dark:text-slate-400 mt-0.5">
                        {preview.length} ligne{preview.length > 1 ? 's' : ''} lues · {toImport.length} à importer
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={reset}
                        className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 text-[12px] font-medium hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
                        ← Changer le fichier
                      </button>
                      <motion.button
                        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                        onClick={handleImport}
                        disabled={toImport.length === 0}
                        className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-[12px] font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                      >
                        Importer {toImport.length} contact{toImport.length > 1 ? 's' : ''} →
                      </motion.button>
                    </div>
                  </div>

                  <div className="overflow-auto max-h-[460px]">
                    <table className="w-full text-[12px] border-collapse">
                      <thead className="sticky top-0 bg-white dark:bg-slate-800 z-10">
                        <tr className="border-b border-slate-200 dark:border-slate-700">
                          {['Statut', 'Nom', 'Rôle', 'Entreprise', 'Secteur', 'Ville'].map((h) => (
                            <th key={h} className="px-4 py-2.5 text-left text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide whitespace-nowrap">
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {preview.map((row, i) => {
                          const isDup = row.isDuplicate;
                          const isOut = !row.inDomain && !isDup;
                          const isOk  = !isDup && row.inDomain;

                          return (
                            <tr key={i} className={`border-b border-slate-100 dark:border-slate-800 transition-colors ${
                              isDup ? 'opacity-40' : 'hover:bg-slate-50 dark:hover:bg-slate-700/30'
                            }`}>
                              <td className="px-4 py-2.5">
                                {isOk  && <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-[10px] font-semibold">✓ En domaine</span>}
                                {isOut && <span className="px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 text-[10px] font-semibold">◑ Hors domaine</span>}
                                {isDup && <span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-[10px] font-semibold">Doublon</span>}
                              </td>
                              <td className="px-4 py-2.5 font-medium text-slate-900 dark:text-white whitespace-nowrap">
                                {row.prenom} {row.nom}
                              </td>
                              <td className="px-4 py-2.5 text-slate-500 dark:text-slate-400 max-w-[160px] truncate">{row.contactRole || '—'}</td>
                              <td className="px-4 py-2.5 text-slate-700 dark:text-slate-300 whitespace-nowrap">{row.entreprise}</td>
                              <td className="px-4 py-2.5 text-slate-400 dark:text-slate-500 max-w-[120px] truncate">{row.industry || '—'}</td>
                              <td className="px-4 py-2.5 text-slate-400 dark:text-slate-500">{row.ville || '—'}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {outOfDomain.length > 0 && (
                  <div className="mt-4 p-3.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-start gap-3">
                    <Icons.Info className="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5" />
                    <p className="text-[12px] text-slate-600 dark:text-slate-400">
                      <strong>{outOfDomain.length} contact{outOfDomain.length > 1 ? 's' : ''} hors domaine</strong> seront importés mais n'apparaîtront pas dans
                      "Marché caché" tant que ton domaine est <em>{domaine || 'non défini'}</em>.
                      Ils seront visibles si tu changes de domaine.
                    </p>
                  </div>
                )}
              </motion.div>
            )}

            {/* ── Step 3: Done ── */}
            {step === 'done' && (
              <motion.div key="done" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-16 gap-4">
                <motion.div
                  initial={{ scale: 0 }} animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                  className="w-20 h-20 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center"
                >
                  <Icons.CheckCircle2 className="w-10 h-10 text-emerald-500" />
                </motion.div>
                <h2 className="font-['Fraunces'] text-[26px] font-semibold text-slate-900 dark:text-white">Import réussi !</h2>
                <p className="text-[15px] text-slate-600 dark:text-slate-400">
                  {importCount} contact{importCount > 1 ? 's' : ''} sauvegardé{importCount > 1 ? 's' : ''}
                </p>
                <div className="flex gap-3 mt-4">
                  <button onClick={reset}
                    className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 text-[13px] font-medium hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
                    Nouvel import
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    onClick={() => navigateTo('contacts')}
                    className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-[13px] font-medium hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 dark:shadow-none"
                  >
                    Voir le Marché caché →
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </main>

      <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-indigo-500 opacity-[0.03] rounded-full blur-3xl translate-y-1/4 translate-x-1/4 pointer-events-none" />
    </div>
  );
}
