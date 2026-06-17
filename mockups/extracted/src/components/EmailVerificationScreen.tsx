import React from "react";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { useStore } from "../stores/store";
import toast from "react-hot-toast";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 24,
    },
  },
};

interface LeftPanelProps {
  isDarkMode: boolean;
}

const LeftPanel: React.FC<LeftPanelProps> = ({ isDarkMode }) => {
  const panelBg = isDarkMode ? 'bg-slate-900' : 'bg-[#4F46E5]';
  const textColor = isDarkMode ? 'text-white' : 'text-[#FFFFFF]';
  const textColorMuted = isDarkMode ? 'text-slate-400' : 'text-[#C7D2FE]';
  const textColorLight = isDarkMode ? 'text-slate-300' : 'text-[#A5B4FC]';
  const iconBg = isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-[#FFFFFF]/15 border-[#FFFFFF]/20';
  const iconColor = isDarkMode ? 'text-slate-300' : 'text-[#FBBF24]';
  const logoBg = isDarkMode ? 'bg-slate-800' : 'bg-[#FFFFFF]';
  const logoIconColor = isDarkMode ? 'text-indigo-500' : 'text-[#4F46E5]';

  return (
    <div className={`w-[55%] h-full ${panelBg} relative overflow-hidden flex flex-col justify-between p-12`}>
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className={`absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full ${isDarkMode ? 'bg-slate-700' : 'bg-[#818CF8]'}`} />
        <div className={`absolute bottom-1/4 right-1/4 w-[300px] h-[300px] rounded-full ${isDarkMode ? 'bg-indigo-950' : 'bg-[#3730A3]'}`} />
      </div>

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, ${isDarkMode ? '#FFFFFF' : '#FFFFFF'} 1px, transparent 0)`,
          backgroundSize: '32px 32px',
        }}
      />

      {/* Top: Logo */}
      <motion.div
        className="relative z-10"
        variants={itemVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-2xl ${logoBg} flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.15)]`}>
            <Icons.Zap className={`w-7 h-7 ${logoIconColor}`} />
          </div>
          <span className={`font-['Fraunces'] text-[28px] font-bold ${textColor}`}>Tandem</span>
        </div>
      </motion.div>

      {/* Center: Calm reassurance */}
      <motion.div
        className="relative z-10 max-w-[440px]"
        variants={itemVariants}
        initial="hidden"
        animate="visible"
      >
        <div className={`w-16 h-16 rounded-2xl ${iconBg} border flex items-center justify-center mb-8`}>
          <Icons.ShieldCheck className={`w-8 h-8 ${iconColor}`} />
        </div>
        <h2 className={`font-['Fraunces'] text-[36px] font-semibold ${textColor} leading-[1.2] mb-4`}>
          On vérifie ton identité
        </h2>
        <p className={`text-[16px] ${textColorMuted} leading-relaxed`}>
          C'est une étape rapide qui sécurise ton compte et tes données personnelles. Tu pourras commencer ta recherche juste après.
        </p>
      </motion.div>

      {/* Bottom: Simple footer */}
      <motion.div
        className="relative z-10"
        variants={itemVariants}
        initial="hidden"
        animate="visible"
      >
        <p className={`text-[13px] ${textColorLight}`}>
          Besoin d'aide ?{' '}
          <a href="#" className={`${textColor} font-medium hover:underline`}>
            Contacte-nous
          </a>
        </p>
      </motion.div>
    </div>
  );
};

interface VerificationCardProps {
  userEmail: string;
  onVerified: () => void;
  onResendEmail: () => void;
  onChangeEmail: () => void;
  isDarkMode: boolean;
}

