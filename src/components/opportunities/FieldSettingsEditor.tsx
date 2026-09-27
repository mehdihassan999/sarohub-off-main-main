import React from 'react';
import { 
  Trash2, ArrowUp, ArrowDown, Settings2, Sparkles, Check, ChevronDown, 
  ToggleLeft, ToggleRight, AlertTriangle, ArrowUpToLine, ArrowDownToLine
} from 'lucide-react';
import { OpportunityField } from '../../types';
import { FIELD_TYPES } from './FormBuilderPresets';

interface FieldSettingsEditorProps {
  field: OpportunityField;
  index: number;
  totalFields: number;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onUpdateField: (updated: OpportunityField) => void;
  onRemoveField: () => void;
  onMoveField: (direction: 'up' | 'down') => void;
  onMoveToLimit: (limit: 'top' | 'bottom') => void;
}

const FieldSettingsEditor: React.FC<FieldSettingsEditorProps> = ({
  field,
  index,
  totalFields,
  isExpanded,
  onToggleExpand,
  onUpdateField,
  onRemoveField,
  onMoveField,
  onMoveToLimit
}) => {
  
  // Handlers for specific fields
  const handleLabelChange = (val: string) => {
    onUpdateField({ ...field, label: val });
  };

  const handleTypeChange = (val: OpportunityField['type']) => {
    // Reset options if changed to a non-option type, or pre-populate if needed
    const updated: OpportunityField = { 
      ...field, 
      type: val,
      placeholder: field.placeholder || '',
      description: field.description || ''
    };
    
    if (['dropdown', 'radio', 'checkbox_multi', 'multi_select'].includes(val) && !field.options) {
      updated.options = ['Option A', 'Option B', 'Option C'];
    }
    
    onUpdateField(updated);
  };

  const handleRequiredToggle = () => {
    onUpdateField({ ...field, required: !field.required });
  };

  const handleDisabledToggle = () => {
    onUpdateField({ ...field, disabled: !field.disabled });
  };

  const handlePlaceholderChange = (val: string) => {
    onUpdateField({ ...field, placeholder: val || undefined });
  };

  const handleDescriptionChange = (val: string) => {
    onUpdateField({ ...field, description: val || undefined });
  };

  const handleOptionsChange = (val: string) => {
    const opts = val.split(',').map(s => s.trim()).filter(Boolean);
    onUpdateField({ ...field, options: opts.length > 0 ? opts : undefined });
  };

  // Validation updates
  const updateValidation = (key: string, val: any) => {
    const currentVal = field.validation || {};
    const nextVal = { ...currentVal, [key]: val };
    
    // Clean up empty fields
    if (val === undefined || val === '' || isNaN(val)) {
      delete nextVal[key as keyof typeof nextVal];
    }

    onUpdateField({ 
      ...field, 
      validation: Object.keys(nextVal).length > 0 ? nextVal : undefined 
    });
  };

  const isOptionType = ['dropdown', 'radio', 'checkbox_multi', 'multi_select'].includes(field.type);
  const isTextType = ['text', 'full_name', 'email', 'phone', 'cnic_passport', 'textarea', 'url', 'linkedin', 'github'].includes(field.type);
  const isNumberType = field.type === 'number';
  const isFileType = ['file', 'file_multiple', 'image', 'resume', 'cover_letter', 'transcript', 'certificate', 'portfolio_upload'].includes(field.type);

  return (
    <div className={`bg-slate-950 rounded-xl border transition-all duration-200 ${
      field.disabled ? 'border-slate-800 bg-slate-900/10 opacity-75' :
      isExpanded ? 'border-cyan-500/80 shadow-md shadow-cyan-500/5' : 'border-slate-900 hover:border-slate-800'
    }`}>
      {/* HEADER CARD SUMMARY */}
      <div className="p-3.5 flex items-center justify-between gap-3 cursor-pointer select-none" onClick={onToggleExpand}>
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-slate-600 font-mono font-bold text-xs">#{index + 1}</span>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <strong className="text-white text-xs font-sans truncate">{field.label || 'Unnamed Field'}</strong>
              {field.required && (
                <span className="text-[9px] font-mono font-bold uppercase bg-rose-950/40 text-rose-400 border border-rose-900/30 px-1.5 py-0.5 rounded">
                  Required
                </span>
              )}
              {field.disabled && (
                <span className="text-[9px] font-mono font-bold uppercase bg-slate-900 text-slate-500 border border-slate-800 px-1.5 py-0.5 rounded">
                  Disabled
                </span>
              )}
            </div>
            <span className="text-[10px] text-slate-500 font-mono block mt-0.5">
              Type: <strong className="text-slate-400 font-bold">{FIELD_TYPES.find(t => t.value === field.type)?.label || field.type}</strong>
            </span>
          </div>
        </div>

        {/* COMPACT REORDER & DELETE CONTROLS */}
        <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={() => onMoveToLimit('top')}
            disabled={index === 0}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-900 rounded disabled:opacity-20"
            title="Move to Top"
          >
            <ArrowUpToLine className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onMoveField('up')}
            disabled={index === 0}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-900 rounded disabled:opacity-20"
            title="Move Up"
          >
            <ArrowUp className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onMoveField('down')}
            disabled={index === totalFields - 1}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-900 rounded disabled:opacity-20"
            title="Move Down"
          >
            <ArrowDown className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onMoveToLimit('bottom')}
            disabled={index === totalFields - 1}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-900 rounded disabled:opacity-20"
            title="Move to Bottom"
          >
            <ArrowDownToLine className="h-3.5 w-3.5" />
          </button>
          <div className="h-4 w-px bg-slate-900 mx-1"></div>
          <button
            type="button"
            onClick={onToggleExpand}
            className={`p-1.5 rounded transition-colors ${isExpanded ? 'text-cyan-400 bg-cyan-950/20' : 'text-slate-500 hover:text-white hover:bg-slate-900'}`}
            title="Configure Field Properties"
          >
            <Settings2 className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={onRemoveField}
            className="p-1.5 text-slate-600 hover:text-rose-400 hover:bg-slate-900 rounded"
            title="Delete Field"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* EXPANDED PROPERTIES EDITOR PANEL */}
      {isExpanded && (
        <div className="px-4 pb-4 pt-1 border-t border-slate-900 grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-950/80 rounded-b-xl">
          {/* Column 1: Core Details */}
          <div className="space-y-3">
            <h5 className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 border-b border-slate-900 pb-1 mt-2">
              General Settings
            </h5>
            
            <div>
              <label className="block text-[10px] font-mono text-slate-500 mb-1">Field Type *</label>
              <select
                value={field.type}
                onChange={(e) => handleTypeChange(e.target.value as any)}
                className="w-full rounded bg-slate-900 border border-slate-800 px-2.5 py-1.5 text-xs text-white focus:outline-none"
              >
                {FIELD_TYPES.map(t => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-mono text-slate-500 mb-1">Field Label / Name *</label>
              <input
                type="text"
                value={field.label}
                onChange={(e) => handleLabelChange(e.target.value)}
                placeholder="e.g., Current Academic Year"
                className="w-full rounded bg-slate-900 border border-slate-800 px-2.5 py-1.5 text-xs text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono text-slate-500 mb-1">Placeholder Text (Optional)</label>
              <input
                type="text"
                value={field.placeholder || ''}
                onChange={(e) => handlePlaceholderChange(e.target.value)}
                placeholder="e.g., Enter choice or text..."
                className="w-full rounded bg-slate-900 border border-slate-800 px-2.5 py-1.5 text-xs text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono text-slate-500 mb-1">Help Text / Description (Optional)</label>
              <textarea
                value={field.description || ''}
                onChange={(e) => handleDescriptionChange(e.target.value)}
                placeholder="Explain the field requirement or acceptable format..."
                rows={2}
                className="w-full rounded bg-slate-900 border border-slate-800 px-2.5 py-1.5 text-xs text-white focus:outline-none"
              />
            </div>

            {/* Behaviour toggles */}
            <div className="flex flex-wrap gap-4 pt-1">
              <label className="flex items-center gap-2 text-xs text-slate-400 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={field.required}
                  onChange={handleRequiredToggle}
                  className="rounded text-cyan-500 bg-slate-900 border-slate-800 focus:ring-0"
                />
                <span>Required candidate field</span>
              </label>

              <label className="flex items-center gap-2 text-xs text-slate-400 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={!!field.disabled}
                  onChange={handleDisabledToggle}
                  className="rounded text-slate-500 bg-slate-900 border-slate-800 focus:ring-0"
                />
                <span>Disable field (Hide from applicant)</span>
              </label>
            </div>
          </div>

          {/* Column 2: Options and Rules */}
          <div className="space-y-3">
            <h5 className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 border-b border-slate-900 pb-1 mt-2">
              Behavior & Custom Validations
            </h5>

            {/* Dynamic Options for Selection Fields */}
            {isOptionType && (
              <div>
                <label className="block text-[10px] font-mono text-cyan-400 mb-1 font-bold">Choices (Comma-separated) *</label>
                <input
                  type="text"
                  value={field.options?.join(', ') || ''}
                  onChange={(e) => handleOptionsChange(e.target.value)}
                  placeholder="e.g., Sri Lanka, India, Canada"
                  className="w-full rounded bg-slate-900 border border-slate-800 px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono text-[11px]"
                />
                <span className="text-[9px] text-slate-500 mt-1 block">Separating elements by commas creates unique picklist nodes.</span>
              </div>
            )}

            {/* Text Constraints */}
            {isTextType && (
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-mono text-slate-500 mb-1">Min Length (Chars)</label>
                  <input
                    type="number"
                    value={field.validation?.minLength || ''}
                    onChange={(e) => updateValidation('minLength', parseInt(e.target.value))}
                    placeholder="None"
                    className="w-full rounded bg-slate-900 border border-slate-800 px-2.5 py-1.5 text-xs text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-slate-500 mb-1">Max Length (Chars)</label>
                  <input
                    type="number"
                    value={field.validation?.maxLength || ''}
                    onChange={(e) => updateValidation('maxLength', parseInt(e.target.value))}
                    placeholder="None"
                    className="w-full rounded bg-slate-900 border border-slate-800 px-2.5 py-1.5 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>
            )}

            {/* Number constraints */}
            {isNumberType && (
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-mono text-slate-500 mb-1">Min Acceptable Value</label>
                  <input
                    type="number"
                    value={field.validation?.minValue ?? ''}
                    onChange={(e) => updateValidation('minValue', parseFloat(e.target.value))}
                    placeholder="None"
                    className="w-full rounded bg-slate-900 border border-slate-800 px-2.5 py-1.5 text-xs text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-slate-500 mb-1">Max Acceptable Value</label>
                  <input
                    type="number"
                    value={field.validation?.maxValue ?? ''}
                    onChange={(e) => updateValidation('maxValue', parseFloat(e.target.value))}
                    placeholder="None"
                    className="w-full rounded bg-slate-900 border border-slate-800 px-2.5 py-1.5 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>
            )}

            {/* File upload constraints */}
            {isFileType && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-mono text-slate-500 mb-1">Max File Size (MB)</label>
                    <input
                      type="number"
                      value={field.validation?.maxFileSizeMb || ''}
                      onChange={(e) => updateValidation('maxFileSizeMb', parseInt(e.target.value))}
                      placeholder="e.g., 5"
                      className="w-full rounded bg-slate-900 border border-slate-800 px-2.5 py-1.5 text-xs text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-slate-500 mb-1">Max Files Count</label>
                    <input
                      type="number"
                      disabled={field.type !== 'file_multiple'}
                      value={field.validation?.maxFilesCount || ''}
                      onChange={(e) => updateValidation('maxFilesCount', parseInt(e.target.value))}
                      placeholder="e.g., 10"
                      className="w-full rounded bg-slate-900 border border-slate-800 px-2.5 py-1.5 text-xs text-white focus:outline-none disabled:opacity-40"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-slate-500 mb-1">Allowed Extensions (Comma-separated)</label>
                  <input
                    type="text"
                    value={field.validation?.allowedFileTypes?.join(', ') || ''}
                    onChange={(e) => {
                      const exts = e.target.value.split(',').map(s => s.trim().toLowerCase()).filter(s => s.startsWith('.'));
                      updateValidation('allowedFileTypes', exts.length > 0 ? exts : undefined);
                    }}
                    placeholder="e.g., .pdf, .docx, .zip"
                    className="w-full rounded bg-slate-900 border border-slate-800 px-2.5 py-1.5 text-xs text-white focus:outline-none font-mono text-[11px]"
                  />
                  <span className="text-[9px] text-slate-500 mt-1 block">Specify matching formats with preceding dots, separated by commas.</span>
                </div>
              </div>
            )}

            {/* Custom error message */}
            <div>
              <label className="block text-[10px] font-mono text-slate-500 mb-1">Custom Error Message (Optional)</label>
              <input
                type="text"
                value={field.validation?.customErrorMessage || ''}
                onChange={(e) => updateValidation('customErrorMessage', e.target.value)}
                placeholder="Overriding system error description..."
                className="w-full rounded bg-slate-900 border border-slate-800 px-2.5 py-1.5 text-xs text-white focus:outline-none"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FieldSettingsEditor;
