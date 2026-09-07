/**
 * @file marketing.ts
 * @description Marketing datasets, landing page showcases, interactive card items,
 * and ambient color defaults used on the public home and shared components.
 */

/**
 * Feature showcase step card for the How It Works section.
 */
export interface ShowcaseStepProject {
  title: string
  img: string
  link: string
  contribution: "contributed" | "led"
  leftText: string
  rightList: string[]
  location: string
  description: string
  stroke1: string
}

/**
 * Default workflow showcase step items on the landing page.
 */
export const DEFAULT_SHOWCASE_PROJECTS: ShowcaseStepProject[] = [
  {
    title: "Foundation & Logo",
    link: "#",
    contribution: "led",
    img: "/showcases/Foundationn.png",
    leftText: "Brand Identity",
    rightList: ["#svg-ingestion", "#brand-foundation", "#clearspace-rules"],
    location: "Step 01",
    description:
      "Upload your logo or vector SVG to automatically extract colors and geometry. Establish core values, tone ratings, design movements, and clearspace rules in minutes.",
    stroke1: "#101828",
  },
  {
    title: "Tokens & Typography",
    link: "#",
    contribution: "led",
    img: "/showcases/Typographyy.png",
    leftText: "Design Systems",
    rightList: ["#color-palette", "#modular-typography", "#wcag-contrast"],
    location: "Step 02",
    description:
      "Generate accessible WCAG-compliant color palettes and responsive typography scales. Fine-tune contrast ratios, modular sizing, and photography art direction with live interactive previews.",
    stroke1: "#5B91FF",
  },
  {
    title: "Guidelines & Export",
    link: "#",
    contribution: "led",
    img: "/showcases/Colorss.png",
    leftText: "Asset Delivery",
    rightList: ["#pdf-brand-deck", "#tailwind-tokens", "#vector-packages"],
    location: "Step 03",
    description:
      "Instantly compile your living design system into exportable deliverables. Download print-ready PDF brand decks, production token bundles for Tailwind/CSS, and structured vector packages.",
    stroke1: "#E7EBEB",
  },
]

/**
 * Magnetic hero card item definition.
 */
export interface HeroMagneticCardItem {
  src: string
  alt: string
}

/**
 * Showcase archetype cards floating on the hero section.
 */
export const HERO_MAGNETIC_ITEMS: HeroMagneticCardItem[] = [
  { src: "/showcases/maximalism.avif", alt: "Expressive Energy Showcase" },
  { src: "/showcases/minimalist.jpg", alt: "Editorial Character Showcase" },
  { src: "/showcases/semi-flat.avif", alt: "Quiet Precision Showcase" },
  { src: "/showcases/neo-brutalism.jpg", alt: "Neo-Brutalist Showcase" },
]

/**
 * Default blurhashes used for smooth image placeholder transitions.
 */
export const DEFAULT_BLURHASHES = [
  "LFMQR]~o%LHq0WVrMc-P9|IVrVrp",
  "L1LNuy00%gQ+00D$.9kD00_4VrMw",
  "L5Of*?cb.ArV?EM_xvx]E3xUkWWs",
  "L2Lz?QDNt600_34T8^IT?cofRPax",
  "LEPsbYRjM{s:0Kf8oet7?wjYt7ay",
  "LDQ9[|D*~Bt7xvofniR*-Uoe9aWB",
  "LHQJcbH?-r.9?HruV[NZ?^XmE0ic",
]

/**
 * Brand studio signature ambient glow colors.
 */
export const DEFAULT_AMBIENT_COLORS = ["#6366f1", "#a855f7", "#38bdf8"]

/**
 * Mock/available AI models list for AI chat and generative assistant widgets.
 */
export const DEFAULT_AI_MODELS = [
  "Gemini 3 Pro",
  "GPT-5.6 Mini",
  "Claude Fable 5",
  "GPT-5.6 Codex",
  "GPT-5.6",
]
