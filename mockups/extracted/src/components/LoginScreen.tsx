import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "../stores/store";
import toast from "react-hot-toast";
import * as Icons from "lucide-react";

const LeftPanel = () => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.6 }}
    className="w-[55%] h-full bg-[#4F46E5] relative overflow-hidden flex flex-col justify-between p-12"
  >
    {/* Decorative background elements */}
    <div className="absolute inset-0 opacity-10">
      <div className="absolute top-0 left-0 w-[600px] h-[600px] rounded-full bg-[#818CF8] -translate-x-1/3 -translate-y-1/3" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-[#3730A3] translate-x-1/4 translate-y-1/4" />
      <div className="absolute top-1/2 left-1/2 w-[300px] h-[300px] rounded-full bg-[#FBBF24] opacity-20 -translate-x-1/2 -translate-y-1/2" />
    </div>

    {/* Grid pattern overlay */}
    <div
      className="absolute inset-0 opacity-[0.06]"
      style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, #FFFFFF 1px, transparent 0)`,
        backgroundSize: '32px 32px',
      }}
    />

    {/* Top: Logo */}
    <div className="relative z-10">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-[#FFFFFF] flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.15)]">
          <Icons.Zap className="w-7 h-7 text-[#4F46E5]" />
        </div>
        <span className="font-['Fraunces'] text-[28px] font-bold text-[#FFFFFF]">Tandem</span>
      </div>
    </div>

    {/* Center: Value proposition */}
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="relative z-10 max-w-[480px]"
    >
      <h2 className="font-['Fraunces'] text-[42px] font-semibold text-[#FFFFFF] leading-[1.15] mb-6">
        Trouve ton alternance,{' '}
        <span className="text-[#FBBF24]">sans le stress.</span>
      </h2>
      <p className="text-[17px] text-[#C7D2FE] leading-relaxed mb-10">
        Tandem rassemble toutes tes candidatures, relances automatiques et opportunités en un seul endroit. Concentre-toi sur ce qui compte vraiment.
      </p>

      {/* Social proof */}
      <div className="flex items-center gap-4">
        <div className="flex -space-x-3">
          <div className="w-10 h-10 rounded-full bg-[#FF6B6B] border-2 border-[#4F46E5] flex items-center justify-center">
            <span className="text-[#FFFFFF] text-[12px] font-bold">ML</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-[#22C55E] border-2 border-[#4F46E5] flex items-center justify-center">
            <span className="text-[#FFFFFF] text-[12px] font-bold">TH</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-[#FBBF24] border-2 border-[#4F46E5] flex items-center justify-center">
            <span className="text-[#FFFFFF] text-[12px] font-bold">AS</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-[#EC4899] border-2 border-[#4F46E5] flex items-center justify-center">
            <span className="text-[#FFFFFF] text-[12px] font-bold">KL</span>
          </div>
        </div>
        <div>
          <p className="text-[14px] font-semibold text-[#FFFFFF]">+2,400 étudiants</p>
          <p className="text-[13px] text-[#A5B4FC]">ont trouvé leur alternance</p>
        </div>
      </div>
    </motion.div>

    {/* Bottom: Feature pills */}
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="relative z-10 flex flex-wrap gap-3"
    >
      <div className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#3730A3]/40 border border-[#818CF8]/30 backdrop-blur-sm">
        <Icons.Send className="w-4 h-4 text-[#FBBF24]" />
        <span className="text-[13px] text-[#E0E7FF]">Emails automatisés</span>
      </div>
      <div className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#3730A3]/40 border border-[#818CF8]/30 backdrop-blur-sm">
        <Icons.Kanban className="w-4 h-4 text-[#FBBF24]" />
        <span className="text-[13px] text-[#E0E7FF]">Pipeline visuel</span>
      </div>
      <div className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#3730A3]/40 border border-[#818CF8]/30 backdrop-blur-sm">
        <Icons.Bell className="w-4 h-4 text-[#FBBF24]" />
        <span className="text-[13px] text-[#E0E7FF]">Relances intelligentes</span>
      </div>
    </motion.div>
  </motion.div>
);

const RightPanel: React.FC<{
  email: string;
  setEmail: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  rememberMe: boolean;
  setRememberMe: (value: boolean) => void;
  showPassword: boolean;
  setShowPassword: (value: boolean) => void;
  isLoading: boolean;
  errors: { email?: string; password?: string };
  handleSubmit: (e: React.FormEvent) => void;
}> = ({
  email,
  setEmail,
  password,
  setPassword,
  rememberMe,
  setRememberMe,
  showPassword,
  setShowPassword,
  isLoading,
  errors,
  handleSubmit,
}) => {
  const { navigateTo } = useStore();

  const handleForgotPassword = () => {
    toast("Un lien de réinitialisation a été envoyé à votre email.");
  };

  const handleGoogleLogin = () => {
    toast("Connexion Google non disponible dans ce prototype.");
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="w-[45%] h-full bg-[#FAFAF7] flex flex-col justify-center px-16 relative"
    >
      {/* Subtle texture */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #0F172A 1px, transparent 0)`,
          backgroundSize: '24px 24px',
        }}
      />

      <div className="relative z-10 max-w-[400px] w-full mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-10"
        >
          <h1 className="font-['Fraunces'] text-[32px] font-semibold text-[#0F172A] mb-3">
            Content de te revoir
          </h1>
          <p className="text-[15px] text-[#64748B]">
            Connecte-toi pour accéder à ton espace candidature.
          </p>
        </motion.div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
          >
            <label className="block text-[13px] font-medium text-[#0F172A] mb-2">
              Adresse email
            </label>
            <div className="relative">
              <Icons.Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#94A3B8]" />
              <input
                type="email"
                placeholder="marine@exemple.fr"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full pl-12 pr-4 py-3.5 rounded-xl bg-[#FFFFFF] border ${
                  errors.email ? 'border-red-400' : 'border-[#E2E8F0]'
                } text-[14px] text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 ${
                  errors.email ? 'focus:ring-red-400/20 focus:border-red-400' : 'focus:ring-[#4F46E5]/20 focus:border-[#4F46E5]'
                } transition-all`}
              />
            </div>
            <AnimatePresence>
              {errors.email && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-[12px] text-red-500 mt-1.5"
                >
                  {errors.email}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Password */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <label className="block text-[13px] font-medium text-[#0F172A] mb-2">
              Mot de passe
            </label>
            <div className="relative">
              <Icons.Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#94A3B8]" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full pl-12 pr-12 py-3.5 rounded-xl bg-[#FFFFFF] border ${
                  errors.password ? 'border-red-400' : 'border-[#E2E8F0]'
                } text-[14px] text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 ${
                  errors.password ? 'focus:ring-red-400/20 focus:border-red-400' : 'focus:ring-[#4F46E5]/20 focus:border-[#4F46E5]'
                } transition-all`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#64748B] transition-colors"
              >
                {showPassword ? <Icons.EyeOff className="w-5 h-5" /> : <Icons.Eye className="w-5 h-5" />}
              </button>
            </div>
            <AnimatePresence>
              {errors.password && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-[12px] text-red-500 mt-1.5"
                >
                  {errors.password}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Remember & Forgot */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.45 }}
            className="flex items-center justify-between"
          >
            <label 
              className="flex items-center gap-2.5 cursor-pointer select-none"
              onClick={() => setRememberMe(!rememberMe)}
            >
              <div className={`w-5 h-5 rounded-md bg-[#FFFFFF] border ${
                rememberMe ? 'border-[#4F46E5] bg-[#4F46E5]' : 'border-[#E2E8F0]'
              } flex items-center justify-center transition-all`}>
                <Icons.Check className={`w-3.5 h-3.5 text-[#FFFFFF] transition-opacity ${rememberMe ? 'opacity-100' : 'opacity-0'}`} />
              </div>
              <span className="text-[13px] text-[#64748B]">Se souvenir de moi</span>
            </label>
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-[13px] font-medium text-[#4F46E5] hover:text-[#3730A3] transition-colors"
            >
              Mot de passe oublié ?
            </button>
          </motion.div>

          {/* Submit */}
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 rounded-xl bg-[#4F46E5] text-[#FFFFFF] text-[15px] font-semibold hover:bg-[#3730A3] transition-colors shadow-[0_4px_14px_rgba(79,70,229,0.25)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#4F46E5]"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                >
                  <Icons.Loader2 className="w-4 h-4" />
                </motion.div>
                Connexion...
              </span>
            ) : (
              'Se connecter'
            )}
          </motion.button>

          {/* Divider */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.55 }}
            className="flex items-center gap-4 my-2"
          >
            <div className="flex-1 h-px bg-[#E2E8F0]" />
            <span className="text-[12px] text-[#94A3B8] font-medium">ou</span>
            <div className="flex-1 h-px bg-[#E2E8F0]" />
          </motion.div>

          {/* Google OAuth */}
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            type="button"
            onClick={handleGoogleLogin}
            className="w-full py-3.5 rounded-xl bg-[#FFFFFF] border border-[#E2E8F0] text-[#0F172A] text-[14px] font-medium flex items-center justify-center gap-3 hover:bg-[#F8FAFC] transition-colors"
          >
            <div className="w-5 h-5 rounded-full bg-[#0F172A] flex items-center justify-center">
              <span className="text-[#FFFFFF] text-[10px] font-bold">G</span>
            </div>
            Continuer avec Google
          </motion.button>
        </form>

        {/* Sign up link */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.65 }}
          className="text-center text-[14px] text-[#64748B] mt-8"
        >
          Pas encore de compte ?{' '}
          <button
            onClick={() => navigateTo('signup')}
            className="font-semibold text-[#4F46E5] hover:text-[#3730A3] transition-colors"
          >
            Créer un compte
          </button>
        </motion.p>
      </div>
    </motion.div>
  );
};

