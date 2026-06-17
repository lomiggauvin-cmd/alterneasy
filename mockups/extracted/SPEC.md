# Tandem - Spec

## 

**Tandem** - Trouve ton alternance, gère tes candidatures.

Tandem is a desktop-first Single Page Application (SPA) designed to help French students find apprenticeship contracts (alternance) by reducing administrative stress and automating application workflows. The platform aggregates opportunities from public APIs (La Bonne Alternance, Sirene) and enriches them with contact data, providing students with a unified command center to track applications, send personalized emails, and manage follow-ups.

Tandem operates on a freemium B2C model, offering core CRM and email functionality for free (with daily sending limits) while reserving advanced analytics (email open rates), automated reminders, and higher volume limits for premium subscribers. The interface emphasizes calm productivity through a clean, modern aesthetic with dark mode support, subtle gamification (connection streaks), and intelligent task automation that guides students toward consistent action without overwhelming them.

## User Journeys

### 1. New User Onboarding and Workspace Generation

#### 1.1. Account Creation

- 1.1.1. User arrives at Tandem marketing landing page and selects "Commencer gratuitement"
- 1.1.2. User completes registration with email, password, and name validation on the Signup screen
- 1.1.3. System sends email verification and creates account upon confirmation
- 1.1.4. User is redirected to the Onboarding Wizard

#### 1.2. Profile Configuration (3-Step Wizard)

- 1.2.1. **Step 1: Domain Selection** - User selects their field of study from visual cards (e.g., Marketing, Informatique, Commerce)
- 1.2.2. **Step 2: Rhythm Selection** - User selects their alternance rhythm pattern (e.g., 3 semaines entreprise / 1 semaine école, 2/2, etc.) via selectable cards
- 1.2.3. **Step 3: Location** - User inputs their preferred geographic zone via autocomplete city/region search
- 1.2.4. User clicks "Générer mon espace" CTA
- 1.2.5. System creates personalized dashboard and redirects user to Dashboard with welcome state

### 2. Daily Dashboard Engagement

#### 2.1. Morning Check-in

- 2.1.1. User logs in via Login screen and sees Dashboard with personalized greeting
- 2.1.2. System displays connection streak indicator (flame icon with day count) next to user avatar
- 2.1.3. User views four KPI cards:
   - Candidatures envoyées (total count)
   - Taux d'ouverture emails (displayed with premium lock icon for free users)
   - Entretiens obtenus (count)
   - Offres reçues (count)
- 2.1.4. User reviews "To-Do List" section containing intelligent tasks:
   - "Tu as 3 relances à faire aujourd'hui" (links to Pipeline)
   - "Pense à remercier pour ton entretien d'hier" (links to Email Studio with pre-filled template)
   - "Complète ton profil" (if incomplete)

#### 2.2. Task Completion Flow

- 2.2.1. User clicks on a task in the To-Do List
- 2.2.2. System navigates to relevant screen (Pipeline or Email Studio) with context pre-loaded
- 2.2.3. Upon completion of the action, user returns to Dashboard and marks task as done
- 2.2.4. Task disappears from active list and moves to completed history (accessible via filter)

### 3. Opportunity Discovery (Radar)

#### 3.1. Searching Online Offers

- 3.1.1. User navigates to Radar screen (default tab: "Offres en ligne")
- 3.1.2. System displays table with columns: Poste, Entreprise, Ville, Date de publication
- 3.1.3. User utilizes filter bar with search input and dropdown filters (Domaine, Localisation, Rythme)
- 3.1.4. Offers matching user's selected rhythm are highlighted with a visual badge ("Correspond à ton rythme") but all offers remain visible
- 3.1.5. User clicks "Ajouter au CRM" button on a specific offer row
- 3.1.6. System creates new Application card in Pipeline column "À contacter" with opportunity data pre-filled

#### 3.2. Exploring Hidden Market

