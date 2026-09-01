import { useBrandStore } from "@/store/brandStore"
import { Label } from "@/components/ui/label"
import { IconVectorBezier2, IconSun, IconMoon, IconLayersLinked } from "@tabler/icons-react"

export function StepLogo() {
  const brand = useBrandStore()
  const primaryColor =
    brand.colorPalette.find((c) => c.role === "primary")?.hex || "#6366f1"

  const monogramLetter = (brand.brandName || "Brand")
    .charAt(0)
    .toUpperCase()

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
          <IconVectorBezier2 size={13} />
          Step 2: Logo System &amp; Geometry
        </div>
        <h3 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
          Monogram &amp; Clearspace Rules
        </h3>
        <p className="text-xs text-muted-foreground">
          Calibrate mark visibility across dark, light, and high-contrast environments.
        </p>
      </div>

      <div className="space-y-5">
        {/* Background Contrast Adaptations */}
        <div className="space-y-2">
          <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Environment Contrast Testing
          </Label>

          <div className="grid grid-cols-3 gap-3">
            {/* 1. Dark Mode */}
            <div className="flex flex-col items-center justify-center rounded-2xl border border-border/80 bg-zinc-950 p-4 text-center space-y-2">
              <div
                className="flex size-10 items-center justify-center rounded-xl text-base font-bold text-white shadow-sm"
                style={{ backgroundColor: primaryColor }}
              >
                {monogramLetter}
              </div>
              <div className="flex items-center gap-1 text-[10px] font-semibold text-zinc-400">
                <IconMoon size={12} />
                <span>Dark Canvas</span>
              </div>
            </div>

            {/* 2. Light Mode */}
            <div className="flex flex-col items-center justify-center rounded-2xl border border-border/80 bg-white p-4 text-center space-y-2 shadow-xs">
              <div
                className="flex size-10 items-center justify-center rounded-xl text-base font-bold text-white shadow-sm"
                style={{ backgroundColor: primaryColor }}
              >
                {monogramLetter}
              </div>
              <div className="flex items-center gap-1 text-[10px] font-semibold text-zinc-600">
                <IconSun size={12} />
                <span>Light Surface</span>
              </div>
            </div>

            {/* 3. Monochrome Silhouette */}
            <div className="flex flex-col items-center justify-center rounded-2xl border border-border/80 bg-muted/50 p-4 text-center space-y-2">
              <div className="flex size-10 items-center justify-center rounded-xl bg-foreground text-base font-bold text-background shadow-sm">
                {monogramLetter}
              </div>
              <div className="flex items-center gap-1 text-[10px] font-semibold text-muted-foreground">
                <IconLayersLinked size={12} />
                <span>Monochrome</span>
              </div>
            </div>
          </div>
        </div>

        {/* Clearspace Multiplier Slider */}
        <div className="space-y-3 rounded-2xl border border-border/80 bg-card/60 p-4">
          <div className="flex items-center justify-between text-xs font-bold text-foreground">
            <span className="uppercase tracking-wider text-muted-foreground">
              Clearspace Margin
            </span>
            <span className="font-mono text-primary">
              {brand.clearspaceMultiplier.toFixed(1)}x Symbol Width
            </span>
          </div>

          <input
            type="range"
            min="0.5"
            max="2.0"
            step="0.1"
            value={brand.clearspaceMultiplier}
            onChange={(e) =>
              brand.setClearspaceMultiplier(parseFloat(e.target.value))
            }
            className="h-2 w-full cursor-pointer rounded-lg bg-muted accent-primary"
          />

          <p className="text-[11px] text-muted-foreground leading-relaxed">
            Ensures uncompromised visual isolation when the logo is placed on editorial headers, billboards, and app icons.
          </p>
        </div>
      </div>
    </div>
  )
}
