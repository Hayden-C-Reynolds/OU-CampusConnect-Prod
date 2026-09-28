// src/contexts/LanguageContext.tsx
import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { translations, Language, TranslationKey } from "../i18n/translations";

const LANGUAGE_STORAGE_KEY = "cc_language_v1";

interface LanguageContextProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey, vars?: Record<string, string | number>) => string;
}

export const LanguageContext = createContext<LanguageContextProps>({
  language: "en",
  setLanguage: () => {},
  t: (key) => key,
});

const detectInitialLanguage = (): Language => {
  try {
    const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (stored === "en" || stored === "es" || stored === "fr") return stored;
  } catch {
    /* ignore */
  }
  // Fall back to the browser's language if it's Spanish or French, otherwise English.
  const nav = typeof navigator !== "undefined" ? navigator.language : "en";
  const lower = nav?.toLowerCase() ?? "en";
  if (lower.startsWith("es")) return "es";
  if (lower.startsWith("fr")) return "fr";
  return "en";
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(detectInitialLanguage);

  useEffect(() => {
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    } catch {
      /* ignore */
    }
    if (typeof document !== "undefined") {
      document.documentElement.lang = language;
    }
  }, [language]);

  const setLanguage = useCallback((lang: Language) => setLanguageState(lang), []);

  const t = useCallback(
    (key: TranslationKey, vars?: Record<string, string | number>) => {
      let str = translations[language][key] ?? translations.en[key] ?? key;
      if (vars) {
        Object.entries(vars).forEach(([k, v]) => {
          str = str.replace(`{${k}}`, String(v));
        });
      }
      return str;
    },
    [language]
  );

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
