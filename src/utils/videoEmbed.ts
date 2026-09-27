/**
 * Video Embed Utilities
 * Supports YouTube, Loom, Vimeo, and Direct Video Files (MP4/WebM)
 */

export interface VideoEmbedInfo {
  provider: 'youtube' | 'loom' | 'vimeo' | 'direct' | 'unknown';
  embedUrl: string;
  isDirectVideo: boolean;
  thumbnailUrl?: string;
  videoId?: string;
  isValid: boolean;
}

export function getVideoEmbedInfo(rawUrl: string): VideoEmbedInfo {
  if (!rawUrl || typeof rawUrl !== 'string') {
    return {
      provider: 'unknown',
      embedUrl: '',
      isDirectVideo: false,
      isValid: false
    };
  }

  const url = rawUrl.trim();

  // 1. YouTube detection (watch, share, shorts, embed, nocookie)
  // Matches:
  // - https://www.youtube.com/watch?v=ID
  // - https://m.youtube.com/watch?v=ID
  // - https://youtu.be/ID
  // - https://www.youtube.com/shorts/ID
  // - https://www.youtube.com/embed/ID
  // - https://www.youtube-nocookie.com/embed/ID
  const ytMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=|shorts\/)|youtu\.be\/)([^"&?\/\s]{11})/i);
  if (ytMatch && ytMatch[1]) {
    const videoId = ytMatch[1];
    return {
      provider: 'youtube',
      videoId,
      embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}`,
      thumbnailUrl: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
      isDirectVideo: false,
      isValid: true
    };
  }

  // 2. Loom detection (share or embed)
  // Matches:
  // - https://www.loom.com/share/ID
  // - https://www.loom.com/embed/ID
  const loomMatch = url.match(/loom\.com\/(?:share|embed)\/([a-zA-Z0-9_-]+)/i);
  if (loomMatch && loomMatch[1]) {
    const videoId = loomMatch[1];
    return {
      provider: 'loom',
      videoId,
      embedUrl: `https://www.loom.com/embed/${videoId}`,
      isDirectVideo: false,
      isValid: true
    };
  }

  // 3. Vimeo detection
  // Matches:
  // - https://vimeo.com/ID
  // - https://player.vimeo.com/video/ID
  const vimeoMatch = url.match(/(?:vimeo\.com\/|player\.vimeo\.com\/video\/)([0-9]+)/i);
  if (vimeoMatch && vimeoMatch[1]) {
    const videoId = vimeoMatch[1];
    return {
      provider: 'vimeo',
      videoId,
      embedUrl: `https://player.vimeo.com/video/${videoId}`,
      isDirectVideo: false,
      isValid: true
    };
  }

  // 4. Direct video files
  const isDirect = /\.(mp4|webm|ogg|mov|m4v)(\?.*)?$/i.test(url) || url.includes('/video/upload/') || url.includes('blob:');
  if (isDirect) {
    return {
      provider: 'direct',
      embedUrl: url,
      isDirectVideo: true,
      isValid: true
    };
  }

  // 5. Fallback: if already an HTTPS URL, treat as embeddable or direct
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return {
      provider: 'unknown',
      embedUrl: url,
      isDirectVideo: false,
      isValid: true
    };
  }

  return {
    provider: 'unknown',
    embedUrl: url,
    isDirectVideo: false,
    isValid: false
  };
}

/**
 * Normalizes user input into a clean embed-ready URL
 */
export function normalizeVideoUrl(rawUrl: string): string {
  const info = getVideoEmbedInfo(rawUrl);
  return info.embedUrl || rawUrl.trim();
}
