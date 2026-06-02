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
        <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-[var(--black-soft)] border border-[var(--border)]">
          <Link to={`/shop/${product.slug}`} className="block w-full h-full">
            <ImageWithFallback
              src={product.image_url || "https://images.unsplash.com/photo-1778058505620-6911582e5a9c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg"}
              alt={name}
              className="h-full w-full object-cover"
            />
          </Link>

          {/* Hover Overlay */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-[var(--burgundy)] via-transparent to-transparent opacity-0 group-hover:opacity-90 transition-opacity duration-300 pointer-events-none"
          />

          {/* Info Overlay */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-300"
          >
            <Link to={`/shop/${product.slug}`}>
              <h3
                className="text-lg sm:text-2xl mb-1 sm:mb-2 text-foreground hover:text-[var(--gold-light)] transition-colors"
                style={{ fontFamily: "Playfair Display, serif" }}
              >
                {name}
              </h3>
            </Link>
            <div className="flex items-center justify-between">
              <span className="text-base sm:text-xl text-[var(--gold)]">
                ${Number(product.price).toLocaleString()}
              </span>
              {product.stock > 0 ? (
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleAddToCart}
                  className="px-3 sm:px-4 py-1.5 sm:py-2 bg-[var(--gold)] text-[var(--black)] text-xs sm:text-sm tracking-wider uppercase relative z-10"
                >
                  {added ? t("common.addedToCart") : t("featured.addToCart")}
                </motion.button>
              ) : null}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
