import { motion } from "motion/react";
import { ChevronDown } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Link } from "react-router";
import { useTranslatedSetting } from "../hooks/useTranslationHelpers";

export function Hero() {
  const heroSubtitle = useTranslatedSetting("hero_subtitle", "Maison de Parfum");
  const heroTitle = useTranslatedSetting("hero_title", "Élégance\nAbsolue");
  const heroDescription = useTranslatedSetting("hero_description", "Discover the essence of luxury with our exclusive collection of niche perfumes. Each fragrance tells a story of sophistication and timeless elegance.");
  const heroButtonText = useTranslatedSetting("hero_button_text", "Explore Collection");

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Background with Parallax */}
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#000000] via-[#080808] to-[#000000]" />
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1774682060992-46c7e9f2e50b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBwZXJmdW1lJTIwYm90dGxlJTIwZWxlZ2FudCUyMGRhcmslMjBiYWNrZ3JvdW5kfGVufDF8fHx8MTc3OTA5MTQyNHww&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Luxury perfume"
          className="h-full w-full object-cover opacity-25"
        />
      </motion.div>

      {/* Floating Silver Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-[#E8E8E8] rounded-full opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="mb-4"
        >
          <span className="text-[#CFCFCF] tracking-[0.3em] uppercase text-sm">
            {heroSubtitle}
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mb-6 text-7xl md:text-8xl lg:text-9xl tracking-tight"
          style={{ fontFamily: "Playfair Display, serif" }}
        >
          {heroTitle.split("\n").map((line, i) => (
            <span key={i}>
              {i % 2 === 0 ? (
                <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'var(--metallic-gradient)' }}>{line}</span>
              ) : (
                <span className="text-foreground">{line}</span>
              )}
              {i < heroTitle.split("\n").length - 1 && <br />}
            </span>
          ))}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.7 }}
          className="mb-12 max-w-2xl text-lg text-[#8A8A8A] leading-relaxed"
        >
          {heroDescription}
        </motion.p>

        <Link to="/shop">
          <motion.button
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.9 }}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="group relative px-12 py-4 overflow-hidden text-[#000000] tracking-wider uppercase transition-all"
            style={{ backgroundImage: 'var(--metallic-gradient)' }}
          >
            <motion.div
              className="absolute inset-0 bg-white"
              initial={{ x: "-100%" }}
              whileHover={{ x: 0 }}
              transition={{ duration: 0.3 }}
            />
            <span className="relative z-10">{heroButtonText}</span>
          </motion.button>
        </Link>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-12 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ChevronDown className="w-8 h-8 text-[#8A8A8A] opacity-60" />
        </motion.div>
      </div>

      {/* Gradient Overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[var(--background)] to-transparent" />
    </section>
  );
}
