import React, { useState, useEffect, useRef } from 'react';
import { 
  FileText, Download, ExternalLink, X, CheckCircle2, 
  AlertCircle, Loader2, ZoomIn, ZoomOut, RotateCcw, 
  ChevronLeft, ChevronRight, Image as ImageIcon, Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import * as pdfjsLib from 'pdfjs-dist';
import { getAuthToken } from '../../api';

// Initialize PDF.js worker using unpkg or cdnjs
if (typeof window !== 'undefined') {
  try {
    // Prefer cdnjs matching version or unpkg fallback
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
  } catch (e) {
    console.warn('PDF.js worker initialization notice:', e);
  }
}

interface DocumentPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentUrl: string;
  filename?: string;
  candidateName?: string;
  appliedPosition?: string;
  onShortlist?: () => void;
  status?: string;
}

/**
 * Universally downloads an attached candidate CV or opportunity document.
 * Leverages the server proxy to ensure cross-origin, local upload, base64, and Cloudinary files
 * download reliably with the correct filename.
 */
export async function downloadApplicationDocument(
  fileUrl: string,
  fileName?: string,
  onError?: (err: string) => void
): Promise<boolean> {
  if (!fileUrl) {
    onError?.('No document attachment URL provided.');
    return false;
  }

  const cleanName = (fileName || 'Candidate_CV').replace(/[^a-zA-Z0-9._-]/g, '_');
  const safeFilename = /\.pdf$/i.test(cleanName) ? cleanName : `${cleanName}.pdf`;

  const token = getAuthToken() || localStorage.getItem('sarohub_auth_token') || localStorage.getItem('sarohub_token') || '';
  const downloadEndpoint = `/api/download-document?url=${encodeURIComponent(fileUrl)}&filename=${encodeURIComponent(safeFilename)}${token ? `&token=${encodeURIComponent(token)}` : ''}`;

  try {
    const response = await fetch(downloadEndpoint, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });

    if (!response.ok) {
      throw new Error(`Server returned HTTP ${response.status} while fetching document.`);
    }

    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = safeFilename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(blobUrl), 2000);
    return true;
  } catch (err: any) {
    console.warn('Direct blob stream failed, attempting proxy endpoint download:', err);
    try {
      // Fallback directly to proxy endpoint, NEVER to raw Cloudinary URL
      const fallbackLink = document.createElement('a');
      fallbackLink.href = downloadEndpoint;
      fallbackLink.download = safeFilename;
      document.body.appendChild(fallbackLink);
      fallbackLink.click();
      fallbackLink.remove();
      return true;
    } catch (fallbackErr) {
      onError?.(err.message || 'Unable to download the document. Please try again.');
      return false;
    }
  }
}

