/**
 * SaroHub Technologies (Private) Limited
 * Cloudinary Image Uploader Component
 * Premium drag-and-drop image upload with preview and progress
 */

import React, { useState, useRef, useCallback } from 'react';
import { Upload, X, Image, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { api } from '../api';

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  className?: string;
}

export default function ImageUploader({ value, onChange, label = 'Image', className = '' }: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file (JPEG, PNG, WebP, etc.)');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be under 10MB.');
      return;
    }

    setError(null);
    setIsUploading(true);
    setUploadProgress(0);

    // Simulate progress steps while uploading
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + Math.random() * 15;
      });
    }, 200);

    try {
      const result = await api.uploadImage(file);
      clearInterval(progressInterval);
      setUploadProgress(100);
      onChange(result.url);
      
      // Reset progress after a brief moment
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
      }, 600);
    } catch (err: any) {
      clearInterval(progressInterval);
      setError(err.message || 'Upload failed. Please try again.');
      setIsUploading(false);
      setUploadProgress(0);
    }
  }, [onChange]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  }, [handleFile]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
    // Reset input so the same file can be re-selected
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [handleFile]);

  const handleRemove = useCallback(() => {
    onChange('');
    setError(null);
  }, [onChange]);

  return (
    <div className={className}>
      <label className="block text-xs font-mono text-slate-500 mb-1.5">{label}</label>

      {/* Preview Mode — when an image URL exists */}
      {value && !isUploading ? (
        <div className="relative group rounded-xl overflow-hidden border border-slate-800 bg-slate-900/50">
          <img
            src={value}
            alt="Uploaded preview"
            className="w-full h-36 object-cover"
            referrerPolicy="no-referrer"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMTIwIiBmaWxsPSJub25lIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyMCIgZmlsbD0iIzFhMWEyZSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNjQ3NDhiIiBmb250LXNpemU9IjEyIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIj5JbWFnZSBQcmV2aWV3PC90ZXh0Pjwvc3ZnPg==';
            }}
          />
          {/* Overlay actions */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="rounded-lg bg-cyan-500/20 border border-cyan-500/40 px-3 py-1.5 text-[10px] font-mono text-cyan-400 hover:bg-cyan-500/30 transition-colors"
            >
              Replace
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="rounded-lg bg-rose-500/20 border border-rose-500/40 px-3 py-1.5 text-[10px] font-mono text-rose-400 hover:bg-rose-500/30 transition-colors"
            >
              Remove
            </button>
          </div>
          {/* URL indicator */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-3 py-2">
            <div className="flex items-center gap-1.5">
              <CheckCircle className="h-3 w-3 text-emerald-400 shrink-0" />
              <span className="text-[9px] font-mono text-emerald-400/80 truncate">{value}</span>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Upload Zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => !isUploading && fileInputRef.current?.click()}
            className={`
              relative rounded-xl border-2 border-dashed transition-all duration-300 cursor-pointer
              ${isUploading
                ? 'border-cyan-500/40 bg-cyan-950/10'
                : isDragging
                  ? 'border-cyan-400 bg-cyan-950/20 scale-[1.01] shadow-lg shadow-cyan-500/10'
                  : 'border-slate-700 bg-slate-900/30 hover:border-slate-600 hover:bg-slate-900/50'
              }
            `}
          >
            <div className="flex flex-col items-center justify-center py-6 px-4">
              {isUploading ? (
                <>
                  <Loader2 className="h-7 w-7 text-cyan-400 animate-spin mb-2" />
                  <span className="text-[10px] font-mono text-cyan-400 mb-3">Uploading to Cloudinary...</span>
                  {/* Progress bar */}
                  <div className="w-full max-w-[200px] h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 rounded-full transition-all duration-300 ease-out"
                      style={{ width: `${Math.min(uploadProgress, 100)}%` }}
                    />
                  </div>
                  <span className="text-[9px] font-mono text-slate-500 mt-1.5">{Math.round(uploadProgress)}%</span>
                </>
              ) : (
                <>
                  <div className={`
                    p-2.5 rounded-xl mb-2 transition-colors duration-300
                    ${isDragging ? 'bg-cyan-500/20 text-cyan-400' : 'bg-slate-800/50 text-slate-500'}
                  `}>
                    <Upload className="h-5 w-5" />
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 mb-0.5">
                    {isDragging ? 'Drop image here' : 'Drag & drop or click to browse'}
                  </span>
                  <span className="text-[9px] font-mono text-slate-600">
                    JPEG, PNG, WebP • Max 10MB
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Toggle to URL input */}
          {!isUploading && (
            <div className="mt-2">
              <button
                type="button"
                onClick={() => setShowUrlInput(!showUrlInput)}
                className="text-[9px] font-mono text-slate-500 hover:text-cyan-400 transition-colors flex items-center gap-1"
              >
                <Image className="h-3 w-3" />
                {showUrlInput ? 'Hide URL input' : 'Or paste image URL manually'}
              </button>

              {showUrlInput && (
                <input
                  type="text"
                  placeholder="https://..."
                  value={value}
                  onChange={(e) => onChange(e.target.value)}
                  className="mt-1.5 w-full rounded-lg bg-slate-900 border border-slate-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500/40 placeholder-slate-600"
                />
              )}
            </div>
          )}
        </>
      )}

      {/* Error state */}
      {error && (
        <div className="mt-2 flex items-start gap-1.5 text-[10px] text-rose-400">
          <AlertCircle className="h-3 w-3 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
}
