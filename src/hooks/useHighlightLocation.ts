// src/hooks/useHighlightLocation.ts
import { useEffect, RefObject } from "react";
import { useLocation } from "react-router-dom";
import { CampusLocation } from "../types/data";
import { MapViewHandle } from "../components/map-view/MapView";

interface RouteState {
  highlight?: string;
  showSaveTip?: boolean;
}

interface Options {
  mapRef: RefObject<MapViewHandle | null>;
  locations: CampusLocation[];
}

export const useHighlightLocation = ({ mapRef, locations }: Options) => {
  const location = useLocation<RouteState | undefined>();

  useEffect(() => {
    const stateHighlight  = location.state?.highlight;
    const queryHighlight  = new URLSearchParams(location.search).get("highlight") ?? undefined;
    const highlightId     = stateHighlight ?? queryHighlight;
    const showSaveTip     = location.state?.showSaveTip ?? false;

    if (!highlightId) return;

    const loc = locations.find((l) => l.id === highlightId);
    if (!loc) return;

    if (mapRef.current?.openLocation) {
      mapRef.current.openLocation(loc, { showSaveTip });
      return;
    }

    const start   = Date.now();
    const MAX_WAIT = 2500;

    const interval = setInterval(() => {
      if (mapRef.current?.openLocation) {
        mapRef.current.openLocation(loc, { showSaveTip });
        clearInterval(interval);
        return;
      }
      if (Date.now() - start > MAX_WAIT) clearInterval(interval);
    }, 200);

    return () => clearInterval(interval);
  }, [location.key, location.search, location.state]);
};