import React from 'react';
import { 
  Linkedin, Github, Twitter, Facebook, Instagram, Youtube, Music2, 
  Phone, Send, MessageSquare, Globe, ExternalLink, Share2, BookOpen
} from 'lucide-react';

interface SocialIconProps {
  platform: string;
  className?: string;
}

export function SocialIcon({ platform, className = "h-4 w-4" }: SocialIconProps) {
  const p = (platform || '').toLowerCase().trim();

  if (p.includes('linkedin')) return <Linkedin className={className} />;
  if (p.includes('github')) return <Github className={className} />;
  if (p.includes('twitter') || p === 'x' || p.includes('x.com')) return <Twitter className={className} />;
  if (p.includes('facebook')) return <Facebook className={className} />;
  if (p.includes('instagram')) return <Instagram className={className} />;
  if (p.includes('youtube')) return <Youtube className={className} />;
  if (p.includes('tiktok')) return <Music2 className={className} />;
  if (p.includes('whatsapp')) return <Phone className={className} />;
  if (p.includes('telegram')) return <Send className={className} />;
  if (p.includes('discord')) return <MessageSquare className={className} />;
  if (p.includes('medium')) return <BookOpen className={className} />;
  if (p.includes('website') || p.includes('portfolio') || p.includes('globe')) return <Globe className={className} />;

  return <ExternalLink className={className} />;
}

export default SocialIcon;
