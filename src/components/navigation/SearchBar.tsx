// src/components/navigation/SearchBar.tsx
import React, { useState, useMemo, useEffect, useRef } from "react";
import { CampusLocation } from "../../types/data";
import { IonIcon } from "@ionic/react";
import { searchOutline, closeCircle, locationOutline } from "ionicons/icons";

interface Props {
  allLocations: CampusLocation[];
  onSelect: (loc: CampusLocation) => void;
}

const CATEGORY_COLOR: Record<string, string> = {
  Library:              "#0ea5e9",
  "Admin / Dining":     "#f97316",
  Church:               "#8b5cf6",
  Dormitory:            "#10b981",
  Academic:             "#2563EB",
  "Science / Academic": "#2563EB",
  Sports:               "#ef4444",
  Store:                "#06b6d4",
  Facility:             "#64748b",
  Ministry:             "#ef6aa7",
  Housing:              "#fb923c",
  School:               "#059669",
  Department:           "#0284c7",
  Security:             "#dc2626",
  Landmark:             "#fbbf24",
  Admin:                "#f97316",
  default:              "#6b7280",
};

const CATEGORY_ICON: Record<string, string> = {
  Library:              "📚",
  "Admin / Dining":     "🍽️",
  Church:               "⛪",
  Dormitory:            "🏠",
  Academic:             "🏛️",
  "Science / Academic": "🔬",
  Sports:               "⚽",
  Store:                "🛍️",
  Facility:             "🔧",
  Ministry:             "🙏",
  Housing:              "🏘️",
  School:               "🎓",
  Department:           "📋",
  Security:             "🔒",
  Landmark:             "📌",
  Admin:                "🏢",
  default:              "📍",
};

const getCategoryColor = (cat?: string) =>
  (cat && CATEGORY_COLOR[cat]) || CATEGORY_COLOR.default;

const getCategoryIcon = (cat?: string) =>
  (cat && CATEGORY_ICON[cat]) || CATEGORY_ICON.default;

