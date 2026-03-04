import React, { useRef, useState, useEffect } from "react";
import { IonContent, IonPage } from "@ionic/react";
import { useLocation } from "react-router-dom";
import MapView, { MapViewHandle } from "../components/map-view/MapView";
import SearchBar from "../components/navigation/SearchBar";
import { campusLocations } from "../types/locations";
import { CampusLocation } from "../types/data";

const FAVORITES_KEY = "campus_favorites_v1";

const Home: React.FC = () => {
  const mapRef = useRef<MapViewHandle | null>(null);
  const location = useLocation<{ highlight?: string; showSaveTip?: boolean } | undefined>();
  const [locations] = useState<CampusLocation[]>(campusLocations);
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    const raw = localStorage.getItem(FAVORITES_KEY);
    if (raw) {
      try {
        setFavorites(JSON.parse(raw));
      } catch {
        setFavorites([]);
      }
    }
  }, []);

  const persistFavs = (next: string[]) => {
    setFavorites(next);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
  };

  const toggleFavorite = (loc: CampusLocation, add: boolean) => {
    const exists = favorites.includes(loc.id);
    let next = [...favorites];
    if (add && !exists) next.push(loc.id);
    if (!add && exists) next = next.filter((id) => id !== loc.id);
    persistFavs(next);
  };

  const isFavorited = (id: string) => favorites.includes(id);

  // --- Highlight handling
  useEffect(() => {
    const stateHighlight = (location.state && (location.state as any).highlight) as string | undefined;
    const stateShowTip = (location.state && (location.state as any).showSaveTip) as boolean | undefined;
    const params = new URLSearchParams(location.search);
    const queryHighlight = params.get("highlight") ?? undefined;
    const highlightId = stateHighlight ?? queryHighlight;
    const showSaveTip = stateShowTip ?? false;

    if (!highlightId) return;

    const loc = campusLocations.find((l) => l.id === highlightId);
    if (!loc) return;

    if (mapRef.current && mapRef.current.openLocation) {
      mapRef.current.openLocation(loc, { showSaveTip });
      return;
    }

    const start = Date.now();
    const MAX_WAIT = 2500;
    const interval = setInterval(() => {
      if (mapRef.current && mapRef.current.openLocation) {
        mapRef.current.openLocation(loc, { showSaveTip });
        clearInterval(interval);
        return;
      }
      if (Date.now() - start > MAX_WAIT) {
        clearInterval(interval);
      }
    }, 200);

    return () => clearInterval(interval);
  }, [location.key, location.search, location.state]);

  return (
    <IonPage className="dark bg-black">
      <IonContent fullscreen className="dark bg-black text-white">
        <div className="flex flex-col items-center">
          <SearchBar
            allLocations={locations}
            onSelect={(loc) => {
              mapRef.current?.openLocation(loc);
            }}
          />
        </div>

        <div className="mx-auto">
          <MapView
            ref={mapRef}
            locations={locations}
            onFavoriteToggle={(loc, add) => toggleFavorite(loc, add)}
            isFavorited={(id) => isFavorited(id)}
          />
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;
