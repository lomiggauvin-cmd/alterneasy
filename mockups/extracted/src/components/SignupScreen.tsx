import React, { useState } from "react";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { useStore } from "../stores/store";
import { User } from "../types";
import toast from "react-hot-toast";

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  acceptTerms?: string;
}

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
      stiffness: 100,
      damping: 15,
    },
  },
};

const LeftPanel: React.FC = () => (
  <div className="w-[55%] h-full bg-[#4F46E5] relative overflow-hidden flex flex-col justify-between p-12">
    {/* Decorative background elements */}
    <div className="absolute inset-0 opacity-10">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-[#818CF8] translate-x-1/4 -translate-y-1/4" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-[#3730A3] -translate-x-1/4 translate-y-1/4" />
      <div className="absolute top-1/3 right-1/3 w-[250px] h-[250px] rounded-full bg-[#FBBF24] opacity-25" />
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
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="relative z-10"
    >
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-[#FFFFFF] flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.15)]">
          <Icons.Zap className="w-7 h-7 text-[#4F46E5]" />
        </div>
        <span className="font-['Fraunces'] text-[28px] font-bold text-[#FFFFFF]">Tandem</span>
      </div>
    </motion.div>

    {/* Center: Value proposition */}
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="relative z-10 max-w-[480px]"
    >
      <h2 className="font-['Fraunces'] text-[42px] font-semibold text-[#FFFFFF] leading-[1.15] mb-6">
        Ton alternance commence{' '}
        <span className="text-[#FBBF24]">ici.</span>
      </h2>
      <p className="text-[17px] text-[#C7D2FE] leading-relaxed mb-10">
        Rejoins des milliers d'étudiants qui gèrent leurs candidatures comme des pros. Gratuit, sans carte bancaire.
      </p>

      {/* Step indicators */}
      <div className="space-y-4">
        {[
          { num: 1, title: 'Crée ton compte', desc: '2 minutes, pas de friction' },
          { num: 2, title: 'Configure ton profil', desc: 'Domaine, rythme, localisation' },
          { num: 3, title: 'Lance ta recherche', desc: 'Tandem trouve les opportunités' },
        ].map((step) => (
          <motion.div key={step.num} variants={itemVariants} className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#FFFFFF]/15 border border-[#FFFFFF]/20 flex items-center justify-center">
              <span className="text-[#FFFFFF] text-[14px] font-bold">{step.num}</span>
            </div>
            <div>
              <p className="text-[14px] font-semibold text-[#FFFFFF]">{step.title}</p>
              <p className="text-[13px] text-[#A5B4FC]">{step.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>

    {/* Bottom: Trust badge */}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="relative z-10 flex items-center gap-3 px-4 py-3 rounded-xl bg-[#3730A3]/40 border border-[#818CF8]/30 backdrop-blur-sm w-fit"
    >
      <Icons.Shield className="w-5 h-5 text-[#FBBF24]" />
      <span className="text-[13px] text-[#E0E7FF]">Tes données sont protégées et jamais revendues</span>
    </motion.div>
  </div>
);

export default function SignupScreen() {
  const { users, setCurrentUser, navigateTo, generateId, addUser } = useStore();

  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Veuillez entrer votre prénom et nom';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Le nom doit contenir au moins 2 caractères';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Veuillez entrer votre adresse email';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Veuillez entrer une adresse email valide';
    } else if (Object.values(users).some((u) => u.email === formData.email.trim())) {
      newErrors.email = 'Cette adresse email est déjà utilisée';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Veuillez entrer un mot de passe';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Le mot de passe doit contenir au moins 8 caractères';
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Veuillez confirmer votre mot de passe';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }

    // Terms validation
    if (!formData.acceptTerms) {
      newErrors.acceptTerms = "Vous devez accepter les conditions d'utilisation";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getPasswordStrength = (): { level: number; label: string; color: string } => {
    const password = formData.password;
    let level = 0;
    if (password.length >= 8) level++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) level++;
    if (/\d/.test(password)) level++;
    if (/[^a-zA-Z0-9]/.test(password)) level++;

    switch (level) {
      case 0:
      case 1:
        return { level, label: 'Faible', color: '#EF4444' };
      case 2:
        return { level, label: 'Moyen', color: '#FBBF24' };
      case 3:
        return { level, label: 'Bon', color: '#34D399' };
      case 4:
        return { level, label: 'Excellent', color: '#10B981' };
      default:
        return { level: 0, label: 'Faible', color: '#EF4444' };
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Veuillez corriger les erreurs dans le formulaire');
      return;
    }

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Parse name
    const nameParts = formData.name.trim().split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';

    // Create new user and update store
    const userId = generateId();
    const newUser: User = {
      id: userId,
      email: formData.email.trim(),
      passwordHash: 'hashed_' + formData.password,
      firstName,
      lastName,
      domain: 'Autre',
      rhythm: 'Autre',
      location: '',
      streakCount: 0,
      lastLoginDate: null,
      subscriptionTier: 'free',
      dailyEmailsSent: 0,
      lastEmailResetDate: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    addUser({
      email: formData.email.trim(),
      passwordHash: 'hashed_' + formData.password,
      firstName,
      lastName,
      domain: 'Autre',
      rhythm: 'Autre',
      location: '',
      streakCount: 0,
      lastLoginDate: null,
      subscriptionTier: 'free',
      dailyEmailsSent: 0,
      lastEmailResetDate: new Date(),
    });
    toast.success('Compte créé avec succès !');
    navigateTo('emailVerification');
    setIsSubmitting(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    // Clear error for this field when the user modifies it
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const passwordStrength = getPasswordStrength();
  const strengthPercentage = (passwordStrength.level / 4) * 100;

  return (
    <div className="w-full h-screen flex font-['Plus_Jakarta_Sans'] overflow-hidden">
      <LeftPanel />
      {/* Right Panel - Signup Form */}
      <div className="w-[45%] h-full bg-[#FAFAF7] flex flex-col justify-center px-16 relative">
        {/* Subtle texture */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #0F172A 1px, transparent 0)`,
            backgroundSize: '24px 24px',
          }}
        />

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 max-w-[400px] w-full mx-auto"
        >
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-['Fraunces'] text-[32px] font-semibold text-[#0F172A] mb-3">
              Crée ton compte
            </h1>
            <p className="text-[15px] text-[#64748B]">
              Gratuit pour toujours. Pas de carte bancaire requise.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-[13px] font-medium text-[#0F172A] mb-2">
                Prénom et nom
              </label>
              <div className="relative">
                <Icons.User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#94A3B8]" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Marine Lefort"
                  className={`w-full pl-12 pr-4 py-3.5 rounded-xl bg-[#FFFFFF] border text-[14px] text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 transition-all ${
                    errors.name ? 'border-[#EF4444] focus:border-[#EF4444]' : 'border-[#E2E8F0] focus:border-[#4F46E5]'
                  }`}
                />
              </div>
              {errors.name && <p className="text-[11px] text-[#EF4444] mt-1.5">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-[13px] font-medium text-[#0F172A] mb-2">
                Adresse email
              </label>
              <div className="relative">
                <Icons.Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#94A3B8]" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="marine@exemple.fr"
                  className={`w-full pl-12 pr-4 py-3.5 rounded-xl bg-[#FFFFFF] border text-[14px] text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 transition-all ${
                    errors.email ? 'border-[#EF4444] focus:border-[#EF4444]' : 'border-[#E2E8F0] focus:border-[#4F46E5]'
                  }`}
                />
              </div>
              {errors.email && <p className="text-[11px] text-[#EF4444] mt-1.5">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-[13px] font-medium text-[#0F172A] mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <Icons.Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#94A3B8]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="8 caractères minimum"
                  className={`w-full pl-12 pr-12 py-3.5 rounded-xl bg-[#FFFFFF] border text-[14px] text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 transition-all ${
                    errors.password ? 'border-[#EF4444] focus:border-[#EF4444]' : 'border-[#E2E8F0] focus:border-[#4F46E5]'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#64748B] transition-colors"
                >
                  {showPassword ? <Icons.EyeOff className="w-5 h-5" /> : <Icons.Eye className="w-5 h-5" />}
                </button>
              </div>
              {formData.password && (
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex-1 h-1.5 rounded-full bg-[#E2E8F0] overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${strengthPercentage}%` }}
                      transition={{ duration: 0.3 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: passwordStrength.color }}
                    />
                  </div>
                  <span className="text-[11px] font-medium" style={{ color: passwordStrength.color }}>
                    {passwordStrength.label}
                  </span>
                </div>
              )}
              {errors.password && <p className="text-[11px] text-[#EF4444] mt-1.5">{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-[13px] font-medium text-[#0F172A] mb-2">
                Confirmer le mot de passe
              </label>
              <div className="relative">
                <Icons.Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#94A3B8]" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirmer votre mot de passe"
                  className={`w-full pl-12 pr-12 py-3.5 rounded-xl bg-[#FFFFFF] border text-[14px] text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 transition-all ${
                    errors.confirmPassword ? 'border-[#EF4444] focus:border-[#EF4444]' : 'border-[#E2E8F0] focus:border-[#4F46E5]'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#64748B] transition-colors"
                >
                  {showConfirmPassword ? <Icons.EyeOff className="w-5 h-5" /> : <Icons.Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-[11px] text-[#EF4444] mt-1.5">{errors.confirmPassword}</p>}
            </div>

            {/* Terms */}
            <label className="flex items-start gap-3 cursor-pointer mt-2">
              <input
                type="checkbox"
                name="acceptTerms"
                checked={formData.acceptTerms}
                onChange={handleInputChange}
                className="sr-only"
                id="acceptTerms"
              />
              <div
                className={`w-5 h-5 rounded-md bg-[#FFFFFF] border flex items-center justify-center mt-0.5 flex-shrink-0 transition-all ${
                  errors.acceptTerms ? 'border-[#EF4444]' : 'border-[#E2E8F0]'
                } ${formData.acceptTerms ? 'bg-[#4F46E5] border-[#4F46E5]' : ''}`}
              >
                <Icons.Check
                  className={`w-3.5 h-3.5 text-[#FFFFFF] transition-opacity ${
                    formData.acceptTerms ? 'opacity-100' : 'opacity-0'
                  }`}
                />
              </div>
              <span className="text-[13px] text-[#64748B] leading-relaxed">
                J'accepte les{' '}
                <button
                  type="button"
                  onClick={() => toast('Conditions d’utilisation non disponibles dans le prototype')}
                  className="text-[#4F46E5] font-medium hover:text-[#3730A3] transition-colors"
                >
                  Conditions d'utilisation
                </button>{' '}
                et la{' '}
                <button
                  type="button"
                  onClick={() => toast('Politique de confidentialité non disponible dans le prototype')}
                  className="text-[#4F46E5] font-medium hover:text-[#3730A3] transition-colors"
                >
                  Politique de confidentialité
                </button>
              </span>
            </label>
            {errors.acceptTerms && <p className="text-[11px] text-[#EF4444] -mt-2">{errors.acceptTerms}</p>}

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: isSubmitting ? 1 : 1.01 }}
              whileTap={{ scale: isSubmitting ? 1 : 0.99 }}
              className="w-full py-3.5 rounded-xl bg-[#4F46E5] text-[#FFFFFF] text-[15px] font-semibold hover:bg-[#3730A3] transition-colors shadow-[0_4px_14px_rgba(79,70,229,0.25)] mt-2 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Icons.Loader2 className="w-4 h-4 animate-spin" />
                  Création en cours...
                </>
              ) : (
                'Commencer gratuitement'
              )}
            </motion.button>

            {/* Divider */}
            <div className="flex items-center gap-4 my-1">
              <div className="flex-1 h-px bg-[#E2E8F0]" />
              <span className="text-[12px] text-[#94A3B8] font-medium">ou</span>
              <div className="flex-1 h-px bg-[#E2E8F0]" />
            </div>

            {/* Google OAuth */}
            <motion.button
              type="button"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => toast('Connexion Google non disponible dans le prototype')}
              className="w-full py-3.5 rounded-xl bg-[#FFFFFF] border border-[#E2E8F0] text-[#0F172A] text-[14px] font-medium flex items-center justify-center gap-3 hover:bg-[#F8FAFC] transition-colors"
            >
              <div className="w-5 h-5 rounded-full bg-[#0F172A] flex items-center justify-center">
                <span className="text-[#FFFFFF] text-[10px] font-bold">G</span>
              </div>
              S'inscrire avec Google
            </motion.button>
          </form>

          {/* Login link */}
          <p className="text-center text-[14px] text-[#64748B] mt-6">
            Déjà un compte ?{' '}
            <button
              type="button"
              onClick={() => navigateTo('login')}
              className="font-semibold text-[#4F46E5] hover:text-[#3730A3] transition-colors"
            >
              Se connecter
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
}