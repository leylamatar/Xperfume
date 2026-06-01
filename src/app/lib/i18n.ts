import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { supabase } from "./supabase";

// Helper to un-flatten dot-separated keys
function unflattenTranslations(flat: { key: string; value: string }[]): any {
  const result: any = {};
  flat.forEach(({ key, value }) => {
    const keys = key.split(".");
    let current = result;
    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) {
        // Check if next key is number to decide array vs object
        current[keys[i]] = isNaN(Number(keys[i + 1])) ? {} : [];
      }
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
  });
  return result;
}

export async function initI18n() {
  try {
    const { data: enData } = await supabase
      .from("translations")
      .select("key, value")
      .eq("lang", "en");
    const { data: arData } = await supabase
      .from("translations")
      .select("key, value")
      .eq("lang", "ar");

    const enTranslations = unflattenTranslations(enData || []);
    const arTranslations = unflattenTranslations(arData || []);

    const savedLanguage = localStorage.getItem("language") || "en";

    i18n.use(initReactI18next).init({
      resources: {
        en: { common: enTranslations },
        ar: { common: arTranslations },
      },
      lng: savedLanguage,
      fallbackLng: "en",
      interpolation: {
        escapeValue: false,
      },
      defaultNS: "common",
    });
  } catch (error) {
    console.error(
      "Failed to load translations from Supabase, using defaults:",
      error,
    );
    // Fallback to static files if fetch fails
    const en = (await import("../locales/en/common.json")).default;
    const ar = (await import("../locales/ar/common.json")).default;
    const savedLanguage = localStorage.getItem("language") || "en";

    i18n.use(initReactI18next).init({
      resources: {
        en: { common: en },
        ar: { common: ar },
      },
      lng: savedLanguage,
      fallbackLng: "en",
      interpolation: {
        escapeValue: false,
      },
      defaultNS: "common",
    });
  }
}

export default i18n;
