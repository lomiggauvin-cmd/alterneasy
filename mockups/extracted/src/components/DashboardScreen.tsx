import React, { useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as Icons from "lucide-react";
import { useStore } from "../stores/store";
import { Candidature } from "../types";
import toast from "react-hot-toast";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function todayISO(): string {
  return new Date().toISOString().split("T")[0];
}

function fmtDate(iso: string | null): string {
  if (!iso) return "—";
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

function matchesRelancerFilter(c: Candidature): boolean {
  return c.statut === "À relancer" || (!!c.dateRelancePrevue && c.dateRelancePrevue <= todayISO());
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

const Sidebar: React.FC = () => {
  const { currentScreen, navigateTo, isDarkMode, toggleDarkMode, currentUser, openModal } = useStore();

  const navItems = [
    { id: "dashboard",        icon: Icons.LayoutDashboard, screen: "dashboard"        as const },
    { id: "pipeline",         icon: Icons.Kanban,          screen: "pipeline"         as const },
    { id: "contacts",         icon: Icons.Users,           screen: "contacts"         as const },
    { id: "messageGenerator", icon: Icons.MessageSquare,   screen: "messageGenerator" as const },
  ];

  return (
    <aside className="w-[72px] h-full bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex flex-col items-center py-6 z-20 flex-shrink-0 transition-colors duration-300">
      <motion.div
        className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center mb-8 shadow-lg shadow-indigo-200 dark:shadow-none cursor-pointer"
        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
        onClick={() => navigateTo("dashboard")}
      >
        <Icons.Zap className="w-5 h-5 text-white" />
      </motion.div>

      <nav className="flex flex-col gap-2">
        {navItems.map((item, index) => (
          <motion.button
            key={item.id}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
              currentScreen === item.screen
                ? "bg-indigo-600 shadow-md shadow-indigo-200 dark:shadow-none"
                : "bg-slate-100 dark:bg-slate-700/50 hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={() => navigateTo(item.screen)}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <item.icon
              className={`w-5 h-5 ${
                currentScreen === item.screen ? "text-white" : "text-slate-600 dark:text-slate-400"
              }`}
            />
          </motion.button>
        ))}
      </nav>

      <div className="mt-auto flex flex-col gap-3 items-center">
        <motion.button
          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
            isDarkMode ? "bg-indigo-600" : "bg-slate-100 dark:bg-slate-700/50 hover:bg-slate-200 dark:hover:bg-slate-700"
          }`}
          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          onClick={toggleDarkMode}
        >
          {isDarkMode
            ? <Icons.Sun className="w-5 h-5 text-white" />
            : <Icons.Moon className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          }
        </motion.button>

        <motion.button
          className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-700/50 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          onClick={() => navigateTo("profileSettings")}
        >
          <Icons.Settings className="w-5 h-5 text-slate-600 dark:text-slate-400" />
        </motion.button>

        <motion.button
          className="w-10 h-10 rounded-full bg-indigo-400 flex items-center justify-center shadow-md cursor-pointer"
          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          onClick={() => navigateTo("profile")}
          title="Mon profil"
        >
          <span className="text-[13px] font-bold text-white">
            {currentUser?.firstName?.charAt(0)}{currentUser?.lastName?.charAt(0)}
          </span>
        </motion.button>

        {currentUser?.subscriptionTier === "free" && (
          <motion.button
            className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg cursor-pointer"
            whileHover={{ scale: 1.05, rotate: 180 }} whileTap={{ scale: 0.95 }}
            onClick={() => openModal("upgrade")}
          >
            <Icons.Crown className="w-5 h-5 text-white" />
          </motion.button>
        )}
      </div>
    </aside>
  );
};

// ─── TopBar ───────────────────────────────────────────────────────────────────

const TopBar: React.FC = () => {
  const { currentUser } = useStore();
  const userRhythm = useStore((s) => s.userPreferences.rhythm);

  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="font-['Fraunces'] text-[32px] font-semibold text-slate-900 dark:text-white leading-tight">
          Bonjour, {currentUser?.firstName || "Utilisateur"}
        </h1>
        <p className="text-[14px] text-slate-600 dark:text-slate-400 mt-1.5 flex items-center gap-2">
          {userRhythm ? (
            <>
              Rythme :{" "}
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-[12px] font-medium">
                <Icons.Clock className="w-3.5 h-3.5" />
                {userRhythm}
              </span>
            </>
          ) : (
            "Bienvenue dans ton espace candidatures"
          )}
        </p>
      </div>
      <motion.button
        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
        onClick={() => toast("Pas de nouvelles notifications.")}
        className="relative w-10 h-10 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
      >
        <Icons.Bell className="w-5 h-5 text-slate-600 dark:text-slate-400" />
      </motion.button>
    </div>
  );
};

// ─── KPICards ─────────────────────────────────────────────────────────────────

const KPICards: React.FC = () => {
  const { candidatures, navigateTo } = useStore();
  const today = todayISO();
  const all = Object.values(candidatures);

  const kpis = [
    {
      id:          "total",
      label:       "Candidatures",
      icon:        Icons.Send,
      iconBg:      "bg-indigo-50 dark:bg-indigo-900/30",
      iconColor:   "text-indigo-600 dark:text-indigo-400",
      value:       all.length,
      subtext:     "dans le pipeline",
      subtextIcon: Icons.Kanban,
      subtextColor:"text-indigo-500 dark:text-indigo-400",
      onClick:     () => navigateTo("pipeline"),
    },
    {
      id:          "relances",
      label:       "Relances à faire",
      icon:        Icons.Bell,
      iconBg:      "bg-amber-50 dark:bg-amber-900/30",
      iconColor:   "text-amber-500",
      value:       all.filter(matchesRelancerFilter).length,
      subtext:     "en attente ou en retard",
      subtextIcon: Icons.AlertCircle,
      subtextColor:"text-amber-600 dark:text-amber-400",
      onClick:     () => navigateTo("pipeline"),
    },
    {
      id:          "contactes",
      label:       "En discussion",
      icon:        Icons.MessageCircle,
      iconBg:      "bg-blue-50 dark:bg-blue-900/30",
      iconColor:   "text-blue-600 dark:text-blue-400",
      value:       all.filter((c) => c.statut === "Contacté").length,
      subtext:     "statut Contacté",
      subtextIcon: Icons.CheckCircle2,
      subtextColor:"text-blue-500 dark:text-blue-400",
      onClick:     () => navigateTo("pipeline"),
    },
    {
      id:          "positives",
      label:       "Réponses positives",
      icon:        Icons.ThumbsUp,
      iconBg:      "bg-emerald-50 dark:bg-emerald-900/30",
      iconColor:   "text-emerald-600 dark:text-emerald-400",
      value:       all.filter((c) => c.statut === "Réponse positive").length,
      subtext:     "offres reçues",
      subtextIcon: Icons.Star,
      subtextColor:"text-emerald-600 dark:text-emerald-400",
      onClick:     () => navigateTo("pipeline"),
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-4 mb-6">
      {kpis.map((kpi, index) => (
        <motion.div
          key={kpi.id}
          className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all cursor-pointer"
          whileHover={{ y: -2 }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          onClick={kpi.onClick}
        >
          <div className="flex items-center gap-2 mb-3">
            <div className={`w-8 h-8 rounded-lg ${kpi.iconBg} flex items-center justify-center`}>
              <kpi.icon className={`w-4 h-4 ${kpi.iconColor}`} />
            </div>
            <span className="text-[12px] font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wide">
              {kpi.label}
            </span>
          </div>
          <p className="font-['Fraunces'] text-[36px] font-semibold text-slate-900 dark:text-white leading-none">
            {kpi.value}
          </p>
          <p className={`text-[12px] mt-2 font-medium flex items-center gap-1 ${kpi.subtextColor}`}>
            <kpi.subtextIcon className="w-3 h-3" />
            {kpi.subtext}
          </p>
        </motion.div>
      ))}
    </div>
  );
};

// ─── RelancesWidget ───────────────────────────────────────────────────────────

const STATUT_DOT: Record<string, string> = {
  "À contacter":     "bg-slate-400",
  "Contacté":        "bg-blue-500",
  "Réponse positive":"bg-emerald-500",
  "Réponse négative":"bg-red-400",
  "À relancer":      "bg-amber-500",
};

const RelancesWidget: React.FC = () => {
  const { candidatures, navigateTo } = useStore();
  const today = todayISO();

  const relances = useMemo(() => {
    return Object.values(candidatures)
      .filter(matchesRelancerFilter)
      .sort((a, b) => {
        const da = a.dateRelancePrevue ?? "9999-99-99";
        const db = b.dateRelancePrevue ?? "9999-99-99";
        return da.localeCompare(db);
      });
  }, [candidatures]);

  return (
    <div className="flex-1 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center">
            <Icons.Bell className="w-4 h-4 text-amber-500" />
          </div>
          <div>
            <h2 className="font-['Fraunces'] text-[18px] font-semibold text-slate-900 dark:text-white">
              Relances en attente
            </h2>
            <p className="text-[12px] text-slate-500 dark:text-slate-400">
              {relances.length} candidature{relances.length !== 1 ? "s" : ""} à traiter
            </p>
          </div>
        </div>
        {relances.length > 0 && (
          <span className="px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-[12px] font-semibold">
            {relances.filter((c) => c.dateRelancePrevue && c.dateRelancePrevue < today).length} en retard
          </span>
        )}
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
        <AnimatePresence mode="popLayout">
          {relances.slice(0, 8).map((c, index) => {
            const isOverdue = !!c.dateRelancePrevue && c.dateRelancePrevue < today;
            return (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ delay: index * 0.04 }}
                className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer hover:shadow-md transition-all ${
                  isOverdue
                    ? "bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800"
                    : "bg-slate-50 dark:bg-slate-900/30 border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-600"
                }`}
                whileHover={{ x: 3 }}
                onClick={() => navigateTo("pipeline")}
              >
                <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${STATUT_DOT[c.statut] ?? "bg-slate-400"}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold text-slate-900 dark:text-white truncate">
                    {c.entreprise}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                    {c.posteVise}{c.contactNom ? ` · ${c.contactNom}` : ""}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  {c.dateRelancePrevue ? (
                    <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${
                      isOverdue
                        ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                        : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400"
                    }`}>
                      {fmtDate(c.dateRelancePrevue)}
                    </span>
                  ) : (
                    <span className="text-[11px] text-slate-400 dark:text-slate-500">Sans date</span>
                  )}
                </div>
                <Icons.ChevronRight className="w-4 h-4 text-slate-400 dark:text-slate-600 flex-shrink-0" />
              </motion.div>
            );
          })}
        </AnimatePresence>

        {relances.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-12 gap-3"
          >
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center">
              <Icons.CheckCircle2 className="w-8 h-8 text-emerald-500" />
            </div>
            <p className="text-[15px] font-semibold text-slate-700 dark:text-slate-300">
              Tout est à jour !
            </p>
            <p className="text-[12px] text-slate-500 dark:text-slate-500 text-center">
              Aucune relance en attente ni en retard
            </p>
          </motion.div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-slate-100 dark:border-slate-700">
        <button
          onClick={() => navigateTo("pipeline")}
          className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-[13px] font-medium hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
        >
          Ouvrir le pipeline →
        </button>
      </div>
    </div>
  );
};

// ─── QuickActionsWidget ───────────────────────────────────────────────────────

const QuickActionsWidget: React.FC = () => {
  const { navigateTo, candidatures } = useStore();
  const all = Object.values(candidatures);
  const today = todayISO();

  const stats: Array<{ label: string; count: number; color: string; dot: string }> = [
    { label: "À contacter",      count: all.filter((c) => c.statut === "À contacter").length,     color: "text-slate-600 dark:text-slate-400",   dot: "bg-slate-400" },
    { label: "Contacté",         count: all.filter((c) => c.statut === "Contacté").length,         color: "text-blue-600 dark:text-blue-400",     dot: "bg-blue-500" },
    { label: "Réponse positive", count: all.filter((c) => c.statut === "Réponse positive").length, color: "text-emerald-600 dark:text-emerald-400", dot: "bg-emerald-500" },
    { label: "Réponse négative", count: all.filter((c) => c.statut === "Réponse négative").length, color: "text-red-500 dark:text-red-400",       dot: "bg-red-400" },
    { label: "À relancer",       count: all.filter((c) => c.statut === "À relancer").length,       color: "text-amber-600 dark:text-amber-400",   dot: "bg-amber-500" },
  ];

  const actions = [
    {
      icon: Icons.Upload,
      label: "Importer des contacts",
      desc:  "Depuis un export Apollo CSV",
      screen: "import" as const,
      bg:   "bg-sky-50 dark:bg-sky-900/20",
      iconColor: "text-sky-600 dark:text-sky-400",
    },
    {
      icon: Icons.MessageSquare,
      label: "Générer un message",
      desc:  "IA personnalisée par l'IA",
      screen: "messageGenerator" as const,
      bg:   "bg-violet-50 dark:bg-violet-900/20",
      iconColor: "text-violet-600 dark:text-violet-400",
    },
    {
      icon: Icons.Kanban,
      label: "Voir le pipeline",
      desc:  "Kanban & tableau",
      screen: "pipeline" as const,
      bg:   "bg-indigo-50 dark:bg-indigo-900/20",
      iconColor: "text-indigo-600 dark:text-indigo-400",
    },
  ];

  return (
    <div className="w-[320px] flex flex-col gap-4 flex-shrink-0">
      {/* Quick actions */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-4">
        <h2 className="font-['Fraunces'] text-[16px] font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
          <Icons.Zap className="w-4 h-4 text-indigo-500" />
          Actions rapides
        </h2>
        <div className="space-y-2">
          {actions.map((action) => (
            <motion.button
              key={action.screen}
              whileHover={{ x: 4 }} whileTap={{ scale: 0.98 }}
              onClick={() => navigateTo(action.screen)}
              className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors text-left"
            >
              <div className={`w-9 h-9 rounded-xl ${action.bg} flex items-center justify-center flex-shrink-0`}>
                <action.icon className={`w-4.5 h-4.5 w-5 h-5 ${action.iconColor}`} />
              </div>
              <div>
                <p className="text-[13px] font-semibold text-slate-800 dark:text-slate-200">{action.label}</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">{action.desc}</p>
              </div>
              <Icons.ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600 ml-auto flex-shrink-0" />
            </motion.button>
          ))}
        </div>
      </div>

      {/* Pipeline stats */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-4">
        <h2 className="font-['Fraunces'] text-[16px] font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
          <Icons.BarChart2 className="w-4 h-4 text-indigo-500" />
          Répartition pipeline
        </h2>
        <div className="space-y-2">
          {stats.map((s) => (
            <div key={s.label} className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full flex-shrink-0 ${s.dot}`} />
              <span className="text-[12px] text-slate-600 dark:text-slate-400 flex-1 truncate">{s.label}</span>
              <span className={`text-[13px] font-bold tabular-nums ${s.color}`}>{s.count}</span>
            </div>
          ))}
        </div>
        {all.length === 0 && (
          <p className="text-[12px] text-slate-400 dark:text-slate-500 text-center py-3">
            Aucune candidature
          </p>
        )}
      </div>
    </div>
  );
};

