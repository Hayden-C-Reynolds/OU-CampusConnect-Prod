// src/pages/Home.tsx
import React, { useRef, useState, useEffect } from "react";
import { IonContent, IonPage, useIonRouter } from "@ionic/react";
import MapView, { MapViewHandle } from "../components/map-view/MapView";
import SearchBar from "../components/navigation/SearchBar";
import { campusLocations } from "../types/locations";
import { CampusLocation } from "../types/data";
import { useFavorites } from "../hooks/useFavorites";
import { useHighlightLocation } from "../hooks/useHighlightLocation";
import { campusEvents, CampusEvent } from "../types/eventsList";

/*************************
 ******** HELPERS ********
 *************************/

const parseEventDate = (date: string, time: string): Date => {
  return new Date(`${date}, 2026 ${time}`);
};

const getCurrentOrUpcomingEvent = (): {
  event: CampusEvent;
  status: "now" | "upcoming";
} | null => {
  const now = new Date();

  for (const event of campusEvents) {
    if (!event.endTime) continue;
    const start = parseEventDate(event.date, event.startTime);
    const end   = parseEventDate(event.date, event.endTime);
    if (now >= start && now <= end) {
      return { event, status: "now" };
    }
  }

  const upcoming = campusEvents
    .filter((e) => parseEventDate(e.date, e.startTime) > now)
    .sort(
      (a, b) =>
        parseEventDate(a.date, a.startTime).getTime() -
        parseEventDate(b.date, b.startTime).getTime()
    );

  if (upcoming.length > 0) return { event: upcoming[0], status: "upcoming" };

  return null;
};

const categoryColors: Record<string, string> = {
  Social:    "#fbbf24",
  Workshop:  "#60a5fa",
  Meeting:   "#fb7223",
  Sports:    "#34d399",
  Music:     "#e879f9",
  Spiritual: "#fb923c",
  Ceremony:  "#a78bfa",
};

/*************************
 ******** HOME PAGE ******
 *************************/

const Home: React.FC = () => {
  const mapRef = useRef<MapViewHandle | null>(null);
  const [locations] = useState<CampusLocation[]>(campusLocations);
  const [dismissed, setDismissed] = useState(false);
  const [exiting,   setExiting]   = useState(false);
  const [eventInfo, setEventInfo] = useState<{
    event: CampusEvent;
    status: "now" | "upcoming";
  } | null>(null);

  const { isFavorited, toggleFavorite } = useFavorites();
  const router = useIonRouter();

  useHighlightLocation({ mapRef, locations });

  // Fetch event info + refresh every minute
  useEffect(() => {
    setEventInfo(getCurrentOrUpcomingEvent());
    const interval = setInterval(() => setEventInfo(getCurrentOrUpcomingEvent()), 60000);
    return () => clearInterval(interval);
  }, []);

  // Animated dismiss — plays exit animation then removes banner
  const handleDismiss = () => {
    setExiting(true);
    setTimeout(() => setDismissed(true), 250);
  };

  // Auto-dismiss after 6 seconds
  useEffect(() => {
    const timer = setTimeout(() => handleDismiss(), 6000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <IonPage className="dark bg-black">
      <IonContent fullscreen className="dark bg-black text-white">

        <style>{`
          @keyframes bannerSlideIn {
            from { opacity: 0; transform: translateY(-12px) scale(0.97); }
            to   { opacity: 1; transform: translateY(0) scale(1); }
          }
          @keyframes bannerSlideOut {
            from { opacity: 1; transform: translateY(0) scale(1); }
            to   { opacity: 0; transform: translateY(-12px) scale(0.97); }
          }
          .banner-enter {
            animation: bannerSlideIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) both;
          }
          .banner-exit {
            animation: bannerSlideOut 0.25s cubic-bezier(0.4, 0, 1, 1) forwards;
          }
        `}</style>

        <SearchBar
          allLocations={locations}
          onSelect={(loc) => mapRef.current?.openLocation(loc)}
        />

        <div className="mx-auto relative">
          <MapView
            ref={mapRef}
            locations={locations}
            isFavorited={isFavorited}
            onFavoriteToggle={(
              loc: CampusLocation,
              add: boolean,
              onToast?: (msg: string) => void,
              onClose?: () => void
            ) => toggleFavorite(loc, add, onToast, onClose)}
          />

          {/* ── Floating Event Banner ── */}
          {eventInfo && !dismissed && (
            <div
              className={`absolute top-19 left-4 right-4 z-50 rounded-2xl px-4 py-3 ${
                exiting ? "banner-exit" : "banner-enter"
              }`}
              style={{
                background:    "rgba(0,0,0,0.85)",
                border:        "1px solid rgba(255,255,255,0.1)",
                backdropFilter: "blur(12px)",
                boxShadow:     "0 8px 32px rgba(0,0,0,0.4)",
              }}
            >
              {/* Top row — status badge + dismiss */}
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <div
                    className="w-1.5 h-1.5 rounded-full animate-pulse"
                    style={{
                      background: eventInfo.status === "now" ? "#34d399" : "#fbbf24",
                      boxShadow:  eventInfo.status === "now"
                        ? "0 0 6px #34d399"
                        : "0 0 6px #fbbf24",
                    }}
                  />
                  <span
                    className="text-[10px] font-bold uppercase tracking-widest"
                    style={{
                      color: eventInfo.status === "now" ? "#34d399" : "#fbbf24",
                    }}
                  >
                    {eventInfo.status === "now" ? "Happening Now" : "Coming Up Next"}
                  </span>
                </div>

                <button
                  onClick={handleDismiss}
                  className="text-white/40 hover:text-white/80 text-xl px-1 transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* Event title */}
              <p className="text-white font-bold text-sm leading-snug mb-1">
                {eventInfo.event.title}
              </p>

              {/* Time + location row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-white/40 text-xs">
                    🕐 {eventInfo.event.startTime}
                    {eventInfo.event.endTime ? ` – ${eventInfo.event.endTime}` : ""}
                  </span>
                  <span className="text-white/40 text-xs">
                    📍 {eventInfo.event.location}
                  </span>
                </div>

                {/* Category badge */}
                <span
                  className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                  style={{
                    background: `${categoryColors[eventInfo.event.category] ?? "#9ca3af"}22`,
                    color:       categoryColors[eventInfo.event.category] ?? "#9ca3af",
                  }}
                >
                  {eventInfo.event.category}
                </span>
              </div>

              {/* View all events link */}
              <button
                onClick={() => router.push("/events")}
                className="mt-2 text-xs text-white/50 hover:text-white/80 underline transition-colors"
              >
                View all events →
              </button>
            </div>
          )}
        </div>

      </IonContent>
    </IonPage>
  );
};

export default Home;