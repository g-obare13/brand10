import { useState } from "react"
import { useBrandStore } from "@/store/brandStore"
import type { BrandToneRatings } from "@/store/brandStore"
import { downloadBrandPdf } from "@/components/export/PdfBrandDeck"
import { toast } from "sonner"
import { DESIGN_MOVEMENTS } from "@/data/wizard"
import type { PreviewStyleId } from "@/components/wizard/preview/pages/A4PageFrame"
import { PdfPreviewStylesSidebar } from "./PdfPreviewStylesSidebar"
import { PdfDocumentCanvas } from "./PdfDocumentCanvas"
import { PdfPreviewRightSidebar } from "./PdfPreviewRightSidebar"

interface PdfPreviewStudioProps {
  projectId: string
}

/**
 * 3-Column Interactive Brand Guidelines PDF Preview Studio.
 * Inspired by pdfcn.dev / Takumi document preview.
 * - Left Panel: Presentation Styles (StepFoundation Design Movements)
 * - Center Panel: Multi-page A4 document renderer with interactive zoom and page jumper
 * - Right Panel: Document outline, active section inspector, and export hub
 */
export function PdfPreviewStudio({ projectId }: PdfPreviewStudioProps) {
  const brand = useBrandStore()

  // Track initial style from store designMovement or tone matching from stepFoundation
  const initialStyle: PreviewStyleId =
    (brand.designMovement as PreviewStyleId) ||
    (DESIGN_MOVEMENTS.find((m) =>
      Object.entries(m.tones).every(
        ([k, v]) => brand.toneRatings[k as keyof BrandToneRatings] === v
      )
    )?.id as PreviewStyleId) ||
    "quiet-precision"

  const [activeStyle, setActiveStyle] = useState<PreviewStyleId>(initialStyle)
  const [activePage, setActivePage] = useState<number>(1)
  const [isDownloadingPdf, setIsDownloadingPdf] = useState<boolean>(false)

  const handleSelectStyle = (style: PreviewStyleId) => {
    setActiveStyle(style)
    // Synchronize to store designMovement and tone ratings from stepFoundation
    brand.setDesignMovement(style)
    const movement = DESIGN_MOVEMENTS.find((m) => m.id === style)
    if (movement) {
      Object.entries(movement.tones).forEach(([key, val]) => {
        brand.setToneRating(key as keyof BrandToneRatings, val)
      })
    }
    toast.success(`Theme updated to ${movement?.label ?? style} style`)
  }

  const handleNavigateToPage = (pageNum: number) => {
    setActivePage(pageNum)
    const pageEl = document.getElementById(`page-0${pageNum}`)
    if (pageEl) {
      pageEl.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  const handleDownloadPdf = async () => {
    try {
      setIsDownloadingPdf(true)
      await downloadBrandPdf({
        brandName: brand.brandName,
        tagline: brand.tagline,
        mission: brand.mission,
        vision: brand.vision,
        coreValues: brand.coreValues,
        toneRatings: brand.toneRatings,
        colors: brand.colorPalette,
        displayFont: brand.displayFont,
        bodyFont: brand.bodyFont,
        monoFont: brand.monoFont,
        baseFontSize: brand.baseFontSize,
        typeScaleRatio: brand.typeScaleRatio,
        logoUrl: brand.logoUrl,
        rasterDataUri: brand.rasterDataUri,
        clearspaceMultiplier: brand.clearspaceMultiplier,
        dosAndDonts: brand.dosAndDonts,
        imageryMood: brand.imageryMood,
        imageryOverlay: brand.imageryOverlay,
        imageryLinks: brand.imageryLinks,
        iconStyle: brand.iconStyle,
        styleTheme: activeStyle,
      })
      toast.success("Brand Guidelines PDF exported.")
    } catch (err) {
      console.error("PDF generation failed:", err)
      toast.error("Failed to generate PDF deck. Please try again.")
    } finally {
      setIsDownloadingPdf(false)
    }
  }

  return (
    <div className="w-full space-y-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 xl:grid-cols-12">
        {/* Left Column: 4 Style Options (3 cols) */}
        <div className="lg:col-span-3 xl:col-span-3">
          <PdfPreviewStylesSidebar
            activeStyle={activeStyle}
            onSelectStyle={handleSelectStyle}
          />
        </div>

        {/* Center Column: A4 Document Canvas & Toolbar (6 cols) */}
        <div className="lg:col-span-6 xl:col-span-6 min-w-0">
          <PdfDocumentCanvas
            styleTheme={activeStyle}
            activePage={activePage}
            onPageChange={setActivePage}
            onDownloadPdf={handleDownloadPdf}
            isDownloadingPdf={isDownloadingPdf}
          />
        </div>

        {/* Right Column: Outline, Inspector & Export (3 cols) */}
        <div className="lg:col-span-3 xl:col-span-3">
          <PdfPreviewRightSidebar
            activePage={activePage}
            onNavigateToPage={handleNavigateToPage}
            onDownloadPdf={handleDownloadPdf}
            isDownloadingPdf={isDownloadingPdf}
            projectId={projectId}
          />
        </div>
      </div>
    </div>
  )
}
