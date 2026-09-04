import { DESIGN_MOVEMENTS } from "@/data/wizard"
import type { BrandPillar } from "@/store/brandStore"
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

/**
 * Loading skeleton component for the StepFoundationPreview panel.
 * Mimics the card structure of the active design movement theme while data loads.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {PreviewStyleConfig} props.theme - Style configuration matching the active design movement.
 * @returns {React.ReactElement} The rendered skeleton placeholder.
 */
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

      {/* 3. Pillars Skeleton */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className={theme.tileCard}>
            <Skeleton className="h-3 w-8 rounded-md" />
            <Skeleton className="my-1.5 h-4 w-20 rounded-md" />
            <Skeleton className="h-3 w-full rounded-md" />
          </div>
        ))}
      </div>

      {/* 4. Live UI Component Demos Skeleton */}
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

export interface StepFoundationPreviewProps {
  isLoading?: boolean
}

/**
 * Live interactive preview of brand foundation (mission, vision, values, tone, and design movement).
 * Features:
 * - Movement-specific aesthetic theme rendering (Swiss, Cyberpunk, Neo-Brutalist, etc.).
 * - GSAP staggered entry animations on mount and movement transitions.
 * - Interactive UI demo widgets with simulated transactions and milestones.
 * - Seamless integration with design movements and tone rating telemetry.
 *
 * @component
 * @param {StepFoundationPreviewProps} [props] - The component props.
 * @param {boolean} [props.isLoading] - Optional manual override for loading skeleton state.
 * @returns {React.ReactElement} The rendered foundation preview showcase.
 */
export function StepFoundationPreview({
  isLoading,
}: StepFoundationPreviewProps = {}) {
  const brand = useBrandStore()
  const effectiveLoading = isLoading ?? (brand.isLoading || !brand.projectId)
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

  if (effectiveLoading) {
    return <StepFoundationPreviewSkeleton theme={theme} />
  }

  return (
    <div className={theme.container}>
      {/* 1. Brand Workspace Hero Identity Tile */}
      <GlassPanel
        blur="none"
        noise
        noiseOpacity={0.02}
        className={`${theme.heroCard} preview-card-anim`}
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
        <div className={`${theme.tileCard} preview-card-anim`}>
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
        <div className={`${theme.tileCard} preview-card-anim`}>
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

      {/* 3. Core Brand Pillars Preview Grid */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-muted-foreground uppercase">
            Brand Pillars
          </span>
          <Badge className={theme.badge}>3 Pillars</Badge>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {[0, 1, 2].map((idx) => {
            const pillar = (brand.brandPillars as (BrandPillar | undefined)[])[idx]
            const title = pillar ? pillar.title.trim() : ""
            const desc = pillar ? pillar.desc.trim() : ""
            return (
              <div
                key={idx}
                className={`${theme.tileCard} preview-card-anim flex flex-col justify-between space-y-2 p-3.5`}
              >
                <div className="space-y-1">
                  <div className="text-[11px] font-bold text-muted-foreground">
                    0{idx + 1}
                  </div>
                  <div className="text-sm font-semibold text-foreground">
                    {title || `Pillar 0${idx + 1}`}
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {desc || "Awaiting pillar description in Step 1."}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <h6>Example Card</h6>

      {/* 3. Live UI Component Theme Simulation */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="preview-card-anim">
          <MovementClaimableBalance theme={theme} primaryColor={primaryColor} />
        </div>
        <div className="preview-card-anim">
          <MovementNewMilestone theme={theme} primaryColor={primaryColor} />
        </div>
      </div>
    </div>
  )
}
