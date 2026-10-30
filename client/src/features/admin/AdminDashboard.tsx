import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { productService } from "../../services/products";
import { orderService } from "../../services/orders";
import type { Order, Product } from "../../types/types";
import { formatInr } from "../../lib/utils";
import { Spinner } from "../../components/ui/States";

/**
 * `order.user` can be a string id, a populated user object, or null
 * (deleted user, guest checkout, seed data). `typeof null === "object"`,
 * so every access must check for null first.
 */
type OrderUser = Order["user"] | null | undefined;

const userKey = (u: OrderUser): string | null => {
  if (!u) return null;
  if (typeof u === "object") return u.email || u._id || null;
  return u;
};

const userName = (u: OrderUser): string => {
  if (u && typeof u === "object") return u.name || u.email || "Customer";
  return "Customer";
};

export default function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([productService.list(), orderService.all()])
      .then(([p, o]) => {
        setProducts(p.data.products ?? []);
        setOrders(o.data.orders ?? []);
      })
      .catch((err) => console.error("Failed to load dashboard data", err))
      .finally(() => setLoading(false));
  }, []);

  const revenue = orders.reduce((s, o) => s + (o.total || 0), 0);

  const customers = new Set(
    orders.map((o) => userKey(o.user as OrderUser)).filter((k): k is string => Boolean(k))
  ).size;

  const stockOf = (p: Product) => (p.variants ?? []).reduce((s, v) => s + (v.stock || 0), 0);
  const low = products.filter((p) => stockOf(p) < 5);

  const best = useMemo(() => {
    const map = new Map<string, { name: string; qty: number }>();
    orders.forEach((o) =>
      (o.items ?? []).forEach((i) => {
        const cur = map.get(i.name) || { name: i.name, qty: 0 };
        cur.qty += i.quantity;
        map.set(i.name, cur);
      })
    );
    return [...map.values()].sort((a, b) => b.qty - a.qty).slice(0, 5);
  }, [orders]);

  if (loading) return <Spinner label="Loading atelier metrics" />;

  return (
    <div className="p-6 md:p-10">
      <p className="text-[11px] tracking-wider uppercase text-champagne mb-1">Admin</p>
      <h1 className="font-display text-3xl mb-8">Overview</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-hairline border border-hairline mb-10">
        {[
          { l: "Revenue", v: formatInr(revenue) },
          { l: "Orders", v: String(orders.length) },
          { l: "Customers", v: String(customers) },
          { l: "Products", v: String(products.length) },
        ].map((c) => (
          <div key={c.l} className="bg-bone p-6">
            <p className="text-[11px] tracking-wider uppercase text-charcoal/40 mb-2">{c.l}</p>
            <p className="font-display text-3xl">{c.v}</p>
          </div>
        ))}
      </div>
      <div className="grid lg:grid-cols-2 gap-8">
        <div>
          <h2 className="font-display text-2xl mb-4">Recent orders</h2>
          <ul className="divide-y divide-hairline border border-hairline">
            {orders.slice(0, 6).map((o) => (
              <li key={o._id} className="px-4 py-3 flex justify-between text-sm">
                <span>{userName(o.user as OrderUser)}</span>
                <span>{formatInr(o.total)} · {o.status}</span>
              </li>
            ))}
            {orders.length === 0 && <li className="px-4 py-8 text-charcoal/40">No orders yet</li>}
          </ul>
          <Link to="/admin/orders" className="inline-block mt-3 text-xs tracking-wider uppercase text-champagne">All orders</Link>
        </div>
        <div>
          <h2 className="font-display text-2xl mb-4">Best-selling</h2>
          <ul className="space-y-2 text-sm">
            {best.length === 0 && <li className="text-charcoal/40">Not enough order data yet.</li>}
            {best.map((b) => (
              <li key={b.name} className="flex justify-between border-b border-hairline py-2">
                <span>{b.name}</span><span>{b.qty}</span>
              </li>
            ))}
          </ul>
          <h2 className="font-display text-2xl mt-10 mb-4">Low stock</h2>
          <ul className="space-y-2 text-sm">
            {low.length === 0 && <li className="text-charcoal/40">Inventory looks healthy.</li>}
            {low.map((p) => (
              <li key={p._id} className="flex justify-between">
                <span>{p.name}</span><span>{stockOf(p)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
