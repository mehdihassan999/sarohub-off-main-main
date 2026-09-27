import React, { useState, useEffect } from 'react';
import { X, Printer, Download, Eye, Sparkles, Check, DollarSign, Calendar, CreditCard, User, Building, Clock } from 'lucide-react';
import { OpportunityApplication } from '../../types';

interface RegistrationSlipModalProps {
  isOpen: boolean;
  onClose: () => void;
  applications: OpportunityApplication[];
  onNotify?: (title: string, message: string) => void;
}

export interface SlipData {
  companyName: string;
  companyCity: string;
  programName: string;
  feeDescription: string;
  amount: string;
  programDuration: string;
  easypaisaNumber: string;
  accountTitle: string;
  officeHours: string;
  monthText: string;
  dueDate: string;
  copyMode: 'both' | 'student' | 'office';
  portalUrl: string;
  notes: string;
}

export const RegistrationSlipModal: React.FC<RegistrationSlipModalProps> = ({
  isOpen,
  onClose,
  applications,
  onNotify,
}) => {
  if (!isOpen || applications.length === 0) return null;

  // Single vs bulk handling
  const isSingle = applications.length === 1;
  const targetApp = applications[0];

  // Helper to calculate default due date (~7 days ahead formatted like 2026-august-11)
  const getDefaultDueDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    const year = d.getFullYear();
    const month = d.toLocaleString('en-US', { month: 'long' }).toLowerCase();
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Helper to extract default month string like "August/sept/oct"
  const getDefaultMonthText = () => {
    const d = new Date();
    const m1 = d.toLocaleString('en-US', { month: 'long' });
    const d2 = new Date(d.getFullYear(), d.getMonth() + 1, 1);
    const m2 = d2.toLocaleString('en-US', { month: 'short' }).toLowerCase();
    const d3 = new Date(d.getFullYear(), d.getMonth() + 2, 1);
    const m3 = d3.toLocaleString('en-US', { month: 'short' }).toLowerCase();
    return `${m1}/${m2}/${m3}`;
  };

  // Extract father/guardian name from form_data if available
  const getFatherName = (app: OpportunityApplication) => {
    if (!app.form_data) return '';
    const keys = Object.keys(app.form_data);
    const fatherKey = keys.find(k => /father|guardian|parent/i.test(k));
    return fatherKey ? String(app.form_data[fatherKey]) : '';
  };

  // Form State
  const [companyName, setCompanyName] = useState('SAROHUB TECHNOLOGIES PRIVATE LIMITED');
  const [companyCity, setCompanyCity] = useState('SKARDU');
  const [programName, setProgramName] = useState(isSingle ? targetApp.opportunity_title : 'IT & Software Development Program');
  const [feeDescription, setFeeDescription] = useState('IT Maintenance charges');
  const [amount, setAmount] = useState('2400');
  const [programDuration, setProgramDuration] = useState('IT maintenance and the entire 3-months program');
  const [easypaisaNumber, setEasypaisaNumber] = useState('03445312774');
  const [accountTitle, setAccountTitle] = useState('Muhammad kazim');
  const [officeHours, setOfficeHours] = useState('3:00 PM – 7:00 PM');
  const [monthText, setMonthText] = useState(getDefaultMonthText());
  const [dueDate, setDueDate] = useState(getDefaultDueDate());
  const [copyMode, setCopyMode] = useState<'both' | 'student' | 'office'>('both');
  const [portalUrl, setPortalUrl] = useState('portal.alin316.com');

  // Single student editable overrides if single
  const [studentName, setStudentName] = useState(isSingle ? targetApp.applicant_name : '');
  const [fatherName, setFatherName] = useState(isSingle ? getFatherName(targetApp) : '');

  // Active preview tab for modal
  const [previewTab, setPreviewTab] = useState<'student' | 'office'>('student');

  useEffect(() => {
    if (isSingle) {
      setProgramName(targetApp.opportunity_title || 'IT Program');
      setStudentName(targetApp.applicant_name || '');
      setFatherName(getFatherName(targetApp));
    }
  }, [applications]);

  // Generate printable HTML string for a single student copy or office copy
  const renderSlipHTML = (app: OpportunityApplication, copyLabel: 'STUDENTS COPY' | 'OFFICE COPY', overrideStudentName?: string, overrideFatherName?: string) => {
    const sName = overrideStudentName !== undefined ? overrideStudentName : app.applicant_name;
    const fName = overrideFatherName !== undefined ? overrideFatherName : getFatherName(app);

    return `
      <div class="slip-card">
        <div class="slip-badge">${copyLabel}</div>
        
        <div class="slip-header">
          <div class="company-title">${companyName}</div>
          <div class="company-city">${companyCity}</div>
        </div>

        <p class="notice-paragraph">
          The registration fee for <strong>${programDuration}</strong>. Please send the payment before the due date using Easy paisa. (<strong>${easypaisaNumber}</strong>) Acount Title <strong>${accountTitle}</strong>. After sending kindly share a screenshot of the transaction on this number for confirmation. Second option submit the registration fee at the office between <strong>${officeHours}</strong>.
          <span class="note-line">Note: This fee is not refundable.</span>
        </p>

        <hr class="divider-line" />

        <div class="student-meta-block">
          <div class="meta-row">
            <span class="meta-item"><strong>Student:</strong> <span class="underlined">${sName || '________________________'}</span></span>
            <span class="meta-item"><strong>S/O, D/O</strong> <span class="underlined">${fName || '________________________'}</span></span>
          </div>
          <div class="meta-row">
            <strong>Due Date:</strong> ${dueDate}
          </div>
          <div class="meta-row">
            <strong>Program:</strong> ${programName}
          </div>
          <div class="meta-row">
            <strong>Month:</strong> ${monthText}
          </div>
        </div>

        <table class="fee-table">
          <thead>
            <tr>
              <th class="th-desc">DESCRIPTION</th>
              <th class="th-amt">AMOUNT (PKR)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="td-desc">${feeDescription}</td>
              <td class="td-amt">Rs. ${amount}</td>
            </tr>
          </tbody>
        </table>

        <div class="signature-block">
          <div class="signature-line"></div>
          <div class="signature-title">Accounts Officer</div>
        </div>

        <div class="slip-footer">
          <span class="footer-note">Note: Please pay before due date. This voucher is valid for one month only. Late payment will incur additional charges.</span>
          <span class="footer-domain">${portalUrl}</span>
        </div>
      </div>
    `;
  };

  const handlePrint = () => {
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document || iframe.contentDocument;
    if (!doc) {
      window.print();
      return;
    }

    let allSlipsHtml = '';

    applications.forEach((app, idx) => {
      const sName = isSingle ? studentName : app.applicant_name;
      const fName = isSingle ? fatherName : getFatherName(app);

      let studentSlip = renderSlipHTML(app, 'STUDENTS COPY', sName, fName);
      let officeSlip = renderSlipHTML(app, 'OFFICE COPY', sName, fName);

      if (copyMode === 'both') {
        allSlipsHtml += `
          <div class="page-container">
            ${studentSlip}
            <div class="cut-line">--------------------------------- Cut Here ---------------------------------</div>
            ${officeSlip}
          </div>
        `;
      } else if (copyMode === 'student') {
        allSlipsHtml += `
          <div class="page-container">
            ${studentSlip}
          </div>
        `;
      } else {
        allSlipsHtml += `
          <div class="page-container">
            ${officeSlip}
          </div>
        `;
      }

      if (idx < applications.length - 1) {
        allSlipsHtml += `<div style="page-break-after: always;"></div>`;
      }
    });

    const fullHtml = `
      <!doctype html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Student Registration Slips</title>
        <style>
          @page {
            size: A4 portrait;
            margin: 0.8cm;
          }
          * {
            box-sizing: border-box;
          }
          body {
            font-family: Arial, Helvetica, sans-serif;
            color: #111827;
            background: #ffffff;
            margin: 0;
            padding: 10px;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .page-container {
            width: 100%;
            max-width: 760px;
            margin: 0 auto;
          }
          .slip-card {
            border: 1px solid #d1d5db;
            padding: 18px 22px;
            position: relative;
            background: #ffffff;
            margin-bottom: 12px;
          }
          .slip-badge {
            background-color: #1f2937 !important;
            color: #ffffff !important;
            font-size: 11px;
            font-weight: bold;
            letter-spacing: 0.5px;
            padding: 4px 10px;
            display: inline-block;
            text-transform: uppercase;
            border-radius: 2px 0px 4px 0px;
            margin-bottom: 8px;
          }
          .slip-header {
            margin-bottom: 12px;
          }
          .company-title {
            font-size: 19px;
            font-weight: 800;
            color: #1f2937;
            text-transform: uppercase;
            letter-spacing: 0.2px;
            line-height: 1.2;
          }
          .company-city {
            font-size: 16px;
            font-weight: 800;
            color: #1f2937;
            text-transform: uppercase;
            margin-top: 2px;
          }
          .notice-paragraph {
            font-size: 13px;
            line-height: 1.45;
            color: #374151;
            margin: 10px 0;
          }
          .notice-paragraph strong {
            color: #111827;
          }
          .note-line {
            display: block;
            margin-top: 6px;
            font-size: 12.5px;
            color: #374151;
          }
          .divider-line {
            border: 0;
            border-top: 1.5px solid #1f2937;
            margin: 14px 0 12px 0;
          }
          .student-meta-block {
            font-size: 13.5px;
            color: #1f2937;
            margin-bottom: 18px;
          }
          .meta-row {
            margin-bottom: 5px;
            display: flex;
            gap: 24px;
            flex-wrap: wrap;
          }
          .meta-item {
            display: inline-flex;
            gap: 4px;
          }
          .underlined {
            border-bottom: 1px solid #1f2937;
            padding-bottom: 1px;
            min-width: 140px;
            display: inline-block;
          }
          .fee-table {
            width: 100%;
            border-collapse: collapse;
            margin: 18px 0;
          }
          .fee-table th, .fee-table td {
            border: 1px solid #6b7280;
            padding: 8px 12px;
            font-size: 13px;
          }
          .fee-table th {
            background-color: #374151 !important;
            color: #ffffff !important;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          .th-desc, .td-desc {
            text-align: left;
            width: 65%;
          }
          .th-amt, .td-amt {
            text-align: right;
            width: 35%;
            font-weight: bold;
          }
          .signature-block {
            margin-top: 25px;
            text-align: center;
          }
          .signature-line {
            width: 180px;
            margin: 0 auto 4px auto;
            border-bottom: 1px solid #374151;
          }
          .signature-title {
            font-size: 11px;
            font-weight: 600;
            color: #4b5563;
          }
          .slip-footer {
            margin-top: 14px;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            font-size: 9.5px;
            color: #6b7280;
            border-top: 1px dashed #e5e7eb;
            padding-top: 6px;
          }
          .footer-note {
            font-style: italic;
            max-width: 80%;
          }
          .footer-domain {
            font-size: 9px;
            color: #9ca3af;
          }
          .cut-line {
            text-align: center;
            font-size: 10px;
            color: #9ca3af;
            margin: 12px 0;
            letter-spacing: 1px;
          }
        </style>
      </head>
      <body>
        ${allSlipsHtml}
        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 300);
          }
        </script>
      </body>
      </html>
    `;

    doc.open();
    doc.write(fullHtml);
    doc.close();

    setTimeout(() => {
      if (document.body.contains(iframe)) {
        document.body.removeChild(iframe);
      }
    }, 4000);

    if (onNotify) {
      onNotify('Slips Ready', `Generated registration slip for ${applications.length} student(s).`);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Printer className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                Generate Student Registration Slip
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-amber-400 font-mono border border-slate-700">
                  {applications.length} {applications.length === 1 ? 'Student' : 'Students'}
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Customize payment, EasyPaisa instructions, and scholarship amount before printing.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Body: Left Form Inputs / Right Live Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 overflow-y-auto">
          
          {/* Left Form Controls (5 cols) */}
          <div className="lg:col-span-5 p-6 border-b lg:border-b-0 lg:border-r border-slate-800 space-y-4 overflow-y-auto bg-slate-900/50">
            
            {/* Header info */}
            <div className="space-y-3">
              <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Building className="h-3.5 w-3.5 text-cyan-400" /> Header & Organization
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1 font-mono">Company Title</label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1 font-mono">City / Location</label>
                  <input
                    type="text"
                    value={companyCity}
                    onChange={(e) => setCompanyCity(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Fee & Payment Settings */}
            <div className="space-y-3 pt-2 border-t border-slate-800/80">
              <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <DollarSign className="h-3.5 w-3.5 text-amber-400" /> Fee & Program Info
              </h3>
              
              <div>
                <label className="block text-[11px] text-slate-400 mb-1 font-mono">Scholarship / Program Name</label>
                <input
                  type="text"
                  value={programName}
                  onChange={(e) => setProgramName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1 font-mono">Fee Description</label>
                  <input
                    type="text"
                    value={feeDescription}
                    onChange={(e) => setFeeDescription(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1 font-mono">Amount (PKR)</label>
                  <input
                    type="text"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:border-amber-500 focus:outline-none font-bold text-amber-300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1 font-mono">Duration / Program Detail Notice</label>
                <input
                  type="text"
                  value={programDuration}
                  onChange={(e) => setProgramDuration(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:border-amber-500 focus:outline-none"
                />
              </div>
            </div>

            {/* EasyPaisa Payment Instructions */}
            <div className="space-y-3 pt-2 border-t border-slate-800/80">
              <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <CreditCard className="h-3.5 w-3.5 text-emerald-400" /> EasyPaisa Account Details
              </h3>
              
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1 font-mono">EasyPaisa Number</label>
                  <input
                    type="text"
                    value={easypaisaNumber}
                    onChange={(e) => setEasypaisaNumber(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:border-amber-500 focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1 font-mono">Account Title</label>
                  <input
                    type="text"
                    value={accountTitle}
                    onChange={(e) => setAccountTitle(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1 font-mono">Office Hours</label>
                  <input
                    type="text"
                    value={officeHours}
                    onChange={(e) => setOfficeHours(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1 font-mono">Month / Period</label>
                  <input
                    type="text"
                    value={monthText}
                    onChange={(e) => setMonthText(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1 font-mono">Due Date</label>
                <input
                  type="text"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:border-amber-500 focus:outline-none"
                  placeholder="e.g. 2026-august-11"
                />
              </div>
            </div>

            {/* Student Info override if single */}
            {isSingle && (
              <div className="space-y-3 pt-2 border-t border-slate-800/80">
                <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5 text-blue-400" /> Student Information
                </h3>
                
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1 font-mono">Student Name</label>
                    <input
                      type="text"
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1 font-mono">Father/Guardian Name (S/O, D/O)</label>
                    <input
                      type="text"
                      value={fatherName}
                      onChange={(e) => setFatherName(e.target.value)}
                      placeholder="Father Name"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Printing Copy Mode */}
            <div className="space-y-2 pt-2 border-t border-slate-800/80">
              <label className="block text-[11px] text-slate-400 font-mono">Print Copy Layout</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setCopyMode('both')}
                  className={`py-1.5 px-2 rounded-lg text-xs font-mono font-medium border transition-all ${
                    copyMode === 'both'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  Both (2 Copies)
                </button>
                <button
                  type="button"
                  onClick={() => setCopyMode('student')}
                  className={`py-1.5 px-2 rounded-lg text-xs font-mono font-medium border transition-all ${
                    copyMode === 'student'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  Student Copy
                </button>
                <button
                  type="button"
                  onClick={() => setCopyMode('office')}
                  className={`py-1.5 px-2 rounded-lg text-xs font-mono font-medium border transition-all ${
                    copyMode === 'office'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  Office Copy
                </button>
              </div>
            </div>

          </div>

          {/* Right Live Slip Preview (7 cols) */}
          <div className="lg:col-span-7 p-6 bg-slate-950 flex flex-col justify-between overflow-y-auto">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Eye className="h-3.5 w-3.5 text-amber-400" /> Dynamic Live Preview
                </span>
                <span className="text-[11px] text-slate-500 font-mono">
                  Exact Print Design Match
                </span>
              </div>

              {/* Preview Paper Frame */}
              <div className="bg-white text-slate-900 rounded-lg p-5 shadow-2xl border border-slate-300 font-sans text-left text-xs leading-relaxed max-w-xl mx-auto my-2">
                
                {/* Badge */}
                <div className="inline-block bg-slate-800 text-white text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-xs uppercase mb-2">
                  {previewTab === 'student' ? 'STUDENTS COPY' : 'OFFICE COPY'}
                </div>

                {/* Company Header */}
                <div className="mb-3">
                  <h2 className="text-base font-extrabold text-slate-900 uppercase tracking-tight leading-tight">
                    {companyName || 'SAROHUB TECHNOLOGIES PRIVATE LIMITED'}
                  </h2>
                  <h3 className="text-sm font-extrabold text-slate-900 uppercase">
                    {companyCity || 'SKARDU'}
                  </h3>
                </div>

                {/* Instructions */}
                <p className="text-[11.5px] text-slate-800 my-2 leading-relaxed">
                  The registration fee for <strong>{programDuration}</strong>. Please send the payment before the due date using Easy paisa. (<strong>{easypaisaNumber}</strong>) Acount Title <strong>{accountTitle}</strong>. After sending kindly share a screenshot of the transaction on this number for confirmation. Second option submit the registration fee at the office between <strong>{officeHours}</strong>.
                  <span className="block mt-1 font-normal text-slate-800">
                    Note: This fee is not refundable.
                  </span>
                </p>

                {/* Separator line */}
                <div className="border-t-2 border-slate-900 my-3"></div>

                {/* Student info */}
                <div className="text-[12px] space-y-1 text-slate-900 font-medium">
                  <div className="flex flex-wrap gap-4">
                    <span>
                      <strong>Student:</strong> <span className="border-b border-slate-900 inline-block min-w-[120px] px-1">{isSingle ? studentName : (targetApp?.applicant_name || '___________________')}</span>
                    </span>
                    <span>
                      <strong>S/O, D/O</strong> <span className="border-b border-slate-900 inline-block min-w-[120px] px-1">{isSingle ? fatherName : (getFatherName(targetApp) || '___________________')}</span>
                    </span>
                  </div>
                  <div>
                    <strong>Due Date:</strong> {dueDate}
                  </div>
                  <div>
                    <strong>Program:</strong> {programName}
                  </div>
                  <div>
                    <strong>Month:</strong> {monthText}
                  </div>
                </div>

                {/* Table */}
                <div className="my-4">
                  <table className="w-full border-collapse border border-slate-400 text-xs">
                    <thead>
                      <tr className="bg-slate-700 text-white font-bold text-left uppercase">
                        <th className="p-2 border border-slate-400 w-2/3">DESCRIPTION</th>
                        <th className="p-2 border border-slate-400 w-1/3 text-right">AMOUNT (PKR)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="p-2 border border-slate-400 text-slate-800">{feeDescription}</td>
                        <td className="p-2 border border-slate-400 font-bold text-right text-slate-900">Rs. {amount}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Signature */}
                <div className="mt-6 text-center">
                  <div className="w-40 mx-auto border-b border-slate-700 mb-1"></div>
                  <span className="text-[10px] text-slate-600 font-semibold uppercase">Accounts Officer</span>
                </div>

                {/* Footer */}
                <div className="mt-4 pt-2 border-t border-dashed border-slate-200 flex justify-between items-end text-[9px] text-slate-500">
                  <span className="italic">Note: Please pay before due date. This voucher is valid for one month only. Late payment will incur additional charges.</span>
                  <span className="text-slate-400 font-mono">{portalUrl}</span>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 mt-4 border-t border-slate-800 flex items-center justify-between">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-mono font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handlePrint}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
              >
                <Printer className="h-4 w-4" />
                Generate & Print Slips ({applications.length})
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default RegistrationSlipModal;
