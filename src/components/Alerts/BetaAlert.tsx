import { IonButton } from "@ionic/react";
import React, { useEffect, useState } from "react";
import { useLanguage } from "../../contexts/LanguageContext";

const BetaAlert: React.FC = () => {
  const { t } = useLanguage();
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
          w-[90%] max-w-md
          rounded-2xl
          shadow-2xl
          p-6
          transform transition-all duration-500
          animate-fadeIn
        "
        style={{
          backgroundColor: "var(--cc-surface)",
          color: "var(--cc-text)",
          border: "1px solid var(--cc-border)",
        }}
      >
        <div className="text-center flex flex-col items-center justify-center gap-4">
          {/* Icon */}
          <div className="text-5xl" style={{ color: "var(--cc-text-secondary)" }}>🧪</div>

          {/* Title */}
          <h2 className="text-xl font-semibold tracking-wide">
            {t("beta.title")}
          </h2>

          {/* Message */}
          <p className="text-sm leading-relaxed" style={{ color: "var(--cc-text-secondary)" }}>
            {t("beta.message")}
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
            {t("beta.continue")}
          </IonButton>
        </div>
      </div>
    </div>
  );
};

export default BetaAlert;
