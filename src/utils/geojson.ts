import { Location } from "../types/data";

export const locationsToGeoJSON = (locations: Location[]) => ({
  type: "FeatureCollection",
  features: locations.map((loc) => ({
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [loc.lng, loc.lat],
    },
    properties: {
      id: loc.id,
      name: loc.name,
      category: loc.category ?? "default",
      description: loc.description ?? "",
    },
  })),
});
