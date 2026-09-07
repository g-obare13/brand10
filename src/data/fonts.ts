/**
 * @file fonts.ts
 * @description Typography datasets, curated pairing archetypes, modular scale ratios,
 * and popular Google Fonts lists used throughout the design studio and font loaders.
 */

/**
 * Curated typography pairing blueprint.
 */
export interface FontPairing {
  id: string
  name: string
  category: string
  display: string
  body: string
  mono: string
  description: string
}

/**
 * Curated font combinations optimized for aesthetic harmony and readability.
 */
export const CURATED_PAIRINGS: FontPairing[] = [
  {
    id: "modern-saas",
    name: "Modern Tech SaaS",
    category: "Modern SaaS",
    display: "Plus Jakarta Sans",
    body: "Inter",
    mono: "JetBrains Mono",
    description:
      "Crisp geometric headings paired with ultra-readable body copy for high-growth digital products.",
  },
  {
    id: "bold-disruptor",
    name: "Bold Neo-Brutalist",
    category: "Bold Tech",
    display: "Syne",
    body: "Space Grotesk",
    mono: "Space Mono",
    description:
      "High personality and unapologetic presence designed for distinctive lifestyle and web3 brands.",
  },
  {
    id: "editorial-luxury",
    name: "Editorial Luxury",
    category: "Editorial Luxury",
    display: "Playfair Display",
    body: "Outfit",
    mono: "DM Mono",
    description:
      "High contrast high-fashion serif matched with clean sans-serif for premium luxury brands.",
  },
  {
    id: "friendly-humanist",
    name: "Warm & Accessible",
    category: "Friendly Minimal",
    display: "Fraunces",
    body: "DM Sans",
    mono: "Fira Code",
    description:
      "Soft organic display serif paired with inviting geometry for human-centric brands.",
  },
  {
    id: "swiss-precision",
    name: "Swiss Precision",
    category: "Clean Corporate",
    display: "Cabinet Grotesk",
    body: "General Sans",
    mono: "Geist Mono",
    description:
      "Timeless modernist structure with rigorous typographic balance and neutral confidence.",
  },
]

/**
 * List of highly popular and reliable Google Fonts available for selection.
 */
export const POPULAR_GOOGLE_FONTS = [
  "Inter",
  "Plus Jakarta Sans",
  "Outfit",
  "Syne",
  "Space Grotesk",
  "Playfair Display",
  "Fraunces",
  "DM Sans",
  "Manrope",
  "Poppins",
  "Montserrat",
  "Cabinet Grotesk",
  "General Sans",
  "Geist Mono",
  "JetBrains Mono",
  "Fira Code",
  "Roboto",
  "Lora",
  "Cinzel",
  "Bebas Neue",
]

/**
 * Mathematical modular scale definition.
 */
export interface ModularScale {
  name: string
  ratio: number
}

/**
 * Standard classical modular typography scale ratios.
 */
export const MODULAR_SCALES: ModularScale[] = [
  { name: "Minor Second", ratio: 1.067 },
  { name: "Major Second", ratio: 1.125 },
  { name: "Minor Third", ratio: 1.2 },
  { name: "Major Third", ratio: 1.25 },
  { name: "Perfect Fourth", ratio: 1.333 },
  { name: "Augmented Fourth", ratio: 1.414 },
  { name: "Perfect Fifth", ratio: 1.5 },
  { name: "Golden Ratio", ratio: 1.618 },
]

/**
 * Google Font metadata item.
 */
export interface GoogleFontItem {
  family: string
  category:
    | "sans-serif"
    | "serif"
    | "display"
    | "handwriting"
    | "monospace"
    | string
  variants: string[]
  subsets: string[]
  version: string
  lastModified: string
  files?: Record<string, string>
}

/**
 * Fallback list of pre-configured Google Fonts for offline or API rate-limited environments.
 */
