import { useNavigate } from "@tanstack/react-router"
import { IconX } from "@tabler/icons-react"
import gsap from "gsap"
import React, { useEffect, useRef, useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader } from "@/components/ui/loader"
import { NoiseTexture } from "@/components/shared/NoiseTexture"
import { animateFadeUp } from "@/lib/gsap-animations"
import { useAuthStore } from "@/store/authStore"
import { useBrandStore } from "@/store/brandStore"
import { useProjectsStore } from "@/store/projectsStore"

interface CreateProjectModalProps {
  isOpen: boolean
  onClose: () => void
}

/**
 * Modal dialog for initiating a new brand system project.
 * Features:
 * - GSAP animated card and backdrop blur transitions matching LoginModal.
 * - Ultra-refined frosted glassmorphism with specular highlights and noise texture.
 * - Ambient illumination glow effects.
 * - Circular close button in top right corner.
 * - Staggered entrance animation for form controls.
 * - Project initialization into Supabase with automatic redirection to the step wizard.
 *
 * @component
 * @param {CreateProjectModalProps} props - The component props.
 * @param {boolean} props.isOpen - Whether modal is visible.
 * @param {() => void} props.onClose - Callback triggered on dismiss.
 * @returns {React.ReactElement} The modal element.
 */
export function CreateProjectModal({
  isOpen,
  onClose,
}: CreateProjectModalProps) {
  const navigate = useNavigate()
  const auth = useAuthStore()
  const projectsStore = useProjectsStore()
  const brand = useBrandStore()

  const [projectName, setProjectName] = useState("")
  const [createError, setCreateError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isClient, setIsClient] = useState(false)

  const cardRef = useRef<HTMLDivElement>(null)
  const backdropRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const prevOpenRef = useRef<boolean>(false)

  // Client-only initialization
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Animate card & backdrop in / out synchronously
  useEffect(() => {
    if (!isClient) return
    if (prevOpenRef.current === isOpen) return
    prevOpenRef.current = isOpen

    const card = cardRef.current
    const backdrop = backdropRef.current
    const container = containerRef.current
    if (!card) return

    const animItems = card.querySelectorAll(".sheet-item-anim")

    // Kill any in-flight animations
    gsap.killTweensOf([card, backdrop, ...Array.from(animItems)])

    if (isOpen) {
      // Fade in blurred background backdrop
      if (backdrop) {
        gsap.set(backdrop, { display: "block" })
        gsap.fromTo(
          backdrop,
          { opacity: 0 },
          {
            opacity: 1,
            duration: 0.35,
            ease: "power2.out",
          }
        )
      }

      if (container) {
        gsap.set(container, { display: "flex" })
      }

      // Animate modal card in
      gsap.fromTo(
        card,
        { opacity: 0, y: 16, scale: 0.96 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.45,
          ease: "power3.out",
          onComplete: () => {
            inputRef.current?.focus()
          },
        }
      )

      // Animate internal items with staggered fadeUp
      if (animItems.length > 0) {
        gsap.set(animItems, { opacity: 0, y: 16 })
        animateFadeUp(Array.from(animItems), {
          y: 16,
          duration: 0.45,
          stagger: 0.07,
          ease: "power2.out",
          delay: 0.1,
        })
      }
    } else {
      // Animate backdrop out
      if (backdrop) {
        gsap.to(backdrop, {
          opacity: 0,
          duration: 0.25,
          ease: "power2.in",
          onComplete: () => {
            gsap.set(backdrop, { display: "none" })
          },
        })
      }

      // Animate card out
      gsap.to(card, {
        opacity: 0,
        y: 16,
        scale: 0.96,
        duration: 0.25,
        ease: "power2.in",
        onComplete: () => {
          if (container) {
            gsap.set(container, { display: "none" })
          }
          gsap.set(animItems, { opacity: 0, y: 16 })
          setProjectName("")
          setCreateError(null)
        },
      })
    }
  }, [isOpen, isClient])

  // Escape key detection
  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, onClose])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setCreateError(null)

    if (projectsStore.isLimitReached()) {
      const msg = "You have reached the maximum limit of 2 brand projects."
      setCreateError(msg)
      toast.error(msg)
      return
    }

    setIsSubmitting(true)
    try {
      const { project, error } = await projectsStore.createProject(
        projectName,
        auth.user?.id
      )
      if (error) {
        setCreateError(error)
        toast.error(error)
      } else if (project) {
        brand.setProjectId(project.id)
        brand.setBrandName(project.name || projectName)
        onClose()
        toast.success(`Created project "${project.name || projectName}"`)
        try {
          await navigate({
            to: "/studio/$projectId",
            params: { projectId: project.id },
            search: { step: 1 },
          })
        } catch {
          window.location.href = `/studio/${project.id}`
        }
      }
    } catch (err: any) {
      const msg = err?.message || "Failed to create project"
      setCreateError(msg)
      toast.error(msg)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      {/* Full-screen background blur backdrop */}
      <div
        ref={backdropRef}
        aria-hidden="true"
        style={{ display: "none" }}
        onClick={onClose}
        className="fixed inset-0 z-50 bg-black/35 opacity-0 backdrop-blur-md transition-colors dark:bg-black/60"
      />

      {/* Modal Container */}
      <div
        ref={containerRef}
        style={{ display: "none" }}
        className="fixed inset-0 z-50 pointer-events-none flex items-end justify-center p-4 pb-20 sm:p-6 sm:pb-24"
      >
        <div
          ref={cardRef}
          className="pointer-events-auto relative w-full max-w-md overflow-hidden rounded-3xl border border-border/80 bg-card/90 p-6 text-foreground shadow-2xl backdrop-blur-2xl sm:p-8 dark:border-white/10 dark:bg-zinc-950/90"
        >
          {/* Subtle, refined ambient illumination */}
          <div className="pointer-events-none absolute -top-24 -right-16 h-56 w-56 rounded-full bg-primary/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-16 h-56 w-56 rounded-full bg-primary/5 blur-3xl" />

          {/* Subtle organic noise grain */}
          <NoiseTexture
            noiseOpacity={0.02}
            frequency={0.5}
            className="pointer-events-none absolute inset-0 mix-blend-overlay"
          />

          {/* Close Button */}
          <Button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 z-20 flex size-8 cursor-pointer rounded-full"
            aria-label="Close"
            variant="outline"
          >
            <IconX size={16} />
          </Button>

          {/* Modal Header */}
          <div className="sheet-item-anim flex items-center gap-3 opacity-0">
            <div>
              <h5>Create New Brand Project</h5>
              <p>Give your new brand identity workspace a name.</p>
            </div>
          </div>

          {createError && (
            <div className="mt-4 rounded-2xl border border-destructive/20 bg-destructive/10 p-3.5 text-xs text-destructive">
              {createError}
            </div>
          )}

          <form onSubmit={handleCreate} className="mt-6 space-y-5">
            <div className="sheet-item-anim opacity-0">
              <Label className="mb-2">Brand / Project Name</Label>
              <Input
                ref={inputRef}
                type="text"
                required
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="e.g. Lumina AI, Solstice Motors"
              />
            </div>

            <div className="sheet-item-anim flex justify-end gap-3 pt-2 opacity-0">
              <Button
                type="button"
                variant="outline"
                size="pill"
                gsapFill
                onClick={onClose}
                className="rounded-full"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="shiny"
                size="pill"
                gsapFill
                disabled={isSubmitting}
                className="rounded-full"
                icon={isSubmitting ? <Loader /> : undefined}
              >
                {isSubmitting ? "Creating..." : "Create Studio"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
