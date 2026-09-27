import React from 'react';

/**
 * Signature NexStudio 45-degree diagonal arrow with group-hover nudge.
 */
export default function DiagonalArrow({ className = '', size = 20 }: { className?: string; size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={`transition-transform duration-300 group-hover:translate-x-1 shrink-0 ${className}`}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M17.9941 5.25293C18.0771 5.253 18.1559 5.26997 18.2305 5.29492C18.2472 5.30045 18.2648 5.30381 18.2812 5.31055C18.3311 5.33127 18.3781 5.35722 18.4219 5.3877C18.4586 5.41309 18.4937 5.44192 18.5264 5.47461C18.6455 5.59379 18.7132 5.74352 18.7354 5.89844C18.7383 5.91968 18.7401 5.94112 18.7412 5.96289C18.7424 5.98346 18.7447 6.00382 18.7441 6.02441L18.7471 14.9941C18.747 15.4081 18.4103 15.744 17.9961 15.7441C17.5822 15.7438 17.2462 15.408 17.2461 14.9941L17.2441 7.81641L6.53027 18.5312C6.23737 18.824 5.76257 18.8241 5.46973 18.5312C5.1769 18.2384 5.17698 17.7636 5.46973 17.4707L16.1885 6.75098L8.99805 6.75C8.58403 6.74971 8.24816 6.41381 8.24805 6C8.24822 5.5859 8.58474 5.24985 8.99902 5.25L17.9941 5.25293Z"
        fill="currentColor"
      />
    </svg>
  );
}
