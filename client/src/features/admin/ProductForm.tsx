import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { productService } from "../../services/products";
import { errorMessage } from "../../lib/utils";
import { Field, Area } from "../../components/ui/Field";
import Button from "../../components/ui/Button";
import { Notice } from "../../components/ui/States";
import ImageUploader from "../../components/admin/ImageUploader";
import type { Product } from "../../types/types";

interface VariantForm {
  color: string;
  size: string;
  sku: string;
  stock: number;
  priceModifier: number;
}

const CATEGORIES = ["Dresses", "Tops", "Blouses", "Co-ords", "Ethnic", "Occasion Wear", "Office Wear", "Party Wear", "Casual", "Kurtis"];

interface Props {
  mode: "create" | "edit";
  productId?: string;
  initial?: Product;
}

export default function ProductForm({ mode, productId, initial }: Props) {
  const [name, setName] = useState(initial?.name || "");
  const [description, setDescription] = useState(initial?.description || "");
  const [category, setCategory] = useState(initial?.category || "");
  const [basePrice, setBasePrice] = useState(initial ? String(initial.basePrice) : "");
  const [occasionTags, setOccasionTags] = useState(initial?.occasionTags?.join(", ") || "");
  const [images, setImages] = useState<string[]>(initial?.images || []);
  const [customizable, setCustomizable] = useState(initial?.customizable || false);
  const [variants, setVariants] = useState<VariantForm[]>(
    initial?.variants?.length
      ? initial.variants.map((v) => ({ color: v.color, size: v.size, sku: v.sku, stock: v.stock, priceModifier: v.priceModifier }))
      : [{ color: "", size: "", sku: "", stock: 0, priceModifier: 0 }]
  );
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const updateVariant = (index: number, field: keyof VariantForm, value: string | number) => {
    const updated = [...variants];
    updated[index] = { ...updated[index], [field]: value };
    setVariants(updated);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const payload = {
      name, description, category,
      basePrice: Number(basePrice),
      occasionTags: occasionTags.split(",").map((t) => t.trim()).filter(Boolean),
      images, customizable, variants,
    };
    try {
      if (mode === "edit" && productId) {
        await productService.update(productId, payload);
      } else {
        await productService.create(payload);
      }
      navigate("/admin/products");
    } catch (err) {
      setError(errorMessage(err, mode === "edit" ? "Failed to update product" : "Failed to create product"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
      {error && <Notice tone="error">{error}</Notice>}
      <Field label="Name" value={name} onChange={(e) => setName(e.target.value)} required />
      <Area label="Description" value={description} onChange={(e) => setDescription(e.target.value)} rows={4} required />
      <div className="grid sm:grid-cols-2 gap-6">
        <label className="block">
          <span className="block font-sans text-xs tracking-wider uppercase text-charcoal/50 mb-1">Category</span>
          <select value={category} onChange={(e) => setCategory(e.target.value)} required className="w-full border-b border-hairline bg-transparent py-3">
            <option value="">Select</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </label>
        <Field label="Base price (₹)" type="number" min={0} value={basePrice} onChange={(e) => setBasePrice(e.target.value)} required />
      </div>
      <Field label="Occasion tags (comma-separated)" value={occasionTags} onChange={(e) => setOccasionTags(e.target.value)} />

      <ImageUploader images={images} onChange={setImages} />

      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={customizable} onChange={(e) => setCustomizable(e.target.checked)} />
        Customizable
      </label>
      <div>
        <div className="flex justify-between mb-3">
          <p className="text-xs tracking-wider uppercase text-champagne">Variants</p>
          <button type="button" className="text-xs uppercase tracking-wide" onClick={() => setVariants([...variants, { color: "", size: "", sku: "", stock: 0, priceModifier: 0 }])}>
            + Add
          </button>
        </div>
        {variants.map((v, i) => (
          <div key={i} className="grid grid-cols-2 md:grid-cols-6 gap-2 mb-2">
            <input placeholder="Colour" required value={v.color} onChange={(e) => updateVariant(i, "color", e.target.value)} className="border-b border-hairline bg-transparent py-2 text-sm" />
            <input placeholder="Size" required value={v.size} onChange={(e) => updateVariant(i, "size", e.target.value)} className="border-b border-hairline bg-transparent py-2 text-sm" />
            <input placeholder="SKU" required value={v.sku} onChange={(e) => updateVariant(i, "sku", e.target.value)} className="border-b border-hairline bg-transparent py-2 text-sm" />
            <input type="number" min={0} value={v.stock} onChange={(e) => updateVariant(i, "stock", Number(e.target.value))} className="border-b border-hairline bg-transparent py-2 text-sm" />
            <input type="number" value={v.priceModifier} onChange={(e) => updateVariant(i, "priceModifier", Number(e.target.value))} className="border-b border-hairline bg-transparent py-2 text-sm" />
            <button type="button" disabled={variants.length === 1} onClick={() => setVariants(variants.filter((_, j) => j !== i))}>×</button>
          </div>
        ))}
      </div>
      <Button type="submit" disabled={loading}>
        {loading ? (mode === "edit" ? "Saving…" : "Creating…") : mode === "edit" ? "Save changes" : "Create product"}
      </Button>
    </form>
  );
}