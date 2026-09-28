// src/pages/Info.tsx
import React, { useRef, useEffect, useState } from "react";
import { IonPage, IonContent, useIonRouter } from "@ionic/react";
import { resetFirstTimeTour } from "../hooks/useFirstTimeTour";
import { usePwaInstall } from "../hooks/usePwaInstall";
import InstallAppModal from "../modals/InstallAppModal";
import Logo from "../components/brand/Logo";
import { useLanguage } from "../contexts/LanguageContext";

// At the top of Info.tsx — bump this each release
const APP_VERSION = "3.0.0";

// Add every team member here
// Add every team member here
const contributors = [
  {
    name: "Ramy Campusano",
    role: "Lead Developer & Designer",
    emoji: "👨🏾‍💻",
    note: "Built the map engine, UI architecture, and navigation system.",
  },
  {
    name: "Ethan Morency",
    role: "Technical Project Lead",
    emoji: "🏗️",
    note: "Led sprints, guided project direction, and built the feature timeline.",
  },
  {
    name: "Hayden Reynolds",
    role: "Developer & Product Lead",
    emoji: "👨🏾‍💻",
    note: "Built the events page, campus locations, deployment, and launch strategy.",
  },
  {
    name: "Onell Dishmey",
    role: "Developer & Designer",
    emoji: "👨🏾‍💻",
    note: "Built the map engine, UI architecture, and navigation system.",
  },
  {
    name: "Felipe Antonio",
    role: "Test Engineer & UX Researcher",
    emoji: "👨🏾‍💻",
    note: "Built the map engine, UI architecture, and navigation system.",
  },
  {
    name: "Nyla Percy",
    role: "Data Team Lead",
    emoji: "📊",
    note: "Led the data team, coordinated timelines, and built the member training program.",
  },
  {
    name: "Chris-Anna Johnson",
    role: "Developer & Data",
    emoji: "📋",
    note: "Researched and compiled campus building data for the map.",
  },
  {
    name: "Angelo Bowens",
    role: "Developer & Data",
    emoji: "📋",
    note: "Researched and compiled campus building data for the map.",
  },
  {
    name: "Vuyo Sibanda",
    role: "Developer & Data",
    emoji: "📍",
    note: "Verified and updated campus building location data.",
  },
  {
    name: "Kaelan Smith",
    role: "Developer & Data",
    emoji: "📍",
    note: "Verified and updated campus building location data.",
  },
  {
    name: "Ronnie Nicholson",
    role: "Developer & Data",
    emoji: "📍",
    note: "Verified and updated campus building location data.",
  },
  {
    name: "QueAnn Pryce",
    role: "Developer & Research",
    emoji: "📋",
    note: "Researched building information and provided key project support.",
  },
  {
    name: "Jalon",
    role: "Developer",
    emoji: "📍",
    note: "Expanded the location modal with richer building information.",
  },
  {
    name: "Dameesha Macklin",
    role: "Developer",
    emoji: "👤",
    note: "Built out the user profile page.",
  },
  {
    name: "Lydia Josiah",
    role: "Developer",
    emoji: "🖼️",
    note: "Added photos to the location modal.",
  },
  {
    name: "Michael Branch",
    role: "Developer",
    emoji: "🚩",
    note: "Built the report-an-issue feature.",
  },
  {
    name: "Sharie",
    role: "Developer",
    emoji: "📅",
    note: "Added filtering to the events page.",
  },
];
 

const getFeatures = (t: (k: any) => string) => [
  { icon: "🗺️", label: t("info.feature.map"),        desc: t("info.feature.mapDesc")        },
  { icon: "🔍", label: t("info.feature.search"),      desc: t("info.feature.searchDesc")     },
  { icon: "⭐", label: t("info.feature.favorites"),   desc: t("info.feature.favoritesDesc")  },
  { icon: "🕐", label: t("info.feature.hours"),       desc: t("info.feature.hoursDesc")      },
  { icon: "🧭", label: t("info.feature.directions"),  desc: t("info.feature.directionsDesc") },
  { icon: "🎓", label: t("info.feature.departments"), desc: t("info.feature.departmentsDesc"), to: "/departments" },
];

