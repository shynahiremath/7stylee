import { useLocation, Link } from "react-router-dom";
import type { Order } from "../../types/types";
import { formatInr } from "../../lib/utils";
import Button from "../../components/ui/Button";

export default function OrderSuccess() {
  const order = (useLocation().state as { order?: Order } | null)?.order;

  if (!order) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-center px-8">
        <div>
          <p className="font-display text-2xl text-charcoal/30 mb-4">No order to show.</p>
          <Link to="/account/orders"><Button variant="ghost">View orders</Button></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[520px] mx-auto px-8 py-20">
      <div className="w-16 h-px bg-champagne mb-10" />
      <p className="font-sans text-xs tracking-wider uppercase text-champagne mb-4">Confirmation</p>
      <h1 className="font-display text-4xl mb-4">Your order is with the atelier.</h1>
      <p className="text-charcoal/60 mb-10">We’ll begin preparing it shortly. Payment remains pending until a gateway is connected.</p>
      <div className="border border-hairline p-8 mb-10 space-y-4">
        <div className="flex justify-between text-xs">
          <span className="uppercase tracking-wider text-charcoal/40">Order</span>
          <span>#{order._id.slice(-10).toUpperCase()}</span>
        </div>
        <div className="flex justify-between items-baseline border-t border-hairline pt-4">
          <span className="text-xs uppercase tracking-wider text-charcoal/40">Total</span>
          <span className="font-display text-2xl">{formatInr(order.total)}</span>
        </div>
        <div className="flex justify-between text-xs border-t border-hairline pt-4">
          <span className="uppercase tracking-wider text-charcoal/40">Status</span>
          <span className="text-champagne">{order.status}</span>
        </div>
      </div>
      <div className="flex flex-wrap gap-3">
        <Link to="/account/orders"><Button>View orders</Button></Link>
        <Link to="/shop"><Button variant="ghost">Continue shopping</Button></Link>
      </div>
    </div>
  );
}
