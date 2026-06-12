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
          <div className="relative overflow-hidden rounded-lg bg-[#111111] p-8 border border-[rgba(255,255,255,0.08)]">
            {/* Glow Effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-[#E8E8E8] to-transparent opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none"
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
            <p className="text-[#CFCFCF] text-xs tracking-[0.2em] uppercase mb-2">
              {product.category}
            </p>
            <Link to={`/shop/${product.slug}`}>
              <h3
                className="text-xl mb-3 text-foreground hover:text-[#E8E8E8] transition-colors"
                style={{ fontFamily: "Playfair Display, serif" }}
              >
                {name}
              </h3>
            </Link>
            <p className="text-[#8A8A8A] text-sm mb-4">
              {short_description}
            </p>
            <div className="flex items-center justify-center gap-4">
              <span className="text-xl bg-clip-text text-transparent" style={{ backgroundImage: 'var(--metallic-gradient)' }}>
                ${Number(product.price).toLocaleString()}
              </span>
              {product.stock > 0 ? (
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleAddToCart}
                  className="px-6 py-2 text-sm border border-[#2A2A2A] text-[#000000] hover:text-[#000000] hover:bg-white transition-all tracking-wider uppercase relative z-10 shadow-[0_10px_30px_rgba(255,255,255,0.15)]"
                  style={{ backgroundImage: 'var(--metallic-gradient)' }}
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
