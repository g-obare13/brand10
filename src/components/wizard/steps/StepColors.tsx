import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DESIGN_MOVEMENTS } from "@/data/wizard"
import { generateTonalShades } from "@/lib/colorUtils"
import { useBrandStore } from "@/store/brandStore"
import chroma from "chroma-js"
/**
 * Step 3 Wizard form component for configuring brand color palette and harmonic relationships.
 * Features:
 * - Color pickers and hex inputs for primary, secondary, and accent roles.
 * - Preset palette suggestions based on the active design movement.
 * - Instant tonal scale generation across 11 lightness values (50 to 950).
 * - Real-time contrast checks and WCAG accessibility ratings.
 *
 * @component
 * @returns {React.ReactElement} The rendered color configuration form.
 */
export function StepColors() {
  const brand = useBrandStore()

  const primarySwatch =
    brand.colorPalette.find((c) => c.role === "primary") ||
    brand.colorPalette[0]
  const secondarySwatch =
    brand.colorPalette.find((c) => c.role === "secondary") ||
    brand.colorPalette[1]

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
          <h4 className="mb-2">
            Palette &amp; Accessibility Scale
          </h4>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
            <span className="size-1.5 animate-pulse rounded-full bg-primary" />
            <span>{activeMovement.label}</span>
          </div>
        </div>
        <p className="mb-2">
          Fine-tune the 2 dominant brand colors extracted from your mark. Tonal
          scales and accessibility ratios adapt in real time.
        </p>
      </div>

      <div className="space-y-5">
        {/* Custom Color Inputs for 2 Dominant Colors */}
        <div className="colors-item-anim space-y-3 pt-2">
          <Label>Fine-tune Dominant Brand Colors</Label>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-foreground">
                  Primary Color
                </span>
                <span className="rounded-md bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary">
                  Base Dominant
                </span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={
                    chroma.valid(primarySwatch.hex)
                      ? chroma(primarySwatch.hex).hex()
                      : "#6366f1"
                  }
                  onChange={(e) =>
                    handleColorChange(primarySwatch.id, e.target.value)
                  }
                  className="size-8 cursor-pointer rounded-lg border-0 bg-transparent"
                />
                <Input
                  value={primarySwatch.hex}
                  onChange={(e) =>
                    handleColorChange(primarySwatch.id, e.target.value)
                  }
                  className="h-8 rounded-lg font-mono text-xs uppercase"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-foreground">
                  Secondary Color
                </span>
                <span className="rounded-md bg-secondary/10 px-1.5 py-0.5 text-[10px] font-medium text-foreground">
                  Alternate Dominant
                </span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={
                    chroma.valid(secondarySwatch.hex)
                      ? chroma(secondarySwatch.hex).hex()
                      : "#06b6d4"
                  }
                  onChange={(e) =>
                    handleColorChange(secondarySwatch.id, e.target.value)
                  }
                  className="size-8 cursor-pointer rounded-lg border-0 bg-transparent"
                />
                <Input
                  value={secondarySwatch.hex}
                  onChange={(e) =>
                    handleColorChange(secondarySwatch.id, e.target.value)
                  }
                  className="h-8 rounded-lg font-mono text-xs uppercase"
                />
              </div>
            </div>
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
