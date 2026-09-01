import * as React from "react"
import { cn } from "@/lib/utils"

export interface SpotlightCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Accent color for ambient radial glow, tints, and expanding line (e.g. hex or rgba).
   * @default "#6366f1"
   */
  color?: string
  /**
   * Whether this card is dimmed (when a sibling card in a grid is focused/hovered).
   * @default false
   */
  dimmed?: boolean
  /**
   * Enables 3D magnetic tilt on mouse hover.
   * @default true
   */
  tilt?: boolean
  /**
   * Maximum tilt angle in degrees.
   * @default 7
   */
  maxTilt?: number
  /**
   * Enables the angled shimmer light sweep across the card on hover.
   * @default true
   */
  shimmer?: boolean
  /**
   * Enables the expanding glowing accent line at the bottom on hover.
   * @default true
   */
  accentLine?: boolean
  /**
   * Interactive hover and active feedback.
   * @default true
   */
  interactive?: boolean
}

export const SpotlightCard = React.forwardRef<
  HTMLDivElement,
  SpotlightCardProps
>(
  (
    {
      children,
      className,
      color = "#6366f1",
      dimmed = false,
      tilt = true,
      maxTilt = 7,
      shimmer = true,
      accentLine = true,
      interactive = true,
      style,
      onMouseEnter,
      onMouseLeave,
      onMouseMove,
      ...props
    },
    ref
  ) => {
    const cardRef = React.useRef<HTMLDivElement>(null)
    const [mousePos, setMousePos] = React.useState({ normX: 0.5, normY: 0.5 })
    const [isHovered, setIsHovered] = React.useState(false)

    React.useImperativeHandle(ref, () => cardRef.current as HTMLDivElement)

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      if (onMouseMove) onMouseMove(e)
      if (!cardRef.current || !tilt) return
      const rect = cardRef.current.getBoundingClientRect()
      const normX = Math.max(
        0,
        Math.min(1, (e.clientX - rect.left) / rect.width)
      )
      const normY = Math.max(
        0,
        Math.min(1, (e.clientY - rect.top) / rect.height)
      )
      setMousePos({ normX, normY })
    }

    const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
      setIsHovered(true)
      if (onMouseEnter) onMouseEnter(e)
    }

    const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
      setIsHovered(false)
      setMousePos({ normX: 0.5, normY: 0.5 })
      if (onMouseLeave) onMouseLeave(e)
    }

    const rotateX =
      isHovered && tilt ? (0.5 - mousePos.normY) * (maxTilt * 2) : 0
    const rotateY =
      isHovered && tilt ? (mousePos.normX - 0.5) * (maxTilt * 2) : 0

    return (
      <div
        ref={cardRef}
        className={cn(
          "group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border/40 bg-card p-7 text-card-foreground shadow-xs transition-all duration-300 dark:bg-card/75 dark:backdrop-blur-md",
          interactive &&
            "cursor-pointer hover:border-primary/20 hover:shadow-2xl active:scale-[0.985] active:brightness-95",
          dimmed && "scale-[0.97] opacity-50 blur-[0.2px] saturate-50",
          className
        )}
        style={{
          transform: tilt
            ? `perspective(900px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg)`
            : undefined,
          transition: isHovered
            ? "transform 0.12s ease-out, border-color 0.3s ease, box-shadow 0.3s ease, opacity 0.3s ease, filter 0.3s ease"
            : "transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1), border-color 0.3s ease, box-shadow 0.3s ease, opacity 0.3s ease, filter 0.3s ease",
          ...style,
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
        {...props}
      >
        {/* Static accent tint — always visible */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-2xl transition-opacity duration-500"
          style={{
            background: `radial-gradient(ellipse at 20% 20%, ${color}14, transparent 65%)`,
          }}
        />

        {/* Interactive hover radial glow layer following cursor */}
        <div
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute inset-0 rounded-2xl transition-opacity duration-300",
            isHovered && interactive ? "opacity-100" : "opacity-0"
          )}
          style={{
            background: `radial-gradient(ellipse at ${mousePos.normX * 100}% ${mousePos.normY * 100}%, ${color}30, transparent 65%)`,
          }}
        />

        {/* Shimmer sweep effect */}
        {shimmer && interactive && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-0 w-[55%] -translate-x-full -skew-x-12 bg-linear-to-r from-transparent via-white/12 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-[280%]"
          />
        )}

        {/* Inner Content */}
        <div className="relative z-10 flex h-full flex-col justify-between">
          {children}
        </div>

        {/* Accent expanding bottom line */}
        {/* {accentLine && (
          <div
            aria-hidden="true"
            className="absolute bottom-0 left-0 h-[2.5px] w-0 rounded-full transition-all duration-500 group-hover:w-full"
            style={{
              background: `linear-gradient(to right, ${color}95, ${color}30, transparent)`,
            }}
          />
        )} */}
      </div>
    )
  }
)

SpotlightCard.displayName = "SpotlightCard"

export default SpotlightCard
