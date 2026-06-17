import { User, CV, Opportunity, Application, Email, Task, Candidature } from '../types';

// Tuple types for compact data definition
type UserRow = [
  string, // id
  string, // email
  string, // passwordHash
  string, // firstName
  string, // lastName
  'Marketing' | 'Informatique' | 'Commerce' | 'Design' | 'Finance' | 'Autre', // domain
  '3/1' | '2/2' | '4/1' | '1/1' | 'Autre', // rhythm
  string, // location
  number, // streakCount
  Date | null, // lastLoginDate
  'free' | 'premium', // subscriptionTier
  number, // dailyEmailsSent
  Date | null, // lastEmailResetDate
  string, // createdAt (ISO string)
];

type CVRow = [
  string, // id
  string, // userId
  string, // title
  string, // fileUrl
  string, // fileName
  string, // createdAt (ISO string)
];

type OpportunityRow = [
  string, // id
  'la_bonne_alternance' | 'sirene' | 'scraping' | 'manual', // sourceType
  'online_offer' | 'hidden_market', // opportunityType
  string, // title
  string, // companyName
  string | null, // companyLogo
  string | null, // companySize
  string, // industry
  string, // location
  string | null, // rhythmRequired
  string, // description
  string | null, // externalUrl
  string | null, // contactEmail
  string | null, // publishedAt (ISO string)
  string, // createdAt (ISO string)
];

type ApplicationRow = [
  string, // id
  string, // userId
  string, // opportunityId
  'to_contact' | 'sent' | 'waiting' | 'interview' | 'offer' | 'rejected', // status
  'high' | 'medium' | 'low', // priority
  string | null, // desiredJobTitle
  string, // notes
  string | null, // outcomeSalary
  string | null, // outcomeFeedback
  string, // createdAt (ISO string)
  string, // updatedAt (ISO string)
];

type EmailRow = [
  string, // id
  string, // applicationId
  string, // userId
  string | null, // cvId
  'initial' | 'follow_up', // emailType
  string, // subject
  string, // body
  string | null, // sentAt (ISO string)
  'draft' | 'sent' | 'delivered' | 'opened', // status
  string | null, // scheduledFollowUpDate (ISO string)
  string, // createdAt (ISO string)
];

type TaskRow = [
  string, // id
  string, // userId
  string | null, // applicationId
  'follow_up' | 'thank_you' | 'prepare_interview' | 'complete_profile' | 'custom', // taskType
  string, // title
  string, // description
  string | null, // dueDate (ISO string)
  boolean, // isCompleted
  string, // createdAt (ISO string)
  string | null, // completedAt (ISO string)
];

// ==================== USERS ====================
export const mockUsers: Record<string, User> = Object.fromEntries(
  ([
    [
      'user-1',
      'jean.dupont@example.com',
      'hashed_password_1',
      'Jean',
      'Dupont',
      'Informatique',
      '2/2',
      'Paris',
      12,
      new Date('2024-02-15'),
      'free',
      3,
      new Date('2024-02-15'),
      '2024-01-10T00:00:00.000Z',
    ],
    [
      'user-2',
      'marie.martin@example.com',
      'hashed_password_2',
      'Marie',
      'Martin',
      'Marketing',
      '3/1',
      'Lyon',
      28,
      new Date('2024-02-15'),
      'premium',
      1,
      new Date('2024-02-15'),
      '2023-11-20T00:00:00.000Z',
    ],
    [
      'user-3',
      'thomas.bernard@example.com',
      'hashed_password_3',
      'Thomas',
      'Bernard',
      'Commerce',
      '2/2',
      'Marseille',
      5,
      new Date('2024-02-14'),
      'free',
      0,
      new Date('2024-02-14'),
      '2024-01-05T00:00:00.000Z',
    ],
  ] satisfies UserRow[]).map(
    ([id, email, passwordHash, firstName, lastName, domain, rhythm, location, streakCount, lastLoginDate, subscriptionTier, dailyEmailsSent, lastEmailResetDate, createdAt]) => [
      id,
      {
        id,
        email,
        passwordHash,
        firstName,
        lastName,
        domain,
        rhythm,
        location,
        streakCount,
        lastLoginDate,
        subscriptionTier,
        dailyEmailsSent,
        lastEmailResetDate,
        createdAt: new Date(createdAt),
        updatedAt: new Date(),
      },
    ]
  )
);

