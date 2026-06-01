import { motion } from "motion/react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { useTranslation } from "react-i18next";

const valuesIcons = ["◈", "◆", "◉"];

export function AboutPage() {
  const { t } = useTranslation();

  const values = [
    {
      title: t("about.values.quality.title"),
      description: t("about.values.quality.desc"),
      icon: valuesIcons[0],
    },
    {
      title: t("about.values.craft.title"),
      description: t("about.values.craft.desc"),
      icon: valuesIcons[1],
    },
    {
      title: t("about.values.vision.title"),
      description: t("about.values.vision.desc"),
      icon: valuesIcons[2],
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Hero */}
      <section className="relative h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--black)] via-[var(--burgundy-dark)]/80 to-transparent z-10" />
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1680503504148-25f2d178ff05?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHxwZXJmdW1lJTIwc21va2UlMjBtaXN0JTIwZWxlZ2FudHxlbnwxfHx8fDE3NzkwOTE0MjZ8MA&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Our atelier"
            className="h-full w-full object-cover opacity-50"
          />
        </div>

        <div className="relative z-20 max-w-7xl mx-auto px-6 pt-20">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <p className="text-[var(--gold)] tracking-[0.4em] uppercase text-sm mb-6">{t("about.hero.tagline")}</p>
            <h1
              className="text-6xl md:text-8xl lg:text-9xl text-foreground mb-8 leading-none"
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              {t("about.hero.titlePart1")}
              <br />
              <em className="text-[var(--gold)]">{t("about.hero.titlePart2")}</em>
            </h1>
            <p className="text-[var(--muted-foreground)] text-xl max-w-lg leading-relaxed">
              {t("about.hero.description")}
            </p>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[var(--background)] to-transparent z-20" />
      </section>

      {/* Philosophy */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-px bg-[var(--gold)]" />
                <span className="text-[var(--gold)] tracking-[0.3em] uppercase text-sm">{t("about.philosophy.tagline")}</span>
              </div>
              <h2
                className="text-5xl md:text-6xl text-foreground mb-8"
                style={{ fontFamily: "Playfair Display, serif" }}
              >
                {t("about.philosophy.titlePart1")}
                <br />
                <em>{t("about.philosophy.titlePart2")}</em>
              </h2>
              <p className="text-[var(--muted-foreground)] text-lg leading-relaxed mb-6">
                {t("about.philosophy.para1")}
              </p>
              <p className="text-[var(--muted-foreground)] text-lg leading-relaxed mb-6">
                {t("about.philosophy.para2")}
              </p>
              <p className="text-[var(--muted-foreground)] text-lg leading-relaxed">
                {t("about.philosophy.para3")}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="relative">
                <div className="aspect-[3/4] overflow-hidden border border-[var(--border)]">
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1666621630026-862eea07236c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw0fHxwZXJmdW1lJTIwc21va2UlMjBtaXN0JTIwZWxlZ2FudHxlbnwxfHx8fDE3NzkwOTE0MjZ8MA&ixlib=rb-4.1.0&q=80&w=1080"
                    alt="Perfume atelier"
                    className="h-full w-full object-cover"
                  />
                </div>
                {/* Gold accent box */}
                <div className="absolute -bottom-6 -right-6 w-48 h-48 border-2 border-[var(--gold)] opacity-30" />
                <div className="absolute -top-6 -left-6 w-24 h-24 border border-[var(--gold)] opacity-20" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 px-6 bg-gradient-to-b from-[var(--black-soft)] to-[var(--background)]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-px bg-[var(--gold)]" />
              <span className="text-[var(--gold)] tracking-[0.3em] uppercase text-sm">{t("about.values.tagline")}</span>
              <div className="w-12 h-px bg-[var(--gold)]" />
            </div>
            <h2
              className="text-5xl text-foreground"
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              {t("about.values.title")}
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="bg-gradient-to-b from-[var(--black-soft)] to-[var(--burgundy-dark)] border border-[var(--border)] p-8"
              >
                <p className="text-[var(--gold)] text-3xl mb-6">{value.icon}</p>
                <h3
                  className="text-2xl text-foreground mb-4"
                  style={{ fontFamily: "Playfair Display, serif" }}
                >
                  {value.title}
                </h3>
                <p className="text-[var(--muted-foreground)] leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Founder Story */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="order-2 lg:order-1"
            >
              <div className="relative aspect-square overflow-hidden border border-[var(--border)]">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1643797517714-a273548abc3c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw1fHxwZXJmdW1lJTIwc21va2UlMjBtaXN0JTIwZWxlZ2FudHxlbnwxfHx8fDE3NzkwOTE0MjZ8MA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Marie-Claire Fontaine"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--burgundy-dark)]/60 to-transparent" />
                <div className="absolute bottom-6 left-6">
                  <p className="text-[var(--gold)] text-xs tracking-[0.2em] uppercase mb-1">{t("about.founder.role")}</p>
                  <p className="text-foreground text-xl" style={{ fontFamily: "Playfair Display, serif" }}>
                    {t("about.founder.name")}
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="order-1 lg:order-2"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-px bg-[var(--gold)]" />
                <span className="text-[var(--gold)] tracking-[0.3em] uppercase text-sm">{t("about.founder.tagline")}</span>
              </div>
              <h2
                className="text-5xl text-foreground mb-8"
                style={{ fontFamily: "Playfair Display, serif" }}
              >
                {t("about.founder.titlePart1")}
                <br />
                <em>{t("about.founder.titlePart2")}</em>
              </h2>
              <p className="text-[var(--muted-foreground)] text-lg leading-relaxed mb-6">
                {t("about.founder.para1")}
              </p>
              <p className="text-[var(--muted-foreground)] text-lg leading-relaxed mb-6">
                {t("about.founder.para2")}
              </p>
              <p className="text-[var(--muted-foreground)] text-lg leading-relaxed">
                {t("about.founder.para3")}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24 px-6 bg-gradient-to-b from-[var(--background)] to-[var(--black-soft)]">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-px bg-[var(--gold)]" />
              <span className="text-[var(--gold)] tracking-[0.3em] uppercase text-sm">{t("about.timeline.tagline")}</span>
              <div className="w-12 h-px bg-[var(--gold)]" />
            </div>
            <h2
              className="text-5xl text-foreground"
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              {t("about.timeline.title")}
            </h2>
          </motion.div>

          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-px bg-[var(--border)]" />
            <div className="space-y-12">
              {[0,1,2,3,4,5].map((index) => {
                const item = t(`about.timeline.items.${index}`, { returnObjects: true }) as { year: string; title: string; desc: string };
                return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="relative pl-20"
                >
                  <div className="absolute left-5 top-2 w-6 h-6 rounded-full border-2 border-[var(--gold)] bg-[var(--background)] flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-[var(--gold)]" />
                  </div>
                  <p className="text-[var(--gold)] text-sm tracking-[0.2em] mb-2">{item.year}</p>
                  <h3
                    className="text-2xl text-foreground mb-3"
                    style={{ fontFamily: "Playfair Display, serif" }}
                  >
                    {item.title}
                  </h3>
                  <p className="text-[var(--muted-foreground)] leading-relaxed">{item.desc}</p>
                </motion.div>
              )})}
            </div>
          </div>
        </div>
      </section>

      {/* Craftsmanship CTA */}
      <section className="py-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2
              className="text-5xl md:text-6xl text-foreground mb-8"
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              {t("about.cta.titlePart1")}
              <br />
              <em className="text-[var(--gold)]">{t("about.cta.titlePart2")}</em>
            </h2>
            <p className="text-[var(--muted-foreground)] text-lg mb-12 max-w-2xl mx-auto leading-relaxed">
              {t("about.cta.description")}
            </p>
            <motion.a
              href="/shop"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block px-12 py-4 bg-[var(--gold)] text-[var(--black)] tracking-[0.15em] uppercase text-sm hover:bg-[var(--gold-light)] transition-colors"
            >
              {t("about.cta.button")}
            </motion.a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
