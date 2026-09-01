import { AI_ASSISTANCE_TOOLS } from "@/data/dashboard"
import { IconSparkles, IconWand } from "@tabler/icons-react"
import { useState } from "react"
import { SpotlightCard } from "../../shared/SpotlightCard"
import { Button } from "../../ui/button"

interface AiAssistanceTabProps {
  onOpenCreateModal: () => void
}

const AI_TOOL_COLORS: Record<string, string> = {
  "extract-file": "#8b5cf6",
  "palette-optimizer": "#06b6d4",
  "tone-generator": "#f59e0b",
}

export function AiAssistanceTab({ onOpenCreateModal }: AiAssistanceTabProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-border/60 pb-3">
        <div>
          <h2 className="font-heading text-xl font-bold tracking-tight text-foreground">
            AI Studio Assistance &amp; Generators
          </h2>
          <p className="text-xs text-muted-foreground">
            Automated brand extraction, contrast computation, and voice
            synthesis.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {AI_ASSISTANCE_TOOLS.map((tool) => {
          const accentColor = AI_TOOL_COLORS[tool.id] || "#6366f1"

          return (
            <SpotlightCard
              key={tool.id}
              color={accentColor}
              dimmed={hoveredId !== null && hoveredId !== tool.id}
              onMouseEnter={() => setHoveredId(tool.id)}
              onMouseLeave={() => setHoveredId(null)}
              className="flex min-h-[300px] flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div
                    className="rounded-2xl border p-3"
                    style={{
                      backgroundColor: `${accentColor}18`,
                      borderColor: `${accentColor}30`,
                      color: accentColor,
                    }}
                  >
                    <IconWand size={20} />
                  </div>
                  <span className="rounded-full border border-border bg-muted/40 px-3 py-1 font-mono text-[11px] text-muted-foreground">
                    {tool.badge}
                  </span>
                </div>

                <h3 className="pt-2 font-heading text-lg font-bold text-foreground transition group-hover:text-primary">
                  {tool.title}
                </h3>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  {tool.description}
                </p>
              </div>

              <div className="mt-6 border-t border-border/60 pt-5">
                <Button
                  variant="shiny"
                  size="pill"
                  gsapFill
                  onClick={onOpenCreateModal}
                  className="w-full rounded-full py-4 text-xs font-semibold"
                  icon={<IconSparkles size={14} />}
                >
                  {tool.actionLabel}
                </Button>
              </div>
            </SpotlightCard>
          )
        })}
      </div>
    </div>
  )
}

