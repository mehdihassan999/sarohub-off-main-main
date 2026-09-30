import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { 
  Calendar, Clock, Tag
} from 'lucide-react';
import { getBlogArticleBySlug, getServiceBySlug, getCaseStudyBySlug } from '../data/seoContent';
import SEOHead from '../components/seo/SEOHead';
import Breadcrumbs from '../components/seo/Breadcrumbs';

export default function BlogDetailView() {
  const { slug } = useParams<{ slug: string }>();
  const article = getBlogArticleBySlug(slug || '');

  if (!article) {
    return <Navigate to="/blog" replace />;
  }

  const relatedServices = (article.relatedServiceSlugs || [])
    .map(sSlug => getServiceBySlug(sSlug))
    .filter(Boolean);

  const relatedProjects = (article.relatedProjectSlugs || [])
    .map(pSlug => getCaseStudyBySlug(pSlug))
    .filter(Boolean);

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.metaDescription,
    image: article.featuredImage,
    datePublished: article.publishedDate,
    dateModified: article.publishedDate,
    author: {
      '@type': 'Person',
      name: article.authorName,
      jobTitle: article.authorRole
    },
    publisher: {
      '@type': 'Organization',
      name: 'SaroHub Technologies (Private) Limited',
      url: 'https://sarohub.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://sarohub.com/assets/sarohub-logo.png'
      }
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://sarohub.com/blog/${article.slug}`
    }
  };

  return (
    <div className="min-h-screen bg-[#08090E] text-white">
      <SEOHead
        title={article.metaTitle}
        description={article.metaDescription}
        canonicalUrl={`https://sarohub.com/blog/${article.slug}`}
        ogType="article"
        ogImage={article.featuredImage}
        structuredData={structuredData}
      />

      {/* Top Breadcrumb Bar */}
      <div className="border-b border-white/[0.08] bg-[#0A0D15]">
        <div className="max-w-7xl mx-auto px-6 py-3.5 flex items-center justify-between">
          <Breadcrumbs
            items={[
              { name: 'Home', url: '/' },
              { name: 'Blog', url: '/blog' },
              { name: article.title, url: `/blog/${article.slug}`, isCurrent: true }
            ]}
          />
          <span className="hidden sm:inline font-mono text-[11px] uppercase tracking-wider text-slate-400">
            Technical Bulletin
          </span>
        </div>
      </div>

      {/* Article Header */}
      <header className="py-20 lg:py-28 bg-[#0A0D15] border-b border-white/[0.08] relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-[#FF5C00]/8 blur-[120px] pointer-events-none -z-10" />
        <div className="max-w-4xl mx-auto px-6 text-center space-y-6 relative z-10">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-mono uppercase bg-[#FF5C00]/10 border border-[#FF5C00]/25 text-[#FF7A1A] font-bold">
            <Tag className="size-3 text-[#FF5C00]" /> {article.category}
          </span>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-normal -tracking-[2px] text-white leading-tight font-display">
            {article.title}
          </h1>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-mono uppercase text-slate-400 pt-6 border-t border-white/[0.08]">
            <div className="flex items-center gap-2.5">
              <img
                src={article.authorAvatar}
                alt={article.authorName}
                className="size-8 rounded-full object-cover border border-white/20"
                referrerPolicy="no-referrer"
              />
              <div className="text-left">
                <span className="block font-bold text-white">{article.authorName}</span>
                <span className="block text-[10px] text-slate-400">{article.authorRole}</span>
              </div>
            </div>

            <span className="flex items-center gap-1.5">
              <Calendar className="size-3.5 text-[#FF5C00]" />
              {new Date(article.publishedDate).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
            </span>

            <span className="flex items-center gap-1.5">
              <Clock className="size-3.5 text-[#FF5C00]" />
              {article.readingTime}
            </span>
          </div>
        </div>
      </header>

      {/* Article Body */}
      <article className="py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-6">
          
          {/* Featured Image */}
          <div className="mb-14 rounded-3xl overflow-hidden border border-white/[0.08] shadow-2xl bg-[#0E121E]">
            <img
              src={article.featuredImage}
              alt={article.title}
              className="w-full h-80 sm:h-[480px] object-cover"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Lead Summary */}
          <div className="p-8 sm:p-10 rounded-3xl bg-[#0E121E] border border-white/[0.08] text-lg sm:text-xl text-slate-300 leading-relaxed font-normal mb-14 shadow-lg">
            {article.summary}
          </div>

          {/* Formatted Content */}
          <div className="space-y-6 text-slate-300 text-base sm:text-lg leading-relaxed font-normal">
            {article.contentMarkdown.split('\n\n').map((block, idx) => {
              const trimmed = block.trim();
              if (trimmed.startsWith('### ')) {
                return (
                  <h2 key={idx} className="text-2xl sm:text-3xl font-bold font-display -tracking-[1px] text-white pt-8 border-t border-white/[0.08]">
                    {trimmed.replace('### ', '')}
                  </h2>
                );
              }
              if (trimmed.startsWith('#### ')) {
                return (
                  <h3 key={idx} className="text-xl font-bold font-display text-white pt-4 text-[#FF7A1A]">
                    {trimmed.replace('#### ', '')}
                  </h3>
                );
              }
              if (trimmed.startsWith('* ')) {
                const items = trimmed.split('\n* ').map(i => i.replace(/^\*\s*/, ''));
                return (
                  <ul key={idx} className="space-y-2 list-disc pl-6">
                    {items.map((item, i) => (
                      <li key={i} className="text-slate-300">
                        {item}
                      </li>
                    ))}
                  </ul>
                );
              }
              if (trimmed.startsWith('1. ')) {
                const items = trimmed.split(/\n\d+\.\s*/).filter(Boolean);
                return (
                  <ol key={idx} className="space-y-2 list-decimal pl-6">
                    {items.map((item, i) => (
                      <li key={i} className="text-slate-300">
                        {item}
                      </li>
                    ))}
                  </ol>
                );
              }
              if (trimmed === '---') {
                return <hr key={idx} className="border-white/[0.08] my-10" />;
              }
              return (
                <p key={idx} className="leading-relaxed">
                  {trimmed}
                </p>
              );
            })}
          </div>

          {/* Tags */}
          <div className="mt-14 pt-8 border-t border-white/[0.08] flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono uppercase text-slate-400 mr-2">Topic Tags:</span>
            {article.tags.map((tag, i) => (
              <span
                key={i}
                className="px-4 py-1.5 rounded-full text-xs font-mono uppercase bg-white/[0.04] border border-white/10 text-slate-300"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Related Services & Case Studies */}
          {(relatedServices.length > 0 || relatedProjects.length > 0) && (
            <div className="mt-16 pt-12 border-t border-white/[0.08] space-y-8">
              <h3 className="text-2xl font-bold font-display text-white">
                Related Capabilities &amp; <span className="italic text-[#FF5C00]">Case Studies</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {relatedServices.map((srv: any) => (
                  <Link
                    key={srv.slug}
                    to={`/services/${srv.slug}`}
                    className="p-6 rounded-3xl bg-[#0E121E] border border-white/[0.08] hover:border-[#FF5C00]/40 transition-all group shadow-lg"
                  >
                    <span className="block text-xs font-mono uppercase text-[#FF7A1A] mb-1 font-bold">
                      Service Vertical
                    </span>
                    <span className="block text-lg font-bold text-white group-hover:text-[#FF7A1A] transition-colors">
                      {srv.title} &rarr;
                    </span>
                  </Link>
                ))}

                {relatedProjects.map((prj: any) => (
                  <Link
                    key={prj.slug}
                    to={`/projects/${prj.slug}`}
                    className="p-6 rounded-3xl bg-[#0E121E] border border-white/[0.08] hover:border-[#FF5C00]/40 transition-all group shadow-lg"
                  >
                    <span className="block text-xs font-mono uppercase text-[#FF7A1A] mb-1 font-bold">
                      Case Study
                    </span>
                    <span className="block text-lg font-bold text-white group-hover:text-[#FF7A1A] transition-colors">
                      {prj.clientName} &rarr;
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}

        </div>
      </article>

      {/* Footer Navigation */}
      <footer className="py-12 bg-[#0A0D15] border-t border-white/[0.08]">
        <div className="max-w-4xl mx-auto px-6 flex items-center justify-between">
          <Link
            to="/blog"
            className="text-xs font-mono uppercase tracking-wider text-slate-300 hover:text-[#FF5C00] font-semibold transition-colors"
          >
            &larr; Back to Technical Bulletins
          </Link>

          <Link
            to="/contact"
            className="text-xs font-mono uppercase tracking-wider text-[#FF7A1A] hover:text-[#FFA566] font-semibold transition-colors"
          >
            Discuss With Technical Leads &rarr;
          </Link>
        </div>
      </footer>

    </div>
  );
}