export default function DocumentPreviewModal({
  isOpen,
  onClose,
  documentUrl,
  filename,
  candidateName = 'Candidate',
  appliedPosition,
  onShortlist,
  status
}: DocumentPreviewModalProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  const [loadingProgressText, setLoadingProgressText] = useState('Fetching document securely...');
  
  // PDF.js State
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [pageNum, setPageNum] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [scale, setScale] = useState<number>(1.15);
  const [isRenderingPage, setIsRenderingPage] = useState(false);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [isImageFile, setIsImageFile] = useState(false);
  const [renderFallback, setRenderFallback] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const renderTaskRef = useRef<any>(null);

  const safeFilename = filename || `CV_${candidateName.replace(/\s+/g, '_')}.pdf`;
  const isImage = /\.(png|jpe?g|webp|gif)$/i.test(safeFilename) || /\.(png|jpe?g|webp|gif)$/i.test(documentUrl);

  // 1. Fetch document data and initialize PDF.js or Image
  useEffect(() => {
    if (!isOpen || !documentUrl) {
      setPdfDoc(null);
      setPageNum(1);
      setTotalPages(0);
      setRenderFallback(false);
      if (imagePreviewUrl) {
        URL.revokeObjectURL(imagePreviewUrl);
        setImagePreviewUrl(null);
      }
      return;
    }

    let isMounted = true;
    setIsLoadingPreview(true);
    setErrorMessage(null);
    setRenderFallback(false);
    setIsImageFile(isImage);

    const token = getAuthToken() || localStorage.getItem('sarohub_auth_token') || localStorage.getItem('sarohub_token') || '';
    const viewEndpoint = `/api/documents/view?url=${encodeURIComponent(documentUrl)}&filename=${encodeURIComponent(safeFilename)}${token ? `&token=${encodeURIComponent(token)}` : ''}`;

    setLoadingProgressText('Connecting to secure document proxy...');

    fetch(viewEndpoint, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    })
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(`Server returned HTTP ${res.status} while fetching document.`);
        }
        setLoadingProgressText('Decoding document streams...');
        const buffer = await res.arrayBuffer();

        if (!isMounted) return;

        // Check if image
        if (isImage) {
          const blob = new Blob([buffer]);
          const url = URL.createObjectURL(blob);
          setImagePreviewUrl(url);
          setIsLoadingPreview(false);
          return;
        }

        // PDF document loading via PDF.js
        setLoadingProgressText('Parsing PDF structure...');
        try {
          const loadingTask = pdfjsLib.getDocument({
            data: new Uint8Array(buffer),
            cMapUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.10.38/cmaps/',
            cMapPacked: true
          });

          const loadedPdf = await loadingTask.promise;
          if (!isMounted) return;

          setPdfDoc(loadedPdf);
          setTotalPages(loadedPdf.numPages);
          setPageNum(1);
          setIsLoadingPreview(false);
        } catch (pdfParseErr: any) {
          console.warn('PDF.js parse warning:', pdfParseErr);
          if (isMounted) {
            setRenderFallback(true);
            setIsLoadingPreview(false);
          }
        }
      })
      .catch((err: any) => {
        console.error('Failed to load document preview:', err);
        if (isMounted) {
          setErrorMessage(err.message || 'Unable to load preview automatically.');
          setRenderFallback(true);
          setIsLoadingPreview(false);
        }
      });

    return () => {
      isMounted = false;
      if (renderTaskRef.current) {
        try {
          renderTaskRef.current.cancel();
        } catch (_) {}
      }
    };
  }, [isOpen, documentUrl]);

  // 2. Render active page on HTML5 Canvas
  useEffect(() => {
    if (!pdfDoc || !canvasRef.current || isImageFile) return;

    let isMounted = true;
    setIsRenderingPage(true);

    // Cancel any previous in-flight render task
    if (renderTaskRef.current) {
      try {
        renderTaskRef.current.cancel();
      } catch (_) {}
    }

    pdfDoc.getPage(pageNum).then((page: any) => {
      if (!isMounted || !canvasRef.current) return;

      const viewport = page.getViewport({ scale });
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      if (!context) return;

      // Handle HiDPI displays
      const outputScale = window.devicePixelRatio || 1;
      canvas.width = Math.floor(viewport.width * outputScale);
      canvas.height = Math.floor(viewport.height * outputScale);
      canvas.style.width = `${Math.floor(viewport.width)}px`;
      canvas.style.height = `${Math.floor(viewport.height)}px`;

      const transform = outputScale !== 1 ? [outputScale, 0, 0, outputScale, 0, 0] : null;

      const renderContext = {
        canvasContext: context,
        transform: transform,
        viewport: viewport
      };

      const renderTask = page.render(renderContext);
      renderTaskRef.current = renderTask;

      renderTask.promise
        .then(() => {
          if (isMounted) setIsRenderingPage(false);
        })
        .catch((renderErr: any) => {
          if (renderErr?.name !== 'RenderingCancelledException') {
            console.warn('Canvas rendering error:', renderErr);
          }
          if (isMounted) setIsRenderingPage(false);
        });
    }).catch((pageErr: any) => {
      console.warn('Failed to retrieve PDF page:', pageErr);
      if (isMounted) setIsRenderingPage(false);
    });

    return () => {
      isMounted = false;
    };
  }, [pdfDoc, pageNum, scale, isImageFile]);

  const handleDownload = async () => {
    setIsDownloading(true);
    setErrorMessage(null);
    const ok = await downloadApplicationDocument(documentUrl, safeFilename, (err) => {
      setErrorMessage(err);
    });
    setIsDownloading(false);
    if (ok) {
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    }
  };

  const handleOpenInNewTab = () => {
    const token = getAuthToken() || localStorage.getItem('sarohub_auth_token') || localStorage.getItem('sarohub_token') || '';
    const viewUrl = `/api/documents/view?url=${encodeURIComponent(documentUrl)}&filename=${encodeURIComponent(safeFilename)}${token ? `&token=${encodeURIComponent(token)}` : ''}`;
    window.open(viewUrl, '_blank', 'noopener,noreferrer');
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/85 backdrop-blur-md"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 12 }}
          className="relative w-full max-w-5xl max-h-[92vh] flex flex-col rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden z-10 text-white"
        >
          {/* Header Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 border-b border-slate-800 bg-slate-950/70">
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 shrink-0">
                {isImageFile ? <ImageIcon className="h-5 w-5" /> : <FileText className="h-5 w-5" />}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-display font-bold text-white text-sm sm:text-base truncate">
                    {candidateName}
                  </h3>
                  <span className="hidden sm:inline-block text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                    CV Preview
                  </span>
                </div>
                <p className="text-xs text-slate-400 truncate flex items-center gap-1.5 font-mono">
                  <span>{appliedPosition ? `Role: ${appliedPosition}` : 'Candidate Profile'}</span>
                  <span>•</span>
                  <span className="text-slate-500 truncate max-w-[200px]">{safeFilename}</span>
                </p>
              </div>
            </div>

            {/* Viewer Controls & Action Buttons */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Pagination Controls for Multi-page PDFs */}
              {totalPages > 1 && !isImageFile && (
                <div className="flex items-center gap-1 bg-slate-950/80 border border-slate-800 rounded-xl px-2 py-1 text-xs font-mono text-slate-300">
                  <button
                    onClick={() => setPageNum(p => Math.max(1, p - 1))}
                    disabled={pageNum <= 1 || isRenderingPage}
                    className="p-1 hover:text-cyan-400 disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
                    title="Previous Page"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" />
                  </button>
                  <span className="px-1.5 font-semibold text-[11px]">
                    {pageNum} / {totalPages}
                  </span>
                  <button
                    onClick={() => setPageNum(p => Math.min(totalPages, p + 1))}
                    disabled={pageNum >= totalPages || isRenderingPage}
                    className="p-1 hover:text-cyan-400 disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
                    title="Next Page"
                  >
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}

              {/* Zoom Controls */}
              {!isImageFile && pdfDoc && (
                <div className="hidden sm:flex items-center gap-1 bg-slate-950/80 border border-slate-800 rounded-xl px-2 py-1 text-xs font-mono text-slate-300">
                  <button
                    onClick={() => setScale(s => Math.max(0.6, s - 0.2))}
                    disabled={scale <= 0.6 || isRenderingPage}
                    className="p-1 hover:text-cyan-400 disabled:opacity-30 cursor-pointer"
                    title="Zoom Out"
                  >
                    <ZoomOut className="h-3.5 w-3.5" />
                  </button>
                  <span className="text-[10px] text-slate-400 px-1 font-mono">
                    {Math.round(scale * 100)}%
                  </span>
                  <button
                    onClick={() => setScale(s => Math.min(2.4, s + 0.2))}
                    disabled={scale >= 2.4 || isRenderingPage}
                    className="p-1 hover:text-cyan-400 disabled:opacity-30 cursor-pointer"
                    title="Zoom In"
                  >
                    <ZoomIn className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => setScale(1.15)}
                    className="p-1 hover:text-cyan-400 text-slate-500 hover:text-slate-300 cursor-pointer"
                    title="Reset Zoom"
                  >
                    <RotateCcw className="h-3 w-3" />
                  </button>
                </div>
              )}

              {/* Shortlist Action */}
              {onShortlist && status !== 'shortlisted' && (
                <button
                  onClick={() => {
                    onShortlist();
                    onClose();
                  }}
                  className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-[0_2px_8px_rgba(16,185,129,0.25)]"
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Shortlist</span>
                </button>
              )}

              {/* Download Action */}
              <button
                onClick={handleDownload}
                disabled={isDownloading}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono font-bold text-xs transition-colors cursor-pointer disabled:opacity-50"
                title="Download Document"
              >
                {isDownloading ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : downloadSuccess ? (
                  <CheckCircle2 className="h-3.5 w-3.5 text-slate-950" />
                ) : (
                  <Download className="h-3.5 w-3.5" />
                )}
                <span>{downloadSuccess ? 'Downloaded!' : 'Download'}</span>
              </button>

              {/* Open in isolated tab */}
              <button
                onClick={handleOpenInNewTab}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                title="Open in new window"
              >
                <ExternalLink className="h-4 w-4" />
              </button>

              {/* Close Modal */}
              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
                title="Close Viewer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Diagnostic Error Banner if any */}
          {errorMessage && (
            <div className="px-5 py-2 bg-rose-950/60 border-b border-rose-900/50 flex items-center justify-between gap-2 text-rose-300 text-xs font-mono">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
              <button
                onClick={handleOpenInNewTab}
                className="underline hover:text-white cursor-pointer"
              >
                Open in new tab
              </button>
            </div>
          )}

          {/* Document Display Canvas */}
          <div className="flex-1 min-h-[460px] max-h-[72vh] p-4 bg-slate-950/60 overflow-auto flex flex-col items-center justify-start relative select-none">
            {isLoadingPreview ? (
              <div className="flex flex-col items-center justify-center h-full min-h-[380px] gap-3 text-slate-400 font-mono text-xs">
                <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
                <p>{loadingProgressText}</p>
              </div>
            ) : isImageFile && imagePreviewUrl ? (
              <div className="flex items-center justify-center p-2 max-w-full">
                <img
                  src={imagePreviewUrl}
                  alt={`Document preview for ${candidateName}`}
                  className="max-h-[66vh] max-w-full rounded-xl border border-slate-800 shadow-2xl object-contain bg-white/5"
                />
              </div>
            ) : renderFallback ? (
              <div className="text-center p-8 max-w-md my-auto">
                <div className="w-16 h-16 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-center mx-auto mb-4 text-cyan-400">
                  <FileText className="h-8 w-8" />
                </div>
                <h4 className="font-display font-bold text-white text-base">Direct Document Viewer</h4>
                <p className="text-xs text-slate-400 mt-2 mb-6 leading-relaxed">
                  The candidate document ({safeFilename}) is verified on the secure server proxy. You can download the file or open it directly in a dedicated tab.
                </p>
                <div className="flex flex-wrap gap-3 justify-center">
                  <button
                    onClick={handleDownload}
                    className="px-5 py-2.5 rounded-xl bg-cyan-500 text-slate-950 text-xs font-mono font-bold hover:bg-cyan-400 flex items-center gap-2 cursor-pointer shadow-lg shadow-cyan-500/20"
                  >
                    <Download className="h-4 w-4" /> Download Document
                  </button>
                  <button
                    onClick={handleOpenInNewTab}
                    className="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-200 text-xs font-mono hover:bg-slate-700 flex items-center gap-2 cursor-pointer border border-slate-700"
                  >
                    <ExternalLink className="h-4 w-4" /> Open in New Tab
                  </button>
                </div>
              </div>
            ) : (
              <div className="relative flex flex-col items-center justify-center shadow-2xl my-2">
                {isRenderingPage && (
                  <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px] flex items-center justify-center z-10 rounded-xl">
                    <Loader2 className="h-6 w-6 animate-spin text-cyan-400" />
                  </div>
                )}
                {/* HTML5 Canvas Rendering - Completely immune to Chrome extension/iframe sandboxing */}
                <canvas
                  ref={canvasRef}
                  className="rounded-xl border border-slate-700/80 shadow-[0_8px_30px_rgb(0,0,0,0.6)] bg-white transition-transform"
                />
              </div>
            )}
          </div>

          {/* Footer Bar */}
          <div className="px-5 py-3 border-t border-slate-800 bg-slate-950/70 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
            <div className="text-slate-400 flex items-center gap-2">
              <span>Candidate Status:</span>
              <span className={`font-bold uppercase px-2.5 py-0.5 rounded text-[10px] ${
                status === 'shortlisted' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                status === 'rejected' ? 'bg-rose-950 text-rose-400 border border-rose-800' :
                'bg-amber-950 text-amber-400 border border-amber-800'
              }`}>
                {status || 'Pending Review'}
              </span>
            </div>

            <div className="flex items-center gap-4 text-slate-400 text-[11px]">
              <span className="hidden sm:inline">Protected via SaroHub Proxy</span>
              <button
                onClick={handleDownload}
                className="text-cyan-400 hover:text-cyan-300 underline cursor-pointer"
              >
                Save Copy
              </button>
              <button
                onClick={handleOpenInNewTab}
                className="text-slate-300 hover:text-white flex items-center gap-1 cursor-pointer"
              >
                <span>Fullscreen</span>
                <ExternalLink className="h-3 w-3" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
