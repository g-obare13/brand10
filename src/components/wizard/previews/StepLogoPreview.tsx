import { useBrandStore } from "@/store/brandStore"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import GlassPanel from "@/components/shared/GlassPanel"
import { IconX } from "@tabler/icons-react"

const LOGO_DONTS = [
  {
    rule: "Don't use outdated versions",
    detail:
      "If the brand has had past logo iterations, only the current approved version should appear.",
  },
  {
    rule: "Don't add effects",
    detail:
      "No drop shadows, gradients, outlines, bevels, or glows unless that's part of the actual logo design.",
  },
  {
    rule: "Don't recolor outside the approved palette",
    detail: "No random or off-brand colors applied to the mark.",
  },
  {
    rule: "Don't rotate",
    detail:
      "Keep the logo at its intended orientation unless a rotated lockup is explicitly part of the system.",
  },
  {
    rule: "Don't stretch or distort",
    detail:
      "Never scale non-proportionally (squishing horizontally or vertically).",
  },
]

interface BlueprintFrameProps {
  svgUri?: string | null
  brandName: string
  primaryColor: string
  className?: string
  isDark?: boolean
  size?: "lg" | "sm"
  isSecondary?: boolean
}

function BlueprintFrame({
  svgUri,
  brandName,
  primaryColor,
  className,
  isDark = false,
  size = "lg",
  isSecondary = false,
}: BlueprintFrameProps) {
  const outerOffset = size === "lg" ? 14 : 10
  const overshoot = size === "lg" ? 16 : 12
  const totalExt = outerOffset + overshoot

  const name = brandName || "Brandio"

  const renderFallbackText = () => {
    if (name.toLowerCase().endsWith("io") && name.length > 2) {
      const prefix = name.slice(0, -2)
      return (
        <span
          className={cn(
            "font-bold tracking-tight select-none",
            size === "lg" ? "text-2xl sm:text-3xl" : "text-base sm:text-lg",
            isDark ? "text-white" : "text-zinc-900"
          )}
        >
          {prefix}
          <span style={{ color: isDark ? "#ffffff" : primaryColor }}>io</span>
        </span>
      )
    }

    return (
      <span
        className={cn(
          "font-bold tracking-tight select-none",
          size === "lg" ? "text-2xl sm:text-3xl" : "text-base sm:text-lg",
          isDark ? "text-white" : "text-zinc-900"
        )}
      >
        {name}
      </span>
    )
  }

  const lineClass = isDark
    ? "bg-zinc-700/70"
    : "bg-zinc-300 dark:bg-zinc-700/60"

  return (
    <div
      className={cn(
        "relative inline-flex items-center justify-center select-none",
        className
      )}
    >
      {/* Horizontal Blueprint Guidelines (4 lines with corner overshoots) */}
      <div
        className={cn("absolute h-px", lineClass)}
        style={{
          top: `-${outerOffset}px`,
          left: `-${totalExt}px`,
          right: `-${totalExt}px`,
        }}
      />
      <div
        className={cn("absolute top-0 h-px", lineClass)}
        style={{
          left: `-${totalExt}px`,
          right: `-${totalExt}px`,
        }}
      />
      <div
        className={cn("absolute bottom-0 h-px", lineClass)}
        style={{
          left: `-${totalExt}px`,
          right: `-${totalExt}px`,
        }}
      />
      <div
        className={cn("absolute h-px", lineClass)}
        style={{
          bottom: `-${outerOffset}px`,
          left: `-${totalExt}px`,
          right: `-${totalExt}px`,
        }}
      />

      {/* Vertical Blueprint Guidelines (4 lines with corner overshoots) */}
      <div
        className={cn("absolute w-px", lineClass)}
        style={{
          left: `-${outerOffset}px`,
          top: `-${totalExt}px`,
          bottom: `-${totalExt}px`,
        }}
      />
      <div
        className={cn("absolute left-0 w-px", lineClass)}
        style={{
          top: `-${totalExt}px`,
          bottom: `-${totalExt}px`,
        }}
      />
      <div
        className={cn("absolute right-0 w-px", lineClass)}
        style={{
          top: `-${totalExt}px`,
          bottom: `-${totalExt}px`,
        }}
      />
      <div
        className={cn("absolute w-px", lineClass)}
        style={{
          right: `-${outerOffset}px`,
          top: `-${totalExt}px`,
          bottom: `-${totalExt}px`,
        }}
      />

      {/* Logo Content Container */}
      <div
        className={cn(
          "relative z-10 flex items-center justify-center",
          size === "lg"
            ? "min-h-16 min-w-36 px-6 py-3"
            : "min-h-10 min-w-24 px-4 py-1.5"
        )}
      >
        {svgUri ? (
          <img
            src={svgUri}
            alt={isSecondary ? "Secondary Logo" : "Primary Logo"}
            className={cn(
              "object-contain transition-all",
              size === "lg" ? "max-h-16 max-w-44" : "max-h-9 max-w-28",
              isDark && "opacity-95 brightness-0 invert"
            )}
          />
        ) : (
          renderFallbackText()
        )}
      </div>
    </div>
  )
}

