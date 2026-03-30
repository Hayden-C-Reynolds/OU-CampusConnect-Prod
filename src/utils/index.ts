// MapView/utils/index.ts
import { CATEGORY_COLOR, AVATAR_COLORS, CATEGORY_ICON } from "../constant/index";

export const makeColorForCategory = (cat?: string): string =>
  (cat && CATEGORY_COLOR[cat]) || CATEGORY_COLOR.default;

export const makeAvatarColor = (name: string): string =>
  AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];

export const makeIconForCategory = (cat?: string): string =>
  (cat && CATEGORY_ICON[cat]) || CATEGORY_ICON.default;

export const injectMarkerStyles = () => {
  if (document.getElementById("ou-user-pulse-style")) return;
  const styleEl = document.createElement("style");
  styleEl.id = "ou-user-pulse-style";
  styleEl.innerHTML = `
    @keyframes ou-pulse {
      0%   { box-shadow: 0 0 0 0 rgba(249,115,22,0.45); }
      70%  { box-shadow: 0 0 0 20px rgba(249,115,22,0); }
      100% { box-shadow: 0 0 0 0 rgba(249,115,22,0); }
    }
    .ou-user-marker {
      border: 2px solid white; box-sizing: border-box;
      display: flex; align-items: center; justify-content: center;
      z-index: 9999 !important;
    }
    .ou-user-marker.pulse { animation: ou-pulse 2s infinite; }
    .ou-user-icon { width: 18px; height: 18px; display: block; }
    .campus-marker-letter { font-weight: 600; color: white; user-select: none; }
    .animate-ping-glow { animation: ping-glow 1.5s ease-in-out; }
    @keyframes ping-glow {
      0%, 100% { box-shadow: 0 0 0 0 rgba(253,224,71,0.5); }
      50%       { box-shadow: 0 0 15px 10px rgba(253,224,71,0.7); }
    }
  `;
  document.head.appendChild(styleEl);
};

export const openDirections = (lat: number, lng: number) => {
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  if (isIOS) window.open(`maps://?daddr=${lat},${lng}`, "_blank");
  else window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, "_blank");
};

export const openDirectionsByAddress = (address: string) => {
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const encoded = encodeURIComponent(address);
  if (isIOS) window.open(`maps://?daddr=${encoded}`, "_blank");
  else window.open(`https://www.google.com/maps/dir/?api=1&destination=${encoded}`, "_blank");
};

export const computeTopOffset = (): number => {
  const selectors = [
    ".app-search-bar", ".search-bar", ".map-search",
    ".search-input", ".ion-searchbar", "#searchbar",
  ];
  let foundHeight = 0;
  for (const sel of selectors) {
    const el = document.querySelector(sel) as HTMLElement | null;
    if (el) {
      const rect = el.getBoundingClientRect();
      if (rect.height > foundHeight) foundHeight = rect.height;
    }
  }
  return Math.max(72, Math.ceil(foundHeight) + 12);
};