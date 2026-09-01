import { useBrandStore } from "@/store/brandStore"
import GlassPanel from "@/components/shared/GlassPanel"
import { IconPhoto, IconSparkles } from "@tabler/icons-react"
import { cn } from "@/lib/utils"

export function StepImageryPreview() {
  const brand = useBrandStore()
  const primaryColor =
    brand.colorPalette.find((c) => c.role === "primary")?.hex || "#6366f1"

  const moodGradients: Record<string, string> = {
    minimal: "from-neutral-200/80 via-neutral-100 to-neutral-300/60 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-950",
    cinematic: "from-indigo-950 via-slate-900 to-black text-white",
    vibrant: "from-purple-600/30 via-pink-500/20 to-amber-500/20",
    editorial: "from-amber-100/60 via-stone-100 to-orange-100/40 dark:from-stone-900 dark:via-stone-800 dark:to-zinc-950",
  }

  return (
    <div className="space-y-4">
      {/* 1. Primary Mood Board Tile */}
      <GlassPanel
        blur="none"
        noise
        noiseOpacity={0.02}
        className={cn(
          "relative overflow-hidden rounded-3xl border border-border/80 p-8 shadow-sm space-y-4 bg-linear-to-br transition-all duration-300 min-h-[220px] flex flex-col justify-between",
          moodGradients[brand.imageryMood || "minimal"]
        )}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <IconPhoto size={18} className="text-primary" />
            <span className="text-xs font-bold uppercase tracking-wider text-foreground">
              Mood: {brand.imageryMood || "Minimal"}
            </span>
          </div>
          <span className="rounded-full border border-border bg-card/60 px-3 py-1 font-mono text-[10px] text-foreground">
            Filter: {brand.imageryOverlay}
          </span>
        </div>

        <div className="rounded-2xl border border-border/40 bg-card/50 p-5 backdrop-blur-md space-y-2">
          <h4 className="text-base font-bold text-foreground">
            {brand.imageryMood === "cinematic"
              ? "Moody Obsidian Directional Art"
              : brand.imageryMood === "vibrant"
                ? "3D Glassmorphic Chromatic Geometry"
                : brand.imageryMood === "editorial"
                  ? "Warm Tactile Storytelling & Grain"
                  : "High-Key Crisp Studio Minimal"}
          </h4>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {brand.imageryOverlay === "tint"
              ? `Filtered with a gentle brand color wash (${primaryColor}).`
              : brand.imageryOverlay === "duotone"
                ? "Split-mapped into dynamic dual-tone contrast curves."
                : "Pure unaltered photographic clarity."}
          </p>
        </div>
      </GlassPanel>

      {/* 2. Photo Treatment Multi-Tile Showcase */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {["Standard Light", "Atmospheric Mid", "Obsidian Dark"].map((label, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center justify-center rounded-2xl border border-border/80 bg-card/80 p-5 text-center space-y-2"
          >
            <div
              className="size-12 rounded-xl border border-border shadow-xs flex items-center justify-center text-xs font-bold"
              style={{
                backgroundColor:
                  idx === 0
                    ? `${primaryColor}20`
                    : idx === 1
                      ? `${primaryColor}60`
                      : `${primaryColor}cc`,
                color: idx === 2 ? "#ffffff" : primaryColor,
              }}
            >
              0{idx + 1}
            </div>
            <span className="text-xs font-semibold text-foreground">{label}</span>
            <span className="font-mono text-[10px] text-muted-foreground">Tone Ramp</span>
          </div>
        ))}
      </div>
    </div>
  )
}