// ==================== CVS ====================
export const mockCVs: Record<string, CV> = Object.fromEntries(
  ([
    ['cv-1', 'user-1', 'CV Développeur Full Stack', '/files/cv-dev-fullstack.pdf', 'cv_developpeur_fullstack_v3.pdf', '2024-01-15T00:00:00.000Z'],
    ['cv-2', 'user-1', 'CV Frontend React spécialisé', '/files/cv-frontend-react.pdf', 'cv_frontend_react_v2.pdf', '2024-02-01T00:00:00.000Z'],
    ['cv-3', 'user-2', 'CV Marketing Digital', '/files/cv-marketing-digital.pdf', 'cv_marketing_digital_2024.pdf', '2024-01-20T00:00:00.000Z'],
    ['cv-4', 'user-2', 'CV Communication & Social Media', '/files/cv-communication.pdf', 'cv_communication_social.pdf', '2024-01-25T00:00:00.000Z'],
    ['cv-5', 'user-3', 'CV Commerce International', '/files/cv-commerce-intl.pdf', 'cv_commerce_international.pdf', '2024-02-05T00:00:00.000Z'],
    ['cv-6', 'user-1', 'CV Data Science Junior', '/files/cv-datascience.pdf', 'cv_datascience_junior.pdf', '2024-02-10T00:00:00.000Z'],
  ] satisfies CVRow[]).map(([id, userId, title, fileUrl, fileName, createdAt]) => [
    id,
    {
      id,
      userId,
      title,
      fileUrl,
      fileName,
      createdAt: new Date(createdAt),
    },
  ])
);

