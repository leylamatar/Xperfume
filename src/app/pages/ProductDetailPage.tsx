import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { useParams, Link } from "react-router";
import { Star, Minus, Plus, ShoppingBag, Heart, Share2, ChevronRight, ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { useCart } from "../context/CartContext";
import { supabase } from "../lib/supabase";
import { useLanguage } from "../context/LanguageContext";
import { useTranslation } from "react-i18next";

export function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<any>(null);
  const [related, setRelated] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [wishlisted, setWishlisted] = useState(false);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();
  const { language } = useLanguage();
  const { t } = useTranslation();

  useEffect(() => {
    if (slug) loadProduct();
  }, [slug]);

  async function loadProduct() {
    try {
      setLoading(true);
      setError(null);

      const { data: productData, error: productError } = await supabase
        .from("products")
        .select("*")
        .eq("slug", slug)
        .single();

      if (productError) throw productError;

      if (productData) {
        setProduct(productData);
        const { data: relatedData, error: relatedError } = await supabase
          .from("products")
          .select("*")
          .eq("category", productData.category)
          .neq("id", productData.id)
          .limit(3);
        
        if (relatedError) throw relatedError;
        setRelated(relatedData || []);
      }
    } catch (err: any) {
      console.error("Error loading product:", err);
      setError("Product could not be loaded");
    } finally {
      setLoading(false);
    }
  }

  const handleAddToCart = () => {
    if (!product) return;
    const translatedName = language === "ar" ? (product.name_ar || product.name_en || product.name) : (product.name_en || product.name);
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product.id,
        name: translatedName,
        collection: product.category || "",
        price: Number(product.price),
        priceFormatted: `$${Number(product.price).toLocaleString()}`,
        image: product.image_url || "",
        size: product.size_ml ? `${product.size_ml}ml` : "",
      });
    }
    setAdded(true);
    toast.success(t("common.addedToCart"), {
      description: t("common.productAddedSuccessfully"),
    });
    setTimeout(() => setAdded(false), 2000);
  };

  const allImages = product
    ? [product.image_url, ...(product.gallery_urls || [])].filter(Boolean)
    : [];

  if (loading)
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center text-foreground">
        <Loader2 className="w-10 h-10 text-[var(--gold)] animate-spin" />
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[var(--muted-foreground)] text-lg mb-4">{error}</p>
          <Link to="/shop" className="text-[var(--gold)] tracking-wider uppercase text-sm border border-[var(--gold)] px-6 py-2 hover:bg-[var(--gold)] hover:text-[var(--black)] transition-colors">
            Back to Shop
          </Link>
        </div>
      </div>
    );

  if (!product)
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl text-foreground mb-4" style={{ fontFamily: "Playfair Display, serif" }}>
            Product Not Found
          </h2>
          <Link to="/shop" className="text-[var(--gold)] tracking-wider uppercase text-sm border border-[var(--gold)] px-6 py-2 hover:bg-[var(--gold)] hover:text-[var(--black)] transition-colors">
            Back to Shop
          </Link>
        </div>
      </div>
    );

  const displayName = language === "ar" ? (product.name_ar || product.name_en || product.name) : (product.name_en || product.name);
  const displayDescription = language === "ar" ? (product.description_ar || product.description_en || product.description) : (product.description_en || product.description);

  return (
    <div className="min-h-screen bg-[var(--background)] pt-20">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
          <Link to="/" className="hover:text-[var(--gold)] transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link to="/shop" className="hover:text-[var(--gold)] transition-colors">Shop</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-[var(--gold)]">{displayName}</span>
        </div>
      </div>

      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="sticky top-24"
          >
            <div className="relative aspect-square overflow-hidden bg-gradient-to-b from-[var(--black-soft)] to-[var(--burgundy-dark)] border border-[var(--border)] mb-4">
              <motion.div
                key={activeImage}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="h-full"
              >
                <ImageWithFallback
                  src={allImages[activeImage] || "https://images.unsplash.com/photo-1774682060997-f8959850a7d4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg"}
                  alt={displayName}
                  className="h-full w-full object-cover"
                />
              </motion.div>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setWishlisted(!wishlisted)}
                className="absolute top-4 right-4 p-3 bg-[var(--black)]/80 backdrop-blur-sm border border-[var(--border)]"
              >
                <Heart className={`w-5 h-5 transition-colors ${wishlisted ? "fill-[var(--wine)] text-[var(--wine)]" : "text-[var(--gold)]"}`} />
              </motion.button>
            </div>

            {allImages.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {allImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImage(index)}
                    className={`aspect-square overflow-hidden border transition-colors ${
                      activeImage === index
                        ? "border-[var(--gold)]"
                        : "border-[var(--border)] hover:border-[var(--gold)]"
                    }`}
                  >
                    <ImageWithFallback
                      src={image}
                      alt={`${displayName} ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <p className="text-[var(--gold)] tracking-[0.3em] uppercase text-sm mb-4">{product.category}</p>
            <h1
              className="text-5xl md:text-6xl text-foreground mb-6"
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              {displayName}
            </h1>

            <div className="flex items-center gap-4 mb-8">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-[var(--gold)] text-[var(--gold)]" />
                ))}
              </div>
              {product.stock > 0 ? (
                <span className="text-[var(--muted-foreground)] text-sm">{t("productDetail.inStock")}</span>
              ) : (
                <span className="text-red-400 text-sm">{t("productDetail.outOfStock")}</span>
              )}
            </div>

            <div className="flex items-center gap-4 mb-10">
              {product.old_price && (
                <span className="text-[var(--muted-foreground)] text-3xl line-through">
                  ${Number(product.old_price).toLocaleString()}
                </span>
              )}
              <span className="text-4xl text-[var(--gold)]">${Number(product.price).toLocaleString()}</span>
            </div>

            <p className="text-[var(--muted-foreground)] text-lg leading-relaxed mb-10">
              {displayDescription}
            </p>

            <div className="flex items-center gap-6 mb-10">
              <div className="flex items-center gap-4 border border-[var(--border)]">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-4 text-[var(--muted-foreground)] hover:text-[var(--gold)] transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="text-foreground text-lg w-8 text-center">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-4 text-[var(--muted-foreground)] hover:text-[var(--gold)] transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {product.stock > 0 ? (
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddToCart}
                  className="flex-1 flex items-center justify-center gap-3 px-8 py-4 bg-[var(--gold)] text-[var(--black)] tracking-[0.2em] uppercase hover:bg-[var(--gold-light)] transition-colors"
                >
                  <ShoppingBag className="w-5 h-5" />
                  {added ? t("common.addedToCart") : t("productDetail.addToCart")}
                </motion.button>
              ) : (
                <button disabled type="button" className="flex-1 flex items-center justify-center gap-3 px-8 py-4 bg-[var(--border)] text-[var(--muted-foreground)] tracking-[0.2em] uppercase cursor-not-allowed">
                  {t("productDetail.outOfStock")}
                </button>
              )}

              <motion.button
                type="button"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-4 border border-[var(--border)] text-[var(--gold)]"
              >
                <Share2 className="w-5 h-5" />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="py-20 px-6 border-t border-[var(--border)]">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-3 mb-12">
              <div className="w-12 h-px bg-[var(--gold)]" />
              <span className="text-[var(--gold)] tracking-[0.3em] uppercase text-sm">You May Also Like</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {related.map((p) => {
                const name = language === "ar" ? (p.name_ar || p.name_en || p.name) : (p.name_en || p.name);
                return (
                  <Link key={p.id} to={`/shop/${p.slug}`}>
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      whileHover={{ y: -4 }}
                      className="group cursor-pointer"
                    >
                      <div className="relative aspect-[3/4] overflow-hidden bg-gradient-to-b from-[var(--black-soft)] to-[var(--burgundy-dark)] border border-[var(--border)] mb-4">
                        <ImageWithFallback
                          src={p.image_url || "https://images.unsplash.com/photo-1774682060997-f8959850a7d4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg"}
                          alt={name}
                          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <h3
                        className="text-xl text-foreground mb-2 group-hover:text-[var(--gold)] transition-colors"
                        style={{ fontFamily: "Playfair Display, serif" }}
                      >
                        {name}
                      </h3>
                      <span className="text-[var(--gold)]">${Number(p.price).toLocaleString()}</span>
                    </motion.div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
