import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { productService } from "../../services/products";
import { SHOP_CATEGORIES, type Product } from "../../types/types";
import { errorMessage, inStock, matchesCategory, matchesStyle } from "../../lib/utils";
import { usePrefStore } from "../../store/preferenceStore";
import ProductCard from "../../components/product/ProductCard";
import { EmptyState, ErrorState, Spinner } from "../../components/ui/States";

type Sort = "newest" | "price-asc" | "price-desc" | "name";

export default function Shop() {
  const [params, setParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [mobileFilters, setMobileFilters] = useState(false);
  const stylePref = usePrefStore((s) => s.style);

  const q = params.get("q") || "";
  const category = params.get("category") || "All";
  const color = params.get("color") || "";
  const size = params.get("size") || "";
  const occasion = params.get("occasion") || "";
  const maxPrice = Number(params.get("max") || 0);
  const avail = params.get("avail") || "";
  const sort = (params.get("sort") as Sort) || "newest";
  const style = params.get("style") || stylePref || "";

  const set = (key: string, value: string) => {
    const next = new URLSearchParams(params);
    if (!value || value === "All") next.delete(key);
    else next.set(key, value);
    setParams(next);
  };

  const load = () => {
    productService
      .list()
      .then((res) => setProducts(res.data.products))
      .catch((err) => setError(errorMessage(err)))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    let cancelled = false;
    productService
      .list()
      .then((res) => {
        if (!cancelled) setProducts(res.data.products);
      })
      .catch((err) => {
        if (!cancelled) setError(errorMessage(err));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const colors = [...new Set(products.flatMap((p) => p.variants.map((v) => v.color)))].sort();
  const sizes = [...new Set(products.flatMap((p) => p.variants.map((v) => v.size)))].sort();
  const occasions = [...new Set(products.flatMap((p) => p.occasionTags || []))].sort();
  const prices = products.map((p) => p.basePrice);
  const priceCap = prices.length ? Math.max(...prices) : 0;

  const filtered = useMemo(() => {
    let list = products.filter((p) => {
      if (q && !`${p.name} ${p.description} ${p.category}`.toLowerCase().includes(q.toLowerCase())) return false;
      if (!matchesCategory(p, category)) return false;
      if (style && !matchesStyle(p, style)) return false;
      if (color && !p.variants.some((v) => v.color === color)) return false;
      if (size && !p.variants.some((v) => v.size === size && v.stock > 0)) return false;
      if (occasion && !(p.occasionTags || []).some((t) => t.toLowerCase() === occasion.toLowerCase())) return false;
      if (maxPrice && p.basePrice > maxPrice) return false;
      if (avail === "in" && !inStock(p)) return false;
      return true;
    });
    if (sort === "price-asc") list = [...list].sort((a, b) => a.basePrice - b.basePrice);
    if (sort === "price-desc") list = [...list].sort((a, b) => b.basePrice - a.basePrice);
    if (sort === "name") list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [products, q, category, style, color, size, occasion, maxPrice, avail, sort]);

  const Filters = (
    <div className="space-y-8">
      <p className="font-sans text-[11px] tracking-wider uppercase text-champagne">Refine</p>
      <p className="font-sans text-[10px] text-charcoal/40 leading-relaxed">
        Search, category, colour, size, occasion and price are applied in the browser. The catalog endpoint returns the full collection.
      </p>
      <label className="block">
        <span className="sr-only">Search</span>
        <input
          value={q}
          onChange={(e) => set("q", e.target.value)}
          placeholder="Search the collection"
          className="w-full border-b border-hairline bg-transparent py-2 font-sans text-sm focus:outline-none focus:border-champagne"
        />
      </label>
      <div>
        <p className="font-sans text-xs tracking-wider uppercase text-charcoal/40 mb-3">Category</p>
        <div className="flex flex-col gap-1">
          {["All", ...SHOP_CATEGORIES].map((c) => (
            <button
              key={c}
              onClick={() => set("category", c)}
              className={`text-left font-sans text-sm py-1 ${category === c ? "text-ink" : "text-charcoal/50 hover:text-ink"}`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>
      {colors.length > 0 && (
        <div>
          <p className="font-sans text-xs tracking-wider uppercase text-charcoal/40 mb-3">Colour</p>
          <div className="flex flex-wrap gap-2">
            {colors.map((c) => (
              <button key={c} onClick={() => set("color", color === c ? "" : c)} className={`text-xs border px-3 py-1 ${color === c ? "bg-ink text-bone border-ink" : "border-hairline"}`}>
                {c}
              </button>
            ))}
          </div>
        </div>
      )}
      {sizes.length > 0 && (
        <div>
          <p className="font-sans text-xs tracking-wider uppercase text-charcoal/40 mb-3">Size</p>
          <div className="flex flex-wrap gap-2">
            {sizes.map((s) => (
              <button key={s} onClick={() => set("size", size === s ? "" : s)} className={`w-10 h-10 text-xs border ${size === s ? "bg-ink text-bone border-ink" : "border-hairline"}`}>
                {s}
              </button>
            ))}
          </div>
        </div>
      )}
      {occasions.length > 0 && (
        <div>
          <p className="font-sans text-xs tracking-wider uppercase text-charcoal/40 mb-3">Occasion</p>
          {occasions.map((o) => (
            <button key={o} onClick={() => set("occasion", occasion === o ? "" : o)} className={`block text-left text-sm py-1 ${occasion === o ? "text-ink" : "text-charcoal/50"}`}>
              {o}
            </button>
          ))}
        </div>
      )}
      {priceCap > 0 && (
        <div>
          <p className="font-sans text-xs tracking-wider uppercase text-charcoal/40 mb-3">Price up to {maxPrice || priceCap}</p>
          <input
            type="range"
            min={0}
            max={priceCap}
            value={maxPrice || priceCap}
            onChange={(e) => set("max", e.target.value)}
            className="w-full accent-champagne"
          />
        </div>
      )}
      <label className="flex items-center gap-2 font-sans text-sm">
        <input type="checkbox" checked={avail === "in"} onChange={(e) => set("avail", e.target.checked ? "in" : "")} />
        In stock
      </label>
    </div>
  );

  return (
    <div className="max-w-[1400px] mx-auto px-5 md:px-8 py-10">
      <p className="font-sans text-[11px] tracking-[0.2em] uppercase text-champagne mb-2">Shop</p>
      <h1 className="font-display text-4xl md:text-5xl text-ink mb-2">The Collection</h1>
      <p className="font-sans text-sm text-charcoal/50 mb-10">
        {stylePref ? `Curated with your ${stylePref.toLowerCase()} sensibility in mind.` : "Find the piece that feels like you."}
      </p>

      <div className="flex items-center justify-between mb-6 lg:hidden">
        <button onClick={() => setMobileFilters(true)} className="font-sans text-xs tracking-wider uppercase border border-ink px-4 py-2">
          Filters
        </button>
        <select value={sort} onChange={(e) => set("sort", e.target.value)} className="font-sans text-sm bg-transparent border-b border-hairline py-1" aria-label="Sort">
          <option value="newest">Newest</option>
          <option value="price-asc">Price · low</option>
          <option value="price-desc">Price · high</option>
          <option value="name">Name</option>
        </select>
      </div>

      <div className="grid lg:grid-cols-[240px_1fr] gap-12">
        <aside className="hidden lg:block">{Filters}</aside>
        <div>
          <div className="hidden lg:flex justify-end mb-6">
            <select value={sort} onChange={(e) => set("sort", e.target.value)} className="font-sans text-sm bg-transparent border-b border-hairline py-1" aria-label="Sort">
              <option value="newest">Newest</option>
              <option value="price-asc">Price · low</option>
              <option value="price-desc">Price · high</option>
              <option value="name">Name</option>
            </select>
          </div>
          {loading ? (
            <Spinner />
          ) : error ? (
            <ErrorState message={error} onRetry={load} />
          ) : filtered.length === 0 ? (
            <EmptyState title="Nothing matches this edit." body="Widen your filters — the right piece is still in the atelier." />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
              {filtered.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>

      {mobileFilters && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <button className="absolute inset-0 bg-ink/40" onClick={() => setMobileFilters(false)} aria-label="Close filters" />
          <div className="absolute bottom-0 left-0 right-0 max-h-[85vh] overflow-y-auto bg-bone p-6 animate-rise">
            <div className="flex justify-between mb-6">
              <p className="font-display text-2xl">Filters</p>
              <button onClick={() => setMobileFilters(false)} className="text-xs tracking-wider uppercase">Done</button>
            </div>
            {Filters}
          </div>
        </div>
      )}
    </div>
  );
}