export const POPULAR_FALLBACK_FONTS: GoogleFontItem[] = [
  {
    family: "Plus Jakarta Sans",
    category: "sans-serif",
    variants: ["regular", "600", "700", "800"],
    subsets: ["latin"],
    version: "v1",
    lastModified: "",
  },
  {
    family: "Inter",
    category: "sans-serif",
    variants: ["regular", "500", "600", "700"],
    subsets: ["latin"],
    version: "v1",
    lastModified: "",
  },
  {
    family: "Outfit",
    category: "sans-serif",
    variants: ["regular", "500", "600", "700"],
    subsets: ["latin"],
    version: "v1",
    lastModified: "",
  },
  {
    family: "Syne",
    category: "display",
    variants: ["regular", "700", "800"],
    subsets: ["latin"],
    version: "v1",
    lastModified: "",
  },
  {
    family: "Space Grotesk",
    category: "sans-serif",
    variants: ["regular", "500", "700"],
    subsets: ["latin"],
    version: "v1",
    lastModified: "",
  },
  {
    family: "Playfair Display",
    category: "serif",
    variants: ["regular", "600", "700", "800"],
    subsets: ["latin"],
    version: "v1",
    lastModified: "",
  },
  {
    family: "Fraunces",
    category: "serif",
    variants: ["regular", "600", "700", "900"],
    subsets: ["latin"],
    version: "v1",
    lastModified: "",
  },
  {
    family: "DM Sans",
    category: "sans-serif",
    variants: ["regular", "500", "700"],
    subsets: ["latin"],
    version: "v1",
    lastModified: "",
  },
  {
    family: "Manrope",
    category: "sans-serif",
    variants: ["regular", "600", "700", "800"],
    subsets: ["latin"],
    version: "v1",
    lastModified: "",
  },
  {
    family: "Poppins",
    category: "sans-serif",
    variants: ["regular", "500", "600", "700"],
    subsets: ["latin"],
    version: "v1",
    lastModified: "",
  },
  {
    family: "Montserrat",
    category: "sans-serif",
    variants: ["regular", "600", "700", "800"],
    subsets: ["latin"],
    version: "v1",
    lastModified: "",
  },
  {
    family: "Cabinet Grotesk",
    category: "sans-serif",
    variants: ["regular", "700", "800"],
    subsets: ["latin"],
    version: "v1",
    lastModified: "",
  },
  {
    family: "General Sans",
    category: "sans-serif",
    variants: ["regular", "600", "700"],
    subsets: ["latin"],
    version: "v1",
    lastModified: "",
  },
  {
    family: "Geist Mono",
    category: "monospace",
    variants: ["regular", "500", "600"],
    subsets: ["latin"],
    version: "v1",
    lastModified: "",
  },
  {
    family: "JetBrains Mono",
    category: "monospace",
    variants: ["regular", "500", "700"],
    subsets: ["latin"],
    version: "v1",
    lastModified: "",
  },
  {
    family: "Space Mono",
    category: "monospace",
    variants: ["regular", "700"],
    subsets: ["latin"],
    version: "v1",
    lastModified: "",
  },
  {
    family: "Fira Code",
    category: "monospace",
    variants: ["regular", "500", "700"],
    subsets: ["latin"],
    version: "v1",
    lastModified: "",
  },
  {
    family: "DM Mono",
    category: "monospace",
    variants: ["regular", "500"],
    subsets: ["latin"],
    version: "v1",
    lastModified: "",
  },
  {
    family: "Lora",
    category: "serif",
    variants: ["regular", "500", "600", "700"],
    subsets: ["latin"],
    version: "v1",
    lastModified: "",
  },
  {
    family: "Cinzel",
    category: "serif",
    variants: ["regular", "600", "700"],
    subsets: ["latin"],
    version: "v1",
    lastModified: "",
  },
  {
    family: "Bebas Neue",
    category: "display",
    variants: ["regular"],
    subsets: ["latin"],
    version: "v1",
    lastModified: "",
  },
  {
    family: "Oswald",
    category: "sans-serif",
    variants: ["regular", "500", "600", "700"],
    subsets: ["latin"],
    version: "v1",
    lastModified: "",
  },
  {
    family: "Raleway",
    category: "sans-serif",
    variants: ["regular", "600", "700", "800"],
    subsets: ["latin"],
    version: "v1",
    lastModified: "",
  },
  {
    family: "Cormorant Garamond",
    category: "serif",
    variants: ["regular", "600", "700"],
    subsets: ["latin"],
    version: "v1",
    lastModified: "",
  },
  {
    family: "Clash Display",
    category: "display",
    variants: ["regular", "600", "700"],
    subsets: ["latin"],
    version: "v1",
    lastModified: "",
  },
  {
    family: "Cinzel Decorative",
    category: "display",
    variants: ["regular", "700"],
    subsets: ["latin"],
    version: "v1",
    lastModified: "",
  },
]
