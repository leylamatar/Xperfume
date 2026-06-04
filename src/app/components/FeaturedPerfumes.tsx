import { motion } from "motion/react";
import { Sparkles, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useLanguage } from "../context/LanguageContext";
import { useTranslatedSetting } from "../hooks/useTranslationHelpers";
import { FeaturedProductCard } from "./FeaturedProductCard";

export function FeaturedPerfumes() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { language } = useLanguage();
  const featuredTitle = useTranslatedSetting("featured_title", "Signature Fragrances");

  useEffect(() => {
    loadFeaturedProducts();
  }, []);

  async function loadFeaturedProducts() {
    try {
      setLoading(true);
      setError(null);
      
      // First try to get featured products
      let { data: featuredData, error: featuredError } = await supabase
        .from("products")
        .select("*")
        .eq("is_featured", true)
        .order("created_at", { ascending: false })
        .limit(3);
      
      console.log("Featured products data:", featuredData);
      console.log("Featured products error:", featuredError);

      if (featuredError) throw featuredError;

      // If no featured products, get latest 3 products as fallback
      if (!featuredData || featuredData.length === 0) {
        console.log("No featured products found, fetching latest products");
        const { data: allData, error: allError } = await supabase
          .from("products")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(3);
        
        if (allError) throw allError;
        setProducts(allData || []);
      } else {
        setProducts(featuredData);
      }

    } catch (err: any) {
      console.error("Error loading featured products:", err);
      setError("Products could not be loaded");
    } finally {
      setLoading(false);
    }
  }

  if (loading) return (
    <section className="py-32 px-6 bg-[var(--background)]">
      <div className="max-w-7xl mx-auto flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-[var(--gold)] animate-spin" />
      </div>
    </section>
  );

  if (error) return (
    <section className="py-32 px-6 bg-[var(--background)]">
      <div className="max-w-7xl mx-auto text-center">
        <p className="text-[var(--muted-foreground)] text-lg">{error}</p>
      </div>
    </section>
  );

  if (products.length === 0) return null;

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
