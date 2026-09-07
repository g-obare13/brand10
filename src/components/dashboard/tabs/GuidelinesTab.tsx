import { DEFAULT_GUIDELINE_CARDS } from "@/data/dashboard"
import {
  IconCompass,
  IconIcons,
  IconPalette,
  IconPhoto,
  IconTypography,
  IconVectorTriangle,
} from "@tabler/icons-react"
import { useNavigate } from "@tanstack/react-router"
import { useEffect, useRef, useState } from "react"
import { useProjectsStore } from "@/store/projectsStore"
import { SpotlightCard } from "@/components/shared/SpotlightCard"
import WordReveal from "@/components/shared/WordReveal"
import { animateFadeUp } from "@/lib/gsap-animations"
import { gsap } from "gsap"

interface GuidelinesTabProps {
  onOpenCreateModal: () => void
}

const GUIDELINE_COLORS: Record<string, string | undefined> = {
  logo: "#6366f1",
  color: "#ec4899",
  typography: "#3b82f6",
  imagery: "#10b981",
  iconography: "#f59e0b",
  foundation: "#8b5cf6",
}

const GUIDELINE_ICONS: Record<
  string,
  | React.ComponentType<{
      size?: number | string
      className?: string
      stroke?: number
      style?: React.CSSProperties
    }>
  | undefined
> = {
  logo: IconVectorTriangle,
  color: IconPalette,
  typography: IconTypography,
  imagery: IconPhoto,
  iconography: IconIcons,
  foundation: IconCompass,
}

/**
 * Dashboard tab displaying architectural guideline categories and system specs.
 * Features:
 * - Cards for Logo System, Color Science, Typographic Scale, Iconography, and Photography.
 * - Interactive hover spotlight effects with brand accent glow.
 * - Direct navigation to active project brand studio.
 *
 * @component
 * @param {GuidelinesTabProps} props - The component props.
 * @param {() => void} props.onOpenCreateModal - Callback to initiate project creation when no projects exist.
 * @returns {React.ReactElement} The rendered brand guidelines tab.
 */
export function GuidelinesTab({ onOpenCreateModal }: GuidelinesTabProps) {
  const navigate = useNavigate()
  const projectsStore = useProjectsStore()
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const hasProjects = projectsStore.projects.length > 0
  const firstProject = projectsStore.projects[0]

  useEffect(() => {
    if (!containerRef.current) return
    const ctx = gsap.context(() => {
      const cards = containerRef.current?.querySelectorAll(".guideline-card")
      if (cards && cards.length > 0) {
        animateFadeUp(cards, {
          y: 30,
          duration: 1.1,
          stagger: 0.08,
          delay: 0.15,
          ease: "power3.out",
        })
      }
    }, containerRef)

    return () => ctx.revert()
  }, [])

  const handleCardClick = () => {
    if (hasProjects) {
      navigate({
        to: "/studio/$projectId",
        params: { projectId: firstProject.id },
      })
    } else {
      onOpenCreateModal()
    }
  }

  return (
    <div ref={containerRef} className="space-y-6">
      {/* Tab Header */}
      <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
        <div className="max-w-3xl space-y-4 pt-4 sm:pt-8">
          <WordReveal as="h2" stagger={0.03} duration={1.4} start="top 90%">
            Brand Guidelines Architecture
          </WordReveal>

          <WordReveal as="p" stagger={0.02} duration={1.2} start="top 90%">
            The 6 core guideline pillars configured in your Brand10 studio.
          </WordReveal>
        </div>
      </div>

      {/* 3x2 Guidelines Cards Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {DEFAULT_GUIDELINE_CARDS.map((card) => {
          const accentColor = GUIDELINE_COLORS[card.id] ?? "#6366f1"
          const Icon = GUIDELINE_ICONS[card.id] ?? IconVectorTriangle

          return (
            <SpotlightCard
              key={card.id}
              color={accentColor}
              dimmed={hoveredId !== null && hoveredId !== card.id}
              onMouseEnter={() => setHoveredId(card.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={handleCardClick}
              className="guideline-card group relative flex min-h-55 cursor-pointer flex-col justify-between overflow-hidden p-6"
            >
              {/* Top Row: Title + Subtitle */}
              <div className="relative z-10 flex items-start justify-between gap-4">
                <div>
                  <h5>{card.title}</h5>
                  <p>{card.subtitle}</p>
                </div>
              </div>

              {/* Bottom Row: Description on Left, Relevant Icon on Right */}
              <div className="relative mt-6 flex items-end justify-between gap-4">
                <p className="relative z-10 max-w-[82%] text-muted-foreground">
                  {card.description}
                </p>

                {/* Decorative Relevant Watermark Icon in Corner */}
                <div
                  className="pointer-events-none absolute -right-5 -bottom-5 z-0 flex items-center justify-center opacity-20 transition-all duration-500 ease-out"
                  style={{ color: accentColor }}
                >
                  <Icon size={96} stroke={1.2} />
                </div>
              </div>
            </SpotlightCard>
          )
        })}
      </div>
    </div>
  )
}