export default function LoginScreen() {
  const { navigateTo, incrementStreak, checkAndResetDailyEmailLimit, users, setCurrentUser } = useStore();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};
    
    if (!email) {
      newErrors.email = 'L\'email est requis';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Format d\'email invalide';
    }
    
    if (!password) {
      newErrors.password = 'Le mot de passe est requis';
    } else if (password.length < 6) {
      newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check credentials against mock users (email only for prototype)
    const user = Object.values(users).find(u => u.email === email);
    
    if (user) {
      setCurrentUser(user);
      checkAndResetDailyEmailLimit();
      incrementStreak();
      navigateTo('dashboard');
      toast.success('Connexion réussie !');
    } else {
      setErrors({ email: 'Email ou mot de passe incorrect' });
      toast.error('Email ou mot de passe incorrect');
    }
    
    setIsLoading(false);
  };

  return (
    <div className="w-full h-screen flex font-['Plus_Jakarta_Sans'] overflow-hidden">
      <LeftPanel />
      <RightPanel
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        rememberMe={rememberMe}
        setRememberMe={setRememberMe}
        showPassword={showPassword}
        setShowPassword={setShowPassword}
        isLoading={isLoading}
        errors={errors}
        handleSubmit={handleSubmit}
      />
    </div>
  );
}