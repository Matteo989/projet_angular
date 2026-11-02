import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SITE } from '../../core/site';
import { Seo } from '../../core/seo';

/** Politique de confidentialité (RGPD, art. 13). À relire si un outil de mesure d'audience ou un CRM est ajouté. */
@Component({
  selector: 'app-confidentialite',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="section">
      <div class="container prose">
        <h1>Politique de confidentialité</h1>
        <p>
          {{ site.nom }} collecte le moins de données possible. Cette page explique lesquelles, pourquoi,
          et comment exercer vos droits.
        </p>

        <h2>Le calculateur</h2>
        <p>
          Les nombres que vous saisissez et les fichiers de calendrier que vous importez sont traités
          uniquement dans votre navigateur. Ils ne sont ni envoyés à nos serveurs ni conservés.
        </p>

        <h2>L’inscription à la bêta</h2>
        <ul>
          <li><strong>Données collectées</strong> : adresse email, profil (propriétaire, conciergerie, autre) et, si vous le précisez, nombre de logements.</li>
          <li><strong>Finalité</strong> : vous prévenir de l’ouverture de la bêta et adapter l’offre à votre profil.</li>
          <li><strong>Base légale</strong> : votre consentement, donné en cochant la case du formulaire. Vous pouvez le retirer à tout moment.</li>
          <li><strong>Durée de conservation</strong> : jusqu’au lancement, puis 3 ans au plus après notre dernier échange.</li>
          <li><strong>Destinataires</strong> : l’éditeur du site et son prestataire d’envoi d’emails, dans l’Union européenne ou avec des garanties équivalentes.</li>
        </ul>

        <h2>Cookies et mesure d’audience</h2>
        <p>
          Ce site ne dépose aucun cookie publicitaire ni traceur. Les polices de caractères sont
          hébergées sur nos propres serveurs : aucune donnée n’est transmise à un service tiers lors de
          votre visite.
        </p>

        <h2>Vos droits</h2>
        <p>
          Vous pouvez accéder à vos données, les rectifier, les effacer, vous opposer à leur traitement
          ou demander leur portabilité en écrivant à <span class="mail">{{ site.email }}</span>. Si vous
          estimez que vos droits ne sont pas respectés, vous pouvez adresser une réclamation à la CNIL
          (cnil.fr).
        </p>
        <p>Responsable du traitement : {{ site.editeur.nom }}.</p>
      </div>
    </section>
  `,
  styles: `
    .mail {
      user-select: all;
      font-weight: 700;
    }
  `,
})
export class Confidentialite {
  protected readonly site = SITE;

  constructor() {
    inject(Seo).definir({
      titre: 'Politique de confidentialité',
      description: `Données collectées par ${SITE.nom} et exercice de vos droits.`,
      chemin: '/confidentialite',
    });
  }
}
