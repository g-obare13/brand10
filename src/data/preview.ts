/**
 * @file preview.ts
 * @description Centralized datasets, content blueprints, and stylistic presets
 * used across the PDF guidelines and preview generation canvases.
 */

/**
 * Imagery mood descriptor interface.
 */
export interface MoodDetail {
  title: string
  subtitle: string
  lighting: string
  badge: string
}

/**
 * Mood configuration details mapped by imagery mood type.
 */
export const MOOD_DETAILS: Record<
  "minimal" | "cinematic" | "vibrant" | "editorial",
  MoodDetail
> = {
  minimal: {
    title: "Studio Minimal & Architectural",
    subtitle:
      "High-key ambient daylight, subtle shadow gradation, and intentional negative space.",
    lighting: "Diffused Daylight & High-Key Ambient",
    badge: "Architectural Minimal",
  },
  cinematic: {
    title: "Moody & Cinematic Direction",
    subtitle:
      "Dramatic directional lighting, deep obsidian contrast, and filmic composition.",
    lighting: "Low-Key Directional & Rim Highlights",
    badge: "Cinematic Drama",
  },
  vibrant: {
    title: "Vibrant & Prismatic Chromatics",
    subtitle:
      "Refractive frosted glass, vivid accent reflections, and dynamic tactile energy.",
    lighting: "High-Energy Chromatic & Prismatic Speculars",
    badge: "Chromatic Vitality",
  },
  editorial: {
    title: "Editorial & Authentic Human Poise",
    subtitle:
      "Natural golden-hour sunlight, tactile grain, and documentary-style composition.",
    lighting: "Natural Golden Hour & Soft Ambient",
    badge: "Tactile Editorial",
  },
}

/**
 * Table of contents section blueprint item.
 */
export interface TableOfContentItem {
  num: string
  title: string
  desc: string
}

/**
 * Default table of contents outline sections for PDF deck preview.
 */
export const DEFAULT_SECTIONS: TableOfContentItem[] = [
  {
    num: "01",
    title: "Brand Strategy & Foundation",
    desc: "Core mission, vision, brand personality attributes, and guiding brand values.",
  },
  {
    num: "02",
    title: "Logo System & Geometry",
    desc: "Primary mark, secondary lockup, construction grid, clearspace margins, and sizing.",
  },
  {
    num: "03",
    title: "Color Palette & Harmony",
    desc: "Primary, secondary, and accent swatches with tonal colorimetry and accessibility standards.",
  },
  {
    num: "04",
    title: "Typography Hierarchy",
    desc: "Modular scale display headings, secondary body systems, character sets, and typesetting rules.",
  },
  {
    num: "05",
    title: "Imagery & Art Direction",
    desc: "Photography art direction, ambient lighting, compositional balance, and asset attribution.",
  },
]

/**
 * Default fallback brand mission statement.
 */
export const DEFAULT_MISSION =
  "To empower audiences through deliberate craftsmanship, thoughtful design, and disciplined execution across every touchpoint."

/**
 * Default fallback brand vision statement.
 */
export const DEFAULT_VISION =
  "To establish an enduring standard of clarity, reliability, and timeless excellence in modern brand architecture."

/**
 * Core foundation value blueprint item.
 */
export interface FoundationCoreValue {
  num: string
  title: string
  desc: string
}

/**
 * Default core foundation values.
 */
export const DEFAULT_VALUES: FoundationCoreValue[] = [
  {
    num: "01",
    title: "Precision",
    desc: "Rigorous attention to detail and proportion in every output.",
  },
  {
    num: "02",
    title: "Clarity",
    desc: "Communicating purpose without unnecessary decoration or friction.",
  },
  {
    num: "03",
    title: "Authenticity",
    desc: "Honest expression of materials, identity, and customer promises.",
  },
]

/**
 * Standard shade level keys for tonal palette generation and preview dialogs.
 */
export const SHADE_KEYS = [
  "50",
  "100",
  "200",
  "300",
  "400",
  "500",
  "600",
  "700",
  "800",
  "900",
  "950",
] as const

export type ShadeKey = (typeof SHADE_KEYS)[number]

/**
 * Common font weight variations for typography scale previewing and canvas measurement.
 */
export const FONT_WEIGHTS = ["400", "500", "600", "700", "800"] as const
