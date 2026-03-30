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

/*************************
 ******** CONSTANTS ********
 *********************** */


const categoryColors: Record<string, string> = {
  Social:    "rgba(251,191,36,0.15)",
  Workshop:  "rgba(96,165,250,0.15)",
  Meeting:   "rgba(249,115,22,0.15)",
  Sports:    "rgba(52,211,153,0.15)",
  Music:     "rgba(232,121,249,0.15)",
  Spiritual: "rgba(251,146,60,0.15)",
  Ceremony:  "rgba(167,139,250,0.15)",
};

const categoryTextColors: Record<string, string> = {
  Social:    "#fbbf24",
  Workshop:  "#60a5fa",
  Meeting:   "#fb7223",
  Sports:    "#34d399",
  Music:     "#e879f9",
  Spiritual: "#fb923c",
  Ceremony:  "#a78bfa",
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

  /*************************
   ********** VARS ***********
   *********************** */

  const events: CampusEvent[] = campusEvents;
  const hasEvents = events.length > 0;
  const [showPast, setShowPast] = useState(false);

  // Group events by date
  const grouped = events.reduce<Record<string, CampusEvent[]>>((acc, event) => {
    if (!acc[event.date]) acc[event.date] = [];
    acc[event.date].push(event);
    return acc;
  }, {});

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
        background: isPast ? "rgba(255,255,255,0.02)" : "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
        opacity: isPast ? 0.5 : 1,
      }}
    >
      {/* Category badge + time */}
      <div className="flex items-center justify-between mb-1.5">
        <span
          className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
          style={{
            background: categoryColors[event.category] ?? "rgba(255,255,255,0.08)",
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
            "--background": "rgba(255,255,255,0.06)",
            "--background-activated": "rgba(255,255,255,0.12)",
            "--color": "#ffffff",
            "--border-radius": "12px",
            "--border-width": "1px",
            "--border-style": "solid",
            "--border-color": "rgba(255,255,255,0.12)",
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
      <div className="flex flex-col gap-3">
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
        `}</style>

        {hasEvents ? (
          <div className="px-4 pt-6 pb-32">

            {/* Header */}
            <div className="fade-up mb-6 px-1">
              <IonText>
                <h1 className="text-2xl font-black text-white tracking-tight">
                  Alumni Weekend Events
                </h1>
              </IonText>
              <p className="text-white/50 text-sm mt-1">April 1–5 · Oakwood University</p>
            </div>

            {/* Upcoming events */}
            {upcomingDates.length > 0 ? (
              upcomingDates.map((date, i) => renderDateGroup(date, i, false))
            ) : (
              <div className="text-center py-8">
                <p className="text-white/30 text-sm">No upcoming events</p>
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
                  background: "linear-gradient(135deg, rgba(251,191,36,0.15) 0%, rgba(251,191,36,0.05) 100%)",
                  border: "1px solid rgba(251,191,36,0.2)",
                  boxShadow: "0 20px 60px rgba(251,191,36,0.1), 0 4px 16px rgba(0,0,0,0.5)",
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
              style={{ background: "rgba(255,255,255,0.03)" }}
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