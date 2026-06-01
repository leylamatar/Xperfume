import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { motion } from "motion/react";
import { Package, ShoppingCart, TrendingUp, Clock } from "lucide-react";

export function AdminDashboardPage() {
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    pendingOrders: 0,
    totalRevenue: 0,
    recentOrders: [] as any[],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    try {
      const [productsRes, ordersRes] = await Promise.all([
        supabase.from("products").select("*", { count: "exact" }),
        supabase.from("orders").select("*").order("created_at", { ascending: false }).limit(5),
      ]);

      const pendingOrdersRes = await supabase
        .from("orders")
        .select("*", { count: "exact" })
        .eq("order_status", "new");

      const totalRevenueRes = await supabase.from("orders").select("total_amount").eq("payment_status", "paid");

      const totalRevenue = totalRevenueRes.data?.reduce((sum, order) => sum + Number(order.total_amount), 0) || 0;

      setStats({
        products: productsRes.count || 0,
        orders: ordersRes.data?.length || 0,
        pendingOrders: pendingOrdersRes.count || 0,
        totalRevenue,
        recentOrders: ordersRes.data || [],
      });
    } catch (error) {
      console.error("Error loading stats:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center text-foreground">Loading...</div>;

  return (
    <div className="min-h-screen bg-[var(--background)] pt-24 pb-12 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl text-foreground mb-8"
          style={{ fontFamily: "Playfair Display, serif" }}
        >
          Admin Dashboard
        </motion.h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { label: "Total Products", value: stats.products, icon: Package, color: "from-[var(--gold)] to-[var(--gold-light)]" },
            { label: "Total Orders", value: stats.orders, icon: ShoppingCart, color: "from-[var(--wine)] to-red-700" },
            { label: "Pending Orders", value: stats.pendingOrders, icon: Clock, color: "from-blue-500 to-blue-700" },
            { label: "Total Revenue", value: `$${stats.totalRevenue.toLocaleString()}`, icon: TrendingUp, color: "from-green-500 to-green-700" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-gradient-to-br from-[var(--black-soft)] to-[var(--burgundy-dark)] border border-[var(--border)] p-6 rounded-lg"
            >
              <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center mb-4`}>
                <stat.icon className="w-6 h-6 text-[var(--black)]" />
              </div>
              <p className="text-[var(--muted-foreground)] text-sm tracking-wider uppercase mb-1">{stat.label}</p>
              <p className="text-3xl text-foreground">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        <div className="bg-gradient-to-br from-[var(--black-soft)] to-[var(--burgundy-dark)] border border-[var(--border)] p-8 rounded-lg">
          <h2 className="text-2xl text-foreground mb-6" style={{ fontFamily: "Playfair Display, serif" }}>
            Recent Orders
          </h2>
          {stats.recentOrders.length === 0 ? (
            <p className="text-[var(--muted-foreground)]">No orders yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[var(--border)]">
                    <th className="text-left py-3 text-[var(--muted-foreground)] text-sm tracking-wider uppercase">Order #</th>
                    <th className="text-left py-3 text-[var(--muted-foreground)] text-sm tracking-wider uppercase">Customer</th>
                    <th className="text-left py-3 text-[var(--muted-foreground)] text-sm tracking-wider uppercase">Total</th>
                    <th className="text-left py-3 text-[var(--muted-foreground)] text-sm tracking-wider uppercase">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentOrders.map((order) => (
                    <tr key={order.id} className="border-b border-[var(--border)]/50">
                      <td className="py-4 text-foreground">{order.order_number}</td>
                      <td className="py-4 text-foreground">{order.customer_name}</td>
                      <td className="py-4 text-[var(--gold)]">${Number(order.total_amount).toLocaleString()}</td>
                      <td className="py-4">
                        <span className={`px-3 py-1 rounded-full text-xs tracking-wider uppercase ${
                          order.order_status === "new" ? "bg-yellow-500/20 text-yellow-400" :
                          order.order_status === "preparing" ? "bg-blue-500/20 text-blue-400" :
                          order.order_status === "shipped" ? "bg-purple-500/20 text-purple-400" :
                          order.order_status === "completed" ? "bg-green-500/20 text-green-400" :
                          "bg-red-500/20 text-red-400"
                        }`}>
                          {order.order_status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
