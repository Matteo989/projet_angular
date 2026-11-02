import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-faq-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @for (item of questions(); track item.q) {
      <details [attr.open]="$first ? '' : null">
        <summary>
          <span class="question">{{ item.q }}</span>
          <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
            <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
          </svg>
        </summary>
        <p>{{ item.r }}</p>
      </details>
    }
  `,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      border-top: 1px solid var(--line);
    }
    details {
      border-bottom: 1px solid var(--line);
    }
    summary {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 16px;
      padding: 20px 0;
      cursor: pointer;
      list-style: none;
    }
    summary::-webkit-details-marker {
      display: none;
    }
    .question {
      font-family: var(--f-display);
      font-weight: 680;
      font-size: 1.12rem;
      line-height: 1.3;
    }
    svg {
      flex: none;
      color: var(--accent);
      transition: transform 0.2s ease;
    }
    details[open] svg {
      transform: rotate(180deg);
    }
    p {
      padding: 0 0 22px;
      color: var(--muted);
      max-width: 72ch;
    }
  `,
})
export class FaqList {
  readonly questions = input.required<{ q: string; r: string }[]>();
}
