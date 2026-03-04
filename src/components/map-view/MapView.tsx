// MapView.tsx - FIXED: Resolved infinite re-render loop
import React, {
  useEffect,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { CampusLocation } from "../../types/data";
import { IonModal, IonButton, IonContent, IonToast } from "@ionic/react";
import { getDatabase, ref as dbRef, set, remove } from "firebase/database";
import { Storage } from "@ionic/storage";
import { useLocation } from "react-router-dom";

mapboxgl.accessToken =
  "pk.eyJ1IjoiaHJkYW5pZWxzIiwiYSI6ImNsdGppdmNwaTBxbzUyanBuY3Q5anFvNjcifQ.PPTUzbG7vHYy_4vYY9w2OA";

const storage = new Storage();
storage.create();

export interface MapViewHandle {
  flyTo: (lat: number, lng: number, zoom?: number) => void;
  openLocation: (loc: CampusLocation, opts?: { showSaveTip?: boolean }) => void;
}

interface Props {
  locations: CampusLocation[];
  onFavoriteToggle?: (loc: CampusLocation, favorited: boolean) => void;
  isFavorited?: (id: string) => boolean;
}

/* ---------- Loader Component ---------- */
const Loader: React.FC = () => (
  <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-50">
    <div className="w-16 h-16 border-4 border-t-orange-500 border-gray-300 rounded-full animate-spin" />
  </div>
);

/* ---------- Guided Tour Overlay ---------- */
const TourOverlay: React.FC<{ step: number; total: number; onNext: () => void; message: string }> = ({ step, total, onNext, message }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
    <div className="absolute inset-0 bg-black/60 pointer-events-auto flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl p-6 max-w-sm text-center pointer-events-auto">
        <h2 className="text-xl font-bold mb-2">Step {step} of {total}</h2>
        <p className="text-sm text-gray-700 mb-4">{message}</p>
        <IonButton expand="block" color="primary" onClick={onNext}>Next</IonButton>
      </div>
    </div>
  </div>
);

/* ---------- Small light-style picker component ---------- */
const CustomStylePicker: React.FC<{
  value: string;
  styles: { id: string; label: string; url: string; name?: string }[];
  onChange: (url: string) => void;
  topOffset?: number;
}> = ({ value, styles, onChange, topOffset = 12 }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onDoc = (e: Event) => {
      if (!ref.current) return;
      if (!(e.target instanceof Node)) return;
      if (!ref.current.contains(e.target)) setOpen(false);
    };
    const onKey = (ev: KeyboardEvent) => {
      if (ev.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("touchstart", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("touchstart", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const current = styles.find((s) => s.url === value) ?? styles[0];

  return (
    <div ref={ref} className="absolute left-3 z-30" style={{ top: `${topOffset + 8}px` }}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 px-3 py-2 rounded-full bg-white/90 text-gray-900 shadow-md backdrop-blur-sm border border-gray-200 hover:scale-105 transition-transform"
        aria-haspopup="menu"
        aria-expanded={open}
        title={`Map style: ${current.name ?? current.id}`}
        style={{ minWidth: 72 }}
      >
        <span className="text-lg">{current.label}</span>
        <span className="text-xs font-medium opacity-90">{current.name ?? current.id}</span>
      </button>

      <div
        className={`mt-2 w-38 rounded-1xl overflow-hidden transform transition-all origin-top-right ${
          open ? "scale-100 opacity-100" : "scale-95 opacity-0 pointer-events-none"
        }`}
        role="menu"
      >
        <div className="bg-white text-gray-900 border border-gray-200">
          {styles.map((s) => {
            const active = s.url === value;
            return (
              <button
                key={s.id}
                onClick={() => {
                  onChange(s.url);
                  setOpen(false);
                }}
                className={`w-full text-left px-3 py-2 flex items-center gap-3 transition-colors hover:bg-gray-50 ${
                  active ? "bg-grey-50" : ""
                }`}
                role="menuitem"
              >
                <span className="text-lg">{s.label}</span>
                <span className="text-sm opacity-90 text-gray-700">{s.name ?? s.id}</span>
                <div style={{ flex: 1 }} />
                {active && <span className="text-xs font-semibold text-gray-600 mx-3 bg-gray">Active</span>}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

/* ---------- Helper: category -> color ---------- */
const CATEGORY_COLOR: Record<string, string> = {
  Library: "#0ea5e9",
  "Admin / Dining": "#f97316",
  Church: "#8b5cf6",
  Dormitory: "#10b981",
  Academic: "#2563EB",
  "Science / Academic": "#2563EB",
  "Computer Science": "#7c3aed",
  Recreation: "#f59e0b",
  Sports: "#ef4444",
  Store: "#06b6d4",
  Facility: "#64748b",
  Ministry: "#ef6aa7",
  Housing: "#fb923c",
  default: "#374151",
};
const makeColorForCategory = (cat?: string) => (cat && CATEGORY_COLOR[cat]) || CATEGORY_COLOR.default;

/* ---------- Main MapView Component ---------- */
const MapView = forwardRef<MapViewHandle, Props>(({ locations, onFavoriteToggle, isFavorited }, ref) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<Record<string, mapboxgl.Marker>>({});
  const [selectedLocation, setSelectedLocation] = useState<CampusLocation | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [mapStyle, setMapStyle] = useState("mapbox://styles/mapbox/dark-v11");
  const [toast, setToast] = useState<{ show: boolean; message?: string }>({ show: false });
  const [showSaveTooltip, setShowSaveTooltip] = useState(false);
  const saveTooltipTimerRef = useRef<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [showTour, setShowTour] = useState(false);

  // topOffset will be used to push map content below any top searchbar
  const [topOffset, setTopOffset] = useState<number>(72);

  const OU_BOUNDS_SW: [number, number] = [-86.6595, 34.7485];
  const OU_BOUNDS_NE: [number, number] = [-86.652, 34.7575];

  const mapStyles = [
    { id: "streets", label: "🌍", url: "mapbox://styles/mapbox/streets-v12", name: "Streets" },
    { id: "satellite", label: "🛰️", url: "mapbox://styles/mapbox/satellite-v9", name: "Satellite" },
    { id: "light", label: "☀️", url: "mapbox://styles/mapbox/light-v11", name: "Light" },
    { id: "dark", label: "🌙", url: "mapbox://styles/mapbox/dark-v11", name: "Dark" },
  ];

  // Compute topOffset by querying potential searchbar selectors
  // FIXED: Only compute once on mount, not on every resize
  useEffect(() => {
    const computeTopOffset = () => {
      const selectors = [
        ".app-search-bar",
        ".search-bar",
        ".map-search",
        ".search-input",
        ".ion-searchbar",
        "#searchbar",
      ];
      let foundHeight = 0;
      for (const sel of selectors) {
        const el = document.querySelector(sel) as HTMLElement | null;
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.height > foundHeight) foundHeight = rect.height;
        }
      }
      const finalOffset = Math.max(72, Math.ceil(foundHeight) + 12);
      setTopOffset(finalOffset);
    };

    // Only compute once on mount
    computeTopOffset();
    
    // If you need resize support, debounce it heavily
    // let resizeTimeout: number;
    // const handleResize = () => {
    //   clearTimeout(resizeTimeout);
    //   resizeTimeout = window.setTimeout(computeTopOffset, 500);
    // };
    // window.addEventListener("resize", handleResize);
    // return () => {
    //   window.removeEventListener("resize", handleResize);
    //   clearTimeout(resizeTimeout);
    // };
  }, []); // Empty dependency array - only run once

  useImperativeHandle(ref, () => ({
    flyTo: (lat: number, lng: number, zoom = 16) => {
      if (!mapRef.current) return;
      const currentPadding = mapRef.current.getPadding?.() || { top: topOffset, left: 0, right: 0, bottom: 0 };
      mapRef.current.flyTo({ center: [lng, lat], zoom, padding: currentPadding });
    },
    openLocation: (loc: CampusLocation, opts?: { showSaveTip?: boolean }) => {
      setSelectedLocation(loc);
      setModalOpen(true);

      if (opts?.showSaveTip) {
        setShowSaveTooltip(true);
        if (saveTooltipTimerRef.current) window.clearTimeout(saveTooltipTimerRef.current);
        saveTooltipTimerRef.current = window.setTimeout(() => {
          setShowSaveTooltip(false);
          saveTooltipTimerRef.current = null;
        }, 4500);
      } else {
        setShowSaveTooltip(false);
      }

      if (mapRef.current) {
        const currentPadding = mapRef.current.getPadding?.() || { top: topOffset, left: 0, right: 0, bottom: 0 };
        mapRef.current.flyTo({ center: [loc.lng, loc.lat], zoom: 17, padding: currentPadding });
      }
    },
  }));

  useEffect(() => {
    if (!modalOpen && saveTooltipTimerRef.current) {
      window.clearTimeout(saveTooltipTimerRef.current);
      saveTooltipTimerRef.current = null;
      setShowSaveTooltip(false);
    }
  }, [modalOpen]);

  useEffect(() => {
    if (document.getElementById("ou-user-pulse-style")) return;
    const styleEl = document.createElement("style");
    styleEl.id = "ou-user-pulse-style";
    styleEl.innerHTML = `
      @keyframes ou-pulse {
        0% { box-shadow: 0 0 0 0 rgba(249,115,22,0.45); }
        70% { box-shadow: 0 0 0 20px rgba(249,115,22,0); }
        100% { box-shadow: 0 0 0 0 rgba(249,115,22,0); }
      }
      .ou-user-marker { border: 2px solid white; box-sizing: border-box; display: flex; align-items:center; justify-content:center; z-index:9999 !important; }
      .ou-user-marker.pulse { animation: ou-pulse 2s infinite; }
      .ou-user-icon { width:18px; height:18px; display:block; }
      .campus-marker-letter { font-weight: 600; color: white; user-select: none; }
      .animate-ping-glow {
        animation: ping-glow 1.5s ease-in-out;
      }
      @keyframes ping-glow {
        0%, 100% { box-shadow: 0 0 0 0 rgba(253,224,71,0.5); }
        50% { box-shadow: 0 0 15px 10px rgba(253,224,71,0.7); }
      }
    `;
    document.head.appendChild(styleEl);
  }, []);

  // FIXED: Removed topOffset from dependencies - map should only initialize once
  useEffect(() => {
    if (mapRef.current || !mapContainerRef.current) return;

    const centerLng = (OU_BOUNDS_SW[0] + OU_BOUNDS_NE[0]) / 2;
    const centerLat = (OU_BOUNDS_SW[1] + OU_BOUNDS_NE[1]) / 2;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current!,
      style: mapStyle,
      center: [centerLng, centerLat],
      zoom: 15,
      maxBounds: new mapboxgl.LngLatBounds(OU_BOUNDS_SW, OU_BOUNDS_NE),
      minZoom: 14,
      maxZoom: 18,
      pitchWithRotate: true,
    });

    mapRef.current = map;
    map.addControl(new mapboxgl.NavigationControl({ showCompass: true }), "top-right");

    map.on("load", () => {
      setLoading(false);

      // IMPORTANT: set map padding so center & markers are not hidden by the app searchbar
      try {
        map.setPadding({ top: topOffset, left: 0, right: 0, bottom: 0 });
      } catch (e) {
        // some older mapbox versions might not support setPadding in constructor - ignore
      }

      locations.forEach((loc) => {
        const color = makeColorForCategory(loc.category);
        const el = document.createElement("div");
        el.className = "campus-marker rounded-full shadow-md cursor-pointer";
        el.style.width = "34px";
        el.style.height = "34px";
        el.style.background = color;
        el.style.display = "flex";
        el.style.alignItems = "center";
        el.style.justifyContent = "center";
        el.title = loc.name;

        // ⭐ Highlight favorites
        if (isFavorited?.(loc.id)) {
          el.style.border = "3px solid gold";
          el.style.boxShadow = "0 0 10px 2px gold";
        } else {
          el.style.border = "2px solid white";
          el.style.boxShadow = "0 0 4px rgba(0,0,0,0.4)";
        }

        const letter = document.createElement("span");
        letter.className = "campus-marker-letter";
        letter.innerText = loc.name.charAt(0).toUpperCase();
        letter.style.fontSize = "14px";
        el.appendChild(letter);

        const marker = new mapboxgl.Marker({ element: el })
          .setLngLat([loc.lng, loc.lat])
          .addTo(map);

        el.addEventListener("click", () => {
          setSelectedLocation(loc);
          setModalOpen(true);
          // Get current padding dynamically instead of using topOffset state
          const currentPadding = map.getPadding?.() || { top: topOffset, left: 0, right: 0, bottom: 0 };
          map.flyTo({ center: [loc.lng, loc.lat], zoom: 17, padding: currentPadding });
        });

        markersRef.current[loc.id] = marker;
      });

      setTimeout(() => map.resize(), 200);

      // Show guided tour for only the first location
      const seen = localStorage.getItem("campusMapTourSeen");
      if (!seen && locations.length > 0) {
        setShowTour(true);
        const firstLoc = locations[0];
        const markerEl = markersRef.current[firstLoc.id]?.getElement();
        if (markerEl) markerEl.classList.add("animate-ping-glow");
      }
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [locations]); // FIXED: Only depend on locations, not topOffset

  useEffect(() => {
    if (!mapRef.current) return;
    try { mapRef.current.setStyle(mapStyle); } catch {}
  }, [mapStyle]);

  // FIXED: Update padding separately when topOffset changes
  useEffect(() => {
    if (mapRef.current && mapRef.current.isStyleLoaded()) {
      try {
        mapRef.current.setPadding({ top: topOffset, left: 0, right: 0, bottom: 0 });
      } catch (e) {
        // Ignore if not supported
      }
    }
  }, [topOffset]);

  const handleNextTourStep = () => {
    if (locations.length > 0) {
      const firstLoc = locations[0];
      const markerEl = markersRef.current[firstLoc.id]?.getElement();
      if (markerEl) markerEl.classList.remove("animate-ping-glow");
    }
    setShowTour(false);
    localStorage.setItem("campusMapTourSeen", "true");
  };

  const handleToggleFavorite = async () => {
    if (!selectedLocation || !onFavoriteToggle || !isFavorited) return;

    const currently = isFavorited(selectedLocation.id);

    const user = await storage.get("user"); 
    if (!user || !user.id) {
      setToast({ show: true, message: "You must be logged in to save favorites." });
      return;
    }

    const userId = user.id; 

    const db = getDatabase();
    const favRef = dbRef(db, `favorites/${userId}/${selectedLocation.id}`);

    try {
      if (currently) {
        await remove(favRef);
      } else {
        await set(favRef, {
          id: selectedLocation.id,
          name: selectedLocation.name,
          lat: selectedLocation.lat,
          lng: selectedLocation.lng,
          category: selectedLocation.category,
          extra: selectedLocation.extra || "",
          description: selectedLocation.description,
          savedAt: Date.now(),
        });
      }

      onFavoriteToggle(selectedLocation, !currently);
      setModalOpen(false);
      setToast({
        show: true,
        message: currently ? "Removed from favorites" : "Saved to favorites",
      });

      setShowSaveTooltip(false);
      if (saveTooltipTimerRef.current) window.clearTimeout(saveTooltipTimerRef.current);
    } catch (error) {
      console.error("Error updating favorites:", error);
      setToast({ show: true, message: "Something went wrong saving favorite." });
    }
  };

  const handleGetDirections = () => {
    if (!selectedLocation) return;
    const { lat, lng } = selectedLocation;
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    if (isIOS) window.open(`maps://?daddr=${lat},${lng}`, "_blank");
    else window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, "_blank");
  };

  return (
    <div className="relative w-full h-[calc(110vh-10px)]">
      {/* <CustomStylePicker value={mapStyle} styles={mapStyles} onChange={setMapStyle} topOffset={topOffset} /> */}
      {loading && <Loader />}
      {showTour && <TourOverlay step={1} total={1} message={`Check out ${locations[0].name}. Tap the marker to see details and save it to favorites.`} onNext={handleNextTourStep} />}
      <div ref={mapContainerRef} className="w-full h-full overflow-hidden shadow-lg" />

      <IonModal isOpen={modalOpen} onDidDismiss={() => setModalOpen(false)}>
        <IonContent className="ion-padding text-white">
          <div className="flex items-center justify-center w-full h-full">
            {selectedLocation && (
              <div className="max-w-md w-full flex flex-col items-center text-center gap-3
                              p-4  rounded-2xl shadow-lg">
                <div
                  className="w-24 h-24 rounded-full flex items-center justify-center shadow-md"
                  style={{
                    background: ["#34d399", "#60a5fa", "#f97316", "#8b5cf6"][
                      selectedLocation.name.charCodeAt(0) % 4
                    ],
                  }}
                >
                  <span className="text-4xl text-white font-bold">
                    {selectedLocation.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <h2 className="text-2xl font-semibold text-white">{selectedLocation.name}</h2>
                {selectedLocation.description && (
                  <p className="text-sm text-gray-300">{selectedLocation.description}</p>
                )}
                <p className="text-xs text-gray-400">{selectedLocation.category}</p>
                {selectedLocation.extra && (
                  <p className="text-xs text-gray-400 mt-1">{selectedLocation.extra}</p>
                )}

                <div className="mt-4 w-full flex flex-col gap-2">
                  <IonButton expand="block" color="primary" onClick={handleGetDirections}>
                    Directions
                  </IonButton>

                  <IonButton
                    expand="block"
                    fill="clear"
                    onClick={() => setModalOpen(false)}
                    className="bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Close
                  </IonButton>
                </div>
              </div>
            )}
          </div>
        </IonContent>
      </IonModal>

      <IonToast
        isOpen={toast.show}
        message={toast.message}
        duration={2000}
        onDidDismiss={() => setToast({ show: false })}
      />
    </div>
  );
});

export default MapView;