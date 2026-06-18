import { create } from 'zustand';
import {
  User,
  CV,
  Opportunity,
  Application,
  Email,
  Task,
  AppState,
  ModalType,
  RadarState,
  ColdEmailStudioState,
  SettingsState,
  EmailTemplate,
  ApplicationStatus,
  UserPreferences,
  Candidature,
  CandidatureStatut,
  Contact,
  StudentProfile,
  DomaineType,
} from '../types';

// ── localStorage helpers ──────────────────────────────────────────────────────
const PREFS_KEY           = 'tandem_user_preferences';
const CANDIDATURES_KEY    = 'tandem_candidatures';
const STUDENT_PROFILE_KEY = 'tandem_student_profile';

const DEFAULT_STUDENT_PROFILE: StudentProfile = {
  prenom: '',
  nom: '',
  ecole: '',
  domaine: '',
  ville: '',
  typePoste: '',
  periodeDebut: '',
  dureeRythme: '',
  cherche: '',
};

// Mapping des noms d'affichage onboarding → DomaineType NAF
const ONBOARDING_TO_DOMAINE: Record<string, DomaineType> = {
  'Audiovisuel':           'audiovisuel',
  'Commerce/Vente':        'commerce',
  'Marketing Digital':     'marketing',
  'Ingénierie':            'ingénierie',
};
function mapOnboardingDomain(displayDomains: string[]): DomaineType | '' {
  for (const d of displayDomains) {
    const found = ONBOARDING_TO_DOMAINE[d];
    if (found) return found;
  }
  return displayDomains.length > 0 ? 'autre' : '';
}

function loadStudentProfileFromStorage(): StudentProfile {
  try {
    const raw = localStorage.getItem(STUDENT_PROFILE_KEY);
    if (raw) {
      const stored = JSON.parse(raw) as Record<string, string>;
      // Migration from old shape (nom=full name, secteur, periodeAlternance)
      return {
        prenom:        stored.prenom        ?? stored.nom?.split(' ')[0] ?? '',
        nom:           stored.nom?.includes(' ') ? stored.nom.split(' ').slice(1).join(' ') : (stored.nom ?? ''),
        ecole:         stored.ecole         ?? '',
        domaine:       (stored.domaine      ?? stored.secteur ?? '') as DomaineType | '',
        ville:         stored.ville         ?? '',
        typePoste:     stored.typePoste     ?? '',
        periodeDebut:  stored.periodeDebut  ?? stored.periodeAlternance ?? '',
        dureeRythme:   stored.dureeRythme   ?? '',
        cherche:       stored.cherche       ?? '',
      };
    }
  } catch { /* ignore */ }
  return DEFAULT_STUDENT_PROFILE;
}

function saveStudentProfileToStorage(p: StudentProfile): void {
  try { localStorage.setItem(STUDENT_PROFILE_KEY, JSON.stringify(p)); } catch { /* ignore */ }
}

function loadCandidaturesFromStorage(): Record<string, Candidature> | null {
  try {
    const raw = localStorage.getItem(CANDIDATURES_KEY);
    if (raw) {
      const data = JSON.parse(raw) as Record<string, Candidature>;
      // Purge les IDs mock (cand-1 à cand-99) laissés par la maquette
      const real = Object.fromEntries(
        Object.entries(data).filter(([id]) => !/^cand-\d+$/.test(id))
      );
      if (Object.keys(real).length !== Object.keys(data).length) {
        localStorage.setItem(CANDIDATURES_KEY, JSON.stringify(real));
      }
      return Object.keys(real).length ? real : null;
    }
  } catch { /* ignore */ }
  return null;
}

function saveCandidaturesToStorage(data: Record<string, Candidature>): void {
  try {
    localStorage.setItem(CANDIDATURES_KEY, JSON.stringify(data));
  } catch { /* ignore */ }
}

const CONTACTS_KEY        = 'tandem_contacts';
const DISMISSED_SIRENS_KEY = 'tandem_dismissed_sirens';

function loadDismissedSirensFromStorage(): string[] {
  try {
    const raw = localStorage.getItem(DISMISSED_SIRENS_KEY);
    if (raw) return JSON.parse(raw) as string[];
  } catch { /* ignore */ }
  return [];
}

