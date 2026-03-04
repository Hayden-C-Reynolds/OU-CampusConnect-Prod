import { useEffect } from "react";
import mapboxgl from "mapbox-gl";

export const useGeoJsonLayer = (
  map: mapboxgl.Map | null,
  geojson: any
) => {
  useEffect(() => {
    if (!map || !geojson) return;

    if (map.getSource("locations")) return;

    map.addSource("locations", {
      type: "geojson",
      data: geojson,
      cluster: true,
      clusterMaxZoom: 14,
      clusterRadius: 50,
    });

    map.addLayer({
      id: "clusters",
      type: "circle",
      source: "locations",
      filter: ["has", "point_count"],
      paint: {
        "circle-color": "#f97316",
        "circle-radius": [
          "step",
          ["get", "point_count"],
          20,
          10,
          25,
          30,
          30,
        ],
      },
    });

    map.addLayer({
      id: "cluster-count",
      type: "symbol",
      source: "locations",
      filter: ["has", "point_count"],
      layout: {
        "text-field": "{point_count_abbreviated}",
        "text-size": 12,
      },
    });

    map.addLayer({
      id: "unclustered-point",
      type: "circle",
      source: "locations",
      filter: ["!", ["has", "point_count"]],
      paint: {
        "circle-color": "#2563eb",
        "circle-radius": 8,
        "circle-stroke-width": 2,
        "circle-stroke-color": "#fff",
      },
    });
  }, [map, geojson]);
};
