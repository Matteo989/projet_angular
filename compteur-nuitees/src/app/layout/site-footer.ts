import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Logo } from './logo';
import { COMMUNES } from '../core/communes';
import { SITE, SOURCES } from '../core/site';

@Component({
  selector: 'app-site-footer',
  imports: [RouterLink, Logo],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <footer>
      <div class="container grid">
        <div class="about">
          <app-logo />
          <p>
            Le compteur de nuitées pour les loueurs et les conciergeries. Toutes plateformes
            additionnées, alertes avant le plafond.
          </p>
          <p class="small">
            Informations à jour au {{ site.verifieLe }}. Elles ne remplacent pas un conseil juridique :
            la délibération de votre commune fait foi.
          </p>
        </div>
        <nav aria-label="Plafond par ville">
          <h2>Plafond par ville</h2>
          <ul>
            @for (c of communes; track c.slug) {
              <li><a [routerLink]="['/plafond', c.slug]">{{ c.nom }}</a></li>
            }
          </ul>
        </nav>
        <nav aria-label="Sources officielles">
          <h2>Sources officielles</h2>
          <ul>
            @for (s of sources; track s.url) {
              <li><a [href]="s.url" rel="noopener" target="_blank">{{ s.titre }}</a></li>
            }
          </ul>
        </nav>
        <nav aria-label="Informations légales">
          <h2>Le site</h2>
          <ul>
            <li><a routerLink="/mentions-legales">Mentions légales</a></li>
            <li><a routerLink="/confidentialite">Confidentialité</a></li>
            <li><a routerLink="/" fragment="beta">Rejoindre la bêta</a></li>
            <li>
              <span class="mail">{{ site.email }}</span>
            </li>
          </ul>
        </nav>
      </div>
      <div class="container legal">
        <span>© {{ annee }} {{ site.nom }}</span>
        <span>Sans cookie publicitaire ni traceur.</span>
      </div>
    </footer>
  `,
  styles: `
    footer {
      background: var(--night);
      color: var(--night-muted);
      padding-block: 64px 28px;
      font-size: 0.95rem;
    }
    .grid {
      display: grid;
      grid-template-columns: 1.4fr repeat(3, 1fr);
      gap: 40px;
    }
    .about {
      display: flex;
      flex-direction: column;
      gap: 14px;
      color: var(--night-ink);
      min-width: 0;
    }
    .about p {
      color: var(--night-muted);
      max-width: 40ch;
    }
    .small {
      font-size: 0.85rem;
    }
    h2 {
      font-size: 0.8rem;
      letter-spacing: 0.09em;
      text-transform: uppercase;
      color: var(--night-ink);
      margin-bottom: 14px;
    }
    ul {
      list-style: none;
      margin: 0;
      padding: 0;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    a {
      color: var(--night-muted);
      text-decoration: none;
    }
    a:hover {
      color: var(--night-ink);
      text-decoration: underline;
    }
    .mail {
      user-select: all;
      color: var(--night-ink);
    }
    .legal {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      gap: 8px;
      margin-top: 48px;
      padding-top: 20px;
      border-top: 1px solid rgb(255 255 255 / 10%);
      font-size: 0.85rem;
    }
    @media (max-width: 860px) {
      .grid {
        grid-template-columns: 1fr 1fr;
      }
      .about {
        grid-column: 1 / -1;
      }
    }
    @media (max-width: 480px) {
      .grid {
        grid-template-columns: 1fr;
      }
    }
  `,
})
export class SiteFooter {
  protected readonly site = SITE;
  protected readonly communes = COMMUNES;
  protected readonly sources = Object.values(SOURCES);
  protected readonly annee = new Date().getFullYear();
}
