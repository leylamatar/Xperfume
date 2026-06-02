import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { motion } from "motion/react";
import { Search, Eye, Trash2 } from "lucide-react";

export function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {
    try {
      let query = supabase.from("orders").select("*, order_items(*)").order("created_at", { ascending: false });
      if (searchQuery) {
        query = query.ilike("order_number", `%${searchQuery}%`);
      }
      const { data } = await query;
      setOrders(data || []);
    } catch (error) {
      console.error("Error loading orders:", error);
    } finally {
      setLoading(false);
    }
  }

  async function updateOrderStatus(orderId: string, status: string) {
    try {
      await supabase.from("orders").update({ order_status: status }).eq("id", orderId);
      loadOrders();
    } catch (error) {
      console.error("Error updating order:", error);
    }
  }

  async function updatePaymentStatus(orderId: string, status: string) {
    try {
      await supabase.from("orders").update({ payment_status: status }).eq("id", orderId);
      loadOrders();
    } catch (error) {
      console.error("Error updating payment:", error);
    }
  }

  async function deleteOrder(orderId: string) {
    if (!confirm("Are you sure you want to delete this order? This will also delete all its order items.")) return;
    try {
      // First delete all order items linked to this order
      const { error: itemsError } = await supabase.from("order_items").delete().eq("order_id", orderId);
      if (itemsError) throw itemsError;

      // Then delete the order
      const { error: orderError } = await supabase.from("orders").delete().eq("id", orderId);
      if (orderError) throw orderError;

      loadOrders();
    } catch (error: any) {
      console.error("Error deleting order:", error);
      alert("Error deleting order: " + (error.message || "Unknown error"));
    }
  }

  const filteredOrders = searchQuery
    ? orders.filter(order => order.order_number.toLowerCase().includes(searchQuery.toLowerCase()))
    : orders;

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
          Orders Management
        </motion.h1>

        <div className="mb-8 flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--muted-foreground)]" />
            <input
              type="text"
              placeholder="Search by order number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-[var(--input-background)] border border-[var(--border)] text-foreground focus:outline-none focus:border-[var(--gold)]"
            />
          </div>
        </div>

        <div className="bg-gradient-to-br from-[var(--black-soft)] to-[var(--burgundy-dark)] border border-[var(--border)] rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--border)]">
                  <th className="text-left py-4 px-6 text-[var(--muted-foreground)] text-sm tracking-wider uppercase">Order #</th>
                  <th className="text-left py-4 px-6 text-[var(--muted-foreground)] text-sm tracking-wider uppercase">Customer</th>
                  <th className="text-left py-4 px-6 text-[var(--muted-foreground)] text-sm tracking-wider uppercase">Total</th>
                  <th className="text-left py-4 px-6 text-[var(--muted-foreground)] text-sm tracking-wider uppercase">Order Status</th>
                  <th className="text-left py-4 px-6 text-[var(--muted-foreground)] text-sm tracking-wider uppercase">Payment</th>
                  <th className="text-right py-4 px-6 text-[var(--muted-foreground)] text-sm tracking-wider uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="border-b border-[var(--border)]/50">
                    <td className="py-4 px-6 text-foreground font-medium">{order.order_number}</td>
                    <td className="py-4 px-6">
                      <div>
                        <p className="text-foreground">{order.customer_name}</p>
                        <p className="text-[var(--muted-foreground)] text-xs">{order.customer_email || order.customer_phone}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-[var(--gold)]">${Number(order.total_amount).toLocaleString()}</td>
                    <td className="py-4 px-6">
                      <select
                        value={order.order_status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                        className="bg-[#3d0814] text-sm border border-[var(--border)] px-3 py-1 text-foreground focus:outline-none focus:border-[var(--gold)]"
                      >
                        <option value="new">New</option>
                        <option value="preparing">Preparing</option>
                        <option value="shipped">Shipped</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="py-4 px-6">
                      <select
                        value={order.payment_status}
                        onChange={(e) => updatePaymentStatus(order.id, e.target.value)}
                        className="bg-[#3d0814] text-sm border border-[var(--border)] px-3 py-1 text-foreground focus:outline-none focus:border-[var(--gold)]"
                      >
                        <option value="pending">Pending</option>
                        <option value="paid">Paid</option>
                        <option value="failed">Failed</option>
                      </select>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => setSelectedOrder(order)} className="p-2 text-[var(--gold)] hover:bg-[var(--gold)]/10 rounded">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button onClick={() => deleteOrder(order.id)} className="p-2 text-red-400 hover:bg-red-500/10 rounded">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                  </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {selectedOrder && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gradient-to-br from-[var(--black-soft)] to-[var(--burgundy-dark)] border border-[var(--border)] p-8 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl text-foreground" style={{ fontFamily: "Playfair Display, serif" }}>
                  Order Details
                </h2>
                <button onClick={() => setSelectedOrder(null)} className="text-[var(--muted-foreground)] hover:text-foreground">
                  ✕
                </button>
              </div>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[var(--muted-foreground)] text-xs tracking-wider uppercase mb-1">Order Number</p>
                    <p className="text-foreground">{selectedOrder.order_number}</p>
                  </div>
                  <div>
                    <p className="text-[var(--muted-foreground)] text-xs tracking-wider uppercase mb-1">Date</p>
                    <p className="text-foreground">{new Date(selectedOrder.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="border-t border-[var(--border)] pt-6">
                  <h3 className="text-lg text-foreground mb-4">Customer Information</h3>
                  <div className="space-y-2">
                    <p className="text-foreground">{selectedOrder.customer_name}</p>
                    <p className="text-[var(--muted-foreground)]">{selectedOrder.customer_phone}</p>
                    {selectedOrder.customer_email && <p className="text-[var(--muted-foreground)]">{selectedOrder.customer_email}</p>}
                    {selectedOrder.customer_address && <p className="text-[var(--muted-foreground)]">{selectedOrder.customer_address}</p>}
                  </div>
                </div>
                <div className="border-t border-[var(--border)] pt-6">
                  <h3 className="text-lg text-foreground mb-4">Order Items</h3>
                  <div className="space-y-3">
                    {selectedOrder.order_items?.map((item: any) => (
                      <div key={item.id} className="flex justify-between">
                        <div>
                          <p className="text-foreground">{item.product_name}</p>
                          <p className="text-[var(--muted-foreground)] text-xs">Qty: {item.quantity}</p>
                        </div>
                        <p className="text-[var(--gold)]">${Number(item.total_price).toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="border-t border-[var(--border)] pt-6">
                  <div className="flex justify-between items-center">
                    <span className="text-foreground text-lg">Total</span>
                    <span className="text-[var(--gold)] text-2xl">${Number(selectedOrder.total_amount).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
