import { useLanguage } from "../context/LanguageContext";
import { useSettings } from "../context/SettingsContext";

export function useTranslatedProduct(product: any) {
  const { language } = useLanguage();
  return {
    name: language === "ar" ? product.name_ar || product.name : product.name,
    description:
      language === "ar"
        ? product.description_ar || product.description
        : product.description,
    short_description:
      language === "ar"
        ? product.short_description_ar || product.short_description
        : product.short_description,
  };
}

export function useTranslatedCategory(category: any) {
  const { language } = useLanguage();
  return {
    name: language === "ar" ? category.name_ar || category.name : category.name,
    description:
      language === "ar"
        ? category.description_ar || category.description
        : category.description,
  };
}

export function useTranslatedSetting(
  keyBase: string,
  defaultValue: string = "",
) {
  const { language } = useLanguage();
  const { settings } = useSettings();
  const keyEn = keyBase;
  const keyAr = `${keyBase}_ar`;
  if (language === "ar") {
    return settings[keyAr] || settings[keyEn] || defaultValue;
  }
  return settings[keyEn] || defaultValue;
}