const VerificationCard: React.FC<VerificationCardProps> = ({
  userEmail,
  onVerified,
  onResendEmail,
  onChangeEmail,
  isDarkMode,
}) => {
  const cardBg = isDarkMode ? 'bg-slate-800' : 'bg-[#FAFAF7]';
  const headlineColor = isDarkMode ? 'text-white' : 'text-[#0F172A]';
  const bodyColor = isDarkMode ? 'text-slate-400' : 'text-[#64748B]';
  const emailTextBg = isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-[#FFFFFF] border-[#E2E8F0]';
  const emailTextColor = isDarkMode ? 'text-white' : 'text-[#0F172A]';
  const emailIconColor = isDarkMode ? 'text-indigo-400' : 'text-[#4F46E5]';
  const primaryBg = isDarkMode ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-[#4F46E5] hover:bg-[#3730A3]';
  const secondaryBg = isDarkMode ? 'bg-slate-900 border-slate-700 hover:bg-slate-800' : 'bg-[#FFFFFF] border-[#E2E8F0] hover:bg-[#F8FAFC]';
  const secondaryText = isDarkMode ? 'text-white' : 'text-[#0F172A]';
  const secondaryIconColor = isDarkMode ? 'text-slate-400' : 'text-[#64748B]';
  const linkColor = isDarkMode ? 'text-slate-400 hover:text-indigo-400' : 'text-[#64748B] hover:text-[#4F46E5]';
  const helpBg = isDarkMode ? 'bg-amber-950/50 border-amber-900/50' : 'bg-[#FEF3C7]/50 border-[#FDE68A]/50';
  const helpIconColor = isDarkMode ? 'text-amber-500' : 'text-[#B45309]';
  const helpTextColor = isDarkMode ? 'text-amber-200' : 'text-[#92400E]';
  const iconContainerBg = isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-[#EEF2FF] border-[#C7D2FE]';
  const mainIconColor = isDarkMode ? 'text-indigo-400' : 'text-[#4F46E5]';

  return (
    <div className={`w-[45%] h-full ${cardBg} flex flex-col justify-center px-16 relative`}>
      {/* Subtle texture */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, ${isDarkMode ? '#FFFFFF' : '#0F172A'} 1px, transparent 0)`,
          backgroundSize: '24px 24px',
        }}
      />

      <motion.div
        className="relative z-10 max-w-[420px] w-full mx-auto text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Illustration */}
        <motion.div
          className={`w-24 h-24 rounded-3xl ${iconContainerBg} border flex items-center justify-center mx-auto mb-8 shadow-[0_4px_16px_rgba(79,70,229,0.08)]`}
          variants={itemVariants}
        >
          <Icons.Mail className={`w-12 h-12 ${mainIconColor}`} />
          <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-[#FBBF24] flex items-center justify-center shadow-[0_2px_8px_rgba(251,191,36,0.3)]">
            <Icons.Sparkles className="w-4 h-4 text-[#FFFFFF]" />
          </div>
        </motion.div>

        {/* Headline */}
        <motion.h1
          className={`font-['Fraunces'] text-[28px] font-semibold ${headlineColor} mb-3`}
          variants={itemVariants}
        >
          Vérifie ta boîte mail
        </motion.h1>
        <motion.p
          className={`text-[15px] ${bodyColor} leading-relaxed mb-8`}
          variants={itemVariants}
        >
          On t'a envoyé un lien de confirmation. Clique dessus pour activer ton compte et accéder à ton espace.
        </motion.p>

        {/* Email display */}
        <motion.div
          className={`inline-flex items-center gap-3 px-5 py-3.5 rounded-xl ${emailTextBg} shadow-[0_1px_3px_rgba(0,0,0,0.04)] mb-8`}
          variants={itemVariants}
        >
          <Icons.Mail className={`w-5 h-5 ${emailIconColor}`} />
          <span className={`text-[14px] font-medium ${emailTextColor}`}>{userEmail}</span>
          <div className="w-2 h-2 rounded-full bg-[#22C55E]" />
        </motion.div>

        {/* Primary action */}
        <motion.button
          className={`w-full py-3.5 rounded-xl ${primaryBg} text-[#FFFFFF] text-[15px] font-semibold transition-colors shadow-[0_4px_14px_rgba(79,70,229,0.25)] mb-4`}
          onClick={onVerified}
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          J'ai vérifié mon email
        </motion.button>

        {/* Secondary actions */}
        <motion.div
          className="space-y-3"
          variants={itemVariants}
        >
          <motion.button
            className={`w-full py-3 rounded-xl ${secondaryBg} ${secondaryText} text-[14px] font-medium flex items-center justify-center gap-2 transition-colors`}
            onClick={onResendEmail}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <Icons.RefreshCw className={`w-4 h-4 ${secondaryIconColor}`} />
            Renvoyer l'email
          </motion.button>
          <motion.button
            className={`text-[13px] ${linkColor} transition-colors`}
            onClick={onChangeEmail}
            whileHover={{ scale: 1.05 }}
          >
            Changer d'adresse email
          </motion.button>
        </motion.div>

        {/* Help text */}
        <motion.div
          className={`mt-8 p-4 rounded-xl ${helpBg} border`}
          variants={itemVariants}
        >
          <div className="flex items-start gap-3">
            <Icons.Info className={`w-5 h-5 ${helpIconColor} mt-0.5 flex-shrink-0`} />
            <p className={`text-[13px] ${helpTextColor} text-left leading-relaxed`}>
              Si tu ne vois pas l'email, vérifie ton dossier spam ou promotions. Le lien est valable 24 heures.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default function EmailVerificationScreen() {
  const { currentUser, updateUser, navigateTo, isDarkMode } = useStore();

  const handleVerified = () => {
    if (currentUser) {
      // Mark email as verified (emailVerified is a prototype field not present in the User type)
      // @ts-ignore
      updateUser(currentUser.id, { emailVerified: true } as any);
      // Navigate to onboarding
      navigateTo('onboarding');
      toast.success('Email vérifié avec succès !');
    }
  };

  const handleResendEmail = () => {
    toast.success('Email de vérification renvoyé.');
  };

  const handleChangeEmail = () => {
    navigateTo('signup');
  };

  if (!currentUser) {
    // If no current user, redirect to signup
    navigateTo('signup');
    return null;
  }

  const containerBg = isDarkMode ? 'bg-slate-950' : 'bg-[#FAFAF7]';

  return (
    <div className={`w-full h-screen flex font-['Plus_Jakarta_Sans'] overflow-hidden ${containerBg}`}>
      <LeftPanel isDarkMode={isDarkMode} />
      <VerificationCard
        userEmail={currentUser.email}
        onVerified={handleVerified}
        onResendEmail={handleResendEmail}
        onChangeEmail={handleChangeEmail}
        isDarkMode={isDarkMode}
      />
    </div>
  );
}