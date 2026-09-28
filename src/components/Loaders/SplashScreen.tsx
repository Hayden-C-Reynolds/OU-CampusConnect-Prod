// src/components/Loaders/SplashScreen.tsx
import React from "react";
import Logo from "../brand/Logo";

interface Props {
  label?: string;
}

const SplashScreen: React.FC<Props> = ({ label = "Campus Connect" }) => {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "#0a0e1a",
        zIndex: 9999,
      }}
      className="flex flex-col items-center justify-center"
    >
      <div className="fade-in flex flex-col items-center gap-5">
        <Logo size={104} animated />
        <div className="text-center">
          <p className="text-white font-bold text-lg tracking-tight">{label}</p>
          <p className="text-[11px] uppercase tracking-[0.2em] mt-1" style={{ color: "var(--cc-text-tertiary)" }}>
            Oakwood University
          </p>
        </div>
        <div className="flex gap-1.5 mt-2">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-1.5 h-1.5 rounded-full"
              style={{
                backgroundColor: "#e8b341",
                animation: `cc-splash-pulse 1.2s ease-in-out ${i * 0.15}s infinite`,
              }}
            />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes cc-splash-pulse {
          0%, 80%, 100% { opacity: 0.25; transform: scale(0.8); }
          40%           { opacity: 1;    transform: scale(1.15); }
        }
        .fade-in {
          animation: cc-splash-fade 0.5s ease-out;
        }
        @keyframes cc-splash-fade {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default SplashScreen;
