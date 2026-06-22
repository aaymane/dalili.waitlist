import { emailBase, divider, sectionLabel, ctaButton, FONT, SITE, BLUE } from './components/EmailBase';

export interface VilleEmailData {
  nom:           string;
  slug:          string;
  budgetMin:     number;
  budgetMax:     number;
  avantages:     string[];
  inconvenients: string[];
  avis:          string;
}

export interface ComparateurEmailProps {
  villes: VilleEmailData[];
  recommandation: string;
}

function villeCard(v: VilleEmailData): string {
  const top2Avantages   = v.avantages.slice(0, 2);
  const top1Inconvenient = v.inconvenients[0] ?? '';

  return `
    <div style="border-top:3px solid ${BLUE};background:rgba(255,255,255,0.04);border-radius:0 0 12px 12px;padding:20px;margin-bottom:16px">
      <h2 style="margin:0 0 4px;font-family:${FONT};font-size:18px;font-weight:700;color:#ffffff">${v.nom}</h2>
      <p style="margin:0 0 14px;font-family:${FONT};font-size:13px;color:rgba(255,255,255,0.5)">${v.budgetMin}–${v.budgetMax} €/mois</p>

      ${top2Avantages.map(a => `
        <div style="display:flex;align-items:flex-start;gap:8px;margin-bottom:7px">
          <span style="color:#34d399;flex-shrink:0;font-size:14px">✅</span>
          <span style="font-family:${FONT};font-size:13px;color:rgba(255,255,255,0.75);line-height:1.5">${a}</span>
        </div>
      `).join('')}

      ${top1Inconvenient ? `
        <div style="display:flex;align-items:flex-start;gap:8px;margin-bottom:12px">
          <span style="color:#f59e0b;flex-shrink:0;font-size:14px">⚠️</span>
          <span style="font-family:${FONT};font-size:13px;color:rgba(255,255,255,0.75);line-height:1.5">${top1Inconvenient}</span>
        </div>
      ` : ''}

      <p style="margin:0 0 14px;font-family:${FONT};font-size:13px;font-style:italic;color:rgba(255,255,255,0.5);line-height:1.6;border-left:2px solid rgba(1,77,248,0.3);padding-left:12px">
        ${v.avis}
      </p>

      <a href="${SITE}/villes/${v.slug}" style="font-family:${FONT};font-size:12px;font-weight:700;color:${BLUE};text-decoration:none;letter-spacing:0.5px">
        Guide complet ${v.nom} →
      </a>
    </div>
  `;
}

export function renderComparateurEmail(props: ComparateurEmailProps): string {
  const { villes, recommandation } = props;

  const titreVilles = villes.map(v => v.nom).join(' vs ');

  const content = `
    <div style="padding:24px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:12px;margin-bottom:28px">
      <h1 style="margin:0 0 10px;font-family:${FONT};font-size:22px;font-weight:700;color:#ffffff;line-height:1.2">
        Ta comparaison ${titreVilles} 📊
      </h1>
      <p style="margin:0;font-family:${FONT};font-size:14px;color:rgba(255,255,255,0.6);line-height:1.65">
        Voici une comparaison détaillée de tes villes pour t'aider à choisir où étudier en France.
      </p>
    </div>

    ${divider()}

    ${sectionLabel('Comparatif par ville')}

    ${villes.map(v => villeCard(v)).join('')}

    ${divider()}

    <!-- Recommandation card — border dorée -->
    <div style="border:1px solid rgba(251,191,36,0.3);background:rgba(251,191,36,0.05);border-radius:12px;padding:20px;margin-bottom:28px">
      <p style="margin:0 0 10px;font-family:${FONT};font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#fbbf24">
        Recommandation Dalili
      </p>
      <p style="margin:0;font-family:${FONT};font-size:14px;color:rgba(255,255,255,0.8);line-height:1.7">
        ${recommandation}
      </p>
    </div>

    ${ctaButton(`${SITE}/comparer`, 'Comparer d\'autres villes →')}
  `;

  return emailBase(content, `Ta comparaison ${titreVilles} — Recommandation Dalili 📊`);
}
