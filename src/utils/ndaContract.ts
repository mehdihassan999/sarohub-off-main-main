import { jsPDF } from 'jspdf';

/**
 * SaroHub Technologies - Official Bilateral Non-Disclosure & IP Assignment Contract
 * Generated dynamically for enterprise client reviews, downloads, and legal preview.
 */

export const SAROHUB_LEGAL_INFO = {
  companyName: 'SaroHub Technologies (Private) Limited',
  registration: 'SECP Registered Software & Technology Studio',
  headquarters: 'Skardu, Gilgit-Baltistan, Pakistan',
  representative: 'Mehdi Hassan',
  title: 'Chief Executive Officer',
  email: 'info@sarohub.com',
  phone: '+92 343 0381473',
  website: 'https://sarohub.com',
  effectivePeriod: '3 (Three) Years from Initial Disclosure'
};

export interface NdaClause {
  id: string;
  clauseNumber: string;
  title: string;
  badge: string;
  summary: string;
  fullLegalText: string;
  keyPoints: string[];
}

export const NDA_CLAUSES: NdaClause[] = [
  {
    id: 'confidentiality',
    clauseNumber: 'CLAUSE 01',
    title: 'Mutual Confidentiality & Scope of Information',
    badge: 'Bilateral Protection',
    summary: 'Both parties agree to treat all business concepts, architectural designs, algorithms, customer data, and commercial discussions with absolute confidentiality.',
    fullLegalText: `1. DEFINITION OF CONFIDENTIAL INFORMATION:
"Confidential Information" refers to all proprietary, non-public, sensitive, or trade-secret information disclosed by either Party ("Disclosing Party") to the other Party ("Receiving Party"), whether orally, visually, in electronic format, or written form. 

This includes, without limitation:
(a) Software codebases, Git repositories, API schemas, backend architectures, system designs, machine learning models, database definitions, and algorithmic workflows.
(b) Product roadmaps, wireframes, user personas, UX/UI assets, and functional specifications.
(c) Financial models, pricing structures, investor presentations, strategic milestones, customer lists, and marketing strategies.
(d) Any third-party proprietary data provided in trust to either Party.

2. OBLIGATIONS OF RECEIVING PARTY:
The Receiving Party shall exercise at least the same degree of care (and in no event less than a commercially reasonable degree of care) to prevent unauthorized disclosure, publication, or dissemination of Confidential Information as it uses to protect its own proprietary material of like nature. Access shall be strictly limited to employees, certified contractors, and legal advisors who have a verifiable need-to-know and are bound by confidentiality covenants no less stringent than this Agreement.`,
    keyPoints: [
      'Covers all code, architecture, algorithms, and business logic',
      'Requires strict need-to-know access controls',
      'Equal bilateral protection for both SaroHub and the Client'
    ]
  },
  {
    id: 'ip-ownership',
    clauseNumber: 'CLAUSE 02',
    title: '100% Intellectual Property & Deliverables Ownership',
    badge: 'Zero Vendor Lock-in',
    summary: 'Upon agreed milestone delivery or sprint completion, all custom source code, assets, schemas, and configurations belong exclusively and unconditionally to the Client.',
    fullLegalText: `3. INTELLECTUAL PROPERTY & PROPRIETARY RIGHTS:
(a) CLIENT WORK-PRODUCT OWNERSHIP: All bespoke software code, scripts, database schemas, digital architectures, user interface assets, domain configurations, documentation, and technical deliverables authored, invented, or engineered by SaroHub specifically for the Client under any engagement statement of work shall become the exclusive intellectual property of the Client upon settlement of corresponding agreed milestone or sprint compensation.
(b) ASSIGNMENT OF RIGHTS: SaroHub hereby irrevocably assigns, transfers, and conveys to Client all worldwide right, title, and interest in and to such custom deliverables, including all patents, copyrights, trade secrets, and moral rights therein.
(c) ZERO VENDOR LOCK-IN: SaroHub shall maintain zero proprietary lock-in. Client retains unfettered liberty to host, modify, refactor, license, audit, or migrate the software to any third-party engineering team or cloud provider without restriction or additional licensing royalty obligations.
(d) SAROHUB CORE TOOLS: SaroHub retains ownership of generic, pre-existing libraries, foundational boilerplate code, and general-purpose development utilities used across engagements ("Background IP"), granting Client a perpetual, royalty-free, non-exclusive license to utilize such Background IP as integrated into the final deliverable.`,
    keyPoints: [
      '100% Client ownership of custom source code and assets',
      'Complete worldwide assignment of copyright & trade secrets',
      'Zero vendor lock-in; freedom to migrate or self-host anytime'
    ]
  },
  {
    id: 'repository-escrow',
    clauseNumber: 'CLAUSE 03',
    title: 'Continuous Git Repository Delivery & Code Escrow',
    badge: 'Live Code Access',
    summary: 'All source code is committed directly and continuously to Client-owned GitHub, GitLab, or Bitbucket repositories with full transparency.',
    fullLegalText: `4. CONTINUOUS DELIVERY & CODE ESCROW:
(a) DIRECT REPOSITORY HOSTING: Development commits and automated build pipelines shall be maintained within Client-designated Git repositories (e.g., GitHub, GitLab, Bitbucket, or private AWS CodeCommit/Azure DevOps accounts) with full administrative visibility granted to the Client.
(b) VERIFIABLE AUDIT TRAIL: Every sprint deliverable includes comprehensive commit logs, pull request documentation, architectural rationale, and reproducible build scripts.
(c) CREDENTIAL INDEPENDENCE: All production API credentials, cloud environment keys (AWS/GCP/Azure/Cloudflare), and database connection strings shall reside under the direct ownership of Client accounts, with zero intermediary hostage holds.`,
    keyPoints: [
      'Direct commits to your own GitHub/GitLab organizations',
      'Full commit history, PR audits, and deploy scripts included',
      'All production secrets and cloud accounts remain under your control'
    ]
  },
  {
    id: 'non-circumvention',
    clauseNumber: 'CLAUSE 04',
    title: 'Non-Circumvention & Anti-Reverse Engineering',
    badge: 'Competitive Shield',
    summary: 'Neither party shall decompile, reverse-engineer, or use disclosed confidential assets to create competing commercial offerings.',
    fullLegalText: `5. NON-CIRCUMVENTION & PROTECTION AGAINST REVERSE ENGINEERING:
(a) Receiving Party shall not reverse engineer, decompile, disassemble, or derive algorithmic trade secrets from Disclosing Party's proprietary architectures or confidential prototypes.
(b) Receiving Party shall not exploit the Disclosing Party's Confidential Information to launch, sponsor, or facilitate a directly competing commercial service targeting the specific niche and proprietary disclosures shared under this relationship.
(c) Neither Party shall solicit, entice, or recruit technical personnel or core contributors of the other Party during the term of engagement and for twelve (12) months following project completion without written mutual consent.`,
    keyPoints: [
      'Strict prohibition of decompilation or reverse engineering',
      'Protection against competitive duplication of proprietary ideas',
      'Mutual team non-solicitation protections'
    ]
  },
  {
    id: 'duration-governance',
    clauseNumber: 'CLAUSE 05',
    title: 'Term, Duration & Enforceability',
    badge: '3-Year Term',
    summary: 'This covenant is legally binding for 3 years from the date of disclosure and governed by international commercial standards.',
    fullLegalText: `6. DURATION & RETURN OF INFORMATION:
(a) This Agreement shall become effective immediately upon execution or preliminary technical disclosure and shall remain enforceable for a period of three (3) years.
(b) Upon written request from Disclosing Party or termination of exploratory discussions, Receiving Party shall promptly delete, destroy, or return all physical and electronic Confidential Information, providing written certification of compliance upon request (excluding automated off-site archival backups maintained under standard security cycles).

7. GOVERNING LAW & DISPUTE RESOLUTION:
This Agreement shall be governed by, construed, and enforced in accordance with the laws of international commercial arbitration and the jurisdiction of competent courts in Gilgit-Baltistan and federal commercial tribunals of Pakistan, or alternatively through mutual expedited arbitration under UNCITRAL Commercial Rules.`,
    keyPoints: [
      'Active for 3 full years from the initial disclosure date',
      'Immediate certified data destruction or return upon request',
      'International commercial arbitration and enforceable covenants'
    ]
  }
];

