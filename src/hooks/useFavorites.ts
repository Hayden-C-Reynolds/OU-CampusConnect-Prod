// src/hooks/useFavorites.ts
import { useState, useEffect } from "react";
import { getDatabase, ref as dbRef, set, remove, onValue, off } from "firebase/database";
import { Storage } from "@ionic/storage";
import { CampusLocation } from "../types/data";
import { GUEST_USER_ID } from "../constant";

const storage = new Storage();
storage.create();

/**
 * Favorites are a signed-in-only feature: they're stored per-account in
 * Firebase so they sync across devices. Guests are intentionally NOT
 * given a local/on-device fallback here — the UI (LocationModal,
 * Favorites page, etc.) should hide the save action entirely for guests
 * and prompt them to log in instead, using `isGuest` below.
 */
export const useFavorites = () => {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [resolved, setResolved] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      const user = await storage.get("user");
      if (user?.id) setUserId(user.id);
      setResolved(true);
    };
    loadUser();
  }, []);

  const isGuest = userId === null || userId === GUEST_USER_ID;

  useEffect(() => {
    if (!resolved || isGuest) {
      setFavorites([]);
      return;
    }

    const db = getDatabase();
    const favRef = dbRef(db, `favorites/${userId}`);

    const unsubscribe = onValue(favRef, (snapshot) => {
      const data = snapshot.val();
      setFavorites(data ? Object.keys(data) : []);
    });

    return () => off(favRef, "value", unsubscribe);
  }, [userId, resolved, isGuest]);

  const isFavorited = (id: string) => !isGuest && favorites.includes(id);

  const toggleFavorite = async (
    loc: CampusLocation,
    add: boolean,
    onToast?: (msg: string) => void,
    onClose?: () => void
  ) => {
    if (isGuest) {
      onToast?.("Log in to save favorites");
      return;
    }

    const db = getDatabase();
    const favRef = dbRef(db, `favorites/${userId}/${loc.id}`);

    try {
      if (add) {
        await set(favRef, {
          id:          loc.id,
          name:        loc.name,
          lat:         loc.lat,
          lng:         loc.lng,
          category:    loc.category,
          extra:       loc.extra || "",
          description: loc.description,
          savedAt:     Date.now(),
        });
      } else {
        await remove(favRef);
      }
      onToast?.(add ? "Saved to favorites ⭐" : "Removed from favorites");
      onClose?.();
    } catch (error) {
      console.error("Error updating favorites:", error);
      onToast?.("Something went wrong saving favorite.");
    }
  };

  return { favorites, isFavorited, toggleFavorite, userId, isGuest };
};
