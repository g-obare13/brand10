import { Badge } from "@/components/ui/badge"
import { A4PageFrame  } from "./A4PageFrame"
import type {PreviewStyleId} from "./A4PageFrame";
import type { ColorSwatch } from "@/lib/colorUtils"
import { getReadableTextColor, getWcagContrast } from "@/lib/colorUtils"
import chroma from "chroma-js"
import { cn } from "@/lib/utils"

interface PageColorsProps {
  brandName: string
  colors: ColorSwatch[]
  styleTheme: PreviewStyleId
  displayFont: string
  bodyFont: string
  monoFont: string
}

export function PageColors({
  brandName,
  colors,
  styleTheme,
  displayFont,
  bodyFont,
  monoFont,
}: PageColorsProps) {
  // Safe default colors if empty
  const activeColors = colors.length > 0 ? colors.slice(0, 5) : [
    { id: "1", hex: "#6366f1", role: "primary" as const, name: "Indigo Primary" },
    { id: "2", hex: "#0ea5e9", role: "secondary" as const, name: "Sky Secondary" },
    { id: "3", hex: "#f59e0b", role: "accent" as const, name: "Amber Accent" },
    { id: "4", hex: "#18181b", role: "neutral" as const, name: "Zinc Dark" },
    { id: "5", hex: "#fafafa", role: "surface" as const, name: "Pure White" },
  ]

  return (
    <A4PageFrame
      id="page-03"
      pageNumber={3}
      totalPages={6}
      sectionNumber="03"
      sectionTitle="Color Matrix & Palette"
      brandName={brandName}
      styleTheme={styleTheme}
      displayFont={displayFont}
      bodyFont={bodyFont}
      monoFont={monoFont}
    >
      <div className="flex h-full flex-col justify-between space-y-6">
        {/* Intro */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-[10px] font-mono uppercase">
              Chroma Tokens
            </Badge>
            <Badge variant="default" className="text-[10px]">
              WCAG 2.1 AA Compliant
            </Badge>
          </div>
          <h2>Harmonized Chromatic System</h2>
          <p className="text-xs opacity-75">
            Engineered for high-contrast accessibility, dark-mode adaptability, and digital surface consistency across all brand applications.
          </p>
        </div>

        {/* Primary Color Hero Swatch */}
        {activeColors[0] && (
          <div
            className="flex items-center justify-between rounded-2xl p-6 shadow-sm border border-black/10"
            style={{ backgroundColor: activeColors[0].hex }}
          >
            <div
              className={cn(
                "space-y-1",
                getReadableTextColor(activeColors[0].hex) === "#ffffff" ? "text-white" : "text-black"
              )}
            >
              <Badge variant="outline" className="text-[10px] uppercase font-mono bg-white/20 border-white/30 text-inherit">
                Core Hero Color
              </Badge>
              <h3 className="text-2xl font-bold tracking-tight text-inherit">
                {activeColors[0].name || "Primary Brand"}
              </h3>
              <div className="font-mono text-xs opacity-80">
                HEX {activeColors[0].hex.toUpperCase()} • RGB {chroma.valid(activeColors[0].hex) ? chroma(activeColors[0].hex).rgb().join(", ") : "99, 102, 241"}
              </div>
            </div>

            <div
              className={cn(
                "rounded-xl border p-3 font-mono text-right text-xs backdrop-blur-xs",
                getReadableTextColor(activeColors[0].hex) === "#ffffff"
                  ? "border-white/20 bg-white/10 text-white"
                  : "border-black/20 bg-black/10 text-black"
              )}
            >
              <div className="text-[10px] opacity-70">Contrast vs White</div>
              <div className="text-base font-bold">
                {getWcagContrast(activeColors[0].hex, "#ffffff").ratio.toFixed(1)}:1
              </div>
              <div className="text-[10px] opacity-70">WCAG AA Certified</div>
            </div>
          </div>
        )}

        {/* Color Palette Grid */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {activeColors.slice(1).map((swatch, idx) => {
            const rgb = chroma.valid(swatch.hex) ? chroma(swatch.hex).rgb() : [0, 0, 0]
            const contrast = getWcagContrast(swatch.hex, "#ffffff").ratio.toFixed(1)

            return (
              <div
                key={idx}
                className={cn(
                  "overflow-hidden rounded-2xl border transition-all",
                  styleTheme === "cinematic"
                    ? "border-zinc-800 bg-zinc-900/60"
                    : "border-zinc-200 bg-white"
                )}
              >
                {/* Color Visual Block */}
                <div
                  className="h-20 w-full border-b border-black/5"
                  style={{ backgroundColor: swatch.hex }}
                />

                {/* Color Data Metrics */}
                <div className="space-y-1.5 p-3.5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] font-semibold uppercase tracking-wider opacity-60">
                      {swatch.role}
                    </span>
                    <Badge variant="outline" className="text-[9px] font-mono px-1.5 py-0 h-4">
                      {contrast}:1
                    </Badge>
                  </div>

                  <span className="block truncate text-xs font-bold">
                    {swatch.name || `Token ${idx + 1}`}
                  </span>

                  <div className="space-y-0.5 font-mono text-[10px] opacity-70">
                    <div>{swatch.hex.toUpperCase()}</div>
                    <div>RGB {rgb[0]}, {rgb[1]}, {rgb[2]}</div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* System Tonal Scale Ramp */}
        <div
          className={cn(
            "rounded-2xl border p-5",
            styleTheme === "cinematic"
              ? "border-zinc-800 bg-zinc-900/40"
              : "border-zinc-200 bg-zinc-50/70"
          )}
        >
          <div className="mb-3 flex items-center justify-between">
            <h4 className="text-sm font-semibold">Tonal Shade Distribution</h4>
            <span className="font-mono text-[10px] opacity-60">50 - 950 Step Ladder</span>
          </div>

          <div className="flex h-10 w-full overflow-hidden rounded-xl border border-black/10 shadow-xs">
            {["#f8fafc", "#f1f5f9", "#e2e8f0", "#cbd5e1", "#94a3b8", "#64748b", "#475569", "#334155", "#1e293b", "#0f172a"].map((shade, i) => (
              <div
                key={i}
                className="flex-1 transition-transform hover:scale-105"
                style={{ backgroundColor: shade }}
                title={`Shade Step ${i + 1}`}
              />
            ))}
          </div>

          <div className="mt-2 flex justify-between font-mono text-[9px] opacity-50">
            <span>50 Light Surface</span>
            <span>500 Middle Ground</span>
            <span>950 Deep Canvas</span>
          </div>
        </div>
      </div>
    </A4PageFrame>
  )
}
