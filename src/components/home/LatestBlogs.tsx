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
    <section id="latest-blogs" className="py-12 lg:py-16 bg-[#FBFBFB] border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* NexStudio Section Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-6 pb-6 border-b border-gray-200">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-gray-500 mb-2 block">
              Knowledge &amp; Engineering
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-normal -tracking-[1.8px] text-black">
              Latest <span className="italic">Articles &amp; Insights</span>
            </h2>
          </div>

          <Link
            to="/blog"
            className="group px-7 py-3.5 inline-flex gap-2.5 items-center bg-black text-sm font-medium -tracking-[0.2px] leading-5 text-white rounded-full hover:bg-gray-800 transition-all duration-300 shrink-0 shadow-xs"
          >
            <RollText>READ ALL POSTS</RollText>
            <DiagonalArrow size={18} />
          </Link>
        </div>

        {recentBlogs.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl border border-gray-200 font-mono text-xs text-gray-600 uppercase">
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
                className="p-6 rounded-3xl border border-gray-200 bg-white hover:border-black hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <Link
                    to={`/blog/${item.slug || item.id}`}
                    className="block overflow-hidden rounded-2xl relative aspect-[16/10] bg-gray-100 border border-gray-200 mb-5 shadow-xs"
                  >
                    <img
                      src={item.featured_image_url || 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&q=80&w=800&h=450'}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                      loading="lazy"
                    />
                  </Link>

                  <div className="flex justify-between items-center text-xs font-mono uppercase mb-3 text-gray-700">
                    <span className="font-bold text-black">{item.category || 'Engineering'}</span>
                    <span className="text-gray-600 font-medium">{formatDate(item.created_at || new Date().toISOString())}</span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-black mb-2 group-hover:text-gray-700 transition-colors tracking-tight">
                    <Link to={`/blog/${item.slug || item.id}`}>
                      {item.title}
                    </Link>
                  </h3>

                  <p className="text-sm text-gray-700 line-clamp-2 leading-relaxed mb-5 font-normal">
                    {item.excerpt || item.content?.replace(/<[^>]*>?/gm, '').substring(0, 140)}
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <Link
                    to={`/blog/${item.slug || item.id}`}
                    className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-black group-hover:text-gray-700 font-bold transition-colors"
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
