// src/contexts/ThemeContext.tsx
import React, { createContext, useContext, useEffect, useState, useCallback } from "react";

export type Theme = "dark" | "light";

interface ThemeContextProps {
  theme: Theme;
  setTheme: (t: Theme) => void;
  toggleTheme: () => void;
}

const THEME_STORAGE_KEY = "cc_theme_v1";

export const ThemeContext = createContext<ThemeContextProps>({
  theme: "dark",
  setTheme: () => {},
  toggleTheme: () => {},
});

const detectInitialTheme = (): Theme => {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === "light" || stored === "dark") return stored;
  } catch {
    /* ignore */
  }
  // Default to dark regardless of system preference — this is the app's
  // primary, most-tested experience. The person can switch anytime.
  return "dark";
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(detectInitialTheme);

  useEffect(() => {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      /* ignore */
    }
    const root = document.documentElement;
    if (theme === "light") {
      root.classList.add("cc-light");
      root.classList.remove("ion-palette-dark");
    } else {
      root.classList.remove("cc-light");
      root.classList.add("ion-palette-dark");
    }
  }, [theme]);

  const setTheme = useCallback((t: Theme) => setThemeState(t), []);
  const toggleTheme = useCallback(
    () => setThemeState((t) => (t === "dark" ? "light" : "dark")),
    []
  );

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
