# Nuitomètre

Compteur de nuitées pour les résidences principales louées en meublé de tourisme
(Airbnb, Booking, Abritel, location directe). Première version : site vitrine, calculateur gratuit,
pages « plafond par ville » et liste d'attente de la bêta.

## Lancer

```bash
cd compteur-nuitees
npm install
npm start              # développement, http://localhost:4200
npm run build          # site statique dans dist/compteur-nuitees/browser
npm run serve:static   # sert le build sur http://localhost:8080
npm run test:logic     # tests du décompte des nuits et de la lecture des .ics
```

## Avant la mise en ligne

1. **Domaine** : remplacer `https://nuitometre.fr` dans `src/app/core/site.ts`, `public/robots.txt`
   et `public/sitemap.xml`.
2. **Mentions légales** : compléter les champs « À COMPLÉTER » de `src/app/core/site.ts`
   (éditeur, SIRET, adresse, hébergeur). C'est obligatoire (loi n° 2004-575, art. 6).
3. **Inscriptions bêta** : créer un formulaire Formspree, Brevo ou équivalent et coller son adresse
   dans `inscriptionEndpoint`. Tant que ce champ est vide, le formulaire affiche l'email de contact.
4. **Hébergement** : n'importe quel hébergeur statique (Netlify, Cloudflare Pages, Vercel…).
   Le fichier `public/_headers` ajoute les en-têtes de sécurité sur Netlify et Cloudflare Pages.

## Où modifier quoi

| Fichier | Contenu |
|---|---|
| `src/app/core/communes.ts` | Plafond de chaque commune, avec sa source. Passer une commune en `officielle` seulement après avoir lu la délibération. |
| `src/app/core/faq.ts` | Questions fréquentes (aussi publiées en données structurées pour Google). |
| `src/app/core/nights.ts` | Décompte des nuits et lecture des calendriers `.ics`. Testé dans `nights.spec.ts`. |
| `src/app/core/site.ts` | Nom, domaine, email, mentions légales, sources officielles. |
| `src/styles.scss` | Couleurs (clair et sombre), typographie, boutons. |

Ajouter une ville dans `communes.ts` crée automatiquement sa page `/plafond/<slug>` au prochain build.
Penser à l'ajouter aussi dans `public/sitemap.xml`.

## Règles appliquées (vérifiées le 2 novembre 2026)

- 120 nuits par année civile pour une résidence principale ; une commune peut descendre jusqu'à 90.
- Paris : 90 nuits depuis le 1er janvier 2025 (paris.fr). Nice : 90 nuits depuis le 1er janvier 2026
  (délibération du 23 mai 2025). Les autres villes sont marquées « à confirmer ».
- Amendes (guide du ministère, sept. 2025) : dépassement jusqu'à 25 000 € depuis mai 2026 ;
  défaut de transmission du décompte des nuitées 15 000 € ; défaut d'enregistrement 10 000 €.

## Choix techniques

- Angular 21, composants autonomes, signals, sans zone.js.
- Toutes les pages sont prérendues en HTML statique (référencement, rapidité).
- Polices hébergées avec le site (aucune requête vers Google Fonts, donc rien à déclarer côté RGPD).
- Aucun cookie ni traceur : pas de bandeau de consentement nécessaire.
- Les fichiers `.ics` sont lus dans le navigateur, jamais envoyés.
- Accessibilité visée : RGAA 4.1 / WCAG 2.2 AA (contrastes, focus visible, lien d'évitement,
  libellés de formulaire, zone de résultat annoncée aux lecteurs d'écran, animations coupées si
  l'utilisateur le demande).
