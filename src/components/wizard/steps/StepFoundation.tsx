import { useState, useEffect, useRef } from "react"
import { useBrandStore } from "@/store/brandStore"
import type { BrandToneRatings } from "@/store/brandStore"
import { DESIGN_MOVEMENTS } from "@/data/wizard"
import type { DesignMovement } from "@/data/wizard"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import WordReveal from "@/components/shared/WordReveal"
import { animateFadeUp } from "@/lib/gsap-animations"
import { gsap } from "gsap"
import { Badge } from "@/components/ui/badge"

export function StepFoundation() {
  const brand = useBrandStore()
  const containerRef = useRef<HTMLDivElement>(null)
  const floatingRef = useRef<HTMLDivElement>(null)
  const [hoveredIndex, setHoveredIndex] = useState<number>(0)

  const xTo = useRef<((val: number) => void) | null>(null)
  const yTo = useRef<((val: number) => void) | null>(null)

  // Track selected movement id
  const [selectedMovementId, setSelectedMovementId] = useState<string | null>(
    () => {
      const match = DESIGN_MOVEMENTS.find((m) =>
        Object.entries(m.tones).every(
          ([k, v]) => brand.toneRatings[k as keyof BrandToneRatings] === v
        )
      )
      return match ? match.id : null
    }
  )

  useEffect(() => {
    if (floatingRef.current) {
      xTo.current = gsap.quickTo(floatingRef.current, "x", {
        duration: 0.35,
        ease: "power3.out",
      })
      yTo.current = gsap.quickTo(floatingRef.current, "y", {
        duration: 0.35,
        ease: "power3.out",
      })
    }
  }, [])

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current || !xTo.current || !yTo.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left + 25 // Offset to the right of cursor
    const y = e.clientY - rect.top + 25 // Offset below the cursor
    xTo.current(x)
    yTo.current(y)
  }

  useEffect(() => {
    if (!containerRef.current) return
    const ctx = gsap.context(() => {
      const items = containerRef.current?.querySelectorAll(".foundation-item")
      if (items && items.length > 0) {
        animateFadeUp(items, {
          y: 20,
          duration: 0.8,
          stagger: 0.08,
          ease: "power3.out",
        })
      }
    }, containerRef)

    return () => ctx.revert()
  }, [])

  const handleToggleMovement = (movement: DesignMovement) => {
    if (selectedMovementId === movement.id) {
      setSelectedMovementId(null)
    } else {
      setSelectedMovementId(movement.id)
      Object.entries(movement.tones).forEach(([key, val]) => {
        brand.setToneRating(key as keyof BrandToneRatings, val)
      })
    }
  }

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative space-y-6"
    >
      {/* Title Header */}
      <div className="space-y-2">
        <WordReveal as="h2" stagger={0.03} duration={1.2} start="top 90%">
          {brand.brandName || "Strategic Foundation"}
        </WordReveal>
      </div>

      <div className="space-y-5">
        {/* Brand Name Input */}
        <div className="foundation-item space-y-2">
          <Label>Brand Workspace Name *</Label>
          <Input
            value={brand.brandName}
            onChange={(e) => brand.setBrandName(e.target.value)}
            placeholder="e.g. Lumina AI, Solstice Motors"
            required
          />
        </div>

        {/* Design Movement Presets Selector as Badges */}
        <div className="foundation-item space-y-2.5 pt-1">
          <div className="flex items-center justify-between">
            <Label>Design Movement Style</Label>
          </div>

          <div className="flex flex-wrap gap-2">
            {DESIGN_MOVEMENTS.map((movement, index) => {
              const isSelected = selectedMovementId === movement.id

              return (
                <Badge
                  key={movement.id}
                  variant={isSelected ? "default" : "outline"}
                  onClick={() => handleToggleMovement(movement)}
                  onMouseEnter={() => {
                    setHoveredIndex(index)
                    if (floatingRef.current) {
                      gsap.to(floatingRef.current, {
                        scale: 1,
                        opacity: 1,
                        rotate: index % 2 === 0 ? 3 : -3,
                        duration: 0.35,
                        ease: "power3.out",
                      })
                    }
                  }}
                  onMouseLeave={() => {
                    if (floatingRef.current) {
                      gsap.to(floatingRef.current, {
                        scale: 0.8,
                        opacity: 0,
                        rotate: 0,
                        duration: 0.25,
                        ease: "power3.out",
                      })
                    }
                  }}
                  className="cursor-pointer rounded-full! p-4! text-foreground transition-all select-none hover:scale-105"
                >
                  {movement.label}
                </Badge>
              )
            })}
          </div>
        </div>

        {/* Mission Statement */}
        <div className="foundation-item space-y-2 pt-1">
          <Label>Brand Mission</Label>
          <Textarea
            value={brand.mission}
            onChange={(e) => brand.setMission(e.target.value)}
            rows={3}
            placeholder="What fundamental problem does your brand solve, and for whom?"
          />
        </div>

        {/* Vision Statement */}
        <div className="foundation-item space-y-2">
          <Label>Brand Vision</Label>
          <Textarea
            value={brand.vision}
            onChange={(e) => brand.setVision(e.target.value)}
            rows={3}
            placeholder="What future world is your brand actively building over the next decade?"
          />
        </div>
      </div>

      {/* Floating Showcase Image Card (Follows Mouse cursor on Badge Hover) */}
      <div
        ref={floatingRef}
        className="pointer-events-none absolute top-0 left-0 z-50 hidden h-[180px] w-[280px] overflow-hidden rounded-2xl border border-white/20 bg-background/90 shadow-2xl backdrop-blur-xl lg:block"
        style={{
          opacity: 0,
          transform: "scale(0.8)",
        }}
      >
        <div
          className="flex h-full flex-col transition-transform duration-500 ease-out"
          style={{
            transform: `translateY(-${hoveredIndex * 180}px)`,
          }}
        >
          {DESIGN_MOVEMENTS.map((item, index) => (
            <div
              key={index}
              className="relative h-[180px] w-full shrink-0 overflow-hidden bg-neutral-900"
            >
              <img
                src={item.image}
                alt={item.label}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/90 via-black/50 to-transparent p-3 text-white">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">
                    {item.label}
                  </span>
                </div>
                <p className="mt-0.5 line-clamp-1 text-[10px] text-white/80">
                  {item.vibe}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
