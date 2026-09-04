export type MovementId =
  | "quiet-precision"
  | "expressive-energy"
  | "soft-tactility"
  | "editorial-character"
  | "semi-flat"
  | "minimalism"
  | "neumorphism"
  | "neo-brutalism"
  | "maximalism"

export interface PreviewStyleConfig {
  id: string
  name: string
  container: string
  heroCard: string
  heroGlow: string
  tileCard: string
  badge: string
  badgeText: string
  interactiveCard: string
  buttonPrimary: string
  buttonSecondary: string
  input: string
  accentPill: string
  divider: string
  statValue: string
  typographyLabel: string
}

const quietPrecisionTheme: PreviewStyleConfig = {
  id: "quiet-precision",
  name: "Quiet Precision",
  container: "space-y-4 font-sans",
  heroCard:
    "relative overflow-hidden rounded-2xl border border-border/80 bg-card/95 p-6 transition-all duration-300",
  heroGlow:
    "pointer-events-none absolute -top-10 -right-10 size-40 rounded-full opacity-25 blur-2xl transition-all duration-500",
  tileCard:
    "flex flex-col justify-between space-y-3 rounded-2xl border border-border/80 bg-card/90 p-5 transition-all duration-300",
  badge:
    "inline-flex items-center gap-1.5 rounded-md border border-primary/20 bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary",
  badgeText:
    "text-[11px] font-bold uppercase tracking-wider text-muted-foreground",
  interactiveCard:
    "rounded-2xl border border-border/80 bg-card/95 p-5 transition-all duration-300 space-y-4",
  buttonPrimary:
    "w-full rounded-xl py-2.5 px-4 font-medium text-xs text-white transition-all duration-200 hover:brightness-105 active:scale-[0.99]",
  buttonSecondary:
    "w-full rounded-xl border border-border bg-background py-2.5 px-4 font-medium text-xs text-foreground transition-all duration-200 hover:bg-muted active:scale-[0.99]",
  input:
    "w-full rounded-xl border border-border/90 bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none",
  accentPill:
    "rounded-full border border-border bg-muted/60 px-3 py-1 text-xs font-medium text-foreground",
  divider: "border-border/60",
  statValue: "text-4xl font-bold tracking-tight text-foreground",
  typographyLabel:
    "text-xs font-bold uppercase tracking-wider text-muted-foreground",
}

const expressiveEnergyTheme: PreviewStyleConfig = {
  id: "expressive-energy",
  name: "Expressive Energy",
  container: "space-y-4 font-mono",
  heroCard:
    "relative overflow-hidden rounded-xl border-2 border-foreground bg-card p-6 shadow-[5px_5px_0px_0px_currentColor] text-foreground transition-all duration-200",
  heroGlow:
    "pointer-events-none absolute -bottom-10 -right-10 size-32 rounded-none border-2 border-foreground bg-primary/20 rotate-12 transition-all duration-300",
  tileCard:
    "flex flex-col justify-between space-y-3 rounded-xl border-2 border-foreground bg-card p-5 shadow-[4px_4px_0px_0px_currentColor] text-foreground transition-all duration-200 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_currentColor]",
  badge:
    "inline-flex items-center gap-1.5 rounded-lg border-2 border-foreground bg-amber-300 dark:bg-amber-400 px-2.5 py-0.5 text-xs font-black text-black shadow-[2px_2px_0px_0px_currentColor]",
  badgeText: "text-xs font-black uppercase tracking-wider text-foreground",
  interactiveCard:
    "rounded-xl border-2 border-foreground bg-card p-5 shadow-[4px_4px_0px_0px_currentColor] text-foreground space-y-4 transition-all duration-200",
  buttonPrimary:
    "w-full rounded-lg border-2 border-foreground py-2.5 px-4 font-black text-xs text-white shadow-[3px_3px_0px_0px_currentColor] transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_currentColor] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_currentColor]",
  buttonSecondary:
    "w-full rounded-lg border-2 border-foreground bg-card py-2.5 px-4 font-black text-xs text-foreground shadow-[3px_3px_0px_0px_currentColor] transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_currentColor] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_currentColor]",
  input:
    "w-full rounded-lg border-2 border-foreground bg-background px-3 py-2 text-xs font-mono font-medium text-foreground placeholder:text-muted-foreground shadow-[2px_2px_0px_0px_currentColor] focus:outline-none focus:bg-primary/5",
  accentPill:
    "rounded-lg border-2 border-foreground bg-lime-300 dark:bg-lime-400 px-2.5 py-0.5 text-xs font-black text-black shadow-[2px_2px_0px_0px_currentColor]",
  divider: "border-2 border-foreground",
  statValue: "text-4xl font-black tracking-tight text-foreground",
  typographyLabel:
    "text-xs font-black uppercase tracking-wider text-foreground",
}

