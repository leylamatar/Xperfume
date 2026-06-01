import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import i18n from "../lib/i18n";

interface LanguageContextType {
  language: string;
  isRTL: boolean;
  changeLanguage: (lang: string) => void;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState(i18n.language);
  const [isRTL, setIsRTL] = useState(i18n.language === "ar");

  useEffect(() => {
    updateHTMLAttributes(language);
  }, [language]);

  function updateHTMLAttributes(lang: string) {
    const html = document.documentElement;
    const isRtl = lang === "ar";
    html.lang = lang;
    html.dir = isRtl ? "rtl" : "ltr";
    document.body.dir = isRtl ? "rtl" : "ltr";
    setIsRTL(isRtl);
  }

  function changeLanguage(lang: string) {
    i18n.changeLanguage(lang);
    setLanguage(lang);
    localStorage.setItem("language", lang);
  }

  return (
    <LanguageContext.Provider value={{ language, isRTL, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
