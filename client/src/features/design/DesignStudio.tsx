import { useMemo, useState } from "react";
import { usePrefStore } from "../../store/preferenceStore";
import { useAuthStore } from "../../store/authStore";
import { useUiStore } from "../../store/uiStore";
import Button from "../../components/ui/Button";
import type { SavedDesign } from "../../types/types";

const OPTIONS = {
  garment: ["Dress", "Kurta", "Co-ord", "Blouse", "Jacket"],
  silhouette: ["Column", "A-line", "Fit & flare", "Wrap", "Oversized"],
  fabric: ["Silk", "Linen", "Cotton", "Chiffon", "Wool crepe"],
  color: ["Ivory", "Champagne", "Ink", "Blush", "Forest", "Maroon"],
  neckline: ["Round", "V", "Square", "Halter", "Boat"],
  sleeves: ["Sleeveless", "Cap", "Three-quarter", "Full", "Bishop"],
  length: ["Mini", "Knee", "Midi", "Ankle", "Floor"],
  details: ["None", "Embroidery", "Piping", "Pleats", "Cutwork"],
} as const;

type Key = keyof typeof OPTIONS;
const FLOW: Key[] = ["garment", "silhouette", "fabric", "color", "neckline", "sleeves", "length", "details"];

const palette: Record<string, string> = {
  Ivory: "#F4EFE6",
  Champagne: "#C8A96A",
  Ink: "#111111",
  Blush: "#E8C4C4",
  Forest: "#2F4F3E",
  Maroon: "#5C1A1A",
};

export default function DesignStudio() {
  const saveDesign = usePrefStore((s) => s.saveDesign);
  const designs = usePrefStore((s) => s.designs);
  const user = useAuthStore((s) => s.user);
  const toast = useUiStore((s) => s.toast);
  const [step, setStep] = useState(0);
  const [sel, setSel] = useState<Record<Key, string>>({
    garment: "Dress",
    silhouette: "A-line",
    fabric: "Silk",
    color: "Ivory",
    neckline: "V",
    sleeves: "Cap",
    length: "Midi",
    details: "None",
  });

  const key = FLOW[step];
  const fill = palette[sel.color] || "#F4EFE6";
  const dark = sel.color === "Ivory" || sel.color === "Blush" || sel.color === "Champagne";

  const preview = useMemo(() => {
    const w = sel.silhouette === "Oversized" ? 70 : sel.silhouette === "Column" ? 42 : 56;
    const hem = sel.length === "Mini" ? 110 : sel.length === "Knee" ? 130 : sel.length === "Midi" ? 150 : sel.length === "Ankle" ? 170 : 185;
    return { w, hem };
  }, [sel]);

  const persist = () => {
    const design: SavedDesign = {
      id: crypto.randomUUID(),
      ...sel,
      createdAt: new Date().toISOString(),
    };
    saveDesign(design);
    toast("Design saved in your atelier on this device.");
  };

  return (
    <div className="min-h-[80vh] grid lg:grid-cols-[1.1fr_0.9fr]">
      <div className="bg-ink text-bone relative flex items-center justify-center min-h-[50vh] p-8">
        <p className="absolute top-8 left-8 font-sans text-[11px] tracking-[0.2em] uppercase text-champagne">Live preview</p>
        <svg viewBox="0 0 200 220" className="w-full max-w-sm drop-shadow-sm">
          <ellipse cx="100" cy="28" rx="14" ry="16" fill="none" stroke="#C8A96A" strokeWidth="1" />
          <path
            d={`M${100 - preview.w / 4} 48 Q 100 58 ${100 + preview.w / 4} 48
               L ${100 + preview.w / 2} ${preview.hem}
               Q 100 ${preview.hem + 8} ${100 - preview.w / 2} ${preview.hem} Z`}
            fill={fill}
            stroke={dark ? "#111111" : "#F8F5F2"}
            strokeWidth="0.6"
            className="transition-all duration-500"
          />
          {sel.sleeves !== "Sleeveless" && (
            <path d="M78 55 Q 50 80 62 100" fill="none" stroke={fill} strokeWidth="10" className="transition-all duration-500" />
          )}
          {sel.sleeves !== "Sleeveless" && (
            <path d="M122 55 Q 150 80 138 100" fill="none" stroke={fill} strokeWidth="10" className="transition-all duration-500" />
          )}
        </svg>
        <p className="absolute bottom-8 left-8 right-8 font-display text-2xl">
          {sel.color} {sel.fabric} {sel.silhouette} {sel.garment}
        </p>
      </div>

      <div className="p-8 md:p-12 bg-bone">
        <p className="font-sans text-[11px] tracking-[0.2em] uppercase text-champagne mb-2">Design studio</p>
        <h1 className="font-display text-4xl mb-2">Design your outfit</h1>
        <p className="text-sm text-charcoal/50 mb-8">
          {user ? `${user.name.split(" ")[0]}, compose a piece.` : "Compose a piece."} Saved designs stay on this device — there is no custom-outfit API yet.
        </p>
        <p className="text-xs tracking-wider uppercase text-charcoal/40 mb-4">
          {step + 1} / {FLOW.length} · {key}
        </p>
        <div className="grid grid-cols-2 gap-2 mb-10">
          {OPTIONS[key].map((opt) => (
            <button
              key={opt}
              onClick={() => setSel({ ...sel, [key]: opt })}
              className={`py-4 px-3 text-left border transition-colors ${sel[key] === opt ? "bg-ink text-bone border-ink" : "border-hairline bg-white hover:border-ink"}`}
            >
              <span className="font-display text-lg">{opt}</span>
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="ghost" disabled={step === 0} onClick={() => setStep(step - 1)}>Back</Button>
          {step < FLOW.length - 1 ? (
            <Button onClick={() => setStep(step + 1)}>Next</Button>
          ) : (
            <Button onClick={persist}>Save design</Button>
          )}
        </div>
        {designs.length > 0 && (
          <div className="mt-12">
            <h2 className="font-display text-2xl mb-4">Your saved designs</h2>
            <ul className="space-y-3">
              {designs.slice(0, 5).map((d) => (
                <li key={d.id} className="text-sm text-charcoal/70 border-b border-hairline pb-3">
                  {d.color} {d.fabric} {d.garment} · {d.silhouette}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
