import {
  IonContent,
  IonPage,
  IonText,
  IonButton,
  useIonViewWillEnter,
} from "@ionic/react";
import React, { useState } from "react";
import TabBar from "../components/navigation/TabBar";
import { campusEvents, CampusEvent } from "../types/eventsList";
import { campusLocations } from "../types/locations";
import { openDirections, openDirectionsByAddress } from "../utils";
import { useLanguage } from "../contexts/LanguageContext";

/*************************
 ******** CONSTANTS ********
 *********************** */


const categoryColors: Record<string, string> = {
  Social:    "rgba(232,179,65,0.15)",
  Workshop:  "rgba(76,126,243,0.15)",
  Meeting:   "rgba(167,139,250,0.15)",
  Sports:    "rgba(52,211,153,0.15)",
  Music:     "rgba(232,179,65,0.15)",
  Spiritual: "rgba(76,126,243,0.15)",
  Ceremony:  "rgba(167,139,250,0.15)",
  Dining: "var(--cc-text-tertiary)",
  Academic:  "rgba(76,126,243,0.15)",
};

const categoryTextColors: Record<string, string> = {
  Social:    "#e8b341",
  Workshop:  "#6f97f5",
  Meeting:   "#a78bfa",
  Sports:    "#34d399",
  Music:     "#e8b341",
  Spiritual: "#6f97f5",
  Ceremony:  "#a78bfa",
  Dining:    "#d1d5db",
  Academic:  "#6f97f5",
};

/*************************
 ******** HELPERS ********
 *********************** */

const isDatePast = (date: string): boolean => {
  const now = new Date();
  // Compare just the date portion — all events on a day are "past" after midnight
  const eventDay = new Date(`${date}, 2026 11:59 PM`);
  return eventDay < now;
};

const getDateOrder = (date: string): number =>
  new Date(`${date}, 2026`).getTime();

/*************************
 ******** EVENTS PAGE ********
 *********************** */

