import { DOCUMENT, Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { SITE } from './site';

export interface InfosPage {
  titre: string;
  description: string;
  /** Chemin de la page, commençant par « / ». */
  chemin: string;
  /** Données structurées schema.org (JSON-LD), ajoutées dans le <head>. */
  jsonLd?: object[];
  indexer?: boolean;
}

/** Titre, description, URL canonique, Open Graph et JSON-LD de chaque page (rendus au prérendu). */
@Injectable({ providedIn: 'root' })
export class Seo {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly doc = inject(DOCUMENT);

  definir(page: InfosPage): void {
    const url = SITE.url + (page.chemin === '/' ? '/' : page.chemin);
    const titre = page.chemin === '/' ? page.titre : `${page.titre} | ${SITE.nom}`;

    this.title.setTitle(titre);
    this.meta.updateTag({ name: 'description', content: page.description });
    this.meta.updateTag({ name: 'robots', content: page.indexer === false ? 'noindex' : 'index, follow' });
    this.meta.updateTag({ property: 'og:title', content: titre });
    this.meta.updateTag({ property: 'og:description', content: page.description });
    this.meta.updateTag({ property: 'og:url', content: url });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:locale', content: 'fr_FR' });
    this.meta.updateTag({ property: 'og:site_name', content: SITE.nom });
    this.meta.updateTag({ name: 'twitter:card', content: 'summary' });

    let canonique = this.doc.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonique) {
      canonique = this.doc.createElement('link');
      canonique.rel = 'canonical';
      this.doc.head.appendChild(canonique);
    }
    canonique.href = url;

    this.doc.head.querySelectorAll('script[data-jsonld]').forEach((s) => s.remove());
    for (const donnees of page.jsonLd ?? []) {
      const script = this.doc.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-jsonld', '');
      script.textContent = JSON.stringify(donnees);
      this.doc.head.appendChild(script);
    }
  }
}

export function jsonLdFaq(questions: { q: string; r: string }[]): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: questions.map(({ q, r }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: r },
    })),
  };
}
