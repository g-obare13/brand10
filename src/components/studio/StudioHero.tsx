import { useState, useEffect, useRef } from "react"
import { Link } from "@tanstack/react-router"
import { useBrandStore } from "../../store/brandStore"
import { Button } from "../ui/button"
import GlassPanel from "../shared/GlassPanel"
import {
  IconArrowLeft,
  IconArrowBackUp,
  IconArrowForwardUp,
  IconCheck,
  IconCloudUpload,
  IconDownload,
  IconPencil,
} from "@tabler/icons-react"
import { gsap } from "gsap"
import { animateFadeUp } from "@/lib/gsap-animations"

interface StudioHeroProps {
  onOpenExport: () => void
}

/**
 * Studio hero section containing project title, breadcrumb backlink, and primary action buttons.
 * Features:
 * - GSAP staggered entry animations.
 * - Inline project title renaming.
 * - Undo/Redo state buttons.
 * - Cloud save status indicator and export action trigger.
 *
 * @component
 * @param {StudioHeroProps} props - The component props.
 * @param {() => void} props.onOpenExport - Handler to open the studio export modal.
 * @returns {React.ReactElement} The rendered studio hero section.
 */
export function StudioHero({ onOpenExport }: StudioHeroProps) {
  const brand = useBrandStore()
  const temporal = useBrandStore.temporal
  const [isEditingName, setIsEditingName] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return
    const ctx = gsap.context(() => {
      const items = containerRef.current?.querySelectorAll(".studio-hero-item")
      if (items && items.length > 0) {
        animateFadeUp(items, {
          y: 20,
          duration: 0.9,
          stagger: 0.08,
          delay: 0.1,
          ease: "power3.out",
        })
      }
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={containerRef} className="space-y-6 pt-4 sm:pt-6">
      {/* Studio Top Control Strip */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        {/* Left: Back Link & Brand Name Display/Editor */}
        <div className="studio-hero-item flex items-center gap-3">
          <GlassPanel
            blur="none"
            noise
            noiseOpacity={0.02}
            className="flex items-center rounded-full p-1 shadow-xs"
          >
            <Link
              to="/dashboard/projects"
              className="flex size-9 items-center justify-center rounded-full text-muted-foreground transition hover:bg-muted hover:text-foreground"
              title="Return to Dashboard"
              aria-label="Return to Dashboard"
            >
              <IconArrowLeft size={18} />
            </Link>
          </GlassPanel>

          <div className="flex items-center gap-2.5">
            {isEditingName ? (
              <input
                type="text"
                value={brand.brandName}
                onChange={(e) => brand.setBrandName(e.target.value)}
                onBlur={() => setIsEditingName(false)}
                onKeyDown={(e) => e.key === "Enter" && setIsEditingName(false)}
                autoFocus
                className="rounded-xl border border-primary bg-background px-3 py-1.5 text-lg font-bold text-foreground ring-2 ring-primary/20 outline-none"
                aria-label="Edit brand name"
              />
            ) : (
              <button
                type="button"
                onClick={() => setIsEditingName(true)}
                className="group flex cursor-pointer items-center gap-2.5 rounded-xl px-2 py-1 text-left transition hover:bg-muted/50"
                title="Click to rename brand"
              >
                <h1 className="text-xl font-bold tracking-tight text-foreground transition group-hover:text-primary sm:text-2xl">
                  {brand.brandName || "Untitled Brand"}
                </h1>
                <IconPencil
                  size={14}
                  className="text-muted-foreground opacity-60 transition group-hover:text-primary group-hover:opacity-100"
                />
              </button>
            )}

            {/* Save status badge */}
            <div className="flex items-center pl-2">
              {brand.isSaving ? (
                <span className="inline-flex animate-pulse items-center gap-1.5 rounded-full border border-amber-500/20 bg-amber-500/10 px-2.5 py-1 text-[11px] font-medium text-amber-500">
                  <IconCloudUpload size={13} />
                  Saving...
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-medium text-emerald-500">
                  <IconCheck size={13} />
                  Saved
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right: Undo/Redo & Export Assets */}
        <div className="studio-hero-item flex items-center gap-2 sm:gap-3">
          <GlassPanel
            blur="none"
            noise
            noiseOpacity={0.02}
            className="flex items-center gap-1 rounded-full p-1 shadow-xs"
          >
            {/* Undo */}
            <button
              type="button"
              onClick={() => temporal.getState().undo()}
              className="flex size-9 cursor-pointer items-center justify-center rounded-full text-muted-foreground transition hover:bg-muted hover:text-foreground"
              title="Undo (Ctrl+Z)"
              aria-label="Undo"
            >
              <IconArrowBackUp size={17} />
            </button>

            {/* Redo */}
            <button
              type="button"
              onClick={() => temporal.getState().redo()}
              className="flex size-9 cursor-pointer items-center justify-center rounded-full text-muted-foreground transition hover:bg-muted hover:text-foreground"
              title="Redo (Ctrl+Y)"
              aria-label="Redo"
            >
              <IconArrowForwardUp size={17} />
            </button>
          </GlassPanel>

          {/* Export Assets CTA */}
          <Button
            variant="shiny"
            className="btn-fill cursor-pointer rounded-full px-5 py-4 text-xs font-semibold shadow-md"
            icon={<IconDownload size={15} />}
            iconPlacement="left"
            onClick={onOpenExport}
          >
            Export Assets
          </Button>
        </div>
      </div>
    </div>
  )
}
