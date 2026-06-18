import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import toast from 'react-hot-toast';
import { useStore } from '../stores/store';
import { DOMAINES, DomaineType } from '../types';

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
          className="w-10 h-10 rounded-full bg-indigo-600 ring-2 ring-indigo-400 ring-offset-2 dark:ring-offset-slate-800 flex items-center justify-center shadow-md">
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

// ─── Domain labels ────────────────────────────────────────────────────────────

const DOMAINE_LABELS: Record<string, string> = {
  audiovisuel: '🎬 Audiovisuel',
  commerce:    '🛍️ Commerce',
  marketing:   '📣 Marketing',
  ingénierie:  '⚙️ Ingénierie',
  autre:       '✨ Autre',
};

// ─── ProfileScreen ────────────────────────────────────────────────────────────

export default function ProfileScreen() {
  const { studentProfile, setStudentProfile, navigateTo, currentUser } = useStore();

  const [form, setForm] = useState({
    prenom:       studentProfile.prenom,
    nom:          studentProfile.nom,
    ecole:        studentProfile.ecole,
    domaine:      studentProfile.domaine as DomaineType | '',
    ville:        studentProfile.ville,
    typePoste:    studentProfile.typePoste,
    periodeDebut: studentProfile.periodeDebut,
    dureeRythme:  studentProfile.dureeRythme,
    cherche:      studentProfile.cherche,
  });

  const [saved, setSaved] = useState(false);

  const setField = <K extends keyof typeof form>(k: K, v: typeof form[K]) =>
    setForm((prev) => ({ ...prev, [k]: v }));

  const handleSave = () => {
    if (!form.prenom.trim()) { toast.error('Le prénom est obligatoire'); return; }
    if (!form.nom.trim())    { toast.error('Le nom est obligatoire'); return; }
    setStudentProfile(form);
    setSaved(true);
    toast.success('Profil sauvegardé !');
    setTimeout(() => setSaved(false), 2000);
  };

  const inputCls = 'w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-[14px] text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/50 focus:border-indigo-400 transition-all';

  const Field: React.FC<{ label: string; required?: boolean; hint?: string; children: React.ReactNode }> = ({ label, required, hint, children }) => (
    <div>
      <label className="block text-[12px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1.5">
        {label}{required && <span className="text-rose-400 ml-0.5">*</span>}
      </label>
      {children}
      {hint && <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">{hint}</p>}
    </div>
  );

  const initials = `${form.prenom.charAt(0) || currentUser?.firstName?.charAt(0) || '?'}${form.nom.charAt(0) || currentUser?.lastName?.charAt(0) || ''}`.toUpperCase();
  const fullName = [form.prenom, form.nom].filter(Boolean).join(' ') || 'Ton nom';

  return (
    <div className="w-full h-full flex font-['Plus_Jakarta_Sans'] bg-slate-50 dark:bg-slate-900 overflow-hidden relative transition-colors duration-300">
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{ backgroundImage: `radial-gradient(circle at 1px 1px, #0F172A 1px, transparent 0)`, backgroundSize: '24px 24px' }} />

      <Sidebar />

      <main className="flex-1 flex flex-col p-8 z-10 overflow-y-auto">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
          className="max-w-[640px] mx-auto w-full">

          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <button onClick={() => navigateTo('dashboard')}
              className="w-8 h-8 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm">
              <Icons.ArrowLeft className="w-4 h-4 text-slate-600 dark:text-slate-400" />
            </button>
            <div>
              <h1 className="font-['Fraunces'] text-[26px] font-semibold text-slate-900 dark:text-white leading-tight">
                Mon profil
              </h1>
              <p className="text-[13px] text-slate-500 dark:text-slate-400">Rempli une seule fois · alimente l'import et la génération de messages</p>
            </div>
          </div>

          {/* Avatar card */}
          <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl p-6 mb-6 flex items-center gap-5 shadow-xl shadow-indigo-200/30 dark:shadow-none">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center flex-shrink-0 text-[22px] font-bold text-white">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[18px] font-semibold text-white leading-snug truncate">{fullName}</p>
              <p className="text-[13px] text-indigo-200 truncate">
                {form.ecole || 'École'}
                {form.domaine ? ` · ${DOMAINE_LABELS[form.domaine] ?? form.domaine}` : ''}
              </p>
              {form.periodeDebut && (
                <p className="text-[12px] text-indigo-200/80 mt-0.5 flex items-center gap-1">
                  <Icons.Calendar className="w-3 h-3" /> Dispo : {form.periodeDebut}
                  {form.dureeRythme ? ` · ${form.dureeRythme}` : ''}
                </p>
              )}
            </div>
            {form.domaine && (
              <div className="text-[24px] flex-shrink-0">{DOMAINE_LABELS[form.domaine]?.split(' ')[0]}</div>
            )}
          </div>

          {/* Section : Identité */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 mb-4">
            <h2 className="text-[13px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-4 flex items-center gap-2">
              <Icons.User className="w-4 h-4" /> Identité
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Prénom" required>
                <input type="text" value={form.prenom} onChange={(e) => setField('prenom', e.target.value)}
                  placeholder="Lomig" className={inputCls} />
              </Field>
              <Field label="Nom" required>
                <input type="text" value={form.nom} onChange={(e) => setField('nom', e.target.value)}
                  placeholder="Gauvin" className={inputCls} />
              </Field>
              <div className="col-span-2">
                <Field label="École / Formation">
                  <input type="text" value={form.ecole} onChange={(e) => setField('ecole', e.target.value)}
                    placeholder="ESME Sudria, Lille" className={inputCls} />
                </Field>
              </div>
            </div>
          </div>

          {/* Section : Recherche */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 mb-4">
            <h2 className="text-[13px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-4 flex items-center gap-2">
              <Icons.Target className="w-4 h-4" /> Recherche
            </h2>
            <div className="space-y-4">

              {/* Domaine — source de vérité pour le filtre import */}
              <Field label="Domaine recherché" hint="Ce champ pilote le filtre d'import de contacts Apollo.">
                <div className="grid grid-cols-3 gap-2 mt-1">
                  {DOMAINES.map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setField('domaine', form.domaine === d ? '' : d)}
                      className={`px-3 py-2 rounded-xl text-[12px] font-medium border transition-all text-left ${
                        form.domaine === d
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                          : 'bg-slate-50 dark:bg-slate-900/50 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-500'
                      }`}
                    >
                      {DOMAINE_LABELS[d]}
                    </button>
                  ))}
                </div>
              </Field>

              <Field label="Ville de recherche" hint="Pré-remplit la recherche dans le Marché caché.">
                <input type="text" value={form.ville} onChange={(e) => setField('ville', e.target.value)}
                  placeholder="Paris, Lyon, Bordeaux…" className={inputCls} />
              </Field>

              <Field label="Type de poste visé" hint="Ex : production / réalisation, développement front-end…">
                <input type="text" value={form.typePoste} onChange={(e) => setField('typePoste', e.target.value)}
                  placeholder="production / réalisation" className={inputCls} />
              </Field>
            </div>
          </div>

          {/* Section : Alternance */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 mb-4">
            <h2 className="text-[13px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-4 flex items-center gap-2">
              <Icons.Calendar className="w-4 h-4" /> Alternance
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Date de début" hint="Ex : Septembre 2025">
                <input type="text" value={form.periodeDebut} onChange={(e) => setField('periodeDebut', e.target.value)}
                  placeholder="Septembre 2025" className={inputCls} />
              </Field>
              <Field label="Durée / Rythme" hint="Ex : 2 ans · 2 sem. école / 2 sem. entreprise">
                <input type="text" value={form.dureeRythme} onChange={(e) => setField('dureeRythme', e.target.value)}
                  placeholder="2 ans · 2 sem. école / 2 sem. entreprise" className={inputCls} />
              </Field>
            </div>
          </div>

          {/* Section : Pitch */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 mb-4">
            <h2 className="text-[13px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-4 flex items-center gap-2">
              <Icons.MessageSquare className="w-4 h-4" /> Ce que tu recherches
            </h2>
            <Field label="Texte libre" hint="Sera injecté dans le bloc fixe de chaque message IA généré.">
              <textarea
                value={form.cherche}
                onChange={(e) => setField('cherche', e.target.value)}
                placeholder="Ex : Je cherche une alternance en production/réalisation audiovisuelle pour développer mes compétences en tournage et montage vidéo, dans une structure créative ou agence de communication."
                rows={4}
                className={`${inputCls} resize-none leading-relaxed`}
              />
            </Field>
          </div>

          {/* Preview bloc fixe */}
          {form.cherche && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-4 rounded-xl bg-violet-50 dark:bg-violet-900/20 border border-violet-200 dark:border-violet-800">
              <p className="text-[11px] font-semibold text-violet-600 dark:text-violet-400 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                <Icons.Sparkles className="w-3.5 h-3.5" />
                Aperçu — bloc fixe IA
              </p>
              <p className="text-[13px] text-violet-900 dark:text-violet-200 leading-relaxed">
                Bonjour, je suis <strong>{fullName !== 'Ton nom' ? fullName : '[Prénom Nom]'}</strong>
                {form.ecole ? `, étudiant à ${form.ecole}` : ''}
                {form.typePoste ? ` en ${form.typePoste}` : ''}.{' '}
                {form.cherche}
                {form.periodeDebut ? ` Ma disponibilité : ${form.periodeDebut}${form.dureeRythme ? `, ${form.dureeRythme}` : ''}.` : ''}
              </p>
            </motion.div>
          )}

          {/* Save */}
          <motion.button
            whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
            onClick={handleSave}
            className={`w-full py-3 rounded-xl text-[14px] font-semibold transition-all shadow-lg ${
              saved
                ? 'bg-emerald-500 text-white shadow-emerald-200 dark:shadow-none'
                : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200 dark:shadow-none'
            }`}
          >
            {saved ? '✓ Profil sauvegardé !' : 'Enregistrer le profil'}
          </motion.button>
        </motion.div>
      </main>

      <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-indigo-500 opacity-[0.03] rounded-full blur-3xl translate-y-1/4 translate-x-1/4 pointer-events-none" />
    </div>
  );
}
