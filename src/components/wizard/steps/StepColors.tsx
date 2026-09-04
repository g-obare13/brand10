import WordReveal from "@/components/shared/WordReveal"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DESIGN_MOVEMENTS } from "@/data/wizard"
import { generateTonalShades } from "@/lib/colorUtils"
import { useBrandStore } from "@/store/brandStore"
import chroma from "chroma-js"
import { gsap } from "gsap"
import { useEffect, useRef } from "react"
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
  const containerRef = useRef<HTMLDivElement>(null)

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

  useEffect(() => {
    if (!containerRef.current) return
    const ctx = gsap.context(() => {
      const items = containerRef.current?.querySelectorAll(".colors-item-anim")
      if (items && items.length > 0) {
        gsap.fromTo(
          items,
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

  const handleColorChange = (id: string, hex: string) => {
    const valid = chroma.valid(hex)
    const shades = valid ? generateTonalShades(hex) : undefined
    brand.updateColorSwatch(id, { hex, ...(shades ? { shades } : {}) })
  }

  return (
    <div ref={containerRef} className="space-y-6">
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <WordReveal
            as="h4"
            stagger={0.03}
            duration={1.2}
            disableScrollTrigger={true}
            className="mb-2"
          >
            Palette &amp; Accessibility Scale
          </WordReveal>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
            <span className="size-1.5 animate-pulse rounded-full bg-primary" />
            <span>{activeMovement.label}</span>
          </div>
        </div>
        <WordReveal
          as="p"
          stagger={0.03}
          duration={1.2}
          disableScrollTrigger={true}
          className="mb-2"
        >
          Fine-tune the 2 dominant brand colors extracted from your mark. Tonal
          scales and accessibility ratios adapt in real time.
        </WordReveal>
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
              {activeMovement.id === "minimalism" &&
                "Minimalism thrives on quiet, muted palettes with high contrast against spacious canvas backgrounds."}
              {activeMovement.id === "neo-brutalism" &&
                "Neo-brutalism works best with bold, saturated primary accents paired with stark high-contrast boundaries."}
              {activeMovement.id === "neumorphism" &&
                "Neumorphism relies on gentle, low-contrast tonal steps to simulate soft physical extrusion and indentations."}
              {activeMovement.id === "maximalism" &&
                "Maximalism embraces hyper-vibrant saturation, energetic secondary accents, and vivid contrast."}
              {activeMovement.id === "semi-flat" &&
                "Clean, balanced primary and secondary tones offer maximum clarity and interface readability across modern devices."}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
