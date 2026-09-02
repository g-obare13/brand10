import { useNavigate } from "@tanstack/react-router"
import gsap from "gsap"
import React, { useEffect, useRef, useState } from "react"
import { animateFadeUp } from "../../lib/gsap-animations"
import { useAuthStore } from "../../store/authStore"
import { useProjectsStore } from "../../store/projectsStore"
import { useBrandStore } from "../../store/brandStore"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Loader } from "../ui/loader"

interface CreateProjectModalProps {
  isOpen: boolean
  onClose: () => void
}

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

  const overlayRef = useRef<HTMLDivElement>(null)
  const sheetRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const triggerClose = () => {
    if (!overlayRef.current || !sheetRef.current) {
      onClose()
      return
    }

    gsap.to(overlayRef.current, {
      opacity: 0,
      duration: 0.25,
      ease: "power2.in",
    })

    gsap.to(sheetRef.current, {
      y: 60,
      opacity: 0,
      scale: 0.96,
      duration: 0.25,
      ease: "power2.in",
      onComplete: () => {
        gsap.set(overlayRef.current, { display: "none" })
        setProjectName("")
        setCreateError(null)
        onClose()
      },
    })
  }

  useEffect(() => {
    if (isOpen) {
      if (overlayRef.current && sheetRef.current) {
        gsap.set(overlayRef.current, { display: "flex", opacity: 0 })
        gsap.to(overlayRef.current, {
          opacity: 1,
          duration: 0.35,
          ease: "power2.out",
        })

        gsap.fromTo(
          sheetRef.current,
          { y: 80, opacity: 0, scale: 0.95 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.48,
            ease: "power3.out",
            delay: 0.05,
            onComplete: () => {
              inputRef.current?.focus()
            },
          }
        )

        const items = sheetRef.current.querySelectorAll(".sheet-item-anim")
        if (items.length > 0) {
          animateFadeUp(Array.from(items), {
            y: 18,
            duration: 0.45,
            stagger: 0.06,
            delay: 0.12,
            ease: "power2.out",
          })
        }
      }
    } else if (overlayRef.current) {
      gsap.set(overlayRef.current, { display: "none" })
    }
  }, [isOpen])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        triggerClose()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setCreateError(null)

    if (projectsStore.isLimitReached()) {
      setCreateError("You have reached the maximum limit of 2 brand projects.")
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
      } else if (project) {
        brand.setProjectId(project.id)
        brand.setBrandName(project.name || projectName)
        triggerClose()
        navigate({
          to: "/studio/$projectId",
          params: { projectId: project.id },
        })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div
      ref={overlayRef}
      style={{ display: "none" }}
      onClick={(e) => {
        if (e.target === overlayRef.current) {
          triggerClose()
        }
      }}
      className="fixed inset-0 z-50 flex items-end justify-center bg-background/70 p-4 pb-20 backdrop-blur-md sm:p-6 sm:pb-24"
    >
      <div
        ref={sheetRef}
        className="w-full max-w-md space-y-6 rounded-3xl border border-border/80 bg-card/95 p-8 text-card-foreground shadow-2xl backdrop-blur-xl"
      >
        <div className="sheet-item-anim flex items-center gap-3">
          <div>
            <h5>Create New Brand Studio</h5>
            <p>Give your new brand identity workspace a name.</p>
          </div>
        </div>

        {createError && (
          <div className="sheet-item-anim rounded-2xl border border-destructive/20 bg-destructive/10 p-3.5 text-xs text-destructive">
            {createError}
          </div>
        )}

        <form onSubmit={handleCreate} className="space-y-5">
          <div className="sheet-item-anim">
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

          <div className="sheet-item-anim flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              size="pill"
              gsapFill
              onClick={triggerClose}
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
              icon={isSubmitting && <Loader />}
            >
              {isSubmitting ? "Creating..." : "Create Studio"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
