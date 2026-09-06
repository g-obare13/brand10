import { Badge } from "@/components/ui/badge"
import type { PreviewStyleId } from "./A4PageFrame"
import { A4PageFrame } from "./A4PageFrame"
import type { ColorSwatch } from "@/lib/colorUtils"
import {
  calculateApca,
  formatHsl,
  formatOklch,
  generateTonalShades,
  getReadableTextColor,
  getWcagContrast,
} from "@/lib/colorUtils"
import { getPdfTheme } from "./pdfPageTheme"
import chroma from "chroma-js"

interface PageColorInfoProps {
  brandName: string
  colors: ColorSwatch[]
  styleTheme: PreviewStyleId
  displayFont: string
  bodyFont: string
  monoFont: string
  pageNumber?: number
  totalPages?: number
}

const SHADE_KEYS = [
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

function findClosestShade(
  baseHex: string,
  shades: Record<string, string>
): string {
  try {
    let closestKey = "500"
    let minDelta = Infinity
    for (const [key, hex] of Object.entries(shades)) {
      const d = chroma.deltaE(baseHex, hex)
      if (d < minDelta) {
        minDelta = d
        closestKey = key
      }
    }
    return closestKey
  } catch {
    return "500"
  }
}

function getSwatchDisplayName(role: string, name?: string): string {
  if (name && name !== "Color" && !name.startsWith("Token")) return name
  switch (role) {
    case "primary":
      return "Primary Brand Color"
    case "secondary":
      return "Secondary Accent Color"
    case "accent":
      return "Accent Color"
    default:
      return "Brand Color"
  }
}

export function PageColorInfo({
  brandName,
  colors,
  styleTheme,
  displayFont,
  bodyFont,
  monoFont,
  pageNumber = 6,
  totalPages = 9,
}: PageColorInfoProps) {
  const theme = getPdfTheme(styleTheme)
  const isExpressive = theme.isExpressive
  const isSoftTactility = theme.isSoftTactility
  const isEditorial = theme.isEditorial

  // Select the single primary brand color for detailed metrics breakdown
  const dominantSwatches = colors.filter(
    (c) => c.role !== "neutral" && c.role !== "background"
  )
  const swatch = dominantSwatches.find((c) => c.role === "primary") ||
    dominantSwatches[0] ||
    colors[0] || {
      id: "primary",
      role: "primary" as const,
      name: "Primary Brand Color",
      hex: "#6366f1",
      rgb: { r: 99, g: 102, b: 241 },
      cmyk: { c: 59, m: 58, y: 0, k: 5 },
      hsl: { h: 239, s: 84, l: 67 },
      shades: generateTonalShades("#6366f1"),
    }

  const safeShades =
    Object.keys(swatch.shades).length === 11
      ? swatch.shades
      : generateTonalShades(swatch.hex)
  const closestShade = findClosestShade(swatch.hex, safeShades)
  const label = getSwatchDisplayName(swatch.role, swatch.name)

  return (
    <A4PageFrame
      id="page-color-info"
      pageNumber={pageNumber}
      totalPages={totalPages}
      sectionNumber="03"
      sectionTitle="Color Information & Metrics"
      brandName={brandName}
      styleTheme={styleTheme}
      displayFont={displayFont}
      bodyFont={bodyFont}
      monoFont={monoFont}
      className={theme.pageFrame}
      colors={colors}
    >
      <div className="flex h-full flex-col justify-between py-6">
        {/* Title & Introduction */}
        <div className="space-y-3 pt-2">
          <div className="space-y-2">
            <h2 className={theme.title}> COLOR METRICS</h2>
            <div className={theme.accentBar} />
          </div>

          <p className={theme.introText}>
            Comprehensive colorimetry data and perceptual contrast ratings
            across all 11 tonal steps. Computed using modern OKLCH color space
            coordinates and the Advanced Perceptual Contrast Algorithm (APCA
            Lc).
          </p>
        </div>

        {/* Primary Colorimetry Table */}
        <div className="my-auto space-y-4 py-2">
          <div className="space-y-2.5">
            {/* Header: Label, Role Badge & Hex */}
            <div className="flex items-center justify-between pb-1">
              <div className="flex items-center gap-2.5">
                <span
                  className={
                    isExpressive
                      ? "text-base font-black uppercase text-black"
                      : isSoftTactility
                        ? "text-base font-semibold text-stone-900"
                        : isEditorial
                          ? "text-base font-bold text-stone-950"
                          : "text-base font-bold text-primary-900"
                  }
                >
                  {label}
                </span>
                {isExpressive ? (
                  <Badge className={theme.badgeAmber}>
                    {swatch.role}
                  </Badge>
                ) : isSoftTactility ? (
                  <Badge className={theme.badgePrimary}>
                    {swatch.role}
                  </Badge>
                ) : isEditorial ? (
                  <Badge className={theme.badgeOutline}>
                    {swatch.role}
                  </Badge>
                ) : (
                  <Badge className={theme.badgeOutline}>
                    {swatch.role}
                  </Badge>
                )}
              </div>
              {isExpressive ? (
                <Badge className={theme.badgeLime}>
                  BASE: {swatch.hex}
                </Badge>
              ) : isSoftTactility ? (
                <Badge className={theme.badgeSecondary}>
                  BASE: {swatch.hex}
                </Badge>
              ) : isEditorial ? (
                <span className="font-mono text-xs uppercase tracking-widest text-stone-600">
                  Base Mark Hue: {swatch.hex}
                </span>
              ) : (
                <span className="font-mono text-xs font-semibold text-zinc-500 uppercase">
                  Base Mark Hue: {swatch.hex}
                </span>
              )}
            </div>

            {/* Tabular Matrix */}
            <div
              className={
                isExpressive
                  ? "overflow-hidden rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_#000]"
                  : isSoftTactility
                    ? "overflow-hidden rounded-3xl border border-stone-200/80 bg-white/90 shadow-[6px_6px_16px_rgba(0,0,0,0.05),-4px_-4px_12px_rgba(255,255,255,0.9)]"
                    : isEditorial
                      ? "overflow-hidden rounded-none border-t border-b border-stone-300 bg-transparent"
                      : "overflow-hidden border-y border-zinc-200"
              }
            >
              <table className="w-full text-left font-mono">
                <thead>
                  <tr
                    className={
                      isExpressive
                        ? "border-b-2 border-black bg-black text-[10px] font-black uppercase text-white"
                        : isSoftTactility
                          ? "border-b border-stone-200 bg-stone-100/70 text-[10px] font-semibold text-stone-700"
                          : isEditorial
                            ? "border-b border-stone-400 bg-stone-100/40 text-[10px] font-mono uppercase tracking-widest text-stone-800"
                            : "border-b border-zinc-200 bg-zinc-50 text-[10px] font-semibold text-zinc-600"
                    }
                  >
                    <th className="px-3 py-2">#</th>
                    <th className="px-2 py-2">Swatch</th>
                    <th className="px-3 py-2">HEX</th>
                    <th className="px-3 py-2">OKLCH</th>
                    <th className="px-3 py-2">HSL</th>
                    <th className="px-3 py-2">APCA Lc (Dark / Light)</th>
                    <th className="px-3 py-2 text-right">WCAG vs White</th>
                  </tr>
                </thead>
                <tbody
                  className={
                    isExpressive
                      ? "divide-y divide-black/20"
                      : isSoftTactility
                        ? "divide-y divide-stone-100"
                        : isEditorial
                          ? "divide-y divide-stone-200"
                          : "divide-y divide-zinc-100"
                  }
                >
                  {SHADE_KEYS.map((step) => {
                    const shadeHex = safeShades[step] || swatch.hex
                    const isBase = step === closestShade
                    const oklchStr = formatOklch(shadeHex)
                    const hslStr = formatHsl(shadeHex)
                    const shadeOnBlack = calculateApca(shadeHex, "#000000")
                    const shadeOnWhite = calculateApca(shadeHex, "#ffffff")
                    const wcagWhite = getWcagContrast(shadeHex, "#ffffff")
                    const pillTextColor = getReadableTextColor(shadeHex)

                    return (
                      <tr
                        key={step}
                        className={`transition-colors ${
                          isBase
                            ? isExpressive
                              ? "pdf-tint-expressive-row font-bold"
                              : isSoftTactility
                                ? "bg-stone-100/80 font-bold"
                                : isEditorial
                                  ? "bg-stone-200/50 font-bold"
                                  : "bg-zinc-50/80 font-bold"
                            : ""
                        }`}
                      >
                        {/* Step Number */}
                        <td className="px-3 py-2 text-[11px] text-zinc-800">
                          <span className="flex items-center gap-1.5">
                            {step}
                            {isBase ? (
                              <span
                                className={
                                  isExpressive
                                    ? "size-2 rounded-full bg-black"
                                    : isSoftTactility
                                      ? "size-1.5 rounded-full bg-stone-800"
                                      : isEditorial
                                        ? "size-1.5 rounded-none bg-stone-950"
                                        : "size-1.5 rounded-full bg-primary-900"
                                }
                              />
                            ) : null}
                          </span>
                        </td>

                        {/* Color Chip */}
                        <td className="px-2 py-2">
                          <div
                            className={
                              isExpressive
                                ? "h-4 w-7 rounded-xs border border-black shadow-[1px_1px_0px_0px_#000]"
                                : isSoftTactility
                                  ? "h-4 w-7 rounded-xs border border-stone-300 shadow-2xs"
                                  : isEditorial
                                    ? "h-4 w-7 rounded-none border border-stone-400"
                                    : "h-4 w-7 rounded-xs border border-primary-900/10 shadow-2xs"
                            }
                            style={{ backgroundColor: shadeHex }}
                          />
                        </td>

                        {/* Hex */}
                        <td className="px-3 py-2 text-[11px] text-zinc-900 uppercase">
                          {shadeHex}
                        </td>

                        {/* OKLCH */}
                        <td className="px-3 py-2 text-[10px] text-zinc-600">
                          {oklchStr}
                        </td>

                        {/* HSL */}
                        <td className="px-3 py-2 text-[10px] text-zinc-600">
                          {hslStr}
                        </td>

                        {/* APCA Lc */}
                        <td className="px-3 py-2">
                          <div className="flex items-center gap-1.5 text-[10px]">
                            <span
                              className={
                                isExpressive
                                  ? "inline-block rounded-xs border border-black px-1.5 py-0.5 text-center font-black shadow-[1px_1px_0px_0px_#000]"
                                  : isSoftTactility
                                    ? "inline-block rounded-xs border border-stone-200/80 px-1.5 py-0.5 text-center font-bold"
                                    : isEditorial
                                      ? "inline-block rounded-none border border-stone-400 px-1.5 py-0.5 text-center font-bold"
                                      : "inline-block rounded-xs px-1.5 py-0.5 text-center font-bold"
                              }
                              style={{
                                backgroundColor: shadeHex,
                                color: pillTextColor,
                              }}
                            >
                              {shadeOnBlack}
                            </span>
                            <span className="text-zinc-400">/</span>
                            <span className="text-zinc-700">
                              {shadeOnWhite}
                            </span>
                          </div>
                        </td>

                        {/* WCAG Ratio & Rating */}
                        <td className="px-3 py-2 text-right text-[11px]">
                          <span className="font-semibold text-zinc-800">
                            {wcagWhite.ratio.toFixed(1)}:1
                          </span>{" "}
                          <Badge
                            variant={
                              isExpressive
                                ? "default"
                                : wcagWhite.rating === "Fail"
                                  ? "destructive"
                                  : "default"
                            }
                            className={
                              isExpressive
                                ? theme.badgeLime
                                : isSoftTactility
                                  ? "rounded-full border border-stone-200 bg-stone-100 px-2 py-0.5 text-[9px] font-mono font-semibold text-stone-800"
                                  : isEditorial
                                    ? "rounded-none border border-stone-400 bg-transparent px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-stone-800"
                                    : "rounded-full"
                            }
                          >
                            {wcagWhite.rating}
                          </Badge>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Notice to access additional color metrics from export assets */}
          <div
            className={
              isExpressive
                ? "flex items-center justify-between rounded-lg border-2 border-black pdf-tint-expressive-primary p-3 shadow-[2px_2px_0px_0px_#000]"
                : isSoftTactility
                  ? "flex items-center justify-between rounded-2xl border border-stone-200/80 bg-stone-50/80 p-3"
                  : isEditorial
                    ? "flex items-center justify-between border-t border-stone-300 pt-3"
                    : "flex items-center justify-between"
            }
          >
            <p
              className={
                isExpressive
                  ? "text-xs font-medium text-black"
                  : isSoftTactility
                    ? "text-xs text-stone-600 font-normal leading-relaxed"
                    : isEditorial
                      ? "text-xs text-stone-600 leading-relaxed"
                      : "text-sm text-zinc-600"
              }
            >
              For complete colorimetry breakdowns, CSS variables, and raw design
              tokens for all secondary and supporting swatches, please access
              them directly via the exported brand asset pack.
            </p>
          </div>
        </div>
      </div>
    </A4PageFrame>
  )
}
