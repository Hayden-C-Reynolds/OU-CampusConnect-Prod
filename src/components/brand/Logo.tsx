// src/components/brand/Logo.tsx
import React from "react";

interface LogoProps {
  size?: number;
  className?: string;
  animated?: boolean;
}

/**
 * The Campus Connect compass mark. Inline SVG (not an <img>) so it's
 * crisp at any size, themeable, and animatable without shipping an
 * extra image asset.
 */
const Logo: React.FC<LogoProps> = ({ size = 96, className = "", animated = false }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 512 512"
      className={className}
      role="img"
      aria-label="Campus Connect"
    >
      <defs>
        <linearGradient id="cc-logo-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#151b32" />
          <stop offset="100%" stopColor="#0a0e1a" />
        </linearGradient>
        <linearGradient id="cc-logo-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f0c669" />
          <stop offset="100%" stopColor="#c9922b" />
        </linearGradient>
      </defs>

      <rect x="0" y="0" width="512" height="512" rx="112" fill="url(#cc-logo-bg)" />
      <rect
        x="8" y="8" width="496" height="496" rx="106"
        fill="none" stroke="#e8b341" strokeOpacity="0.25" strokeWidth="4"
      />

      <g style={animated ? { transformOrigin: "256px 256px", animation: "cc-logo-spin 3.5s ease-in-out infinite" } : undefined}>
        <circle cx="256" cy="256" r="150" fill="none" stroke="#e8b341" strokeOpacity="0.35" strokeWidth="6" />
        <path d="M256 116 L296 256 L256 396 L216 256 Z" fill="url(#cc-logo-gold)" />
        <path d="M256 396 L296 256 L256 246 L216 256 Z" fill="#4c7ef3" />
        <circle cx="256" cy="256" r="22" fill="#0a0e1a" stroke="#f0c669" strokeWidth="6" />
        <circle cx="256" cy="96" r="7" fill="#e8b341" />
        <circle cx="256" cy="416" r="7" fill="#4c7ef3" />
        <circle cx="96" cy="256" r="5" fill="#e8b341" fillOpacity="0.6" />
        <circle cx="416" cy="256" r="5" fill="#e8b341" fillOpacity="0.6" />
      </g>

      {animated && (
        <style>{`
          @keyframes cc-logo-spin {
            0%   { transform: rotate(0deg); }
            50%  { transform: rotate(20deg); }
            100% { transform: rotate(0deg); }
          }
        `}</style>
      )}
    </svg>
  );
};

export default Logo;
