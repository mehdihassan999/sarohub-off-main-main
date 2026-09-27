import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { api } from '../../api';

export interface SEOHeadProps {
  pageRoute?: string;
  title?: string;
  description?: string;
  keywords?: string;
  canonicalUrl?: string;
  ogType?: 'website' | 'article' | 'product';
  ogImage?: string;
  structuredData?: Record<string, any> | Array<Record<string, any>>;
}

const DEFAULT_KEYWORDS =
  'SaroHub, SaroHub Technologies, SaroHub Skardu, SaroHub Pakistan, sarohub.com, SaroHub software, SaroHub ventures, custom software development Pakistan, digital products, software engineering Skardu, Gilgit-Baltistan IT company, software company Pakistan, AI solutions, web app development, mobile app development, SaaS development, tech partner';

// In-memory cache to prevent duplicate requests across components and route changes
let cachedSEOList: any[] | null = null;
let fetchPromise: Promise<any[]> | null = null;

function fetchSEOCached(): Promise<any[]> {
  if (cachedSEOList) return Promise.resolve(cachedSEOList);
  if (!fetchPromise) {
    fetchPromise = api
      .getSEO()
      .then((data) => {
        cachedSEOList = Array.isArray(data) ? data : [];
        fetchPromise = null;
        return cachedSEOList;
      })
      .catch((err) => {
        console.warn('[SEOHead] Could not fetch dynamic SEO profiles:', err);
        fetchPromise = null;
        return [];
      });
  }
  return fetchPromise;
}

function detectRouteKey(pathname: string): string {
  if (typeof window === 'undefined') return 'home';
  const clean = (pathname || '').replace(/^\/+|\/+$/g, '').toLowerCase();
  if (!clean) return 'home';
  const firstSegment = clean.split('/')[0];
  if (firstSegment === 'work' || firstSegment === 'portfolio' || firstSegment === 'case-studies') return 'projects';
  if (firstSegment === 'ventures') return 'products';
  if (firstSegment === 'blog' || firstSegment === 'insights') return 'blogs';
  if (firstSegment === 'how-we-work') return 'process';
  if (firstSegment === 'tech-stack') return 'technology';
  if (firstSegment === 'consultation' || firstSegment === 'book-consultation') return 'book';
  if (firstSegment === 'calculator' || firstSegment === 'project-estimator') return 'estimate';
  if (firstSegment === 'deck' || firstSegment === 'capabilities-deck') return 'capabilities';
  return firstSegment;
}

export function SEOHead({
  pageRoute,
  title,
  description,
  keywords,
  canonicalUrl,
  ogType = 'website',
  ogImage = 'https://sarohub.com/assets/sarohub-logo.png',
  structuredData
}: SEOHeadProps) {
  let currentPath = '';
  try {
    const location = useLocation();
    currentPath = location.pathname;
  } catch {
    currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
  }

  const [dynamicSEO, setDynamicSEO] = useState<any[]>(cachedSEOList || []);

  useEffect(() => {
    fetchSEOCached().then(setDynamicSEO);

    const handleDataUpdate = () => {
      cachedSEOList = null;
      fetchSEOCached().then(setDynamicSEO);
    };

    window.addEventListener('sarohub-data-updated', handleDataUpdate);
    return () => window.removeEventListener('sarohub-data-updated', handleDataUpdate);
  }, []);

  useEffect(() => {
    const routeKey = pageRoute || detectRouteKey(currentPath || (typeof window !== 'undefined' ? window.location.pathname : ''));
    const matched = dynamicSEO.find((item) => item.page_route === routeKey);

    const fallbackTitle = 'SaroHub Technologies | Enterprise Software, Digital Products & Venture Studio';
    const fallbackDesc = 'SaroHub Technologies builds high-impact web apps, custom software, mobile apps, and AI automation. Partner with us for MVP development, tech ventures, and enterprise engineering.';

    const activeTitle = (matched?.meta_title || title || fallbackTitle).trim();
    const activeDescription = (matched?.meta_description || description || fallbackDesc).trim();
    const activeKeywords = (matched?.meta_keywords || keywords || '').trim();
    const activeCanonical = (matched?.canonical_url || canonicalUrl || (typeof window !== 'undefined' ? `${window.location.origin}${currentPath || window.location.pathname}` : '')).trim();
    const activeOgImage = (matched?.og_image || ogImage || 'https://sarohub.com/assets/sarohub-logo.png').trim();
    const activeOgTitle = (matched?.og_title || activeTitle).trim();
    const activeOgDescription = (matched?.og_description || activeDescription).trim();
    const isNoIndex = Boolean(matched?.no_index);

    // 1. Update Document Title
    const fullTitle = activeTitle.includes('SaroHub Technologies')
      ? activeTitle
      : `${activeTitle} | SaroHub Technologies`;
    document.title = fullTitle;

    // Helper to update or create meta tags
    const setMeta = (name: string, content: string, isProperty: boolean = false) => {
      const selector = isProperty ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let tag = document.querySelector(selector) as HTMLMetaElement | null;
      if (!tag) {
        tag = document.createElement('meta');
        if (isProperty) {
          tag.setAttribute('property', name);
        } else {
          tag.setAttribute('name', name);
        }
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    };

    // 2. Standard Meta Tags
    setMeta('description', activeDescription);
    const combinedKeywords = activeKeywords ? `${activeKeywords}, ${DEFAULT_KEYWORDS}` : DEFAULT_KEYWORDS;
    setMeta('keywords', combinedKeywords);

    // Robots meta directive
    if (isNoIndex) {
      setMeta('robots', 'noindex, nofollow');
      setMeta('googlebot', 'noindex, nofollow');
    } else {
      setMeta('robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
      setMeta('googlebot', 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1');
    }

    // 3. Open Graph
    setMeta('og:title', activeOgTitle.includes('SaroHub Technologies') ? activeOgTitle : `${activeOgTitle} | SaroHub Technologies`, true);
    setMeta('og:description', activeOgDescription, true);
    setMeta('og:type', ogType, true);
    setMeta('og:site_name', 'SaroHub Technologies', true);
    if (activeCanonical) {
      setMeta('og:url', activeCanonical, true);
    }
    if (activeOgImage) {
      setMeta('og:image', activeOgImage, true);
    }

    // 4. Twitter Cards
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', fullTitle);
    setMeta('twitter:description', activeDescription);
    if (activeOgImage) {
      setMeta('twitter:image', activeOgImage);
    }

    // 5. Canonical Link
    if (activeCanonical) {
      let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
      if (!canonicalLink) {
        canonicalLink = document.createElement('link');
        canonicalLink.setAttribute('rel', 'canonical');
        document.head.appendChild(canonicalLink);
      }
      canonicalLink.setAttribute('href', activeCanonical);
    }

    // 6. JSON-LD Structured Data
    const SCRIPT_ID = 'sarohub-dynamic-jsonld';
    let scriptTag = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
    if (structuredData) {
      if (!scriptTag) {
        scriptTag = document.createElement('script');
        scriptTag.id = SCRIPT_ID;
        scriptTag.type = 'application/ld+json';
        document.head.appendChild(scriptTag);
      }
      scriptTag.textContent = JSON.stringify(structuredData);
    } else if (scriptTag) {
      scriptTag.remove();
    }
  }, [pageRoute, currentPath, title, description, keywords, canonicalUrl, ogType, ogImage, structuredData, dynamicSEO]);

  return null;
}

export default SEOHead;
