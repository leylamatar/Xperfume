import { motion } from "motion/react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Sparkles } from "lucide-react";
import { Link } from "react-router";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useCart } from "../context/CartContext";
import { useLanguage } from "../context/LanguageContext";
import { useTranslatedProduct, useTranslatedSetting } from "../hooks/useTranslationHelpers";

export function FeaturedPerfumes() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();
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
          {products.map((product, index) => {
            const { name, short_description } = useTranslatedProduct(product);
            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
              >
                <motion.div
                  className="group relative cursor-pointer"
                  whileHover={{ y: -10 }}
                  transition={{ duration: 0.4 }}
                >
                  {/* Card */}
                  <div className="relative overflow-hidden rounded-lg bg-gradient-to-b from-[var(--black-soft)] to-[var(--burgundy-dark)] p-8 border border-[var(--border)]">
                    {/* Glow Effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-br from-[var(--gold)] to-transparent opacity-0 group-hover:opacity-10 transition-opacity duration-500"
                      initial={false}
                    />

                    {/* Image Container */}
                    <div className="relative aspect-[3/4] mb-6 overflow-hidden rounded-md">
                      <Link to={`/shop/${product.slug}`}>
                        <motion.div
                          whileHover={{ scale: 1.1, rotate: 2 }}
                          transition={{ duration: 0.6 }}
                          className="h-full"
                        >
                          <ImageWithFallback
                            src={product.image_url || "https://images.unsplash.com/photo-1774682060997-f8959850a7d4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg"}
                            alt={name}
                            className="h-full w-full object-cover"
                          />
                        </motion.div>
                      </Link>

                      {/* Light Reflection */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-tr from-transparent via-white to-transparent opacity-0 group-hover:opacity-20"
                        initial={{ x: "-100%", y: "-100%" }}
                        whileHover={{ x: "100%", y: "100%" }}
                        transition={{ duration: 0.8 }}
                      />
                    </div>

                    {/* Info */}
                    <div className="text-center">
                      <p className="text-[var(--gold)] text-xs tracking-[0.2em] uppercase mb-2">
                        {product.category}
                      </p>
                      <Link to={`/shop/${product.slug}`}>
                        <h3
                          className="text-2xl mb-3 text-foreground hover:text-[var(--gold)] transition-colors"
                          style={{ fontFamily: "Playfair Display, serif" }}
                        >
                          {name}
                        </h3>
                      </Link>
                      <p className="text-[var(--muted-foreground)] text-sm mb-4">
                        {short_description}
                      </p>
                      <div className="flex items-center justify-center gap-4">
                        <span className="text-xl text-[var(--gold)]">
                          ${Number(product.price).toLocaleString()}
                        </span>
                        {product.stock > 0 ? (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() =>
                              addItem({
                                id: product.id,
                                name: name,
                                collection: product.category || "",
                                price: Number(product.price),
                                priceFormatted: `$${Number(product.price).toLocaleString()}`,
                                image: product.image_url || "",
                                size: product.size_ml ? `${product.size_ml}ml` : "",
                              })
                            }
                            className="px-6 py-2 text-sm border border-[var(--gold)] text-[var(--gold)] hover:bg-[var(--gold)] hover:text-[var(--black)] transition-colors tracking-wider uppercase"
                          >
                            Add to Cart
                          </motion.button>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
