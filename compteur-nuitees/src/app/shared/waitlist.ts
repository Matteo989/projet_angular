import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { SITE } from '../core/site';

type Etat = 'saisie' | 'envoi' | 'ok' | 'erreur' | 'non-branche';

/** Inscription à la bêta. Les données ne partent que si `SITE.inscriptionEndpoint` est renseigné. */
@Component({
  selector: 'app-waitlist',
  imports: [ReactiveFormsModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (etat() === 'ok') {
      <div class="merci" role="status">
        <h3>C’est noté, merci !</h3>
        <p>Vous recevrez un email au lancement de la bêta, et rien d’autre.</p>
      </div>
    } @else {
      <form [formGroup]="form" (ngSubmit)="envoyer()" novalidate>
        <div class="champ">
          <label for="w-email">Email professionnel ou personnel</label>
          <input
            id="w-email"
            type="email"
            formControlName="email"
            autocomplete="email"
            placeholder="vous@exemple.fr"
            [attr.aria-invalid]="invalide('email')"
            aria-describedby="w-email-err"
          />
          @if (invalide('email')) {
            <span id="w-email-err" class="err">Indiquez une adresse email valide.</span>
          }
        </div>

        <fieldset class="champ">
          <legend>Vous êtes</legend>
          <div class="choix">
            @for (p of profils; track p.valeur) {
              <label class="option">
                <input type="radio" formControlName="profil" [value]="p.valeur" />
                <span>{{ p.libelle }}</span>
              </label>
            }
          </div>
        </fieldset>

        <div class="champ">
          <label for="w-logements">Nombre de logements gérés <span class="opt">(facultatif)</span></label>
          <input id="w-logements" type="number" inputmode="numeric" min="1" formControlName="logements" />
        </div>

        <label class="consent">
          <input type="checkbox" formControlName="consentement" aria-describedby="w-consent-err" />
          <span>
            J’accepte de recevoir un email au lancement de la bêta. Désinscription en un clic. Voir la
            <a routerLink="/confidentialite">politique de confidentialité</a>.
          </span>
        </label>
        @if (invalide('consentement')) {
          <span id="w-consent-err" class="err">Cochez la case pour qu’on puisse vous écrire.</span>
        }

        <button class="btn btn-lamp" type="submit" [disabled]="etat() === 'envoi'">
          {{ etat() === 'envoi' ? 'Envoi…' : 'Rejoindre la bêta gratuite' }}
        </button>

        @if (etat() === 'erreur') {
          <p class="err" role="alert">
            L’envoi n’a pas abouti. Réessayez dans un instant ou écrivez-nous à
            <span class="mail">{{ email }}</span>.
          </p>
        }
        @if (etat() === 'non-branche') {
          <p class="info" role="status">
            Les inscriptions ouvrent très bientôt. En attendant, écrivez-nous à
            <span class="mail">{{ email }}</span> avec le nombre de logements que vous gérez.
          </p>
        }
      </form>
    }
  `,
  styles: `
    form {
      display: flex;
      flex-direction: column;
      gap: 18px;
    }
    .champ {
      display: flex;
      flex-direction: column;
      gap: 6px;
      border: 0;
      padding: 0;
      margin: 0;
    }
    label,
    legend {
      font-weight: 700;
      font-size: 0.95rem;
    }
    .opt {
      font-weight: 400;
      color: var(--night-muted);
    }
    input[type='email'],
    input[type='number'] {
      font: inherit;
      min-height: 50px;
      padding: 0 16px;
      border-radius: var(--radius-sm);
      border: 1.5px solid rgb(255 255 255 / 18%);
      background: rgb(255 255 255 / 6%);
      color: var(--night-ink);
    }
    input::placeholder {
      color: var(--night-muted);
    }
    input[aria-invalid='true'] {
      border-color: #ff9b91;
    }
    .choix {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 6px;
    }
    .option {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 10px 14px;
      min-height: 44px;
      border-radius: 999px;
      border: 1.5px solid rgb(255 255 255 / 18%);
      font-weight: 600;
      cursor: pointer;
    }
    .option:has(input:checked) {
      border-color: var(--lamp);
      background: rgb(243 178 60 / 12%);
    }
    .option input,
    .consent input {
      accent-color: var(--lamp);
      width: 18px;
      height: 18px;
    }
    .consent {
      display: grid;
      grid-template-columns: auto 1fr;
      gap: 10px;
      font-weight: 400;
      font-size: 0.9rem;
      color: var(--night-muted);
    }
    .consent a {
      color: var(--night-ink);
    }
    .btn {
      align-self: flex-start;
    }
    .btn[disabled] {
      opacity: 0.7;
      cursor: progress;
    }
    .err {
      color: #ffb1a9;
      font-size: 0.88rem;
    }
    .info {
      padding: 12px 14px;
      border-radius: var(--radius-sm);
      background: rgb(255 255 255 / 8%);
      font-size: 0.92rem;
    }
    .mail {
      user-select: all;
      font-weight: 700;
      color: var(--night-ink);
    }
    .merci {
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding: 24px;
      border-radius: var(--radius);
      background: rgb(243 178 60 / 12%);
      border: 1px solid var(--lamp);
    }
  `,
})
export class Waitlist {
  private readonly fb = inject(FormBuilder);
  protected readonly email = SITE.email;
  protected readonly etat = signal<Etat>('saisie');
  private readonly soumis = signal(false);

  protected readonly profils = [
    { valeur: 'proprietaire', libelle: 'Propriétaire' },
    { valeur: 'conciergerie', libelle: 'Conciergerie' },
    { valeur: 'autre', libelle: 'Autre' },
  ];

  protected readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    profil: ['conciergerie'],
    logements: [null as number | null],
    consentement: [false, Validators.requiredTrue],
  });

  protected invalide(champ: 'email' | 'consentement'): boolean {
    const c = this.form.controls[champ];
    return c.invalid && (c.touched || this.soumis());
  }

  protected async envoyer(): Promise<void> {
    this.soumis.set(true);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    if (!SITE.inscriptionEndpoint) {
      this.etat.set('non-branche');
      return;
    }
    this.etat.set('envoi');
    try {
      const reponse = await fetch(SITE.inscriptionEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ ...this.form.getRawValue(), date: new Date().toISOString() }),
      });
      this.etat.set(reponse.ok ? 'ok' : 'erreur');
    } catch {
      this.etat.set('erreur');
    }
  }
}
