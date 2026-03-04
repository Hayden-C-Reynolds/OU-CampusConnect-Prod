import React from "react";
import { DarkModeProvider } from "../components/darkmode(soon)/DarkModeProvider";
import DarkModeToggleButton from "../components/darkmode(soon)/DarkModeToggleButton";
import "../globals.css"; // Tailwind CSS

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors">
        <DarkModeProvider>
          {children}
          <DarkModeToggleButton />
        </DarkModeProvider>
      </body>
    </html>
  );
}