export const getFullNdaAgreementText = (): string => {
  return `================================================================================
BILATERAL NON-DISCLOSURE AND INTELLECTUAL PROPERTY RIGHTS AGREEMENT
Official SaroHub Technologies Enterprise Legal Covenant
================================================================================

PARTIES TO THIS AGREEMENT:
1. SaroHub Technologies (Private) Limited, a high-growth software engineering, 
   cloud architecture, and venture studio registered under the Securities and 
   Exchange Commission of Pakistan, headquartered in Skardu, Gilgit-Baltistan, 
   Pakistan ("SaroHub").
2. The Client, Technology Partner, or Sponsoring Organization identified in the 
   engagement statement of work or exploratory communication ("Client").

RECITALS:
WHEREAS, SaroHub and Client (collectively, the "Parties" and individually, a "Party") 
desire to explore, evaluate, and collaborate on software engineering, custom 
product development, system modernization, and technical advisory ("The Purpose");

WHEREAS, during the course of the engagement, either Party may disclose to the 
other Party certain highly confidential business logic, proprietary architecture, 
source code, technical specifications, and trade secrets;

NOW, THEREFORE, in consideration of the mutual covenants contained herein, 
the Parties agree as follows:

--------------------------------------------------------------------------------
1. DEFINITION OF CONFIDENTIAL INFORMATION
--------------------------------------------------------------------------------
"Confidential Information" encompasses all proprietary, non-public, sensitive, or 
trade-secret technical and business data disclosed by either Party, including but 
not limited to:
- Source code, software architectures, algorithms, data schemas, machine learning 
  models, API interfaces, and deployment configurations.
- Product wireframes, design prototypes, functional specs, and roadmap milestones.
- Financial metrics, commercial rates, business strategies, and customer datasets.

--------------------------------------------------------------------------------
2. EXCLUSIONS FROM CONFIDENTIALITY
--------------------------------------------------------------------------------
Confidential Information does not include information that:
(a) is or becomes publicly known through no breach of this Agreement by Recipient;
(b) was already in Recipient's possession prior to disclosure without restriction;
(c) is independently developed by Recipient without reference to Disclosing Party's data;
(d) is required to be disclosed pursuant to a lawful court order or regulatory directive, 
    provided prompt prior written notice is given to Disclosing Party.

--------------------------------------------------------------------------------
3. 100% INTELLECTUAL PROPERTY & PROPRIETARY RIGHTS OWNERSHIP
--------------------------------------------------------------------------------
(a) CLIENT OWNERSHIP: All custom software, application code, database designs, 
    user interfaces, cloud infrastructure scripts, and deliverables authored or 
    developed by SaroHub specifically for the Client shall be 100% owned exclusively 
    by the Client upon settlement of corresponding agreed milestone compensation.
(b) ASSIGNMENT: SaroHub hereby assigns to Client all worldwide copyright, patent, 
    and intellectual property rights associated with bespoke deliverables.
(c) ZERO VENDOR LOCK-IN: Client retains unrestricted liberty to self-host, audit, 
    modify, or transfer codebase maintenance to internal staff or third-party vendors.
(d) CODE ESCROW & GIT REPOSITORIES: Commits are delivered directly to Client-owned 
    GitHub, GitLab, or Bitbucket organizations with complete history and deploy pipelines.

--------------------------------------------------------------------------------
4. NON-CIRCUMVENTION & COMPETITIVE RESTRICTIONS
--------------------------------------------------------------------------------
Neither Party shall reverse engineer, decompile, or utilize Confidential Information 
to replicate proprietary commercial systems or solicit the other Party's engineering 
talent without express written consent.

--------------------------------------------------------------------------------
5. TERM & ENFORCEABILITY
--------------------------------------------------------------------------------
This Agreement remains binding for three (3) years from the date of disclosure. 
Governed by international commercial arbitration principles and applicable corporate 
laws.

--------------------------------------------------------------------------------
EXECUTED AND DELIVERED:
--------------------------------------------------------------------------------
For SaroHub Technologies (Private) Limited:
Name: Mehdi Hassan
Title: Chief Executive Officer
Address: Skardu, Gilgit-Baltistan, Pakistan
Email: info@sarohub.com | Direct: +92 343 0381473
Website: https://sarohub.com

For Client Organization:
Name: _____________________________________________
Title: ____________________________________________
Organization: _____________________________________
Date: _____________________________________________
Signature: ________________________________________

================================================================================
Document Fingerprint: SAROHUB-LEGAL-NDA-V2026-CONFIDENTIAL
================================================================================`;
};

