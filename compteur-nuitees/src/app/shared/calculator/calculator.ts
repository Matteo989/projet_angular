import {
  ChangeDetectionStrategy,
  Component,
  afterNextRender,
  computed,
  effect,
  input,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { COMMUNES, PLAFOND_MINIMUM, PLAFOND_NATIONAL, communeParSlug } from '../../core/communes';
import {
  EvenementIcs,
  Statut,
  lireIcs,
  nuitsDansAnnee,
  nuitsUniques,
  statut,
} from '../../core/nights';
import { YearGrid } from '../year-grid';

type Mode = 'rapide' | 'ics';

interface Canal {
  id: 'airbnb' | 'booking' | 'abritel' | 'direct';
  libelle: string;
  aide: string;
}

const FORMAT_DATE = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short', timeZone: 'UTC' });

@Component({
  selector: 'app-calculator',
  imports: [RouterLink, YearGrid],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './calculator.html',
  styleUrl: './calculator.scss',
})
export class Calculator {
  /** Commune présélectionnée (pages « plafond par ville »). */
  readonly communeInitiale = input<string>('');

  protected readonly communes = COMMUNES;
  protected readonly plafondMin = PLAFOND_MINIMUM;
  protected readonly plafondNational = PLAFOND_NATIONAL;
  protected readonly canaux: Canal[] = [
    { id: 'airbnb', libelle: 'Airbnb', aide: 'Menu Revenus ou Réservations' },
    { id: 'booking', libelle: 'Booking.com', aide: 'Extranet, onglet Réservations' },
    { id: 'abritel', libelle: 'Abritel / Vrbo', aide: 'Tableau de bord propriétaire' },
    { id: 'direct', libelle: 'En direct et autres', aide: 'Location sans plateforme, Leboncoin…' },
  ];

  /** L'année affichée au prérendu est celle du build ; elle est recalée sur l'horloge du visiteur. */
  protected readonly annee = signal(new Date().getFullYear());
  protected readonly slug = signal('paris');
  protected readonly plafondPerso = signal(PLAFOND_NATIONAL);
  protected readonly mode = signal<Mode>('rapide');
  protected readonly saisie = signal<Record<Canal['id'], number>>({
    airbnb: 46,
    booking: 31,
    abritel: 0,
    direct: 6,
  });
  protected readonly evenements = signal<EvenementIcs[]>([]);
  protected readonly exclus = signal<ReadonlySet<string>>(new Set());
  protected readonly erreurFichier = signal('');
  protected readonly survol = signal(false);

  constructor() {
    effect(() => {
      const initiale = communeParSlug(this.communeInitiale());
      if (initiale) this.slug.set(initiale.slug);
    });
    afterNextRender(() => this.annee.set(new Date().getFullYear()));
  }

  protected readonly commune = computed(() => communeParSlug(this.slug()));

  protected readonly plafond = computed(() => {
    const c = this.commune();
    if (c) return c.plafond;
    const p = Math.round(this.plafondPerso());
    return Math.min(PLAFOND_NATIONAL, Math.max(PLAFOND_MINIMUM, Number.isFinite(p) ? p : PLAFOND_NATIONAL));
  });

  protected readonly nuitsImportees = computed(() =>
    nuitsUniques(
      this.evenements().filter((e) => !this.exclus().has(e.id)),
      this.annee(),
    ),
  );

  protected readonly total = computed(() =>
    this.mode() === 'ics'
      ? this.nuitsImportees().size
      : Object.values(this.saisie()).reduce((s, n) => s + n, 0),
  );

  protected readonly etat = computed<Statut>(() => statut(this.total(), this.plafond()));
  protected readonly restant = computed(() => Math.max(0, this.plafond() - this.total()));
  protected readonly depassement = computed(() => Math.max(0, this.total() - this.plafond()));
  protected readonly pourcentage = computed(() =>
    Math.min(100, Math.round((this.total() / this.plafond()) * 100)),
  );

  protected readonly evenementsAffiches = computed(() =>
    this.evenements().map((e) => ({
      ...e,
      nuits: nuitsDansAnnee(e, this.annee()).length,
      dates: `${FORMAT_DATE.format(new Date(e.debut))} → ${FORMAT_DATE.format(new Date(e.fin))}`,
      inclus: !this.exclus().has(e.id),
    })),
  );

  protected readonly doublons = computed(() => {
    if (this.mode() !== 'ics') return 0;
    const brut = this.evenementsAffiches()
      .filter((e) => e.inclus)
      .reduce((s, e) => s + e.nuits, 0);
    return brut - this.nuitsImportees().size;
  });

  protected choisirCommune(valeur: string): void {
    this.slug.set(valeur);
  }

  protected majSaisie(canal: Canal['id'], valeur: string): void {
    const n = Math.max(0, Math.min(366, Math.floor(Number(valeur) || 0)));
    this.saisie.update((s) => ({ ...s, [canal]: n }));
  }

  protected majPlafond(valeur: string): void {
    this.plafondPerso.set(Number(valeur));
  }

  protected async ajouterFichiers(fichiers: FileList | null): Promise<void> {
    this.erreurFichier.set('');
    if (!fichiers?.length) return;
    const nouveaux: EvenementIcs[] = [];
    for (const fichier of Array.from(fichiers)) {
      if (fichier.size > 5_000_000) {
        this.erreurFichier.set(`« ${fichier.name} » dépasse 5 Mo : ce n’est sans doute pas un calendrier.`);
        continue;
      }
      const texte = await fichier.text();
      if (!texte.includes('BEGIN:VCALENDAR')) {
        this.erreurFichier.set(
          `« ${fichier.name} » n’est pas un calendrier .ics. Exportez le lien iCal de votre annonce, ouvrez-le et enregistrez le fichier.`,
        );
        continue;
      }
      nouveaux.push(...lireIcs(texte, fichier.name));
    }
    const existants = new Set(this.evenements().map((e) => e.id));
    const ajoutes = nouveaux.filter((e) => !existants.has(e.id));
    this.evenements.update((liste) =>
      [...liste, ...ajoutes].sort((a, b) => a.debut.localeCompare(b.debut)),
    );
    this.exclus.update((ex) => {
      const suivant = new Set(ex);
      for (const e of ajoutes) if (e.nature === 'blocage') suivant.add(e.id);
      return suivant;
    });
  }

  protected deposer(event: DragEvent): void {
    event.preventDefault();
    this.survol.set(false);
    void this.ajouterFichiers(event.dataTransfer?.files ?? null);
  }

  protected basculer(id: string): void {
    this.exclus.update((ex) => {
      const suivant = new Set(ex);
      if (suivant.has(id)) suivant.delete(id);
      else suivant.add(id);
      return suivant;
    });
  }

  protected toutCocher(): void {
    this.exclus.set(new Set());
  }

  protected vider(): void {
    this.evenements.set([]);
    this.exclus.set(new Set());
    this.erreurFichier.set('');
  }
}