- 3.2.1. User switches to "Marché Caché (Entreprises)" tab
- 3.2.2. System displays companies from Sirene API enriched with sector data (no specific job title)
- 3.2.3. User clicks "Ajouter au CRM" on a company row
- 3.2.4. System creates Application card with job title defaulted to "Candidature Spontanée" in Pipeline column "À contacter"
- 3.2.5. User can later edit the card to specify desired position if needed

### 4. Application Pipeline Management

#### 4.1. Kanban Board Operations

- 4.1.1. User navigates to Pipeline screen showing 5 columns:
   - À contacter
   - Premier contact envoyé
   - En attente de réponse
   - Entretien programmé
   - Offre / Refus
- 4.1.2. User drags cards between columns to update status manually
- 4.1.3. Each card displays: Company logo, Job title (or "Candidature Spontanée"), Company name, Priority color indicator (red/yellow/green dot)
- 4.1.4. User clicks on a card to open detail overlay showing:
   - Full company and position details
   - Contact history timeline
   - Notes field
   - Quick action buttons ("Envoyer un email", "Programmer une relance")

#### 4.2. Status-Based Automation

- 4.2.1. When user drops card in "Entretien programmé", system automatically creates Dashboard task: "Préparer entretien chez [Entreprise]"
- 4.2.2. When user drops card in "Offre / Refus", system triggers Outcome Details Modal to collect salary and feedback for analytics

### 5. Cold Email Composition and Sending

#### 5.1. Template Selection and Editing

- 5.1.1. User navigates to Cold Email Studio or clicks "Envoyer un email" from Pipeline card
- 5.1.2. Screen displays split view:
   - Left panel (1/3): Template library (Candidature spontanée, Réponse à une offre, Relance) with preview showing highlighted variables like [Nom_Entreprise]
   - Right panel (2/3): Email composition area
- 5.1.3. User selects template from left panel
- 5.1.4. System populates editor with template text and auto-fills known variables from Application data

#### 5.2. CV Attachment and Sending

- 5.2.1. User selects which CV to attach from dropdown showing uploaded CVs (e.g., "CV Marketing", "CV Tech") - if no CVs exist, user is prompted to upload one in Settings
- 5.2.2. User reviews rich text editor content (subject line and body)
- 5.2.3. User clicks "Envoyer" button
- 5.2.4. System validates daily email limit (5 for free users)
- 5.2.5. If limit reached, system displays Upgrade Modal
- 5.2.6. If under limit, system sends email via platform's email server (generic sender address)
- 5.2.7. System moves associated Pipeline card to "Premier contact envoyé" column
- 5.2.8. System increments daily email counter

#### 5.3. Follow-up Scheduling (Premium)

- 5.3.1. Before sending, user toggles option "Programmer une relance automatique dans 4 jours" (marked with premium star icon)
- 5.3.2. For free users, clicking this triggers Upgrade Modal
- 5.3.3. For premium users, system schedules a Smart Reminder:
   - Creates a Task in Dashboard due in 4 days: "Relancer [Entreprise]"
   - Does NOT send email automatically
   - When due date arrives, user receives notification and clicks task to open Email Studio with pre-loaded follow-up template

### 6. Profile and CV Management

#### 6.1. Uploading and Managing CVs

- 6.1.1. User navigates to Profile Settings from the Sidebar
- 6.1.2. User selects "Mes CVs" tab
- 6.1.3. User clicks "Ajouter un CV" and selects PDF file from device
- 6.1.4. System uploads file, generates a thumbnail/preview, and prompts user for a title (e.g., "CV Marketing")
- 6.1.5. User can delete obsolete CVs via trash icon
- 6.1.6. These CVs become available in the dropdown selector in the Cold Email Studio

### 7. Freemium Limitation and Upgrade Flow

#### 7.1. Hitting Limits

- 7.1.1. When free user attempts to send 6th email in a day, system blocks action
- 7.1.2. System displays Upgrade Modal explaining limit and offering upgrade to Premium
- 7.1.3. User can dismiss and continue browsing, but cannot send more emails until next day (counter resets at midnight)

