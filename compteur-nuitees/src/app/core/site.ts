/**
 * Réglages du site. Le nom de marque, le domaine et les coordonnées se changent ici.
 * Les champs marqués « À COMPLÉTER » sont obligatoires avant la mise en ligne (mentions légales, LCEN art. 6).
 */
export const SITE = {
  nom: 'Nuitomètre',
  url: 'https://nuitometre.fr',
  email: 'contact@nuitometre.fr',
  /**
   * Adresse qui reçoit les inscriptions à la bêta (POST JSON).
   * Exemples : un formulaire Formspree (https://formspree.io/f/xxxx) ou un webhook Brevo.
   * Laissée vide, le formulaire affiche l'adresse email à la place.
   */
  inscriptionEndpoint: '',
  editeur: {
    nom: 'À COMPLÉTER : nom et prénom, ou raison sociale',
    statut: 'À COMPLÉTER : micro-entreprise, SAS…',
    siret: 'À COMPLÉTER',
    adresse: 'À COMPLÉTER',
    directeurPublication: 'À COMPLÉTER',
  },
  hebergeur: {
    nom: 'À COMPLÉTER : par exemple Netlify, Inc.',
    adresse: 'À COMPLÉTER',
  },
  /** Date de dernière vérification des règles affichées sur le site. */
  verifieLe: '2 novembre 2026',
} as const;

/** Sources officielles citées sur le site. */
export const SOURCES = {
  guideMinistere: {
    titre: 'Guide pratique 2025 de la réglementation des meublés de tourisme (ministère, sept. 2025)',
    url: 'https://www.ecologie.gouv.fr/sites/default/files/documents/25113_GuidePratique2025MeubleTourisme.pdf',
  },
  paris: {
    titre: 'Ville de Paris : location limitée à 90 jours',
    url: 'https://www.paris.fr/pages/location-limitee-a-90-jours-paris-serre-la-vis-sur-les-meubles-touristiques-29653',
  },
  servicePublic: {
    titre: 'Service-public.fr : location d’un meublé de tourisme',
    url: 'https://www.service-public.fr/particuliers/vosdroits/F2043',
  },
} as const;
