# Tandem - Prototype Export

This is an interactive prototype automatically generated from the Tandem
specification and screen designs by [Mowgli](https://mowgli.ai).

The prototype does not have a backend, and is not meant to be production-ready
code. Instead, it illustrates the behaviors and feel of the UI, and serves as a
starting point for creating a rich, fully-featured app or website.

## Quick Start

```bash
npm install
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173) in your browser.

## What's Inside

- `src/components/` - Screen components (one per app screen)
- `src/stores/` - Zustand state management with mock data
- `src/types.ts` - TypeScript type definitions derived from the data model
- `src/main.tsx` - Application entrypoint
- `public/images/` - Images
- `SPEC.md` - The full application specification

## Technical Notes

- The prototype uses **Tailwind CSS** for styling and **Zustand** for state
  management.
- All state is client-side with mock data. There is no backend, but every attempt
  was made to make the state management and logic consistent and strict.
- Each screen is a self-contained megacomponent. This is because the prototype
  was created from a static design, and Mowgli prioritizes design fidelity. As a
  result, there is repeated code across screens. A good starting point would be
  to extract common components into their own files.
- The prototype renders a real, interactive UI but does not save or persist data.

## Next Steps

This prototype is a starting point. As further development progresses, you will
likely want to:

1. Factor out shared components (navs, headers, buttons, cards, etc.)
2. Replace mock data with real API calls and backend integration, including
   moving parts of the state to the backend, and querying it (e.g. using Tanstack
   Query)
3. Add proper routing (e.g. Tanstack Router, Next.js Page/App Router,
   React Router, etc.)
4. Extract repeated styles into a reusable Tailwind configuraiton
5. If creating a native app, port the prototype to Expo, React Native, or
   Flutter.

Refer to `SPEC.md` for the full application specification including user
journeys, data model, and frontend screen descriptions.


# About the Prototype

## Welcome to Tandem! 🚀

This is your interactive prototype for the apprenticeship management platform. Here's everything you need to know to explore the app.

## Quick Start

To jump right in, use the **Reset** action in the preview states panel to start fresh. You'll land on the Dashboard as a logged-in user.

## Mock Login Credentials

Use these credentials to sign in through the Login screen:

- **Email:** `jean.dupont@example.com`
- **Password:** Any password works (this is a prototype, validation is simulated)

## How to Explore

### Main Screens (accessible via sidebar):
- **Dashboard** — Your home base with KPIs and a smart to-do list
- **Radar** — Discover opportunities (online offers and hidden market companies)
- **Pipeline** — Kanban board tracking your applications
- **Studio** — Compose and send cold emails
- **Settings** — Manage CVs, account info, and subscription

### Key Workflows to Try:

**1. Sign up a new user:**
- Go to Signup screen
- Fill in any values for name, email, password (no strict validation)
- Check the "I accept" checkbox
- Click "Commencer gratuitement" → You'll see the Email Verification screen
- Click "J'ai vérifié mon email" → Enter Onboarding (3 steps)
- Complete domain, rhythm, and location → Dashboard appears

**2. Send a cold email:**
- Navigate to Studio
- Select a template from the left panel
- Choose a CV from the dropdown (or upload one in Settings first)
- Edit the subject and body as needed
- Click "Envoyer" → Email sent and application status updated

**3. Track applications in Pipeline:**
- Go to Pipeline to see your kanban board
- Click any card to view details
- Drag cards between columns to update status
- Drag to "Offre / Refus" to open the outcome modal

**4. Discover opportunities:**
- In Radar, switch between "Offres en ligne" and "Marché Caché" tabs
- Apply filters (domain, location, rhythm)
- Click "Ajouter au CRM" on any opportunity to add it to your Pipeline

## Freemium Features

The prototype includes a free tier simulation:
- **Daily email limit:** 5 emails/day for free users
- **Locked features:** "Taux d'ouverture" KPI and follow-up scheduling show upgrade prompts
- **To upgrade:** Click "Passer Premium" in the sidebar or any lock icon

## Useful Tips

- **Dark mode:** Toggle via the moon icon in the sidebar
- **Navigation:** Use sidebar icons to move between screens
- **Email verification:** After signup, click "J'ai vérifié mon email" to proceed (simulated)
- **Reset anytime:** Use the Reset preview state to return to a clean slate

Enjoy exploring the prototype! 🎓