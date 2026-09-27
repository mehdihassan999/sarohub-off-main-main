import React, { useRef, useState } from 'react';
import { 
  User, Mail, Phone, CreditCard, Calendar, Hash, AlignLeft, 
  ChevronDown, Check, Upload, Link, Linkedin, Github, Globe, 
  MapPin, AlertCircle, FileText, Trash2, Eye, Sparkles, Image, Award, GraduationCap, Compass
} from 'lucide-react';
import { OpportunityField } from '../../types';

interface DynamicFormFieldProps {
  field: OpportunityField;
  value: any;
  onChange: (val: any) => void;
  error?: string;
  disabled?: boolean;
  uploading?: boolean;
  onFileUpload?: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  onRemoveFile?: (index?: number) => void;
  darkTheme?: boolean;
}

const DynamicFormField: React.FC<DynamicFormFieldProps> = ({
  field,
  value,
  onChange,
  error,
  disabled = false,
  uploading = false,
  onFileUpload,
  onRemoveFile,
  darkTheme = false
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const idSafe = `field-input-${field.id}`;
  const isRequired = field.required;

  // Render help text/description
  const renderDescription = () => {
    if (!field.description) return null;
    return (
      <p className={`text-[10px] md:text-xs mt-1 font-sans leading-relaxed ${darkTheme ? 'text-slate-400' : 'text-slate-500'}`}>
        {field.description}
      </p>
    );
  };

  // Drag and drop handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (disabled || !onFileUpload) return;

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const simulatedEvent = {
        target: {
          files: e.dataTransfer.files
        }
      } as unknown as React.ChangeEvent<HTMLInputElement>;
      await onFileUpload(simulatedEvent);
    }
  };

  // Dynamic Border Style for inputs
  const getInputStyles = () => {
    const themeClasses = darkTheme
      ? 'bg-slate-950/80 border-slate-750 text-white placeholder-slate-500 focus:border-cyan-400 focus:ring-cyan-500/20'
      : 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:ring-blue-500/20';

    return `w-full rounded-xl border px-3.5 py-2.5 text-xs focus:outline-none focus:ring-2 transition-all ${themeClasses} ${
      error ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/10' : ''
    } ${disabled ? 'opacity-80 cursor-not-allowed bg-slate-100/50 text-slate-500' : ''}`;
  };

  // Helper lists
  const COUNTRIES = ['Sri Lanka', 'India', 'United States', 'United Kingdom', 'Canada', 'Australia', 'Singapore', 'Germany', 'Japan', 'United Arab Emirates'];
  const PROVINCES = ['Western Province', 'Central Province', 'Southern Province', 'Northern Province', 'Eastern Province', 'North Western Province', 'North Central Province', 'Uva Province', 'Sabaragamuwa Province'];

  const getFileIcon = () => {
    switch(field.type) {
      case 'resume': return <FileText className="h-7 w-7 text-indigo-500 mx-auto mb-1 shrink-0" />;
      case 'transcript': return <GraduationCap className="h-7 w-7 text-blue-500 mx-auto mb-1 shrink-0" />;
      case 'certificate': return <Award className="h-7 w-7 text-yellow-500 mx-auto mb-1 shrink-0" />;
      case 'portfolio_upload': return <Compass className="h-7 w-7 text-cyan-500 mx-auto mb-1 shrink-0" />;
      case 'image': return <Image className="h-7 w-7 text-emerald-500 mx-auto mb-1 shrink-0" />;
      default: return <Upload className="h-7 w-7 text-slate-400 mx-auto mb-1 shrink-0" />;
    }
  };

  return (
    <div className={`space-y-1.5 ${field.disabled ? 'hidden' : 'block'}`}>
      <label className={`block text-xs font-semibold flex items-center justify-between ${darkTheme ? 'text-slate-300' : 'text-slate-700'}`}>
        <span className="flex items-center gap-1.5">
          {field.label} {isRequired && <span className="text-rose-500 font-bold">*</span>}
        </span>
        {disabled && (
          <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-slate-400 px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200">
            Preview
          </span>
        )}
      </label>

      {/* RENDER BY TYPE */}
      {(() => {
        // Yes/No Toggle Button
        if (field.type === 'yes_no_toggle') {
          const isYes = value === 'Yes';
          const isNo = value === 'No';
          return (
            <div className="flex gap-2">
              <button
                type="button"
                disabled={disabled}
                onClick={() => onChange('Yes')}
                className={`flex-1 py-2 px-4 rounded-xl text-xs font-bold font-mono transition-all border flex items-center justify-center gap-1.5 ${
                  isYes 
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-500/10' 
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {isYes && <Check className="h-3.5 w-3.5" />} Yes
              </button>
              <button
                type="button"
                disabled={disabled}
                onClick={() => onChange('No')}
                className={`flex-1 py-2 px-4 rounded-xl text-xs font-bold font-mono transition-all border flex items-center justify-center gap-1.5 ${
                  isNo 
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-500/10' 
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {isNo && <Check className="h-3.5 w-3.5" />} No
              </button>
            </div>
          );
        }

        // Text Area
        if (field.type === 'textarea') {
          return (
            <textarea
              id={idSafe}
              disabled={disabled}
              placeholder={field.placeholder || `Type your response here...`}
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              className={getInputStyles()}
              rows={4}
            />
          );
        }

        // Dropdown Select
        if (field.type === 'dropdown') {
          return (
            <div className="relative">
              <select
                id={idSafe}
                disabled={disabled}
                value={value || ''}
                onChange={(e) => onChange(e.target.value)}
                className={`${getInputStyles()} appearance-none pr-10`}
              >
                <option value="">{field.placeholder || 'Choose from options...'}</option>
                {field.options?.map(o => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-slate-400">
                <ChevronDown className="h-4 w-4" />
              </div>
            </div>
          );
        }

        // Country Dropdown
        if (field.type === 'country') {
          return (
            <div className="relative">
              <select
                id={idSafe}
                disabled={disabled}
                value={value || ''}
                onChange={(e) => onChange(e.target.value)}
                className={`${getInputStyles()} appearance-none pr-10`}
              >
                <option value="">Select country...</option>
                {COUNTRIES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-slate-400">
                <ChevronDown className="h-4 w-4" />
              </div>
            </div>
          );
        }

        // Province/State Dropdown
        if (field.type === 'state') {
          return (
            <div className="relative">
              <select
                id={idSafe}
                disabled={disabled}
                value={value || ''}
                onChange={(e) => onChange(e.target.value)}
                className={`${getInputStyles()} appearance-none pr-10`}
              >
                <option value="">Select province or state...</option>
                {PROVINCES.map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-slate-400">
                <ChevronDown className="h-4 w-4" />
              </div>
            </div>
          );
        }

        // Radio Buttons (Male/Female/Other or custom options)
        if (field.type === 'radio') {
          return (
            <div className="flex flex-wrap gap-4 pt-1">
              {field.options?.map((o, idx) => (
                <label key={idx} className="flex items-center gap-2 text-xs text-slate-600 font-semibold cursor-pointer select-none">
                  <input
                    type="radio"
                    disabled={disabled}
                    name={field.id}
                    checked={value === o}
                    onChange={() => onChange(o)}
                    className="text-blue-600 focus:ring-0 border-slate-300 w-4 h-4 cursor-pointer"
                  />
                  <span>{o}</span>
                </label>
              ))}
            </div>
          );
        }

        // Multi Checkboxes
        if (field.type === 'checkbox_multi') {
          const currentArr = Array.isArray(value) ? value : [];
          return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-1">
              {field.options?.map((o, idx) => {
                const isChecked = currentArr.includes(o);
                return (
                  <label key={idx} className="flex items-center gap-2 text-xs text-slate-600 font-medium cursor-pointer select-none bg-slate-50 p-2.5 rounded-lg border border-slate-100 hover:border-slate-200 hover:bg-slate-100/20 transition-all">
                    <input
                      type="checkbox"
                      disabled={disabled}
                      checked={isChecked}
                      onChange={() => {
                        const nextArr = isChecked 
                          ? currentArr.filter(item => item !== o)
                          : [...currentArr, o];
                        onChange(nextArr);
                      }}
                      className="rounded text-blue-600 focus:ring-0 border-slate-300 w-4 h-4 cursor-pointer"
                    />
                    <span className="truncate">{o}</span>
                  </label>
                );
              })}
            </div>
          );
        }

        // Multi Select Chips
        if (field.type === 'multi_select') {
          const currentArr = Array.isArray(value) ? value : [];
          return (
            <div className="space-y-2 pt-1">
              <div className="flex flex-wrap gap-1.5 p-2 rounded-xl bg-slate-50 border border-slate-200 min-h-[44px]">
                {currentArr.length === 0 ? (
                  <span className="text-slate-400 text-xs self-center px-1">Click options below to select...</span>
                ) : (
                  currentArr.map(val => (
                    <span key={val} className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-[11px] font-bold px-2.5 py-1 rounded-lg border border-blue-100">
                      {val}
                      {!disabled && (
                        <button
                          type="button"
                          onClick={() => onChange(currentArr.filter(v => v !== val))}
                          className="hover:text-blue-900 font-bold ml-0.5"
                        >
                          ×
                        </button>
                      )}
                    </span>
                  ))
                )}
              </div>
              <div className="flex flex-wrap gap-1">
                {field.options?.map(o => {
                  const isSelected = currentArr.includes(o);
                  return (
                    <button
                      type="button"
                      disabled={disabled}
                      key={o}
                      onClick={() => {
                        const nextArr = isSelected 
                          ? currentArr.filter(item => item !== o)
                          : [...currentArr, o];
                        onChange(nextArr);
                      }}
                      className={`text-[10px] font-semibold px-2 py-1 rounded-full transition-all border ${
                        isSelected 
                          ? 'bg-blue-600 text-white border-blue-600' 
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {o}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        }

        // Single Checkbox (terms/consent)
        if (field.type === 'checkbox') {
          return (
            <label className="flex items-start gap-2.5 text-xs text-slate-600 font-medium cursor-pointer select-none pt-1">
              <input
                type="checkbox"
                disabled={disabled}
                checked={!!value}
                onChange={(e) => onChange(e.target.checked)}
                className="rounded text-blue-600 focus:ring-0 border-slate-300 w-4 h-4 cursor-pointer shrink-0 mt-0.5"
              />
              <span className="leading-tight">{field.placeholder || 'I consent and agree to SaroHub verification audits.'}</span>
            </label>
          );
        }

        // Files Upload types: general, resume, transcript, cover_letter, certificate, portfolio_upload, image
        const fileTypes = ['file', 'file_multiple', 'image', 'resume', 'cover_letter', 'transcript', 'certificate', 'portfolio_upload'];
        if (fileTypes.includes(field.type)) {
          const isMultiple = field.type === 'file_multiple';
          const fileList = isMultiple ? (Array.isArray(value) ? value : []) : (value ? [value] : []);

          return (
            <div className="space-y-2">
              <div
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-xl p-5 text-center transition-all relative ${
                  dragActive ? 'border-blue-400 bg-blue-50/10' :
                  uploading ? 'border-blue-300 bg-blue-50/5' :
                  fileList.length > 0 ? 'border-emerald-300 bg-emerald-50/5' :
                  error ? 'border-rose-300 bg-rose-50/5' : 'border-slate-200 bg-slate-50 hover:bg-slate-100/50'
                }`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  id={idSafe}
                  multiple={isMultiple}
                  className="hidden"
                  disabled={disabled || uploading}
                  onChange={onFileUpload}
                  accept={
                    field.type === 'image' ? 'image/*' :
                    field.validation?.allowedFileTypes?.join(',') || '.pdf,.doc,.docx,.zip,.png,.jpg,.jpeg'
                  }
                />
                
                <label htmlFor={disabled ? undefined : idSafe} className="cursor-pointer block">
                  {getFileIcon()}
                  {uploading ? (
                    <span className="text-xs text-blue-600 font-mono font-semibold block animate-pulse">
                      Synchronizing artifact server-side...
                    </span>
                  ) : (
                    <div>
                      <span className="text-xs text-slate-700 font-bold block">
                        Drag & drop or <span className="text-blue-600 hover:underline">browse files</span>
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono block mt-1">
                        {field.type === 'image' ? 'Accepts PNG, JPG, JPEG' : 
                         `Accepts ${field.validation?.allowedFileTypes?.join(', ') || 'PDF, DOCX, ZIP'} (Max ${field.validation?.maxFileSizeMb || 5}MB)`}
                      </span>
                    </div>
                  )}
                </label>
              </div>

              {/* Uploaded File List */}
              {fileList.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  {fileList.map((fileName, index) => (
                    <div key={index} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-150 text-xs">
                      <div className="flex items-center gap-2 min-w-0">
                        <FileText className="h-4 w-4 text-cyan-600 shrink-0" />
                        <span className="text-slate-700 font-medium truncate font-mono text-[11px]">{fileName}</span>
                      </div>
                      {!disabled && onRemoveFile && (
                        <button
                          type="button"
                          onClick={() => onRemoveFile(isMultiple ? index : undefined)}
                          className="text-slate-400 hover:text-rose-500 p-1 rounded-lg hover:bg-slate-100 transition-colors"
                          title="Remove attached document"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        }

        // Standard line text and specific inputs (Full name, Email, Phone, Passport, Numbers, Dates, URLs)
        const getFieldIconPrefix = () => {
          switch(field.type) {
            case 'full_name': return <User className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />;
            case 'email': return <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />;
            case 'phone': return <Phone className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />;
            case 'cnic_passport': return <CreditCard className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />;
            case 'date': return <Calendar className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />;
            case 'number': return <Hash className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />;
            case 'url': return <Link className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />;
            case 'linkedin': return <Linkedin className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />;
            case 'github': return <Github className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />;
            default: return null;
          }
        };

        const iconPrefix = getFieldIconPrefix();
        const hasPrefix = iconPrefix !== null;

        let inputType = 'text';
        if (field.type === 'number') inputType = 'number';
        if (field.type === 'date') inputType = 'date';
        if (field.type === 'email') inputType = 'email';
        if (field.type === 'phone') inputType = 'tel';

        const getSmartPlaceholder = () => {
          if (field.placeholder) return field.placeholder;
          if (field.type === 'phone') return 'e.g. +1 (555) 019-2834';
          if (field.type === 'email') return 'e.g. attendee@company.com';
          if (field.type === 'full_name') return 'e.g. Sarah Jenkins';
          if (field.type === 'url') return 'https://example.com';
          if (field.type === 'linkedin') return 'https://linkedin.com/in/username';
          if (field.type === 'github') return 'https://github.com/username';
          if (field.type === 'number') return 'e.g. 5';
          if (field.type === 'cnic_passport') return 'e.g. A12345678 or 12345-6789012-3';
          return `e.g. Enter your ${field.label.toLowerCase()}...`;
        };

        return (
          <div className="relative">
            {iconPrefix}
            <input
              id={idSafe}
              disabled={disabled}
              type={inputType}
              placeholder={getSmartPlaceholder()}
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              className={`${getInputStyles()} ${hasPrefix ? 'pl-10' : ''}`}
            />
          </div>
        );
      })()}

      {renderDescription()}

      {error && (
        <span className="text-[10px] text-rose-500 font-mono block flex items-center gap-1 mt-1 font-semibold">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" /> {error}
        </span>
      )}
    </div>
  );
};

export default DynamicFormField;
