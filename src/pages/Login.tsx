import {
  IonButton,
  IonContent,
  IonIcon,
  IonPage,
  IonTitle,
} from "@ionic/react";
import { person } from "ionicons/icons";
import React from "react";
import useFirebase from "../firebase/useFirebase";
import BetaAlert from "../components/Alerts/BetaAlert";

const Login: React.FC = () => {
  const {
    // 🔒 AUTH DISABLED FOR BETA
    // handleOnLogin,
    // handleOnLoginWithGooglePopUp,
    // handleAnswerOnRedirect,
    handleOnLoginAsGuest,
    // auth,
  } = useFirebase();

  // React.useEffect(() => {
  //   handleAnswerOnRedirect();
  // }, [auth]);

  return (
    <IonPage className="bg-gray-950">
      <BetaAlert />

      <IonContent fullscreen className="bg-gray-950">
        <div className="relative min-h-full bg-gray-950 text-white flex flex-col justify-center items-center px-6 py-12 overflow-hidden">
          {/* Animated gradient background */}
          <div
            className="absolute inset-0 opacity-30"
            style={{
              background:
                "radial-gradient(circle at 50% 0%, rgba(251,191,36,0.08) 0%, transparent 70%)",
            }}
          />

          {/* Floating dots (reusing same style as InfoPage but simplified) */}
          <div className="absolute inset-0 pointer-events-none">
            {Array.from({ length: 40 }).map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full animate-float"
                style={{
                  width: `${Math.random() * 2 + 1}px`,
                  height: `${Math.random() * 2 + 1}px`,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  backgroundColor: `rgba(251,191,36, ${Math.random() * 0.3 + 0.1})`,
                  animation: `float ${Math.random() * 8 + 5}s linear infinite`,
                  animationDelay: `${Math.random() * 5}s`,
                }}
              />
            ))}
          </div>

          <style>{`
              @keyframes float {
                0% {
                  transform: translateY(0px) translateX(0px);
                  opacity: 0;
                }
                10% {
                  opacity: 0.6;
                }
                90% {
                  opacity: 0.6;
                }
                100% {
                  transform: translateY(-100px) translateX(${Math.random() * 40 - 20}px);
                  opacity: 0;
                }
              }

              @keyframes fadeInScale {
                from {
                  opacity: 0;
                  transform: scale(0.95);
                }
                to {
                  opacity: 1;
                  transform: scale(1);
                }
              }

              .fade-scale {
                animation: fadeInScale 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
              }

              @keyframes shimmer {
                0% { background-position: -200% center; }
                100% { background-position: 200% center; }
              }

              .shimmer-border {
                background: linear-gradient(90deg, transparent, rgba(251,191,36,0.5), transparent);
                background-size: 200% auto;
                animation: shimmer 2s infinite;
              }
            `}</style>

          {/* Hero Icon with pulse ring */}
          <div className="fade-scale relative mb-8">
            <div className="relative">
              <div className="absolute inset-0 rounded-[32px] shimmer-border" />
              <div
                className="relative w-28 h-28 rounded-[32px] flex items-center justify-center shadow-2xl"
                style={{
                  background:
                    "linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #d97706 100%)",
                  boxShadow:
                    "0 20px 40px rgba(251,191,36,0.3), 0 0 0 1px rgba(251,191,36,0.2)",
                }}
              >
                <span className="text-5xl">👤</span>
              </div>
            </div>
          </div>

          {/* Welcome Text */}
          <div
            className="text-center mb-10 fade-scale"
            style={{ animationDelay: "0.1s", opacity: 0 }}
          >
            <h1 className="text-4xl font-black tracking-tight mb-3 bg-gradient-to-r from-white via-amber-200 to-white bg-clip-text text-transparent">
              Welcome
            </h1>

            <p className="text-gray-400 text-base max-w-xs mx-auto leading-relaxed">
              Your gateway to the Oakwood University campus experience
            </p>

            {/* Divider */}
            <div className="relative px-6 mt-8">
              <div className="h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />
            </div>
          </div>

          {/* Guest Button Section */}
          <div
            className="w-full max-w-sm fade-scale rounded-full overflow-hidden"
            style={{ animationDelay: "0.3s", opacity: 0 }}
          >
            <button
              onClick={handleOnLoginAsGuest}
              className="group relative  w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold py-4 px-6 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.99] shadow-lg hover:shadow-amber-500/25"
            >
              {/* Button shine effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative flex items-center justify-center gap-2 px-3 py-4">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <span className="text-base">Continue as Guest</span>
              </div>
            </button>
          </div>

          {/* Footer */}
          <div
            className="absolute bottom-6 left-0 right-0 text-center fade-scale"
            style={{ animationDelay: "0.4s", opacity: 0 }}
          >
            <p className="text-[10px] text-gray-600 font-mono">
              OU Campus Beta · Oakwood University
            </p>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Login;
