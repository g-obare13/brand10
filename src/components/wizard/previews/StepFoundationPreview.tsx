import { DESIGN_MOVEMENTS } from "@/data/wizard"
import { useBrandStore } from "@/store/brandStore"
import { getPreviewTheme } from "./previewTheme"
import type { PreviewStyleConfig } from "./previewTheme"
import { Skeleton } from "@/components/ui/skeleton"
import {
  MovementClaimableBalance,
  MovementNewMilestone,
} from "./FoundationDemoCards"
import GlassPanel from "@/components/shared/GlassPanel"
import { Badge } from "@/components/ui/badge"
import { Circle } from "@boxicons/react"

export function StepFoundationPreviewSkeleton({
  theme,
}: {
  theme: PreviewStyleConfig
}) {
  return (
    <div className={theme.container}>
      {/* 1. Hero Identity Skeleton */}
      <div className={theme.heroCard}>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-32 rounded-full" />
            <Skeleton className="h-5 w-20 rounded-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-8 w-2/3 rounded-xl" />
            <Skeleton className="h-4 w-5/6 rounded-md" />
            <Skeleton className="h-4 w-1/2 rounded-md" />
          </div>
          <div className="flex items-center gap-2 pt-1">
            <Skeleton className="h-3 w-12 rounded-md" />
            <Skeleton className="h-3 w-48 rounded-md" />
          </div>
        </div>
      </div>

      {/* 2. Mission & Vision Dual Tiles Skeleton */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className={theme.tileCard}>
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-24 rounded-md" />
            <Skeleton className="h-4 w-16 rounded-full" />
          </div>
          <div className="space-y-2 py-2">
            <Skeleton className="h-4 w-full rounded-md" />
            <Skeleton className="h-4 w-4/5 rounded-md" />
          </div>
          <Skeleton className="h-3 w-24 rounded-md" />
        </div>

        <div className={theme.tileCard}>
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-24 rounded-md" />
            <Skeleton className="h-4 w-16 rounded-full" />
          </div>
          <div className="space-y-2 py-2">
            <Skeleton className="h-4 w-full rounded-md" />
            <Skeleton className="h-4 w-4/5 rounded-md" />
          </div>
          <Skeleton className="h-3 w-24 rounded-md" />
        </div>
      </div>

      {/* 3. Live UI Component Demos Skeleton */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className={theme.interactiveCard}>
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-28 rounded-md" />
            <Skeleton className="h-5 w-20 rounded-full" />
          </div>
          <Skeleton className="h-10 w-40 rounded-xl" />
          <div className="space-y-2 pt-2">
            <Skeleton className="h-3 w-full rounded-md" />
            <Skeleton className="h-3 w-full rounded-md" />
            <Skeleton className="h-3 w-full rounded-md" />
          </div>
          <Skeleton className="h-9 w-full rounded-xl" />
        </div>

        <div className={theme.interactiveCard}>
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-28 rounded-md" />
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
          <Skeleton className="h-5 w-44 rounded-md" />
          <div className="space-y-2 pt-1">
            <Skeleton className="h-8 w-full rounded-xl" />
            <div className="grid grid-cols-2 gap-2">
              <Skeleton className="h-8 w-full rounded-xl" />
              <Skeleton className="h-8 w-full rounded-xl" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 pt-1">
            <Skeleton className="h-9 w-full rounded-xl" />
            <Skeleton className="h-9 w-full rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  )
}

export function StepFoundationPreview() {
  const brand = useBrandStore()

  const primaryColor =
    brand.colorPalette.find((c) => c.role === "primary")?.hex || "#6366f1"

  // Determine active movement id from store or tone matching fallback
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

  const theme = getPreviewTheme(activeMovement.id)

  if (brand.isLoading) {
    return <StepFoundationPreviewSkeleton theme={theme} />
  }

  return (
    <div className={theme.container}>
      {/* 1. Brand Workspace Hero Identity Tile */}
      <GlassPanel
        blur="none"
        noise
        noiseOpacity={0.02}
        className={theme.heroCard}
      >
        {/* Glow / Backdrop Accent */}
        {theme.heroGlow !== "hidden" && (
          <div
            className={theme.heroGlow}
            style={{ backgroundColor: primaryColor }}
          />
        )}

        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <Badge className={theme.badge} showDivider={true} icon={<Circle />}>
              {activeMovement.label} Style
            </Badge>
            <span className={theme.accentPill}>{activeMovement.badge}</span>
          </div>

          <div className="space-y-1.5">
            <h2>{brand.brandName || "Your Brand Workspace"}</h2>
            <p className="max-w-xl">
              {activeMovement.vibe ||
                "Configure your core brand essence, mission, and calibrated tones."}
            </p>
          </div>
        </div>
      </GlassPanel>

      {/* 2. Mission & Vision Statement Dual Tiles */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Mission Preview */}
        <div className={theme.tileCard}>
          <div className="flex items-center justify-between">
            <span className="font-medium">Brand Mission</span>
            <Badge className={theme.badge}>Core Purpose</Badge>
          </div>
          <p>
            &ldquo;
            {brand.mission ||
              "Define the fundamental problem your brand solves for the world."}
            &rdquo;
          </p>
        </div>

        {/* Vision Preview */}
        <div className={theme.tileCard}>
          <div className="flex items-center justify-between">
            <span className="font-medium">Brand Vision</span>
            <Badge className={theme.badge}>Long Horizon</Badge>
          </div>
          <p>
            &ldquo;
            {brand.vision ||
              "Define the future world your brand is actively shaping over the next decade."}
            &rdquo;
          </p>
        </div>
      </div>

      {/* 3. Live UI Component Theme Simulation */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <MovementClaimableBalance theme={theme} primaryColor={primaryColor} />
        <MovementNewMilestone theme={theme} primaryColor={primaryColor} />
      </div>
    </div>
  )
}
