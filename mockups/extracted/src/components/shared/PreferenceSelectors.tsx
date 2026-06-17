/**
 * Shared preference selector components.
 * Used by both OnboardingScreen and ProfileScreen — zero duplication.
 */
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Icons from 'lucide-react';

// ─── Domain data ──────────────────────────────────────────────────────────────

export const DOMAINS = [
  { id: 'Développement Web/Mobile', icon: Icons.Code2,           color: 'from-violet-500 to-indigo-600'  },
  { id: 'Marketing Digital',        icon: Icons.Megaphone,       color: 'from-pink-500 to-rose-600'      },
  { id: 'Audiovisuel',              icon: Icons.Film,            color: 'from-orange-500 to-amber-600'   },
  { id: 'Restauration/Hôtellerie', icon: Icons.UtensilsCrossed, color: 'from-yellow-500 to-orange-500'  },
  { id: 'Ingénierie',               icon: Icons.Wrench,          color: 'from-sky-500 to-cyan-600'       },
  { id: 'Commerce/Vente',           icon: Icons.ShoppingBag,     color: 'from-emerald-500 to-teal-600'   },
  { id: 'Design',                   icon: Icons.Palette,         color: 'from-fuchsia-500 to-purple-600' },
  { id: 'Comptabilité/Finance',     icon: Icons.TrendingUp,      color: 'from-green-500 to-emerald-600'  },
  { id: 'RH',                       icon: Icons.Users,           color: 'from-blue-500 to-indigo-600'    },
  { id: 'Autre',                    icon: Icons.Grid3x3,         color: 'from-slate-500 to-gray-600'     },
];

export const RHYTHMS = [
  { id: '2 sem. école / 2 sem. entreprise',   badge: '2/2',  description: "Équilibré — souvent en école d'ingénieurs" },
  { id: '3 jours école / 2 jours entreprise', badge: '3j/2j',description: "Semaine divisée — courant en Bachelor"    },
  { id: '1 sem. école / 1 sem. entreprise',   badge: '1/1',  description: "Rythme long — fréquent en Master"         },
  { id: 'Autre rythme',                        badge: '…',    description: "Autre configuration non listée"           },
];

export const CITY_SUGGESTIONS = [
  'Paris', 'Lyon', 'Marseille', 'Bordeaux', 'Toulouse',
  'Nantes', 'Lille', 'Strasbourg', 'Nice', 'Rennes',
  'Montpellier', 'Grenoble', 'Rouen', 'Toulon', 'Remote',
];

// ─── DomainSelector ───────────────────────────────────────────────────────────

export interface DomainSelectorProps {
  selected: string[];
  onToggle: (id: string) => void;
  compact?: boolean; // smaller grid for profile page
}

