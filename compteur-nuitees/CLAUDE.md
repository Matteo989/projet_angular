# Nuitomètre

SaaS français qui compte les nuits louées d'une résidence principale en meublé de tourisme,
toutes plateformes additionnées (Airbnb, Booking, Abritel, location directe), et prévient avant
le plafond légal (120 nuits par an, 90 dans certaines communes).

Le site, le code et les commits sont en français. Réponds en français.

## Objectif business

- Revenu récurrent avec peu d'entretien. Cible prioritaire : les **conciergeries Airbnb** des
  villes à 90 nuits (2 € par logement et par mois). Cible secondaire : les propriétaires
  (4,90 € par mois).
- Étape actuelle : site vitrine + calculateur gratuit + liste d'attente, pour valider la demande
  auprès des conciergeries avant de construire la version payante.
- Prochaine étape produit : synchronisation des liens iCal côté serveur, compteur par logement,
  alertes email à 80, 90 et 100 %, relevé de nuitées en PDF, tableau de bord multi-logements.

## Commandes

```bash
npm install
npm start              # http://localhost:4200
npm run build          # prérendu statique dans dist/compteur-nuitees/browser
npm run serve:static   # sert le build sur http://localhost:8080
npm run test:logic     # tests node --test de src/app/core/nights.ts
```

Avant de dire qu'un changement fonctionne : `npm run test:logic` et `npm run build` sans erreur.

## Architecture

- Angular 21 : composants autonomes, signals, `ChangeDetectionStrategy.OnPush`, sans zone.js,
  nouveau control flow (`@if`, `@for`). Pas de NgModule.
- Sortie `static` : toutes les routes sont prérendues (`src/app/app.routes.server.ts`).
  Les pages `/plafond/:slug` sont générées depuis `COMMUNES`.
- `src/app/core/` : logique et données sans interface.
  - `nights.ts` : décompte des nuits (dates `AAAA-MM-JJ` en UTC, départ exclu, année civile)
    et lecture des `.ics`. Garder ce fichier sans dépendance Angular : il est testé avec Node.
  - `communes.ts` : plafond par commune, avec `verification: 'officielle' | 'a-confirmer'`.
  - `site.ts` : nom, domaine, email, mentions légales, endpoint d'inscription, sources.
  - `seo.ts` : titre, description, canonique, Open Graph, JSON-LD par page.
  - `faq.ts` : questions fréquentes (aussi publiées en JSON-LD FAQPage).
- `src/app/shared/` : calculateur, grille de l'année, formulaire bêta, FAQ.
- `src/app/pages/` : accueil, page ville, mentions légales, confidentialité, 404.
- `src/styles.scss` : jetons de couleur (clair et sombre), typographie, boutons.

## Règles à respecter

- **Exactitude juridique.** Toute règle affichée doit venir d'une source officielle (Légifrance,
  service-public.fr, guide du ministère, site ou délibération de la mairie). Ne jamais passer une
  commune en `officielle` sans avoir lu la délibération. Mettre à jour `SITE.verifieLe` après
  chaque vérification. Les blogs se contredisent souvent : ne pas s'y fier seuls.
- **Pas de traceur.** Aucun cookie, aucune analytics tierce, polices auto-hébergées
  (`@fontsource-variable`). Si on ajoute une mesure d'audience, elle doit être exemptée de
  consentement (CNIL) ou il faut un bandeau, et la page confidentialité doit être mise à jour.
- **Données des utilisateurs.** Les fichiers `.ics` du calculateur restent dans le navigateur.
- **Accessibilité RGAA / WCAG 2.2 AA** : libellés sur chaque champ, focus visible, contrastes,
  `aria-live` sur les résultats, `prefers-reduced-motion` respecté, aucun débordement horizontal
  à 390 px.
- **Design.** Bleu nuit + ambre « fenêtre allumée » (une nuit louée = une case allumée), rouge
  brique pour le dépassement. Polices : Bricolage Grotesque (titres), Atkinson Hyperlegible Next
  (texte). Couleurs uniquement via les variables de `styles.scss`.
- Ajouter une ville dans `communes.ts` impose de l'ajouter aussi dans `public/sitemap.xml`.

## Faits juridiques vérifiés (2 novembre 2026)

Source principale : guide pratique du ministère, septembre 2025
(ecologie.gouv.fr, « 25113_GuidePratique2025MeubleTourisme.pdf »).

- Résidence principale = occupée au moins 8 mois par an, sauf obligation professionnelle, santé
  ou force majeure. Plafond : 120 nuits par année civile ; une commune peut descendre jusqu'à 90.
- Chambre chez l'habitant : pas un meublé de tourisme, pas de plafond.
- Numéro d'enregistrement obligatoire partout à partir de mai 2026, affiché sur chaque annonce.
- Amendes maximales : dépassement du plafond 25 000 € depuis mai 2026 (paris.fr indique encore
  10 000 €) ; défaut de transmission du décompte de nuitées à la commune 15 000 € ; défaut
  d'enregistrement 10 000 € ; fausse déclaration ou faux numéro 20 000 €.
- Paris : 90 nuits depuis le 1er janvier 2025 (paris.fr). Nice : 90 nuits depuis le
  1er janvier 2026 (délibération du 23 mai 2025). Lyon, Bordeaux, Marseille, Montpellier,
  Annecy : annoncées à 90, à confirmer.
- Exports iCal : Airbnb distingue « Reserved » et « Airbnb (Not available) » ; Booking exporte
  tout en « CLOSED - Not available ». En cas de doute on compte la nuit.

## Avant la mise en ligne

1. Remplacer le domaine `https://nuitometre.fr` (site.ts, robots.txt, sitemap.xml).
2. Compléter les champs « À COMPLÉTER » de `site.ts` (mentions légales obligatoires).
3. Renseigner `inscriptionEndpoint` (Formspree, Brevo…).
4. Déployer `dist/compteur-nuitees/browser` sur un hébergeur statique (Netlify, Cloudflare Pages).
