import { useState } from "react";
import { motion } from "motion/react";
import { MapPin, Phone, Mail, Clock, Instagram, Facebook, Twitter } from "lucide-react";
import { useTranslation } from "react-i18next";



export function ContactPage() {
  const { t } = useTranslation();
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
    setForm({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-[var(--background)] pt-20">
      {/* Hero */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-px bg-[var(--gold)]" />
              <span className="text-[var(--gold)] tracking-[0.3em] uppercase text-sm">{t('contact.info')}</span>
            </div>
            <h1
              className="text-6xl md:text-7xl text-foreground mb-6"
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              {t('contact.title')}
            </h1>
            <p className="text-[var(--muted-foreground)] text-lg leading-relaxed">
              {t('contact.subtitle')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Form + Info */}
      <section className="px-6 pb-24">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-16">
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-3"
            >
              <h2
                className="text-3xl text-foreground mb-8"
                style={{ fontFamily: "Playfair Display, serif" }}
              >
                {t('contact.sendMessage')}
              </h2>

              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-b from-[var(--black-soft)] to-[var(--burgundy-dark)] border border-[var(--gold)] p-8 text-center"
                >
                  <p className="text-[var(--gold)] text-3xl mb-4">◈</p>
                  <h3 className="text-foreground text-xl mb-2" style={{ fontFamily: "Playfair Display, serif" }}>
                    Message Received
                  </h3>
                  <p className="text-[var(--muted-foreground)]">
                    Thank you for contacting us. A member of our team will respond within 24 hours.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[var(--muted-foreground)] text-sm tracking-wider uppercase mb-2">
                        {t('contact.fullName')}
                      </label>
                      <input
                        type="text"
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder={t('contact.fullName')}
                        className="w-full px-5 py-4 bg-[var(--input-background)] border border-[var(--border)] text-foreground placeholder:text-[var(--muted-foreground)] focus:outline-none focus:border-[var(--gold)] transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-[var(--muted-foreground)] text-sm tracking-wider uppercase mb-2">
                        {t('contact.email')}
                      </label>
                      <input
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder={t('contact.emailPlaceholder')}
                        className="w-full px-5 py-4 bg-[var(--input-background)] border border-[var(--border)] text-foreground placeholder:text-[var(--muted-foreground)] focus:outline-none focus:border-[var(--gold)] transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[var(--muted-foreground)] text-sm tracking-wider uppercase mb-2">
                      {t('contact.subject')}
                    </label>
                    <input
                      type="text"
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      placeholder={t('contact.subject')}
                      className="w-full px-5 py-4 bg-[var(--input-background)] border border-[var(--border)] text-foreground placeholder:text-[var(--muted-foreground)] focus:outline-none focus:border-[var(--gold)] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[var(--muted-foreground)] text-sm tracking-wider uppercase mb-2">
                      {t('contact.message')}
                    </label>
                    <textarea
                      required
                      rows={6}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder={t('contact.message')}
                      className="w-full px-5 py-4 bg-[var(--input-background)] border border-[var(--border)] text-foreground placeholder:text-[var(--muted-foreground)] focus:outline-none focus:border-[var(--gold)] transition-colors resize-none"
                    />
                  </div>

                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-4 bg-[var(--gold)] text-[var(--black)] tracking-[0.2em] uppercase text-sm hover:bg-[var(--gold-light)] transition-colors"
                  >
                    {t('contact.sendMessage')}
                  </motion.button>
                </form>
              )}
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="lg:col-span-2"
            >
              <h2
                className="text-3xl text-foreground mb-8"
                style={{ fontFamily: "Playfair Display, serif" }}
              >
                Client Services
              </h2>

              <div className="space-y-6 mb-10">
                {[
                  { Icon: Phone, label: "+33 1 42 68 24 00", sub: "Mon–Fri · 9:00–18:00 CET" },
                  { Icon: Mail, label: "clients@eleganceabsolue.com", sub: "24-hour response guaranteed" },
                  { Icon: Clock, label: "Live Chat Available", sub: "Mon–Sat · 9:00–20:00 CET" },
                ].map(({ Icon, label, sub }) => (
                  <div key={label} className="flex gap-4">
                    <div className="p-3 border border-[var(--border)] text-[var(--gold)] shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-foreground text-sm">{label}</p>
                      <p className="text-[var(--muted-foreground)] text-xs mt-1">{sub}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Social */}
              <div className="mt-8 pt-8 border-t border-[var(--border)]">
                <p className="text-[var(--muted-foreground)] text-sm tracking-wider uppercase mb-4">Follow Us</p>
                <div className="flex gap-3">
                  {[Instagram, Facebook, Twitter].map((Icon, i) => (
                    <motion.a
                      key={i}
                      href="#"
                      whileHover={{ scale: 1.1, y: -2 }}
                      className="p-3 border border-[var(--border)] text-[var(--gold)] hover:bg-[var(--gold)] hover:text-[var(--black)] transition-colors"
                    >
                      <Icon className="w-4 h-4" />
                    </motion.a>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Boutiques */}
      
    </div>
  );
}
