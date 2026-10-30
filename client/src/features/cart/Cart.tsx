import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCartStore } from "../../store/cartStore";
import { usePrefStore } from "../../store/preferenceStore";
import { useAuthStore } from "../../store/authStore";
import { formatInr, shippingFor, unitPrice, variantOf } from "../../lib/utils";
import { EmptyState, ErrorState, Spinner } from "../../components/ui/States";
import Button from "../../components/ui/Button";
import { productService } from "../../services/products";
import type { Product } from "../../types/types";
import ProductCard from "../../components/product/ProductCard";

export default function Cart() {
  const { items, loading, error, fetch, remove, setQuantity } = useCartStore();
  const { saveForLater, savedForLater, removeSaved } = usePrefStore();
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();
  const [recs, setRecs] = useState<Product[]>([]);

  useEffect(() => {
    if (user) fetch();
    productService.list().then((r) => setRecs(r.data.products.slice(0, 4))).catch(() => {});
  }, [user, fetch]);

  const subtotal = items.reduce((sum, item) => {
    const v = variantOf(item.product, item.sku);
    return sum + unitPrice(item.product, v) * item.quantity;
  }, 0);
  const shipping = shippingFor(subtotal);
  const total = subtotal + shipping;

  if (!user) {
    return (
      <div className="max-w-[800px] mx-auto px-8 py-24 text-center">
        <h1 className="font-display text-4xl mb-4">Your bag</h1>
        <p className="text-charcoal/50 mb-8">Sign in to view the bag stored with your account.</p>
        <Link to="/login"><Button>Sign in</Button></Link>
      </div>
    );
  }

  if (loading && items.length === 0) return <Spinner label="Opening your bag" />;
  if (error) return <div className="max-w-[1200px] mx-auto px-8 py-16"><ErrorState message={error} onRetry={fetch} /></div>;

  return (
    <div className="max-w-[1400px] mx-auto px-5 md:px-8 py-12">
      <p className="font-sans text-[11px] tracking-wider uppercase text-champagne mb-2">Your</p>
      <h1 className="font-display text-4xl mb-10">Shopping bag</h1>
      {items.length === 0 ? (
        <EmptyState
          title="Your style journey starts here."
          body="The collection is waiting."
          action={<Link to="/shop"><Button>Discover pieces</Button></Link>}
        />
      ) : (
        <div className="grid lg:grid-cols-[1fr_360px] gap-12">
          <div className="divide-y divide-hairline border-t border-hairline">
            {items.map((item) => {
              const v = variantOf(item.product, item.sku);
              return (
                <div key={item.sku} className="py-8 grid grid-cols-[88px_1fr] gap-5">
                  <Link to={`/products/${item.product._id}`} className="aspect-[3/4] bg-hairline overflow-hidden">
                    {item.product.images?.[0] ? <img src={item.product.images[0]} alt="" className="w-full h-full object-cover" /> : null}
                  </Link>
                  <div>
                    <div className="flex justify-between gap-4">
                      <Link to={`/products/${item.product._id}`} className="font-display text-xl hover:text-champagne">{item.product.name}</Link>
                      <p className="font-sans">{formatInr(unitPrice(item.product, v) * item.quantity)}</p>
                    </div>
                    <p className="text-xs text-charcoal/40 mt-1">{v?.color} · {v?.size}</p>
                    <div className="flex items-center gap-3 mt-4">
                      <label className="sr-only" htmlFor={`qty-${item.sku}`}>Quantity</label>
                      <select
                        id={`qty-${item.sku}`}
                        value={item.quantity}
                        onChange={(e) => setQuantity(item.product._id, item.sku, Number(e.target.value))}
                        className="border border-hairline bg-transparent px-2 py-1 text-sm"
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                          <option key={n} value={n}>{n}</option>
                        ))}
                      </select>
                      <button className="text-[11px] uppercase tracking-wide text-charcoal/40" onClick={() => { saveForLater(item.sku); remove(item.sku); }}>
                        Save for later
                      </button>
                      <button className="text-[11px] uppercase tracking-wide text-charcoal/40 hover:text-red-700" onClick={() => remove(item.sku)}>
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <aside className="border border-hairline p-8 h-fit sticky top-24 bg-white">
            <p className="font-sans text-xs tracking-wider uppercase text-champagne mb-6">Summary</p>
            <div className="space-y-2 font-sans text-sm text-charcoal/70 mb-5">
              <div className="flex justify-between"><span>Subtotal</span><span>{formatInr(subtotal)}</span></div>
              <div className="flex justify-between"><span>Discount</span><span>—</span></div>
              <div className="flex justify-between"><span>Shipping</span><span>{shipping === 0 ? "Complimentary" : formatInr(shipping)}</span></div>
            </div>
            <div className="border-t border-hairline pt-4 flex justify-between mb-8">
              <span>Total</span>
              <span className="font-display text-2xl">{formatInr(total)}</span>
            </div>
            <Button className="w-full" onClick={() => navigate("/checkout")}>Checkout</Button>
            <p className="text-[11px] text-charcoal/40 mt-4 text-center">Secure checkout · Perfect Fit Guarantee</p>
          </aside>
        </div>
      )}

      {savedForLater.length > 0 && (
        <p className="mt-10 font-sans text-sm text-charcoal/45">
          Saved for later on this device: {savedForLater.join(", ")}.{" "}
          <button className="underline" onClick={() => savedForLater.forEach(removeSaved)}>Clear</button>
        </p>
      )}

      {recs.length > 0 && (
        <section className="mt-20">
          <h2 className="font-display text-3xl mb-8">Complete your look</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {recs.map((p) => <ProductCard key={p._id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  );
}
