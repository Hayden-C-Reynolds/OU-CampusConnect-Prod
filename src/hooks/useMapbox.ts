import mapboxgl from "mapbox-gl";
import { useEffect, useRef, useState } from "react";

export const useMapbox = (
  containerRef: React.RefObject<HTMLDivElement>,
  style: string,
  bounds?: mapboxgl.LngLatBoundsLike
) => {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style,
      bounds,
      maxZoom: 18,
      attributionControl: false,
      pitchWithRotate: false,
    });

    map.addControl(new mapboxgl.NavigationControl(), "top-right");

    map.once("load", () => setLoaded(true));

    mapRef.current = map;

    return () => map.remove();
  }, []);

  return { mapRef, loaded };
};
