// MapView/components/LocationModal.tsx
import React, { useState } from "react";
import { IonModal, IonContent, IonButton } from "@ionic/react";
import { CampusLocation } from "../types/data";
import { makeAvatarColor, makeIconForCategory, openDirections } from "../utils";
import { CATEGORY_COLOR } from "../constant/index";

interface Props {
  location: CampusLocation | null;
  isOpen: boolean;
  onClose: () => void;
  onFavoriteToggle?: () => void;
  isFavorited?: boolean;
  showSaveTooltip?: boolean;
}

type Tab = "info" | "hours" | "details";

// Small reusable row for the info tab
const InfoRow: React.FC<{ icon: string; label: string; value?: string }> = ({ icon, label, value }) => {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3 py-2 border-b border-white/10 last:border-0">
      <span className="text-lg mt-0.5">{icon}</span>
      <div className="flex-1 min-w-0">
        <p className="text-[11px] text-gray-400 uppercase tracking-widest font-semibold mb-0.5">{label}</p>
        <p className="text-sm text-gray-100 leading-snug">{value}</p>
      </div>
    </div>
  );
};

// Colored badge for the category
const CategoryBadge: React.FC<{ category?: string }> = ({ category }) => {
  if (!category) return null;
  const color = CATEGORY_COLOR[category] || CATEGORY_COLOR.default;
  return (
    <span
      className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest"
      style={{ background: `${color}22`, color, border: `1px solid ${color}44` }}
    >
      {makeIconForCategory(category)} {category}
    </span>
  );
};

const LocationModal: React.FC<Props> = ({
  location,
  isOpen,
  onClose,
  onFavoriteToggle,
  isFavorited,
  showSaveTooltip,
}) => {
  const [activeTab, setActiveTab] = useState<Tab>("info");

  if (!location) return null;

  const avatarColor = makeAvatarColor(location.name);

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: "info",    label: "Overview", icon: "📍" },
    { id: "hours",   label: "Hours",    icon: "🕐" },
    { id: "details", label: "Details",  icon: "📋" },
  ];

  return (
    <IonModal isOpen={isOpen} onDidDismiss={onClose}>
      <IonContent>
        <div className="min-h-full bg-gray-950 text-white flex flex-col">

          {/* ── Header ── */}
          <div
            className="relative px-5 pt-10 pb-6 flex flex-col items-center gap-3"
            style={{
              background: `linear-gradient(160deg, ${avatarColor}33 0%, #111827 80%)`,
              borderBottom: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center text-gray-300"
              aria-label="Close"
            >
              ✕
            </button>

            {/* Avatar circle */}
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-xl text-4xl font-black text-white"
              style={{ background: avatarColor, boxShadow: `0 8px 32px ${avatarColor}55` }}
            >
              {location.name.charAt(0).toUpperCase()}
            </div>

            <div className="text-center">
              <h2 className="text-xl font-bold text-white leading-tight mb-1">{location.name}</h2>
              <CategoryBadge category={location.category} />
            </div>

            {showSaveTooltip && (
              <div className="mt-1 px-3 py-1.5 bg-yellow-400/20 border border-yellow-400/40 rounded-lg text-yellow-300 text-xs text-center animate-pulse">
                💡 Tap "Save" to add this to your favorites!
              </div>
            )}
          </div>

          {/* ── Tabs ── */}
          <div className="flex border-b border-white/10 bg-gray-900/60 backdrop-blur-sm">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-3 text-xs font-bold tracking-wider uppercase transition-colors flex flex-col items-center gap-0.5 ${
                  activeTab === tab.id
                    ? "text-orange-400 border-b-2 border-orange-400"
                    : "text-gray-500 hover:text-gray-300"
                }`}
              >
                <span className="text-base">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* ── Tab Content ── */}
          <div className="flex-1 px-5 py-5">

            {/* Overview */}
            {activeTab === "info" && (
              <div className="flex flex-col gap-1">
                {location.description && (
                  <p className="text-gray-300 text-sm leading-relaxed mb-4">
                    {location.description}
                  </p>
                )}
                <InfoRow icon="📍" label="Category"    value={location.category} />
                <InfoRow icon="🌐" label="Coordinates" value={`${location.lat.toFixed(5)}, ${location.lng.toFixed(5)}`} />
              </div>
            )}

            {/* Hours */}
            {activeTab === "hours" && (
              <div>
                {location.hours ? (
                  <div className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden">
                    <div className="px-4 py-3 bg-white/5 border-b border-white/10 flex items-center gap-2">
                      <span className="text-orange-400">🕐</span>
                      <span className="text-xs font-bold uppercase tracking-widest text-gray-300">
                        Operating Hours
                      </span>
                    </div>
                    <div className="px-5 py-4 flex items-center justify-between">
                      <div className="text-center">
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Opens</p>
                        <p className="text-2xl font-black text-green-400">{location.hours.open}</p>
                      </div>
                      <div className="text-gray-600 text-2xl">→</div>
                      <div className="text-center">
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Closes</p>
                        <p className="text-2xl font-black text-red-400">
                          {location.hours.close === "—" ? "24/7" : location.hours.close}
                        </p>
                      </div>
                    </div>
                    {(location.hours.open === "24/7" || location.hours.close === "—") && (
                      <div className="px-4 py-2 bg-green-500/10 border-t border-white/10 text-center">
                        <span className="text-xs text-green-400 font-semibold">✅ Open 24 hours / 7 days</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-10 text-gray-500 text-sm">
                    No hours information available.
                  </div>
                )}
              </div>
            )}

            {/* Details */}
            {activeTab === "details" && (
              <div>
                {location.extra ? (
                  <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-2">
                      Additional Info
                    </p>
                    <p className="text-sm text-gray-200 leading-relaxed">{location.extra}</p>
                  </div>
                ) : (
                  <div className="text-center py-10 text-gray-500 text-sm">
                    No additional details available.
                  </div>
                )}
              </div>
            )}

          </div>

          {/* ── Actions ── */}
          <div className="px-5 pb-8 pt-3 flex flex-col gap-2 border-t border-white/10 bg-gray-950">
            <IonButton
              expand="block"
              color="primary"
              onClick={() => openDirections(location.lat, location.lng)}
            >
              🗺️ Get Directions
            </IonButton>

            {/* {onFavoriteToggle && (
              <IonButton
                expand="block"
                fill={isFavorited ? "solid" : "outline"}
                color={isFavorited ? "warning" : "medium"}
                onClick={onFavoriteToggle}
              >
                {isFavorited ? "★ Saved to Favorites" : "☆ Save to Favorites"}
              </IonButton>
            )} */}

            <IonButton expand="block" fill="clear" onClick={onClose} className="text-gray-400">
              Close
            </IonButton>
          </div>

        </div>
      </IonContent>
    </IonModal>
  );
};

export default LocationModal;