function saveDismissedSirensToStorage(sirens: string[]): void {
  try { localStorage.setItem(DISMISSED_SIRENS_KEY, JSON.stringify(sirens)); } catch { /* ignore */ }
}

function loadContactsFromStorage(): Record<string, Contact> {
  try {
    const raw = localStorage.getItem(CONTACTS_KEY);
    if (raw) return JSON.parse(raw) as Record<string, Contact>;
  } catch { /* ignore */ }
  return {};
}

function saveContactsToStorage(data: Record<string, Contact>): void {
  try { localStorage.setItem(CONTACTS_KEY, JSON.stringify(data)); } catch { /* ignore */ }
}

function loadPrefsFromStorage(): UserPreferences {
  try {
    const raw = localStorage.getItem(PREFS_KEY);
    if (raw) return JSON.parse(raw) as UserPreferences;
  } catch { /* ignore */ }
  return { domains: [], rhythm: '', locations: [], onboardingDone: false };
}

function savePrefsToStorage(prefs: UserPreferences): void {
  try {
    localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
  } catch { /* ignore */ }
}
import {
  mockUsers,
  mockCVs,
  mockOpportunities,
  mockApplications,
  mockEmails,
  mockTasks,
} from './mockData';

// Email Templates
const emailTemplates: EmailTemplate[] = [
  {
    id: 'template-spontaneous',
    name: 'Candidature spontanée',
    type: 'initial',
    subject: 'Candidature spontanée - [Poste_Souhaité]',
    body: 'Bonjour [Nom_Recruteur],\n\nJe suis actuellement étudiant en [Domaine] à [École] et je recherche une alternance.\n\nVotre entreprise, [Nom_Entreprise], m\'intéresse particulièrement car...\n\nJe vous joins mon CV et reste à votre disposition pour échanger.\n\nCordialement,\n[Prénom] [Nom]',
    variables: ['Nom_Recruteur', 'Poste_Souhaité', 'Domaine', 'École', 'Nom_Entreprise', 'Prénom', 'Nom'],
  },
  {
    id: 'template-offer-response',
    name: 'Réponse à une offre',
    type: 'initial',
    subject: 'Candidature - [Poste]',
    body: 'Bonjour [Nom_Recruteur],\n\nJe vous adresse ma candidature pour le poste de [Poste] chez [Nom_Entreprise], référencé sur [Plateforme].\n\nMon profil en [Domaine] correspond parfaitement aux attentes du poste...\n\nJe vous joins mon CV et reste à votre disposition pour un entretien.\n\nCordialement,\n[Prénom] [Nom]',
    variables: ['Nom_Recruteur', 'Poste', 'Nom_Entreprise', 'Plateforme', 'Domaine', 'Prénom', 'Nom'],
  },
  {
    id: 'template-followup',
    name: 'Relance (1ère)',
    type: 'follow_up',
    subject: 'Relance - Candidature [Poste]',
    body: 'Bonjour [Nom_Recruteur],\n\nJe reviens vers vous concernant ma candidature pour le poste de [Poste] envoyée le [Date_Envoi].\n\nJe suis toujours très intéressé par cette opportunité chez [Nom_Entreprise] et souhaiterais savoir où en est le processus.\n\nDans l\'attente de votre retour,\n\nCordialement,\n[Prénom] [Nom]',
    variables: ['Nom_Recruteur', 'Poste', 'Date_Envoi', 'Nom_Entreprise', 'Prénom', 'Nom'],
  },
];

interface StoreState {
  // Current user
  currentUser: User | null;

  // Entity collections (normalized maps)
  users: Record<string, User>;
  cvs: Record<string, CV>;
  opportunities: Record<string, Opportunity>;
  applications: Record<string, Application>;
  emails: Record<string, Email>;
  tasks: Record<string, Task>;

  // Navigation state
  currentScreen: AppState;
  previousScreen: AppState | null;

  // Global UI state
  currentModal: ModalType;
  modalData: Record<string, unknown> | null;

  // Radar-specific state
  radarState: RadarState;

  // Cold Email Studio state
  coldEmailStudioState: ColdEmailStudioState;
  emailTemplates: EmailTemplate[];

