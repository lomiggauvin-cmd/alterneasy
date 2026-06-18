import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Icons from 'lucide-react';
import toast from 'react-hot-toast';
import { useStore } from '../stores/store';
import { Candidature, StudentProfile } from '../types';

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
        {currentUser?.subscriptionTier === 'free' && (
          <motion.button whileHover={{ scale: 1.05, rotate: 180 }} whileTap={{ scale: 0.95 }} onClick={() => openModal('upgrade')}
            className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg cursor-pointer">
            <Icons.Crown className="w-5 h-5 text-white" />
          </motion.button>
        )}
      </div>
    </aside>
  );
};

// ─── Template logic ───────────────────────────────────────────────────────────

type CanalType = 'email' | 'linkedin';

interface MessageVars {
  prenomEtudiant: string;
  ecole:          string;
  domaine:        string;
  periode:        string;
  posteVise:      string;
  prenomContact:  string;
  entreprise:     string;
  secteur:        string;
  phrasePerso:    string;
}

const DOMAINE_LABELS: Record<string, string> = {
  audiovisuel: 'audiovisuel',
  commerce:    'commerce',
  marketing:   'marketing',
  ingénierie:  'ingénierie',
  autre:       '',
};

function buildVars(cand: Candidature, profile: StudentProfile, phrasePerso: string): MessageVars {
  // Extract activité from notes ("Activité : ...")
  const secteurMatch = cand.notes.match(/Activité\s*:\s*([^\n]+)/);
  const secteur = secteurMatch ? secteurMatch[1].trim() : '';

  return {
    prenomEtudiant: profile.prenom || 'l\'étudiant(e)',
    ecole:          profile.ecole,
    domaine:        DOMAINE_LABELS[profile.domaine] ?? '',
    periode:        profile.periodeDebut,
    posteVise:      cand.posteVise || profile.typePoste,
    prenomContact:  cand.contactNom.trim().split(/\s+/)[0] ?? '',
    entreprise:     cand.entreprise,
    secteur,
    phrasePerso,
  };
}

function buildEmail(v: MessageVars): string {
  const greeting = v.prenomContact ? `Bonjour ${v.prenomContact},` : 'Bonjour,';

  let intro = `Je suis ${v.prenomEtudiant}`;
  if (v.domaine) intro += `, étudiant(e) en ${v.domaine}`;
  if (v.ecole)   intro += ` à ${v.ecole}`;
  intro += '.';

  let objectif = 'Je recherche une alternance';
  if (v.periode)   objectif += ` à partir de ${v.periode}`;
  if (v.posteVise) objectif += ` en ${v.posteVise}`;
  objectif += '.';

  const contexte = v.secteur
    ? `Je me permets de vous contacter car ${v.entreprise} évolue dans le domaine de la ${v.secteur}, qui correspond exactement à ce que je recherche.`
    : `Je me permets de vous contacter car votre entreprise correspond exactement à ce que je recherche.`;

  const cta = "Seriez-vous ouvert(e) à échanger sur une éventuelle opportunité d'alternance ? Je serais ravi(e) de vous présenter mon parcours.";

  const parts: string[] = [greeting, '\n\n', intro, ' ', objectif, '\n\n', contexte];
  if (v.phrasePerso.trim()) parts.push('\n\n', v.phrasePerso.trim());
  parts.push('\n\n', cta, '\n\n', `Bien cordialement,\n${v.prenomEtudiant}`);

  return parts.join('');
}

function buildLinkedIn(v: MessageVars): string {
  const greeting = v.prenomContact ? `Bonjour ${v.prenomContact},` : 'Bonjour,';

  let intro = `je suis ${v.prenomEtudiant}`;
  if (v.domaine) intro += `, étudiant(e) en ${v.domaine}`;
  if (v.ecole)   intro += ` à ${v.ecole}`;

  let recherche = ', à la recherche d\'une alternance';
  if (v.posteVise) recherche += ` en ${v.posteVise}`;
  if (v.periode)   recherche += ` dès ${v.periode}`;
  recherche += '.';

  return `${greeting} ${intro}${recherche} ${v.entreprise} m'intéresse beaucoup — seriez-vous ouvert(e) à un échange ? Merci !`;
}

// ─── MessageGeneratorScreen ───────────────────────────────────────────────────

