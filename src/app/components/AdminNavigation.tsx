import { Link, useLocation } from "react-router";
import { supabase } from "../lib/supabase";
import { Home, Package, ShoppingCart, Settings, LogOut, Globe, Menu, X } from "lucide-react";
import { motion } from "motion/react";
import { useSettings } from "../context/SettingsContext";
import { useState, useEffect } from "react";

export function AdminNavigation() {
  const location = useLocation();
  const { settings } = useSettings();
  const [mobileOpen, setMobileOpen] = useState(false);

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
    { label: "View Site", href: "/", icon: Home },
  ];

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 bg-[var(--black)]/95 backdrop-blur-lg border-b border-[var(--border)]"
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
          <Link to="/admin" className="flex items-center gap-2">
            {settings.logo_url ? (
              <img src={settings.logo_url} alt="Logo" className="h-8 object-contain" />
            ) : (
              <span className="text-xl md:text-2xl tracking-tight" style={{ fontFamily: "Playfair Display, serif" }}>
                <span className="text-[var(--gold)]">Élégance</span>{" "}
                <span className="text-foreground">Absolue</span>
              </span>
            )}
            <span className="text-[var(--muted-foreground)] text-xs md:text-sm tracking-wider uppercase ml-2">Admin</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
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

          {/* Desktop Logout */}
          <button
            onClick={handleLogout}
            className="hidden md:flex items-center gap-2 text-[var(--muted-foreground)] hover:text-[var(--gold)] transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm tracking-wider uppercase">Logout</span>
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden text-[var(--gold)]"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-[72px] left-0 right-0 z-40 bg-[var(--black)]/98 backdrop-blur-xl border-b border-[var(--border)]"
        >
          <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col gap-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              return (
                <Link key={item.href} to={item.href} className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 ${isActive ? "text-[var(--gold)]" : "text-[var(--muted-foreground)]"}`} />
                  <span className={`text-base tracking-wider uppercase ${isActive ? "text-[var(--gold)]" : "text-[var(--muted-foreground)] hover:text-foreground"}`}>
                    {item.label}
                  </span>
                </Link>
              );
            })}
            {/* Mobile Logout */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 text-[var(--muted-foreground)] hover:text-[var(--gold)] transition-colors mt-4"
            >
              <LogOut className="w-5 h-5" />
              <span className="text-base tracking-wider uppercase">Logout</span>
            </button>
          </div>
        </motion.div>
      )}
    </>
  );
}
