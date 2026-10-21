# Ni deck ni maître

Deckbuilder militant en Angular. Ce dépôt contient pour l'instant la **carte de campagne** :
un Paris dessiné façon carnet, qu'on traverse de Porte Maillot à Nation, façon *FTL*.

## Lancer

```bash
npm install
npm start   # http://localhost:4200
```

## La carte (`src/app/carte/`)

- `paris.ts` — les lieux (places, gares, carrefours), les rues qui les relient, la Seine et ses ponts.
  Le type de chaque lieu (affrontement, événement, street medics, BAC, cantine) est tiré au sort à chaque partie.
- `campagne.service.ts` — l'état de la partie (signals) : position, PV, solidarité, tour, journal.
- `carte.ts` / `carte.html` — le rendu SVG et les clics.

On peut aller vers n'importe quel lieu relié par une rue : avancer, reculer ou partir sur les côtés.
Chaque déplacement coûte un tour.

### La nasse

À chaque tour, les CRS avancent : ils poussent depuis l'ouest (derrière le cortège) et resserrent
les flancs nord et sud. Chaque lieu a un seuil `nasseA` calculé à partir de sa position (`calculerNasse`).

- contour orange pointillé : le lieu tombe au prochain tour ;
- lieu bleu : tenu par les CRS. Y entrer déclenche une charge (−10 PV) ;
- bouclier « CRS » : le front du cordon.

Certains événements font reculer la nasse (barricade) ou la font accélérer (fausse rumeur, drone).

Les rencontres sont pour l'instant résolues par des jets simples (`CampagneService.rencontre`) :
c'est là qu'il faudra brancher les combats de cartes.
