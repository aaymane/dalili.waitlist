import { PDFDocument, StandardFonts, rgb, PageSizes, type RGB } from 'pdf-lib';

export interface SimulateurPDFData {
  villeName:      string;
  logementName:   string;
  niveauName:     string;
  paysName:       string;
  paySlug:        string;
  paiement_frais: 'unique' | 'mensuel';
  housing:        number;
  food:           number;
  transport:      number;
  tuitionMonthly: number;
  tuitionAnnual:  number;
  cvecMonthly:    number;
  totalDepenses:  number;
  cafEstimee:     number;
  resteAFinancer: number;
}

// ── Couleurs ──────────────────────────────────────────────────────────────────
const C_BLUE       = rgb(1 / 255,   77 / 255,  248 / 255);  // #014DF8
const C_BLUE_DARK  = rgb(10 / 255,  22 / 255,  40 / 255);   // #0a1628
const C_BODY       = rgb(7 / 255,   11 / 255,  24 / 255);   // #070b18
const C_WHITE      = rgb(1, 1, 1);
const C_MID        = rgb(136 / 255, 153 / 255, 187 / 255);  // #8899bb
const C_GREEN      = rgb(34 / 255,  197 / 255, 94 / 255);   // #22c55e
const C_ROW_A      = rgb(10 / 255,  16 / 255,  34 / 255);   // #0a1022
const C_ROW_B      = rgb(12 / 255,  18 / 255,  40 / 255);   // #0c1228
const C_ROW_HEAD   = rgb(13 / 255,  25 / 255,  48 / 255);   // #0d1930

