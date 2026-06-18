// Domain Enums
export type SubscriptionTier = 'free' | 'premium';
export type Domain = 'Marketing' | 'Informatique' | 'Commerce' | 'Design' | 'Finance' | 'Autre';
export type Rhythm = '3/1' | '2/2' | '4/1' | '1/1' | 'Autre';

export type SourceType = 'la_bonne_alternance' | 'sirene' | 'scraping' | 'manual';
export type OpportunityType = 'online_offer' | 'hidden_market';

export type ApplicationStatus = 'to_contact' | 'sent' | 'waiting' | 'interview' | 'offer' | 'rejected';
export type Priority = 'high' | 'medium' | 'low';

export type EmailType = 'initial' | 'follow_up';
export type EmailStatus = 'draft' | 'sent' | 'delivered' | 'opened';

export type TaskType = 'follow_up' | 'thank_you' | 'prepare_interview' | 'complete_profile' | 'custom';

// Screen/Navigation States
export type AppState =
  | 'login'
  | 'signup'
  | 'emailVerification'
  | 'onboarding'
  | 'dashboard'
  | 'radar'
  | 'pipeline'
  | 'contacts'
  | 'import'
  | 'messageGenerator'
  | 'coldEmailStudio'
  | 'profileSettings'
  | 'profile';

// Modal Types
export type ModalType = 'upgrade' | 'applicationOutcome' | 'none';

// Domain Entities
export interface User {
  id: string;
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  domain: Domain;
  rhythm: Rhythm;
  location: string;
  streakCount: number;
  lastLoginDate: Date | null;
  subscriptionTier: SubscriptionTier;
  dailyEmailsSent: number;
  lastEmailResetDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CV {
  id: string;
  userId: string;
  title: string;
  fileUrl: string;
  fileName: string;
  createdAt: Date;
}

export interface Opportunity {
  id: string;
  sourceType: SourceType;
  opportunityType: OpportunityType;
  title: string;
  companyName: string;
  companyLogo: string | null;
  companySize: string | null;
  industry: string;
  location: string;
  rhythmRequired: string | null;
  description: string;
  externalUrl: string | null;
  contactEmail: string | null;
  publishedAt: Date | null;
  createdAt: Date;
}

export interface Application {
  id: string;
  userId: string;
  opportunityId: string;
  status: ApplicationStatus;
  priority: Priority;
  desiredJobTitle: string | null;
  notes: string;
  outcomeSalary: string | null;
  outcomeFeedback: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Email {
  id: string;
  applicationId: string;
  userId: string;
  cvId: string | null;
  emailType: EmailType;
  subject: string;
  body: string;
  sentAt: Date | null;
  status: EmailStatus;
  scheduledFollowUpDate: Date | null;
  createdAt: Date;
}

export interface Task {
  id: string;
  userId: string;
  applicationId: string | null;
  taskType: TaskType;
  title: string;
  description: string;
  dueDate: Date | null;
  isCompleted: boolean;
  createdAt: Date;
  completedAt: Date | null;
}

// UI-related Types (for store)
export interface RadarFilters {
  search: string;
  domain: string;
  location: string;
  rhythm: string;
}

export interface RadarState {
  activeTab: 'onlineOffers' | 'hiddenMarket';
  filters: RadarFilters;
}

export interface EmailTemplate {
  id: string;
  name: string;
  type: EmailType;
  subject: string;
  body: string;
  variables: string[];
}

export interface ColdEmailStudioState {
  selectedTemplateId: string | null;
  selectedCVId: string | null;
  subject: string;
  body: string;
  followUpScheduled: boolean;
}

export interface SettingsState {
  activeTab: 'cvs' | 'account' | 'subscription';
}

// ─── Candidature (nouveau modèle pipeline Sprint 2) ──────────────────────────

export type CanalType = 'LinkedIn' | 'Email' | 'Téléphone';

export type CandidatureStatut =
  | 'À contacter'
  | 'Contacté'
  | 'Réponse positive'
  | 'Réponse négative'
  | 'À relancer';

export interface Candidature {
  id: string;
  entreprise: string;
  contactNom: string;
  contactRole: string;
  posteVise: string;
  canal: CanalType;
  statut: CandidatureStatut;
  dateDernierContact: string | null;  // YYYY-MM-DD
  dateRelancePrevue: string | null;   // YYYY-MM-DD
  notes: string;
  createdAt: string;                  // ISO
}

// ─── Résultat de recherche entreprise (API État) ─────────────────────────────

export type { CompanyResult } from './utils/companySearch';

// ─── Contact (marché caché — import CSV) ─────────────────────────────────────

export interface Contact {
  id: string;
  prenom: string;
  nom: string;
  contactRole: string;    // CSV Title column
  entreprise: string;
  industry: string;       // CSV Industry column — used for domain filtering at display time
  email: string;
  linkedinUrl: string;
  ville: string;
  addedToPipeline: boolean;
  candidatureId?: string;
  dismissed?: boolean;    // marqué "Pas intéressé" — exclu de l'affichage
  createdAt: string;      // ISO
}

// ─── Profil étudiant (Ticket 3) ──────────────────────────────────────────────

export const DOMAINES = ['audiovisuel', 'commerce', 'marketing', 'ingénierie', 'autre'] as const;
export type DomaineType = (typeof DOMAINES)[number];

export interface StudentProfile {
  prenom: string;
  nom: string;
  ecole: string;
  domaine: DomaineType | '';   // source de vérité pour le filtre d'import et la recherche contacts
  ville: string;               // source de vérité pour la recherche contacts
  typePoste: string;           // ex : "production / réalisation"
  periodeDebut: string;        // ex : "Septembre 2025"
  dureeRythme: string;         // ex : "2 ans · 2 sem. école / 2 sem. entreprise"
  cherche: string;
}

// User preferences captured during onboarding
export interface UserPreferences {
  domains: string[];     // e.g. ["Développement Web/Mobile", "Design"]
  rhythm: string;        // e.g. "2 sem. école / 2 sem. entreprise"
  locations: string[];   // e.g. ["Paris", "Lyon"]
  onboardingDone: boolean;
  school?: string;        // e.g. "ESGI"
  graduationYear?: string; // e.g. "2026"
}