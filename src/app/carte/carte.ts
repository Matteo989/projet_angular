import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CampagneService, NOMS_TYPES } from './campagne.service';
import { Lieu, SEINE } from './paris';

@Component({
  selector: 'app-carte',
  templateUrl: './carte.html',
  styleUrl: './carte.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Carte {
  protected readonly campagne = inject(CampagneService);
  protected readonly seine = SEINE;
  protected readonly nomsTypes = NOMS_TYPES;
  protected readonly survol = signal<Lieu | null>(null);

  protected readonly rues = computed(() => {
    const parId = this.campagne.parId();
    const position = this.campagne.position();
    const accessibles = this.campagne.accessibles();
    return this.campagne.rues.map((rue) => {
      const a = parId.get(rue.a)!;
      const b = parId.get(rue.b)!;
      return {
        ...rue,
        a,
        b,
        nassee: this.campagne.estNasse(a) && this.campagne.estNasse(b),
        possible:
          (rue.a === position && accessibles.has(rue.b)) || (rue.b === position && accessibles.has(rue.a)),
      };
    });
  });

  protected readonly infoBulle = computed(() => this.survol() ?? this.campagne.lieuActuel());

  protected toursAvantNasse(lieu: Lieu): number {
    return Math.max(0, Math.ceil(lieu.nasseA - this.campagne.pression()));
  }
}
