import { useEffect, useState } from "react";
import { orderService } from "../../services/orders";
import { productService } from "../../services/products";
import { userService } from "../../services/users";
import type { Order, Product, User } from "../../types/types";
import { errorMessage } from "../../lib/utils";
import { Spinner, ErrorState } from "../../components/ui/States";

export function AdminCustomers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = () => {
    userService
      .all()
      .then((r) => setUsers(r.data.users))
      .catch((e) => setError(errorMessage(e)))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleRoleChange = async (id: string, role: string) => {
    setBusyId(id);
    try {
      await userService.updateRole(id, role);
      load();
    } catch (e) {
      alert(errorMessage(e, "Could not update role"));
    } finally {
      setBusyId(null);
    }
  };

  const handleStatusToggle = async (id: string, current: boolean) => {
    setBusyId(id);
    try {
      await userService.updateStatus(id, !current);
      load();
    } catch (e) {
      alert(errorMessage(e, "Could not update status"));
    } finally {
      setBusyId(null);
    }
  };

  if (loading) return <Spinner />;
  if (error) return <div className="p-10"><ErrorState message={error} onRetry={load} /></div>;

  return (
    <div className="p-6 md:p-10">
      <h1 className="font-display text-3xl mb-8">Customers</h1>
      <div className="border border-hairline divide-y">
        {users.map((u) => (
          <div key={u.id} className="px-5 py-4 grid md:grid-cols-[1fr_140px_120px] gap-3 items-center">
            <div>
              <p className="font-medium">{u.name}</p>
              <p className="text-xs text-charcoal/40">{u.email}</p>
            </div>
            <select
              value={u.role}
              disabled={busyId === u.id}
              onChange={(e) => handleRoleChange(u.id, e.target.value)}
              className="border border-hairline bg-transparent px-2 py-2 text-xs uppercase"
            >
              <option value="CUSTOMER">Customer</option>
              <option value="ADMIN">Admin</option>
            </select>
            <button
              onClick={() => handleStatusToggle(u.id, u.isActive)}
              disabled={busyId === u.id}
              className={`text-xs tracking-wider uppercase px-3 py-2 border ${
                u.isActive ? "border-hairline text-charcoal/60" : "border-red-700 text-red-700"
              }`}
            >
              {u.isActive ? "Active — Deactivate" : "Deactivated — Reactivate"}
            </button>
          </div>
        ))}
        {users.length === 0 && <p className="p-8 text-charcoal/40">No customers yet.</p>}
      </div>
    </div>
  );
}

export function AdminInventory() {
  const [products, setProducts] = useState<Product[]>([]);
  const [savingSku, setSavingSku] = useState<string | null>(null);

  const load = () => {
    productService.list().then((r) => setProducts(r.data.products));
  };

  useEffect(() => {
    load();
  }, []);

  const handleStockChange = async (product: Product, sku: string, newStock: number) => {
    setSavingSku(sku);
    const updatedVariants = product.variants.map((v) =>
      v.sku === sku ? { ...v, stock: newStock } : v
    );
    try {
      await productService.update(product._id, { variants: updatedVariants });
      load();
    } catch {
      alert("Could not update stock");
    } finally {
      setSavingSku(null);
    }
  };

  return (
    <div className="p-6 md:p-10">
      <h1 className="font-display text-3xl mb-8">Inventory</h1>
      <div className="overflow-x-auto border border-hairline">
        <table className="w-full text-sm">
          <thead className="bg-hairline/50 text-left text-xs uppercase tracking-wider text-charcoal/40">
            <tr><th className="p-3">Product</th><th>SKU</th><th>Size</th><th>Colour</th><th>Stock</th></tr>
          </thead>
          <tbody>
            {products.flatMap((p) => p.variants.map((v) => (
              <tr key={v.sku} className="border-t border-hairline">
                <td className="p-3">{p.name}</td>
                <td>{v.sku}</td>
                <td>{v.size}</td>
                <td>{v.color}</td>
                <td className={v.stock < 3 ? "text-red-700" : ""}>
                  <input
                    type="number"
                    min={0}
                    defaultValue={v.stock}
                    disabled={savingSku === v.sku}
                    onBlur={(e) => {
                      const newStock = Number(e.target.value);
                      if (newStock !== v.stock) handleStockChange(p, v.sku, newStock);
                    }}
                    className="w-16 border-b border-hairline bg-transparent py-1"
                  />
                </td>
              </tr>
            )))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function AdminAnalytics() {
  const [orders, setOrders] = useState<Order[]>([]);
  useEffect(() => {
    orderService.all().then((r) => setOrders(r.data.orders));
  }, []);
  const byStatus = orders.reduce<Record<string, number>>((acc, o) => {
    acc[o.status] = (acc[o.status] || 0) + 1;
    return acc;
  }, {});
  return (
    <div className="p-6 md:p-10">
      <h1 className="font-display text-3xl mb-2">Analytics</h1>
      <p className="text-sm text-charcoal/50 mb-8">Built from GET /api/orders. Coupons and reviews have no APIs.</p>
      <div className="grid sm:grid-cols-3 gap-4">
        {Object.entries(byStatus).map(([k, v]) => (
          <div key={k} className="border border-hairline p-6">
            <p className="text-[11px] tracking-wider uppercase text-champagne">{k}</p>
            <p className="font-display text-3xl mt-2">{v}</p>
          </div>
        ))}
        {orders.length === 0 && <p className="text-charcoal/40">No sales data yet.</p>}
      </div>
      <div className="mt-12 border border-hairline p-8">
        <h2 className="font-display text-2xl mb-2">Coupons & reviews</h2>
        <p className="text-sm text-charcoal/50">These admin sections are ready in the UI, but the backend does not expose coupon or review endpoints yet.</p>
      </div>
    </div>
  );
}