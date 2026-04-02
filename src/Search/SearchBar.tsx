import React, { useState, useMemo, useEffect, useRef } from "react";
import { CampusLocation } from "../types/data";

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
  default:              "📍",
};

const getCategoryColor = (cat?: string) =>
  (cat && CATEGORY_COLOR[cat]) || CATEGORY_COLOR.default;

const getCategoryIcon = (cat?: string) =>
  (cat && CATEGORY_ICON[cat]) || CATEGORY_ICON.default;

const SearchBar: React.FC<Props> = ({ allLocations, onSelect }) => {
  const [query, setQuery]               = useState("");
  const [focused, setFocused]           = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [inputRect, setInputRect]       = useState<DOMRect | null>(null);
  const inputRef    = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // ── Track keyboard height via Ionic events ──
  useEffect(() => {
    const onShow = (e: any) => {
      setKeyboardHeight(e.keyboardHeight ?? 300);
      // Re-measure input position when keyboard opens
      if (inputRef.current) {
        setInputRect(inputRef.current.getBoundingClientRect());
      }
    };
    const onHide = () => setKeyboardHeight(0);

    window.addEventListener("ionKeyboardDidShow", onShow);
    window.addEventListener("ionKeyboardDidHide", onHide);

    // Fallback: also listen to visualViewport resize (works on most mobile browsers)
    const onViewportResize = () => {
      if (!window.visualViewport) return;
      const kbHeight = window.innerHeight - window.visualViewport.height;
      setKeyboardHeight(Math.max(0, kbHeight));
      if (inputRef.current) {
        setInputRect(inputRef.current.getBoundingClientRect());
      }
    };

    window.visualViewport?.addEventListener("resize", onViewportResize);

    return () => {
      window.removeEventListener("ionKeyboardDidShow", onShow);
      window.removeEventListener("ionKeyboardDidHide", onHide);
      window.visualViewport?.removeEventListener("resize", onViewportResize);
    };
  }, []);

  // ── Close on outside tap ──
  useEffect(() => {
    const handler = (e: MouseEvent | TouchEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) {
        setFocused(false);
      }
    };
    document.addEventListener("mousedown", handler);
    document.addEventListener("touchstart", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("touchstart", handler);
    };
  }, []);

  // ── Re-measure input position on focus ──
  const handleFocus = () => {
    setFocused(true);
    if (inputRef.current) {
      setInputRect(inputRef.current.getBoundingClientRect());
    }
  };

  const suggestions = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return allLocations
      .filter(
        (l) =>
          l.name.toLowerCase().includes(q) ||
          (l.category || "").toLowerCase().includes(q) ||
          (l.acronyms || []).some((a: string) => a.toLowerCase().includes(q))
      )
      .slice(0, 6);
  }, [query, allLocations]);

  const showDropdown = focused && suggestions.length > 0;

  const handleSelect = (loc: CampusLocation) => {
    onSelect(loc);
    setQuery("");
    setFocused(false);
    inputRef.current?.blur();
  };

  // ── Compute dropdown position ──
  // When keyboard is open: anchor ABOVE the keyboard using fixed positioning
  // When keyboard is closed: render below the input as normal
  const getDropdownStyle = (): React.CSSProperties => {
    const keyboardOpen = keyboardHeight > 50;

    if (keyboardOpen && inputRect) {
      // Position fixed above the keyboard
      return {
        position:   "fixed",
        left:       inputRect.left,
        width:      inputRect.width,
        bottom:     keyboardHeight + 8,
        top:        "auto",
        zIndex:     9999,
        maxHeight:  `calc(100vh - ${inputRect.bottom + 8}px - ${keyboardHeight}px)`,
        overflowY:  "auto",
      };
    }

    // Default: below input, absolute
    return {
      position:  "absolute",
      left:      0,
      right:     0,
      top:       "100%",
      marginTop: "6px",
      zIndex:    9999,
      maxHeight: "320px",
      overflowY: "auto",
    };
  };

  return (
    <>
      <style>{`
        @keyframes dropIn {
          from { opacity: 0; transform: translateY(6px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .search-drop { animation: dropIn 0.18s cubic-bezier(0.16,1,0.3,1); }

        @keyframes dropUp {
          from { opacity: 0; transform: translateY(-6px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .search-drop-up { animation: dropUp 0.18s cubic-bezier(0.16,1,0.3,1); }
      `}</style>

      <div
        ref={containerRef}
        className="w-3/4 px-4 mt-2 z-40 relative"
      >
        {/* ── Input ── */}
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={handleFocus}
          placeholder="Search for cafeteria, library, lab…"
          autoComplete="off"
          className="w-full rounded-full shadow-md px-4 py-2.5 text-white
                     bg-gray-900 text-white placeholder-white
                     border border-white/10
                     focus:outline-none focus:border-amber-400/50
                     focus:shadow-[0_0_0_3px_rgba(251,191,36,0.15)]
                     transition-all duration-200"
        />

        {/* ── Dropdown ── */}
        {showDropdown && (
          <div
            className={`${keyboardHeight > 50 ? "search-drop-up" : "search-drop"}
                        bg-gray-900 border border-white/10 rounded-2xl
                        overflow-hidden shadow-2xl`}
            style={getDropdownStyle()}
          >
            {/* Header */}
            <div className="px-3 py-2 border-b border-white/5 flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                {suggestions.length} result{suggestions.length !== 1 ? "s" : ""}
              </span>
              {keyboardHeight > 50 && (
                <span className="text-[10px] text-amber-400/60">↑ results above keyboard</span>
              )}
            </div>

            {/* Results */}
            {suggestions.map((s) => {
              const color = getCategoryColor(s.category);
              const icon  = getCategoryIcon(s.category);
              return (
                <div
                  key={s.id}
                  onPointerDown={(e) => {
                    // Use onPointerDown instead of onClick so it fires
                    // before the input's onBlur closes the dropdown
                    e.preventDefault();
                    handleSelect(s);
                  }}
                  className="flex items-center gap-3 px-4 py-3
                             cursor-pointer transition-colors
                             hover:bg-white/5 active:bg-white/10
                             border-b border-white/5 last:border-0"
                >
                  {/* Icon */}
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-base"
                    style={{
                      background: `${color}18`,
                      border:     `1px solid ${color}30`,
                    }}
                  >
                    {icon}
                  </div>

                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-white truncate">
                      {s.name}
                    </div>
                    <span
                      className="text-[10px] font-bold px-1.5 py-0.5 rounded-md uppercase tracking-wider"
                      style={{ background: `${color}20`, color }}
                    >
                      {s.category}
                    </span>
                  </div>
                </div>
              );
            })}

            {/* Footer */}
            <div className="px-4 py-2 border-t border-white/5 flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-[10px] text-gray-600">Oakwood University Campus</span>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default SearchBar;