#### 7.2. Premium Feature Teasing

- 7.2.1. Email Open Rate KPI displays lock icon with tooltip "Passe en Premium pour voir qui ouvre tes emails"
- 7.2.2. Advanced filters in Radar (e.g., company size, salary range) display lock icons
- 7.2.3. Automatic follow-up scheduling option displays star badge "Premium"

## Data Model

### User

Represents a student user of the platform.

**Fields:**
* `id`: UUID
* `email`: String (unique, verified)
* `passwordHash`: String
* `firstName`: String
* `lastName`: String
* `domain`: Enum (Marketing, Informatique, Commerce, etc.)
* `rhythm`: String (e.g., "3/1", "2/2", "4/1")
* `location`: String (city/region)
* `streakCount`: Integer (consecutive days logged in)
* `lastLoginDate`: Date
* `subscriptionTier`: Enum (free, premium)
* `dailyEmailsSent`: Integer (counter for freemium limit)
* `lastEmailResetDate`: Date (to reset counter daily)
* `createdAt`: Timestamp
* `updatedAt`: Timestamp

**Relationships:**
* Has many `CV` entities
* Has many `Application` entities
* Has many `Task` entities
* Has many `Email` entities

### CV

Represents a curriculum vitae file uploaded by the user.

**Fields:**
* `id`: UUID
* `userId`: FK User
* `title`: String (e.g., "CV Marketing Digital", "CV Développeur Full Stack")
* `fileUrl`: String (storage path)
* `fileName`: String (original filename)
* `createdAt`: Timestamp

**Relationships:**
* Belongs to `User`
* Can be attached to many `Email` entities

### Opportunity

Represents a job offer or company discovered via APIs or scraping.

**Fields:**
* `id`: UUID
* `sourceType`: Enum (la_bonne_alternance, sirene, scraping, manual)
* `opportunityType`: Enum (online_offer, hidden_market)
* `title`: String (job title, or "Spontaneous Application" for hidden market)
* `companyName`: String
* `companyLogo`: String (URL)
* `companySize`: String (optional)
* `industry`: String
* `location`: String
* `rhythmRequired`: String (optional, extracted from offer)
* `description`: Text
* `externalUrl`: String (original posting URL)
* `contactEmail`: String (enriched via Hunter.io/Dropcontact)
* `publishedAt`: Date
* `createdAt`: Timestamp

**Relationships:**
* Has many `Application` entities

### Application

Represents a specific candidature tracked by the user in their CRM.

**Fields:**
* `id`: UUID
* `userId`: FK User
* `opportunityId`: FK Opportunity
* `status`: Enum (to_contact, sent, waiting, interview, offer, rejected)
* `priority`: Enum (high, medium, low) - determines card color badge
* `desiredJobTitle`: String (optional, for hidden market customization)
* `notes`: Text
* `outcomeSalary`: String (optional, captured upon rejection/offer)
* `outcomeFeedback`: Text (optional, captured upon rejection/offer)
* `createdAt`: Timestamp
* `updatedAt`: Timestamp

**Relationships:**
* Belongs to `User`
* Belongs to `Opportunity`
* Has many `Email` entities
* Has many `Task` entities

### Email

Represents emails sent through the platform.

**Fields:**
* `id`: UUID
* `applicationId`: FK Application
* `userId`: FK User
* `cvId`: FK CV (attached file)
* `emailType`: Enum (initial, follow_up)
* `subject`: String
* `body`: Text (HTML content)
* `sentAt`: Timestamp
* `status`: Enum (draft, sent, delivered, opened)
* `scheduledFollowUpDate`: Date (optional, for premium reminder feature)
* `createdAt`: Timestamp

**Relationships:**
* Belongs to `Application`
* Belongs to `User`
* Belongs to `CV`

### Task

Represents intelligent to-do items generated for the user.

