import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { productService } from "../../services/products";
import type { Product } from "../../types/types";
import { errorMessage, formatInr, unitPrice } from "../../lib/utils";
import { useAuthStore } from "../../store/authStore";
import { useCartStore } from "../../store/cartStore";
import { usePrefStore } from "../../store/preferenceStore";
import { useUiStore } from "../../store/uiStore";
import ProductCard from "../../components/product/ProductCard";
import { ErrorState, Spinner } from "../../components/ui/States";
import Button from "../../components/ui/Button";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [error, setError] = useState("");
  const [img, setImg] = useState(0);
  const [zoom, setZoom] = useState({ x: 50, y: 50, on: false });
  const [color, setColor] = useState("");
  const [sku, setSku] = useState("");
  const [adding, setAdding] = useState(false);
  const user = useAuthStore((s) => s.user);
  const add = useCartStore((s) => s.add);
  const { inWishlist, toggleWishlist, body } = usePrefStore();
  const { toast, openCart } = useUiStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;
    productService
      .get(id)
      .then((res) => {
        const p = res.data.product;
        setProduct(p);
        const first = p.variants[0];
        setColor(first?.color || "");
        setSku(first?.sku || "");
        setImg(0);
      })
      .catch((err) => setError(errorMessage(err, "Product not found")));
    productService.list().then((res) => setRelated(res.data.products.filter((p) => p._id !== id).slice(0, 4)));
  }, [id]);

  const variant = product?.variants.find((v) => v.sku === sku);
  const colors = useMemo(() => (product ? [...new Set(product.variants.map((v) => v.color))] : []), [product]);
  const sizes = product?.variants.filter((v) => v.color === color) || [];
  const price = product ? unitPrice(product, variant) : 0;
  const images = product?.images?.length ? product.images : [];

  const handleAdd = async (buyNow = false) => {
    if (!user) {
      navigate("/login", { state: { from: `/products/${id}` } });
      return;
    }
    if (!product || !sku) return;
    setAdding(true);
    try {
      await add(product._id, sku, 1);
      toast("Added to your bag.");
      if (buyNow) navigate("/checkout");
      else openCart();
    } catch (err) {
      toast(errorMessage(err, "Could not add to bag"), "error");
    } finally {
      setAdding(false);
    }
  };

  if (error) return <div className="max-w-[1200px] mx-auto px-8 py-16"><ErrorState message={error} /></div>;
  if (!product) return <Spinner label="Unveiling the piece" />;

  const loved = inWishlist(product._id);

  return (
    <div className="max-w-[1400px] mx-auto px-5 md:px-8 py-8">
      <nav className="font-sans text-xs text-charcoal/40 mb-8 flex gap-2 flex-wrap">
        <Link to="/shop" className="hover:text-champagne">Shop</Link>
        <span>·</span>
        <span>{product.category}</span>
        <span>·</span>
        <span className="text-charcoal">{product.name}</span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
        <div>
          <div
            className="relative aspect-[3/4] bg-hairline overflow-hidden mb-3"
            onMouseMove={(e) => {
              const r = e.currentTarget.getBoundingClientRect();
              setZoom({
                on: true,
                x: ((e.clientX - r.left) / r.width) * 100,
                y: ((e.clientY - r.top) / r.height) * 100,
              });
            }}
            onMouseLeave={() => setZoom((z) => ({ ...z, on: false }))}
          >
            {images[img] ? (
              <img
                src={images[img]}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-200"
                style={zoom.on ? { transform: "scale(1.6)", transformOrigin: `${zoom.x}% ${zoom.y}%` } : undefined}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="font-display italic text-[140px] text-charcoal/10">{product.name.charAt(0)}</span>
              </div>
            )}
          </div>
          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {images.map((src, i) => (
                <button key={src} onClick={() => setImg(i)} className={`aspect-square overflow-hidden border ${i === img ? "border-ink" : "border-transparent"}`}>
                  <img src={src} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <p className="font-sans text-[11px] tracking-[0.2em] uppercase text-charcoal/40 mb-3">{product.category}</p>
          <h1 className="font-display text-4xl md:text-5xl text-ink leading-tight mb-4">{product.name}</h1>
          <p className="font-sans text-2xl mb-6">{formatInr(price)}</p>
          {(product.occasionTags || []).length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {product.occasionTags.map((t) => (
                <span key={t} className="text-[11px] tracking-wider uppercase border border-champagne/40 text-champagne px-3 py-1">{t}</span>
              ))}
            </div>
          )}
          <p className="font-sans text-charcoal/70 leading-relaxed mb-8">{product.description}</p>

          <div className="border border-hairline p-5 mb-8 bg-white">
            <p className="font-sans text-[11px] tracking-wider uppercase text-champagne mb-2">Find my perfect size</p>
            {body.completed ? (
              <>
                <p className="font-display text-2xl text-ink">
                  {body.preferredSize ? `Your recommended size: ${body.preferredSize}` : "Your 7Style Body Profile is ready"}
                </p>
                <p className="font-sans text-sm text-charcoal/55 mt-2">
                  Based on your saved 7Style Body Profile ({body.preferredFit.toLowerCase()} fit
                  {body.height ? ` · ${body.height} cm` : ""}). A dedicated recommendation API is not on the server yet — this uses the size you saved in your profile.
                </p>
              </>
            ) : (
              <>
                <p className="font-sans text-sm text-charcoal/60 mb-3">Complete your body profile for a more personal fit conversation.</p>
                <Link to="/profile" className="font-sans text-xs tracking-wider uppercase text-champagne border-b border-champagne">Create body profile</Link>
              </>
            )}
          </div>

          {colors.length > 0 && (
            <div className="mb-6">
              <p className="font-sans text-xs tracking-wider uppercase text-charcoal/50 mb-3">Colour — {color}</p>
              <div className="flex flex-wrap gap-2">
                {colors.map((c) => (
                  <button
                    key={c}
                    onClick={() => {
                      setColor(c);
                      const next = product.variants.find((v) => v.color === c && v.stock > 0) || product.variants.find((v) => v.color === c);
                      if (next) setSku(next.sku);
                    }}
                    className={`px-4 py-2 text-xs border ${color === c ? "bg-ink text-bone border-ink" : "border-hairline"}`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mb-8">
            <p className="font-sans text-xs tracking-wider uppercase text-charcoal/50 mb-3">Size</p>
            <div className="flex flex-wrap gap-2">
              {sizes.map((v) => (
                <button
                  key={v.sku}
                  disabled={v.stock === 0}
                  onClick={() => setSku(v.sku)}
                  className={`w-12 h-12 text-xs border ${sku === v.sku ? "bg-ink text-bone border-ink" : v.stock === 0 ? "line-through text-charcoal/25 border-hairline" : "border-hairline"}`}
                >
                  {v.size}
                </button>
              ))}
            </div>
            {variant && (
              <p className="font-sans text-xs text-charcoal/45 mt-3">
                {variant.stock > 0 ? `${variant.stock} available` : "Currently unavailable"}
              </p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <Button className="flex-1" disabled={adding || !sku || variant?.stock === 0} onClick={() => handleAdd(false)}>
              {adding ? "Adding…" : "Add to bag"}
            </Button>
            <Button variant="ghost" className="flex-1" disabled={adding || !sku} onClick={() => handleAdd(true)}>
              Buy now
            </Button>
          </div>
          <button
            type="button"
            onClick={() => {
              const on = toggleWishlist(product._id);
              toast(on ? "Saved to your wishlist." : "Removed from wishlist.", on ? "success" : "info");
            }}
            className="font-sans text-xs tracking-wider uppercase text-charcoal/50 hover:text-champagne mb-10"
          >
            {loved ? "Saved to wishlist" : "Add to wishlist"}
          </button>

          <div className="border-t border-hairline pt-8 space-y-4">
            <details className="group">
              <summary className="cursor-pointer font-sans text-xs tracking-wider uppercase">Fabric & care</summary>
              <p className="font-sans text-sm text-charcoal/60 mt-3 leading-relaxed">
                Composition and care notes are included in the product description when provided by the atelier. A dedicated fabric field is not yet stored on the server.
              </p>
            </details>
            <details>
              <summary className="cursor-pointer font-sans text-xs tracking-wider uppercase">Reviews</summary>
              <p className="font-sans text-sm text-charcoal/60 mt-3">Reviews are not yet available from the backend.</p>
            </details>
            {product.customizable && (
              <Link to="/design" className="block font-sans text-xs tracking-wider uppercase text-champagne">This piece can be designed — open the studio</Link>
            )}
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-24">
          <h2 className="font-display text-3xl mb-8">You may love these</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {related.slice(0, 4).map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
