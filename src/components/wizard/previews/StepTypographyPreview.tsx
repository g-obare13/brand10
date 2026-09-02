import { useRef, useEffect } from "react"
import { useBrandStore } from "@/store/brandStore"
import GlassPanel from "@/components/shared/GlassPanel"
import { IconTypography } from "@tabler/icons-react"
import { DESIGN_MOVEMENTS } from "@/data/wizard"
import { getPreviewTheme } from "./previewTheme"
import { cn } from "@/lib/utils"
import { loadGoogleFont } from "@/lib/fontLoader"
import { gsap } from "gsap"

export function StepTypographyPreview() {
  const brand = useBrandStore()
  const containerRef = useRef<HTMLDivElement>(null)

  const activeMovement =
    (brand.designMovement
      ? DESIGN_MOVEMENTS.find((m) => m.id === brand.designMovement)
      : null) ||
    DESIGN_MOVEMENTS.find((m) =>
      Object.entries(m.tones).every(
        ([k, v]) => brand.toneRatings[k as keyof typeof brand.toneRatings] === v
      )
    ) ||
    DESIGN_MOVEMENTS[0]

  const theme = getPreviewTheme(activeMovement.id)

  // Dynamically load selected fonts into DOM
  useEffect(() => {
    loadGoogleFont(brand.displayFont)
    loadGoogleFont(brand.bodyFont)
    loadGoogleFont(brand.monoFont)
  }, [brand.displayFont, brand.bodyFont, brand.monoFont])

  useEffect(() => {
    if (!containerRef.current) return
    const ctx = gsap.context(() => {
      const cards = containerRef.current?.querySelectorAll(".preview-card-anim")
      if (cards && cards.length > 0) {
        gsap.fromTo(
          cards,
          { y: 24, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            stagger: 0.08,
            delay: 0.1,
            ease: "power3.out",
          }
        )
      }
    }, containerRef)

    return () => ctx.revert()
  }, [])

  // Calculate proportional steps based on the modular ratio
  const ratio = brand.typeScaleRatio || 1.25
  const baseSize = brand.baseFontSize || 16

  const h1Size = Math.round(baseSize * Math.pow(ratio, 4))
  const h2Size = Math.round(baseSize * Math.pow(ratio, 3))
  const h3Size = Math.round(baseSize * Math.pow(ratio, 2))
  const h4Size = Math.round(baseSize * Math.pow(ratio, 1.5))
  const h5Size = Math.round(baseSize * Math.pow(ratio, 1))
  const h6Size = Math.round(baseSize * Math.pow(ratio, 0.5))

  const subLgSize = Math.round(baseSize * 1.15)
  const subRegSize = baseSize
  const bodySize = Math.round(baseSize * 0.95)
  const captionSize = Math.round(baseSize * 0.75)

  return (
    <div ref={containerRef} className={theme.container}>
      {/* 1. Main Typography Specimen Card styled with Movement Theme */}
      <GlassPanel
        blur="none"
        noise
        noiseOpacity={0.02}
        className={cn(
          "preview-card-anim relative flex flex-col space-y-6 overflow-hidden",
          theme.heroCard
        )}
      >
        {/* Ambient Glow */}
        {theme.heroGlow !== "hidden" && (
          <div
            className={theme.heroGlow}
            style={{
              backgroundColor: "var(--primary)",
            }}
          />
        )}

        {/* Card Header */}
        <div className="flex items-center justify-between border-b border-border/60 pb-3">
          <div className="flex items-center gap-2">
            <div className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <IconTypography size={16} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">
                Typographic Hierarchy Specimen
              </h4>
              <p className="text-[10px] text-muted-foreground font-mono">
                {activeMovement.label} Style · {brand.displayFont} + {brand.bodyFont}
              </p>
            </div>
          </div>
          <span className="rounded-md border border-border bg-muted/40 px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
            Scale ×{brand.typeScaleRatio}
          </span>
        </div>

        {/* SECTION A: Headings (H1 - H6) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground border-b border-border/40 pb-1">
            <span className="uppercase tracking-wider font-bold">
              Heading Hierarchy (H1 - H6)
            </span>
            <span>Display Font: {brand.displayFont}</span>
          </div>

          <div
            className="space-y-3.5"
            style={{ fontFamily: `"${brand.displayFont}", sans-serif` }}
          >
            {/* H1 */}
            <div className="space-y-0.5">
              <div className="flex items-baseline justify-between text-[10px] font-mono text-muted-foreground">
                <span>H1 Display Headline</span>
                <span>{h1Size}px · Bold</span>
              </div>
              <h1
                className="font-extrabold tracking-tight text-foreground leading-[1.1]"
                style={{
                  fontSize: `${h1Size}px`,
                  fontFamily: `"${brand.displayFont}", sans-serif`,
                }}
              >
                Modern Autonomous Intelligence
              </h1>
            </div>

            {/* H2 */}
            <div className="space-y-0.5">
              <div className="flex items-baseline justify-between text-[10px] font-mono text-muted-foreground">
                <span>H2 Section Header</span>
                <span>{h2Size}px · Bold</span>
              </div>
              <h2
                className="font-bold tracking-tight text-foreground leading-[1.15]"
                style={{
                  fontSize: `${h2Size}px`,
                  fontFamily: `"${brand.displayFont}", sans-serif`,
                }}
              >
                Engineered for Infinite Velocity
              </h2>
            </div>

            {/* H3 */}
            <div className="space-y-0.5">
              <div className="flex items-baseline justify-between text-[10px] font-mono text-muted-foreground">
                <span>H3 Module Title</span>
                <span>{h3Size}px · SemiBold</span>
              </div>
              <h3
                className="font-semibold tracking-tight text-foreground leading-[1.2]"
                style={{
                  fontSize: `${h3Size}px`,
                  fontFamily: `"${brand.displayFont}", sans-serif`,
                }}
              >
                Architectural Resilience at Planetary Scale
              </h3>
            </div>

            {/* H4 */}
            <div className="space-y-0.5">
              <div className="flex items-baseline justify-between text-[10px] font-mono text-muted-foreground">
                <span>H4 Subsection Title</span>
                <span>{h4Size}px · SemiBold</span>
              </div>
              <h4
                className="font-semibold text-foreground leading-[1.25]"
                style={{
                  fontSize: `${h4Size}px`,
                  fontFamily: `"${brand.displayFont}", sans-serif`,
                }}
              >
                Zero-friction developer workflows and real-time observability
              </h4>
            </div>

            {/* H5 */}
            <div className="space-y-0.5">
              <div className="flex items-baseline justify-between text-[10px] font-mono text-muted-foreground">
                <span>H5 Card Header</span>
                <span>{h5Size}px · Medium</span>
              </div>
              <h5
                className="font-medium text-foreground leading-[1.3]"
                style={{
                  fontSize: `${h5Size}px`,
                  fontFamily: `"${brand.displayFont}", sans-serif`,
                }}
              >
                Unified multi-cloud execution across edge infrastructure
              </h5>
            </div>

            {/* H6 */}
            <div className="space-y-0.5">
              <div className="flex items-baseline justify-between text-[10px] font-mono text-muted-foreground">
                <span>H6 Metric / Group Label</span>
                <span>{h6Size}px · Medium</span>
              </div>
              <h6
                className="font-medium text-foreground uppercase tracking-wider"
                style={{
                  fontSize: `${h6Size}px`,
                  fontFamily: `"${brand.displayFont}", sans-serif`,
                }}
              >
                Continuous Verification Protocol Active
              </h6>
            </div>
          </div>
        </div>

        {/* SECTION B: Subtitles & Body Copy */}
        <div className="space-y-4 pt-2 border-t border-border/50">
          <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground border-b border-border/40 pb-1">
            <span className="uppercase tracking-wider font-bold">
              Subtitles &amp; Body Text
            </span>
            <span>Body Font: {brand.bodyFont}</span>
          </div>

          <div
            className="space-y-3"
            style={{ fontFamily: `"${brand.bodyFont}", sans-serif` }}
          >
            {/* Subtitle Large */}
            <div className="space-y-0.5">
              <span className="text-[10px] font-mono text-muted-foreground">
                Subtitle Large · {subLgSize}px
              </span>
              <p
                className="text-foreground/90 font-medium leading-relaxed"
                style={{
                  fontSize: `${subLgSize}px`,
                  fontFamily: `"${brand.bodyFont}", sans-serif`,
                }}
              >
                The foundation of modern digital design requires typographic clarity,
                harmonious proportions, and intentional contrast.
              </p>
            </div>

            {/* Subtitle Regular */}
            <div className="space-y-0.5">
              <span className="text-[10px] font-mono text-muted-foreground">
                Subtitle Regular · {subRegSize}px
              </span>
              <p
                className="text-muted-foreground leading-normal"
                style={{
                  fontSize: `${subRegSize}px`,
                  fontFamily: `"${brand.bodyFont}", sans-serif`,
                }}
              >
                Interfaces communicate personality through subtle hierarchy choices.
                When paired correctly, display fonts evoke emotion while body copy ensures effortless legibility.
              </p>
            </div>

            {/* Body Copy */}
            <div className="space-y-0.5">
              <span className="text-[10px] font-mono text-muted-foreground">
                Body Regular · {bodySize}px
              </span>
              <p
                className="text-muted-foreground leading-relaxed"
                style={{
                  fontSize: `${bodySize}px`,
                  fontFamily: `"${brand.bodyFont}", sans-serif`,
                }}
              >
                Our core platform synthesizes real-time metrics, telemetry graphs,
                and contextual intelligence into actionable decisions. Every visual component
                inherits this unified typographic framework across desktop, mobile, and print mediums.
              </p>
            </div>

            {/* Captions & Microcopy */}
            <div className="space-y-0.5">
              <span className="text-[10px] font-mono text-muted-foreground">
                Caption &amp; Microcopy · {captionSize}px
              </span>
              <p
                className="text-muted-foreground/80 leading-normal"
                style={{
                  fontSize: `${captionSize}px`,
                  fontFamily: `"${brand.bodyFont}", sans-serif`,
                }}
              >
                © 2026 {brand.brandName || "Brand Studio"} Inc. All rights reserved. System telemetry latency: 12ms · Encrypted end-to-end.
              </p>
            </div>
          </div>
        </div>

        {/* SECTION C: Interactive Buttons Specimen */}
        <div className="space-y-3 pt-2 border-t border-border/50">
          <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground">
            <span className="uppercase tracking-wider font-bold">
              Buttons &amp; Interactive Controls
            </span>
            <span>Style: {activeMovement.badge}</span>
          </div>

          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            <button
              type="button"
              className={theme.buttonPrimary}
              style={{
                fontFamily: `"${brand.displayFont}", sans-serif`,
                backgroundColor: "var(--primary)",
              }}
            >
              Get Started with Platform
            </button>

            <button
              type="button"
              className={theme.buttonSecondary}
              style={{
                fontFamily: `"${brand.bodyFont}", sans-serif`,
              }}
            >
              View Documentation &amp; Specs
            </button>
          </div>
        </div>

        {/* SECTION D: Monospace Code Specimen */}
        <div className="space-y-2 pt-2 border-t border-border/50">
          <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground">
            <span className="uppercase tracking-wider font-bold">
              Monospace Token Specimen
            </span>
            <span>Code Font: {brand.monoFont}</span>
          </div>

          <pre
            className="overflow-x-auto rounded-xl border border-border/70 bg-muted/40 p-3 text-xs text-foreground/90 font-mono leading-relaxed"
            style={{ fontFamily: `"${brand.monoFont}", monospace` }}
          >
            <code>
{`// Brand Typography Tokens
export const TYPOGRAPHY_CONFIG = {
  family: {
    display: "${brand.displayFont}",
    body: "${brand.bodyFont}",
    mono: "${brand.monoFont}",
  },
  scale: {
    ratio: ${brand.typeScaleRatio},
    base: "${brand.baseFontSize}px",
    h1: "${h1Size}px",
    h6: "${h6Size}px",
  }
}`}
            </code>
          </pre>
        </div>
      </GlassPanel>
    </div>
  )
}
