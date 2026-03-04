// src/pages/Directions.tsx
import React, { useEffect, useRef, useState } from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonIcon,
  IonSpinner,
  IonSegment,
  IonSegmentButton,
} from "@ionic/react";
import { chevronBackOutline, walkOutline, carOutline, bicycleOutline } from "ionicons/icons";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useLocation, useHistory } from "react-router-dom";

mapboxgl.accessToken =
  (process.env.REACT_APP_MAPBOX_TOKEN as string) ||
  "pk.eyJ1IjoiaHJkYW5pZW5pZWxzIiwiYSI6ImNsdGppdmNwaTBxbzUyanBuY3Q5anFvNjcifQ.PPTUzbG7vHYy_4vYY9w2OA";

type LatLng = { lat: number; lng: number; name?: string };

const parseLatLng = (s?: string): LatLng | null => {
  if (!s) return null;
  const parts = s.split(",");
  if (parts.length < 2) return null;
  const lat = parseFloat(parts[0]);
  const lng = parseFloat(parts[1]);
  if (Number.isNaN(lat) || Number.isNaN(lng)) return null;
  return { lat, lng };
};

const formatDistance = (meters: number) => {
  if (meters >= 1000) return `${(meters / 1000).toFixed(1)} km`;
  return `${Math.round(meters)} m`;
};

const formatDuration = (seconds: number) => {
  if (seconds >= 3600) {
    const h = Math.floor(seconds / 3600);
    const m = Math.round((seconds % 3600) / 60);
    return `${h}h ${m}m`;
  }
  const m = Math.round(seconds / 60);
  return `${m} min`;
};