export async function generateSimulateurPDF(data: SimulateurPDFData): Promise<Buffer> {
  const {
    villeName, logementName, niveauName, paysName,
    paiement_frais, housing, food, transport,
    tuitionMonthly, tuitionAnnual, cvecMonthly,
    totalDepenses, cafEstimee, resteAFinancer,
  } = data;

  const pdfDoc = await PDFDocument.create();
  pdfDoc.setTitle(`Budget étudiant — ${villeName} — Dalili`);
  pdfDoc.setAuthor('Dalili (dalili.study)');
  pdfDoc.setSubject(`Estimation budget mensuel étudiant étranger — ${villeName}`);

  const page = pdfDoc.addPage(PageSizes.A4);
  const W = page.getWidth();   // 595.28
  const H = page.getHeight();  // 841.89

  const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const norm = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const MARGIN = 40;
  const CW     = W - MARGIN * 2;

  // ── Helpers (y from TOP of page) ────────────────────────────────────────────
  const fillRect = (topY: number, h: number, x: number, w: number, color: RGB) =>
    page.drawRectangle({ x, y: H - topY - h, width: w, height: h, color });

  const txt = (s: string, topY: number, x: number, size: number, f = norm, color: RGB = C_WHITE) =>
    page.drawText(s, { x, y: H - topY, size, font: f, color });

  const centered = (s: string, topY: number, size: number, f = norm, color: RGB = C_WHITE) => {
    const tw = f.widthOfTextAtSize(s, size);
    page.drawText(s, { x: W / 2 - tw / 2, y: H - topY, size, font: f, color });
  };

  // ── Background ──────────────────────────────────────────────────────────────
  fillRect(0, H, 0, W, C_BODY);

  // ── Header ──────────────────────────────────────────────────────────────────
  const HEADER_H = 130;
  fillRect(0, HEADER_H, 0, W, C_BLUE_DARK);
  fillRect(0, 3, 0, W, C_BLUE);

  // DALILI wordmark
  centered('DALILI', 48, 22, bold, C_WHITE);

  // Accent bar
  fillRect(56, 2, W / 2 - 18, 36, C_BLUE);

  // dalili.study
  centered('dalili.study', 70, 9, norm, C_BLUE);

  // Tagline
  centered('Guide des etudiants internationaux en France', 85, 7.5, norm, C_MID);

  // ── Page title ──────────────────────────────────────────────────────────────
  let y = HEADER_H + 22;

  txt('ESTIMATION BUDGET MENSUEL', y, MARGIN, 7.5, norm, C_MID);
  y += 15;
  txt(`Etudier a ${villeName}`, y, MARGIN, 15, bold, C_WHITE);
  y += 19;
  txt(`${niveauName}  ·  ${logementName}  ·  ${paysName}`, y, MARGIN, 8.5, norm, C_MID);
  y += 14;

  fillRect(y, 0.5, MARGIN, CW, rgb(0.1, 0.16, 0.29));
  y += 14;

  // ── Budget table ─────────────────────────────────────────────────────────────
  txt('BUDGET MENSUEL ESTIME', y, MARGIN, 8, bold, C_BLUE);
  y += 14;

  const rows: Array<[string, string]> = [
    [`Loyer (${logementName})`, `${housing} EUR`],
    ['Nourriture',              `${food} EUR`],
    ['Transport mensuel',       `${transport} EUR`],
    ['Telephone / internet',    '30 EUR'],
    ['Loisirs, divers & sante', '100 EUR'],
    ...(paiement_frais === 'mensuel' && tuitionMonthly > 0
      ? [[`Frais inscription /mois`, `${tuitionMonthly} EUR`] as [string, string]]
      : []),
    ...(cvecMonthly > 0
      ? [['CVEC (mensuelle)', `${cvecMonthly} EUR`] as [string, string]]
      : []),
  ];

  const ROW_H     = 20;
  const COL_VAL_X = W - MARGIN - 10;

  // Table header
  fillRect(y, 16, MARGIN, CW, C_ROW_HEAD);
  txt('Poste de depense', y + 4, MARGIN + 8, 7.5, bold, C_MID);
  txt('Montant / mois', y + 4, COL_VAL_X - 60, 7.5, bold, C_MID);
  y += 16;

  rows.forEach(([label, value], i) => {
    fillRect(y, ROW_H, MARGIN, CW, i % 2 === 0 ? C_ROW_A : C_ROW_B);
    txt(label, y + 14, MARGIN + 8, 9.5, norm, C_WHITE);
    const vw = norm.widthOfTextAtSize(value, 9.5);
    txt(value, y + 14, COL_VAL_X - vw, 9.5, bold, C_WHITE);
    y += ROW_H;
  });

  // Total row
  y += 3;
  fillRect(y, 22, MARGIN, CW, C_ROW_HEAD);
  txt('TOTAL DEPENSES', y + 15, MARGIN + 8, 11, bold, C_WHITE);
  const totalStr = `${totalDepenses} EUR/mois`;
  const tw = bold.widthOfTextAtSize(totalStr, 12);
  txt(totalStr, y + 15, COL_VAL_X - tw, 12, bold, C_WHITE);
  y += 22;

  // CAF row
  fillRect(y, 20, MARGIN, CW, rgb(10 / 255, 26 / 255, 20 / 255));
  txt('CAF estimee (aide logement)', y + 13, MARGIN + 8, 9.5, bold, C_GREEN);
  const cafStr = `-${cafEstimee} EUR`;
  const cw = bold.widthOfTextAtSize(cafStr, 9.5);
  txt(cafStr, y + 13, COL_VAL_X - cw, 9.5, bold, C_GREEN);
  y += 20;

  // Reste à financer
  fillRect(y, 24, MARGIN, CW, C_BLUE);
  txt('RESTE A FINANCER', y + 16, MARGIN + 8, 11, bold, C_WHITE);
  const resteStr = `${resteAFinancer} EUR/mois`;
  const rw = bold.widthOfTextAtSize(resteStr, 13);
  txt(resteStr, y + 16, COL_VAL_X - rw, 13, bold, C_WHITE);
  y += 24;

  // Frais uniques
  if (paiement_frais === 'unique' && tuitionAnnual > 0) {
    y += 12;
    fillRect(y, 0.5, MARGIN, CW, rgb(0.1, 0.16, 0.29));
    y += 10;
    txt('FRAIS D\'INSCRIPTION (paiement unique a la rentree)', y, MARGIN, 7.5, bold, C_BLUE);
    y += 12;
    fillRect(y, 22, MARGIN, CW, rgb(8 / 255, 15 / 255, 32 / 255));
    txt(`${tuitionAnnual} EUR par an`, y + 15, MARGIN + 8, 12, bold, C_WHITE);
    txt('(exoneration possible selon bourse / pays)', y + 15, MARGIN + 8 + 120, 7.5, norm, C_MID);
    y += 30;
  }

  // ── Guides utiles ────────────────────────────────────────────────────────────
  y += 10;
  fillRect(y, 0.5, MARGIN, CW, rgb(0.1, 0.16, 0.29));
  y += 12;

  txt('GUIDES UTILES', y, MARGIN, 7.5, bold, C_BLUE);
  y += 14;

  const links = [
    'dalili.study/blog/budget-mensuel-etudiant-etranger-france-2026',
    'dalili.study/blog/logement-crous-etudiant-etranger-demande',
    'dalili.study/blog/caf-etudiant-etranger-delais-documents-erreurs',
    'dalili.study/blog/trouver-logement-france-depuis-etranger',
    'dalili.study/checklist — Checklist complete arrivee en France',
  ];

  links.forEach(link => {
    txt(`•  ${link}`, y, MARGIN + 4, 7.5, norm, C_BLUE);
    y += 12;
  });

  // ── Note ──────────────────────────────────────────────────────────────────────
  y += 6;
  fillRect(y, 0.5, MARGIN, CW, rgb(0.1, 0.12, 0.25));
  y += 10;
  txt('Ces chiffres sont des estimations. La CAF reelle depend de votre situation. Verifiez sur caf.fr', y, MARGIN, 7, norm, C_MID);
  y += 12;

  // ── Footer ───────────────────────────────────────────────────────────────────
  centered('dalili.study  ·  Guide des etudiants internationaux en France  ·  2026', y, 7.5, norm, C_MID);

  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}
