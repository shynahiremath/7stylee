import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { productService } from "../../services/products";
import type { Product } from "../../types/types";
import { formatInr } from "../../lib/utils";
import { Spinner } from "../../components/ui/States";

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchProducts = () => {
    productService.list().then((r) => setProducts(r.data.products)).finally(() => setLoading(false));
  };

  useEffect(() => { fetchProducts(); }, []);

  const stock = (p: Product) => p.variants.reduce((s, v) => s + v.stock, 0);

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Delete "${name}"? This can't be undone.`)) return;
    setDeletingId(id);
    try {
      await productService.remove(id);
      fetchProducts();
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="p-6 md:p-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-display text-3xl">Products</h1>
        <Link to="/admin/products/new" className="bg-champagne text-ink px-5 py-2.5 text-xs tracking-wider uppercase">Add product</Link>
      </div>
      <div className="border border-hairline divide-y divide-hairline">
        {products.map((p) => (
          <div key={p._id} className="grid grid-cols-[1fr_120px_100px_80px_140px] gap-3 px-5 py-4 text-sm items-center">
            <div>
              <p className="font-display text-lg">{p.name}</p>
              <p className="text-xs text-charcoal/40">{p.variants.length} variants</p>
            </div>
            <p className="text-xs uppercase tracking-wide text-charcoal/50">{p.category}</p>
            <p className="text-right">{formatInr(p.basePrice)}</p>
            <p className={`text-right ${stock(p) < 5 ? "text-red-700" : ""}`}>{stock(p)}</p>
            <div className="flex justify-end gap-4 text-xs tracking-wider uppercase">
              <Link to={`/admin/products/${p._id}/edit`} className="text-charcoal/60 hover:text-champagne">Edit</Link>
              <button onClick={() => handleDelete(p._id, p.name)} disabled={deletingId === p._id} className="text-red-700 hover:text-red-900 disabled:opacity-40">
                {deletingId === p._id ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        ))}
        {products.length === 0 && <p className="p-8 text-charcoal/40">No products yet.</p>}
      </div>
    </div>
  );
}