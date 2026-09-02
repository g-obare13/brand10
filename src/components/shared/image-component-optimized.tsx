"use client"

import React, { memo, useMemo, useState } from "react"
import { Blurhash } from "react-blurhash"
import { cn } from "@/lib/utils"

export interface OptimizedImageProps {
  className?: string
  blurDataURL?: string
  onLoadComplete?: () => void
  onError?: () => void
  src?: string | null
  alt?: string
  fill?: boolean
  priority?: boolean
  unoptimized?: boolean
  sizes?: string
  quality?: number
  width?: number
  height?: number
  aspectRatio?: string
  disableBlurhash?: boolean
  objectPosition?: string
  imageClassName?: string
}

const DEFAULT_BLURHASHES = [
  "LFMQR]~o%LHq0WVrMc-P9|IVrVrp",
  "L1LNuy00%gQ+00D$.9kD00_4VrMw",
  "L5Of*?cb.ArV?EM_xvx]E3xUkWWs",
  "L2Lz?QDNt600_34T8^IT?cofRPax",
  "LEPsbYRjM{s:0Kf8oet7?wjYt7ay",
  "LDQ9[|D*~Bt7xvofniR*-Uoe9aWB",
  "LHQJcbH?-r.9?HruV[NZ?^XmE0ic",
]

// Fix for React 19 type incompatibility with react-blurhash
const BlurhashComponent = Blurhash as unknown as React.ComponentType<{
  hash: string
  width?: number | string
  height?: number | string
  resolutionX?: number
  resolutionY?: number
  punch?: number
}>

// Generate a stable blurhash based on the src string
function getStableBlurhash(src: string | null | undefined): string {
  if (!src) return DEFAULT_BLURHASHES[0]
  const srcString = src
  // Use a simple hash of the src to pick a consistent blurhash
  let hash = 0
  for (let i = 0; i < srcString.length; i++) {
    const char = srcString.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // Convert to 32bit integer
  }
  const index = Math.abs(hash) % DEFAULT_BLURHASHES.length
  return DEFAULT_BLURHASHES[index]
}

/**
 * A highly optimized image component for React.
 * Features:
 * - Smooth transition from Blurhash placeholder to actual image.
 * - Stable fallback Blurhashes based on the image source URL.
 * - Error handling with visual feedback.
 * - Support for aspect ratio, fill mode, and custom object positioning.
 * - Lazy loading by default with priority override for LCP images.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {string} [props.src] - Source URL of the image.
 * @param {string} [props.alt="Image"] - Accessibility text for the image.
 * @param {boolean} [props.fill=true] - Whether the image should fill its container.
 * @param {string} [props.aspectRatio] - CSS aspect-ratio (e.g., "16/9").
 * @param {boolean} [props.priority=false] - If true, image loads with "eager" priority.
 * @param {string} [props.blurDataURL] - Optional custom Blurhash string.
 * @param {boolean} [props.disableBlurhash=false] - Set to true to disable the placeholder.
 * @param {string} [props.objectPosition="center"] - CSS object-position for the image.
 * @param {string} [props.className] - CSS classes for the container.
 * @param {string} [props.imageClassName] - CSS classes for the <img> element itself.
 * @param {() => void} [props.onLoadComplete] - Callback triggered when image finishes loading.
 * @param {() => void} [props.onError] - Callback triggered on loading error.
 * @returns {React.ReactElement} The optimized image component.
 */
const ImageComponentOptimized: React.FC<OptimizedImageProps> = memo(
  ({
    className = "",
    blurDataURL,
    priority = false,
    // unoptimized = false,
    onLoadComplete,
    onError,
    src,
    alt,
    fill = true,
    // sizes,
    // quality = priority ? 50 : 75,
    // width,
    // height,
    aspectRatio,
    disableBlurhash = false,
    imageClassName = "",
    objectPosition = "center",
    // ...args
  }) => {
    const [imageLoaded, setImageLoaded] = useState(false)
    const [hasError, setHasError] = useState(false)

    // Use a stable blurhash based on src, or the provided blurDataURL
    const stableBlurhash = useMemo(
      () => blurDataURL || getStableBlurhash(src),
      [blurDataURL, src]
    )

    const onLoadCallBack = () => {
      setImageLoaded(true)
      if (onLoadComplete) onLoadComplete()
    }

    const onErrorCallBack = () => {
      setHasError(true)
      if (onError) onError()
    }


    // Container styles for aspect ratio
    const containerStyle = useMemo(() => {
      const baseStyle: React.CSSProperties = {
        width: "100%",
        height: fill ? "100%" : "auto",
      }

      if (aspectRatio) baseStyle.aspectRatio = aspectRatio

      // Only set position relative if not provided in className
      if (!className.includes("absolute") && !className.includes("fixed")) {
        baseStyle.position = "relative" as const
      }

      return baseStyle
    }, [aspectRatio, fill, className])

    return (
      <div
        className={cn("relative overflow-hidden", className)}
        style={containerStyle}
      >
        {/* Blurhash Placeholder */}
        {!disableBlurhash && !imageLoaded && !hasError && (
          <div className="absolute inset-0 z-0">
            <BlurhashComponent
              hash={stableBlurhash}
              width="100%"
              height="100%"
              resolutionX={4}
              resolutionY={4}
              punch={1}
            />
          </div>
        )}

        {/* Error Fallback */}
        {hasError && (
          <div className="flex h-full w-full items-center justify-center bg-muted/30">
            <div className="flex flex-col items-center gap-1 text-muted-foreground/40">
              <span className="text-[10px] font-bold tracking-tight uppercase">
                Image Error
              </span>
            </div>
          </div>
        )}

        {/* Standard Image with transition */}
        <img
          src={src?.trim() || ""}
          alt={alt || "Image"}
          onLoad={onLoadCallBack}
          onError={onErrorCallBack}
          loading={priority ? "eager" : "lazy"}
          className={cn(
            "h-full w-full object-cover transition-all duration-500",
            imageLoaded ? "scale-100 opacity-100" : "scale-105 opacity-0",
            hasError ? "hidden" : "block",
            imageClassName
          )}
          style={{
            objectPosition,
          }}
        />
      </div>
    )
  }
)

ImageComponentOptimized.displayName = "ImageComponentOptimized"

export default ImageComponentOptimized
