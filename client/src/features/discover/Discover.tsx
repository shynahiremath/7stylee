import { Link } from "react-router-dom";
import { STYLE_PERSONALITIES } from "../../types/types";
import { usePrefStore } from "../../store/preferenceStore";
import { useAuthStore } from "../../store/authStore";
import { useEffect, useState } from "react";
import { productService } from "../../services/products";
import type { Product } from "../../types/types";
import { matchesStyle } from "../../lib/utils";
import ProductCard from "../../components/product/ProductCard";
import Button from "../../components/ui/Button";

const copy: Record<string, string> = {
  Minimal: "Quiet luxury. Clean lines, considered fabrics, nothing extra.",
  Elegant: "Soft structure, evening light, silk that remembers your walk.",
  Bold: "Statement colour, architectural cuts, presence without apology.",
  Classic: "Tailoring that outlives seasons. Heritage, refined.",
  Contemporary: "Modern Indian ease — sculpted, current, wearable.",
  Bohemian: "Movement, print, and a little poetry in the hem.",
};

export default function Discover() {
  const { style, setStyle } = usePrefStore();
  const user = useAuthStore((s) => s.user);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    productService.list().then((res) => setProducts(res.data.products)).catch(() => {});
  }, []);

  const recs = style ? products.filter((p) => matchesStyle(p, style)).slice(0, 6) : products.slice(0, 6);

  return (
    <div className="max-w-[1400px] mx-auto px-5 md:px-8 py-16">
      <p className="font-sans text-[11px] tracking-[0.2em] uppercase text-champagne mb-3">Style discovery</p>
      <h1 className="font-display text-4xl md:text-6xl text-ink max-w-3xl mb-4">What defines your style?</h1>
      <p className="font-sans text-charcoal/60 max-w-xl mb-12">
        {user ? `${user.name.split(" ")[0]}, choose the personality that feels like you.` : "Choose a personality. We’ll shape the collection around it."}
      </p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-16">
        {STYLE_PERSONALITIES.map((s) => (
          <button
            key={s}
            onClick={() => setStyle(s)}
            className={`text-left p-8 border min-h-[220px] flex flex-col transition-colors duration-300 ${
              style === s ? "bg-ink text-bone border-ink" : "bg-white border-hairline hover:border-ink"
            }`}
          >
            <span className="font-display text-3xl mb-4">{s}</span>
            <p className={`font-sans text-sm leading-relaxed ${style === s ? "text-bone/70" : "text-charcoal/55"}`}>{copy[s]}</p>
            <span className={`mt-auto pt-6 font-sans text-[11px] tracking-wider uppercase ${style === s ? "text-champagne" : "text-charcoal/35"}`}>
              {style === s ? "This is you" : "Select"}
            </span>
          </button>
        ))}
      </div>
      {style && (
        <div>
          <div className="flex items-end justify-between mb-8">
            <h2 className="font-display text-3xl">Recommended for your {style.toLowerCase()} style</h2>
            <Link to={`/shop?style=${style}`}>
              <Button variant="ghost">Shop this edit</Button>
            </Link>
          </div>
          {recs.length === 0 ? (
            <p className="font-sans text-sm text-charcoal/50">No catalog matches yet — browse the full shop while we grow this edit.</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {recs.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}