import { Link } from "react-router-dom";
import type { Product } from "../../types/types";
import { formatInr, inStock, productImage } from "../../lib/utils";
import { usePrefStore } from "../../store/preferenceStore";
import { useUiStore } from "../../store/uiStore";

export default function ProductCard({
  product,
  featured = false,
}: {
  product: Product;
  featured?: boolean;
}) {
  const { inWishlist, toggleWishlist } = usePrefStore();
  const toast = useUiStore((s) => s.toast);
  const loved = inWishlist(product._id);
  const img = productImage(product);
  const hover = productImage(product, 1) || img;
  const available = inStock(product);

  return (
    <article className={`group relative bg-bone ${featured ? "lg:row-span-2" : ""}`}>
      <Link to={`/products/${product._id}`} className="block">
        <div className={`relative overflow-hidden bg-hairline ${featured ? "aspect-[3/4] lg:aspect-auto lg:h-full min-h-[420px]" : "aspect-[3/4]"}`}>
          {img ? (
            <>
              <img
                src={img}
                alt={product.name}
                className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 group-hover:opacity-0"
                loading="lazy"
              />
              <img
                src={hover}
                alt=""
                className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                loading="lazy"
              />
            </>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-charcoal/5 to-ink/10">
              <span className="font-display italic text-8xl text-charcoal/10 select-none">{product.name.charAt(0)}</span>
            </div>
          )}
          <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/20 transition-colors duration-400" />
          <div className="absolute bottom-5 left-5 right-5 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
            <span className="block text-center font-sans text-xs tracking-wider uppercase text-bone border border-bone/50 py-2.5 backdrop-blur-sm">
              Quick view
            </span>
          </div>
          {!available && (
            <span className="absolute top-4 left-4 font-sans text-[10px] tracking-wider uppercase bg-ink text-bone px-2 py-1">
              Waitlist
            </span>
          )}
          {product.customizable && (
            <span className="absolute top-4 right-4 font-sans text-[10px] tracking-wider uppercase text-champagne">
              Custom
            </span>
          )}
        </div>
        <div className="pt-4 pb-8 pr-8">
          <p className="font-sans text-[11px] tracking-[0.18em] uppercase text-charcoal/40 mb-1">{product.category}</p>
          <h3 className={`font-display text-ink leading-snug ${featured ? "text-3xl" : "text-xl"}`}>{product.name}</h3>
          <p className="font-sans text-sm text-charcoal/70 mt-2">{formatInr(product.basePrice)}</p>
        </div>
      </Link>
      <button
        type="button"
        aria-label={loved ? "Remove from wishlist" : "Save to wishlist"}
        onClick={() => {
          const on = toggleWishlist(product._id);
          toast(on ? "Saved to your wishlist." : "Removed from wishlist.", on ? "success" : "info");
        }}
        className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center text-ink/70 hover:text-champagne transition-colors z-10"
      >
        <svg width="18" height="16" viewBox="0 0 18 16" fill={loved ? "currentColor" : "none"} className={loved ? "text-champagne" : ""}>
          <path
            d="M9 14.5S1.5 9.2 1.5 5.2A3.7 3.7 0 0 1 9 3.8a3.7 3.7 0 0 1 7.5 1.4c0 4-7.5 9.3-7.5 9.3Z"
            stroke="currentColor"
            strokeWidth="1.2"
          />
        </svg>
      </button>
    </article>
  );
}
