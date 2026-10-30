import { useState } from "react";
import { Link } from "react-router-dom";
import { usePrefStore } from "../../store/preferenceStore";
import type { BodyProfile, FitPreference } from "../../types/types";
import Button from "../../components/ui/Button";
import { Field } from "../../components/ui/Field";
import { useUiStore } from "../../store/uiStore";

const STEPS = ["Height", "Bust", "Waist", "Hip", "Shoulder", "Inseam", "Fit"] as const;

export default function BodyProfile() {
  const { body, setBody } = usePrefStore();
  const toast = useUiStore((s) => s.toast);
  const [step, setStep] = useState(body.completed ? STEPS.length : 0);
  const [draft, setDraft] = useState<BodyProfile>(body);

  const fields: { key: keyof BodyProfile; hint: string; suffix?: string }[] = [
    { key: "height", hint: "Stand against a wall, barefoot. We use this for length.", suffix: "cm" },
    { key: "bust", hint: "Measure around the fullest part, tape parallel to the floor.", suffix: "cm" },
    { key: "waist", hint: "The natural waist — usually the narrowest point.", suffix: "cm" },
    { key: "hip", hint: "Around the fullest part of the hip and seat.", suffix: "cm" },
    { key: "shoulder", hint: "From shoulder point to shoulder point across the back.", suffix: "cm" },
    { key: "inseam", hint: "From crotch to ankle bone, for trousers and long hems.", suffix: "cm" },
  ];

  const current = fields[step];
  const fits: FitPreference[] = ["Snug", "Regular", "Relaxed"];

    const finish = async () => {
    const next = { ...draft, completed: true };
    await setBody(next);
    toast("Your 7Style Body Profile is ready.");
    setStep(STEPS.length);
  };

  if (step >= STEPS.length) {
    return (
      <div className="max-w-[720px] mx-auto px-6 py-20 text-center">
        <div className="w-16 h-px bg-champagne mx-auto mb-8" />
        <h1 className="font-display text-4xl md:text-5xl mb-4">Your 7Style Body Profile is Ready</h1>
        <p className="text-charcoal/60 mb-8 leading-relaxed">
  Saved to your account, never shared. Use it when choosing sizes across the collection.
</p>
        <div className="grid grid-cols-2 gap-4 text-left border border-hairline p-8 mb-10">
          {fields.map((f) => (
            <div key={String(f.key)}>
              <p className="text-[11px] tracking-wider uppercase text-charcoal/40">{f.key}</p>
              <p className="font-display text-xl">{String(draft[f.key] || body[f.key] || "—")} {f.suffix}</p>
            </div>
          ))}
          <div>
            <p className="text-[11px] tracking-wider uppercase text-charcoal/40">Fit</p>
            <p className="font-display text-xl">{draft.preferredFit}</p>
          </div>
          <div>
            <p className="text-[11px] tracking-wider uppercase text-charcoal/40">Preferred size</p>
            <p className="font-display text-xl">{draft.preferredSize || "—"}</p>
          </div>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          <Button onClick={() => setStep(0)}>Edit profile</Button>
          <Link to="/shop"><Button variant="ghost">Shop with this profile</Button></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[640px] mx-auto px-6 py-16">
      <p className="font-sans text-[11px] tracking-[0.2em] uppercase text-champagne mb-3">Private consultation</p>
      <h1 className="font-display text-4xl mb-2">Digital body profile</h1>
     <p className="text-sm text-charcoal/50 mb-10">Saved securely to your 7Style account. Available wherever you sign in.</p>
      <div className="flex gap-1 mb-10" aria-hidden>
        {STEPS.map((_, i) => (
          <div key={i} className={`h-px flex-1 ${i <= step ? "bg-champagne" : "bg-hairline"}`} />
        ))}
      </div>
      <p className="text-xs tracking-wider uppercase text-charcoal/40 mb-8">
        Step {step + 1} of {STEPS.length} · {STEPS[step]}
      </p>

      {current && (
        <div className="animate-fade-up">
          <div className="aspect-[16/9] border border-hairline mb-8 flex items-center justify-center bg-white">
            <svg viewBox="0 0 120 160" className="h-40 text-charcoal/20" aria-hidden>
              <ellipse cx="60" cy="22" rx="12" ry="14" fill="none" stroke="currentColor" />
              <path d="M48 40 L60 48 L72 40 L78 90 L60 150 L42 90 Z" fill="none" stroke="currentColor" />
              {step === 1 && <line x1="42" y1="58" x2="78" y2="58" stroke="#C8A96A" />}
              {step === 2 && <line x1="46" y1="72" x2="74" y2="72" stroke="#C8A96A" />}
              {step === 3 && <line x1="40" y1="92" x2="80" y2="92" stroke="#C8A96A" />}
              {step === 4 && <line x1="42" y1="42" x2="78" y2="42" stroke="#C8A96A" />}
              {step === 5 && <line x1="60" y1="100" x2="60" y2="150" stroke="#C8A96A" />}
              {step === 0 && <line x1="90" y1="22" x2="90" y2="150" stroke="#C8A96A" />}
            </svg>
          </div>
          <Field
            label={`${STEPS[step]} (${current.suffix})`}
            inputMode="decimal"
            value={String(draft[current.key] || "")}
            onChange={(e) => setDraft({ ...draft, [current.key]: e.target.value })}
          />
          <p className="text-sm text-charcoal/50 mt-4 leading-relaxed">{current.hint}</p>
        </div>
      )}

      {step === 6 && (
        <div className="animate-fade-up">
          <p className="font-display text-2xl mb-6">How should clothes sit on you?</p>
          <div className="grid grid-cols-3 gap-3 mb-8">
            {fits.map((f) => (
              <button
                key={f}
                onClick={() => setDraft({ ...draft, preferredFit: f })}
                className={`py-8 border ${draft.preferredFit === f ? "bg-ink text-bone border-ink" : "border-hairline bg-white"}`}
              >
                <span className="font-display text-xl">{f}</span>
              </button>
            ))}
          </div>
          <Field
            label="Preferred size (optional)"
            placeholder="e.g. M"
            value={draft.preferredSize}
            onChange={(e) => setDraft({ ...draft, preferredSize: e.target.value })}
          />
        </div>
      )}

      <div className="flex justify-between mt-12">
        <Button type="button" variant="ghost" disabled={step === 0} onClick={() => setStep(step - 1)}>
          Back
        </Button>
        {step < 6 ? (
          <Button type="button" onClick={() => setStep(step + 1)}>Continue</Button>
        ) : (
          <Button type="button" onClick={finish}>Save profile</Button>
        )}
      </div>
    </div>
  );
}
