/**
 * @file TemplatesTab.tsx
 * @description Dashboard tab displaying the Real-World Brand Guidelines Showcase.
 * Features official reference standards (headlined by Apple Style Guide & Brand Guidelines)
 * to educate and guide users on world-class brand architecture.
 */

import { SpotlightCard } from "@/components/shared/SpotlightCard"
import WordReveal from "@/components/shared/WordReveal"
import { Button } from "@/components/ui/button"
import { BRAND_SHOWCASE_CATALOG } from "@/data/templates"
import { animateFadeUp } from "@/lib/gsap-animations"
import { IconArrowRight, IconBook } from "@tabler/icons-react"
import { Link } from "@tanstack/react-router"
import { useEffect, useRef, useState } from "react"

interface TemplatesTabProps {
  onOpenCreateModal?: () => void
}

/**
 * Dashboard tab displaying authentic real-world brand guidelines reference catalog.
 *
 * @component
 * @param {TemplatesTabProps} props - Component properties.
 * @returns {React.ReactElement} The rendered templates showcase tab.
 */
export function TemplatesTab({
  onOpenCreateModal: _onOpenCreateModal,
}: TemplatesTabProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return
    const ctx = gsap.context(() => {
      const cards = containerRef.current?.querySelectorAll(".project-card")
      if (cards && cards.length > 0) {
        animateFadeUp(cards, {
          y: 30,
          duration: 1.1,
          stagger: 0.1,
          delay: 0.2,
          ease: "power3.out",
        })
      }
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <div className="space-y-8">
      {/* Tab Header */}
      <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
        <div className="max-w-3xl space-y-4 pt-4 sm:pt-8">
          <WordReveal as="h2" stagger={0.03} duration={1.4} start="top 90%">
            Brand Guidelines Showcase
          </WordReveal>

          <WordReveal as="p" stagger={0.02} duration={1.2} start="top 90%">
            Authoritative industry reference guidelines to help you understand
            how world-class organizations structure, specify, and enforce brand
            identity systems.
          </WordReveal>
        </div>
      </div>

      {/* Showcase Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {BRAND_SHOWCASE_CATALOG.map((item) => (
          <SpotlightCard
            key={item.id}
            color={item.colors[2] || "#0071E3"}
            dimmed={hoveredId !== null && hoveredId !== item.id}
            onMouseEnter={() => setHoveredId(item.id)}
            onMouseLeave={() => setHoveredId(null)}
            className="project-card flex min-h-[380px] flex-col justify-between p-6"
          >
            <div className="space-y-5">
              {/* Card Header & Badges */}
              <div className="flex items-center justify-between gap-2">
                {/* Color Swatch Previews */}
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
            <div className="mt-6 flex items-center justify-between border-t border-border/60 pt-5">
              <div className="space-y-0.5">
                <span className="block text-[10px] text-muted-foreground">
                  {item.fontFamily}
                </span>
                <span className="text-[10px] text-muted-foreground">
                  {item.sectionCount} Structured Pillars
                </span>
              </div>

              {item.id === "apple" ? (
                <Link
                  to="/templates/$templateId"
                  params={{ templateId: item.id }}
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
                    Read Guidelines
                  </Button>
                </Link>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  disabled
                  className="rounded-full px-5 py-3 text-xs font-semibold opacity-60"
                  icon={<IconBook size={14} />}
                >
                  Coming Soon
                </Button>
              )}
            </div>
          </SpotlightCard>
        ))}
      </div>
    </div>
  )
}
