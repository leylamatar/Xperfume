import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { MessageCircle } from "lucide-react";
import { supabase } from "../lib/supabase";

export function WhatsAppButton() {
  const [whatsappNumber, setWhatsappNumber] = useState("905000000000");

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    try {
      const { data } = await supabase.from("site_settings").select("*").eq("key", "whatsapp_number").single();
      if (data?.value) {
        setWhatsappNumber(data.value);
      }
    } catch (error) {
      console.error("Error loading settings:", error);
    }
  }

  const whatsappUrl = `https://wa.me/${whatsappNumber}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50"
    >
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, type: "spring" }}
        className="group relative"
      >
        <motion.span
          initial={{ opacity: 0, x: -10 }}
          whileHover={{ opacity: 1, x: 0 }}
          className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-[var(--black)] border border-[var(--gold)] px-4 py-2 text-sm text-[var(--foreground)] whitespace-nowrap rounded shadow-lg"
        >
          Need help? Chat with us
          <span className="absolute left-full top-1/2 -translate-y-1/2 border-4 border-transparent border-l-[var(--gold)]" />
        </motion.span>

        <motion.button
          whileHover={{ scale: 1.1, y: -2 }}
          whileTap={{ scale: 0.95 }}
          className="w-14 h-14 bg-gradient-to-br from-[var(--gold)] to-[var(--gold-light)] rounded-full flex items-center justify-center shadow-xl hover:shadow-2xl transition-shadow duration-300 border-2 border-[var(--gold)]"
          style={{
            boxShadow: "0 0 30px rgba(212, 175, 55, 0.4)"
          }}
        >
          <MessageCircle className="w-7 h-7 text-[var(--black)]" />
        </motion.button>
      </motion.div>
    </a>
  );
}
