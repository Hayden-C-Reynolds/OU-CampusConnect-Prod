"use client";

import React from "react";
import { useDarkMode } from "../darkmode(soon)/DarkModeProvider";
import { Moon, Sun } from "lucide-react";

const DarkModeToggleButton: React.FC = () => {
  const { darkMode, toggleDarkMode } = useDarkMode();

  return (
    <button
      onClick={toggleDarkMode}
      className="fixed bottom-6 right-6 flex items-center justify-center w-14 h-14 rounded-full shadow-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 transition-all hover:scale-110"
    >
      {darkMode ? (
        <Sun className="text-yellow-400 w-6 h-6" />
      ) : (
        <Moon className="text-gray-700 dark:text-gray-300 w-6 h-6" />
      )}
    </button>
  );
};

export default DarkModeToggleButton;
