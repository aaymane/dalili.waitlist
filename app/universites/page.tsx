import type { Metadata } from 'next';
import Link from 'next/link';
import { UNIVERSITIES } from '@/lib/universities';
import SearchableUniversitesGrid from '@/components/universites/SearchableUniversitesGrid';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dalili.study';

export const metadata: Metadata = {
  title: 'Universités en France pour étudiants étrangers : guide complet 2026 | Dalili',
  description: 'Comparez les universités françaises : coût de la vie, frais de scolarité, logement CROUS, programmes populaires. Toutes les infos pour choisir votre université.',
  alternates: { canonical: `${SITE_URL}/universites` },
  openGraph: {
    title: 'Universités en France pour étudiants étrangers 2026 | Dalili',
    description: 'Guide complet des universités françaises : Bordeaux, Paris, Lyon, Nantes. Frais, logement, vie étudiante.',
    url: `${SITE_URL}/universites`,
    siteName: 'Dalili', type: 'website',
    images: [{ url: `${SITE_URL}/og-image.jpg`, width: 1200, height: 630 }],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Accueil', item: SITE_URL },
    { '@type': 'ListItem', position: 2, name: 'Universités', item: `${SITE_URL}/universites` },
  ],
};

const ACCENT = { rgb: '77,143,255', hex: '#4d8fff' };

export default function UniversitesPage() {
  const unis = Object.values(UNIVERSITIES);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <main style={{ paddingTop: 100, paddingBottom: 120, minHeight: '100vh' }}>
        <div style={{ maxWidth: 1440, margin: '0 auto', padding: '0 clamp(16px,2vw,32px)' }}>

          {/* Header */}
          <div style={{ marginBottom: 'clamp(48px,8vw,80px)' }}>
            <Link href="/" style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              fontFamily: 'var(--font-montserrat)', fontSize: '0.58rem', fontWeight: 700,
              letterSpacing: '0.18em', textTransform: 'uppercase',
              color: `rgba(${ACCENT.rgb},0.7)`, textDecoration: 'none', marginBottom: 28,
            }}>← Retour à l&apos;accueil</Link>

            <div style={{ display: 'inline-flex', marginBottom: 20, padding: '5px 16px', border: `1px solid rgba(${ACCENT.rgb},0.3)`, borderRadius: 100, background: `rgba(${ACCENT.rgb},0.07)` }}>
              <span style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.24em', textTransform: 'uppercase', color: `rgba(${ACCENT.rgb},0.85)` }}>
                {unis.length} établissements
              </span>
            </div>

            <h1 style={{ fontFamily: 'var(--font-bebas)', fontWeight: 400, fontSize: 'clamp(3.5rem,8vw,9rem)', lineHeight: 0.9, letterSpacing: '0.04em', color: '#fff', margin: '0 0 clamp(16px,2vw,24px)' }}>
              UNIVERSITÉS<br />
              <span style={{ color: 'rgba(255,255,255,0.35)' }}>EN FRANCE.</span>
            </h1>

            <p style={{ fontFamily: 'var(--font-dm-sans)', fontWeight: 300, fontSize: 'clamp(0.88rem,1.3vw,1.05rem)', color: 'rgba(255,255,255,0.45)', maxWidth: 'min(540px,88vw)', lineHeight: 1.75, margin: 0 }}>
              Tout ce qu&apos;il faut savoir avant de choisir votre université :
              frais, logement, budget mensuel, programmes phares et avis honnêtes.
            </p>
          </div>

          <SearchableUniversitesGrid unis={unis} />

          <p style={{ marginTop: 48, textAlign: 'center', fontFamily: 'var(--font-dm-sans)', fontWeight: 300, fontSize: '0.875rem', color: 'rgba(255,255,255,0.3)' }}>
            D&apos;autres universités arrivent bientôt — <Link href="/blog" style={{ color: 'rgba(77,143,255,0.6)', textDecoration: 'none' }}>consulter tous les guides</Link>
          </p>
        </div>
      </main>
    </>
  );
}
