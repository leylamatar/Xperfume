import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { motion } from "motion/react";
import { Save, Upload, Image as ImageIcon } from "lucide-react";

const SETTING_KEYS = [
  { key: "logo_url", label: "Site Logo", type: "image" },
  { key: "whatsapp_number", label: "WhatsApp Number", type: "text" },
  { key: "iban", label: "IBAN", type: "text" },
  { key: "account_holder", label: "Account Holder", type: "text" },
  { key: "bank_name", label: "Bank Name", type: "text" },
  { key: "contact_email", label: "Contact Email", type: "email" },
  { key: "contact_phone", label: "Contact Phone", type: "text" },
  { key: "hero_subtitle", label: "Hero Subtitle (English)", type: "text" },
  { key: "hero_subtitle_ar", label: "Hero Subtitle (Arabic)", type: "text" },
  { key: "hero_title", label: "Hero Title (English)", type: "text" },
  { key: "hero_title_ar", label: "Hero Title (Arabic)", type: "text" },
  { key: "hero_description", label: "Hero Description (English)", type: "textarea" },
  { key: "hero_description_ar", label: "Hero Description (Arabic)", type: "textarea" },
  { key: "hero_button_text", label: "Hero Button Text (English)", type: "text" },
  { key: "hero_button_text_ar", label: "Hero Button Text (Arabic)", type: "text" },
  { key: "featured_title", label: "Featured Section Title (English)", type: "text" },
  { key: "featured_title_ar", label: "Featured Section Title (Arabic)", type: "text" },
  { key: "best_sellers_title", label: "Best Sellers Title (English)", type: "text" },
  { key: "best_sellers_title_ar", label: "Best Sellers Title (Arabic)", type: "text" },
  { key: "footer_description", label: "Footer Description (English)", type: "textarea" },
  { key: "footer_description_ar", label: "Footer Description (Arabic)", type: "textarea" },
];

export function AdminSettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    try {
      const { data } = await supabase.from("site_settings").select("*");
      const settingsMap: Record<string, string> = {};
      data?.forEach(setting => {
        settingsMap[setting.key] = setting.value || setting.value_en || "";
      });
      setSettings(settingsMap);
      if (settingsMap.logo_url) {
        setLogoPreview(settingsMap.logo_url);
      }
    } catch (error) {
      console.error("Error loading settings:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleLogoUpload(file: File) {
    setUploading(true);
    try {
      const fileExt = file.name.split(".").pop()?.toLowerCase();
      const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/svg+xml"];

      if (!allowedTypes.includes(file.type)) {
        throw new Error("Only JPG, PNG, WEBP, and SVG images are allowed.");
      }

      if (file.size > 5 * 1024 * 1024) {
        throw new Error("Image size must be under 5MB.");
      }

      const fileName = `logo-${Date.now()}-${crypto.randomUUID()}.${fileExt}`;
      const filePath = `logos/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
          contentType: file.type,
        });

      if (uploadError) {
        console.error("Logo upload error:", uploadError);
        throw uploadError;
      }

      const { data: publicUrlData } = supabase.storage
        .from("product-images")
        .getPublicUrl(filePath);

      return publicUrlData.publicUrl;
    } catch (error: any) {
      console.error("Error uploading logo:", error);
      throw error;
    } finally {
      setUploading(false);
    }
  }

  function handleLogoFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  }

  async function handleSave() {
    setSaving(true);
    try {
      let updatedSettings = { ...settings };

      if (logoFile) {
        const uploadedUrl = await handleLogoUpload(logoFile);
        updatedSettings.logo_url = uploadedUrl;
        setSettings(prev => ({ ...prev, logo_url: uploadedUrl }));
      }

      for (const [key, value] of Object.entries(updatedSettings)) {
        const upsertData: any = { 
          key, 
          value, 
          updated_at: new Date().toISOString() 
        };
        
        // If key ends with _ar, set value_ar, else set value_en
        if (key.endsWith("_ar")) {
          upsertData.value_ar = value;
        } else {
          upsertData.value_en = value;
        }
        
        const { error } = await supabase
          .from("site_settings")
          .upsert(upsertData, { onConflict: "key" });
          
        if (error) {
          console.error("Settings save error:", {
            message: error.message,
            details: error.details,
            hint: error.hint,
            code: error.code,
          });
          throw error;
        }
      }
      setLogoFile(null);
      alert("Settings saved successfully!");
    } catch (error: any) {
      console.error("Error saving settings:", error);
      alert("Error saving settings: " + (error.message || "Unknown error"));
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center text-foreground">Loading...</div>;

  return (
    <div className="min-h-screen bg-[var(--background)] pt-24 pb-12 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl text-foreground"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            Site Settings
          </motion.h1>
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={handleSave}
            disabled={saving || uploading}
            className="flex items-center gap-2 px-6 py-3 bg-[var(--gold)] text-[var(--black)] tracking-wider uppercase hover:bg-[var(--gold-light)] transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" /> {saving ? "Saving..." : "Save Settings"}
          </motion.button>
        </div>

        <div className="bg-gradient-to-br from-[var(--black-soft)] to-[var(--burgundy-dark)] border border-[var(--border)] p-8 rounded-lg space-y-6">
          {SETTING_KEYS.map((setting) => (
            <div key={setting.key}>
              <label className="block text-[var(--muted-foreground)] text-sm tracking-wider uppercase mb-2">{setting.label}</label>
              {setting.type === "image" ? (
                <div className="flex flex-wrap items-center gap-4">
                  <label className="flex items-center gap-2 px-6 py-3 border border-[var(--gold)] text-[var(--gold)] hover:bg-[var(--gold)] hover:text-[var(--black)] transition-colors cursor-pointer">
                    <Upload className="w-4 h-4" />
                    {uploading ? "Uploading..." : "Upload Logo"}
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/svg+xml"
                      onChange={handleLogoFileChange}
                      className="hidden"
                      disabled={uploading}
                    />
                  </label>
                  {logoPreview && (
                    <div className="flex items-center gap-3">
                      <img src={logoPreview} alt="Logo Preview" className="h-16 object-contain" />
                    </div>
                  )}
                </div>
              ) : setting.type === "textarea" ? (
                <textarea
                  dir={setting.key.endsWith("_ar") ? "rtl" : "ltr"}
                  value={settings[setting.key] || ""}
                  onChange={(e) => setSettings({ ...settings, [setting.key]: e.target.value })}
                  rows={4}
                  className="w-full px-5 py-3 bg-[var(--input-background)] border border-[var(--border)] text-foreground focus:outline-none focus:border-[var(--gold)] resize-none"
                />
              ) : (
                <input
                  type={setting.type}
                  dir={setting.key.endsWith("_ar") ? "rtl" : "ltr"}
                  value={settings[setting.key] || ""}
                  onChange={(e) => setSettings({ ...settings, [setting.key]: e.target.value })}
                  className="w-full px-5 py-3 bg-[var(--input-background)] border border-[var(--border)] text-foreground focus:outline-none focus:border-[var(--gold)]"
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
