import { useEffect, useState } from "react";
import { orderService } from "../../services/orders";
import type { Order, OrderStatus } from "../../types/types";
import { errorMessage, formatInr } from "../../lib/utils";
import { ErrorState, Spinner } from "../../components/ui/States";

const STATUSES: OrderStatus[] = ["PENDING", "PROCESSING", "PACKED", "SHIPPED", "DELIVERED", "CANCELLED"];

// `order.user` may be a string id, a populated object, or null
// (populate returns null when the referenced user no longer exists).
type OrderUser = Order["user"] | null | undefined;

const userName = (u: OrderUser): string =>
  u && typeof u === "object" ? u.name || u.email || "Customer" : "Customer";

const userEmail = (u: OrderUser): string =>
  u && typeof u === "object" ? u.email || "" : "";

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = () => {
    setError("");
    orderService
      .all()
      .then((r) => setOrders(r.data.orders ?? []))
      .catch((e) => setError(errorMessage(e)))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    let cancelled = false;
    orderService
      .all()
      .then((r) => {
        if (!cancelled) setOrders(r.data.orders ?? []);
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

  if (loading) return <Spinner />;
  if (error) return <div className="p-10"><ErrorState message={error} onRetry={load} /></div>;

  return (
    <div className="p-6 md:p-10">
      <h1 className="font-display text-3xl mb-8">Orders</h1>
      <div className="border border-hairline divide-y divide-hairline">
        {orders.map((order) => {
          const u = order.user as OrderUser;
          return (
            <div key={order._id} className="grid md:grid-cols-[1fr_140px_100px_180px] gap-3 px-5 py-4 items-center">
              <div>
                <p className="font-medium text-sm">{userName(u)}</p>
                <p className="text-xs text-charcoal/40">
                  {userEmail(u)}{userEmail(u) ? " · " : ""}#{order._id.slice(-8).toUpperCase()}
                </p>
              </div>
              <p className="text-xs">{new Date(order.createdAt).toLocaleDateString("en-IN")}</p>
              <p className="font-display text-lg">{formatInr(order.total)}</p>
              <select
                value={order.status}
                onChange={async (e) => {
                  await orderService.updateStatus(order._id, e.target.value as OrderStatus);
                  load();
                }}
                className="border border-hairline bg-transparent px-2 py-2 text-xs uppercase"
              >
                {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          );
        })}
        {orders.length === 0 && <p className="p-8 text-charcoal/40">No orders yet.</p>}
      </div>
    </div>
  );
}
