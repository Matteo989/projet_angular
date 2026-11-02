import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { datesDeLAnnee } from '../core/nights';

const MOIS = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'];

type EtatCase = 'vide' | 'nuit' | 'depasse';

interface Case {
  date: string;
  etat: EtatCase;
  plafond: boolean;
}

/**
 * Une ligne par mois, une case par jour. Les nuits comptées s'allument en ambre,
 * celles au-delà du plafond passent en rouge, dans l'ordre chronologique.
 */
@Component({
  selector: 'app-year-grid',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="grid" role="img" [attr.aria-label]="resume()" [class.sur-nuit]="surNuit()">
      @for (mois of mois(); track mois.nom; let m = $index) {
        <span class="mois" aria-hidden="true">{{ mois.nom }}</span>
        <span class="jours" aria-hidden="true">
          @for (c of mois.cases; track c.date; let j = $index) {
            <i
              [class]="c.etat"
              [class.limite]="c.plafond"
              [style.--d]="animer() ? m * 31 + j : null"
            ></i>
          }
        </span>
      }
    </div>
  `,
  styles: `
    .grid {
      display: grid;
      grid-template-columns: auto 1fr;
      align-items: center;
      gap: 4px 10px;
      --vide: var(--cell);
      --label: var(--muted);
    }
    .grid.sur-nuit {
      --vide: var(--night-cell);
      --label: var(--night-muted);
    }
    .mois {
      font-size: 0.72rem;
      color: var(--label);
      text-align: right;
      min-width: 3.2em;
    }
    .jours {
      display: grid;
      grid-template-columns: repeat(31, 1fr);
      gap: 3px;
    }
    i {
      display: block;
      aspect-ratio: 1;
      border-radius: 2.5px;
      background: var(--vide);
    }
    i.nuit {
      background: var(--lamp);
      box-shadow: 0 0 6px -1px color-mix(in srgb, var(--lamp) 70%, transparent);
    }
    i.depasse {
      background: var(--danger);
    }
    i.limite {
      outline: 2px solid var(--ink);
      outline-offset: 1px;
    }
    .sur-nuit i.limite {
      outline-color: #fff;
    }
    i[style*='--d'].nuit,
    i[style*='--d'].depasse {
      animation: allume 0.5s ease both;
      animation-delay: calc(var(--d) * 6ms);
    }
    @keyframes allume {
      from {
        background: var(--vide);
        box-shadow: none;
      }
    }
  `,
})
export class YearGrid {
  readonly annee = input.required<number>();
  readonly plafond = input.required<number>();
  /** Dates réelles des nuits (import de calendriers). */
  readonly nuits = input<ReadonlySet<string> | null>(null);
  /** Nombre de nuits rangées dans l'ordre depuis le 1er janvier (saisie rapide). */
  readonly compte = input(0);
  readonly surNuit = input(false);
  readonly animer = input(false);

  protected readonly mois = computed(() => {
    const plafond = this.plafond();
    const nuits = this.nuits();
    let rang = 0;
    const cases: Case[] = datesDeLAnnee(this.annee()).map((date, i) => {
      const allumee = nuits ? nuits.has(date) : i < this.compte();
      if (!allumee) return { date, etat: 'vide', plafond: false };
      rang++;
      return { date, etat: rang > plafond ? 'depasse' : 'nuit', plafond: rang === plafond };
    });
    return MOIS.map((nom, m) => ({
      nom,
      cases: cases.filter((c) => Number(c.date.slice(5, 7)) === m + 1),
    }));
  });

  protected readonly resume = computed(() => {
    const total = this.nuits()?.size ?? this.compte();
    return `Calendrier ${this.annee()} : ${total} nuits comptées pour un plafond de ${this.plafond()}.`;
  });
}