  // Settings state
  settingsState: SettingsState;

  // Dark mode
  isDarkMode: boolean;

  // User preferences (onboarding)
  userPreferences: UserPreferences;

  // ========== Actions ==========

  // Navigation actions
  navigateTo: (screen: AppState) => void;
  goBack: () => void;

  // Modal actions
  openModal: (modalType: ModalType, data?: Record<string, unknown>) => void;
  closeModal: () => void;

  // Onboarding preferences
  setUserPreferences: (prefs: Partial<UserPreferences>) => void;
  completeOnboarding2: (domains: string[], rhythm: string, locations: string[]) => void;

  // User actions
  setCurrentUser: (user: User | null) => void;
  addUser: (user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) => string;
  updateUser: (userId: string, updates: Partial<User>) => void;
  completeOnboarding: (domain: User['domain'], rhythm: User['rhythm'], location: string) => void;
  incrementDailyEmails: () => void;
  checkAndResetDailyEmailLimit: () => void;
  incrementStreak: () => void;

  // CV actions
  addCV: (cv: Omit<CV, 'id' | 'createdAt'>) => string;
  updateCV: (cvId: string, updates: Partial<CV>) => void;
  deleteCV: (cvId: string) => void;

  // Opportunity actions
  addOpportunity: (opportunity: Omit<Opportunity, 'id' | 'createdAt'>) => string;
  updateOpportunity: (opportunityId: string, updates: Partial<Opportunity>) => void;

  // Application actions
  addApplication: (application: Omit<Application, 'id' | 'createdAt' | 'updatedAt'>) => string;
  updateApplication: (applicationId: string, updates: Partial<Application>) => void;
  updateApplicationStatus: (applicationId: string, status: ApplicationStatus) => void;
  saveApplicationOutcome: (applicationId: string, outcome: 'offer' | 'rejected', salary?: string, feedback?: string) => void;
  deleteApplication: (applicationId: string) => void;

  // Email actions
  addEmail: (email: Omit<Email, 'id' | 'createdAt'>) => string;
  updateEmail: (emailId: string, updates: Partial<Email>) => void;

  // Task actions
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => string;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;
  toggleTaskComplete: (taskId: string) => void;

  // Radar actions
  setRadarTab: (tab: 'onlineOffers' | 'hiddenMarket') => void;
  setRadarFilters: (filters: Partial<RadarState['filters']>) => void;
  resetRadarFilters: () => void;

  // Cold Email Studio actions
  setSelectedTemplate: (templateId: string | null, applicationId?: string) => void;
  setSelectedCV: (cvId: string | null) => void;
  setEmailSubject: (subject: string) => void;
  setEmailBody: (body: string) => void;
  toggleFollowUp: () => void;
  resetEmailStudio: () => void;

  // Settings actions
  setSettingsTab: (tab: 'cvs' | 'account' | 'subscription') => void;

  // Dark mode action
  toggleDarkMode: () => void;

  // Dashboard KPI helpers
  getTotalApplicationsSent: () => number;
  getInterviewsCount: () => number;
  getOffersCount: () => number;
  getActiveTasksCount: () => number;

  // Candidatures (nouveau modèle Pipeline Sprint 2)
  candidatures: Record<string, Candidature>;
  addCandidature: (c: Omit<Candidature, 'id' | 'createdAt'>) => string;
  updateCandidature: (id: string, updates: Partial<Omit<Candidature, 'id' | 'createdAt'>>) => void;
  deleteCandidature: (id: string) => void;

  // Profil étudiant (Ticket 3)
  studentProfile: StudentProfile;
  setStudentProfile: (updates: Partial<StudentProfile>) => void;

  // Contacts (marché caché — import CSV)
  contacts: Record<string, Contact>;
  addContact: (c: Omit<Contact, 'id' | 'createdAt'>) => string;
  markContactAdded: (id: string, candidatureId: string) => void;
  dismissContact: (id: string) => void;
  restoreContact: (id: string) => void;

  // SIRENs ignorés (résultats API recherche entreprises)
  dismissedSirens: string[];
  dismissSiren: (siren: string) => void;
  restoreSiren: (siren: string) => void;

