import { useBrandStore } from "@/store/brandStore"
import GlassPanel from "@/components/shared/GlassPanel"
import {
  IconStar,
  IconBolt,
  IconHeart,
  IconShield,
  IconCompass,
  IconCheck,
  IconFlame,
  IconSparkles,
} from "@tabler/icons-react"
/**
 * A live interactive preview demonstrating icon style, corner radius, and stroke weight.
 * Features:
 * - Real-time icon rendering using Tabler icons with brand color swatches.
 * - Dynamic corner radius and stroke thickness adjustments.
 * - Style variations supporting outline/stroke, filled/solid, and duotone treatments.
 *
 * @component
 * @returns {React.ReactElement} The rendered iconography preview panel.
 */
export function StepIconographyPreview() {
  const brand = useBrandStore()

  const primaryColor =
    brand.colorPalette.find((c) => c.role === "primary")?.hex || "#6366f1"
  const secondaryColor =
    brand.colorPalette.find((c) => c.role === "secondary")?.hex || "#06b6d4"
  const accentColor =
    brand.colorPalette.find((c) => c.role === "accent")?.hex || "#10b981"

  const sampleIcons = [
    { icon: IconStar, color: primaryColor },
    { icon: IconBolt, color: secondaryColor },
    { icon: IconHeart, color: accentColor },
    { icon: IconShield, color: primaryColor },
    { icon: IconCompass, color: secondaryColor },
    { icon: IconFlame, color: accentColor },
    { icon: IconSparkles, color: primaryColor },
    { icon: IconCheck, color: secondaryColor },
  ]

  return (
    <div className="space-y-4">
      {/* 1. Iconography Specimen Matrix */}
      <GlassPanel
        blur="none"
        noise
        noiseOpacity={0.02}
        className="rounded-3xl border border-border/80 bg-card/90 p-6 shadow-sm space-y-4"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Icon Matrix ({brand.iconStyle} / {brand.iconRadius}px / {brand.iconStroke}px)
          </span>
          <span className="font-mono text-[10px] text-muted-foreground">
            Vector Cohesion
          </span>
        </div>

        <div className="grid grid-cols-4 gap-3">
          {sampleIcons.map((item, idx) => {
            const IconComp = item.icon
            return (
              <div
                key={idx}
                className="flex aspect-square items-center justify-center border border-border/80 bg-muted/40 transition-all duration-200 hover:scale-105"
                style={{
                  borderRadius: `${brand.iconRadius}px`,
                  color: item.color,
                }}
              >
                <IconComp
                  size={24}
                  strokeWidth={brand.iconStroke || 2.0}
                  fill={brand.iconStyle === "solid" ? "currentColor" : "none"}
                />
              </div>
            )
          })}
        </div>
      </GlassPanel>

      {/* 2. Style & Radius Details */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-border/80 bg-card/80 p-4 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Selected Style Family
          </span>
          <p className="text-sm font-bold text-foreground capitalize">
            {brand.iconStyle} Icons
          </p>
        </div>
        <div className="rounded-2xl border border-border/80 bg-card/80 p-4 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Corner Geometry
          </span>
          <p className="text-sm font-bold text-foreground">
            {brand.iconRadius}px Border Radius
          </p>
        </div>
      </div>
    </div>
  )
}
