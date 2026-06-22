import type { CalendrierStep } from './calendrier-data';

const URGENCE_COLOR = {
  rouge:  '#ef4444',
  orange: '#f59e0b',
  vert:   '#014DF8',
} as const;

const URGENCE_RGB = {
  rouge:  [239, 68, 68],
  orange: [245, 158, 11],
  vert:   [1, 77, 248],
} as const;

// SVG logo paths — viewBox "-1 105 70 71" (source: /public/images/logo-dalili.svg)
const LOGO_P1 = 'M45.83,124.17h-13.08s-12.61,12.62-12.61,12.62l6.87,6.9,10.2-10.03c.93-.48,3.49-.48,4.16.29l11.98,13.73-12.33,12.45c-1.41,1.43-2.43,2.99-4.05,4.34h-16.74c-1.73-1.43-2.84-2.99-4.25-4.58-5.09-5.75-10.17-11.5-15.26-17.25-.21-.22-.38-.39-.5-.5-.05-.04-.11-.1-.21-.14,0,0,0,0-.01,0,.1.12.08.58.08.84v14.73s14.37,16.39,14.37,16.39l26.56.04,2.49-2.55,23.38-23.49-21.05-23.8Z';
const LOGO_P2 = 'M36.97,164.47h-16.74s16.74,0,16.74,0Z';
const LOGO_P3 = 'M66.99,125.02l-14.38-16.39-26.56-.04-2.49,2.55L.19,134.62l21.05,23.8h13.08s12.61-12.62,12.61-12.62l-6.87-6.9-10.2,10.03c-.93.48-3.49.48-4.16-.29l-11.98-13.73,12.33-12.45c1.41-1.43,2.43-2.99,4.05-4.34h16.74c1.73,1.43,2.84,2.99,4.25,4.58l15.26,17.25c.28.32.46.55.73.65-.03-5.2-.05-10.39-.08-15.59Z';

const BG_DARK  = '#0a0f1e';
const BG_BODY  = '#070b18';
const TEXT_W   = '#ffffff';
const TEXT_MID = '#8899bb';
const ACCENT   = '#014DF8';

function drawLogo(doc: PDFKit.PDFDocument, cx: number, topY: number, size: number) {
  // SVG viewBox: x=-1 y=105 w=70 h=71
  const s = size / 70;
  doc.save();
  // Map SVG space to PDF: translate so that viewBox origin (-1, 105) lands at (cx - size/2, topY)
  doc.translate(cx - size / 2 + 1 * s, topY - 105 * s);
  doc.scale(s, s);
  doc.fillColor(TEXT_W);
  doc.path(LOGO_P1).fill();
  doc.path(LOGO_P2).fill();
  doc.path(LOGO_P3).fill();
  doc.restore();
}