const softTactilityTheme: PreviewStyleConfig = {
  id: "soft-tactility",
  name: "Soft Tactility",
  container: "space-y-5 font-sans p-1",
  heroCard:
    "relative overflow-hidden rounded-3xl bg-card p-6 sm:p-7 shadow-[8px_8px_18px_rgba(0,0,0,0.08),-8px_-8px_18px_rgba(255,255,255,0.7)] dark:shadow-[8px_8px_18px_rgba(0,0,0,0.6),-8px_-8px_18px_rgba(255,255,255,0.04)] border border-border/20 transition-all duration-300",
  heroGlow:
    "pointer-events-none absolute -top-8 -right-8 size-44 rounded-full opacity-15 blur-2xl transition-all duration-500",
  tileCard:
    "flex flex-col justify-between space-y-3 rounded-3xl bg-card p-5 shadow-[6px_6px_14px_rgba(0,0,0,0.06),-6px_-6px_14px_rgba(255,255,255,0.6)] dark:shadow-[6px_6px_14px_rgba(0,0,0,0.5),-6px_-6px_14px_rgba(255,255,255,0.03)] border border-border/10 transition-all duration-300",
  badge:
    "inline-flex items-center gap-1.5 rounded-full bg-card px-3 py-1 text-xs font-semibold text-primary shadow-[inset_2px_2px_4px_rgba(0,0,0,0.08),inset_-2px_-2px_4px_rgba(255,255,255,0.7)] dark:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.5),inset_-2px_-2px_4px_rgba(255,255,255,0.05)]",
  badgeText:
    "text-[11px] font-bold uppercase tracking-wider text-muted-foreground",
  interactiveCard:
    "rounded-3xl bg-card p-5 shadow-[7px_7px_16px_rgba(0,0,0,0.07),-7px_-7px_16px_rgba(255,255,255,0.7)] dark:shadow-[7px_7px_16px_rgba(0,0,0,0.55),-7px_-7px_16px_rgba(255,255,255,0.04)] border border-border/20 space-y-4 transition-all duration-300",
  buttonPrimary:
    "w-full rounded-2xl py-2.5 px-4 font-semibold text-xs text-white shadow-[4px_4px_8px_rgba(0,0,0,0.15),-2px_-2px_6px_rgba(255,255,255,0.2)] active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.3)] transition-all duration-200",
  buttonSecondary:
    "w-full rounded-2xl bg-card py-2.5 px-4 font-semibold text-xs text-foreground shadow-[4px_4px_8px_rgba(0,0,0,0.08),-4px_-4px_8px_rgba(255,255,255,0.7)] dark:shadow-[4px_4px_8px_rgba(0,0,0,0.5),-4px_-4px_8px_rgba(255,255,255,0.04)] active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.2)] transition-all duration-200 hover:text-primary",
  input:
    "w-full rounded-2xl bg-card px-3.5 py-2.5 text-xs text-foreground placeholder:text-muted-foreground shadow-[inset_3px_3px_6px_rgba(0,0,0,0.08),inset_-3px_-3px_6px_rgba(255,255,255,0.6)] dark:shadow-[inset_3px_3px_6px_rgba(0,0,0,0.5),inset_-3px_-3px_6px_rgba(255,255,255,0.03)] border-none focus:outline-none",
  accentPill:
    "rounded-full bg-card px-3 py-1 text-xs font-semibold text-foreground shadow-[3px_3px_6px_rgba(0,0,0,0.08),-3px_-3px_6px_rgba(255,255,255,0.6)] dark:shadow-[3px_3px_6px_rgba(0,0,0,0.5),-3px_-3px_6px_rgba(255,255,255,0.03)]",
  divider: "border-border/30",
  statValue: "text-4xl font-extrabold tracking-tight text-foreground",
  typographyLabel:
    "text-xs font-bold uppercase tracking-wider text-muted-foreground",
}

