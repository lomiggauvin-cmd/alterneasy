import React, { useState, useEffect } from "react";
import * as Icons from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, Transition, Switch, Listbox } from "@headlessui/react";
import { useStore } from "../stores/store";
import toast from "react-hot-toast";

// Subcomponents
const Sidebar: React.FC = () => {
  const { currentScreen, navigateTo, currentUser, toggleDarkMode, isDarkMode, openModal } = useStore();

  const navItems = [
    { id: 'dashboard', icon: Icons.LayoutDashboard, label: 'Dashboard' },
    { id: 'radar', icon: Icons.Radar, label: 'Radar' },
    { id: 'pipeline', icon: Icons.Kanban, label: 'Pipeline' },
    { id: 'coldEmailStudio', icon: Icons.Mail, label: 'Studio' },
    { id: 'profileSettings', icon: Icons.Settings, label: 'Settings' },
  ];

  return (
    <aside className="w-[72px] h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col items-center py-6 z-20 flex-shrink-0 transition-colors">
      <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center mb-8 shadow-lg shadow-indigo-500/25">
        <Icons.Zap className="w-5 h-5 text-white" />
      </div>
      <nav className="flex flex-col gap-2">
        {navItems.map((item) => {
          const isActive = currentScreen === item.id;
          return (
            <button
              key={item.id}
              onClick={() => navigateTo(item.id as any)}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
              title={item.label}
            >
              <item.icon className="w-5 h-5" />
            </button>
          );
        })}
      </nav>
      <div className="mt-auto flex flex-col gap-3 items-center">
        <button
          onClick={toggleDarkMode}
          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
            isDarkMode
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
          title="Toggle dark mode"
        >
          {isDarkMode ? <Icons.Sun className="w-5 h-5" /> : <Icons.Moon className="w-5 h-5" />}
        </button>
        {currentUser?.subscriptionTier === 'free' && (
          <button
            onClick={() => openModal('upgrade')}
            className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-shadow"
            title="Passer Premium"
          >
            <Icons.Crown className="w-5 h-5" />
          </button>
        )}
        <button
          onClick={() => navigateTo('profile')}
          className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md ${
            isDarkMode ? 'bg-gray-700' : 'bg-indigo-400'
          }`}
          title="Mon profil"
        >
          <span className="text-[13px] font-bold text-white">
            {currentUser?.firstName?.[0]}{currentUser?.lastName?.[0]}
          </span>
        </button>
      </div>
    </aside>
  );
};

const TopBar: React.FC = () => {
  const { currentUser } = useStore();

  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="font-['Fraunces'] text-[28px] font-semibold text-gray-900 dark:text-white leading-tight">
          Studio Email
        </h1>
        <p className="text-[14px] text-gray-500 dark:text-gray-400 mt-1">
          Rédige et envoie tes candidatures personnalisées
        </p>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 w-[260px]">
          <Icons.Search className="w-4 h-4 text-gray-400" />
          <span className="text-[13px] text-gray-400">Rechercher...</span>
        </div>
        <button
          onClick={() => toast('Pas de nouvelles notifications.')}
          className="relative w-10 h-10 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <Icons.Bell className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
            3
          </span>
        </button>
      </div>
    </div>
  );
};

const TemplatePanel: React.FC = () => {
  const { emailTemplates, coldEmailStudioState, setSelectedTemplate } = useStore();

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="w-[320px] bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col overflow-hidden"
    >
      <div className="p-5 border-b border-gray-100 dark:border-gray-700">
        <h2 className="font-['Fraunces'] text-[16px] font-semibold text-gray-900 dark:text-white mb-1">
          Templates
        </h2>
        <p className="text-[12px] text-gray-500 dark:text-gray-400">Sélectionne un modèle de départ</p>
      </div>
      <div className="flex-1 p-4 space-y-3 overflow-y-auto">
        <AnimatePresence mode="wait">
          {emailTemplates.map((template) => {
            const isSelected = coldEmailStudioState.selectedTemplateId === template.id;
            return (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                onClick={() => setSelectedTemplate(template.id)}
                className={`p-4 rounded-xl cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-indigo-600 border-indigo-600 shadow-lg shadow-indigo-500/20'
                    : 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:border-indigo-300 dark:hover:border-indigo-500 hover:shadow-md'
                } border`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Icons.FileText className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-gray-500 dark:text-gray-400'}`} />
                  <span className={`text-[13px] font-semibold ${isSelected ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                    {template.name}
                  </span>
                  {isSelected && <Icons.Check className="w-3.5 h-3.5 text-white ml-auto" />}
                </div>
                <p className={`text-[12px] leading-relaxed line-clamp-2 ${
                  isSelected ? 'text-indigo-200' : 'text-gray-500 dark:text-gray-400'
                }`}>
                  {template.body.substring(0, 80)}...
                </p>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

const UpgradeModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { updateUser, currentUser, closeModal, navigateTo } = useStore();

  const handleUpgrade = () => {
    if (currentUser) {
      updateUser(currentUser.id, { subscriptionTier: 'premium' });
    }
    closeModal();
    toast.success('Bienvenue en Premium !');
  };

  return (
    <Transition appear show={isOpen} as={React.Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={React.Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={React.Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-150"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel
                as={motion.div}
                animate={{ scale: 1 }}
                className="w-[480px] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 transform transition-all"
              >
                <div className="text-center mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-amber-100 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-700 flex items-center justify-center mx-auto mb-4">
                    <Icons.Lock className="w-8 h-8 text-amber-500" />
                  </div>
                  <h2 className="font-['Fraunces'] text-[24px] font-semibold text-gray-900 dark:text-white mb-3">
                    Passe à la vitesse supérieure
                  </h2>
                  <p className="text-[14px] text-gray-500 dark:text-gray-400 leading-relaxed">
                    Tu as atteint ta limite d'envois quotidiens. Débloque des envois illimités, le suivi des taux d'ouverture, et des relances automatiques.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 border-2 border-indigo-500 mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Icons.Crown className="w-5 h-5 text-indigo-600" />
                      <span className="text-[16px] font-bold text-indigo-900 dark:text-indigo-300">Premium</span>
                    </div>
                    <span className="text-[24px] font-bold text-indigo-600">
                      9,99€<span className="text-[14px] font-normal text-gray-500">/mois</span>
                    </span>
                  </div>
                  <ul className="space-y-2">
                    {['Emails illimités', 'Suivi des taux d\'ouverture', 'Relances automatiques', 'Filtres avancés Radar'].map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-[13px] text-gray-900 dark:text-gray-200">
                        <Icons.Check className="w-4 h-4 text-green-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={handleUpgrade}
                    className="w-full py-3.5 rounded-xl bg-indigo-600 text-white text-[15px] font-semibold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/25"
                  >
                    Commencer mon essai gratuit
                  </button>
                  <button
                    onClick={onClose}
                    className="w-full py-3 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-[14px] font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    Peut-être plus tard
                  </button>
                </div>

                <p className="text-center text-[12px] text-gray-400 mt-4">
                  Essai gratuit de 14 jours. Annule à tout moment.
                </p>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

const LivePreview: React.FC = () => {
  const { coldEmailStudioState, cvs } = useStore();
  const selectedCV = cvs[coldEmailStudioState.selectedCVId || ''];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="w-[320px] bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-5"
    >
      <div className="flex items-center gap-2 mb-4">
        <Icons.Eye className="w-4 h-4 text-gray-500 dark:text-gray-400" />
        <h3 className="text-[13px] font-semibold text-gray-900 dark:text-white">Aperçu</h3>
      </div>
      <div className="rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center gap-2 mb-3 pb-3 border-b border-gray-200 dark:border-gray-700">
          <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center">
            <span className="text-white text-[8px] font-bold">T</span>
          </div>
          <div className="flex-1">
            <p className="text-[10px] font-medium text-gray-900 dark:text-white">Tandem &lt;hello@tandem.app&gt;</p>
            <p className="text-[10px] text-gray-400">À: recrutement@entreprise.fr</p>
          </div>
        </div>
        <p className="text-[10px] font-semibold text-gray-900 dark:text-white mb-2 line-clamp-1">
          {coldEmailStudioState.subject || 'Objet de l\'email...'}
        </p>
        <div className="text-[9px] text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-6 whitespace-pre-line">
          {coldEmailStudioState.body || 'Contenu de l\'email...'}
        </div>
        {selectedCV && (
          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 flex items-center gap-2">
            <Icons.Paperclip className="w-3 h-3 text-gray-400" />
            <span className="text-[9px] text-gray-400">{selectedCV.fileName}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

const VariableButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <button
    onClick={onClick}
    className="px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-[12px] font-medium flex items-center gap-1.5 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors"
  >
    <Icons.Braces className="w-3.5 h-3.5" />
    Insérer variable
  </button>
);

// Main component
export default function ColdEmailStudioScreen() {
  const {
    currentUser,
    cvs,
    coldEmailStudioState,
    emailTemplates,
    setEmailSubject,
    setEmailBody,
    setSelectedCV,
    toggleFollowUp,
    addEmail,
    updateApplicationStatus,
    incrementDailyEmails,
    resetEmailStudio,
    openModal,
    closeModal,
    navigateTo,
    setSettingsTab,
    checkAndResetDailyEmailLimit,
    applications,
    opportunities,
  } = useStore();

  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showVariableMenu, setShowVariableMenu] = useState(false);
  const [isSending, setIsSending] = useState(false);

  // Reset daily limit on mount only — using getState() avoids including the action
  // in the dependency array, which would cause an infinite loop (action → setState → new ref → effect re-fires)
  const limitChecked = React.useRef(false);
  useEffect(() => {
    if (!limitChecked.current) {
      limitChecked.current = true;
      useStore.getState().checkAndResetDailyEmailLimit();
    }
  }, []);

  const handleSend = async () => {
    if (!currentUser) return;

    // Validate CV is selected
    if (!coldEmailStudioState.selectedCVId) {
      toast.error('Veuillez sélectionner un CV.');
      return;
    }

    // Validate content
    if (!coldEmailStudioState.subject.trim() || !coldEmailStudioState.body.trim()) {
      toast.error('Veuillez remplir l\'objet et le corps de l\'email.');
      return;
    }

    // Check daily limit for free users
    const DAILY_LIMIT_FREE = 5;
    if (currentUser.subscriptionTier === 'free' && currentUser.dailyEmailsSent >= DAILY_LIMIT_FREE) {
      setShowUpgradeModal(true);
      openModal('upgrade');
      return;
    }

    // Check follow-up toggle for free users
    if (currentUser.subscriptionTier === 'free' && coldEmailStudioState.followUpScheduled) {
      setShowUpgradeModal(true);
      openModal('upgrade');
      return;
    }

    setIsSending(true);

    try {
      // For prototype, we'll use the first application if available, or create a placeholder
      // In a real app, this would come from coldEmailStudioState.targetApplicationId
      const applicationId = Object.keys(applications).find(
        appId => applications[appId].userId === currentUser.id && applications[appId].status === 'to_contact'
      );

      if (applicationId) {
        // Add email
        addEmail({
          applicationId,
          userId: currentUser.id,
          cvId: coldEmailStudioState.selectedCVId,
          emailType: 'initial',
          subject: coldEmailStudioState.subject,
          body: coldEmailStudioState.body,
          sentAt: new Date(),
          status: 'sent',
          scheduledFollowUpDate: coldEmailStudioState.followUpScheduled ? new Date(Date.now() + 4 * 24 * 60 * 60 * 1000) : null,
        });

        // Update application status
        updateApplicationStatus(applicationId, 'sent');

        // Increment daily emails
        incrementDailyEmails();

        // Reset studio
        resetEmailStudio();

        toast.success('Email envoyé avec succès !');
        navigateTo('pipeline');
      } else {
        // No pending application - show toast
        toast.success('Email envoyé avec succès ! (Mode démo)');
        resetEmailStudio();
      }
    } catch (error) {
      toast.error('Erreur lors de l\'envoi de l\'email.');
    } finally {
      setIsSending(false);
    }
  };

  const handleUploadCV = () => {
    navigateTo('profileSettings');
    setSettingsTab('cvs');
  };

  const handleInsertVariable = (variable: string) => {
    const variablePlaceholder = `[${variable}]`;
    setEmailBody(coldEmailStudioState.body + variablePlaceholder);
    setShowVariableMenu(false);
  };

  const currentTemplate = emailTemplates.find(t => t.id === coldEmailStudioState.selectedTemplateId);
  const cvsList = Object.values(cvs).filter(cv => cv.userId === currentUser?.id);
  const remainingEmails = currentUser ? Math.max(0, 5 - currentUser.dailyEmailsSent) : 5;

  return (
    <div className="w-full h-screen flex font-['Plus_Jakarta_Sans'] bg-[#FAFAF7] dark:bg-gray-900 overflow-hidden relative transition-colors">
      {/* Subtle background texture */}
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #0F172A 1px, transparent 0)`,
          backgroundSize: '24px 24px',
        }}
      />

      <Sidebar />

      <main className="flex-1 flex flex-col p-8 z-10 overflow-hidden">
        <TopBar />

        <div className="flex gap-4 flex-1 min-h-0">
          <TemplatePanel />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex-1 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col overflow-hidden"
          >
            {/* Editor header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-3">
                {currentTemplate && (
                  <>
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-pink-500 to-orange-400 flex items-center justify-center">
                      <span className="text-white font-bold text-[12px]">
                        {currentTemplate.name[0]}
                      </span>
                    </div>
                    <div>
                      <p className="text-[13px] font-semibold text-gray-900 dark:text-white">
                        {currentTemplate.name}
                      </p>
                      <p className="text-[12px] text-gray-500 dark:text-gray-400">
                        {currentTemplate.type === 'initial' ? 'Email initial' : 'Email de relance'}
                      </p>
                    </div>
                  </>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[12px] text-gray-500 dark:text-gray-400">Emails aujourd'hui :</span>
                <span className="px-2.5 py-1 rounded-full bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-[12px] font-semibold">
                  {currentUser?.dailyEmailsSent || 0} / {currentUser?.subscriptionTier === 'premium' ? '∞' : '5'}
                </span>
              </div>
            </div>

            {/* Subject line */}
            <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700">
              <label className="block text-[12px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                Objet
              </label>
              <input
                type="text"
                value={coldEmailStudioState.subject}
                onChange={(e) => setEmailSubject(e.target.value)}
                placeholder="Objet de ton email..."
                className="w-full text-[15px] font-medium text-gray-900 dark:text-white bg-transparent focus:outline-none placeholder-gray-300 dark:placeholder-gray-600"
              />
            </div>

            {/* Editor toolbar */}
            <div className="flex items-center gap-1 px-5 py-2 border-b border-gray-100 dark:border-gray-700">
              {[
                { icon: Icons.Bold, label: 'Gras' },
                { icon: Icons.Italic, label: 'Italique' },
                { icon: Icons.Underline, label: 'Souligné' },
                { icon: Icons.List, label: 'Liste' },
                { icon: Icons.Link, label: 'Lien' },
              ].map((tool) => (
                <button
                  key={tool.label}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white transition-colors"
                  title={tool.label}
                  onClick={() => toast(`${tool.label} - Non implémenté dans ce prototype`)}
                >
                  <tool.icon className="w-4 h-4" />
                </button>
              ))}
              <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-2" />
              <VariableButton onClick={() => setShowVariableMenu(!showVariableMenu)} />
              
              {/* Variable dropdown */}
              {showVariableMenu && currentTemplate && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute left-[340px] top-[220px] bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 p-2 z-30"
                >
                  {currentTemplate.variables.map((variable) => (
                    <button
                      key={variable}
                      onClick={() => handleInsertVariable(variable)}
                      className="w-full px-3 py-2 text-left text-[13px] text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      {variable}
                    </button>
                  ))}
                </motion.div>
              )}
            </div>

            {/* Editor body */}
            <div className="flex-1 p-5 overflow-y-auto">
              <textarea
                value={coldEmailStudioState.body}
                onChange={(e) => setEmailBody(e.target.value)}
                placeholder="Rédige ton email ici..."
                className="w-full h-full text-[14px] text-gray-900 dark:text-white leading-relaxed bg-transparent resize-none focus:outline-none placeholder-gray-300 dark:placeholder-gray-600"
              />
            </div>

            {/* Editor footer */}
            <div className="p-5 border-t border-gray-100 dark:border-gray-700 space-y-4">
              {/* CV Selector */}
              <div>
                <label className="block text-[12px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                  CV joint
                </label>
                {cvsList.length === 0 ? (
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-amber-50/50 dark:bg-amber-900/20 border border-amber-200/50 dark:border-amber-700/30">
                    <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center">
                      <Icons.FileX className="w-5 h-5 text-amber-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-[13px] font-medium text-amber-800 dark:text-amber-300">Aucun CV disponible</p>
                      <p className="text-[12px] text-amber-600 dark:text-amber-400">Tu dois uploader un CV pour envoyer un email</p>
                    </div>
                    <button
                      onClick={handleUploadCV}
                      className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-[13px] font-medium flex items-center gap-2 hover:bg-indigo-700 transition-colors"
                    >
                      <Icons.Upload className="w-4 h-4" />
                      Uploader un CV
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <Listbox value={coldEmailStudioState.selectedCVId} onChange={setSelectedCV}>
                      <div className="relative w-full">
                        <Listbox.Button className="relative w-[200px] cursor-default rounded-xl bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 pl-3 pr-10 py-2 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-opacity-75">
                          <span className="block truncate">
                            {cvsList.find(cv => cv.id === coldEmailStudioState.selectedCVId)?.fileName || 'Sélectionner un CV'}
                          </span>
                          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                            <Icons.ChevronDown className="w-5 h-5 text-gray-400 dark:text-gray-300" />
                          </span>
                        </Listbox.Button>
                        <Transition
                          as={React.Fragment}
                          leave="transition ease-in duration-100"
                          leaveFrom="opacity-100"
                          leaveTo="opacity-0"
                        >
                          <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-[200px] overflow-auto rounded-xl bg-white dark:bg-gray-800 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                            {cvsList.map((cv) => (
                              <Listbox.Option
                                key={cv.id}
                                value={cv.id}
                                className={({ active }) =>
                                  `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                    active ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-900' : 'text-gray-900 dark:text-gray-200'
                                  }`
                                }
                              >
                                {({ selected }) => (
                                  <>
                                    <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                                      {cv.fileName}
                                    </span>
                                    {selected ? (
                                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-indigo-600 dark:text-indigo-400">
                                        <Icons.Check className="w-4 h-4" />
                                      </span>
                                    ) : null}
                                  </>
                                )}
                              </Listbox.Option>
                            ))}
                          </Listbox.Options>
                        </Transition>
                      </div>
                    </Listbox>
                    <button
                      onClick={handleUploadCV}
                      className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                      title="Ajouter un CV"
                    >
                      <Icons.Plus className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Follow-up toggle */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <Switch
                    checked={coldEmailStudioState.followUpScheduled}
                    onChange={(value) => {
                      if (currentUser?.subscriptionTier === 'free' && value) {
                        setShowUpgradeModal(true);
                        openModal('upgrade');
                      } else {
                        toggleFollowUp();
                      }
                    }}
                    className={`${
                      coldEmailStudioState.followUpScheduled ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-gray-600'
                    } relative inline-flex h-6 w-10 items-center rounded-full transition-colors focus:outline-none`}
                  >
                    <span
                      className={`${
                        coldEmailStudioState.followUpScheduled ? 'translate-x-4' : 'translate-x-0'
                      } inline-block h-4 w-4 transform bg-white rounded-full transition-transform`}
                    />
                  </Switch>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-medium text-gray-900 dark:text-white">
                        Programmer une relance dans 4 jours
                      </span>
                      {currentUser?.subscriptionTier === 'free' && (
                        <span className="px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-[10px] font-medium flex items-center gap-0.5">
                          <Icons.Star className="w-2.5 h-2.5" />
                          Premium
                        </span>
                      )}
                    </div>
                    <p className="text-[12px] text-gray-500 dark:text-gray-400">
                      Tu recevras un rappel pour relancer automatiquement
                    </p>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-between">
                <button
                  onClick={() => toast('Prévisualisation - Non implémenté dans ce prototype')}
                  className="px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-[13px] font-medium flex items-center gap-2 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  <Icons.Eye className="w-4 h-4" />
                  Prévisualiser
                </button>
                <button
                  onClick={handleSend}
                  disabled={isSending || cvsList.length === 0}
                  className={`px-6 py-2.5 rounded-xl text-white text-[14px] font-semibold flex items-center gap-2 transition-all shadow-lg shadow-indigo-500/25 ${
                    isSending || cvsList.length === 0
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-xl'
                  }`}
                >
                  {isSending ? (
                    <>
                      <Icons.Loader2 className="w-4 h-4 animate-spin" />
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      <Icons.Send className="w-4 h-4" />
                      Envoyer
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>

          <LivePreview />
        </div>
      </main>

      {/* Upgrade Modal */}
      <UpgradeModal
        isOpen={showUpgradeModal || false}
        onClose={() => {
          setShowUpgradeModal(false);
          closeModal();
          // Revert follow-up toggle if it was the trigger
          if (currentUser?.subscriptionTier === 'free' && coldEmailStudioState.followUpScheduled) {
            toggleFollowUp();
          }
        }}
      />

      {/* Decorative accent */}
      <div className="absolute top-20 right-20 w-[200px] h-[200px] bg-indigo-600 opacity-[0.03] dark:opacity-[0.05] rounded-full blur-3xl pointer-events-none" />
    </div>
  );
}