export const getFullNdaAgreementMarkdown = (): string => {
  return `# BILATERAL NON-DISCLOSURE AND IP RIGHTS AGREEMENT

**Official SaroHub Technologies Enterprise Legal Covenant**

---

### PARTIES:
1. **SaroHub Technologies (Private) Limited**, Skardu, Gilgit-Baltistan, Pakistan (*"SaroHub"*).
2. **The Client / Recipient Organization** identified in schedule (*"Client"*).

---

## 1. Mutual Confidentiality
All technical blueprints, algorithms, wireframes, source code, data schemas, and commercial strategies shared between the Parties shall be held in strictest confidence with enterprise-grade access controls.

## 2. 100% Intellectual Property Assignment
Upon payment for agreed milestones or sprints:
- **100% Ownership:** All bespoke source code, architectures, and assets belong exclusively to the Client.
- **Zero Lock-in:** Client has complete freedom to export, modify, or host anywhere.
- **Direct Repositories:** Code is delivered continuously to Client-owned GitHub/GitLab organizations.

## 3. Non-Circumvention
Neither Party shall decompile, reverse-engineer, or commercially exploit confidential disclosures for competitive replication.

## 4. Term & Duration
Enforceable for **3 years** from the initial disclosure date under international commercial standards.

---

### EXECUTION BLOCK:

**For SaroHub Technologies (Private) Limited:**  
*Mehdi Hassan*, Chief Executive Officer  
Email: info@sarohub.com | Direct: +92 343 0381473  
Headquarters: Skardu, Gilgit-Baltistan, Pakistan  

**For Client Organization:**  
Authorized Signature: ______________________________________  
Signatory Name & Title: ____________________________________  
Date of Execution: _________________________________________  
`;
};