const EventsPage: React.FC = () => {
  const { t } = useLanguage();

  /*************************
   ********** VARS ***********
   *********************** */

  const events: CampusEvent[] = campusEvents;
  const hasEvents = events.length > 0;
  const [showPast, setShowPast] = useState(false);

  // ── Filters ──
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<"all" | "today" | "week" | "month">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const allCategories = Array.from(new Set(events.map((e) => e.category))).sort();

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const endOfToday = new Date(startOfToday.getTime() + 24 * 60 * 60 * 1000);
  const endOfWeek = new Date(startOfToday.getTime() + 7 * 24 * 60 * 60 * 1000);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());

  const matchesDateRange = (dateStr: string): boolean => {
    if (dateRange === "all") return true;
    const eventDate = new Date(`${dateStr}, 2026`);
    if (dateRange === "today") return eventDate >= startOfToday && eventDate < endOfToday;
    if (dateRange === "week") return eventDate >= startOfToday && eventDate < endOfWeek;
    if (dateRange === "month") return eventDate >= startOfToday && eventDate < endOfMonth;
    return true;
  };

  const filteredEvents = events.filter((e) => {
    if (activeCategory && e.category !== activeCategory) return false;
    if (!matchesDateRange(e.date)) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      if (!e.title.toLowerCase().includes(q) && !e.location.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const hasActiveFilters = !!activeCategory || dateRange !== "all" || !!searchQuery.trim();

  // Group events by date
  const grouped = filteredEvents.reduce<Record<string, CampusEvent[]>>((acc, event) => {
    if (!acc[event.date]) acc[event.date] = [];
    acc[event.date].push(event);
    return acc;
  }, {});

  Object.keys(grouped).forEach((date) => {
    grouped[date].sort((a, b) => {
      return new Date(`${a.date}, 2026 ${a.startTime}`).getTime() - 
        new Date(`${b.date}, 2026 ${b.startTime}`).getTime();
    });
  });

  // Split into upcoming and past, sorted chronologically
  const upcomingDates = Object.keys(grouped)
    .filter((date) => !isDatePast(date))
    .sort((a, b) => getDateOrder(a) - getDateOrder(b));

  const pastDates = Object.keys(grouped)
    .filter((date) => isDatePast(date))
    .sort((a, b) => getDateOrder(a) - getDateOrder(b));

  /*************************
   ******** FUNCTIONS ********
   *********************** */

  useIonViewWillEnter(() => {
    // Any view-enter logic if needed
  });

  const handleGetDirections = (event: CampusEvent) => {
    if (event.locationId) {
      const loc = campusLocations.find((l) => l.id === event.locationId);
      if (loc) openDirections(loc.lat, loc.lng);
    } else if (event.address) {
      openDirectionsByAddress(event.address);
    }
  };

  const hasDirections = (event: CampusEvent) =>
    !!event.locationId || !!event.address;

  /*************************
   ******** RENDER CARD ********
   *********************** */

  const renderEventCard = (event: CampusEvent, i: number, groupIndex: number, isPast: boolean) => (
    <div
      key={event.id}
      className="fade-up rounded-2xl px-4 py-3"
      style={{
        animationDelay: `${groupIndex * 0.07 + i * 0.04}s`,
        background: isPast ? "var(--cc-surface-soft)" : "var(--cc-text-tertiary)",
        border: "1px solid var(--cc-border)",
        opacity: isPast ? 0.5 : 1,
      }}
    >
      {/* Category badge + time */}
      <div className="flex items-center justify-between mb-1.5">
        <span
          className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
          style={{
            background: categoryColors[event.category] ?? "var(--cc-text-tertiary)",
            color: categoryTextColors[event.category] ?? "#9ca3af",
          }}
        >
          {event.category}
        </span>
        <span className="text-xs text-white/40">
          {event.startTime}{event.endTime ? ` – ${event.endTime}` : ""}
        </span>
      </div>

      {/* Title */}
      <IonText>
        <p className="text-white font-semibold text-sm leading-snug mb-1">
          {event.title}
        </p>
      </IonText>

      {/* Location */}
      <div className="flex items-center gap-1.5 mb-3">
        <span style={{ fontSize: "11px" }}>📍</span>
        <span className="text-white/40 text-xs">{event.location}</span>
      </div>

      {/* Get Directions */}
      {hasDirections(event) && !isPast && (
        <IonButton
          expand="block"
          size="small"
          onClick={() => handleGetDirections(event)}
          style={{
            "--background": "var(--cc-surface-soft)",
            "--background-activated": "var(--cc-border-strong)",
            "--color": "#ffffff",
            "--border-radius": "12px",
            "--border-width": "1px",
            "--border-style": "solid",
            "--border-color": "var(--cc-border)",
            fontSize: "12px",
            fontWeight: "600",
          }}
        >
          🗺️ Get Directions
        </IonButton>
      )}
    </div>
  );

  const renderDateGroup = (date: string, groupIndex: number, isPast: boolean) => (
    <div
      key={date}
      className="fade-up mb-6"
      style={{ animationDelay: `${groupIndex * 0.07}s` }}
    >
      {/* Date header */}
      <div className="flex items-center gap-3 mb-3 px-1">
        <span className="text-xs font-bold uppercase tracking-widest text-yellow-400">
          {date}
        </span>
        <div className="flex-1 h-px bg-white/10" />
        <span className="text-xs text-white/30">{grouped[date].length} events</span>
      </div>

      {/* Event cards */}
      <div className="flex flex-col gap-3 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-4">
        {grouped[date].map((event, i) => renderEventCard(event, i, groupIndex, isPast))}
      </div>
    </div>
  );

  /*************************
   ******** RENDER ********
   *********************** */

  return (
    <IonPage>
      <IonContent fullscreen className="bg-black text-white">
        <style>{`
          @keyframes fadeUp {
            from { opacity: 0; transform: translateY(16px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          .fade-up { animation: fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) both; }

          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50%       { transform: translateY(-8px); }
          }
          .float { animation: float 3s ease-in-out infinite; }

          .no-scrollbar::-webkit-scrollbar { display: none; }
          .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        `}</style>

        {hasEvents ? (
          <div className="px-4 md:px-8 pt-6 pb-32 max-w-5xl mx-auto">

            {/* Header */}
            <div className="fade-up mb-6 px-1">
              <IonText>
                <h1 className="text-2xl font-black text-white tracking-tight">
                  {t("events.title")}
                </h1>
              </IonText>
              <p className="text-sm mt-1" style={{ color: "var(--cc-text-secondary)" }}>
                Oakwood University
              </p>
            </div>

            {/* ── Filters ── */}
            <div className="fade-up mb-5 flex flex-col gap-3">
              {/* Search box */}
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t("events.search")}
                  className="w-full rounded-xl pl-4 pr-9 py-2.5 text-white text-sm placeholder-white/30 focus:outline-none"
                  style={{
                    backgroundColor: "var(--cc-surface-soft)",
                    border: "1px solid var(--cc-border)",
                  }}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 text-sm"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Date range toggle */}
              <div className="flex gap-2 overflow-x-auto no-scrollbar">
                {([
                  { id: "all",   label: t("events.all") },
                  { id: "today", label: t("events.today") },
                  { id: "week",  label: t("events.thisWeek") },
                  { id: "month", label: t("events.thisMonth") },
                ] as const).map((r) => (
                  <button
                    key={r.id}
                    onClick={() => setDateRange(r.id)}
                    className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide border transition-colors ${
                      dateRange === r.id
                        ? "bg-amber-400 text-black border-amber-400"
                        : "bg-white/5 text-white/50 border-white/10"
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>

              {/* Category chips */}
              {allCategories.length > 0 && (
                <div className="flex gap-2 overflow-x-auto no-scrollbar">
                  <button
                    onClick={() => setActiveCategory(null)}
                    className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold border transition-colors ${
                      activeCategory === null
                        ? "bg-white text-black border-white"
                        : "bg-white/5 text-white/50 border-white/10"
                    }`}
                  >
                    {t("events.allCategories")}
                  </button>
                  {allCategories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat === activeCategory ? null : cat)}
                      className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold border transition-colors ${
                        activeCategory === cat
                          ? "border-transparent"
                          : "bg-white/5 text-white/50 border-white/10"
                      }`}
                      style={
                        activeCategory === cat
                          ? {
                              background: categoryColors[cat] ?? "var(--cc-text-tertiary)",
                              color: categoryTextColors[cat] ?? "#fff",
                            }
                          : undefined
                      }
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {hasActiveFilters && filteredEvents.length === 0 && (
              <div className="text-center py-10">
                <p className="text-white/30 text-sm">{t("events.noMatch")}</p>
                <button
                  onClick={() => {
                    setActiveCategory(null);
                    setDateRange("all");
                    setSearchQuery("");
                  }}
                  className="mt-2 text-xs text-amber-400 underline"
                >
                  {t("events.clearFilters")}
                </button>
              </div>
            )}

            {/* Upcoming events */}
            {upcomingDates.length > 0 ? (
              upcomingDates.map((date, i) => renderDateGroup(date, i, false))
            ) : (
              <div className="text-center py-8">
                <p className="text-white/30 text-sm">{t("events.noUpcoming")}</p>
              </div>
            )}

            {/* Past events section */}
            {pastDates.length > 0 && (
              <div className="mt-4">
                {/* Past events toggle */}
                <button
                  onClick={() => setShowPast(!showPast)}
                  className="w-full flex items-center gap-3 mb-4 px-1"
                >
                  <span className="text-xs font-bold uppercase tracking-widest text-white/30">
                    Past Events ({pastDates.reduce((acc, d) => acc + grouped[d].length, 0)})
                  </span>
                  <div className="flex-1 h-px bg-white/10" />
                  <span className="text-white/30 text-xs">{showPast ? "▲ Hide" : "▼ Show"}</span>
                </button>

                {showPast && pastDates.map((date, i) => renderDateGroup(date, i, true))}
              </div>
            )}
          </div>

        ) : (
          /* ── Coming Soon (empty state) ── */
          <div className="flex flex-col h-full items-center justify-center text-center gap-4 px-6">
            <div className="float mb-2">
              <div
                className="w-28 h-28 rounded-[32px] flex items-center justify-center"
                style={{
                  background: "linear-gradient(135deg, rgba(232,179,65,0.15) 0%, rgba(232,179,65,0.05) 100%)",
                  border: "1px solid rgba(232,179,65,0.2)",
                  boxShadow: "0 20px 60px rgba(232,179,65,0.1), 0 4px 16px rgba(0,0,0,0.5)",
                }}
              >
                <span style={{ fontSize: "52px" }}>📅</span>
              </div>
            </div>

            <IonText>
              <h1 className="text-2xl font-black text-white tracking-tight">
                No Events Yet
              </h1>
            </IonText>

            <p className="text-white/50 text-sm leading-relaxed max-w-xs">
              Campus events will appear here once they're added. Check back soon!
            </p>

            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10"
              style={{ background: "var(--cc-surface-soft)" }}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
              <span className="text-[11px] font-bold uppercase tracking-widest text-white/30">
                Coming Soon
              </span>
            </div>
          </div>
        )}

      </IonContent>

      <TabBar />
    </IonPage>
  );
};

export default EventsPage;

/*************************
Footer Comment
**************************
This application was developed by:
- Onell Dishmey: https://github.com/On3l7d15h
- Ramy Campusano: https://github.com/Daniels-not
**************************/