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
    <div className="min-h-screen bg-white text-black">
      <SEOHead
        title={article.metaTitle}
        description={article.metaDescription}
        canonicalUrl={`https://sarohub.com/blog/${article.slug}`}
        ogType="article"
        ogImage={article.featuredImage}
        structuredData={structuredData}
      />

      {/* Top Breadcrumb Bar */}
      <div className="border-b border-gray-200 bg-[#FBFBFB]">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <Breadcrumbs
            items={[
              { name: 'Home', url: '/' },
              { name: 'Blog', url: '/blog' },
              { name: article.title, url: `/blog/${article.slug}`, isCurrent: true }
            ]}
          />
          <span className="hidden sm:inline font-mono text-[11px] uppercase tracking-wider text-gray-500">
            Technical Bulletin
          </span>
        </div>
      </div>

      {/* Article Header */}
      <header className="py-20 lg:py-28 bg-[#FBFBFB] border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-6">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-mono uppercase bg-white border border-gray-200 text-gray-700">
            <Tag className="size-3" /> {article.category}
          </span>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-normal -tracking-[2px] text-black leading-tight">
            {article.title}
          </h1>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-mono uppercase text-gray-500 pt-4 border-t border-gray-200">
            <div className="flex items-center gap-2.5">
              <img
                src={article.authorAvatar}
                alt={article.authorName}
                className="size-8 rounded-full object-cover border border-gray-200"
                referrerPolicy="no-referrer"
              />
              <div className="text-left">
                <span className="block font-semibold text-black">{article.authorName}</span>
                <span className="block text-[10px] text-gray-400">{article.authorRole}</span>
              </div>
            </div>

            <span className="flex items-center gap-1.5">
              <Calendar className="size-3.5 text-gray-400" />
              {new Date(article.publishedDate).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
            </span>

            <span className="flex items-center gap-1.5">
              <Clock className="size-3.5 text-gray-400" />
              {article.readingTime}
            </span>
          </div>
        </div>
      </header>

      {/* Article Body */}
      <article className="py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-6">
          
          {/* Featured Image */}
          <div className="mb-14 rounded-3xl overflow-hidden border border-gray-200 shadow-xs">
            <img
              src={article.featuredImage}
              alt={article.title}
              className="w-full h-80 sm:h-[480px] object-cover"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Lead Summary */}
          <div className="p-8 sm:p-10 rounded-3xl bg-[#FBFBFB] border border-gray-200 text-lg sm:text-xl text-gray-700 leading-relaxed font-normal mb-14">
            {article.summary}
          </div>

          {/* Formatted Content */}
          <div className="space-y-6 text-gray-700 text-base sm:text-lg leading-relaxed font-normal">
            {article.contentMarkdown.split('\n\n').map((block, idx) => {
              const trimmed = block.trim();
              if (trimmed.startsWith('### ')) {
                return (
                  <h2 key={idx} className="text-2xl sm:text-3xl font-normal -tracking-[1px] text-black pt-8 border-t border-gray-200">
                    {trimmed.replace('### ', '')}
                  </h2>
                );
              }
              if (trimmed.startsWith('#### ')) {
                return (
                  <h3 key={idx} className="text-xl font-normal text-black pt-4">
                    {trimmed.replace('#### ', '')}
                  </h3>
                );
              }
              if (trimmed.startsWith('* ')) {
                const items = trimmed.split('\n* ').map(i => i.replace(/^\*\s*/, ''));
                return (
                  <ul key={idx} className="space-y-2 list-disc pl-6">
                    {items.map((item, i) => (
                      <li key={i} className="text-gray-700">
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
                      <li key={i} className="text-gray-700">
                        {item}
                      </li>
                    ))}
                  </ol>
                );
              }
              if (trimmed === '---') {
                return <hr key={idx} className="border-gray-200 my-10" />;
              }
              return (
                <p key={idx} className="leading-relaxed">
                  {trimmed}
                </p>
              );
            })}
          </div>

          {/* Tags */}
          <div className="mt-14 pt-8 border-t border-gray-200 flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono uppercase text-gray-500 mr-2">Topic Tags:</span>
            {article.tags.map((tag, i) => (
              <span
                key={i}
                className="px-4 py-1.5 rounded-full text-xs font-mono uppercase bg-[#FBFBFB] border border-gray-200 text-gray-700"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Related Services & Case Studies */}
          {(relatedServices.length > 0 || relatedProjects.length > 0) && (
            <div className="mt-16 pt-12 border-t border-gray-200 space-y-8">
              <h3 className="text-2xl font-normal text-black">
                Related Capabilities &amp; <span className="italic">Case Studies</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {relatedServices.map((srv: any) => (
                  <Link
                    key={srv.slug}
                    to={`/services/${srv.slug}`}
                    className="p-6 rounded-3xl bg-[#FBFBFB] border border-gray-200 hover:border-black transition-all group"
                  >
                    <span className="block text-xs font-mono uppercase text-gray-400 mb-1">
                      Service Vertical
                    </span>
                    <span className="block text-lg font-normal text-black group-hover:text-gray-600 transition-colors">
                      {srv.title} &rarr;
                    </span>
                  </Link>
                ))}

                {relatedProjects.map((prj: any) => (
                  <Link
                    key={prj.slug}
                    to={`/projects/${prj.slug}`}
                    className="p-6 rounded-3xl bg-[#FBFBFB] border border-gray-200 hover:border-black transition-all group"
                  >
                    <span className="block text-xs font-mono uppercase text-gray-400 mb-1">
                      Case Study
                    </span>
                    <span className="block text-lg font-normal text-black group-hover:text-gray-600 transition-colors">
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
      <footer className="py-12 bg-[#FBFBFB] border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-6 flex items-center justify-between">
          <Link
            to="/blog"
            className="text-xs font-mono uppercase tracking-wider text-black hover:text-gray-600 font-semibold"
          >
            &larr; Back to Technical Bulletins
          </Link>

          <Link
            to="/contact"
            className="text-xs font-mono uppercase tracking-wider text-black hover:text-gray-600 font-semibold"
          >
            Discuss With Technical Leads &rarr;
          </Link>
        </div>
      </footer>

    </div>
  );
}
