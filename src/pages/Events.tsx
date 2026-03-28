// src/pages/Events.tsx
import React from "react";
import { IonPage, IonContent } from "@ionic/react";
import TabBar from "../components/navigation/TabBar"; // ← add this import

const EventsPage: React.FC = () => {
  return (
    <IonPage className="bg-gray-950">
      <IonContent fullscreen className="bg-gray-950">
        <style>{`
          @keyframes fadeUp {
            from { opacity: 0; transform: translateY(16px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          .fade-up { animation: fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) both; }

          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50%       { transform: translateY(-8px); }
          }
          .float { animation: float 3s ease-in-out infinite; }
        `}</style>

        <div className="relative min-h-full bg-gray-950 flex flex-col items-center justify-center px-6 pb-32">

          {/* Floating icon */}
          <div className="fade-up float mb-8">
            <div
              className="w-28 h-28 rounded-[32px] flex items-center justify-center shadow-2xl"
              style={{
                background: "linear-gradient(135deg, rgba(251,191,36,0.15) 0%, rgba(251,191,36,0.05) 100%)",
                border: "1px solid rgba(251,191,36,0.2)",
                boxShadow: "0 20px 60px rgba(251,191,36,0.1), 0 4px 16px rgba(0,0,0,0.5)",
              }}
            >
              <span style={{ fontSize: "52px" }}>📅</span>
            </div>
          </div>

          {/* Text */}
          <div className="fade-up text-center" style={{ animationDelay: "0.1s" }}>
            <h1 className="text-2xl font-black text-white mb-2 tracking-tight">
              No Events Yet
            </h1>
            <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
              Campus events will appear here once they're added.
              Check back soon!
            </p>
          </div>

          {/* Coming soon badge */}
          <div
            className="fade-up mt-8 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10"
            style={{
              animationDelay: "0.2s",
              background: "rgba(255,255,255,0.03)",
            }}
          >
            <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-[11px] font-bold uppercase tracking-widest text-gray-500">
              Coming Soon
            </span>
          </div>

        </div>
      </IonContent>

      <TabBar />
    </IonPage>
  );
};

export default EventsPage;