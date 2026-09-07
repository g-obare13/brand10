/**
 * @file SystemsTab.tsx
 * @description Dashboard tab showcasing world-class design systems and brand style guides.
 * Displays authoritative industry systems arranged alphabetically with direct external links
 * and staggered entrance animations.
 */

import { useState, useEffect, useRef } from "react"
import { IconExternalLink, IconSparkles } from "@tabler/icons-react"
import { BRAND_SHOWCASE_CATALOG } from "@/data/templates"
import { SpotlightCard } from "@/components/shared/SpotlightCard"
import { Button } from "@/components/ui/button"
import { animateFadeUp } from "@/lib/gsap-animations"
import WordReveal from "@/components/shared/WordReveal"

interface SystemsTabProps {
  onOpenCreateModal?: () => void
}

/**
 * Dashboard systems catalog displaying real-world design systems in alphabetical order.
 *
 * @component
 * @param {SystemsTabProps} props - Component properties.
 * @returns {React.ReactElement} The rendered systems catalog view.
 */
export function SystemsTab({
  onOpenCreateModal: _onOpenCreateModal,
}: SystemsTabProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Staggered entrance animation for all cards
  useEffect(() => {
    animateFadeUp(".system-showcase-card", {
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
            Design Systems & Style Guides
          </WordReveal>

          <WordReveal as="p" stagger={0.02} duration={1.2} start="top 90%">
            Explore world-class living design systems and brand style guides
            from leading industry pioneers, organized alphabetically.
          </WordReveal>
        </div>
      </div>

      {/* Alphabetical Systems Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {BRAND_SHOWCASE_CATALOG.map((item) => (
          <div key={item.id} className="system-showcase-card">
            <SpotlightCard
              color={item.colors[1] || item.colors[0] || "#0071E3"}
              dimmed={hoveredId !== null && hoveredId !== item.id}
              onMouseEnter={() => setHoveredId(item.id)}
              onMouseLeave={() => setHoveredId(null)}
              className="flex flex-col justify-between p-6"
            >
              <div className="space-y-5">
                {/* Header & Badges */}
                <div className="flex items-center justify-between gap-2">
                  {/* Color Swatches */}
                  <div className="flex items-center gap-2">
                    {item.colors.map((c, i) => (
                      <div
                        key={i}
                        className="size-6 rounded-full border border-white/20 shadow-xs transition-transform hover:scale-110"
                        style={{ backgroundColor: c }}
                        title={c}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {item.edition}
                  </span>
                </div>

                {/* Content Description */}
                <div className="space-y-2">
                  <h5>{item.name}</h5>
                  <p className="line-clamp-3 text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="mt-6 flex flex-col gap-3 border-t border-border/60 pt-5">
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex"
                >
                  <Button
                    size="pill"
                    variant="outline"
                    gsapFill
                    className="cursor-pointer rounded-full px-5 py-3 text-xs font-semibold"
                    icon={<IconExternalLink size={14} />}
                    iconPlacement="right"
                  >
                    Read Guidelines
                  </Button>
                </a>
              </div>
            </SpotlightCard>
          </div>
        ))}

        {/* More Systems Coming Soon Card */}
        <div className="system-showcase-card">
          <SpotlightCard
            color="#6366f1"
            dimmed={hoveredId !== null && hoveredId !== "coming-soon"}
            onMouseEnter={() => setHoveredId("coming-soon")}
            onMouseLeave={() => setHoveredId(null)}
            className="flex flex-col justify-between border-dashed border-border/70 p-6"
          >
            <div className="space-y-5">
              {/* Header & Status */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="size-6 rounded-full border border-dashed border-muted-foreground/40 bg-muted/20" />
                  <div className="size-6 rounded-full border border-dashed border-muted-foreground/40 bg-muted/20" />
                  <div className="size-6 rounded-full border border-dashed border-muted-foreground/40 bg-muted/20" />
                </div>
                <span className="text-xs text-muted-foreground">
                  Upcoming
                </span>
              </div>

              {/* Content Description */}
              <div className="space-y-2">
                <h5>More Systems</h5>
                <p className="line-clamp-3 text-muted-foreground">
                  More living design systems and brand identity standards are currently being curated and added to the library.
                </p>
              </div>
            </div>

            {/* Card Footer Actions */}
            <div className="mt-6 flex flex-col gap-3 border-t border-border/60 pt-5">
              <div className="inline-flex">
                <Button
                  size="pill"
                  variant="outline"
                  disabled
                  className="rounded-full px-5 py-3 text-xs font-semibold opacity-60"
                  icon={<IconSparkles size={14} />}
                  iconPlacement="right"
                >
                  Coming Soon
                </Button>
              </div>
            </div>
          </SpotlightCard>
        </div>
      </div>
    </div>
  )
}
