import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { motion } from "motion/react";
import { Lock, Mail } from "lucide-react";

export function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) throw signInError;
      window.location.href = "/admin";
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[var(--background)] flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-gradient-to-br from-[var(--black-soft)] to-[var(--burgundy-dark)] border border-[var(--border)] p-8 rounded-lg"
      >
        <h1 className="text-3xl text-foreground mb-2 text-center" style={{ fontFamily: "Playfair Display, serif" }}>
          Admin Login
        </h1>
        <p className="text-[var(--muted-foreground)] text-center mb-8">Élégance Absolue Admin Panel</p>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-[var(--muted-foreground)] text-sm tracking-wider uppercase mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--muted-foreground)]" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                className="w-full pl-12 pr-4 py-3 bg-[var(--input-background)] border border-[var(--border)] text-foreground focus:outline-none focus:border-[var(--gold)]"
              />
            </div>
          </div>
          <div>
            <label className="block text-[var(--muted-foreground)] text-sm tracking-wider uppercase mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--muted-foreground)]" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-12 pr-4 py-3 bg-[var(--input-background)] border border-[var(--border)] text-foreground focus:outline-none focus:border-[var(--gold)]"
              />
            </div>
          </div>
          {error && (
            <p className="text-red-400 text-sm text-center">{error}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[var(--gold)] text-[var(--black)] tracking-wider uppercase hover:bg-[var(--gold-light)] transition-colors disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
