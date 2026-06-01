import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router";
import { supabase } from "../lib/supabase";
import { motion } from "motion/react";
import { CheckCircle2, MessageCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

export function OrderSuccessPage() {
  const [searchParams] = useSearchParams();
  const [orderNumber, setOrderNumber] = useState(searchParams.get("order") || "");
  const [settings, setSettings] = useState<any>({});
  const { t } = useTranslation();

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    const { data } = await supabase.from("site_settings").select("*");
    const settingsMap: Record<string, string> = {};
    data?.forEach(setting => {
      settingsMap[setting.key] = setting.value || "";
    });
    setSettings(settingsMap);
  }

  return (
    <div className="min-h-screen bg-[var(--background)] pt-32 pb-20 px-6">
      <div className="max-w-2xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <CheckCircle2 className="w-24 h-24 text-[var(--gold)] mx-auto mb-8" />
          <h1
            className="text-5xl text-foreground mb-4"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            {t("orderSuccess.title")}
          </h1>
          <p className="text-[var(--muted-foreground)] text-lg mb-12">
            {t("orderSuccess.message")}
          </p>

          <div className="bg-gradient-to-br from-[var(--black-soft)] to-[var(--burgundy-dark)] border border-[var(--border)] p-8 rounded-lg mb-8">
            <p className="text-[var(--muted-foreground)] text-sm tracking-wider uppercase mb-2">{t("orderSuccess.orderNumber")}</p>
            <p className="text-3xl text-[var(--gold)] mb-6" style={{ fontFamily: "Playfair Display, serif" }}>
              {orderNumber}
            </p>

            <div className="border-t border-[var(--border)] pt-6">
              <h3 className="text-foreground mb-4">{t("checkout.paymentMethod")}</h3>
              <div className="space-y-3 text-left">
                <div className="flex justify-between">
                  <span className="text-[var(--muted-foreground)]">{t("checkout.bankTransfer")}</span>
                  <span className="text-foreground">{settings.bank_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--muted-foreground)]">{t("checkout.accountHolder")}</span>
                  <span className="text-foreground">{settings.account_holder}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--muted-foreground)]">IBAN</span>
                  <span className="text-foreground font-mono">{settings.iban}</span>
                </div>
              </div>
            </div>
          </div>

          <p className="text-[var(--muted-foreground)] mb-8">
            {t("orderSuccess.paymentNote")}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/shop"
              className="inline-flex items-center justify-center gap-3 px-8 py-4 border border-[var(--gold)] text-[var(--gold)] tracking-wider uppercase hover:bg-[var(--gold)] hover:text-[var(--black)] transition-colors"
            >
              {t("orderSuccess.continueShopping")}
            </Link>
            {settings.whatsapp_number && (
              <a
                href={`https://wa.me/${settings.whatsapp_number}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-[var(--gold)] text-[var(--black)] tracking-wider uppercase hover:bg-[var(--gold-light)] transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                {t("footer.contactUs")}
              </a>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
