// MapView/constants/index.ts
import { MapStyle } from "../types";

export const MAPBOX_TOKEN =
  "pk.eyJ1IjoiaHJkYW5pZWxzIiwiYSI6ImNsdGppdmNwaTBxbzUyanBuY3Q5anFvNjcifQ.PPTUzbG7vHYy_4vYY9w2OA";

export const OU_BOUNDS_SW: [number, number] = [-86.6595, 34.7485];
export const OU_BOUNDS_NE: [number, number] = [-86.652, 34.7575];

export const MAP_STYLES: MapStyle[] = [
  { id: "streets",   label: "🌍", url: "mapbox://styles/mapbox/streets-v12",  name: "Streets"   },
  { id: "satellite", label: "🛰️", url: "mapbox://styles/mapbox/satellite-v9", name: "Satellite" },
  { id: "light",     label: "☀️", url: "mapbox://styles/mapbox/light-v11",    name: "Light"     },
  { id: "dark",      label: "🌙", url: "mapbox://styles/mapbox/dark-v11",     name: "Dark"      },
];

export const DEFAULT_MAP_STYLE = "mapbox://styles/mapbox/dark-v11";

export const CATEGORY_COLOR: Record<string, string> = {
  Library:              "#0ea5e9",
  "Admin / Dining":     "#f97316",
  Church:               "#8b5cf6",
  Dormitory:            "#10b981",
  Academic:             "#2563EB",
  "Science / Academic": "#2563EB",
  "Computer Science":   "#7c3aed",
  Recreation:           "#f59e0b",
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
  default:              "#374151",
};

export const AVATAR_COLORS = ["#34d399", "#60a5fa", "#f97316", "#8b5cf6"];

export const CATEGORY_ICON: Record<string, string> = {
  Library:              "📚",
  "Admin / Dining":     "🍽️",
  Church:               "⛪",
  Dormitory:            "🏠",
  Academic:             "🏛️",
  "Science / Academic": "🔬",
  "Computer Science":   "💻",
  Recreation:           "🏃",
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

export const TOUR_STORAGE_KEY = "campusMapTourSeen";
export const SAVE_TOOLTIP_DURATION = 4500;