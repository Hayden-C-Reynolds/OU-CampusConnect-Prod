// MapView/types/index.ts
import { CampusLocation } from "../types/data";

export interface OpenLocationOptions {
  showSaveTip?: boolean;
}

export interface MapViewHandle {
  flyTo: (lat: number, lng: number, zoom?: number) => void;
  openLocation: (loc: CampusLocation, opts?: OpenLocationOptions) => void;
}

export interface MapViewProps {
  locations: CampusLocation[];
  onFavoriteToggle?: (
    loc: CampusLocation,
    favorited: boolean,
    onToast?: (msg: string) => void,
    onClose?: () => void
  ) => void;
  isFavorited?: (id: string) => boolean;
}

export interface MapStyle {
  id: string;
  label: string;
  url: string;
  name?: string;
}

export interface ToastState {
  show: boolean;
  message?: string;
}