import type { Metadata } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dalili.study';

export const metadata: Metadata = {
  title: 'Statistiques — Études en France pour étudiants étrangers 2026 | Dalili',
  description: 'Chiffres vérifiés et sourcés : visa étudiant France délais, budget 615€/mois, frais de scolarité, logement CROUS, CAF — données officielles 2025-2026.',
  alternates: { canonical: `${SITE_URL}/stats` },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Statistiques études en France — étudiants étrangers 2026',
    description: 'Toutes les données officielles : 358 000 étudiants étrangers, 615 €/mois exigés, frais de scolarité, loyers par ville.',
    url: `${SITE_URL}/stats`,
    siteName: 'Dalili',
    type: 'website',
    images: [{ url: `${SITE_URL}/og-image.jpg`, width: 1200, height: 630 }],
  },
};

const datasetSchema = {
  '@context': 'https://schema.org',
  '@type': 'Dataset',
  name: 'Statistiques études en France pour étudiants étrangers 2026',
  description: 'Données vérifiées sur le visa étudiant, le budget, le logement et les frais de scolarité pour les étudiants étrangers en France',
  url: `${SITE_URL}/stats`,
  creator: { '@type': 'Organization', name: 'Dalili', url: SITE_URL },
  dateModified: '2026-06-01',
  keywords: [
    'visa étudiant France statistiques',
    'budget étudiant étranger France',
    'frais scolarité université France',
    'logement étudiant France prix',
  ],
};

const CITY_DATA = [
  { city: 'Paris',          budgetMin: 900,  budgetMax: 1500, students: '700 000', unis: 17 },
  { city: 'Lyon',           budgetMin: 700,  budgetMax: 1200, students: '180 000', unis: 4  },
  { city: 'Bordeaux',       budgetMin: 650,  budgetMax: 1100, students: '100 000', unis: 3  },
  { city: 'Toulouse',       budgetMin: 650,  budgetMax: 1050, students: '130 000', unis: 3  },
  { city: 'Marseille',      budgetMin: 660,  budgetMax: 1100, students: '80 000',  unis: 1  },
  { city: 'Montpellier',    budgetMin: 650,  budgetMax: 1050, students: '75 000',  unis: 2  },
  { city: 'Strasbourg',     budgetMin: 650,  budgetMax: 1000, students: '55 000',  unis: 1  },
  { city: 'Lille',          budgetMin: 620,  budgetMax: 1000, students: '120 000', unis: 3  },
  { city: 'Nantes',         budgetMin: 620,  budgetMax: 1000, students: '65 000',  unis: 1  },
  { city: 'Nice',           budgetMin: 750,  budgetMax: 1200, students: '30 000',  unis: 1  },
  { city: 'Rennes',         budgetMin: 600,  budgetMax: 950,  students: '70 000',  unis: 2  },
  { city: 'Grenoble',       budgetMin: 620,  budgetMax: 1000, students: '60 000',  unis: 2  },
  { city: 'Clermont-Fd',    budgetMin: 500,  budgetMax: 800,  students: '40 000',  unis: 1  },
  { city: 'Dijon',          budgetMin: 550,  budgetMax: 850,  students: '35 000',  unis: 1  },
];

