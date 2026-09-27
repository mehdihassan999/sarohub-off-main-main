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
      className={`group p-6 rounded-3xl border border-gray-200 bg-[#FBFBFB] hover:border-black hover:shadow-md transition-all duration-300 flex flex-col justify-between ${className}`}
    >
      <div>
        {/* Project Thumbnail with Hover Zoom */}
        <Link to={projectUrl} className="block overflow-hidden rounded-2xl relative aspect-[16/10] bg-gray-100 border border-gray-200 mb-5 shadow-xs">
          <img
            src={displayImage}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            referrerPolicy="no-referrer"
            loading="lazy"
          />
        </Link>

        {/* Category & Status */}
        <div className="flex justify-between items-center text-xs font-mono uppercase mb-3 text-gray-700">
          <span className="text-black font-bold tracking-wide">{project.category || 'Client Project'}</span>
          <span className="font-medium text-gray-600 px-2 py-0.5 rounded-sm bg-white border border-gray-200 text-[10px]">{project.status || 'Delivered'}</span>
        </div>

        {/* Title */}
        <h3 className="text-xl sm:text-2xl font-bold text-black mb-2 group-hover:text-gray-700 transition-colors tracking-tight">
          <Link to={projectUrl}>
            {project.title}
          </Link>
        </h3>

        {/* Short description */}
        <p className="text-sm text-gray-700 line-clamp-2 leading-relaxed mb-4 font-normal">
          {project.short_description || project.description}
        </p>

        {/* Technologies */}
        {techList.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-5">
            {techList.slice(0, 4).map((tech: string, i: number) => (
              <span
                key={i}
                className="px-2.5 py-1 bg-white border border-gray-200 text-gray-800 text-[11px] font-mono font-medium rounded-md shadow-xs"
              >
                {tech}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Card Footer Actions */}
      <div className="pt-4 border-t border-gray-200 flex items-center justify-between">
        <Link
          to={projectUrl}
          className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-black group-hover:text-gray-700 font-bold"
        >
          <span>View Case Study</span>
          <span className="transition-transform group-hover:translate-x-1 font-sans">&rarr;</span>
        </Link>

        {project.live_url && (
          <a
            href={project.live_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-mono uppercase tracking-wider text-gray-700 hover:text-black font-semibold flex items-center gap-1 transition-colors"
          >
            <span>Live Portal</span>
            <DiagonalArrow size={14} />
          </a>
        )}
      </div>
    </motion.article>
  );
}
