import React, { useState, useRef, Fragment } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as Icons from "lucide-react";
import { Dialog, Transition } from "@headlessui/react";
import { useStore } from "../stores/store";
import { toast } from "react-hot-toast";

// Subcomponents
const Sidebar = () => {
  const { currentScreen, navigateTo, currentUser, toggleDarkMode, openModal, isDarkMode } = useStore();
  const initials = currentUser 
    ? `${currentUser.firstName.charAt(0)}${currentUser.lastName.charAt(0)}` 
    : 'ML';

  const navItems = [
    { id: 'dashboard', icon: Icons.LayoutDashboard, label: 'Dashboard' },
    { id: 'radar', icon: Icons.Radar, label: 'Radar' },
    { id: 'pipeline', icon: Icons.Kanban, label: 'Pipeline' },
    { id: 'coldEmailStudio', icon: Icons.Mail, label: 'Studio' },
  ];

  return (
    <aside className="w-[72px] h-full bg-[#FFFFFF] border-r border-[#E2E8F0] flex flex-col items-center py-6 z-20 flex-shrink-0">
      <div className="w-10 h-10 rounded-xl bg-[#4F46E5] flex items-center justify-center mb-8 shadow-[0_2px_8px_rgba(79,70,229,0.25)]">
        <Icons.Zap className="w-5 h-5 text-[#FFFFFF]" />
      </div>
      <nav className="flex flex-col gap-2">
        {navItems.map((item) => (
          <motion.div
            key={item.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigateTo(item.id as any)}
            className={`w-10 h-10 rounded-xl flex items-center justify-center cursor-pointer transition-colors ${
              currentScreen === item.id
                ? 'bg-[#4F46E5] text-white shadow-[0_2px_6px_rgba(79,70,229,0.3)]'
                : 'bg-[#F1F5F9] text-[#64748B] hover:bg-[#E2E8F0]'
            }`}
            title={item.label}
          >
            <item.icon className="w-5 h-5" />
          </motion.div>
        ))}
      </nav>
      <div className="mt-auto flex flex-col gap-3 items-center">
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleDarkMode}
          className="w-10 h-10 rounded-xl bg-[#F1F5F9] flex items-center justify-center cursor-pointer hover:bg-[#E2E8F0] transition-colors"
          title="Mode sombre"
        >
          {isDarkMode ? <Icons.Moon className="w-5 h-5 text-[#64748B]" /> : <Icons.Sun className="w-5 h-5 text-[#64748B]" />}
        </motion.div>
        {currentUser?.subscriptionTier === 'free' && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => openModal('upgrade')}
            className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-[0_2px_8px_rgba(251,191,36,0.4)]"
            title="Passer Premium"
          >
            <Icons.Crown className="w-5 h-5 text-white" />
          </motion.button>
        )}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigateTo('profile')}
          className="w-10 h-10 rounded-full bg-[#818CF8] flex items-center justify-center shadow-[0_2px_6px_rgba(129,140,248,0.3)] cursor-pointer"
          title="Mon profil"
        >
          <span className="text-[13px] font-bold text-[#FFFFFF]">{initials}</span>
        </motion.div>
      </div>
    </aside>
  );
};

const TopBar = () => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="font-['Fraunces'] text-[28px] font-semibold text-[#0F172A] leading-tight">
          Paramètres
        </h1>
        <p className="text-[14px] text-[#64748B] mt-1">
          Gère ton profil, tes CVs et ton abonnement
        </p>
      </div>
      <div className="flex items-center gap-4">
        <div 
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#FFFFFF] border border-[#E2E8F0] w-[260px] cursor-text"
          onClick={() => toast('La recherche globale n\'est pas implémentée dans ce prototype.')}
        >
          <Icons.Search className="w-4 h-4 text-[#94A3B8]" />
          <span className="text-[13px] text-[#94A3B8]">Rechercher...</span>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => toast('Pas de nouvelles notifications.')}
          className="relative w-10 h-10 rounded-xl bg-[#FFFFFF] border border-[#E2E8F0] flex items-center justify-center cursor-pointer hover:bg-[#F8FAFC] transition-colors"
        >
          <Icons.Bell className="w-5 h-5 text-[#64748B]" />
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#EF4444] text-[#FFFFFF] text-[10px] font-bold flex items-center justify-center">
            3
          </span>
        </motion.button>
      </div>
    </div>
  );
};

