import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router";
import { useEffect, useState } from "react";
import { CartProvider } from "./context/CartContext";
import { SettingsProvider } from "./context/SettingsContext";
import { LanguageProvider } from "./context/LanguageContext";
import { Navigation } from "./components/Navigation";
import { Footer } from "./components/Footer";
import { AdminNavigation } from "./components/AdminNavigation";
import { WhatsAppButton } from "./components/WhatsAppButton";
import { HomePage } from "./pages/HomePage";
import { ShopPage } from "./pages/ShopPage";
import { ProductDetailPage } from "./pages/ProductDetailPage";
import { AboutPage } from "./pages/AboutPage";
import { ContactPage } from "./pages/ContactPage";
import { CartPage } from "./pages/CartPage";
import { CheckoutPage } from "./pages/CheckoutPage";

import { NotFoundPage } from "./pages/NotFoundPage";
import { AdminDashboardPage } from "./pages/admin/DashboardPage";
import { AdminProductsPage } from "./pages/admin/ProductsPage";
import { AdminOrdersPage } from "./pages/admin/OrdersPage";
import { AdminCategoriesPage } from "./pages/admin/CategoriesPage";
import { AdminSettingsPage } from "./pages/admin/SettingsPage";
import { AdminTranslationsPage } from "./pages/admin/TranslationsPage";
import { AdminLoginPage } from "./pages/admin/LoginPage";
import { OrderSuccessPage } from "./pages/OrderSuccessPage";
import { supabase } from "./lib/supabase";
import { initI18n } from "./lib/i18n";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);
  return null;
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    checkAdmin();
  }, []);

  async function checkAdmin() {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("admin_roles")
        .select("*")
        .eq("user_id", session.user.id);

      setIsAdmin(!!data && data.length > 0);
    } catch (error) {
      console.error("Admin check error:", error);
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center text-foreground">Loading...</div>;
  if (!isAdmin) return <Navigate to="/admin/login" replace />;
  return (
    <>
      <AdminNavigation />
      {children}
    </>
  );
}

function AppShell() {
  const { pathname } = useLocation();
  const hideFooter = pathname === "/checkout" || pathname.startsWith("/admin");
  const isAdminPage = pathname.startsWith("/admin");

  if (isAdminPage) {
    if (pathname === "/admin/login") {
      return (
        <div className="min-h-screen bg-[var(--background)] text-foreground overflow-x-hidden">
          <ScrollToTop />
          <AdminLoginPage />
        </div>
      );
    }
    return (
      <div className="min-h-screen bg-[var(--background)] text-foreground overflow-x-hidden">
        <ScrollToTop />
        <AdminRoute>
          <main className="pt-24">
            <Routes>
              <Route path="/admin" element={<AdminDashboardPage />} />
              <Route path="/admin/products" element={<AdminProductsPage />} />
              <Route path="/admin/categories" element={<AdminCategoriesPage />} />
              <Route path="/admin/orders" element={<AdminOrdersPage />} />
              <Route path="/admin/translations" element={<AdminTranslationsPage />} />
              <Route path="/admin/settings" element={<AdminSettingsPage />} />
              <Route path="/admin/*" element={<NotFoundPage />} />
            </Routes>
          </main>
        </AdminRoute>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)] text-foreground overflow-x-hidden">
      <ScrollToTop />
      <Navigation />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/shop/:slug" element={<ProductDetailPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-success" element={<OrderSuccessPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      {!hideFooter && <Footer />}
      <WhatsAppButton />
    </div>
  );
}

export default function App() {
  const [i18nReady, setI18nReady] = useState(false);

  useEffect(() => {
    async function init() {
      await initI18n();
      setI18nReady(true);
    }
    init();
  }, []);

  if (!i18nReady) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center text-foreground">
        Loading...
      </div>
    );
  }

  return (
    <BrowserRouter>
      <LanguageProvider>
        <SettingsProvider>
          <CartProvider>
            <AppShell />
          </CartProvider>
        </SettingsProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
}
