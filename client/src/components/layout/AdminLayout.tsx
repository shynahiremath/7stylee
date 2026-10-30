import { NavLink, Outlet } from "react-router-dom";

const items = [
  { to: "/admin", label: "Overview", end: true },
  { to: "/admin/products", label: "Products" },
  { to: "/admin/products/new", label: "Add product" },
  { to: "/admin/orders", label: "Orders" },
  { to: "/admin/customers", label: "Customers" },
  { to: "/admin/inventory", label: "Inventory" },
  { to: "/admin/analytics", label: "Analytics" },
];

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-bone flex">
      <aside className="hidden md:flex w-56 shrink-0 bg-ink text-bone flex-col py-8 px-5">
        <p className="font-sans text-[10px] tracking-[0.2em] uppercase text-champagne mb-8">7Style Atelier</p>
        <nav className="flex flex-col gap-3">
          {items.map((i) => (
            <NavLink
              key={i.to}
              to={i.to}
              end={i.end}
              className={({ isActive }) =>
                `font-sans text-xs tracking-wider uppercase ${isActive ? "text-champagne" : "text-bone/55 hover:text-bone"}`
              }
            >
              {i.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <div className="flex-1 min-w-0">
        <div className="md:hidden flex gap-3 overflow-x-auto no-scrollbar px-4 py-3 bg-ink text-bone">
          {items.map((i) => (
            <NavLink key={i.to} to={i.to} end={i.end} className={({ isActive }) => `whitespace-nowrap text-[11px] tracking-wider uppercase ${isActive ? "text-champagne" : "text-bone/60"}`}>
              {i.label}
            </NavLink>
          ))}
        </div>
        <Outlet />
      </div>
    </div>
  );
}
