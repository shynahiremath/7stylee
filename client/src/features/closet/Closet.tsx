import { useEffect, useState, type FormEvent } from "react";
import { usePrefStore } from "../../store/preferenceStore";
import type { ClosetItem } from "../../types/types";
import { Field } from "../../components/ui/Field";
import Button from "../../components/ui/Button";
import { productService } from "../../services/products";
import type { Product } from "../../types/types";
import ProductCard from "../../components/product/ProductCard";
import { useAuthStore } from "../../store/authStore";

const CATS: ClosetItem["category"][] = ["Tops", "Bottoms", "Dresses", "Shoes", "Accessories", "Jackets"];

export default function Closet() {
  const { closet, addCloset, removeCloset, outfits, addOutfit } = usePrefStore();
  const user = useAuthStore((s) => s.user);
  const [cat, setCat] = useState<ClosetItem["category"]>("Tops");
  const [name, setName] = useState("");
  const [color, setColor] = useState("");
  const [combo, setCombo] = useState({ topId: "", bottomId: "", shoesId: "", accessoryId: "" });
  const [recs, setRecs] = useState<Product[]>([]);

  useEffect(() => {
    productService.list().then((r) => setRecs(r.data.products.slice(0, 4))).catch(() => {});
  }, []);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    addCloset({ id: crypto.randomUUID(), name, category: cat, color, notes: "" });
    setName("");
    setColor("");
  };

  const by = (c: ClosetItem["category"]) => closet.filter((i) => i.category === c);

  return (
    <div className="max-w-[1400px] mx-auto px-5 md:px-8 py-12">
      <p className="font-sans text-[11px] tracking-[0.2em] uppercase text-champagne mb-2">Digital wardrobe</p>
      <h1 className="font-display text-4xl md:text-5xl mb-3">Smart closet</h1>
      <p className="text-sm text-charcoal/50 mb-10 max-w-xl">
        {user ? `${user.name.split(" ")[0]}, ` : ""}your pieces live here on this device. There is no closet API on the server yet — 7Style products below are from the real catalog.
      </p>

      <div className="flex gap-2 overflow-x-auto no-scrollbar mb-8">
        {CATS.map((c) => (
          <button key={c} onClick={() => setCat(c)} className={`px-4 py-2 text-xs tracking-wider uppercase border whitespace-nowrap ${cat === c ? "bg-ink text-bone border-ink" : "border-hairline"}`}>
            {c}
          </button>
        ))}
      </div>

      <form onSubmit={submit} className="grid sm:grid-cols-[1fr_1fr_auto] gap-4 items-end mb-10 max-w-2xl">
        <Field label="Item name" value={name} onChange={(e) => setName(e.target.value)} required />
        <Field label="Colour" value={color} onChange={(e) => setColor(e.target.value)} />
        <Button type="submit">Add to closet</Button>
      </form>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-16">
        {by(cat).length === 0 && <p className="text-charcoal/40 font-display text-2xl col-span-full py-8">Nothing in {cat.toLowerCase()} yet.</p>}
        {by(cat).map((i) => (
          <div key={i.id} className="border border-hairline p-6 bg-white">
            <p className="text-[11px] tracking-wider uppercase text-champagne">{i.category}</p>
            <p className="font-display text-2xl mt-2">{i.name}</p>
            <p className="text-sm text-charcoal/50">{i.color}</p>
            <button className="mt-4 text-xs uppercase tracking-wide text-charcoal/40" onClick={() => removeCloset(i.id)}>Remove</button>
          </div>
        ))}
      </div>

      <h2 className="font-display text-3xl mb-6">Outfit combinations</h2>
      <p className="text-sm text-charcoal/50 mb-6">Top + bottom + shoes + accessories</p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { k: "topId" as const, label: "Top", cat: "Tops" as const },
          { k: "bottomId" as const, label: "Bottom", cat: "Bottoms" as const },
          { k: "shoesId" as const, label: "Shoes", cat: "Shoes" as const },
          { k: "accessoryId" as const, label: "Accessories", cat: "Accessories" as const },
        ].map((s) => (
          <label key={s.k} className="block text-xs tracking-wider uppercase text-charcoal/40">
            {s.label}
            <select
              className="mt-2 w-full border-b border-hairline bg-transparent py-2 text-sm text-ink normal-case tracking-normal"
              value={combo[s.k]}
              onChange={(e) => setCombo({ ...combo, [s.k]: e.target.value })}
            >
              <option value="">Select</option>
              {by(s.cat).map((i) => (
                <option key={i.id} value={i.id}>{i.name}</option>
              ))}
            </select>
          </label>
        ))}
      </div>
      <Button
        type="button"
        onClick={() => addOutfit({ id: crypto.randomUUID(), name: "Look", ...combo })}
      >
        Save combination
      </Button>
      {outfits.length > 0 && (
        <ul className="mt-8 space-y-2 text-sm text-charcoal/60">
          {outfits.map((o) => (
            <li key={o.id}>Look · {o.topId ? "top" : ""} {o.bottomId ? "+ bottom" : ""} {o.shoesId ? "+ shoes" : ""}</li>
          ))}
        </ul>
      )}

      {recs.length > 0 && (
        <section className="mt-20">
          <h2 className="font-display text-3xl mb-8">Complete your look with 7Style</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {recs.map((p) => <ProductCard key={p._id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  );
}
