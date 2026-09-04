import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { PreviewStyleId } from "./pages/A4PageFrame"
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

export const PREVIEW_STYLES: StyleOption[] = [
  {
    id: "minimal",
    title: "Minimal",
    subtitle: "Clean & Architectural",
    badge: "Modern Clean",
    description: "Generous whitespace, refined hairline borders, and neutral tonal balance.",
    paletteAccent: "#71717a",
    gradient: "from-zinc-100 to-zinc-200 dark:from-zinc-900 dark:to-zinc-800",
  },
  {
    id: "cinematic",
    title: "Cinematic",
    subtitle: "Moody & High Contrast",
    badge: "Obsidian Deep",
    description: "Deep dark backdrops, intense directional lighting, and glowing accent rims.",
    paletteAccent: "#3b82f6",
    gradient: "from-zinc-900 via-blue-950 to-zinc-950",
  },
  {
    id: "vibrant",
    title: "Vibrant",
    subtitle: "Dynamic & Colorful",
    badge: "Playful Energy",
    description: "High chroma gradients, energetic visual punch, and modern glass accents.",
    paletteAccent: "#ec4899",
    gradient: "from-fuchsia-500/20 via-rose-500/20 to-amber-500/20",
  },
  {
    id: "candid",
    title: "Candid",
    subtitle: "Editorial & Tactile",
    badge: "Human Story",
    description: "Warm paper texture tones, natural light framing, and documentary warmth.",
    paletteAccent: "#d97706",
    gradient: "from-amber-100 to-stone-200 dark:from-amber-950/30 dark:to-stone-900",
  },
]

interface PdfPreviewStylesSidebarProps {
  activeStyle: PreviewStyleId
  onSelectStyle: (style: PreviewStyleId) => void
}

export function PdfPreviewStylesSidebar({
  activeStyle,
  onSelectStyle,
}: PdfPreviewStylesSidebarProps) {
  return (
    <aside className="flex flex-col gap-4 rounded-3xl border border-border/80 bg-card/85 p-5 backdrop-blur-xl shadow-sm">
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
            Document Styles
          </span>
          <Badge variant="outline" className="font-mono text-[10px]">
            {PREVIEW_STYLES.length} Styles
          </Badge>
        </div>
        <h3 className="text-base font-bold text-foreground">Select Presentation Style</h3>
        <p className="text-xs text-muted-foreground">
          Choose a visual aesthetic for your brand manual. All pages update dynamically.
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
                    className="text-[10px] py-0 h-4.5"
                  >
                    {style.badge}
                  </Badge>
                </div>

                <div className="text-[11px] text-muted-foreground leading-relaxed">
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
