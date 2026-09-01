import { useBrandStore } from "@/store/brandStore"
import GlassPanel from "@/components/shared/GlassPanel"
import { IconSparkles, IconShieldCheck, IconStar, IconBolt, IconHeart, IconCheck } from "@tabler/icons-react"

export function StepSummaryPreview() {
  const brand = useBrandStore()

  const primaryColor =
    brand.colorPalette.find((c) => c.role === "primary")?.hex || "#6366f1"
  const secondaryColor =
    brand.colorPalette.find((c) => c.role === "secondary")?.hex || "#06b6d4"
  const accentColor =
    brand.colorPalette.find((c) => c.role === "accent")?.hex || "#10b981"

  const monogramLetter = (brand.brandName || "Brand")
    .charAt(0)
    .toUpperCase()

  return (
    <div className="space-y-4">
      {/* 1. Executive Master Bento Preview */}
      <GlassPanel
        blur="none"
        noise
        noiseOpacity={0.02}
        className="relative overflow-hidden rounded-3xl border border-border/80 bg-card/90 p-6 shadow-sm space-y-4"
      >
        <div
          className="pointer-events-none absolute -top-12 -right-12 size-48 rounded-full blur-3xl opacity-30 transition-all duration-500"
          style={{ backgroundColor: primaryColor }}
        />

        <div className="relative z-10 space-y-3">
          <div className="flex items-center justify-between">
            <div
              className="flex size-12 items-center justify-center rounded-2xl border border-white/20 text-xl font-bold text-white shadow-md"
              style={{
                backgroundColor: primaryColor,
                boxShadow: `0 8px 20px ${primaryColor}40`,
              }}
            >
              {monogramLetter}
            </div>
            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-500">
              <IconShieldCheck size={13} />
              Identity System Ready
            </span>
          </div>

          <div>
            <h2
              className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl"
              style={{ fontFamily: `"${brand.displayFont}", sans-serif` }}
            >
              {brand.brandName || "Brand Workspace"}
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">
              {brand.mission || "Complete multi-layer brand identity system generated."}
            </p>
          </div>
        </div>
      </GlassPanel>

      {/* 2. Color Palette & Typography Mini Bento */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-3xl border border-border/80 bg-card/90 p-5 space-y-3 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            Palette Matrix
          </span>
          <div className="flex items-center gap-2">
            {brand.colorPalette.slice(0, 5).map((swatch, idx) => (
              <div
                key={idx}
                className="h-10 flex-1 rounded-xl border border-black/10 shadow-xs"
                style={{ backgroundColor: swatch.hex }}
              />
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-border/80 bg-card/90 p-5 space-y-2 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            Type Pairings
          </span>
          <p
            className="text-sm font-bold text-foreground truncate"
            style={{ fontFamily: `"${brand.displayFont}", sans-serif` }}
          >
            {brand.displayFont} + {brand.bodyFont}
          </p>
          <p className="font-mono text-[10px] text-muted-foreground">
            Scale: {brand.typeScaleRatio}
          </p>
        </div>
      </div>
    </div>
  )
}
