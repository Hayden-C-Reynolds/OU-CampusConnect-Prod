// src/hooks/usePwaInstall.ts
import { useEffect, useState, useCallback } from "react";

type Platform = "ios" | "android" | "desktop" | "unknown";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const detectPlatform = (): Platform => {
  const ua = navigator.userAgent || "";
  if (/iPhone|iPad|iPod/i.test(ua)) return "ios";
  if (/Android/i.test(ua)) return "android";
  if (/Macintosh|Windows|Linux/i.test(ua)) return "desktop";
  return "unknown";
};

const isStandalone = (): boolean => {
  const displayModeStandalone = window.matchMedia?.("(display-mode: standalone)").matches;
  // iOS Safari's own non-standard flag
  const iosStandalone = (navigator as unknown as { standalone?: boolean }).standalone === true;
  return Boolean(displayModeStandalone || iosStandalone);
};

export const usePwaInstall = () => {
  const [installed, setInstalled] = useState(isStandalone());
  const [platform] = useState<Platform>(detectPlatform());
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    const onBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };
    const onInstalled = () => {
      setInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  // Android/desktop Chrome: trigger the real native install prompt.
  const promptInstall = useCallback(async (): Promise<"accepted" | "dismissed" | "unavailable"> => {
    if (!deferredPrompt) return "unavailable";
    await deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    return choice.outcome;
  }, [deferredPrompt]);

  // Can we show a real native "Install" button? (Android/desktop Chrome only)
  const canPromptNatively = Boolean(deferredPrompt);

  return { installed, platform, canPromptNatively, promptInstall };
};
