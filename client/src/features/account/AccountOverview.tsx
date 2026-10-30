import { Link } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { usePrefStore } from "../../store/preferenceStore";
import { useEffect, useState } from "react";
import { orderService } from "../../services/orders";
import type { Order } from "../../types/types";
import { formatInr } from "../../lib/utils";

export default function AccountOverview() {
  const user = useAuthStore((s) => s.user);
  const { style, body, wishlistIds, designs, closet } = usePrefStore();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    orderService.mine().then((r) => setOrders(r.data.orders)).catch(() => {});
  }, []);

  return (
    <div>
      <h1 className="font-display text-4xl mb-2">Welcome back, {user?.name}</h1>
      <p className="text-charcoal/50 mb-10">Your personal fashion command center.</p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-hairline border border-hairline mb-12">
        {[
          { l: "Orders", v: String(orders.length), to: "/account/orders" },
          { l: "Style", v: style || "Not set", to: "/discover" },
          { l: "Body profile", v: body.completed ? "Ready" : "Start", to: "/profile" },
          { l: "Wishlist", v: String(wishlistIds.length), to: "/wishlist" },
        ].map((c) => (
          <Link key={c.l} to={c.to} className="bg-bone p-6 hover:bg-white">
            <p className="text-[11px] tracking-wider uppercase text-champagne mb-2">{c.l}</p>
            <p className="font-display text-2xl">{c.v}</p>
          </Link>
        ))}
      </div>
      <p className="text-sm text-charcoal/50 mb-6">
        {style ? `Curated for your ${style.toLowerCase()} style.` : "Discover your style to personalize the atelier."}{" "}
        {body.completed ? "Based on your body profile." : ""} Closet pieces: {closet.length}. Saved designs: {designs.length}.
      </p>
      {orders[0] && (
        <div className="border border-hairline p-6">
          <p className="text-[11px] tracking-wider uppercase text-champagne mb-2">Latest order</p>
          <p className="font-display text-xl">#{orders[0]._id.slice(-8).toUpperCase()}</p>
          <p className="text-sm text-charcoal/50">{orders[0].status} · {formatInr(orders[0].total)}</p>
        </div>
      )}
    </div>
  );
}
