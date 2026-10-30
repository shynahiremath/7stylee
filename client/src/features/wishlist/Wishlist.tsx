import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { productService } from "../../services/products";
import type { Product } from "../../types/types";
import { usePrefStore } from "../../store/preferenceStore";
import { useCartStore } from "../../store/cartStore";
import { useAuthStore } from "../../store/authStore";
import { useUiStore } from "../../store/uiStore";
import { errorMessage, formatInr, inStock } from "../../lib/utils";
import ProductCard from "../../components/product/ProductCard";
import { EmptyState } from "../../components/ui/States";
import Button from "../../components/ui/Button";

export default function Wishlist() {
  const ids = usePrefStore((s) => s.wishlistIds);
  const toggle = usePrefStore((s) => s.toggleWishlist);
  const [products, setProducts] = useState<Product[]>([]);
  const user = useAuthStore((s) => s.user);
  const add = useCartStore((s) => s.add);
  const toast = useUiStore((s) => s.toast);

  useEffect(() => {
    productService.list().then((r) => setProducts(r.data.products)).catch(() => {});
  }, []);

  const saved = products.filter((p) => ids.includes(p._id));
  const similar = products.filter((p) => !ids.includes(p._id)).slice(0, 4);

  return (
    <div className="max-w-[1400px] mx-auto px-5 md:px-8 py-12">
      <p className="font-sans text-[11px] tracking-wider uppercase text-champagne mb-2">Saved</p>
      <h1 className="font-display text-4xl mb-3">Wishlist</h1>
      <p className="font-sans text-sm text-charcoal/50 mb-10">
        {user ? `${user.name.split(" ")[0]}, these pieces are waiting.` : "Sign in later — for now this list lives on this device. A wishlist API is not on the server yet."}
      </p>
      {saved.length === 0 ? (
        <EmptyState
          title="Your wishlist is waiting for something beautiful."
          action={<Link to="/shop"><Button>Explore the collection</Button></Link>}
        />
      ) : (
        <div className="space-y-8">
          {saved.map((p) => (
            <div key={p._id} className="grid sm:grid-cols-[140px_1fr_auto] gap-6 items-center border-b border-hairline pb-8">
              <Link to={`/products/${p._id}`} className="aspect-[3/4] bg-hairline overflow-hidden">
                {p.images?.[0] ? <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" /> : null}
              </Link>
              <div>
                <Link to={`/products/${p._id}`} className="font-display text-2xl hover:text-champagne">{p.name}</Link>
                <p className="text-sm text-charcoal/50 mt-1">{p.category} · {formatInr(p.basePrice)}</p>
                <p className="text-xs mt-2">{inStock(p) ? "Available" : "Currently unavailable"}</p>
              </div>
              <div className="flex flex-col gap-2">
                <Button
                  disabled={!user || !inStock(p)}
                  onClick={async () => {
                    const v = p.variants.find((x) => x.stock > 0);
                    if (!v) return;
                    try {
                      await add(p._id, v.sku, 1);
                      toast("Moved toward your bag.");
                    } catch (e) {
                      toast(errorMessage(e), "error");
                    }
                  }}
                >
                  Add to bag
                </Button>
                <button className="text-xs tracking-wider uppercase text-charcoal/40" onClick={() => toggle(p._id)}>Remove</button>
              </div>
            </div>
          ))}
        </div>
      )}
      {similar.length > 0 && (
        <section className="mt-20">
          <h2 className="font-display text-3xl mb-8">You may love these</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {similar.map((p) => <ProductCard key={p._id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  );
}
