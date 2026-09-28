// src/modals/ReportIssueModal.tsx
import React, { useState } from "react";
import { IonModal, IonContent, IonButton, IonToast, IonTextarea } from "@ionic/react";
import { getDatabase, ref as dbRef, push, set, serverTimestamp } from "firebase/database";
import { app } from "../firebase/config";
import { CampusLocation } from "../types/data";
import { useLanguage } from "../contexts/LanguageContext";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  location: CampusLocation | null;
}

const getIssueTypes = (t: (k: any) => string) => [
  { id: "hours", label: t("report.type.hours") },
  { id: "info", label: t("report.type.info") },
  { id: "location", label: t("report.type.location") },
  { id: "bug", label: t("report.type.bug") },
  { id: "other", label: t("report.type.other") },
];

const ReportIssueModal: React.FC<Props> = ({ isOpen, onClose, location }) => {
  const { t } = useLanguage();
  const ISSUE_TYPES = getIssueTypes(t);
  const [issueType, setIssueType] = useState<string>("info");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{ show: boolean; message?: string }>({ show: false });

  const resetAndClose = () => {
    setIssueType("info");
    setDescription("");
    onClose();
  };

  const handleSubmit = async () => {
    if (!location) return;
    if (!description.trim()) {
      setToast({ show: true, message: t("report.errorEmpty") });
      return;
    }

    setSubmitting(true);
    try {
      const db = getDatabase(app);
      const reportsRef = dbRef(db, "reports");
      const newReportRef = push(reportsRef);
      await set(newReportRef, {
        locationId: location.id,
        locationName: location.name,
        issueType,
        description: description.trim(),
        createdAt: serverTimestamp(),
      });

      setToast({ show: true, message: t("report.success") });
      setSubmitting(false);
      setTimeout(resetAndClose, 900);
    } catch (error) {
      console.error("Error submitting report:", error);
      setSubmitting(false);
      setToast({ show: true, message: t("report.errorGeneric") });
    }
  };

  return (
    <IonModal isOpen={isOpen} onDidDismiss={resetAndClose}>
      <IonContent>
        <div className="min-h-full bg-gray-950 text-white flex flex-col px-5 pt-8 pb-8">
          <div className="flex items-center gap-3 mb-1">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
              style={{ background: "linear-gradient(135deg, #f0c669, #c9922b)" }}
            >
              🚩
            </div>
            <h2 className="text-lg font-bold">{t("report.title")}</h2>
          </div>
          <p className="text-sm text-gray-400 mb-5 ml-[52px]">
            {location ? `${t("report.about")} "${location.name}"` : ""}
          </p>

          <p className="text-[11px] text-gray-400 uppercase tracking-widest font-semibold mb-2">
            {t("report.whatsWrong")}
          </p>
          <div className="flex flex-wrap gap-2 mb-5">
            {ISSUE_TYPES.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setIssueType(opt.id)}
                className="px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors"
                style={
                  issueType === opt.id
                    ? { backgroundColor: "rgba(232,179,65,0.2)", borderColor: "#e8b341", color: "#f0c669" }
                    : { backgroundColor: "var(--cc-surface-soft)", borderColor: "var(--cc-border)", color: "#9ca3af" }
                }
              >
                {opt.label}
              </button>
            ))}
          </div>

          <p className="text-[11px] text-gray-400 uppercase tracking-widest font-semibold mb-2">
            {t("report.description")}
          </p>
          <IonTextarea
            value={description}
            onIonInput={(e) => setDescription(e.detail.value ?? "")}
            placeholder={t("report.placeholder")}
            autoGrow
            className="rounded-xl px-3 py-2 text-sm mb-6"
            style={{ backgroundColor: "var(--cc-surface-soft)", border: "1px solid var(--cc-border)" }}
          />

          <div className="mt-auto flex flex-col gap-2">
            <IonButton expand="block" color="warning" onClick={handleSubmit} disabled={submitting}>
              {submitting ? t("report.submitting") : t("report.submit")}
            </IonButton>
            <IonButton expand="block" fill="clear" className="text-gray-400" onClick={resetAndClose}>
              {t("report.cancel")}
            </IonButton>
          </div>
        </div>
      </IonContent>

      <IonToast
        isOpen={toast.show}
        message={toast.message}
        duration={2000}
        onDidDismiss={() => setToast({ show: false })}
      />
    </IonModal>
  );
};

export default ReportIssueModal;
