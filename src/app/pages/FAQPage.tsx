import { useState } from "react";
import { motion } from "motion/react";
import { ChevronDown } from "lucide-react";
import { faqs } from "../data/products";

const categories = ["All Questions", "Products", "Orders & Shipping", "Care & Storage", "Sustainability"];

export function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [activeCategory, setActiveCategory] = useState("All Questions");

  return (
    <div className="min-h-screen bg-[var(--background)] pt-20">
      {/* Hero */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-12 h-px bg-[var(--gold)]" />
              <span className="text-[var(--gold)] tracking-[0.3em] uppercase text-sm">Help Center</span>
              <div className="w-12 h-px bg-[var(--gold)]" />
            </div>
            <h1
              className="text-6xl md:text-7xl text-foreground mb-6"
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              Frequently Asked
              <br />
              <em className="text-[var(--gold)]">Questions</em>
            </h1>
            <p className="text-[var(--muted-foreground)] text-lg max-w-2xl mx-auto leading-relaxed">
              Everything you need to know about Élégance Absolue fragrances, orders, and services.
              If you don't find your answer here, our client advisors are always available.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="px-6 pb-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-wrap gap-2 mb-12">
            {categories.map((cat) => (
              <motion.button
                key={cat}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 text-sm tracking-wider uppercase transition-all ${
                  activeCategory === cat
                    ? "bg-[var(--gold)] text-[var(--black)]"
                    : "border border-[var(--border)] text-[var(--muted-foreground)] hover:border-[var(--gold)] hover:text-[var(--gold)]"
                }`}
              >
                {cat}
              </motion.button>
            ))}
          </div>

          {/* Accordion */}
          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.06 }}
              >
                <div
                  className={`border transition-colors ${
                    openIndex === index
                      ? "border-[var(--gold)]/50 bg-gradient-to-b from-[var(--black-soft)] to-[var(--burgundy-dark)]"
                      : "border-[var(--border)] bg-[var(--black-soft)] hover:border-[var(--gold)]/30"
                  }`}
                >
                  <button
                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                    className="w-full text-left px-8 py-6 flex items-center justify-between gap-4"
                  >
                    <span
                      className={`text-lg transition-colors ${
                        openIndex === index ? "text-[var(--gold)]" : "text-foreground"
                      }`}
                      style={{ fontFamily: "Playfair Display, serif" }}
                    >
                      {faq.question}
                    </span>
                    <motion.div
                      animate={{ rotate: openIndex === index ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="shrink-0"
                    >
                      <ChevronDown
                        className={`w-5 h-5 transition-colors ${
                          openIndex === index ? "text-[var(--gold)]" : "text-[var(--muted-foreground)]"
                        }`}
                      />
                    </motion.div>
                  </button>

                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35 }}
                      className="overflow-hidden"
                    >
                      <div className="px-8 pb-8">
                        <div className="w-12 h-px bg-[var(--gold)] mb-6" />
                        <p className="text-[var(--muted-foreground)] leading-relaxed text-lg">
                          {faq.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-b from-[var(--black-soft)] to-[var(--burgundy-dark)] border border-[var(--border)] p-12 text-center"
          >
            <p className="text-[var(--gold)] text-sm tracking-[0.3em] uppercase mb-4">Still Have Questions?</p>
            <h2
              className="text-4xl text-foreground mb-4"
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              We're Here to Help
            </h2>
            <p className="text-[var(--muted-foreground)] mb-8 max-w-lg mx-auto">
              Our client advisors are available six days a week for personalized assistance
              with any questions about our fragrances or services.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.a
                href="/contact"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-[var(--gold)] text-[var(--black)] tracking-[0.15em] uppercase text-sm hover:bg-[var(--gold-light)] transition-colors"
              >
                Contact Us
              </motion.a>
              
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