**Fields:**
* `id`: UUID
* `userId`: FK User
* `applicationId`: FK Application (optional, linked task)
* `taskType`: Enum (follow_up, thank_you, prepare_interview, complete_profile, custom)
* `title`: String
* `description`: Text
* `dueDate`: Date
* `isCompleted`: Boolean
* `createdAt`: Timestamp
* `completedAt`: Timestamp (optional)

**Relationships:**
* Belongs to `User`
* Belongs to `Application` (optional)

## Design

*   **Platform**: Desktop-first Single Page Application (SPA), responsive web-app
*   **Navigation**: Fixed left sidebar with icon-based menu items and collapsible sections
*   **Visual Style**: Modern, clean, reassuring and motivating aesthetic
*   **Color Scheme**: Dark Mode elegant support (toggle available), light mode default
*   **Gamification Elements**: Progress gauges, flame icon for daily connection streaks displayed prominently
*   **Freemium Indicators**: Small lock icons or star badges on premium-restricted features (KPIs, advanced filters, automatic follow-up scheduling)
*   **Typography & Layout**: [OUT OF SCOPE - to be defined by UX team]

## Frontend

#### Primary Navigation (Sidebar)

*   Fixed left sidebar containing:
    *   Tandem logo and brand name
    *   Navigation icons: Dashboard, Radar, Pipeline, Studio (Email), Settings
    *   Connection streak indicator (flame icon + day count) at bottom
    *   User avatar and subscription status badge
    *   Dark mode toggle switch
    *   "Passer Premium" CTA button (visible for free users)

#### Top Bar

*   Page title and breadcrumb navigation
*   Notification bell icon with unread count
*   Quick search input (global)

#### Freemium Indicators

*   Lock icon overlay on premium KPIs (Email Open Rate)
*   Star badge on premium features (Automatic follow-up scheduling)

#### Modals

##### Upgrade Modal

*   **Trigger**: Attempting to send email when daily limit is reached, or clicking a locked premium feature.
*   **Content**:
    *   Icon/Illustration: Locked padlock or Star.
    *   Headline: "Passe à la vitesse supérieure avec Tandem Premium".
    *   Body: "Tu as atteint ta limite d'envois quotidiens. Débloque des envois illimités, le suivi des taux d'ouverture, et des relances automatiques."
    *   Pricing/Plan Card: Highlight "Premium" with price/month (e.g., 9,99€).
    *   Primary Button: "Commencer mon essai gratuit".
    *   Secondary Button: "Peut-être plus tard".

##### Application Outcome Modal

*   **Trigger**: Dragging a Pipeline card to the "Offre / Refus" column.
*   **Content**:
    *   Headline: "Mettre à jour le statut".
    *   Radio Buttons/Select: "Résultat : Offre reçue" or "Refusé".
    *   Input Field (Conditional): "Salaire proposé (mensuel)" (only if "Offre reçue" selected).
    *   Text Area: "Feedback du recruteur (optionnel)".
    *   Primary Button: "Enregistrer".
    *   Secondary Button: "Annuler".

### LoginScreen

Summary: Login screen for returning users to authenticate with email and password.

Preview size: 1920x1080

#### Preview states

State | Name | Description
------|------|--------------------------------
ID: default | Default | The form is empty and ready for input. Logo and headline are visible.

#### Contents

#### LoginScreen

*   **Content**:
    *   Tandem Logo centered.
    *   Headline: "Content de te revoir !".
    *   Form: Email input, Password input.
    *   "Mot de passe oublié ?" link.
    *   Primary CTA: "Se connecter".
    *   Footer text: "Tu n'as pas de compte ?" with "S'inscrire" link.

### SignupScreen

Summary: Registration screen for new users to create an account.

Preview size: 1920x1080

#### Preview states

State | Name | Description
------|------|--------------------------------
ID: default | Default | The form is empty. All fields, checkbox, and CTA are visible.

#### Contents

#### SignupScreen

