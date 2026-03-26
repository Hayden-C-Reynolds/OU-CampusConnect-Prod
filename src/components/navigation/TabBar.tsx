// src/components/navigation/TabBar.tsx
import React, { useState, useEffect, useContext } from "react";
import { IonIcon } from "@ionic/react";
import {
  homeSharp,
  heartOutline,
  personOutline,
  informationCircleSharp,
} from "ionicons/icons";
import { NavLink, useLocation } from "react-router-dom";
import { IonStorageContext } from "../../contexts/StorageContext";

const items = [
  { to: "/home",      label: "Home",      icon: homeSharp,              isGuest: null  },
  { to: "/favorites", label: "Favorites", icon: heartOutline,           isGuest: false },
  { to: "/profile",   label: "Profile",   icon: personOutline,          isGuest: false },
  { to: "/info",      label: "Info",      icon: informationCircleSharp, isGuest: true  },
];

const TabBar: React.FC = () => {
  const location = useLocation();
  const [hidden, setHidden]       = useState(false);
  const [prevScroll, setPrevScroll] = useState(0);
  const { isGuest } = useContext(IonStorageContext);

  useEffect(() => {
    const handleScroll = () => {
      const current = window.scrollY;
      setHidden(current > prevScroll && current > 50);
      setPrevScroll(current);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [prevScroll]);

  // Show items based on auth state
  const visible = items.filter((x) => {
    if (isGuest === false) return true;
    if (isGuest === true)  return x.isGuest === true || x.isGuest === null;
    return false;
  });

  return (
    <>
      <style>{`
        @keyframes tabPop {
          0%   { transform: scale(1); }
          40%  { transform: scale(0.88); }
          70%  { transform: scale(1.08); }
          100% { transform: scale(1); }
        }
        .tab-pop { animation: tabPop 0.28s cubic-bezier(0.34,1.56,0.64,1); }

        @keyframes tabGlow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(251,191,36,0); }
          50%       { box-shadow: 0 0 14px 3px rgba(251,191,36,0.35); }
        }
        .tab-active-glow { animation: tabGlow 2.5s ease-in-out infinite; }
      `}</style>

      <nav
        className={`fixed left-0 right-0 bottom-0 z-50 flex justify-center
                    pointer-events-none transition-all duration-300 ease-in-out
                    ${hidden ? "translate-y-28 opacity-0" : "translate-y-0 opacity-100"}`}
        style={{ paddingBottom: "max(env(safe-area-inset-bottom), 16px)" }}
      >
        <div
          className="pointer-events-auto flex items-center gap-1 px-2 py-2
                     bg-gray-950/90 backdrop-blur-xl rounded-[28px]
                     border border-white/10"
          style={{
            boxShadow:
              "0 -2px 40px rgba(0,0,0,0.5), 0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)",
          }}
        >
          {visible.map((it) => {
            const selected = location.pathname === it.to;

            return (
              <NavLink
                key={it.to}
                to={it.to}
                className={`relative flex items-center justify-center gap-2 rounded-[20px]
                            transition-all duration-200 select-none
                            ${selected
                              ? "bg-amber-400 px-5 py-2.5 tab-active-glow"
                              : "px-4 py-2.5 hover:bg-white/5 active:bg-white/10"
                            }`}
              >
                {/* Glow bloom behind active tab */}
                {selected && (
                  <span className="absolute inset-0 rounded-[20px] bg-amber-400/20 blur-md" />
                )}

                <IonIcon
                  icon={it.icon}
                  className={`relative transition-all duration-200 ${
                    selected ? "text-white" : "text-white"
                  }`}
                  style={{ fontSize: selected ? "20px" : "18px" }}
                />

                {/* Label only shows on active tab */}
                {selected && (
                  <span className="relative text-[13px] font-black text-white tracking-tight whitespace-nowrap">
                    {it.label}
                  </span>
                )}
              </NavLink>
            );
          })}
        </div>
      </nav>
    </>
  );
};

export default TabBar;