// ==================== OPPORTUNITIES ====================
export const mockOpportunities: Record<string, Opportunity> = Object.fromEntries(
  ([
    [
      'opp-1',
      'la_bonne_alternance',
      'online_offer',
      'Développeur Frontend React',
      'TechCorp France',
      'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=80&h=80&fit=crop',
      '50-100',
      'Informatique',
      'Paris',
      '2/2',
      'Nous recherchons un développeur frontend passionné par React et TypeScript pour rejoindre notre équipe produit. Vous travaillerez sur des projets innovants dans le secteur de la fintech.',
      'https://labonnealternance.fr/offre/12345',
      'recrutement@techcorp.fr',
      '2024-02-01T00:00:00.000Z',
      '2024-02-01T00:00:00.000Z',
    ],
    [
      'opp-2',
      'sirene',
      'hidden_market',
      'Candidature Spontanée',
      'InnovateDigital',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=80&h=80&fit=crop',
      '20-50',
      'Informatique',
      'Lyon',
      null,
      'Agence digitale spécialisée dans le développement web et mobile. Nous accompagnons des startups dans leur transformation numérique.',
      null,
      'contact@innovatedigital.fr',
      null,
      '2024-02-01T00:00:00.000Z',
    ],
    [
      'opp-3',
      'la_bonne_alternance',
      'online_offer',
      'Marketing Manager Junior',
      'BrandBoost Paris',
      'https://images.unsplash.com/photo-1552664730-d307ca884978?w=80&h=80&fit=crop',
      '100-250',
      'Marketing',
      'Paris',
      '3/1',
      'Rejoignez notre équipe marketing pour gérer des campagnes digitales pour nos clients internationaux. Expérience sur Google Ads et Facebook Ads requise.',
      'https://labonnealternance.fr/offre/23456',
      'jobs@brandboost.fr',
      '2024-02-05T00:00:00.000Z',
      '2024-02-05T00:00:00.000Z',
    ],
    [
      'opp-4',
      'la_bonne_alternance',
      'online_offer',
      'Développeur Full Stack Symfony',
      'WebSolutions Lyon',
      'https://images.unsplash.com/photo-1518770660439-4636190af475?w=80&h=80&fit=crop',
      '10-20',
      'Informatique',
      'Lyon',
      '2/2',
      'Startup lyonnaise en croissance cherche un développeur full stack. Stack technique : Symfony, Vue.js, PostgreSQL. Projets variés dans le e-commerce.',
      'https://labonnealternance.fr/offre/34567',
      'recrutement@websolutions.fr',
      '2024-02-08T00:00:00.000Z',
      '2024-02-08T00:00:00.000Z',
    ],
    [
      'opp-5',
      'sirene',
      'hidden_market',
      'Candidature Spontanée',
      'DataFirst Analytics',
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=80&h=80&fit=crop',
      '50-100',
      'Informatique',
      'Paris',
      null,
      'Entreprise spécialisée dans l\'analyse de données et l\'intelligence artificielle appliquée aux entreprises.',
      null,
      'careers@datafirst.com',
      null,
      '2024-02-10T00:00:00.000Z',
    ],
    [
      'opp-6',
      'la_bonne_alternance',
      'online_offer',
      'Chef de Projet Digital',
      'DigitalAgency Bordeaux',
      'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=80&h=80&fit=crop',
      '25-50',
      'Marketing',
      'Bordeaux',
      '3/1',
      'Agence web en plein essor recherche un chef de projet digital en alternance. Vous coordonnerez les équipes créatives et techniques.',
      'https://labonnealternance.fr/offre/45678',
      'contact@digitalagency.fr',
      '2024-02-12T00:00:00.000Z',
      '2024-02-12T00:00:00.000Z',
    ],
    [
      'opp-7',
      'la_bonne_alternance',
      'online_offer',
      'Data Analyst Junior',
      'InsightTech Paris',
      'https://images.unsplash.com/photo-1553484771-371a605b060b?w=80&h=80&fit=crop',
      '100-500',
      'Informatique',
      'Paris',
      '2/2',
      'Entreprise de data science recherche un data analyst junior. Connaissance de Python, SQL et des outils de visualisation de données requise.',
      'https://labonnealternance.fr/offre/56789',
      'recrutement@insighttech.com',
      '2024-02-14T00:00:00.000Z',
      '2024-02-14T00:00:00.000Z',
    ],
    [
      'opp-8',
      'sirene',
      'hidden_market',
      'Candidature Spontanée',
      'GreenTech Solutions',
      'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=80&h=80&fit=crop',
      '15-30',
      'Informatique',
      'Grenoble',
      null,
      'Startup grenobloise spécialisée dans les solutions technologiques pour la transition écologique et les énergies renouvelables.',
      null,
      'jobs@greentech.fr',
      null,
      '2024-02-15T00:00:00.000Z',
    ],
    [
      'opp-9',
      'la_bonne_alternance',
      'online_offer',
      'UX/UI Designer',
      'DesignStudio Marseille',
      'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=80&h=80&fit=crop',
      '10-20',
      'Design',
      'Marseille',
      '1/1',
      'Studio de design digital recherche un UX/UI designer en alternance. Portfolio démontrant une maîtrise de Figma et des principes de design system attendu.',
      'https://labonnealternance.fr/offre/67890',
      'hello@designstudio.fr',
      '2024-02-10T00:00:00.000Z',
      '2024-02-10T00:00:00.000Z',
    ],
    [
      'opp-10',
      'la_bonne_alternance',
      'online_offer',
      'Commercial B2B Junior',
      'SalesForce Pro',
      'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=80&h=80&fit=crop',
      '50-100',
      'Commerce',
      'Lyon',
      '3/1',
      'Entreprise de logiciels SaaS recherche un commercial B2B. Formation technique fournie. Excellentes opportunités d\'évolution.',
      'https://labonnealternance.fr/offre/78901',
      'recrutement@salesforcepro.fr',
      '2024-02-13T00:00:00.000Z',
      '2024-02-13T00:00:00.000Z',
    ],
    [
      'opp-11',
      'sirene',
      'hidden_market',
      'Candidature Spontanée',
      'FinTech Start',
      'https://images.unsplash.com/photo-1633158829585-23ba8f7c8caf?w=80&h=80&fit=crop',
      '5-10',
      'Finance',
      'Paris',
      null,
      'Startup fintech innovante dans le secteur des paiements mobiles. Équipe jeune et dynamique.',
      null,
      'contact@fintechstart.io',
      null,
      '2024-02-08T00:00:00.000Z',
    ],
    [
      'opp-12',
      'la_bonne_alternance',
      'online_offer',
      'DevOps Engineer Junior',
      'CloudNative Paris',
      'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=80&h=80&fit=crop',
      '30-50',
      'Informatique',
      'Paris',
      '2/2',
      'Entreprise spécialisée dans les solutions cloud natives recherche un ingénieur DevOps. Kubernetes, Docker, CI/CD.',
      'https://labonnealternance.fr/offre/89012',
      'careers@cloudnative.io',
      '2024-02-15T00:00:00.000Z',
      '2024-02-15T00:00:00.000Z',
    ],
  ] satisfies OpportunityRow[]).map(
    ([
      id,
      sourceType,
      opportunityType,
      title,
      companyName,
      companyLogo,
      companySize,
      industry,
      location,
      rhythmRequired,
      description,
      externalUrl,
      contactEmail,
      publishedAt,
      createdAt,
    ]) => [
      id,
      {
        id,
        sourceType,
        opportunityType,
        title,
        companyName,
        companyLogo,
        companySize,
        industry,
        location,
        rhythmRequired,
        description,
        externalUrl,
        contactEmail,
        publishedAt: publishedAt ? new Date(publishedAt) : null,
        createdAt: new Date(createdAt),
      },
    ]
  )
);

