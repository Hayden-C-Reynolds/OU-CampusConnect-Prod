// src/i18n/categories.ts
import { Language } from "./translations";

/** Location + event category names, translated. Falls back to the
 *  original English string if a category isn't in the map (keeps new
 *  categories from silently disappearing if a translation is missed). */
export const categoryTranslations: Record<Language, Record<string, string>> = {
  en: {},
  es: {
    Library: "Biblioteca",
    "Admin / Dining": "Administración / Comedor",
    Church: "Iglesia",
    Dormitory: "Dormitorio",
    Academic: "Académico",
    "Science / Academic": "Ciencias / Académico",
    "Computer Science": "Informática",
    Recreation: "Recreación",
    Sports: "Deportes",
    Store: "Tienda",
    Facility: "Instalación",
    Ministry: "Ministerio",
    Housing: "Vivienda",
    School: "Escuela",
    Department: "Departamento",
    Security: "Seguridad",
    Landmark: "Punto de Referencia",
    Admin: "Administración",
    Social: "Social",
    Workshop: "Taller",
    Meeting: "Reunión",
    Music: "Música",
    Spiritual: "Espiritual",
    Ceremony: "Ceremonia",
    Dining: "Comedor",
  },
  fr: {
    Library: "Bibliothèque",
    "Admin / Dining": "Administration / Restauration",
    Church: "Église",
    Dormitory: "Résidence",
    Academic: "Académique",
    "Science / Academic": "Sciences / Académique",
    "Computer Science": "Informatique",
    Recreation: "Loisirs",
    Sports: "Sports",
    Store: "Boutique",
    Facility: "Installation",
    Ministry: "Ministère",
    Housing: "Logement",
    School: "École",
    Department: "Département",
    Security: "Sécurité",
    Landmark: "Point de Repère",
    Admin: "Administration",
    Social: "Social",
    Workshop: "Atelier",
    Meeting: "Réunion",
    Music: "Musique",
    Spiritual: "Spirituel",
    Ceremony: "Cérémonie",
    Dining: "Restauration",
  },
};

export const translateCategory = (category: string | undefined, language: Language): string => {
  if (!category) return category ?? "";
  return categoryTranslations[language]?.[category] ?? category;
};
