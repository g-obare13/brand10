import { useBrandStore } from "@/store/brandStore"
import GlassPanel from "@/components/shared/GlassPanel"
import { IconTypography, IconSparkles } from "@tabler/icons-react"

export function StepTypographyPreview() {
  const brand = useBrandStore()

  return (
    <div className="space-y-4">
      {/* 1. Typeface Specimen Hierarchy Header */}
      <GlassPanel
        blur="none"
        noise
        noiseOpacity={0.02}
        className="rounded-3xl border border-border/80 bg-card/90 p-6 shadow-sm space-y-4"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
            <IconTypography size={15} className="text-primary" />
            <span>Type Pairings &amp; Hierarchy</span>
          </div>
          <span className="font-mono text-[10px] text-muted-foreground">
            Ratio {brand.typeScaleRatio}
          </span>
        </div>

        <div className="space-y-4 divide-y divide-border/60">
          {/* Display Font */}
          <div className="space-y-1 pt-1">
            <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground">
              <span>Display / Heading</span>
              <span className="text-primary font-bold">{brand.displayFont}</span>
            </div>
            <h1
              className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl"
              style={{ fontFamily: `"${brand.displayFont}", sans-serif` }}
            >
              The quick brown fox jumps over the lazy dog.
            </h1>
          </div>

          {/* Body Font */}
          <div className="space-y-1 pt-4">
            <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground">
              <span>Body / UI Text</span>
              <span className="text-primary font-bold">{brand.bodyFont}</span>
            </div>
            <p
              className="text-sm leading-relaxed text-muted-foreground"
              style={{ fontFamily: `"${brand.bodyFont}", sans-serif` }}
            >
              Typography creates visual order and shapes the emotional resonance of your brand.
              Every headline, caption, and paragraph is calibrated to maintain clarity across all screen sizes.
            </p>
          </div>

          {/* Monospace Font */}
          <div className="space-y-1 pt-4">
            <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground">
              <span>Monospace / Code</span>
              <span className="text-primary font-bold">{brand.monoFont}</span>
            </div>
            <p
              className="font-mono text-xs text-foreground/80 bg-muted/40 p-2.5 rounded-xl border border-border/60"
              style={{ fontFamily: `"${brand.monoFont}", monospace` }}
            >
              const BRAND_SYSTEM = &#123; scale: {brand.typeScaleRatio}, font: "{brand.displayFont}" &#125;
            </p>
          </div>
        </div>
      </GlassPanel>
    </div>
  )
}
