import { NavLink, Outlet, Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

const links = [
  { to: "/account", end: true, label: "Overview" },
  { to: "/account/orders", label: "Orders" },
  { to: "/account/profile", label: "Body profile" },
  { to: "/account/style", label: "Style profile" },
  { to: "/wishlist", label: "Wishlist" },
  { to: "/closet", label: "Smart closet" },
  { to: "/account/designs", label: "Saved designs" },
  { to: "/account/addresses", label: "Addresses" },
  { to: "/account/settings", label: "Settings" },
];

export default function AccountLayout() {
  const user = useAuthStore((s) => s.user);
  const loc = useLocation();
  if (!user) return <Navigate to="/login" state={{ from: loc.pathname }} replace />;

  return (
    <div className="max-w-[1400px] mx-auto px-5 md:px-8 py-12 grid md:grid-cols-[200px_1fr] gap-10">
      <aside>
        <p className="font-sans text-[11px] tracking-wider uppercase text-champagne mb-2">Atelier</p>
        <p className="font-display text-2xl mb-8">{user.name.split(" ")[0]}</p>
        <nav className="flex md:flex-col gap-3 overflow-x-auto no-scrollbar">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                `whitespace-nowrap font-sans text-xs tracking-wider uppercase ${isActive ? "text-ink" : "text-charcoal/40 hover:text-ink"}`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <div className="min-w-0">
        <Outlet />
      </div>
    </div>
  );
}
