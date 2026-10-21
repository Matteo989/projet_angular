/**
 * Carte de Paris pour la campagne : carrefours et places (nœuds) reliés par des rues (arêtes).
 * Coordonnées dans un repère 1000 × 640, ouest à gauche, nord en haut.
 */

export type TypeLieu = 'depart' | 'affrontement' | 'evenement' | 'soin' | 'bac' | 'cantine' | 'prefet';

export interface Lieu {
  id: string;
  nom: string;
  x: number;
  y: number;
  type: TypeLieu;
  /** Tour (pression de la nasse) à partir duquel les CRS tiennent ce lieu. */
  nasseA: number;
}

export interface Rue {
  a: string;
  b: string;
  /** Rue qui traverse la Seine. */
  pont?: boolean;
}

export const DEPART = 'maillot';
export const ARRIVEE = 'nation';

const LIEUX: Omit<Lieu, 'type' | 'nasseA'>[] = [
  { id: 'maillot', nom: 'Porte Maillot', x: 70, y: 210 },
  { id: 'etoile', nom: 'Étoile', x: 175, y: 255 },
  { id: 'trocadero', nom: 'Trocadéro', x: 160, y: 365 },
  { id: 'champdemars', nom: 'Champ-de-Mars', x: 235, y: 445 },
  { id: 'invalides', nom: 'Invalides', x: 320, y: 405 },
  { id: 'concorde', nom: 'Concorde', x: 365, y: 300 },
  { id: 'madeleine', nom: 'Madeleine', x: 380, y: 220 },
  { id: 'stlazare', nom: 'Saint-Lazare', x: 410, y: 140 },
  { id: 'opera', nom: 'Opéra', x: 480, y: 195 },
  { id: 'pigalle', nom: 'Pigalle', x: 505, y: 75 },
  { id: 'garedunord', nom: 'Gare du Nord', x: 605, y: 100 },
  { id: 'stalingrad', nom: 'Stalingrad', x: 710, y: 70 },
  { id: 'garedelest', nom: "Gare de l'Est", x: 630, y: 170 },
  { id: 'republique', nom: 'République', x: 670, y: 250 },
  { id: 'belleville', nom: 'Belleville', x: 790, y: 185 },
  { id: 'perelachaise', nom: 'Père-Lachaise', x: 855, y: 285 },
  { id: 'nation', nom: 'Nation', x: 925, y: 390 },
  { id: 'bastille', nom: 'Bastille', x: 730, y: 345 },
  { id: 'hoteldeville', nom: 'Hôtel de Ville', x: 610, y: 335 },
  { id: 'chatelet', nom: 'Châtelet', x: 545, y: 310 },
  { id: 'leshalles', nom: 'Les Halles', x: 560, y: 245 },
  { id: 'louvre', nom: 'Louvre', x: 465, y: 295 },
  { id: 'notredame', nom: 'Notre-Dame', x: 580, y: 385 },
  { id: 'stmichel', nom: 'Saint-Michel', x: 530, y: 425 },
  { id: 'odeon', nom: 'Odéon', x: 450, y: 430 },
  { id: 'pantheon', nom: 'Panthéon', x: 555, y: 490 },
  { id: 'montparnasse', nom: 'Montparnasse', x: 365, y: 515 },
  { id: 'denfert', nom: 'Denfert', x: 455, y: 580 },
  { id: 'italie', nom: "Place d'Italie", x: 625, y: 575 },
  { id: 'austerlitz', nom: 'Austerlitz', x: 690, y: 475 },
  { id: 'garedelyon', nom: 'Gare de Lyon', x: 790, y: 410 },
  { id: 'bercy', nom: 'Bercy', x: 870, y: 470 },
];

