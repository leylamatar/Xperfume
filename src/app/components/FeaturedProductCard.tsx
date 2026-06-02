import { motion } from "motion/react";
import { Link } from "react-router";
import { useState } from "react";
import { toast } from "sonner";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useTranslatedProduct } from "../hooks/useTranslationHelpers";
import { useCart } from "../context/CartContext";
import { useTranslation } from "react-i18next";

interface FeaturedProductCardProps {
  product: any;
  index: number;
}

export function FeaturedProductCard({ product, index }: FeaturedProductCardProps) {
  const { name, short_description } = useTranslatedProduct(product);
  const { addItem } = useCart();
  const { t } = useTranslation();
  const [added, setAdded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    console.log("ADD TO CART CLICKED!");
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
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: index * 0.2 }}
    >
      <motion.div
        className="group relative"
        whileHover={{ y: -10 }}
        transition={{ duration: 0.4 }}
      >
        {/* Card */}
        <div className="relative overflow-hidden rounded-lg bg-gradient-to-b from-[var(--black-soft)] to-[var(--burgundy-dark)] p-8 border border-[var(--border)]">
          {/* Glow Effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-[var(--gold)] to-transparent opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none"
            initial={false}
          />

          {/* Image Container */}
          <div className="relative aspect-[3/4] mb-6 overflow-hidden rounded-md">
            <Link to={`/shop/${product.slug}`} className="block w-full h-full">
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
              className="absolute inset-0 bg-gradient-to-tr from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 pointer-events-none"
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
                className="text-xl mb-3 text-foreground hover:text-[var(--gold)] transition-colors"
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
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleAddToCart}
                  className="px-6 py-2 text-sm border border-[var(--gold)] text-[var(--gold)] hover:bg-[var(--gold)] hover:text-[var(--black)] transition-colors tracking-wider uppercase relative z-10"
                >
                  {added ? t("common.addedToCart") : t("featured.addToCart")}
                </motion.button>
              ) : null}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
