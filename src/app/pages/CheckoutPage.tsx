import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router";
import { Lock, Check } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useLanguage } from "../context/LanguageContext";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { supabase } from "../lib/supabase";
import { useTranslation } from "react-i18next";

function InputField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-[var(--muted-foreground)] text-xs tracking-[0.2em] uppercase mb-2">
        {label}
      </label>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-5 py-4 bg-[var(--input-background)] border border-[var(--border)] text-foreground placeholder:text-[var(--muted-foreground)] focus:outline-none focus:border-[var(--gold)] transition-colors"
      />
    </div>
  );
}

export function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const { t } = useTranslation();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    note: "",
  });

  useEffect(() => {
    if (items.length === 0 && !showSuccessModal) {
      navigate("/shop");
      return;
    }
    loadSettings();
  }, [items.length, showSuccessModal]);

  async function loadSettings() {
    try {
      const { data } = await supabase.from("site_settings").select("*");
      const settingsMap: Record<string, string> = {};
      data?.forEach((s) => (settingsMap[s.key] = s.value || ""));
      setSettings(settingsMap);
    } catch (error) {
      console.error("Error loading settings:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    console.log("=== 1. Handle Submit CALLED ===");
    setSubmitting(true);
    try {
      console.log("=== 2. Starting Order ===");
      console.log("Cart items:", items);
      console.log("Form data:", form);
      console.log("Total price:", totalPrice);
      
      const orderNumber = `ORD-${Date.now()}`;

      const orderDataToInsert = {
        order_number: orderNumber,
        customer_name: form.name,
        customer_email: form.email || null,
        customer_phone: form.phone,
        customer_address: null,
        total_amount: totalPrice,
        note: form.note || null,
        order_status: "new",
        payment_status: "pending",
      };

      console.log("=== 3. Inserting order with data ===");
      console.log(orderDataToInsert);
      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .insert([orderDataToInsert])
        .select("id")
        .single();

      console.log("=== 4. Order insert ===");
      console.log("Data:", orderData);
      console.log("Error:", orderError);
      if (orderError) {
        console.error("=== ORDER ERROR ===", orderError);
        throw orderError;
      }

      const orderItems = items.map((item) => ({
        order_id: orderData.id,
        product_id: item.id,
        product_name: item.name,
        quantity: item.quantity,
        unit_price: item.price,
        total_price: item.price * item.quantity,
      }));

      console.log("=== 5. Inserting order items ===");
      console.log(orderItems);
      const { error: itemsError } = await supabase.from("order_items").insert(orderItems);
      console.log("=== 6. Order items error ===", itemsError);
      if (itemsError) {
        console.error("=== ORDER ITEMS ERROR ===", itemsError);
        throw itemsError;
      }

      console.log("=== 7. Clearing cart and showing modal ===");
      clearCart();
      console.log("=== 8. Current showSuccessModal before set ===", showSuccessModal);
      setShowSuccessModal(true);
      console.log("=== 9. showSuccessModal should now be true ===");
    } catch (error) {
      console.error("=== ! FULL ERROR PLACING ORDER ! ===");
      console.error(error);
      alert(`Error placing order: ${JSON.stringify(error)}`);
    } finally {
      setSubmitting(false);
    }
  }

  const handleBackToShop = () => {
    setShowSuccessModal(false);
    navigate("/shop");
  };

  if (loading)
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center text-foreground">
        Loading...
      </div>
    );

  return (
    <div className="min-h-screen bg-[var(--background)] pt-20">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-8 h-px bg-[var(--gold)]" />
          <span className="text-[var(--gold)] tracking-[0.3em] uppercase text-sm">{t("checkout.title")}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h2
                  className="text-3xl text-foreground mb-8"
                  style={{ fontFamily: "Playfair Display, serif" }}
                >
                  {t("checkout.customerInformation")}
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                  <InputField
                    label={t("checkout.fullName")}
                    value={form.name}
                    onChange={(v) => setForm({ ...form, name: v })}
                    placeholder="Marie-Claire Beaumont"
                    required
                  />
                  <InputField
                    label={t("checkout.phone")}
                    value={form.phone}
                    onChange={(v) => setForm({ ...form, phone: v })}
                    placeholder="+90 500 000 0000"
                    required
                  />
                </div>

                <div className="mb-8">
                  <InputField
                    label={t("checkout.email")}
                    type="email"
                    value={form.email}
                    onChange={(v) => setForm({ ...form, email: v })}
                    placeholder="your@email.com"
                  />
                </div>

                <div className="mb-8">
                  <label className="block text-[var(--muted-foreground)] text-xs tracking-[0.2em] uppercase mb-2">
                    {t("checkout.orderNote")}
                  </label>
                  <textarea
                    value={form.note}
                    onChange={(e) => setForm({ ...form, note: e.target.value })}
                    placeholder="Special instructions..."
                    rows={3}
                    className="w-full px-5 py-4 bg-[var(--input-background)] border border-[var(--border)] text-foreground placeholder:text-[var(--muted-foreground)] focus:outline-none focus:border-[var(--gold)] transition-colors resize-none"
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-gradient-to-b from-[var(--black-soft)] to-[var(--burgundy-dark)] border border-[var(--border)] p-8"
              >
                <div className="flex items-center gap-2 mb-6">
                  <Lock className="w-4 h-4 text-[var(--gold)]" />
                  <h3 className="text-foreground tracking-wider uppercase text-sm">
                    {t("checkout.paymentMethod")} - {t("checkout.bankTransfer")}
                  </h3>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-[var(--muted-foreground)]">{t("checkout.bank")}</span>
                    <span className="text-foreground">{settings.bank_name || "Your Bank"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--muted-foreground)]">{t("checkout.accountHolder")}</span>
                    <span className="text-foreground">{settings.account_holder || "Your Name"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--muted-foreground)]">IBAN</span>
                    <span className="text-[var(--gold)] font-mono">{settings.iban || "TR00 0000 0000 0000 0000 0000 00"}</span>
                  </div>
                </div>
                <p className="text-[var(--muted-foreground)] text-sm mt-6">
                  {t("orderSuccess.paymentNote")}
                </p>
              </motion.div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={submitting}
                className="w-full py-5 bg-[var(--gold)] text-[var(--black)] tracking-[0.2em] uppercase text-sm hover:bg-[var(--gold-light)] transition-colors flex items-center justify-center gap-3 disabled:opacity-50"
              >
                <Lock className="w-4 h-4" />
                {submitting ? t("checkout.placingOrder") : `${t("checkout.placeOrder")} · $${totalPrice.toLocaleString()}`}
              </motion.button>
            </form>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="bg-gradient-to-b from-[var(--black-soft)] to-[var(--burgundy-dark)] border border-[var(--border)] p-6 sticky top-24">
              <h3
                className="text-xl text-foreground mb-6"
                style={{ fontFamily: "Playfair Display, serif" }}
              >
                {t("checkout.orderSummary")}
              </h3>

              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="w-14 h-20 shrink-0 border border-[var(--border)] overflow-hidden">
                      <ImageWithFallback src={item.image} alt={item.name} className="h-full w-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-foreground text-sm truncate" style={{ fontFamily: "Playfair Display, serif" }}>
                        {item.name}
                      </p>
                      <p className="text-[var(--muted-foreground)] text-xs">
                        {item.size} · Qty {item.quantity}
                      </p>
                      <p className="text-[var(--gold)] text-sm">${(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 pt-4 border-t border-[var(--border)]">
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--muted-foreground)]">{t("checkout.subtotal")}</span>
                  <span className="text-foreground">${totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between pt-3 border-t border-[var(--border)]">
                  <span className="text-foreground">{t("checkout.total")}</span>
                  <span className="text-[var(--gold)] text-xl" style={{ fontFamily: "Playfair Display, serif" }}>
                    ${totalPrice.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccessModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          >
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleBackToShop}
              className="absolute inset-0 bg-black/70"
            />
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative z-10 max-w-md w-full"
            >
              <div className="bg-gradient-to-br from-[var(--burgundy-dark)] via-[var(--black-soft)] to-[var(--burgundy-dark)] border border-[var(--gold)]/30 rounded-lg p-8 text-center shadow-2xl">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", bounce: 0.5 }}
                  className="w-16 h-16 rounded-full bg-[var(--gold)] flex items-center justify-center mx-auto mb-6"
                >
                  <Check className="w-8 h-8 text-[var(--black)]" />
                </motion.div>
                <h2 className="text-2xl text-foreground mb-3" style={{ fontFamily: "Playfair Display, serif" }}>
                  {t("checkoutSuccess.title")}
                </h2>
                <p className="text-[var(--muted-foreground)] mb-8">
                  {t("checkoutSuccess.description")}
                </p>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleBackToShop}
                  className="w-full py-3 bg-[var(--gold)] text-[var(--black)] tracking-[0.2em] uppercase text-sm hover:bg-[var(--gold-light)] transition-colors"
                >
                  {t("checkoutSuccess.backToShop")}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}