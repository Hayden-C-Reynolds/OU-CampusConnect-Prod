// MapView/MapView.tsx
import React, {
  useEffect,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { IonToast } from "@ionic/react";

import { CampusLocation } from "../../types/data";
import { MapViewHandle, MapViewProps, ToastState } from "../../types/index";
import { DEFAULT_MAP_STYLE, MAP_STYLES, TOUR_STORAGE_KEY, SAVE_TOOLTIP_DURATION } from "../../constant/index";
import { computeTopOffset } from "../../utils";
import { useMapInit } from "../../hooks/useMapInit";
import Loader from "../../components/Loaders/GeneralLoader";
import TourOverlay from "../../overlay/index";
import LocationModal from "../../modals/LocationModal";

const MapView = forwardRef<MapViewHandle, MapViewProps>(
  ({ locations, onFavoriteToggle, isFavorited, isGuest }, ref) => {

    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const mapRef          = useRef<mapboxgl.Map | null>(null);
    const markersRef      = useRef<Record<string, mapboxgl.Marker>>({});
    const saveTooltipTimerRef = useRef<number | null>(null);

    const [selectedLocation, setSelectedLocation] = useState<CampusLocation | null>(null);
    const [modalOpen,        setModalOpen]         = useState(false);
    const [mapStyle,         setMapStyle]          = useState(
      localStorage.getItem("cc_map_style") || DEFAULT_MAP_STYLE
    );
    const [styleMenuOpen,    setStyleMenuOpen]     = useState(false);
    const [toast,            setToast]             = useState<ToastState>({ show: false });
    const [showSaveTooltip,  setShowSaveTooltip]   = useState(false);
    const [loading,          setLoading]           = useState(true);
    const [showTour,         setShowTour]          = useState(false);
    const [topOffset,        setTopOffset]         = useState(72);

    // Compute search bar height once on mount
    useEffect(() => {
      setTopOffset(computeTopOffset());
    }, []);

    // Initialize the map
    useMapInit({
      mapContainerRef,
      mapRef,
      markersRef,
      mapStyle,
      topOffset,
      locations,
      isFavorited,
      onLocationClick: (loc) => {
        setSelectedLocation(loc);
        setModalOpen(true);
      },
      onMapLoaded: () => setLoading(false),
      onShowTour:  () => setShowTour(true),
    });

    // Expose flyTo and openLocation to parent via ref
    useImperativeHandle(ref, () => ({
      flyTo: (lat, lng, zoom = 16) => {
        if (!mapRef.current) return;
        const padding = mapRef.current.getPadding?.() || { top: topOffset, left: 0, right: 0, bottom: 0 };
        mapRef.current.flyTo({ center: [lng, lat], zoom, padding });
      },
      openLocation: (loc, opts) => {
        setSelectedLocation(loc);
        setModalOpen(true);

        if (opts?.showSaveTip) {
          setShowSaveTooltip(true);
          if (saveTooltipTimerRef.current) window.clearTimeout(saveTooltipTimerRef.current);
          saveTooltipTimerRef.current = window.setTimeout(() => {
            setShowSaveTooltip(false);
            saveTooltipTimerRef.current = null;
          }, SAVE_TOOLTIP_DURATION);
        } else {
          setShowSaveTooltip(false);
        }

        if (mapRef.current) {
          const padding = mapRef.current.getPadding?.() || { top: topOffset, left: 0, right: 0, bottom: 0 };
          mapRef.current.flyTo({ center: [loc.lng, loc.lat], zoom: 17, padding });
        }
      },
    }));

    // Clear tooltip timer when modal closes
    useEffect(() => {
      if (!modalOpen && saveTooltipTimerRef.current) {
        window.clearTimeout(saveTooltipTimerRef.current);
        saveTooltipTimerRef.current = null;
        setShowSaveTooltip(false);
      }
    }, [modalOpen]);

    const handleNextTourStep = () => {
      if (locations.length > 0) {
        markersRef.current[locations[0].id]?.getElement()?.classList.remove("animate-ping-glow");
      }
      setShowTour(false);
      localStorage.setItem(TOUR_STORAGE_KEY, "true");
    };

    // ✅ This is now called directly — no wrapper hook needed
    const handleFavoriteToggle = () => {
      if (!selectedLocation || !onFavoriteToggle || !isFavorited) return;
      const currently = isFavorited(selectedLocation.id);
      onFavoriteToggle(
        selectedLocation,
        !currently,
        (msg) => setToast({ show: true, message: msg }),
        ()    => setModalOpen(false)
      );
    };

    return (
      <div className="relative w-full h-[calc(110vh-10px)]">
        {loading && <Loader />}

        {showTour && locations.length > 0 && (
          <TourOverlay
            step={1}
            total={1}
            message={`Check out ${locations[0].name}. Tap any marker to see details, hours, and save to favorites!`}
            onNext={handleNextTourStep}
          />
        )}

        <div ref={mapContainerRef} className="w-full h-full overflow-hidden shadow-lg" />

        {/* Map style switcher */}
        <div style={{ position: "absolute", right: "12px", bottom: "100px", zIndex: 60 }}>
          {styleMenuOpen && (
            <div
              className="flex flex-col gap-1 mb-2 p-1.5 rounded-2xl"
              style={{
                backgroundColor: "var(--cc-surface)",
                border: "1px solid var(--cc-border)",
                boxShadow: "0 12px 32px rgba(0,0,0,0.3)",
                animation: "cc-style-menu-in 0.18s cubic-bezier(0.16,1,0.3,1)",
              }}
            >
              {MAP_STYLES.map((s) => {
                const selected = mapStyle === s.url;
                return (
                  <button
                    key={s.id}
                    onClick={() => {
                      setMapStyle(s.url);
                      localStorage.setItem("cc_map_style", s.url);
                      setStyleMenuOpen(false);
                    }}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-colors"
                    style={
                      selected
                        ? { backgroundColor: "rgba(232,179,65,0.15)", color: "#e8b341" }
                        : { color: "var(--cc-text-secondary)" }
                    }
                  >
                    <span>{s.label}</span>
                    {s.name}
                  </button>
                );
              })}
            </div>
          )}
          <button
            onClick={() => setStyleMenuOpen((v) => !v)}
            aria-label="Change map style"
            className="w-11 h-11 rounded-xl flex items-center justify-center text-lg shadow-lg transition-transform"
            style={{
              backgroundColor: "var(--cc-surface)",
              border: "1px solid var(--cc-border)",
              transform: styleMenuOpen ? "scale(1.05)" : "scale(1)",
            }}
          >
            {MAP_STYLES.find((s) => s.url === mapStyle)?.label ?? "🗺️"}
          </button>
        </div>

        <style>{`
          @keyframes cc-style-menu-in {
            from { opacity: 0; transform: translateY(6px); }
            to   { opacity: 1; transform: translateY(0); }
          }
        `}</style>

        <LocationModal
          location={selectedLocation}
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onFavoriteToggle={handleFavoriteToggle}
          isFavorited={selectedLocation ? isFavorited?.(selectedLocation.id) : false}
          isGuest={isGuest}
          showSaveTooltip={showSaveTooltip}
        />

        <IonToast
          isOpen={toast.show}
          message={toast.message}
          duration={2000}
          onDidDismiss={() => setToast({ show: false })}
        />
      </div>
    );
  }
);

MapView.displayName = "MapView";
export default MapView;
export type { MapViewHandle };