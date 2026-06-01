import { motion } from "motion/react";
import { Link } from "react-router";
import { ArrowLeft, Search } from "lucide-react";

export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-[var(--background)] flex items-center justify-center px-6 pt-20">
      {/* Floating atmospheric orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-[var(--gold)] blur-3xl opacity-[0.04]"
            style={{
              width: `${100 + i * 50}px`,
              height: `${100 + i * 50}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, 30, 0],
              y: [0, -40, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 6 + i * 1.5,
              repeat: Infinity,
              delay: i * 0.8,
            }}
          />
        ))}
        {/* Smoke-like particles */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={`p-${i}`}
            className="absolute w-1 h-1 rounded-full bg-[var(--gold)] opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              bottom: "0%",
            }}
            animate={{
              y: [0, -800],
              opacity: [0.2, 0],
            }}
            transition={{
              duration: 4 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 text-center max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Giant 404 */}
          <motion.p
            className="text-[20vw] md:text-[12rem] font-bold leading-none mb-0"
            style={{
              fontFamily: "Playfair Display, serif",
              background: "linear-gradient(135deg, var(--burgundy-dark) 0%, var(--gold) 50%, var(--burgundy-dark) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              opacity: 0.4,
            }}
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{ duration: 6, repeat: Infinity }}
          >
            404
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="-mt-4"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-px bg-[var(--gold)]" />
            <span className="text-[var(--gold)] tracking-[0.3em] uppercase text-sm">Lost in Scent</span>
            <div className="w-12 h-px bg-[var(--gold)]" />
          </div>

          <h1
            className="text-4xl md:text-5xl text-foreground mb-6"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            Page Not Found
          </h1>

          <p className="text-[var(--muted-foreground)] text-lg leading-relaxed mb-10 max-w-lg mx-auto">
            Like a fragrance that vanishes before you can name it, the page you're looking for
            seems to have evaporated. Perhaps it was moved, renamed, or simply never existed.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/">
              <motion.span
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-3 px-8 py-4 bg-[var(--gold)] text-[var(--black)] tracking-wider uppercase text-sm hover:bg-[var(--gold-light)] transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Return Home
              </motion.span>
            </Link>
            <Link to="/shop">
              <motion.span
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-3 px-8 py-4 border border-[var(--gold)] text-[var(--gold)] hover:bg-[var(--gold)] hover:text-[var(--black)] transition-colors tracking-wider uppercase text-sm"
              >
                <Search className="w-4 h-4" />
                Explore Fragrances
              </motion.span>
            </Link>
          </div>
        </motion.div>

        {/* Decorative perfume bottle silhouette */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.06 }}
          transition={{ delay: 1 }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
        >
          <svg width="300" height="400" viewBox="0 0 300 400" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="110" y="20" width="80" height="40" rx="8" fill="var(--gold)" />
            <rect x="125" y="10" width="50" height="15" rx="4" fill="var(--gold)" />
            <rect x="60" y="60" width="180" height="280" rx="30" fill="var(--gold)" />
            <rect x="80" y="80" width="140" height="240" rx="20" fill="var(--burgundy)" opacity="0.5" />
            <ellipse cx="150" cy="120" rx="50" ry="20" fill="var(--gold)" opacity="0.3" />
          </svg>
        </motion.div>
      </div>
    </div>
  );
}