/**
 * Generates and downloads an executive, vector-based PDF of the Bilateral NDA Agreement.
 * Uses jsPDF with professional corporate typography, multi-page flow, and signature boxes.
 */
export const downloadNdaPdf = (): boolean => {
  try {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'pt',
      format: 'a4'
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 40;
    const contentWidth = pageWidth - margin * 2;
    const footerHeight = 35;

    let currentY = margin;

    const checkPageBreak = (neededHeight: number) => {
      if (currentY + neededHeight > pageHeight - margin - footerHeight) {
        doc.addPage();
        currentY = margin + 25;
        drawHeader();
      }
    };

    const drawHeader = () => {
      // Thin top rule
      doc.setDrawColor(2, 132, 199); // Cyan-600
      doc.setLineWidth(1.5);
      doc.line(margin, 25, pageWidth - margin, 25);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(100, 116, 139); // Slate-500
      doc.text('SAROHUB TECHNOLOGIES (PRIVATE) LIMITED • OFFICIAL LEGAL COVENANT', margin, 20);
      doc.text('CONFIDENTIAL • BILATERAL NDA', pageWidth - margin, 20, { align: 'right' });
    };

    // PAGE 1 HEADER
    drawHeader();
    currentY = 45;

    // Top Accent Bar
    doc.setFillColor(30, 58, 138); // Deep Blue
    doc.rect(margin, currentY, contentWidth * 0.65, 4, 'F');
    doc.setFillColor(6, 182, 212); // Cyan
    doc.rect(margin + contentWidth * 0.65, currentY, contentWidth * 0.35, 4, 'F');
    currentY += 16;

    // Document Title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(15);
    doc.setTextColor(15, 23, 42); // Slate-900
    doc.text('BILATERAL NON-DISCLOSURE AND INTELLECTUAL', margin, currentY);
    currentY += 16;
    doc.text('PROPERTY RIGHTS AGREEMENT', margin, currentY);
    currentY += 14;

    // Subtitle / Document Metadata
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(71, 85, 105);
    doc.text('SECP Registered Entity • 100% Client Codebase & IP Transfer Guarantee', margin, currentY);
    doc.text('Doc Ref: SH-NDA-2026-B1', pageWidth - margin, currentY, { align: 'right' });
    currentY += 14;

    // Parties Box
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(1);
    doc.roundedRect(margin, currentY, contentWidth, 76, 4, 4, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(30, 58, 138);
    doc.text('PARTIES TO THIS BILATERAL COVENANT:', margin + 10, currentY + 14);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.8);
    doc.setTextColor(51, 65, 85);
    doc.text('1. SaroHub Technologies (Private) Limited, registered under the SECP of Pakistan, headquartered in', margin + 10, currentY + 28);
    doc.text('   Skardu, Gilgit-Baltistan, Pakistan ("SaroHub"). Contact: info@sarohub.com | +92 343 0381473.', margin + 10, currentY + 40);
    doc.text('2. The Client / Recipient Enterprise Partner identified in the active Statement of Work or schedule ("Client").', margin + 10, currentY + 54);
    doc.text('   WHEREAS both Parties intend to collaborate on software engineering, cloud systems, and technical advisory.', margin + 10, currentY + 68);

    currentY += 92;

    // Iterate Clauses
    NDA_CLAUSES.forEach((clause) => {
      checkPageBreak(80);

      // Clause Title Header
      doc.setFillColor(241, 245, 249);
      doc.roundedRect(margin, currentY, contentWidth, 20, 3, 3, 'F');
      
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(30, 58, 138);
      doc.text(`${clause.clauseNumber} — ${clause.title.toUpperCase()}`, margin + 8, currentY + 13);

      doc.setFontSize(7.5);
      doc.setTextColor(14, 116, 144);
      doc.text(`[${clause.badge}]`, pageWidth - margin - 8, currentY + 13, { align: 'right' });

      currentY += 26;

      // Summary
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(8);
      doc.setTextColor(71, 85, 105);
      const splitSummary = doc.splitTextToSize(clause.summary, contentWidth - 10);
      checkPageBreak(splitSummary.length * 10);
      doc.text(splitSummary, margin + 5, currentY);
      currentY += splitSummary.length * 10 + 6;

      // Full Legal Text
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(30, 41, 59);

      const splitLegal = doc.splitTextToSize(clause.fullLegalText, contentWidth - 10);
      for (let i = 0; i < splitLegal.length; i++) {
        checkPageBreak(11);
        doc.text(splitLegal[i], margin + 5, currentY);
        currentY += 10;
      }

      currentY += 10;
    });

    // SIGNATURE / EXECUTION BLOCK
    checkPageBreak(130);

    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(203, 213, 225);
    doc.roundedRect(margin, currentY, contentWidth, 120, 4, 4, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(15, 23, 42);
    doc.text('IN WITNESS WHEREOF, THE PARTIES HERETO EXECUTE THIS AGREEMENT:', margin + 10, currentY + 16);

    const colWidth = (contentWidth - 30) / 2;
    const col1X = margin + 10;
    const col2X = margin + 20 + colWidth;

    // Column 1: SaroHub
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(30, 58, 138);
    doc.text('FOR SAROHUB TECHNOLOGIES (PVT) LTD:', col1X, currentY + 34);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(51, 65, 85);
    doc.text('Authorized Signatory: Mehdi Hassan', col1X, currentY + 48);
    doc.text('Title: Chief Executive Officer', col1X, currentY + 60);
    doc.text('HQ: Skardu, Gilgit-Baltistan, Pakistan', col1X, currentY + 72);
    doc.text('Corporate Seal: SECP Registered Entity', col1X, currentY + 84);

    doc.setDrawColor(148, 163, 184);
    doc.line(col1X, currentY + 102, col1X + colWidth - 15, currentY + 102);
    doc.setFontSize(7);
    doc.setTextColor(100, 116, 139);
    doc.text('Authorized Signature & Corporate Seal', col1X, currentY + 112);

    // Column 2: Client
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(30, 58, 138);
    doc.text('FOR CLIENT / RECIPIENT ORGANIZATION:', col2X, currentY + 34);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(51, 65, 85);
    doc.text('Authorized Representative: _______________________', col2X, currentY + 48);
    doc.text('Title / Designation: ____________________________', col2X, currentY + 60);
    doc.text('Organization Name: ____________________________', col2X, currentY + 72);
    doc.text('Execution Date: ________________________________', col2X, currentY + 84);

    doc.line(col2X, currentY + 102, col2X + colWidth - 15, currentY + 102);
    doc.setFontSize(7);
    doc.setTextColor(100, 116, 139);
    doc.text('Client Authorized Signature', col2X, currentY + 112);

    // DRAW FOOTERS ON ALL PAGES
    const totalPages = doc.getNumberOfPages();
    for (let p = 1; p <= totalPages; p++) {
      doc.setPage(p);
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.8);
      doc.line(margin, pageHeight - 25, pageWidth - margin, pageHeight - 25);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(148, 163, 184);
      doc.text(
        'SaroHub Technologies (Private) Limited • SECP Registered • info@sarohub.com • +92 343 0381473',
        margin,
        pageHeight - 14
      );
      doc.text(`Page ${p} of ${totalPages}`, pageWidth - margin, pageHeight - 14, { align: 'right' });
    }

    // Save and download PDF
    doc.save('SaroHub_Bilateral_NDA_Agreement.pdf');
    return true;
  } catch (err) {
    console.error('Failed to generate NDA PDF:', err);
    return false;
  }
};