const s = {
  page: { background: '#010510', minHeight: '100vh', padding: 'clamp(60px,8vw,100px) clamp(16px,5vw,64px)' } as React.CSSProperties,
  inner: { maxWidth: 900, margin: '0 auto' } as React.CSSProperties,
  eyebrow: { fontFamily: 'var(--font-montserrat)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase' as const, color: 'rgba(77,143,255,0.75)', marginBottom: 14 } as React.CSSProperties,
  h1: { fontFamily: 'var(--font-montserrat)', fontWeight: 900, fontSize: 'clamp(24px,4vw,44px)', color: '#ffffff', margin: '0 0 14px', lineHeight: 1.1, letterSpacing: '-0.01em' } as React.CSSProperties,
  lead: { fontFamily: 'var(--font-dm-sans)', fontSize: '15px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.75, margin: '0 0 64px', maxWidth: 600 } as React.CSSProperties,
  sectionTitle: { fontFamily: 'var(--font-montserrat)', fontWeight: 800, fontSize: '13px', letterSpacing: '0.2em', textTransform: 'uppercase' as const, color: '#4d8fff', margin: '56px 0 20px' } as React.CSSProperties,
  statGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(240px,100%),1fr))', gap: 14, marginBottom: 8 } as React.CSSProperties,
  statCard: { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '20px 22px' } as React.CSSProperties,
  statVal: { fontFamily: 'var(--font-montserrat)', fontWeight: 800, fontSize: 28, color: '#ffffff', lineHeight: 1, marginBottom: 6 } as React.CSSProperties,
  statLabel: { fontFamily: 'var(--font-dm-sans)', fontSize: 13, color: 'rgba(255,255,255,0.55)', lineHeight: 1.5, margin: 0 } as React.CSSProperties,
  statSource: { fontFamily: 'var(--font-dm-sans)', fontSize: 11, color: 'rgba(255,255,255,0.25)', marginTop: 8 } as React.CSSProperties,
  table: { width: '100%', borderCollapse: 'collapse' as const, marginTop: 4 } as React.CSSProperties,
  th: { fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: 'rgba(255,255,255,0.4)', padding: '10px 14px', textAlign: 'left' as const, borderBottom: '1px solid rgba(255,255,255,0.07)' } as React.CSSProperties,
  td: { fontFamily: 'var(--font-dm-sans)', fontSize: 14, color: 'rgba(255,255,255,0.75)', padding: '12px 14px', borderBottom: '1px solid rgba(255,255,255,0.04)' } as React.CSSProperties,
  note: { fontFamily: 'var(--font-dm-sans)', fontSize: 12, color: 'rgba(255,255,255,0.3)', marginTop: 12 } as React.CSSProperties,
};

