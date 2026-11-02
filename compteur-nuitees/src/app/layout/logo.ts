import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SITE } from '../core/site';

@Component({
  selector: 'app-logo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg viewBox="0 0 32 32" width="30" height="30" aria-hidden="true">
      <rect width="32" height="32" rx="7" fill="var(--night)" />
      <g fill="var(--lamp)">
        <rect x="6" y="6" width="5" height="5" rx="1.2" />
        <rect x="13.5" y="6" width="5" height="5" rx="1.2" />
        <rect x="21" y="6" width="5" height="5" rx="1.2" />
        <rect x="6" y="13.5" width="5" height="5" rx="1.2" />
        <rect x="13.5" y="13.5" width="5" height="5" rx="1.2" />
      </g>
      <g fill="var(--night-cell)">
        <rect x="21" y="13.5" width="5" height="5" rx="1.2" />
        <rect x="6" y="21" width="5" height="5" rx="1.2" />
        <rect x="13.5" y="21" width="5" height="5" rx="1.2" />
        <rect x="21" y="21" width="5" height="5" rx="1.2" />
      </g>
    </svg>
    <span>{{ nom }}</span>
  `,
  styles: `
    :host {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      font-family: var(--f-display);
      font-weight: 750;
      font-size: 1.2rem;
      letter-spacing: -0.02em;
    }
  `,
})
export class Logo {
  protected readonly nom = SITE.nom;
}
