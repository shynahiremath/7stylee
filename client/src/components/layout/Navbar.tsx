import { useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { useCartStore } from "../../store/cartStore";
import { useUiStore } from "../../store/uiStore";
import { usePrefStore } from "../../store/preferenceStore";

const links = [
  { to: "/shop", label: "Shop" },
  { to: "/discover", label: "Your Style" },
  { to: "/design", label: "Design" },
  { to: "/stylist", label: "Stylist" },
  { to: "/closet", label: "Closet" },
];

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const count = useCartStore((s) => s.items.reduce((n, i) => n + i.quantity, 0));
  const { navOpen, toggleNav, openCart } = useUiStore();
  const location = useLocation();
  const wishlist = usePrefStore((s) => s.wishlistIds.length);

  useEffect(() => {
    toggleNav(false);
  }, [location.pathname, toggleNav]);

  const navClass = ({ isActive }: { isActive: boolean }) =>
    `font-sans text-[11px] tracking-[0.18em] uppercase transition-colors ${isActive ? "text-champagne" : "text-bone/80 hover:text-champagne"}`;

  return (
    <header className="bg-ink text-bone sticky top-0 z-50 border-b border-bone/10">
      <div className="max-w-[1400px] mx-auto px-5 md:px-8 h-[68px] flex items-center justify-between gap-4">
        <Link to="/" className="font-display text-[1.65rem] tracking-tight hover:text-champagne transition-colors">
          7STYLE
        </Link>

        <nav className="hidden lg:flex items-center gap-7" aria-label="Primary">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} className={navClass}>
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-5">
          {user && (
            <p className="hidden xl:block font-sans text-[11px] tracking-wide text-bone/50">
              Welcome back, <span className="text-bone">{user.name.split(" ")[0]}</span>
            </p>
          )}
          <Link to="/wishlist" className="font-sans text-[11px] tracking-[0.18em] uppercase text-bone/80 hover:text-champagne" aria-label="Wishlist">
            Wish {wishlist > 0 ? `· ${wishlist}` : ""}
          </Link>
          {user ? (
            <>
              <Link to="/account" className="font-sans text-[11px] tracking-[0.18em] uppercase text-bone/80 hover:text-champagne">
                Atelier
              </Link>
              {user.role === "ADMIN" && (
                <Link to="/admin" className="font-sans text-[11px] tracking-[0.18em] uppercase text-champagne">
                  Admin
                </Link>
              )}
              <button onClick={() => logout()} className="font-sans text-[11px] tracking-[0.18em] uppercase text-bone/80 hover:text-champagne">
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="font-sans text-[11px] tracking-[0.18em] uppercase text-bone/80 hover:text-champagne">
              Sign In
            </Link>
          )}
          <button
            onClick={openCart}
            className="font-sans text-[11px] tracking-[0.18em] uppercase border border-champagne text-champagne px-4 py-2 hover:bg-champagne hover:text-ink transition-colors"
          >
            Bag {count > 0 ? `· ${count}` : ""}
          </button>
        </div>

        <div className="flex md:hidden items-center gap-3">
          <button onClick={openCart} className="font-sans text-[11px] tracking-wider uppercase text-champagne" aria-label="Open bag">
            Bag {count > 0 ? count : ""}
          </button>
          <button
            onClick={() => toggleNav()}
            className="flex flex-col gap-1.5 p-1"
            aria-label="Toggle menu"
            aria-expanded={navOpen}
          >
            <span className={`block w-6 h-px bg-bone transition-all ${navOpen ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`block w-6 h-px bg-bone transition-all ${navOpen ? "opacity-0" : ""}`} />
            <span className={`block w-6 h-px bg-bone transition-all ${navOpen ? "-rotate-45 -translate-y-2" : ""}`} />
          </button>
        </div>
      </div>

      {navOpen && (
        <nav className="md:hidden bg-ink border-t border-bone/10 px-6 py-6 flex flex-col gap-4 animate-fade-up" aria-label="Mobile">
          {links.map((l) => (
            <Link key={l.to} to={l.to} className="font-sans text-sm tracking-wider uppercase text-bone/80">
              {l.label}
            </Link>
          ))}
          <Link to="/wishlist" className="font-sans text-sm tracking-wider uppercase text-bone/80">Wishlist</Link>
          {user ? (
            <>
              <Link to="/account" className="font-sans text-sm tracking-wider uppercase text-bone/80">Atelier</Link>
              {user.role === "ADMIN" && <Link to="/admin" className="text-champagne text-sm tracking-wider uppercase">Admin</Link>}
              <button onClick={() => logout()} className="text-left font-sans text-sm tracking-wider uppercase text-bone/80">Logout</button>
            </>
          ) : (
            <Link to="/login" className="font-sans text-sm tracking-wider uppercase text-champagne">Sign In</Link>
          )}
        </nav>
      )}
    </header>
  );
}
