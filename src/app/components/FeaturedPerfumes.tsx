import { motion } from "motion/react";
import { Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useLanguage } from "../context/LanguageContext";
import { useTranslatedSetting } from "../hooks/useTranslationHelpers";
import { FeaturedProductCard } from "./FeaturedProductCard";

export function FeaturedPerfumes() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { language } = useLanguage();
  const featuredTitle = useTranslatedSetting("featured_title", "Signature Fragrances");

  useEffect(() => {
    loadFeaturedProducts();
  }, []);

  async function loadFeaturedProducts() {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("is_featured", true)
        .order("created_at", { ascending: false })
        .limit(3);
      console.log("Featured products data:", data);
      console.log("Featured products error:", error);
      setProducts(data || []);
    } catch (error) {
      console.error("Error loading featured products:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return null;

  return (
    <section className="py-32 px-6 bg-[var(--background)]">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-4 h-4 text-[var(--gold)]" />
            <span className="text-[var(--gold)] tracking-[0.3em] uppercase text-sm">
              Featured
            </span>
            <Sparkles className="w-4 h-4 text-[var(--gold)]" />
          </div>
          <h2
            className="text-6xl mb-6 text-foreground"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            {featuredTitle}
          </h2>
          <p className="text-[var(--muted-foreground)] max-w-2xl mx-auto text-lg">
            Curated exclusively for those who appreciate the art of fine
            perfumery
          </p>
        </motion.div>

        {/* Perfumes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {products.map((product, index) => (
            <FeaturedProductCard
              key={product.id}
              product={product}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
