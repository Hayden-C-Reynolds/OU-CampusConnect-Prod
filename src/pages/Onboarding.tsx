import React, { useEffect, useState, useRef } from "react";
import {
  IonPage,
  IonContent,
  IonButton,
  IonIcon,
  useIonRouter,
} from "@ionic/react";
import { Storage } from "@ionic/storage";
import { slides } from "../components/data/static-arrays/slides-onboarding";

const storage = new Storage();
storage.create();

const Onboarding: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [phase, setPhase] = useState<"spinner" | "logo" | "done">("spinner");
  const [autoSlideEnabled, setAutoSlideEnabled] = useState(true);

  const router = useIonRouter();
  const touchStartX = useRef<number | null>(null);

  /* ---------------- IMAGE PRELOAD ---------------- */
  useEffect(() => {
    let loaded = 0;
    slides.forEach((slide) => {
      const img = new Image();
      img.src = slide.image;
      img.onload = () => {
        loaded++;
        if (loaded === slides.length) {
          setImagesLoaded(true);
          setTimeout(() => setPhase("logo"), 600);
          setTimeout(() => setPhase("done"), 1500);
        }
      };
    });
  }, []);

  /* ---------------- AUTO SLIDE ---------------- */
  useEffect(() => {
    if (!imagesLoaded || !autoSlideEnabled) return;
    if (activeIndex < slides.length - 1) {
      const i = setInterval(() => {
        setActiveIndex((p) => p + 1);
      }, 3500);
      return () => clearInterval(i);
    }
  }, [activeIndex, imagesLoaded, autoSlideEnabled]);

  /* ---------------- SKIP IF SEEN ---------------- */
  useEffect(() => {
    (async () => {
      const seen = await storage.get("onboardingSeen");
      if (seen === "true") router.push("/login", "root");
    })();
  }, [router]);

  const finishOnboarding = async () => {
    await storage.set("onboardingSeen", "true");
    router.push("/login", "forward");
  };

  /* ---------------- TOUCH ---------------- */
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartX.current) return;

    const diff = touchStartX.current - e.changedTouches[0].clientX;
    setAutoSlideEnabled(false);

    if (diff > 50 && activeIndex < slides.length - 1) {
      setActiveIndex((p) => p + 1);
    }
    if (diff < -50 && activeIndex > 0) {
      setActiveIndex((p) => p - 1);
    }

    touchStartX.current = null;
  };

  return (
    <IonPage>
      <IonContent fullscreen>
        {/* ---------------- LOADER ---------------- */}
        {phase !== "done" && (
          <div className="loader-overlay">
            <div
              className={`spinner ${
                phase === "logo" ? "spinner-exit" : ""
              }`}
            />
            <img
              src="https://oakwood.edu/wp-content/uploads/OU_Seal_NoTagline_2015.png"
              alt="Oakwood University"
              className={`oakwood-logo ${
                phase === "logo" ? "logo-enter" : ""
              }`}
            />
          </div>
        )}

        {/* ---------------- ONBOARDING ---------------- */}
        <div
          className={`relative w-full h-full overflow-hidden transition-opacity duration-700 ${
            phase === "done" ? "opacity-100" : "opacity-0"
          }`}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {slides.map((slide, i) => (
            <div
              key={i}
              className={`absolute inset-0 transition-opacity duration-700 ${
                i === activeIndex ? "opacity-100" : "opacity-0"
              }`}
            >
              {/* Background */}
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${slide.image})` }}
              />

              {/* Gradient */}
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(
                    120deg,
                    rgba(0,0,0,${slide.darkness}),
                    ${slide.color}cc,
                    rgba(0,0,0,${slide.darkness})
                  )`,
                }}
              />

              {/* Card */}
              <div className="relative z-10 h-full flex items-center justify-center px-6">
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 text-center text-white shadow-2xl max-w-md w-full">
                  <IonIcon
                    icon={slide.icon}
                    className={`text-6xl mb-4 icon-animate ${
                      i === activeIndex ? "icon-active" : ""
                    }`}
                  />
                  <h2 className="text-2xl font-bold mb-2">
                    {slide.title}
                  </h2>
                  <p className="text-sm text-white/80">
                    {slide.description}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {/* BOTTOM */}
          <div className="absolute bottom-8 w-full flex flex-col items-center gap-4 z-20">
            {activeIndex === slides.length - 1 && (
              <IonButton
                className="w-3/4 slide-up-btn"
                style={{
                  "--background": "white",
                  "--color": slides[activeIndex].color,
                  "--border-radius": "9999px",
                  fontWeight: "bold",
                }}
                onClick={finishOnboarding}
              >
                Get Started
              </IonButton>
            )}

            {/* DOTS */}
            <div className="flex gap-2">
              {slides.map((_, d) => (
                <button
                  key={d}
                  onClick={() => {
                    setActiveIndex(d);
                    setAutoSlideEnabled(false);
                  }}
                  className={`w-3 h-3 rounded-full transition-all ${
                    d === activeIndex
                      ? "bg-white scale-125"
                      : "bg-white/40"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* ---------------- STYLES ---------------- */}
        <style>{`
          .loader-overlay {
            position: fixed;
            inset: 0;
            background: black;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
          }

          /* Spinner */
          .spinner {
            --size: 30px;
            --first-block-clr: #005bba;
            --second-block-clr: #fed500;
            width: 100px;
            height: 100px;
            position: absolute;
          }

          .spinner::before,
          .spinner::after {
            content: "";
            position: absolute;
            width: var(--size);
            height: var(--size);
            top: 50%;
            left: 50%;
            background: var(--first-block-clr);
            animation: up 2.4s cubic-bezier(0,0,0.24,1.21) infinite;
          }

          .spinner::after {
            background: var(--second-block-clr);
            top: calc(50% - var(--size));
            left: calc(50% - var(--size));
            animation: down 2.4s cubic-bezier(0,0,0.24,1.21) infinite;
          }

          .spinner-exit {
            animation: spinnerOut 0.6s ease forwards;
          }

          @keyframes spinnerOut {
            to {
              transform: scale(0.4);
              opacity: 0;
            }
          }

          /* Logo */
          .oakwood-logo {
            width: 120px;
            opacity: 0;
            transform: scale(0.85);
          }

          .logo-enter {
            animation: logoIn 0.8s ease forwards;
          }

          @keyframes logoIn {
            to {
              opacity: 1;
              transform: scale(1);
            }
          }

          /* Icon animation */
          .icon-animate {
            opacity: 0;
            transform: translateY(6px) scale(0.96);
          }

          .icon-active {
            animation: iconIn 0.6s ease-out forwards;
          }

          @keyframes iconIn {
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }

          /* Button */
          .slide-up-btn {
            animation: slideUpSpring 0.7s cubic-bezier(0.22, 1.61, 0.36, 1);
          }

          @keyframes slideUpSpring {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          /* Spinner keyframes */
          @keyframes up {
            0%,100% { transform: none; }
            25% { transform: translateX(-100%); }
            50% { transform: translateX(-100%) translateY(-100%); }
            75% { transform: translateY(-100%); }
          }

          @keyframes down {
            0%,100% { transform: none; }
            25% { transform: translateX(100%); }
            50% { transform: translateX(100%) translateY(100%); }
            75% { transform: translateY(100%); }
          }
        `}</style>
      </IonContent>
    </IonPage>
  );
};

export default Onboarding;
