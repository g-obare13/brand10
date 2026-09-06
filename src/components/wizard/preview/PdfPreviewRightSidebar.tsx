import { useState } from "react"
import { useNavigate } from "@tanstack/react-router"
import { useBrandStore } from "@/store/brandStore"
import { Button } from "@/components/ui/button"
import { Loader } from "@/components/ui/loader"
import { buildAndDownloadZip } from "@/lib/zipBuilder"
import { toast } from "sonner"
import {
  IconDeviceFloppy,
  IconDownload,
  IconMaximize,
  IconPackage,
  IconPrinter,
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
    summary:
      "Hero brand identity, mission, vision statements, and core brand values.",
  },
  {
    number: "02",
    title: "Logo System",
    page: 2,
    stepNumber: 2,
    summary:
      "Primary marks, dark mode variants, clearspace geometry, and usage rules.",
  },
  {
    number: "03",
    title: "Color Matrix",
    page: 3,
    stepNumber: 3,
    summary:
      "Primary and secondary swatches, WCAG contrast ratings, and tonal scales.",
  },
  {
    number: "04",
    title: "Typography Scale",
    page: 4,
    stepNumber: 4,
    summary:
      "Display, body, and monospace font pairings with modular type ladder.",
  },
  {
    number: "05",
    title: "Imagery Direction",
    page: 5,
    stepNumber: 5,
    summary:
      "Moodboard photography art direction, lighting standards, and overlays.",
  },
  {
    number: "06",
    title: "System Specs",
    page: 6,
    stepNumber: 6,
    summary:
      "Iconography geometry, token export manifest, and governance signoff.",
  },
]

interface PdfPreviewRightSidebarProps {
  activePage: number
  onNavigateToPage: (page: number) => void
  onDownloadPdf: () => void
  isDownloadingPdf?: boolean
  downloadProgress?: string
  projectId: string
  onOpenFullScreen?: () => void
}

export function PdfPreviewRightSidebar({
  activePage: _activePage,
  onNavigateToPage: _onNavigateToPage,
  onDownloadPdf,
  isDownloadingPdf = false,
  downloadProgress = "",
  projectId,
  onOpenFullScreen,
}: PdfPreviewRightSidebarProps) {
  const brand = useBrandStore()
  const navigate = useNavigate()
  const [isZipping, setIsZipping] = useState(false)
  const [isFinishing, setIsFinishing] = useState(false)

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
        secondarySvgContent: brand.secondarySvgContent,
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

  return (
    <aside className="flex flex-col gap-5 rounded-3xl bg-card/85 p-5 backdrop-blur-xl">
      {/* 1. Document Outline / Table of Contents (Matching PDFCN screenshot) */}
      {/* <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground">
            Document Outline
          </span>
          <Badge variant="outline" className="text-xs">
            {OUTLINE_SECTIONS.length} Sections
          </Badge>
        </div>

        <div className="space-y-3">
          {OUTLINE_SECTIONS.map((section) => {
            const isActive = activePage === section.page

            return (
              <Badge
                key={section.page}
                onClick={() => onNavigateToPage(section.page)}
                variant={isActive ? "default" : "outline"}
                className="w-full"
                icon={<span>{section.number}</span>}
                iconPosition="left"
              >
                <span>{section.title}</span>
              </Badge>
            )
          })}
        </div>
      </div> */}

      {/* 3. Production Export Hub */}
      <div className="space-y-2.5 pt-4">
        {/* <span className="text-xs">Export & Production</span> */}

        <div className="mt-2 space-y-2">
          {/* Full Screen Preview Button */}
          {onOpenFullScreen && (
            <Button
              variant="outline"
              size="pill"
              gsapFill
              onClick={onOpenFullScreen}
              className="w-full cursor-pointer justify-center"
              icon={<IconMaximize size={14} />}
              iconPlacement="right"
            >
              Full Screen Preview
            </Button>
          )}

          {/* Download PDF Button */}
          <Button
            variant="shiny"
            size="pill"
            gsapFill
            onClick={onDownloadPdf}
            disabled={isDownloadingPdf}
            className="w-full cursor-pointer justify-center"
            icon={
              isDownloadingPdf ? (
                <Loader size="sm" />
              ) : (
                <IconDownload size={14} />
              )
            }
            iconPlacement="right"
          >
            {isDownloadingPdf
              ? downloadProgress || "Compiling PDF..."
              : "Download Brand PDF"}
          </Button>

          {/* Download Assets ZIP Button */}
          <Button
            variant="outline"
            size="pill"
            gsapFill
            onClick={handleZipExport}
            disabled={isZipping}
            className="w-full cursor-pointer justify-center"
            icon={isZipping ? <Loader size="sm" /> : <IconPackage size={14} />}
            iconPlacement="right"
          >
            {isZipping ? "Creating ZIP..." : "Download Assets ZIP"}
          </Button>

          {/* Native Print */}
          <Button
            variant="outline"
            size="pill"
            gsapFill
            onClick={() => window.print()}
            className="w-full cursor-pointer justify-center"
            icon={<IconPrinter size={14} />}
            iconPlacement="right"
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
          gsapFill
          onClick={handleFinish}
          disabled={isFinishing}
          className="w-full cursor-pointer justify-center"
          icon={
            isFinishing ? <Loader size="sm" /> : <IconDeviceFloppy size={14} />
          }
          iconPlacement="right"
        >
          {isFinishing ? "Saving System..." : "Save"}
        </Button>
      </div>
    </aside>
  )
}
