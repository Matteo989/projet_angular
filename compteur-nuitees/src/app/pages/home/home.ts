import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Calculator } from '../../shared/calculator/calculator';
import { YearGrid } from '../../shared/year-grid';
import { Waitlist } from '../../shared/waitlist';
import { FaqList } from '../../shared/faq-list';
import { COMMUNES } from '../../core/communes';
import { FAQ } from '../../core/faq';
import { SITE, SOURCES } from '../../core/site';
import { Seo, jsonLdFaq } from '../../core/seo';

@Component({
  selector: 'app-home',
  imports: [RouterLink, Calculator, YearGrid, Waitlist, FaqList],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  protected readonly communes = COMMUNES;
  protected readonly faq = FAQ;
  protected readonly sources = SOURCES;
  protected readonly annee = new Date().getFullYear();

  /** Exemple de tableau de bord conciergerie (données fictives, signalées comme telles). */
  protected readonly logements = [
    { nom: 'T2 Canal Saint-Martin', ville: 'Paris', nuits: 84, plafond: 90 },
    { nom: 'Studio Vieux-Lyon', ville: 'Lyon', nuits: 52, plafond: 90 },
    { nom: 'T3 Chartrons', ville: 'Bordeaux', nuits: 93, plafond: 90 },
    { nom: 'Loft Carré d’Or', ville: 'Nice', nuits: 61, plafond: 90 },
    { nom: 'Maison Saint-Pierre', ville: 'Autre', nuits: 38, plafond: 120 },
  ].map((l) => ({
    ...l,
    pct: Math.min(100, Math.round((l.nuits / l.plafond) * 100)),
    etat: l.nuits > l.plafond ? 'depasse' : l.nuits >= l.plafond * 0.8 ? 'attention' : 'ok',
  }));

  constructor() {
    inject(Seo).definir({
      titre: `${SITE.nom} : le compteur de nuitées Airbnb, Booking et Abritel`,
      description:
        'Additionnez vos nuits Airbnb, Booking, Abritel et en direct, et restez sous le plafond légal de 120 nuits (90 à Paris, Nice…). Calculateur gratuit, alertes avant le plafond.',
      chemin: '/',
      jsonLd: [
        {
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: SITE.nom,
          url: SITE.url,
          applicationCategory: 'BusinessApplication',
          operatingSystem: 'Web',
          inLanguage: 'fr-FR',
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR', description: 'Calculateur gratuit' },
        },
        jsonLdFaq(FAQ),
      ],
    });
  }
}