/**
 * Generates and downloads a formatted Microsoft Word (.doc) document.
 * Fully compatible with Microsoft Word, Office 365, Google Docs, and Apple Pages.
 */
export const downloadNdaWord = (): boolean => {
  try {
    const wordHtml = `
<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
  <meta charset='utf-8'>
  <title>SaroHub Bilateral Non-Disclosure Agreement</title>
  <!--[if gte mso 9]>
  <xml>
    <w:WordDocument>
      <w:View>Print</w:View>
      <w:Zoom>100</w:Zoom>
      <w:DoNotOptimizeForBrowser/>
    </w:WordDocument>
  </xml>
  <![endif]-->
  <style>
    @page Section1 {
      size: 8.5in 11.0in;
      margin: 1.0in 1.0in 1.0in 1.0in;
      mso-header-margin: 0.5in;
      mso-footer-margin: 0.5in;
    }
    div.Section1 { page: Section1; }
    body {
      font-family: 'Calibri', 'Segoe UI', Arial, sans-serif;
      font-size: 11pt;
      line-height: 1.45;
      color: #0F172A;
    }
    .header-bar {
      border-bottom: 2px solid #0284C7;
      padding-bottom: 6pt;
      margin-bottom: 14pt;
    }
    .company-title {
      font-size: 9pt;
      font-weight: bold;
      color: #0284C7;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    h1 {
      font-family: 'Calibri', 'Segoe UI', Arial, sans-serif;
      font-size: 18pt;
      font-weight: bold;
      color: #1E3A8A;
      margin: 6pt 0 4pt 0;
      line-height: 1.2;
    }
    .meta-subtitle {
      font-size: 10pt;
      color: #475569;
      margin-bottom: 14pt;
    }
    .parties-table {
      width: 100%;
      background-color: #F8FAFC;
      border: 1px solid #CBD5E1;
      padding: 10pt;
      margin-bottom: 18pt;
    }
    .clause-header {
      font-size: 12pt;
      font-weight: bold;
      color: #1E3A8A;
      background-color: #F1F5F9;
      padding: 6pt 8pt;
      margin-top: 14pt;
      margin-bottom: 6pt;
      border-left: 4px solid #0284C7;
    }
    .clause-badge {
      font-size: 9pt;
      color: #0E7490;
      font-weight: bold;
      text-transform: uppercase;
    }
    .clause-summary {
      font-size: 10pt;
      font-style: italic;
      color: #475569;
      margin-bottom: 6pt;
    }
    .legal-text {
      font-size: 10pt;
      color: #1E293B;
      line-height: 1.5;
      margin-bottom: 10pt;
      white-space: pre-wrap;
    }
    .signature-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 24pt;
      border: 1px solid #CBD5E1;
      background-color: #F8FAFC;
    }
    .signature-cell {
      width: 50%;
      vertical-align: top;
      padding: 14pt;
      border-right: 1px solid #CBD5E1;
    }
    .signature-cell:last-child {
      border-right: none;
    }
    .sign-line {
      border-bottom: 1px solid #64748B;
      margin-top: 30pt;
      margin-bottom: 4pt;
    }
  </style>
</head>
<body>
  <div class="Section1">
    <div class="header-bar">
      <div class="company-title">SAROHUB TECHNOLOGIES (PRIVATE) LIMITED • LEGAL DIVISION</div>
      <div style="font-size: 8pt; color: #64748B;">SECP Registered Software & Venture Studio • Doc Ref: SH-NDA-2026-B1</div>
    </div>

    <h1>BILATERAL NON-DISCLOSURE AND INTELLECTUAL PROPERTY RIGHTS AGREEMENT</h1>
    <div class="meta-subtitle">Official Corporate Covenant • 100% Client Codebase & Deliverables Ownership Guarantee</div>

    <table class="parties-table">
      <tr>
        <td>
          <strong style="color: #1E3A8A; font-size: 10pt;">PARTIES TO THIS COVENANT:</strong><br/><br/>
          <strong>1. SaroHub Technologies (Private) Limited</strong>, registered under the SECP of Pakistan, headquartered in Skardu, Gilgit-Baltistan, Pakistan ("SaroHub"). Leadership: Mehdi Hassan (CEO) | Email: info@sarohub.com | Direct: +92 343 0381473.<br/><br/>
          <strong>2. The Client / Recipient Enterprise Partner</strong> identified in the active Statement of Work or project schedule ("Client").<br/><br/>
          <em>WHEREAS both Parties intend to enter discussions and collaboration regarding proprietary software engineering, cloud architecture, AI systems, and technical consulting.</em>
        </td>
      </tr>
    </table>

    ${NDA_CLAUSES.map(clause => `
      <div class="clause-header">
        ${clause.clauseNumber}: ${clause.title.toUpperCase()}
        <span class="clause-badge">(${clause.badge})</span>
      </div>
      <div class="clause-summary">${clause.summary}</div>
      <div class="legal-text">${clause.fullLegalText.replace(/\n/g, '<br/>')}</div>
    `).join('')}

    <table class="signature-table">
      <tr>
        <td class="signature-cell">
          <strong style="color: #1E3A8A;">FOR SAROHUB TECHNOLOGIES (PVT) LTD:</strong><br/><br/>
          <strong>Authorized Officer:</strong> Mehdi Hassan<br/>
          <strong>Designation:</strong> Chief Executive Officer<br/>
          <strong>Corporate Entity:</strong> SaroHub Technologies (Pvt) Ltd<br/>
          <strong>Headquarters:</strong> Skardu, Gilgit-Baltistan, Pakistan<br/>
          <strong>SECP Registration:</strong> Verified Corporate Body<br/>
          <div class="sign-line"></div>
          <span style="font-size: 8pt; color: #64748B;">Executive Signature & Official Corporate Seal</span>
        </td>
        <td class="signature-cell">
          <strong style="color: #1E3A8A;">FOR CLIENT / RECIPIENT ORGANIZATION:</strong><br/><br/>
          <strong>Authorized Signatory:</strong> ____________________________<br/>
          <strong>Designation / Title:</strong> ____________________________<br/>
          <strong>Organization Name:</strong> ____________________________<br/>
          <strong>Execution Date:</strong> ____________________________<br/>
          <strong>Jurisdiction:</strong> ____________________________<br/>
          <div class="sign-line"></div>
          <span style="font-size: 8pt; color: #64748B;">Client Authorized Officer Signature</span>
        </td>
      </tr>
    </table>

    <div style="margin-top: 20pt; font-size: 8pt; color: #94A3B8; text-align: center; border-top: 1px solid #E2E8F0; padding-top: 8pt;">
      SaroHub Technologies (Private) Limited • SECP Registered Entity • Skardu, Gilgit-Baltistan, Pakistan • info@sarohub.com
    </div>
  </div>
</body>
</html>
    `;

    const blob = new Blob(['\ufeff', wordHtml], { type: 'application/msword;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.style.display = 'none';
    link.href = url;
    link.download = 'SaroHub_Bilateral_NDA_Agreement.doc';
    document.body.appendChild(link);
    link.click();

    setTimeout(() => {
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    }, 200);

    return true;
  } catch (err) {
    console.error('Failed to generate NDA Word document:', err);
    return false;
  }
};

/**
 * Universal safe downloader supporting PDF, Word (.doc), Plain Text (.txt), and Markdown (.md).
 * Defaults to 'pdf' as requested for formal corporate presentation.
 */
export const downloadNdaFile = (format: 'pdf' | 'doc' | 'txt' | 'md' = 'pdf'): boolean => {
  if (format === 'pdf') {
    return downloadNdaPdf();
  }

  if (format === 'doc') {
    return downloadNdaWord();
  }

  try {
    const content = format === 'md' ? getFullNdaAgreementMarkdown() : getFullNdaAgreementText();
    const mimeType = format === 'md' ? 'text/markdown;charset=utf-8' : 'text/plain;charset=utf-8';
    const filename = `SaroHub_Bilateral_NDA_Agreement.${format}`;

    const blob = new Blob([content], { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.style.display = 'none';
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();

    setTimeout(() => {
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    }, 200);

    return true;
  } catch (err) {
    console.error('Failed to trigger NDA file download:', err);
    return false;
  }
};
