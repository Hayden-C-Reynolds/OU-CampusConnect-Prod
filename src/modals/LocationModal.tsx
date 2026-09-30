// MapView/components/LocationModal.tsx
import React, { useMemo, useState } from "react";
import { IonModal, IonContent, IonIcon } from "@ionic/react";
import {
  lockClosedOutline,
  mapOutline,
  // navigateOutline,
  starOutline,
  star,
  flagOutline,
  globeOutline,
  callOutline,
  accessibilityOutline,
  locationOutline,
  pricetagOutline,
} from "ionicons/icons";
import { CampusLocation } from "../types/data";
import { IonStorageContext } from "../contexts/StorageContext";
import { makeAvatarColor, makeIconForCategory, openDirections } from "../utils";
import { CATEGORY_COLOR } from "../constant/index";
import ReportIssueModal from "./ReportIssueModal";
import { useLanguage } from "../contexts/LanguageContext";
import { translateCategory } from "../i18n/categories";
import { Language } from "../i18n/translations";

interface Props {
  location: CampusLocation | null;
  isOpen: boolean;
  onClose: () => void;
  onFavoriteToggle?: () => void;
  isFavorited?: boolean;
  isGuest?: boolean;
  showSaveTooltip?: boolean;
}

type Tab = "info" | "hours" | "details";

/** Parses a "7:30 AM" / "11:00 PM" style string into minutes since midnight. */
const parseClock = (s: string): number | null => {
  const m = s.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!m) return null;
  let h = parseInt(m[1], 10) % 12;
  const min = parseInt(m[2], 10);
  if (/pm/i.test(m[3])) h += 12;
  return h * 60 + min;
};

/** Live open/closed status for a location, computed from its stated hours. */
const useOpenStatus = (hours?: { open: string; close: string }) => {
  return useMemo(() => {
    if (!hours) return null;
    if (hours.open === "24/7" || hours.close === "—" || hours.close === "-") {
      return { open: true, alwaysOpen: true };
    }
    const openMin = parseClock(hours.open);
    const closeMin = parseClock(hours.close);
    if (openMin === null || closeMin === null) return null;
    const now = new Date();
    const nowMin = now.getHours() * 60 + now.getMinutes();
    const isOpen =
      closeMin > openMin
        ? nowMin >= openMin && nowMin < closeMin
        : nowMin >= openMin || nowMin < closeMin; // overnight wrap
    return { open: isOpen, alwaysOpen: false };
  }, [hours]);
};

// Small reusable tile for the quick-info grid
const InfoTile: React.FC<{ icon: string; label: string; value?: string; accent: string; wide?: boolean; href?: string }> = ({
  icon,
  label,
  value,
  accent,
  wide,
  href,
}) => {
  if (!value) return null;
  const content = (
    <>
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-sm"
        style={{ background: `${accent}1f`, color: accent }}
      >
        <IonIcon icon={icon} />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-0.5">{label}</p>
        <p className={`text-sm text-gray-100 leading-snug ${href ? "" : "truncate"}`}>{value}</p>
      </div>
    </>
  );
  const className = `flex items-center gap-2.5 rounded-xl p-3 border border-white/10 ${wide ? "col-span-2" : ""}`;
  const style = { backgroundColor: "var(--cc-surface-soft)" };

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={`${className} hover:border-white/20 transition-colors`} style={style}>
        {content}
      </a>
    );
  }
  return (
    <div className={className} style={style}>
      {content}
    </div>
  );
};

// Colored badge for the category
const CategoryBadge: React.FC<{ category?: string; language: Language }> = ({ category, language }) => {
  if (!category) return null;
  const color = CATEGORY_COLOR[category] || CATEGORY_COLOR.default;
  return (
    <span
      className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest"
      style={{ background: `${color}22`, color, border: `1px solid ${color}44` }}
    >
      {makeIconForCategory(category)} {translateCategory(category, language)}
    </span>
  );
};

