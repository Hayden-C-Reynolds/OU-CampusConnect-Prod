// src/types/data.ts
export interface CampusLocation {
  id: string;
  name: string;
  lat: number;
  lng: number;
  category: string;
  description: string;
  hours?: { open: string; close: string };
  extra?: string;
}

export interface Location {
  id: string;
  name: string;
  description?: string;
  lat: number;
  lng: number;
  category?: string;
}

export interface GeoJSONFeature {
  type: "Feature";
  geometry: {
    type: "Point";
    coordinates: [number, number];
  };
  properties: Record<string, any>;
}
