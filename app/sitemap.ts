import { MetadataRoute } from 'next';
import { getAllPosts } from '@/lib/blog';
import { getAllUniversitySlugs } from '@/lib/universities';
import { getAllCitySlugs } from '@/lib/cities';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://dalili.study';

// Articles qui méritent une priorité 0.8 (piliers SEO)
const HIGH_PRIORITY_SLUGS = new Set([
  // TCF Maroc
  'tcf-maroc-2026-guide-complet',
  'comment-preparer-tcf-30-jours-etudiant-maroc',
  'calendrier-tcf-maroc-2026-dates-sessions',
  // Visa & Campus France
  'visa-etudiant-france-maroc-2026',
  'visa-etudiant-france-algerie-2026',
  'visa-etudiant-france-senegal-2026',
  'campusfrance-maroc-guide-complet',
  'campusfrance-algerie-guide-entretien-2026',
  'campusfrance-senegal-guide-inscription-dakar',
  // Logement & aides
  'logement-crous-etudiant-etranger-demande',
  'caf-etudiant-etranger-delais-documents-erreurs',
  // Banque
  'ouvrir-compte-bancaire-etudiant-etranger-2026',
]);

export default function sitemap(): MetadataRoute.Sitemap {
  const posts    = getAllPosts();
  const uniSlugs = getAllUniversitySlugs();
  const citySlugs = getAllCitySlugs();
  const now      = new Date();

  // ── Blog articles ────────────────────────────────────────────────
  const articles: MetadataRoute.Sitemap = posts.map(post => ({
    url:             `${SITE_URL}/blog/${post.slug}`,
    lastModified:    post.updatedDate ? new Date(post.updatedDate) : new Date(post.date),
    changeFrequency: 'monthly',
    priority:        HIGH_PRIORITY_SLUGS.has(post.slug) ? 0.8 : 0.7,
  }));

  // ── Université pages ─────────────────────────────────────────────
  const universites: MetadataRoute.Sitemap = uniSlugs.map(slug => ({
    url:             `${SITE_URL}/universites/${slug}`,
    lastModified:    now,
    changeFrequency: 'monthly',
    priority:        0.85,
  }));

  // ── Ville pages ──────────────────────────────────────────────────
  const villes: MetadataRoute.Sitemap = citySlugs.map(slug => ({
    url:             `${SITE_URL}/villes/${slug}`,
    lastModified:    now,
    changeFrequency: 'monthly',
    priority:        0.85,
  }));

  return [
    // ── Homepage — priorité maximale ─────────────────────────────
    {
      url:             SITE_URL,
      lastModified:    now,
      changeFrequency: 'weekly',
      priority:        1.0,
    },

    // ── Index blog — haute fréquence (nouveau contenu chaque semaine) ──
    {
      url:             `${SITE_URL}/blog`,
      lastModified:    posts[0]?.updatedDate ? new Date(posts[0].updatedDate) : posts[0] ? new Date(posts[0].date) : now,
      changeFrequency: 'weekly',
      priority:        0.95,
    },

    // ── Index universités & villes ──────────────────────────────
    {
      url:             `${SITE_URL}/universites`,
      lastModified:    now,
      changeFrequency: 'monthly',
      priority:        0.9,
    },
    {
      url:             `${SITE_URL}/villes`,
      lastModified:    now,
      changeFrequency: 'monthly',
      priority:        0.9,
    },

    // ── Pays — pages piliers par nationalité ────────────────────
    {
      url:             `${SITE_URL}/pays/etudier-en-france-depuis-le-maroc`,
      lastModified:    now,
      changeFrequency: 'monthly',
      priority:        0.95,
    },
    {
      url:             `${SITE_URL}/pays/etudier-en-france-depuis-algerie`,
      lastModified:    now,
      changeFrequency: 'monthly',
      priority:        0.95,
    },
    {
      url:             `${SITE_URL}/pays/etudier-en-france-depuis-senegal`,
      lastModified:    now,
      changeFrequency: 'monthly',
      priority:        0.95,
    },

    // ── Checklist PDF — page conversion principale ───────────────
    {
      url:             `${SITE_URL}/checklist`,
      lastModified:    now,
      changeFrequency: 'monthly',
      priority:        0.9,
    },

    // ── Pages statiques ─────────────────────────────────────────
    {
      url:             `${SITE_URL}/a-propos`,
      lastModified:    now,
      changeFrequency: 'yearly',
      priority:        0.5,
    },

    // ── Universités (dynamique) ──────────────────────────────────
    ...universites,

    // ── Villes (dynamique) ───────────────────────────────────────
    ...villes,

    // ── Articles blog ────────────────────────────────────────────
    ...articles,
  ];
}