export const RUES: Rue[] = [
  { a: 'maillot', b: 'etoile' },
  { a: 'maillot', b: 'trocadero' },
  { a: 'etoile', b: 'trocadero' },
  { a: 'etoile', b: 'concorde' },
  { a: 'etoile', b: 'stlazare' },
  { a: 'trocadero', b: 'champdemars', pont: true },
  { a: 'trocadero', b: 'concorde' },
  { a: 'champdemars', b: 'invalides' },
  { a: 'champdemars', b: 'montparnasse' },
  { a: 'invalides', b: 'concorde', pont: true },
  { a: 'invalides', b: 'odeon' },
  { a: 'invalides', b: 'montparnasse' },
  { a: 'concorde', b: 'madeleine' },
  { a: 'concorde', b: 'louvre' },
  { a: 'madeleine', b: 'opera' },
  { a: 'madeleine', b: 'stlazare' },
  { a: 'stlazare', b: 'opera' },
  { a: 'stlazare', b: 'pigalle' },
  { a: 'opera', b: 'pigalle' },
  { a: 'opera', b: 'leshalles' },
  { a: 'pigalle', b: 'garedunord' },
  { a: 'garedunord', b: 'stalingrad' },
  { a: 'garedunord', b: 'garedelest' },
  { a: 'stalingrad', b: 'belleville' },
  { a: 'stalingrad', b: 'garedelest' },
  { a: 'garedelest', b: 'republique' },
  { a: 'garedelest', b: 'leshalles' },
  { a: 'republique', b: 'belleville' },
  { a: 'republique', b: 'bastille' },
  { a: 'republique', b: 'hoteldeville' },
  { a: 'republique', b: 'perelachaise' },
  { a: 'belleville', b: 'perelachaise' },
  { a: 'perelachaise', b: 'nation' },
  { a: 'perelachaise', b: 'bastille' },
  { a: 'bastille', b: 'nation' },
  { a: 'bastille', b: 'garedelyon' },
  { a: 'bastille', b: 'hoteldeville' },
  { a: 'garedelyon', b: 'nation' },
  { a: 'garedelyon', b: 'bercy' },
  { a: 'garedelyon', b: 'austerlitz', pont: true },
  { a: 'bercy', b: 'nation' },
  { a: 'bercy', b: 'italie', pont: true },
  { a: 'hoteldeville', b: 'chatelet' },
  { a: 'hoteldeville', b: 'notredame', pont: true },
  { a: 'chatelet', b: 'leshalles' },
  { a: 'chatelet', b: 'louvre' },
  { a: 'chatelet', b: 'stmichel', pont: true },
  { a: 'leshalles', b: 'louvre' },
  { a: 'louvre', b: 'odeon', pont: true },
  { a: 'notredame', b: 'stmichel', pont: true },
  { a: 'stmichel', b: 'odeon' },
  { a: 'stmichel', b: 'pantheon' },
  { a: 'odeon', b: 'pantheon' },
  { a: 'odeon', b: 'montparnasse' },
  { a: 'pantheon', b: 'austerlitz' },
  { a: 'pantheon', b: 'italie' },
  { a: 'pantheon', b: 'denfert' },
  { a: 'montparnasse', b: 'denfert' },
  { a: 'denfert', b: 'italie' },
  { a: 'italie', b: 'austerlitz' },
];

/** Tracé de la Seine, d'est en ouest. */
export const SEINE =
  'M1000,560 C930,520 860,500 800,455 S720,415 660,395 S560,360 510,375 ' +
  'S420,360 380,350 S280,350 230,395 S120,470 0,520';

/**
 * La nasse se referme depuis l'ouest (les CRS poussent derrière le cortège)
 * et depuis les flancs nord et sud (ils resserrent le cordon).
 */
function calculerNasse(x: number, y: number): number {
  const progression = (x - 70) / (925 - 70);
  const ecartAxe = Math.min(1, Math.abs(y - 320) / 260);
  return 1.5 + progression * 7 + (1 - ecartAxe) * 3;
}

function aleatoire(graine: number): () => number {
  let s = graine >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const TIRAGE: [TypeLieu, number][] = [
  ['affrontement', 0.42],
  ['evenement', 0.28],
  ['soin', 0.12],
  ['bac', 0.1],
  ['cantine', 0.08],
];

export function genererCarte(graine: number): Lieu[] {
  const rand = aleatoire(graine);
  return LIEUX.map((lieu) => {
    let type: TypeLieu;
    if (lieu.id === DEPART) {
      type = 'depart';
    } else if (lieu.id === ARRIVEE) {
      type = 'prefet';
    } else {
      let r = rand();
      type = TIRAGE.find(([, poids]) => (r -= poids) < 0)?.[0] ?? 'affrontement';
    }
    return { ...lieu, type, nasseA: calculerNasse(lieu.x, lieu.y) };
  });
}
