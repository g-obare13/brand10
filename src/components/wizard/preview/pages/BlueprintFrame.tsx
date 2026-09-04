import { cn } from "@/lib/utils"

interface BlueprintFrameProps {
  svgContent?: string
  rasterDataUri?: string
  brandName: string
  primaryColor: string
  className?: string
  isDark?: boolean
  size?: "lg" | "sm"
  isSecondary?: boolean
}

/**
 * Architectural blueprint frame overlay rendering precision construction lines,
 * tick marks, and crosshairs for brand logo presentation.
 */
export function BlueprintFrame({
  svgContent,
  rasterDataUri,
  brandName,
  primaryColor,
  className,
  isDark = false,
  size = "lg",
  isSecondary = false,
}: BlueprintFrameProps) {
  const outerOffset = size === "lg" ? 14 : 10
  const overshoot = size === "lg" ? 16 : 12
  const totalExt = outerOffset + overshoot
  const name = brandName || "Brand"

  const svgUri = svgContent
    ? `data:image/svg+xml;utf8,${encodeURIComponent(svgContent)}`
    : rasterDataUri || null

  const lineClass = isDark ? "bg-zinc-700/80" : "bg-zinc-300"

  const renderFallbackText = () => {
    const monogram = name.charAt(0).toUpperCase()
    return (
      <div
        className={cn(
          "flex items-center justify-center rounded-xl font-bold text-white shadow-xs",
          size === "lg" ? "size-14 text-2xl" : "size-10 text-base"
        )}
        style={{ backgroundColor: primaryColor }}
      >
        {monogram}
      </div>
    )
  }

  return (
    <div
      className={cn(
        "relative inline-flex items-center justify-center select-none",
        className
      )}
    >
      {/* Horizontal Blueprint Guidelines (4 lines with corner overshoots) */}
      <div
        className={cn("absolute h-px pointer-events-none", lineClass)}
        style={{
          top: `-${outerOffset}px`,
          left: `-${totalExt}px`,
          right: `-${totalExt}px`,
        }}
      />
      <div
        className={cn("absolute top-0 h-px pointer-events-none", lineClass)}
        style={{
          left: `-${totalExt}px`,
          right: `-${totalExt}px`,
        }}
      />
      <div
        className={cn("absolute bottom-0 h-px pointer-events-none", lineClass)}
        style={{
          left: `-${totalExt}px`,
          right: `-${totalExt}px`,
        }}
      />
      <div
        className={cn("absolute h-px pointer-events-none", lineClass)}
        style={{
          bottom: `-${outerOffset}px`,
          left: `-${totalExt}px`,
          right: `-${totalExt}px`,
        }}
      />

      {/* Vertical Blueprint Guidelines (4 lines with corner overshoots) */}
      <div
        className={cn("absolute w-px pointer-events-none", lineClass)}
        style={{
          left: `-${outerOffset}px`,
          top: `-${totalExt}px`,
          bottom: `-${totalExt}px`,
        }}
      />
      <div
        className={cn("absolute left-0 w-px pointer-events-none", lineClass)}
        style={{
          top: `-${totalExt}px`,
          bottom: `-${totalExt}px`,
        }}
      />
      <div
        className={cn("absolute right-0 w-px pointer-events-none", lineClass)}
        style={{
          top: `-${totalExt}px`,
          bottom: `-${totalExt}px`,
        }}
      />
      <div
        className={cn("absolute w-px pointer-events-none", lineClass)}
        style={{
          right: `-${outerOffset}px`,
          top: `-${totalExt}px`,
          bottom: `-${totalExt}px`,
        }}
      />

      {/* Clearspace corner dimension tags on large blueprint */}
      {size === "lg" && (
        <>
          <span className="absolute -top-6 -left-6 font-mono text-[9px] text-zinc-400 select-none">
            +X
          </span>
          <span className="absolute -bottom-6 -right-6 font-mono text-[9px] text-zinc-400 select-none">
            +X
          </span>
        </>
      )}

      {/* Logo Content Container */}
      <div
        className={cn(
          "relative z-10 flex items-center justify-center",
          size === "lg"
            ? "min-h-20 min-w-44 px-6 py-4"
            : "min-h-12 min-w-28 px-4 py-2"
        )}
      >
        {svgUri ? (
          <img
            src={svgUri}
            alt={isSecondary ? "Secondary Logo" : "Primary Logo"}
            className={cn(
              "object-contain transition-all",
              size === "lg" ? "max-h-20 max-w-56" : "max-h-12 max-w-36",
              isDark && "brightness-0 invert"
            )}
          />
        ) : (
          renderFallbackText()
        )}
      </div>
    </div>
  )
}
