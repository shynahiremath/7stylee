import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { productService } from "../../services/products";
import type { Product } from "../../types/types";
import { STYLE_PERSONALITIES } from "../../types/types";
import { errorMessage, matchesStyle } from "../../lib/utils";
import { useAuthStore } from "../../store/authStore";
import { usePrefStore } from "../../store/preferenceStore";
import ProductCard from "../../components/product/ProductCard";
import { ErrorState, Spinner } from "../../components/ui/States";
import Button from "../../components/ui/Button";

const HERO =
  "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=2000&q=80";

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const user = useAuthStore((s) => s.user);
  const { style, setStyle, body } = usePrefStore();

  const load = () => {
    productService
      .list()
      .then((res) => setProducts(res.data.products))
      .catch((err) => setError(errorMessage(err, "Could not load the collection")))
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
        if (!cancelled) setError(errorMessage(err, "Could not load the collection"));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const featured = style ? products.filter((p) => matchesStyle(p, style)) : products;
  const showcase = (featured.length ? featured : products).slice(0, 5);
  const newest = [...products].slice(0, 8);

  return (
    <div>
      <section className="relative min-h-[92vh] overflow-hidden bg-ink text-bone flex items-end">
        <img src={HERO} alt="Editorial fashion portrait" className="absolute inset-0 w-full h-full object-cover opacity-50 animate-kenburns" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-ink/20" />
        <span className="absolute -right-6 top-0 font-display text-[38vw] leading-none text-bone/[0.05] select-none pointer-events-none" aria-hidden>
          7
        </span>
        <div className="relative w-full max-w-[1400px] mx-auto px-5 md:px-8 pb-20 pt-32">
          <p className="font-sans text-[11px] tracking-[0.28em] uppercase text-champagne mb-6 animate-rise">
            Personalized Women’s Fashion
          </p>
          <h1 className="font-display text-5xl md:text-7xl lg:text-[5.5rem] leading-[0.95] tracking-tight max-w-3xl mb-6 animate-rise delay-1">
            DEFINE YOUR STYLE
          </h1>
          <p className="font-sans text-base md:text-lg text-bone/70 max-w-lg mb-10 animate-rise delay-2">
            Premium fashion designed around you."
          </p>
          <div className="flex flex-wrap gap-3 animate-rise delay-3">
            <Link to="/discover">
              <Button variant="gold">Discover Your Style</Button>
            </Link>
            <Link to="/design">
              <Button variant="light">Design Your Outfit</Button>
            </Link>
          </div>
          {user && (
            <p className="mt-10 font-sans text-sm text-bone/50">
              Welcome back, {user.name}. {style ? `Curated for your ${style.toLowerCase()} style.` : "Tell us what defines you."}
            </p>
          )}
        </div>
      </section>

      <div className="bg-champagne text-ink py-3 overflow-hidden">
        <div className="marquee font-sans text-[11px] tracking-[0.2em] uppercase">
          {Array.from({ length: 8 }).map((_, i) => (
            <span key={i}>Define Your Style · Perfect Fit Guarantee · Complimentary shipping above ₹2,000 · Personalized for every woman ·</span>
          ))}
        </div>
      </div>

      <section className="py-20 md:py-28 max-w-[1400px] mx-auto px-5 md:px-8">
        <p className="font-sans text-[11px] tracking-[0.2em] uppercase text-champagne mb-3">The 7Style way</p>
        <h2 className="font-display text-4xl md:text-5xl text-ink max-w-2xl mb-12">
          Discover. Understand. Personalize. Find your perfect fit.
        </h2>
        <div className="grid md:grid-cols-3 gap-px bg-hairline border border-hairline">
          {[
            { n: "01", t: "Your style", d: "A personality, not a size chart — start with how you want to feel.", to: "/discover" },
            { n: "02", t: "Your body", d: "A private body profile so garments are cut around you.", to: "/profile" },
            { n: "03", t: "Your atelier", d: "Design, closet, and a stylist that remember who you are.", to: "/account" },
          ].map((c) => (
            <Link key={c.n} to={c.to} className="bg-bone p-8 md:p-10 hover:bg-white transition-colors">
              <p className="font-sans text-xs text-champagne mb-6">{c.n}</p>
              <h3 className="font-display text-2xl mb-3">{c.t}</h3>
              <p className="font-sans text-sm text-charcoal/60 leading-relaxed">{c.d}</p>
            </Link>
          ))}
        </div>
      </section>

      <section id="style" className="border-y border-hairline py-20">
        <div className="max-w-[1400px] mx-auto px-5 md:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <p className="font-sans text-[11px] tracking-[0.2em] uppercase text-champagne mb-2">What defines your style?</p>
              <h2 className="font-display text-4xl text-ink">Choose a personality</h2>
            </div>
            <Link to="/discover" className="font-sans text-xs tracking-wider uppercase text-ink border-b border-ink pb-0.5 hover:text-champagne hover:border-champagne">
              Take the full discovery
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {STYLE_PERSONALITIES.map((s) => (
              <button
                key={s}
                onClick={() => setStyle(s)}
                className={`aspect-[3/4] p-5 text-left border transition-all duration-300 ${
                  style === s ? "bg-ink text-bone border-ink" : "bg-white border-hairline hover:border-ink"
                }`}
              >
                <span className="font-display text-xl">{s}</span>
                <span className={`block mt-auto pt-12 font-sans text-[10px] tracking-wider uppercase ${style === s ? "text-champagne" : "text-charcoal/40"}`}>
                  {style === s ? "Selected" : "Select"}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section id="new" className="py-20 md:py-28">
        <div className="max-w-[1400px] mx-auto px-5 md:px-8">
          <div className="mb-12">
            <p className="font-sans text-[11px] tracking-[0.2em] uppercase text-champagne mb-2">New collection</p>
            <h2 className="font-display text-4xl md:text-5xl text-ink">
              {style ? `Curated for your ${style.toLowerCase()} style` : "The editorial edit"}
            </h2>
            {body.completed && (
              <p className="font-sans text-sm text-charcoal/50 mt-3">Based on your body profile — sizes are yours to refine on each piece.</p>
            )}
          </div>
          {loading ? (
            <Spinner label="Opening the collection" />
          ) : error ? (
            <ErrorState message={error} onRetry={load} />
          ) : showcase.length === 0 ? (
            <p className="font-display text-2xl text-charcoal/30">The collection is being prepared.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {showcase.map((p, i) => (
                <div key={p._id} className={i === 0 ? "md:col-span-2 lg:col-span-2 lg:row-span-2" : ""}>
                  <ProductCard product={p} featured={i === 0} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="bg-ink text-bone py-24">
        <div className="max-w-[1400px] mx-auto px-5 md:px-8 grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="font-sans text-[11px] tracking-[0.2em] uppercase text-champagne mb-4">The promise</p>
            <h2 className="font-display text-4xl md:text-5xl leading-tight mb-6">
              We don’t make women fit our clothes.
            </h2>
            <p className="font-sans text-bone/60 leading-relaxed max-w-md mb-8">
            Define Your Style — Premium Personalized Women's Fashion Brand
            </p>
            <Link to="/profile">
              <Button variant="gold">Create your body profile</Button>
            </Link>
          </div>
          <div className="aspect-[4/5] overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80"
              alt="Tailored silhouette"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {newest.length > 0 && (
        <section className="py-20 max-w-[1400px] mx-auto px-5 md:px-8">
          <div className="flex items-end justify-between mb-10">
            <h2 className="font-display text-3xl">You may love these</h2>
            <Link to="/shop" className="font-sans text-xs tracking-wider uppercase text-champagne">Full shop</Link>
          </div>
          <div className="flex gap-6 overflow-x-auto no-scrollbar snap-x">
            {newest.map((p) => (
              <div key={p._id} className="min-w-[240px] max-w-[240px] snap-start">
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
