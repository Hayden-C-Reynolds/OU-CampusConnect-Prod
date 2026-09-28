// src/components/navigation/TabBar.tsx
import React, { useContext, useRef, useState, useLayoutEffect } from "react";
import { IonIcon } from "@ionic/react";
import { NavLink, useLocation } from "react-router-dom";
import { IonStorageContext } from "../../contexts/StorageContext";
import { useLanguage } from "../../contexts/LanguageContext";
import { navItems as items } from "./navItems";

/**
 * A floating, pill-shaped bottom tab bar — detached from the screen
 * edges with generous rounding and a soft shadow, rather than a flat
 * edge-to-edge strip. A single gold "pill" glides smoothly behind
 * whichever tab is active (measured live via each tab's DOM rect),
 * so switching tabs feels like one continuous motion instead of a
 * hard cut between highlighted/unhighlighted states.
 */
const TabBar: React.FC = () => {
  const location = useLocation();
  const { isGuest } = useContext(IonStorageContext);
  const { t } = useLanguage();

  const visible = items.filter((x) => {
    if (isGuest === false) return true;
    if (isGuest === true) return x.isGuest === true || x.isGuest === null;
    return false;
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const [pill, setPill] = useState<{ left: number; width: number } | null>(null);

  const activeIndex = visible.findIndex((it) => location.pathname === it.to);

  useLayoutEffect(() => {
    const activeItem = visible[activeIndex];
    const el = activeItem ? tabRefs.current[activeItem.to] : null;
    const container = containerRef.current;
    if (el && container) {
      const elRect = el.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      setPill({ left: elRect.left - containerRect.left, width: elRect.width });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, visible.length]);

  return (
    <div
      style={{
        position: "fixed",
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 50,
        display: "flex",
        justifyContent: "center",
        paddingBottom: "max(env(safe-area-inset-bottom), 14px)",
        pointerEvents: "none",
      }}
    >
      <nav
        id="cc-tour-tabbar"
        ref={containerRef}
        style={{
          position: "relative",
          pointerEvents: "auto",
          display: "flex",
          alignItems: "stretch",
          gap: "2px",
          padding: "6px",
          borderRadius: "24px",
          backgroundColor: "var(--cc-surface)",
          border: "1px solid var(--cc-border)",
          boxShadow:
            "0 12px 32px rgba(0,0,0,0.28), 0 2px 8px rgba(0,0,0,0.16)",
          backdropFilter: "blur(20px)",
        }}
      >
        {/* Sliding active pill */}
        {pill && (
          <div
            style={{
              position: "absolute",
              top: "6px",
              bottom: "6px",
              left: pill.left,
              width: pill.width,
              borderRadius: "18px",
              backgroundColor: "rgba(232, 179, 65, 0.14)",
              border: "1px solid rgba(232, 179, 65, 0.3)",
              transition: "left 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), width 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)",
              pointerEvents: "none",
            }}
          />
        )}

        {visible.map((it) => {
          const selected = location.pathname === it.to;
          return (
            <NavLink
              key={it.to}
              to={it.to}
              ref={(el) => { tabRefs.current[it.to] = el; }}
              className={`relative flex flex-col items-center justify-center gap-0.5 py-2 ${visible.length > 5 ? "px-2" : "px-4"}`}
              style={{ zIndex: 1 }}
            >
              <IonIcon
                icon={it.icon}
                style={{
                  fontSize: "20px",
                  color: selected ? "#e8b341" : "var(--cc-text-tertiary)",
                  transition: "color 0.25s ease, transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)",
                  transform: selected ? "translateY(-1px) scale(1.05)" : "none",
                }}
              />
              <span
                style={{
                  fontSize: "10px",
                  fontWeight: selected ? 700 : 500,
                  letterSpacing: "0.02em",
                  color: selected ? "#e8b341" : "var(--cc-text-tertiary)",
                  transition: "color 0.25s ease",
                  whiteSpace: "nowrap",
                }}
              >
                {t(it.labelKey)}
              </span>
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
};

export default TabBar;
