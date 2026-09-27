import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  name?: string;
  label?: string;
  url?: string;
  path?: string;
  isCurrent?: boolean;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export default function Breadcrumbs({ items, className = '' }: BreadcrumbsProps) {
  // Generate JSON-LD BreadcrumbList Schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => {
      const itemUrl = item.url || item.path || '/';
      return {
        '@type': 'ListItem',
        position: index + 1,
        name: item.name || item.label || '',
        item: itemUrl.startsWith('http') ? itemUrl : `https://sarohub.com${itemUrl}`
      };
    })
  };

  return (
    <nav
      aria-label="Breadcrumb"
      className={`flex items-center text-xs font-medium text-slate-400 py-3 ${className}`}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <ol className="flex flex-wrap items-center gap-1.5 list-none p-0 m-0">
        {items.map((item, index) => {
          const isLast = index === items.length - 1 || item.isCurrent;
          const displayLabel = item.label || item.name || '';
          const targetUrl = item.url || item.path || '/';
          return (
            <li key={index} className="inline-flex items-center gap-1.5">
              {index === 0 ? (
                <Link
                  to={targetUrl}
                  className="inline-flex items-center gap-1 text-slate-400 hover:text-cyan-400 transition-colors"
                >
                  <Home className="h-3.5 w-3.5" />
                  <span>{displayLabel}</span>
                </Link>
              ) : isLast ? (
                <span className="text-slate-200 font-semibold" aria-current="page">
                  {displayLabel}
                </span>
              ) : (
                <Link
                  to={targetUrl}
                  className="text-slate-400 hover:text-cyan-400 transition-colors"
                >
                  {displayLabel}
                </Link>
              )}

              {!isLast && (
                <ChevronRight className="h-3 w-3 text-slate-600 shrink-0" aria-hidden="true" />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