export async function generateCalendrierPDF(
  paysLabel:    string,
  paysEmoji:    string,
  rentreeLabel: string,
  etapes:       CalendrierStep[],
): Promise<Buffer> {
  const PDFDocument = (await import('pdfkit')).default;

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: 'A4',
      margins: { top: 0, bottom: 0, left: 0, right: 0 },
      info: {
        Title:   `Calendrier Campus France — ${paysLabel} → ${rentreeLabel}`,
        Author:  'Dalili (dalili.study)',
        Subject: 'Planning Campus France personnalisé',
      },
    });

    const buffers: Buffer[] = [];
    doc.on('data',  chunk => buffers.push(chunk));
    doc.on('end',   ()    => resolve(Buffer.concat(buffers)));
    doc.on('error', reject);

    const W      = doc.page.width;   // 595.28
    const MARGIN = 40;
    const CX     = W / 2;

    // ── Full page background ──────────────────────────────────────────
    doc.rect(0, 0, W, doc.page.height + 1000).fill(BG_BODY);

    // ── Header band ───────────────────────────────────────────────────
    const headerH = 150;
    doc.rect(0, 0, W, headerH).fill('#0a1628');

    // Top accent gradient line (simulate with solid color)
    doc.rect(0, 0, W, 3).fill(ACCENT);

    // Logo centered — SVG paths
    const logoSize = 42;
    drawLogo(doc, CX, 20, logoSize);

    // DALILI wordmark centered
    doc.fillColor(TEXT_W)
       .font('Helvetica-Bold')
       .fontSize(13)
       .text('DALILI', 0, 20 + logoSize + 8, {
         align:            'center',
         width:             W,
         characterSpacing:  7,
       });

    // Blue accent line centered
    const lineY = 20 + logoSize + 30;
    doc.rect(CX - 16, lineY, 32, 2).fill(ACCENT);

    // dalili.study
    doc.fillColor(ACCENT)
       .font('Helvetica')
       .fontSize(9)
       .text('dalili.study', 0, lineY + 7, { align: 'center', width: W });

    // ── Title section ─────────────────────────────────────────────────
    let y = headerH + 24;

    doc.fillColor(TEXT_MID)
       .font('Helvetica')
       .fontSize(8)
       .text('TON CALENDRIER PERSONNALISÉ', MARGIN, y, { characterSpacing: 1.5 });

    y += 16;

    doc.fillColor(TEXT_W)
       .font('Helvetica-Bold')
       .fontSize(17)
       .text(`${paysLabel} → ${rentreeLabel}`, MARGIN, y);

    y += 24;

    doc.fillColor(TEXT_MID)
       .font('Helvetica')
       .fontSize(9)
       .text(`${etapes.length} étapes · De ${etapes[0]?.mois} à ${etapes[etapes.length - 1]?.mois}`, MARGIN, y);

    y += 16;

    // Separator
    doc.rect(MARGIN, y, W - MARGIN * 2, 0.5).fill('#1a2a4a');
    y += 12;

    // Legend
    const legendItems: Array<{ urgence: keyof typeof URGENCE_COLOR; label: string }> = [
      { urgence: 'rouge',  label: 'Urgent' },
      { urgence: 'orange', label: 'Important' },
      { urgence: 'vert',   label: 'Préparation' },
    ];
    let lx = MARGIN;
    legendItems.forEach(item => {
      const [r, g, b] = URGENCE_RGB[item.urgence];
      doc.rect(lx, y + 2, 3, 10).fill([r / 255, g / 255, b / 255]);
      doc.fillColor(TEXT_MID).font('Helvetica').fontSize(8).text(item.label, lx + 8, y + 2);
      lx += 85;
    });

    y += 22;

    // ── Step cards ────────────────────────────────────────────────────
    const CARD_GAP     = 3;
    const CARD_PAD_V   = 12;
    const CARD_PAD_L   = 18;
    const CARD_W       = W - MARGIN * 2;
    const TEXT_W_INNER = CARD_W - CARD_PAD_L - 8;

    etapes.forEach(step => {
      const [r, g, b] = URGENCE_RGB[step.urgence];
      const rgb: [number, number, number] = [r / 255, g / 255, b / 255];

      const descLines = Math.ceil(step.description.length / 80) + 1;
      const cardH = CARD_PAD_V * 2
                  + (step.isArrivee ? 18 : 0)
                  + 12   // mois
                  + 17   // action
                  + descLines * 11
                  + (step.lien ? 14 : 0);

      // Page break check
      if (y + cardH > doc.page.height - 56) {
        doc.addPage();
        doc.rect(0, 0, W, doc.page.height + 1000).fill(BG_BODY);
        y = MARGIN;
      }

      // Card bg
      doc.rect(MARGIN, y, CARD_W, cardH).fill(BG_DARK);
      // Left color border
      doc.rect(MARGIN, y, 3, cardH).fill(rgb);

      let cy = y + CARD_PAD_V;

      // Arrival badge
      if (step.isArrivee) {
        doc.rect(MARGIN + CARD_PAD_L, cy - 1, 128, 13).fill([239 / 255, 68 / 255, 68 / 255, 0.2]);
        doc.fillColor('#ef4444').font('Helvetica-Bold').fontSize(7)
           .text('✈  ARRIVÉE EN FRANCE', MARGIN + CARD_PAD_L + 5, cy + 1);
        cy += 17;
      }

      // Month
      doc.fillColor(URGENCE_COLOR[step.urgence]).font('Helvetica-Bold').fontSize(8)
         .text(step.mois.toUpperCase(), MARGIN + CARD_PAD_L, cy, { characterSpacing: 0.8 });
      cy += 12;

      // Action
      doc.fillColor(TEXT_W).font('Helvetica-Bold').fontSize(11)
         .text(step.action, MARGIN + CARD_PAD_L, cy, { width: TEXT_W_INNER, lineGap: 2 });
      cy += 17;

      // Description
      doc.fillColor(TEXT_MID).font('Helvetica').fontSize(9)
         .text(step.description, MARGIN + CARD_PAD_L, cy, { width: TEXT_W_INNER, lineGap: 2 });
      cy += descLines * 11;

      // Link
      if (step.lien) {
        doc.fillColor(rgb).font('Helvetica-Bold').fontSize(8)
           .text(`Voir le guide : ${step.lien.label} →`, MARGIN + CARD_PAD_L, cy + 2, { width: TEXT_W_INNER });
      }

      y += cardH + CARD_GAP;
    });

    // ── Footer ────────────────────────────────────────────────────────
    if (y + 52 > doc.page.height - 10) {
      doc.addPage();
      doc.rect(0, 0, W, doc.page.height + 1000).fill(BG_BODY);
      y = MARGIN;
    }

    y += 14;
    doc.rect(MARGIN, y, W - MARGIN * 2, 0.5).fill('#1a2040');
    y += 10;

    doc.fillColor(TEXT_MID).font('Helvetica').fontSize(8)
       .text(
         'dalili.study · Ton guide pour étudier en France · Généré gratuitement',
         MARGIN, y,
         { align: 'center', width: W - MARGIN * 2 },
       );

    doc.end();
  });
}
