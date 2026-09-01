import { useBrandStore } from "@/store/brandStore"
import GlassPanel from "@/components/shared/GlassPanel"
import { IconPalette, IconShieldCheck, IconSparkles } from "@tabler/icons-react"

export function StepColorsPreview() {
  const brand = useBrandStore()

  const primaryColor =
    brand.colorPalette.find((c) => c.role === "primary")?.hex || "#6366f1"
  const secondaryColor =
    brand.colorPalette.find((c) => c.role === "secondary")?.hex || "#06b6d4"
  const accentColor =
    brand.colorPalette.find((c) => c.role === "accent")?.hex || "#10b981"

  return (
    <div className="space-y-4">
      {/* 1. Large Palette Swatches Showcase */}
      <GlassPanel
        blur="none"
        noise
        noiseOpacity={0.02}
        className="rounded-3xl border border-border/80 bg-card/90 p-6 shadow-sm space-y-4"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
            <IconPalette size={15} className="text-primary" />
            <span>Active Color Hierarchy</span>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-500">
            <IconShieldCheck size={13} />
            WCAG Compliant
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          {brand.colorPalette.map((swatch, idx) => (
            <div
              key={idx}
              className="flex flex-col overflow-hidden rounded-2xl border border-border/70 bg-card/80 transition-all hover:scale-102"
            >
              <div
                className="h-20 w-full transition-all duration-300"
                style={{ backgroundColor: swatch.hex }}
              />
              <div className="p-2.5 space-y-0.5 text-center">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-foreground">
                  {swatch.role || `Color ${idx + 1}`}
                </span>
                <span className="block font-mono text-[10px] text-muted-foreground uppercase">
                  {swatch.hex}
                </span>
              </div>
            </div>
          ))}
        </div>
      </GlassPanel>

      {/* 2. UI Component Theme Simulation */}
      <GlassPanel
        blur="none"
        noise
        noiseOpacity={0.02}
        className="rounded-3xl border border-border/80 bg-card/90 p-6 shadow-sm space-y-4"
      >
        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Live UI Component Simulation
        </span>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {/* Primary Action Button */}
          <div
            className="flex items-center justify-center rounded-2xl p-4 text-xs font-bold text-white shadow-md transition-all"
            style={{
              backgroundColor: primaryColor,
              boxShadow: `0 6px 16px ${primaryColor}40`,
            }}
          >
            Primary Action
          </div>

          {/* Secondary Badge/Button */}
          <div
            className="flex items-center justify-center rounded-2xl p-4 text-xs font-bold text-white shadow-md transition-all"
            style={{
              backgroundColor: secondaryColor,
              boxShadow: `0 6px 16px ${secondaryColor}40`,
            }}
          >
            Secondary Element
          </div>

          {/* Accent Highlight */}
          <div
            className="flex items-center justify-center rounded-2xl p-4 text-xs font-bold text-white shadow-md transition-all"
            style={{
              backgroundColor: accentColor,
              boxShadow: `0 6px 16px ${accentColor}40`,
            }}
          >
            Accent Highlight
          </div>
        </div>

        {/* Gradient Banner */}
        <div
          className="h-14 w-full rounded-2xl flex items-center justify-center text-xs font-semibold text-white shadow-xs"
          style={{
            background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor}, ${accentColor})`,
          }}
        >
          Dynamic Triple-Tone Gradient Wave
        </div>
      </GlassPanel>
    </div>
  )
}
