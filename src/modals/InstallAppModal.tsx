// src/modals/InstallAppModal.tsx
import React, { useState } from "react";
import { IonModal, IonButton, IonIcon } from "@ionic/react";
import {
  shareOutline,
  addCircleOutline,
  ellipsisVertical,
  downloadOutline,
  checkmarkCircle,
  closeOutline,
} from "ionicons/icons";
import { usePwaInstall } from "../hooks/usePwaInstall";
import { useLanguage } from "../contexts/LanguageContext";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const getIosSteps = (t: (k: any) => string) => [
  {
    icon: shareOutline,
    title: t("install.ios1Title"),
    description: t("install.ios1Desc"),
  },
  {
    icon: addCircleOutline,
    title: t("install.ios2Title"),
    description: t("install.ios2Desc"),
  },
  {
    icon: checkmarkCircle,
    title: t("install.ios3Title"),
    description: t("install.ios3Desc"),
  },
];

const getAndroidSteps = (t: (k: any) => string) => [
  {
    icon: ellipsisVertical,
    title: t("install.android1Title"),
    description: t("install.android1Desc"),
  },
  {
    icon: downloadOutline,
    title: t("install.android2Title"),
    description: t("install.android2Desc"),
  },
];

const InstallAppModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { t } = useLanguage();
  const IOS_STEPS = getIosSteps(t);
  const ANDROID_MANUAL_STEPS = getAndroidSteps(t);
  const { platform, canPromptNatively, promptInstall } = usePwaInstall();
  const [installing, setInstalling] = useState(false);
  const [result, setResult] = useState<"accepted" | "dismissed" | null>(null);

  const handleNativeInstall = async () => {
    setInstalling(true);
    const outcome = await promptInstall();
    setInstalling(false);
    if (outcome === "accepted" || outcome === "dismissed") {
      setResult(outcome);
      if (outcome === "accepted") {
        setTimeout(onClose, 1200);
      }
    }
  };

  const steps = platform === "ios" ? IOS_STEPS : ANDROID_MANUAL_STEPS;

  return (
    <IonModal isOpen={isOpen} onDidDismiss={onClose} initialBreakpoint={0.75} breakpoints={[0, 0.75, 1]}>
      <div className="min-h-full bg-gray-950 text-white flex flex-col px-6 pt-8 pb-10">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/60"
        >
          <IonIcon icon={closeOutline} />
        </button>

        <div className="flex flex-col items-center text-center mb-6">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-3 shadow-lg"
            style={{ background: "linear-gradient(135deg, #e8b341, #c9922b)" }}
          >
            📲
          </div>
          <h2 className="text-xl font-bold">{t("install.title")}</h2>
          <p className="text-sm text-gray-400 mt-1 max-w-xs">
            {t("install.subtitle")}
          </p>
        </div>

        {/* ── Native install path (Android / desktop Chrome) ── */}
        {canPromptNatively ? (
          <div className="flex flex-col gap-4">
            <IonButton expand="block" color="warning" onClick={handleNativeInstall} disabled={installing}>
              {installing ? t("install.installing") : t("install.installApp")}
            </IonButton>
            {result === "dismissed" && (
              <p className="text-xs text-gray-500 text-center">
                {t("install.dismissedNote")}
              </p>
            )}
            {result === "accepted" && (
              <p className="text-xs text-emerald-400 text-center">{t("install.accepted")}</p>
            )}
          </div>
        ) : (
          /* ── Manual step-by-step guide (iOS Safari, or browsers without native prompt support) ── */
          <div className="flex flex-col gap-3">
            {steps.map((step, i) => (
              <div key={i} className="flex items-start gap-3 bg-white/5 border border-white/10 rounded-2xl p-4">
                <div className="w-9 h-9 rounded-full bg-amber-400/15 border border-amber-400/30 flex items-center justify-center flex-shrink-0 text-amber-300 font-bold text-sm">
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <IonIcon icon={step.icon} className="text-amber-300 text-base" />
                    <span className="text-sm font-semibold text-white">{step.title}</span>
                  </div>
                  <p className="text-xs text-gray-400 leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
            <IonButton expand="block" fill="outline" color="medium" onClick={onClose} className="mt-2">
              {t("install.gotIt")}
            </IonButton>
          </div>
        )}
      </div>
    </IonModal>
  );
};

export default InstallAppModal;
