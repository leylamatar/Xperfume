import { motion } from "motion/react";
import { ShoppingBag, Search, Menu, X, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { useCart } from "../context/CartContext";
import { useSettings } from "../context/SettingsContext";
import { useLanguage } from "../context/LanguageContext";
import { useTranslation } from "react-i18next";

const NAV_LINKS = [
  { key: "shop", href: "/shop" },
  { key: "about", href: "/about" },
  { key: "contact", href: "/contact" },
];

const MOBILE_NAV_LINKS = [
  { key: "shop", href: "/shop" },
  { key: "about", href: "/about" },
  { key: "contact", href: "/contact" },
  { key: "cart", href: "/cart" },
];

export function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const { totalItems } = useCart();
  const { settings, loading } = useSettings();
  const { language, changeLanguage } = useLanguage();
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <>
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-[#000000]/95 backdrop-blur-lg border-b border-[#2A2A2A]"
            : "bg-transparent"
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 md:py-5 flex items-center justify-between">
          {/* Logo */}
          <Link to="/">
            <motion.div whileHover={{ scale: 1.03 }} className="flex items-center">
              {settings.logo_url ? (
                <img src={settings.logo_url} alt="Logo" className="h-12 md:h-16 object-contain" />
              ) : (
                <span className="text-2xl md:text-4xl tracking-tight cursor-pointer" style={{ fontFamily: "Playfair Display, serif" }}>
                  <span className="text-[#FFFFFF]">Élégance</span>{" "}
                  <span className="text-[#8A8A8A]">Absolue</span>
                </span>
              )}
            </motion.div>
          </Link>

          {/* Center Navigation */}
          <div className="hidden md:flex items-center gap-8 lg:gap-10">
            {NAV_LINKS.map((item) => (
              <Link key={item.key} to={item.href}>
                <motion.span
                  className={`text-sm tracking-wider uppercase relative group cursor-pointer transition-colors ${
                    location.pathname === item.href
                      ? "text-[#E8E8E8]"
                      : "text-[#8A8A8A] hover:text-[#E8E8E8]"
                  }`}
                  whileHover={{ y: -1 }}
                >
                  {t(`nav.${item.key}`)}
                  <span
                    className={`absolute bottom-0 left-0 h-px bg-[#E8E8E8] transition-all duration-300 ${
                      location.pathname === item.href ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  />
                </motion.span>
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3 md:gap-5">
            {/* Language Switcher */}
            <div className="relative hidden sm:block">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center gap-1 md:gap-2 text-[#8A8A8A] hover:text-[#E8E8E8] transition-colors text-xs md:text-sm tracking-wider uppercase"
              >
                {language === "ar" ? "العربية" : "EN"}
                <ChevronDown className="w-3 h-3 md:w-4 md:h-4" />
              </motion.button>
              {langDropdownOpen && (
                <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-[#111111] border border-[#2A2A2A] min-w-[100px] md:min-w-[120px] z-50">
                  <button
                    onClick={() => {
                      changeLanguage("en");
                      setLangDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 md:px-4 py-2 md:py-3 text-xs md:text-sm transition-colors ${
                      language === "en"
                        ? "text-[#E8E8E8]"
                        : "text-[#8A8A8A] hover:text-[#E8E8E8]"
                    }`}
                  >
                    English
                  </button>
                  <button
                    onClick={() => {
                      changeLanguage("ar");
                      setLangDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 md:px-4 py-2 md:py-3 text-xs md:text-sm transition-colors ${
                      language === "ar"
                        ? "text-[#E8E8E8]"
                        : "text-[#8A8A8A] hover:text-[#E8E8E8]"
                    }`}
                  >
                    العربية
                  </button>
                </div>
              )}
            </div>

            {/* Search */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setSearchOpen(!searchOpen)}
              className="text-[#E8E8E8] hover:text-[#FFFFFF] transition-colors"
            >
              <Search className="w-5 h-5" />
            </motion.button>

            {/* Cart */}
            <Link to="/cart">
              <motion.span
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="relative text-[#E8E8E8] hover:text-[#FFFFFF] transition-colors cursor-pointer"
              >
                <ShoppingBag className="w-5 h-5" />
                {totalItems > 0 && (
                  <motion.span
                    key={totalItems}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 w-5 h-5 bg-[#2A2A2A] rounded-full text-white text-xs flex items-center justify-center"
                  >
                    {totalItems}
                  </motion.span>
                )}
              </motion.span>
            </Link>

            {/* Mobile Menu */}
            <div className="flex items-center gap-3 md:hidden">
              {/* Mobile Language Switcher */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => changeLanguage(language === "en" ? "ar" : "en")}
                className="text-[#E8E8E8] hover:text-[#FFFFFF] transition-colors text-xs tracking-wider uppercase"
              >
                {language === "ar" ? "العربية" : "EN"}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setMobileOpen(!mobileOpen)}
                className="text-[#E8E8E8]"
              >
                {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        {searchOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t border-[#2A2A2A] bg-[#000000]/95 backdrop-blur-lg"
          >
            <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A8A8A]" />
                <input
                  autoFocus
                  type="text"
                  placeholder="Search fragrances, collections…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      if (searchQuery.trim()) {
                        navigate(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
                      } else {
                        navigate("/shop");
                      }
                      setSearchOpen(false);
                    }
                  }}
                  className="w-full pl-12 pr-12 py-3 bg-transparent border border-[#2A2A2A] text-foreground placeholder:text-[#8A8A8A] focus:outline-none focus:border-[#E8E8E8] transition-colors"
                />
                <button
                  onClick={() => { setSearchOpen(false); setSearchQuery(""); }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8A8A8A] hover:text-[#E8E8E8] transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </motion.nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, x: "100%" }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: "100%" }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="fixed inset-0 z-40 bg-[#000000]/98 backdrop-blur-xl flex flex-col items-center justify-center"
        >
          {/* Close button for mobile menu */}
          <button
            onClick={() => setMobileOpen(false)}
            className="absolute top-6 right-6 text-[#E8E8E8]"
          >
            <X className="w-8 h-8" />
          </button>

          <nav className="flex flex-col items-center gap-8">
            {MOBILE_NAV_LINKS.map((item, index) => (
              <Link key={item.key} to={item.href}>
                <motion.span
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-2xl md:text-3xl text-foreground hover:text-[#E8E8E8] transition-colors cursor-pointer"
                  style={{ fontFamily: "Playfair Display, serif" }}
                >
                  {t(`nav.${item.key}`)}
                </motion.span>
              </Link>
            ))}
          </nav>
        </motion.div>
      )}
    </>
  );
}
