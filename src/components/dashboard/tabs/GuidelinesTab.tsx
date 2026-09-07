/**
 * @file GuidelinesTab.tsx
 * @description Dashboard tab displaying the 8 core design system guidelines:
 * Accessibility, Atomic Design, Color, Components, Foundations, Icons, Imagery, and Typography.
 * Each card navigates to an in-depth editorial article view.
 */

import { useState, useEffect, useRef } from "react"
import { Link } from "@tanstack/react-router"
import {
  IconAccessible,
  IconAtom,
  IconCompass,
  IconComponents,
  IconIcons,
  IconPalette,
  IconPhoto,
  IconTypography,
  IconArrowRight,
} from "@tabler/icons-react"
import { GUIDELINE_SUMMARIES } from "@/data/guidelines"
import { SpotlightCard } from "@/components/shared/SpotlightCard"
import WordReveal from "@/components/shared/WordReveal"
import { Button } from "@/components/ui/button"
import { animateFadeUp } from "@/lib/gsap-animations"

interface GuidelinesTabProps {
  onOpenCreateModal?: () => void
}

const GUIDELINE_ICONS: Record<
  string,
  React.ComponentType<{
    size?: number | string
    className?: string
    stroke?: number
  }>
> = {
  accessibility: IconAccessible,
  "atomic-design": IconAtom,
  color: IconPalette,
  components: IconComponents,
  foundations: IconCompass,
  icons: IconIcons,
  imagery: IconPhoto,
  typography: IconTypography,
}

/**
 * Dashboard tab displaying architectural guideline categories and system specs.
 *
 * @component
 * @param {GuidelinesTabProps} props - The component props.
 * @returns {React.ReactElement} The rendered brand guidelines tab.
 */
export function GuidelinesTab({ onOpenCreateModal: _onOpenCreateModal }: GuidelinesTabProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Staggered entrance animation for all guideline cards
  useEffect(() => {
    animateFadeUp(".guideline-showcase-card", {
      y: 35,
      duration: 0.7,
      stagger: 0.08,
      ease: "power3.out",
      trigger: containerRef.current,
    })
  }, [])

  return (
    <div ref={containerRef} className="space-y-8">
      {/* Tab Header */}
      <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
        <div className="max-w-3xl space-y-4 pt-4 sm:pt-8">
          <WordReveal as="h2" stagger={0.03} duration={1.4} start="top 90%">
            Design System Guidelines
          </WordReveal>

          <WordReveal as="p" stagger={0.02} duration={1.2} start="top 90%">
            The 8 architectural pillars for constructing scalable, accessible,
            and unified living design systems.
          </WordReveal>
        </div>
      </div>

      {/* Guidelines Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {GUIDELINE_SUMMARIES.map((card) => {
          const Icon = GUIDELINE_ICONS[card.id] ?? IconCompass

          return (
            <div key={card.id} className="guideline-showcase-card">
              <SpotlightCard
                color={card.accentColor}
                dimmed={hoveredId !== null && hoveredId !== card.id}
                onMouseEnter={() => setHoveredId(card.id)}
                onMouseLeave={() => setHoveredId(null)}
                className="group relative flex min-h-[320px] flex-col justify-between overflow-hidden p-6"
              >
                <div className="space-y-5">
                  {/* Top Row: Category & Read Time */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[11px] tracking-wider text-muted-foreground uppercase">
                      {card.category}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {card.readTime}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-2">
                    <h5>{card.title}</h5>
                    <p className="line-clamp-3 text-muted-foreground">
                      {card.description}
                    </p>
                  </div>
                </div>

                {/* Footer Action & Corner Decorative Watermark */}
                <div className="relative mt-6 flex items-center justify-between border-t border-border/60 pt-5">
                  <Link
                    to="/guidelines/$slug"
                    params={{ slug: card.slug }}
                    className="inline-flex"
                  >
                    <Button
                      size="pill"
                      variant="outline"
                      gsapFill
                      className="cursor-pointer rounded-full px-5 py-3 text-xs font-semibold"
                      icon={
                        <IconArrowRight
                          size={14}
                          className="transition-transform group-hover:translate-x-0.5"
                        />
                      }
                      iconPlacement="right"
                    >
                      Read Guideline
                    </Button>
                  </Link>

                  {/* Subtle Decorative Watermark Icon in Corner */}
                  <div
                    className="pointer-events-none absolute -right-3 -bottom-3 z-0 flex items-center justify-center opacity-15 transition-all duration-500 ease-out group-hover:opacity-25 group-hover:scale-105"
                    style={{ color: card.accentColor }}
                  >
                    <Icon size={80} stroke={1.2} />
                  </div>
                </div>
              </SpotlightCard>
            </div>
          )
        })}
      </div>
    </div>
  )
}
