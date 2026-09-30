import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import DiagonalArrow from '../common/DiagonalArrow';

export interface ClientProjectCardProps {
  project: any;
  idx?: number;
  className?: string;
  key?: any;
}

export default function ClientProjectCard({ 
  project, 
  idx = 0, 
  className = '' 
}: ClientProjectCardProps) {
  const techList = Array.isArray(project.technologies)
    ? project.technologies
    : typeof project.technologies === 'string'
    ? project.technologies.split(',').map((t: string) => t.trim())
    : [];

  const projectUrl = `/projects/${project.slug || project.id}`;
  const displayImage = 
    (typeof project.thumbnail_url === 'string' && project.thumbnail_url.trim().length > 0 && project.thumbnail_url.trim()) ||
    (Array.isArray(project.screenshots) && project.screenshots.find((s: any) => typeof s === 'string' && s.trim().length > 0)) ||
    (Array.isArray(project.gallery) && project.gallery.find((s: any) => typeof s === 'string' && s.trim().length > 0)) ||
    (typeof project.image === 'string' && project.image.trim().length > 0 && project.image.trim()) ||
    (typeof project.image_url === 'string' && project.image_url.trim().length > 0 && project.image_url.trim()) ||
    'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800&h=450';

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.4, delay: Math.min(idx * 0.06, 0.25) }}
      className={`group p-6 rounded-3xl border border-white/[0.08] bg-[#0E121E] hover:border-[#FF5C00]/40 hover:shadow-[0_12px_35px_rgba(0,0,0,0.7),0_0_20px_rgba(255,92,0,0.15)] transition-all duration-300 flex flex-col justify-between shadow-lg ${className}`}
    >
      <div>
        {/* Project Thumbnail with Hover Zoom */}
        <Link to={projectUrl} className="block overflow-hidden rounded-2xl relative aspect-[16/10] bg-[#141828] border border-white/[0.08] mb-5 shadow-xs">
          <img
            src={displayImage}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            referrerPolicy="no-referrer"
            loading="lazy"
          />
        </Link>

        {/* Category & Status */}
        <div className="flex justify-between items-center text-xs font-mono uppercase mb-3">
          <span className="text-[#FF7A1A] font-bold tracking-wide">{project.category || 'Client Project'}</span>
          <span className="font-semibold text-slate-400 px-2.5 py-0.5 rounded-full bg-black/60 border border-white/10 text-[10px]">{project.status || 'Delivered'}</span>
        </div>

        {/* Title */}
        <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 group-hover:text-[#FF7A1A] transition-colors tracking-tight font-display">
          <Link to={projectUrl}>
            {project.title}
          </Link>
        </h3>

        {/* Short description */}
        <p className="text-sm text-slate-400 line-clamp-2 leading-relaxed mb-4 font-normal">
          {project.short_description || project.description}
        </p>

        {/* Technologies */}
        {techList.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-5">
            {techList.slice(0, 4).map((tech: string, i: number) => (
              <span
                key={i}
                className="px-2.5 py-1 bg-white/[0.04] border border-white/10 text-slate-300 text-[11px] font-mono font-medium rounded-lg"
              >
                {tech}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Card Footer Actions */}
      <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between">
        <Link
          to={projectUrl}
          className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-white hover:text-[#FF5C00] font-bold transition-colors"
        >
          <span>View Case Study</span>
          <span className="transition-transform group-hover:translate-x-1 font-sans text-[#FF5C00]">&rarr;</span>
        </Link>

        {project.live_url && (
          <a
            href={project.live_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-mono uppercase tracking-wider text-[#FF7A1A] hover:text-[#FFA566] font-semibold flex items-center gap-1 transition-colors"
          >
            <span>Live Portal</span>
            <DiagonalArrow size={14} />
          </a>
        )}
      </div>
    </motion.article>
  );
}
