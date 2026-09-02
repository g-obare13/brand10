import { useRef, useEffect } from "react"
import { useBrandStore } from "@/store/brandStore"
import { generateTonalShades } from "@/lib/colorUtils"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { IconShieldCheck } from "@tabler/icons-react"
import WordReveal from "@/components/shared/WordReveal"
import { gsap } from "gsap"
import chroma from "chroma-js"

export function StepColors() {
  const brand = useBrandStore()
  const containerRef = useRef<HTMLDivElement>(null)

  const primarySwatch =
    brand.colorPalette.find((c) => c.role === "primary") ||
    brand.colorPalette[0]
  const secondarySwatch =
    brand.colorPalette.find((c) => c.role === "secondary") ||
    brand.colorPalette[1]

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
        <WordReveal
          as="h4"
          stagger={0.03}
          duration={1.2}
          disableScrollTrigger={true}
          className="mb-2"
        >
          Palette &amp; Accessibility Scale
        </WordReveal>
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
        </div>
      </div>
    </div>
  )
}
