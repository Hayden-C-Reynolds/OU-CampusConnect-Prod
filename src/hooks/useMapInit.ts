// MapView/hooks/useMapInit.ts
import { useEffect, useRef, MutableRefObject } from "react";
import { useIonViewDidEnter, useIonViewWillLeave } from "@ionic/react";
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

  // Ionic keeps this page's DOM alive (hidden) instead of unmounting it
  // when you navigate away — great for fast back-navigation, bad for a
  // WebGL canvas. A hidden/zero-size container can lose its GL context
  // entirely, so simply resizing an old map when the page comes back
  // does nothing: it stays solid black. The reliable fix is to fully
  // destroy the map when this page stops being the active view, and
  // build a brand new one every time it becomes active again — which is
  // exactly what Ionic's own view lifecycle tells us.
  //
  // Keep the latest values in refs so the enter/leave callbacks (which
  // Ionic doesn't re-subscribe every render) always see fresh data.
  const latest = useRef({
    mapStyle,
    topOffset,
    locations,
    isFavorited,
    onLocationClick,
    onMapLoaded,
    onShowTour,
  });
  useEffect(() => {
    latest.current = {
      mapStyle,
      topOffset,
      locations,
      isFavorited,
      onLocationClick,
      onMapLoaded,
      onShowTour,
    };
  });

  const rafIdRef = useRef<number | null>(null);
  const cancelledRef = useRef(false);

  const teardownMap = () => {
    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }
    if (mapRef.current) {
      try {
        mapRef.current.remove();
      } catch (e) {
        console.warn(`useMapInit: teardown skipped — ${e}`);
      }
      mapRef.current = null;
    }
    markersRef.current = {};
  };

  const attachMapEvents = (map: mapboxgl.Map) => {
    const {
      topOffset: currentTopOffset,
      locations: currentLocations,
      isFavorited: currentIsFavorited,
      onLocationClick: currentOnLocationClick,
      onMapLoaded: currentOnMapLoaded,
      onShowTour: currentOnShowTour,
    } = latest.current;

    // User location dot + "Find Me" button
    const geolocate = new mapboxgl.GeolocateControl({
      positionOptions: { enableHighAccuracy: true },
      trackUserLocation: true,
      showUserHeading: true,
      showAccuracyCircle: false,
    });
    map.addControl(geolocate, "top-right");

    map.on("load", () => {
      currentOnMapLoaded();

      try {
        map.setPadding({ top: currentTopOffset, left: 0, right: 0, bottom: 0 });
      } catch (e) {
        console.error(`ERROR: RENDER: ${e}`);
      }

      // Add a marker for every location
      currentLocations.forEach((loc) => {
        const color = makeColorForCategory(loc.category);

        const el = document.createElement("div");
        el.className = "campus-marker rounded-full shadow-md cursor-pointer";
        el.style.cssText = `
          width: 34px; height: 34px; background: ${color};
          display: flex; align-items: center; justify-content: center;
        `;
        el.title = loc.name;

        // Gold border for favorited locations
        if (currentIsFavorited?.(loc.id)) {
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
          currentOnLocationClick(loc);
          const padding = map.getPadding?.() || {
            top: currentTopOffset,
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
      if (!seen && currentLocations.length > 0) {
        currentOnShowTour();
        const markerEl = markersRef.current[currentLocations[0].id]?.getElement();
        if (markerEl) markerEl.classList.add("animate-ping-glow");
      }
    });
  };

  const buildMap = () => {
    if (cancelledRef.current) return;
    if (mapRef.current) return; // already built for this active session
    const container = mapContainerRef.current;
    if (!container) return;

    // Right after the page becomes active it can still briefly report
    // zero size mid-transition. Building Mapbox against a 0×0 container
    // leaves it permanently mis-sized, so wait a frame and retry until
    // it actually has real dimensions.
    if (container.offsetWidth === 0 || container.offsetHeight === 0) {
      rafIdRef.current = requestAnimationFrame(buildMap);
      return;
    }

    const centerLng = (OU_BOUNDS_SW[0] + OU_BOUNDS_NE[0]) / 2;
    const centerLat = (OU_BOUNDS_SW[1] + OU_BOUNDS_NE[1]) / 2;

    const map = new mapboxgl.Map({
      container,
      style: latest.current.mapStyle,
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
    attachMapEvents(map);
  };

  // Build fresh every time this page becomes the active Ionic view —
  // including the very first time it mounts.
  useIonViewDidEnter(() => {
    cancelledRef.current = false;
    buildMap();
  });

  // Tear the map down completely as soon as we navigate away, so a
  // hidden/zero-size page never holds onto a canvas that can silently
  // lose its WebGL context.
  useIonViewWillLeave(() => {
    cancelledRef.current = true;
    teardownMap();
  });

  // Safety net: also tear down on a genuine component unmount.
  useEffect(() => {
    return () => {
      cancelledRef.current = true;
      teardownMap();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      } catch (e) {
        // Padding can only be set once the style has finished loading;
        // ignore benign errors from calling this before/after that window.
        console.warn(`useMapInit: setPadding skipped — ${e}`);
      }
    }
  }, [topOffset]);
};