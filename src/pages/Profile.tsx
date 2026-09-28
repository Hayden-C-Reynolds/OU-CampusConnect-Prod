// src/pages/Profile.tsx
import {
  IonButton,
  IonContent,
  IonIcon,
  IonPage,
  IonTitle,
  IonAlert,
  useIonRouter,
} from "@ionic/react";
import {
  heartOutline,
  logOutOutline,
  mapOutline,
  informationCircleOutline,
  cloudOfflineOutline,
  logInOutline,
  languageOutline,
  contrastOutline,
} from "ionicons/icons";
import React from "react";
import { IonStorageContext } from "../contexts/StorageContext";
import { campusLocations } from "../types/locations";
import { useFavorites } from "../hooks/useFavorites";
import { CampusLocation } from "../types/data";
import { useOfflineStatus } from "../hooks/useOfflineStatus";
import { GUEST_USER_ID } from "../constant";
import Logo from "../components/brand/Logo";
import LanguageSwitcher from "../components/brand/LanguageSwitcher";
import ThemeToggle from "../components/brand/ThemeToggle";
import { useLanguage } from "../contexts/LanguageContext";

/*************************
 ******** PROFILE ********
 *********************** */

const Profile: React.FC = () => {
  const { userData, handleOnCreateNewEntry } = React.useContext(IonStorageContext);
  const { favorites: favoriteIds, isGuest } = useFavorites();
  const { t } = useLanguage();
  const [showLogoutAlert, setShowLogoutAlert] = React.useState(false);

  const router = useIonRouter();
  const { isOffline } = useOfflineStatus();

  const favorites: CampusLocation[] = campusLocations.filter((loc) =>
    favoriteIds.includes(loc.id)
  );

  // Only clear the auth state here — App.tsx's guard effect owns
  // navigation and pushes to /login the moment it sees userData go
  // null. Pushing here too raced that effect and left the URL and the
  // visible page out of sync (a stale page rendering under the new URL).
  const handleLogout = async () => {
    setShowLogoutAlert(false);
    await handleOnCreateNewEntry("user", null);
  };

  // Guests already have a (guest) session stored, so we clear it first —
  // the guard effect then takes it from there and navigates to /login.
  const handleGoToLogin = async () => {
    await handleOnCreateNewEntry("user", null);
  };

  if (!userData) {
    return (
      <IonPage>
        <IonContent fullscreen className="flex items-center justify-center" style={{ "--background": "var(--cc-bg)" } as React.CSSProperties}>
          <p className="text-sm" style={{ color: "var(--cc-text-tertiary)" }}>{t("common.loading")}</p>
        </IonContent>
      </IonPage>
    );
  }

  const displayName =
    !userData.fullName || userData.fullName === "GUEST USER"
      ? userData.email
        ? userData.email.split("@")[0]
        : "Guest"
      : userData.fullName;

  const initials = displayName?.charAt(0)?.toUpperCase() ?? "?";

  return (
    <IonPage>
      <IonContent fullscreen style={{ "--background": "var(--cc-bg)" } as React.CSSProperties}>
        <div className="w-full flex flex-col items-center pb-32">

          <section className="w-full flex items-center justify-between px-5 pt-6 pb-4">
            <IonTitle className="text-2xl font-black p-0 m-0" style={{ color: "var(--cc-text)" }}>{t("profile.title")}</IonTitle>
            <Logo size={34} />
          </section>

          {isOffline && (
            <div
              className="w-[92%] mb-3 flex items-center gap-2 px-4 py-2 rounded-xl text-xs"
              style={{
                backgroundColor: "rgba(232,179,65,0.1)",
                border: "1px solid rgba(232,179,65,0.3)",
                color: "#f0c669",
              }}
            >
              <IonIcon icon={cloudOfflineOutline} />
              You're offline — some info may be out of date.
            </div>
          )}

          <div
            className="w-full max-w-2xl rounded-t-[28px]"
            style={{ backgroundColor: "var(--cc-surface-soft)", borderTop: "1px solid var(--cc-border)" }}
          >
            {/* Identity */}
            <section className="w-full flex items-center p-5 gap-5">
              <div className="w-24 h-24 rounded-2xl overflow-hidden shadow-lg flex-shrink-0">
                {userData.profilePic ? (
                  <img src={userData.profilePic} alt={displayName} className="w-full h-full object-cover" />
                ) : (
                  <div
                    className="w-full h-full text-4xl font-black flex items-center justify-center text-white"
                    style={{ background: "linear-gradient(135deg, #f0c669 0%, #e8b341 55%, #c9922b 100%)" }}
                  >
                    {initials}
                  </div>
                )}
              </div>

              <div className="min-w-0">
                <IonTitle className="text-2xl font-black leading-tight truncate p-0 m-0" style={{ color: "var(--cc-text)" }}>
                  {displayName}
                </IonTitle>
                <p className="text-sm truncate mt-0.5" style={{ color: "var(--cc-text-tertiary)" }}>
                  {userData.email ?? t("profile.guestSession")}
                </p>
                {userData.id === GUEST_USER_ID && (
                  <span
                    className="inline-block mt-2 text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full"
                    style={{ backgroundColor: "var(--cc-border-strong)", color: "var(--cc-text-secondary)" }}
                  >
                    {t("profile.guestAccount")}
                  </span>
                )}
              </div>
            </section>

            {/* Quick actions */}
            <section className="w-full flex gap-3 px-5 -mt-1 mb-2">
              <button
                onClick={() => router.push("/favorites", "forward")}
                className="flex-1 flex flex-col items-center gap-1 rounded-2xl py-4 active:scale-[0.98] transition-transform"
                style={{ backgroundColor: "var(--cc-surface-soft)", border: "1px solid var(--cc-border)" }}
              >
                <IonIcon icon={heartOutline} style={{ fontSize: "22px", color: "#f87171" }} />
                <span className="text-xs font-semibold" style={{ color: "var(--cc-text)" }}>
                  {isGuest ? t("profile.favorites") : `${favorites.length} Favorite${favorites.length === 1 ? "" : "s"}`}
                </span>
              </button>

              <button
                onClick={() => router.push("/home", "forward")}
                className="flex-1 flex flex-col items-center gap-1 rounded-2xl py-4 active:scale-[0.98] transition-transform"
                style={{ backgroundColor: "var(--cc-surface-soft)", border: "1px solid var(--cc-border)" }}
              >
                <IonIcon icon={mapOutline} style={{ fontSize: "22px", color: "#6f97f5" }} />
                <span className="text-xs font-semibold" style={{ color: "var(--cc-text)" }}>{t("profile.openMap")}</span>
              </button>

              <button
                onClick={() => router.push("/info", "forward")}
                className="flex-1 flex flex-col items-center gap-1 rounded-2xl py-4 active:scale-[0.98] transition-transform"
                style={{ backgroundColor: "var(--cc-surface-soft)", border: "1px solid var(--cc-border)" }}
              >
                <IonIcon icon={informationCircleOutline} style={{ fontSize: "22px", color: "#e8b341" }} />
                <span className="text-xs font-semibold" style={{ color: "var(--cc-text)" }}>{t("profile.about")}</span>
              </button>
            </section>

            {/* Language — available to everyone, including guests */}
            <section id="cc-tour-language" className="w-full flex flex-col gap-3 px-5 mt-6">
              <div className="flex items-center gap-2">
                <IonIcon icon={languageOutline} style={{ fontSize: "16px", color: "var(--cc-text-secondary)" }} />
                <IonTitle className="text-base font-bold p-0 m-0" style={{ color: "var(--cc-text)" }}>{t("profile.language")}</IonTitle>
              </div>
              <p className="text-xs -mt-2" style={{ color: "var(--cc-text-tertiary)" }}>
                {t("profile.languageDescription")}
              </p>
              <LanguageSwitcher />
            </section>

            {/* Appearance */}
            <section className="w-full flex flex-col gap-3 px-5 mt-6">
              <div className="flex items-center gap-2">
                <IonIcon icon={contrastOutline} style={{ fontSize: "16px", color: "var(--cc-text-secondary)" }} />
                <IonTitle className="text-base font-bold p-0 m-0" style={{ color: "var(--cc-text)" }}>{t("profile.appearance")}</IonTitle>
              </div>
              <p className="text-xs -mt-2" style={{ color: "var(--cc-text-tertiary)" }}>
                {t("profile.appearanceDescription")}
              </p>
              <ThemeToggle />
            </section>

            {/* Favorites preview / guest prompt */}
            <section className="w-full flex flex-col gap-3 px-5 mt-6">
              <div className="flex items-center gap-3">
                <IonTitle className="text-base font-bold p-0 m-0" style={{ color: "var(--cc-text)" }}>{t("profile.yourFavorites")}</IonTitle>
                <span className="flex-1 h-px" style={{ backgroundColor: "var(--cc-border-strong)" }} />
              </div>

              {isGuest ? (
                <div
                  className="rounded-2xl p-5 text-center flex flex-col items-center gap-2"
                  style={{ backgroundColor: "var(--cc-surface-soft)", border: "1px solid var(--cc-border)" }}
                >
                  <p className="text-sm" style={{ color: "var(--cc-text-secondary)" }}>
                    {t("profile.favoritesNeedAccount")}
                  </p>
                  <IonButton size="small" color="warning" onClick={handleGoToLogin}>
                    <IonIcon icon={logInOutline} slot="start" />
                    {t("common.logIn")}
                  </IonButton>
                </div>
              ) : favorites.length === 0 ? (
                <div
                  className="rounded-2xl p-5 text-center"
                  style={{ backgroundColor: "var(--cc-surface-soft)", border: "1px solid var(--cc-border)" }}
                >
                  <p className="text-sm" style={{ color: "var(--cc-text-tertiary)" }}>
                    {t("profile.noFavoritesYet")}
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  {favorites.slice(0, 4).map((loc) => (
                    <div
                      key={loc.id}
                      className="flex items-center gap-3 rounded-2xl px-4 py-3"
                      style={{ backgroundColor: "var(--cc-surface-soft)", border: "1px solid var(--cc-border)" }}
                    >
                      <div
                        className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                        style={{ background: ["#34d399", "#6f97f5", "#e8b341", "#a78bfa"][loc.name.charCodeAt(0) % 4] }}
                      >
                        {loc.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold truncate" style={{ color: "var(--cc-text)" }}>{loc.name}</p>
                        <p className="text-xs truncate" style={{ color: "var(--cc-text-tertiary)" }}>{loc.category}</p>
                      </div>
                    </div>
                  ))}
                  {favorites.length > 4 && (
                    <button
                      onClick={() => router.push("/favorites", "forward")}
                      className="text-xs text-center py-1"
                      style={{ color: "var(--cc-text-tertiary)" }}
                    >
                      {t("profile.viewAllFavorites", { count: favorites.length })}
                    </button>
                  )}
                </div>
              )}
            </section>

            {/* Sign out */}
            {!isGuest && (
              <section className="w-full flex flex-col items-center px-5 py-8 gap-3">
                <IonButton expand="block" fill="outline" color="danger" className="w-full" onClick={() => setShowLogoutAlert(true)}>
                  <IonIcon icon={logOutOutline} slot="start" />
                  {t("common.logOut")}
                </IonButton>
              </section>
            )}
            {isGuest && (
              <section className="w-full flex flex-col items-center px-5 py-8 gap-3">
                <IonButton expand="block" color="warning" className="w-full" onClick={handleGoToLogin}>
                  <IonIcon icon={logInOutline} slot="start" />
                  {t("common.logIn")}
                </IonButton>
              </section>
            )}
          </div>
        </div>

        <IonAlert
          isOpen={showLogoutAlert}
          onDidDismiss={() => setShowLogoutAlert(false)}
          header={t("common.logOut")}
          message="Are you sure you want to log out?"
          buttons={[
            { text: t("common.cancel"), role: "cancel" },
            { text: t("common.logOut"), role: "destructive", handler: handleLogout },
          ]}
        />
      </IonContent>
    </IonPage>
  );
};

export default Profile;