import type { PreviewStyleId } from "./A4PageFrame"

export interface PdfThemeTokens {
  styleTheme: PreviewStyleId
  isExpressive: boolean
  isSoftTactility: boolean
  isEditorial: boolean
  isQuietPrecision: boolean

  // Frame container class
  pageFrame: string

  // Headers & section titles
  title: string
  accentBar: string
  introText: string
  subheading: string

  // Cards & containers
  card: string
  tileCard: string
  stageCard: string
  contrastCardDark: string
  contrastCardLight: string

  // Badges (classes applied to <Badge className={...}>)
  badgePrimary: string
  badgeSecondary: string
  badgeAmber: string
  badgeLime: string
  badgeOutline: string

  // Dividers & borders
  divider: string
  borderAccent: string

  // Typography helpers
  monoLabel: string
  dataText: string
}

export function getPdfTheme(styleTheme: PreviewStyleId): PdfThemeTokens {
  const isExpressive = styleTheme === "expressive-energy"
  const isSoftTactility = styleTheme === "soft-tactility"
  const isEditorial = styleTheme === "editorial-character"

  // 1. Expressive Energy (Neo-Brutalist)
  if (isExpressive) {
    return {
      styleTheme,
      isExpressive: true,
      isSoftTactility: false,
      isEditorial: false,
      isQuietPrecision: false,
      pageFrame:
        "overflow-hidden border-2 border-black bg-white p-12 text-black shadow-2xl",
      title: "text-black uppercase font-black tracking-tight",
      accentBar: "h-1.5 w-20 bg-black shadow-[2px_2px_0px_0px_#000]",
      introText: "text-sm text-zinc-800 font-medium",
      subheading: "text-black font-black uppercase tracking-tight",
      card: "rounded-xl border-2 border-black bg-white p-5 shadow-[4px_4px_0px_0px_#000]",
      tileCard:
        "rounded-xl border-2 border-black bg-white p-4 shadow-[3px_3px_0px_0px_#000]",
      stageCard:
        "rounded-xl border-2 border-black bg-white p-6 shadow-[5px_5px_0px_0px_#000]",
      contrastCardDark:
        "relative flex flex-col items-center justify-center rounded-xl border-2 border-black bg-black p-8 text-white shadow-[4px_4px_0px_0px_#000]",
      contrastCardLight:
        "relative flex flex-col items-center justify-center rounded-xl border-2 border-black bg-white p-8 text-black shadow-[4px_4px_0px_0px_#000]",
      badgePrimary:
        "border-2 border-black pdf-badge-expressive-primary font-black uppercase tracking-wider text-[10px] shadow-[2px_2px_0px_0px_#000] rounded-md",
      badgeSecondary:
        "border-2 border-black pdf-badge-expressive-secondary font-black uppercase tracking-wider text-[10px] shadow-[2px_2px_0px_0px_#000] rounded-md",
      badgeAmber:
        "border-2 border-black pdf-badge-expressive-primary font-black uppercase tracking-wider text-[10px] shadow-[2px_2px_0px_0px_#000] rounded-md",
      badgeLime:
        "border-2 border-black pdf-badge-expressive-secondary font-black uppercase tracking-wider text-[10px] shadow-[2px_2px_0px_0px_#000] rounded-md",
      badgeOutline:
        "border-2 border-black bg-white text-black font-black uppercase tracking-wider text-[10px] shadow-[2px_2px_0px_0px_#000] rounded-md",
      divider: "border-2 border-black",
      borderAccent: "border-black",
      monoLabel: "font-mono text-xs font-black text-black uppercase",
      dataText: "font-mono font-bold text-black",
    }
  }

  // 2. Soft Tactility (Neumorphic & Tactile)
  if (isSoftTactility) {
    return {
      styleTheme,
      isExpressive: false,
      isSoftTactility: true,
      isEditorial: false,
      isQuietPrecision: false,
      pageFrame:
        "overflow-hidden rounded-3xl border border-stone-200/80 bg-[#fafaf9] p-12 text-stone-900 shadow-[10px_10px_30px_rgba(0,0,0,0.06),-8px_-8px_24px_rgba(255,255,255,0.9)]",
      title: "text-stone-900 uppercase font-bold tracking-tight",
      accentBar:
        "h-1.5 w-20 rounded-full bg-stone-400 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.15)]",
      introText: "max-w-xl text-stone-600 font-normal leading-relaxed",
      subheading: "text-base font-semibold text-stone-900",
      card: "rounded-3xl border border-stone-200/60 bg-white/90 p-5 shadow-[6px_6px_16px_rgba(0,0,0,0.05),-4px_-4px_12px_rgba(255,255,255,0.9)]",
      tileCard:
        "rounded-2xl border border-stone-200/60 bg-white/90 p-4 shadow-[4px_4px_12px_rgba(0,0,0,0.04),-3px_-3px_8px_rgba(255,255,255,0.9)]",
      stageCard:
        "rounded-3xl border border-stone-200/60 bg-stone-50/80 p-6 shadow-[inset_2px_2px_6px_rgba(0,0,0,0.04),inset_-2px_-2px_6px_rgba(255,255,255,0.8)]",
      contrastCardDark:
        "relative flex flex-col items-center justify-center rounded-3xl border border-stone-800 bg-stone-900 p-8 text-white shadow-[6px_6px_16px_rgba(0,0,0,0.2)]",
      contrastCardLight:
        "relative flex flex-col items-center justify-center rounded-3xl border border-stone-200/80 bg-white p-8 text-stone-900 shadow-[6px_6px_16px_rgba(0,0,0,0.05),-4px_-4px_12px_rgba(255,255,255,0.9)]",
      badgePrimary:
        "rounded-full border border-stone-200/80 bg-stone-100/90 px-3 py-0.5 text-stone-800 font-semibold text-[11px] shadow-[inset_1px_1px_2px_rgba(0,0,0,0.08),inset_-1px_-1px_2px_rgba(255,255,255,0.9)]",
      badgeSecondary:
        "rounded-full border border-stone-200/80 bg-stone-200/70 px-3 py-0.5 text-stone-900 font-semibold text-[11px] shadow-[inset_1px_1px_2px_rgba(0,0,0,0.08),inset_-1px_-1px_2px_rgba(255,255,255,0.9)]",
      badgeAmber:
        "rounded-full border border-amber-200 bg-amber-50 px-3 py-0.5 text-amber-800 font-semibold text-[11px] shadow-[inset_1px_1px_2px_rgba(0,0,0,0.05),inset_-1px_-1px_2px_rgba(255,255,255,0.8)]",
      badgeLime:
        "rounded-full border border-emerald-200 bg-emerald-50 px-3 py-0.5 text-emerald-800 font-semibold text-[11px] shadow-[inset_1px_1px_2px_rgba(0,0,0,0.05),inset_-1px_-1px_2px_rgba(255,255,255,0.8)]",
      badgeOutline:
        "rounded-full border border-stone-300 bg-white px-3 py-0.5 text-stone-700 text-[11px] shadow-[2px_2px_6px_rgba(0,0,0,0.04)]",
      divider: "border-stone-200/80",
      borderAccent: "border-stone-400",
      monoLabel:
        "text-xs font-semibold text-stone-500 uppercase tracking-wider",
      dataText: "font-mono font-medium text-stone-700",
    }
  }

  // 3. Editorial Character (Broadsheet & Literary)
  if (isEditorial) {
    return {
      styleTheme,
      isExpressive: false,
      isSoftTactility: false,
      isEditorial: true,
      isQuietPrecision: false,
      pageFrame:
        "overflow-hidden rounded-none border border-stone-300 bg-[#faf8f5] p-12 text-stone-950 shadow-2xl",
      title: "text-stone-950 uppercase font-bold",
      accentBar: "h-px w-24 bg-stone-950",
      introText: "max-w-xl text-stone-600",
      subheading: "text-base font-semibold text-stone-950",
      card: "rounded-none border-t border-b border-stone-300 bg-transparent p-5",
      tileCard: "rounded-none border-l-2 border-stone-900 bg-transparent p-4",
      stageCard: "rounded-none border border-stone-300 bg-stone-100/40 p-6",
      contrastCardDark:
        "relative flex flex-col items-center justify-center rounded-none border border-stone-900 bg-stone-950 p-8 text-stone-100",
      contrastCardLight:
        "relative flex flex-col items-center justify-center rounded-none border border-stone-300 bg-white p-8 text-stone-950",
      badgePrimary:
        "rounded-none border border-stone-950 bg-transparent px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-widest text-stone-950",
      badgeSecondary:
        "rounded-none border-b border-stone-950 bg-transparent px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-stone-950",
      badgeAmber:
        "rounded-none border border-stone-950 bg-stone-950 text-stone-50 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-widest",
      badgeLime:
        "rounded-none border border-stone-800 bg-stone-200/80 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-widest text-stone-950",
      badgeOutline:
        "rounded-none border border-stone-400 bg-transparent px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-widest text-stone-600",
      divider: "border-stone-300",
      borderAccent: "border-stone-950",
      monoLabel:
        "font-mono text-[10px] uppercase tracking-widest text-stone-500",
      dataText: "font-mono text-stone-800",
    }
  }

  // 4. Quiet Precision (Default Minimalist)
  return {
    styleTheme,
    isExpressive: false,
    isSoftTactility: false,
    isEditorial: false,
    isQuietPrecision: true,
    pageFrame:
      "overflow-hidden border border-zinc-200 bg-white p-12 text-primary-900 shadow-2xl",
    title: "text-primary-900 uppercase font-bold",
    accentBar: "h-0.5 w-16 bg-zinc-500",
    introText: "max-w-xl text-zinc-600",
    subheading: "text-base font-semibold text-primary-900",
    card: "rounded-xl border border-zinc-200 bg-zinc-50/50 p-4",
    tileCard: "space-y-1",
    stageCard:
      "relative flex flex-col items-center justify-center overflow-hidden p-8",
    contrastCardDark:
      "relative flex flex-col items-center justify-center rounded-xl bg-zinc-950 p-8 text-white",
    contrastCardLight:
      "relative flex flex-col items-center justify-center rounded-xl border border-zinc-200 bg-zinc-50 p-8 text-zinc-900",
    badgePrimary:
      "rounded-full border border-zinc-200 bg-zinc-100 text-zinc-800 text-[10px] font-medium px-2.5 py-0.5",
    badgeSecondary:
      "rounded-full border border-zinc-200 bg-zinc-50 text-zinc-600 text-[10px] font-medium px-2.5 py-0.5",
    badgeAmber:
      "rounded-full border border-zinc-200 bg-zinc-100 text-zinc-800 text-[10px] font-medium px-2.5 py-0.5",
    badgeLime:
      "rounded-full border border-zinc-200 bg-zinc-100 text-zinc-800 text-[10px] font-medium px-2.5 py-0.5",
    badgeOutline:
      "rounded-full border border-zinc-200 bg-white text-zinc-700 text-[10px] font-medium px-2.5 py-0.5",
    divider: "border-zinc-200",
    borderAccent: "border-primary-900",
    monoLabel: "text-xs font-bold text-zinc-500 uppercase",
    dataText: "font-mono text-zinc-600",
  }
}
