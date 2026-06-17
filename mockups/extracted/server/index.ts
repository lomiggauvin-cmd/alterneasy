import express from 'express';
import cors from 'cors';
import Anthropic from '@anthropic-ai/sdk';

const app  = express();
const PORT = 3001;

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY ?? '',
});

// ─── POST /api/generate-message ───────────────────────────────────────────────

app.post('/api/generate-message', async (req, res) => {
  const { studentProfile, candidature, extraInfos } = req.body as {
    studentProfile: {
      nom: string;
      ecole: string;
      secteur: string;
      periodeAlternance: string;
      cherche: string;
    };
    candidature: {
      entreprise:  string;
      contactNom:  string;
      contactRole: string;
      posteVise:   string;
      canal:       string;
    };
    extraInfos: string;
  };

  if (!process.env.ANTHROPIC_API_KEY) {
    res.status(503).json({ error: 'ANTHROPIC_API_KEY non configurée côté serveur.' });
    return;
  }

  const prompt = `Tu es un assistant spécialisé dans la rédaction de messages de prise de contact LinkedIn pour des étudiants en alternance.

## Profil de l'étudiant
- Nom : ${studentProfile.nom}
- École : ${studentProfile.ecole}
- Secteur / Domaine : ${studentProfile.secteur}
- Disponibilité alternance : ${studentProfile.periodeAlternance}
- Ce qu'il cherche : ${studentProfile.cherche}

## Cible
- Entreprise : ${candidature.entreprise}
- Contact : ${candidature.contactNom}${candidature.contactRole ? ` (${candidature.contactRole})` : ''}
- Poste visé : ${candidature.posteVise || 'alternance dans le secteur'}
- Canal : ${candidature.canal}

## Informations supplémentaires sur l'entreprise
${extraInfos || '(aucune information supplémentaire fournie)'}

## Instruction
Génère un message LinkedIn en français, professionnel mais chaleureux, structuré en EXACTEMENT 2 blocs distincts séparés par "---BLOC---" :

**Bloc 1 — Pitch étudiant (fixe)** : 2-3 phrases présentant l'étudiant, son école, son domaine et ce qu'il cherche. Ce bloc sera réutilisé pour plusieurs entreprises.

**Bloc 2 — Personnalisation dynamique** : 3-5 lignes spécifiques à cette entreprise et ce contact. Référence une activité, un projet, une valeur ou une actualité de l'entreprise (utilise les infos supplémentaires fournies, ou propose quelque chose de vraisemblable). Termine par une invitation à échanger.

Contraintes :
- Total < 300 mots
- Commencer le Bloc 1 par "Bonjour [Prénom du contact ou 'Madame/Monsieur'],"
- Pas de "Cordialement" ou signature dans le Bloc 1 (uniquement dans le Bloc 2)
- Ton : direct, sincère, pas trop formel
- IMPORTANT : sépare les deux blocs UNIQUEMENT avec "---BLOC---" (exactement)`;

  try {
    const message = await anthropic.messages.create({
      model:      'claude-opus-4-5',
      max_tokens: 1024,
      messages:   [{ role: 'user', content: prompt }],
    });

    const raw = message.content[0].type === 'text' ? message.content[0].text : '';
    const parts = raw.split('---BLOC---');

    const blocFixe      = (parts[0] ?? raw).trim();
    const blocDynamique = (parts[1] ?? '').trim();

    res.json({ blocFixe, blocDynamique });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Erreur inconnue';
    console.error('[generate-message]', msg);
    res.status(500).json({ error: msg });
  }
});

app.listen(PORT, () => {
  console.log(`✅  Serveur API démarré sur http://localhost:${PORT}`);
  console.log(`   ANTHROPIC_API_KEY : ${process.env.ANTHROPIC_API_KEY ? '✓ configurée' : '✗ manquante — set ANTHROPIC_API_KEY=sk-ant-...'}`);
});
