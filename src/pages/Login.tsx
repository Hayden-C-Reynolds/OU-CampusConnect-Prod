import { IonContent, IonPage } from "@ionic/react";
import React from "react";
import { Link } from "react-router-dom";
import Logo from "../components/brand/Logo";
import useFirebase from "../firebase/useFirebase";
import BetaAlert from "../components/Alerts/BetaAlert";
import { IonStorageContext } from "../contexts/StorageContext";
import { GUEST_USER_ID } from "../constant";
import { useLanguage } from "../contexts/LanguageContext";
import { campusLocations } from "../types/locations";

const Login: React.FC = () => {
  const IonStoreContext = React?.useContext(IonStorageContext);

  const { handleOnCreateNewEntry } = IonStoreContext;
  const { handleOnLoginWithGooglePopUp } = useFirebase();

  const { t } = useLanguage();
  const [authError, setAuthError] = React.useState<string | null>(null);
  const [signingIn, setSigningIn] = React.useState(false);

  const handleOnGoogleLogin = async () => {
    setAuthError(null);
    setSigningIn(true);
    try {
      const result = await handleOnLoginWithGooglePopUp();
      if (!result) {
        setAuthError(t("login.errorGoogle"));
      }
    } catch (err) {
      console.error("Google sign-in failed:", err);
      setAuthError(t("login.errorGoogleFailed"));
    } finally {
      setSigningIn(false);
    }
  };

  const handleOnLogIn = async () => {
    // Only update the auth state here — App.tsx owns navigation and
    // swaps to the logged-in tree the moment it sees userData go
    // non-null. Pushing here too raced that, so this stays state-only.
    await handleOnCreateNewEntry("user", {
      id: GUEST_USER_ID,
      fullName: "GUEST USER",
      email: null,
      profilePic: null,
    });
  };

  return (
    <IonPage>
      <BetaAlert />

      <IonContent fullscreen style={{ "--background": "#05070c" } as React.CSSProperties}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,500&display=swap');

          @keyframes cc-spin      { from { transform: rotate(0deg); }   to { transform: rotate(360deg); } }
          @keyframes cc-spin-rev  { from { transform: rotate(360deg); } to { transform: rotate(0deg); } }
          @keyframes cc-drift {
            0%, 100% { transform: translate(0, 0); }
            50%      { transform: translate(10px, -14px); }
          }
          @keyframes cc-rise {
            from { opacity: 0; transform: translateY(14px); }
            to   { opacity: 1; transform: translateY(0); }
          }

          .cc-rise     { animation: cc-rise 0.6s cubic-bezier(0.16,1,0.3,1) both; opacity: 0; }
          .cc-ring-out { animation: cc-spin 34s linear infinite; }
          .cc-ring-in  { animation: cc-spin-rev 26s linear infinite; }
          .cc-blob     { animation: cc-drift 9s ease-in-out infinite; }

          .cc-btn-primary { transition: transform 0.15s ease, box-shadow 0.15s ease, filter 0.15s ease; }
          .cc-btn-primary:hover  { transform: translateY(-1px); filter: brightness(1.04); }
          .cc-btn-primary:active { transform: translateY(0) scale(0.98); }

          .cc-btn-ghost { transition: transform 0.15s ease, background-color 0.15s ease, border-color 0.15s ease; }
          .cc-btn-ghost:hover  { background-color: rgba(255,255,255,0.06); border-color: rgba(255,255,255,0.28); }
          .cc-btn-ghost:active { transform: scale(0.98); }

          .cc-chip { transition: border-color 0.15s ease, background-color 0.15s ease; }
          .cc-chip:hover { border-color: rgba(255,255,255,0.22); background-color: rgba(255,255,255,0.05); }
        `}</style>

        <div className="relative min-h-full flex flex-col items-center justify-center overflow-hidden" style={{ background: "#05070c" }}>

          {/* ── Background field (full-bleed, behind the centered card) ── */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(560px 420px at 12% -6%, rgba(232,179,65,0.15) 0%, transparent 62%)," +
                "radial-gradient(520px 460px at 108% 22%, rgba(76,110,245,0.16) 0%, transparent 60%)," +
                "radial-gradient(700px 520px at 50% 118%, rgba(76,110,245,0.10) 0%, transparent 65%)",
            }}
          />
          <div
            className="cc-blob absolute pointer-events-none"
            style={{
              top: "-60px",
              right: "-70px",
              width: "220px",
              height: "220px",
              borderRadius: "9999px",
              background: "radial-gradient(circle, rgba(232,179,65,0.15) 0%, transparent 70%)",
              filter: "blur(6px)",
            }}
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: "radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)",
              backgroundSize: "24px 24px",
              maskImage: "radial-gradient(ellipse 85% 60% at 50% 30%, black 30%, transparent 85%)",
              WebkitMaskImage: "radial-gradient(ellipse 85% 60% at 50% 30%, black 30%, transparent 85%)",
            } as React.CSSProperties}
          />

          {/* ── Everything below is constrained to a phone-width column and
              centered — without this, the page stretched edge-to-edge on
              any viewport wider than a phone (buttons running the full
              width of a desktop browser window, content left-aligned
              instead of centered). ── */}
          <div className="relative w-full flex flex-col py-10" style={{ maxWidth: 400 }}>

          {/* ── Status badge ── */}
          <div className="cc-rise relative px-6 flex justify-center">
            <div className="cc-chip inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full" style={{ border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.03)" }}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#34d399", boxShadow: "0 0 8px #34d399" }} />
              <span className="text-[10.5px] font-bold uppercase tracking-[0.14em]" style={{ color: "rgba(255,255,255,0.55)" }}>
                {t("login.badge")}
              </span>
            </div>
          </div>

          {/* ── Compass emblem ── */}
          <div className="cc-rise relative flex justify-center" style={{ marginTop: "34px", animationDelay: "0.05s" }}>
            <div className="relative flex items-center justify-center" style={{ width: 128, height: 128 }}>
              <svg className="cc-ring-out absolute inset-0" width="128" height="128" viewBox="0 0 128 128">
                <circle cx="64" cy="64" r="62" fill="none" stroke="#e8b341" strokeOpacity="0.22" strokeWidth="1" strokeDasharray="1 7" strokeLinecap="round" />
              </svg>
              <svg className="cc-ring-in absolute" width="102" height="102" viewBox="0 0 102 102">
                <circle cx="51" cy="51" r="49" fill="none" stroke="#e8b341" strokeOpacity="0.35" strokeWidth="1.25" />
                <circle cx="51" cy="2" r="2" fill="#e8b341" />
              </svg>
              <Logo size={72} className="rounded-2xl relative" />
            </div>
          </div>

          {/* ── Headline ── */}
          <div className="cc-rise relative text-center px-8" style={{ marginTop: "22px", animationDelay: "0.1s" }}>
            <h1
              className="whitespace-pre-line"
              style={{
                margin: "0 0 10px",
                fontFamily: "'Fraunces', Georgia, serif",
                fontWeight: 600,
                fontSize: "30px",
                lineHeight: 1.12,
                letterSpacing: "-0.01em",
                color: "#f5f3ee",
              }}
            >
              {t("login.heroTitle")}
            </h1>
            <p className="text-[14.5px] leading-relaxed mx-auto" style={{ color: "rgba(255,255,255,0.48)", maxWidth: 280 }}>
              {t("login.heroSubtitle")}
            </p>
          </div>

          {/* ── Actions ── */}
          <div className="cc-rise relative flex flex-col gap-2.5 px-6" style={{ marginTop: "30px", animationDelay: "0.16s" }}>
            <button
              onClick={handleOnGoogleLogin}
              disabled={signingIn}
              className="cc-btn-primary w-full flex items-center justify-center gap-2.5 rounded-full py-3.5 font-bold text-[15px] disabled:opacity-50"
              style={{
                backgroundColor: "#ffffff",
                color: "#1a1a1a",
                boxShadow: "0 14px 30px rgba(0,0,0,0.35), 0 2px 6px rgba(0,0,0,0.14)",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 48 48">
                <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
                <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" />
                <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
                <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" />
              </svg>
              {signingIn ? t("login.signingIn") : t("login.continueWithGoogle")}
            </button>

            {authError && (
              <p className="text-xs text-center" style={{ color: "#f87171" }}>
                {authError}
              </p>
            )}

            <div className="flex items-center gap-3" style={{ margin: "3px 4px" }}>
              <span className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.09)" }} />
              <span className="text-[10.5px] font-bold uppercase tracking-[0.14em]" style={{ color: "rgba(255,255,255,0.32)" }}>
                or
              </span>
              <span className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.09)" }} />
            </div>

            <button
              onClick={handleOnLogIn}
              className="cc-btn-ghost w-full flex items-center justify-center gap-2.5 rounded-full py-3.5 font-bold text-[15px]"
              style={{ backgroundColor: "rgba(255,255,255,0.02)", border: "1.5px solid rgba(255,255,255,0.14)", color: "#f5f3ee" }}
            >
              <span className="w-[22px] h-[22px] rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "rgba(232,179,65,0.15)" }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                  <path d="M12 12.5a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9Z" stroke="#e8b341" strokeWidth="1.8" />
                  <path d="M4.5 20c1.4-3.8 4.3-5.8 7.5-5.8s6.1 2 7.5 5.8" stroke="#e8b341" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </span>
              {t("login.continueAsGuest")}
            </button>
          </div>

          {/* ── Quick stat chips ── */}
          <div className="cc-rise relative flex gap-2 px-6" style={{ marginTop: "26px", animationDelay: "0.22s" }}>
            <div className="cc-chip flex-1 flex flex-col items-center gap-0.5 py-2.5 px-1.5 rounded-2xl" style={{ border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.02)" }}>
              <span style={{ fontFamily: "'Fraunces', serif", fontSize: "17px", fontWeight: 600, color: "#e8b341" }}>{campusLocations.length}</span>
              <span className="text-[9.5px] font-semibold uppercase tracking-[0.04em]" style={{ color: "rgba(255,255,255,0.4)" }}>{t("login.statBuildings")}</span>
            </div>
            <div className="cc-chip flex-1 flex flex-col items-center gap-0.5 py-2.5 px-1.5 rounded-2xl" style={{ border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.02)" }}>
              <span style={{ fontFamily: "'Fraunces', serif", fontSize: "17px", fontWeight: 600, color: "#e8b341" }}>{t("login.statMapValue")}</span>
              <span className="text-[9.5px] font-semibold uppercase tracking-[0.04em]" style={{ color: "rgba(255,255,255,0.4)" }}>{t("login.statMap")}</span>
            </div>
            <div className="cc-chip flex-1 flex flex-col items-center gap-0.5 py-2.5 px-1.5 rounded-2xl" style={{ border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.02)" }}>
              <span style={{ fontFamily: "'Fraunces', serif", fontSize: "17px", fontWeight: 600, color: "#e8b341" }}>3</span>
              <span className="text-[9.5px] font-semibold uppercase tracking-[0.04em]" style={{ color: "rgba(255,255,255,0.4)" }}>{t("login.statLanguages")}</span>
            </div>
          </div>

          {/* ── Footer ── */}
          <div className="cc-rise relative text-center px-8" style={{ marginTop: "30px", animationDelay: "0.28s" }}>
            <p className="text-[11px] leading-relaxed" style={{ color: "rgba(255,255,255,0.32)", marginBottom: "10px" }}>
              {t("login.agreeText")}{" "}
              <Link to="/terms" style={{ color: "#e8b341", textDecoration: "none", fontWeight: 600 }}>{t("login.terms")}</Link>
              {" "}&amp;{" "}
              <Link to="/privacy" style={{ color: "#e8b341", textDecoration: "none", fontWeight: 600 }}>{t("login.privacy")}</Link>
            </p>
            <div className="flex items-center justify-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#e8b341" }} />
              <span className="text-[10.5px] font-bold uppercase tracking-[0.08em]" style={{ color: "rgba(255,255,255,0.3)" }}>
                {t("login.betaFooter")}
              </span>
            </div>
          </div>

          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Login;