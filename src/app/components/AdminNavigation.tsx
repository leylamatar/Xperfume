import { Link, useLocation } from "react-router";
import { supabase } from "../lib/supabase";
import { Home, Package, ShoppingCart, Settings, LogOut, Globe } from "lucide-react";
import { motion } from "motion/react";
import { useSettings } from "../context/SettingsContext";

export function AdminNavigation() {
  const location = useLocation();
  const { settings } = useSettings();

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  const navItems = [
    { label: "Dashboard", href: "/admin", icon: Home },
    { label: "Products", href: "/admin/products", icon: Package },
    { label: "Categories", href: "/admin/categories", icon: Settings },
    { label: "Orders", href: "/admin/orders", icon: ShoppingCart },
    { label: "Translations", href: "/admin/translations", icon: Globe },
    { label: "Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-[var(--black)]/95 backdrop-blur-lg border-b border-[var(--border)]"
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/admin" className="flex items-center gap-2">
          {settings.logo_url ? (
            <img src={settings.logo_url} alt="Logo" className="h-8 object-contain" />
          ) : (
            <span className="text-2xl tracking-tight" style={{ fontFamily: "Playfair Display, serif" }}>
              <span className="text-[var(--gold)]">Élégance</span>{" "}
              <span className="text-foreground">Absolue</span>
            </span>
          )}
          <span className="text-[var(--muted-foreground)] text-sm tracking-wider uppercase ml-2">Admin</span>
        </Link>

        <div className="flex items-center gap-8">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            return (
              <Link key={item.href} to={item.href} className="flex items-center gap-2">
                <Icon className={`w-4 h-4 ${isActive ? "text-[var(--gold)]" : "text-[var(--muted-foreground)]"}`} />
                <span className={`text-sm tracking-wider uppercase ${isActive ? "text-[var(--gold)]" : "text-[var(--muted-foreground)] hover:text-foreground"}`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-[var(--muted-foreground)] hover:text-[var(--gold)] transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span className="text-sm tracking-wider uppercase">Logout</span>
        </button>
      </div>
    </motion.nav>
  );
}
