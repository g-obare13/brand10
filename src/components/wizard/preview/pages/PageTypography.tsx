import { Badge } from "@/components/ui/badge"
import type { PreviewStyleId } from "./A4PageFrame"
import { A4PageFrame } from "./A4PageFrame"
import { getPdfTheme } from "./pdfPageTheme"

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
  const theme = getPdfTheme(styleTheme)
  const isExpressive = theme.isExpressive
  const isSoftTactility = theme.isSoftTactility
  const isEditorial = theme.isEditorial

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
      id="page-typography"
      pageNumber={pageNumber}
      totalPages={totalPages}
      sectionNumber="04"
      sectionTitle="Typography & Modular Scale"
      brandName={brandName}
      styleTheme={styleTheme}
      displayFont={displayFamily}
      bodyFont={bodyFamily}
      monoFont={monoFamily}
      className={theme.pageFrame}
    >
      <div className="flex h-full flex-col justify-between py-6">
        {/* Title & Introduction */}
        <div className="space-y-3 pt-2">
          <div className="space-y-2">
            <h2 className={theme.title}>HEADINGS SCALE</h2>
            <div className={theme.accentBar} />
          </div>

          <p className={theme.introText}>
            The display heading system is anchored by a mathematical modular
            scale multiplier of ×{ratio.toFixed(3)}. Every step from H6 to H1
            expands geometrically to ensure authoritative hierarchy, harmonious
            contrast, and predictable responsive behavior.
          </p>
        </div>

        {/* Display Typeface Summary Card */}
        <div className="my-auto space-y-5 py-2">
          <div
            className={
              isExpressive
                ? "flex items-center justify-between rounded-xl border-2 border-black bg-white p-5 shadow-[4px_4px_0px_0px_#000]"
                : isSoftTactility
                  ? "flex items-center justify-between rounded-3xl border border-stone-200/70 bg-white/90 p-5 shadow-[6px_6px_16px_rgba(0,0,0,0.05),-4px_-4px_12px_rgba(255,255,255,0.9)]"
                  : isEditorial
                    ? "flex items-center justify-between rounded-none border-t border-b border-stone-300 bg-transparent p-4"
                    : "flex items-center justify-between rounded-xl border border-zinc-200 bg-zinc-50/50 p-4"
            }
          >
            <div className="space-y-0.5">
              <span
                className={
                  isExpressive
                    ? "font-mono text-xs font-black uppercase text-zinc-500"
                    : isSoftTactility
                      ? "text-xs font-semibold text-stone-500 uppercase tracking-wider"
                      : isEditorial
                        ? "font-mono text-[10px] uppercase tracking-widest text-stone-500"
                        : "text-xs font-semibold text-zinc-400 uppercase"
                }
              >
                Primary Display Typeface
              </span>
              <div
                className={
                  isExpressive
                    ? "text-2xl font-black uppercase text-black"
                    : isSoftTactility
                      ? "text-2xl font-semibold text-stone-900"
                      : isEditorial
                        ? "text-2xl font-bold text-stone-950"
                        : "text-2xl font-bold text-primary-900"
                }
                style={{ fontFamily: `"${displayFamily}", sans-serif` }}
              >
                {displayFamily}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <span
                  className={
                    isExpressive
                      ? "block font-mono text-xs font-black uppercase text-zinc-500"
                      : isSoftTactility
                        ? "block text-xs font-semibold text-stone-500 uppercase tracking-wider"
                        : isEditorial
                          ? "block font-mono text-[10px] uppercase tracking-widest text-stone-500"
                          : "block text-xs text-zinc-400 uppercase"
                  }
                >
                  Scale Multiplier
                </span>
                {isExpressive ? (
                  <Badge className={theme.badgeAmber}>
                    {getRatioName(ratio)}
                  </Badge>
                ) : isSoftTactility ? (
                  <Badge className={theme.badgePrimary}>
                    {getRatioName(ratio)}
                  </Badge>
                ) : isEditorial ? (
                  <Badge className={theme.badgeAmber}>
                    {getRatioName(ratio)}
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-xs">
                    {getRatioName(ratio)}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* H1 to H6 Modular Scale Ladder */}
          <div className="space-y-3">
            <div
              className={
                isExpressive
                  ? "flex items-center justify-between border-b-2 border-black pb-1.5 font-mono text-xs font-black uppercase text-black"
                  : isSoftTactility
                    ? "flex items-center justify-between border-b border-stone-200 pb-1.5 text-xs font-semibold text-stone-600 uppercase tracking-wider"
                    : isEditorial
                      ? "flex items-center justify-between border-b border-stone-400 pb-1.5 font-mono text-[10px] uppercase tracking-widest text-stone-600"
                      : "flex items-center justify-between border-b border-zinc-200 pb-1.5 text-xs text-zinc-400 uppercase"
              }
            >
              <span>Heading Level &amp; Tag</span>
              <span>Sample Specimen</span>
              <span>Font Size &amp; Line Height</span>
            </div>

            <div className={`space-y-3.5 divide-y ${isExpressive ? "divide-black/20" : "divide-zinc-100"}`}>
              {/* H1 */}
              <div className="flex items-baseline justify-between gap-4 pt-1">
                <div className={isExpressive ? "w-24 shrink-0 font-mono text-xs font-black text-black uppercase" : "w-24 shrink-0 text-xs font-bold text-zinc-400"}>
                  H1 Display
                </div>
                <div
                  className={isExpressive ? "min-w-0 flex-1 truncate font-black tracking-tight text-black" : "min-w-0 flex-1 truncate font-extrabold tracking-tight text-primary-900"}
                  style={{
                    fontFamily: `"${displayFamily}", sans-serif`,
                    fontSize: `${Math.min(h1Size, 38)}px`,
                    lineHeight: 1.1,
                  }}
                >
                  Architectural Precision at Planetary Scale
                </div>
                <div className={isExpressive ? "w-28 shrink-0 text-right font-mono text-xs font-bold text-black" : "w-28 shrink-0 text-right text-xs text-zinc-500"}>
                  {h1Size}px / 1.10
                </div>
              </div>

              {/* H2 */}
              <div className="flex items-baseline justify-between gap-4 pt-3">
                <div className={isExpressive ? "w-24 shrink-0 font-mono text-xs font-black text-black uppercase" : "w-24 shrink-0 text-xs font-bold text-zinc-400"}>
                  H2 Section
                </div>
                <div
                  className={isExpressive ? "min-w-0 flex-1 truncate font-black tracking-tight text-black" : "min-w-0 flex-1 truncate font-bold tracking-tight text-primary-900"}
                  style={{
                    fontFamily: `"${displayFamily}", sans-serif`,
                    fontSize: `${Math.min(h2Size, 30)}px`,
                    lineHeight: 1.15,
                  }}
                >
                  Engineered for Autonomous Velocity
                </div>
                <div className={isExpressive ? "w-28 shrink-0 text-right font-mono text-xs font-bold text-black" : "w-28 shrink-0 text-right text-xs text-zinc-500"}>
                  {h2Size}px / 1.15
                </div>
              </div>

              {/* H3 */}
              <div className="flex items-baseline justify-between gap-4 pt-3">
                <div className={isExpressive ? "w-24 shrink-0 font-mono text-xs font-black text-black uppercase" : "w-24 shrink-0 text-xs font-bold text-zinc-400"}>
                  H3 Module
                </div>
                <div
                  className={isExpressive ? "min-w-0 flex-1 truncate font-bold tracking-tight text-black" : "min-w-0 flex-1 truncate font-semibold tracking-tight text-primary-900"}
                  style={{
                    fontFamily: `"${displayFamily}", sans-serif`,
                    fontSize: `${Math.min(h3Size, 24)}px`,
                    lineHeight: 1.2,
                  }}
                >
                  Disciplined Structural Foundations for Teams
                </div>
                <div className={isExpressive ? "w-28 shrink-0 text-right font-mono text-xs font-bold text-black" : "w-28 shrink-0 text-right text-xs text-zinc-500"}>
                  {h3Size}px / 1.20
                </div>
              </div>

              {/* H4 */}
              <div className="flex items-baseline justify-between gap-4 pt-3">
                <div className={isExpressive ? "w-24 shrink-0 font-mono text-xs font-black text-black uppercase" : "w-24 shrink-0 text-xs font-bold text-zinc-400"}>
                  H4 Subsection
                </div>
                <div
                  className={isExpressive ? "min-w-0 flex-1 truncate font-bold text-black" : "min-w-0 flex-1 truncate font-semibold text-primary-900"}
                  style={{
                    fontFamily: `"${displayFamily}", sans-serif`,
                    fontSize: `${Math.min(h4Size, 20)}px`,
                    lineHeight: 1.25,
                  }}
                >
                  Coherent Systems for Enterprise Growth and Design
                </div>
                <div className={isExpressive ? "w-28 shrink-0 text-right font-mono text-xs font-bold text-black" : "w-28 shrink-0 text-right text-xs text-zinc-500"}>
                  {h4Size}px / 1.25
                </div>
              </div>

              {/* H5 */}
              <div className="flex items-baseline justify-between gap-4 pt-3">
                <div className={isExpressive ? "w-24 shrink-0 font-mono text-xs font-black text-black uppercase" : "w-24 shrink-0 text-xs font-bold text-zinc-400"}>
                  H5 Group
                </div>
                <div
                  className={isExpressive ? "min-w-0 flex-1 truncate font-bold text-black" : "min-w-0 flex-1 truncate font-medium text-primary-900"}
                  style={{
                    fontFamily: `"${displayFamily}", sans-serif`,
                    fontSize: `${Math.min(h5Size, 17)}px`,
                    lineHeight: 1.3,
                  }}
                >
                  Component Specifications and Typographic Token Mapping
                </div>
                <div className={isExpressive ? "w-28 shrink-0 text-right font-mono text-xs font-bold text-black" : "w-28 shrink-0 text-right text-xs text-zinc-500"}>
                  {h5Size}px / 1.30
                </div>
              </div>

              {/* H6 */}
              <div className="flex items-baseline justify-between gap-4 pt-3">
                <div className={isExpressive ? "w-24 shrink-0 font-mono text-xs font-black text-black uppercase" : "w-24 shrink-0 text-xs font-bold text-zinc-400"}>
                  H6 Minor
                </div>
                <div
                  className={isExpressive ? "min-w-0 flex-1 truncate font-bold text-black uppercase" : "min-w-0 flex-1 truncate font-medium text-primary-900"}
                  style={{
                    fontFamily: `"${displayFamily}", sans-serif`,
                    fontSize: `${Math.min(h6Size, 15)}px`,
                    lineHeight: 1.35,
                  }}
                >
                  Mathematical Coordinates and Perceptual Contrast Calculations
                </div>
                <div className={isExpressive ? "w-28 shrink-0 text-right font-mono text-xs font-bold text-black" : "w-28 shrink-0 text-right text-xs text-zinc-500"}>
                  {h6Size}px / 1.35
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Display Typography Standards (3 Columns) */}
        <div
          className={
            isExpressive
              ? "space-y-3 border-t-2 border-black pt-4"
              : isSoftTactility
                ? "space-y-3 border-t border-stone-200 pt-4"
                : isEditorial
                  ? "space-y-3 border-t border-stone-300 pt-4"
                  : "space-y-3 pt-5"
          }
        >
          <div className="flex items-center justify-between">
            <div
              className={
                isExpressive
                  ? "font-mono text-xs font-black uppercase text-black"
                  : isSoftTactility
                    ? "text-xs font-semibold uppercase text-stone-600 tracking-wider"
                    : isEditorial
                      ? "font-mono text-[10px] uppercase tracking-widest text-stone-500"
                      : "text-xs font-bold text-zinc-500 uppercase"
              }
            >
              Heading Hierarchy Standards
            </div>
            {isExpressive ? (
              <Badge className={theme.badgeLime}>Modular Principles</Badge>
            ) : isSoftTactility ? (
              <Badge className={theme.badgeSecondary}>Modular Principles</Badge>
            ) : isEditorial ? (
              <Badge className={theme.badgeLime}>Modular Principles</Badge>
            ) : (
              <span className="text-[11px] font-medium text-zinc-400">
                Modular Principles
              </span>
            )}
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div
              className={
                isExpressive
                  ? "space-y-1 rounded-xl border-2 border-black bg-white p-3 shadow-[3px_3px_0px_0px_#000]"
                  : isSoftTactility
                    ? "space-y-1 rounded-2xl border border-stone-200/60 bg-white/90 p-3 shadow-[3px_3px_8px_rgba(0,0,0,0.03)]"
                    : isEditorial
                      ? "space-y-1 border-l-2 border-stone-900 bg-transparent py-1.5 pl-3 pr-1"
                      : "space-y-1"
              }
            >
              <div
                className={
                  isExpressive
                    ? "text-xs font-black uppercase text-black"
                    : isSoftTactility
                      ? "text-xs font-semibold text-stone-900"
                      : isEditorial
                        ? "text-xs font-semibold text-stone-950"
                        : "text-xs font-bold text-primary-900"
                }
              >
                Geometric Ratio
              </div>
              <p
                className={
                  isExpressive
                    ? "text-[11px] font-medium text-zinc-700"
                    : isSoftTactility
                      ? "text-[11px] text-stone-600 font-normal leading-relaxed"
                      : isEditorial
                        ? "text-[11px] text-stone-600 leading-relaxed"
                        : "text-[11px] text-zinc-600"
                }
              >
                Each step size is calculated by raising the base size to the
                modular multiplier power, removing arbitrary choices.
              </p>
            </div>

            <div
              className={
                isExpressive
                  ? "space-y-1 rounded-xl border-2 border-black bg-white p-3 shadow-[3px_3px_0px_0px_#000]"
                  : isSoftTactility
                    ? "space-y-1 rounded-2xl border border-stone-200/60 bg-white/90 p-3 shadow-[3px_3px_8px_rgba(0,0,0,0.03)]"
                    : isEditorial
                      ? "space-y-1 border-l-2 border-stone-900 bg-transparent py-1.5 pl-3 pr-1"
                      : "space-y-1"
              }
            >
              <div
                className={
                  isExpressive
                    ? "text-xs font-black uppercase text-black"
                    : isSoftTactility
                      ? "text-xs font-semibold text-stone-900"
                      : isEditorial
                        ? "text-xs font-semibold text-stone-950"
                        : "text-xs font-bold text-primary-900"
                }
              >
                Proportional Leading
              </div>
              <p
                className={
                  isExpressive
                    ? "text-[11px] font-medium text-zinc-700"
                    : isSoftTactility
                      ? "text-[11px] text-stone-600 font-normal leading-relaxed"
                      : isEditorial
                        ? "text-[11px] text-stone-600 leading-relaxed"
                        : "text-[11px] text-zinc-600"
                }
              >
                Large display titles employ tighter line heights (1.10 to 1.20)
                to prevent visual fragmentation in multi-line titles.
              </p>
            </div>

            <div
              className={
                isExpressive
                  ? "space-y-1 rounded-xl border-2 border-black bg-white p-3 shadow-[3px_3px_0px_0px_#000]"
                  : isSoftTactility
                    ? "space-y-1 rounded-2xl border border-stone-200/60 bg-white/90 p-3 shadow-[3px_3px_8px_rgba(0,0,0,0.03)]"
                    : isEditorial
                      ? "space-y-1 border-l-2 border-stone-900 bg-transparent py-1.5 pl-3 pr-1"
                      : "space-y-1"
              }
            >
              <div
                className={
                  isExpressive
                    ? "text-xs font-black uppercase text-black"
                    : isSoftTactility
                      ? "text-xs font-semibold text-stone-900"
                      : isEditorial
                        ? "text-xs font-semibold text-stone-950"
                        : "text-xs font-bold text-primary-900"
                }
              >
                Tracking &amp; Spacing
              </div>
              <p
                className={
                  isExpressive
                    ? "text-[11px] font-medium text-zinc-700"
                    : isSoftTactility
                      ? "text-[11px] text-stone-600 font-normal leading-relaxed"
                      : isEditorial
                        ? "text-[11px] text-stone-600 leading-relaxed"
                        : "text-[11px] text-zinc-600"
                }
              >
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
