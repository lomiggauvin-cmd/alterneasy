/**
 * OnboardingScreen — 3-step wizard shown on first login.
 * Selector components are imported from shared/PreferenceSelectors
 * so they can be reused in ProfileScreen without duplication.
 */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Icons from 'lucide-react';
import { useStore } from '../stores/store';
import {
  DomainSelector,
  RhythmSelector,
  LocationSelector,
} from './shared/PreferenceSelectors';

// ─── Progress indicator ────────────────────────────────────────────────────────

const StepIndicator: React.FC<{ current: number; total: number }> = ({ current, total }) => (
  <div className="flex items-center gap-2 mb-10">
    {Array.from({ length: total }).map((_, i) => (
      <motion.div
        key={i}
        animate={{
          width: i + 1 === current ? 32 : 8,
          backgroundColor: i + 1 <= current ? '#7c3aed' : '#e2e8f0',
        }}
        transition={{ duration: 0.35 }}
        className="h-2 rounded-full"
      />
    ))}
    <span className="ml-2 text-[13px] text-slate-400 font-medium">
      {current} / {total}
    </span>
  </div>
);

// ─── Step wrappers ─────────────────────────────────────────────────────────────

const Step1: React.FC<{ selected: string[]; onToggle: (id: string) => void }> = (props) => (
  <motion.div
    key="step1"
    initial={{ opacity: 0, x: 40 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -40 }}
    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
  >
    <h2 className="font-['Fraunces'] text-3xl font-semibold text-slate-900 dark:text-white mb-2">
      Quel est ton domaine ?
    </h2>
    <p className="text-slate-500 dark:text-slate-400 text-[15px] mb-8">
      Sélectionne un ou plusieurs domaines qui t'intéressent.
    </p>
    <DomainSelector selected={props.selected} onToggle={props.onToggle} />
  </motion.div>
);

const Step2: React.FC<{ selected: string; onSelect: (id: string) => void }> = (props) => (
  <motion.div
    key="step2"
    initial={{ opacity: 0, x: 40 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -40 }}
    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
  >
    <h2 className="font-['Fraunces'] text-3xl font-semibold text-slate-900 dark:text-white mb-2">
      Quel est ton rythme ?
    </h2>
    <p className="text-slate-500 dark:text-slate-400 text-[15px] mb-8">
      On filtrera les offres qui correspondent à ta disponibilité.
    </p>
    <RhythmSelector selected={props.selected} onSelect={props.onSelect} />
  </motion.div>
);

const Step3: React.FC<{
  locations: string[];
  onAdd: (city: string) => void;
  onRemove: (city: string) => void;
}> = (props) => (
  <motion.div
    key="step3"
    initial={{ opacity: 0, x: 40 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -40 }}
    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
  >
    <h2 className="font-['Fraunces'] text-3xl font-semibold text-slate-900 dark:text-white mb-2">
      Où cherches-tu ?
    </h2>
    <p className="text-slate-500 dark:text-slate-400 text-[15px] mb-8">
      Ajoute une ou plusieurs villes. Appuie sur Entrée ou clique pour valider.
    </p>
    <LocationSelector
      locations={props.locations}
      onAdd={props.onAdd}
      onRemove={props.onRemove}
    />
    <p className="mt-4 text-[12px] text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
      <Icons.Info className="w-3.5 h-3.5" />
      Tu pourras modifier ces préférences dans ton profil.
    </p>
  </motion.div>
);

// ─── Main Onboarding Screen ────────────────────────────────────────────────────

