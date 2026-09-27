import React, { useState, useEffect } from 'react';
import { Mail, CheckCircle2, AlertCircle, RefreshCw, Send, Trash2, X, ExternalLink, ShieldCheck, Server } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface OutgoingEmail {
  id: number;
  to: string;
  subject: string;
  category: string;
  status: 'delivered' | 'simulated' | 'failed';
  timestamp: string;
  details?: string;
}

interface SmtpStatus {
  is_configured: boolean;
  source: string;
  host: string;
  port: string | number;
  user: string;
  from_email: string;
  from_name: string;
  stats: {
    total: number;
    delivered: number;
    simulated: number;
    failed: number;
  };
}

interface MailOutboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNotify?: (title: string, message: string) => void;
}

export default function MailOutboxModal({ isOpen, onClose, onNotify }: MailOutboxModalProps) {
  const [emails, setEmails] = useState<OutgoingEmail[]>([]);
  const [smtpStatus, setSmtpStatus] = useState<SmtpStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [testEmailAddress, setTestEmailAddress] = useState('');
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string; hint?: string } | null>(null);

  const token = localStorage.getItem('sarohub_token') || sessionStorage.getItem('sarohub_token') || '';

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [emailsRes, statusRes] = await Promise.all([
        fetch('/api/admin/outgoing-emails', {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        }),
        fetch('/api/admin/smtp-status', {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        })
      ]);

      if (emailsRes.ok) {
        const data = await emailsRes.json();
        setEmails(data || []);
      }
      if (statusRes.ok) {
        const statusData = await statusRes.json();
        setSmtpStatus(statusData);
      }
    } catch (err) {
      console.error('Failed to load email outbox:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  const handleSendTestEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testEmailAddress.trim()) return;

    setIsSendingTest(true);
    setTestResult(null);

    try {
      const res = await fetch('/api/admin/test-smtp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ test_email: testEmailAddress.trim() })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setTestResult({
          success: true,
          message: data.message || `Diagnostic email successfully delivered to ${testEmailAddress}!`
        });
        fetchData();
      } else {
        setTestResult({
          success: false,
          message: data.error || 'Failed to dispatch test email.',
          hint: data.hint
        });
      }
    } catch (err: any) {
      setTestResult({
        success: false,
        message: err.message || 'Network error attempting to send test email.'
      });
    } finally {
      setIsSendingTest(false);
    }
  };

  const handleResetToSandbox = async () => {
    try {
      await fetch('/api/admin/reset-smtp', {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      fetchData();
      onNotify?.('Sandbox Mode Activated', 'Mail service switched to Outbox Sandbox Mode. System emails are recorded locally.');
    } catch (err) {
      console.error('Failed to reset SMTP:', err);
    }
  };

  const handleClearOutbox = async () => {
    try {
      await fetch('/api/admin/outgoing-emails', {
        method: 'DELETE',
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      setEmails([]);
      fetchData();
      onNotify?.('Outbox Cleared', 'All outgoing email log records have been reset.');
    } catch (err) {
      console.error('Failed to clear outbox:', err);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 16 }}
          className="relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden z-10 text-white"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-display font-bold text-white text-base sm:text-lg">
                  System Mail Engine &amp; Dispatch Outbox
                </h3>
                <p className="text-xs font-mono text-slate-400">
                  Live monitoring of shortlists, applicant notifications, and contact inquiries
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={fetchData}
                disabled={isLoading}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
                title="Refresh logs"
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin text-cyan-400' : ''}`} />
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
                title="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Status Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/50">
                <div className="flex items-center gap-2 text-xs font-mono text-slate-400 uppercase">
                  <Server className="h-4 w-4 text-cyan-400" />
                  <span>SMTP Connection</span>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`h-2.5 w-2.5 rounded-full ${smtpStatus?.is_configured ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                    <span className="font-display font-bold text-white text-sm">
                      {smtpStatus?.is_configured ? 'Live Authenticated' : 'Simulated Sandbox'}
                    </span>
                  </div>
                  {smtpStatus?.is_configured && (
                    <button
                      type="button"
                      onClick={handleResetToSandbox}
                      className="text-[10px] font-mono text-cyan-400 hover:text-cyan-300 underline cursor-pointer"
                      title="Switch to Outbox Sandbox Mode"
                    >
                      Use Sandbox
                    </button>
                  )}
                </div>
                <p className="text-[11px] font-mono text-slate-400 mt-1">
                  Host: {smtpStatus?.host || 'smtp.gmail.com'} ({smtpStatus?.port || 465})
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/50">
                <div className="flex items-center gap-2 text-xs font-mono text-slate-400 uppercase">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  <span>Delivered to Inbox</span>
                </div>
                <div className="mt-2 text-2xl font-display font-black text-emerald-400">
                  {smtpStatus?.stats.delivered || 0}
                </div>
                <p className="text-[11px] font-mono text-slate-400 mt-1">
                  Confirmed through mail transport
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/50">
                <div className="flex items-center gap-2 text-xs font-mono text-slate-400 uppercase">
                  <Mail className="h-4 w-4 text-blue-400" />
                  <span>Total System Dispatches</span>
                </div>
                <div className="mt-2 text-2xl font-display font-black text-white">
                  {smtpStatus?.stats.total || emails.length}
                </div>
                <p className="text-[11px] font-mono text-slate-400 mt-1">
                  Shortlists, forms, and RSVPs logged
                </p>
              </div>
            </div>

            {/* Test Mail Form */}
            <div className="p-5 rounded-2xl border border-slate-800 bg-slate-950/40">
              <h4 className="font-display font-bold text-white text-sm flex items-center gap-2 mb-2">
                <ShieldCheck className="h-4 w-4 text-cyan-400" />
                <span>Test Live Email Dispatch</span>
              </h4>
              <p className="text-xs text-slate-400 mb-4">
                Send a live test message to any recipient address to verify that your configured SMTP credentials (or Google App Password) are delivering cleanly.
              </p>

              <form onSubmit={handleSendTestEmail} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="Enter recipient email (e.g. yourname@gmail.com)"
                  value={testEmailAddress}
                  onChange={(e) => setTestEmailAddress(e.target.value)}
                  required
                  className="flex-1 text-xs bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
                <button
                  type="submit"
                  disabled={isSendingTest || !testEmailAddress.trim()}
                  className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-mono font-bold flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 transition-colors"
                >
                  {isSendingTest ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                  <span>{isSendingTest ? 'Verifying & Sending...' : 'Send Test Email'}</span>
                </button>
              </form>

              {testResult && (
                <div className={`mt-3 p-3 rounded-xl border text-xs font-mono flex items-start gap-2.5 ${
                  testResult.success
                    ? 'bg-emerald-950/50 border-emerald-800 text-emerald-300'
                    : 'bg-rose-950/50 border-rose-800 text-rose-300'
                }`}>
                  {testResult.success ? (
                    <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  )}
                  <div className="space-y-1">
                    <p className="font-bold">{testResult.message}</p>
                    {testResult.hint && <p className="text-[11px] text-slate-300 opacity-90">{testResult.hint}</p>}
                  </div>
                </div>
              )}
            </div>

            {/* Outbox Activity Table */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-display font-bold text-white text-sm flex items-center gap-2">
                  <span>Recent Outgoing Mail Dispatches</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                    {emails.length}
                  </span>
                </h4>
                {emails.length > 0 && (
                  <button
                    onClick={handleClearOutbox}
                    className="text-xs font-mono text-rose-400 hover:text-rose-300 flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Clear Outbox Logs
                  </button>
                )}
              </div>

              {emails.length === 0 ? (
                <div className="p-8 rounded-2xl border border-slate-800/80 bg-slate-950/20 text-center text-slate-500 text-xs font-mono">
                  No outgoing mail dispatches logged yet. When forms are filled or applicants are shortlisted, they will be tracked here.
                </div>
              ) : (
                <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                  {emails.map((m) => (
                    <div
                      key={m.id}
                      className="p-3.5 rounded-xl border border-slate-800/80 bg-slate-950/60 hover:border-slate-700 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                    >
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                            m.status === 'delivered'
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                              : m.status === 'failed'
                              ? 'bg-rose-950 text-rose-400 border border-rose-800'
                              : 'bg-amber-950 text-amber-400 border border-amber-800'
                          }`}>
                            {m.status}
                          </span>
                          <span className="font-mono text-slate-400 text-[11px]">
                            {m.category?.replace(/_/g, ' ')}
                          </span>
                          <span className="font-bold text-white truncate max-w-sm">
                            {m.subject}
                          </span>
                        </div>
                        <div className="text-[11px] font-mono text-slate-400 flex items-center gap-3">
                          <span>To: <strong className="text-slate-300">{m.to}</strong></span>
                          <span>•</span>
                          <span>{new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                        </div>
                      </div>
                      {m.details && (
                        <span className="text-[10px] font-mono text-slate-500 max-w-xs truncate text-right">
                          {m.details}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/60 flex items-center justify-end text-xs font-mono">
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
