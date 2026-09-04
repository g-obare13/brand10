import { useEffect, useRef, useState } from "react"
import { useBrandStore } from "@/store/brandStore"
import { loadGoogleFont } from "@/lib/fontLoader"
import { Button } from "@/components/ui/button"
import { Loader } from "@/components/ui/loader"
import { cn } from "@/lib/utils"
import type { PreviewStyleId } from "./pages/A4PageFrame"
import { PageCover } from "./pages/PageCover"
import { PageLogo } from "./pages/PageLogo"
import { PageColors } from "./pages/PageColors"
import { PageTypography } from "./pages/PageTypography"
import { PageImagery } from "./pages/PageImagery"
import { PageTouchpoints } from "./pages/PageTouchpoints"
import {
  IconZoomIn,
  IconZoomOut,
  IconZoomReset,
  IconChevronLeft,
  IconChevronRight,
  IconPrinter,
  IconDownload,
} from "@tabler/icons-react"

interface PdfDocumentCanvasProps {
  styleTheme: PreviewStyleId
  activePage: number
  onPageChange: (page: number) => void
  onDownloadPdf: () => void
  isDownloadingPdf?: boolean
}

export function PdfDocumentCanvas({
  styleTheme,
  activePage,
  onPageChange,
  onDownloadPdf,
  isDownloadingPdf = false,
}: PdfDocumentCanvasProps) {
  const brand = useBrandStore()
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [zoom, setZoom] = useState<number>(0.85)

  // Dynamically load selected Google fonts or custom fonts into DOM
  useEffect(() => {
    loadGoogleFont(brand.displayFont)
    loadGoogleFont(brand.bodyFont)
    loadGoogleFont(brand.monoFont)

    if (brand.stagedFontFiles && brand.stagedFontFiles.length > 0) {
      brand.stagedFontFiles.forEach((staged) => {
        try {
          const blobUrl = URL.createObjectURL(staged.file)
          const weights = ["400", "500", "600", "700"]
          weights.forEach((w) => {
            try {
              const face = new FontFace(staged.family, `url(${blobUrl})`, {
                weight: w,
                style: "normal",
              })
              face.load().then((loaded) => document.fonts.add(loaded)).catch(() => {})
            } catch {}
          })
        } catch {}
      })
    }

    if (brand.customFonts && brand.customFonts.length > 0) {
      brand.customFonts.forEach((cf) => {
        try {
          const weights = ["400", "500", "600", "700"]
          weights.forEach((w) => {
            try {
              const face = new FontFace(cf.family, `url(${cf.url})`, {
                weight: w,
                style: "normal",
              })
              face.load().then((loaded) => document.fonts.add(loaded)).catch(() => {})
            } catch {}
          })
        } catch {}
      })
    }
  }, [brand.displayFont, brand.bodyFont, brand.monoFont, brand.stagedFontFiles, brand.customFonts])

  // Track page scroll to sync active page index
  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    const pageElements = container.querySelectorAll<HTMLElement>(".preview-a4-page")
    if (pageElements.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.4) {
            const pageNum = Number(entry.target.getAttribute("data-page"))
            if (pageNum && pageNum !== activePage) {
              onPageChange(pageNum)
            }
          }
        })
      },
      {
        root: container,
        threshold: [0.4],
      }
    )

    pageElements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [activePage, onPageChange])

  // Scroll to a specific page
  const scrollToPage = (pageNum: number) => {
    const target = scrollContainerRef.current?.querySelector(
      `[data-page="${pageNum}"]`
    )
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  const handleZoomIn = () => setZoom((prev) => Math.min(1.3, prev + 0.1))
  const handleZoomOut = () => setZoom((prev) => Math.max(0.5, prev - 0.1))
  const handleZoomReset = () => setZoom(0.85)

  const handlePrint = () => {
    window.print()
  }

  const primaryColor =
    brand.colorPalette.find((c) => c.role === "primary")?.hex || "#6366f1"
  const secondaryColor =
    brand.colorPalette.find((c) => c.role === "secondary")?.hex || "#0ea5e9"

  return (
    <div className="flex flex-col rounded-3xl border border-border/80 bg-zinc-900/90 shadow-lg backdrop-blur-xl overflow-hidden">
      {/* Top Floating Control Bar (Inspired by PDFCN / Takumi toolbar) */}
      <div className="flex items-center justify-between border-b border-border/60 bg-zinc-950/70 px-4 py-3 text-xs text-zinc-300">
        {/* Left: Page Counter & Prev/Next */}
        <div className="flex items-center gap-2 font-mono">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              if (activePage > 1) scrollToPage(activePage - 1)
            }}
            disabled={activePage <= 1}
            className="size-8 p-0 text-zinc-300 hover:text-white hover:bg-white/10"
            title="Previous Page"
          >
            <IconChevronLeft size={16} />
          </Button>

          <span className="min-w-16 text-center font-medium">
            {activePage} / 6
          </span>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              if (activePage < 6) scrollToPage(activePage + 1)
            }}
            disabled={activePage >= 6}
            className="size-8 p-0 text-zinc-300 hover:text-white hover:bg-white/10"
            title="Next Page"
          >
            <IconChevronRight size={16} />
          </Button>
        </div>

        {/* Center: Document Title & Selected Font Indicator */}
        <div className="hidden sm:flex items-center gap-2 text-zinc-400 font-mono text-[11px]">
          <span className="text-zinc-200 font-medium">{brand.brandName || "Brand Manual"}</span>
          <span>•</span>
          <span>A4 Format</span>
          <span>•</span>
          <span className="text-zinc-300">{brand.displayFont}</span>
        </div>

        {/* Right: Zoom & Export Controls */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Zoom controls */}
          <div className="flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2 py-0.5 font-mono text-[11px]">
            <button
              type="button"
              onClick={handleZoomOut}
              className="cursor-pointer p-1 text-zinc-400 hover:text-white transition-colors"
              title="Zoom Out"
            >
              <IconZoomOut size={14} />
            </button>
            <span className="w-10 text-center text-zinc-300">
              {Math.round(zoom * 100)}%
            </span>
            <button
              type="button"
              onClick={handleZoomIn}
              className="cursor-pointer p-1 text-zinc-400 hover:text-white transition-colors"
              title="Zoom In"
            >
              <IconZoomIn size={14} />
            </button>
            <button
              type="button"
              onClick={handleZoomReset}
              className="cursor-pointer border-l border-white/10 pl-1.5 py-1 text-zinc-400 hover:text-white transition-colors"
              title="Reset Zoom"
            >
              <IconZoomReset size={14} />
            </button>
          </div>

          {/* Quick Print Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handlePrint}
            className="size-8 p-0 text-zinc-300 hover:text-white hover:bg-white/10 cursor-pointer"
            title="Print Document"
          >
            <IconPrinter size={16} />
          </Button>

          {/* Quick Download PDF Button */}
          <Button
            variant="shiny"
            size="sm"
            onClick={onDownloadPdf}
            disabled={isDownloadingPdf}
            className="h-8 rounded-full px-3 text-xs font-semibold cursor-pointer"
            icon={isDownloadingPdf ? <Loader size="sm" /> : <IconDownload size={14} />}
            iconPlacement="left"
          >
            {isDownloadingPdf ? "Exporting..." : "Download PDF"}
          </Button>
        </div>
      </div>

      {/* Main Canvas Scroll Area with Floating Quick-Jump Rail */}
      <div className="relative flex-1 min-h-0">
        {/* Floating Quick Page Rail to see and scrub between all 6 pages at once */}
        <div className="absolute right-3 top-6 z-20 hidden lg:flex flex-col gap-1.5 rounded-2xl border border-white/10 bg-zinc-900/90 p-1.5 shadow-2xl backdrop-blur-md">
          {[
            { num: 1, label: "Cover" },
            { num: 2, label: "Logo" },
            { num: 3, label: "Colors" },
            { num: 4, label: "Type" },
            { num: 5, label: "Imagery" },
            { num: 6, label: "Specs" },
          ].map((p) => {
            const isCurrent = activePage === p.num
            return (
              <button
                key={p.num}
                type="button"
                onClick={() => scrollToPage(p.num)}
                title={`Page ${p.num}: ${p.label}`}
                className={cn(
                  "group relative flex size-7 items-center justify-center rounded-xl font-mono text-[11px] transition-all cursor-pointer",
                  isCurrent
                    ? "bg-primary text-primary-foreground font-bold shadow-xs scale-105"
                    : "text-zinc-400 hover:bg-white/10 hover:text-white"
                )}
              >
                <span>{p.num}</span>
                <span className="pointer-events-none absolute right-full mr-2 hidden rounded-md bg-zinc-900 px-2 py-1 text-[11px] font-medium text-white shadow-md group-hover:block whitespace-nowrap border border-white/10">
                  {p.num}. {p.label}
                </span>
              </button>
            )
          })}
        </div>

        <div
          ref={scrollContainerRef}
          className="relative h-full overflow-y-auto max-h-[820px] p-6 lg:p-10 bg-zinc-950/80 custom-scrollbar scroll-smooth flex flex-col items-center"
        >
          <div
            className="transition-transform duration-200 origin-top space-y-12 pb-16"
            style={{ transform: `scale(${zoom})` }}
          >
            {/* Page 1: Cover & Foundation */}
            <PageCover
              brandName={brand.brandName}
              tagline={brand.tagline}
              mission={brand.mission}
              vision={brand.vision}
              coreValues={brand.coreValues}
              primaryColor={primaryColor}
              secondaryColor={secondaryColor}
              svgContent={brand.svgContent}
              rasterDataUri={brand.rasterDataUri}
              styleTheme={styleTheme}
              displayFont={brand.displayFont}
              bodyFont={brand.bodyFont}
              monoFont={brand.monoFont}
            />

            {/* Page 2: Logo System & Geometry */}
            <PageLogo
              brandName={brand.brandName}
              primaryColor={primaryColor}
              svgContent={brand.svgContent}
              rasterDataUri={brand.rasterDataUri}
              secondarySvgContent={brand.secondarySvgContent}
              isVector={brand.isVector}
              clearspaceMultiplier={brand.clearspaceMultiplier}
              dosAndDonts={brand.dosAndDonts}
              styleTheme={styleTheme}
              displayFont={brand.displayFont}
              bodyFont={brand.bodyFont}
              monoFont={brand.monoFont}
            />

            {/* Page 3: Color Matrix & Palette */}
            <PageColors
              brandName={brand.brandName}
              colors={brand.colorPalette}
              styleTheme={styleTheme}
              displayFont={brand.displayFont}
              bodyFont={brand.bodyFont}
              monoFont={brand.monoFont}
            />

            {/* Page 4: Typography Hierarchy */}
            <PageTypography
              brandName={brand.brandName}
              displayFont={brand.displayFont}
              bodyFont={brand.bodyFont}
              monoFont={brand.monoFont}
              typeScaleRatio={brand.typeScaleRatio}
              baseFontSize={brand.baseFontSize}
              styleTheme={styleTheme}
            />

            {/* Page 5: Imagery & Mood Direction */}
            <PageImagery
              brandName={brand.brandName}
              imageryMood={brand.imageryMood}
              imageryOverlay={brand.imageryOverlay}
              primaryColor={primaryColor}
              styleTheme={styleTheme}
              displayFont={brand.displayFont}
              bodyFont={brand.bodyFont}
              monoFont={brand.monoFont}
            />

            {/* Page 6: Touchpoint Specs & Governance */}
            <PageTouchpoints
              brandName={brand.brandName}
              iconStyle={brand.iconStyle}
              iconRadius={brand.iconRadius}
              iconStroke={brand.iconStroke}
              primaryColor={primaryColor}
              styleTheme={styleTheme}
              displayFont={brand.displayFont}
              bodyFont={brand.bodyFont}
              monoFont={brand.monoFont}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
