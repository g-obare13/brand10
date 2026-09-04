import { useState } from "react"
import { useBrandStore } from "@/store/brandStore"
import { downloadBrandPdf } from "@/components/export/PdfBrandDeck"
import { toast } from "sonner"
import type { PreviewStyleId } from "./pages/A4PageFrame"
import { PdfPreviewStylesSidebar } from "./PdfPreviewStylesSidebar"
import { PdfDocumentCanvas } from "./PdfDocumentCanvas"
import { PdfPreviewRightSidebar } from "./PdfPreviewRightSidebar"

interface PdfPreviewStudioProps {
  projectId: string
}

/**
 * 3-Column Interactive Brand Guidelines PDF Preview Studio.
 * Inspired by pdfcn.dev / Takumi document preview.
 * - Left Panel: 4 Presentation Styles (Minimal, Cinematic, Vibrant, Candid)
 * - Center Panel: Multi-page A4 document renderer with interactive zoom and page jumper
 * - Right Panel: Document outline, active section inspector, and export hub
 */
export function PdfPreviewStudio({ projectId }: PdfPreviewStudioProps) {
  const brand = useBrandStore()

  // Map initial store imageryMood to a valid PreviewStyleId
  const initialStyle: PreviewStyleId =
    brand.imageryMood === "editorial" ? "candid" : brand.imageryMood

  const [activeStyle, setActiveStyle] = useState<PreviewStyleId>(initialStyle)
  const [activePage, setActivePage] = useState<number>(1)
  const [isDownloadingPdf, setIsDownloadingPdf] = useState<boolean>(false)

  const handleSelectStyle = (style: PreviewStyleId) => {
    setActiveStyle(style)
    // Synchronize to store imagery mood so other components stay updated
    brand.setImagery({
      mood: style === "candid" ? "editorial" : style,
    })
    toast.success(`Theme updated to ${style.charAt(0).toUpperCase() + style.slice(1)} style`)
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
        imageryMood: activeStyle === "candid" ? "editorial" : activeStyle,
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
