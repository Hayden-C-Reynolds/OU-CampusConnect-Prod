import React, { useState, useMemo } from "react";
import { CampusLocation } from "../types/data";

interface Props {
  allLocations: CampusLocation[];
  onSelect: (loc: CampusLocation) => void;
}

const SearchBar: React.FC<Props> = ({ allLocations, onSelect }) => {
  const [query, setQuery] = useState("");

  const suggestions = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return allLocations
      .filter(
        (l) =>
          l.name.toLowerCase().includes(q) ||
          (l.category || "").toLowerCase().includes(q) ||
          (l.acronyms || []).some((a) => a.toLowerCase().includes(q))
      )
      .slice(0, 6);
  }, [query, allLocations]);

  return (
    <div className="w-3/4 px-4 mt-2 z-40 relative">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for cafeteria, library, lab…"
        className="w-full rounded-full shadow-md px-4 py-2 bg-white text-gray-900 placeholder-black focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {suggestions.length > 0 && (
        <div className="absolute left-0 right-0 mt-1 bg-white shadow-lg rounded-b-md overflow-hidden z-50 border border-gray-200">
          {suggestions.map((s) => (
            <div
              key={s.id}
              onClick={() => {
                onSelect(s);
                setQuery("");
              }}
              className="px-4 py-3 hover:bg-blue-100 cursor-pointer transition-colors"
            >
              <div className="font-medium text-gray-900">{s.name}</div>
              <div className="text-xs text-gray-500">{s.category}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
