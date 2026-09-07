import { useBrandStore } from "@/store/brandStore"
import { Label } from "@/components/ui/label"
import {
  IconIcons,
  IconCheck,
  IconStar,
  IconBolt,
  IconHeart,
  IconShield,
} from "@tabler/icons-react"
import { cn } from "@/lib/utils"
import { STYLE_FAMILIES, RADIUS_OPTIONS } from "@/data/wizard"

/**
 * Form component for configuring brand iconography geometry and style families.
 * Features:
 * - Icon family selector (Stroke, Solid Filled, Duotone Two-Tone).
 * - Corner radius preset buttons (Sharp, Soft 4px, Squircle 8px, Pill 99px).
 * - Stroke weight slider adjustments for linear stroke families.
 * - Real-time icon preview cards reflecting color and geometry choices.
 *
 * @component
 * @returns {React.ReactElement} The rendered iconography configuration form.
 */
export function StepIconography() {
  const brand = useBrandStore()
  const primaryColor =
    brand.colorPalette.find((c) => c.role === "primary")?.hex || "#6366f1"

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
          <IconIcons size={13} />
          Step 6: Iconography System
        </div>
        <h3 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
          Geometry, Stroke &amp; Radii
        </h3>
        <p className="text-xs text-muted-foreground">
          Define iconography aesthetics across UI badges, buttons, and marketing decks.
        </p>
      </div>

      <div className="space-y-5">
        {/* Style Family */}
        <div className="space-y-2">
          <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Icon Rendering Style
          </Label>
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
            {STYLE_FAMILIES.map((fam) => {
              const isSelected = brand.iconStyle === fam.id

              return (
                <button
                  key={fam.id}
                  type="button"
                  onClick={() => brand.setIconography({ style: fam.id })}
                  className={cn(
                    "flex cursor-pointer flex-col justify-between rounded-2xl border p-4 text-left transition-all",
                    isSelected
                      ? "border-primary bg-primary/5 shadow-xs"
                      : "border-border/80 bg-card/60 hover:border-primary/50 hover:bg-muted/60"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-foreground">
                      {fam.title}
                    </span>
                    {isSelected && (
                      <IconCheck size={16} className="text-primary" />
                    )}
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                    {fam.desc}
                  </p>
                </button>
              )
            })}
          </div>
        </div>

        {/* Corner Radius & Stroke Controls */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Corner Radius */}
          <div className="space-y-2 rounded-2xl border border-border/80 bg-card/60 p-4">
            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Container Corner Radius
            </Label>
            <div className="grid grid-cols-4 gap-1.5 pt-1">
              {RADIUS_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => brand.setIconography({ radius: opt.value })}
                  className={cn(
                    "cursor-pointer rounded-xl border py-2 text-xs font-medium transition-all",
                    brand.iconRadius === opt.value
                      ? "border-primary bg-primary text-primary-foreground font-semibold"
                      : "border-border bg-muted/40 text-muted-foreground hover:text-foreground"
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Stroke Weight */}
          <div className="space-y-2 rounded-2xl border border-border/80 bg-card/60 p-4">
            <div className="flex items-center justify-between text-xs font-bold text-foreground">
              <span className="uppercase tracking-wider text-muted-foreground">
                Stroke Keyline
              </span>
              <span className="font-mono text-primary">
                {brand.iconStroke || 2.0}px
              </span>
            </div>
            <div className="flex gap-2 pt-1">
              {[1.5, 2.0, 2.5].map((w) => (
                <button
                  key={w}
                  type="button"
                  onClick={() => brand.setIconography({ stroke: w })}
                  className={cn(
                    "flex-1 cursor-pointer rounded-xl border py-2 text-xs font-medium transition-all",
                    brand.iconStroke === w
                      ? "border-primary bg-primary text-primary-foreground font-semibold"
                      : "border-border bg-muted/40 text-muted-foreground hover:text-foreground"
                  )}
                >
                  {w.toFixed(1)}px
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Live Specimen Demonstration */}
        <div className="flex items-center justify-around rounded-2xl border border-border/80 bg-card/80 p-5 shadow-xs">
          {[IconStar, IconBolt, IconHeart, IconShield].map((IconComp, idx) => (
            <div
              key={idx}
              className="flex size-12 items-center justify-center border border-border/60 bg-muted/40 transition-all duration-200"
              style={{
                borderRadius: `${brand.iconRadius}px`,
                color: primaryColor,
              }}
            >
              <IconComp
                size={22}
                strokeWidth={brand.iconStroke || 2.0}
                fill={brand.iconStyle === "solid" ? "currentColor" : "none"}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
