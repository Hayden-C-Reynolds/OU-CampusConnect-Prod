import { IonButton } from "@ionic/react";
import React, { useEffect, useState } from "react";

const BetaAlert: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 200);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md">
      <div
        className="
          bg-zinc-900
          text-zinc-100
          w-[90%] max-w-md
          rounded-2xl
          shadow-2xl
          border border-zinc-800
          p-6
          transform transition-all duration-500
          animate-fadeIn
        "
      >
        <div className="text-center flex flex-col items-center justify-center gap-4">
          {/* Icon */}
          <div className="text-5xl text-zinc-300">🧪</div>

          {/* Title */}
          <h2 className="text-xl font-semibold tracking-wide">
            Beta Version
          </h2>

          {/* Message */}
          <p className="text-sm text-zinc-400 leading-relaxed">
            This application is currently in beta. Some features may be incomplete,
            unstable, or unavailable. Thank you for trying the app!
          </p>

          {/* Centered Button */}
          <IonButton
            className="w-3/4 h-[50px] !flex !justify-center !items-center mt-4"
            fill="solid"
            style={{
              "--background": "#374151",
              "--border-radius": "9999px",
              fontWeight: "bold",
              "--color": "white",
            }}
            onClick={() => setVisible(false)}
          >
            Continue
          </IonButton>
        </div>
      </div>
    </div>
  );
};

export default BetaAlert;
