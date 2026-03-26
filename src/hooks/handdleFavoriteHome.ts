// src/hooks/useFavorites.ts
import { useState, useEffect } from "react";
import { getDatabase, ref as dbRef, set, remove, onValue, off } from "firebase/database";
import { Storage } from "@ionic/storage";
import { CampusLocation } from "../types/data";

const FAVORITES_KEY = "campus_favorites_v1";

const storage = new Storage();
storage.create();

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  // Step 1: Load user from Ionic Storage on mount
  useEffect(() => {
    const loadUser = async () => {
      const user = await storage.get("user");
      if (user?.id) {
        setUserId(user.id);
      }
    };
    loadUser();
  }, []);

  // Step 2: Once we have a userId, sync favorites from Firebase in real time
  useEffect(() => {
    if (!userId) {
      // No user — fall back to localStorage only
      try {
        const raw = localStorage.getItem(FAVORITES_KEY);
        if (raw) setFavorites(JSON.parse(raw));
      } catch {
        setFavorites([]);
      }
      return;
    }

    // Listen to Firebase favorites for this user
    const db = getDatabase();
    const favRef = dbRef(db, `favorites/${userId}`);

    const unsubscribe = onValue(favRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const ids = Object.keys(data);
        setFavorites(ids);
        // Keep localStorage in sync as a cache
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(ids));
      } else {
        setFavorites([]);
        localStorage.removeItem(FAVORITES_KEY);
      }
    });

    // Cleanup listener on unmount
    return () => off(favRef, "value", unsubscribe);
  }, [userId]);

  const isFavorited = (id: string) => favorites.includes(id);

  // Step 3: Toggle — writes to Firebase if logged in, localStorage if guest
  const toggleFavorite = async (
    loc: CampusLocation,
    add: boolean,
    onToast?: (msg: string) => void,
    onClose?: () => void
  ) => {
    if (!userId) {
      // Guest mode — localStorage only
      setFavorites((prev) => {
        const next = add
          ? prev.includes(loc.id) ? prev : [...prev, loc.id]
          : prev.filter((id) => id !== loc.id);
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
        return next;
      });
      onToast?.(add ? "Saved to favorites ⭐" : "Removed from favorites");
      onClose?.();
      return;
    }

    // Logged-in mode — write to Firebase
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
      // State updates automatically via the onValue listener above
      onToast?.(add ? "Saved to favorites ⭐" : "Removed from favorites");
      onClose?.();
    } catch (error) {
      console.error("Error updating favorites:", error);
      onToast?.("Something went wrong saving favorite.");
    }
  };

  return { favorites, isFavorited, toggleFavorite, userId };
};