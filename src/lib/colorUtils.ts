import chroma from "chroma-js"

export interface ColorSwatch {
  id: string
  name: string
  role:
    | "primary"
    | "secondary"
    | "accent"
    | "neutral"
    | "background"
    | "surface"
    | "custom"
  hex: string
  rgb: { r: number; g: number; b: number }
  cmyk: { c: number; m: number; y: number; k: number }
  hsl: { h: number; s: number; l: number }
  oklch?: { l: number; c: number; h: number }
  shades: Record<string, string> // 50 to 950
}

export interface WcagResult {
  ratio: number
  aaNormal: boolean
  aaLarge: boolean
  aaaNormal: boolean
  aaaLarge: boolean
  rating: "AAA" | "AA" | "AA Large" | "Fail"
}

/**
 * Convert Hex to CMYK percentages (0-100)
 */
export function hexToCmyk(hex: string): {
  c: number
  m: number
  y: number
  k: number
} {
  try {
    const [r, g, b] = chroma(hex)
      .rgb()
      .map((v) => v / 255)
    const k = 1 - Math.max(r, g, b)
    if (k === 1) {
      return { c: 0, m: 0, y: 0, k: 100 }
    }
    const c = Math.round(((1 - r - k) / (1 - k)) * 100)
    const m = Math.round(((1 - g - k) / (1 - k)) * 100)
    const y = Math.round(((1 - b - k) / (1 - k)) * 100)
    return {
      c: Math.max(0, Math.min(100, c)),
      m: Math.max(0, Math.min(100, m)),
      y: Math.max(0, Math.min(100, y)),
      k: Math.round(k * 100),
    }
  } catch {
    return { c: 0, m: 0, y: 0, k: 100 }
  }
}

/**
 * Convert Hex to HSL
 */
export function hexToHsl(hex: string): { h: number; s: number; l: number } {
  try {
    const [h, s, l] = chroma(hex).hsl()
    return {
      h: isNaN(h) ? 0 : Math.round(h),
      s: Math.round((isNaN(s) ? 0 : s) * 100),
      l: Math.round((isNaN(l) ? 0 : l) * 100),
    }
  } catch {
    return { h: 0, s: 0, l: 0 }
  }
}

/**
 * Generate 11-step tint and shade palette (50, 100, 200, ..., 900, 950)
 */
export function generateTonalShades(hex: string): Record<string, string> {
  try {
    const scale = chroma
      .scale(["#ffffff", hex, "#000000"])
      .domain([0, 0.5, 1])
      .mode("lab")

    return {
      "50": scale(0.08).hex(),
      "100": scale(0.16).hex(),
      "200": scale(0.28).hex(),
      "300": scale(0.38).hex(),
      "400": scale(0.45).hex(),
      "500": chroma(hex).hex(),
      "600": scale(0.58).hex(),
      "700": scale(0.68).hex(),
      "800": scale(0.78).hex(),
      "900": scale(0.88).hex(),
      "950": scale(0.94).hex(),
    }
  } catch {
    return {
      "500": hex,
    }
  }
}

/**
 * Create a full ColorSwatch object from a HEX string and assigned role
 */
export function createColorSwatch(
  hex: string,
  role: ColorSwatch["role"] = "primary",
  customName?: string
): ColorSwatch {
  const safeHex = chroma.valid(hex) ? chroma(hex).hex() : "#624b59"
  const [r, g, b] = chroma(safeHex).rgb()
  const shades = generateTonalShades(safeHex)

  const defaultNames: Record<ColorSwatch["role"], string> = {
    primary: "Primary Brand",
    secondary: "Secondary Accent",
    accent: "Electric Accent",
    neutral: "Slate Neutral",
    background: "Canvas Background",
    surface: "Surface Card",
    custom: "Accent Color",
  }

  return {
    id: `color-${Math.random().toString(36).substring(2, 9)}`,
    name: customName || defaultNames[role] || "Color",
    role,
    hex: safeHex,
    rgb: { r, g, b },
    cmyk: hexToCmyk(safeHex),
    hsl: hexToHsl(safeHex),
    shades,
  }
}

/**
 * Calculate WCAG 2.1 Contrast Ratio between two colors
 */
