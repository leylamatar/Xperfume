import { useState, useMemo, useEffect } from "react";
import { motion } from "motion/react";
import { SlidersHorizontal, Search, ChevronDown, Star, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { useCart } from "../context/CartContext";
import { Link, useNavigate, useSearchParams } from "react-router";
import { supabase } from "../lib/supabase";
import { useTranslatedProduct, useTranslatedCategory } from "../hooks/useTranslationHelpers";
import { useTranslation } from "react-i18next";

const sortOptions = ["Featured", "Price: Low to High", "Price: High to Low", "Newest"];
const priceRanges = [
  { label: "All Prices", min: 0, max: Infinity },
  { label: "Under $350", min: 0, max: 350 },
  { label: "$350 – $450", min: 350, max: 450 },
  { label: "$450 – $550", min: 450, max: 550 },
  { label: "Above $550", min: 550, max: Infinity },
];

export function ShopPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeSort, setActiveSort] = useState("Featured");
  const [activePriceRange, setActivePriceRange] = useState(priceRanges[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [addedProductId, setAddedProductId] = useState<string | null>(null);
  const { addItem } = useCart();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Sync search query from URL
  useEffect(() => {
    const q = searchParams.get("q");
    if (q !== null) {
      setSearchQuery(q);
    }
  }, [searchParams]);

  // Update URL when local search query changes
  const handleLocalSearchChange = (value: string) => {
    setSearchQuery(value);
    if (value) {
      navigate(`/shop?q=${encodeURIComponent(value)}`, { replace: true });
    } else {
      navigate("/shop", { replace: true });
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      setError(null);

      // Fetch products without is_active filter first (if table doesn't have it)
      const productsResult = await supabase.from("products").select("*");
      const categoriesResult = await supabase.from("categories").select("*").order("sort_order", { ascending: true });
      
      console.log("Shop page products data:", productsResult.data);
      console.log("Shop page products error:", productsResult.error);
      
      if (productsResult.error) throw productsResult.error;
      if (categoriesResult.error) throw categoriesResult.error;

      setProducts(productsResult.data || []);
      setCategories(categoriesResult.data || []);
    } catch (err: any) {
      console.error("Error loading data:", err);
      setError("Products could not be loaded");
    } finally {
      setLoading(false);
    }
  }

  const filtered = useMemo(() => {
    let result = [...products];
    if (activeCategory) {
      result = result.filter(
        (p) => p.category_id === activeCategory
      );
    }
    result = result.filter(
      (p) => p.price >= activePriceRange.min && p.price <= activePriceRange.max
    );
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name?.toLowerCase().includes(lowerQuery) ||
          p.name_en?.toLowerCase().includes(lowerQuery) ||
          p.name_ar?.toLowerCase().includes(lowerQuery) ||
          p.description?.toLowerCase().includes(lowerQuery) ||
          p.description_en?.toLowerCase().includes(lowerQuery) ||
          p.description_ar?.toLowerCase().includes(lowerQuery) ||
          p.category?.toLowerCase().includes(lowerQuery)
      );
    }
    switch (activeSort) {
      case "Price: Low to High":
        result.sort((a, b) => Number(a.price) - Number(b.price));
        break;
      case "Price: High to Low":
        result.sort((a, b) => Number(b.price) - Number(a.price));
        break;
      case "Newest":
        result = result.filter((p) => p.is_featured).concat(result.filter((p) => !p.is_featured));
        break;
      case "Featured":
        result = result.filter((p) => p.is_featured).concat(result.filter((p) => !p.is_featured));
        break;
    }
    return result;
  }, [products, activeCategory, activeSort, activePriceRange, searchQuery]);

  const handleAddToCart = (e: React.MouseEvent, product: any, translatedName: string) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id: product.id,
      name: translatedName,
      collection: product.category || "",
      price: Number(product.price),
      priceFormatted: `$${Number(product.price).toLocaleString()}`,
      image: product.image_url || "",
      size: product.size_ml ? `${product.size_ml}ml` : "",
    });
    setAddedProductId(product.id);
    toast.success(t("common.addedToCart"), {
      description: t("common.productAddedSuccessfully"),
    });
    setTimeout(() => setAddedProductId(null), 2000);
  };

  if (loading) return (
    <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
      <Loader2 className="w-10 h-10 text-[var(--gold)] animate-spin" />
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
      <p className="text-[var(--muted-foreground)] text-lg">{error}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <section className="relative h-72 md:h-96 flex items-end overflow-hidden pt-20">
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--burgundy-dark)] via-[var(--black-soft)] to-[var(--background)]" />
        <div className="absolute inset-0 opacity-20">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1680503504148-25f2d178ff05?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHxwZXJmdW1lJTIwc21va2UlMjBtaXN0JTIwZWxlZ2FudHxlbnwxfHx8fDE3NzkwOTE0MjZ8MA&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Shop collection"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 pb-12 w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-[var(--gold)] tracking-[0.3em] uppercase text-sm mb-3">
              {t("shop.collection")}
            </p>
            <h1
              className="text-5xl md:text-7xl text-foreground"
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              {t("shop.title")}
            </h1>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row gap-4 mb-10 items-start md:items-center justify-between">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
            <input
              type="text"
              placeholder={t("shop.searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => handleLocalSearchChange(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") e.currentTarget.blur(); }}
              className="w-full pl-12 pr-4 py-3 bg-[var(--input-background)] border border-[var(--border)] text-foreground placeholder:text-[var(--muted-foreground)] focus:outline-none focus:border-[var(--gold)] transition-colors text-sm"
            />
          </div>

          <div className="flex items-center gap-4">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-5 py-3 border border-[var(--border)] text-[var(--muted-foreground)] hover:border-[var(--gold)] hover:text-[var(--gold)] transition-colors text-sm tracking-wider"
            >
              <SlidersHorizontal className="w-4 h-4" />
              {t("shop.filters")}
            </motion.button>

            <div className="relative">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setSortOpen(!sortOpen)}
                className="flex items-center gap-2 px-5 py-3 border border-[var(--border)] text-[var(--muted-foreground)] hover:border-[var(--gold)] hover:text-[var(--gold)] transition-colors text-sm tracking-wider"
              >
                {activeSort}
                <ChevronDown className="w-4 h-4" />
              </motion.button>
              {sortOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 bg-[var(--black-soft)] border border-[var(--border)] z-20">
                  {sortOptions.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => { setActiveSort(opt); setSortOpen(false); }}
                      className={`w-full text-left px-5 py-3 text-sm transition-colors hover:text-[var(--gold)] hover:bg-[var(--burgundy-dark)] ${activeSort === opt ? "text-[var(--gold)]" : "text-[var(--muted-foreground)]"}`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <span className="text-[var(--muted-foreground)] text-sm">
              {filtered.length} {filtered.length === 1 ? t("shop.result") : t("shop.results")}
            </span>
          </div>
        </div>

        <div className="flex gap-2 flex-wrap mb-8">
          <motion.button
            key="all"
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveCategory(null)}
            className={`px-6 py-2 text-sm tracking-wider uppercase transition-all ${
              !activeCategory
                ? "bg-[var(--gold)] text-[var(--black)]"
                : "border border-[var(--border)] text-[var(--muted-foreground)] hover:border-[var(--gold)] hover:text-[var(--gold)]"
            }`}
          >
            {t("shop.all")}
          </motion.button>
          {categories.map((cat) => (
            <motion.button
              key={cat.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-6 py-2 text-sm tracking-wider uppercase transition-all ${
                activeCategory === cat.id
                  ? "bg-[var(--gold)] text-[var(--black)]"
                  : "border border-[var(--border)] text-[var(--muted-foreground)] hover:border-[var(--gold)] hover:text-[var(--gold)]"
              }`}
            >
              {cat.name}
            </motion.button>
          ))}
        </div>

        <div className="flex gap-10">
          {showFilters && (
            <motion.aside
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="w-64 shrink-0"
            >
              <div className="bg-[var(--black-soft)] border border-[var(--border)] p-6 sticky top-24">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-foreground tracking-wider uppercase text-sm">{t("shop.filters")}</h3>
                  <button onClick={() => setShowFilters(false)} className="text-[var(--muted-foreground)] hover:text-[var(--gold)]">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="mb-8">
                  <h4 className="text-[var(--gold)] text-xs tracking-[0.2em] uppercase mb-4">Price Range</h4>
                  <div className="space-y-2">
                    {priceRanges.map((range) => (
                      <button
                        key={range.label}
                        onClick={() => setActivePriceRange(range)}
                        className={`w-full text-left text-sm py-2 transition-colors ${
                          activePriceRange.label === range.label
                            ? "text-[var(--gold)]"
                            : "text-[var(--muted-foreground)] hover:text-foreground"
                        }`}
                      >
                        {activePriceRange.label === range.label ? "▸ " : "  "}
                        {range.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.aside>
          )}

          <div className="flex-1">
            {filtered.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-[var(--muted-foreground)] text-lg mb-4">{t("shop.noProducts")}</p>
                <button
                  onClick={() => { setActiveCategory(null); setSearchQuery(""); setActivePriceRange(priceRanges[0]); }}
                  className="text-[var(--gold)] tracking-wider uppercase text-sm border border-[var(--gold)] px-6 py-2 hover:bg-[var(--gold)] hover:text-[var(--black)] transition-colors"
                >
                  {t("shop.clearFilters")}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {filtered.map((product, index) => {
                  const { name, short_description } = {
                    name: product.name_ar || product.name_en || product.name,
                    short_description: product.short_description_ar || product.short_description_en || product.short_description,
                  };
                  return (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 40 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: (index % 3) * 0.1 }}
                    >
                      <motion.div
                        className="group relative cursor-pointer"
                        whileHover={{ y: -8 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="relative overflow-hidden bg-gradient-to-b from-[var(--black-soft)] to-[var(--burgundy-dark)] border border-[var(--border)]">
                          <div className="absolute top-4 left-4 z-10 flex gap-2">
                            {product.is_featured && (
                              <span className="bg-[var(--gold)] text-[var(--black)] text-xs px-3 py-1 tracking-wider uppercase">{t("featured.tagline")}</span>
                            )}
                          </div>

                          <Link to={`/shop/${product.slug}`}>
                            <div className="relative aspect-[3/4] overflow-hidden">
                              <motion.div
                                whileHover={{ scale: 1.08, rotate: 1 }}
                                transition={{ duration: 0.6 }}
                                className="h-full"
                              >
                                <ImageWithFallback
                                  src={product.image_url || "https://images.unsplash.com/photo-1774682060997-f8959850a7d4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg"}
                                  alt={name}
                                  className="h-full w-full object-cover"
                                />
                              </motion.div>
                            </div>
                          </Link>

                          <div className="p-6">
                            <p className="text-[var(--gold)] text-xs tracking-[0.2em] uppercase mb-2">{product.category}</p>
                            <Link to={`/shop/${product.slug}`}>
                              <h3
                                className="text-xl mb-2 text-foreground hover:text-[var(--gold)] transition-colors"
                                style={{ fontFamily: "Playfair Display, serif" }}
                              >
                                {name}
                              </h3>
                            </Link>
                            <p className="text-[var(--muted-foreground)] text-sm mb-4">{short_description}</p>
                            <div className="flex items-center justify-between">
                              <div>
                                {product.old_price && (
                                  <span className="text-[var(--muted-foreground)] line-through text-sm mr-2">${Number(product.old_price).toLocaleString()}</span>
                                )}
                                <span className="text-xl text-[var(--gold)]">${Number(product.price).toLocaleString()}</span>
                              </div>
                              {product.stock > 0 ? (
                                <motion.button
                                  type="button"
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={(e) => handleAddToCart(e, product, name)}
                                  className="px-5 py-2 text-xs border border-[var(--gold)] text-[var(--gold)] hover:bg-[var(--gold)] hover:text-[var(--black)] transition-colors tracking-wider uppercase"
                                >
                                  {addedProductId === product.id ? t("common.addedToCart") : t("featured.addToCart")}
                                </motion.button>
                              ) : (
                                <span className="text-[var(--muted-foreground)] text-xs tracking-wider uppercase">Out of Stock</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
