export interface FontPairing {
  id: string
  name: string
  category: 'Modern SaaS' | 'Editorial Luxury' | 'Bold Tech' | 'Friendly Minimal' | 'Clean Corporate'
  display: string
  body: string
  mono: string
  description: string
}

export interface TypeScaleStep {
  name: string
  label: string
  ratioPower: number
  fontSizePx: number
  lineHeight: number
  letterSpacing: string
  fontWeight: number
}

export const CURATED_PAIRINGS: FontPairing[] = [
  {
    id: 'modern-saas',
    name: 'Modern Tech SaaS',
    category: 'Modern SaaS',
    display: 'Plus Jakarta Sans',
    body: 'Inter',
    mono: 'JetBrains Mono',
    description: 'Crisp geometric headings paired with ultra-readable body copy for high-growth digital products.',
  },
  {
    id: 'bold-disruptor',
    name: 'Bold Neo-Brutalist',
    category: 'Bold Tech',
    display: 'Syne',
    body: 'Space Grotesk',
    mono: 'Space Mono',
    description: 'High personality and unapologetic presence designed for distinctive lifestyle and web3 brands.',
  },
  {
    id: 'editorial-luxury',
    name: 'Editorial Luxury',
    category: 'Editorial Luxury',
    display: 'Playfair Display',
    body: 'Outfit',
    mono: 'DM Mono',
    description: 'High contrast high-fashion serif matched with clean sans-serif for premium luxury brands.',
  },
  {
    id: 'friendly-humanist',
    name: 'Warm & Accessible',
    category: 'Friendly Minimal',
    display: 'Fraunces',
    body: 'DM Sans',
    mono: 'Fira Code',
    description: 'Soft organic display serif paired with inviting geometry for human-centric brands.',
  },
  {
    id: 'swiss-precision',
    name: 'Swiss Precision',
    category: 'Clean Corporate',
    display: 'Cabinet Grotesk',
    body: 'General Sans',
    mono: 'Geist Mono',
    description: 'Timeless modernist structure with rigorous typographic balance and neutral confidence.',
  },
]

export const POPULAR_GOOGLE_FONTS = [
  'Inter',
  'Plus Jakarta Sans',
  'Outfit',
  'Syne',
  'Space Grotesk',
  'Playfair Display',
  'Fraunces',
  'DM Sans',
  'Manrope',
  'Poppins',
  'Montserrat',
  'Cabinet Grotesk',
  'General Sans',
  'Geist Mono',
  'JetBrains Mono',
  'Fira Code',
  'Roboto',
  'Lora',
  'Cinzel',
  'Bebas Neue',
]

export const MODULAR_SCALES = [
  { name: 'Minor Second', ratio: 1.067 },
  { name: 'Major Second', ratio: 1.125 },
  { name: 'Minor Third', ratio: 1.2 },
  { name: 'Major Third', ratio: 1.25 },
  { name: 'Perfect Fourth', ratio: 1.333 },
  { name: 'Augmented Fourth', ratio: 1.414 },
  { name: 'Perfect Fifth', ratio: 1.5 },
  { name: 'Golden Ratio', ratio: 1.618 },
]

/**
 * Inject Google Font into DOM <head> dynamically if not already loaded
 */
export function loadGoogleFont(fontFamily: string, variants?: string[]): void {
  if (typeof document === 'undefined' || !fontFamily) return

  const cleanFamily = fontFamily.trim()
  const fontSlug = cleanFamily.replace(/\s+/g, '+')
  const elementId = `google-font-${cleanFamily.toLowerCase().replace(/[^a-z0-9]/g, '-')}`

  if (document.getElementById(elementId)) return

  const link = document.createElement('link')
  link.id = elementId
  link.rel = 'stylesheet'
  link.crossOrigin = 'anonymous'

  // If specific variants are known, build custom weight string, otherwise use safe fallback
  if (variants && variants.length > 0) {
    const numericWeights = variants
      .map((v) => (v === 'regular' ? '400' : v.replace(/italic/, '')))
      .filter((v) => /^\d+$/.test(v))
      .sort((a, b) => Number(a) - Number(b))
    const uniqueWeights = Array.from(new Set(numericWeights))

    if (uniqueWeights.length > 0) {
      link.href = `https://fonts.googleapis.com/css2?family=${fontSlug}:wght@${uniqueWeights.join(';')}&display=swap`
    } else {
      link.href = `https://fonts.googleapis.com/css2?family=${fontSlug}&display=swap`
    }
  } else {
    // Default standard request without hardcoded weight constraints that cause 400s
    link.href = `https://fonts.googleapis.com/css2?family=${fontSlug}:wght@400;500;600;700&display=swap`
    link.onerror = () => {
      // If weight range doesn't exist for this font, load without constraints
      link.href = `https://fonts.googleapis.com/css2?family=${fontSlug}&display=swap`
    }
  }

  document.head.appendChild(link)
}

/**
 * Compute the responsive typography scale based on a base size and modular ratio
 */
export function computeTypeScale(baseSize = 16, ratio = 1.25): TypeScaleStep[] {
  const steps: { name: string; label: string; power: number; weight: number; lh: number; ls: string }[] = [
    { name: 'Display', label: 'display', power: 5, weight: 800, lh: 1.1, ls: '-0.03em' },
    { name: 'Heading 1', label: 'h1', power: 4, weight: 700, lh: 1.15, ls: '-0.025em' },
    { name: 'Heading 2', label: 'h2', power: 3, weight: 700, lh: 1.2, ls: '-0.02em' },
    { name: 'Heading 3', label: 'h3', power: 2, weight: 600, lh: 1.25, ls: '-0.015em' },
    { name: 'Heading 4', label: 'h4', power: 1, weight: 600, lh: 1.3, ls: '-0.01em' },
    { name: 'Body Large', label: 'body-lg', power: 0.5, weight: 400, lh: 1.5, ls: '0' },
    { name: 'Body Regular', label: 'body', power: 0, weight: 400, lh: 1.5, ls: '0' },
    { name: 'Small / Caption', label: 'small', power: -1, weight: 500, lh: 1.4, ls: '0.01em' },
    { name: 'Micro / Tag', label: 'micro', power: -2, weight: 600, lh: 1.3, ls: '0.02em' },
  ]

  return steps.map((s) => ({
    name: s.name,
    label: s.label,
    ratioPower: s.power,
    fontSizePx: Math.round(baseSize * Math.pow(ratio, s.power) * 10) / 10,
    lineHeight: s.lh,
    letterSpacing: s.ls,
    fontWeight: s.weight,
  }))
}