interface CVCardProps {
  cv: any;
  onDelete: (id: string) => void;
}

const CVCard: React.FC<CVCardProps> = ({ cv, onDelete }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDownload = () => {
    toast('Téléchargement du CV...');
  };

  return (
    <div className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)] transition-shadow">
      <div className="flex items-start gap-4">
        <div className="w-16 h-20 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center flex-shrink-0">
          <Icons.FileText className="w-8 h-8 text-[#4F46E5]" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-[14px] font-semibold text-[#0F172A] truncate">{cv.fileName}</h3>
          <p className="text-[12px] text-[#64748B] mt-1">
            Ajouté le {new Date(cv.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
          </p>
          <div className="flex items-center gap-2 mt-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleDownload}
              className="w-8 h-8 rounded-lg bg-[#F1F5F9] flex items-center justify-center text-[#64748B] hover:bg-[#E2E8F0] transition-colors"
              title="Télécharger"
            >
              <Icons.Download className="w-4 h-4" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowDeleteConfirm(true)}
              className="w-8 h-8 rounded-lg bg-[#F1F5F9] flex items-center justify-center text-[#64748B] hover:bg-[#FEF2F2] hover:text-[#EF4444] transition-colors"
              title="Supprimer"
            >
              <Icons.Trash2 className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </div>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteConfirm} onClose={setShowDeleteConfirm} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel 
            as={motion.div}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1, transition: { type: 'spring', duration: 0.3 } }}
            className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl"
          >
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <Icons.AlertCircle className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="text-lg font-semibold text-center text-gray-900 mb-2">Supprimer ce CV ?</h3>
            <p className="text-sm text-gray-500 text-center mb-6">
              Cette action est irréversible. Tu ne pourras plus récupérer ce CV.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2.5 rounded-xl bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={() => {
                  onDelete(cv.id);
                  setShowDeleteConfirm(false);
                }}
                className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 text-white font-medium hover:bg-red-600 transition-colors"
              >
                Supprimer
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

const UpgradeModal: React.FC = () => {
  const { currentModal, closeModal, currentUser, updateUser } = useStore();

  const handleUpgrade = () => {
    if (!currentUser) return;
    updateUser(currentUser.id, { subscriptionTier: 'premium' });
    toast.success('Bienvenue en Premium !');
    closeModal();
  };

  return (
    <Transition appear show={currentModal === 'upgrade'} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30" />
        </Transition.Child>

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel
            as={motion.div}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300 } }}
            className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl"
          >
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mb-4">
                <Icons.Lock className="w-6 h-6 text-amber-600" />
              </div>
              <Dialog.Title className="text-lg font-semibold text-gray-900 mb-2">
                Passe à la vitesse supérieure avec Tandem Premium
              </Dialog.Title>
              <Dialog.Description className="text-sm text-gray-600 text-center mb-6">
                Tu as atteint ta limite d'envois quotidiens. Débloque des envois illimités, le suivi des taux d'ouverture, et des relances automatiques.
              </Dialog.Description>
              <button
                onClick={handleUpgrade}
                className="w-full py-3 rounded-xl bg-[#4F46E5] text-white text-sm font-medium hover:bg-[#3730A3] transition-colors mb-3 flex items-center justify-center gap-2"
              >
                <Icons.Crown className="w-5 h-5" />
                Commencer mon essai gratuit
              </button>
              <button
                onClick={closeModal}
                className="w-full py-2 rounded-xl bg-gray-100 text-gray-700 text-sm font-medium hover:bg-gray-200 transition-colors"
              >
                Peut-être plus tard
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </Transition>
  );
};

const EmptyCVs = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col items-center justify-center py-16"
    >
      <div className="w-20 h-20 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center mb-5">
        <Icons.FileX className="w-10 h-10 text-[#CBD5E1]" />
      </div>
      <h3 className="font-['Fraunces'] text-[22px] font-semibold text-[#0F172A] mb-2">
        Tu n'as pas encore ajouté de CV
      </h3>
      <p className="text-[14px] text-[#64748B] text-center max-w-[360px] mb-6">
        Tes CVs te permettront de candidater rapidement depuis le Studio Email. Ajoute ton premier CV pour commencer.
      </p>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => document.getElementById('cv-upload-input')?.click()}
        className="px-6 py-3 rounded-xl bg-[#4F46E5] text-[#FFFFFF] text-[14px] font-semibold flex items-center gap-2 hover:bg-[#3730A3] transition-colors shadow-[0_4px_14px_rgba(79,70,229,0.25)]"
      >
        <Icons.Upload className="w-5 h-5" />
        Ajouter un CV
      </motion.button>
    </motion.div>
  );
};

