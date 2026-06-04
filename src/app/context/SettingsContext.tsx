import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "../lib/supabase";

interface SettingsContextType {
  settings: Record<string, string>;
  loading: boolean;
  refreshSettings: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  async function refreshSettings() {
    try {
      // First, load from cache immediately
      const cachedSettings = localStorage.getItem("site_settings");
      if (cachedSettings) {
        setSettings(JSON.parse(cachedSettings));
        setLoading(false);
      }

      // Then, fetch fresh data in background
      const { data } = await supabase.from("site_settings").select("*");
      const settingsMap: Record<string, string> = {};
      data?.forEach((setting) => {
        settingsMap[setting.key] = setting.value || setting.value_en || "";
      });
      
      // Save to cache and update state
      localStorage.setItem("site_settings", JSON.stringify(settingsMap));
      setSettings(settingsMap);
    } catch (error) {
      console.error("Error loading settings:", error);
      // Fallback to cache if fetch fails
      const cachedSettings = localStorage.getItem("site_settings");
      if (cachedSettings) {
        setSettings(JSON.parse(cachedSettings));
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refreshSettings();
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, loading, refreshSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used within SettingsProvider");
  return ctx;
}
