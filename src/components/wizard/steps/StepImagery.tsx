import { useBrandStore } from "@/store/brandStore"
import { Label } from "@/components/ui/label"
import { IconPhoto, IconCheck } from "@tabler/icons-react"
import { cn } from "@/lib/utils"

const MOOD_OPTIONS = [
  {
    id: "minimal",
    title: "Studio Minimal",
    desc: "Clean soft shadows, high-key ambient light, pure neutral backdrops.",
    badge: "Modern Clean",
  },
  {
    id: "cinematic",
    title: "Moody & Cinematic",
    desc: "Dramatic high contrast, directional rim lighting, deep obsidian blacks.",
    badge: "High Contrast",
  },
  {
    id: "vibrant",
    title: "Vibrant & 3D Glass",
    desc: "Translucent frosted glass, chromatic gradients, dynamic perspectives.",
    badge: "Playful Tech",
  },
  {
    id: "editorial",
    title: "Editorial & Candid",
    desc: "Authentic human moments, natural sunlight, warm tactile grain.",
    badge: "Human Story",
  },
] as const

const OVERLAY_OPTIONS = [
  { id: "none", title: "Natural Pass-through", desc: "No color filters applied." },
  { id: "tint", title: "Brand Color Wash", desc: "10-15% subtle brand tint overlay." },
  { id: "duotone", title: "Duotone Contrast", desc: "Two-tone primary/neutral mapping." },
] as const

export function StepImagery() {
  const brand = useBrandStore()

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
          <IconPhoto size={13} />
          Step 5: Imagery &amp; Photography
        </div>
        <h3 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
          Visual Mood &amp; Treatment
        </h3>
        <p className="text-xs text-muted-foreground">
          Establish photography guidelines, ambient lighting direction, and asset tint rules.
        </p>
      </div>

      <div className="space-y-5">
        {/* Photography Mood Direction */}
        <div className="space-y-2">
          <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Photography Direction Preset
          </Label>
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            {MOOD_OPTIONS.map((mood) => {
              const isSelected = (brand.imageryMood || "minimal") === mood.id

              return (
                <button
                  key={mood.id}
                  type="button"
                  onClick={() => brand.setImagery({ mood: mood.id })}
                  className={cn(
                    "flex cursor-pointer flex-col justify-between rounded-2xl border p-4 text-left transition-all",
                    isSelected
                      ? "border-primary bg-primary/5 shadow-xs"
                      : "border-border/80 bg-card/60 hover:border-primary/50 hover:bg-muted/60"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="rounded-full border border-border bg-muted/40 px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
                      {mood.badge}
                    </span>
                    {isSelected && (
                      <IconCheck size={16} className="text-primary" />
                    )}
                  </div>

                  <div className="mt-3 space-y-1">
                    <span className="block text-sm font-bold text-foreground">
                      {mood.title}
                    </span>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {mood.desc}
                    </p>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Color Treatment / Overlay */}
        <div className="space-y-2 pt-1">
          <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Color Treatment Overlay
          </Label>
          <div className="grid grid-cols-3 gap-2.5">
            {OVERLAY_OPTIONS.map((overlay) => {
              const isSelected =
                (brand.imageryOverlay || "none") === overlay.id

              return (
                <button
                  key={overlay.id}
                  type="button"
                  onClick={() => brand.setImagery({ overlay: overlay.id })}
                  className={cn(
                    "flex cursor-pointer flex-col justify-between rounded-2xl border p-3.5 text-left transition-all",
                    isSelected
                      ? "border-primary bg-primary/5 shadow-xs"
                      : "border-border/80 bg-card/60 hover:border-primary/50 hover:bg-muted/60"
                  )}
                >
                  <span className="text-xs font-bold text-foreground">
                    {overlay.title}
                  </span>
                  <span className="mt-1 text-[11px] text-muted-foreground">
                    {overlay.desc}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
