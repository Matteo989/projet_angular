import { Injectable, computed, signal } from '@angular/core';
import { ARRIVEE, DEPART, Lieu, RUES, TypeLieu, genererCarte } from './paris';

export type Statut = 'en-cours' | 'victoire' | 'defaite';

export const NOMS_TYPES: Record<TypeLieu, string> = {
  depart: 'Départ du cortège',
  affrontement: 'Affrontement',
  evenement: 'Événement',
  soin: 'Street medics',
  bac: 'Brigade de la BAC',
  cantine: 'Cantine solidaire',
  prefet: 'Le Préfet',
};

const PV_MAX = 60;
const DEGATS_CHARGE = 10;

interface Evenement {
  texte: string;
  pv?: number;
  solidarite?: number;
  nasse?: number;
}

const EVENEMENTS: Evenement[] = [
  { texte: 'Une barricade improvisée ralentit le cordon.', nasse: -1.5 },
  { texte: 'Nuage de lacrymo dans la rue.', pv: -7 },
  { texte: 'Des riverains vous ouvrent une porte cochère.', pv: 10 },
  { texte: 'Fausse rumeur sur Telegram : le cortège se disperse.', nasse: 1 },
  { texte: 'Une fanfare rejoint le cortège.', solidarite: 15 },
  { texte: 'Un drone repère votre groupe.', nasse: 0.8, pv: -3 },
  { texte: 'Distribution de sérum physiologique.', pv: 6, solidarite: 5 },
];

@Injectable({ providedIn: 'root' })
export class CampagneService {
  readonly rues = RUES;
  readonly pvMax = PV_MAX;

  readonly lieux = signal<Lieu[]>([]);
  readonly position = signal(DEPART);
  readonly visites = signal<ReadonlySet<string>>(new Set([DEPART]));
  /** Avance de la nasse : +1 à chaque déplacement. */
  readonly pression = signal(0);
  readonly tour = signal(0);
  readonly pv = signal(PV_MAX);
  readonly solidarite = signal(0);
  readonly cartes = signal(10);
  readonly journal = signal<string[]>([]);
  readonly statut = signal<Statut>('en-cours');

  readonly parId = computed(() => new Map(this.lieux().map((l) => [l.id, l])));

  readonly voisins = computed(() => {
    const voisins = new Map<string, string[]>();
    for (const { a, b } of this.rues) {
      voisins.set(a, [...(voisins.get(a) ?? []), b]);
      voisins.set(b, [...(voisins.get(b) ?? []), a]);
    }
    return voisins;
  });

  readonly accessibles = computed(
    () => new Set(this.statut() === 'en-cours' ? (this.voisins().get(this.position()) ?? []) : []),
  );

  readonly lieuActuel = computed(() => this.parId().get(this.position())!);

  /** Lieux tenus par les CRS au tour suivant si personne ne bouge. */
  readonly menaces = computed(() => {
    const p = this.pression();
    return new Set(
      this.lieux()
        .filter((l) => l.nasseA > p && l.nasseA <= p + 1)
        .map((l) => l.id),
    );
  });

  /** Lieux nassés qui touchent encore une rue libre : c'est là que se tient le cordon. */
  readonly front = computed(() => {
    const voisins = this.voisins();
    return new Set(
      this.lieux()
        .filter((l) => this.estNasse(l) && voisins.get(l.id)!.some((v) => !this.estNasse(this.parId().get(v)!)))
        .map((l) => l.id),
    );
  });

  readonly partNasse = computed(() => {
    const lieux = this.lieux();
    return lieux.length ? lieux.filter((l) => this.estNasse(l)).length / lieux.length : 0;
  });

  constructor() {
    this.nouvellePartie();
  }

  estNasse(lieu: Lieu): boolean {
    return lieu.type !== 'prefet' && this.pression() >= lieu.nasseA;
  }

  nouvellePartie(graine = Date.now()): void {
    this.lieux.set(genererCarte(graine));
    this.position.set(DEPART);
    this.visites.set(new Set([DEPART]));
    this.pression.set(0);
    this.tour.set(0);
    this.pv.set(PV_MAX);
    this.solidarite.set(0);
    this.cartes.set(10);
    this.statut.set('en-cours');
    this.journal.set(['Le cortège se forme à Porte Maillot. Objectif : Nation.']);
  }

  deplacer(id: string): void {
    if (!this.accessibles().has(id)) {
      return;
    }
    const lieu = this.parId().get(id)!;
    this.tour.update((t) => t + 1);
    this.pression.update((p) => p + 1);
    this.position.set(id);

    const dejaVisite = this.visites().has(id);
    this.visites.update((v) => new Set(v).add(id));
    this.noter(`Tour ${this.tour()} — ${lieu.nom}`);

    if (this.estNasse(lieu)) {
      this.noter(`Nassé·e ! Charge des CRS : −${DEGATS_CHARGE} PV.`);
      this.modifierPv(-DEGATS_CHARGE);
    } else if (!dejaVisite) {
      this.rencontre(lieu);
    }
    this.verifierFin();
  }

  /** Placeholder : les combats seront résolus par le moteur de deck. */
  private rencontre(lieu: Lieu): void {
    const de = (min: number, max: number) => min + Math.floor(Math.random() * (max - min + 1));
    switch (lieu.type) {
      case 'affrontement': {
        const degats = de(3, 9);
        const gain = de(8, 15);
        this.noter(`Affrontement avec une compagnie de CRS : −${degats} PV, +${gain} solidarité.`);
        this.modifierPv(-degats);
        this.solidarite.update((s) => s + gain);
        break;
      }
      case 'bac': {
        const degats = de(10, 16);
        this.noter(`La BAC surgit ! −${degats} PV, +30 solidarité, +1 carte rare.`);
        this.modifierPv(-degats);
        this.solidarite.update((s) => s + 30);
        this.cartes.update((c) => c + 1);
        break;
      }
      case 'soin':
        this.noter('Les street medics vous soignent : +15 PV.');
        this.modifierPv(15);
        break;
      case 'cantine':
        if (this.solidarite() >= 20) {
          this.solidarite.update((s) => s - 20);
          this.cartes.update((c) => c + 1);
          this.noter('Cantine solidaire : 20 solidarité échangées contre une carte.');
        } else {
          this.noter('Cantine solidaire : un café chaud, +4 PV.');
          this.modifierPv(4);
        }
        break;
      case 'evenement': {
        const e = EVENEMENTS[Math.floor(Math.random() * EVENEMENTS.length)];
        this.noter(e.texte);
        if (e.pv) this.modifierPv(e.pv);
        if (e.solidarite) this.solidarite.update((s) => s + e.solidarite!);
        if (e.nasse) this.pression.update((p) => Math.max(0, p + e.nasse!));
        break;
      }
      case 'prefet':
        this.noter('Face-à-face avec le Préfet et ses canons à eau : −20 PV.');
        this.modifierPv(-20);
        break;
    }
  }

  private verifierFin(): void {
    if (this.pv() <= 0) {
      this.statut.set('defaite');
      this.noter('Interpellé·e. Fin de la manif.');
    } else if (this.position() === ARRIVEE) {
      this.statut.set('victoire');
      this.noter('Le cortège atteint Nation. Victoire !');
    }
  }

  private modifierPv(delta: number): void {
    this.pv.update((pv) => Math.max(0, Math.min(PV_MAX, pv + delta)));
  }

  private noter(ligne: string): void {
    this.journal.update((j) => [ligne, ...j].slice(0, 40));
  }
}
