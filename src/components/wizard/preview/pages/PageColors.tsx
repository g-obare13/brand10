import { Badge } from "@/components/ui/badge"
import type { PreviewStyleId } from "./A4PageFrame"
import { A4PageFrame } from "./A4PageFrame"
import type { ColorSwatch } from "@/lib/colorUtils"
import { generateTonalShades } from "@/lib/colorUtils"
import chroma from "chroma-js"

interface PageColorsProps {
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

function getCardTextColor(shadeHex: string, darkestShadeHex: string): string {
  try {
    const lum = chroma(shadeHex).luminance()
    if (lum > 0.42) {
      return chroma(darkestShadeHex).darken(0.3).hex()
    }
    return "#ffffff"
  } catch {
    return "#ffffff"
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

export function PageColors({
  brandName,
  colors,
  styleTheme,
  displayFont,
  bodyFont,
  monoFont,
  pageNumber = 5,
  totalPages = 8,
}: PageColorsProps) {
  // Use exact dominant brand colors from step colors (filtering out neutral and background)
  const dominantSwatches = colors.filter(
    (c) => c.role !== "neutral" && c.role !== "background"
  )
  const displaySwatches =
    dominantSwatches.length > 0
      ? dominantSwatches
      : colors.length > 0
        ? colors.slice(0, 2)
        : [
            {
              id: "primary",
              role: "primary" as const,
              name: "Primary Brand Color",
              hex: "#6366f1",
              rgb: { r: 99, g: 102, b: 241 },
              cmyk: { c: 59, m: 58, y: 0, k: 5 },
              hsl: { h: 239, s: 84, l: 67 },
              shades: generateTonalShades("#6366f1"),
            },
            {
              id: "secondary",
              role: "secondary" as const,
              name: "Secondary Accent Color",
              hex: "#06b6d4",
              rgb: { r: 6, g: 182, b: 212 },
              cmyk: { c: 97, m: 14, y: 0, k: 17 },
              hsl: { h: 189, s: 94, l: 43 },
              shades: generateTonalShades("#06b6d4"),
            },
          ]

  return (
    <A4PageFrame
      id="page-colors"
      pageNumber={pageNumber}
      totalPages={totalPages}
      sectionNumber="03"
      sectionTitle="Color Palette & Harmony"
      brandName={brandName}
      styleTheme={styleTheme}
      displayFont={displayFont}
      bodyFont={bodyFont}
      monoFont={monoFont}
      className="overflow-hidden border border-zinc-200 bg-white p-12 text-black shadow-2xl"
    >
      <div className="flex h-full flex-col justify-between py-6">
        {/* Title & Introduction */}
        <div className="space-y-3 pt-2">
          <div className="space-y-2">
            <h2 className="text-4xl font-bold text-black uppercase sm:text-5xl">
              COLOR PALETTE
            </h2>
            <div className="h-0.5 w-16 bg-black" />
          </div>

          <p className="max-w-xl text-zinc-600">
            The core chromatic system extracted from the brandmark geometry.
            Each dominant color is expanded into an 11-step mathematical tonal scale
            to ensure contrast accessibility and consistent visual hierarchy.
          </p>
        </div>

        {/* Dominant Color Tonal Scales (Mirroring StepColorsPreview) */}
        <div className="my-auto space-y-7 py-2">
          {displaySwatches.map((swatch) => {
            const safeShades =
              Object.keys(swatch.shades).length === 11
                ? swatch.shades
                : generateTonalShades(swatch.hex)
            const closestShade = findClosestShade(swatch.hex, safeShades)
            const darkestShade =
              safeShades["950"] || safeShades["900"] || "#000000"
            const label = getSwatchDisplayName(swatch.role, swatch.name)

            return (
              <div key={swatch.id} className="space-y-3">
                {/* Header: Label, Role Badge & Hex */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="text-base font-semibold text-black">
                      {label}
                    </span>
                    <Badge variant="outline" className="rounded-full">
                      {swatch.role}
                    </Badge>
                  </div>
                  <span className="font-mono text-xs font-bold text-zinc-500 uppercase">
                    Base: {swatch.hex}
                  </span>
                </div>

                {/* 11-Step Tonal Cards Row */}
                <div className="grid grid-cols-11 gap-1.5">
                  {SHADE_KEYS.map((step) => {
                    const shadeHex = safeShades[step] || swatch.hex
                    const isBase = step === closestShade
                    const textColor = getCardTextColor(shadeHex, darkestShade)
                    const cleanHex = shadeHex.replace("#", "").toUpperCase()

                    return (
                      <div
                        key={step}
                        className="relative flex min-h-24 flex-col justify-between rounded-xl p-2 text-left"
                        style={{ backgroundColor: shadeHex }}
                      >
                        {/* Active Base Indicator Dot */}
                        <div className="flex h-3 items-center">
                          {isBase ? (
                            <div
                              className="size-1.5 rounded-full"
                              style={{ backgroundColor: textColor }}
                            />
                          ) : null}
                        </div>

                        {/* Step Number & Hex */}
                        <div className="space-y-0.5">
                          <span
                            className="block font-mono text-xs font-bold"
                            style={{ color: textColor }}
                          >
                            {step}
                          </span>
                          <span
                            className="block font-mono text-[9px] font-medium uppercase"
                            style={{ color: textColor }}
                          >
                            {cleanHex}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>

        {/* Chromatic Specifications */}
        <div className="space-y-3 pt-5">
          <div className="flex items-center justify-between">
            <div className="text-xs font-bold text-zinc-500 uppercase">
              Chromatic Specifications
            </div>
            <span className="text-[11px] font-medium text-zinc-400">
              Scale Distribution
            </span>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1">
              <div className="text-xs font-bold text-black">
                Contrast Compliance
              </div>
              <p className="text-[11px] text-zinc-600">
                Ensure minimum 4.5:1 contrast against background values for all
                body copy and text elements.
              </p>
            </div>

            <div className="space-y-1">
              <div className="text-xs font-bold text-black">
                Tonal Interpolation
              </div>
              <p className="text-[11px] text-zinc-600">
                Step values from 50 (light surface tint) to 950 (deep shadow tone)
                provide seamless dark and light modes.
              </p>
            </div>

            <div className="space-y-1">
              <div className="text-xs font-bold text-black">
                Dominant Hierarchy
              </div>
              <p className="text-[11px] text-zinc-600">
                Primary hue anchors brand awareness across main interactive
                touchpoints and primary surfaces.
              </p>
            </div>
          </div>
        </div>
      </div>
    </A4PageFrame>
  )
}