*   **Content**:
    *   Tandem Logo centered.
    *   Headline: "Crée ton espace Tandem".
    *   Form: First Name, Last Name, Email, Password, Confirm Password.
    *   Checkbox: "J'accepte les conditions d'utilisation".
    *   Primary CTA: "Commencer gratuitement".
    *   Footer text: "Tu as déjà un compte ?" with "Se connecter" link.

### EmailVerificationScreen

Summary: Screen displayed after signup asking user to verify their email address.

Preview size: 1920x1080

#### Preview states

State | Name | Description
------|------|--------------------------------
ID: default | Default | Illustration, headline, and body text are visible. The email address placeholder is filled with the user's email.

#### Contents

#### EmailVerificationScreen

*   **Content**:
    *   Illustration: Email envelope with checkmark.
    *   Headline: "Vérifie ta boîte mail".
    *   Body: "Nous avons envoyé un lien de confirmation à [Email]. Clique dessus pour activer ton compte."
    *   Secondary Action: "Renvoyer l'email".

### OnboardingScreen

Summary: A 3-step wizard for new users to define their study domain, work rhythm, and location.

Preview size: 1920x1080

#### Preview states

State | Name | Description
------|------|--------------------------------
ID: step1 | Step 1: Domain | Progress bar indicates Step 1. Grid of domain cards (Marketing, Tech, Commerce) is displayed. "Générer mon espace" is disabled until selection.
ID: step2 | Step 2: Rhythm | Progress bar indicates Step 2. Grid of rhythm cards (3/1, 2/2, etc.) is displayed. One domain is visually selected (persisted state).
ID: step3 | Step 3: Location | Progress bar indicates Step 3. Autocomplete search input for city/region is focused.

#### Contents

#### OnboardingScreen

Initial setup wizard for new users to configure their profile.

**Content Hierarchy:**
*   Centered minimalist layout with progress indicator (3 steps: Domaine, Rythme, Localisation)
*   **Step 1 - Domain**: Grid of selectable cards representing fields (Marketing, Tech, Commerce, etc.)
*   **Step 2 - Rhythm**: Grid of selectable cards showing alternance patterns (3/1, 2/2, etc.)
*   **Step 3 - Location**: Autocomplete search input for city/region selection
*   Primary CTA: "Générer mon espace" button
*   Skip option: "Configurer plus tard" (saves partial progress)

**Interactions:**
*   Card selection highlights chosen option
*   Progress bar updates between steps
*   Validation prevents proceeding without selection
*   Auto-save of progress between steps

### DashboardScreen

Summary: Main dashboard showing user greeting, KPIs with freemium locks, and a smart to-do list.

Preview size: 1920x1080

#### Preview states

State | Name | Description
------|------|--------------------------------
ID: default | Default (Free User) | Personalized greeting is visible. Streak flame icon is active. KPIs are displayed: "Taux d'ouverture" shows a lock icon. To-Do list contains several task cards.
ID: noTasks | No Tasks | Dashboard is loaded, but the To-Do List section shows an empty state illustration with the message "Pas d'actions pour le moment".

#### Contents

#### DashboardScreen

Central hub displaying motivation metrics and actionable tasks.

**Content Hierarchy:**
*   **Header Section**: Personalized greeting ("Bonjour [Prénom]") with streak flame icon and count
*   **KPI Grid**: Four metric cards in horizontal layout:
    *   Candidatures envoyées (number)
    *   Taux d'ouverture (percentage with lock icon for free users)
    *   Entretiens obtenus (number)
    *   Offres reçues (number)
*   **To-Do List Section**:
    *   Title "Actions recommandées"
    *   List of task cards with:
        *   Task description
        *   Due date indicator
        *   Action button ("Relancer", "Rédiger", "Voir")
        *   Checkbox to mark complete
    *   Empty state illustration when no tasks

**Interactions:**
*   Task cards navigate to relevant screen (Pipeline or Email Studio) on click
*   Checkbox marks task complete with animation
*   KPI cards clickable for detailed view (except locked premium metrics)

