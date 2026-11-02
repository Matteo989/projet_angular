import { ChangeDetectionStrategy, Component, computed, effect, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Calculator } from '../../shared/calculator/calculator';
import { FaqList } from '../../shared/faq-list';
import { COMMUNES, PLAFOND_NATIONAL, communeParSlug } from '../../core/communes';
import { SITE, SOURCES } from '../../core/site';
import { Seo, jsonLdFaq } from '../../core/seo';

@Component({
  selector: 'app-commune-page',
  imports: [RouterLink, Calculator, FaqList],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (commune(); as c) {
      <section class="tete">
        <div class="container tete-grid">
          <div class="tete-texte">
            <nav aria-label="Fil d’Ariane" class="ariane">
              <a routerLink="/">Accueil</a> <span aria-hidden="true">/</span>
              <a routerLink="/" fragment="villes">Plafond par ville</a> <span aria-hidden="true">/</span>
              <span aria-current="page">{{ c.nom }}</span>
            </nav>
            <h1>Plafond de location Airbnb à {{ c.nom }} en {{ annee }}</h1>
            <p class="lead">
              À {{ c.nom }}, une résidence principale peut être louée en meublé de tourisme
              <strong>{{ c.plafond }} nuits par année civile</strong> au maximum, toutes plateformes
              additionnées.
            </p>
          </div>
          <aside class="fiche" aria-label="En bref">
            <p class="fiche-chiffre num">{{ c.plafond }}<span>nuits / an</span></p>
            <dl>
              <div><dt>Depuis</dt><dd>{{ c.depuis }}</dd></div>
              <div><dt>Plafond national</dt><dd>{{ plafondNational }} nuits</dd></div>
              <div>
                <dt>Vérification</dt>
                <dd>
                  @if (c.verification === 'officielle') {
                    <span class="badge badge-ok">Source officielle</span>
                  } @else {
                    <span class="badge badge-warn">À confirmer</span>
                  }
                </dd>
              </div>
            </dl>
            @if (c.source) {
              <a [href]="c.source.url" target="_blank" rel="noopener">{{ c.source.titre }}</a>
            }
          </aside>
        </div>
      </section>

      <section class="section">
        <div class="container">
          @if (c.verification === 'a-confirmer') {
            <p class="alerte">
              Cette baisse à {{ c.plafond }} nuits est annoncée par plusieurs sources, mais nous
              n’avons pas encore pu lire la délibération elle-même. Vérifiez auprès de la mairie de
              {{ c.nom }} avant de vous y fier.
            </p>
          }
          @if (c.note) {
            <p class="note">{{ c.note }}</p>
          }
          <div class="section-head">
            <h2>Calculez vos nuits restantes à {{ c.nom }}</h2>
            <p class="lead">Le plafond de {{ c.nom }} est déjà sélectionné.</p>
          </div>
          <app-calculator [communeInitiale]="c.slug" />
        </div>
      </section>

      <section class="section regles">
        <div class="container regles-grid">
          <div class="prose">
            <h2>Ce qu’il faut savoir à {{ c.nom }}</h2>
            <ul>
              <li>
                Le plafond s’applique aux nuits <strong>louées</strong>, sur toutes les plateformes et
                en direct, du 1er janvier au 31 décembre.
              </li>
              <li>
                Il ne concerne que votre <strong>résidence principale</strong>, louée en entier. Une
                chambre chez l’habitant n’est pas concernée.
              </li>
              <li>
                Un <strong>numéro d’enregistrement</strong> est obligatoire et doit figurer sur
                chaque annonce.
              </li>
              <li>
                La mairie peut vous demander le <strong>décompte de vos nuitées</strong> : ne pas le
                transmettre est passible de 15 000 € d’amende.
              </li>
              <li>
                Une résidence secondaire relève d’autres règles (changement d’usage, éventuels
                quotas) : renseignez-vous auprès de la mairie.
              </li>
            </ul>
            <p class="small">
              Sources :
              <a [href]="sources.guideMinistere.url" target="_blank" rel="noopener">guide du ministère</a>
              @if (c.source) {
                , <a [href]="c.source.url" target="_blank" rel="noopener">{{ c.source.titre }}</a>
              }
              . Informations vérifiées le {{ verifieLe }}.
            </p>
          </div>
          <div>
            <h2 class="faq-titre">Questions fréquentes</h2>
            <app-faq-list [questions]="faq()" />
          </div>
        </div>
      </section>

      <section class="autres">
        <div class="container">
          <h2>Autres villes</h2>
          <ul>
            @for (autre of autres(); track autre.slug) {
              <li><a [routerLink]="['/plafond', autre.slug]">{{ autre.nom }} · {{ autre.plafond }} nuits</a></li>
            }
          </ul>
        </div>
      </section>
    } @else {
      <section class="section">
        <div class="container prose">
          <h1>Ville introuvable</h1>
          <p>Nous n’avons pas encore de page pour cette commune.</p>
          <p><a routerLink="/" fragment="calculateur">Utiliser le calculateur avec un plafond personnalisé</a></p>
        </div>
      </section>
    }
  `,
  styles: `
    .tete {
      background: linear-gradient(180deg, var(--night), var(--night-2));
      color: var(--night-ink);
      padding-block: clamp(40px, 6vw, 72px);
    }
    .tete-grid {
      display: grid;
      grid-template-columns: minmax(0, 1.5fr) minmax(0, 1fr);
      gap: 40px;
      align-items: center;
    }
    .tete-texte {
      display: flex;
      flex-direction: column;
      gap: 18px;
    }
    h1 {
      font-size: clamp(2rem, 4.4vw, 3.2rem);
    }
    .tete .lead {
      color: var(--night-muted);
    }
    .tete .lead strong {
      color: var(--lamp);
    }
    .ariane {
      font-size: 0.88rem;
      color: var(--night-muted);
    }
    .ariane a {
      color: var(--night-muted);
    }
    .fiche {
      padding: 24px;
      border-radius: 18px;
      background: rgb(255 255 255 / 5%);
      border: 1px solid rgb(255 255 255 / 12%);
      display: flex;
      flex-direction: column;
      gap: 14px;
    }
    .fiche a {
      color: var(--lamp);
      font-size: 0.9rem;
    }
    .fiche-chiffre {
      font-family: var(--f-display);
      font-size: 4rem;
      font-weight: 780;
      line-height: 1;
      color: var(--lamp);
      display: flex;
      align-items: baseline;
      gap: 10px;
    }
    .fiche-chiffre span {
      font-size: 1rem;
      color: var(--night-muted);
      font-weight: 600;
    }
    dl {
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    dl div {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      font-size: 0.92rem;
    }
    dt {
      color: var(--night-muted);
    }
    dd {
      margin: 0;
      font-weight: 700;
    }
    .alerte,
    .note {
      max-width: 820px;
      padding: 14px 18px;
      border-radius: var(--radius-sm);
      margin-bottom: 20px;
    }
    .alerte {
      background: var(--warn-soft);
      color: var(--warn);
    }
    .note {
      background: var(--surface-2);
      color: var(--muted);
    }
    .regles {
      background: var(--surface);
      border-top: 1px solid var(--line);
    }
    .regles-grid {
      display: grid;
      grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
      gap: 48px;
    }
    .faq-titre {
      font-size: 1.5rem;
      margin-bottom: 16px;
    }
    .small {
      font-size: 0.85rem;
      color: var(--muted);
    }
    .autres {
      padding-block: 40px;
      border-top: 1px solid var(--line);
    }
    .autres h2 {
      font-size: 1.1rem;
      margin-bottom: 12px;
    }
    .autres ul {
      list-style: none;
      margin: 0;
      padding: 0;
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
    }
    .autres a {
      display: inline-block;
      padding: 8px 14px;
      border-radius: 999px;
      border: 1px solid var(--line);
      background: var(--surface);
      color: var(--ink);
      text-decoration: none;
      font-weight: 600;
    }
    .autres a:hover {
      border-color: var(--accent);
    }
    @media (max-width: 900px) {
      .tete-grid,
      .regles-grid {
        grid-template-columns: 1fr;
      }
    }
  `,
})
export class CommunePage {
  readonly slug = input<string>('');

  private readonly seo = inject(Seo);
  protected readonly annee = new Date().getFullYear();
  protected readonly plafondNational = PLAFOND_NATIONAL;
  protected readonly sources = SOURCES;
  protected readonly verifieLe = SITE.verifieLe;

  protected readonly commune = computed(() => communeParSlug(this.slug()));
  protected readonly autres = computed(() => COMMUNES.filter((c) => c.slug !== this.slug()));

  protected readonly faq = computed(() => {
    const c = this.commune();
    if (!c) return [];
    return [
      {
        q: `Combien de nuits puis-je louer ma résidence principale à ${c.nom} ?`,
        r: `${c.plafond} nuits par année civile, toutes plateformes et locations directes additionnées. Le plafond national est de ${PLAFOND_NATIONAL} nuits ; ${c.nom} l’a abaissé par délibération du conseil municipal${c.verification === 'a-confirmer' ? ' (information à confirmer auprès de la mairie)' : ''}.`,
      },
      {
        q: 'Les nuits Booking et Airbnb s’additionnent-elles ?',
        r: 'Oui. Le plafond porte sur le logement, pas sur la plateforme. Chaque plateforme ne bloque qu’à partir de ses propres réservations : c’est à vous de faire le total.',
      },
      {
        q: 'Quand le compteur repart-il à zéro ?',
        r: 'Le 1er janvier de chaque année. Une réservation à cheval sur deux années compte pour chacune au prorata des nuits.',
      },
    ];
  });

  constructor() {
    effect(() => {
      const c = this.commune();
      if (!c) {
        this.seo.definir({
          titre: 'Ville introuvable',
          description: 'Cette commune n’a pas encore de page.',
          chemin: `/plafond/${this.slug()}`,
          indexer: false,
        });
        return;
      }
      this.seo.definir({
        titre: `Plafond Airbnb à ${c.nom} : ${c.plafond} nuits par an (${this.annee})`,
        description: `À ${c.nom}, une résidence principale peut être louée ${c.plafond} nuits par an au maximum, Airbnb, Booking et location directe additionnés. Calculez vos nuits restantes gratuitement.`,
        chemin: `/plafond/${c.slug}`,
        jsonLd: [
          jsonLdFaq(this.faq()),
          {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Accueil', item: SITE.url + '/' },
              { '@type': 'ListItem', position: 2, name: c.nom, item: `${SITE.url}/plafond/${c.slug}` },
            ],
          },
        ],
      });
    });
  }
}
