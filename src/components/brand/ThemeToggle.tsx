// src/components/brand/ThemeToggle.tsx
import React from "react";
import { useTheme } from "../../contexts/ThemeContext";

interface Props {
  id?: string;
}

const ThemeToggle: React.FC<Props> = ({ id }) => {
  const { theme, setTheme } = useTheme();

  const options: { code: "dark" | "light"; label: string; icon: string }[] = [
    { code: "dark", label: "Dark", icon: "🌙" },
    { code: "light", label: "Light", icon: "☀️" },
  ];

  return (
    <div id={id} className="flex gap-2">
      {options.map((opt) => {
        const selected = theme === opt.code;
        return (
          <button
            key={opt.code}
            onClick={() => setTheme(opt.code)}
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
            <span>{opt.icon}</span>
            {opt.label}
          </button>
        );
      })}
    </div>
  );
};

export default ThemeToggle;
