import React, { useState, useMemo, useEffect } from "react";
import { CampusLocation } from "../../types/data";
import { IonIcon } from "@ionic/react";
import { searchOutline } from "ionicons/icons";

interface Props {
  allLocations: CampusLocation[];
  onSelect: (loc: CampusLocation) => void;
}

const SearchBar: React.FC<Props> = ({ allLocations, onSelect }) => {
  const [query, setQuery] = useState("");
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

  // ✅ Handle keyboard events on mobile
  useEffect(() => {
    const showHandler = (e: any) => {
      setKeyboardHeight(e.keyboardHeight || 300); // fallback if not provided
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

  const suggestions = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return allLocations
      .filter(
        (l) =>
          l.name.toLowerCase().includes(q) ||
          (l.category || "").toLowerCase().includes(q)
      )
      .slice(0, 6);
  }, [query, allLocations]);

  return (
    <div
      className={`w-full max-w-3xl mx-auto px-4 z-40 transition-all duration-300 px-12`}
      style={{
        position: isKeyboardOpen ? "absolute" : "fixed",
        // ✅ Safe-area + fallback padding
        top: isKeyboardOpen
          ? `calc(env(safe-area-inset-top, 10px) + ${
              keyboardHeight > 0 ? 10 : 0
            }px)`
          : "env(safe-area-inset-top, 10px)",
        left: "50%",
        transform: "translateX(-50%)",
        paddingTop: "env(safe-area-inset-top, 20px)", 
      }}
    >
      <div className="relative py-10">
        {/* Search icon inside input */}
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
          <IonIcon icon={searchOutline} />
        </div>

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for cafeteria, library, lab…"
          className="w-full rounded-full pl-10 pr-4 py-3 
                     bg-gray-900 text-gray placeholder-gray-500 
                     focus:outline-none focus:ring-2 focus:ring-blue-500 
                     shadow-lg transition-all"
        />
      </div>

      {/* Suggestions Dropdown */}
      {suggestions.length > 0 && (
        <div
          className="absolute left-0 right-0 mt-2 
                     bg-gray-950 shadow-2xl rounded-xl overflow-hidden 
                     z-50 border border-gray-800 animate-slide-down mx-12"
          style={{
            bottom: isKeyboardOpen ? keyboardHeight + 10 : "auto",
          }}
        >
          {suggestions.map((s, index) => (
            <div
              key={s.id}
              onClick={() => {
                onSelect(s);
                setQuery("");
              }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors ${
                hoveredIndex === index ? "bg-gray-800" : "hover:bg-gray-900"
              }`}
            >
              <IonIcon
                icon={searchOutline}
                className="text-gray-400 flex-shrink-0"
              />
              <div className="truncate">
                <div className="font-medium text-white truncate">{s.name}</div>
                <div className="text-xs text-gray-400 truncate">
                  {s.category}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tailwind animation */}
      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-down {
          animation: slideDown 0.18s ease-out;
        }
      `}</style>
    </div>
  );
};

export default SearchBar;