### RadarScreen

Summary: Search interface for online job offers and hidden market companies with filtering capabilities.

Preview size: 1920x1080

#### Preview states

State | Name | Description
------|------|--------------------------------
ID: default | Online Offers Tab | "Offres en ligne" tab is active. The results table is populated with job offers. Some rows have a "Correspond à ton rythme" badge.
ID: hiddenMarket | Hidden Market Tab | "Marché Caché (Entreprises)" tab is active. The results table displays company names and locations without specific job titles (implied "Candidature Spontanée").
ID: noResults | No Results | Filters have been applied such that no results match. The table area shows the "Aucune offre trouvée" empty state with a reset button.

#### Contents

#### RadarScreen

Discovery interface for finding job offers and companies.

**Content Hierarchy:**
*   **Tab Navigation**: Two tabs - "Offres en ligne" | "Marché Caché (Entreprises)"
*   **Filter Bar**:
    *   Search input (text)
    *   Dropdown filters: Domaine, Localisation, Rythme
    *   Advanced filters (premium - locked)
*   **Results Table**:
    *   Columns: Poste, Entreprise, Ville, Date de publication, Action
    *   Rows: Opportunity data with rhythm match badge (if applicable)
    *   "Ajouter au CRM" button per row
*   **Empty State**: "Aucune offre trouvée" with filter reset option

**Interactions:**
*   Tab switch changes data source (API offers vs Company directory)
*   Filter application updates table in real-time
*   "Ajouter au CRM" creates Application and shows confirmation toast
*   Rhythm matches highlighted with visual badge (not filtered out)

### PipelineScreen

Summary: Kanban board to manage application stages from contact to offer/rejection.

Preview size: 1920x1080

#### Preview states

State | Name | Description
------|------|--------------------------------
ID: default | Default Kanban | All 5 columns are visible. Cards are distributed across columns. No overlay or modal is open.
ID: cardDetailOverlay | Card Detail Overlay | A user has clicked a card. The overlay appears showing full details, contact history timeline, and action buttons ("Envoyer email", etc.). The background is dimmed.
ID: outcomeModal | Application Outcome Modal | Triggered by dragging a card to "Offre / Refus". The modal "Mettre à jour le statut" is open, showing radio buttons for Offre/Refus, salary input, and feedback textarea.

#### Contents

#### PipelineScreen

Kanban-style CRM for tracking application progress.

**Content Hierarchy:**
*   **Board Layout**: Five vertical columns with headers:
    *   À contacter
    *   Premier contact envoyé
    *   En attente de réponse
    *   Entretien programmé
    *   Offre / Refus
*   **Cards**: Each containing:
    *   Company logo thumbnail
    *   Job title (or "Candidature Spontanée")
    *   Company name
    *   Priority color indicator (dot)
    *   Drag handle
*   **Card Detail Overlay** (modal when card clicked):
    *   Full opportunity details
    *   Contact history timeline
    *   Notes text area
    *   Action buttons: "Envoyer email", "Modifier", "Supprimer"

**Interactions:**
*   Drag and drop cards between columns to update status
*   Column headers show count of cards
*   Click card to open detail overlay
*   Dropping card in "Offre / Refus" triggers the Application Outcome Modal
*   Status change to "Entretien programmé" triggers automated task creation (e.g., "Préparer entretien chez [Entreprise]")

### ColdEmailStudioScreen

Summary: Email composition interface with templates, CV attachment, and sending logic.

Preview size: 1920x1080

#### Preview states

