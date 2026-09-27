import { jsPDF } from 'jspdf';

export interface DeckPdfData {
  companyName: string;
  tagline?: string;
  headquarters: string;
  email: string;
  whatsapp: string;
  phone: string;
  website: string;
  metrics: { label: string; value: string; highlight: string }[];
  pillars: { title: string; description: string }[];
  technologies: { category: string; stack: string }[];
  caseStudies: { title: string; client: string; category: string; solution: string }[];
  guarantees: { name: string; detail: string }[];
}

/**
 * Generates an executive-grade vector PDF document for the SaroHub Capabilities Deck.
 * Uses native vector drawing and typography, ensuring:
 * 1. 100% crisp typography at any zoom level
 * 2. Zero DOM/CORS canvas capture errors
 * 3. Works seamlessly inside sandboxed iframes
 * 4. Instant generation with zero delay
 */
export function generateExecutiveDeckPdf(data: DeckPdfData): jsPDF {
  // A4 size: 595.28 x 841.89 points (portrait)
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 36;
  const contentWidth = pageWidth - margin * 2;

  // Background: Deep Executive Slate
  doc.setFillColor(9, 13, 22);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // Decorative top accent gradient line
  doc.setFillColor(37, 99, 235); // Blue
  doc.rect(margin, 20, contentWidth * 0.6, 3, 'F');
  doc.setFillColor(6, 182, 212); // Cyan
  doc.rect(margin + contentWidth * 0.6, 20, contentWidth * 0.4, 3, 'F');

  let y = 42;

  // Header: Company Eyebrow & Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(6, 182, 212);
  doc.text('SAROHUB TECHNOLOGIES (PRIVATE) LIMITED', margin, y);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text('CONFIDENTIAL • ENTERPRISE CAPABILITIES STATEMENT', pageWidth - margin, y, { align: 'right' });

  y += 20;

  // Main Heading
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(255, 255, 255);
  doc.text('Executive Capabilities Deck', margin, y);

  y += 14;

  // Subtitle
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(148, 163, 184);
  doc.text(
    'Enterprise Software Architecture • Scaled SaaS Platforms • AI Systems & Cognitive Automation',
    margin,
    y
  );

  y += 14;

  // Metadata Box (Legal, Location, Contact)
  doc.setFillColor(15, 23, 42);
  doc.roundedRect(margin, y, contentWidth, 34, 4, 4, 'F');
  doc.setDrawColor(30, 41, 59);
  doc.roundedRect(margin, y, contentWidth, 34, 4, 4, 'S');

  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text('Legal Status: ', margin + 10, y + 14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(241, 245, 249);
  doc.text('Inc. Private Limited', margin + 60, y + 14);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(148, 163, 184);
  doc.text('Headquarters: ', margin + 160, y + 14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(241, 245, 249);
  doc.text(data.headquarters || 'Skardu, GB, Pakistan', margin + 225, y + 14);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(148, 163, 184);
  doc.text('Leadership Email: ', margin + 10, y + 26);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(56, 189, 248);
  doc.text(data.email || 'mehdi.sarohub@gmail.com', margin + 80, y + 26);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(148, 163, 184);
  doc.text('Desk WhatsApp: ', margin + 260, y + 26);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(52, 211, 153);
  doc.text(data.whatsapp || '+92 3430381473', margin + 335, y + 26);

  y += 44;

  // Section 1: Verified Corporate Metrics
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(56, 189, 248);
  doc.text('VERIFIED ENTERPRISE METRICS', margin, y);

  y += 8;

  const rawMetrics = Array.isArray(data.metrics) ? data.metrics : [];
  const metrics = rawMetrics.slice(0, 6);
  const metricColWidth = metrics.length > 0 ? (contentWidth - (metrics.length - 1) * 6) / metrics.length : contentWidth;

  metrics.forEach((m, i) => {
    const mx = margin + i * (metricColWidth + 6);
    doc.setFillColor(15, 23, 42);
    doc.roundedRect(mx, y, metricColWidth, 38, 3, 3, 'F');
    doc.setDrawColor(30, 41, 59);
    doc.roundedRect(mx, y, metricColWidth, 38, 3, 3, 'S');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(56, 189, 248);
    doc.text(String(m?.value || ''), mx + metricColWidth / 2, y + 14, { align: 'center' });

    doc.setFontSize(6.5);
    doc.setTextColor(241, 245, 249);
    doc.text(String(m?.label || ''), mx + metricColWidth / 2, y + 24, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(5.5);
    doc.setTextColor(148, 163, 184);
    doc.text(String(m?.highlight || ''), mx + metricColWidth / 2, y + 33, { align: 'center' });
  });

  y += 48;

  // Section 2: Core Engineering Pillars
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(56, 189, 248);
  doc.text('CORE ENGINEERING PILLARS', margin, y);

  y += 8;

  const rawPillars = Array.isArray(data.pillars) ? data.pillars : [];
  const pillars = rawPillars.slice(0, 4);
  const halfColWidth = (contentWidth - 8) / 2;

  pillars.forEach((p, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const px = margin + col * (halfColWidth + 8);
    const py = y + row * 44;

    doc.setFillColor(15, 23, 42);
    doc.roundedRect(px, py, halfColWidth, 38, 3, 3, 'F');
    doc.setDrawColor(30, 41, 59);
    doc.roundedRect(px, py, halfColWidth, 38, 3, 3, 'S');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(147, 197, 253);
    doc.text(`•  ${String(p?.title || '')}`, px + 8, py + 12);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(203, 213, 225);
    const splitDesc = doc.splitTextToSize(String(p?.description || ''), halfColWidth - 16);
    doc.text(splitDesc.slice(0, 2), px + 8, py + 22);
  });

  y += 98;

  // Section 3: Technology Stack Matrix
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(56, 189, 248);
  doc.text('PRODUCTION TECHNOLOGY ECOSYSTEM', margin, y);

  y += 8;

  const techBoxHeight = 36;
  doc.setFillColor(15, 23, 42);
  doc.roundedRect(margin, y, contentWidth, techBoxHeight, 3, 3, 'F');
  doc.setDrawColor(30, 41, 59);
  doc.roundedRect(margin, y, contentWidth, techBoxHeight, 3, 3, 'S');

  const techCols = [
    { title: 'Frontend & Mobile', items: 'React, Next.js, React Native, Vite, TypeScript, Tailwind' },
    { title: 'Backend & Cloud', items: 'Node.js, Express, Python FastAPI, PostgreSQL, Redis, Supabase' },
    { title: 'AI & Cognitive', items: 'Gemini 2.5, OpenAI GPT-4o, LangChain, Vector RAG, Agents' },
    { title: 'DevOps & SRE', items: 'AWS, GCP Cloud Run, Docker, Cloudflare, CI/CD, Terraform' }
  ];

  const techColW = contentWidth / 4;
  techCols.forEach((tc, idx) => {
    const tx = margin + idx * techColW;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(248, 250, 252);
    doc.text(tc.title, tx + 8, y + 12);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6);
    doc.setTextColor(148, 163, 184);
    const splitItems = doc.splitTextToSize(String(tc.items || ''), techColW - 14);
    doc.text(splitItems.slice(0, 2), tx + 8, y + 22);
  });

  y += 46;

  // Section 4: Selected Case Studies
  const rawCases = Array.isArray(data.caseStudies) ? data.caseStudies : [];
  if (rawCases.length > 0) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(56, 189, 248);
    doc.text('VERIFIED CLIENT CASE STUDIES & BREAKTHROUGHS', margin, y);

    y += 8;

    const csList = rawCases.slice(0, 3);
    const csColW = (contentWidth - (csList.length - 1) * 8) / csList.length;

    csList.forEach((cs, i) => {
      const cx = margin + i * (csColW + 8);
      doc.setFillColor(15, 23, 42);
      doc.roundedRect(cx, y, csColW, 58, 3, 3, 'F');
      doc.setDrawColor(30, 41, 59);
      doc.roundedRect(cx, y, csColW, 58, 3, 3, 'S');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(255, 255, 255);
      doc.text(String(cs?.title || '').substring(0, 26), cx + 8, y + 13);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6);
      doc.setTextColor(96, 165, 250);
      doc.text(`Category: ${String(cs?.category || 'Enterprise Solution')}`, cx + 8, y + 23);

      doc.setFontSize(6);
      doc.setTextColor(52, 211, 153);
      doc.setFont('helvetica', 'bold');
      doc.text('Impact & Solution:', cx + 8, y + 33);

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(203, 213, 225);
      const splitSol = doc.splitTextToSize(String(cs?.solution || ''), csColW - 16);
      doc.text(splitSol.slice(0, 3), cx + 8, y + 42);
    });

    y += 68;
  }

  // Section 5: Enterprise Guarantees
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(56, 189, 248);
  doc.text('CONTRACTUAL ENTERPRISE COMMITMENTS & GUARANTEES', margin, y);

  y += 8;

  const rawGuarantees = Array.isArray(data.guarantees) ? data.guarantees : [];
  const guarantees = rawGuarantees.slice(0, 4);
  const gColW = (contentWidth - 18) / 4;

  guarantees.forEach((g, i) => {
    const gx = margin + i * (gColW + 6);
    doc.setFillColor(15, 23, 42);
    doc.roundedRect(gx, y, gColW, 46, 3, 3, 'F');
    doc.setDrawColor(30, 41, 59);
    doc.roundedRect(gx, y, gColW, 46, 3, 3, 'S');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    doc.setTextColor(52, 211, 153);
    doc.text(`✓ ${String(g?.name || '')}`, gx + 6, y + 12);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(5.5);
    doc.setTextColor(148, 163, 184);
    const splitDetail = doc.splitTextToSize(String(g?.detail || ''), gColW - 12);
    doc.text(splitDetail.slice(0, 4), gx + 6, y + 22);
  });

  y += 56;

  // Bottom Footer / Call to Action Box
  doc.setFillColor(23, 37, 84); // Navy
  doc.roundedRect(margin, y, contentWidth, 36, 4, 4, 'F');
  doc.setDrawColor(59, 130, 246);
  doc.roundedRect(margin, y, contentWidth, 36, 4, 4, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(255, 255, 255);
  doc.text('Ready to partner with SaroHub Technologies?', margin + 12, y + 14);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(191, 219, 254);
  doc.text('Book a confidential 30-min discovery session: sarohub.com/book', margin + 12, y + 25);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(52, 211, 153);
  doc.text(`WhatsApp: ${data.whatsapp || '+92 3430381473'}`, pageWidth - margin - 12, y + 14, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  doc.text(`Email: ${data.email || 'mehdi.sarohub@gmail.com'}`, pageWidth - margin - 12, y + 25, { align: 'right' });

  return doc;
}

/**
 * Universally downloads the Executive Deck PDF across all browsers,
 * including sandboxed iframes.
 */
export function downloadExecutiveDeck(data: DeckPdfData, filename = 'SaroHub-Executive-Capabilities-Deck.pdf'): boolean {
  try {
    const doc = generateExecutiveDeckPdf(data);
    
    // Create Blob
    const blob = doc.output('blob');
    const blobUrl = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = filename;
    a.target = '_self';
    a.rel = 'noopener';
    document.body.appendChild(a);
    a.click();

    setTimeout(() => {
      if (a.parentNode) {
        document.body.removeChild(a);
      }
      URL.revokeObjectURL(blobUrl);
    }, 2000);

    return true;
  } catch (err) {
    console.warn('Blob URL download failed, attempting jsPDF save():', err);
    try {
      const doc = generateExecutiveDeckPdf(data);
      doc.save(filename);
      return true;
    } catch (fallbackErr) {
      console.error('All PDF download methods failed:', fallbackErr);
      return false;
    }
  }
}

/**
 * Universally triggers printing of the Executive Deck.
 */
export function printExecutiveDeck(data: DeckPdfData): boolean {
  try {
    window.print();
    return true;
  } catch (e) {
    console.error('window.print() error:', e);
    return false;
  }
}
