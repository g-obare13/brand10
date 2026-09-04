import { useState } from "react"
import { useNavigate } from "@tanstack/react-router"
import { useBrandStore } from "@/store/brandStore"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader } from "@/components/ui/loader"
import { buildAndDownloadZip } from "@/lib/zipBuilder"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import {
  IconDownload,
  IconPackage,
  IconPrinter,
  IconSparkles,
  IconArrowRight,
  IconExternalLink,
} from "@tabler/icons-react"

export interface SectionOutlineItem {
  number: string
  title: string
  page: number
  stepNumber: number
  summary: string
}

export const OUTLINE_SECTIONS: SectionOutlineItem[] = [
  {
    number: "01",
    title: "Brand Foundation",
    page: 1,
    stepNumber: 1,
    summary: "Hero brand identity, mission, vision statements, and core brand values.",
  },
  {
    number: "02",
    title: "Logo System",
    page: 2,
    stepNumber: 2,
    summary: "Primary marks, dark mode variants, clearspace geometry, and usage rules.",
  },
  {
    number: "03",
    title: "Color Matrix",
    page: 3,
    stepNumber: 3,
    summary: "Primary and secondary swatches, WCAG contrast ratings, and tonal scales.",
  },
  {
    number: "04",
    title: "Typography Scale",
    page: 4,
    stepNumber: 4,
    summary: "Display, body, and monospace font pairings with modular type ladder.",
  },
  {
    number: "05",
    title: "Imagery Direction",
    page: 5,
    stepNumber: 5,
    summary: "Moodboard photography art direction, lighting standards, and overlays.",
  },
  {
    number: "06",
    title: "System Specs",
    page: 6,
    stepNumber: 6,
    summary: "Iconography geometry, token export manifest, and governance signoff.",
  },
]

interface PdfPreviewRightSidebarProps {
  activePage: number
  onNavigateToPage: (page: number) => void
  onDownloadPdf: () => void
  isDownloadingPdf?: boolean
  projectId: string
}

