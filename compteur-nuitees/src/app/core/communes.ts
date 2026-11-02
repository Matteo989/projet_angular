/**
 * Plafonds de location des résidences principales par commune.
 *
 * Règle nationale (code du tourisme, art. L. 324-1-1) : 120 nuits par année civile.
 * Depuis la loi n° 2024-1039 du 19 novembre 2024, une commune peut l'abaisser jusqu'à 90 nuits
 * par délibération motivée.
 *
 * `verification` dit d'où vient l'information :
 * - 'officielle' : lue sur le site de la mairie ou dans la délibération elle-même ;
 * - 'a-confirmer' : annoncée par plusieurs sources secondaires, délibération pas encore lue.
 * Ne passez une commune en 'officielle' qu'après avoir lu la délibération.
 */

export const PLAFOND_NATIONAL = 120;
export const PLAFOND_MINIMUM = 90;

export type Verification = 'officielle' | 'a-confirmer';

export interface Commune {
  slug: string;
  nom: string;
  plafond: number;
  depuis: string;
  verification: Verification;
  source?: { titre: string; url: string };
  note?: string;
}

export const COMMUNES: readonly Commune[] = [
  {
    slug: 'paris',
    nom: 'Paris',
    plafond: 90,
    depuis: '1er janvier 2025',
    verification: 'officielle',
    source: {
      titre: 'Ville de Paris',
      url: 'https://www.paris.fr/pages/location-limitee-a-90-jours-paris-serre-la-vis-sur-les-meubles-touristiques-29653',
    },
    note: 'Délibération 2024 DLH 398.',
  },
  {
    slug: 'nice',
    nom: 'Nice',
    plafond: 90,
    depuis: '1er janvier 2026',
    verification: 'officielle',
    source: {
      titre: 'Délibération du conseil municipal du 23 mai 2025',
      url: 'https://taxedesejour.ofeaweb.fr/Content/configuration/metropole-nca/ImprimesDeclaratif/D%C3%A9lib%C3%A9ration%201.6%20Nice%20Abaissement%2090j%20R%C3%A9s%20Principales.pdf',
    },
    note: 'Une source non officielle évoque un retour à 120 nuits en 2026 : à vérifier auprès de la mairie.',
  },
  {
    slug: 'lyon',
    nom: 'Lyon',
    plafond: 90,
    depuis: '1er janvier 2026',
    verification: 'a-confirmer',
  },
  {
    slug: 'bordeaux',
    nom: 'Bordeaux',
    plafond: 90,
    depuis: '1er janvier 2026',
    verification: 'a-confirmer',
    note: 'Délibération annoncée en juillet 2025.',
  },
  {
    slug: 'marseille',
    nom: 'Marseille',
    plafond: 90,
    depuis: '2025',
    verification: 'a-confirmer',
  },
  {
    slug: 'montpellier',
    nom: 'Montpellier',
    plafond: 90,
    depuis: '2026',
    verification: 'a-confirmer',
  },
  {
    slug: 'annecy',
    nom: 'Annecy',
    plafond: 90,
    depuis: '2026',
    verification: 'a-confirmer',
  },
];

export function communeParSlug(slug: string | undefined): Commune | undefined {
  return COMMUNES.find((c) => c.slug === slug);
}