// ==================== APPLICATIONS ====================
export const mockApplications: Record<string, Application> = Object.fromEntries(
  ([
    ['app-1', 'user-1', 'opp-1', 'sent', 'high', null, 'Entretien technique prévu le 20 février. Bien réviser React et TypeScript.', null, null, '2024-02-05T00:00:00.000Z', '2024-02-15T00:00:00.000Z'],
    ['app-2', 'user-1', 'opp-2', 'to_contact', 'medium', null, 'Intéressant pour leur stack technique moderne. Envoyer candidature cette semaine.', null, null, '2024-02-08T00:00:00.000Z', '2024-02-08T00:00:00.000Z'],
    ['app-3', 'user-2', 'opp-3', 'interview', 'high', null, 'Premier entretien RH très bien passé. Entretien avec le Marketing Director prévu.', null, null, '2024-02-06T00:00:00.000Z', '2024-02-14T00:00:00.000Z'],
    ['app-4', 'user-1', 'opp-4', 'waiting', 'high', null, 'Email de relance envoyé il y a 3 jours. En attente de réponse.', null, null, '2024-02-07T00:00:00.000Z', '2024-02-12T00:00:00.000Z'],
    ['app-5', 'user-2', 'opp-6', 'offer', 'high', null, 'Proposition reçue ! 1400€/mois + 50% transport. À négocier.', '1400€', 'Proposition à revoir légèrement sur la partie transport.', '2024-01-25T00:00:00.000Z', '2024-02-15T00:00:00.000Z'],
    ['app-6', 'user-1', 'opp-5', 'sent', 'medium', null, 'Envoyé lundi dernier. Entreprise très intéressante dans la data.', null, null, '2024-02-10T00:00:00.000Z', '2024-02-10T00:00:00.000Z'],
    ['app-7', 'user-3', 'opp-10', 'to_contact', 'medium', null, 'Poste intéressant avec possibilité de télétravail.', null, null, '2024-02-12T00:00:00.000Z', '2024-02-12T00:00:00.000Z'],
    ['app-8', 'user-1', 'opp-7', 'rejected', 'low', null, 'Refus polu : profil intéressant mais ils cherchent quelqu\'un avec plus d\'expérience SQL.', null, 'Manque d\'expérience sur les requêtes complexes SQL.', '2024-02-01T00:00:00.000Z', '2024-02-10T00:00:00.000Z'],
    ['app-9', 'user-2', 'opp-9', 'sent', 'medium', null, 'Portfolio envoyé. En attente de retour.', null, null, '2024-02-11T00:00:00.000Z', '2024-02-11T00:00:00.000Z'],
    ['app-10', 'user-1', 'opp-12', 'to_contact', 'high', null, 'Parfait pour mon profil DevOps. Poste à pourvoir rapidement.', null, null, '2024-02-14T00:00:00.000Z', '2024-02-14T00:00:00.000Z'],
    ['app-11', 'user-3', 'opp-11', 'waiting', 'high', null, 'Candidature spontanée envoyée. Secteur fintech très porteur.', null, null, '2024-02-09T00:00:00.000Z', '2024-02-09T00:00:00.000Z'],
    ['app-12', 'user-1', 'opp-8', 'sent', 'low', null, 'Intéressant mais localisation à Grenoble compliquée depuis Paris.', null, null, '2024-02-13T00:00:00.000Z', '2024-02-13T00:00:00.000Z'],
  ] satisfies ApplicationRow[]).map(
    ([id, userId, opportunityId, status, priority, desiredJobTitle, notes, outcomeSalary, outcomeFeedback, createdAt, updatedAt]) => [
      id,
      {
        id,
        userId,
        opportunityId,
        status,
        priority,
        desiredJobTitle,
        notes,
        outcomeSalary,
        outcomeFeedback,
        createdAt: new Date(createdAt),
        updatedAt: new Date(updatedAt),
      },
    ]
  )
);

