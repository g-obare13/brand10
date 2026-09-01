import { useBrandStore } from "@/store/brandStore"
import { Label } from "@/components/ui/label"
import { IconTypography, IconCheck } from "@tabler/icons-react"
import { cn } from "@/lib/utils"

const FONT_PAIRINGS = [
  {
    name: "Modern Tech Studio",
    display: "Plus Jakarta Sans",
    body: "Inter",
    mono: "JetBrains Mono",
    ratio: 1.25,
  },
  {
    name: "Frontier Deep Tech",
    display: "Syne",
    body: "Space Grotesk",
    mono: "Space Mono",
    ratio: 1.25,
  },
  {
    name: "Editorial Luxury",
    display: "Playfair Display",
    body: "Outfit",
    mono: "DM Mono",
    ratio: 1.333,
  },
  {
    name: "Contemporary Clean",
    display: "Outfit",
    body: "Inter",
    mono: "JetBrains Mono",
    ratio: 1.2,
  },
]

export function StepTypography() {
  const brand = useBrandStore()

  const handleSelectPairing = (pairing: (typeof FONT_PAIRINGS)[number]) => {
    brand.setTypography({
      displayFont: pairing.display,
      bodyFont: pairing.body,
      monoFont: pairing.mono,
      typeScaleRatio: pairing.ratio,
    })
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
          <IconTypography size={13} />
          Step 4: Typography Pairing
        </div>
        <h3 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
          Hierarchy &amp; Type Scale
        </h3>
        <p className="text-xs text-muted-foreground">
          Select cohesive Google Font pairings optimized for headings, body copy, and UI controls.
        </p>
      </div>

      <div className="space-y-5">
        {/* Curated Pairings */}
        <div className="space-y-2">
          <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Curated Font Pairings
          </Label>
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            {FONT_PAIRINGS.map((pairing) => {
              const isSelected =
                brand.displayFont === pairing.display &&
                brand.bodyFont === pairing.body

              return (
                <button
                  key={pairing.name}
                  type="button"
                  onClick={() => handleSelectPairing(pairing)}
                  className={cn(
                    "flex cursor-pointer flex-col justify-between rounded-2xl border p-4 text-left transition-all",
                    isSelected
                      ? "border-primary bg-primary/5 shadow-xs"
                      : "border-border/80 bg-card/60 hover:border-primary/50 hover:bg-muted/60"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-foreground">
                      {pairing.name}
                    </span>
                    {isSelected && (
                      <IconCheck size={16} className="text-primary" />
                    )}
                  </div>

                  <div className="mt-3 space-y-1">
                    <span
                      className="block text-lg font-bold text-foreground"
                      style={{ fontFamily: `"${pairing.display}", sans-serif` }}
                    >
                      {pairing.display}
                    </span>
                    <span
                      className="block text-xs text-muted-foreground"
                      style={{ fontFamily: `"${pairing.body}", sans-serif` }}
                    >
                      Body: {pairing.body} · Mono: {pairing.mono}
                    </span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Type Scale Ratio Slider */}
        <div className="space-y-3 rounded-2xl border border-border/80 bg-card/60 p-4">
          <div className="flex items-center justify-between text-xs font-bold text-foreground">
            <span className="uppercase tracking-wider text-muted-foreground">
              Modular Scale Multiplier
            </span>
            <span className="font-mono text-primary">
              {brand.typeScaleRatio} (
              {brand.typeScaleRatio >= 1.333
                ? "Perfect Fourth"
                : brand.typeScaleRatio >= 1.25
                  ? "Major Third"
                  : "Minor Third"}
              )
            </span>
          </div>

          <input
            type="range"
            min="1.15"
            max="1.414"
            step="0.025"
            value={brand.typeScaleRatio}
            onChange={(e) =>
              brand.setTypography({ typeScaleRatio: parseFloat(e.target.value) })
            }
            className="h-2 w-full cursor-pointer rounded-lg bg-muted accent-primary"
          />

          <p className="text-[11px] text-muted-foreground leading-relaxed">
            Controls mathematical proportional stepping from H1 (36px+) down to caption copy (11px).
          </p>
        </div>
      </div>
    </div>
  )
}
