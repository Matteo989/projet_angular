/**
 * Décompte des nuitées, sans dépendance à Angular pour pouvoir être testé avec `node --test`.
 *
 * Conventions :
 * - Une date est une chaîne `AAAA-MM-JJ`, toujours interprétée en UTC pour éviter les décalages d'heure d'été.
 * - Une période va de la date d'arrivée (incluse) à la date de départ (exclue) : du 3 au 5 = 2 nuits.
 * - Le plafond légal s'applique par année civile (du 1er janvier au 31 décembre).
 */

export interface Periode {
  /** Date d'arrivée, incluse. */
  debut: string;
  /** Date de départ, exclue. */
  fin: string;
}

export type Statut = 'ok' | 'attention' | 'atteint' | 'depasse';

/** Seuil à partir duquel on prévient le loueur (80 % du plafond). */
export const SEUIL_ATTENTION = 0.8;

const JOUR_MS = 86_400_000;

export function versUtc(date: string): number {
  const [a, m, j] = date.split('-').map(Number);
  return Date.UTC(a, m - 1, j);
}

export function versDate(ms: number): string {
  return new Date(ms).toISOString().slice(0, 10);
}

export function joursDansAnnee(annee: number): number {
  return (Date.UTC(annee + 1, 0, 1) - Date.UTC(annee, 0, 1)) / JOUR_MS;
}

/** Toutes les dates de l'année, du 1er janvier au 31 décembre. */
export function datesDeLAnnee(annee: number): string[] {
  const debut = Date.UTC(annee, 0, 1);
  return Array.from({ length: joursDansAnnee(annee) }, (_, i) => versDate(debut + i * JOUR_MS));
}

/** Les nuits d'une période qui tombent dans l'année civile demandée. */
export function nuitsDansAnnee(periode: Periode, annee: number): string[] {
  const debutAnnee = Date.UTC(annee, 0, 1);
  const finAnnee = Date.UTC(annee + 1, 0, 1);
  const debut = Math.max(versUtc(periode.debut), debutAnnee);
  const fin = Math.min(versUtc(periode.fin), finAnnee);
  const nuits: string[] = [];
  for (let t = debut; t < fin; t += JOUR_MS) nuits.push(versDate(t));
  return nuits;
}

/**
 * Nuits uniques sur plusieurs périodes. Une même nuit présente dans deux calendriers
 * (par exemple une réservation Airbnb recopiée en blocage sur Booking) n'est comptée qu'une fois.
 */
export function nuitsUniques(periodes: Periode[], annee: number): Set<string> {
  const nuits = new Set<string>();
  for (const p of periodes) for (const n of nuitsDansAnnee(p, annee)) nuits.add(n);
  return nuits;
}

export function statut(total: number, plafond: number): Statut {
  if (total > plafond) return 'depasse';
  if (total === plafond) return 'atteint';
  if (total >= Math.ceil(plafond * SEUIL_ATTENTION)) return 'attention';
  return 'ok';
}

/* ------------------------------------------------------------------ */
/* Lecture des fichiers iCalendar (.ics) exportés par les plateformes. */
/* ------------------------------------------------------------------ */

export type NatureEvenement = 'reservation' | 'blocage' | 'inconnu';

export interface EvenementIcs extends Periode {
  id: string;
  titre: string;
  source: string;
  nature: NatureEvenement;
}

/** Recolle les lignes repliées (RFC 5545 : une ligne qui commence par un espace prolonge la précédente). */
function deplier(texte: string): string[] {
  return texte.replace(/\r\n|\r/g, '\n').replace(/\n[ \t]/g, '').split('\n');
}

function lireDate(valeur: string): string | null {
  const m = /^(\d{4})(\d{2})(\d{2})/.exec(valeur.trim());
  return m ? `${m[1]}-${m[2]}-${m[3]}` : null;
}

function desechapper(valeur: string): string {
  return valeur.replace(/\\n/gi, ' ').replace(/\\([,;\\])/g, '$1').trim();
}

/**
 * Devine si un événement est une réservation ou un simple blocage.
 * - Airbnb : « Reserved » = réservation, « Airbnb (Not available) » = blocage par l'hôte.
 * - Booking : « CLOSED - Not available » sert aux deux, on ne peut pas trancher.
 * Dans le doute, on compte la nuit : pour un outil de conformité, mieux vaut surestimer.
 */
export function natureDe(titre: string): NatureEvenement {
  const t = titre.toLowerCase();
  if (/reserv|réserv|booked|booking confirmed|séjour|stay/.test(t)) return 'reservation';
  if (/closed|fermé/.test(t)) return 'inconnu';
  if (/not available|unavailable|indisponible|blocked|bloqu/.test(t)) return 'blocage';
  return 'inconnu';
}

export function lireIcs(texte: string, source: string): EvenementIcs[] {
  const evenements: EvenementIcs[] = [];
  let courant: Record<string, string> | null = null;

  for (const ligne of deplier(texte)) {
    if (ligne === 'BEGIN:VEVENT') {
      courant = {};
      continue;
    }
    if (ligne === 'END:VEVENT') {
      if (courant) {
        const debut = lireDate(courant['DTSTART'] ?? '');
        if (debut) {
          const finLue = lireDate(courant['DTEND'] ?? '');
          const fin = finLue && finLue > debut ? finLue : versDate(versUtc(debut) + JOUR_MS);
          const titre = desechapper(courant['SUMMARY'] ?? 'Sans titre');
          evenements.push({
            id: `${source}#${courant['UID'] ?? evenements.length}#${debut}`,
            titre,
            source,
            debut,
            fin,
            nature: natureDe(titre),
          });
        }
      }
      courant = null;
      continue;
    }
    if (!courant) continue;
    const separateur = ligne.indexOf(':');
    if (separateur < 0) continue;
    // « DTSTART;VALUE=DATE:20260105 » → clé « DTSTART »
    const cle = ligne.slice(0, separateur).split(';')[0].toUpperCase();
    courant[cle] = ligne.slice(separateur + 1);
  }

  return evenements.sort((a, b) => a.debut.localeCompare(b.debut));
}
