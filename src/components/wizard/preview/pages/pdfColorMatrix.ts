import type { ColorSwatch } from "@/lib/colorUtils"
import {
  calculateApca,
  generateTonalShades,
  getReadableTextColor,
} from "@/lib/colorUtils"

export const SYSTEM_DEFAULT_COLORS = {
  primary: "#6366f1",
  secondary: "#0ea5e9",
  accent: "#10b981",
  neutral: "#18181b",
} as const

/**
 * Returns either "#000000" or "#ffffff" based on human perception
 * contrast score (APCA Lc) as used in color info modals.
 */
export function getPerceptualTextColor(bgHex: string): "#000000" | "#ffffff" {
  try {
    const whiteLc = Math.abs(calculateApca("#ffffff", bgHex))
    const blackLc = Math.abs(calculateApca("#000000", bgHex))
    return whiteLc >= blackLc ? "#ffffff" : "#000000"
  } catch {
    return getReadableTextColor(bgHex)
  }
}

export interface ResolvedPdfColors {
  primary: {
    hex: string
    shades: Record<string, string>
    readableText: "#000000" | "#ffffff"
  }
  secondary: {
    hex: string
    shades: Record<string, string>
    readableText: "#000000" | "#ffffff"
  }
  accent: {
    hex: string
    shades: Record<string, string>
    readableText: "#000000" | "#ffffff"
  }
}

/**
 * Resolves colors and 11-step tonal shades from the brand's color matrix.
 * Falls back to system default colors if not set.
 */
export function resolvePdfColorMatrix(
  colors?: ColorSwatch[]
): ResolvedPdfColors {
  const safeList = Array.isArray(colors) ? colors : []

  // If no colors provided, return system default colors
  if (safeList.length === 0) {
    const primaryShades = generateTonalShades(SYSTEM_DEFAULT_COLORS.primary)
    const secondaryShades = generateTonalShades(SYSTEM_DEFAULT_COLORS.secondary)
    const accentShades = generateTonalShades(SYSTEM_DEFAULT_COLORS.accent)

    return {
      primary: {
        hex: SYSTEM_DEFAULT_COLORS.primary,
        shades: primaryShades,
        readableText: getPerceptualTextColor(SYSTEM_DEFAULT_COLORS.primary),
      },
      secondary: {
        hex: SYSTEM_DEFAULT_COLORS.secondary,
        shades: secondaryShades,
        readableText: getPerceptualTextColor(SYSTEM_DEFAULT_COLORS.secondary),
      },
      accent: {
        hex: SYSTEM_DEFAULT_COLORS.accent,
        shades: accentShades,
        readableText: getPerceptualTextColor(SYSTEM_DEFAULT_COLORS.accent),
      },
    }
  }

  // 1. Primary Swatch
  const primarySwatch =
    safeList.find((c) => c.role === "primary") ??
    safeList.find((c) => c.role !== "neutral" && c.role !== "background") ??
    safeList[0]

  const primaryHex = primarySwatch.hex
  const primaryShades =
    Object.keys(primarySwatch.shades).length === 11
      ? primarySwatch.shades
      : generateTonalShades(primaryHex)

  // 2. Secondary Swatch
  const fallbackSecondary =
    safeList.length > 1 ? safeList[1] : primarySwatch

  const secondarySwatch =
    safeList.find((c) => c.role === "secondary") ??
    safeList.find(
      (c) =>
        c.role !== "primary" &&
        c.role !== "neutral" &&
        c.role !== "background" &&
        c.hex !== primaryHex
    ) ??
    fallbackSecondary

  const secondaryHex = secondarySwatch.hex
  const secondaryShades =
    Object.keys(secondarySwatch.shades).length === 11
      ? secondarySwatch.shades
      : generateTonalShades(secondaryHex)

  // 3. Accent Swatch
  const fallbackAccent =
    safeList.length > 2 ? safeList[2] : secondarySwatch

  const accentSwatch =
    safeList.find((c) => c.role === "accent") ??
    safeList.find(
      (c) =>
        c.role !== "primary" &&
        c.role !== "secondary" &&
        c.role !== "neutral" &&
        c.role !== "background"
    ) ??
    fallbackAccent

  const accentHex = accentSwatch.hex
  const accentShades =
    Object.keys(accentSwatch.shades).length === 11
      ? accentSwatch.shades
      : generateTonalShades(accentHex)

  return {
    primary: {
      hex: primaryHex,
      shades: primaryShades,
      readableText: getPerceptualTextColor(primaryHex),
    },
    secondary: {
      hex: secondaryHex,
      shades: secondaryShades,
      readableText: getPerceptualTextColor(secondaryHex),
    },
    accent: {
      hex: accentHex,
      shades: accentShades,
      readableText: getPerceptualTextColor(accentHex),
    },
  }
}

/**
 * Builds CSS custom variables for injection into A4PageFrame.
 */
export function getPdfColorVariables(
  resolved: ResolvedPdfColors
): Record<string, string> {
  const p300 = resolved.primary.shades["300"] || resolved.primary.hex
  const s300 = resolved.secondary.shades["300"] || resolved.secondary.hex
  const a300 = resolved.accent.shades["300"] || resolved.accent.hex

  return {
    "--pdf-primary": resolved.primary.hex,
    "--pdf-primary-fg": resolved.primary.readableText,
    "--pdf-secondary": resolved.secondary.hex,
    "--pdf-secondary-fg": resolved.secondary.readableText,
    "--pdf-accent": resolved.accent.hex,
    "--pdf-accent-fg": resolved.accent.readableText,

    "--pdf-matrix-p50":
      resolved.primary.shades["50"] || resolved.primary.hex,
    "--pdf-matrix-p100":
      resolved.primary.shades["100"] || resolved.primary.hex,
    "--pdf-matrix-p200":
      resolved.primary.shades["200"] || resolved.primary.hex,
    "--pdf-matrix-p300": p300,
    "--pdf-matrix-p300-fg": getPerceptualTextColor(p300),
    "--pdf-matrix-p500":
      resolved.primary.shades["500"] || resolved.primary.hex,

    "--pdf-matrix-s50":
      resolved.secondary.shades["50"] || resolved.secondary.hex,
    "--pdf-matrix-s100":
      resolved.secondary.shades["100"] || resolved.secondary.hex,
    "--pdf-matrix-s200":
      resolved.secondary.shades["200"] || resolved.secondary.hex,
    "--pdf-matrix-s300": s300,
    "--pdf-matrix-s300-fg": getPerceptualTextColor(s300),
    "--pdf-matrix-s500":
      resolved.secondary.shades["500"] || resolved.secondary.hex,

    "--pdf-matrix-a300": a300,
    "--pdf-matrix-a300-fg": getPerceptualTextColor(a300),
  }
}
