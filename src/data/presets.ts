/**
 * @file presets.ts
 * @description Pre-configured archetype brand presets and default brand governance rules.
 */

import { createColorSwatch } from "@/lib/colorUtils"
import type { ColorSwatch } from "@/lib/colorUtils"

/**
 * Brand rule item for logo usage guidelines.
 */
export interface BrandDoDontItem {
  id: string
  type: "do" | "dont"
  rule: string
  detail: string
}

/**
 * Default logo guidelines and misuse rules.
 */
export const DEFAULT_DOS_AND_DONTS: BrandDoDontItem[] = [
  {
    id: "1",
    type: "dont",
    rule: "Don't use outdated versions",
    detail:
      "If the brand has had past logo iterations, only the current approved version should appear.",
  },
  {
    id: "2",
    type: "dont",
    rule: "Don't add effects",
    detail:
      "No drop shadows, gradients, outlines, bevels, or glows unless that's part of the actual logo design.",
  },
  {
    id: "3",
    type: "dont",
    rule: "Don't recolor outside the approved palette",
    detail: "No random or off-brand colors applied to the mark.",
  },
  {
    id: "4",
    type: "dont",
    rule: "Don't rotate",
    detail:
      "Keep the logo at its intended orientation unless a rotated lockup is explicitly part of the system.",
  },
  {
    id: "5",
    type: "dont",
    rule: "Don't stretch or distort",
    detail:
      "Never scale non-proportionally (squishing horizontally or vertically).",
  },
]

/**
 * Brand tone ratings map.
 */
export interface BrandToneRatings {
  formal: number
  playful: number
  minimalist: number
  bold: number
}

/**
 * Complete preset archetype brand definition.
 */
export interface PresetBrandDefinition {
  brandName: string
  tagline: string
  mission: string
  vision: string
  coreValues: string[]
  toneRatings: BrandToneRatings
  displayFont: string
  bodyFont: string
  monoFont: string
  baseFontSize: number
  typeScaleRatio: number
  colors: ColorSwatch[]
}

/**
 * Curated archetype presets ready for instant activation and demo workspaces.
 */
export const PRESET_BRANDS: Record<"apex" | "bloom" | "nova", PresetBrandDefinition> = {
  apex: {
    brandName: "Apex Cloud",
    tagline: "Next-Generation Autonomous Cloud Infrastructure",
    mission:
      "To make distributed cloud computing instant, zero-maintenance, and universally accessible.",
    vision:
      "A world where developers build world-scale intelligence without server operational friction.",
    coreValues: [
      "Radical Velocity",
      "Architectural Elegance",
      "Zero Trust Security",
      "Developer Empathy",
    ],
    toneRatings: { formal: 60, playful: 20, minimalist: 85, bold: 90 },
    displayFont: "Plus Jakarta Sans",
    bodyFont: "Inter",
    monoFont: "JetBrains Mono",
    baseFontSize: 16,
    typeScaleRatio: 1.25,
    colors: [
      createColorSwatch("#6366f1", "primary", "Electric Indigo"),
      createColorSwatch("#06b6d4", "secondary", "Cyber Cyan"),
      createColorSwatch("#10b981", "accent", "Emerald Spark"),
      createColorSwatch("#0f172a", "neutral", "Midnight Slate"),
      createColorSwatch("#ffffff", "background", "Pure Surface"),
    ],
  },
  bloom: {
    brandName: "Bloom Botanicals",
    tagline: "Pure Organic Regenerative Skincare & Rituals",
    mission:
      "To restore balance to skin and soil through zero-chemical bio-fermented botanicals.",
    vision:
      "Setting the gold standard for luxury sustainable wellness that gives back to the earth.",
    coreValues: [
      "Bio-Integrity",
      "Earth Stewardship",
      "Mindful Craftsmanship",
      "Radical Transparency",
    ],
    toneRatings: { formal: 35, playful: 60, minimalist: 70, bold: 30 },
    displayFont: "Playfair Display",
    bodyFont: "Outfit",
    monoFont: "DM Mono",
    baseFontSize: 16,
    typeScaleRatio: 1.333,
    colors: [
      createColorSwatch("#84cc16", "primary", "Moss Botanical"),
      createColorSwatch("#d97706", "secondary", "Golden Amber"),
      createColorSwatch("#ec4899", "accent", "Wild Rose"),
      createColorSwatch("#292524", "neutral", "Warm Earth"),
      createColorSwatch("#fefce8", "background", "Warm Cream"),
    ],
  },
  nova: {
    brandName: "Nova Capital",
    tagline: "Conviction-Driven Ventures for Deep Tech Founders",
    mission:
      "To fund and accelerate frontier technology breakthroughs that define the next century.",
    vision:
      "Catalyzing humanity's greatest leaps across aerospace, quantum computing, and bio-engineering.",
    coreValues: [
      "Deep Conviction",
      "Scientific Rigor",
      "Founder Sovereignity",
      "Generational Horizon",
    ],
    toneRatings: { formal: 85, playful: 15, minimalist: 90, bold: 80 },
    displayFont: "Syne",
    bodyFont: "Space Grotesk",
    monoFont: "Space Mono",
    baseFontSize: 16,
    typeScaleRatio: 1.25,
    colors: [
      createColorSwatch("#2563eb", "primary", "Frontier Blue"),
      createColorSwatch("#f59e0b", "secondary", "Solar Flare"),
      createColorSwatch("#8b5cf6", "accent", "Quantum Violet"),
      createColorSwatch("#09090b", "neutral", "Carbon Black"),
      createColorSwatch("#f4f4f5", "background", "Platinum White"),
    ],
  },
}
