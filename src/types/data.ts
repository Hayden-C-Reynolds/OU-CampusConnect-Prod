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
  acronyms?: string[];
  /** External link with more info about the building (department page, etc.) */
  website?: string;
  /** Short accessibility note, e.g. "Wheelchair accessible · Elevator available" */
  accessibility?: string;
  /** Phone number or office email for the building */
  contact?: string;
  /** Photo shown at the top of the location modal */
  imageUrl?: string;
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
