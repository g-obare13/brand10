import { useNavigate } from "@tanstack/react-router"
import { useBrandStore } from "@/store/brandStore"
import { Button } from "@/components/ui/button"
import {
  IconSparkles,
  IconArrowRight,
  IconCheck,
  IconPalette,
  IconTypography,
  IconPhoto,
  IconIcons,
} from "@tabler/icons-react"

interface StepSummaryProps {
  projectId: string
}

export function StepSummary({ projectId }: StepSummaryProps) {
  const brand = useBrandStore()
  const navigate = useNavigate()

  const handleFinish = async () => {
    await brand.saveToSupabase()
    navigate({
      to: "/studio/$projectId",
      params: { projectId },
    })
  }

  const primaryColor =
    brand.colorPalette.find((c) => c.role === "primary")?.hex || "#6366f1"

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center sm:text-left">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-500">
          <IconCheck size={14} className="stroke-[2.5]" />
          Setup Complete
        </div>
        <h3 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Brand Architecture Ready
        </h3>
        <p className="text-xs text-muted-foreground max-w-lg">
          Your core brand identity system is generated and synchronized. You can now jump into the full studio to fine-tune tokens, create mockups, or export assets.
        </p>
      </div>

      {/* Summary Tokens Checklist */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="flex items-center gap-3 rounded-2xl border border-border/80 bg-card/60 p-4">
          <div
            className="flex size-9 items-center justify-center rounded-xl text-white shadow-xs"
            style={{ backgroundColor: primaryColor }}
          >
            <IconPalette size={18} />
          </div>
          <div>
            <span className="block text-xs font-bold text-foreground">
              {brand.colorPalette.length} Color Swatches
            </span>
            <span className="block text-[11px] text-muted-foreground">
              Primary {primaryColor}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-border/80 bg-card/60 p-4">
          <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary shadow-xs">
            <IconTypography size={18} />
          </div>
          <div>
            <span className="block text-xs font-bold text-foreground">
              {brand.displayFont} + {brand.bodyFont}
            </span>
            <span className="block text-[11px] text-muted-foreground">
              Scale ratio {brand.typeScaleRatio}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-border/80 bg-card/60 p-4">
          <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary shadow-xs">
            <IconPhoto size={18} />
          </div>
          <div>
            <span className="block text-xs font-bold text-foreground">
              {brand.imageryMood || "Minimal"} Photography
            </span>
            <span className="block text-[11px] text-muted-foreground capitalize">
              Overlay: {brand.imageryOverlay || "None"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-border/80 bg-card/60 p-4">
          <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary shadow-xs">
            <IconIcons size={18} />
          </div>
          <div>
            <span className="block text-xs font-bold text-foreground capitalize">
              {brand.iconStyle || "Stroke"} Icons ({brand.iconRadius}px)
            </span>
            <span className="block text-[11px] text-muted-foreground">
              Keyline {brand.iconStroke || 2.0}px
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-2">
        <Button
          variant="shiny"
          size="lg"
          onClick={handleFinish}
          className="w-full cursor-pointer rounded-2xl py-6 text-sm font-semibold shadow-xl"
          icon={<IconSparkles size={16} />}
        >
          Open Brand Studio
          <IconArrowRight size={16} className="ml-1" />
        </Button>
      </div>
    </div>
  )
}