// ==================== EMAILS ====================
export const mockEmails: Record<string, Email> = Object.fromEntries(
  ([
    ['email-1', 'app-1', 'user-1', 'cv-2', 'initial', 'Candidature - Développeur Frontend React', 'Bonjour,\n\nJe vous adresse ma candidature pour le poste de Développeur Frontend React chez TechCorp France, référencé sur La Bonne Alternance.\n\nActuellement étudiant en alternance à l\'EPITA, je maîtrise React, TypeScript et les meilleures pratiques de développement frontend. J\'ai réalisé plusieurs projets personnels que je serais ravi de vous présenter.\n\nJe vous joins mon CV et reste à votre disposition pour un entretien.\n\nCordialement,\nJean Dupont', '2024-02-06T10:30:00.000Z', 'delivered', null, '2024-02-06T10:00:00.000Z'],
    ['email-2', 'app-3', 'user-2', 'cv-3', 'initial', 'Candidature - Marketing Manager Junior', 'Madame, Monsieur,\n\nJe suis très intéressée par le poste de Marketing Manager Junior chez BrandBoost Paris. Actuellement en Master Marketing Digital à IAE Lyon, j\'ai acquis une solide expérience en gestion de campagnes digitales lors de mon stage de 6 mois.\n\nJe maîtrise Google Ads, Facebook Ads et Google Analytics. Je serais ravie de mettre mes compétences au service de vos clients internationaux.\n\nDans l\'attente de votre retour,\nMarie Martin', '2024-02-07T14:15:00.000Z', 'opened', null, '2024-02-07T14:00:00.000Z'],
    ['email-3', 'app-4', 'user-1', 'cv-1', 'initial', 'Candidature - Développeur Full Stack Symfony', 'Bonjour,\n\nJe vous contacte concernant le poste de Développeur Full Stack Symfony chez WebSolutions Lyon.\n\nDéveloppeur passionné, je maîtrise Symfony, Vue.js et PostgreSQL. J\'ai déjà travaillé sur plusieurs projets e-commerce et je suis particulièrement attiré par votre approche agile.\n\nJe vous joins mon CV et reste à votre disposition pour échanger.\n\nCordialement,\nJean Dupont', '2024-02-07T09:45:00.000Z', 'delivered', null, '2024-02-07T09:30:00.000Z'],
    ['email-4', 'app-4', 'user-1', 'cv-1', 'follow_up', 'Relance - Candidature Développeur Full Stack Symfony', 'Bonjour,\n\nJe reviens vers vous concernant ma candidature pour le poste de Développeur Full Stack Symfony envoyée le 7 février dernier.\n\nJe suis toujours très intéressé par cette opportunité chez WebSolutions Lyon et souhaiterais savoir où en est le processus de recrutement.\n\nDans l\'attente de votre retour,\n\nCordialement,\nJean Dupont', '2024-02-12T11:20:00.000Z', 'delivered', null, '2024-02-12T11:00:00.000Z'],
    ['email-5', 'app-5', 'user-2', 'cv-3', 'initial', 'Candidature - Chef de Projet Digital', 'Madame, Monsieur,\n\nJe vous adresse ma candidature spontanée pour un poste de Chef de Projet Digital au sein de DigitalAgency Bordeaux.\n\nAvec mon background en marketing digital et mon expérience en gestion de projets, je suis convaincue pouvoir apporter une réelle valeur ajoutée à votre équipe.\n\nJe serais ravie de vous rencontrer pour présenter mon parcours.\n\nCordialement,\nMarie Martin', '2024-01-25T16:00:00.000Z', 'opened', null, '2024-01-25T15:45:00.000Z'],
    ['email-6', 'app-6', 'user-1', 'cv-6', 'initial', 'Candidature spontanée - Data Analyst', 'Bonjour,\n\nJe suis actuellement étudiant en Master Data Science et je recherche une alternance dans le domaine de l\'analyse de données.\n\nVotre entreprise DataFirst Analytics m\'intéresse particulièrement pour son expertise dans l\'IA appliquée aux entreprises. Je maîtrise Python, SQL et les outils de visualisation de données (Tableau, Power BI).\n\nJe vous joins mon CV et reste à votre disposition.\n\nCordialement,\nJean Dupont', '2024-02-10T10:00:00.000Z', 'delivered', null, '2024-02-10T09:45:00.000Z'],
    ['email-7', 'app-8', 'user-1', 'cv-1', 'initial', 'Candidature - Data Analyst Junior', 'Bonjour,\n\nJe vous adresse ma candidature pour le poste de Data Analyst Junior chez InsightTech Paris.\n\nActuellement en Master Data Science, je dispose de solides compétences en Python, SQL et en analyse de données. J\'ai réalisé plusieurs projets académiques portant sur l\'analyse de données marketing.\n\nJe vous joins mon CV et reste à votre disposition.\n\nCordialement,\nJean Dupont', '2024-02-01T14:30:00.000Z', 'delivered', null, '2024-02-01T14:15:00.000Z'],
    ['email-8', 'app-9', 'user-2', 'cv-4', 'initial', 'Candidature - UX/UI Designer', 'Bonjour,\n\nJe suis très intéressée par le poste de UX/UI Designer chez DesignStudio Marseille.\n\nPassionnée par le design digital, je maîtrise Figma et les principes de design systems. Mon portfolio témoigne de ma capacité à créer des interfaces intuitives et esthétiques.\n\nJe vous joins mon CV et mon portfolio, et reste à votre disposition pour un entretien.\n\nCordialement,\nMarie Martin', '2024-02-11T15:00:00.000Z', 'delivered', null, '2024-02-11T14:45:00.000Z'],
    ['email-9', 'app-11', 'user-3', 'cv-5', 'initial', 'Candidature spontanée - Commercial B2B', 'Madame, Monsieur,\n\nJe suis actuellement étudiant en École de Commerce et je recherche une alternance dans le domaine commercial.\n\nVotre entreprise FinTech Start m\'intéresse pour son approche innovante dans les paiements mobiles. Motivé et dynamique, je suis convaincu pouvoir contribuer au développement de votre clientèle.\n\nJe vous joins mon CV et reste à votre disposition.\n\nCordialement,\nThomas Bernard', '2024-02-09T11:30:00.000Z', 'delivered', null, '2024-02-09T11:15:00.000Z'],
    ['email-10', 'app-12', 'user-1', 'cv-2', 'initial', 'Candidature spontanée - DevOps Engineer', 'Bonjour,\n\nJe suis développeur full stack avec un fort intérêt pour le DevOps et les technologies cloud natives.\n\nGreenTech Solutions m\'attire pour sa mission environnementale et ses technologies modernes. Je maîtrise Docker, j\'ai des bases en Kubernetes et je suis familier avec les pipelines CI/CD.\n\nBien que basé à Paris, je suis ouvert à une mobilité pour la bonne opportunité.\n\nCordialement,\nJean Dupont', '2024-02-13T09:00:00.000Z', 'delivered', null, '2024-02-13T08:45:00.000Z'],
    ['email-11', 'app-1', 'user-1', 'cv-2', 'follow_up', 'Remerciements - Entretien TechCorp', 'Bonjour,\n\nJe tenais à vous remercier pour l\'entretien technique d\'aujourd\'hui. J\'ai particulièrement apprécié échanger avec vous sur les défis techniques de votre équipe produit.\n\nCet entretien a renforcé ma motivation à rejoindre TechCorp France. Je reste à votre disposition pour toute information complémentaire.\n\nCordialement,\nJean Dupont', '2024-02-15T18:30:00.000Z', 'sent', null, '2024-02-15T18:15:00.000Z'],
    ['email-12', 'app-2', 'user-1', 'cv-2', 'initial', 'Candidature spontanée - Développeur', 'Bonjour,\n\nJe suis développeur web en alternance et je découvre votre entreprise InnovateDigital avec grand intérêt.\n\nVotre expertise dans le développement web et mobile correspond parfaitement à mes aspirations professionnelles. Je maîtrise React, Node.js et les bases de données relationnelles.\n\nJe vous joins mon CV et serais ravi d\'échanger sur les opportunités au sein de votre équipe.\n\nCordialement,\nJean Dupont', null, 'draft', null, '2024-02-15T10:00:00.000Z'],
  ] satisfies EmailRow[]).map(
    ([id, applicationId, userId, cvId, emailType, subject, body, sentAt, status, scheduledFollowUpDate, createdAt]) => [
      id,
      {
        id,
        applicationId,
        userId,
        cvId,
        emailType,
        subject,
        body,
        sentAt: sentAt ? new Date(sentAt) : null,
        status,
        scheduledFollowUpDate: scheduledFollowUpDate ? new Date(scheduledFollowUpDate) : null,
        createdAt: new Date(createdAt),
      },
    ]
  )
);

