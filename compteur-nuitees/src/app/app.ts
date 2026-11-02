import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SiteHeader } from './layout/site-header';
import { SiteFooter } from './layout/site-footer';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SiteHeader, SiteFooter],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <a class="skip" href="#contenu">Aller au contenu</a>
    <app-site-header />
    <main id="contenu" tabindex="-1">
      <router-outlet />
    </main>
    <app-site-footer />
  `,
  styles: `
    .skip {
      position: absolute;
      left: 16px;
      top: -60px;
      z-index: 100;
      padding: 10px 16px;
      background: var(--accent);
      color: var(--accent-ink);
      border-radius: 8px;
      font-weight: 700;
    }
    .skip:focus {
      top: 12px;
    }
    main:focus {
      outline: none;
    }
  `,
})
export class App {}