const Directions: React.FC = () => {
  const location = useLocation<{ origin?: LatLng; dest?: LatLng; profile?: string } | undefined>();
  const history = useHistory();
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  const [profile, setProfile] = useState<"walking" | "driving" | "cycling">(
    (location.state?.profile as any) || (new URLSearchParams(location.search).get("profile") as any) || "walking"
  );

  const [origin, setOrigin] = useState<LatLng | null>(() => {
    return (location.state?.origin as LatLng) ?? parseLatLng(new URLSearchParams(location.search).get("origin") ?? undefined);
  });
  const [dest, setDest] = useState<LatLng | null>(() => {
    return (location.state?.dest as LatLng) ?? parseLatLng(new URLSearchParams(location.search).get("dest") ?? undefined);
  });

  const [routeGeo, setRouteGeo] = useState<GeoJSON.FeatureCollection | null>(null);
  const routeCoordsRef = useRef<number[][]>([]); // full route coordinate array [[lng,lat], ...]
  const [steps, setSteps] = useState<any[]>([]);
  const [summary, setSummary] = useState<{ distance: number; duration: number } | null>(null);
  const [loading, setLoading] = useState(false);

  // live nav state
  const [navigating, setNavigating] = useState(false);
  const watchIdRef = useRef<number | null>(null);
  const userMarkerRef = useRef<mapboxgl.Marker | null>(null);
  const maneuverMarkerRef = useRef<mapboxgl.Marker | null>(null);
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);

  // reroute throttling
  const lastRerouteMsRef = useRef<number>(0);
  const REROUTE_COOLDOWN_MS = 8000; // don't reroute more often than every 8s

  // deviation threshold (meters)
  const DEVIATION_THRESHOLD_METERS = 30;

  useEffect(() => {
    if (!dest) {
      history.goBack();
    }
  }, [dest, history]);

  // helper: haversine distance in meters
  const haversineDistanceMeters = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const toRad = (v: number) => (v * Math.PI) / 180;
    const R = 6371000;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // find nearest point on route coords to given lat,lng
  const nearestPointOnRoute = (coords: number[][], lat: number, lng: number) => {
    let minDist = Infinity;
    let minIndex = 0;
    for (let i = 0; i < coords.length; i++) {
      const [cLng, cLat] = coords[i];
      const d = haversineDistanceMeters(lat, lng, cLat, cLng);
      if (d < minDist) {
        minDist = d;
        minIndex = i;
      }
    }
    return { index: minIndex, distance: minDist };
  };

  // fetch route helper (origin/dest are LatLng)
  const fetchRouteFrom = async (o: LatLng, d: LatLng, profileParam: string) => {
    setLoading(true);
    try {
      const url = `https://api.mapbox.com/directions/v5/mapbox/${profileParam}/${o.lng},${o.lat};${d.lng},${d.lat}?geometries=geojson&steps=true&overview=full&access_token=${mapboxgl.accessToken}`;
      const res = await fetch(url);
      const data = await res.json();
      if (!data?.routes?.length) {
        throw new Error("No route found");
      }
      const route = data.routes[0];
      const geo: GeoJSON.FeatureCollection = {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            properties: {},
            geometry: route.geometry,
          },
        ],
      };
      // update refs & state
      const coords = (route.geometry as any).coordinates as number[][];
      routeCoordsRef.current = coords;
      setRouteGeo(geo);
      setSummary({ distance: route.distance, duration: route.duration });

      // extract steps
      const legs = route.legs ?? [];
      const allSteps: any[] = [];
      for (const leg of legs) {
        for (const step of leg.steps) {
          allSteps.push(step);
        }
      }
      setSteps(allSteps);
      setActiveStepIndex(0);

      // update map sources if map exists
      if (mapRef.current) {
        const map = mapRef.current;
        // add or update remaining/completed sources
        const remainingGeo: GeoJSON.FeatureCollection = {
          type: "FeatureCollection",
          features: [
            { type: "Feature", properties: {}, geometry: route.geometry },
          ],
        };
        // initial completed is empty
        const completedGeo: GeoJSON.FeatureCollection = {
          type: "FeatureCollection",
          features: [
            { type: "Feature", properties: {}, geometry: { type: "LineString", coordinates: [] } },
          ],
        };

        if (map.getSource("route-remaining")) {
          (map.getSource("route-remaining") as mapboxgl.GeoJSONSource).setData(remainingGeo as any);
        } else {
          map.addSource("route-remaining", { type: "geojson", data: remainingGeo } as any);
          map.addLayer({
            id: "route-remaining-line",
            type: "line",
            source: "route-remaining",
            layout: { "line-join": "round", "line-cap": "round" },
            paint: { "line-color": "#1f6feb", "line-width": 6, "line-opacity": 0.95 },
          });
        }

        if (map.getSource("route-completed")) {
          (map.getSource("route-completed") as mapboxgl.GeoJSONSource).setData(completedGeo as any);
        } else {
          map.addSource("route-completed", { type: "geojson", data: completedGeo } as any);
          map.addLayer({
            id: "route-completed-line",
            type: "line",
            source: "route-completed",
            layout: { "line-join": "round", "line-cap": "round" },
            paint: { "line-color": "#9aa6b2", "line-width": 6, "line-opacity": 0.9 },
          });
        }

        // fit to route bounds
        try {
          const bounds = coords.reduce((b: mapboxgl.LngLatBounds, c) => b.extend([c[0], c[1]]), new mapboxgl.LngLatBounds(coords[0] as any, coords[0] as any));
          map.fitBounds(bounds, { padding: 80 });
        } catch (e) {
          // ignore
        }
      }
    } catch (err) {
      console.error("Directions fetch error", err);
      alert("Unable to fetch directions. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // fetch route initially and when origin/dest/profile change
  useEffect(() => {
    if (!dest) return;
    const o = origin ?? dest;
    fetchRouteFrom(o, dest, profile);
  }, [origin, dest, profile]);

  // initialize Map when container ready
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (!mapRef.current) {
      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current!,
        style: "mapbox://styles/mapbox/streets-v12",
        center: dest ? [dest.lng, dest.lat] : [-86.65575, 34.7530],
        zoom: 15,
      });
      mapRef.current.addControl(new mapboxgl.NavigationControl(), "top-right");
    }
    // cleanup optional on unmount is handled later
  }, [dest]);

  // helper: update completed/remaining layers based on user position (lat,lng)
  const updateProgressLayers = (lat: number, lng: number) => {
    const map = mapRef.current;
    const coords = routeCoordsRef.current;
    if (!map || !coords || coords.length === 0) return;

    const { index: nearestIndex } = nearestPointOnRoute(coords, lat, lng);

    // split coords
    const completedCoords = coords.slice(0, Math.max(1, nearestIndex + 1));
    const remainingCoords = coords.slice(Math.max(1, nearestIndex + 1));

    const completedGeo: GeoJSON.FeatureCollection = {
      type: "FeatureCollection",
      features: [{ type: "Feature", properties: {}, geometry: { type: "LineString", coordinates: completedCoords } }],
    };
    const remainingGeo: GeoJSON.FeatureCollection = {
      type: "FeatureCollection",
      features: [{ type: "Feature", properties: {}, geometry: { type: "LineString", coordinates: remainingCoords } }],
    };

    // update sources (if not exist, create)
    try {
      if (map.getSource("route-completed")) {
        (map.getSource("route-completed") as mapboxgl.GeoJSONSource).setData(completedGeo as any);
      } else {
        map.addSource("route-completed", { type: "geojson", data: completedGeo } as any);
        map.addLayer({
          id: "route-completed-line",
          type: "line",
          source: "route-completed",
          layout: { "line-join": "round", "line-cap": "round" },
          paint: { "line-color": "#9aa6b2", "line-width": 6, "line-opacity": 0.95 },
        });
      }

      if (map.getSource("route-remaining")) {
        (map.getSource("route-remaining") as mapboxgl.GeoJSONSource).setData(remainingGeo as any);
      } else {
        map.addSource("route-remaining", { type: "geojson", data: remainingGeo } as any);
        map.addLayer({
          id: "route-remaining-line",
          type: "line",
          source: "route-remaining",
          layout: { "line-join": "round", "line-cap": "round" },
          paint: { "line-color": "#1f6feb", "line-width": 6, "line-opacity": 0.95 },
        });
      }
    } catch (e) {
      console.warn("updateProgressLayers", e);
    }
  };

  // show maneuver marker for step
  const showManeuverMarkerForStep = (stepIndex: number) => {
    const map = mapRef.current;
    if (!map || !steps || !steps[stepIndex]) return;
    const man = steps[stepIndex].maneuver;
    if (!man || !man.location) return;
    const [lng, lat] = man.location; // [lng, lat]
    if (maneuverMarkerRef.current) {
      try { maneuverMarkerRef.current.remove(); } catch {}
      maneuverMarkerRef.current = null;
    }
    const el = document.createElement("div");
    el.className = "rounded-full bg-white shadow-md flex items-center justify-center";
    el.style.width = "36px";
    el.style.height = "36px";
    el.style.border = "2px solid #1f6feb";
    el.style.fontSize = "16px";
    el.style.color = "#1f6feb";
    el.innerText = `${stepIndex + 1}`;
    maneuverMarkerRef.current = new mapboxgl.Marker({ element: el }).setLngLat([lng, lat]).addTo(map);
  };

  // Start live navigation
  const startNavigation = () => {
    if (!("geolocation" in navigator)) {
      alert("Geolocation is not available on this device.");
      return;
    }
    if (!steps || steps.length === 0) {
      alert("No route steps to navigate.");
      return;
    }

    if (userMarkerRef.current) {
      try { userMarkerRef.current.remove(); } catch {}
      userMarkerRef.current = null;
    }
    const userEl = document.createElement("div");
    userEl.style.width = "28px";
    userEl.style.height = "28px";
    userEl.style.borderRadius = "50%";
    userEl.style.background = "#F97316";
    userEl.style.display = "flex";
    userEl.style.alignItems = "center";
    userEl.style.justifyContent = "center";
    userEl.style.color = "#fff";
    userEl.style.fontSize = "11px";
    userEl.innerText = "You";
    const map = mapRef.current!;
    const initialLng = origin?.lng ?? dest!.lng;
    const initialLat = origin?.lat ?? dest!.lat;
    userMarkerRef.current = new mapboxgl.Marker({ element: userEl }).setLngLat([initialLng, initialLat]).addTo(map);

    // watch position
    const id = navigator.geolocation.watchPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        // move user marker
        if (userMarkerRef.current) {
          userMarkerRef.current.setLngLat([longitude, latitude]);
        }
        // center map
        try { map.easeTo({ center: [longitude, latitude], zoom: 16 }); } catch {}

        // update progress layers (completed/remaining)
        updateProgressLayers(latitude, longitude);

        // check proximity to current maneuver step -> advance if close
        const currentStep = steps[activeStepIndex];
        if (currentStep && currentStep.maneuver && currentStep.maneuver.location) {
          const [mLng, mLat] = currentStep.maneuver.location;
          const distMeters = haversineDistanceMeters(latitude, longitude, mLat, mLng);
          if (distMeters < 20) {
            const nextIndex = Math.min(activeStepIndex + 1, steps.length - 1);
            if (nextIndex !== activeStepIndex) {
              setActiveStepIndex(nextIndex);
              showManeuverMarkerForStep(nextIndex);
            }
          }
        }

        // DEVIATION DETECTION: distance from user to nearest point on route
        const coords = routeCoordsRef.current;
        if (coords && coords.length > 0) {
          const { distance: nearestDist } = nearestPointOnRoute(coords, latitude, longitude);
          // if deviated beyond threshold and cooldown passed -> reroute from current position
          const now = Date.now();
          if (nearestDist > DEVIATION_THRESHOLD_METERS && (now - lastRerouteMsRef.current) > REROUTE_COOLDOWN_MS) {
            lastRerouteMsRef.current = now;
            // do automatic re-route
            try {
              // set origin to current position, keep same dest & profile
              const newOrigin = { lat: latitude, lng: longitude, name: "You" };
              setOrigin(newOrigin); // update state (causes fetchRouteFrom to run)
              await fetchRouteFrom(newOrigin, dest!, profile);
              // reset active step index, show new maneuver marker
              setActiveStepIndex(0);
              showManeuverMarkerForStep(0);
            } catch (e) {
              console.warn("Reroute failed", e);
            }
          }
        }
      },
      (err) => {
        console.warn("watchPosition error", err);
      },
      { enableHighAccuracy: true, maximumAge: 1000, timeout: 10000 }
    );
    watchIdRef.current = id;
    setNavigating(true);
  };

  const stopNavigation = () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    if (userMarkerRef.current) {
      try { userMarkerRef.current.remove(); } catch {}
      userMarkerRef.current = null;
    }
    if (maneuverMarkerRef.current) {
      try { maneuverMarkerRef.current.remove(); } catch {}
      maneuverMarkerRef.current = null;
    }
    setNavigating(false);
  };

  // cleanup on unmount
  useEffect(() => {
    return () => {
      stopNavigation();
      // optionally remove map: if you want to fully destroy the map on leave uncomment:
      // if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // when active step changes, show maneuver marker & optionally update completed portion
  useEffect(() => {
    if (!routeCoordsRef.current || routeCoordsRef.current.length === 0) return;
    // if there is a user marker, update completed/remaining relative to user position
    // else split by step's maneuver location
    if (userMarkerRef.current) {
      const lnglat = userMarkerRef.current.getLngLat();
      updateProgressLayers(lnglat.lat, lnglat.lng);
    } else if (steps[activeStepIndex] && steps[activeStepIndex].maneuver?.location) {
      const [lng, lat] = steps[activeStepIndex].maneuver.location;
      updateProgressLayers(lat, lng);
    }
    showManeuverMarkerForStep(activeStepIndex);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeStepIndex]);

  const onClickStep = (idx: number) => {
    setActiveStepIndex(idx);
    const map = mapRef.current;
    if (!map) return;
    const st = steps[idx];
    if (st?.maneuver?.location) {
      const [lng, lat] = st.maneuver.location;
      map.easeTo({ center: [lng, lat], zoom: 16 });
      showManeuverMarkerForStep(idx);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <div style={{ display: "flex", alignItems: "center", gap: 8, width: "100%" }}>
            <IonButton fill="clear" onClick={() => history.goBack()}>
              <IonIcon icon={chevronBackOutline} />
            </IonButton>
            <IonTitle>Directions</IonTitle>
            <div style={{ flex: 1 }} />
            <div style={{ paddingRight: 8 }}>
              {loading ? <IonSpinner name="dots" /> : summary ? (
                <div style={{ textAlign: "right", fontSize: 12 }}>
                  <div>{formatDistance(summary.distance)}</div>
                  <div>{formatDuration(summary.duration)}</div>
                </div>
              ) : null}
            </div>
          </div>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <div className="p-3 flex items-center gap-2">
          <IonSegment value={profile} onIonChange={(e) => setProfile(e.detail.value as any)}>
            <IonSegmentButton value="walking">
              <IonIcon icon={walkOutline} /> &nbsp;<span className="ml-1">Walk</span>
            </IonSegmentButton>
            <IonSegmentButton value="driving">
              <IonIcon icon={carOutline} /> &nbsp;<span className="ml-1">Drive</span>
            </IonSegmentButton>
            <IonSegmentButton value="cycling">
              <IonIcon icon={bicycleOutline} /> &nbsp;<span className="ml-1">Bike</span>
            </IonSegmentButton>
          </IonSegment>

          <div style={{ flex: 1 }} />

          {!navigating ? (
            <IonButton onClick={startNavigation} color="primary">
              Start Navigation
            </IonButton>
          ) : (
            <IonButton onClick={stopNavigation} color="danger">
              Stop
            </IonButton>
          )}
        </div>

        <div style={{ height: "45vh", width: "100%" }} ref={mapContainerRef} />

        <div className="p-4">
          {summary && (
            <div className="mb-3 text-sm text-gray-600">
              Route: {formatDistance(summary.distance)} • {formatDuration(summary.duration)}
            </div>
          )}

          {loading && (
            <div className="flex items-center gap-2 mb-4">
              <IonSpinner /> <span>Fetching route...</span>
            </div>
          )}

          <div className="flex flex-col gap-2">
            {steps.map((st, idx) => {
              const isActive = idx === activeStepIndex;
              return (
                <div
                  key={idx}
                  onClick={() => onClickStep(idx)}
                  className={`p-3 rounded-lg shadow-sm cursor-pointer transition ${
                    isActive ? "bg-blue-50 border-l-4 border-blue-500" : "bg-white hover:bg-gray-50"
                  }`}
                >
                  <div className="flex justify-between items-start gap-2">
                    <div className="text-sm font-medium">{st.maneuver.instruction}</div>
                    <div className="text-xs text-gray-500">{formatDistance(st.distance)}</div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{Math.round(st.duration)}s</div>
                </div>
              );
            })}
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Directions;
