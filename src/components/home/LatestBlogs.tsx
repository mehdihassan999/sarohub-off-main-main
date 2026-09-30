import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import RollText from '../common/RollText';
import DiagonalArrow from '../common/DiagonalArrow';

interface BlogsProps {
  blogs: any[];
}

export default function LatestBlogs({ blogs }: BlogsProps) {
  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return isoString;
    }
  };

  const recentBlogs = blogs.slice(0, 3);

  return (
    <section id="latest-blogs" className="py-14 lg:py-20 bg-[#08090E] border-b border-white/[0.08] relative">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 gap-6 pb-6 border-b border-white/[0.08]">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-[#FF5C00] mb-2 block flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF5C00] animate-pulse" />
              Knowledge &amp; Engineering
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-normal -tracking-[1.8px] text-white">
              Latest <span className="italic text-[#FF5C00]">Articles &amp; Insights</span>
            </h2>
          </div>

          <Link
            to="/blog"
            className="group px-7 py-3.5 inline-flex gap-2.5 items-center bg-gradient-to-r from-[#FF5C00] via-[#FF6C00] to-[#FF8526] text-sm font-semibold text-white rounded-full shadow-[0_0_24px_rgba(255,92,0,0.38)] hover:shadow-[0_0_36px_rgba(255,92,0,0.65)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shrink-0 border border-[#FFA566]/30"
          >
            <RollText>READ ALL POSTS</RollText>
            <DiagonalArrow size={18} />
          </Link>
        </div>

        {recentBlogs.length === 0 ? (
          <div className="text-center py-12 bg-[#0E121E] rounded-3xl border border-white/[0.08] font-mono text-xs text-slate-400 uppercase">
            No articles found in the database.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {recentBlogs.map((item, idx) => (
              <motion.article
                key={item.id || idx}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="p-6 rounded-3xl border border-white/[0.08] bg-[#0E121E] hover:border-[#FF5C00]/40 hover:shadow-[0_12px_35px_rgba(0,0,0,0.7),0_0_20px_rgba(255,92,0,0.15)] transition-all duration-300 flex flex-col justify-between group shadow-lg"
              >
                <div>
                  <Link
                    to={`/blog/${item.slug || item.id}`}
                    className="block overflow-hidden rounded-2xl relative aspect-[16/10] bg-[#141828] border border-white/[0.08] mb-5 shadow-xs"
                  >
                    <img
                      src={item.featured_image_url || 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&q=80&w=800&h=450'}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                      loading="lazy"
                    />
                  </Link>

                  <div className="flex justify-between items-center text-xs font-mono uppercase mb-3 text-slate-400">
                    <span className="font-bold text-[#FF7A1A]">{item.category || 'Engineering'}</span>
                    <span className="text-slate-400 font-medium">{formatDate(item.created_at || new Date().toISOString())}</span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 group-hover:text-[#FF7A1A] transition-colors tracking-tight">
                    <Link to={`/blog/${item.slug || item.id}`}>
                      {item.title}
                    </Link>
                  </h3>

                  <p className="text-sm text-slate-400 line-clamp-2 leading-relaxed mb-5 font-normal">
                    {item.excerpt || item.content?.replace(/<[^>]*>?/gm, '').substring(0, 140)}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/[0.08]">
                  <Link
                    to={`/blog/${item.slug || item.id}`}
                    className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-[#FF5C00] group-hover:text-[#FFA043] font-bold transition-colors"
                  >
                    <span>Read Full Article</span>
                    <span className="transition-transform group-hover:translate-x-1 font-sans">&rarr;</span>
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
