import { motion } from "motion/react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useTranslation } from "react-i18next";

export function BrandStory() {
  const { t } = useTranslation();

  return (
    <section className="relative py-32 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Image Side */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative aspect-[4/5] rounded-lg overflow-hidden">
              {/* Main Image */}
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1760860992203-85ca32536788?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxMHx8bHV4dXJ5JTIwcGVyZnVtZSUyMGJvdHRsZSUyMGVsZWdhbnQlMjBkYXJrJTIwYmFja2dyb3VuZHxlbnwxfHx8fDE3NzkwOTE0MjR8MA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Brand story"
                className="h-full w-full object-cover"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-tr from-[#000000] via-transparent to-transparent opacity-40" />

              {/* Decorative Border */}
              <motion.div
                className="absolute inset-0 border-2 border-[#E8E8E8] opacity-0"
                whileHover={{ opacity: 0.5 }}
                transition={{ duration: 0.4 }}
              />
            </div>

            {/* Floating Accent */}
            <motion.div
              className="absolute -bottom-8 -right-8 w-32 h-32 bg-gradient-to-br from-[#E8E8E8] to-[#8A8A8A] rounded-full blur-3xl opacity-30"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{ duration: 4, repeat: Infinity }}
            />
          </motion.div>

          {/* Content Side */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-[#CFCFCF] tracking-[0.3em] uppercase text-sm">
              {t("brandStory.tagline")}
            </span>
            <h2
              className="text-6xl mt-4 mb-6 text-foreground"
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              {t("brandStory.titlePart1")}
              <br />
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'var(--metallic-gradient)' }}>{t("brandStory.titlePart2")}</span>
            </h2>
            <div className="space-y-6 text-[#8A8A8A] leading-relaxed">
              <p>
                {t("brandStory.paragraph1")}
              </p>
              <p>
                {t("brandStory.paragraph2")}
              </p>
              <p>
                {t("brandStory.paragraph3")}
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 mt-12">
              <div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="text-4xl mb-2"
                  style={{ fontFamily: "Playfair Display, serif" }}
                >
                  <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'var(--metallic-gradient)' }}>{t("brandStory.stat1")}</span>
                </motion.div>
                <p className="text-sm text-[#8A8A8A]">
                  {t("brandStory.stat1Label")}
                </p>
              </div>
              <div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="text-4xl mb-2"
                  style={{ fontFamily: "Playfair Display, serif" }}
                >
                  <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'var(--metallic-gradient)' }}>{t("brandStory.stat2")}</span>
                </motion.div>
                <p className="text-sm text-[#8A8A8A]">
                  {t("brandStory.stat2Label")}
                </p>
              </div>
              <div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="text-4xl mb-2"
                  style={{ fontFamily: "Playfair Display, serif" }}
                >
                  <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'var(--metallic-gradient)' }}>{t("brandStory.stat3")}</span>
                </motion.div>
                <p className="text-sm text-[#8A8A8A]">
                  {t("brandStory.stat3Label")}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
