import { motion } from "motion/react";
import { Star, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { supabase } from "../lib/supabase";
import { useLanguage } from "../context/LanguageContext";
import { useTranslatedSetting } from "../hooks/useTranslationHelpers";
import { useTranslation } from "react-i18next";
import { BestSellersProductCard } from "./BestSellersProductCard";

export function BestSellers() {
  const [products, setProducts] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { language } = useLanguage();
  const { t } = useTranslation();
  const bestSellersTitle = useTranslatedSetting("best_sellers_title", "Best Sellers");
  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  // Responsive configuration with breakpoints
  const getBreakpointConfig = () => {
    if (typeof window === 'undefined') return { slidesPerView: 4, spaceBetween: 24 };
    const w = window.innerWidth;
    if (w < 480) return { slidesPerView: 1.2, spaceBetween: 12 }; // Mobile tiny - 1.2 items
    if (w < 768) return { slidesPerView: 2, spaceBetween: 16 }; // Mobile normal - 2 items
    if (w < 1024) return { slidesPerView: 3, spaceBetween: 20 }; // Tablet - 3 items
    return { slidesPerView: 4, spaceBetween: 24 }; // Desktop -4 items
  };
  
  const [config, setConfig] = useState(getBreakpointConfig());

  useEffect(() => {
    const handleResize = () => setConfig(getBreakpointConfig());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    loadBestSellers();
  }, []);

  async function loadBestSellers() {
    try {
      setLoading(true);
      setError(null);

      // First try to get best sellers
      let { data: bestSellerData, error: bestSellerError } = await supabase
        .from("products")
        .select("*")
        .eq("is_best_seller", true)
        .order("created_at", { ascending: false })
        .limit(10);
      
      console.log("Best sellers data:", bestSellerData);
      console.log("Best sellers error:", bestSellerError);

      if (bestSellerError) throw bestSellerError;

      // If no best sellers, get latest 10 products
      if (!bestSellerData || bestSellerData.length === 0) {
        console.log("No best sellers found, fetching latest products");
        const { data: allData, error: allError } = await supabase
          .from("products")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(10);
        
        if (allError) throw allError;
        setProducts(allData || []);
      } else {
        setProducts(bestSellerData);
      }

    } catch (err: any) {
      console.error("Error loading best sellers:", err);
      setError("Products could not be loaded");
    } finally {
      setLoading(false);
    }
  }

  const maxIndex = Math.max(0, products.length - Math.floor(config.slidesPerView));
  
  const next = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
  };

  const prev = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  if (loading) return (
    <section className="relative py-20 sm:py-32 px-4 sm:px-6 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--burgundy-dark)] via-[var(--black-soft)] to-[var(--background)]" />
      <div className="relative z-10 max-w-7xl mx-auto flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-[var(--gold)] animate-spin" />
      </div>
    </section>
  );

  if (error) return (
    <section className="relative py-20 sm:py-32 px-4 sm:px-6 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--burgundy-dark)] via-[var(--black-soft)] to-[var(--background)]" />
      <div className="relative z-10 max-w-7xl mx-auto text-center">
        <p className="text-[var(--muted-foreground)] text-lg">{error}</p>
      </div>
    </section>
  );

  if (products.length === 0) return null;

  return (
    <section className="relative py-20 sm:py-32 px-4 sm:px-6 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--burgundy-dark)] via-[var(--black-soft)] to-[var(--background)]" />

      {/* Floating Smoke Effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-32 h-32 rounded-full bg-[var(--gold)] opacity-5 blur-3xl"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, 50, 0],
              y: [0, -80, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header - Compact for mobile */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 sm:mb-16"
        >
          <span className="text-[var(--gold)] tracking-[0.25em] uppercase text-xs sm:text-sm">
            {t('bestSellers.tagline', 'Most Loved')}
          </span>
          <h2
            className="text-3xl sm:text-5xl md:text-6xl mt-3 sm:mt-4 text-foreground"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            {bestSellersTitle}
          </h2>
        </motion.div>

        {/* Carousel */}
        <div className="relative">
          {/* Left Nav Button */}
          {products.length > Math.floor(config.slidesPerView) && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={prev}
              disabled={currentIndex === 0}
              className={`absolute top-1/2 left-0 sm:left-2 z-20 -translate-y-1/2 p-2 sm:p-3 border border-[var(--gold)] text-[var(--gold)] hover:bg-[var(--gold)] hover:text-[var(--black)] transition-colors ${
                currentIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6" />
            </motion.button>
          )}
          
          {/* Right Nav Button */}
          {products.length > Math.floor(config.slidesPerView) && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={next}
              disabled={currentIndex >= maxIndex}
              className={`absolute top-1/2 right-0 sm:right-2 z-20 -translate-y-1/2 p-2 sm:p-3 border border-[var(--gold)] text-[var(--gold)] hover:bg-[var(--gold)] hover:text-[var(--black)] transition-colors ${
                currentIndex >= maxIndex ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6" />
            </motion.button>
          )}

          <div className="overflow-hidden px-8 sm:px-10">
            <motion.div
              className="flex"
              style={{ gap: config.spaceBetween }}
              animate={{ x: `-${currentIndex * (100 / config.slidesPerView)}%` }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
            >
              {products.map((product) => (
                <BestSellersProductCard
                  key={product.id}
                  product={product}
                  slidesPerView={config.slidesPerView}
                  spaceBetween={config.spaceBetween}
                />
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
