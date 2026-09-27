import React from 'react';

interface RollTextProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Signature NexStudio RollText animation.
 * On parent hover (with 'group' class), text rolls upward seamlessly.
 */
export default function RollText({ children, className = '' }: RollTextProps) {
  return (
    <span className={`relative inline-block overflow-hidden align-middle ${className}`}>
      <span className="block transition-transform duration-300 ease-in-out group-hover:-translate-y-full">
        {children}
      </span>
      <span className="absolute top-0 left-0 block w-full transition-transform duration-300 ease-in-out translate-y-full group-hover:translate-y-0">
        {children}
      </span>
    </span>
  );
}