export default function StatsPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(datasetSchema) }} />
      <div style={s.page}>
        <div style={s.inner}>
          <p style={s.eyebrow}>Données officielles · Mise à jour juin 2026</p>
          <h1 style={s.h1}>Statistiques — Études en France pour étudiants étrangers 2026</h1>
          <p style={s.lead}>
            Tous les chiffres vérifiés sur le visa, le budget, le logement et les frais de scolarité pour les étudiants internationaux en France. Sources officielles uniquement.
          </p>

          {/* ── Campus France & Visa */}
          <p style={s.sectionTitle}>Campus France & Visa</p>
          <div style={s.statGrid}>
            {[
              { val: '358 000', label: "Étudiants étrangers en France (2023-2024)", source: 'MESR' },
              { val: '1er', label: "Pays d'accueil francophone mondial", source: 'Campus France' },
              { val: 'Top 5', label: "Mondial pour l'accueil d'étudiants étrangers", source: 'UNESCO' },
              { val: '30', label: "Pays soumis à la procédure CEF obligatoire", source: 'campusfrance.org' },
              { val: '8-14 sem.', label: "Délai visa depuis le Maroc (été)", source: 'Consulat France Maroc 2025-2026' },
              { val: '6-10 sem.', label: "Délai visa depuis l'Algérie", source: 'Consulat France Algérie 2025-2026' },
              { val: '3-6 sem.', label: "Délai visa depuis le Sénégal", source: 'Consulat France Dakar 2025-2026' },
              { val: '~85 %', label: "Taux d'avis favorable Campus France Maroc", source: 'Estimation Dalili 2025' },
            ].map((stat, i) => (
              <div key={i} style={s.statCard}>
                <div style={s.statVal}>{stat.val}</div>
                <p style={s.statLabel}>{stat.label}</p>
                <p style={s.statSource}>{stat.source}</p>
              </div>
            ))}
          </div>

          {/* ── Budget & Logement */}
          <p style={s.sectionTitle}>Budget & Logement</p>
          <div style={s.statGrid}>
            {[
              { val: '615 €/mois', label: 'Ressources minimales exigées par le consulat', source: 'Service-public.fr' },
              { val: '7 380 €', label: 'Minimum pour 12 mois de séjour', source: 'Service-public.fr' },
              { val: '120-450 €', label: 'Prix CROUS mensuel selon ville et type', source: 'CROUS 2025-2026' },
              { val: '80-220 €', label: 'CAF/APL mensuelle selon ville et loyer', source: 'CAF.fr' },
              { val: '< 9 720 €/an', label: 'Plafond de revenus pour CSS gratuite', source: 'Ameli.fr 2025' },
              { val: '105 €', label: 'CVEC 2025-2026 (paiement unique annuel)', source: 'CNOUS' },
            ].map((stat, i) => (
              <div key={i} style={s.statCard}>
                <div style={s.statVal}>{stat.val}</div>
                <p style={s.statLabel}>{stat.label}</p>
                <p style={s.statSource}>{stat.source}</p>
              </div>
            ))}
          </div>

          {/* ── Frais de scolarité */}
          <p style={s.sectionTitle}>Frais de scolarité (hors UE)</p>
          <div style={s.statGrid}>
            {[
              { val: '2 895 €/an', label: 'Licence (droits différenciés hors UE)', source: 'MESR 2025-2026' },
              { val: '3 941 €/an', label: 'Master (droits différenciés hors UE)', source: 'MESR 2025-2026' },
              { val: '397 €/an', label: 'Doctorat (tarif unique)', source: 'MESR 2025-2026' },
              { val: '> 50 %', label: "Universités accordant des exonérations hors UE", source: 'Campus France 2025' },
            ].map((stat, i) => (
              <div key={i} style={s.statCard}>
                <div style={s.statVal}>{stat.val}</div>
                <p style={s.statLabel}>{stat.label}</p>
                <p style={s.statSource}>{stat.source}</p>
              </div>
            ))}
          </div>

          {/* ── Travail étudiant */}
          <p style={s.sectionTitle}>Travail étudiant</p>
          <div style={s.statGrid}>
            {[
              { val: '964 h/an', label: 'Maximum travail autorisé (hors UE)', source: 'Service-public.fr' },
              { val: '803 h/an', label: "Maximum Algérie (accord franco-algérien 1968)", source: 'Accord 1968' },
              { val: '11,88 €/h', label: 'SMIC horaire brut 2026', source: 'Service-public.fr 2026' },
              { val: '~4,35 €/h', label: 'Gratification stage obligatoire (> 2 mois)', source: 'Service-public.fr 2026' },
            ].map((stat, i) => (
              <div key={i} style={s.statCard}>
                <div style={s.statVal}>{stat.val}</div>
                <p style={s.statLabel}>{stat.label}</p>
                <p style={s.statSource}>{stat.source}</p>
              </div>
            ))}
          </div>

          {/* ── Tableau villes */}
          <p style={s.sectionTitle}>Budget mensuel par ville universitaire</p>
          <div style={{ overflowX: 'auto' }}>
            <table style={s.table}>
              <thead>
                <tr>
                  {['Ville', 'Budget min', 'Budget max', 'Étudiants', 'Universités'].map(col => (
                    <th key={col} style={s.th}>{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {CITY_DATA.map((row, i) => (
                  <tr key={i}>
                    <td style={{ ...s.td, color: '#ffffff', fontWeight: 600 }}>{row.city}</td>
                    <td style={s.td}>{row.budgetMin} €</td>
                    <td style={s.td}>{row.budgetMax} €</td>
                    <td style={s.td}>{row.students}</td>
                    <td style={s.td}>{row.unis}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={s.note}>Sources : CROUS, observatoires des loyers, OVE 2025-2026. Budget mensuel tout compris (loyer après APL, alimentation, transport, abonnements).</p>

          <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '64px 0 0' }} />
        </div>
      </div>
    </>
  );
}
