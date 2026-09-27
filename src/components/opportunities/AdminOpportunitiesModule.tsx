import React, { useState, useEffect } from 'react';
import {
  Plus, Trash2, ArrowUp, ArrowDown, Eye, Edit, Copy, Download,
  Mail, FileText, Search, Filter, Send, ChevronRight, Calendar,
  MapPin, Clock, User, CheckCircle, AlertCircle, ExternalLink, X,
  Briefcase, CheckCircle2, ChevronDown, Save, Share2, ClipboardList,
  Sparkles, Check, Settings2, Info, ArrowUpToLine, ArrowDownToLine, ArrowLeft
} from 'lucide-react';
import { api, getAuthToken } from '../../api';
import { Opportunity, OpportunityApplication, OpportunityField } from '../../types';
import {
  FIELD_TYPES,
  SCHOLARSHIP_PRESET,
  INTERNSHIP_PRESET,
  JOB_PRESET
} from './FormBuilderPresets';
import FieldSettingsEditor from './FieldSettingsEditor';
import DynamicFormField from './DynamicFormField';
import RegistrationSlipModal from './RegistrationSlipModal';

const STANDARD_FIELDS_MAP: Record<string, OpportunityField> = {
  field_full_name: { id: 'field_full_name', type: 'full_name', label: 'Full Name', required: true, placeholder: 'Enter your full legal name' },
  field_email: { id: 'field_email', type: 'email', label: 'Email Address', required: true, placeholder: 'Enter your active email' },
  field_phone: { id: 'field_phone', type: 'phone', label: 'Phone Number', required: true, placeholder: 'e.g., +94 77 123 4567' },
  field_cnic: { id: 'field_cnic', type: 'cnic_passport', label: 'CNIC/Passport Number', required: true, placeholder: 'Enter your CNIC or Passport number' },
  field_gender: { id: 'field_gender', type: 'radio', label: 'Gender', required: true, options: ['Male', 'Female', 'Other'] },
  field_dob: { id: 'field_dob', type: 'date', label: 'Date of Birth', required: true },
  field_university: { id: 'field_university', type: 'text', label: 'Current University/Institution', required: true, placeholder: 'e.g., University of Science & Technology' },
  field_cgpa: { id: 'field_cgpa', type: 'number', label: 'Cumulative CGPA', required: true, placeholder: 'e.g., 3.80' },
  field_laptop: { id: 'field_laptop', type: 'yes_no_toggle', label: 'Do you own a laptop?', required: true, description: 'Required for remote/hybrid engineering tasks.' },
  field_resume: { id: 'field_resume', type: 'resume', label: 'Resume/CV Upload', required: true, description: 'Attach your latest professional CV (PDF only, Max 5MB).' },
  field_transcript: { id: 'field_transcript', type: 'transcript', label: 'Academic Transcript', required: true, description: 'Attach certified academic transcripts (PDF only, Max 5MB).' },
  field_linkedin: { id: 'field_linkedin', type: 'linkedin', label: 'LinkedIn Profile', required: false, placeholder: 'https://linkedin.com/in/username' },
  field_github: { id: 'field_github', type: 'github', label: 'GitHub Profile', required: false, placeholder: 'https://github.com/username' },
  field_portfolio: { id: 'field_portfolio', type: 'portfolio_upload', label: 'Portfolio Upload', required: false, description: 'Optional project decks or design links (PDF/Zip, Max 10MB).' }
};

const downloadDocument = async (fileUrl: string, fileName?: string, onError?: (message: string) => void) => {
  if (!fileUrl) {
    onError?.('Document URL is missing.');
    return;
  }
  const originalName = (fileName || 'document').replace(/[^a-zA-Z0-9._-]/g, '_');
  const downloadName = /\.pdf$/i.test(originalName) ? originalName : `${originalName}.pdf`;
  const token = getAuthToken() || localStorage.getItem('sarohub_auth_token') || localStorage.getItem('sarohub_token') || '';
  const downloadEndpoint = `/api/download-document?url=${encodeURIComponent(fileUrl)}&filename=${encodeURIComponent(downloadName)}${token ? `&token=${encodeURIComponent(token)}` : ''}`;

  try {
    const response = await fetch(downloadEndpoint, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
    if (!response.ok) throw new Error(`Download failed with status ${response.status}`);

    const blobUrl = URL.createObjectURL(await response.blob());
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = downloadName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(blobUrl), 2000);
  } catch (error: any) {
    console.warn('Proxy download failed, attempting direct download stream:', error);
    try {
      const fallbackLink = document.createElement('a');
      fallbackLink.href = downloadEndpoint;
      fallbackLink.download = downloadName;
      document.body.appendChild(fallbackLink);
      fallbackLink.click();
      fallbackLink.remove();
    } catch (fallbackErr) {
      console.error('All document download attempts failed:', error);
      onError?.(error.message || 'The document could not be downloaded. Please try again.');
    }
  }
};

interface AdminOpportunitiesModuleProps {
  onNotify?: (title: string, message: string) => void;
}

