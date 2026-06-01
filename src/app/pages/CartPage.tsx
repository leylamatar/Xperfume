import { useState } from "react";
import { motion } from "motion/react";
import { Link, useNavigate } from "react-router";
import { Minus, Plus, X, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "../context/CartContext";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { useTranslation } from "react-i18next";

export function CartPage() {
  const { items, removeItem, updateQuantity, totalItems, totalPrice } = useCart();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const subtotal = totalPrice;
  const total = subtotal;

  return (
    <div className="min-h-screen bg-[var(--background)] pt-20">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-px bg-[var(--gold)]" />
            <span className="text-[var(--gold)] tracking-[0.3em] uppercase text-sm">{t('cart.headerLabel')}</span>
          </div>
          <h1
            className="text-5xl text-foreground"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            {t('cart.title')}
            {totalItems > 0 && (
              <span className="text-[var(--muted-foreground)] text-2xl ml-4">
                ({totalItems} {t(totalItems === 1 ? 'cart.itemSingular' : 'cart.itemPlural')})
              </span>
            )}
          </h1>
        </motion.div>

        {items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-24"
          >
            <ShoppingBag className="w-16 h-16 text-[var(--border)] mx-auto mb-6" />
            <h2
              className="text-3xl text-foreground mb-4"
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              {t('cart.emptyTitle')}
            </h2>
            <p className="text-[var(--muted-foreground)] mb-8">
              {t('cart.emptyDescription')}
            </p>
            <Link to="/shop">
              <motion.span
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-3 px-10 py-4 bg-[var(--gold)] text-[var(--black)] tracking-wider uppercase text-sm hover:bg-[var(--gold-light)] transition-colors"
              >
                {t('cart.exploreCollection')}
                <ArrowRight className="w-4 h-4" />
              </motion.span>
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              {items.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-gradient-to-b from-[var(--black-soft)] to-[var(--burgundy-dark)] border border-[var(--border)] p-6 flex gap-6"
                >
                  {/* Image */}
                  <Link to={`/shop/${item.id}`}>
                    <div className="w-24 h-32 shrink-0 overflow-hidden border border-[var(--border)]">
                      <ImageWithFallback
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </Link>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-[var(--gold)] text-xs tracking-[0.2em] uppercase mb-1">{item.collection}</p>
                    <Link to={`/shop/${item.id}`}>
                      <h3
                        className="text-xl text-foreground mb-1 hover:text-[var(--gold)] transition-colors"
                        style={{ fontFamily: "Playfair Display, serif" }}
                      >
                        {item.name}
                      </h3>
                    </Link>
                    <p className="text-[var(--muted-foreground)] text-sm mb-4">{item.size} Extrait de Parfum</p>

                    <div className="flex items-center justify-between flex-wrap gap-4">
                      {/* Quantity */}
                      <div className="flex items-center border border-[var(--border)]">
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-2 text-[var(--muted-foreground)] hover:text-[var(--gold)] transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </motion.button>
                        <span className="w-10 text-center text-foreground text-sm">{item.quantity}</span>
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-2 text-[var(--muted-foreground)] hover:text-[var(--gold)] transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </motion.button>
                      </div>

                      <p className="text-xl text-[var(--gold)]" style={{ fontFamily: "Playfair Display, serif" }}>
                        ${(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Remove */}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => removeItem(item.id)}
                    className="text-[var(--muted-foreground)] hover:text-[var(--wine)] transition-colors self-start"
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                </motion.div>
              ))}

              {/* Continue Shopping */}
              <Link to="/shop">
                <motion.span
                  whileHover={{ x: -4 }}
                  className="inline-flex items-center gap-2 text-[var(--gold)] hover:text-[var(--gold-light)] transition-colors text-sm tracking-wider"
                >
                  ← {t('cart.continueShopping')}
                </motion.span>
              </Link>
            </div>

            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="bg-gradient-to-b from-[var(--black-soft)] to-[var(--burgundy-dark)] border border-[var(--border)] p-8 sticky top-24">
                <h2
                  className="text-2xl text-foreground mb-8"
                  style={{ fontFamily: "Playfair Display, serif" }}
                >
                  {t('cart.orderSummary')}
                </h2>

                {/* Price Breakdown */}
                <div className="space-y-4 mb-6 pb-6 border-b border-[var(--border)]">
                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--muted-foreground)]">{t('cart.subtotal')}</span>
                    <span className="text-foreground">${subtotal.toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex justify-between mb-8">
                  <span className="text-foreground tracking-wider">{t('cart.total')}</span>
                  <span
                    className="text-2xl text-[var(--gold)]"
                    style={{ fontFamily: "Playfair Display, serif" }}
                  >
                    ${total.toLocaleString()}
                  </span>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate("/checkout")}
                  className="w-full py-4 bg-[var(--gold)] text-[var(--black)] tracking-[0.15em] uppercase text-sm hover:bg-[var(--gold-light)] transition-colors flex items-center justify-center gap-3"
                >
                  {t('cart.proceedToCheckout')}
                  <ArrowRight className="w-4 h-4" />
                </motion.button>

                <p className="text-[var(--muted-foreground)] text-xs text-center mt-4">
                  {t('cart.secureCheckout')}
                </p>

                {/* Trust */}
                <div className="mt-6 pt-6 border-t border-[var(--border)] grid grid-cols-3 gap-3 text-center">
                  {[
                    { icon: "🔒", key: 'sslSecured' },
                    { icon: "↩", key: 'returns' },
                    { icon: "✦", key: 'giftWrapped' },
                  ].map(({ icon, key }) => (
                    <div key={key}>
                      <p className="text-lg">{icon}</p>
                      <p className="text-[var(--muted-foreground)] text-xs mt-1">{t(`cart.${key}`)}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
