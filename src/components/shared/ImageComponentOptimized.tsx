"use client"

import React, { memo, useEffect, useMemo, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { Blurhash } from "react-blurhash"
import { Image as UnpicImageOriginal } from "@unpic/react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { SearchBig } from "@boxicons/react"
import { cn } from "@/lib/utils"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

// Bypass strict discriminated union types for layout props
const UnpicImage = UnpicImageOriginal as any

export interface OptimizedImageProps {
  className?: string
  style?: React.CSSProperties
  blurDataURL?: string
  onLoadComplete?: () => void
  onError?: () => void
  src?: string | null
  alt?: string
  priority?: boolean
  unoptimized?: boolean
  sizes?: string
  width?: number
  height?: number
  aspectRatio?: string
  objectFit?: "cover" | "contain" | "fill" | "none" | "scale-down"
  disableBlurhash?: boolean
  objectPosition?: string
  imageClassName?: string
  layout?: "constrained" | "fullWidth" | "fixed"
  effect?: "reveal-up" | "zoom-out" | "parallax"
  cursorEffect?:
    | "fluid-target"
    | "focus-lens"
    | "spotlight-orbit"
    | "water-ripple"
    | "magnifier"
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

const BlurhashComponent = Blurhash as unknown as React.ComponentType<{
  hash: string
  width?: number | string
  height?: number | string
  resolutionX?: number
  resolutionY?: number
  punch?: number
}>

function getStableBlurhash(src: string | null | undefined): string {
  if (!src) return DEFAULT_BLURHASHES[0]
  let hash = 0
  for (let i = 0; i < src.length; i++) {
    const char = src.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash
  }
  const index = Math.abs(hash) % DEFAULT_BLURHASHES.length
  return DEFAULT_BLURHASHES[index]
}

const ImageComponentOptimized: React.FC<OptimizedImageProps> = memo(
  ({
    className = "",
    blurDataURL,
    priority = false,
    unoptimized = false,
    onLoadComplete,
    onError,
    src,
    alt = "Image",
    layout = "constrained",
    sizes,
    width,
    height,
    aspectRatio,
    objectFit: objectFitProp,
    disableBlurhash = false,
    imageClassName = "",
    objectPosition = "center",
    style,
    effect,
    cursorEffect,
  }) => {
    const [isLightboxOpen, setIsLightboxOpen] = useState(false)
    const [mounted, setMounted] = useState(false)
    const [imageLoaded, setImageLoaded] = useState(false)
    const [hasError, setHasError] = useState(false)

    const containerRef = useRef<HTMLDivElement>(null)
    const imgRef = useRef<any>(null)
    const lastSpawnTime = useRef(0)
    const uniqueId = useRef(Math.random().toString(36).substring(2, 9))

    // GSAP Follower references & quickTo functions
    const outerFollowerRef = useRef<HTMLDivElement>(null)
    const innerFollowerRef = useRef<HTMLDivElement>(null)
    const lensFollowerRef = useRef<HTMLDivElement>(null)
    const orbitFollowerRef = useRef<HTMLDivElement>(null)
    const spotlightRef = useRef<HTMLDivElement>(null)
    const magnifierFollowerRef = useRef<HTMLDivElement>(null)

    const outerX = useRef<((val: number) => void) | null>(null)
    const outerY = useRef<((val: number) => void) | null>(null)
    const innerX = useRef<((val: number) => void) | null>(null)
    const innerY = useRef<((val: number) => void) | null>(null)
    const lensX = useRef<((val: number) => void) | null>(null)
    const lensY = useRef<((val: number) => void) | null>(null)
    const orbitX = useRef<((val: number) => void) | null>(null)
    const orbitY = useRef<((val: number) => void) | null>(null)
    const spotlightX = useRef<((val: number) => void) | null>(null)
    const spotlightY = useRef<((val: number) => void) | null>(null)
    const magnifierX = useRef<((val: number) => void) | null>(null)
    const magnifierY = useRef<((val: number) => void) | null>(null)

    const stableBlurhash = useMemo(
      () => blurDataURL || getStableBlurhash(src),
      [blurDataURL, src]
    )

    useEffect(() => {
      setHasError(false)
      // Check if image is already complete (e.g. from cache)
      if (imgRef.current?.complete) {
        setImageLoaded(true)
      } else {
        setImageLoaded(false)
      }
    }, [src])

    // Close lightbox on escape key
    useEffect(() => {
      setMounted(true)
    }, [])

    useEffect(() => {
      if (!isLightboxOpen) return
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          setIsLightboxOpen(false)
        }
      }
      window.addEventListener("keydown", handleKeyDown)
      return () => window.removeEventListener("keydown", handleKeyDown)
    }, [isLightboxOpen])

    useEffect(() => {
      if (
        !effect ||
        !containerRef.current ||
        typeof window === "undefined" ||
        !imageLoaded
      )
        return

      const container = containerRef.current
      const img = container.querySelector("img")
      if (!img) return

      const ctx = gsap.context(() => {
        if (effect === "reveal-up") {
          gsap.fromTo(
            img,
            { y: 60, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 1.2,
              ease: "power3.out",
              scrollTrigger: {
                trigger: container,
                start: "top 90%",
                toggleActions: "play none none reverse",
              },
            }
          )
        } else if (effect === "zoom-out") {
          gsap.fromTo(
            img,
            { scale: 1.15, opacity: 0 },
            {
              scale: 1,
              opacity: 1,
              duration: 1.4,
              ease: "power3.out",
              scrollTrigger: {
                trigger: container,
                start: "top 90%",
                toggleActions: "play none none reverse",
              },
            }
          )
        } else {
          // Give it a bit of extra scale to cover the overflow
          gsap.set(img, { scale: 1.15 })
          gsap.fromTo(
            img,
            { yPercent: -15 },
            {
              yPercent: 15,
              ease: "none",
              scrollTrigger: {
                trigger: container,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            }
          )
        }
      }, container)

      return () => ctx.revert()
    }, [effect, imageLoaded])

    // Initialize cursor quickTo animation functions
    useEffect(() => {
      if (!cursorEffect || typeof window === "undefined") return

      const ctx = gsap.context(() => {
        if (
          cursorEffect === "fluid-target" &&
          outerFollowerRef.current &&
          innerFollowerRef.current
        ) {
          outerX.current = gsap.quickTo(outerFollowerRef.current, "x", {
            duration: 0.45,
            ease: "power2.out",
          })
          outerY.current = gsap.quickTo(outerFollowerRef.current, "y", {
            duration: 0.45,
            ease: "power2.out",
          })
          innerX.current = gsap.quickTo(innerFollowerRef.current, "x", {
            duration: 0.1,
            ease: "power2.out",
          })
          innerY.current = gsap.quickTo(innerFollowerRef.current, "y", {
            duration: 0.1,
            ease: "power2.out",
          })
        } else if (cursorEffect === "focus-lens" && lensFollowerRef.current) {
          lensX.current = gsap.quickTo(lensFollowerRef.current, "x", {
            duration: 0.25,
            ease: "power2.out",
          })
          lensY.current = gsap.quickTo(lensFollowerRef.current, "y", {
            duration: 0.25,
            ease: "power2.out",
          })

          // Infinite subtle rotation for the dashed focus ring
          gsap.to(lensFollowerRef.current, {
            rotation: 360,
            repeat: -1,
            duration: 10,
            ease: "none",
          })
        } else if (
          cursorEffect === "spotlight-orbit" &&
          orbitFollowerRef.current &&
          spotlightRef.current
        ) {
          orbitX.current = gsap.quickTo(orbitFollowerRef.current, "x", {
            duration: 0.15,
            ease: "power2.out",
          })
          orbitY.current = gsap.quickTo(orbitFollowerRef.current, "y", {
            duration: 0.15,
            ease: "power2.out",
          })
          spotlightX.current = gsap.quickTo(spotlightRef.current, "--x", {
            duration: 0.15,
            ease: "power2.out",
          })
          spotlightY.current = gsap.quickTo(spotlightRef.current, "--y", {
            duration: 0.15,
            ease: "power2.out",
          })

          // Infinite rotation of satellite pivot
          const pivot = orbitFollowerRef.current.querySelector(".orbit-pivot")
          if (pivot) {
            gsap.to(pivot, {
              rotation: 360,
              repeat: -1,
              duration: 4,
              ease: "none",
            })
          }
        } else if (
          cursorEffect === "magnifier" &&
          magnifierFollowerRef.current
        ) {
          magnifierX.current = gsap.quickTo(magnifierFollowerRef.current, "x", {
            duration: 0.2,
            ease: "power2.out",
          })
          magnifierY.current = gsap.quickTo(magnifierFollowerRef.current, "y", {
            duration: 0.2,
            ease: "power2.out",
          })
        }
      })

      return () => ctx.revert()
    }, [cursorEffect])

    const handleLoad = () => {
      setImageLoaded(true)
      onLoadComplete?.()
    }

    const handleError = () => {
      setHasError(true)
      onError?.()
    }

    const handleMouseEnter = () => {
      if (!cursorEffect) return
      if (cursorEffect === "fluid-target") {
        gsap.to([outerFollowerRef.current, innerFollowerRef.current], {
          opacity: 1,
          scale: 1,
          duration: 0.3,
        })
      } else if (cursorEffect === "focus-lens") {
        gsap.to(lensFollowerRef.current, {
          opacity: 1,
          scale: 1,
          duration: 0.3,
        })
      } else if (cursorEffect === "spotlight-orbit") {
        gsap.to([orbitFollowerRef.current, spotlightRef.current], {
          opacity: 1,
          duration: 0.4,
        })
      } else if (cursorEffect === "magnifier") {
        gsap.to(magnifierFollowerRef.current, {
          opacity: 1,
          scale: 1,
          duration: 0.3,
        })
      }
    }

    const handleMouseLeave = () => {
      if (!cursorEffect) return
      if (cursorEffect === "fluid-target") {
        gsap.to([outerFollowerRef.current, innerFollowerRef.current], {
          opacity: 0,
          scale: 0.8,
          duration: 0.3,
        })
      } else if (cursorEffect === "focus-lens") {
        gsap.to(lensFollowerRef.current, {
          opacity: 0,
          scale: 0.8,
          duration: 0.3,
        })
      } else if (cursorEffect === "spotlight-orbit") {
        gsap.to([orbitFollowerRef.current, spotlightRef.current], {
          opacity: 0,
          duration: 0.4,
        })
      } else if (cursorEffect === "magnifier") {
        gsap.to(magnifierFollowerRef.current, {
          opacity: 0,
          scale: 0.8,
          duration: 0.3,
        })
      }
    }

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      if (!containerRef.current) return

      const rect = containerRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      // 1. Custom cursor position trackers
      if (cursorEffect === "fluid-target") {
        outerX.current?.(x)
        outerY.current?.(y)
        innerX.current?.(x)
        innerY.current?.(y)
      } else if (cursorEffect === "focus-lens") {
        lensX.current?.(x)
        lensY.current?.(y)
      } else if (cursorEffect === "spotlight-orbit") {
        orbitX.current?.(x)
        orbitY.current?.(y)
        spotlightX.current?.(x)
        spotlightY.current?.(y)
      } else if (cursorEffect === "magnifier") {
        magnifierX.current?.(x)
        magnifierY.current?.(y)
      }

      // 2. Water ripple trail generator (Refractive Displacement)
      if (cursorEffect === "water-ripple") {
        const now = Date.now()
        // Throttle spawns to every 45ms to preserve performance
        if (now - lastSpawnTime.current < 45) return
        lastSpawnTime.current = now

        const ripple = document.createElement("div")
        ripple.className = "pointer-events-none absolute rounded-full z-20"

        const size = 24 // Initial ripple size
        ripple.style.width = `${size}px`
        ripple.style.height = `${size}px`
        ripple.style.left = `${x}px`
        ripple.style.top = `${y}px`
        ripple.style.transform = "translate(-50%, -50%)"

        // Link directly to the custom SVG displacement filter
        ripple.style.backdropFilter = `url(#refract-filter-${uniqueId.current})`
        ;(ripple.style as any).webkitBackdropFilter =
          `url(#refract-filter-${uniqueId.current})`

        // Add a subtle wave ridge outline
        ripple.style.border = "1px solid rgba(255, 255, 255, 0.16)"
        ripple.style.boxShadow = "inset 0 0 8px rgba(255, 255, 255, 0.05)"

        containerRef.current.appendChild(ripple)

        gsap.fromTo(
          ripple,
          { scale: 0.3, opacity: 0.9 },
          {
            scale: 8.5, // expands outward
            opacity: 0,
            duration: 1.4,
            ease: "sine.out",
            onComplete: () => {
              ripple.remove()
            },
          }
        )
      }
    }

    const defaultSizes =
      sizes ||
      "(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"

    // Determine fit based on prop or classes
    const objectFit =
      objectFitProp ||
      (imageClassName.includes("object-contain") ? "contain" : "cover")

    return (
      <div
        ref={containerRef}
        className={cn(
          "relative overflow-hidden",
          layout === "fullWidth" ? "w-full" : "",
          cursorEffect && cursorEffect !== "water-ripple" ? "cursor-none" : "",
          className
        )}
        style={style}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={() => {
          if (cursorEffect === "magnifier") {
            setIsLightboxOpen(true)
          }
        }}
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
          <div className="flex aspect-video h-full w-full items-center justify-center bg-muted/30">
            <span className="text-[10px] font-bold tracking-tight text-muted-foreground/40 uppercase">
              Image Error
            </span>
          </div>
        )}

        {src ? (
          unoptimized || (typeof src === "string" && (src.includes(".svg") || src.startsWith("data:image/svg+xml"))) ? (
            <img
              ref={imgRef}
              src={src}
              alt={alt}
              width={layout === "fullWidth" ? undefined : width}
              height={layout === "fullWidth" ? undefined : height}
              onLoad={handleLoad}
              onError={handleError}
              style={{
                objectFit,
                aspectRatio,
                objectPosition,
              }}
              className={cn(
                !effect && "transition-all duration-500",
                imageLoaded || disableBlurhash
                  ? "scale-100 opacity-100"
                  : !effect
                    ? "scale-105 opacity-0"
                    : "opacity-0",
                hasError ? "hidden" : "block",
                imageClassName
              )}
            />
          ) : (
            <UnpicImage
              ref={imgRef}
              src={src}
              alt={alt}
              width={layout === "fullWidth" ? undefined : width}
              height={layout === "fullWidth" ? undefined : height}
              layout={layout}
              priority={priority ? true : undefined}
              onLoad={handleLoad}
              onError={handleError}
              sizes={defaultSizes}
              style={{
                objectFit,
                aspectRatio,
                objectPosition,
              }}
              className={cn(
                !effect && "transition-all duration-500",
                imageLoaded || disableBlurhash
                  ? "scale-100 opacity-100"
                  : !effect
                    ? "scale-105 opacity-0"
                    : "opacity-0",
                hasError ? "hidden" : "block",
                imageClassName
              )}
            />
          )
        ) : (
          <div className="flex aspect-video h-full w-full items-center justify-center bg-muted/30">
            <span className="text-[10px] font-bold tracking-tight text-muted-foreground/40 uppercase">
              No Image
            </span>
          </div>
        )}

        {/* Option 1: Fluid target trailing cursor element */}
        {cursorEffect === "fluid-target" && (
          <>
            <div
              ref={outerFollowerRef}
              className="pointer-events-none absolute top-0 left-0 z-20 h-10 w-10 -translate-x-1/2 -translate-y-1/2 scale-75 rounded-full border border-primary/50 bg-primary/5 opacity-0"
            />
            <div
              ref={innerFollowerRef}
              className="pointer-events-none absolute top-0 left-0 z-20 h-2 w-2 -translate-x-1/2 -translate-y-1/2 scale-75 rounded-full bg-primary opacity-0"
            />
          </>
        )}

        {/* Option 2: Focus lens camera reticle cursor element */}
        {cursorEffect === "focus-lens" && (
          <div
            ref={lensFollowerRef}
            className="pointer-events-none absolute top-0 left-0 z-20 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 scale-75 items-center justify-center rounded-full border border-dashed border-primary/45 bg-primary/3 opacity-0"
          >
            {/* Center target crosshair ring */}
            <div className="flex h-3.5 w-3.5 items-center justify-center rounded-full border border-primary/55">
              <div className="h-1 w-1 rounded-full bg-primary" />
            </div>
          </div>
        )}

        {/* Option 3: Spotlight mask overlay */}
        {cursorEffect === "spotlight-orbit" && (
          <div
            ref={spotlightRef}
            className="pointer-events-none absolute inset-0 z-10 opacity-0"
            style={{
              background:
                "radial-gradient(circle 110px at var(--x, 0px) var(--y, 0px), transparent 10%, rgba(10, 10, 10, 0.85) 100%)",
            }}
          />
        )}

        {/* Option 3: Orbiting satellite dot cursor element */}
        {cursorEffect === "spotlight-orbit" && (
          <div
            ref={orbitFollowerRef}
            className="pointer-events-none absolute top-0 left-0 z-20 flex h-24 w-24 -translate-x-1/2 -translate-y-1/2 items-center justify-center opacity-0"
          >
            {/* Faint concentric tracking rings */}
            <div className="absolute h-24 w-24 rounded-full border border-neutral-50/5" />
            <div className="absolute h-16 w-16 rounded-full border border-neutral-50/10" />

            {/* Orbiting Satellite Dot Wrapper */}
            <div className="orbit-pivot absolute flex h-full w-full items-center justify-start">
              <div
                className="h-2.5 w-2.5 rounded-full bg-neutral-50 shadow-[0_0_8px_#fff]"
                style={{ marginLeft: "4px" }}
              />
            </div>
          </div>
        )}

        {/* Option 5: Magnifier glass cursor element */}
        {cursorEffect === "magnifier" && (
          <div
            ref={magnifierFollowerRef}
            className="pointer-events-none absolute top-0 left-0 z-20 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 scale-75 items-center justify-center rounded-full border bg-card opacity-0 backdrop-blur-md"
          >
            <SearchBig />
          </div>
        )}

        {/* Refractive displacement filter definition for water ripples */}
        {cursorEffect === "water-ripple" && (
          <svg className="absolute -z-10 h-0 w-0" aria-hidden="true">
            <defs>
              <filter id={`refract-filter-${uniqueId.current}`}>
                {/* Fractal noise map representing water wave height profiles */}
                <feTurbulence
                  type="fractalNoise"
                  baseFrequency="0.045"
                  numOctaves="2"
                  result="noise"
                />
                {/* Displace the image underneath by noise coordinates */}
                <feDisplacementMap
                  in="SourceGraphic"
                  in2="noise"
                  scale="35"
                  xChannelSelector="R"
                  yChannelSelector="G"
                />
              </filter>
            </defs>
          </svg>
        )}

        {/* Fullscreen Lightbox Overlay rendered via Portal */}
        {isLightboxOpen &&
          mounted &&
          createPortal(
            <div
              className="fixed inset-0 z-[99999] flex animate-in items-center justify-center bg-black/95 backdrop-blur-xl duration-300 fade-in"
              onClick={(e) => {
                e.stopPropagation()
                setIsLightboxOpen(false)
              }}
            >
              {/* Close Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setIsLightboxOpen(false)
                }}
                className="absolute top-6 right-6 z-[100000] rounded-full bg-neutral-50/10 p-3 text-neutral-50 backdrop-blur-md transition-all hover:scale-105 hover:bg-neutral-50/20 active:scale-95"
                aria-label="Close fullscreen"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              {/* Centered Image */}
              <div
                className="relative max-h-[90vh] max-w-[90vw] animate-in duration-300 zoom-in-95"
                onClick={(e) => e.stopPropagation()}
              >
                <img
                  src={src || ""}
                  alt={alt}
                  className="max-h-[90vh] max-w-[90vw] rounded-lg object-contain shadow-2xl"
                />
              </div>
            </div>,
            document.body
          )}
      </div>
    )
  }
)

ImageComponentOptimized.displayName = "ImageComponentOptimized"

export default ImageComponentOptimized
