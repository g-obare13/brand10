import type { BrandProjectItem } from "@/store/projectsStore"
import { useProjectsStore } from "@/store/projectsStore"
import { useAuthStore } from "@/store/authStore"
import {
  IconArrowRight,
  IconCopy,
  IconPlus,
  IconTrash,
  IconAlertTriangle,
} from "@tabler/icons-react"
import { Link } from "@tanstack/react-router"
import { useEffect, useRef, useState } from "react"
import { SpotlightCard } from "../../shared/SpotlightCard"
import { Button } from "../../ui/button"
import WordReveal from "@/components/shared/WordReveal"
import { animateFadeUp } from "@/lib/gsap-animations"
import { gsap } from "gsap"
import { cn } from "@/lib/utils"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../ui/tooltip"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../ui/alert-dialog"
import { Loader } from "@/components/ui/loader"

interface ProjectsTabProps {
  onOpenCreateModal: () => void
}

export function ProjectsTab({ onOpenCreateModal }: ProjectsTabProps) {
  const auth = useAuthStore()
  const projectsStore = useProjectsStore()
  const isLimitReached = projectsStore.isLimitReached()
  const hasProjects = projectsStore.projects.length > 0
  const isLoading = projectsStore.loading
  const containerRef = useRef<HTMLDivElement>(null)

  // State for delete confirmation modal
  const [projectToDelete, setProjectToDelete] =
    useState<BrandProjectItem | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

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
  }, [hasProjects, isLoading, projectsStore.projects.length])

  const handleConfirmDelete = async () => {
    if (!projectToDelete) return
    setIsDeleting(true)
    try {
      await projectsStore.deleteProject(projectToDelete.id, auth.user?.id)
      setProjectToDelete(null)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <TooltipProvider delay={100}>
      <div ref={containerRef} className="space-y-6">
        {/* Welcome Header Section */}
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-3xl space-y-4 pt-4 sm:pt-8">
            <WordReveal as="h2" stagger={0.03} duration={1.4} start="top 90%">
              Your Brand Projects
            </WordReveal>

            <WordReveal as="p" stagger={0.02} duration={1.2} start="top 90%">
              {isLoading
                ? "Loading projects..."
                : `${projectsStore.projects.length} of 2 slots used`}
            </WordReveal>
          </div>
        </div>

        {isLoading ? (
          /* Loading Skeletons - Prevents Empty State Flashing */
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="flex min-h-65 animate-pulse flex-col justify-between rounded-2xl border border-border/40 bg-card/60 p-7"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="size-10 rounded-2xl bg-muted" />
                    <div className="flex gap-1.5">
                      <div className="size-8 rounded-full bg-muted" />
                      <div className="size-8 rounded-full bg-muted" />
                    </div>
                  </div>
                  <div className="space-y-2 pt-2">
                    <div className="h-6 w-3/4 rounded-lg bg-muted" />
                    <div className="h-3 w-1/3 rounded-lg bg-muted" />
                  </div>
                </div>
                <div className="mt-6 flex items-center justify-between border-t border-border/60 pt-5">
                  <div className="h-5 w-20 rounded-full bg-muted" />
                  <div className="h-9 w-28 rounded-full bg-muted" />
                </div>
              </div>
            ))}
          </div>
        ) : hasProjects ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projectsStore.projects.map((project: BrandProjectItem) => (
              <SpotlightCard
                key={project.id}
                color={project.primary_color || "#4f46e5"}
                interactive={false}
                tilt={false}
                shimmer={false}
                className="project-card flex min-h-65 flex-col justify-between shadow-none"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div
                      className="flex size-10 items-center justify-center rounded-2xl border text-sm font-bold text-white transition-transform duration-300"
                      style={{
                        backgroundColor: project.primary_color || "#4f46e5",
                        // boxShadow: `0 6px 16px ${project.primary_color || "#4f46e5"}40`,
                      }}
                    >
                      {(project.brand_name || project.name || "B")
                        .charAt(0)
                        .toUpperCase()}
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Tooltip>
                        <TooltipTrigger
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            if (isLimitReached) return
                            projectsStore.duplicateProject(
                              project.id,
                              auth.user?.id
                            )
                          }}
                          className={cn(
                            "cursor-pointer rounded-full border p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground",
                            isLimitReached &&
                              "cursor-not-allowed opacity-40 hover:bg-transparent hover:text-muted-foreground"
                          )}
                          aria-label="Duplicate Brand"
                        >
                          <IconCopy size={15} />
                        </TooltipTrigger>
                        <TooltipContent
                          side="top"
                          sideOffset={6}
                          className="text-xs font-medium shadow-xl"
                        >
                          {isLimitReached
                            ? "Project Limit Reached (Max 2)"
                            : "Duplicate Brand"}
                        </TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            setProjectToDelete(project)
                          }}
                          className="cursor-pointer rounded-full border border-destructive/20 p-2 text-destructive transition hover:bg-destructive/10"
                          aria-label="Delete Brand"
                        >
                          <IconTrash size={15} />
                        </TooltipTrigger>
                        <TooltipContent
                          side="top"
                          sideOffset={6}
                          className="text-xs font-medium shadow-xl"
                        >
                          Delete Brand
                        </TooltipContent>
                      </Tooltip>
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

        {/* Delete Confirmation Alert Dialog */}
        <AlertDialog
          open={projectToDelete !== null}
          onOpenChange={(open) => {
            if (!open) setProjectToDelete(null)
          }}
        >
          <AlertDialogContent className="max-w-md rounded-3xl border-0 bg-card/95 p-6 backdrop-blur-xl">
            <AlertDialogHeader className="space-y-3">
              <div className="flex size-11 items-center justify-center rounded-2xl border border-destructive/20 bg-destructive/10 text-destructive shadow-xs">
                <IconAlertTriangle size={22} />
              </div>
              <AlertDialogTitle className="font-heading text-lg font-bold text-foreground">
                Delete Brand Workspace?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-base text-foreground">
                Are you sure you want to permanently delete{" "}
                <span className="font-semibold text-foreground">
                  {projectToDelete?.brand_name ||
                    projectToDelete?.name ||
                    "this workspace"}
                </span>
                ? This action cannot be undone. All color matrices, typography
                pairings, and saved tokens will be permanently removed.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="mt-6 flex items-center justify-end gap-2.5">
              <AlertDialogCancel
                onClick={() => setProjectToDelete(null)}
                className="cursor-pointer rounded-full"
                disabled={isDeleting}
              >
                Cancel
              </AlertDialogCancel>
              <Button
                variant="destructive_outline"
                size="sm"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="cursor-pointer rounded-full"
                icon={isDeleting && <Loader />}
              >
                {isDeleting ? "Deleting..." : "Delete Project"}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </TooltipProvider>
  )
}
