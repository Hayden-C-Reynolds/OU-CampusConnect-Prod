// MapView/components/TourOverlay.tsx
import React from "react";
import { IonButton } from "@ionic/react";

interface Props {
  step: number;
  total: number;
  message: string;
  onNext: () => void;
}

const TourOverlay: React.FC<Props> = ({ step, total, message, onNext }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
    <div className="absolute inset-0 bg-black/60 pointer-events-auto flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full text-center pointer-events-auto">

        <div className="mb-3 inline-flex items-center gap-2 bg-orange-50 text-orange-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">
          Welcome Tour
        </div>

        <h2 className="text-xl font-bold text-gray-900 mb-2">
          Step {step} of {total}
        </h2>
        <p className="text-sm text-gray-600 mb-5 leading-relaxed">{message}</p>

        <IonButton expand="block" color="primary" onClick={onNext}>
          {step === total ? "Got it! 🎉" : "Next →"}
        </IonButton>

        {/* Step dots */}
        <div className="flex justify-center gap-1 mt-4">
          {Array.from({ length: total }).map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-colors ${
                i + 1 === step ? "bg-orange-500" : "bg-gray-200"
              }`}
            />
          ))}
        </div>

      </div>
    </div>
  </div>
);

export default TourOverlay;