const editorialCharacterTheme: PreviewStyleConfig = {
  id: "editorial-character",
  name: "Editorial Character",
  container: "space-y-6 font-serif tracking-tight",
  heroCard:
    "relative overflow-hidden border-b border-border/50 bg-transparent p-6 sm:p-8 transition-all duration-300",
  heroGlow: "hidden",
  tileCard:
    "flex flex-col justify-between space-y-4 border-l-2 border-primary/60 bg-transparent py-4 px-5 transition-all duration-300",
  badge:
    "inline-flex items-center gap-1 border-b border-foreground/40 bg-transparent px-0 py-0.5 text-[11px] font-mono uppercase tracking-widest text-foreground",
  badgeText:
    "text-[10px] font-mono uppercase tracking-widest text-muted-foreground",
  interactiveCard:
    "border-t border-b border-border/50 bg-transparent py-6 px-4 space-y-5 transition-all duration-300",
  buttonPrimary:
    "w-full rounded-none border border-foreground bg-foreground text-background py-3 px-4 text-xs font-mono uppercase tracking-widest transition-all duration-200 hover:bg-transparent hover:text-foreground",
  buttonSecondary:
    "w-full rounded-none border border-border bg-transparent py-3 px-4 text-xs font-mono uppercase tracking-widest text-foreground transition-all duration-200 hover:border-foreground",
  input:
    "w-full rounded-none border-b border-border bg-transparent px-0 py-2.5 text-xs text-foreground placeholder:text-muted-foreground/60 focus:border-foreground focus:outline-none",
  accentPill:
    "border-b border-foreground/30 px-2 py-0.5 text-[11px] font-mono uppercase tracking-wider text-foreground",
  divider: "border-border/30",
  statValue: "text-5xl font-serif font-light tracking-tighter text-foreground",
  typographyLabel:
    "text-[10px] font-mono uppercase tracking-widest text-muted-foreground",
}

/**
 * Complete set of UI token themes mapped to design movements.
 * Controls typography, card borders, shadows, glows, and interactive element styling.
 */
export const PREVIEW_THEMES: Record<
  MovementId | "default",
  PreviewStyleConfig
> = {
  "quiet-precision": quietPrecisionTheme,
  "expressive-energy": expressiveEnergyTheme,
  "soft-tactility": softTactilityTheme,
  "editorial-character": editorialCharacterTheme,

  // Legacy mappings for backward compatibility
  "semi-flat": quietPrecisionTheme,
  minimalism: editorialCharacterTheme,
  neumorphism: softTactilityTheme,
  "neo-brutalism": expressiveEnergyTheme,
  maximalism: expressiveEnergyTheme,

  default: {
    id: "default",
    name: "Modern Studio",
    container: "space-y-4 font-sans",
    heroCard:
      "relative overflow-hidden rounded-3xl border border-border/80 bg-card/90 p-6 transition-all duration-300",
    heroGlow:
      "pointer-events-none absolute -top-12 -right-12 size-48 rounded-full opacity-30 blur-3xl transition-all duration-500",
    tileCard:
      "flex flex-col justify-between space-y-2.5 rounded-3xl border border-border/80 bg-card/90 p-5 transition-all duration-300",
    badge:
      "inline-flex items-center gap-1 rounded-full border border-primary/20 bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary",
    badgeText: "font-heading text-xs",
    interactiveCard:
      "rounded-3xl border border-border/80 bg-card/90 p-5 space-y-4 transition-all duration-300",
    buttonPrimary:
      "w-full rounded-xl py-2.5 px-4 font-medium text-xs text-white transition-all duration-200 hover:brightness-105",
    buttonSecondary:
      "w-full rounded-xl border border-border bg-background py-2.5 px-4 font-medium text-xs text-foreground transition-all duration-200 hover:bg-muted",
    input:
      "w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none",
    accentPill:
      "rounded-full border border-border bg-card px-2.5 py-0.5 text-xs text-muted-foreground",
    divider: "border-border/60",
    statValue: "text-4xl font-bold tracking-tight text-foreground",
    typographyLabel:
      "text-xs font-bold uppercase tracking-wider text-muted-foreground",
  },
}

/**
 * Retrieves the style configuration object corresponding to a given design movement ID.
 * Falls back to "quiet-precision" if the movement ID is invalid or missing.
 *
 * @param {string | null} [movementId] - Identifier of the design movement.
 * @returns {PreviewStyleConfig} The resolved theme styling configuration.
 */
export function getPreviewTheme(
  movementId?: string | null
): PreviewStyleConfig {
  if (!movementId || !(movementId in PREVIEW_THEMES)) {
    return PREVIEW_THEMES["quiet-precision"]
  }
  return PREVIEW_THEMES[movementId as keyof typeof PREVIEW_THEMES]
}
