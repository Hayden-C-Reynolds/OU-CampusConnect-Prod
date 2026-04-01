// src/pages/Info.tsx
import React, { useRef, useEffect } from "react";
import { IonPage, IonContent } from "@ionic/react";

// At the top of Info.tsx — bump this each release
const APP_VERSION = "1.0.0";

// Add every team member here
const contributors = [
    {
      name: "Ramy Campusano",
      role: "Lead Developer & Designer",
      emoji: "👨🏾‍💻",
      note: "Built the map engine, UI architecture, and navigation system.",
    },
    {
    name: "Onell Dishmey",
    role: "Developer & Designer",
    emoji: "👨🏾‍💻",
    note: "Built the map engine, UI architecture, and navigation system.",
  },
  {
    name: "Hayden Reynolds",
    role: "Developer & Designer",
    emoji: "👨🏾‍💻",
    note: "Developed & designed the visual language and campus marker system.",
  },
  {
    name: "Nyla Percy",
    role: "Resource & UX Designer",
    emoji: "🎨",
    note: "Researched and designed the information architecture.",
  },
  {
    name: "QueAnn Pryce",
    role: "Resource & UX Designer",
    emoji: "🎨",
    note: "Researched and designed the information architecture.",
  },
  {
    name: "Chris-Anna Jhonson",
    role: "Resource & UX Designer",
    emoji: "🎨",
    note: "Researched and designed the information architecture.",
  },
  {
    name: "Felipe Antonio",
    role: "Test Engineer & UX Researcher",
    emoji: "👨🏾‍💻",
    note: "Built the map engine, UI architecture, and navigation system.",
  },
  {
    name: "Vuyo",
    role: "Resource & UX Designer",
    emoji: "🎨",
    note: "Researched and designed the information architecture.",
  },
    {
    name: "Angelo Bowens",
    role: "Resource & UX Designer",
    emoji: "🎨",
    note: "Researched and designed the information architecture.",
  },
];

const features = [
  { icon: "🗺️", label: "Interactive Campus Map",  desc: "Explore every building with a tap."       },
  { icon: "🔍", label: "Instant Search",           desc: "Find any location in seconds."            },
  { icon: "⭐", label: "Favorites",                desc: "Save your most-visited spots."            },
  { icon: "🕐", label: "Hours & Details",          desc: "Know when everything is open."            },
  { icon: "🧭", label: "Live Directions",          desc: "Get directions straight to any building." },
  { icon: "🎓", label: "Department Directory",     desc: "Every school and department, mapped."     },
];

const InfoPage: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

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
        ctx.fillStyle = `rgba(251,191,36,${d.alpha})`;
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
            background: linear-gradient(90deg, #fbbf24 0%, #fef08a 40%, #fbbf24 60%, #f59e0b 100%);
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
            border: 2px solid rgba(251,191,36,0.4);
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

            {/* App icon with pulse ring */}
            <div className="fade-up relative mb-6">
              <div
                className="pulse-ring relative w-24 h-24 rounded-[28px] flex items-center justify-center shadow-2xl"
                style={{
                  background: "linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #d97706 100%)",
                  boxShadow: "0 20px 60px rgba(251,191,36,0.4), 0 4px 16px rgba(0,0,0,0.5)",
                }}
              >
                <span style={{ fontSize: "44px" }}>🏛️</span>
              </div>
            </div>

            <h1 className="fade-up delay-1 shimmer-text text-4xl font-black tracking-tight mb-1">
              OU Campus
            </h1>

            <p className="fade-up delay-2 text-gray-500 text-sm tracking-widest uppercase font-semibold mb-1">
              Oakwood University
            </p>

            {/* Version badge */}
            <div className="fade-up delay-2 mt-2 inline-flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-white/10 rounded-full">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-[11px] text-gray-400 font-mono">v{APP_VERSION}</span>
            </div>

            <p className="fade-up delay-3 mt-5 text-gray-400 text-sm leading-relaxed max-w-xs">
              Your pocket guide to navigating Oakwood University campus —
              every building, department, and hour of operation, right at your fingertips.
            </p>
          </div>

          {/* Divider */}
          <div className="relative px-6 mb-8">
            <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          </div>

          {/* ── Features Grid ── */}
          <div className="relative px-5 mb-10 fade-up delay-3">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-600 mb-4 px-1">
              What's inside
            </p>
            <div className="grid grid-cols-2 gap-2.5">
              {features.map((f) => (
                <div
                  key={f.label}
                  className="feature-card rounded-2xl p-4 border border-white/6"
                  style={{
                    background: "linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))",
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
              Built by
            </p>

            {contributors.map((c) => (
              <div
                key={c.name}
                className="rounded-2xl p-5 border border-white/6 mb-3"
                style={{
                  background: "linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))",
                }}
              >
                <div className="flex items-center gap-4 mb-3">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                    style={{
                      background: "linear-gradient(135deg, rgba(251,191,36,0.15), rgba(251,191,36,0.05))",
                      border: "1px solid rgba(251,191,36,0.2)",
                    }}
                  >
                    {c.emoji}
                  </div>
                  <div>
                    <p className="font-black text-white text-base">{c.name}</p>
                    <p className="text-xs font-semibold" style={{ color: "#fbbf24" }}>
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
              style={{ background: "rgba(255,255,255,0.02)" }}
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0 bg-white/5">
                ✨
              </div>
              <div>
                <p className="text-sm font-bold text-white">Want to contribute?</p>
                <p className="text-xs text-gray-500">
                  Reach out to help grow this app for the Oakwood community.
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
              Our mission
            </p>
            <div
              className="rounded-2xl p-5 border border-white/6"
              style={{ background: "linear-gradient(135deg, rgba(251,191,36,0.06), rgba(0,0,0,0))" }}
            >
              <p className="text-base font-black mb-2" style={{ color: "#fbbf24" }}>
                "No student should feel lost on campus."
              </p>
              <p className="text-sm text-gray-400 leading-relaxed">
                OU Campus was created to make navigating Oakwood University effortless for
                every student — freshmen finding their first class, visitors exploring campus,
                and returning students discovering what's new. Built with love for the Oakwood community.
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
              Made with ❤️ for Oakwood University · Huntsville, AL
            </p>
            <p className="text-[10px] text-gray-800 mt-1">
              © {new Date().getFullYear()} OU Campus App. All rights reserved.
            </p>
          </div>

        </div>
      </IonContent>
    </IonPage>
  );
};

export default InfoPage;