export default function MessageGeneratorScreen() {
  const {
    candidatures,
    studentProfile,
    navigateTo,
    messageGeneratorCandidatureId,
    preselectCandidature,
  } = useStore();

  const allCandidatures = Object.values(candidatures);

  const [selectedId,  setSelectedId]  = useState<string>(messageGeneratorCandidatureId ?? '');
  const [canalType,   setCanalType]   = useState<CanalType>('linkedin');
  const [phrasePerso, setPhrasePerso] = useState('');
  const [editedMsg,   setEditedMsg]   = useState('');
  const [copied,      setCopied]      = useState(false);

  // Consommer la pré-sélection issue du pipeline
  useEffect(() => {
    if (messageGeneratorCandidatureId) preselectCandidature(null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selected: Candidature | null = selectedId ? (candidatures[selectedId] ?? null) : null;

  const profileComplete = !!(studentProfile.prenom && studentProfile.ecole);

  // Calcul du message à chaque changement de source
  const computedMessage = useMemo(() => {
    if (!selected) return '';
    const vars = buildVars(selected, studentProfile, phrasePerso);
    return canalType === 'linkedin' ? buildLinkedIn(vars) : buildEmail(vars);
  }, [selected, studentProfile, phrasePerso, canalType]);

  // Synchronise la textarea avec le message calculé
  useEffect(() => {
    setEditedMsg(computedMessage);
  }, [computedMessage]);

  const charCount = editedMsg.length;
  const linkedInOver = canalType === 'linkedin' && charCount > 300;

  const copyToClipboard = async () => {
    if (!editedMsg) return;
    try {
      await navigator.clipboard.writeText(editedMsg);
      setCopied(true);
      toast.success('Message copié !');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Impossible de copier');
    }
  };

  return (
    <div className="w-full h-full flex font-['Plus_Jakarta_Sans'] bg-slate-50 dark:bg-slate-900 overflow-hidden relative transition-colors duration-300">
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{ backgroundImage: `radial-gradient(circle at 1px 1px, #0F172A 1px, transparent 0)`, backgroundSize: '24px 24px' }} />

      <Sidebar />

      <main className="flex-1 flex gap-6 p-8 z-10 overflow-hidden">

        {/* ── Panneau gauche ── */}
        <div className="w-[340px] flex flex-col gap-4 flex-shrink-0 overflow-y-auto">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <h1 className="font-['Fraunces'] text-[26px] font-semibold text-slate-900 dark:text-white leading-tight mb-1">
              Générer un message
            </h1>
            <p className="text-[13px] text-slate-500 dark:text-slate-400 mb-5">
              Modèle personnalisé · aucune IA, aucun envoi
            </p>

            {/* Statut profil */}
            <div className={`p-3 rounded-xl border mb-4 flex items-center gap-2.5 text-[12px] font-medium ${
              profileComplete
                ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400'
                : 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400'
            }`}>
              {profileComplete
                ? <><Icons.CheckCircle2 className="w-4 h-4 flex-shrink-0" />{studentProfile.prenom} · {studentProfile.ecole}</>
                : <><Icons.AlertCircle className="w-4 h-4 flex-shrink-0" />Profil incomplet —{' '}
                    <button onClick={() => navigateTo('profile')} className="underline hover:no-underline">
                      Compléter mon profil
                    </button>
                  </>
              }
            </div>

            {/* Sélecteur candidature */}
            <div className="mb-4">
              <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1.5">
                Candidature <span className="text-rose-400">*</span>
              </label>
              <select
                value={selectedId}
                onChange={(e) => { setSelectedId(e.target.value); }}
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
                  <button onClick={() => navigateTo('pipeline')} className="text-indigo-500 underline">
                    Aller au pipeline
                  </button>
                </p>
              )}
            </div>

            {/* Toggle Email / LinkedIn */}
            <div className="mb-4">
              <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1.5">
                Format du message
              </label>
              <div className="flex rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden bg-white dark:bg-slate-800">
                <button
                  onClick={() => setCanalType('linkedin')}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[13px] font-medium transition-colors ${
                    canalType === 'linkedin'
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
                  }`}
                >
                  <Icons.Linkedin className="w-3.5 h-3.5" />
                  LinkedIn
                </button>
                <div className="w-px bg-slate-200 dark:bg-slate-700" />
                <button
                  onClick={() => setCanalType('email')}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[13px] font-medium transition-colors ${
                    canalType === 'email'
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
                  }`}
                >
                  <Icons.Mail className="w-3.5 h-3.5" />
                  Email
                </button>
              </div>
              {canalType === 'linkedin' && (
                <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 flex items-center gap-1">
                  <Icons.Info className="w-3 h-3" />
                  Note de connexion — cible ≤ 300 caractères
                </p>
              )}
            </div>

            {/* Phrase perso */}
            <div className="mb-5">
              <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1.5">
                Touche perso
                <span className="ml-1 text-slate-400 font-normal normal-case">(optionnel)</span>
              </label>
              <textarea
                value={phrasePerso}
                onChange={(e) => setPhrasePerso(e.target.value)}
                placeholder="Ex : J'ai adoré votre campagne pour X. Votre approche créative colle exactement à ce que je veux apprendre."
                rows={3}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-[13px] text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/50 resize-none leading-relaxed"
              />
              <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
                {canalType === 'email'
                  ? 'Inséré dans le corps de l\'email (version longue).'
                  : 'Non utilisé dans la note LinkedIn (trop courte).'}
              </p>
            </div>
          </motion.div>
        </div>

        {/* ── Panneau droit ── */}
        <div className="flex-1 flex flex-col min-w-0">
          <AnimatePresence mode="wait">
            {!selected ? (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex-1 flex flex-col items-center justify-center gap-4 text-center">
                <div className="w-20 h-20 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center">
                  <Icons.MessageSquare className="w-10 h-10 text-slate-300 dark:text-slate-600" />
                </div>
                <p className="text-[15px] font-medium text-slate-500 dark:text-slate-400">
                  Sélectionne une candidature
                </p>
                <p className="text-[13px] text-slate-400 dark:text-slate-500 max-w-[280px]">
                  Le message se génère automatiquement à partir de ton profil et des données du contact.
                </p>
              </motion.div>
            ) : (
              <motion.div key={selectedId + canalType} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="flex-1 flex flex-col gap-3 min-h-0">

                {/* En-tête */}
                <div className="flex items-center justify-between flex-shrink-0">
                  <div>
                    <h2 className="font-['Fraunces'] text-[20px] font-semibold text-slate-900 dark:text-white">
                      {selected.entreprise}
                    </h2>
                    <p className="text-[12px] text-slate-500 dark:text-slate-400">
                      {canalType === 'linkedin' ? '💼 Note LinkedIn' : '📧 Email'}{selected.contactNom ? ` · ${selected.contactNom}` : ''}
                    </p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    onClick={copyToClipboard}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-[13px] font-semibold transition-colors shadow-sm ${
                      copied
                        ? 'bg-emerald-500 text-white shadow-emerald-200 dark:shadow-none'
                        : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200 dark:shadow-none'
                    }`}
                  >
                    {copied ? <><Icons.Check className="w-4 h-4" />Copié !</> : <><Icons.Copy className="w-4 h-4" />Copier le message</>}
                  </motion.button>
                </div>

                {/* Textarea éditable */}
                <textarea
                  value={editedMsg}
                  onChange={(e) => setEditedMsg(e.target.value)}
                  className={`flex-1 min-h-0 w-full px-4 py-3.5 rounded-2xl border text-[14px] text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-800 leading-relaxed resize-none focus:outline-none focus:ring-2 transition-all ${
                    linkedInOver
                      ? 'border-rose-400 dark:border-rose-600 focus:ring-rose-400/30'
                      : 'border-slate-200 dark:border-slate-700 focus:ring-indigo-400/30 focus:border-indigo-400'
                  }`}
                />

                {/* Compteur + indicateurs */}
                <div className="flex items-center justify-between flex-shrink-0">
                  {canalType === 'linkedin' ? (
                    <div className="flex items-center gap-3 flex-1">
                      {/* Barre de progression */}
                      <div className="flex-1 h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                        <motion.div
                          animate={{ width: `${Math.min(100, (charCount / 300) * 100)}%` }}
                          transition={{ duration: 0.2 }}
                          className={`h-full rounded-full ${
                            charCount > 300 ? 'bg-rose-500' : charCount > 250 ? 'bg-amber-500' : 'bg-emerald-500'
                          }`}
                        />
                      </div>
                      <span className={`text-[12px] font-semibold tabular-nums flex-shrink-0 ${
                        linkedInOver ? 'text-rose-500' : charCount > 250 ? 'text-amber-600 dark:text-amber-400' : 'text-slate-500 dark:text-slate-400'
                      }`}>
                        {charCount} / 300
                      </span>
                      {linkedInOver && (
                        <span className="text-[11px] text-rose-500 dark:text-rose-400 flex items-center gap-1">
                          <Icons.AlertCircle className="w-3.5 h-3.5" />
                          Trop long pour une note LinkedIn
                        </span>
                      )}
                    </div>
                  ) : (
                    <span className="text-[12px] text-slate-400 dark:text-slate-500">
                      {charCount} caractères
                    </span>
                  )}
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 ml-4 flex-shrink-0">
                    Modifiable avant de copier-coller
                  </p>
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
