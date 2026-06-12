import { motion } from "motion/react";
import { Link } from "react-router";
import { useState } from "react";
import { toast } from "sonner";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useTranslatedProduct } from "../hooks/useTranslationHelpers";
import { useCart } from "../context/CartContext";
import { useTranslation } from "react-i18next";

interface BestSellersProductCardProps {
  product: any;
  slidesPerView: number;
  spaceBetween: number;
}

export function BestSellersProductCard({ product, slidesPerView, spaceBetween }: BestSellersProductCardProps) {
  const { name } = useTranslatedProduct(product);
  const { addItem } = useCart();
  const { t } = useTranslation();
  const [added, setAdded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    console.log("BEST SELLERS ADD TO CART CLICKED!");
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id: product.id,
      name: name,
      collection: product.category || "",
      price: Number(product.price),
      priceFormatted: `$${Number(product.price).toLocaleString()}`,
      image: product.image_url || "",
      size: product.size_ml ? `${product.size_ml}ml` : "",
    });
    setAdded(true);
    toast.success(t("common.addedToCart"), {
      description: t("common.productAddedSuccessfully"),
    });
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <motion.div
      className="flex-shrink-0"
      style={{ width: `calc(100% / ${slidesPerView} - ${spaceBetween - (spaceBetween / slidesPerView)}px)` }}
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative group cursor-pointer block">
        {/* Card */}
        <div className="relative rounded-lg overflow-hidden bg-[rgba(17,17,17,0.95)] border border-[rgba(255,255,255,0.08)]">
          <Link to={`/shop/${product.slug}`} className="block w-full">
            <div className="relative aspect-[3/4]">
              <ImageWithFallback
                src={product.image_url || "https://images.unsplash.com/photo-1778058505620-6911582e5a9c?crop=entropy&cs=tinysrgb&fit=max&fm.jpg"}
                alt={name}
                className="h-full w-full object-cover"
              />

              {/* Hover Overlay - only on desktop */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-t from-[#000000] via-transparent to-transparent opacity-0 md:group-hover:opacity-90 transition-opacity duration-300 pointer-events-none"
              />
            </div>
          </Link>

          {/* Info Overlay - always visible on mobile, only hover on desktop */}
          <div className="p-4 sm:p-6 md:absolute md:bottom-0 md:left-0 md:right-0 md:translate-y-full md:group-hover:translate-y-0 transition-transform duration-300">
            <Link to={`/shop/${product.slug}`}>
              <h3
                className="text-lg sm:text-2xl mb-1 sm:mb-2 text-foreground hover:text-[#E8E8E8] transition-colors"
                style={{ fontFamily: "Playfair Display, serif" }}
              >
                {name}
              </h3>
            </Link>
            <div className="flex items-center justify-between">
              <span className="text-base sm:text-xl bg-clip-text text-transparent" style={{ backgroundImage: 'var(--metallic-gradient)' }}>
                ${Number(product.price).toLocaleString()}
              </span>
              {product.stock > 0 ? (
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleAddToCart}
                  className="px-3 sm:px-4 py-1.5 sm:py-2 text-[#000000] text-xs sm:text-sm tracking-wider uppercase relative z-10 shadow-[0_10px_30px_rgba(255,255,255,0.15)]"
                  style={{ backgroundImage: 'var(--metallic-gradient)' }}
                >
                  {added ? t("common.addedToCart") : t("featured.addToCart")}
                </motion.button>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
