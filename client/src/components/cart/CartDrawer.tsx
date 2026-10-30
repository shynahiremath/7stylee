import { Link, useNavigate } from "react-router-dom";
import { useCartStore } from "../../store/cartStore";
import { useUiStore } from "../../store/uiStore";
import { usePrefStore } from "../../store/preferenceStore";
import { formatInr, shippingFor, unitPrice, variantOf } from "../../lib/utils";
import { useAuthStore } from "../../store/authStore";

export default function CartDrawer() {
  const { cartOpen, closeCart, toast } = useUiStore();
  const { items, remove, loading } = useCartStore();
  const { user } = useAuthStore();
  const saveForLater = usePrefStore((s) => s.saveForLater);
  const navigate = useNavigate();

  const subtotal = items.reduce((sum, item) => {
    const v = variantOf(item.product, item.sku);
    return sum + unitPrice(item.product, v) * item.quantity;
  }, 0);
  const shipping = shippingFor(subtotal);

  if (!cartOpen) return null;

  return (
    <div className="fixed inset-0 z-[70]" role="dialog" aria-modal="true" aria-label="Shopping bag">
      <button className="absolute inset-0 bg-ink/40 animate-fade-in" onClick={closeCart} aria-label="Close bag" />
      <aside className="absolute right-0 top-0 h-full w-full max-w-md bg-bone shadow-xl flex flex-col animate-drawer">
        <div className="px-6 py-5 border-b border-hairline flex items-center justify-between">
          <div>
            <p className="font-sans text-[11px] tracking-wider uppercase text-champagne">Your</p>
            <h2 className="font-display text-2xl text-ink">Bag</h2>
          </div>
          <button onClick={closeCart} className="font-sans text-xs tracking-wider uppercase text-charcoal/50 hover:text-ink">
            Close
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {!user ? (
            <p className="font-sans text-sm text-charcoal/60 py-10">
              <Link to="/login" onClick={closeCart} className="underline">Sign in</Link> to keep your bag across devices.
            </p>
          ) : loading && items.length === 0 ? (
            <p className="font-display text-xl text-charcoal/30 py-10">Loading…</p>
          ) : items.length === 0 ? (
            <div className="py-16 text-center">
              <p className="font-display text-2xl text-charcoal/30 mb-3">Your style journey starts here.</p>
              <Link to="/shop" onClick={closeCart} className="font-sans text-xs tracking-wider uppercase text-champagne border-b border-champagne">
                Discover the collection
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-hairline">
              {items.map((item) => {
                const v = variantOf(item.product, item.sku);
                return (
                  <li key={item.sku} className="py-5 flex gap-4">
                    <Link to={`/products/${item.product._id}`} onClick={closeCart} className="w-20 aspect-[3/4] bg-hairline shrink-0 overflow-hidden">
                      {item.product.images?.[0] ? (
                        <img src={item.product.images[0]} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <span className="flex h-full items-center justify-center font-display italic text-2xl text-charcoal/15">
                          {item.product.name.charAt(0)}
                        </span>
                      )}
                    </Link>
                    <div className="flex-1 min-w-0">
                      <p className="font-display text-lg leading-tight truncate">{item.product.name}</p>
                      <p className="font-sans text-xs text-charcoal/45 mt-1">
                        {v?.color} · {v?.size} · Qty {item.quantity}
                      </p>
                      <p className="font-sans text-sm mt-2">{formatInr(unitPrice(item.product, v) * item.quantity)}</p>
                      <div className="flex gap-4 mt-3">
                        <button
                          className="font-sans text-[11px] uppercase tracking-wide text-charcoal/40 hover:text-ink"
                          onClick={async () => {
                            saveForLater(item.sku);
                            await remove(item.sku);
                            toast("Saved for later.", "info");
                          }}
                        >
                          Save
                        </button>
                        <button
                          className="font-sans text-[11px] uppercase tracking-wide text-charcoal/40 hover:text-red-700"
                          onClick={() => remove(item.sku)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-hairline px-6 py-5">
            <div className="flex justify-between font-sans text-sm mb-1">
              <span>Subtotal</span>
              <span>{formatInr(subtotal)}</span>
            </div>
            <div className="flex justify-between font-sans text-xs text-charcoal/50 mb-4">
              <span>Shipping</span>
              <span>{shipping === 0 ? "Complimentary" : formatInr(shipping)}</span>
            </div>
            <button
              className="w-full bg-ink text-bone py-3.5 font-sans text-xs tracking-wider uppercase hover:bg-champagne hover:text-ink transition-colors"
              onClick={() => {
                closeCart();
                navigate("/checkout");
              }}
            >
              Checkout
            </button>
            <Link to="/cart" onClick={closeCart} className="block text-center mt-3 font-sans text-xs tracking-wider uppercase text-charcoal/50 hover:text-ink">
              View full bag
            </Link>
          </div>
        )}
      </aside>
    </div>
  );
}
