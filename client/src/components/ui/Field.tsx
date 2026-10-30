import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";

const cls =
  "w-full border-b border-hairline bg-transparent py-3 font-sans text-sm text-ink focus:outline-none focus:border-champagne transition-colors placeholder:text-charcoal/30";

export function Field({
  label,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className="block">
      <span className="block font-sans text-xs tracking-wider uppercase text-charcoal/50 mb-1">{label}</span>
      <input className={cls} {...props} />
    </label>
  );
}

export function Area({
  label,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }) {
  return (
    <label className="block">
      <span className="block font-sans text-xs tracking-wider uppercase text-charcoal/50 mb-1">{label}</span>
      <textarea className={`${cls} resize-none`} {...props} />
    </label>
  );
}
