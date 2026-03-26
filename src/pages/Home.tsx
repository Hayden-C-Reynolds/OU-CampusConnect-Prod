// src/pages/Home.tsx
import React, { useRef, useState } from "react";
import { IonContent, IonPage } from "@ionic/react";
import MapView, { MapViewHandle } from "../components/map-view/MapView";
import SearchBar from "../components/navigation/SearchBar";
import { campusLocations } from "../types/locations";
import { CampusLocation } from "../types/data";
import { useFavorites } from "../hooks/useFavorites";
import { useHighlightLocation } from "../hooks/useHighlightLocation";

const Home: React.FC = () => {
  const mapRef = useRef<MapViewHandle | null>(null);
  const [locations] = useState<CampusLocation[]>(campusLocations);

  const { isFavorited, toggleFavorite } = useFavorites();

  useHighlightLocation({ mapRef, locations });

  return (
    <IonPage className="dark bg-black">
      <IonContent fullscreen className="dark bg-black text-white">

        <div className="flex flex-col items-center">
          <SearchBar
            allLocations={locations}
            onSelect={(loc) => mapRef.current?.openLocation(loc)}
          />
        </div>

        <div className="mx-auto">
          <MapView
            ref={mapRef}
            locations={locations}
            isFavorited={isFavorited}
            onFavoriteToggle={(
              loc: CampusLocation,
              add: boolean,
              onToast?: (msg: string) => void,
              onClose?: () => void
            ) => toggleFavorite(loc, add, onToast, onClose)}
          />
        </div>

      </IonContent>
    </IonPage>
  );
};

export default Home;