import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Icons from 'lucide-react';
import toast from 'react-hot-toast';
import { useStore } from '../stores/store';
import { Candidature } from '../types';

// ─── Sidebar ──────────────────────────────────────────────────────────────────

const Sidebar: React.FC = () => {
  const { currentScreen, navigateTo, isDarkMode, toggleDarkMode, currentUser, openModal } = useStore();
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
                ? 'bg-indigo-600 shadow-md' : 'bg-slate-100 dark:bg-slate-700/50 hover:bg-slate-200 dark:hover:bg-slate-700'
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

interface GeneratedMessage {
  blocFixe:     string;
  blocDynamique: string;
}

// ─── MessageGeneratorScreen ───────────────────────────────────────────────────

export default function MessageGeneratorScreen() {
  const { candidatures, studentProfile, navigateTo } = useStore();

  const allCandidatures = Object.values(candidatures);

  const [selectedId,  setSelectedId]  = useState<string>('');
  const [extraInfos,  setExtraInfos]  = useState('');
  const [isLoading,   setIsLoading]   = useState(false);
  const [generated,   setGenerated]   = useState<GeneratedMessage | null>(null);
  const [copiedBloc,  setCopiedBloc]  = useState<'fixe' | 'dynamique' | 'full' | null>(null);

  const selected: Candidature | null = selectedId ? candidatures[selectedId] ?? null : null;

  const profileComplete = !!(studentProfile.nom && studentProfile.ecole && studentProfile.cherche);

  const handleGenerate = async () => {
    if (!selected) { toast.error('Sélectionne une candidature'); return; }
    if (!profileComplete) { toast.error('Complète ton profil d\'abord (nom, école, ce que tu cherches)'); return; }

    setIsLoading(true);
    setGenerated(null);

    try {
      const response = await fetch('/api/generate-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentProfile,
          candidature: {
            entreprise:  selected.entreprise,
            contactNom:  selected.contactNom,
            contactRole: selected.contactRole,
            posteVise:   selected.posteVise,
            canal:       selected.canal,
          },
          extraInfos,
        }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error || `Erreur serveur (${response.status})`);
      }

      const data = await response.json();
      setGenerated({ blocFixe: data.blocFixe, blocDynamique: data.blocDynamique });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erreur inconnue';
      // If server is not running, show a helpful mock for demo
      if (msg.includes('fetch') || msg.includes('Failed') || msg.includes('NetworkError') || msg.includes('503')) {
        setGenerated(getMockMessage(selected, `${studentProfile.prenom} ${studentProfile.nom}`.trim(), studentProfile.ecole, studentProfile.domaine, studentProfile.cherche, extraInfos));
        toast('Serveur non disponible — message de démonstration généré', { icon: '⚠️' });
      } else {
        toast.error(msg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (text: string, bloc: 'fixe' | 'dynamique' | 'full') => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedBloc(bloc);
      toast.success('Copié !');
      setTimeout(() => setCopiedBloc(null), 2000);
    } catch {
      toast.error('Impossible de copier');
    }
  };

  const fullMessage = generated ? `${generated.blocFixe}\n\n${generated.blocDynamique}` : '';

  return (
    <div className="w-full h-full flex font-['Plus_Jakarta_Sans'] bg-slate-50 dark:bg-slate-900 overflow-hidden relative transition-colors duration-300">
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{ backgroundImage: `radial-gradient(circle at 1px 1px, #0F172A 1px, transparent 0)`, backgroundSize: '24px 24px' }} />

      <Sidebar />

      <main className="flex-1 flex gap-6 p-8 z-10 overflow-hidden">

        {/* ── Left panel: form ── */}
        <div className="w-[380px] flex flex-col gap-4 flex-shrink-0 overflow-y-auto">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <h1 className="font-['Fraunces'] text-[26px] font-semibold text-slate-900 dark:text-white leading-tight mb-1">
              Générer un message
            </h1>
            <p className="text-[13px] text-slate-500 dark:text-slate-400 mb-6">
              IA personnalisée pour chaque contact LinkedIn
            </p>

            {/* Profile status */}
            <div className={`p-3 rounded-xl border mb-4 flex items-center gap-2.5 text-[12px] font-medium ${
              profileComplete
                ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400'
                : 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400'
            }`}>
              {profileComplete
                ? <><Icons.CheckCircle2 className="w-4 h-4 flex-shrink-0" /> Profil complet — {studentProfile.nom} · {studentProfile.ecole}</>
                : <><Icons.AlertCircle className="w-4 h-4 flex-shrink-0" /> Profil incomplet —{' '}
                    <button onClick={() => navigateTo('profile')} className="underline hover:no-underline">
                      Compléter mon profil
                    </button>
                  </>
              }
            </div>

            {/* Select candidature */}
            <div className="mb-4">
              <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1.5">
                Candidature cible <span className="text-rose-400">*</span>
              </label>
              <select
                value={selectedId}
                onChange={(e) => { setSelectedId(e.target.value); setGenerated(null); }}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-[13px] text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-400/50 cursor-pointer"
              >
                <option value="">— Choisir une candidature —</option>
                {allCandidatures.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.entreprise}{c.contactNom ? ` · ${c.contactNom}` : ''}{c.posteVise ? ` (${c.posteVise})` : ''}
                  </option>
                ))}
              </select>
              {allCandidatures.length === 0 && (
                <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
                  Aucune candidature.{' '}
                  <button onClick={() => navigateTo('import')} className="text-indigo-500 underline">Importer des contacts</button>
                </p>
              )}
            </div>

            {/* Selected candidature preview */}
            {selected && (
              <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                className="p-3.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center flex-shrink-0">
                    <span className="text-[14px] font-bold text-indigo-600 dark:text-indigo-400">
                      {selected.entreprise.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold text-slate-900 dark:text-white truncate">{selected.entreprise}</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                      {selected.contactNom || 'Contact inconnu'}{selected.contactRole ? ` · ${selected.contactRole}` : ''}
                    </p>
                  </div>
                  <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400">
                    {selected.canal}
                  </span>
                </div>
                {selected.posteVise && (
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 ml-[46px]">
                    Poste : {selected.posteVise}
                  </p>
                )}
              </motion.div>
            )}

            {/* Extra infos */}
            <div className="mb-5">
              <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1.5">
                Infos supplémentaires sur l'entreprise
                <span className="ml-1 text-slate-400 font-normal normal-case">(optionnel)</span>
              </label>
              <textarea
                value={extraInfos}
                onChange={(e) => setExtraInfos(e.target.value)}
                placeholder="Ex : J'ai vu leur campagne pour Leroy Merlin qui m'a beaucoup plu. Ils ont lancé une nouvelle division créative en 2024. Leur compte Instagram est très bien fait."
                rows={4}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-[13px] text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/50 resize-none leading-relaxed"
              />
              <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
                2-3 lignes max. L'IA les utilise pour personnaliser le message.
              </p>
            </div>

            {/* Generate button */}
            <motion.button
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              onClick={handleGenerate}
              disabled={isLoading || !selected}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-[14px] font-semibold hover:from-indigo-700 hover:to-violet-700 transition-all shadow-lg shadow-indigo-200/50 dark:shadow-none disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <><Icons.Loader2 className="w-4 h-4 animate-spin" /> Génération en cours…</>
              ) : (
                <><Icons.Sparkles className="w-4 h-4" /> Générer le message</>
              )}
            </motion.button>

            {/* Info note */}
            <p className="text-[11px] text-slate-400 dark:text-slate-500 text-center mt-3 flex items-center justify-center gap-1">
              <Icons.Lock className="w-3 h-3" />
              La clé API ne quitte jamais le serveur. Tu copies-colles le résultat.
            </p>
          </motion.div>
        </div>

        {/* ── Right panel: result ── */}
        <div className="flex-1 flex flex-col min-w-0">
          <AnimatePresence mode="wait">
            {!generated && !isLoading && (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex-1 flex flex-col items-center justify-center gap-4 text-center">
                <div className="w-20 h-20 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center">
                  <Icons.MessageSquare className="w-10 h-10 text-slate-300 dark:text-slate-600" />
                </div>
                <p className="text-[15px] font-medium text-slate-500 dark:text-slate-400">
                  Le message apparaîtra ici
                </p>
                <p className="text-[13px] text-slate-400 dark:text-slate-500 max-w-[280px]">
                  Sélectionne une candidature et clique sur "Générer" pour obtenir un message LinkedIn personnalisé en 2 blocs.
                </p>
              </motion.div>
            )}

            {isLoading && (
              <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex-1 flex flex-col items-center justify-center gap-4">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-200"
                >
                  <Icons.Sparkles className="w-7 h-7 text-white" />
                </motion.div>
                <p className="text-[15px] font-semibold text-slate-800 dark:text-slate-200">
                  L'IA rédige votre message…
                </p>
                <p className="text-[13px] text-slate-500 dark:text-slate-400">
                  Personnalisation pour {selected?.entreprise}
                </p>
              </motion.div>
            )}

            {generated && !isLoading && (
              <motion.div key="result" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="flex-1 flex flex-col gap-4 overflow-y-auto">

                {/* Header + copy all */}
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-['Fraunces'] text-[20px] font-semibold text-slate-900 dark:text-white">
                      Message généré
                    </h2>
                    <p className="text-[12px] text-slate-500 dark:text-slate-400">
                      Pour {selected?.entreprise} · {selected?.canal}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                      onClick={() => copyToClipboard(fullMessage, 'full')}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-[12px] font-medium transition-colors ${
                        copiedBloc === 'full'
                          ? 'bg-emerald-500 text-white'
                          : 'bg-indigo-600 text-white hover:bg-indigo-700'
                      }`}
                    >
                      {copiedBloc === 'full' ? <Icons.Check className="w-3.5 h-3.5" /> : <Icons.Copy className="w-3.5 h-3.5" />}
                      {copiedBloc === 'full' ? 'Copié !' : 'Tout copier'}
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                      onClick={handleGenerate}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[12px] font-medium bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                    >
                      <Icons.RefreshCw className="w-3.5 h-3.5" />
                      Régénérer
                    </motion.button>
                  </div>
                </div>

                {/* Bloc fixe */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                    <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide flex items-center gap-1.5">
                      <Icons.User className="w-3.5 h-3.5" />
                      Bloc fixe — Pitch étudiant
                    </span>
                    <button
                      onClick={() => copyToClipboard(generated.blocFixe, 'fixe')}
                      className={`text-[11px] font-medium flex items-center gap-1 px-2.5 py-1 rounded-lg transition-colors ${
                        copiedBloc === 'fixe'
                          ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600'
                      }`}
                    >
                      {copiedBloc === 'fixe' ? <><Icons.Check className="w-3 h-3" /> Copié</> : <><Icons.Copy className="w-3 h-3" /> Copier</>}
                    </button>
                  </div>
                  <div className="p-4">
                    <p className="text-[14px] text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap">
                      {generated.blocFixe}
                    </p>
                  </div>
                </div>

                {/* Bloc dynamique */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-indigo-200 dark:border-indigo-800 shadow-sm overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-2.5 bg-indigo-50 dark:bg-indigo-900/20 border-b border-indigo-200 dark:border-indigo-800">
                    <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide flex items-center gap-1.5">
                      <Icons.Sparkles className="w-3.5 h-3.5" />
                      Bloc dynamique — Personnalisé pour {selected?.entreprise}
                    </span>
                    <button
                      onClick={() => copyToClipboard(generated.blocDynamique, 'dynamique')}
                      className={`text-[11px] font-medium flex items-center gap-1 px-2.5 py-1 rounded-lg transition-colors ${
                        copiedBloc === 'dynamique'
                          ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
                          : 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-500 dark:text-indigo-400 hover:bg-indigo-200 dark:hover:bg-indigo-900/50'
                      }`}
                    >
                      {copiedBloc === 'dynamique' ? <><Icons.Check className="w-3 h-3" /> Copié</> : <><Icons.Copy className="w-3 h-3" /> Copier</>}
                    </button>
                  </div>
                  <div className="p-4">
                    <p className="text-[14px] text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap">
                      {generated.blocDynamique}
                    </p>
                  </div>
                </div>

                {/* Usage note */}
                <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-[12px] text-amber-800 dark:text-amber-300">
                  <Icons.AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
                  <span>
                    <strong>Rappel :</strong> Copie-colle ce message et envoie-le toi-même sur LinkedIn. Aucun envoi automatique — pour éviter tout risque de ban.
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-violet-500 opacity-[0.03] rounded-full blur-3xl translate-y-1/4 translate-x-1/4 pointer-events-none" />
    </div>
  );
}

// ─── Mock fallback (when server is offline) ───────────────────────────────────

function getMockMessage(
  c: Candidature,
  nom: string,
  ecole: string,
  secteur: string,
  cherche: string,
  extra: string,
): GeneratedMessage {
  return {
    blocFixe: `Bonjour${c.contactNom ? ` ${c.contactNom.split(' ')[0]}` : ''},\n\nJe suis ${nom || '[Nom]'}, étudiant${ecole ? ` à ${ecole}` : ''}${secteur ? ` en ${secteur}` : ''}. ${cherche || 'Je recherche une alternance dans votre domaine.'}`,
    blocDynamique: `Votre entreprise${c.entreprise ? ` ${c.entreprise}` : ''} m'attire particulièrement${extra ? ` — ${extra}` : ` pour son positionnement unique dans votre secteur`}.\n\n${c.posteVise ? `Je pense que le poste de ${c.posteVise} correspond parfaitement à mon profil et à mes objectifs de carrière.` : 'Je serais ravi d\'échanger avec vous sur les opportunités disponibles.'}\n\nSerait-il possible d'échanger quelques minutes à votre convenance ?\n\nCordialement,\n${nom || '[Nom]'}`,
  };
}
