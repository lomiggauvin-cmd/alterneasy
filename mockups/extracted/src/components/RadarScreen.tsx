import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Listbox, Transition } from "@headlessui/react";
import * as Icons from "lucide-react";
import toast from "react-hot-toast";
import { useStore } from "../stores/store";
import { Domain, Rhythm } from "../types";

// Subcomponents
const Sidebar: React.FC = () => {
  const { navigateTo, currentUser, toggleDarkMode, isDarkMode } = useStore();

  const navItems = [
    { icon: Icons.LayoutDashboard, label: 'Dashboard', screen: 'dashboard' as const },
    { icon: Icons.Radar, label: 'Radar', screen: 'radar' as const, active: true },
    { icon: Icons.Kanban, label: 'Pipeline', screen: 'pipeline' as const },
    { icon: Icons.Mail, label: 'Studio', screen: 'coldEmailStudio' as const },
    { icon: Icons.Settings, label: 'Paramètres', screen: 'profileSettings' as const },
  ];

  return (
    <aside className="w-[72px] h-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col items-center py-6 z-20 flex-shrink-0">
      {/* Logo */}
      <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center mb-8 shadow-lg shadow-indigo-200 dark:shadow-indigo-900/20 cursor-pointer" onClick={() => navigateTo('dashboard')}>
        <Icons.Zap className="w-5 h-5 text-white" />
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-2">
        {navItems.map((item) => (
          <div
            key={item.label}
            className={`w-10 h-10 rounded-xl flex items-center justify-center cursor-pointer transition-colors ${
              item.active
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-indigo-900/20'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
            onClick={() => navigateTo(item.screen)}
            title={item.label}
          >
            <item.icon className="w-5 h-5" />
          </div>
        ))}
      </nav>

      {/* Bottom section */}
      <div className="mt-auto flex flex-col gap-3 items-center">
        {/* Dark mode toggle */}
        <div
          className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          onClick={toggleDarkMode}
          title={isDarkMode ? 'Mode clair' : 'Mode sombre'}
        >
          {isDarkMode ? <Icons.Sun className="w-5 h-5 text-slate-500" /> : <Icons.Moon className="w-5 h-5 text-slate-500" />}
        </div>

        {/* Streak indicator */}
        <div
          className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center cursor-pointer hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors"
          title={`Série: ${currentUser?.streakCount || 0} jours`}
        >
          <Icons.Zap className="w-5 h-5 text-orange-500" />
        </div>

        {/* User avatar */}
        <div
          className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg cursor-pointer hover:scale-105 transition-transform"
          onClick={() => navigateTo('profile')}
          title="Mon profil"
        >
          <span className="text-[13px] font-bold text-white">
            {currentUser?.firstName?.[0]}{currentUser?.lastName?.[0]}
          </span>
        </div>
      </div>
    </aside>
  );
};

const FilterDropdown: React.FC<{
  label: string;
  icon: React.ElementType;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}> = ({ label, icon: Icon, value, options, onChange }) => {
  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <Listbox value={value} onChange={onChange}>
      {({ open }) => (
        <div className="relative">
          <Listbox.Button className="px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center gap-2 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors shadow-sm">
            <Icon className="w-4 h-4 text-slate-500" />
            <span className="text-[13px] text-slate-600 dark:text-slate-400 truncate max-w-[100px]">
              {selectedOption?.label || label}
            </span>
            <Icons.ChevronDown className={`w-4 h-4 text-slate-400 ml-auto transition-transform ${open ? 'rotate-180' : ''}`} />
          </Listbox.Button>

          <Transition
            as={React.Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-[-10px]"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-[-10px]"
          >
            <Listbox.Options className="absolute z-50 mt-2 w-48 max-h-60 overflow-auto rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg py-1">
              <Listbox.Option
                value=""
                className={({ active }) =>
                  `cursor-pointer px-4 py-2 text-[13px] transition-colors ${
                    active ? 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-100' : 'text-slate-600 dark:text-slate-400'
                  }`
                }
              >
                Tous
              </Listbox.Option>
              {options.map((option) => (
                <Listbox.Option
                  key={option.value}
                  value={option.value}
                  className={({ active, selected }) =>
                    `cursor-pointer px-4 py-2 text-[13px] transition-colors ${
                      active ? 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-100' : 'text-slate-600 dark:text-slate-400'
                    } ${selected ? 'font-medium' : ''}`
                  }
                >
                  {option.label}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      )}
    </Listbox>
  );
};

const rowVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.05,
      duration: 0.3,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const EmptyState: React.FC<{ onReset: () => void }> = ({ onReset }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3 }}
    className="flex-1 flex flex-col items-center justify-center min-h-[400px]"
  >
    <div className="w-20 h-20 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center mb-5">
      <Icons.SearchX className="w-10 h-10 text-slate-300 dark:text-slate-600" />
    </div>
    <h3 className="font-serif text-[22px] font-semibold text-slate-900 dark:text-slate-100 mb-2">
      Aucune offre trouvée
    </h3>
    <p className="text-[14px] text-slate-500 dark:text-slate-400 text-center max-w-[360px] mb-6">
      Tes filtres sont trop restrictifs. Essaie d'élargir ta recherche ou de changer de critères.
    </p>
    <button
      onClick={onReset}
      className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-[14px] font-medium flex items-center gap-2 hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 dark:shadow-indigo-900/20"
    >
      <Icons.RotateCcw className="w-4 h-4" />
      Réinitialiser les filtres
    </button>
  </motion.div>
);

export default function RadarScreen() {
  const {
    radarState,
    opportunities,
    currentUser,
    applications,
    setRadarTab,
    setRadarFilters,
    resetRadarFilters,
    addApplication,
    navigateTo,
  } = useStore();

  const [localFilters, setLocalFilters] = useState({
    domain: radarState.filters.domain,
    location: radarState.filters.location,
    rhythm: radarState.filters.rhythm,
  });

  // Filter options
  const domainOptions: { value: string; label: string }[] = [
    { value: 'Informatique', label: 'Informatique' },
    { value: 'Marketing', label: 'Marketing' },
    { value: 'Commerce', label: 'Commerce' },
    { value: 'Design', label: 'Design' },
    { value: 'Finance', label: 'Finance' },
    { value: 'Autre', label: 'Autre' },
  ];

  const locationOptions: { value: string; label: string }[] = [
    { value: 'Paris', label: 'Paris' },
    { value: 'Lyon', label: 'Lyon' },
    { value: 'Marseille', label: 'Marseille' },
    { value: 'Remote', label: 'Remote' },
  ];

  const rhythmOptions: { value: string; label: string }[] = [
    { value: '3/1', label: '3 semaines école / 1 semaine entreprise' },
    { value: '2/2', label: '2 semaines école / 2 semaines entreprise' },
    { value: '4/1', label: '4 jours école / 1 jour entreprise' },
    { value: '1/1', label: '1 semaine école / 1 semaine entreprise' },
  ];

  // Filter opportunities
  const filteredOpportunities = useMemo(() => {
    return Object.values(opportunities).filter((opp) => {
      // Tab filter
      const isOnlineOffer = opp.opportunityType === 'online_offer';
      const isHiddenMarket = opp.opportunityType === 'hidden_market';
      
      if (radarState.activeTab === 'onlineOffers' && !isOnlineOffer) return false;
      if (radarState.activeTab === 'hiddenMarket' && !isHiddenMarket) return false;

      // Search filter
      if (radarState.filters.search) {
        const search = radarState.filters.search.toLowerCase();
        const matchesTitle = opp.title.toLowerCase().includes(search);
        const matchesCompany = opp.companyName.toLowerCase().includes(search);
        const matchesIndustry = opp.industry?.toLowerCase().includes(search);
        if (!matchesTitle && !matchesCompany && !matchesIndustry) return false;
      }

      // Domain filter (only for online offers)
      if (radarState.activeTab === 'onlineOffers' && localFilters.domain) {
        if (opp.industry !== localFilters.domain) return false;
      }

      // Location filter
      if (localFilters.location) {
        const oppLocation = opp.location.toLowerCase();
        const filterLocation = localFilters.location.toLowerCase();
        if (!oppLocation.includes(filterLocation)) return false;
      }

      // Rhythm filter (only for online offers)
      if (radarState.activeTab === 'onlineOffers' && localFilters.rhythm) {
        if (opp.rhythmRequired !== localFilters.rhythm) return false;
      }

      return true;
    });
  }, [opportunities, radarState, localFilters]);

  // Handle filter changes
  const handleFilterChange = (key: keyof typeof localFilters, value: string) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    setRadarFilters({ [key]: value });
  };

  // Handle search change
  const handleSearchChange = (value: string) => {
    setRadarFilters({ search: value });
  };

  // Handle reset filters
  const handleResetFilters = () => {
    const emptyFilters = { domain: '', location: '', rhythm: '' };
    setLocalFilters(emptyFilters);
    resetRadarFilters();
    toast.success('Filtres réinitialisés');
  };

  // Handle add to CRM
    const handleAddToCRM = (oppId: string, opportunityType: 'online_offer' | 'hidden_market') => {
      const opportunity = opportunities[oppId];
      if (!opportunity) return;

      // Ensure a user is logged in
      if (!currentUser) {
        toast.error('Vous devez être connecté pour ajouter une offre au CRM');
        return;
      }

      // Check if already in CRM
      const existingApplication = Object.values(applications).find(
        (app) => app.opportunityId === oppId && app.userId === currentUser.id
      );

      if (existingApplication) {
        toast.error('Cette offre est déjà dans ton CRM');
        navigateTo('pipeline');
        return;
      }

      // Add new application
      addApplication({
        userId: currentUser.id,
        opportunityId: oppId,
        status: 'to_contact',
        priority: 'medium',
        desiredJobTitle: opportunityType === 'online_offer' ? opportunity.title : null,
        notes: '',
        outcomeSalary: null,
        outcomeFeedback: null,
      });

      toast.success(opportunityType === 'hidden_market' 
        ? 'Entreprise ajoutée au CRM' 
        : 'Offre ajoutée au CRM'
      );
    };

  // Format relative time
  const formatRelativeTime = (date: Date | null) => {
    if (!date) return '-';
    const now = new Date();
    const diffMs = now.getTime() - new Date(date).getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return "Il y a moins d'une heure";
    if (diffHours < 24) return `Il y a ${diffHours} heure${diffHours > 1 ? 's' : ''}`;
    if (diffDays < 7) return `Il y a ${diffDays} jour${diffDays > 1 ? 's' : ''}`;
    return 'Il y a plus d\'une semaine';
  };

  // Get logo color based on company name
  const getLogoColor = (companyName: string) => {
    const colors = [
      'bg-red-500',
      'bg-slate-900',
      'bg-green-500',
      'bg-amber-500',
      'bg-pink-500',
      'bg-indigo-600',
      'bg-cyan-500',
      'bg-purple-500',
    ];
    const index = companyName.charCodeAt(0) % colors.length;
    return colors[index];
  };

  // Check if rhythm matches user's rhythm
  const doesRhythmMatch = (oppRhythm: string | null) => {
    if (!oppRhythm || !currentUser?.rhythm) return false;
    return oppRhythm === currentUser.rhythm;
  };

  const hasResults = filteredOpportunities.length > 0;
  const isNoResultsState = !hasResults && (
    radarState.filters.search ||
    localFilters.domain ||
    localFilters.location ||
    localFilters.rhythm
  );

  const onlineOffersCount = Object.values(opportunities).filter(
    (opp) => opp.opportunityType === 'online_offer'
  ).length;

  const hiddenMarketCount = Object.values(opportunities).filter(
    (opp) => opp.opportunityType === 'hidden_market'
  ).length;

  return (
    <div className="w-full h-full flex font-sans bg-slate-50 dark:bg-slate-950 overflow-hidden relative">
      {/* Subtle background texture */}
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #0F172A 1px, transparent 0)`,
          backgroundSize: "24px 24px",
        }}
      />

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 flex flex-col p-8 z-10 overflow-hidden">
        {/* Top Bar */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-serif text-[28px] font-semibold text-slate-900 dark:text-slate-100 leading-tight">
              Radar
            </h1>
            <p className="text-[14px] text-slate-500 dark:text-slate-400 mt-1">
              Découvre les opportunités qui te correspondent
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 w-[260px]">
              <Icons.Search className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Rechercher..."
                className="flex-1 text-[13px] text-slate-900 dark:text-slate-100 placeholder:text-slate-400 bg-transparent focus:outline-none"
                onClick={() => toast('La recherche globale n\'est pas implémentée dans ce prototype.')}
              />
            </div>
            <div
              className="relative w-10 h-10 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors"
              onClick={() => toast('Pas de nouvelles notifications.')}
            >
              <Icons.Bell className="w-5 h-5 text-slate-500 dark:text-slate-400" />
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                3
              </span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 mb-6">
          <button
            onClick={() => setRadarTab('onlineOffers')}
            className={`px-5 py-2.5 rounded-xl text-[14px] font-medium flex items-center gap-2 cursor-pointer transition-all ${
              radarState.activeTab === 'onlineOffers'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-indigo-900/20'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-600 hover:text-indigo-600 dark:hover:text-indigo-400'
            }`}
          >
            <Icons.Globe className="w-4 h-4" />
            Offres en ligne
            <span
              className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                radarState.activeTab === 'onlineOffers'
                  ? 'bg-indigo-700 text-white'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-400'
              }`}
            >
              {onlineOffersCount}
            </span>
          </button>
          <button
            onClick={() => setRadarTab('hiddenMarket')}
            className={`px-5 py-2.5 rounded-xl text-[14px] font-medium flex items-center gap-2 cursor-pointer transition-all ${
              radarState.activeTab === 'hiddenMarket'
                ? 'bg-indigo-700 text-white shadow-lg shadow-indigo-200 dark:shadow-indigo-900/20'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-600 hover:text-indigo-600 dark:hover:text-indigo-400'
            }`}
          >
            <Icons.EyeOff className="w-4 h-4" />
            Marché caché
            <span
              className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                radarState.activeTab === 'hiddenMarket'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-400'
              }`}
            >
              {hiddenMarketCount}
            </span>
          </button>
        </div>

        {/* Filter Bar */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 flex items-center gap-2 px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
            <Icons.Search className="w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Poste, entreprise, mot-clé..."
              value={radarState.filters.search}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="flex-1 text-[14px] text-slate-900 dark:text-slate-100 placeholder:text-slate-400 bg-transparent focus:outline-none"
            />
          </div>
          
          {radarState.activeTab === 'onlineOffers' && (
            <>
              <FilterDropdown
                label="Domaine"
                icon={Icons.Briefcase}
                value={localFilters.domain}
                options={domainOptions}
                onChange={(value) => handleFilterChange('domain', value)}
              />
              <FilterDropdown
                label="Rythme"
                icon={Icons.Clock}
                value={localFilters.rhythm}
                options={rhythmOptions}
                onChange={(value) => handleFilterChange('rhythm', value)}
              />
            </>
          )}
          
          <FilterDropdown
            label="Localisation"
            icon={Icons.MapPin}
            value={localFilters.location}
            options={locationOptions}
            onChange={(value) => handleFilterChange('location', value)}
          />

          <button
            onClick={() => toast('Filtres avancés disponibles en Premium')}
            className="px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors relative"
            title="Filtres avancés (Premium)"
          >
            <Icons.SlidersHorizontal className="w-5 h-5" />
            <Icons.Lock className="absolute -top-1 -right-1 w-3 h-3 text-indigo-500" />
          </button>
        </div>

        {/* Results */}
        <AnimatePresence mode="wait">
          {isNoResultsState ? (
            <EmptyState key="empty" onReset={handleResetFilters} />
          ) : radarState.activeTab === 'hiddenMarket' ? (
            <motion.div
              key="hidden"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="flex-1 overflow-auto"
            >
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                {/* Table header */}
                <div className="grid grid-cols-[1fr_160px_140px_120px] gap-4 px-6 py-4 bg-slate-50 dark:bg-slate-750 border-b border-slate-200 dark:border-slate-700">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Entreprise</span>
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Secteur</span>
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Localisation</span>
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider text-right">Action</span>
                </div>

                {/* Table rows */}
                <div className="divide-y divide-slate-100 dark:divide-slate-700">
                  {filteredOpportunities.map((opp, index) => (
                    <motion.div
                      key={opp.id}
                      custom={index}
                      variants={rowVariants}
                      initial="hidden"
                      animate="visible"
                      className="grid grid-cols-[1fr_160px_140px_120px] gap-4 px-6 py-4 items-center hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg ${getLogoColor(opp.companyName)} flex items-center justify-center flex-shrink-0 shadow-sm`}>
                          <span className="text-white font-bold text-[13px]">
                            {opp.companyName[0].toUpperCase()}
                          </span>
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-[14px] font-semibold text-slate-900 dark:text-slate-100 truncate">
                              {opp.companyName}
                            </p>
                            <span className="px-2 py-0.5 rounded-full bg-indigo-700 text-white text-[10px] font-medium flex-shrink-0">
                              Spontanée
                            </span>
                          </div>
                          <p className="text-[12px] text-slate-500 dark:text-slate-400">Candidature spontanée</p>
                        </div>
                      </div>
                      <span className="text-[13px] text-slate-600 dark:text-slate-400">{opp.industry}</span>
                      <span className="text-[13px] text-slate-600 dark:text-slate-400">{opp.location}</span>
                      <div className="text-right">
                        <button
                          onClick={() => handleAddToCRM(opp.id, 'hidden_market')}
                          className="px-3 py-1.5 rounded-lg bg-indigo-700 text-white text-[12px] font-medium flex items-center gap-1.5 ml-auto hover:bg-indigo-800 transition-colors opacity-0 group-hover:opacity-100 shadow-sm"
                        >
                          <Icons.Plus className="w-3.5 h-3.5" />
                          CRM
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="online"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="flex-1 overflow-auto"
            >
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                {/* Table header */}
                <div className="grid grid-cols-[1fr_140px_140px_140px_120px] gap-4 px-6 py-4 bg-slate-50 dark:bg-slate-750 border-b border-slate-200 dark:border-slate-700">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Poste & Entreprise</span>
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Ville</span>
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Rythme</span>
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Publié</span>
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider text-right">Action</span>
                </div>

                {/* Table rows */}
                <div className="divide-y divide-slate-100 dark:divide-slate-700">
                  {filteredOpportunities.map((opp, index) => (
                    <motion.div
                      key={opp.id}
                      custom={index}
                      variants={rowVariants}
                      initial="hidden"
                      animate="visible"
                      className="grid grid-cols-[1fr_140px_140px_140px_120px] gap-4 px-6 py-4 items-center hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg ${getLogoColor(opp.companyName)} flex items-center justify-center flex-shrink-0 shadow-sm`}>
                          <span className="text-white font-bold text-[13px]">
                            {opp.companyName[0].toUpperCase()}
                          </span>
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-[14px] font-semibold text-slate-900 dark:text-slate-100 truncate">
                              {opp.title}
                            </p>
                            {doesRhythmMatch(opp.rhythmRequired) && (
                              <span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-[10px] font-medium flex-shrink-0 flex items-center gap-1">
                                <Icons.Check className="w-2.5 h-2.5" />
                                Match rythme
                              </span>
                            )}
                          </div>
                          <p className="text-[12px] text-slate-500 dark:text-slate-400">{opp.companyName}</p>
                        </div>
                      </div>
                      <span className="text-[13px] text-slate-600 dark:text-slate-400">{opp.location}</span>
                      <span className="text-[13px] text-slate-600 dark:text-slate-400">{opp.rhythmRequired || '-'}</span>
                      <span className="text-[13px] text-slate-400 dark:text-slate-500">{formatRelativeTime(opp.publishedAt)}</span>
                      <div className="text-right">
                        <button
                          onClick={() => handleAddToCRM(opp.id, 'online_offer')}
                          className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-[12px] font-medium flex items-center gap-1.5 ml-auto hover:bg-indigo-700 transition-colors opacity-0 group-hover:opacity-100 shadow-sm"
                        >
                          <Icons.Plus className="w-3.5 h-3.5" />
                          CRM
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Pagination */}
                {filteredOpportunities.length > 0 && (
                  <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 dark:border-slate-700">
                    <span className="text-[13px] text-slate-500 dark:text-slate-400">
                      Affichage de 1-{filteredOpportunities.length} sur {filteredOpportunities.length}
                    </span>
                    <div className="flex items-center gap-2">
                      <button className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-400 dark:text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors disabled:opacity-50" disabled>
                        <Icons.ChevronLeft className="w-4 h-4" />
                      </button>
                      <button className="w-8 h-8 rounded-lg bg-indigo-600 text-white text-[13px] font-medium flex items-center justify-center">
                        1
                      </button>
                      <button className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 text-[13px] font-medium flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors disabled:opacity-50" disabled>
                        2
                      </button>
                      <button className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-400 dark:text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors disabled:opacity-50" disabled>
                        <Icons.ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Decorative accent */}
      <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-indigo-600 opacity-[0.03] dark:opacity-[0.05] rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
    </div>
  );
}