const SearchBar: React.FC<Props> = ({ allLocations, onSelect }) => {
  const [query, setQuery]           = useState("");
  const [focused, setFocused]       = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const inputRef     = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Mobile keyboard events
  useEffect(() => {
    const showHandler = (e: any) => {
      setKeyboardHeight(e.keyboardHeight || 300);
      setIsKeyboardOpen(true);
    };
    const hideHandler = () => {
      setKeyboardHeight(0);
      setIsKeyboardOpen(false);
    };
    window.addEventListener("ionKeyboardDidShow", showHandler);
    window.addEventListener("ionKeyboardDidHide", hideHandler);
    return () => {
      window.removeEventListener("ionKeyboardDidShow", showHandler);
      window.removeEventListener("ionKeyboardDidHide", hideHandler);
    };
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) {
        setFocused(false);
        setActiveIndex(-1);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Filter results — also searches description now
  const suggestions = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return allLocations
      .filter(
        (l) =>
          l.name.toLowerCase().includes(q) ||
          (l.category || "").toLowerCase().includes(q) ||
          (l.description || "").toLowerCase().includes(q) ||
          (l.acronyms || []).some((a) => a.toLowerCase().includes(q))
      )
      .slice(0, 7);
  }, [query, allLocations]);

  const showDropdown = focused && suggestions.length > 0;

  const handleSelect = (loc: CampusLocation) => {
    onSelect(loc);
    setQuery("");
    setFocused(false);
    setActiveIndex(-1);
    inputRef.current?.blur();
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showDropdown) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && activeIndex >= 0) {
      handleSelect(suggestions[activeIndex]);
    } else if (e.key === "Escape") {
      setFocused(false);
      setActiveIndex(-1);
      inputRef.current?.blur();
    }
  };

  // Highlights matching text in amber
  const highlight = (text: string, q: string) => {
    if (!q.trim()) return <span>{text}</span>;
    const idx = text.toLowerCase().indexOf(q.toLowerCase());
    if (idx === -1) return <span>{text}</span>;
    return (
      <span>
        {text.slice(0, idx)}
        <mark className="bg-amber-400/30 text-amber-300 rounded px-0.5">
          {text.slice(idx, idx + q.length)}
        </mark>
        {text.slice(idx + q.length)}
      </span>
    );
  };

  return (
    <>
      <style>{`
        @keyframes searchSlideDown {
          from { opacity: 0; transform: translateY(-8px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .search-dropdown { animation: searchSlideDown 0.16s cubic-bezier(0.16,1,0.3,1); }

        @keyframes searchGlow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(251,191,36,0); }
          50%       { box-shadow: 0 0 16px 2px rgba(251,191,36,0.18); }
        }
        .search-focused { animation: searchGlow 2s ease-in-out infinite; }
      `}</style>

      <div
        ref={containerRef}
        className="z-40"
        style={{
          position: isKeyboardOpen ? "absolute" : "fixed",
          top: isKeyboardOpen
            ? "calc(env(safe-area-inset-top, 10px) + 10px)"
            : "env(safe-area-inset-top, 10px)",
          left: 0,
          width: "85%",
          maxWidth: "420px",
          paddingLeft: "12px",
          paddingRight: "8px",
          paddingTop: "env(safe-area-inset-top, 20px)",
        }}
      >
        <div className="relative pt-3">

          {/* ── Input ── */}
          <div className={`relative flex items-center transition-all duration-200 ${focused ? "search-focused" : ""}`}>

            {/* Search icon */}
            <div
              className={`absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-colors duration-200 ${
                focused ? "text-amber-400" : "text-white"
              }`}
            >
              <IonIcon icon={searchOutline} style={{ fontSize: "18px" }} />
            </div>

            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setActiveIndex(-1); }}
              onFocus={() => setFocused(true)}
              onKeyDown={handleKeyDown}
              placeholder="Search buildings, departments…"
              autoComplete="off"
              className="w-full rounded-2xl pl-11 pr-10 py-3.5 text-sm
                         bg-gray-900/95 backdrop-blur-md text-white
                         placeholder-white focus:outline-none shadow-xl"
              style={{
                border: focused
                  ? "1px solid rgba(251,191,36,0.5)"
                  : "1px solid rgba(255,255,255,0.08)",
                letterSpacing: "0.01em",
              }}
            />

            {/* Clear button */}
            {query.length > 0 && (
              <button
                onClick={() => { setQuery(""); inputRef.current?.focus(); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-colors"
              >
                <IonIcon icon={closeCircle} style={{ fontSize: "18px" }} />
              </button>
            )}
          </div>

          {/* ── Dropdown ── */}
          {showDropdown && (
            <div
              className="search-dropdown absolute left-0 right-0 mt-2
                         bg-gray-900/98 backdrop-blur-xl rounded-2xl
                         overflow-hidden z-50 border border-white/10"
              style={{
                bottom: isKeyboardOpen ? keyboardHeight + 10 : "auto",
                boxShadow: "0 24px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.06)",
              }}
            >
              {/* Header row */}
              <div className="px-4 py-2 border-b border-white/5 flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                  {suggestions.length} result{suggestions.length !== 1 ? "s" : ""}
                </span>
                <span className="text-[10px] text-gray-600">↑↓ navigate · ↵ select</span>
              </div>

              {/* Results */}
              {suggestions.map((s, index) => {
                const color    = getCategoryColor(s.category);
                const icon     = getCategoryIcon(s.category);
                const isActive = activeIndex === index;

                return (
                  <div
                    key={s.id}
                    onClick={() => handleSelect(s)}
                    onMouseEnter={() => setActiveIndex(index)}
                    onMouseLeave={() => setActiveIndex(-1)}
                    className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-all duration-100 ${
                      isActive ? "bg-white/5" : ""
                    }`}
                    style={{
                      borderLeft: isActive
                        ? `3px solid ${color}`
                        : "3px solid transparent",
                    }}
                  >
                    {/* Category icon */}
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-base"
                      style={{
                        background: `${color}18`,
                        border: `1px solid ${color}30`,
                      }}
                    >
                      {icon}
                    </div>

                    {/* Text */}
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-white truncate">
                        {highlight(s.name, query)}
                      </div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span
                          className="text-[10px] font-bold px-1.5 py-0.5 rounded-md uppercase tracking-wider"
                          style={{ background: `${color}20`, color }}
                        >
                          {s.category}
                        </span>
                        {s.description && (
                          <span className="text-[11px] text-gray-500 truncate">
                            {s.description.slice(0, 40)}…
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Arrow */}
                    <div
                      className={`transition-all duration-100 ${
                        isActive ? "text-amber-400 translate-x-0.5" : "text-gray-600"
                      }`}
                    >
                      <IonIcon icon={locationOutline} style={{ fontSize: "16px" }} />
                    </div>
                  </div>
                );
              })}

              {/* Footer */}
              <div className="px-4 py-2 border-t border-white/5 flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                <span className="text-[10px] text-white">Oakwood University Campus</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SearchBar;