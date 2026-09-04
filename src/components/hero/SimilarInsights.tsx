import ImageComponentOptimized from "@/components/shared/ImageComponentOptimized"
import WordReveal from "@/components/shared/WordReveal"
import type { InsightPost } from "@/data/insights"
import { animateParallax } from "@/lib/gsap-animations"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import * as React from "react"
import { InsightCard } from "./InsightCard"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

interface SimilarInsightsProps {
  articles: Array<InsightPost>
}

export function SimilarInsights({ articles }: SimilarInsightsProps) {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const listRef = React.useRef<HTMLDivElement>(null)
  const floatingRef = React.useRef<HTMLDivElement>(null)
  const [hoveredIndex, setHoveredIndex] = React.useState<number>(0)

  const xTo = React.useRef<((val: number) => void) | null>(null)
  const yTo = React.useRef<((val: number) => void) | null>(null)

  React.useEffect(() => {
    if (floatingRef.current) {
      xTo.current = gsap.quickTo(floatingRef.current, "x", {
        duration: 0.4,
        ease: "power3.out",
      })
      yTo.current = gsap.quickTo(floatingRef.current, "y", {
        duration: 0.4,
        ease: "power3.out",
      })
    }
  }, [])

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current || !xTo.current || !yTo.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left + 25 // Offset slightly to the right
    const y = e.clientY - rect.top + 25 // Offset slightly below the cursor
    xTo.current(x)
    yTo.current(y)
  }

  React.useEffect(() => {
    if (!containerRef.current) return

    const ctx = gsap.context(() => {
      // Items stagger fade up smoothly
      const items = listRef.current?.querySelectorAll(".insight-item")
      if (items && items.length > 0) {
        gsap.fromTo(
          items,
          { y: 55, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.0,
            stagger: 0.14,
            ease: "power3.out",
            scrollTrigger: {
              trigger: listRef.current,
              start: "top 85%",
            },
            clearProps: "transform,opacity",
          }
        )
      }

      // Image parallax
      const images = listRef.current?.querySelectorAll(".insight-image")
      if (images && images.length > 0) {
        Array.from(images).forEach((img) => {
          animateParallax(img, {
            yPercent: 15,
            trigger: img.parentElement,
          })
        })
      }
    }, containerRef)

    return () => ctx.revert()
  }, [articles])

  // Slice to 2 similar articles
  const displayArticles = articles.slice(0, 2)

  return (
    <section
      ref={containerRef}
      className="relative overflow-hidden border-t border-border pt-16"
      onMouseMove={handleMouseMove}
    >
      <div className="space-y-10">
        <WordReveal
          text="Similar Articles"
          as="h2"
          trigger={containerRef.current}
          stagger={0.03}
          duration={1.4}
          start="top 90%"
        />

        <div ref={listRef} className="relative">
          {displayArticles.map((item, index) => (
            <InsightCard
              key={index}
              item={item}
              index={index}
              onMouseEnter={() => {
                setHoveredIndex(index)
                gsap.to(floatingRef.current, {
                  scale: 1,
                  opacity: 1,
                  rotate: index % 2 === 0 ? 6 : -6,
                  duration: 0.4,
                  ease: "power3.out",
                })
              }}
              onMouseLeave={() => {
                gsap.to(floatingRef.current, {
                  scale: 0.8,
                  opacity: 0,
                  rotate: 0,
                  duration: 0.3,
                  ease: "power3.out",
                })
              }}
            />
          ))}
        </div>
      </div>

      {/* Floating Card (Follows Mouse, Desktop only) */}
      <div
        ref={floatingRef}
        className="shadow-custom pointer-events-none absolute top-0 left-0 z-50 hidden h-[180px] w-[280px] overflow-hidden rounded-2xl lg:block"
        style={{
          opacity: 0,
          scale: 0.8,
        }}
      >
        <div
          className="flex h-full flex-col transition-transform duration-500 ease-out"
          style={{
            transform: `translateY(-${hoveredIndex * 180}px)`,
          }}
        >
          {displayArticles.map((item, index) => (
            <div
              key={index}
              className="h-[180px] w-full shrink-0 overflow-hidden bg-neutral-900"
            >
              <ImageComponentOptimized
                src={item.image}
                alt={item.title}
                className="h-full w-full scale-110 object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
