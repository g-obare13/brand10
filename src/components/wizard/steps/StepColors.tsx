import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DESIGN_MOVEMENTS } from "@/data/wizard"
import { generateTonalShades } from "@/lib/colorUtils"
import { cn } from "@/lib/utils"
import { useBrandStore } from "@/store/brandStore"
import chroma from "chroma-js"

function getSwatchMeta(role: string, index: number) {
  switch (role) {
    case "primary":
      return { label: "Primary Color", tag: "Base Dominant" }
    case "secondary":
      return { label: "Secondary Color", tag: "Alternate Dominant" }
    case "accent":
      return { label: "Accent Color", tag: "Vibrant Accent" }
    default:
      return { label: `Color ${index + 1}`, tag: "Extended Hue" }
  }
}

/**
 * Step 3 Wizard form component for configuring brand color palette and harmonic relationships.
 * Features:
 * - Dynamic color pickers and hex inputs reflecting the exact number of extracted dominant colors.
 * - Preset palette suggestions based on the active design movement.
 * - Instant tonal scale generation across 11 lightness values (50 to 950).
 * - Real-time contrast checks and WCAG accessibility ratings.
 *
 * @component
 * @returns {React.ReactElement} The rendered color configuration form.
 */
export function StepColors() {
  const brand = useBrandStore()

  const brandSwatches = brand.colorPalette.filter(
    (c) => c.role !== "neutral" && c.role !== "background"
  )
  const displaySwatches =
    brandSwatches.length > 0 ? brandSwatches : brand.colorPalette.slice(0, 2)

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

  const handleColorChange = (id: string, hex: string) => {
    const valid = chroma.valid(hex)
    const shades = valid ? generateTonalShades(hex) : undefined
    brand.updateColorSwatch(id, { hex, ...(shades ? { shades } : {}) })
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <h4 className="mb-2">Palette &amp; Accessibility Scale</h4>
        </div>
        <p className="mb-2">
          Fine-tune the {displaySwatches.length} dominant brand{" "}
          {displaySwatches.length === 1 ? "color" : "colors"} extracted from
          your mark. Tonal scales and accessibility ratios adapt in real time.
        </p>
      </div>

      <div className="space-y-5">
        {/* Custom Color Inputs for Dominant Colors */}
        <div className="colors-item-anim space-y-3 pt-2">
          <Label>Fine-tune Dominant Brand Colors</Label>

          <div
            className={cn(
              "grid gap-3 pt-2",
              displaySwatches.length === 1 && "grid-cols-1",
              displaySwatches.length === 2 && "grid-cols-1 sm:grid-cols-2",
              displaySwatches.length === 3 && "grid-cols-1 sm:grid-cols-3",
              displaySwatches.length >= 4 && "grid-cols-2 sm:grid-cols-4"
            )}
          >
            {displaySwatches.map((swatch, idx) => {
              const meta = getSwatchMeta(swatch.role, idx)
              const isValid = chroma.valid(swatch.hex)
              const hexVal = isValid ? chroma(swatch.hex).hex() : "#6366f1"

              return (
                <div key={swatch.id || idx} className="space-y-1.5">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[11px] font-semibold text-foreground">
                      {meta.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      aria-label={`${meta.label} picker`}
                      value={hexVal}
                      onChange={(e) =>
                        handleColorChange(swatch.id, e.target.value)
                      }
                      className="size-8 cursor-pointer rounded-lg border-0 bg-transparent"
                    />
                    <Input
                      value={swatch.hex}
                      onChange={(e) =>
                        handleColorChange(swatch.id, e.target.value)
                      }
                      className="h-8 rounded-lg font-mono text-xs uppercase"
                    />
                  </div>
                </div>
              )
            })}
          </div>

          {/* Style Guidance Micro-Tip */}
          <div className="colors-item-anim flex items-start gap-2.5 rounded-xl p-3 text-[11px] text-muted-foreground">
            <div>
              <span className="mr-1 font-semibold text-foreground">
                {activeMovement.label} Style:
              </span>
              {(activeMovement.id === "quiet-precision" ||
                activeMovement.id === "semi-flat") &&
                "Quiet Precision favors disciplined neutral foundations with crisp, purposeful primary accents for maximum cognitive clarity."}
              {(activeMovement.id === "expressive-energy" ||
                activeMovement.id === "maximalism" ||
                activeMovement.id === "neo-brutalism") &&
                "Expressive Energy thrives on bold chromatic contrast, saturated primary tones, and unapologetic accent energy."}
              {(activeMovement.id === "soft-tactility" ||
                activeMovement.id === "neumorphism") &&
                "Soft Tactility relies on gentle, low-contrast tonal steps to simulate soft physical extrusion and ambient indentations."}
              {(activeMovement.id === "editorial-character" ||
                activeMovement.id === "minimalism") &&
                "Editorial Character pairs warm, literary neutrals with rich, ink-like dark accents for refined storytelling poise."}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
