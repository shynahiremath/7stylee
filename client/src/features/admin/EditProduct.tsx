import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { productService } from "../../services/products";
import type { Product } from "../../types/types";
import { Spinner, ErrorState } from "../../components/ui/States";
import { errorMessage } from "../../lib/utils";
import ProductForm from "./ProductForm";

export default function EditProduct() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    productService.get(id).then((res) => setProduct(res.data.product)).catch((err) => setError(errorMessage(err, "Product not found")));
  }, [id]);

  return (
    <div className="p-6 md:p-10 max-w-4xl">
      <p className="text-[11px] tracking-wider uppercase text-champagne mb-1">Admin</p>
      <h1 className="font-display text-3xl mb-6">Edit product</h1>
      <Link to="/admin/products" className="text-xs tracking-wider uppercase text-charcoal/40">← Products</Link>
      {error && <ErrorState message={error} />}
      {!product && !error && <Spinner />}
      {product && <ProductForm mode="edit" productId={product._id} initial={product} />}
    </div>
  );
}