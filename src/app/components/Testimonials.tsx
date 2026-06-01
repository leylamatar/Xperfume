import { motion } from "motion/react";
import { Star, Quote } from "lucide-react";
import { useTranslation } from "react-i18next";

export function Testimonials() {
  const { t } = useTranslation();

  const testimonials = [
    {
      id: 1,
      name: t("testimonials.testimonial1.name"),
      role: t("testimonials.testimonial1.role"),
      content: t("testimonials.testimonial1.content"),
      rating: 5,
    },
    {
      id: 2,
      name: t("testimonials.testimonial2.name"),
      role: t("testimonials.testimonial2.role"),
      content: t("testimonials.testimonial2.content"),
      rating: 5,
    },
    {
      id: 3,
      name: t("testimonials.testimonial3.name"),
      role: t("testimonials.testimonial3.role"),
      content: t("testimonials.testimonial3.content"),
      rating: 5,
    },
  ];

  return (
    <section className="relative py-32 px-6 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--background)] via-[var(--burgundy-dark)] to-[var(--background)]" />

      {/* Decorative Elements */}
      <motion.div
        className="absolute top-20 right-20 w-64 h-64 rounded-full bg-[var(--gold)] opacity-5 blur-3xl"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.05, 0.1, 0.05],
        }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-20 left-20 w-64 h-64 rounded-full bg-[var(--wine)] opacity-5 blur-3xl"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.05, 0.1, 0.05],
        }}
        transition={{ duration: 8, repeat: Infinity, delay: 2 }}
      />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <span className="text-[var(--gold)] tracking-[0.3em] uppercase text-sm">
            {t("testimonials.tagline")}
          </span>
          <h2
            className="text-6xl mt-4 text-foreground"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            {t("testimonials.title")}
          </h2>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
            >
              <motion.div
                whileHover={{ y: -10 }}
                transition={{ duration: 0.3 }}
                className="relative h-full p-8 bg-gradient-to-br from-[var(--black-soft)] to-[var(--burgundy-dark)] border border-[var(--border)] rounded-lg"
              >
                {/* Quote Icon */}
                <motion.div
                  className="absolute top-8 right-8 opacity-10"
                  whileHover={{ opacity: 0.2, scale: 1.1 }}
                >
                  <Quote className="w-16 h-16 text-[var(--gold)]" />
                </motion.div>

                {/* Rating */}
                <div className="flex gap-1 mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-[var(--gold)] text-[var(--gold)]"
                    />
                  ))}
                </div>

                {/* Content */}
                <p className="text-[var(--muted-foreground)] leading-relaxed mb-8 italic">
                  "{testimonial.content}"
                </p>

                {/* Author */}
                <div className="border-t border-[var(--border)] pt-6">
                  <p
                    className="text-foreground text-lg mb-1"
                    style={{ fontFamily: "Playfair Display, serif" }}
                  >
                    {testimonial.name}
                  </p>
                  <p className="text-[var(--gold)] text-sm tracking-wide">
                    {testimonial.role}
                  </p>
                </div>

                {/* Hover Glow */}
                <motion.div
                  className="absolute inset-0 rounded-lg bg-gradient-to-br from-[var(--gold)] to-transparent opacity-0 hover:opacity-5 transition-opacity duration-500"
                />
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
