import ImageComponentOptimized from "@/components/shared/ImageComponentOptimized"
import { SpotlightCard } from "@/components/shared/SpotlightCard"
import WordReveal from "@/components/shared/WordReveal"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Loader } from "@/components/ui/loader"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { animateFadeUp } from "@/lib/gsap-animations"
import { useAuthStore } from "@/store/authStore"
import { useBrandStore } from "@/store/brandStore"
import type { BrandProjectItem } from "@/store/projectsStore"
import { useProjectsStore } from "@/store/projectsStore"
import {
  IconAlertTriangle,
  IconArrowRight,
  IconPlus,
  IconTrash,
} from "@tabler/icons-react"
import { Link } from "@tanstack/react-router"
import { gsap } from "gsap"
import { get as idbGet } from "idb-keyval"
import { useEffect, useRef, useState } from "react"

interface ProjectsTabProps {
  onOpenCreateModal: () => void
}

interface ProjectCardLogoProps {
  project: BrandProjectItem
  primaryColor: string
  brandInitial: string
}

/**
 * Renders the logo preview badge for a project card.
 * Handles fallbacks between remote logo URLs, local IndexedDB cached SVGs, and brand initials.
 *
 * @component
 * @param {ProjectCardLogoProps} props - The component props.
 * @param {BrandProjectItem} props.project - The brand project metadata item.
 * @param {string} props.primaryColor - Primary brand color used for monogram & border styling.
 * @param {string} props.brandInitial - Monogram letter fallback.
 * @returns {React.ReactElement} The rendered project logo emblem.
 */
function ProjectCardLogo({
  project,
  primaryColor,
  brandInitial,
}: ProjectCardLogoProps) {
  const brand = useBrandStore()
  const [logoSrc, setLogoSrc] = useState<string | null>(() => {
    if (project.logo_url) return project.logo_url
    if (brand.projectId === project.id) {
      if (brand.logoUrl) return brand.logoUrl
      if (brand.svgContent) {
        return `data:image/svg+xml;utf8,${encodeURIComponent(brand.svgContent)}`
      }
    }
    return null
  })
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    let isMounted = true
    const isAlive = () => isMounted

    if (project.logo_url) {
      setLogoSrc(project.logo_url)
      setHasError(false)
      return
    }

    if (brand.projectId === project.id) {
      if (brand.logoUrl) {
        setLogoSrc(brand.logoUrl)
        setHasError(false)
        return
      }
      if (brand.svgContent) {
        setLogoSrc(
          `data:image/svg+xml;utf8,${encodeURIComponent(brand.svgContent)}`
        )
        setHasError(false)
        return
      }
    }

    const fetchCachedLogo = async () => {
      try {
        const cachedSvg = await idbGet<string>(`brand_svg_${project.id}`)
        if (!isAlive()) return
        if (cachedSvg) {
          setLogoSrc(`data:image/svg+xml;utf8,${encodeURIComponent(cachedSvg)}`)
          setHasError(false)
          return
        }

        const cachedRaster = await idbGet<string>(`brand_raster_${project.id}`)
        if (!isAlive()) return
        if (cachedRaster) {
          setLogoSrc(cachedRaster)
          setHasError(false)
          return
        }

        const raw = localStorage.getItem(`brandio_local_brand_${project.id}`)
        if (raw) {
          const parsed = JSON.parse(raw)
          if (parsed.logoUrl) {
            setLogoSrc(parsed.logoUrl)
            setHasError(false)
            return
          }
          if (parsed.svgContent) {
            setLogoSrc(
              `data:image/svg+xml;utf8,${encodeURIComponent(parsed.svgContent)}`
            )
            setHasError(false)
            return
          }
        }
      } catch {}
    }

    fetchCachedLogo()

    return () => {
      isMounted = false
    }
  }, [
    project.id,
    project.logo_url,
    brand.projectId,
    brand.logoUrl,
    brand.svgContent,
  ])

  if (logoSrc && !hasError) {
    return (
      <div
        className="flex size-12 items-center justify-center overflow-hidden rounded-2xl border border-border/80 bg-background/80 p-2 transition-transform duration-300 group-hover:scale-105"
        style={{ borderColor: `${primaryColor}30` }}
      >
        <ImageComponentOptimized
          src={logoSrc}
          alt={project.brand_name || project.name}
          className="size-full object-contain"
          imageClassName="w-full h-full object-cover"
          onError={() => setHasError(true)}
        />
      </div>
    )
  }

  return (
    <div
      className="flex size-12 items-center justify-center rounded-2xl border border-white/20 text-base font-bold text-white transition-transform duration-300 group-hover:scale-105"
      style={{
        backgroundColor: primaryColor,
      }}
    >
      {brandInitial}
    </div>
  )
}

/**
 * Main projects listing tab in the dashboard.
 * Features:
 * - Interactive spotlight project cards with logo, color indicators, and metadata.
 * - Project duplication, opening studio, and deletion with confirmation alert dialog.
 * - Empty state with direct project creation button.
 * - Integration with projectsStore, authStore, and brandStore.
 *
 * @component
 * @param {ProjectsTabProps} props - The component props.
 * @param {() => void} props.onOpenCreateModal - Callback to launch project creation dialog.
 * @returns {React.ReactElement} The rendered projects management tab.
 */
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
    projectsStore.fetchProjects(auth.user?.id)
  }, [auth.user?.id])

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
        {hasProjects && (
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
        )}

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
            {projectsStore.projects.map((project: BrandProjectItem) => {
              const primaryColor = project.primary_color || "#624b59"
              const brandInitial = (project.brand_name || project.name || "B")
                .charAt(0)
                .toUpperCase()

              return (
                <SpotlightCard
                  key={project.id}
                  color={primaryColor}
                  interactive={false}
                  tilt={false}
                  shimmer={false}
                  className="project-card group flex min-h-68 flex-col justify-between rounded-3xl bg-card/75 p-6 backdrop-blur-xl transition-all duration-300"
                >
                  <div className="space-y-4">
                    {/* Header: Logo / Avatar & Actions */}
                    <div className="flex items-center justify-between">
                      <ProjectCardLogo
                        project={project}
                        primaryColor={primaryColor}
                        brandInitial={brandInitial}
                      />

                      <div className="flex items-center gap-1.5">
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

                    {/* Brand Info */}
                    <div className="pt-1">
                      <h3>{project.brand_name || project.name}</h3>

                      {/* Vision Statement (if present) */}
                      {project.vision ? (
                        <p className="mt-1.5 line-clamp-2">{project.vision}</p>
                      ) : null}
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="mt-6 flex items-center justify-between border-t border-border/60 pt-5">
                    {/* Last edited timestamp */}
                    <p className="mt-2 text-xs font-medium text-muted-foreground">
                      Last edited{" "}
                      {new Date(project.updated_at).toLocaleDateString(
                        undefined,
                        {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        }
                      )}
                    </p>
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
              )
            })}
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
