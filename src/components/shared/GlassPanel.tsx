"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { NoiseTexture } from "@/components/shared/NoiseTexture"

export interface GlassPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
  /**
   * Additional classes for the inner content container.
   */
  contentClassName?: string
  /**
   * Backdrop blur level.
   * @default "md"
   */
  blur?: "none" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl"
  /**
   * Background styling.
   * @default "bg-white/40 dark:bg-black/30"
   */
  backgroundClass?: string
  /**
   * Border styling.
   * @default "border-white/15 dark:border-white/5"
   */
  borderClass?: string
  /**
   * Whether the panel should absolute-fill its container (great for backgrounds).
   * @default false
   */
  contained?: boolean
  /**
   * Adds an organic noise grain texture to the glass surface.
   * @default false
   */
  noise?: boolean
  /**
   * Noise opacity if noise is enabled.
   * @default 0.05
   */
  noiseOpacity?: number
  /**
   * Enables cursor-following light reflections (interactive hover shine).
   * @default false
   */
  interactive?: boolean
  /**
   * Adds a subtle ambient radial glow/spotlight effect behind the glass panel.
   * Can be boolean or custom gradient classes.
   * @default false
   */
  glow?: boolean | string
  /**
   * Custom element type.
   * @default "div"
   */
  as?: React.ElementType
}

const blurMap = {
  none: "backdrop-blur-none",
  xs: "backdrop-blur-xs",
  sm: "backdrop-blur-sm",
  md: "backdrop-blur-md",
  lg: "backdrop-blur-lg",
  xl: "backdrop-blur-xl",
  "2xl": "backdrop-blur-2xl",
  "3xl": "backdrop-blur-3xl",
}
/**
 * Glassmorphic container with configurable backdrop blur, surface noise grain, and cursor shine.
 * Features:
 * - Granular blur levels from none to 3xl backdrop blur.
 * - Organic SVG noise texture overlay with customizable opacity.
 * - Interactive cursor-following spotlight shine effect.
 * - Polymorphic component rendering (as div, section, article, etc.).
 *
 * @component
 * @param {GlassPanelProps} props - The component props.
 * @param {React.ReactNode} [props.children] - Child elements.
 * @param {string} [props.className] - Container CSS classes.
 * @param {string} [props.contentClassName] - Inner content wrapper classes.
 * @param {"none" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl"} [props.blur="md"] - Blur intensity.
 * @param {boolean} [props.noise=false] - Whether to show film grain.
 * @param {boolean} [props.interactive=false] - Enables cursor light reflection.
 * @returns {React.ReactElement} The rendered glassmorphism panel.
 */
export const GlassPanel = React.forwardRef<HTMLDivElement, GlassPanelProps>(
  (
    {
      children,
      className,
      contentClassName,
      blur = "md",
      backgroundClass = "bg-white/4 dark:bg-black/30",
      borderClass = "border-white/10 dark:border-white/5",
      contained = false,
      noise = false,
      noiseOpacity = 0.03,
      interactive = false,
      glow = false,
      as: Component = "div",
      style,
      ...props
    },
    ref
  ) => {
    const containerRef = React.useRef<HTMLDivElement>(null)
    const [mousePos, setMousePos] = React.useState({ x: 0, y: 0 })
    const [isHovered, setIsHovered] = React.useState(false)

    // Combine refs to support external ref forwarding
    React.useImperativeHandle(ref, () => containerRef.current as HTMLDivElement)

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      if (!interactive || !containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      })
    }

    // Default glow classes if true
    const glowClassString =
      typeof glow === "string"
        ? glow
        : "from-primary/10 via-primary/5 to-transparent"

    return (
      <Component
        ref={containerRef}
        className={cn(
          "relative overflow-hidden border transition-all duration-300",
          contained ? "absolute inset-0 z-0 h-full w-full" : "rounded-2xl",
          borderClass,
          interactive &&
            "hover:shadow-custom hover:border-white/20 dark:hover:border-white/10",
          className
        )}
        style={{
          boxShadow: "inset 0 1px 1px 0 rgba(255,255,255,0.05)",
          ...style,
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => interactive && setIsHovered(true)}
        onMouseLeave={() => interactive && setIsHovered(false)}
        {...props}
      >
        {/* Isolated Backdrop Blur and Background Layer (GPU Accelerated) */}
        <div
          className={cn(
            "pointer-events-none absolute inset-0 -z-20 h-full w-full transform-gpu",
            blurMap[blur],
            backgroundClass
          )}
          style={{
            willChange: "backdrop-filter, transform",
          }}
        />

        {/* Ambient background glow */}
        {glow && (
          <div
            className={cn(
              "pointer-events-none absolute -inset-px -z-10 transform-gpu bg-radial transition-opacity duration-500",
              glowClassString
            )}
            style={{
              maskImage: "radial-gradient(circle, black, transparent 70%)",
              WebkitMaskImage:
                "radial-gradient(circle, black, transparent 70%)",
              willChange: "transform, opacity",
            }}
          />
        )}

        {/* Interactive spotlight shine reflection */}
        {interactive && isHovered && (
          <div
            className="pointer-events-none absolute -inset-px bg-radial from-white/[0.08] to-transparent transition-opacity duration-300"
            style={{
              left: `${mousePos.x}px`,
              top: `${mousePos.y}px`,
              transform: "translate(-50%, -50%)",
              width: "350px",
              height: "350px",
              mixBlendMode: "overlay",
            }}
          />
        )}

        {/* Subtle top glare/refraction line */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-linear-to-r from-transparent via-white/20 to-transparent dark:via-white/10" />

        {/* Organic noise texture */}
        {noise && (
          <NoiseTexture
            noiseOpacity={noiseOpacity}
            frequency={0.5}
            className="mix-blend-overlay"
          />
        )}

        {/* Content Container */}
        {children && (
          <div className={cn("relative z-10 h-full w-full", contentClassName)}>
            {children}
          </div>
        )}
      </Component>
    )
  }
)

GlassPanel.displayName = "GlassPanel"

export default GlassPanel
