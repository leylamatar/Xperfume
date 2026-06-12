import { motion } from "motion/react";
import { Instagram, Facebook, Twitter, Mail } from "lucide-react";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import { useTranslatedSetting } from "../hooks/useTranslationHelpers";
import { useSettings } from "../context/SettingsContext";

export function Footer() {
  const { t } = useTranslation();
  const { settings } = useSettings();
  const footerDescription = useTranslatedSetting("footer_description", "Crafting timeless fragrances since 1847. Discover the essence of luxury with our exclusive collection of niche perfumes, created with the world's finest raw ingredients.");
  return (
    <footer className="relative py-20 px-6 border-t border-[#2A2A2A]">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="md:col-span-2">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <Link to="/">
                {settings.logo_url ? (
                  <img src={settings.logo_url} alt="Logo" className="h-12 md:h-16 mb-4 object-contain" />
                ) : (
                  <span
                    className="text-4xl mb-4 bg-clip-text text-transparent block cursor-pointer hover:opacity-90 transition-opacity"
                    style={{ fontFamily: "Playfair Display, serif", backgroundImage: 'var(--metallic-gradient)' }}
                  >
                    Élégance Absolue
                  </span>
                )}
              </Link>
              <p className="text-[#8A8A8A] mb-6 max-w-md leading-relaxed">
                {footerDescription}
              </p>
              <div className="flex gap-4">
                {[Instagram, Facebook, Twitter, Mail].map((Icon, index) => (
                  <motion.a
                    key={index}
                    href="#"
                    whileHover={{ scale: 1.2, y: -2 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-3 border border-[#2A2A2A] text-[#E8E8E8] hover:bg-white hover:text-[#000000] transition-colors"
                  >
                    <Icon className="w-5 h-5" />
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Shop Links */}
          <div>
            <h4 className="text-foreground mb-6 tracking-wider uppercase text-sm">{t("footer.shop")}</h4>
            <ul className="space-y-3">
              {[
                { label: t("footer.allFragrances"), href: "/shop" },
                { label: t("footer.newArrivals"), href: "/shop" },
                { label: t("footer.bestSellers"), href: "/shop" },
                { label: t("footer.giftSets"), href: "/shop" },
              ].map(({ label, href }, index) => (
                <motion.li key={index} whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                  <Link to={href}>
                    <span className="text-[#8A8A8A] hover:text-[#E8E8E8] transition-colors cursor-pointer">
                      {label}
                    </span>
                  </Link>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Discover Links */}
          <div>
            <h4 className="text-foreground mb-6 tracking-wider uppercase text-sm">{t("footer.discover")}</h4>
            <ul className="space-y-3">
              {[
                { label: t("footer.ourStory"), href: "/about" },
                { label: t("footer.contactUs"), href: "/contact" },
              ].map(({ label, href }, index) => (
                <motion.li key={index} whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                  <Link to={href}>
                    <span className="text-[#8A8A8A] hover:text-[#E8E8E8] transition-colors cursor-pointer">
                      {label}
                    </span>
                  </Link>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-[#2A2A2A] pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-[#8A8A8A]">
          <p>{t("footer.copyright")}</p>
          <div className="flex gap-6">
            {[t("footer.privacyPolicy"), t("footer.termsOfService"), t("footer.shippingPolicy")].map((item, index) => (
              <a key={index} href="#" className="hover:text-[#E8E8E8] transition-colors">
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