export function getWcagContrast(
  foregroundHex: string,
  backgroundHex: string
): WcagResult {
  try {
    const validFg = chroma.valid(foregroundHex) ? foregroundHex : "#000000"
    const validBg = chroma.valid(backgroundHex) ? backgroundHex : "#ffffff"
    const ratio = Math.round(chroma.contrast(validFg, validBg) * 100) / 100

    const aaNormal = ratio >= 4.5
    const aaLarge = ratio >= 3.0
    const aaaNormal = ratio >= 7.0
    const aaaLarge = ratio >= 4.5

    let rating: WcagResult["rating"] = "Fail"
    if (aaaNormal) rating = "AAA"
    else if (aaNormal) rating = "AA"
    else if (aaLarge) rating = "AA Large"

    return {
      ratio,
      aaNormal,
      aaLarge,
      aaaNormal,
      aaaLarge,
      rating,
    }
  } catch {
    return {
      ratio: 1,
      aaNormal: false,
      aaLarge: false,
      aaaNormal: false,
      aaaLarge: false,
      rating: "Fail",
    }
  }
}

/**
 * Return black or white text color for optimal readability over a given background
 */
export function getReadableTextColor(bgHex: string): "#000000" | "#ffffff" {
  try {
    const contrastWhite = chroma.contrast(bgHex, "#ffffff")
    const contrastBlack = chroma.contrast(bgHex, "#000000")
    return contrastWhite >= contrastBlack ? "#ffffff" : "#000000"
  } catch {
    return "#000000"
  }
}

function sRgbToY(rgb: [number, number, number]): number {
  const r = Math.pow(rgb[0] / 255, 2.4)
  const g = Math.pow(rgb[1] / 255, 2.4)
  const b = Math.pow(rgb[2] / 255, 2.4)
  return 0.2126729 * r + 0.7151522 * g + 0.072175 * b
}

/**
 * Calculate APCA Lc (Advanced Perceptual Contrast Algorithm - W3 0.0.98G)
 * Returns the absolute rounded contrast score (Lc) between text and background.
 */
export function calculateApca(textHex: string, bgHex: string): number {
  try {
    const validTxt = chroma.valid(textHex) ? textHex : "#000000"
    const validBg = chroma.valid(bgHex) ? bgHex : "#ffffff"
    const txtRgb = chroma(validTxt).rgb()
    const bgRgb = chroma(validBg).rgb()

    let yTxt = sRgbToY(txtRgb)
    let yBg = sRgbToY(bgRgb)

    // Soft clamp black
    const blkThrs = 0.022
    const blkClmp = 1.414
    if (yTxt <= blkThrs) yTxt += Math.pow(blkThrs - yTxt, blkClmp)
    if (yBg <= blkThrs) yBg += Math.pow(blkThrs - yBg, blkClmp)

    if (Math.abs(yBg - yTxt) < 0.0005) return 0

    let sapc = 0
    if (yBg > yTxt) {
      // dark text on light background
      sapc = (Math.pow(yBg, 0.56) - Math.pow(yTxt, 0.57)) * 1.14
      const lc = sapc < 0.1 ? 0 : (sapc - 0.027) * 100
      return Math.round(Math.abs(lc))
    } else {
      // light text on dark background
      sapc = (Math.pow(yBg, 0.65) - Math.pow(yTxt, 0.62)) * 1.14
      const lc = sapc > -0.1 ? 0 : (sapc + 0.027) * 100
      return Math.round(Math.abs(lc))
    }
  } catch {
    return 0
  }
}

/**
 * Format color into OKLCH CSS notation: oklch(L C H)
 */
export function formatOklch(hex: string): string {
  try {
    const [l, c, h] = chroma(hex).oklch()
    const safeH = isNaN(h) ? 0 : Math.round(h)
    return `oklch(${l.toFixed(3)} ${c.toFixed(3)} ${safeH})`
  } catch {
    return "oklch(0 0 0)"
  }
}

/**
 * Format color into HSL CSS notation: hsl(H, S%, L%)
 */
export function formatHsl(hex: string): string {
  try {
    const [h, s, l] = chroma(hex).hsl()
    const safeH = isNaN(h) ? 0 : Math.round(h)
    const safeS = Math.round((isNaN(s) ? 0 : s) * 100)
    const safeL = Math.round((isNaN(l) ? 0 : l) * 100)
    return `hsl(${safeH}, ${safeS}%, ${safeL}%)`
  } catch {
    return "hsl(0, 0%, 0%)"
  }
}
