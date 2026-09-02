"use client"

import { useId } from "react"
import type { ComponentProps } from "react"

import { cn } from "@/lib/utils"

export interface NoiseTextureProps extends ComponentProps<"svg"> {
  /** Extra classes merged onto the root `svg` element. */
  className?: string
  /**
   * `baseFrequency` for `feTurbulence`; higher values yield finer-grained noise.
   * @default 0.4
   */
  frequency?: number
  /**
   * `numOctaves` for `feTurbulence`; more octaves add detail at smaller scales.
   * @default 6
   */
  octaves?: number
  /**
   * Linear slope on each channel after desaturation; adjusts contrast of the noise.
   * @default 0.15
   */
  slope?: number
  /**
   * Opacity of the filled noise layer (`rect`).
   * @default 0.6
   */
  noiseOpacity?: number
}

/**
 * Procedural SVG film grain and noise texture generator using feTurbulence and feColorMatrix.
 *
 * @component
 * @param {NoiseTextureProps} props - The component props.
 * @param {string} [props.className] - SVG CSS class names.
 * @param {number} [props.frequency=0.4] - Base frequency for feTurbulence filter.
 * @param {number} [props.octaves=6] - Number of turbulence octaves.
 * @param {number} [props.slope=0.15] - Contrast slope after desaturation.
 * @param {number} [props.noiseOpacity=0.6] - Layer opacity for the noise fill rect.
 * @returns {React.ReactElement} The rendered SVG noise texture element.
 */
export const NoiseTexture = ({
  className,
  frequency = 0.4,
  octaves = 6,
  slope = 0.15,
  noiseOpacity = 0.6,
  ...props
}: NoiseTextureProps) => {
  const filterId = useId()

  return (
    <svg
      className={cn(
        "pointer-events-none absolute inset-0 z-0 size-full opacity-50 select-none dark:opacity-[0.75]",
        className
      )}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <filter id={filterId}>
        <feTurbulence
          type="fractalNoise"
          baseFrequency={frequency}
          numOctaves={octaves}
          stitchTiles="stitch"
        />
        <feColorMatrix type="saturate" values="0" />
        <feComponentTransfer>
          <feFuncR type="linear" slope={slope} />
          <feFuncG type="linear" slope={slope} />
          <feFuncB type="linear" slope={slope} />
        </feComponentTransfer>
      </filter>
      <rect
        width="100%"
        height="100%"
        filter={`url(#${filterId})`}
        opacity={noiseOpacity}
      />
    </svg>
  )
}