// ==================== TASKS ====================
export const mockTasks: Record<string, Task> = Object.fromEntries(
  ([
    ['task-1', 'user-1', 'app-2', 'follow_up', 'Relancer InnovateDigital', 'Envoyer un email de relance à InnovateDigital pour la candidature spontanée en cours de préparation.', new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), false, '2024-02-09T00:00:00.000Z', null],
    ['task-2', 'user-1', 'app-1', 'prepare_interview', 'Préparer entretien chez TechCorp', 'Réviser les questions techniques React et TypeScript. Préparer la présentation personnelle et les questions à poser.', new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(), false, '2024-02-10T00:00:00.000Z', null],
    ['task-3', 'user-2', 'app-3', 'prepare_interview', 'Préparer entretien avec Marketing Director', 'Préparer des cas marketing spécifiques au secteur SaaS. Réviser les KPIs digitaux et les métriques importantes.', new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), false, '2024-02-11T00:00:00.000Z', null],
    ['task-4', 'user-1', 'app-4', 'follow_up', 'Vérifier réponse WebSolutions', 'Vérifier si WebSolutions Lyon a répondu à la relance envoyée il y a 3 jours.', new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(), false, '2024-02-12T00:00:00.000Z', null],
    ['task-5', 'user-2', 'app-5', 'custom', 'Négocier l\'offre BrandBoost', 'Préparer les arguments pour négocier la partie transport de l\'offre. Objectif: obtenir 75% de remboursement.', new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), false, '2024-02-13T00:00:00.000Z', null],
    ['task-6', 'user-1', 'app-8', 'thank_you', 'Remercier InsightTech', 'Envoyer un email de remerciement à InsightTech malgré le refus, pour garder le contact pour de futures opportunités.', new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), false, '2024-02-10T00:00:00.000Z', null],
    ['task-7', 'user-1', null, 'complete_profile', 'Compléter le profil', 'Ajouter des informations supplémentaires au profil : lien LinkedIn, portfolio GitHub, bio détaillée.', new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), false, '2024-02-08T00:00:00.000Z', null],
    ['task-8', 'user-3', 'app-7', 'follow_up', 'Préparer candidature SalesForce Pro', 'Rédiger et envoyer la candidature pour le poste de Commercial B2B chez SalesForce Pro. Adapter le CV.', new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(), false, '2024-02-12T00:00:00.000Z', null],
    ['task-9', 'user-1', 'app-10', 'custom', 'Envoyer candidature CloudNative', 'Finaliser et envoyer la candidature pour le poste DevOps chez CloudNative Paris avant la fin de la semaine.', new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), false, '2024-02-14T00:00:00.000Z', null],
    ['task-10', 'user-2', 'app-9', 'follow_up', 'Relancer DesignStudio', 'Relancer DesignStudio Marseille si pas de réponse d\'ici vendredi.', new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(), false, '2024-02-11T00:00:00.000Z', null],
    ['task-11', 'user-1', 'app-1', 'thank_you', 'Remercier après entretien TechCorp', 'Envoyer un email de remerciement suite à l\'entretien technique avec TechCorp.', '2024-02-15T00:00:00.000Z', true, '2024-02-15T00:00:00.000Z', '2024-02-15T18:30:00.000Z'],
    ['task-12', 'user-3', null, 'custom', 'Préparer entretien FinTech Start', 'Se renseigner sur les tendances du marché des paiements mobiles pour l\'entretien avec FinTech Start.', new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), false, '2024-02-09T00:00:00.000Z', null],
  ] satisfies TaskRow[]).map(
    ([id, userId, applicationId, taskType, title, description, dueDate, isCompleted, createdAt, completedAt]) => [
      id,
      {
        id,
        userId,
        applicationId,
        taskType,
        title,
        description,
        dueDate: dueDate ? new Date(dueDate) : null,
        isCompleted,
        createdAt: new Date(createdAt),
        completedAt: completedAt ? new Date(completedAt) : null,
      },
    ]
  )
);

