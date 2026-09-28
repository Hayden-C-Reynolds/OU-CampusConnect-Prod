// src/components/brand/LanguageSwitcher.tsx
import React from "react";
import { useLanguage } from "../../contexts/LanguageContext";
import { Language } from "../../i18n/translations";

interface Props {
  /** Adds an id hook so the guided tour can spotlight this control. */
  id?: string;
}

const OPTIONS: { code: Language; label: string; flag: string }[] = [
  { code: "en", label: "English", flag: "🇺🇸" },
  { code: "es", label: "Español", flag: "🇪🇸" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
];

const LanguageSwitcher: React.FC<Props> = ({ id }) => {
  const { language, setLanguage } = useLanguage();

  return (
    <div id={id} className="flex gap-2">
      {OPTIONS.map((opt) => {
        const selected = language === opt.code;
        return (
          <button
            key={opt.code}
            onClick={() => setLanguage(opt.code)}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition-colors"
            style={
              selected
                ? { backgroundColor: "#e8b341", color: "#0a0e1a" }
                : {
                    backgroundColor: "var(--cc-surface-soft)",
                    border: "1px solid var(--cc-border)",
                    color: "var(--cc-text-secondary)",
                  }
            }
          >
            <span>{opt.flag}</span>
            {opt.label}
          </button>
        );
      })}
    </div>
  );
};

export default LanguageSwitcher;
