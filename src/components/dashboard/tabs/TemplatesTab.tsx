import { BRAND_TEMPLATES } from "@/data/dashboard"
import { IconPlus } from "@tabler/icons-react"
import { useState } from "react"
import { SpotlightCard } from "../../shared/SpotlightCard"
import { Button } from "../../ui/button"

interface TemplatesTabProps {
  onOpenCreateModal: () => void
}

/**
 * Dashboard tab displaying pre-configured brand identity starter templates.
 * Features:
 * - Starter kits (Apex Autonomous, Nova Creative, Bloom Organics, etc.).
 * - Swatch palette previews and typography movement details.
 * - One-click adoption triggering project creation dialog.
 *
 * @component
 * @param {TemplatesTabProps} props - The component props.
 * @param {() => void} props.onOpenCreateModal - Callback to create a project from template.
 * @returns {React.ReactElement} The rendered templates catalog tab.
 */
export function TemplatesTab({ onOpenCreateModal }: TemplatesTabProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-border/60 pb-3">
        <div>
          <h2 className="font-heading text-xl font-bold tracking-tight text-foreground">
            Brand Identity Templates
          </h2>
          <p className="text-xs text-muted-foreground">
            Pre-configured identity systems and aesthetic frameworks.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {BRAND_TEMPLATES.map((tmpl) => (
          <SpotlightCard
            key={tmpl.id}
            color={tmpl.colors[0] || "#6366f1"}
            dimmed={hoveredId !== null && hoveredId !== tmpl.id}
            onMouseEnter={() => setHoveredId(tmpl.id)}
            onMouseLeave={() => setHoveredId(null)}
            className="flex min-h-[300px] flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                {tmpl.colors.map((c, i) => (
                  <div
                    key={i}
                    className="size-6 rounded-full border border-white/20 shadow-xs"
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>

              <div>
                <span className="font-mono text-[11px] tracking-wider text-muted-foreground uppercase">
                  {tmpl.category}
                </span>
                <h3 className="mt-1 font-heading text-lg font-bold text-foreground transition group-hover:text-primary">
                  {tmpl.name}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  {tmpl.description}
                </p>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-border/60 pt-5">
              <span className="font-mono text-[11px] text-muted-foreground">
                {tmpl.fontFamily}
              </span>
              <Button
                size="pill"
                variant="outline"
                gsapFill
                onClick={onOpenCreateModal}
                className="rounded-full px-5 py-2 text-xs font-semibold"
                icon={<IconPlus size={14} />}
              >
                Use Template
              </Button>
            </div>
          </SpotlightCard>
        ))}
      </div>
    </div>
  )
}