export function StepLogoPreview() {
  const brand = useBrandStore()
  const primaryColor =
    brand.colorPalette.find((c) => c.role === "primary")?.hex || "#6366f1"

  const primarySvgUri = brand.svgContent
    ? `data:image/svg+xml;utf8,${encodeURIComponent(brand.svgContent)}`
    : null

  const secondarySvgUri = brand.secondarySvgContent
    ? `data:image/svg+xml;utf8,${encodeURIComponent(brand.secondarySvgContent)}`
    : null

  return (
    <div className="space-y-6">
      {/* 1. PRIMARY LOGO SYSTEM (TOP) */}
      <div className="space-y-3">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
          {/* Left: Large Showcase Card */}
          <GlassPanel
            blur="none"
            noise
            noiseOpacity={0.02}
            className="flex min-h-55 items-center justify-between rounded-2xl bg-card md:col-span-7"
          >
            <div className="flex h-full flex-col items-center justify-center gap-12 p-8">
              <BlueprintFrame
                svgUri={primarySvgUri}
                brandName={brand.brandName}
                primaryColor={primaryColor}
                size="lg"
                className="bg-white"
              />
              <span className="text-xs font-medium text-foreground">
                Primary Logo System
              </span>
            </div>
          </GlassPanel>

          {/* Right: Stacked Light & Dark Canvas Cards */}
          <div className="flex flex-col gap-4 md:col-span-5">
            {/* Top: Light Canvas */}
            <GlassPanel
              blur="none"
              noise
              noiseOpacity={0.02}
              className="flex min-h-25.5 items-center justify-between rounded-2xl bg-card"
            >
              <div className="flex h-full flex-col items-center justify-center gap-12 p-8">
                <BlueprintFrame
                  svgUri={primarySvgUri}
                  brandName={brand.brandName}
                  primaryColor={primaryColor}
                  size="lg"
                  className="bg-white"
                />
              </div>
            </GlassPanel>

            {/* Bottom: Dark Canvas */}
            <GlassPanel
              blur="none"
              noise
              noiseOpacity={0.02}
              className="flex min-h-25.5 items-center justify-between rounded-2xl bg-primary-950"
            >
              <div className="flex h-full flex-col items-center justify-center gap-12 p-8">
                <BlueprintFrame
                  svgUri={primarySvgUri}
                  brandName={brand.brandName}
                  primaryColor={primaryColor}
                  isDark={true}
                  size="sm"
                />
              </div>
            </GlassPanel>
          </div>
        </div>
      </div>

      {/* 2. SECONDARY LOGO SYSTEM (BOTTOM) - Shown only when secondary SVG is uploaded */}
      {secondarySvgUri && (
        <div className="space-y-3">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
            {/* Left: Large Showcase Card */}

            <GlassPanel
              blur="none"
              noise
              noiseOpacity={0.02}
              className="flex min-h-55 items-center justify-between rounded-2xl bg-card md:col-span-7"
            >
              <div className="flex h-full flex-col items-center justify-center gap-12 p-8!">
                <BlueprintFrame
                  svgUri={secondarySvgUri}
                  brandName={brand.brandName}
                  primaryColor={primaryColor}
                  size="lg"
                  className="bg-white"
                  isSecondary
                />

                <span className="text-xs font-medium text-foreground">
                  Secondary Logo System
                </span>
              </div>
            </GlassPanel>

            {/* Right: Stacked Light & Dark Canvas Cards */}
            <div className="flex flex-col gap-4 md:col-span-5">
              {/* Top: Light Canvas */}
              <div className="flex min-h-25.5 flex-1 items-center justify-center rounded-2xl border border-border/80 bg-white p-4 dark:bg-card/90">
                <BlueprintFrame
                  svgUri={secondarySvgUri}
                  brandName={brand.brandName}
                  primaryColor={primaryColor}
                  size="sm"
                  isSecondary
                  className="bg-white"
                />
              </div>

              {/* Bottom: Dark Canvas */}
              <div className="flex min-h-25.5 flex-1 items-center justify-center rounded-2xl border border-zinc-800 bg-black p-4">
                <BlueprintFrame
                  svgUri={secondarySvgUri}
                  brandName={brand.brandName}
                  primaryColor={primaryColor}
                  isDark={true}
                  size="sm"
                  isSecondary
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. LOGO USAGE CONSTRAINTS / DON'TS */}
      <GlassPanel
        blur="none"
        noise
        noiseOpacity={0.02}
        className="space-y-3 rounded-2xl border border-border/80 bg-card p-5"
      >
        <div className="mb-2 flex items-center justify-between">
          <span className="font-medium">
            Logo Usage Constraints (Don&apos;ts)
          </span>
        </div>

        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {LOGO_DONTS.map((item, idx) => (
            <div
              key={idx}
              className="flex items-start gap-2.5 rounded-xl p-3 text-left transition-all"
            >
              <div className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-rose-500/20 text-rose-500">
                <IconX size={10} />
              </div>
              <div className="space-y-0.5">
                <h5 className="text-sm font-medium">{item.rule}</h5>
                <p className="text-sm text-muted-foreground">{item.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </GlassPanel>
    </div>
  )
}
