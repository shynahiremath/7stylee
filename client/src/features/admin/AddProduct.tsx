import { Link } from "react-router-dom";
import ProductForm from "./ProductForm";

export default function AddProduct() {
  return (
    <div className="p-6 md:p-10 max-w-4xl">
      <p className="text-[11px] tracking-wider uppercase text-champagne mb-1">Admin</p>
      <h1 className="font-display text-3xl mb-6">Add product</h1>
      <Link to="/admin/products" className="text-xs tracking-wider uppercase text-charcoal/40">← Products</Link>
      <ProductForm mode="create" />
    </div>
  );
}