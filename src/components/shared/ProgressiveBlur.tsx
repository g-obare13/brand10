"use client"

import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion"
import { cn } from "@/lib/utils"
import type { CSSProperties } from "react"
import { useMemo } from "react"

// Reads --pb-background for the optional solid-fade layer only. Defaults to
// the app's own shadcn --background token when present, so the fade lands on
// the surrounding surface color out of the box. The light-dark() fallback
// only kicks in for apps with neither shadcn tokens nor a declared
// color-scheme, so it degrades to plain white — override --pb-background
// directly (className or style) if the edge sits on a dark surface without
// shadcn tokens.
const componentThemeClassName =
  "[--pb-background:var(--background,light-dark(#ffffff,#0a0a0a))]"

const MAX_LAYERS = 16
// backdrop-filter is a per-layer paint cost, so reduced motion drops straight
// to a single band — same silhouette, a sixth of the paints.
const REDUCED_MOTION_LAYERS = 1

type ProgressiveBlurDirection = "top" | "bottom" | "left" | "right"

const directionGradientAngle = {
  top: "to bottom",
  bottom: "to top",
  left: "to right",
  right: "to left",
} as const satisfies Record<ProgressiveBlurDirection, string>

const directionSizeProperty = {
  top: "height",
  bottom: "height",
  left: "width",
  right: "width",
} as const satisfies Record<ProgressiveBlurDirection, "height" | "width">

interface ProgressiveBlurProps {
  children?: React.ReactNode
  className?: string
  /** Edge the blur ramps in from. @default "bottom" */
  direction?: ProgressiveBlurDirection
  /**
   * Add a final solid-color layer that fades to `--pb-background` right at
   * the edge, fully hiding content instead of leaving a faint blurred trace.
   * @default true
   */
  fade?: boolean
  /**
   * Add a subtle ambient chromatic gradient at the pinned edge.
   * Adapts between light and dark modes with a soft, luminous aesthetic.
   * @default false
   */
  gradient?: boolean
  gradientClassName?: string
  /**
   * Number of stacked blur layers, clamped to 1–16. Each layer's mask
   * isolates a band of the fade zone, so more layers read as a smoother
   * ramp at the cost of more `backdrop-filter` paints. Ignored (forced to
   * 1) when the OS Reduced Motion setting is on.
   * @default 6
   */
  layers?: number
  /** Strongest blur radius, reached by the layer nearest the edge, in px. @default 12 */
  maxBlur?: number
  /**
   * CSS positioning mode. Use "fixed" to stick to viewport edges, or "absolute"
   * for container edges.
   * @default "absolute"
   */
  position?: "absolute" | "fixed"
  /** Depth of the blurred region along `direction`, any CSS length. @default "6rem" */
  size?: string
  style?: CSSProperties
}

function getLayerBlurPx(index: number, layerCount: number, maxBlur: number) {
  // Doubles per layer toward the edge (…maxBlur/4, maxBlur/2, maxBlur) rather
  // than scaling linearly — blur perceptually compounds, so a linear ramp
  // reads as mostly-sharp-then-a-sudden-smear instead of a gradual fade.
  return maxBlur * 2 ** (index - layerCount + 1)
}

function getLayerMaskImage(
  direction: ProgressiveBlurDirection,
  index: number,
  layerCount: number
) {
  // 0% is the pinned edge (screen edge), 100% is the inner edge (fading to transparent towards content).
  // Lower index (gentle blur) extends further towards the inner edge (up to 100%),
  // while higher index (strongest blur) stays concentrated near the pinned edge (0%).
  const end = Math.round(((layerCount - index) / layerCount) * 100)
  const mid = Math.round(end * 0.4)

  return `linear-gradient(${directionGradientAngle[direction]}, black 0%, black ${mid}%, transparent ${end}%)`
}

function ProgressiveBlur({
  children,
  className,
  direction = "bottom",
  fade = true,
  gradient = false,
  gradientClassName,
  layers = 6,
  maxBlur = 12,
  position = "absolute",
  size = "6rem",
  style,
}: ProgressiveBlurProps) {
  const prefersReducedMotion = usePrefersReducedMotion()
  const clampedMaxBlur = Math.max(0, maxBlur)
  const layerCount = prefersReducedMotion
    ? REDUCED_MOTION_LAYERS
    : Math.min(MAX_LAYERS, Math.max(1, Math.trunc(layers)))

  const blurLayers = useMemo(
    () =>
      Array.from({ length: layerCount }, (_, index) => {
        const blurPx = getLayerBlurPx(index, layerCount, clampedMaxBlur)
        const maskImage = getLayerMaskImage(direction, index, layerCount)

        return { blurPx, id: `${direction}-${layerCount}-${index}`, maskImage }
      }).filter((layer) => layer.blurPx >= 0.75),
    [direction, layerCount, clampedMaxBlur]
  )

  const sizeStyle: CSSProperties = {
    [directionSizeProperty[direction]]: size,
  }

  return (
    <div
      aria-hidden="true"
      className={cn(
        componentThemeClassName,
        "pointer-events-none select-none",
        position,
        direction === "top" && "inset-x-0 top-0",
        direction === "bottom" && "inset-x-0 bottom-0",
        direction === "left" && "inset-y-0 left-0",
        direction === "right" && "inset-y-0 right-0",
        className
      )}
      style={{ ...sizeStyle, ...style }}
    >
      {blurLayers.map((layer) => (
        <div
          className="absolute inset-0"
          key={layer.id}
          style={{
            backdropFilter: `blur(${layer.blurPx}px)`,
            maskImage: layer.maskImage,
            WebkitBackdropFilter: `blur(${layer.blurPx}px)`,
            WebkitMaskImage: layer.maskImage,
          }}
        />
      ))}
      {fade ? (
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(${directionGradientAngle[direction]}, var(--pb-background), transparent)`,
          }}
        />
      ) : null}
      {gradient ? (
        <div
          className={cn(
            "absolute inset-0 bg-[linear-gradient(90deg,rgba(244,114,182,0.12)_0%,rgba(168,85,247,0.10)_33%,rgba(59,130,246,0.10)_66%,rgba(16,185,129,0.12)_100%)] dark:bg-[linear-gradient(90deg,rgba(168,85,247,0.22)_0%,rgba(236,72,153,0.18)_33%,rgba(59,130,246,0.18)_66%,rgba(16,185,129,0.20)_100%)]",
            gradientClassName
          )}
          style={{
            maskImage: `linear-gradient(${directionGradientAngle[direction]}, black 0%, transparent 100%)`,
            WebkitMaskImage: `linear-gradient(${directionGradientAngle[direction]}, black 0%, transparent 100%)`,
          }}
        />
      ) : null}
      {children}
    </div>
  )
}

export type { ProgressiveBlurDirection, ProgressiveBlurProps }
export { ProgressiveBlur }