  // Générateur de messages — candidature pré-sélectionnée (pont Pipeline → MessageGenerator)
  messageGeneratorCandidatureId: string | null;
  preselectCandidature: (id: string | null) => void;

  // Helper: Generate ID
  generateId: () => string;
}

const initialRadarState: RadarState = {
  activeTab: 'onlineOffers',
  filters: {
    search: '',
    domain: '',
    location: '',
    rhythm: '',
  },
};

const initialColdEmailStudioState: ColdEmailStudioState = {
  selectedTemplateId: null,
  selectedCVId: null,
  subject: '',
  body: '',
  followUpScheduled: false,
};

const initialSettingsState: SettingsState = {
  activeTab: 'cvs',
};

export const useStore = create<StoreState>((set, get) => ({
  // Initial state with mock data
  currentUser: mockUsers['user-1'],
  users: mockUsers,
  cvs: mockCVs,
  opportunities: mockOpportunities,
  applications: mockApplications,
  emails: mockEmails,
  tasks: mockTasks,

  // Navigation
  currentScreen: 'dashboard',
  previousScreen: null,

  // Global UI
  currentModal: 'none',
  modalData: null,

  // Radar
  radarState: initialRadarState,

  // Cold Email Studio
  coldEmailStudioState: initialColdEmailStudioState,
  emailTemplates,

  // Settings
  settingsState: initialSettingsState,

  // Candidatures — chargées depuis localStorage, vide pour un nouveau compte
  candidatures: loadCandidaturesFromStorage() ?? {},

  // Contacts (marché caché) — chargés depuis localStorage
  contacts: loadContactsFromStorage(),

  // SIRENs ignorés (API recherche entreprises)
  dismissedSirens: loadDismissedSirensFromStorage(),

  // Profil étudiant — chargé depuis localStorage
  studentProfile: loadStudentProfileFromStorage(),

  // User preferences (onboarding) — loaded from localStorage for persistence across reloads
  userPreferences: loadPrefsFromStorage(),

  // Générateur de messages — aucune pré-sélection au démarrage
  messageGeneratorCandidatureId: null,

  // Dark mode
  isDarkMode: false,

  // ========== Actions ==========

  navigateTo: (screen) => {
    set((state) => ({
      currentScreen: screen,
      previousScreen: state.currentScreen,
    }));
  },

  goBack: () => {
    set((state) => {
      if (state.previousScreen) {
        return {
          currentScreen: state.previousScreen,
          previousScreen: null,
        };
      }
      return state;
    });
  },

  openModal: (modalType, data) => {
    set({
      currentModal: modalType,
      modalData: data ?? null,
    });
  },

  setUserPreferences: (partial) => {
    set((state) => {
      const updated = { ...state.userPreferences, ...partial };
      savePrefsToStorage(updated);
      return { userPreferences: updated };
    });
  },

  completeOnboarding2: (domains, rhythm, locations) => {
    const prefs: UserPreferences = { domains, rhythm, locations, onboardingDone: true };
    savePrefsToStorage(prefs);
    // Pont onboarding → studentProfile : domaine + ville deviennent la source de vérité
    const domaineMapped = mapOnboardingDomain(domains);
    const firstVille = locations[0] ?? '';
    set((state) => {
      const updatedProfile: StudentProfile = {
        ...state.studentProfile,
        ...(domaineMapped ? { domaine: domaineMapped } : {}),
        ...(firstVille    ? { ville:   firstVille   } : {}),
      };
      saveStudentProfileToStorage(updatedProfile);
      return { userPreferences: prefs, studentProfile: updatedProfile };
    });
  },

  closeModal: () => {
    set({
      currentModal: 'none',
      modalData: null,
    });
  },

    setCurrentUser: (user) => {
      set({ currentUser: user });
    },

    // Add a new user to the store and set as current user
    addUser: (userData) => {
      const id = get().generateId();
      const now = new Date();
      const user = {
        id,
        ...userData,
        createdAt: now,
        updatedAt: now,
      };
      set((state) => ({
        users: { ...state.users, [id]: user },
        currentUser: user,
      }));
      return id;
    },

  updateUser: (userId, updates) => {
    set((state) => ({
      users: {
        ...state.users,
        [userId]: { ...state.users[userId], ...updates },
      },
      currentUser:
        state.currentUser?.id === userId
          ? { ...state.currentUser, ...updates }
          : state.currentUser,
    }));
  },

  completeOnboarding: (domain, rhythm, location) => {
    const { currentUser } = get();
    if (currentUser) {
      get().updateUser(currentUser.id, {
        domain,
        rhythm,
        location,
      });
    }
  },

  incrementDailyEmails: () => {
    const { currentUser } = get();
    if (currentUser) {
      get().updateUser(currentUser.id, {
        dailyEmailsSent: currentUser.dailyEmailsSent + 1,
        lastEmailResetDate: new Date(),
      });
    }
  },

  checkAndResetDailyEmailLimit: () => {
    const { currentUser } = get();
    if (currentUser?.lastEmailResetDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const lastReset = new Date(currentUser.lastEmailResetDate);
      lastReset.setHours(0, 0, 0, 0);
      
      if (today.getTime() > lastReset.getTime()) {
        get().updateUser(currentUser.id, {
          dailyEmailsSent: 0,
          lastEmailResetDate: today,
        });
      }
    }
  },

  incrementStreak: () => {
    const { currentUser } = get();
    if (currentUser) {
      get().updateUser(currentUser.id, {
        streakCount: currentUser.streakCount + 1,
        lastLoginDate: new Date(),
      });
    }
  },

  addCV: (cvData) => {
    const id = get().generateId();
    const cv: CV = {
      ...cvData,
      id,
      createdAt: new Date(),
    };
    set((state) => ({
      cvs: { ...state.cvs, [id]: cv },
    }));
    return id;
  },

  updateCV: (cvId, updates) => {
    set((state) => ({
      cvs: {
        ...state.cvs,
        [cvId]: { ...state.cvs[cvId], ...updates },
      },
    }));
  },

  deleteCV: (cvId) => {
    set((state) => {
      const newCVs = { ...state.cvs };
      delete newCVs[cvId];
      return { cvs: newCVs };
    });
  },

  addOpportunity: (opportunityData) => {
    const id = get().generateId();
    const opportunity: Opportunity = {
      ...opportunityData,
      id,
      createdAt: new Date(),
    };
    set((state) => ({
      opportunities: { ...state.opportunities, [id]: opportunity },
    }));
    return id;
  },

  updateOpportunity: (opportunityId, updates) => {
    set((state) => ({
      opportunities: {
        ...state.opportunities,
        [opportunityId]: { ...state.opportunities[opportunityId], ...updates },
      },
    }));
  },

  addApplication: (applicationData) => {
    const id = get().generateId();
    const application: Application = {
      ...applicationData,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    set((state) => ({
      applications: { ...state.applications, [id]: application },
    }));
    return id;
  },

  updateApplication: (applicationId, updates) => {
    set((state) => ({
      applications: {
        ...state.applications,
        [applicationId]: {
          ...state.applications[applicationId],
          ...updates,
          updatedAt: new Date(),
        },
      },
    }));
  },

  updateApplicationStatus: (applicationId, status) => {
    const { applications, opportunities, addTask } = get();
    const application = applications[applicationId];
    
    // Update the application status
    get().updateApplication(applicationId, { status });

    // Auto-create task when status becomes "interview"
    if (status === 'interview' && application) {
      const opportunity = opportunities[application.opportunityId];
      const companyName = opportunity?.companyName || 'l\'entreprise';
      
      addTask({
        userId: application.userId,
        applicationId: applicationId,
        taskType: 'prepare_interview',
        title: `Préparer entretien chez ${companyName}`,
        description: `Réviser les questions techniques et préparer la présentation personnelle pour l'entretien chez ${companyName}.`,
        dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
        isCompleted: false,
        completedAt: null,
      });
    }
  },

  saveApplicationOutcome: (applicationId, outcome, salary, feedback) => {
    const status: ApplicationStatus = outcome === 'offer' ? 'offer' : 'rejected';
    get().updateApplication(applicationId, {
      status,
      outcomeSalary: salary || null,
      outcomeFeedback: feedback || null,
    });
  },

  deleteApplication: (applicationId) => {
    set((state) => {
      // Delete associated emails
      const newEmails = { ...state.emails };
      Object.values(newEmails).forEach((email) => {
        if (email.applicationId === applicationId) {
          delete newEmails[email.id];
        }
      });

      // Delete associated tasks
      const newTasks = { ...state.tasks };
      Object.values(newTasks).forEach((task) => {
        if (task.applicationId === applicationId) {
          delete newTasks[task.id];
        }
      });

      // Delete the application
      const newApplications = { ...state.applications };
      delete newApplications[applicationId];

      return {
        emails: newEmails,
        tasks: newTasks,
        applications: newApplications,
      };
    });
  },

  addEmail: (emailData) => {
    const id = get().generateId();
    const email: Email = {
      ...emailData,
      id,
      createdAt: new Date(),
    };
    set((state) => ({
      emails: { ...state.emails, [id]: email },
    }));
    return id;
  },

  updateEmail: (emailId, updates) => {
    set((state) => ({
      emails: {
        ...state.emails,
        [emailId]: { ...state.emails[emailId], ...updates },
      },
    }));
  },

  addTask: (taskData) => {
    const id = get().generateId();
    const task: Task = {
      ...taskData,
      id,
      createdAt: new Date(),
    };
    set((state) => ({
      tasks: { ...state.tasks, [id]: task },
    }));
    return id;
  },

  updateTask: (taskId, updates) => {
    set((state) => ({
      tasks: {
        ...state.tasks,
        [taskId]: { ...state.tasks[taskId], ...updates },
      },
    }));
  },

  deleteTask: (taskId) => {
    set((state) => {
      const newTasks = { ...state.tasks };
      delete newTasks[taskId];
      return { tasks: newTasks };
    });
  },

  toggleTaskComplete: (taskId) => {
    const task = get().tasks[taskId];
    if (task) {
      get().updateTask(taskId, {
        isCompleted: !task.isCompleted,
        completedAt: task.isCompleted ? null : new Date(),
      });
    }
  },

  setRadarTab: (tab) => {
    set((state) => ({
      radarState: { ...state.radarState, activeTab: tab },
    }));
  },

  setRadarFilters: (filters) => {
    set((state) => ({
      radarState: {
        ...state.radarState,
        filters: { ...state.radarState.filters, ...filters },
      },
    }));
  },

  resetRadarFilters: () => {
    set((state) => ({
      radarState: {
        ...state.radarState,
        filters: initialRadarState.filters,
      },
    }));
  },

  setSelectedTemplate: (templateId, applicationId = undefined) => {
    const { emailTemplates } = get();
    const template = emailTemplates.find((t) => t.id === templateId);
    
    set((state) => ({
      coldEmailStudioState: {
        ...state.coldEmailStudioState,
        selectedTemplateId: templateId,
        subject: template?.subject || '',
        body: template?.body || '',
      },
    }));
  },

  setSelectedCV: (cvId) => {
    set((state) => ({
      coldEmailStudioState: {
        ...state.coldEmailStudioState,
        selectedCVId: cvId,
      },
    }));
  },

  setEmailSubject: (subject) => {
    set((state) => ({
      coldEmailStudioState: {
        ...state.coldEmailStudioState,
        subject,
      },
    }));
  },

  setEmailBody: (body) => {
    set((state) => ({
      coldEmailStudioState: {
        ...state.coldEmailStudioState,
        body,
      },
    }));
  },

  toggleFollowUp: () => {
    set((state) => ({
      coldEmailStudioState: {
        ...state.coldEmailStudioState,
        followUpScheduled: !state.coldEmailStudioState.followUpScheduled,
      },
    }));
  },

  resetEmailStudio: () => {
    set({
      coldEmailStudioState: initialColdEmailStudioState,
    });
  },

  setSettingsTab: (tab) => {
    set((state) => ({
      settingsState: { ...state.settingsState, activeTab: tab },
    }));
  },

  toggleDarkMode: () => {
    set((state) => ({ isDarkMode: !state.isDarkMode }));
  },

  // Dashboard KPI helpers
  getTotalApplicationsSent: () => {
    const { currentUser, applications } = get();
    if (!currentUser) return 0;
    return Object.values(applications).filter(
      (app) => app.userId === currentUser.id && app.status !== 'to_contact'
    ).length;
  },

  getInterviewsCount: () => {
    const { currentUser, applications } = get();
    if (!currentUser) return 0;
    return Object.values(applications).filter(
      (app) => app.userId === currentUser.id && (app.status === 'interview' || app.status === 'offer')
    ).length;
  },

  getOffersCount: () => {
    const { currentUser, applications } = get();
    if (!currentUser) return 0;
    return Object.values(applications).filter(
      (app) => app.userId === currentUser.id && app.status === 'offer'
    ).length;
  },

  getActiveTasksCount: () => {
    const { currentUser, tasks } = get();
    if (!currentUser) return 0;
    return Object.values(tasks).filter(
      (task) => task.userId === currentUser.id && !task.isCompleted
    ).length;
  },

  // ── Candidatures ──────────────────────────────────────────────────────────

  addCandidature: (data) => {
    const id = get().generateId();
    const candidature: Candidature = {
      ...data,
      id,
      createdAt: new Date().toISOString(),
    };
    set((state) => {
      const updated = { ...state.candidatures, [id]: candidature };
      saveCandidaturesToStorage(updated);
      return { candidatures: updated };
    });
    return id;
  },

  updateCandidature: (id, updates) => {
    set((state) => {
      const existing = state.candidatures[id];
      if (!existing) return state;
      const merged: Candidature = { ...existing, ...updates };
      // Business Rule 1: auto-renseigner dateDernierContact lors du passage à "Contacté"
      if (updates.statut === 'Contacté' && !updates.dateDernierContact) {
        merged.dateDernierContact = new Date().toISOString().split('T')[0];
      }
      const updated = { ...state.candidatures, [id]: merged };
      saveCandidaturesToStorage(updated);
      return { candidatures: updated };
    });
  },

  deleteCandidature: (id) => {
    set((state) => {
      const updated = { ...state.candidatures };
      delete updated[id];
      saveCandidaturesToStorage(updated);
      return { candidatures: updated };
    });
  },

  setStudentProfile: (updates) => {
    set((state) => {
      const updated = { ...state.studentProfile, ...updates };
      saveStudentProfileToStorage(updated);
      return { studentProfile: updated };
    });
  },

  addContact: (data) => {
    const id = get().generateId();
    const contact: Contact = { ...data, id, createdAt: new Date().toISOString() };
    set((state) => {
      const updated = { ...state.contacts, [id]: contact };
      saveContactsToStorage(updated);
      return { contacts: updated };
    });
    return id;
  },

  markContactAdded: (id, candidatureId) => {
    set((state) => {
      const existing = state.contacts[id];
      if (!existing) return state;
      const updated = { ...state.contacts, [id]: { ...existing, addedToPipeline: true, candidatureId } };
      saveContactsToStorage(updated);
      return { contacts: updated };
    });
  },

  dismissContact: (id) => {
    set((state) => {
      const existing = state.contacts[id];
      if (!existing) return state;
      const updated = { ...state.contacts, [id]: { ...existing, dismissed: true } };
      saveContactsToStorage(updated);
      return { contacts: updated };
    });
  },

  restoreContact: (id) => {
    set((state) => {
      const existing = state.contacts[id];
      if (!existing) return state;
      const updated = { ...state.contacts, [id]: { ...existing, dismissed: false } };
      saveContactsToStorage(updated);
      return { contacts: updated };
    });
  },

  dismissSiren: (siren) => {
    set((state) => {
      if (state.dismissedSirens.includes(siren)) return state;
      const updated = [...state.dismissedSirens, siren];
      saveDismissedSirensToStorage(updated);
      return { dismissedSirens: updated };
    });
  },

  restoreSiren: (siren) => {
    set((state) => {
      const updated = state.dismissedSirens.filter((s) => s !== siren);
      saveDismissedSirensToStorage(updated);
      return { dismissedSirens: updated };
    });
  },

  preselectCandidature: (id) => set({ messageGeneratorCandidatureId: id }),

  generateId: () => {
    return Math.random().toString(36).substr(2, 9);
  },
}));