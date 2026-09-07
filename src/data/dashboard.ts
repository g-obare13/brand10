/**
 * @file dashboard.ts
 * @description Master data configurations for dashboard tabs, templates,
 * guidelines architecture, and AI assistance tools.
 */

export type DashboardTab =
  | "projects"
  | "systems"
  | "templates"
  | "guidelines"
  | "ai"
  | "settings"

export interface DashboardSidebarItem {
  id: DashboardTab
  label: string
  description: string
}

export const DASHBOARD_SIDEBAR_ITEMS: DashboardSidebarItem[] = [
  {
    id: "projects",
    label: "Projects",
    description: "Manage your active brand workspaces",
  },
  {
    id: "systems",
    label: "Systems",
    description: "Explore world-class design systems & guidelines",
  },
  {
    id: "guidelines",
    label: "Guidelines",
    description: "Brand identity architecture blueprint",
  },
  {
    id: "ai",
    label: "AI Assistance",
    description: "AI generation and asset extractors",
  },
  {
    id: "settings",
    label: "Settings",
    description: "Account, team and studio preferences",
  },
]

export interface GuidelineTemplateCard {
  id: string
  title: string
  subtitle: string
  description: string
  tabKey: "logo" | "colors" | "typography" | "mockups" | "overview"
}

export const DEFAULT_GUIDELINE_CARDS: GuidelineTemplateCard[] = [
  {
    id: "logo",
    title: "Logo System",
    subtitle: "Primary version, variations & clear space",
    description:
      "Primary version, variations (horizontal, icon-only, monochrome), clear space rules, minimum size, misuse examples (stretching, recoloring, wrong backgrounds).",
    tabKey: "logo",
  },
  {
    id: "color",
    title: "Color Palette",
    subtitle: "Exact values & usage ratios",
    description:
      "Primary and secondary colors with exact values (HEX, RGB, CMYK, Pantone if print matters), contrast accessibility, and usage ratios.",
    tabKey: "colors",
  },
  {
    id: "typography",
    title: "Typography",
    subtitle: "Hierarchy & web fallback font stacks",
    description:
      "Primary and secondary typefaces, font weights, sizing hierarchy (H1-H4, body, caption), and fallback fonts for web/system use.",
    tabKey: "typography",
  },
  {
    id: "imagery",
    title: "Imagery & Photography",
    subtitle: "Mood, color grading & filter treatment",
    description:
      "Mood, treatment (filters, cropping), aspect ratios, art direction guidelines, and illustration style if applicable.",
    tabKey: "mockups",
  },
  {
    id: "iconography",
    title: "Iconography",
    subtitle: "Style rules & custom symbol glyphs",
    description:
      "Style rules, optical grid alignment, stroke weights, corner radii, and custom SVG icon libraries if custom icons are used.",
    tabKey: "logo",
  },
  {
    id: "foundation",
    title: "Brand Foundation",
    subtitle: "Vision, mission & value statements",
    description:
      "Core mission, vision statements, editorial tone of voice directives, and value propositions to unify your brand identity.",
    tabKey: "overview",
  },
]

export interface BrandTemplateItem {
  id: string
  name: string
  category: string
  description: string
  colors: string[]
  fontFamily: string
}

export const BRAND_TEMPLATES: BrandTemplateItem[] = [
  {
    id: "apex-cloud",
    name: "Apex Enterprise",
    category: "SaaS & Cloud Infrastructure",
    description:
      "High-contrast technical aesthetic with indigo and cyan palettes for developer-first products.",
    colors: ["#6366f1", "#38bdf8", "#0f172a"],
    fontFamily: "Geist Sans, Inter",
  },
  {
    id: "bloom-health",
    name: "Bloom Wellness",
    category: "Health, Consumer & Biotech",
    description:
      "Organic emerald and sage gradients with balanced serif typography for modern healthcare.",
    colors: ["#10b981", "#34d399", "#064e3b"],
    fontFamily: "Season Serif, Outfit",
  },
  {
    id: "nova-creative",
    name: "Nova Media",
    category: "Agency, Editorial & Fashion",
    description:
      "Bold monochromatic contrast with vibrant amber accents and high-fashion serif titles.",
    colors: ["#f59e0b", "#fbbf24", "#18181b"],
    fontFamily: "Season Sans, Syne",
  },
]

export interface AiToolItem {
  id: string
  title: string
  badge: string
  description: string
  actionLabel: string
}

export const AI_ASSISTANCE_TOOLS: AiToolItem[] = [
  {
    id: "extract-file",
    title: "Brand Asset Ingestion & Vector Extractor",
    badge: "Vector & Raster",
    description:
      "Upload any SVG, PNG, or brand asset. The AI engine auto-detects vector paths, color palettes, and clearspace rules.",
    actionLabel: "Upload Brand File",
  },
  {
    id: "palette-optimizer",
    title: "Color Contrast & Accessibility AI",
    badge: "WCAG 2.2 AAA",
    description:
      "Generate accessible light & dark mode variants from a single primary hex with computed contrast ratios and distribution matrices.",
    actionLabel: "Optimize Palette",
  },
  {
    id: "tone-generator",
    title: "Editorial Voice & Tone Synthesizer",
    badge: "Brand Voice",
    description:
      "Synthesize mission statements, vision declarations, and copywriting do/don't directives tailored to your brand identity.",
    actionLabel: "Generate Brand Voice",
  },
]
