import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SITE } from '../../core/site';
import { Seo } from '../../core/seo';

/** Mentions obligatoires (loi n° 2004-575 du 21 juin 2004, art. 6). Les champs « À COMPLÉTER » sont dans core/site.ts. */
@Component({
  selector: 'app-mentions-legales',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="section">
      <div class="container prose">
        <h1>Mentions légales</h1>
        <h2>Éditeur du site</h2>
        <p>
          {{ site.editeur.nom }}<br />
          {{ site.editeur.statut }}<br />
          SIRET : {{ site.editeur.siret }}<br />
          Adresse : {{ site.editeur.adresse }}<br />
          Contact : <span class="mail">{{ site.email }}</span>
        </p>
        <p>Directeur de la publication : {{ site.editeur.directeurPublication }}</p>
        <h2>Hébergement</h2>
        <p>{{ site.hebergeur.nom }}<br />{{ site.hebergeur.adresse }}</p>
        <h2>Nature des informations</h2>
        <p>
          Les informations réglementaires publiées sur {{ site.nom }} sont fournies à titre indicatif,
          à partir des sources officielles citées sur chaque page, et vérifiées pour la dernière fois le
          {{ site.verifieLe }}. Elles ne constituent pas un conseil juridique. La délibération de votre
          commune et les textes publiés au Journal officiel font foi.
        </p>
        <h2>Propriété intellectuelle</h2>
        <p>
          Les textes, le code et les éléments graphiques du site sont la propriété de l’éditeur, sauf
          les polices de caractères (Bricolage Grotesque et Atkinson Hyperlegible Next, licence SIL Open
          Font License).
        </p>
      </div>
    </section>
  `,
  styles: `
    .mail {
      user-select: all;
    }
  `,
})
export class MentionsLegales {
  protected readonly site = SITE;

  constructor() {
    inject(Seo).definir({
      titre: 'Mentions légales',
      description: `Mentions légales du site ${SITE.nom}.`,
      chemin: '/mentions-legales',
    });
  }
}
