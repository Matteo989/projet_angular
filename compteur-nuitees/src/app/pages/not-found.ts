import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Seo } from '../core/seo';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="section">
      <div class="container prose">
        <h1>Page introuvable</h1>
        <p>Cette page n’existe pas ou a été déplacée.</p>
        <p><a routerLink="/">Retour à l’accueil</a></p>
      </div>
    </section>
  `,
})
export class NotFound {
  constructor() {
    inject(Seo).definir({
      titre: 'Page introuvable',
      description: 'Cette page n’existe pas.',
      chemin: '/404',
      indexer: false,
    });
  }
}
