import type { ReactNode } from "react";

export function Spinner({ label = "Loading" }: { label?: string }) {
  return (
    <div className="min-h-[40vh] flex items-center justify-center" role="status" aria-live="polite">
      <div className="text-center">
        <div className="w-12 h-px bg-champagne mx-auto mb-6" />
        <p className="font-display text-2xl text-charcoal/30">{label}…</p>
      </div>
    </div>
  );
}

export function EmptyState({
  title,
  body,
  action,
}: {
  title: string;
  body?: string;
  action?: ReactNode;
}) {
  return (
    <div className="py-24 px-8 text-center border border-hairline">
      <p className="font-display text-3xl text-charcoal/30 mb-4">{title}</p>
      {body && <p className="font-sans text-sm text-charcoal/45 mb-8 max-w-md mx-auto">{body}</p>}
      {action}
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="py-16 px-8 text-center border border-hairline" role="alert">
      <p className="font-display text-2xl text-ink mb-3">We couldn’t load this.</p>
      <p className="font-sans text-sm text-charcoal/50 mb-6">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="font-sans text-xs tracking-wider uppercase border-b border-champagne text-champagne pb-0.5"
        >
          Try again
        </button>
      )}
    </div>
  );
}

export function Notice({
  children,
  tone = "info",
}: {
  children: ReactNode;
  tone?: "success" | "error" | "info";
}) {
  const map = {
    success: "border-champagne/40 text-ink bg-champagne/8",
    error: "border-red-200 text-red-800 bg-red-50",
    info: "border-hairline text-charcoal/70 bg-white",
  };
  return <div className={`px-4 py-3 border font-sans text-sm ${map[tone]}`}>{children}</div>;
}
