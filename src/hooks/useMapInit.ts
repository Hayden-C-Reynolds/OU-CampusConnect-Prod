// MapView/hooks/useMapInit.ts
import { useEffect, MutableRefObject } from "react";
import mapboxgl from "mapbox-gl";
import { CampusLocation } from "../types/data";
import {
  MAPBOX_TOKEN,
  OU_BOUNDS_SW,
  OU_BOUNDS_NE,
  TOUR_STORAGE_KEY,
} from "../constant/index";
import { makeColorForCategory, injectMarkerStyles } from "../utils";

mapboxgl.accessToken = MAPBOX_TOKEN;

interface UseMapInitOptions {
  mapContainerRef: MutableRefObject<HTMLDivElement | null>;
  mapRef: MutableRefObject<mapboxgl.Map | null>;
  markersRef: MutableRefObject<Record<string, mapboxgl.Marker>>;
  mapStyle: string;
  topOffset: number;
  locations: CampusLocation[];
  isFavorited?: (id: string) => boolean;
  onLocationClick: (loc: CampusLocation) => void;
  onMapLoaded: () => void;
  onShowTour: () => void;
}

export const useMapInit = ({
  mapContainerRef,
  mapRef,
  markersRef,
  mapStyle,
  topOffset,
  locations,
  isFavorited,
  onLocationClick,
  onMapLoaded,
  onShowTour,
}: UseMapInitOptions) => {
  // Inject CSS styles for markers once
  useEffect(() => {
    injectMarkerStyles();
  }, []);

  // Initialize map — only runs once when locations are ready
  useEffect(() => {
    if (mapRef?.current || !mapContainerRef?.current) return;

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
    map.addControl(
      new mapboxgl.NavigationControl({ showCompass: true }),
      "top-right",
    );

    // ── User location dot + "Find Me" button ──
    const geolocate = new mapboxgl.GeolocateControl({
      positionOptions: { enableHighAccuracy: true },
      trackUserLocation: true,
      showUserHeading: true,
      showAccuracyCircle: false,
    });

    map.addControl(geolocate, "top-right");

    map.on("load", () => {
      onMapLoaded();

      try {
        map.setPadding({ top: topOffset, left: 0, right: 0, bottom: 0 });
      } catch (e) {
        console.error(`ERROR: RENDER: ${e}`);
      }

      // Add a marker for every location
      locations.forEach((loc) => {
        const color = makeColorForCategory(loc.category);

        const el = document.createElement("div");
        el.className = "campus-marker rounded-full shadow-md cursor-pointer";
        el.style.cssText = `
          width: 34px; height: 34px; background: ${color};
          display: flex; align-items: center; justify-content: center;
        `;
        el.title = loc.name;

        // Gold border for favorited locations
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
          onLocationClick(loc);
          const padding = map.getPadding?.() || {
            top: topOffset,
            left: 0,
            right: 0,
            bottom: 0,
          };
          map.flyTo({ center: [loc.lng, loc.lat], zoom: 17, padding });
        });

        markersRef.current[loc.id] = marker;
      });

      setTimeout(() => map.resize(), 200);

      // Show guided tour on first visit
      const seen = localStorage.getItem(TOUR_STORAGE_KEY);
      if (!seen && locations.length > 0) {
        onShowTour();
        const markerEl = markersRef.current[locations[0].id]?.getElement();
        if (markerEl) markerEl.classList.add("animate-ping-glow");
      }
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [locations]);

  // Update map style when changed
  useEffect(() => {
    if (!mapRef.current) return;
    try {
      mapRef?.current?.setStyle(mapStyle);
    } catch (e) {
      console.error(`ERROR IN LINE 156 ${e}`);
    }
  }, [mapStyle]);

  // Update padding when top offset changes
  useEffect(() => {
    if (mapRef.current?.isStyleLoaded()) {
      try {
        mapRef.current.setPadding({
          top: topOffset,
          left: 0,
          right: 0,
          bottom: 0,
        });
      } catch {}
    }
  }, [topOffset]);
};
