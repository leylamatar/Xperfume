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
  const savedLanguage = localStorage.getItem("language") || "en";
  
  // First, try to load from localStorage cache
  const cachedEn = localStorage.getItem("translations_en");
  const cachedAr = localStorage.getItem("translations_ar");
  
  let enTranslations: any;
  let arTranslations: any;
  
  if (cachedEn && cachedAr) {
    enTranslations = JSON.parse(cachedEn);
    arTranslations = JSON.parse(cachedAr);
  } else {
    // Fallback to static files if no cache
    const en = (await import("../locales/en/common.json")).default;
    const ar = (await import("../locales/ar/common.json")).default;
    enTranslations = en;
    arTranslations = ar;
  }
  
  // Initialize i18n immediately with cached or fallback data
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
  
  // Then, fetch fresh data from Supabase in background
  try {
    const { data: enData } = await supabase
      .from("translations")
      .select("key, value")
      .eq("lang", "en");
    const { data: arData } = await supabase
      .from("translations")
      .select("key, value")
      .eq("lang", "ar");

    const freshEn = unflattenTranslations(enData || []);
    const freshAr = unflattenTranslations(arData || []);
    
    // Cache the fresh data
    localStorage.setItem("translations_en", JSON.stringify(freshEn));
    localStorage.setItem("translations_ar", JSON.stringify(freshAr));
    
    // Update i18n with fresh data
    i18n.addResourceBundle("en", "common", freshEn, true, true);
    i18n.addResourceBundle("ar", "common", freshAr, true, true);
  } catch (error) {
    console.error("Failed to load fresh translations from Supabase:", error);
  }
}

export default i18n;
