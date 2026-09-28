// src/components/Alerts/OfflineBanner.tsx
import React from "react";
import { IonIcon } from "@ionic/react";
import { cloudOfflineOutline, cloudDoneOutline } from "ionicons/icons";
import { useOfflineStatus } from "../../hooks/useOfflineStatus";

/**
 * Slim, dismiss-free status bar shown at the very top of the app
 * whenever the device loses (or regains) network connectivity.
 * Locations/events are bundled at build time so the app stays usable
 * offline — this banner just keeps the user informed.
 */
const OfflineBanner: React.FC = () => {
  const { isOffline, lastChangedAt } = useOfflineStatus();
  const [showReconnected, setShowReconnected] = React.useState(false);

  React.useEffect(() => {
    if (!isOffline && lastChangedAt) {
      setShowReconnected(true);
      const t = setTimeout(() => setShowReconnected(false), 2500);
      return () => clearTimeout(t);
    }
  }, [isOffline, lastChangedAt]);

  if (!isOffline && !showReconnected) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        paddingTop: "max(env(safe-area-inset-top), 4px)",
      }}
      className={`cc-full-bleed flex items-center justify-center gap-2 py-1.5 text-[11px] font-bold uppercase tracking-widest transition-colors duration-300 ${
        isOffline ? "bg-amber-500 text-black" : "bg-emerald-500 text-black"
      }`}
    >
      <IonIcon icon={isOffline ? cloudOfflineOutline : cloudDoneOutline} />
      {isOffline ? "You're offline — showing saved info" : "Back online"}
    </div>
  );
};

export default OfflineBanner;
