import { DEFAULT_GUIDELINE_CARDS } from "@/data/dashboard"
import { IconDots, IconPencil } from "@tabler/icons-react"
import { useNavigate } from "@tanstack/react-router"
import { useState } from "react"
import { useProjectsStore } from "../../../store/projectsStore"
import { SpotlightCard } from "../../shared/SpotlightCard"

interface GuidelinesTabProps {
  onOpenCreateModal: () => void
}

const GUIDELINE_COLORS: Record<string, string> = {
  logo: "#6366f1",
  color: "#ec4899",
  typography: "#3b82f6",
  imagery: "#10b981",
  iconography: "#f59e0b",
  foundation: "#8b5cf6",
}

export function GuidelinesTab({ onOpenCreateModal }: GuidelinesTabProps) {
  const navigate = useNavigate()
  const projectsStore = useProjectsStore()
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const hasProjects = projectsStore.projects.length > 0
  const firstProject = projectsStore.projects[0]

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
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-border/60 pb-3">
        <div>
          <h2 className="font-heading text-xl font-bold tracking-tight text-foreground">
            Brand Guidelines Architecture
          </h2>
          <p className="text-xs text-muted-foreground">
            The 6 core guideline pillars configured in your Brandio studio.
          </p>
        </div>
      </div>

      {/* 3x2 Guidelines Cards Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {DEFAULT_GUIDELINE_CARDS.map((card) => {
          const accentColor = GUIDELINE_COLORS[card.id] || "#6366f1"

          return (
            <SpotlightCard
              key={card.id}
              color={accentColor}
              dimmed={hoveredId !== null && hoveredId !== card.id}
              onMouseEnter={() => setHoveredId(card.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={handleCardClick}
              className="flex min-h-55 flex-col justify-between p-6"
            >
              {/* Top Row: Title + Subtitle on Left, '••' Button on Right */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h5>{card.title}</h5>
                  <p>{card.subtitle}</p>
                </div>
              </div>

              {/* Bottom Row: Description on Left, Dark Action Button on Right */}
              <div className="mt-6 flex items-end justify-between gap-4">
                <p className="max-w-[82%]">{card.description}</p>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleCardClick()
                  }}
                  className="flex size-9 shrink-0 items-center justify-center rounded-full bg-foreground text-background shadow-md transition-transform duration-200 hover:scale-110"
                  title={`Configure ${card.title}`}
                >
                  <IconPencil size={15} />
                </button>
              </div>
            </SpotlightCard>
          )
        })}
      </div>
    </div>
  )
}
