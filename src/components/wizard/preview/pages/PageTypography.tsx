import { Badge } from "@/components/ui/badge"
import type { PreviewStyleId } from "./A4PageFrame"
import { A4PageFrame } from "./A4PageFrame"

interface PageTypographyProps {
  brandName: string
  displayFont: string
  bodyFont: string
  monoFont: string
  typeScaleRatio: number
  baseFontSize?: number
  styleTheme: PreviewStyleId
  pageNumber?: number
  totalPages?: number
}

function getRatioName(ratio: number): string {
  if (ratio >= 1.414) return "Augmented Fourth (1.414)"
  if (ratio >= 1.333) return "Perfect Fourth (1.333)"
  if (ratio >= 1.25) return "Major Third (1.250)"
  if (ratio >= 1.2) return "Minor Third (1.200)"
  return "Major Second (1.125)"
}

export function PageTypography({
  brandName,
  displayFont,
  bodyFont,
  monoFont,
  typeScaleRatio,
  baseFontSize = 16,
  styleTheme,
  pageNumber = 7,
  totalPages = 10,
}: PageTypographyProps) {
  const displayFamily = displayFont || "Plus Jakarta Sans"
  const bodyFamily = bodyFont || "Inter"
  const monoFamily = monoFont || "JetBrains Mono"

  const ratio = typeScaleRatio || 1.25
  const baseSize = baseFontSize || 16

  // Proportional modular scale steps
  const h1Size = Math.round(baseSize * Math.pow(ratio, 4))
  const h2Size = Math.round(baseSize * Math.pow(ratio, 3))
  const h3Size = Math.round(baseSize * Math.pow(ratio, 2))
  const h4Size = Math.round(baseSize * Math.pow(ratio, 1.5))
  const h5Size = Math.round(baseSize * Math.pow(ratio, 1))
  const h6Size = Math.round(baseSize * Math.pow(ratio, 0.5))

  return (
    <A4PageFrame
      id="page-typography-headings"
      pageNumber={pageNumber}
      totalPages={totalPages}
      sectionNumber="04"
      sectionTitle="Typography & Modular Scale"
      brandName={brandName}
      styleTheme={styleTheme}
      displayFont={displayFamily}
      bodyFont={bodyFamily}
      monoFont={monoFamily}
      className="overflow-hidden border border-zinc-200 bg-white p-12 text-black shadow-2xl"
    >
      <div className="flex h-full flex-col justify-between py-6">
        {/* Title & Introduction */}
        <div className="space-y-3 pt-2">
          <div className="space-y-2">
            <h2 className="text-4xl font-bold text-black uppercase sm:text-5xl">
              HEADINGS SCALE
            </h2>
            <div className="h-0.5 w-16 bg-black" />
          </div>

          <p className="max-w-xl text-zinc-600">
            The display heading system is anchored by a mathematical modular
            scale multiplier of ×{ratio.toFixed(3)}. Every step from H6 to H1
            expands geometrically to ensure authoritative hierarchy, harmonious
            contrast, and predictable responsive behavior.
          </p>
        </div>

        {/* Display Typeface Summary Card */}
        <div className="my-auto space-y-5 py-2">
          <div className="flex items-center justify-between rounded-xl border border-zinc-200 bg-zinc-50/50 p-4">
            <div className="space-y-0.5">
              <span className="font-mono text-[10px] font-semibold text-zinc-400 uppercase">
                Primary Display Typeface
              </span>
              <div
                className="text-2xl font-bold text-black"
                style={{ fontFamily: `"${displayFamily}", sans-serif` }}
              >
                {displayFamily}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="block font-mono text-[10px] text-zinc-400 uppercase">
                  Scale Multiplier
                </span>
                <span className="font-mono text-xs font-bold text-zinc-800">
                  ×{ratio.toFixed(3)}
                </span>
              </div>
              <Badge variant="outline" className="text-xs">
                {getRatioName(ratio)}
              </Badge>
            </div>
          </div>

          {/* H1 to H6 Modular Scale Ladder */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-zinc-200 pb-1.5 font-mono text-[10px] text-zinc-400 uppercase">
              <span>Heading Level &amp; Tag</span>
              <span>Sample Specimen</span>
              <span>Font Size &amp; Line Height</span>
            </div>

            <div className="space-y-3.5 divide-y divide-zinc-100">
              {/* H1 */}
              <div className="flex items-baseline justify-between gap-4 pt-1">
                <div className="w-24 shrink-0 font-mono text-xs font-bold text-zinc-400">
                  H1 Display
                </div>
                <div
                  className="min-w-0 flex-1 truncate font-extrabold tracking-tight text-black"
                  style={{
                    fontFamily: `"${displayFamily}", sans-serif`,
                    fontSize: `${Math.min(h1Size, 38)}px`,
                    lineHeight: 1.1,
                  }}
                >
                  Architectural Precision at Planetary Scale
                </div>
                <div className="w-28 shrink-0 text-right font-mono text-xs text-zinc-500">
                  {h1Size}px / 1.10
                </div>
              </div>

              {/* H2 */}
              <div className="flex items-baseline justify-between gap-4 pt-3">
                <div className="w-24 shrink-0 font-mono text-xs font-bold text-zinc-400">
                  H2 Section
                </div>
                <div
                  className="min-w-0 flex-1 truncate font-bold tracking-tight text-black"
                  style={{
                    fontFamily: `"${displayFamily}", sans-serif`,
                    fontSize: `${Math.min(h2Size, 30)}px`,
                    lineHeight: 1.15,
                  }}
                >
                  Engineered for Autonomous Velocity
                </div>
                <div className="w-28 shrink-0 text-right font-mono text-xs text-zinc-500">
                  {h2Size}px / 1.15
                </div>
              </div>

              {/* H3 */}
              <div className="flex items-baseline justify-between gap-4 pt-3">
                <div className="w-24 shrink-0 font-mono text-xs font-bold text-zinc-400">
                  H3 Module
                </div>
                <div
                  className="min-w-0 flex-1 truncate font-semibold tracking-tight text-black"
                  style={{
                    fontFamily: `"${displayFamily}", sans-serif`,
                    fontSize: `${Math.min(h3Size, 24)}px`,
                    lineHeight: 1.2,
                  }}
                >
                  Disciplined Structural Foundations for Teams
                </div>
                <div className="w-28 shrink-0 text-right font-mono text-xs text-zinc-500">
                  {h3Size}px / 1.20
                </div>
              </div>

              {/* H4 */}
              <div className="flex items-baseline justify-between gap-4 pt-3">
                <div className="w-24 shrink-0 font-mono text-xs font-bold text-zinc-400">
                  H4 Subsection
                </div>
                <div
                  className="min-w-0 flex-1 truncate font-semibold text-black"
                  style={{
                    fontFamily: `"${displayFamily}", sans-serif`,
                    fontSize: `${Math.min(h4Size, 20)}px`,
                    lineHeight: 1.25,
                  }}
                >
                  Coherent Systems for Enterprise Growth and Design
                </div>
                <div className="w-28 shrink-0 text-right font-mono text-xs text-zinc-500">
                  {h4Size}px / 1.25
                </div>
              </div>

              {/* H5 */}
              <div className="flex items-baseline justify-between gap-4 pt-3">
                <div className="w-24 shrink-0 font-mono text-xs font-bold text-zinc-400">
                  H5 Group
                </div>
                <div
                  className="min-w-0 flex-1 truncate font-medium text-black"
                  style={{
                    fontFamily: `"${displayFamily}", sans-serif`,
                    fontSize: `${Math.min(h5Size, 17)}px`,
                    lineHeight: 1.3,
                  }}
                >
                  Component Specifications and Typographic Token Mapping
                </div>
                <div className="w-28 shrink-0 text-right font-mono text-xs text-zinc-500">
                  {h5Size}px / 1.30
                </div>
              </div>

              {/* H6 */}
              <div className="flex items-baseline justify-between gap-4 pt-3">
                <div className="w-24 shrink-0 font-mono text-xs font-bold text-zinc-400">
                  H6 Minor
                </div>
                <div
                  className="min-w-0 flex-1 truncate font-medium text-black"
                  style={{
                    fontFamily: `"${displayFamily}", sans-serif`,
                    fontSize: `${Math.min(h6Size, 15)}px`,
                    lineHeight: 1.35,
                  }}
                >
                  Mathematical Coordinates and Perceptual Contrast Calculations
                </div>
                <div className="w-28 shrink-0 text-right font-mono text-xs text-zinc-500">
                  {h6Size}px / 1.35
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Display Typography Standards (3 Columns) */}
        <div className="space-y-3 pt-5">
          <div className="flex items-center justify-between">
            <div className="text-xs font-bold text-zinc-500 uppercase">
              Heading Hierarchy Standards
            </div>
            <span className="text-[11px] font-medium text-zinc-400">
              Modular Principles
            </span>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1">
              <div className="text-xs font-bold text-black">
                Geometric Ratio
              </div>
              <p className="text-[11px] text-zinc-600">
                Each step size is calculated by raising the base size to the
                modular multiplier power, removing arbitrary choices.
              </p>
            </div>

            <div className="space-y-1">
              <div className="text-xs font-bold text-black">
                Proportional Leading
              </div>
              <p className="text-[11px] text-zinc-600">
                Large display titles employ tighter line heights (1.10 to 1.20) to
                prevent visual fragmentation in multi-line titles.
              </p>
            </div>

            <div className="space-y-1">
              <div className="text-xs font-bold text-black">
                Tracking &amp; Spacing
              </div>
              <p className="text-[11px] text-zinc-600">
                Display sizes utilize slight negative letter-spacing (-0.02em)
                for a cohesive, editorial, and commanding presence.
              </p>
            </div>
          </div>
        </div>
      </div>
    </A4PageFrame>
  )
}
