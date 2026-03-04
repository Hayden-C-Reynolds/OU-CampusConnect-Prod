// src/components/OUConnectLoader.tsx
import React, { useId } from "react";
import "./OUConnectLoader.css";

type OUConnectLoaderProps = {
  visible?: boolean;
  overlay?: boolean;
  size?: number;
  label?: string;
};

const OUConnectLoader: React.FC<OUConnectLoaderProps> = ({
  visible = true,
  overlay = false,
  size = 64,
  label = "OUConnect",
}) => {
  const id = useId().replace(/:/g, "-");
  const gA = `gA-${id}`;
  const gB = `gB-${id}`;
  const gC = `gC-${id}`;

  if (!visible) return null;

  return (
    <div className={overlay ? "ou-overlay" : "ou-inline-wrapper"}>
      <div className="loader">
        {/* SVG DEFINITIONS */}
        <svg className="absolute" viewBox="0 0 64 64">
          <defs>
            <linearGradient id={gA} x1="0" y1="62" x2="0" y2="2">
              <stop offset="0" stopColor="#973BED" />
              <stop offset="1" stopColor="#007CFF" />
            </linearGradient>

            <linearGradient id={gB} x1="0" y1="64" x2="0" y2="0">
              <stop offset="0" stopColor="#FFC800" />
              <stop offset="1" stopColor="#FF00FF" />
              <animateTransform
                attributeName="gradientTransform"
                type="rotate"
                dur="8s"
                repeatCount="indefinite"
                values="0 32 32;-270 32 32;-540 32 32;-810 32 32;-1080 32 32"
                keyTimes="0;0.25;0.5;0.75;1"
              />
            </linearGradient>

            <linearGradient id={gC} x1="0" y1="62" x2="0" y2="2">
              <stop offset="0" stopColor="#00E0ED" />
              <stop offset="1" stopColor="#00DA72" />
            </linearGradient>
          </defs>
        </svg>

        {/* LEFT */}
        <svg width={size} height={size} viewBox="0 0 64 64" className="inline-block">
          <path
            d="M54.7 4h5C59 17 49 27.6 36.1 29.6a2 2 0 0 0-1.7 2V60h-4.8V31.6a2 2 0 0 0-1.7-2C14.9 27.6 5 17 4 4h5.3C10.5 15.6 20.3 24.6 32 24.7c11.8 0 21.7-9 22.7-20.7z"
            stroke={`url(#${gA})`}
            strokeWidth="8"
            fill="none"
            className="dash"
            pathLength="360"
          />
        </svg>

        {/* CENTER */}
        <svg width={size} height={size} viewBox="0 0 64 64" className="inline-block">
          <path
            d="M32 5a27 27 0 1 1 0 54a27 27 0 1 1 0-54"
            stroke={`url(#${gB})`}
            strokeWidth="10"
            fill="none"
            className="spin"
            pathLength="360"
          />
        </svg>

        <div className="w-2" />

        {/* RIGHT */}
        <svg width={size} height={size} viewBox="0 0 64 64" className="inline-block">
          <path
            d="M4 4h4.6v26c0 12 9.8 21.5 21.8 21.3c11.6-.2 21-9.6 21.2-21.3V4H56v26c0 14.3-11.6 26-26 26C15.8 56 4 44.4 4 30z"
            stroke={`url(#${gC})`}
            strokeWidth="8"
            fill="none"
            className="dash"
            pathLength="360"
          />
        </svg>
      </div>

      <div className="ou-label">{label}</div>
    </div>
  );
};

export default OUConnectLoader;