State | Name | Description
------|------|--------------------------------
ID: default | Default Composition | Split view is active. A template is selected in the left panel. The right panel shows the subject line, rich text editor with auto-filled variables, and the CV dropdown with available CVs.
ID: noCvs | No CVs Uploaded | The CV attachment selector displays "Aucun CV" and a button "Uploader un CV" is visible because the user has no CVs in their profile.
ID: followUpToggle | Follow-up Toggle Active | The "Programmer une relance dans 4 jours" toggle is switched on. The star badge indicates it is a premium feature.
ID: upgradeModal | Upgrade Modal (Limit Reached) | User has clicked "Envoyer" but reached the daily limit. The Upgrade Modal appears over the studio, explaining the limit and offering Premium upgrade.

#### Contents

#### ColdEmailStudioScreen

Split-view interface for composing and sending emails.

**Content Hierarchy:**
*   **Left Panel (1/3 width)**:
    *   Template library list:
        *   Candidature spontanée
        *   Réponse à une offre
        *   Relance (1ère, 2ème)
    *   Template preview with highlighted variables ([Nom_Entreprise], [Poste])
*   **Right Panel (2/3 width)**:
    *   Subject line input
    *   Rich text editor for email body
    *   CV attachment selector (dropdown of user's uploaded CVs)
    *   **Empty State for CV**: If no CVs exist, dropdown displays "Aucun CV" with a button "Uploader un CV" linking to Profile Settings.
    *   Send button ("Envoyer")
    *   Follow-up scheduling toggle (with premium star badge): "Programmer une relance dans 4 jours"

**Interactions:**
*   Template selection populates editor with content
*   Variables auto-populate from Application data where available
*   CV selector allows choosing from multiple uploaded files
*   Send action validates daily limit (5 for free users)
*   Limit reached triggers Upgrade Modal
*   Follow-up toggle (premium) schedules Dashboard task for future date (does not auto-send)

### ProfileSettingsScreen

Summary: Settings area to manage CVs, account information, and subscription details.

Preview size: 1920x1080

#### Preview states

State | Name | Description
------|------|--------------------------------
ID: default | Mes CVs (List) | The "Mes CVs" tab is active in the sidebar. The main area shows a list of uploaded CV cards with filenames, dates, and action buttons.
ID: noCvsEmpty | Mes CVs (Empty State) | The "Mes CVs" tab is active. The main area shows the empty state illustration and text: "Tu n'as pas encore ajouté de CV..." with the "Ajouter un CV" button.
ID: accountTab | Mon Compte | The "Mon Compte" tab is active. The form fields for name, email, and password change are visible.
ID: subscriptionTab | Abonnement (Free) | The "Abonnement" tab is active. The Current Plan Card shows "Gratuit" with a "Passer Premium" button and a list of premium benefits.

#### Contents

#### ProfileSettingsScreen

Configuration screen for account details, CVs, and subscription.

**Content Hierarchy:**
*   **Layout**: Sidebar (Settings menu) + Main Content Area.
*   **Settings Menu**:
    *   Mes CVs (Active by default if accessed via Cold Email prompt)
    *   Mon Compte
    *   Abonnement
*   **"Mes CVs" Section**:
    *   Title: "Gérer mes CVs"
    *   List view of uploaded CVs (Card per CV):
        *   Filename (e.g., "CV_Marketing_v2.pdf")
        *   Upload date
        *   Actions: Delete icon, Set as Default (star icon)
    *   "Ajouter un CV" button: Triggers file picker (PDF only).
    *   Empty state: "Tu n'as pas encore ajouté de CV. Ajoute-en un pour commencer tes candidatures."
*   **"Mon Compte" Section**:
    *   Form fields: Prénom, Nom, Email.
    *   "Modifier le mot de passe" section: Current password, New password, Confirm.
    *   Save button.
*   **"Abonnement" Section**:
    *   Current Plan Card: "Gratuit" or "Premium".
    *   If Free: "Passer Premium" button, List of benefits vs Premium.
    *   If Premium: Subscription details (Next billing date), "Gérer ma facturation", "Annuler l'abonnement".

**Interactions:**
*   Uploading a CV adds it to the database and refreshes the list immediately.
*   Deleting a CV removes it from the database and updates the list.
*   Changes to account details require "Save" confirmation.