const InfoPage: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const router = useIonRouter();
  const { installed } = usePwaInstall();
  const [showInstallModal, setShowInstallModal] = useState(false);
  const { t } = useLanguage();
  const features = getFeatures(t);

  const handleReplayTour = () => {
    resetFirstTimeTour();
    router.push("/home", "forward");
  };

  // Animated floating amber dots in the background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const dots = Array.from({ length: 60 }, () => ({
      x:     Math.random() * canvas.width,
      y:     Math.random() * canvas.height,
      r:     Math.random() * 1.5 + 0.5,
      vx:    (Math.random() - 0.5) * 0.3,
      vy:    (Math.random() - 0.5) * 0.3,
      alpha: Math.random() * 0.4 + 0.1,
    }));

    let raf: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      dots.forEach((d) => {
        d.x += d.vx;
        d.y += d.vy;
        if (d.x < 0 || d.x > canvas.width)  d.vx *= -1;
        if (d.y < 0 || d.y > canvas.height) d.vy *= -1;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(232,179,65,${d.alpha})`;
        ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <IonPage className="bg-gray-950">
      <IonContent fullscreen className="bg-gray-950">
        <style>{`
          @keyframes fadeUp {
            from { opacity: 0; transform: translateY(16px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          .fade-up  { animation: fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) both; }
          .delay-1  { animation-delay: 0.08s; }
          .delay-2  { animation-delay: 0.16s; }
          .delay-3  { animation-delay: 0.24s; }
          .delay-4  { animation-delay: 0.32s; }
          .delay-5  { animation-delay: 0.40s; }
          .delay-6  { animation-delay: 0.48s; }

          @keyframes shimmer {
            0%   { background-position: -200% center; }
            100% { background-position:  200% center; }
          }
          .shimmer-text {
            background: linear-gradient(90deg, #e8b341 0%, #f0c669 40%, #e8b341 60%, #c9922b 100%);
            background-size: 200% auto;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            animation: shimmer 3s linear infinite;
          }

          @keyframes pulse-ring {
            0%   { transform: scale(1);   opacity: 0.6; }
            100% { transform: scale(1.8); opacity: 0; }
          }
          .pulse-ring::after {
            content: '';
            position: absolute;
            inset: 0;
            border-radius: 50%;
            border: 2px solid rgba(232,179,65,0.4);
            animation: pulse-ring 2s ease-out infinite;
          }

          .feature-card { transition: transform 0.2s ease; }
          .feature-card:hover { transform: translateY(-2px); }
        `}</style>

        <div className="relative min-h-full bg-gray-950 text-white pb-32 overflow-hidden">

          {/* Floating dot canvas background */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ opacity: 0.6 }}
          />

          {/* ── Hero ── */}
          <div className="relative pt-16 pb-12 px-6 flex flex-col items-center text-center">

            {/* App logo with pulse ring */}
            <div className="fade-up relative mb-6">
              <div className="pulse-ring relative">
                <Logo size={96} className="rounded-[28px] shadow-2xl" />
              </div>
            </div>

            <h1 className="fade-up delay-1 shimmer-text text-4xl font-black tracking-tight mb-1">
              Campus Connect
            </h1>

            <p className="fade-up delay-2 text-gray-500 text-sm tracking-widest uppercase font-semibold mb-1">
              {t("common.university")}
            </p>

            {/* Version badge */}
            <div className="fade-up delay-2 mt-2 inline-flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-white/10 rounded-full">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-[11px] text-gray-400 font-mono">v{APP_VERSION}</span>
            </div>

            <div className="fade-up delay-2 mt-3 flex items-center gap-3">
              <button
                onClick={handleReplayTour}
                className="text-[11px] font-semibold text-amber-400 hover:text-amber-300 underline underline-offset-2"
              >
                {t("info.replayTour")}
              </button>
              {!installed && (
                <>
                  <span className="text-white/20">·</span>
                  <button
                    onClick={() => setShowInstallModal(true)}
                    className="text-[11px] font-semibold text-amber-400 hover:text-amber-300 underline underline-offset-2"
                  >
                    {t("info.installApp")}
                  </button>
                </>
              )}
            </div>

            <p className="fade-up delay-3 mt-5 text-gray-400 text-sm leading-relaxed max-w-xs">
              {t("info.tagline")}
            </p>
          </div>

          

          {/* Divider */}
          <div className="relative px-6 mb-8">
            <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          </div>

          {/* ── Community ── */}
          <div className="relative px-5 mb-10 fade-up delay-5">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-600 mb-4 px-1">
              {t("info.community")}
            </p>

            {/* Feedback button */}
            <a
              href="https://docs.google.com/forms/d/e/1FAIpQLSe0aFmvzrwS905tf9U1yTzKXg2Lvxm4geNbeLtvDjxcMhtwcw/viewform?usp=dialog"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 rounded-2xl p-4 border border-white/10 mb-3"
              style={{ background: "linear-gradient(135deg, var(--cc-surface-2), var(--cc-surface))" }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                style={{ background: "rgba(232,179,65,0.1)", border: "1px solid rgba(232,179,65,0.2)" }}
              >
                💬
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-white mb-0.5">{t("info.giveFeedback")}</p>
                <p className="text-xs text-gray-500 leading-snug">{t("info.giveFeedbackDesc")}</p>
              </div>
              <span className="text-gray-600 text-sm">→</span>
            </a>

            {/* Submit event button */}
            <a
              href="https://docs.google.com/forms/d/e/1FAIpQLSdshFRbrQLSRHuDbsU8K7MHbVxw5HBq_tVPjVVp6djGC2zMyQ/viewform?usp=dialog"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 rounded-2xl p-4 border border-white/10"
              style={{ background: "linear-gradient(135deg, var(--cc-surface-2), var(--cc-surface))" }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                style={{ background: "rgba(232,179,65,0.1)", border: "1px solid rgba(232,179,65,0.2)" }}
              >
                📅
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-white mb-0.5">{t("info.submitEvent")}</p>
                <p className="text-xs text-gray-500 leading-snug">{t("info.submitEventDesc")}</p>
              </div>
              <span className="text-gray-600 text-sm">→</span>
            </a>
          </div>

          {/* Divider */}
          <div className="relative px-6 mb-8">
            <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          </div>

          {/* ── Features Grid ── */}
          <div className="relative px-5 mb-10 fade-up delay-3">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-600 mb-4 px-1">
              {t("info.whatsInside")}
            </p>
            <div className="grid grid-cols-2 gap-2.5">
              {features.map((f) => (
                <div
                  key={f.label}
                  onClick={f.to ? () => router.push(f.to, "forward") : undefined}
                  className={`feature-card rounded-2xl p-4 border border-white/10 ${f.to ? "cursor-pointer" : ""}`}
                  style={{
                    background: "linear-gradient(135deg, var(--cc-surface-2), var(--cc-surface))",
                  }}
                >
                  <span className="text-2xl mb-2 block">{f.icon}</span>
                  <p className="text-xs font-bold text-white mb-0.5">{f.label}</p>
                  <p className="text-[11px] text-gray-500 leading-snug">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="relative px-6 mb-8">
            <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          </div>

          {/* ── Contributors ── */}
          <div className="relative px-5 mb-10 fade-up delay-4">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-600 mb-4 px-1">
              {t("info.builtBy")}
            </p>

            {contributors.map((c) => (
              <div
                key={c.name}
                className="rounded-2xl p-5 border border-white/10 mb-3"
                style={{
                  background: "linear-gradient(135deg, var(--cc-surface-2), var(--cc-surface))",
                }}
              >
                <div className="flex items-center gap-4 mb-3">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                    style={{
                      background: "linear-gradient(135deg, rgba(232,179,65,0.15), rgba(232,179,65,0.05))",
                      border: "1px solid rgba(232,179,65,0.2)",
                    }}
                  >
                    {c.emoji}
                  </div>
                  <div>
                    <p className="font-black text-white text-base">{c.name}</p>
                    <p className="text-xs font-semibold" style={{ color: "#e8b341" }}>
                      {c.role}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-gray-400 leading-relaxed">{c.note}</p>
              </div>
            ))}

            {/* Add contributor prompt */}
            <div
              className="rounded-2xl p-4 border border-dashed border-white/10 flex items-center gap-3"
              style={{ background: "var(--cc-surface-soft)" }}
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0 bg-white/5">
                ✨
              </div>
              <div>
                <p className="text-sm font-bold text-white">{t("info.wantToContribute")}</p>
                <p className="text-xs text-gray-500">
                  {t("info.contributeDesc")}
                </p>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="relative px-6 mb-8">
            <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          </div>

          {/* ── Mission ── */}
          <div className="relative px-5 mb-10 fade-up delay-5">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-600 mb-4 px-1">
              {t("info.ourMission")}
            </p>
            <div
              className="rounded-2xl p-5 border border-white/10"
              style={{ background: "linear-gradient(135deg, rgba(232,179,65,0.06), rgba(0,0,0,0))" }}
            >
              <p className="text-base font-black mb-2" style={{ color: "#e8b341" }}>
                {t("info.missionQuote")}
              </p>
              <p className="text-sm text-gray-400 leading-relaxed">
                {t("info.missionBody")}
              </p>
            </div>
          </div>

          {/* ── Footer ── */}
          <div className="relative px-5 fade-up delay-6 flex flex-col items-center text-center gap-2">
            <div className="flex items-center gap-2 mb-1">
              <div className="h-px w-10 bg-white/10" />
              <span className="text-2xl">🏛️</span>
              <div className="h-px w-10 bg-white/10" />
            </div>
            <p className="text-[11px] text-gray-600 font-mono">OU Campus v{APP_VERSION}</p>
            <p className="text-[11px] text-gray-700">
              {t("info.madeWith")}
            </p>
            <p className="text-[10px] text-gray-800 mt-1">
              © {new Date().getFullYear()} OU Campus App. {t("info.allRightsReserved")}
            </p>
          </div>

        </div>
      </IonContent>

      <InstallAppModal isOpen={showInstallModal} onClose={() => setShowInstallModal(false)} />
    </IonPage>
  );
};

export default InfoPage;