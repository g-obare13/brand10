import GlassPanel from "@/components/shared/GlassPanel"
import { DESIGN_MOVEMENTS } from "@/data/wizard"
import { useBrandStore } from "@/store/brandStore"

export function StepFoundationPreview() {
  const brand = useBrandStore()

  const primaryColor =
    brand.colorPalette.find((c) => c.role === "primary")?.hex || "#6366f1"

  const monogramLetter = (brand.brandName || "Brand").charAt(0).toUpperCase()

  // Find active movement if tone ratings match
  const activeMovement = DESIGN_MOVEMENTS.find((m) =>
    Object.entries(m.tones).every(
      ([k, v]) => brand.toneRatings[k as keyof typeof brand.toneRatings] === v
    )
  )

  const toneMetrics = [
    {
      label: "Formal",
      left: "Casual",
      right: "Formal",
      val: brand.toneRatings.formal,
    },
    {
      label: "Playful",
      left: "Serious",
      right: "Playful",
      val: brand.toneRatings.playful,
    },
    {
      label: "Minimalist",
      left: "Ornate",
      right: "Minimal",
      val: brand.toneRatings.minimalist,
    },
    {
      label: "Bold",
      left: "Subtle",
      right: "Disruptive",
      val: brand.toneRatings.bold,
    },
  ]

  return (
    <div className="space-y-4">
      {/* 1. Brand Workspace Hero Identity Tile */}
      <GlassPanel
        blur="none"
        noise
        noiseOpacity={0.02}
        className="relative overflow-hidden rounded-3xl border border-border/80 bg-card/90 p-6 shadow-sm"
      >
        <div
          className="pointer-events-none absolute -top-12 -right-12 size-48 rounded-full opacity-30 blur-3xl transition-all duration-500"
          style={{ backgroundColor: primaryColor }}
        />

        <div className="relative z-10 space-y-4">
          <div>
            <h2
              className="text-2xl font-bold tracking-tight text-foreground transition-all sm:text-3xl"
              style={{ fontFamily: `"${brand.displayFont}", sans-serif` }}
            >
              {brand.brandName || "Your Brand Workspace"}
            </h2>
            <p>
              {activeMovement
                ? activeMovement.vibe
                : "Configure your core brand essence, mission, and calibrated tones."}
            </p>
          </div>
        </div>
      </GlassPanel>

      {/* 2. Tone Calibration Matrix */}
      <GlassPanel
        blur="none"
        noise
        noiseOpacity={0.02}
        className="space-y-4 rounded-3xl border border-border/80 bg-card/90 p-5 shadow-sm"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center py-2">
            <span className="font-heading">
              Calibrated Brand Voice &amp; Tones
            </span>
          </div>
          <span className="text-xs text-foreground">
            {activeMovement ? activeMovement.label : "Custom Tone Balance"}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {toneMetrics.map((metric) => (
            <div
              key={metric.label}
              className="space-y-2 rounded-xl border border-border/60 bg-muted/30 p-3"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="text-foreground">{metric.label}</span>
                <span className="font-medium text-primary">{metric.val}%</span>
              </div>
              <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-border/60">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-500"
                  style={{ width: `${metric.val}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-foreground">
                <span>{metric.left}</span>
                <span>{metric.right}</span>
              </div>
            </div>
          ))}
        </div>
      </GlassPanel>

      {/* 3. Mission & Vision Statement Dual Tiles */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Mission Preview */}
        <GlassPanel
          blur="none"
          noise
          noiseOpacity={0.02}
          className="flex flex-col justify-between space-y-2.5 rounded-3xl border border-border/80 bg-card/90 p-5 shadow-sm"
        >
          <div className="flex items-center gap-2">
            <span className="font-heading">Brand Mission</span>
          </div>
          <p className="text-foreground/90">
            "
            {brand.mission ||
              "Define the fundamental problem your brand solves for the world."}
            "
          </p>
        </GlassPanel>

        {/* Vision Preview */}
        <GlassPanel
          blur="none"
          noise
          noiseOpacity={0.02}
          className="flex flex-col justify-between space-y-2.5 rounded-3xl border border-border/80 bg-card/90 p-5 shadow-sm"
        >
          <div className="flex items-center gap-2">
            <span className="font-heading">Brand Vision</span>
          </div>
          <p>
            "
            {brand.vision ||
              "Define the future world your brand is actively shaping over the next decade."}
            "
          </p>
        </GlassPanel>
      </div>
    </div>
  )
}
