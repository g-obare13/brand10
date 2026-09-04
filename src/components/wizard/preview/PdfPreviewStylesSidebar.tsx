import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { DESIGN_MOVEMENTS } from "@/data/wizard"
import type { PreviewStyleId } from "@/components/wizard/preview/pages/A4PageFrame"
import { IconCheck } from "@tabler/icons-react"

export interface StyleOption {
  id: PreviewStyleId
  title: string
  subtitle: string
  badge: string
  description: string
  paletteAccent: string
  gradient: string
}

const MOVEMENT_META: Record<
  string,
  {
    subtitle: string
    paletteAccent: string
    gradient: string
  }
> = {
  "quiet-precision": {
    subtitle: "Clean & Architectural",
    paletteAccent: "#71717a",
    gradient: "from-zinc-100 to-zinc-200 dark:from-zinc-900 dark:to-zinc-800",
  },
  "expressive-energy": {
    subtitle: "Dynamic & Bold",
    paletteAccent: "#ec4899",
    gradient: "from-fuchsia-500/20 via-rose-500/20 to-amber-500/20",
  },
  "soft-tactility": {
    subtitle: "Organic & Tactile",
    paletteAccent: "#0ea5e9",
    gradient: "from-sky-500/20 via-teal-500/20 to-indigo-500/20",
  },
  "editorial-character": {
    subtitle: "Refined & Literary",
    paletteAccent: "#d97706",
    gradient: "from-amber-100 to-stone-200 dark:from-amber-950/30 dark:to-stone-900",
  },
}

export const PREVIEW_STYLES: StyleOption[] = DESIGN_MOVEMENTS.map((movement) => {
  const meta = MOVEMENT_META[movement.id] ?? {
    subtitle: movement.vibe,
    paletteAccent: "#71717a",
    gradient: "from-zinc-100 to-zinc-200 dark:from-zinc-900 dark:to-zinc-800",
  }

  return {
    id: movement.id as PreviewStyleId,
    title: movement.label,
    subtitle: meta.subtitle,
    badge: movement.badge,
    description: movement.tagline || movement.description,
    paletteAccent: meta.paletteAccent,
    gradient: meta.gradient,
  }
})

interface PdfPreviewStylesSidebarProps {
  activeStyle: PreviewStyleId
  onSelectStyle: (style: PreviewStyleId) => void
}

export function PdfPreviewStylesSidebar({
  activeStyle,
  onSelectStyle,
}: PdfPreviewStylesSidebarProps) {
  return (
    <aside className="flex flex-col gap-4 rounded-3xl bg-card/85 p-5 backdrop-blur-xl">
      {/* Header */}

      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <h4 className="mb-2"> Select Presentation Style</h4>
        </div>
        <p className="mb-2">
          Choose a visual aesthetic for your brand manual. All pages update
          dynamically.
        </p>
      </div>

      {/* Style List */}
      <div className="space-y-2.5">
        {PREVIEW_STYLES.map((style) => {
          const isSelected = activeStyle === style.id

          return (
            <button
              key={style.id}
              type="button"
              onClick={() => onSelectStyle(style.id)}
              className={cn(
                "group relative w-full cursor-pointer rounded-2xl border p-4 text-left transition-all duration-200",
                isSelected
                  ? "border-primary bg-primary/5 shadow-sm ring-1 ring-primary/40"
                  : "border-border/60 bg-card/60 hover:border-border hover:bg-card/90"
              )}
            >
              {/* Active Indicator Strip */}
              {isSelected && (
                <div className="absolute top-4 right-4 flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-xs">
                  <IconCheck size={12} className="stroke-[3]" />
                </div>
              )}

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold tracking-tight text-foreground">
                    {style.title}
                  </span>
                  <Badge
                    variant={isSelected ? "default" : "outline"}
                    className="h-4.5 py-0 text-[10px]"
                  >
                    {style.badge}
                  </Badge>
                </div>

                <div className="text-[11px] leading-relaxed text-muted-foreground">
                  {style.description}
                </div>

                {/* Aesthetic preview bar */}
                <div
                  className={cn(
                    "h-1.5 w-full rounded-full bg-linear-to-r",
                    style.gradient
                  )}
                />
              </div>
            </button>
          )
        })}
      </div>
    </aside>
  )
}