// ==================== CANDIDATURES ====================
// Données mockées pour démonstration — remplacées dès qu'une candidature est mutée (localStorage)
export const mockCandidatures: Record<string, Candidature> = {
  'cand-1': {
    id: 'cand-1',
    entreprise: 'TechCorp France',
    contactNom: 'Marie Dupont',
    contactRole: 'Responsable RH',
    posteVise: 'Développeur Frontend React',
    canal: 'LinkedIn',
    statut: 'À contacter',
    dateDernierContact: null,
    dateRelancePrevue: null,
    notes: 'Profil trouvé sur LinkedIn. Entreprise spécialisée fintech.',
    createdAt: '2026-06-10T10:00:00.000Z',
  },
  'cand-2': {
    id: 'cand-2',
    entreprise: 'InnovateDigital',
    contactNom: 'Pierre Martin',
    contactRole: 'CTO',
    posteVise: 'Développeur Full Stack',
    canal: 'Email',
    statut: 'Contacté',
    dateDernierContact: '2026-06-12',
    dateRelancePrevue: '2026-06-26',
    notes: 'Email envoyé mardi. En attente de retour.',
    createdAt: '2026-06-08T09:00:00.000Z',
  },
  'cand-3': {
    id: 'cand-3',
    entreprise: 'BrandBoost Paris',
    contactNom: 'Sarah Leblanc',
    contactRole: 'Directrice Marketing',
    posteVise: 'Marketing Manager Junior',
    canal: 'LinkedIn',
    statut: 'Réponse positive',
    dateDernierContact: '2026-06-14',
    dateRelancePrevue: null,
    notes: 'Entretien RH fixé pour la semaine prochaine. Super feeling !',
    createdAt: '2026-06-05T14:00:00.000Z',
  },
  'cand-4': {
    id: 'cand-4',
    entreprise: 'WebSolutions Lyon',
    contactNom: 'Antoine Moreau',
    contactRole: 'Responsable recrutement',
    posteVise: 'Développeur Symfony',
    canal: 'Email',
    statut: 'Réponse négative',
    dateDernierContact: '2026-06-11',
    dateRelancePrevue: null,
    notes: 'Refus poli — profil trop junior pour leur besoin actuel.',
    createdAt: '2026-06-01T11:00:00.000Z',
  },
  'cand-5': {
    id: 'cand-5',
    entreprise: 'DataFirst Analytics',
    contactNom: 'Thomas Renard',
    contactRole: 'Lead Data',
    posteVise: 'Data Analyst Junior',
    canal: 'Email',
    statut: 'À relancer',
    dateDernierContact: '2026-06-08',
    dateRelancePrevue: '2026-06-15',
    notes: 'Pas de réponse depuis 8 jours. Relance urgente.',
    createdAt: '2026-06-02T08:00:00.000Z',
  },
  'cand-6': {
    id: 'cand-6',
    entreprise: 'GreenTech Solutions',
    contactNom: '',
    contactRole: '',
    posteVise: 'DevOps Junior',
    canal: 'Email',
    statut: 'À contacter',
    dateDernierContact: null,
    dateRelancePrevue: null,
    notes: 'Candidature spontanée à préparer.',
    createdAt: '2026-06-13T15:00:00.000Z',
  },
  'cand-7': {
    id: 'cand-7',
    entreprise: 'DesignStudio Marseille',
    contactNom: 'Julie Blanc',
    contactRole: 'Art Director',
    posteVise: 'UX/UI Designer',
    canal: 'LinkedIn',
    statut: 'Contacté',
    dateDernierContact: '2026-06-06',
    dateRelancePrevue: '2026-06-10',
    notes: 'Portfolio envoyé. Relance dépassée !',
    createdAt: '2026-06-04T12:00:00.000Z',
  },
  'cand-8': {
    id: 'cand-8',
    entreprise: 'CloudNative Paris',
    contactNom: 'Marc Dupuis',
    contactRole: 'Engineering Manager',
    posteVise: 'Ingénieur Cloud Junior',
    canal: 'LinkedIn',
    statut: 'À relancer',
    dateDernierContact: '2026-06-07',
    dateRelancePrevue: '2026-06-14',
    notes: 'Docker + Kubernetes. Stack parfaite. Relancer ASAP.',
    createdAt: '2026-06-03T10:00:00.000Z',
  },
  'cand-9': {
    id: 'cand-9',
    entreprise: 'FinTech Start',
    contactNom: 'Laura Simon',
    contactRole: 'COO',
    posteVise: 'Développeur Mobile React Native',
    canal: 'Téléphone',
    statut: 'Réponse positive',
    dateDernierContact: '2026-06-15',
    dateRelancePrevue: null,
    notes: 'Appel très positif. Envoi du contrat attendu cette semaine.',
    createdAt: '2026-06-06T16:00:00.000Z',
  },
  'cand-10': {
    id: 'cand-10',
    entreprise: 'SalesForce Pro',
    contactNom: '',
    contactRole: '',
    posteVise: 'Commercial B2B Junior',
    canal: 'Email',
    statut: 'À contacter',
    dateDernierContact: null,
    dateRelancePrevue: null,
    notes: '',
    createdAt: '2026-06-14T09:00:00.000Z',
  },
};