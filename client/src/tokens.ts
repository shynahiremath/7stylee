/**
 * 7STYLE DESIGN TOKENS — TypeScript
 *
 * Mirror of index.css @theme values as typed constants.
 * Import these in components instead of hardcoding hex strings
 * or arbitrary Tailwind classes. The CSS variables are the
 * source of truth; this file is a typed bridge for logic/styles-in-JS.
 *
 * Usage:
 *   import { color, font, space } from "@/tokens";
 *   const style = { color: color.ink, fontFamily: font.display };
 */

// ── Palette ──────────────────────────────────────────────────────────────────
export const color = {
  bone:            "#F7F3EC",
  ink:             "#14120F",
  charcoal:        "#2B2622",
  champagne:       "#C6A664",
  hairline:        "#E4DDD0",

  // Semantic aliases
  surface:         "var(--color-bone)",
  onSurface:       "var(--color-charcoal)",
  accent:          "var(--color-champagne)",
  border:          "var(--color-hairline)",
  onDark:          "var(--color-bone)",

  // Tints
  boneDark:        "#EDE8DF",
  champagneLight:  "#D4BA84",
  champagneDark:   "#A8893F",
  inkSoft:         "#1E1B17",
} as const;

export type ColorToken = keyof typeof color;

// ── Typography ────────────────────────────────────────────────────────────────
export const font = {
  display: '"Playfair Display", Georgia, serif',
  sans:    '"Inter", system-ui, sans-serif',
} as const;

export const fontSize = {
  xs:   "0.75rem",    // 12px — labels, meta
  sm:   "0.875rem",   // 14px — captions, nav
  base: "1rem",       // 16px — body
  lg:   "1.125rem",   // 18px — card body
  xl:   "1.25rem",    // 20px — sub-headers
  "2xl":"1.5rem",     // 24px — section labels
  "3xl":"1.875rem",   // 30px — product names
  "4xl":"2.25rem",    // 36px — page headings
  "5xl":"3rem",       // 48px — hero
  "6xl":"3.75rem",    // 60px — editorial hero
} as const;

export const tracking = {
  tightest: "-0.03em",
  tight:    "-0.015em",
  normal:   "0em",
  wide:     "0.04em",    // nav links, labels
  wider:    "0.08em",    // all-caps micro
} as const;

export const leading = {
  none:    1,
  tight:   1.2,
  snug:    1.35,
  normal:  1.5,
  relaxed: 1.65,
  loose:   1.8,
} as const;

// ── Spacing ───────────────────────────────────────────────────────────────────
export const space = {
  1:  "0.25rem",   //  4px
  2:  "0.5rem",    //  8px
  3:  "0.75rem",   // 12px
  4:  "1rem",      // 16px
  5:  "1.25rem",   // 20px
  6:  "1.5rem",    // 24px
  8:  "2rem",      // 32px
  10: "2.5rem",    // 40px
  12: "3rem",      // 48px
  16: "4rem",      // 64px
  20: "5rem",      // 80px
  24: "6rem",      // 96px
  32: "8rem",      // 128px
} as const;

// ── Layout caps ───────────────────────────────────────────────────────────────
export const maxWidth = {
  content: "1200px",   // main container
  prose:    "680px",   // article / body copy
  narrow:   "480px",   // auth forms, modals
} as const;

// ── Border radius ─────────────────────────────────────────────────────────────
// Intentionally no pill/large values — premium reads sharp, not bouncy.
export const radius = {
  none: "0",
  sm:   "2px",
  md:   "4px",
} as const;

// ── Shadows ───────────────────────────────────────────────────────────────────
// Hairline borders carry depth; shadows used only for lift, never decoration.
export const shadow = {
  none:   "none",
  subtle: "0 1px 3px 0 rgba(20, 18, 15, 0.06)",
  card:   "0 2px 8px 0 rgba(20, 18, 15, 0.08)",
} as const;

// ── Transitions ───────────────────────────────────────────────────────────────
export const duration = {
  fast:  "150ms",
  base:  "250ms",
  slow:  "400ms",
} as const;

export const ease = {
  out:   "cubic-bezier(0.0, 0.0, 0.2, 1)",
  inOut: "cubic-bezier(0.4, 0.0, 0.2, 1)",
} as const;

// ── Tailwind class helpers ─────────────────────────────────────────────────────
/**
 * Convenience map of semantic class names for common patterns.
 * Keeps JSX consistent and grep-friendly.
 *
 * Usage: <div className={tw.section}>...</div>
 */
export const tw = {
  // Layout
  container:    "w-full max-w-[1200px] mx-auto px-8",
  section:      "py-16 md:py-24",

  // Typography
  headingHero:  "font-display text-5xl md:text-6xl text-ink leading-tight tracking-tight",
  headingPage:  "font-display text-4xl text-ink leading-tight",
  headingSection:"font-display text-3xl text-ink leading-snug",
  headingCard:  "font-display text-2xl text-ink leading-snug",
  body:         "font-sans text-base text-charcoal leading-relaxed",
  bodySmall:    "font-sans text-sm text-charcoal leading-relaxed",
  label:        "font-sans text-xs font-medium uppercase tracking-wider text-champagne",
  caption:      "font-sans text-xs text-charcoal/60",

  // Interactive
  navLink:      "font-sans text-sm tracking-wide hover:text-champagne transition-colors duration-250",
  btnPrimary:   "btn btn-primary",
  btnGhost:     "btn btn-ghost",
  btnAccent:    "btn btn-accent",

  // Surfaces
  card:         "card",
  input:        "input",
  divider:      "border-t border-hairline",
} as const;