export default function ProfileSettingsScreen() {
  const { 
    currentUser, 
    cvs, 
    settingsState, 
    setSettingsTab, 
    updateUser, 
    addCV, 
    deleteCV, 
    openModal,
    closeModal,
    currentModal,
    navigateTo
  } = useStore();

  // Account form state
  const [accountForm, setAccountForm] = useState({
    firstName: currentUser?.firstName || '',
    lastName: currentUser?.lastName || '',
    email: currentUser?.email || '',
    phone: '06 12 34 56 78',
  });

  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
  });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // CV upload input ref
  const cvInputRef = useRef<HTMLInputElement>(null);

  const handleAccountSave = () => {
    if (!currentUser) return;
    
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      updateUser(currentUser.id, {
        firstName: accountForm.firstName,
        lastName: accountForm.lastName,
        email: accountForm.email,
      });
      
      setIsSaving(false);
      toast.success('Informations mises à jour avec succès !');
    }, 800);
  };

  const handlePasswordUpdate = () => {
    if (!currentUser) return;
    
    if (passwordForm.newPassword.length < 8) {
      toast.error('Le mot de passe doit contenir au moins 8 caractères.');
      return;
    }

    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      updateUser(currentUser.id, {
        passwordHash: 'newHashedPassword',
      });
      
      setPasswordForm({ currentPassword: '', newPassword: '' });
      setIsSaving(false);
      toast.success('Mot de passe mis à jour avec succès !');
    }, 800);
  };

  const handleCVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !currentUser) return;

    if (file.type !== 'application/pdf') {
      toast.error('Seuls les fichiers PDF sont acceptés.');
      return;
    }

    // Simulate file upload
    const fileUrl = `/files/${file.name}`;
    const title = file.name.replace('.pdf', '');

    addCV({
      userId: currentUser.id,
      title,
      fileUrl,
      fileName: file.name,
    });

    toast.success('CV ajouté avec succès !');
    
    // Reset input
    if (cvInputRef.current) {
      cvInputRef.current.value = '';
    }
  };

  const handleDeleteCV = (cvId: string) => {
    deleteCV(cvId);
    toast.success('CV supprimé avec succès !');
  };

  const handleUpgrade = () => {
    if (!currentUser) return;
    
    updateUser(currentUser.id, { subscriptionTier: 'premium' });
    toast.success('Bienvenue en Premium !');
  };

  const cvList = Object.values(cvs).filter(cv => cv.userId === currentUser?.id);
  const dailyEmailLimit = 5;
  const dailyEmailsSent = currentUser?.dailyEmailsSent || 0;
  const emailProgress = (dailyEmailsSent / dailyEmailLimit) * 100;

  return (
    <div className="w-[1920px] h-[1080px] flex font-['Plus_Jakarta_Sans'] bg-[#FAFAF7] overflow-hidden relative">
      {/* Subtle background texture */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #0F172A 1px, transparent 0)`,
          backgroundSize: '24px 24px',
        }}
      />

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 flex flex-col p-8 z-10 overflow-hidden">
        <TopBar />

        {/* Tabs */}
        <div className="flex items-center gap-2 mb-6 border-b border-[#E2E8F0] pb-1">
          {[
            { id: 'cvs', label: 'Mes CVs', icon: Icons.FileText },
            { id: 'account', label: 'Mon Compte', icon: Icons.User },
            { id: 'subscription', label: 'Abonnement', icon: Icons.CreditCard },
          ].map((tab) => (
            <motion.button
              key={tab.id}
              whileHover={{ y: -1 }}
              whileTap={{ y: 0 }}
              onClick={() => setSettingsTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-t-xl text-[14px] font-medium flex items-center gap-2 cursor-pointer transition-all -mb-px ${
                settingsState.activeTab === tab.id
                  ? 'bg-[#FFFFFF] text-[#4F46E5] border-x border-t border-[#E2E8F0]'
                  : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </motion.button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {settingsState.activeTab === 'cvs' && (
            <motion.div
              key="cvs"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="flex-1 overflow-y-auto"
            >
              {cvList.length === 0 ? (
                <EmptyCVs />
              ) : (
                <div className="space-y-4">
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => document.getElementById('cv-upload-input')?.click()}
                    className="w-full py-4 rounded-2xl border-2 border-dashed border-[#E2E8F0] text-[#64748B] text-[14px] font-medium flex items-center justify-center gap-2 hover:border-[#4F46E5] hover:text-[#4F46E5] hover:bg-[#EEF2FF]/50 transition-colors"
                  >
                    <Icons.Upload className="w-5 h-5" />
                    Ajouter un CV
                  </motion.button>

                  <input
                    ref={cvInputRef}
                    id="cv-upload-input"
                    type="file"
                    accept=".pdf"
                    onChange={handleCVUpload}
                    className="hidden"
                  />

                  <div className="grid grid-cols-2 gap-4">
                    {cvList.map((cv) => (
                      <CVCard key={cv.id} cv={cv} onDelete={handleDeleteCV} />
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {settingsState.activeTab === 'account' && (
            <motion.div
              key="account"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="flex-1 overflow-y-auto"
            >
              <div className="max-w-[600px] space-y-6">
                {/* Profile header */}
                <div className="flex items-center gap-4 p-5 rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0]">
                  <div className="w-16 h-16 rounded-full bg-[#818CF8] flex items-center justify-center shadow-[0_2px_8px_rgba(129,140,248,0.3)]">
                    <span className="text-[22px] font-bold text-[#FFFFFF]">
                      {currentUser?.firstName.charAt(0)}{currentUser?.lastName.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-[16px] font-semibold text-[#0F172A]">
                      {currentUser?.firstName} {currentUser?.lastName}
                    </h3>
                    <p className="text-[13px] text-[#64748B]">{currentUser?.email}</p>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#F1F5F9] text-[#64748B] text-[11px] font-medium mt-1">
                      <Icons.Clock className="w-3 h-3" />
                      {currentUser?.rhythm} — {currentUser?.location}
                    </span>
                  </div>
                </div>

                {/* Form */}
                <div className="p-6 rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] space-y-5">
                  <h3 className="text-[14px] font-semibold text-[#0F172A] uppercase tracking-wide">
                    Informations personnelles
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[13px] font-medium text-[#0F172A] mb-2">Prénom</label>
                      <input
                        type="text"
                        value={accountForm.firstName}
                        onChange={(e) => setAccountForm({ ...accountForm, firstName: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-[14px] text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5]"
                      />
                    </div>
                    <div>
                      <label className="block text-[13px] font-medium text-[#0F172A] mb-2">Nom</label>
                      <input
                        type="text"
                        value={accountForm.lastName}
                        onChange={(e) => setAccountForm({ ...accountForm, lastName: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-[14px] text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[13px] font-medium text-[#0F172A] mb-2">Email</label>
                    <div className="relative">
                      <Icons.Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#94A3B8]" />
                      <input
                        type="email"
                        value={accountForm.email}
                        onChange={(e) => setAccountForm({ ...accountForm, email: e.target.value })}
                        className="w-full pl-12 pr-4 py-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-[14px] text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[13px] font-medium text-[#0F172A] mb-2">Téléphone</label>
                    <div className="relative">
                      <Icons.Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#94A3B8]" />
                      <input
                        type="tel"
                        value={accountForm.phone}
                        onChange={(e) => setAccountForm({ ...accountForm, phone: e.target.value })}
                        className="w-full pl-12 pr-4 py-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-[14px] text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5]"
                      />
                    </div>
                  </div>
                </div>

                {/* Password section */}
                <div className="p-6 rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] space-y-5">
                  <h3 className="text-[14px] font-semibold text-[#0F172A] uppercase tracking-wide">Sécurité</h3>
                  
                  <div>
                    <label className="block text-[13px] font-medium text-[#0F172A] mb-2">Mot de passe actuel</label>
                    <div className="relative">
                      <Icons.Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#94A3B8]" />
                      <input
                        type={showCurrentPassword ? 'text' : 'password'}
                        value={passwordForm.currentPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                        placeholder="••••••••"
                        className="w-full pl-12 pr-12 py-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-[14px] text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5]"
                      />
                      <button 
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#64748B]"
                      >
                        {showCurrentPassword ? <Icons.EyeOff className="w-5 h-5" /> : <Icons.Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[13px] font-medium text-[#0F172A] mb-2">Nouveau mot de passe</label>
                    <div className="relative">
                      <Icons.Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#94A3B8]" />
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        value={passwordForm.newPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                        placeholder="8 caractères minimum"
                        className="w-full pl-12 pr-4 py-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-[14px] text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5]"
                      />
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: isSaving ? 1 : 1.02 }}
                    whileTap={{ scale: isSaving ? 1 : 0.98 }}
                    onClick={handlePasswordUpdate}
                    disabled={isSaving || passwordForm.newPassword.length < 8}
                    className="px-5 py-2.5 rounded-xl bg-[#4F46E5] text-[#FFFFFF] text-[13px] font-medium hover:bg-[#3730A3] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSaving ? 'Mise à jour...' : 'Mettre à jour le mot de passe'}
                  </motion.button>
                </div>

                {/* Save */}
                <div className="flex justify-end">
                  <motion.button
                    whileHover={{ scale: isSaving ? 1 : 1.02 }}
                    whileTap={{ scale: isSaving ? 1 : 0.98 }}
                    onClick={handleAccountSave}
                    disabled={isSaving}
                    className="px-6 py-3 rounded-xl bg-[#4F46E5] text-[#FFFFFF] text-[14px] font-semibold hover:bg-[#3730A3] transition-colors shadow-[0_4px_14px_rgba(79,70,229,0.25)] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSaving ? 'Enregistrement...' : 'Enregistrer les modifications'}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}

          {settingsState.activeTab === 'subscription' && (
            <motion.div
              key="subscription"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="flex-1 overflow-y-auto"
            >
              <div className="max-w-[720px] space-y-6">
                {/* Current plan */}
                <div className="p-6 rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0]">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-[12px] font-medium text-[#64748B] uppercase tracking-wide mb-1">
                        Plan actuel
                      </p>
                      <h3 className="font-['Fraunces'] text-[24px] font-semibold text-[#0F172A]">
                        {currentUser?.subscriptionTier === 'free' ? 'Gratuit' : 'Premium'}
                      </h3>
                    </div>
                    <div className="w-14 h-14 rounded-xl bg-[#F1F5F9] flex items-center justify-center">
                      {currentUser?.subscriptionTier === 'free' ? (
                        <Icons.Gift className="w-7 h-7 text-[#64748B]" />
                      ) : (
                        <Icons.Crown className="w-7 h-7 text-[#4F46E5]" />
                      )}
                    </div>
                  </div>
                  
                  {currentUser?.subscriptionTier === 'free' && (
                    <>
                      <div className="flex items-center gap-3 mb-5">
                        <div className="flex-1 h-2 rounded-full bg-[#E2E8F0] overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${emailProgress}%` }}
                            transition={{ duration: 0.5 }}
                            className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500"
                          />
                        </div>
                        <span className="text-[13px] text-[#64748B]">
                          {dailyEmailsSent} / {dailyEmailLimit} emails aujourd'hui
                        </span>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => openModal('upgrade')}
                        className="w-full py-3 rounded-xl bg-[#4F46E5] text-[#FFFFFF] text-[14px] font-semibold hover:bg-[#3730A3] transition-colors shadow-[0_4px_14px_rgba(79,70,229,0.25)] flex items-center justify-center gap-2"
                      >
                        <Icons.Crown className="w-5 h-5" />
                        Passer Premium — 9,99€/mois
                      </motion.button>
                    </>
                  )}

                  {currentUser?.subscriptionTier === 'premium' && (
                    <div className="space-y-4">
                      <div className="p-4 rounded-xl bg-[#EEF2FF] border border-[#C7D2FE]">
                        <div className="flex items-center gap-2 text-[#4F46E5] font-medium mb-2">
                          <Icons.CheckCircle className="w-5 h-5" />
                          Abonnement actif
                        </div>
                        <p className="text-[13px] text-[#6366F1]">
                          Prochain renouvellement le {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                      <div className="flex gap-3">
                        <button 
                          onClick={() => toast('Redirection vers la facturation (simulée)')}
                          className="flex-1 px-4 py-2.5 rounded-xl bg-[#F1F5F9] text-[#64748B] text-[13px] font-medium hover:bg-[#E2E8F0] transition-colors"
                        >
                          Gérer la facturation
                        </button>
                        <button 
                          onClick={() => toast('Demande d\'annulation d\'abonnement (simulée)')}
                          className="px-4 py-2.5 rounded-xl border border-red-200 text-red-500 text-[13px] font-medium hover:bg-red-50 transition-colors"
                        >
                          Annuler
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Comparison */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Free column */}
                  <div className="p-5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0]">
                    <h4 className="text-[14px] font-semibold text-[#64748B] mb-4">Gratuit</h4>
                    <ul className="space-y-3">
                      {[
                        "5 emails / jour",
                        "Pipeline basique",
                        "Radar limité",
                        "Support par email",
                      ].map((feature) => (
                        <li key={feature} className="flex items-center gap-2 text-[13px] text-[#64748B]">
                          <Icons.Check className="w-4 h-4 text-[#22C55E]" />
                          {feature}
                        </li>
                      ))}
                      {[
                        "Suivi des ouvertures",
                        "Relances automatiques",
                        "Filtres avancés",
                      ].map((feature) => (
                        <li key={feature} className="flex items-center gap-2 text-[13px] text-[#CBD5E1]">
                          <Icons.X className="w-4 h-4" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Premium column */}
                  <div className="p-5 rounded-2xl bg-[#EEF2FF] border-2 border-[#4F46E5]">
                    <div className="flex items-center gap-2 mb-4">
                      <Icons.Crown className="w-5 h-5 text-[#4F46E5]" />
                      <h4 className="text-[14px] font-semibold text-[#3730A3]">Premium</h4>
                    </div>
                    <ul className="space-y-3">
                      {[
                        "Emails illimités",
                        "Pipeline avancé + analytics",
                        "Radar complet",
                        "Support prioritaire",
                        "Suivi des taux d'ouverture",
                        "Relances automatiques",
                        "Filtres avancés Radar",
                        "Export des données",
                      ].map((feature) => (
                        <li key={feature} className="flex items-center gap-2 text-[13px] text-[#0F172A]">
                          <Icons.Check className="w-4 h-4 text-[#4F46E5]" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* FAQ */}
                <div className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0]">
                  <h4 className="text-[14px] font-semibold text-[#0F172A] mb-3">Questions fréquentes</h4>
                  <div className="space-y-3">
                    <details className="group">
                      <summary className="flex items-center justify-between cursor-pointer text-[13px] font-medium text-[#0F172A] py-2 hover:text-[#4F46E5] transition-colors">
                        Puis-je annuler à tout moment ?
                        <Icons.ChevronDown className="w-4 h-4 text-[#64748B] group-open:rotate-180 transition-transform" />
                      </summary>
                      <p className="text-[13px] text-[#64748B] pt-1 pb-2">
                        Oui, tu peux annuler ton abonnement Premium à tout moment depuis cette page. Tu conserveras les avantages jusqu'à la fin de la période en cours.
                      </p>
                    </details>
                    <div className="h-px bg-[#F1F5F9]" />
                    <details className="group">
                      <summary className="flex items-center justify-between cursor-pointer text-[13px] font-medium text-[#0F172A] py-2 hover:text-[#4F46E5] transition-colors">
                        Y a-t-il un engagement minimum ?
                        <Icons.ChevronDown className="w-4 h-4 text-[#64748B] group-open:rotate-180 transition-transform" />
                      </summary>
                      <p className="text-[13px] text-[#64748B] pt-1 pb-2">
                        Non, Tandem Premium est sans engagement. Tu paies mois par mois et peux résilier quand tu veux.
                      </p>
                    </details>
                    <div className="h-px bg-[#F1F5F9]" />
                    <details className="group">
                      <summary className="flex items-center justify-between cursor-pointer text-[13px] font-medium text-[#0F172A] py-2 hover:text-[#4F46E5] transition-colors">
                        Puis-je récupérer mes données ?
                        <Icons.ChevronDown className="w-4 h-4 text-[#64748B] group-open:rotate-180 transition-transform" />
                      </summary>
                      <p className="text-[13px] text-[#64748B] pt-1 pb-2">
                        Oui, avec Premium tu peux exporter toutes tes données (candidatures, emails, contacts) au format CSV à tout moment.
                      </p>
                    </details>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Upgrade Modal */}
      <UpgradeModal />

      {/* Decorative accent */}
      <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-[#4F46E5] opacity-[0.03] rounded-full blur-3xl translate-y-1/4 translate-x-1/4 pointer-events-none" />
    </div>
  );
}