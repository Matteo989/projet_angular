import { RenderMode, ServerRoute } from '@angular/ssr';
import { COMMUNES } from './core/communes';

/** Tout est prérendu en HTML statique au build : pages rapides et lisibles par les moteurs de recherche. */
export const serverRoutes: ServerRoute[] = [
  { path: '', renderMode: RenderMode.Prerender },
  {
    path: 'plafond/:slug',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => COMMUNES.map((c) => ({ slug: c.slug })),
  },
  { path: 'mentions-legales', renderMode: RenderMode.Prerender },
  { path: 'confidentialite', renderMode: RenderMode.Prerender },
  { path: '**', renderMode: RenderMode.Client },
];
