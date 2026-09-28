// src/hooks/useFirstTimeTour.ts
import { useEffect } from "react";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import { Language, translations } from "../i18n/translations";

const TOUR_SEEN_KEY = "cc_home_tour_seen_v1";

/** Programmatically types into a React-controlled input so its onChange
 *  fires correctly (setting .value directly does NOT trigger React). */
const simulateTyping = (input: HTMLInputElement, text: string) => {
  const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value")?.set;
  setter?.call(input, text);
  input.dispatchEvent(new Event("input", { bubbles: true }));
};

/**
 * Runs a one-time, spotlight-style guided tour of the Home screen that
 * actually DEMONSTRATES the app rather than just describing it: it types
 * a real search query, waits for results, clicks one, shows the location
 * details that open, then moves on to the map and tab bar — ending with
 * a tip about changing the app's language from Profile.
 *
 * Safe to call on every Home mount — no-op after the first run unless
 * `force` is passed (used by "Replay tour" in Info/Profile).
 */
export const useFirstTimeTour = (
  ready: boolean,
  onComplete?: () => void,
  force = false,
  language: Language = "en"
) => {
  useEffect(() => {
    if (!ready) return;
    const alreadySeen = localStorage.getItem(TOUR_SEEN_KEY) === "true";
    if (alreadySeen && !force) return;

    const tt = translations[language];

    // Give the DOM a beat to finish painting (map tiles, tab bar, etc.)
    const timer = setTimeout(() => {
      const tourDriver = driver({
        showProgress: true,
        animate: true,
        overlayColor: "black",
        overlayOpacity: 0.7,
        stagePadding: 6,
        stageRadius: 16,
        popoverClass: "cc-tour-popover",
        nextBtnText: tt["tour.next"],
        prevBtnText: tt["tour.back"],
        doneBtnText: tt["tour.done"],
        steps: [
          {
            element: "#cc-tour-search",
            popover: {
              title: tt["tour.searchTitle"],
              description: tt["tour.searchDesc"],
              side: "bottom",
              align: "start",
              onNextClick: () => {
                // Actually type a real query so the person sees live results,
                // not just a description of the feature.
                const input = document.getElementById("cc-tour-search-input") as HTMLInputElement | null;
                if (input) {
                  input.focus();
                  input.dispatchEvent(new Event("focus", { bubbles: true }));
                  simulateTyping(input, "Library");
                }
                setTimeout(() => tourDriver.moveNext(), 450);
              },
            },
          },
          {
            element: '[data-tour-index="0"]',
            popover: {
              title: tt["tour.resultTitle"],
              description: tt["tour.resultDesc"],
              side: "bottom",
              align: "start",
              onNextClick: () => {
                // Click it for them, so the whole flow — search to detail —
                // plays out live in front of them.
                const result = document.querySelector('[data-tour-index="0"]') as HTMLElement | null;
                result?.click();
                setTimeout(() => tourDriver.moveNext(), 500);
              },
            },
          },
          {
            element: "#cc-tour-modal",
            popover: {
              title: tt["tour.modalTitle"],
              description: tt["tour.modalDesc"],
              side: "top",
              align: "center",
              onNextClick: () => {
                // Close the modal before moving on to the map/tab bar steps.
                const closeBtn = document.querySelector(
                  "#cc-tour-modal button[aria-label='Close']"
                ) as HTMLElement | null;
                closeBtn?.click();
                setTimeout(() => tourDriver.moveNext(), 350);
              },
            },
          },
          {
            element: "#cc-tour-map",
            popover: {
              title: tt["tour.mapTitle"],
              description: tt["tour.mapDesc"],
              side: "top",
              align: "center",
            },
          },
          {
            element: "#cc-tour-tabbar",
            popover: {
              title: tt["tour.tabbarTitle"],
              description: tt["tour.tabbarDesc"],
              side: "top",
              align: "center",
            },
          },
          {
            // No element target — a plain centered tip, since the language
            // switcher lives on the Profile page, not Home.
            popover: {
              title: tt["tour.languageTitle"],
              description: tt["tour.languageDesc"],
            },
          },
        ],
        onDestroyed: () => {
          localStorage.setItem(TOUR_SEEN_KEY, "true");
          onComplete?.();
        },
      });

      tourDriver.drive();
    }, 700);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, force, language]);
};

/** Lets other screens (e.g. Info page) offer a "Replay tour" action. */
export const resetFirstTimeTour = () => {
  localStorage.removeItem(TOUR_SEEN_KEY);
};
