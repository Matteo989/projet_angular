import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Logo } from './logo';

@Component({
  selector: 'app-site-header',
  imports: [RouterLink, Logo],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header>
      <div class="container bar">
        <a routerLink="/" class="brand" aria-label="Nuitomètre, accueil"><app-logo /></a>
        <nav aria-label="Navigation principale">
          <ul>
            <li><a routerLink="/" fragment="calculateur">Calculateur</a></li>
            <li><a routerLink="/" fragment="fonctionnement">Fonctionnement</a></li>
            <li><a routerLink="/" fragment="conciergeries">Conciergeries</a></li>
            <li><a routerLink="/" fragment="tarifs">Tarifs</a></li>
            <li><a routerLink="/" fragment="faq">FAQ</a></li>
          </ul>
        </nav>
        <a class="btn btn-lamp cta" routerLink="/" fragment="beta">Rejoindre la bêta</a>
      </div>
    </header>
  `,
  styles: `
    header {
      position: sticky;
      top: 0;
      z-index: 50;
      background: color-mix(in srgb, var(--night) 92%, transparent);
      backdrop-filter: saturate(1.4) blur(10px);
      color: var(--night-ink);
      border-bottom: 1px solid rgb(255 255 255 / 8%);
    }
    .bar {
      display: flex;
      align-items: center;
      gap: 24px;
      min-height: 68px;
    }
    .brand {
      color: inherit;
      text-decoration: none;
      --night: #0b1126;
    }
    nav {
      margin-left: auto;
    }
    ul {
      display: flex;
      gap: 4px;
      list-style: none;
      margin: 0;
      padding: 0;
    }
    nav a {
      display: inline-block;
      padding: 8px 12px;
      border-radius: 8px;
      color: var(--night-muted);
      text-decoration: none;
      font-weight: 600;
      font-size: 0.95rem;
    }
    nav a:hover {
      color: var(--night-ink);
      background: rgb(255 255 255 / 6%);
    }
    .cta {
      min-height: 42px;
      padding: 0 18px;
      font-size: 0.95rem;
    }
    @media (max-width: 920px) {
      nav {
        display: none;
      }
      .cta {
        margin-left: auto;
      }
    }
  `,
})
export class SiteHeader {}
