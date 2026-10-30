import { useEffect, useState, type FormEvent } from "react";
import { productService } from "../../services/products";
import type { Product } from "../../types/types";
import { matchesCategory } from "../../lib/utils";
import ProductCard from "../../components/product/ProductCard";
import { useAuthStore } from "../../store/authStore";
import { usePrefStore } from "../../store/preferenceStore";

const PROMPTS = ["Wedding", "Office", "Date Night", "Party", "College", "Vacation", "Casual Weekend"];

interface Turn {
  role: "you" | "atelier";
  text: string;
  occasion?: string;
}

function occasionFrom(text: string) {
  const t = text.toLowerCase();
  if (t.includes("wedding")) return "Wedding";
  if (t.includes("office") || t.includes("work")) return "Office";
  if (t.includes("date")) return "Date Night";
  if (t.includes("party")) return "Party";
  if (t.includes("college")) return "College";
  if (t.includes("vacation") || t.includes("travel")) return "Vacation";
  if (t.includes("weekend") || t.includes("casual")) return "Casual Weekend";
  return "Party Wear";
}

export default function Stylist() {
  const user = useAuthStore((s) => s.user);
  const style = usePrefStore((s) => s.style);
  const [products, setProducts] = useState<Product[]>([]);
  const [input, setInput] = useState("");
  const [turns, setTurns] = useState<Turn[]>([
    {
      role: "atelier",
      text: "Tell me the occasion and how you want to feel. I’ll pull from the live 7Style collection — there is no AI stylist endpoint on the server yet, so recommendations are honest catalog matches, not generated copy pretending to be a model.",
    },
  ]);
  const [occasion, setOccasion] = useState("");

  useEffect(() => {
    productService.list().then((r) => setProducts(r.data.products)).catch(() => {});
  }, []);

  const recs = products.filter((p) => {
    if (!occasion) return false;
    return matchesCategory(p, occasion === "Wedding" ? "Party Wear" : occasion === "Office" ? "Office Wear" : occasion === "Party" ? "Party Wear" : "All")
      || (p.occasionTags || []).some((t) => t.toLowerCase().includes(occasion.toLowerCase().split(" ")[0]))
      || `${p.name} ${p.description}`.toLowerCase().includes(occasion.toLowerCase().split(" ")[0]);
  }).slice(0, 6);

  const shown = recs.length ? recs : occasion ? products.slice(0, 4) : [];

  const send = (text: string) => {
    const occ = occasionFrom(text);
    setOccasion(occ);
    setTurns((t) => [
      ...t,
      { role: "you", text },
      {
        role: "atelier",
        text: `${user ? `${user.name.split(" ")[0]}, ` : ""}for ${occ.toLowerCase()}${style ? ` with a ${style.toLowerCase()} lean` : ""}, here are pieces from the current collection. When an AI stylist API is added, this panel will stream true consultant replies.`,
        occasion: occ,
      },
    ]);
    setInput("");
  };

  return (
    <div className="max-w-[1400px] mx-auto px-5 md:px-8 py-12 grid lg:grid-cols-[1fr_1fr] gap-12">
      <div>
        <p className="font-sans text-[11px] tracking-[0.2em] uppercase text-champagne mb-2">Private consultation</p>
        <h1 className="font-display text-4xl md:text-5xl mb-8">Your fashion stylist</h1>
        <div className="flex flex-wrap gap-2 mb-8">
          {PROMPTS.map((p) => (
            <button key={p} onClick={() => send(`I need something for ${p.toLowerCase()}.`)} className="text-[11px] tracking-wider uppercase border border-hairline px-3 py-2 hover:border-ink">
              {p}
            </button>
          ))}
        </div>
        <div className="space-y-6 min-h-[40vh] mb-6">
          {turns.map((t, i) => (
            <div key={i} className={t.role === "you" ? "text-right" : ""}>
              <p className="text-[10px] tracking-wider uppercase text-champagne mb-1">{t.role === "you" ? "You" : "7Style Atelier"}</p>
              <p className={`inline-block max-w-[90%] text-left font-sans text-sm leading-relaxed ${t.role === "you" ? "bg-ink text-bone px-4 py-3" : "text-charcoal/80"}`}>
                {t.text}
              </p>
            </div>
          ))}
        </div>
        <form
          onSubmit={(e: FormEvent) => {
            e.preventDefault();
            if (input.trim()) send(input.trim());
          }}
          className="flex gap-2 border-t border-hairline pt-4"
        >
          <label className="sr-only" htmlFor="stylist-input">Message</label>
          <input
            id="stylist-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="I have a wedding next week. Elegant, not too flashy."
            className="flex-1 bg-transparent py-3 font-sans text-sm focus:outline-none"
          />
          <button type="submit" className="text-xs tracking-wider uppercase text-champagne">Send</button>
        </form>
      </div>
      <div>
        <h2 className="font-display text-2xl mb-6">{occasion ? `Recommended for ${occasion.toLowerCase()}` : "The collection, waiting"}</h2>
        {shown.length === 0 ? (
          <p className="text-charcoal/40 font-display text-xl">Share an occasion to see live products alongside this conversation.</p>
        ) : (
          <div className="grid sm:grid-cols-2 gap-6">
            {shown.map((p) => <ProductCard key={p._id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  );
}