export default function OnboardingScreen() {
  const { completeOnboarding2, navigateTo } = useStore();

  const [step, setStep] = useState(1);
  const [domains, setDomains] = useState<string[]>([]);
  const [rhythm, setRhythm] = useState('');
  const [locations, setLocations] = useState<string[]>([]);

  const canNext =
    (step === 1 && domains.length > 0) ||
    (step === 2 && rhythm !== '') ||
    (step === 3 && locations.length > 0);

  const toggleDomain = (id: string) =>
    setDomains((prev) => prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]);

  const addLocation = (city: string) => setLocations((prev) => [...prev, city]);
  const removeLocation = (city: string) => setLocations((prev) => prev.filter((c) => c !== city));

  const handleNext = () => {
    if (step < 3) {
      setStep((s) => s + 1);
    } else {
      completeOnboarding2(domains, rhythm, locations);
      navigateTo('dashboard');
    }
  };

  const handleBack = () => setStep((s) => Math.max(1, s - 1));

  const stepLabels = ['Domaine', 'Rythme', 'Localisation'];

  return (
    <div className="min-h-screen w-full flex items-center justify-center font-['Plus_Jakarta_Sans'] bg-slate-50 dark:bg-slate-900 p-6 transition-colors duration-300">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 via-indigo-500 to-purple-500" />
      <div className="absolute top-20 right-20 w-72 h-72 bg-violet-600 opacity-[0.04] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 left-20 w-56 h-56 bg-indigo-400 opacity-[0.05] rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-2xl relative"
      >
        {/* Logo */}
        <div className="flex items-center gap-3 mb-10">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-200 dark:shadow-violet-900/30">
            <Icons.Zap className="w-5 h-5 text-white" />
          </div>
          <span className="font-['Fraunces'] text-[20px] font-bold text-slate-900 dark:text-white">
            Tandem
          </span>
        </div>

        {/* Step tabs */}
        <div className="flex items-center gap-1 mb-6">
          {stepLabels.map((label, i) => (
            <React.Fragment key={label}>
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-medium transition-all ${
                i + 1 === step
                  ? 'bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300'
                  : i + 1 < step
                  ? 'text-violet-500 dark:text-violet-400'
                  : 'text-slate-400 dark:text-slate-600'
              }`}>
                {i + 1 < step
                  ? <Icons.CheckCircle2 className="w-3.5 h-3.5" />
                  : <span className="w-3.5 h-3.5 rounded-full border border-current inline-flex items-center justify-center text-[9px]">{i + 1}</span>
                }
                {label}
              </div>
              {i < stepLabels.length - 1 && (
                <div className={`flex-1 h-px mx-1 transition-colors ${i + 1 < step ? 'bg-violet-300 dark:bg-violet-700' : 'bg-slate-200 dark:bg-slate-700'}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        <StepIndicator current={step} total={3} />

        {/* Card */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xl shadow-slate-100 dark:shadow-slate-900/50 p-8 min-h-[440px] flex flex-col">
          <div className="flex-1">
            <AnimatePresence mode="wait">
              {step === 1 && <Step1 key="s1" selected={domains} onToggle={toggleDomain} />}
              {step === 2 && <Step2 key="s2" selected={rhythm} onSelect={setRhythm} />}
              {step === 3 && <Step3 key="s3" locations={locations} onAdd={addLocation} onRemove={removeLocation} />}
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-100 dark:border-slate-700">
            <button
              onClick={handleBack}
              disabled={step === 1}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[14px] font-medium text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-0 disabled:pointer-events-none transition-all"
            >
              <Icons.ArrowLeft className="w-4 h-4" />
              Retour
            </button>

            <div className="flex items-center gap-3">
              {step < 3 && (
                <button
                  onClick={() => setStep((s) => Math.min(3, s + 1))}
                  className="text-[13px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                >
                  Passer
                </button>
              )}
              <motion.button
                onClick={handleNext}
                disabled={!canNext}
                whileHover={canNext ? { scale: 1.02 } : {}}
                whileTap={canNext ? { scale: 0.98 } : {}}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[14px] font-semibold transition-all ${
                  canNext
                    ? 'bg-violet-600 text-white hover:bg-violet-700 shadow-lg shadow-violet-200 dark:shadow-violet-900/30'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed'
                }`}
              >
                {step === 3 ? (
                  <><Icons.Sparkles className="w-4 h-4" />Terminer</>
                ) : (
                  <>Suivant<Icons.ArrowRight className="w-4 h-4" /></>
                )}
              </motion.button>
            </div>
          </div>
        </div>

        <p className="text-center text-[12px] text-slate-400 dark:text-slate-600 mt-6">
          Ces préférences personnalisent ton expérience Tandem — tu pourras les modifier à tout moment.
        </p>
      </motion.div>
    </div>
  );
}