export const DomainSelector: React.FC<DomainSelectorProps> = ({ selected, onToggle, compact }) => (
  <div className={`grid gap-3 ${compact ? 'grid-cols-5' : 'grid-cols-2 sm:grid-cols-5'}`}>
    {DOMAINS.map(({ id, icon: Icon, color }) => {
      const isSelected = selected.includes(id);
      return (
        <motion.button
          key={id}
          onClick={() => onToggle(id)}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className={`relative flex flex-col items-center gap-2 p-3 rounded-2xl border-2 text-center transition-all cursor-pointer ${
            isSelected
              ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/20 shadow-md shadow-violet-100 dark:shadow-violet-900/20'
              : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-violet-300 dark:hover:border-violet-600'
          }`}
        >
          {isSelected && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-violet-600 flex items-center justify-center shadow"
            >
              <Icons.Check className="w-3 h-3 text-white" />
            </motion.div>
          )}
          <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-sm`}>
            <Icon className="w-4 h-4 text-white" />
          </div>
          <span className={`text-[11px] font-medium leading-tight ${
            isSelected ? 'text-violet-700 dark:text-violet-300' : 'text-slate-600 dark:text-slate-300'
          }`}>
            {id}
          </span>
        </motion.button>
      );
    })}
  </div>
);

// ─── RhythmSelector ───────────────────────────────────────────────────────────

export interface RhythmSelectorProps {
  selected: string;
  onSelect: (id: string) => void;
}

export const RhythmSelector: React.FC<RhythmSelectorProps> = ({ selected, onSelect }) => (
  <div className="space-y-3">
    {RHYTHMS.map(({ id, badge, description }) => {
      const isSelected = selected === id;
      return (
        <motion.button
          key={id}
          onClick={() => onSelect(id)}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all cursor-pointer ${
            isSelected
              ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/20 shadow-md shadow-violet-100 dark:shadow-violet-900/20'
              : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-violet-300 dark:hover:border-violet-600'
          }`}
        >
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-[14px] flex-shrink-0 transition-all ${
            isSelected
              ? 'bg-violet-600 text-white shadow-md shadow-violet-200 dark:shadow-violet-900'
              : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
          }`}>
            {badge}
          </div>
          <div className="flex-1">
            <p className={`font-semibold text-[14px] ${isSelected ? 'text-violet-900 dark:text-violet-100' : 'text-slate-800 dark:text-white'}`}>
              {id}
            </p>
            <p className={`text-[12px] mt-0.5 ${isSelected ? 'text-violet-600 dark:text-violet-300' : 'text-slate-500 dark:text-slate-400'}`}>
              {description}
            </p>
          </div>
          <motion.div
            animate={{ scale: isSelected ? 1 : 0 }}
            className="w-5 h-5 rounded-full bg-violet-600 flex items-center justify-center flex-shrink-0"
          >
            <Icons.Check className="w-3 h-3 text-white" />
          </motion.div>
        </motion.button>
      );
    })}
  </div>
);

// ─── LocationSelector ─────────────────────────────────────────────────────────

export interface LocationSelectorProps {
  locations: string[];
  onAdd: (city: string) => void;
  onRemove: (city: string) => void;
}

export const LocationSelector: React.FC<LocationSelectorProps> = ({ locations, onAdd, onRemove }) => {
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = CITY_SUGGESTIONS.filter(
    (c) => c.toLowerCase().includes(query.toLowerCase()) && !locations.includes(c)
  );

  const handleAdd = (city: string) => {
    const trimmed = city.trim();
    if (trimmed && !locations.includes(trimmed)) onAdd(trimmed);
    setQuery('');
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && query.trim()) handleAdd(query);
  };

  return (
    <div>
      {/* Tags */}
      <AnimatePresence>
        {locations.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex flex-wrap gap-2 mb-3"
          >
            {locations.map((city) => (
              <motion.span
                key={city}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-violet-600 text-white text-[13px] font-medium"
              >
                <Icons.MapPin className="w-3.5 h-3.5" />
                {city}
                <button
                  onClick={() => onRemove(city)}
                  className="ml-1 w-4 h-4 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center transition-colors"
                >
                  <Icons.X className="w-2.5 h-2.5" />
                </button>
              </motion.span>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input */}
      <div className="relative">
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border-2 border-violet-400 dark:border-violet-600 focus-within:border-violet-500 focus-within:shadow-md focus-within:shadow-violet-100 dark:focus-within:shadow-violet-900/20 transition-all">
          <Icons.MapPin className="w-4 h-4 text-violet-500 flex-shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => { setQuery(e.target.value); setShowSuggestions(true); }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
            onKeyDown={handleKey}
            placeholder="Paris, Lyon, Remote…"
            className="flex-1 bg-transparent text-[14px] text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none"
          />
          {query && (
            <button
              onMouseDown={() => handleAdd(query)}
              className="px-2.5 py-1 rounded-lg bg-violet-600 text-white text-[11px] font-medium hover:bg-violet-700 transition-colors"
            >
              + Ajouter
            </button>
          )}
        </div>

        <AnimatePresence>
          {showSuggestions && filtered.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="absolute left-0 right-0 top-full mt-1 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xl z-30 overflow-hidden"
            >
              {filtered.slice(0, 7).map((city) => (
                <button
                  key={city}
                  onMouseDown={() => handleAdd(city)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-[13px] text-slate-700 dark:text-slate-200 hover:bg-violet-50 dark:hover:bg-violet-900/20 hover:text-violet-700 dark:hover:text-violet-300 transition-colors"
                >
                  <Icons.MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {city}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