// ─── DashboardScreen ──────────────────────────────────────────────────────────

export default function DashboardScreen() {
  const { currentUser, currentScreen } = useStore();

  const streakInitialized = React.useRef(false);
  useEffect(() => {
    if (currentUser && currentScreen === "dashboard" && !streakInitialized.current) {
      streakInitialized.current = true;
      const { incrementStreak, checkAndResetDailyEmailLimit } = useStore.getState();
      incrementStreak();
      checkAndResetDailyEmailLimit();
    }
  }, [currentUser?.id, currentScreen]);

  return (
    <div className="w-full h-full flex font-['Plus_Jakarta_Sans'] bg-slate-50 dark:bg-slate-900 overflow-hidden relative transition-colors duration-300">
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{ backgroundImage: `radial-gradient(circle at 1px 1px, #0F172A 1px, transparent 0)`, backgroundSize: "24px 24px" }}
      />

      <Sidebar />

      <main className="flex-1 flex flex-col p-8 z-10 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col h-full"
        >
          <TopBar />
          <KPICards />

          <div className="flex gap-5 flex-1 min-h-0 overflow-hidden">
            <RelancesWidget />
            <QuickActionsWidget />
          </div>
        </motion.div>
      </main>

      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-600 opacity-[0.03] dark:opacity-[0.05] rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
      <div className="absolute bottom-0 left-[72px] w-[300px] h-[300px] bg-amber-400 opacity-[0.04] dark:opacity-[0.02] rounded-full blur-3xl translate-y-1/3 pointer-events-none" />
    </div>
  );
}
