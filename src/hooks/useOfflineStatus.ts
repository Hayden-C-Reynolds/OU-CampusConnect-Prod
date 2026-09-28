// src/hooks/useOfflineStatus.ts
//
// Lightweight offline/online status hook. Wraps the browser's
// `navigator.onLine` + the `online`/`offline` window events so any
// component can react to connectivity changes without duplicating
// listener logic. This is the foundation used by <OfflineBanner /> and
// can also back future offline-first / background-sync features.
import { useEffect, useState } from "react";

export interface OfflineStatus {
  /** true when the browser reports no network connection */
  isOffline: boolean;
  /** true when the browser reports a network connection */
  isOnline: boolean;
  /** timestamp (ms) of the last time connectivity flipped, or null if unchanged this session */
  lastChangedAt: number | null;
}

export const useOfflineStatus = (): OfflineStatus => {
  const getInitial = () =>
    typeof navigator !== "undefined" && "onLine" in navigator ? !navigator.onLine : false;

  const [isOffline, setIsOffline] = useState<boolean>(getInitial);
  const [lastChangedAt, setLastChangedAt] = useState<number | null>(null);

  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      setLastChangedAt(Date.now());
    };
    const handleOffline = () => {
      setIsOffline(true);
      setLastChangedAt(Date.now());
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return { isOffline, isOnline: !isOffline, lastChangedAt };
};
