import { useUiStore } from "../../store/uiStore";

export default function Toasts() {
  const { toasts, dismiss } = useUiStore();
  return (
    <div className="fixed bottom-6 right-6 z-[80] flex flex-col gap-2 max-w-sm" aria-live="polite">
      {toasts.map((t) => (
        <button
          key={t.id}
          onClick={() => dismiss(t.id)}
          className={`text-left px-5 py-3.5 font-sans text-sm shadow-sm animate-fade-up ${
            t.tone === "error" ? "bg-ink text-bone" : t.tone === "info" ? "bg-white text-ink border border-hairline" : "bg-ink text-bone"
          }`}
        >
          <span className="text-champagne text-xs tracking-wider uppercase block mb-1">
            {t.tone === "error" ? "Please note" : t.tone === "info" ? "7Style" : "Saved"}
          </span>
          {t.message}
        </button>
      ))}
    </div>
  );
}