export function PdfPreviewRightSidebar({
  activePage,
  onNavigateToPage,
  onDownloadPdf,
  isDownloadingPdf = false,
  projectId,
}: PdfPreviewRightSidebarProps) {
  const brand = useBrandStore()
  const navigate = useNavigate()
  const [isZipping, setIsZipping] = useState(false)
  const [isFinishing, setIsFinishing] = useState(false)

  const activeSection =
    OUTLINE_SECTIONS.find((s) => s.page === activePage) || OUTLINE_SECTIONS[0]

  const handleZipExport = async () => {
    try {
      setIsZipping(true)
      await buildAndDownloadZip({
        brandName: brand.brandName,
        tagline: brand.tagline,
        mission: brand.mission,
        vision: brand.vision,
        coreValues: brand.coreValues,
        colors: brand.colorPalette,
        displayFont: brand.displayFont,
        bodyFont: brand.bodyFont,
        monoFont: brand.monoFont,
        baseFontSize: brand.baseFontSize,
        typeScaleRatio: brand.typeScaleRatio,
        isVector: brand.isVector,
        svgContent: brand.svgContent,
        rasterDataUri: brand.rasterDataUri,
      })
      toast.success("Production asset package downloaded.")
    } catch (err) {
      console.error("ZIP compile error:", err)
      toast.error("Failed to generate ZIP archive.")
    } finally {
      setIsZipping(false)
    }
  }

  const handleFinish = async () => {
    try {
      setIsFinishing(true)
      await brand.saveToSupabase()
      toast.success("Brand architecture saved successfully!")
      navigate({
        to: "/studio/$projectId",
        params: { projectId },
        search: { step: 1 },
      })
    } catch (err) {
      console.error("Failed to finish setup:", err)
      toast.error("Failed to complete setup. Please check connection.")
    } finally {
      setIsFinishing(false)
    }
  }

  const handleJumpToStep = (stepNumber: number) => {
    navigate({
      to: "/studio/$projectId",
      params: { projectId },
      search: { step: stepNumber },
    })
  }

  return (
    <aside className="flex flex-col gap-5 rounded-3xl border border-border/80 bg-card/85 p-5 backdrop-blur-xl shadow-sm">
      {/* 1. Document Outline / Table of Contents (Matching PDFCN screenshot) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
            Document Outline
          </span>
          <Badge variant="outline" className="font-mono text-[10px]">
            {OUTLINE_SECTIONS.length} Sections
          </Badge>
        </div>

        <div className="space-y-1">
          {OUTLINE_SECTIONS.map((section) => {
            const isActive = activePage === section.page

            return (
              <button
                key={section.page}
                type="button"
                onClick={() => onNavigateToPage(section.page)}
                className={cn(
                  "group flex w-full cursor-pointer items-center justify-between rounded-xl px-3 py-2 text-left text-xs transition-all duration-150",
                  isActive
                    ? "border border-primary/40 bg-primary/10 font-semibold text-primary shadow-xs"
                    : "border border-transparent text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                )}
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className={cn(
                      "font-mono text-[11px]",
                      isActive ? "text-primary font-bold" : "opacity-50"
                    )}
                  >
                    {section.number}
                  </span>
                  <span>{section.title}</span>
                </div>

                <span
                  className={cn(
                    "font-mono text-[10px]",
                    isActive ? "text-primary" : "opacity-40"
                  )}
                >
                  P.{section.page}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* 2. Active Section Inspector & Quick Jump */}
      <div className="rounded-2xl border border-border/60 bg-muted/30 p-4 space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 font-bold text-xs text-foreground">
            <span>{activeSection.title}</span>
            <IconExternalLink size={12} className="opacity-60" />
          </div>
          <Badge variant="outline" className="text-[10px] font-mono">
            Page {activeSection.page}
          </Badge>
        </div>

        <p className="text-[11px] text-muted-foreground leading-relaxed">
          {activeSection.summary}
        </p>

        <Button
          variant="outline"
          size="sm"
          onClick={() => handleJumpToStep(activeSection.stepNumber)}
          className="w-full text-xs font-semibold cursor-pointer justify-between"
        >
          <span>Edit in Step {activeSection.stepNumber}</span>
          <IconArrowRight size={13} />
        </Button>
      </div>

      {/* 3. Production Export Hub */}
      <div className="space-y-2.5 border-t border-border/60 pt-4">
        <span className="font-mono text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
          Export & Production
        </span>

        <div className="space-y-2">
          {/* Download PDF Button */}
          <Button
            variant="shiny"
            size="pill"
            onClick={onDownloadPdf}
            disabled={isDownloadingPdf}
            className="w-full text-xs font-semibold cursor-pointer justify-center"
            icon={isDownloadingPdf ? <Loader size="sm" /> : <IconDownload size={14} />}
            iconPlacement="left"
          >
            {isDownloadingPdf ? "Compiling PDF..." : "Download Brand PDF"}
          </Button>

          {/* Download Assets ZIP Button */}
          <Button
            variant="outline"
            size="pill"
            onClick={handleZipExport}
            disabled={isZipping}
            className="w-full text-xs font-semibold cursor-pointer justify-center"
            icon={isZipping ? <Loader size="sm" /> : <IconPackage size={14} />}
            iconPlacement="left"
          >
            {isZipping ? "Creating ZIP..." : "Download Assets ZIP"}
          </Button>

          {/* Native Print */}
          <Button
            variant="outline"
            size="pill"
            onClick={() => window.print()}
            className="w-full text-xs font-semibold cursor-pointer justify-center"
            icon={<IconPrinter size={14} />}
            iconPlacement="left"
          >
            Print Guidelines
          </Button>
        </div>
      </div>

      {/* 4. Complete & Finish Brand Setup */}
      <div className="border-t border-border/60 pt-3">
        <Button
          variant="default"
          size="pill"
          onClick={handleFinish}
          disabled={isFinishing}
          className="w-full text-xs font-semibold cursor-pointer justify-center"
          icon={isFinishing ? <Loader size="sm" /> : <IconSparkles size={14} />}
          iconPlacement="left"
        >
          {isFinishing ? "Saving System..." : "Finish & Open Studio"}
        </Button>
      </div>
    </aside>
  )
}
