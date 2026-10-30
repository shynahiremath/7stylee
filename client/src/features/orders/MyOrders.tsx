import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { orderService } from "../../services/orders";
import type { Order } from "../../types/types";
import { errorMessage, formatInr } from "../../lib/utils";
import { EmptyState, ErrorState, Spinner } from "../../components/ui/States";
import Button from "../../components/ui/Button";

const STATUS: Record<string, string> = {
  PENDING: "text-charcoal/60 border-hairline",
  PROCESSING: "text-ink border-ink/20",
  PACKED: "text-ink border-ink/20",
  SHIPPED: "text-champagne border-champagne/40",
  DELIVERED: "text-ink border-champagne",
  CANCELLED: "text-red-700 border-red-200",
};

export default function MyOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = () => {
    orderService
      .mine()
      .then((r) => setOrders(r.data.orders))
      .catch((e) => setError(errorMessage(e)))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    let cancelled = false;
    orderService
      .mine()
      .then((r) => {
        if (!cancelled) setOrders(r.data.orders);
      })
      .catch((e) => {
        if (!cancelled) setError(errorMessage(e));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) return <Spinner label="Fetching orders" />;
  if (error) return <ErrorState message={error} onRetry={load} />;
  if (orders.length === 0) {
    return (
      <EmptyState
        title="No orders yet"
        body="When you place an order, it will live here."
        action={<Link to="/shop"><Button>Shop the collection</Button></Link>}
      />
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl">Orders</h1>
      {orders.map((order) => (
        <article key={order._id} className="border border-hairline">
          <div className="px-6 py-4 flex flex-wrap justify-between gap-4 border-b border-hairline">
            <div>
              <p className="text-[11px] tracking-wider uppercase text-charcoal/40">Order</p>
              <p className="text-sm">#{order._id.slice(-8).toUpperCase()}</p>
            </div>
            <div>
              <p className="text-[11px] tracking-wider uppercase text-charcoal/40">Placed</p>
              <p className="text-sm">{new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</p>
            </div>
            <p className="font-display text-xl">{formatInr(order.total)}</p>
            <span className={`self-center text-[11px] tracking-wider uppercase border px-3 py-1 ${STATUS[order.status] || ""}`}>{order.status}</span>
          </div>
          {order.items.map((item) => (
            <div key={item.sku} className="px-6 py-4 flex justify-between text-sm border-t border-hairline">
              <span>{item.name} · {item.sku} · Qty {item.quantity}</span>
              <span>{formatInr(item.unitPrice * item.quantity)}</span>
            </div>
          ))}
        </article>
      ))}
    </div>
  );
}
