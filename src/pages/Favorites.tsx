// src/pages/Favorites.tsx
import React, { useState, useRef, useMemo, useEffect } from "react";
import {
  IonPage,
  IonContent,
  IonInput,
  IonButton,
  IonIcon,
  IonToast,
  IonModal,
  IonAlert,
  IonSpinner,
} from "@ionic/react";
import {
  searchOutline,
  navigateOutline,
  mapOutline,
  heartOutline,
  trashOutline,
  close,
} from "ionicons/icons";
import { CampusLocation } from "../types/data";
import { useHistory } from "react-router-dom";
import { motion } from "framer-motion";

import { Storage } from "@ionic/storage";
import { getDatabase, ref as dbRef, onValue, remove, set } from "firebase/database";
import { app } from "../firebase/config"; // <- make sure this path matches your project
import { GUEST_USER_ID } from "../constant";
import { useLanguage } from "../contexts/LanguageContext";

const FAVORITES_KEY = "campus_favorites_v1";
const FAVORITES_TOUR_KEY = "favorites_tour_v1";

const Favorites: React.FC = () => {
  const { t } = useLanguage();
  const [favorites, setFavorites] = useState<CampusLocation[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [toast, setToast] = useState<{ show: boolean; message?: string }>({
    show: false,
  });
  const [selected, setSelected] = useState<CampusLocation | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [tourOpen, setTourOpen] = useState(false);
  const [tourStep, setTourStep] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const [loading, setLoading] = useState<boolean>(true);
  const [isGuest, setIsGuest] = useState<boolean>(false);
  const [showRemoveAlert, setShowRemoveAlert] = useState(false);
  const [selectedForRemove, setSelectedForRemove] = useState<CampusLocation | null>(null);

  const searchRef = useRef<HTMLDivElement>(null);
  const history = useHistory();
  const storage = new Storage();
  // create storage instance early
  useEffect(() => {
    storage.create().catch((e) => {
      console.warn("Storage create failed", e);
    });
  }, []);

  const db = getDatabase(app);

  const tourSteps = [
    {
      title: "Welcome to Favorites",
      body: "This is where you keep places you saved. Cards are compact — tap any card to see full details.",
      highlightRef: searchRef,
    },
    {
      title: "Show on Map",
      body: "Tap 'Show on Map' to jump back to the map and highlight the place.",
      highlightRef: null,
    },
    {
      title: "Remove & Directions",
      body: "Inside the detail modal you can remove the favorite or get directions.",
      highlightRef: null,
    },
  ];

  // Fetch favorites from Realtime DB for this user. If no user, fallback to local storage.
  useEffect(() => {
    let unsubscribe: (() => void) | null = null;

    const fetchFavorites = async () => {
      setLoading(true);
      try {
        await storage.create();
        const user = await storage.get("user");
        const uid = user && typeof user === "object" ? (user as any).id : null;

        if (uid && uid !== GUEST_USER_ID) {
          setIsGuest(false);
          const r = dbRef(db, `favorites/${uid}`);
          unsubscribe = onValue(
            r,
            (snap) => {
              const val = snap.val();
              if (val) {
                // snapshot is an object keyed by location id, values are location objects
                const arr = Object.values(val) as CampusLocation[];
                setFavorites(arr);
              } else {
                setFavorites([]);
              }
              setLoading(false);
            },
            (err) => {
              console.error("Realtime DB onValue error:", err);
              setToast({ show: true, message: "Failed to load favorites from server." });
              setLoading(false);
            }
          );
        } else {
          // Guests don't get a local fallback — favorites require an account
          // so they sync across devices. Show the "log in" state instead.
          setIsGuest(true);
          setFavorites([]);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching favorites:", error);
        setToast({ show: true, message: "Failed to load favorites." });
        setLoading(false);
      }
    };

    fetchFavorites();

    return () => {
      if (unsubscribe) unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const persistFavs = (nextFavs: CampusLocation[]) => {
    // keep local key in sync too (for offline fallback)
    setFavorites(nextFavs);
    localStorage.setItem(
      FAVORITES_KEY,
      JSON.stringify(nextFavs.map((loc) => loc.id))
    );
  };

  // Instead of window.confirm, show IonAlert. This function triggers the alert.
  const confirmAndRemove = (locOrId: string | CampusLocation) => {
    let loc: CampusLocation | undefined;
    if (typeof locOrId === "string") {
      loc = favorites.find((f) => f.id === locOrId);
    } else {
      loc = locOrId;
    }
    if (!loc) return;
    setSelectedForRemove(loc);
    setShowRemoveAlert(true);
  };

  // Called when user confirms removal in IonAlert
  const handleRemoveConfirmed = async () => {
    setShowRemoveAlert(false);
    if (!selectedForRemove) return;

    const loc = selectedForRemove;

    try {
      // remove from realtime db if user is logged in
      await storage.create();
      const user = await storage.get("user");
      if (user && (user as any).id) {
        const userId = (user as any).id;
        const favRef = dbRef(db, `favorites/${userId}/${loc.id}`);
        await remove(favRef);
        // onValue subscription will update local favorites automatically
      } else {
        // fallback to local-only removal if no server user
        const nextFavs = favorites.filter((f) => f.id !== loc.id);
        persistFavs(nextFavs);
      }

      setToast({ show: true, message: `"${loc.name}" removed from favorites.` });

      if (selected?.id === loc.id) {
        setDetailOpen(false);
        setSelected(null);
      }
    } catch (error) {
      console.error("Error removing favorite:", error);
      setToast({ show: true, message: "Failed to remove favorite." });
    } finally {
      setSelectedForRemove(null);
    }
  };

    const showOnMap = (loc: CampusLocation) => {
      // Close the detail modal if it's open
      setDetailOpen(false);

      // Navigate to the map with the highlight
      history.push({
        pathname: "/home",
        search: `?highlight=${loc.id}`,
        state: { highlight: loc.id, showSaveTip: false },
      });
    };

  const openDirectionsInApp = (loc: CampusLocation) => {
    const lat = loc.lat;
    const lng = loc.lng;
    const name = encodeURIComponent(loc.name);
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOS = /iphone|ipad|ipod/.test(userAgent);

    const url = isIOS
      ? `maps://maps.apple.com/?daddr=${lat},${lng}&q=${name}`
      : `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&destination_place_id=${name}`;

    window.open(url, "_blank");
  };

  const filteredFavorites = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return favorites.filter(
      (loc) =>
        loc.name.toLowerCase().includes(q) ||
        loc.category.toLowerCase().includes(q) ||
        loc.description.toLowerCase().includes(q)
    );
  }, [searchQuery, favorites]);

  const onCardClick = (loc: CampusLocation) => {
    setSelected(loc);
    setDetailOpen(true);
  };

  const tourNext = () => {
    if (tourStep < tourSteps.length - 1) setTourStep((s) => s + 1);
    else finishTour();
  };
  const tourPrev = () => {
    if (tourStep > 0) setTourStep((s) => s - 1);
  };
  const finishTour = () => {
    setTourOpen(false);
    localStorage.setItem(FAVORITES_TOUR_KEY, "seen");
  };

  // Suggestions for search input
  const suggestions = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return favorites
      .filter(
        (l) =>
          l.name.toLowerCase().includes(q) ||
          l.category.toLowerCase().includes(q)
      )
      .slice(0, 6);
  }, [searchQuery, favorites]);

  return (
    <IonPage className="bg-black text-white">
      <IonContent fullscreen className="bg-black text-white relative p-4">
        <div className="max-w-2xl mx-auto">        {/* Loader overlay */}
        {loading && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
            <IonSpinner name="crescent" color="primary" />
          </div>
        )}

        {!loading && isGuest ? (
          <div
            className="flex flex-col items-center justify-center text-center gap-4 px-6"
            style={{ minHeight: "calc(100vh - 56px)" }}
          >
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl"
              style={{ background: "linear-gradient(135deg, #e8b341, #c9922b)" }}
            >
              🔒
            </div>
            <div>
              <p className="text-white text-lg font-bold mb-1">{t("favorites.needAccount")}</p>
              <p className="text-gray-400 text-sm max-w-xs">
                {t("favorites.needAccountBody")}
              </p>
            </div>
            <IonButton
              color="warning"
              onClick={async () => {
                // Guests already have a session stored, so navigating
                // straight to /login would immediately bounce back to
                // /home. Clear the guest session first.
                await storage.create();
                await storage.set("user", null);
                history.push("/login");
              }}
            >
              {t("common.logIn")}
            </IonButton>
            <IonButton fill="clear" color="medium" onClick={() => history.push("/home")}>
              {t("favorites.backToMap")}
            </IonButton>
          </div>
        ) : (
          <>
        {/* Search bar */}
        <div
          ref={searchRef}
          className="py-8 fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-3xl z-50 pointer-events-auto"
        >
          <div className="relative flex items-center gap-3 rounded-full hover:shadow-xl transition-all duration-300">
            
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              <IonIcon icon={searchOutline} />
            </div>
            
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search favorites..."
              className="w-full rounded-full pl-10 pr-4 py-3 bg-gray-900 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-lg transition-all"
            />
          </div>

          {/* Suggestions Dropdown */}
          {suggestions.length > 0 && (
            <div className="absolute left-0 right-0 mt-1 bg-gray-900 shadow-xl rounded-lg overflow-hidden z-50 border border-gray-700 animate-slide-down">
              {suggestions.map((s, index) => (
                <div
                  key={s.id}
                  onClick={() => {
                    setSearchQuery("");
                    // optionally navigate to details or map
                  }}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className={`flex items-center gap-2 px-4 py-3 cursor-pointer transition-colors ${
                    hoveredIndex === index ? "bg-gray-700" : "hover:bg-gray-800"
                  }`}
                >
                  <IonIcon
                    icon={searchOutline}
                    className="text-gray-400 flex-shrink-0"
                  />
                  <div className="truncate">
                    <div className="font-medium text-white truncate">{s.name}</div>
                    <div className="text-xs text-gray-400 truncate">{s.category}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="pt-20 pb-8">
          {filteredFavorites.length === 0 ? (
            <div
              className="flex items-center justify-center w-full"
              style={{ minHeight: "calc(100vh - 56px)" }}
            >
              <div className="flex flex-col items-center gap-3">
                <div className="w-20 h-20 rounded-full bg-gray-700 flex items-center justify-center text-3xl text-red-500 shadow-sm">
                  <IonIcon icon={heartOutline} />
                </div>
                <p className="text-center text-gray-400 text-lg max-w-xs">
                  No favorites found. Add some from the map or search!
                </p>
                <div className="mt-4 flex gap-2">
                  <IonButton
                    onClick={() => history.push("/home")}
                    color="secondary"
                  >
                    Open Map
                  </IonButton>
                  <IonButton
                    onClick={() =>
                      setToast({ show: true, message: "Try searching or tapping pins" })
                    }
                    fill="outline"
                    color="light"
                    className="text-white"
                  >
                    Tip
                  </IonButton>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-3">
              <ul role="list" className="divide-y divide-gray-700">
                {filteredFavorites.map((loc, i) => (
                  <motion.li
                    key={loc.id}
                    onClick={() => onCardClick(loc)}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.28, delay: i * 0.03 }}
                    className="flex justify-between gap-x-6 py-5 cursor-pointer hover:bg-gray-800 rounded-lg px-3 transition"
                  >
                    <div className="flex min-w-0 gap-x-4">
                      <div
                        className="h-12 w-12 flex-none rounded-full flex items-center justify-center text-white font-semibold"
                        style={{
                          background: ["#34d399", "#60a5fa", "#f97316", "#8b5cf6"][
                            loc.name.charCodeAt(0) % 4
                          ],
                        }}
                      >
                        <span className="text-lg">
                          {loc.name.charAt(0).toUpperCase()}
                        </span>
                      </div>

                      <div className="min-w-0 flex-auto">
                        <p className="text-sm font-semibold leading-6 text-white truncate">
                          {loc.name}
                        </p>
                        <p className="mt-1 truncate text-xs leading-5 text-gray-400">
                          {loc.category}
                        </p>
                      </div>
                    </div>

                    <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
                      <p className="text-sm leading-6 text-gray-200">Details</p>
                      <p className="mt-1 text-xs leading-5 text-gray-400">
                        {loc.hours?.open} – {loc.hours?.close}
                      </p>
                    </div>
                  </motion.li>
                ))}
              </ul>
            </div>
          )}
        </div>
        </>
        )}
        </div>

                {/* Details Modal */}
        <IonModal isOpen={detailOpen} onDidDismiss={() => setDetailOpen(false)}>
          <IonContent className="ion-padding bg-gray-900 text-white">
            <div className="flex items-center justify-center w-full h-full">
              {selected && (
                <div className="max-w-md w-full flex flex-col items-center text-center gap-3
                                p-4 rounded-2xl shadow-lg">
                  {/* Circular colored icon */}
                  <div
                    className="w-24 h-24 rounded-full flex items-center justify-center shadow-md"
                    style={{
                      background: ["#34d399", "#60a5fa", "#f97316", "#8b5cf6"][
                        selected.name.charCodeAt(0) % 4
                      ],
                    }}
                  >
                    <span className="text-4xl text-white font-bold">
                      {selected.name.charAt(0).toUpperCase()}
                    </span>
                  </div>

                  {/* Name and details */}
                  <h2 className="text-2xl font-semibold text-white">{selected.name}</h2>
                  <p className="text-sm text-gray-300">{selected.description}</p>
                  <p className="text-xs text-gray-400">{selected.category}</p>
                  {selected.extra && (
                    <p className="text-xs text-gray-400 mt-1">{selected.extra}</p>
                  )}

                  {/* Action buttons */}
                  <div className="mt-4 w-full flex flex-col gap-2">
                    <IonButton
                      expand="block"
                      color="primary"
                      onClick={() => openDirectionsInApp(selected)}
                    >
                      <IonIcon icon={navigateOutline} slot="start" className="mx-2"/> Directions
                    </IonButton>

                    <IonButton
                      expand="block"
                      color="tertiary"
                      fill="outline"
                      onClick={() => {
                        setDetailOpen(false);
                        showOnMap(selected);
                      }}
                    >
                      <IonIcon icon={mapOutline} slot="start" className="mx-2"/> Show on Map
                    </IonButton>

                    <IonButton
                      expand="block"
                      color="danger"
                      fill="outline"
                      onClick={() => confirmAndRemove(selected.id)}
                    >
                      <IonIcon icon={trashOutline} slot="start" className="mx-2"/> Remove
                    </IonButton>

                    <IonButton
                      expand="block"
                      fill="clear"
                      onClick={() => setDetailOpen(false)}
                      className="bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      Close
                    </IonButton>
                  </div>
                </div>
              )}
            </div>
          </IonContent>
        </IonModal>


        {/* Ionic Alert for remove confirmation */}
        <IonAlert
          isOpen={showRemoveAlert}
          onDidDismiss={() => setShowRemoveAlert(false)}
          header={"Remove favorite"}
          message={`Remove "${selectedForRemove?.name}" from your favorites?`}
          buttons={[
            {
              text: "Cancel",
              role: "cancel",
              handler: () => {
                setSelectedForRemove(null);
                setShowRemoveAlert(false);
              },
            },
            {
              text: "Remove",
              role: "destructive",
              handler: async () => {
                await handleRemoveConfirmed();
              },
            },
          ]}
        />

        {/* Spotlight Tour */}
        {tourOpen && (
          <div className="fixed inset-0 z-50 pointer-events-none">
            <div className="absolute inset-0 bg-black/70"></div>

            {tourSteps[tourStep].highlightRef?.current && (
              <div
                className="absolute border-2 border-blue-500 rounded-lg pointer-events-none"
                style={{
                  top: tourSteps[tourStep].highlightRef.current.offsetTop - 6,
                  left: tourSteps[tourStep].highlightRef.current.offsetLeft - 6,
                  width: tourSteps[tourStep].highlightRef.current.offsetWidth + 12,
                  height: tourSteps[tourStep].highlightRef.current.offsetHeight + 12,
                  boxShadow: "0 0 0 9999px rgba(0,0,0,0.7)",
                }}
              ></div>
            )}

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 bg-gray-900 rounded-2xl shadow-2xl p-6 text-center text-white pointer-events-auto">
              <h3 className="text-xl font-bold">{tourSteps[tourStep].title}</h3>
              <p className="mt-4 text-gray-300">{tourSteps[tourStep].body}</p>

              <div className="mt-6 flex justify-between items-center">
                <button
                  className="px-4 py-2 rounded-lg text-sm bg-gray-700 text-gray-300"
                  onClick={tourPrev}
                  disabled={tourStep === 0}
                >
                  Prev
                </button>
                <button
                  className="px-5 py-2 rounded-lg bg-white text-black text-sm"
                  onClick={tourNext}
                >
                  {tourStep < tourSteps.length - 1 ? "Next" : "Done"}
                </button>
              </div>

              <button
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-200 text-sm"
                onClick={finishTour}
              >
                Skip ✕
              </button>
            </div>
          </div>
        )}

        <IonToast
          isOpen={toast.show}
          message={toast.message}
          duration={1500}
          onDidDismiss={() => setToast({ show: false })}
        />

        <style>{`
          @keyframes slideDown {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-slide-down {
            animation: slideDown 0.2s ease-out;
          }
        `}</style>
      </IonContent>
    </IonPage>
  );
};

export default Favorites;
