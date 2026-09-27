import React, { useRef } from 'react';
import { motion, useInView } from 'motion/react';

interface RevealOnScrollProps {
  children: React.ReactNode;
  width?: string;
  delay?: number;
  className?: string;
}

/**
 * Signature NexStudio Scroll Reveal effect.
 * Smoothly translates children upward as they enter the viewport.
 */
export default function RevealOnScroll({
  children,
  width = '100%',
  delay = 0.2,
  className = '',
}: RevealOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });

  return (
    <div ref={ref} className={className} style={{ position: 'relative', width, overflow: 'visible' }}>
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 40 },
          visible: { opacity: 1, y: 0 },
        }}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </motion.div>
    </div>
  );
}
