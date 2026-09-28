// src/components/navigation/navItems.ts
import {
  homeSharp,
  heartOutline,
  personOutline,
  informationCircleSharp,
  calendarOutline,
  schoolOutline,
} from "ionicons/icons";

export const navItems = [
  { to: "/home", labelKey: "tab.home" as const, icon: homeSharp, isGuest: null as boolean | null },
  { to: "/favorites", labelKey: "tab.favorites" as const, icon: heartOutline, isGuest: false as boolean | null },
  { to: "/events", labelKey: "tab.events" as const, icon: calendarOutline, isGuest: null as boolean | null },
  { to: "/departments", labelKey: "tab.departments" as const, icon: schoolOutline, isGuest: null as boolean | null },
  { to: "/profile", labelKey: "tab.profile" as const, icon: personOutline, isGuest: null as boolean | null },
  { to: "/info", labelKey: "tab.info" as const, icon: informationCircleSharp, isGuest: true as boolean | null },
];
