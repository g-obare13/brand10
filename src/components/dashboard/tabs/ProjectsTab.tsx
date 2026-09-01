import type { BrandProjectItem } from "@/store/projectsStore"
import { useProjectsStore } from "@/store/projectsStore"
import { useAuthStore } from "@/store/authStore"
import {
  IconArrowRight,
  IconCopy,
  IconPlus,
  IconTrash,
} from "@tabler/icons-react"
import { Link } from "@tanstack/react-router"
import { useEffect, useRef, useState } from "react"
import { SpotlightCard } from "../../shared/SpotlightCard"
import { Button } from "../../ui/button"
import WordReveal from "@/components/shared/WordReveal"
import { animateFadeUp } from "@/lib/gsap-animations"
import { gsap } from "gsap"

interface ProjectsTabProps {
  onOpenCreateModal: () => void
}

export function ProjectsTab({ onOpenCreateModal }: ProjectsTabProps) {
  const auth = useAuthStore()
  const projectsStore = useProjectsStore()
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const isLimitReached = projectsStore.isLimitReached()
  const hasProjects = projectsStore.projects.length > 0
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

      const emptyBtn = containerRef.current?.querySelector(".empty-create-btn")
      if (emptyBtn) {
        animateFadeUp(emptyBtn, {
          y: 20,
          duration: 1.0,
          delay: 0.35,
          ease: "power3.out",
        })
      }
    }, containerRef)

    return () => ctx.revert()
  }, [hasProjects, projectsStore.projects.length])

  return (
    <div ref={containerRef} className="space-y-6">
      {/* Welcome Header Section */}
      <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
        <div className="max-w-3xl space-y-4 pt-4 sm:pt-8">
          <WordReveal as="h2" stagger={0.03} duration={1.4} start="top 90%">
            Your Brand Projects
          </WordReveal>

          <WordReveal as="p" stagger={0.02} duration={1.2} start="top 90%">
            {projectsStore.projects.length} of 2 slots used
          </WordReveal>
        </div>
      </div>

      {hasProjects ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projectsStore.projects.map((project: BrandProjectItem) => (
            <SpotlightCard
              key={project.id}
              color={project.primary_color || "#4f46e5"}
              dimmed={hoveredId !== null && hoveredId !== project.id}
              onMouseEnter={() => setHoveredId(project.id)}
              onMouseLeave={() => setHoveredId(null)}
              className="project-card flex min-h-65 flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div
                    className="flex size-10 items-center justify-center rounded-2xl border border-white/20 text-sm font-bold text-white shadow-md transition-transform duration-300 group-hover:scale-105"
                    style={{
                      backgroundColor: project.primary_color || "#4f46e5",
                      boxShadow: `0 6px 16px ${project.primary_color || "#4f46e5"}40`,
                    }}
                  >
                    {(project.brand_name || project.name || "B")
                      .charAt(0)
                      .toUpperCase()}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        projectsStore.duplicateProject(project.id, auth.user?.id)
                      }}
                      disabled={isLimitReached}
                      className="rounded-full p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground disabled:opacity-40"
                      title="Duplicate Brand"
                    >
                      <IconCopy size={15} />
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        projectsStore.deleteProject(project.id, auth.user?.id)
                      }}
                      className="rounded-full p-2 text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive"
                      title="Delete Brand"
                    >
                      <IconTrash size={15} />
                    </button>
                  </div>
                </div>

                <div className="pt-2">
                  <h3 className="font-heading text-xl font-bold tracking-tight text-foreground transition group-hover:text-primary">
                    {project.brand_name || project.name}
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Last edited{" "}
                    {new Date(project.updated_at).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-border/60 pt-5">
                <span className="rounded-full border border-border bg-muted/40 px-3 py-1 font-mono text-[11px] text-muted-foreground">
                  System v1.0
                </span>

                <Link
                  to="/studio/$projectId"
                  params={{ projectId: project.id }}
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
                    Open Studio
                  </Button>
                </Link>
              </div>
            </SpotlightCard>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-3xl p-12 text-center backdrop-blur-sm">
          <WordReveal
            as="h5"
            stagger={0.03}
            duration={1.4}
            start="top 90%"
            text="No active brand workspaces"
          />

          <WordReveal
            as="p"
            stagger={0.03}
            duration={1.4}
            start="top 90%"
            className="mt-1 max-w-sm"
            text="Create your first brand workspace to generate typography, color
            palettes, and export brand guideline decks."
          />
          <Button
            variant="shiny"
            size="pill"
            gsapFill
            onClick={onOpenCreateModal}
            className="empty-create-btn mt-6 rounded-full px-8! py-5! text-xs font-semibold"
            icon={<IconPlus size={16} />}
          >
            Create New Studio
          </Button>
        </div>
      )}
    </div>
  )
}