export default function AdminOpportunitiesModule({ onNotify }: AdminOpportunitiesModuleProps) {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [applications, setApplications] = useState<OpportunityApplication[]>([]);
  const [activeTab, setActiveTab] = useState<'list' | 'applications'>('list');
  const [isLoading, setIsLoading] = useState(true);

  // Custom alert and confirm states to bypass iframe sandboxing limits
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  } | null>(null);

  const [alertDialog, setAlertDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
  } | null>(null);

  const triggerConfirm = (title: string, message: string, onConfirm: () => void) => {
    setConfirmDialog({
      isOpen: true,
      title,
      message,
      onConfirm
    });
  };

  const triggerAlert = (title: string, message: string) => {
    setAlertDialog({
      isOpen: true,
      title,
      message
    });
  };

  // Search & Filters for Opportunities
  const [oppSearch, setOppSearch] = useState('');
  const [oppTypeFilter, setOppTypeFilter] = useState<string>('all');

  // Search & Filters for Applications
  const [appSearch, setAppSearch] = useState('');
  const [appStatusFilter, setAppStatusFilter] = useState<string>('all');
  const [appOppFilter, setAppOppFilter] = useState<string>('all');
  const [selectedAppIds, setSelectedAppIds] = useState<number[]>([]);

  // Registration Slip modal state
  const [isSlipModalOpen, setIsSlipModalOpen] = useState(false);
  const [slipModalApps, setSlipModalApps] = useState<OpportunityApplication[]>([]);

  // Editing state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingOpportunity, setEditingOpportunity] = useState<Opportunity | null>(null);

  // Current editing fields (standard form)
  const [oppTitle, setOppTitle] = useState('');
  const [oppType, setOppType] = useState<string>('Internship');
  const [oppSlug, setOppSlug] = useState('');
  const [oppShortDesc, setOppShortDesc] = useState('');
  const [oppDescription, setOppDescription] = useState('');
  const [oppEligibility, setOppEligibility] = useState('');
  const [oppBenefits, setOppBenefits] = useState('');
  const [oppLocation, setOppLocation] = useState('');
  const [oppDuration, setOppDuration] = useState('');
  const [oppStartDate, setOppStartDate] = useState('');
  const [oppDeadline, setOppDeadline] = useState('');
  const [oppPositions, setOppPositions] = useState<string>('');
  const [oppMaxApps, setOppMaxApps] = useState<string>('');
  const [oppStatus, setOppStatus] = useState<'Open' | 'Closed'>('Open');
  const [oppImage, setOppImage] = useState('');
  const [oppPublished, setOppPublished] = useState(true);
  const [oppSeoTitle, setOppSeoTitle] = useState('');
  const [oppSeoDesc, setOppSeoDesc] = useState('');
  const [oppFields, setOppFields] = useState<OpportunityField[]>([]);

  // Selected Application for detail view
  const [selectedApp, setSelectedApp] = useState<OpportunityApplication | null>(null);
  const [internalNotes, setInternalNotes] = useState('');

  // Email template state
  const [emailTemplate, setEmailTemplate] = useState<'interview' | 'shortlist' | 'offer' | 'reject' | 'custom'>('custom');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');

  // Image upload
  const [isUploading, setIsUploading] = useState(false);

  // Field builder helper state
  const [newFieldLabel, setNewFieldLabel] = useState('');
  const [newFieldType, setNewFieldType] = useState<OpportunityField['type']>('text');
  const [newFieldRequired, setNewFieldRequired] = useState(true);
  const [newFieldPlaceholder, setNewFieldPlaceholder] = useState('');
  const [newFieldOptions, setNewFieldOptions] = useState('');

  // Preview form inside builder
  const [previewActive, setPreviewActive] = useState(false);
  const [expandedFieldId, setExpandedFieldId] = useState<string | null>(null);
  const [previewData, setPreviewData] = useState<{ [label: string]: any }>({});

  // Fast standard field togglers
  const handleToggleStandardField = (fieldId: string) => {
    const exists = oppFields.some(f => f.id === fieldId || (fieldId === 'field_full_name' && (f.id === 'field_name' || f.id === 'field_full_name')) || (fieldId === 'field_resume' && (f.id === 'field_resume' || f.id === 'field_cv')));
    if (exists) {
      setOppFields(oppFields.filter(f => f.id !== fieldId && !(fieldId === 'field_full_name' && (f.id === 'field_name' || f.id === 'field_full_name')) && !(fieldId === 'field_resume' && (f.id === 'field_resume' || f.id === 'field_cv'))));
    } else {
      const template = STANDARD_FIELDS_MAP[fieldId];
      if (template) {
        setOppFields([...oppFields, JSON.parse(JSON.stringify(template))]);
      }
    }
  };

  const isStandardFieldActive = (fieldId: string) => {
    return oppFields.some(f => f.id === fieldId || (fieldId === 'field_full_name' && (f.id === 'field_name' || f.id === 'field_full_name')) || (fieldId === 'field_resume' && (f.id === 'field_resume' || f.id === 'field_cv')));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [oppsData, appsData] = await Promise.all([
        api.getOpportunities(),
        api.getOpportunityApplications()
      ]);
      setOpportunities(oppsData);
      setApplications(appsData);
    } catch (err: any) {
      console.error('Failed to load opportunities data:', err);
      if (onNotify) onNotify('Error', 'Failed to synchronize with opportunities database.');
    } finally {
      setIsLoading(false);
    }
  };

  // ---------------------------------------------------------
  // OPPORTUNITIES CRUD HANDLERS
  // ---------------------------------------------------------
  const handleOpenCreateForm = () => {
    setEditingOpportunity(null);
    setOppTitle('');
    setOppType('Internship');
    setOppSlug('');
    setOppShortDesc('');
    setOppDescription('');
    setOppEligibility('');
    setOppBenefits('');
    setOppLocation('');
    setOppDuration('');
    setOppStartDate('');
    setOppDeadline('');
    setOppPositions('');
    setOppMaxApps('');
    setOppStatus('Open');
    setOppImage('');
    setOppPublished(true);
    setOppSeoTitle('');
    setOppSeoDesc('');
    // Initialize with standard default fields
    setOppFields([
      { id: 'field_name', type: 'text', label: 'Full Name', required: true, placeholder: 'Enter your full name' },
      { id: 'field_email', type: 'email', label: 'Email Address', required: true, placeholder: 'Enter your email' },
      { id: 'field_phone', type: 'phone', label: 'Phone Number', required: true, placeholder: 'e.g., +94 77 123 4567' }
    ]);
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (opp: Opportunity) => {
    setEditingOpportunity(opp);
    setOppTitle(opp.title);
    setOppType(opp.type);
    setOppSlug(opp.slug || '');
    setOppShortDesc(opp.short_description || '');
    setOppDescription(opp.description);
    setOppEligibility(opp.eligibility_criteria);
    setOppBenefits(opp.benefits);
    setOppLocation(opp.location);
    setOppDuration(opp.duration);
    setOppStartDate(opp.start_date || '');
    setOppDeadline(opp.deadline);
    setOppPositions(opp.positions_count ? String(opp.positions_count) : '');
    setOppMaxApps(opp.max_applications ? String(opp.max_applications) : '');
    setOppStatus(opp.status);
    setOppImage(opp.featured_image_url || '');
    setOppPublished(opp.is_published);
    setOppSeoTitle(opp.seo_title || '');
    setOppSeoDesc(opp.seo_description || '');
    setOppFields([...opp.form_fields]);
    setIsFormOpen(true);
  };

  const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const res = await api.uploadImage(file);
      setOppImage(res.url);
      if (onNotify) onNotify('Upload Success', 'Featured banner image successfully synchronized.');
    } catch (err: any) {
      triggerAlert('Upload Failed', 'Upload failed: ' + err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveOpportunity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!oppTitle || !oppType) {
      triggerAlert('Validation Error', 'Opportunity Title and Type are required.');
      return;
    }

    const payload = {
      title: oppTitle,
      type: oppType,
      slug: oppSlug || oppTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      short_description: oppShortDesc,
      description: oppDescription,
      eligibility_criteria: oppEligibility,
      benefits: oppBenefits,
      location: oppLocation,
      duration: oppDuration,
      start_date: oppStartDate,
      deadline: oppDeadline,
      positions_count: oppPositions ? parseInt(oppPositions) : undefined,
      max_applications: oppMaxApps ? parseInt(oppMaxApps) : undefined,
      status: oppStatus,
      featured_image_url: oppImage,
      is_published: oppPublished,
      seo_title: oppSeoTitle,
      seo_description: oppSeoDesc,
      form_fields: oppFields
    };

    try {
      if (editingOpportunity) {
        await api.updateOpportunity(editingOpportunity.id, payload);
        if (onNotify) onNotify('Success', `Opportunity "${oppTitle}" successfully updated.`);
      } else {
        await api.createOpportunity(payload);
        if (onNotify) onNotify('Success', `Opportunity "${oppTitle}" created and registered.`);
      }
      setIsFormOpen(false);
      fetchData();
    } catch (err: any) {
      triggerAlert('Save Failed', 'Failed to save opportunity: ' + err.message);
    }
  };

  const handleTogglePublish = async (opp: Opportunity) => {
    try {
      await api.updateOpportunity(opp.id, {
        ...opp,
        is_published: !opp.is_published
      });
      if (onNotify) onNotify('Success', `Opportunity publish state toggled.`);
      fetchData();
    } catch (err: any) {
      triggerAlert('Action Failed', err.message);
    }
  };

  const handleDuplicateOpportunity = async (opp: Opportunity) => {
    try {
      await api.duplicateOpportunity(opp.id);
      if (onNotify) onNotify('Success', `Opportunity "${opp.title}" duplicated.`);
      fetchData();
    } catch (err: any) {
      triggerAlert('Action Failed', err.message);
    }
  };

  const handleDeleteOpportunity = (id: number) => {
    triggerConfirm(
      'Confirm Deletion',
      'Are you sure you want to permanently delete this opportunity listing? This will not delete submitted applications.',
      async () => {
        try {
          await api.deleteOpportunity(id);
          if (onNotify) onNotify('Removed', 'Opportunity listing deleted successfully.');
          fetchData();
        } catch (err: any) {
          triggerAlert('Delete Failed', err.message);
        }
      }
    );
  };

  // ---------------------------------------------------------
  // DYNAMIC FORM BUILDER HELPERS
  // ---------------------------------------------------------
  const handleAddField = () => {
    if (!newFieldLabel.trim()) {
      triggerAlert('Validation Error', 'Please enter a field label.');
      return;
    }

    const newFieldId = 'field_' + Date.now();
    const parsedOptions = newFieldOptions
      ? newFieldOptions.split(',').map(o => o.trim()).filter(Boolean)
      : undefined;

    const newField: OpportunityField = {
      id: newFieldId,
      type: newFieldType,
      label: newFieldLabel.trim(),
      required: newFieldRequired,
      placeholder: newFieldPlaceholder.trim() || undefined,
      options: parsedOptions
    };

    setOppFields([...oppFields, newField]);
    setExpandedFieldId(newFieldId); // Auto-expand settings for detailed rules setup

    // Reset helper form
    setNewFieldLabel('');
    setNewFieldPlaceholder('');
    setNewFieldOptions('');
    setNewFieldRequired(true);
  };

  const handleRemoveField = (id: string) => {
    if (['field_name', 'field_email', 'field_phone', 'field_full_name'].includes(id)) {
      triggerConfirm(
        'Confirm Core Field Removal',
        'This is a recommended core field. Are you sure you want to delete it?',
        () => {
          setOppFields(oppFields.filter(f => f.id !== id));
          if (expandedFieldId === id) {
            setExpandedFieldId(null);
          }
        }
      );
    } else {
      setOppFields(oppFields.filter(f => f.id !== id));
      if (expandedFieldId === id) {
        setExpandedFieldId(null);
      }
    }
  };

  const handleMoveField = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === oppFields.length - 1) return;

    const updated = [...oppFields];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;

    setOppFields(updated);
  };

  const handleMoveToLimit = (index: number, limit: 'top' | 'bottom') => {
    if (limit === 'top' && index === 0) return;
    if (limit === 'bottom' && index === oppFields.length - 1) return;

    const updated = [...oppFields];
    const item = updated.splice(index, 1)[0];
    if (limit === 'top') {
      updated.unshift(item);
    } else {
      updated.push(item);
    }
    setOppFields(updated);
  };

  const handleUpdateField = (index: number, updatedField: OpportunityField) => {
    const updated = [...oppFields];
    updated[index] = updatedField;
    setOppFields(updated);
  };

  const handleApplyPreset = (presetName: 'scholarship' | 'internship' | 'job') => {
    const apply = () => {
      let selectedPreset: OpportunityField[] = [];
      if (presetName === 'scholarship') selectedPreset = SCHOLARSHIP_PRESET;
      else if (presetName === 'internship') selectedPreset = INTERNSHIP_PRESET;
      else if (presetName === 'job') selectedPreset = JOB_PRESET;

      // Deep copy
      setOppFields(JSON.parse(JSON.stringify(selectedPreset)));
      setExpandedFieldId(null);
      setPreviewData({});
      if (onNotify) onNotify('Blueprint Applied', 'Form configured with recommended structural fields.');
    };

    if (oppFields.length > 0) {
      triggerConfirm(
        'Apply Preset Blueprint',
        'This will replace all current form fields. Are you sure you want to apply this blueprint?',
        apply
      );
    } else {
      apply();
    }
  };

  // ---------------------------------------------------------
  // APPLICATIONS ACTIONS
  // ---------------------------------------------------------
  const handleSelectApplication = (app: OpportunityApplication) => {
    setSelectedApp(app);
    setInternalNotes(app.internal_notes || '');
    // Reset notification form
    setEmailTemplate('interview');
    updateEmailContentTemplate('interview', app);
  };

  const handleUpdateAppStatus = async (appId: number, status: OpportunityApplication['status']) => {
    try {
      await api.updateOpportunityApplicationStatus(appId, status);
      if (onNotify) onNotify('Status Synchronized', `Applicant status updated to: ${status}`);

      // Refresh details
      setSelectedApp(prev => prev && prev.id === appId ? { ...prev, status } : prev);
      fetchData();
    } catch (err: any) {
      triggerAlert('Action Failed', err.message);
    }
  };

  const handleSaveInternalNotes = async () => {
    if (!selectedApp) return;
    try {
      await api.updateOpportunityApplicationNotes(selectedApp.id, internalNotes);
      if (onNotify) onNotify('Notes Saved', 'Internal candidate file updated.');
      setSelectedApp(prev => prev ? { ...prev, internal_notes: internalNotes } : null);
      fetchData();
    } catch (err: any) {
      triggerAlert('Action Failed', err.message);
    }
  };

  const updateEmailContentTemplate = (templateType: typeof emailTemplate, app: OpportunityApplication) => {
    let subject = '';
    let body = '';

    const applicant = app.applicant_name;
    const oppTitle = app.opportunity_title;

    switch (templateType) {
      case 'interview':
        subject = `Interview Scheduling: SaroHub Technologies - ${oppTitle}`;
        body = `Dear ${applicant},\n\nThank you for applying for the ${oppTitle} position at SaroHub Technologies.\n\nWe have reviewed your application file and would like to invite you for a virtual technical evaluation briefing via Google Meet.\n\nPlease let us know your availability over the next 3 working days.\n\nBest regards,\nAshan Perera\nCEO, SaroHub Technologies`;
        break;
      case 'shortlist':
        subject = `Application Update: SaroHub Technologies - ${oppTitle}`;
        body = `Dear ${applicant},\n\nWe are pleased to inform you that your application for the "${oppTitle}" has been Shortlisted for secondary review.\n\nOur engineering team is currently cross-examining candidate project portfolios and we will reach out with interview timelines shortly.\n\nBest regards,\nRuwan Silva\nCTO, SaroHub Technologies`;
        break;
      case 'offer':
        subject = `Offer of Selection: SaroHub Technologies - ${oppTitle}`;
        body = `Dear ${applicant},\n\nCongratulations!\n\nFollowing your evaluation rounds, we are delighted to offer you selection for the ${oppTitle} module at SaroHub Technologies (Private) Limited.\n\nOur administrative coordinator will email your formal service contracts and compensation sheets within the next 24 hours.\n\nWelcome to the SaroHub Enterprise Core!\n\nBest regards,\nAshan Perera\nCEO, SaroHub Technologies`;
        break;
      case 'reject':
        subject = `Application Update: SaroHub Technologies - ${oppTitle}`;
        body = `Dear ${applicant},\n\nThank you for your interest in SaroHub Technologies and for taking the time to apply for the ${oppTitle}.\n\nAfter careful review of your candidate credentials against our strict scaling criteria, we regret to inform you that we will not be moving forward with your application at this time.\n\nWe will keep your resume on file for future capacity expansions.\n\nBest regards,\nHR Operations Team\nSaroHub Technologies`;
        break;
      case 'custom':
        subject = `Inquiry Follow-up: SaroHub Technologies - ${oppTitle}`;
        body = `Dear ${applicant},\n\n[Insert custom notification details here]\n\nBest regards,\nSaroHub Engineering Portal`;
        break;
    }

    setEmailSubject(subject);
    setEmailBody(body);
  };

  const handleTemplateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value as any;
    setEmailTemplate(val);
    if (selectedApp) {
      updateEmailContentTemplate(val, selectedApp);
    }
  };

  const handleDispatchNotification = async () => {
    if (!selectedApp || !emailBody.trim()) return;
    try {
      await api.sendOpportunityNotification(selectedApp.id, `Subject: ${emailSubject}\n\n${emailBody}`);
      if (onNotify) onNotify('Email Dispatched', `Formal email update dispatched to ${selectedApp.applicant_email}`);
      triggerAlert('Email Dispatched', `Corporate notification dispatched successfully to ${selectedApp.applicant_email}!`);
    } catch (err: any) {
      triggerAlert('Dispatch Failed', err.message);
    }
  };

  // ---------------------------------------------------------
  // DATA EXPORT HANDLERS & BULK ACTIONS
  // ---------------------------------------------------------
  const handleExportApplicationsCSV = (appsToExport?: OpportunityApplication[]) => {
    const list = appsToExport || (selectedAppIds.length > 0
      ? applications.filter(app => selectedAppIds.includes(app.id))
      : filteredApps);

    if (list.length === 0) {
      triggerAlert('Export Empty', 'No application records match your active criteria.');
      return;
    }

    // 1. Gather all unique field labels across these applications to build custom columns
    const customLabelsSet = new Set<string>();
    list.forEach(app => {
      if (app.form_data) {
        Object.keys(app.form_data).forEach(label => {
          // Skip standard fields that are already tracked as separate headers
          if (!['Full Name', 'Email Address', 'Email', 'Name'].includes(label)) {
            customLabelsSet.add(label);
          }
        });
      }
    });
    const customLabels = Array.from(customLabelsSet);

    // 2. Build headers
    const baseHeaders = [
      'Application ID',
      'Opportunity Title',
      'Opportunity Type',
      'Applicant Name',
      'Applicant Email',
      'Applied Date',
      'Application Status',
      'Internal Notes'
    ];

    const headers = [...baseHeaders, ...customLabels];

    // Helper to format a cell for CSV Excel compatibility
    const escapeCsvCell = (val: any) => {
      if (val === undefined || val === null) return '""';
      let str = '';
      if (typeof val === 'object') {
        if (Array.isArray(val)) {
          str = val.map(v => typeof v === 'object' ? (v.fileName || v.fieldLabel || JSON.stringify(v)) : String(v)).join('; ');
        } else {
          str = JSON.stringify(val);
        }
      } else {
        str = String(val);
      }
      return `"${str.replace(/"/g, '""')}"`;
    };

    let csvContent = headers.map(h => `"${h.replace(/"/g, '""')}"`).join(',') + '\n';

    // 3. Populate rows
    list.forEach(app => {
      const rowData = [
        escapeCsvCell(app.id),
        escapeCsvCell(app.opportunity_title),
        escapeCsvCell(app.opportunity_type),
        escapeCsvCell(app.applicant_name),
        escapeCsvCell(app.applicant_email),
        escapeCsvCell(new Date(app.applied_at).toLocaleString()),
        escapeCsvCell(app.status),
        escapeCsvCell(app.internal_notes || '')
      ];

      // Add custom fields
      customLabels.forEach(label => {
        const val = app.form_data ? app.form_data[label] : '';
        rowData.push(escapeCsvCell(val));
      });

      csvContent += rowData.join(',') + '\n';
    });

    // Use UTF-8 with BOM (\uFEFF) to guarantee Excel displays special chars and commas perfectly
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const prefix = selectedAppIds.length > 0 ? 'Selected' : 'Filtered';
    link.setAttribute('href', url);
    link.setAttribute('download', `SaroHub_${prefix}_Applications_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    if (onNotify) {
      onNotify('Export Successful', `Exported ${list.length} candidate files with all custom form fields.`);
    }
  };

  const handleExportApplicationsPDF = (appsToExport?: OpportunityApplication[]) => {
    const list = appsToExport || (selectedAppIds.length > 0
      ? applications.filter(app => selectedAppIds.includes(app.id))
      : filteredApps);

    if (list.length === 0) {
      triggerAlert('Export Empty', 'No application records match your active criteria.');
      return;
    }

    // Generate beautiful printable layout for all filtered/selected applications
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

    // Collect custom fields
    const customLabelsSet = new Set<string>();
    list.forEach(app => {
      if (app.form_data) {
        Object.keys(app.form_data).forEach(label => {
          if (!['Full Name', 'Email Address', 'Email', 'Name'].includes(label)) {
            customLabelsSet.add(label);
          }
        });
      }
    });
    const customLabels = Array.from(customLabelsSet);

    // Build the table headers
    let tableHeadersHtml = `
      <th>ID</th>
      <th>Opportunity</th>
      <th>Applicant Name</th>
      <th>Email</th>
      <th>Applied Date</th>
      <th>Status</th>
    `;
    const displayCustomLabels = customLabels.slice(0, 3);
    displayCustomLabels.forEach(label => {
      tableHeadersHtml += `<th>${label}</th>`;
    });

    // Build rows
    let tableRowsHtml = '';
    list.forEach(app => {
      let customColsHtml = '';
      displayCustomLabels.forEach(label => {
        const val = app.form_data ? app.form_data[label] : '';
        let displayVal = '';
        if (val !== undefined && val !== null) {
          if (typeof val === 'object') {
            displayVal = Array.isArray(val) ? val.map(v => v.fileName || String(v)).join(', ') : JSON.stringify(val);
          } else {
            displayVal = String(val);
          }
        }
        customColsHtml += `<td>${displayVal || '-'}</td>`;
      });

      const appliedDateStr = new Date(app.applied_at).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });

      tableRowsHtml += `
        <tr>
          <td style="font-family: monospace; font-size: 11px;">#APP-${app.id}</td>
          <td>
            <strong>${app.opportunity_title}</strong><br/>
            <span style="font-size: 10px; color: #64748b;">${app.opportunity_type}</span>
          </td>
          <td><strong>${app.applicant_name}</strong></td>
          <td>${app.applicant_email}</td>
          <td>${appliedDateStr}</td>
          <td><span class="status-badge status-${app.status.toLowerCase().replace(/\\s+/g, '-')}">${app.status}</span></td>
          ${customColsHtml}
        </tr>
      `;
    });

    const prefix = selectedAppIds.length > 0 ? 'Selected' : 'Filtered';

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>SaroHub ${prefix} Candidate Applications Report</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
          @page {
            size: A4 landscape;
            margin: 1.5cm;
          }
          body {
            font-family: 'Inter', sans-serif;
            color: #0f172a;
            margin: 0;
            padding: 0;
            background-color: #ffffff;
            font-size: 11px;
            line-height: 1.5;
          }
          header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            border-bottom: 2px solid #e2e8f0;
            padding-bottom: 20px;
            margin-bottom: 25px;
          }
          .title-area h1 {
            font-size: 18px;
            font-weight: 700;
            margin: 0;
            color: #0284c7;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          .title-area p {
            margin: 5px 0 0 0;
            color: #64748b;
            font-size: 11px;
          }
          .meta-area {
            text-align: right;
            font-size: 10px;
            color: #64748b;
          }
          .meta-area strong {
            color: #0f172a;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
            page-break-inside: auto;
          }
          tr {
            page-break-inside: avoid;
            page-break-after: auto;
          }
          th {
            background-color: #f8fafc;
            color: #475569;
            font-weight: 600;
            text-align: left;
            padding: 10px 12px;
            border-bottom: 2px solid #cbd5e1;
            font-size: 10px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          td {
            padding: 12px;
            border-bottom: 1px solid #e2e8f0;
            vertical-align: top;
            color: #334155;
          }
          tr:hover td {
            background-color: #f8fafc;
          }
          .status-badge {
            display: inline-block;
            font-weight: 700;
            font-size: 9px;
            text-transform: uppercase;
            padding: 3px 8px;
            border-radius: 4px;
            letter-spacing: 0.5px;
          }
          .status-pending { background-color: #fef3c7; color: #d97706; }
          .status-under-review { background-color: #dbeafe; color: #2563eb; }
          .status-shortlisted { background-color: #e0e7ff; color: #4f46e5; }
          .status-interview { background-color: #f3e8ff; color: #7c3aed; }
          .status-selected { background-color: #d1fae5; color: #059669; }
          .status-rejected { background-color: #fee2e2; color: #dc2626; }
          footer {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            display: flex;
            justify-content: space-between;
            font-size: 9px;
            color: #94a3b8;
            border-top: 1px solid #f1f5f9;
            padding-top: 10px;
          }
        </style>
      </head>
      <body>
        <header>
          <div class="title-area">
            <h1>SaroHub Talent Pipeline Report</h1>
            <p>Exported Candidate Application Profiles & Status Tracking Logs</p>
          </div>
          <div class="meta-area">
            <div>Printed On: <strong>${new Date().toLocaleString()}</strong></div>
            <div>Report Scope: <strong>${prefix} Applications List</strong></div>
            <div>Record Count: <strong>${list.length} Candidate(s)</strong></div>
          </div>
        </header>

        <table>
          <thead>
            <tr>
              ${tableHeadersHtml}
            </tr>
          </thead>
          <tbody>
            ${tableRowsHtml}
          </tbody>
        </table>

        <footer>
          <div>SaroHub Internal Enterprise System • Confidential Report</div>
          <div>Printed using Browser PDF Engine</div>
        </footer>

        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 300);
          };
        </script>
      </body>
      </html>
    `;

    doc.open();
    doc.write(htmlContent);
    doc.close();

    // Clean up
    setTimeout(() => {
      document.body.removeChild(iframe);
    }, 5000);

    if (onNotify) {
      onNotify('Report Generated', `Successfully synchronized printable PDF layout with ${list.length} application records.`);
    }
  };

  // Export applications filtered by a specific status (e.g., Selected, Shortlisted, Pending)
  const handleExportByStatusPDF = (status: string) => {
    // Respect selected IDs if present, otherwise filter by active opportunity filter
    const baseList = selectedAppIds.length > 0
      ? applications.filter(a => selectedAppIds.includes(a.id))
      : applications.filter(a => (appOppFilter === 'all' || String(a.opportunity_id) === appOppFilter));

    const list = baseList.filter(a => a.status === status);

    if (list.length === 0) {
      triggerAlert('Export Empty', `No applications found with status: ${status}`);
      return;
    }

    // If all selected records share the same opportunity type, use it for heading
    const types = Array.from(new Set(list.map(a => a.opportunity_type))).filter(Boolean);
    const oppTypeHeading = types.length === 1 ? types[0] : 'Mixed Opportunities';

    // Reuse the existing exporter but provide a custom heading and report scope
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

    // Collect custom fields (reuse logic from handleExportApplicationsPDF)
    const customLabelsSet = new Set<string>();
    list.forEach(app => {
      if (app.form_data) {
        Object.keys(app.form_data).forEach(label => {
          if (!['Full Name', 'Email Address', 'Email', 'Name'].includes(label)) {
            customLabelsSet.add(label);
          }
        });
      }
    });
    const customLabels = Array.from(customLabelsSet);
    const displayCustomLabels = customLabels.slice(0, 3);

    let tableHeadersHtml = `
      <th>ID</th>
      <th>Opportunity</th>
      <th>Applicant Name</th>
      <th>Email</th>
      <th>Applied Date</th>
      <th>Status</th>
    `;
    displayCustomLabels.forEach(label => {
      tableHeadersHtml += `<th>${label}</th>`;
    });

    let tableRowsHtml = '';
    list.forEach(app => {
      let customColsHtml = '';
      displayCustomLabels.forEach(label => {
        const val = app.form_data ? app.form_data[label] : '';
        let displayVal = '';
        if (val !== undefined && val !== null) {
          if (typeof val === 'object') {
            displayVal = Array.isArray(val) ? val.map(v => v.fileName || String(v)).join(', ') : JSON.stringify(val);
          } else {
            displayVal = String(val);
          }
        }
        customColsHtml += `<td>${displayVal || '-'}</td>`;
      });

      const appliedDateStr = new Date(app.applied_at).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });

      tableRowsHtml += `
        <tr>
          <td style="font-family: monospace; font-size: 11px;">#APP-${app.id}</td>
          <td>
            <strong>${app.opportunity_title}</strong><br/>
            <span style="font-size: 10px; color: #64748b;">${app.opportunity_type}</span>
          </td>
          <td><strong>${app.applicant_name}</strong></td>
          <td>${app.applicant_email}</td>
          <td>${appliedDateStr}</td>
          <td><span class="status-badge status-${app.status.toLowerCase().replace(/\s+/g, '-')}">${app.status}</span></td>
          ${customColsHtml}
        </tr>
      `;
    });

    const htmlContent = `<!doctype html><html><head><meta charset="utf-8"><title>${oppTypeHeading} - ${status} Candidates</title><style>@page{size:A4 landscape;margin:1.5cm}body{font-family:Inter,Helvetica,Arial,sans-serif;color:#0f172a;margin:0;padding:0;font-size:11px}th{background:#f8fafc;padding:10px 12px}td{padding:12px;border-bottom:1px solid #e2e8f0}</style></head><body><header style="display:flex;justify-content:space-between;border-bottom:2px solid #e2e8f0;padding:16px"><div><h1 style="margin:0;font-size:18px;color:#0284c7">${oppTypeHeading} - ${status} Candidates</h1><p style="margin:4px 0 0;color:#64748b;font-size:11px">SaroHub Talent Pipeline export</p></div><div style="text-align:right;color:#64748b;font-size:10px">Printed On: <strong>${new Date().toLocaleString()}</strong><br/>Records: <strong>${list.length}</strong></div></header><table style="width:100%;border-collapse:collapse;margin-top:18px"><thead><tr>${tableHeadersHtml}</tr></thead><tbody>${tableRowsHtml}</tbody></table><footer style="margin-top:18px;font-size:9px;color:#94a3b8;border-top:1px solid #f1f5f9;padding-top:10px">SaroHub Internal Enterprise System • Confidential</footer><script>window.onload=function(){setTimeout(()=>window.print(),300)}</script></body></html>`;

    doc.open();
    doc.write(htmlContent);
    doc.close();

    setTimeout(() => {
      document.body.removeChild(iframe);
    }, 5000);

    if (onNotify) {
      onNotify('Report Generated', `Generated ${status} report for ${list.length} application(s).`);
    }
  };

  // Generate registration slips (with payment instructions) for selected or filtered applicants
  const handleGenerateRegistrationSlipPDF = (appsToUse?: OpportunityApplication[]) => {
    const list = appsToUse || (selectedAppIds.length > 0
      ? applications.filter(app => selectedAppIds.includes(app.id))
      : applications.filter(a => (appOppFilter === 'all' || String(a.opportunity_id) === appOppFilter))
    );

    if (list.length === 0) {
      triggerAlert('Export Empty', 'No application records selected to generate registration slips.');
      return;
    }

    setSlipModalApps(list);
    setIsSlipModalOpen(true);
  };

  const handleExportCandidatePDF = (appToPrint?: any) => {
    const targetApp = (appToPrint && typeof appToPrint === 'object' && 'id' in appToPrint) ? appToPrint : selectedApp;
    if (!targetApp) return;

    // We will create a beautiful, highly customized printable document in a temporary hidden iframe
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
      window.print(); // Fallback
      return;
    }

    const appliedDateStr = new Date(targetApp.applied_at).toLocaleString(undefined, {
      dateStyle: 'long',
      timeStyle: 'short'
    });

    const statusColors: Record<string, { bg: string, text: string }> = {
      'Pending': { bg: '#FEF3C7', text: '#D97706' },
      'Under Review': { bg: '#DBEAFE', text: '#2563EB' },
      'Shortlisted': { bg: '#E0E7FF', text: '#4F46E5' },
      'Interview': { bg: '#F3E8FF', text: '#7C3AED' },
      'Selected': { bg: '#D1FAE5', text: '#059669' },
      'Rejected': { bg: '#FEE2E2', text: '#DC2626' }
    };
    const statusColor = statusColors[targetApp.status] || { bg: '#F3F4F6', text: '#374151' };

    // Format all submitted answers beautifully
    let answersHtml = '';
    if (targetApp.form_data) {
      Object.entries(targetApp.form_data).forEach(([label, val]) => {
        if (['Full Name', 'Email Address', 'Email', 'Name'].includes(label)) return;

        let displayVal = 'N/A';
        if (val !== undefined && val !== null) {
          if (typeof val === 'object') {
            if (Array.isArray(val)) {
              displayVal = val.join(', ');
            } else {
              displayVal = JSON.stringify(val);
            }
          } else {
            displayVal = String(val);
          }
        }

        answersHtml += `
          <div class="field-box">
            <div class="field-label">${label}</div>
            <div class="field-value">${displayVal.replace(/\n/g, '<br/>')}</div>
          </div>
        `;
      });
    }

    // Format uploads
    let uploadsHtml = '';
    if (targetApp.uploaded_documents && targetApp.uploaded_documents.length > 0) {
      targetApp.uploaded_documents.forEach(docItem => {
        uploadsHtml += `
          <div class="doc-item">
            <span class="doc-icon">📎</span>
            <div>
              <div class="doc-name">${docItem.fileName || docItem.fieldLabel}</div>
              <div class="doc-url">${docItem.fileUrl}</div>
            </div>
          </div>
        `;
      });
    } else {
      uploadsHtml = '<p style="color: #6B7280; font-style: italic; font-size: 11px;">No attachments uploaded.</p>';
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Candidate File - ${targetApp.applicant_name}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
          
          body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            color: #1F2937;
            background-color: #FFFFFF;
            line-height: 1.5;
            padding: 40px;
            margin: 0;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          
          .header-container {
            border-bottom: 2px solid #E5E7EB;
            padding-bottom: 24px;
            margin-bottom: 30px;
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
          }
          
          .header-left h1 {
            font-size: 24px;
            font-weight: 700;
            margin: 0 0 4px 0;
            color: #111827;
            letter-spacing: -0.025em;
          }
          
          .header-left p {
            font-size: 13px;
            margin: 0;
            color: #6B7280;
            font-weight: 500;
          }
          
          .portal-badge {
            font-family: 'JetBrains Mono', monospace;
            font-size: 10px;
            font-weight: 600;
            color: #06B6D4;
            letter-spacing: 0.1em;
            text-transform: uppercase;
            margin-bottom: 8px;
            display: block;
          }
          
          .status-badge {
            display: inline-block;
            padding: 4px 10px;
            border-radius: 6px;
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            background-color: ${statusColor.bg};
            color: ${statusColor.text};
            border: 1px solid rgba(0, 0, 0, 0.05);
          }
          
          .section-title {
            font-size: 12px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: #374151;
            border-bottom: 1px solid #F3F4F6;
            padding-bottom: 6px;
            margin-bottom: 16px;
            margin-top: 32px;
          }
          
          .meta-grid {
            display: grid;
            grid-template-cols: 1fr 1fr;
            gap: 16px;
            margin-bottom: 24px;
          }
          
          .meta-card {
            background-color: #F9FAFB;
            border: 1px solid #E5E7EB;
            border-radius: 8px;
            padding: 12px 16px;
          }
          
          .meta-label {
            font-size: 10px;
            font-weight: 600;
            text-transform: uppercase;
            color: #9CA3AF;
            margin-bottom: 4px;
          }
          
          .meta-value {
            font-size: 13px;
            font-weight: 600;
            color: #111827;
          }
          
          .field-box {
            margin-bottom: 16px;
            background-color: #FBFBFC;
            border: 1px solid #F0F0F2;
            border-radius: 6px;
            padding: 12px;
          }
          
          .field-label {
            font-size: 11px;
            font-weight: 600;
            color: #4B5563;
            margin-bottom: 6px;
          }
          
          .field-value {
            font-size: 12.5px;
            color: #111827;
            white-space: pre-wrap;
          }
          
          .doc-item {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 10px 12px;
            background-color: #F3F4F6;
            border: 1px solid #E5E7EB;
            border-radius: 6px;
            margin-bottom: 8px;
          }
          
          .doc-icon {
            font-size: 16px;
          }
          
          .doc-name {
            font-size: 12px;
            font-weight: 600;
            color: #374151;
          }
          
          .doc-url {
            font-size: 10px;
            color: #2563EB;
            font-family: 'JetBrains Mono', monospace;
            word-break: break-all;
          }
          
          .evaluation-box {
            border: 1.5px dashed #D1D5DB;
            background-color: #FAFAFA;
            border-radius: 8px;
            padding: 16px;
            margin-top: 24px;
          }
          
          .evaluation-title {
            font-size: 12px;
            font-weight: 700;
            color: #4B5563;
            margin-bottom: 8px;
            text-transform: uppercase;
          }
          
          .notes-content {
            font-size: 12px;
            color: #1F2937;
            font-style: ${targetApp.internal_notes ? 'normal' : 'italic'};
          }
          
          .footer {
            margin-top: 60px;
            border-top: 1px solid #E5E7EB;
            padding-top: 16px;
            text-align: center;
            font-size: 10px;
            color: #9CA3AF;
            font-family: 'JetBrains Mono', monospace;
          }
          
          @media print {
            body {
              padding: 20px;
            }
          }
        </style>
      </head>
      <body>
        <div class="portal-badge">SAROHUB TALENT ACQUISITION</div>
        <div class="header-container">
          <div class="header-left">
            <h1>${targetApp.applicant_name}</h1>
            <p>Applied for: <strong>${targetApp.opportunity_title}</strong> (${targetApp.opportunity_type})</p>
          </div>
          <div>
            <span class="status-badge">${targetApp.status}</span>
          </div>
        </div>
        
        <div class="section-title">Application Core Metadata</div>
        <div class="meta-grid">
          <div class="meta-card">
            <div class="meta-label">Primary Email Address</div>
            <div class="meta-value">${targetApp.applicant_email}</div>
          </div>
          <div class="meta-card">
            <div class="meta-label">Submission Timestamp</div>
            <div class="meta-value">${appliedDateStr}</div>
          </div>
        </div>
        
        <div class="section-title">Custom Questionnaire Form Responses</div>
        <div class="answers-container">
          ${answersHtml || '<p style="color: #6B7280; font-style: italic; font-size: 12px;">No custom questionnaire fields required.</p>'}
        </div>
        
        <div class="section-title">Submitted Verified Documents</div>
        <div class="uploads-container">
          ${uploadsHtml}
        </div>
        
        <div class="evaluation-box">
          <div class="evaluation-title">Administrative Evaluation Notes</div>
          <div class="notes-content">
            ${targetApp.internal_notes ? targetApp.internal_notes.replace(/\n/g, '<br/>') : 'No internal evaluation commentary recorded for this applicant file.'}
          </div>
        </div>
        
        <div class="footer">
          SaroHub Portal • Document Generated on ${new Date().toLocaleDateString()} • CONFIDENTIAL CANDIDATE DOSSIER
        </div>
      </body>
      </html>
    `;

    doc.open();
    doc.write(htmlContent);
    doc.close();

    setTimeout(() => {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
      setTimeout(() => {
        document.body.removeChild(iframe);
      }, 3000);
    }, 500);
  };

  const handleBulkUpdateStatus = async (status: 'Pending' | 'Under Review' | 'Shortlisted' | 'Interview' | 'Selected' | 'Rejected') => {
    if (selectedAppIds.length === 0) return;
    try {
      setIsLoading(true);
      for (const id of selectedAppIds) {
        await api.updateOpportunityApplicationStatus(id, status);
      }
      const freshApps = await api.getOpportunityApplications();
      setApplications(freshApps);
      setSelectedAppIds([]);
      if (onNotify) onNotify('Bulk Action Complete', `Status updated to "${status}" for ${selectedAppIds.length} candidate files.`);
      triggerAlert('Bulk Update Success', `Successfully transitioned ${selectedAppIds.length} applicant files to status: "${status}"!`);
    } catch (err: any) {
      triggerAlert('Bulk Action Failed', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBulkDeleteApplications = async () => {
    if (selectedAppIds.length === 0) return;
    triggerConfirm(
      'Bulk Application Deletion',
      `Are you absolutely sure you want to permanently delete the ${selectedAppIds.length} selected candidate files? This action is irreversible.`,
      async () => {
        try {
          setIsLoading(true);
          for (const id of selectedAppIds) {
            await api.deleteOpportunityApplication(id);
          }
          const freshApps = await api.getOpportunityApplications();
          setApplications(freshApps);
          setSelectedAppIds([]);
          if (onNotify) onNotify('Bulk Action Complete', `Successfully removed ${selectedAppIds.length} applicant dossiers.`);
          triggerAlert('Applications Deleted', `Successfully deleted ${selectedAppIds.length} candidate applications permanently.`);
        } catch (err: any) {
          triggerAlert('Deletion Failed', err.message);
        } finally {
          setIsLoading(false);
        }
      }
    );
  };

  const handleToggleSelectAll = (filteredAppsList: OpportunityApplication[]) => {
    const filteredIds = filteredAppsList.map(app => app.id);
    const allSelected = filteredIds.every(id => selectedAppIds.includes(id));
    if (allSelected) {
      setSelectedAppIds(prev => prev.filter(id => !filteredIds.includes(id)));
    } else {
      setSelectedAppIds(prev => Array.from(new Set([...prev, ...filteredIds])));
    }
  };

  const handleToggleSelectApp = (id: number) => {
    setSelectedAppIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleDeleteSingleApplication = (app: OpportunityApplication) => {
    triggerConfirm(
      'Delete Candidate File',
      `Permanently delete the candidate application of "${app.applicant_name}"? This will erase all submitted credentials.`,
      async () => {
        try {
          setIsLoading(true);
          await api.deleteOpportunityApplication(app.id);
          const freshApps = await api.getOpportunityApplications();
          setApplications(freshApps);
          setSelectedAppIds(prev => prev.filter(id => id !== app.id));
          if (onNotify) onNotify('File Removed', `Dossier of ${app.applicant_name} was deleted.`);
          triggerAlert('Candidate Removed', `The application file of "${app.applicant_name}" has been permanently purged.`);
        } catch (err: any) {
          triggerAlert('Purge Failed', err.message);
        } finally {
          setIsLoading(false);
        }
      }
    );
  };

  // ---------------------------------------------------------
  // FILTERING LOGIC
  // ---------------------------------------------------------
  const filteredOpps = opportunities.filter(opp => {
    const matchesSearch = opp.title.toLowerCase().includes(oppSearch.toLowerCase()) ||
      opp.location.toLowerCase().includes(oppSearch.toLowerCase());
    const matchesType = oppTypeFilter === 'all' || opp.type === oppTypeFilter;
    return matchesSearch && matchesType;
  });

  const filteredApps = applications.filter(app => {
    const matchSearch =
      app.applicant_name.toLowerCase().includes(appSearch.toLowerCase()) ||
      app.applicant_email.toLowerCase().includes(appSearch.toLowerCase()) ||
      app.opportunity_title.toLowerCase().includes(appSearch.toLowerCase());

    const matchStatus = appStatusFilter === 'all' || app.status === appStatusFilter;
    const matchOpp = appOppFilter === 'all' || String(app.opportunity_id) === appOppFilter;

    return matchSearch && matchStatus && matchOpp;
  });

  return (
    <div className="space-y-6">
      {/* Title block */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-900 pb-5">
        <div>
          <h2 className="font-display text-xl font-bold text-white flex items-center gap-2">
            <ClipboardList className="h-5 w-5 text-cyan-400" /> Scholarship & Internship Portal
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Build custom application forms, monitor applicants and export filtered lists of candidate credentials.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTab('list')}
            className={`px-4 py-2 rounded-lg text-xs font-mono font-bold transition-all whitespace-nowrap ${activeTab === 'list' ? 'bg-cyan-500 text-slate-950' : 'bg-slate-900/50 text-slate-400 border border-slate-800 hover:text-white'}`}
          >
            Opportunities Catalog ({opportunities.length})
          </button>
          <button
            onClick={() => setActiveTab('applications')}
            className={`px-4 py-2 rounded-lg text-xs font-mono font-bold transition-all whitespace-nowrap ${activeTab === 'applications' ? 'bg-cyan-500 text-slate-950' : 'bg-slate-900/50 text-slate-400 border border-slate-800 hover:text-white'}`}
          >
            Applicant Tracking ({applications.length})
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
        </div>
      ) : activeTab === 'list' ? (
        // TAB 1: OPPORTUNITIES LIST
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-950/40 p-4 rounded-xl border border-slate-900">
            <div className="flex flex-col sm:flex-row flex-1 gap-2 w-full max-w-none min-w-0">
              <div className="relative w-full min-w-0">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-600" />
                <input
                  type="text"
                  placeholder="Search opportunities by title/location..."
                  value={oppSearch}
                  onChange={(e) => setOppSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded bg-slate-900/80 border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <select
                value={oppTypeFilter}
                onChange={(e) => setOppTypeFilter(e.target.value)}
                className="w-full sm:w-auto bg-slate-900/80 border border-slate-800 rounded text-xs text-slate-400 px-3 py-2 focus:outline-none"
              >
                <option value="all">All Types</option>
                <option value="Scholarship">Scholarships</option>
                <option value="Internship">Internships</option>
                <option value="Graduate Program">Graduate Programs</option>
                <option value="Training Program">Trainings</option>
                <option value="Job Opening">Job Openings</option>
                <option value="Custom">Custom</option>
              </select>
            </div>

            <button
              onClick={handleOpenCreateForm}
              className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-700 transition-all cursor-pointer"
            >
              <Plus className="h-4 w-4" /> Create Opportunity
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredOpps.map((opp) => {
              const appCount = applications.filter(a => a.opportunity_id === opp.id).length;
              return (
                <div key={opp.id} className="glass rounded-xl p-5 border border-slate-900 flex flex-col justify-between hover:border-slate-800 transition-all">
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-950/40 text-blue-400 border border-blue-900/40">
                        {opp.type}
                      </span>
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => handleTogglePublish(opp)}
                          className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${opp.is_published ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-900/40' : 'bg-slate-900 text-slate-500 border border-slate-800'}`}
                          title="Click to toggle publish"
                        >
                          {opp.is_published ? 'Published' : 'Draft'}
                        </button>
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${opp.status === 'Open' ? 'bg-cyan-950/40 text-cyan-400 border border-cyan-900/40' : 'bg-rose-950/40 text-rose-400 border border-rose-900/40'}`}>
                          {opp.status}
                        </span>
                      </div>
                    </div>

                    <h3 className="text-sm font-bold text-white mt-1 group-hover:text-cyan-400 transition-colors">
                      {opp.title}
                    </h3>

                    <div className="grid grid-cols-2 gap-2 mt-4 text-[11px] text-slate-400 font-mono">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-slate-600 shrink-0" />
                        <span className="truncate">{opp.location || 'HQ Office'}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 text-slate-600 shrink-0" />
                        <span>{opp.duration || '6 Months'}</span>
                      </div>
                      <div className="flex items-center gap-1.5 col-span-2 text-rose-400/80">
                        <Calendar className="h-3.5 w-3.5 text-rose-900 shrink-0" />
                        <span>Deadline: {opp.deadline ? new Date(opp.deadline).toLocaleDateString() : 'N/A'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-slate-900 mt-5 pt-4 flex items-center justify-between">
                    <span className="text-[11px] font-mono text-slate-500">
                      Total Submissions: <strong className="text-white font-bold">{appCount}</strong>
                    </span>

                    <div className="flex gap-1.5">
                      <button
                        onClick={() => handleDuplicateOpportunity(opp)}
                        className="p-1.5 rounded bg-slate-900 text-slate-400 border border-slate-800 hover:text-white hover:bg-slate-800 transition-all"
                        title="Duplicate Opportunity Form"
                      >
                        <Copy className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleOpenEditForm(opp)}
                        className="p-1.5 rounded bg-slate-900 text-slate-400 border border-slate-800 hover:text-cyan-400 hover:bg-slate-800 transition-all"
                        title="Edit Opportunity & Forms"
                      >
                        <Edit className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteOpportunity(opp.id)}
                        className="p-1.5 rounded bg-slate-900 text-slate-500 border border-slate-800 hover:text-rose-400 hover:bg-slate-800 transition-all"
                        title="Delete Opportunity Listing"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredOpps.length === 0 && (
              <div className="col-span-2 text-center p-12 bg-slate-950/10 rounded-2xl border border-slate-900">
                <AlertCircle className="h-8 w-8 text-slate-700 mx-auto mb-3" />
                <p className="text-xs font-mono text-slate-500">No matching opportunity blueprints registered.</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        // TAB 2: APPLICATIONS TRACKING
        <div className="space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-slate-950/40 p-4 rounded-xl border border-slate-900">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2 flex-1">
              <div className="relative md:col-span-2">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-600" />
                <input
                  type="text"
                  placeholder="Search applicant name, email, or opportunity..."
                  value={appSearch}
                  onChange={(e) => setAppSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none"
                />
              </div>

              <select
                value={appStatusFilter}
                onChange={(e) => setAppStatusFilter(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded text-xs text-slate-400 px-3 py-2 focus:outline-none"
              >
                <option value="all">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Under Review">Under Review</option>
                <option value="Shortlisted">Shortlisted</option>
                <option value="Interview">Interview</option>
                <option value="Selected">Selected</option>
                <option value="Rejected">Rejected</option>
              </select>

              <select
                value={appOppFilter}
                onChange={(e) => setAppOppFilter(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded text-xs text-slate-400 px-3 py-2 focus:outline-none truncate"
              >
                <option value="all">All Opportunities</option>
                {opportunities.map(opp => (
                  <option key={opp.id} value={opp.id}>{opp.title}</option>
                ))}
              </select>
            </div>

            <button
              onClick={() => handleExportApplicationsCSV()}
              className="flex items-center gap-1.5 rounded-lg bg-slate-900 px-4 py-2 text-xs font-mono font-bold text-slate-300 border border-slate-800 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
            >
              <Download className="h-4 w-4" /> Export CSV (Excel)
            </button>

            <button
              onClick={() => handleExportApplicationsPDF()}
              className="flex items-center gap-1.5 rounded-lg bg-slate-900 px-4 py-2 text-xs font-mono font-bold text-slate-300 border border-slate-800 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
            >
              <FileText className="h-4 w-4" /> Export PDF Report
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleExportByStatusPDF('Selected')}
                className="text-xs px-3 py-2 rounded bg-emerald-950/20 border border-emerald-900/30 text-emerald-400 hover:bg-emerald-900/40 transition-colors"
                title="Export Selected applicants as PDF"
              >
                PDF: Selected
              </button>
              <button
                onClick={() => handleExportByStatusPDF('Shortlisted')}
                className="text-xs px-3 py-2 rounded bg-indigo-950/20 border border-indigo-900/30 text-indigo-400 hover:bg-indigo-900/40 transition-colors"
                title="Export Shortlisted applicants as PDF"
              >
                PDF: Shortlisted
              </button>
              <button
                onClick={() => handleExportByStatusPDF('Pending')}
                className="text-xs px-3 py-2 rounded bg-yellow-950/20 border border-yellow-900/30 text-yellow-400 hover:bg-yellow-900/40 transition-colors"
                title="Export Pending applicants as PDF"
              >
                PDF: Pending
              </button>
            </div>
          </div>

          {/* BULK ACTIONS BANNER */}
          {selectedAppIds.length > 0 && (
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-cyan-950/20 border border-cyan-900/50 p-4 rounded-xl animate-in fade-in duration-200">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
                <span className="text-xs text-slate-300 font-mono">
                  <strong className="text-cyan-400">{selectedAppIds.length}</strong> application{selectedAppIds.length > 1 ? 's' : ''} selected
                </span>
                <button
                  onClick={() => setSelectedAppIds([])}
                  className="text-[10px] text-slate-500 hover:text-white underline ml-2 font-mono transition-colors"
                >
                  Deselect all
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">Bulk Transition status:</span>
                <div className="flex flex-wrap gap-1">
                  {(['Selected', 'Pending', 'Under Review', 'Shortlisted', 'Interview', 'Rejected'] as const).map((status) => (
                    <button
                      key={status}
                      onClick={() => handleBulkUpdateStatus(status)}
                      className={`px-2.5 py-1 rounded text-[10px] font-bold border transition-all cursor-pointer ${status === 'Selected' ? 'bg-emerald-950/30 text-emerald-400 border-emerald-900/30 hover:bg-emerald-900/40' :
                        status === 'Pending' ? 'bg-yellow-950/30 text-yellow-400 border-yellow-900/30 hover:bg-yellow-900/40' :
                          status === 'Under Review' ? 'bg-blue-950/30 text-blue-400 border-blue-900/30 hover:bg-blue-900/40' :
                            status === 'Shortlisted' ? 'bg-indigo-950/30 text-indigo-400 border-indigo-900/30 hover:bg-indigo-900/40' :
                              status === 'Interview' ? 'bg-purple-950/30 text-purple-400 border-purple-900/30 hover:bg-purple-900/40' :
                                'bg-rose-950/30 text-rose-400 border-rose-900/30 hover:bg-rose-900/40'
                        }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>

                <div className="h-4 w-[1px] bg-slate-800 mx-1 hidden md:block" />

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleExportApplicationsCSV()}
                    className="flex items-center gap-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white px-2.5 py-1 text-[10px] font-mono font-bold border border-slate-800 transition-all cursor-pointer"
                    title="Export selected candidates to CSV"
                  >
                    <Download className="h-3 w-3" /> Export Selection (CSV)
                  </button>
                  <button
                    onClick={() => handleExportApplicationsPDF()}
                    className="flex items-center gap-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white px-2.5 py-1 text-[10px] font-mono font-bold border border-slate-800 transition-all cursor-pointer"
                    title="Export selected candidates to beautiful PDF"
                  >
                    <FileText className="h-3 w-3" /> Export Selection (PDF)
                  </button>
                  <button
                    onClick={handleBulkDeleteApplications}
                    className="flex items-center gap-1 rounded bg-rose-950/20 hover:bg-rose-900/40 text-rose-400 hover:text-rose-200 px-2.5 py-1 text-[10px] font-mono font-bold border border-rose-900/30 transition-all cursor-pointer"
                    title="Permanently delete selected applicant files"
                  >
                    <Trash2 className="h-3 w-3" /> Delete
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="overflow-x-auto rounded-xl border border-slate-900 bg-slate-950/20">
            <table className="w-full border-collapse text-left text-xs text-slate-300">
              <thead>
                <tr className="border-b border-slate-900 bg-slate-950/50 font-mono text-[10px] uppercase text-slate-500 tracking-wider">
                  <th className="px-6 py-4 w-12 text-center">
                    <input
                      type="checkbox"
                      checked={filteredApps.length > 0 && filteredApps.every(app => selectedAppIds.includes(app.id))}
                      onChange={() => handleToggleSelectAll(filteredApps)}
                      className="rounded border-slate-800 text-cyan-500 bg-slate-950 focus:ring-0 cursor-pointer h-4 w-4"
                    />
                  </th>
                  <th className="px-6 py-4">Applicant</th>
                  <th className="px-6 py-4">Opportunity Applied</th>
                  <th className="px-6 py-4">Applied Date</th>
                  <th className="px-6 py-4">Documents</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <button
                onClick={() => handleGenerateRegistrationSlipPDF()}
                className="flex items-center gap-1 rounded bg-amber-900/10 hover:bg-amber-900/20 text-amber-300 hover:text-white px-2.5 py-1 text-[10px] font-mono font-bold border border-amber-900/20 transition-all cursor-pointer"
                title="Generate registration slips with payment instructions for selected applicants"
              >
                <ClipboardList className="h-3 w-3" /> Generate Slips
              </button>
              <tbody className="divide-y divide-slate-900">
                {filteredApps.map((app) => (
                  <tr key={app.id} className={`hover:bg-slate-900/20 transition-colors ${selectedAppIds.includes(app.id) ? 'bg-cyan-950/10 hover:bg-cyan-950/20' : ''}`}>
                    <td className="px-6 py-4 text-center">
                      <input
                        type="checkbox"
                        checked={selectedAppIds.includes(app.id)}
                        onChange={() => handleToggleSelectApp(app.id)}
                        className="rounded border-slate-800 text-cyan-500 bg-slate-950 focus:ring-0 cursor-pointer h-4 w-4"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <span className="font-bold text-white text-sm block">{app.applicant_name}</span>
                        <span className="text-slate-500 font-mono text-[11px] block">{app.applicant_email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <span className="font-medium text-slate-200 block">{app.opportunity_title}</span>
                        <span className="text-xs text-blue-400/80 font-mono">{app.opportunity_type}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-slate-500">
                      {new Date(app.applied_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      {app.uploaded_documents && app.uploaded_documents.length > 0 ? (
                        <div className="flex flex-col items-start gap-1.5">
                          {app.uploaded_documents.map((doc, index) => (
                            <div key={`${doc.fileUrl}-${index}`} className="flex items-center gap-1">
                              <a
                                href={`/api/documents/view?url=${encodeURIComponent(doc.fileUrl)}&filename=${encodeURIComponent(doc.fileName || doc.fieldLabel || 'document.pdf')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex max-w-[140px] items-center gap-1 rounded border border-cyan-500/30 bg-cyan-500/10 px-2 py-1 text-[10px] font-mono font-bold text-cyan-300 transition-colors hover:bg-cyan-500 hover:text-slate-950"
                                title={`Preview ${doc.fileName || doc.fieldLabel}`}
                              >
                                <Eye className="h-3 w-3 shrink-0" />
                                <span className="truncate">{doc.fileName || doc.fieldLabel}</span>
                              </a>
                              <button
                                type="button"
                                onClick={() => downloadDocument(doc.fileUrl, doc.fileName || doc.fieldLabel, (message) => triggerAlert('Download Failed', message))}
                                className="p-1 rounded border border-slate-700 bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                                title={`Download ${doc.fileName || doc.fieldLabel}`}
                              >
                                <Download className="h-3 w-3 shrink-0" />
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-600">No documents</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${app.status === 'Pending' ? 'bg-yellow-950/30 text-yellow-400 border-yellow-900/40' :
                          app.status === 'Under Review' ? 'bg-blue-950/30 text-blue-400 border-blue-900/40' :
                            app.status === 'Shortlisted' ? 'bg-indigo-950/30 text-indigo-400 border-indigo-900/40' :
                              app.status === 'Interview' ? 'bg-purple-950/30 text-purple-400 border-purple-900/40' :
                                app.status === 'Selected' ? 'bg-emerald-950/30 text-emerald-400 border-emerald-900/40' :
                                  'bg-rose-950/30 text-rose-400 border-rose-900/40'
                          }`}>
                          {app.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleSelectApplication(app)}
                          className="rounded bg-slate-900 border border-slate-800 px-3 py-1.5 text-xs font-mono font-bold text-cyan-400 hover:text-slate-950 hover:bg-cyan-500 transition-all cursor-pointer inline-flex items-center gap-1"
                        >
                          <Eye className="h-3 w-3" /> View Credentials
                        </button>
                        <button
                          onClick={() => handleExportCandidatePDF(app)}
                          className="rounded bg-slate-900 border border-slate-800 p-1.5 text-slate-400 hover:text-white transition-all cursor-pointer"
                          title="Export Styled PDF"
                        >
                          <FileText className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteSingleApplication(app)}
                          className="rounded bg-slate-900 border border-slate-800 p-1.5 text-rose-500 hover:bg-rose-950/30 transition-all cursor-pointer"
                          title="Delete Application"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredApps.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center p-12 text-slate-500 font-mono">
                      No application records match the active criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL 1: CREATE / EDIT OPPORTUNITY & FORM BUILDER */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm overflow-y-auto">
          <div className="bg-slate-950 border border-slate-900 w-full max-w-5xl rounded-2xl max-h-[92vh] overflow-y-auto flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-900 px-6 py-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsFormOpen(false)}
                  className="flex items-center gap-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 px-3 py-2 text-xs font-mono font-bold text-slate-300 hover:text-white transition-all cursor-pointer"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Go Back
                </button>
                <h3 className="font-display font-bold text-white text-base">
                  {editingOpportunity ? `Configure Opportunity: ${oppTitle}` : 'Register Scholarship or Internship Blueprint'}
                </h3>
              </div>
              <button onClick={() => setIsFormOpen(false)} className="text-slate-400 hover:text-white p-1">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Sub headers to switch builder and preview */}
            <div className="flex border-b border-slate-900 bg-slate-950 px-6">
              <button
                onClick={() => setPreviewActive(false)}
                className={`py-3 px-4 text-xs font-mono font-bold border-b-2 transition-all ${!previewActive ? 'border-cyan-500 text-cyan-400' : 'border-transparent text-slate-400 hover:text-white'}`}
              >
                1. Opportunity Parameters & Form Setup
              </button>
              <button
                onClick={() => setPreviewActive(true)}
                className={`py-3 px-4 text-xs font-mono font-bold border-b-2 transition-all ${previewActive ? 'border-cyan-500 text-cyan-400' : 'border-transparent text-slate-400 hover:text-white'}`}
              >
                2. Live Application Form Interactive Preview
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1">
              {!previewActive ? (
                <form onSubmit={handleSaveOpportunity} className="space-y-6">
                  {/* Basic information */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-[11px] font-mono text-slate-500 uppercase mb-1">Opportunity Title *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g., Undergraduate Cognitive AI Research Scholarship"
                        value={oppTitle}
                        onChange={(e) => {
                          setOppTitle(e.target.value);
                          // Auto generate slug if they are typing the title
                          setOppSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
                        }}
                        className="w-full rounded bg-slate-900 border border-slate-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono text-slate-500 uppercase mb-1">Category Type *</label>
                      <select
                        value={oppType}
                        onChange={(e) => setOppType(e.target.value)}
                        className="w-full rounded bg-slate-900 border border-slate-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                      >
                        <option value="Scholarship">Scholarship</option>
                        <option value="Internship">Internship</option>
                        <option value="Job Opening">Job Opening</option>
                        <option value="Event">Event</option>
                        <option value="Competition">Competition</option>
                        <option value="Training Program">Training Program</option>
                        <option value="Ambassador Program">Ambassador Program</option>
                        <option value="Graduate Program">Graduate Program</option>
                        <option value="Custom">Custom</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono text-slate-500 uppercase mb-1">Slug (Auto-generated/Editable) *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g., undergraduate-cognitive-ai-research-scholarship"
                        value={oppSlug}
                        onChange={(e) => setOppSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''))}
                        className="w-full rounded bg-slate-900 border border-slate-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono text-[11px]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono text-slate-500 uppercase mb-1">Geographical Location</label>
                      <input
                        type="text"
                        placeholder="e.g., Headquarters HQ / Hybrid"
                        value={oppLocation}
                        onChange={(e) => setOppLocation(e.target.value)}
                        className="w-full rounded bg-slate-900 border border-slate-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono text-slate-500 uppercase mb-1">Duration Cycle</label>
                      <input
                        type="text"
                        placeholder="e.g., 6 Months, 1 Year"
                        value={oppDuration}
                        onChange={(e) => setOppDuration(e.target.value)}
                        className="w-full rounded bg-slate-900 border border-slate-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono text-slate-500 uppercase mb-1">Start Date</label>
                      <input
                        type="date"
                        value={oppStartDate}
                        onChange={(e) => setOppStartDate(e.target.value)}
                        className="w-full rounded bg-slate-900 border border-slate-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono text-slate-500 uppercase mb-1">Application Deadline</label>
                      <input
                        type="date"
                        value={oppDeadline}
                        onChange={(e) => setOppDeadline(e.target.value)}
                        className="w-full rounded bg-slate-900 border border-slate-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono text-slate-500 uppercase mb-1">Positions Count (Optional)</label>
                      <input
                        type="number"
                        placeholder="e.g., 5"
                        value={oppPositions}
                        onChange={(e) => setOppPositions(e.target.value)}
                        className="w-full rounded bg-slate-900 border border-slate-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono text-slate-500 uppercase mb-1">Maximum Applications limit (Optional)</label>
                      <input
                        type="number"
                        placeholder="e.g., 100"
                        value={oppMaxApps}
                        onChange={(e) => setOppMaxApps(e.target.value)}
                        className="w-full rounded bg-slate-900 border border-slate-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono text-slate-500 uppercase mb-1">Opening Status</label>
                      <select
                        value={oppStatus}
                        onChange={(e) => setOppStatus(e.target.value as any)}
                        className="w-full rounded bg-slate-900 border border-slate-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                      >
                        <option value="Open">Open</option>
                        <option value="Closed">Closed</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono text-slate-500 uppercase mb-1">Publishing Mode</label>
                      <select
                        value={oppPublished ? 'true' : 'false'}
                        onChange={(e) => setOppPublished(e.target.value === 'true')}
                        className="w-full rounded bg-slate-900 border border-slate-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                      >
                        <option value="true">Published (Public View)</option>
                        <option value="false">Draft (Admin Config Only)</option>
                      </select>
                    </div>
                  </div>

                  {/* Image/banner selector */}
                  <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-900">
                    <label className="block text-[11px] font-mono text-slate-500 uppercase mb-2">Featured Image / Banner URL</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="https://images.unsplash.com/photo-..."
                        value={oppImage}
                        onChange={(e) => setOppImage(e.target.value)}
                        className="w-full rounded bg-slate-900 border border-slate-800 px-3 py-2 text-xs text-white focus:outline-none"
                      />
                      <label className="rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 px-4 py-2 text-xs font-mono font-bold cursor-pointer shrink-0 transition-colors">
                        {isUploading ? 'Uploading...' : 'Upload Local Image'}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleUploadImage}
                          className="hidden"
                          disabled={isUploading}
                        />
                      </label>
                    </div>
                    {oppImage && (
                      <div className="mt-3">
                        <img src={oppImage} alt="Preview" className="h-20 w-40 object-cover rounded border border-slate-800" />
                      </div>
                    )}
                  </div>

                  {/* Descriptions and SEO block */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[11px] font-mono text-slate-500 uppercase mb-1">Short Description (Summary) *</label>
                      <input
                        type="text"
                        required
                        placeholder="A concise summary to display on lists and card previews..."
                        value={oppShortDesc}
                        onChange={(e) => setOppShortDesc(e.target.value)}
                        className="w-full rounded bg-slate-900 border border-slate-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono text-slate-500 uppercase mb-1">Opportunity Full Description *</label>
                      <textarea
                        required
                        rows={4}
                        placeholder="Comprehensive details regarding the program roles and company department guidelines..."
                        value={oppDescription}
                        onChange={(e) => setOppDescription(e.target.value)}
                        className="w-full rounded bg-slate-900 border border-slate-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-mono text-slate-500 uppercase mb-1">Eligibility Criteria</label>
                        <textarea
                          rows={3}
                          placeholder="Minimum GPA constraints, academic backgrounds, or specific technical requirements..."
                          value={oppEligibility}
                          onChange={(e) => setOppEligibility(e.target.value)}
                          className="w-full rounded bg-slate-900 border border-slate-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-mono text-slate-500 uppercase mb-1">Program Benefits & Stipends</label>
                        <textarea
                          rows={3}
                          placeholder="Financial stipends, workspace allocations, direct certifications, or mentorship scopes..."
                          value={oppBenefits}
                          onChange={(e) => setOppBenefits(e.target.value)}
                          className="w-full rounded bg-slate-900 border border-slate-800 px-3 py-2 text-xs text-white focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* SEO Settings Panel */}
                    <div className="border border-slate-900 bg-slate-950/40 rounded-xl p-4 space-y-3">
                      <h5 className="text-xs font-mono font-bold text-slate-400 uppercase flex items-center gap-1.5">
                        <Sparkles className="h-4 w-4 text-cyan-400" /> SEO Metadata Optimization
                      </h5>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="md:col-span-1">
                          <label className="block text-[10px] font-mono text-slate-500 uppercase mb-1">SEO Title Tag (Meta)</label>
                          <input
                            type="text"
                            placeholder="e.g., Best AI Scholarship 2026"
                            value={oppSeoTitle}
                            onChange={(e) => setOppSeoTitle(e.target.value)}
                            className="w-full rounded bg-slate-900 border border-slate-800 px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-[10px] font-mono text-slate-500 uppercase mb-1">SEO Description Tag (Meta)</label>
                          <input
                            type="text"
                            placeholder="An eye-catching summary optimized for search result snippets..."
                            value={oppSeoDesc}
                            onChange={(e) => setOppSeoDesc(e.target.value)}
                            className="w-full rounded bg-slate-900 border border-slate-800 px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* DYNAMIC FORM BUILDER PANEL */}

                  {/* PREDEFINED STANDARD FIELDS FAST TOGGLE BAR */}
                  <div className="bg-slate-900/20 border border-slate-900/60 rounded-xl p-4 mb-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 border-b border-slate-900 pb-2 gap-2">
                      <h5 className="text-xs font-mono font-bold text-slate-300 uppercase flex items-center gap-1.5">
                        <Settings2 className="h-4 w-4 text-cyan-400" /> Predefined Candidate Fields Control
                      </h5>
                      <span className="text-[10px] text-slate-500 font-mono">Click standard fields to toggle application form requirements instantly.</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2">
                      {Object.entries(STANDARD_FIELDS_MAP).map(([fieldId, fTemplate]) => {
                        const active = isStandardFieldActive(fieldId);
                        return (
                          <button
                            key={fieldId}
                            type="button"
                            onClick={() => handleToggleStandardField(fieldId)}
                            className={`px-2 py-1.5 rounded-lg border text-left text-[10px] font-semibold transition-all duration-150 flex flex-col justify-between h-[52px] ${active
                              ? 'bg-cyan-950/20 border-cyan-500/50 text-cyan-400 shadow-sm shadow-cyan-500/5'
                              : 'bg-slate-950/40 border-slate-900/60 text-slate-400 hover:border-slate-800'
                              }`}
                          >
                            <span className="truncate max-w-full font-sans text-xs text-left">{fTemplate.label}</span>
                            <div className="flex items-center justify-between w-full mt-1">
                              <span className="text-[9px] font-mono opacity-60 uppercase text-left">{fTemplate.type.replace('_', ' ')}</span>
                              <span className={`h-2 w-2 rounded-full ${active ? 'bg-cyan-400 animate-pulse' : 'bg-slate-800'}`}></span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <div className="border-t border-slate-900 pt-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-900 pb-4 mb-4">
                      <div>
                        <h4 className="font-display font-bold text-white text-sm flex items-center gap-1.5">
                          <ClipboardList className="h-4.5 w-4.5 text-cyan-400" /> Dynamic Field Configuration Workspace
                        </h4>
                        <p className="text-slate-500 text-xs mt-0.5">
                          Configure labels, help descriptions, and custom validation bounds (Min/Max limits, extensions, file size) without code modifications.
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-slate-500 font-semibold uppercase shrink-0">Quick Presets:</span>
                        <button
                          type="button"
                          onClick={() => handleApplyPreset('scholarship')}
                          className="px-2.5 py-1 rounded bg-blue-950/40 hover:bg-blue-900/60 text-blue-400 border border-blue-900/50 text-[10px] font-mono font-bold transition-all"
                        >
                          Scholarship Form
                        </button>
                        <button
                          type="button"
                          onClick={() => handleApplyPreset('internship')}
                          className="px-2.5 py-1 rounded bg-indigo-950/40 hover:bg-indigo-900/60 text-indigo-400 border border-indigo-900/50 text-[10px] font-mono font-bold transition-all"
                        >
                          Internship Form
                        </button>
                        <button
                          type="button"
                          onClick={() => handleApplyPreset('job')}
                          className="px-2.5 py-1 rounded bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-400 border border-emerald-900/50 text-[10px] font-mono font-bold transition-all"
                        >
                          Job Form
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* Left: Fields List and Actions */}
                      <div className="lg:col-span-2 space-y-3 max-h-[460px] overflow-y-auto pr-2 custom-scrollbar">
                        {oppFields.length === 0 ? (
                          <div className="text-center py-12 bg-slate-950/20 border border-slate-900/40 rounded-xl flex flex-col items-center justify-center">
                            <Sparkles className="h-6 w-6 text-slate-600 mb-2 animate-pulse" />
                            <p className="text-xs text-slate-500 font-mono">No fields added yet. Apply a blueprint preset or add custom fields below.</p>
                          </div>
                        ) : (
                          oppFields.map((field, idx) => (
                            <FieldSettingsEditor
                              key={field.id}
                              field={field}
                              index={idx}
                              totalFields={oppFields.length}
                              isExpanded={expandedFieldId === field.id}
                              onToggleExpand={() => setExpandedFieldId(expandedFieldId === field.id ? null : field.id)}
                              onUpdateField={(updated) => handleUpdateField(idx, updated)}
                              onRemoveField={() => handleRemoveField(field.id)}
                              onMoveField={(dir) => handleMoveField(idx, dir)}
                              onMoveToLimit={(limit) => handleMoveToLimit(idx, limit)}
                            />
                          ))
                        )}
                      </div>

                      {/* Right: Quick Add Field Panel */}
                      <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-900 space-y-3 self-start">
                        <h5 className="font-display font-bold text-slate-300 text-xs uppercase tracking-wider flex items-center gap-1">
                          <Plus className="h-3.5 w-3.5 text-cyan-400" /> Create Custom Field
                        </h5>

                        <div>
                          <label className="block text-[9px] font-mono text-slate-500 mb-1">Field Input Type</label>
                          <select
                            value={newFieldType}
                            onChange={(e) => setNewFieldType(e.target.value as any)}
                            className="w-full rounded bg-slate-900 border border-slate-800 px-2 py-1.5 text-xs text-white"
                          >
                            {FIELD_TYPES.map(t => (
                              <option key={t.value} value={t.value}>{t.label}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-[9px] font-mono text-slate-500 mb-1">Field Label / Name *</label>
                          <input
                            type="text"
                            placeholder="e.g., Degree Major"
                            value={newFieldLabel}
                            onChange={(e) => setNewFieldLabel(e.target.value)}
                            className="w-full rounded bg-slate-900 border border-slate-800 px-2 py-1.5 text-xs text-white focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[9px] font-mono text-slate-500 mb-1">Placeholder (Optional)</label>
                          <input
                            type="text"
                            placeholder="e.g., Select from choices..."
                            value={newFieldPlaceholder}
                            onChange={(e) => setNewFieldPlaceholder(e.target.value)}
                            className="w-full rounded bg-slate-900 border border-slate-800 px-2 py-1.5 text-xs text-white focus:outline-none"
                          />
                        </div>

                        {['dropdown', 'radio', 'checkbox_multi', 'multi_select'].includes(newFieldType) && (
                          <div>
                            <label className="block text-[9px] font-mono text-cyan-400 mb-1 font-bold">Choices (Comma-separated) *</label>
                            <input
                              type="text"
                              required
                              placeholder="e.g., Choice A, Choice B, Choice C"
                              value={newFieldOptions}
                              onChange={(e) => setNewFieldOptions(e.target.value)}
                              className="w-full rounded bg-slate-900 border border-slate-800 px-2 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                            />
                          </div>
                        )}

                        <div className="flex items-center gap-2 pt-1">
                          <input
                            type="checkbox"
                            id="field_req"
                            checked={newFieldRequired}
                            onChange={(e) => setNewFieldRequired(e.target.checked)}
                            className="rounded bg-slate-900 border-slate-800 text-cyan-500 focus:ring-0 cursor-pointer"
                          />
                          <label htmlFor="field_req" className="text-[10px] font-mono text-slate-400 cursor-pointer select-none">
                            Required candidate input
                          </label>
                        </div>

                        <button
                          type="button"
                          onClick={handleAddField}
                          className="w-full mt-3 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 py-2 text-xs font-mono font-bold transition-all cursor-pointer"
                        >
                          + Append Field
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 border-t border-slate-900 pt-6">
                    <button
                      type="button"
                      onClick={() => setIsFormOpen(false)}
                      className="rounded bg-slate-900 hover:bg-slate-800 text-slate-400 border border-slate-800 px-5 py-2.5 text-xs font-mono font-bold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-blue-700 transition-all cursor-pointer"
                    >
                      <Save className="h-4 w-4" /> Save Opportunity Config
                    </button>
                  </div>
                </form>
              ) : (
                // PREVIEW TAB INSIDE FORM CONFIG
                <div className="space-y-6 max-w-xl mx-auto">
                  <div className="bg-blue-950/20 border border-blue-900/30 p-4 rounded-xl flex items-start gap-3">
                    <Info className="h-5 w-5 text-blue-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-white uppercase tracking-wide">Interactive Canvas Sandbox</h4>
                      <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                        Type responses, make selections and toggle options to audit the layout exactly as SaroHub applicants see it on mobile/desktop. Disabled/inactive fields are automatically hidden.
                      </p>
                    </div>
                  </div>

                  <div className="bg-slate-950 p-6 rounded-2xl border border-slate-900 shadow-xl space-y-5">
                    <div className="border-b border-slate-900 pb-4 mb-4">
                      <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-blue-950/40 text-blue-400 border border-blue-900/40 uppercase">
                        {oppType} Application
                      </span>
                      <h3 className="text-base font-bold text-white mt-1.5">{oppTitle || 'Unnamed Opportunity Listing'}</h3>
                      <p className="text-xs text-slate-500 mt-0.5 font-mono">{oppLocation || 'HQ Office'} • {oppDuration || '6 Months'}</p>
                    </div>

                    {oppFields.filter(f => !f.disabled).length === 0 ? (
                      <div className="text-center py-10">
                        <AlertCircle className="h-6 w-6 text-slate-600 mx-auto mb-2" />
                        <span className="text-xs text-slate-500 font-mono">No active form fields to display in public view.</span>
                      </div>
                    ) : (
                      oppFields.filter(f => !f.disabled).map((field) => (
                        <DynamicFormField
                          key={field.id}
                          field={field}
                          value={previewData[field.label]}
                          disabled={false} // Make preview input interactive!
                          onChange={(val) => setPreviewData(prev => ({ ...prev, [field.label]: val }))}
                          error={undefined}
                        />
                      ))
                    )}

                    <div className="pt-4 border-t border-slate-900">
                      <button
                        type="button"
                        onClick={() => {
                          alert('Submission simulations are only processed via public application portals!');
                        }}
                        className="w-full rounded bg-blue-600 hover:bg-blue-700 py-3 text-xs font-bold text-white shadow-md shadow-blue-500/10 transition-all cursor-pointer"
                      >
                        Simulate Form Submission
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: VIEW APPLICANT CREDENTIALS & EMAIL NOTIFICATION */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm overflow-y-auto">
          <div className="bg-slate-950 border border-slate-900 w-full max-w-4xl rounded-2xl max-h-[92vh] overflow-y-auto flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-900 px-6 py-4">
              <div>
                <h3 className="font-display font-bold text-white text-base">Candidate File: {selectedApp.applicant_name}</h3>
                <p className="text-xs text-slate-500 font-mono">{selectedApp.opportunity_title} ({selectedApp.opportunity_type})</p>
              </div>
              <button
                onClick={() => setSelectedApp(null)}
                aria-label="Close candidate file"
                className="text-slate-200 hover:text-white p-2 bg-slate-900/40 hover:bg-slate-800 rounded-md transition-colors z-50"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6" id="printable-candidate-file">
              {/* Left Column: Form Submissions */}
              <div className="space-y-4">
                <h4 className="font-display font-bold text-white text-xs uppercase tracking-wider pb-2 border-b border-slate-900">Submitted Credentials</h4>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-900 space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                    <div>
                      <span className="text-slate-500 block">Candidate Name</span>
                      <strong className="text-white font-bold">{selectedApp.applicant_name}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Candidate Email</span>
                      <strong className="text-white font-bold">{selectedApp.applicant_email}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Applied At</span>
                      <strong className="text-slate-400 font-bold">{new Date(selectedApp.applied_at).toLocaleString()}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Current Status</span>
                      <span className={`inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold ${selectedApp.status === 'Pending' ? 'bg-yellow-950/30 text-yellow-400 border border-yellow-900/40' :
                        selectedApp.status === 'Under Review' ? 'bg-blue-950/30 text-blue-400 border border-blue-900/40' :
                          selectedApp.status === 'Shortlisted' ? 'bg-indigo-950/30 text-indigo-400 border border-indigo-900/40' :
                            selectedApp.status === 'Interview' ? 'bg-purple-950/30 text-purple-400 border border-purple-900/40' :
                              selectedApp.status === 'Selected' ? 'bg-emerald-950/30 text-emerald-400 border border-emerald-900/40' :
                                'bg-rose-950/30 text-rose-400 border border-rose-900/40'
                        }`}>
                        {selectedApp.status}
                      </span>
                    </div>
                  </div>

                  {/* Dynamic fields */}
                  <div className="border-t border-slate-900 pt-4 space-y-3.5">
                    {Object.entries(selectedApp.form_data).map(([label, val]) => {
                      if (['Full Name', 'Email Address', 'Email', 'Phone Number', 'Phone', 'Contact Email', 'Contact Phone'].includes(label)) return null;
                      return (
                        <div key={label} className="text-xs">
                          <span className="text-slate-500 block font-medium mb-1">{label}</span>
                          <div className="text-slate-200 bg-slate-900/50 p-2.5 rounded border border-slate-900 whitespace-pre-wrap font-sans text-xs">
                            {String(val || 'N/A')}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Documents */}
                  {selectedApp.uploaded_documents && selectedApp.uploaded_documents.length > 0 && (
                    <div className="border-t border-slate-900 pt-4">
                      <span className="text-slate-500 block font-mono text-[11px] mb-2">Uploaded Attachments</span>
                      <div className="space-y-1.5">
                        {selectedApp.uploaded_documents.map((doc, dIdx) => (
                          <div key={dIdx} className="flex items-center justify-between p-2.5 bg-slate-900/50 rounded border border-slate-800 text-xs">
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4 text-cyan-400 shrink-0" />
                              <span className="text-slate-300 font-medium truncate max-w-[200px]">{doc.fileName || doc.fieldLabel}</span>
                            </div>
                            <div className="flex items-center gap-1.5 shrink-0">
                              <a
                                href={`/api/documents/view?url=${encodeURIComponent(doc.fileUrl)}&filename=${encodeURIComponent(doc.fileName || doc.fieldLabel || 'document.pdf')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-mono text-[10px] bg-slate-900 hover:bg-cyan-950 px-2 py-1 rounded border border-cyan-500/30 transition-all font-bold"
                                title="Open document preview in new tab"
                              >
                                <Eye className="h-3 w-3" /> Preview
                              </a>
                              <button
                                type="button"
                                onClick={() => downloadDocument(doc.fileUrl, doc.fileName || doc.fieldLabel, (message) => triggerAlert('Download Failed', message))}
                                className="text-slate-200 flex items-center gap-1 font-mono text-[10px] bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 px-2.5 py-1 rounded border border-slate-700 transition-all font-bold cursor-pointer"
                                title="Download document to device"
                              >
                                <Download className="h-3 w-3" /> Download
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Status updates, internal notes & Notifications */}
              <div className="space-y-4 printable-hide">
                <h4 className="font-display font-bold text-white text-xs uppercase tracking-wider pb-2 border-b border-slate-900">Administrative Actions</h4>

                {/* Status selector */}
                <div className="grid grid-cols-2 gap-3 bg-slate-900/40 p-4 rounded-xl border border-slate-900">
                  <div>
                    <label className="block text-[10px] font-mono text-slate-500 uppercase mb-1.5">Update Status</label>
                    <div className="relative">
                      <select
                        value={selectedApp.status}
                        onChange={(e) => handleUpdateAppStatus(selectedApp.id, e.target.value as any)}
                        className="w-full rounded bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white focus:outline-none"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Under Review">Under Review</option>
                        <option value="Shortlisted">Shortlisted</option>
                        <option value="Interview">Interview</option>
                        <option value="Selected">Selected</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-end">
                    <button
                      onClick={handleExportCandidatePDF}
                      className="w-full rounded bg-slate-950 hover:bg-slate-900 text-slate-300 border border-slate-800 px-3 py-2 text-xs font-mono font-bold flex items-center justify-center gap-1.5"
                    >
                      <Download className="h-3.5 w-3.5" /> Export PDF File
                    </button>
                  </div>
                  <div className="flex items-end mt-2">
                    <button
                      onClick={() => handleGenerateRegistrationSlipPDF([selectedApp])}
                      className="w-full rounded bg-amber-900/10 hover:bg-amber-900/20 text-amber-300 hover:text-white border border-amber-900/20 px-3 py-2 text-xs font-mono font-bold flex items-center justify-center gap-1.5"
                    >
                      <ClipboardList className="h-3.5 w-3.5" /> Generate Registration Slip
                    </button>
                  </div>
                </div>

                {/* Internal notes */}
                <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-900 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-[10px] font-mono text-slate-500 uppercase">Internal Candidate Notes</label>
                    <button
                      onClick={handleSaveInternalNotes}
                      className="text-xs text-cyan-400 hover:text-white flex items-center gap-1 font-mono font-bold"
                    >
                      <Save className="h-3 w-3" /> Save Notes
                    </button>
                  </div>
                  <textarea
                    rows={3}
                    placeholder="Candidate notes: strong system design background, review portfolios during interview stage..."
                    value={internalNotes}
                    onChange={(e) => setInternalNotes(e.target.value)}
                    className="w-full rounded bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white focus:outline-none placeholder-slate-700"
                  />
                </div>

                {/* Email notify section */}
                <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-900 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                    <label className="block text-[10px] font-mono text-slate-300 font-bold uppercase flex items-center gap-1">
                      <Mail className="h-3.5 w-3.5 text-cyan-400" /> Send Applicant Update Mail
                    </label>

                    <select
                      value={emailTemplate}
                      onChange={handleTemplateChange}
                      className="bg-slate-950 border border-slate-800 rounded text-[10px] font-mono text-slate-400 px-2 py-1 focus:outline-none"
                    >
                      <option value="interview">Interview Scheduling</option>
                      <option value="shortlist">Shortlist Invitation</option>
                      <option value="offer">Offer Selection</option>
                      <option value="reject">Formal Decline</option>
                      <option value="custom">Custom Memo</option>
                    </select>
                  </div>

                  <div>
                    <input
                      type="text"
                      placeholder="Email Subject Header..."
                      value={emailSubject}
                      onChange={(e) => setEmailSubject(e.target.value)}
                      className="w-full rounded bg-slate-950 border border-slate-800 px-2 py-1.5 text-xs text-white focus:outline-none font-sans font-bold"
                    />
                  </div>

                  <div>
                    <textarea
                      rows={5}
                      placeholder="Type custom memo to applicant..."
                      value={emailBody}
                      onChange={(e) => setEmailBody(e.target.value)}
                      className="w-full rounded bg-slate-950 border border-slate-800 px-2 py-1.5 text-xs text-white focus:outline-none font-sans"
                    />
                  </div>

                  <button
                    onClick={handleDispatchNotification}
                    className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-bold font-mono uppercase flex items-center justify-center gap-1.5 shadow"
                  >
                    <Send className="h-3.5 w-3.5" /> Dispatch Mail notification
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom Confirmation Dialog */}
      {confirmDialog && confirmDialog.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/85 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm bg-slate-950 border border-slate-900 rounded-2xl p-5 space-y-4 shadow-2xl shadow-cyan-500/5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-2.5 text-cyan-400">
              <InfoIcon className="h-5 w-5 text-cyan-400" />
              <h4 className="font-display font-bold text-white text-sm">{confirmDialog.title}</h4>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed font-sans">{confirmDialog.message}</p>
            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setConfirmDialog(null)}
                className="px-3.5 py-1.5 rounded-lg bg-slate-900 text-slate-400 text-xs font-mono border border-slate-800 hover:text-white transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  confirmDialog.onConfirm();
                  setConfirmDialog(null);
                }}
                className="px-3.5 py-1.5 rounded-lg bg-cyan-500 text-slate-950 text-xs font-mono font-bold hover:bg-cyan-400 transition-all shadow-md shadow-cyan-500/10"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Alert Dialog */}
      {alertDialog && alertDialog.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/85 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm bg-slate-950 border border-slate-900 rounded-2xl p-5 space-y-4 shadow-2xl shadow-cyan-500/5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-2.5 text-rose-400">
              <AlertCircle className="h-5 w-5 text-rose-400" />
              <h4 className="font-display font-bold text-white text-sm">{alertDialog.title}</h4>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed font-sans">{alertDialog.message}</p>
            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={() => setAlertDialog(null)}
                className="px-4 py-1.5 rounded-lg bg-slate-900 text-slate-300 text-xs font-mono border border-slate-800 hover:text-white transition-all"
              >
                Acknowledge
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Registration Slip Generator Modal */}
      <RegistrationSlipModal
        isOpen={isSlipModalOpen}
        onClose={() => setIsSlipModalOpen(false)}
        applications={slipModalApps}
        onNotify={onNotify}
      />
    </div>
  );
}

// Minimal icons because simple is premium
function InfoIcon(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4" />
      <path d="M12 8h.01" />
    </svg>
  );
}

function UploadCloudIcon(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
      <path d="M12 12v9" />
      <path d="m16 16-4-4-4 4" />
    </svg>
  );
}