// Compact circular icon action button (used in the header quick-actions row)
const IconAction: React.FC<{ icon: string; label: string; onClick: () => void; active?: boolean; accent?: string }> = ({
  icon,
  label,
  onClick,
  active,
  accent = "#e8b341",
}) => (
  <button
    onClick={onClick}
    className="flex flex-col items-center gap-1 flex-1"
    aria-label={label}
  >
    <div
      className="w-11 h-11 rounded-full flex items-center justify-center text-lg transition-transform active:scale-90"
      style={{
        background: active ? `${accent}26` : "rgba(255,255,255,0.08)",
        border: `1px solid ${active ? `${accent}55` : "rgba(255,255,255,0.12)"}`,
        color: active ? accent : "#e5e7eb",
      }}
    >
      <IonIcon icon={icon} />
    </div>
    <span className="text-[10px] font-semibold text-gray-400 leading-none">{label}</span>
  </button>
);

const LocationModal: React.FC<Props> = ({
  location,
  isOpen,
  onClose,
  onFavoriteToggle,
  isFavorited,
  isGuest,
  showSaveTooltip,
}) => {
  // const router = useIonRouter();
  const { t, language } = useLanguage();
  const { handleOnCreateNewEntry } = React.useContext(IonStorageContext);
  const [activeTab, setActiveTab] = useState<Tab>("info");
  const [reportOpen, setReportOpen] = useState(false);

  const status = useOpenStatus(location?.hours);

  if (!location) return null;

  const avatarColor = makeAvatarColor(location.name);

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: "info",    label: t("location.overview"), icon: "📍" },
    { id: "hours",   label: t("location.hours"),    icon: "🕐" },
    { id: "details", label: t("location.details"),  icon: "📋" },
  ];
  const activeIndex = tabs.findIndex((tb) => tb.id === activeTab);

  // Only clear the guest session here — App.tsx's guard effect owns
  // navigation and pushes to /login the moment it sees userData go
  // null. Pushing here too raced that effect and left the URL and the
  // visible page out of sync.
  const handleLoginPrompt = async () => {
    onClose();
    await handleOnCreateNewEntry("user", null);
  };

  // const handleNavigateInApp = () => {
  //   onClose();
  //   router.push(`/directions?dest=${location.lat},${location.lng}`, "forward");
  // };

  return (
    <IonModal isOpen={isOpen} onDidDismiss={onClose}>
      <IonContent>
        <div id="cc-tour-modal" className="min-h-full bg-gray-950 text-white flex flex-col">

          {/* ── Header ── */}
          <div
            className="relative flex flex-col items-center overflow-hidden"
            style={{
              background: location.imageUrl
                ? "#111827"
                : `linear-gradient(160deg, ${avatarColor}2e 0%, #111827 75%)`,
              borderBottom: "1px solid var(--cc-border)",
            }}
          >
            {/* Drag handle */}
            <div className="w-9 h-1 rounded-full bg-white/20 mt-2.5 mb-1 relative z-10" />

            {/* Soft glow behind the avatar when there's no photo */}
            {!location.imageUrl && (
              <div
                className="absolute pointer-events-none"
                style={{
                  top: "-30px",
                  width: "220px",
                  height: "220px",
                  borderRadius: "9999px",
                  background: `radial-gradient(circle, ${avatarColor}3d 0%, transparent 70%)`,
                }}
              />
            )}

            {/* Photo (when available) */}
            {location.imageUrl && (
              <div className="relative w-full h-44 overflow-hidden">
                <img
                  src={location.imageUrl}
                  alt={location.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display = "none";
                  }}
                />
                <div
                  className="absolute inset-0"
                  style={{ background: "linear-gradient(180deg, rgba(17,24,39,0.1) 0%, #111827 92%)" }}
                />
              </div>
            )}

            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 transition-colors flex items-center justify-center text-gray-200 z-10"
              aria-label={t("common.close")}
            >
              ✕
            </button>

            <div className={`relative flex flex-col items-center gap-3 px-5 w-full ${location.imageUrl ? "-mt-10 pb-5" : "pt-8 pb-6"}`}>
              {/* Avatar circle */}
              <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-xl text-4xl font-black text-white border-4"
                style={{
                  background: avatarColor,
                  boxShadow: `0 8px 32px ${avatarColor}55`,
                  borderColor: "#111827",
                }}
              >
                {location.name.charAt(0).toUpperCase()}
              </div>

              <div className="text-center">
                <h2 className="text-xl font-bold text-white leading-tight mb-1.5">{location.name}</h2>
                <div className="flex items-center justify-center gap-1.5 flex-wrap">
                  <CategoryBadge category={location.category} language={language} />
                  {status && (
                    <span
                      className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest"
                      style={
                        status.open
                          ? { background: "rgba(74,222,128,0.15)", color: "#4ade80", border: "1px solid rgba(74,222,128,0.3)" }
                          : { background: "rgba(248,113,113,0.15)", color: "#f87171", border: "1px solid rgba(248,113,113,0.3)" }
                      }
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ background: status.open ? "#4ade80" : "#f87171" }}
                      />
                      {status.open ? t("location.openNow") : t("location.closedNow")}
                    </span>
                  )}
                </div>
              </div>

              {showSaveTooltip && (
                <div className="mt-0.5 px-3 py-1.5 bg-amber-400/20 border border-amber-400/40 rounded-lg text-amber-300 text-xs text-center animate-pulse">
                  💡 {t("location.saveTooltip")}
                </div>
              )}

              {/* Quick actions */}
              <div className="flex w-full max-w-[280px] mt-1">
                <IconAction icon={mapOutline} label={t("location.actionDirections")} onClick={() => openDirections(location.lat, location.lng)} />
                {/* <IconAction icon={navigateOutline} label={t("location.actionNavigate")} onClick={handleNavigateInApp} /> */}
                {isGuest ? (
                  <IconAction icon={lockClosedOutline} label={t("location.actionSave")} onClick={handleLoginPrompt} />
                ) : (
                  onFavoriteToggle && (
                    <IconAction
                      icon={isFavorited ? star : starOutline}
                      label={isFavorited ? t("location.actionSaved") : t("location.actionSave")}
                      onClick={onFavoriteToggle}
                      active={isFavorited}
                    />
                  )
                )}
                <IconAction icon={flagOutline} label={t("location.actionReport")} onClick={() => setReportOpen(true)} />
              </div>
            </div>
          </div>

          {/* ── Tabs (segmented pill) ── */}
          <div className="px-5 pt-4 pb-1" style={{ backgroundColor: "var(--cc-bg)" }}>
            <div
              className="relative flex p-1 rounded-2xl border border-white/10"
              style={{ backgroundColor: "var(--cc-surface-soft)" }}
            >
              <div
                className="absolute top-1 bottom-1 rounded-xl transition-all duration-300 ease-out"
                style={{
                  left: `calc(${activeIndex} * (100% / 3) + 4px)`,
                  width: `calc(100% / 3 - 8px)`,
                  background: "rgba(232,179,65,0.18)",
                  border: "1px solid rgba(232,179,65,0.35)",
                }}
              />
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative z-10 flex-1 py-2.5 text-xs font-bold tracking-wide flex items-center justify-center gap-1.5 rounded-xl transition-colors ${
                    activeTab === tab.id ? "text-amber-300" : "text-gray-500"
                  }`}
                >
                  <span className="text-sm">{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* ── Tab Content ── */}
          <div className="flex-1 px-5 py-5">

            {/* Overview */}
            {activeTab === "info" && (
              <div className="flex flex-col gap-4">
                {location.description && (
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {location.description}
                  </p>
                )}
                <div className="grid grid-cols-2 gap-2.5">
                  <InfoTile
                    icon={pricetagOutline}
                    label={t("location.category")}
                    value={translateCategory(location.category, language)}
                    accent={CATEGORY_COLOR[location.category] || CATEGORY_COLOR.default}
                  />
                  <InfoTile
                    icon={accessibilityOutline}
                    label={t("location.accessibility")}
                    value={location.accessibility}
                    accent="#38bdf8"
                  />
                  <InfoTile
                    icon={callOutline}
                    label={t("location.contact")}
                    value={location.contact}
                    accent="#4ade80"
                  />
                  <InfoTile
                    icon={globeOutline}
                    label={t("location.website")}
                    value={location.website ? location.website.replace(/^https?:\/\//, "") : undefined}
                    accent="#818cf8"
                    href={location.website}
                    wide={!location.contact || !location.accessibility}
                  />
                  <InfoTile
                    icon={locationOutline}
                    label={t("location.coordinates")}
                    value={`${location.lat.toFixed(5)}, ${location.lng.toFixed(5)}`}
                    accent="#e8b341"
                    wide
                  />
                </div>
              </div>
            )}

            {/* Hours */}
            {activeTab === "hours" && (
              <div>
                {location.hours ? (
                  <div className="rounded-2xl overflow-hidden border border-white/10" style={{ backgroundColor: "var(--cc-surface-soft)" }}>
                    <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span style={{ color: "#e8b341" }}>🕐</span>
                        <span className="text-xs font-bold uppercase tracking-widest text-gray-300">
                          {t("location.hours")}
                        </span>
                      </div>
                      {status && (
                        <span
                          className="inline-flex items-center gap-1.5 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-widest"
                          style={
                            status.open
                              ? { background: "rgba(74,222,128,0.15)", color: "#4ade80" }
                              : { background: "rgba(248,113,113,0.15)", color: "#f87171" }
                          }
                        >
                          <span className="w-1.5 h-1.5 rounded-full" style={{ background: status.open ? "#4ade80" : "#f87171" }} />
                          {status.open ? t("location.openNow") : t("location.closedNow")}
                        </span>
                      )}
                    </div>
                    <div className="px-5 py-5 flex items-center justify-between">
                      <div className="text-center flex-1">
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">{t("location.opens")}</p>
                        <p className="text-2xl font-black text-green-400">{location.hours.open}</p>
                      </div>
                      <div className="text-gray-600 text-xl px-2">→</div>
                      <div className="text-center flex-1">
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">{t("location.closes")}</p>
                        <p className="text-2xl font-black text-red-400">
                          {location.hours.close === "—" ? "24/7" : location.hours.close}
                        </p>
                      </div>
                    </div>
                    {(location.hours.open === "24/7" || location.hours.close === "—") && (
                      <div className="px-4 py-2 bg-green-500/10 border-t border-white/10 text-center">
                        <span className="text-xs text-green-400 font-semibold">✅ {t("location.open247")}</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-10 text-gray-500 text-sm">
                    {t("location.hoursNotAvailable")}
                  </div>
                )}
              </div>
            )}

            {/* Details */}
            {activeTab === "details" && (
              <div>
                {location.extra ? (
                  <div className="rounded-2xl p-4 border border-white/10" style={{ backgroundColor: "var(--cc-surface-soft)" }}>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-2">
                      {t("location.additionalInfo")}
                    </p>
                    <p className="text-sm text-gray-200 leading-relaxed">{location.extra}</p>
                  </div>
                ) : (
                  <div className="text-center py-10 text-gray-500 text-sm">
                    {t("location.noAdditionalDetails")}
                  </div>
                )}
              </div>
            )}

          </div>

          {/* ── Primary action ── */}
          <div className="px-5 pb-8 pt-2 border-t border-white/10 bg-gray-950">
            <button
              onClick={() => openDirections(location.lat, location.lng)}
              className="w-full rounded-full py-4 font-bold text-[15px] flex items-center justify-center gap-2.5 transition-transform active:scale-[0.98]"
              style={{
                background: "linear-gradient(135deg, #f0c669, #e8b341)",
                color: "#1a1200",
                boxShadow: "0 10px 28px rgba(232,179,65,0.38), inset 0 1px 0 rgba(255,255,255,0.35)",
              }}
            >
              <span
                className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-sm"
                style={{ background: "rgba(26,18,0,0.12)" }}
              >
                🗺️
              </span>
              {t("location.getDirections")}
            </button>

            {isGuest && (
              <p className="text-center text-[11px] text-gray-500 mt-3">
                {t("location.logInToSave")}
              </p>
            )}
          </div>

        </div>
      </IonContent>

      <ReportIssueModal
        isOpen={reportOpen}
        onClose={() => setReportOpen(false)}
        location={location}
      />
    </IonModal>
  );
};

export default LocationModal;