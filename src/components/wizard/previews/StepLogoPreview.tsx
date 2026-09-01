import { useBrandStore } from "@/store/brandStore"
import GlassPanel from "@/components/shared/GlassPanel"
import { IconMoon, IconSun, IconLayersLinked, IconShieldCheck, IconMaximize } from "@tabler/icons-react"

export function StepLogoPreview() {
  const brand = useBrandStore()
  const primaryColor =
    brand.colorPalette.find((c) => c.role === "primary")?.hex || "#6366f1"

  const monogramLetter = (brand.brandName || "Brand")
    .charAt(0)
    .toUpperCase()

  return (
    <div className="space-y-4">
      {/* 1. Large Hero Monogram / Logo Mark Presentation */}
      <GlassPanel
        blur="none"
        noise
        noiseOpacity={0.02}
        className="relative overflow-hidden rounded-3xl border border-border/80 bg-card/90 p-8 shadow-sm text-center"
      >
        <div
          className="pointer-events-none absolute inset-0 size-full blur-3xl opacity-20 transition-all duration-500"
          style={{ backgroundColor: primaryColor }}
        />

        <div className="relative z-10 flex flex-col items-center justify-center space-y-4">
          <div
            className="flex size-24 items-center justify-center rounded-3xl border border-white/20 text-4xl font-bold text-white shadow-xl transition-all duration-300"
            style={{
              backgroundColor: primaryColor,
              boxShadow: `0 12px 30px ${primaryColor}40`,
            }}
          >
            {monogramLetter}
          </div>

          <div className="space-y-1">
            <h3
              className="text-xl font-bold tracking-tight text-foreground"
              style={{ fontFamily: `"${brand.displayFont}", sans-serif` }}
            >
              {brand.brandName || "Brand"} Monogram
            </h3>
            <p className="font-mono text-xs text-muted-foreground">
              Primary Vector Identifier
            </p>
          </div>
        </div>
      </GlassPanel>

      {/* 2. Dual Canvas Contrast Matrix (Dark / Light / Accent) */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Dark Background Test */}
        <div className="flex flex-col items-center justify-center rounded-3xl border border-zinc-800 bg-zinc-950 p-6 text-center space-y-3">
          <div
            className="flex size-14 items-center justify-center rounded-2xl text-xl font-bold text-white shadow-md"
            style={{ backgroundColor: primaryColor }}
          >
            {monogramLetter}
          </div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-300">
            <IconMoon size={14} />
            <span>Dark Obsidian Environment</span>
          </div>
          <span className="font-mono text-[10px] text-zinc-500">High Visibility</span>
        </div>

        {/* Light Background Test */}
        <div className="flex flex-col items-center justify-center rounded-3xl border border-zinc-200 bg-white p-6 text-center space-y-3 shadow-xs">
          <div
            className="flex size-14 items-center justify-center rounded-2xl text-xl font-bold text-white shadow-md"
            style={{ backgroundColor: primaryColor }}
          >
            {monogramLetter}
          </div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-800">
            <IconSun size={14} />
            <span>Light Crisp Canvas</span>
          </div>
          <span className="font-mono text-[10px] text-zinc-400">Pure Contrast</span>
        </div>
      </div>

      {/* 3. Clearspace Safety Zone Specification */}
      <GlassPanel
        blur="none"
        noise
        noiseOpacity={0.02}
        className="rounded-3xl border border-border/80 bg-card/90 p-5 shadow-sm space-y-3"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
            <IconLayersLinked size={15} className="text-primary" />
            <span>Clearspace &amp; Safe Padding Ratio</span>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 font-mono text-[10px] font-semibold text-emerald-500">
            <IconShieldCheck size={12} />
            {brand.clearspaceMultiplier || 1.5}x Buffer
          </span>
        </div>

        <div className="flex items-center justify-center rounded-2xl border border-dashed border-primary/40 bg-primary/5 p-6">
          <div className="rounded-xl border border-dashed border-primary/60 p-4">
            <div
              className="flex size-12 items-center justify-center rounded-xl text-lg font-bold text-white shadow-sm"
              style={{ backgroundColor: primaryColor }}
            >
              {monogramLetter}
            </div>
          </div>
        </div>
      </GlassPanel>
    </div>
  )
}
