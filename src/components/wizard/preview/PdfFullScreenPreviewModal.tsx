import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { Button } from "@/components/ui/button"
import { Loader } from "@/components/ui/loader"
import { loadGoogleFont } from "@/lib/fontLoader"
import { useBrandStore } from "@/store/brandStore"
import {
  IconArrowsHorizontal,
  IconChevronLeft,
  IconChevronRight,
  IconDownload,
  IconPrinter,
  IconX,
  IconZoomIn,
  IconZoomOut,
  IconZoomReset,
} from "@tabler/icons-react"
import type { PreviewStyleId } from "./pages/A4PageFrame"
import { PdfDocumentPagesList } from "./PdfDocumentPagesList"

interface PdfFullScreenPreviewModalProps {
  isOpen: boolean
  onClose: () => void
  styleTheme: PreviewStyleId
  initialPage?: number
  onDownloadPdf: () => void
  isDownloadingPdf?: boolean
  downloadProgress?: string
}

/**
 * Full-Screen Immersive Modal Presentation for the A4 Brand Guidelines Deck.
 * Hides all surrounding studio chrome, sidebars, and navigation, presenting
 * the vector document with pan/zoom, page scrubbing, and export tools.
 */
export function PdfFullScreenPreviewModal({
  isOpen,
  onClose,
  styleTheme,
  initialPage = 1,
  onDownloadPdf,
  isDownloadingPdf = false,
  downloadProgress = "",
}: PdfFullScreenPreviewModalProps) {
  const brand = useBrandStore()
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [zoom, setZoom] = useState<number>(1.0)
  const [activePage, setActivePage] = useState<number>(initialPage)

  const hasSecondaryLogo = Boolean(
    brand.secondarySvgContent?.trim() || brand.secondaryLogoUrl?.trim()
  )
  const totalPages = hasSecondaryLogo ? 11 : 10

  // Sync initialPage when modal opens
  useEffect(() => {
    if (isOpen) {
      setActivePage(initialPage)
      setZoom(1.0)
      // Small timeout to allow DOM to render before scrolling to initial page
      setTimeout(() => {
        const target = scrollContainerRef.current?.querySelector(
          `[data-page="${initialPage}"]`
        )
        if (target) {
          target.scrollIntoView({ behavior: "auto", block: "start" })
        }
      }, 50)
    }
  }, [isOpen, initialPage])

  // Dynamically load selected Google fonts or staged custom fonts into DOM
  useEffect(() => {
    if (!isOpen) return
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
              face
                .load()
                .then((loaded) => document.fonts.add(loaded))
                .catch(() => {})
            } catch {}
          })
        } catch {}
      })
    }
  }, [
    isOpen,
    brand.displayFont,
    brand.bodyFont,
    brand.monoFont,
    brand.stagedFontFiles,
  ])

  // Lock body scroll when modal is open
  useEffect(() => {
    if (!isOpen) return
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = originalOverflow
    }
  }, [isOpen])

  // Track page scroll to sync active page index
  useEffect(() => {
    if (!isOpen) return
    const container = scrollContainerRef.current
    if (!container) return

    const pageElements =
      container.querySelectorAll<HTMLElement>(".preview-a4-page")
    if (pageElements.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.4) {
            const pageNum = Number(entry.target.getAttribute("data-page"))
            if (pageNum && pageNum !== activePage) {
              setActivePage(pageNum)
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
  }, [isOpen, activePage])

  // Keyboard navigation shortcuts
  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
        e.preventDefault()
        if (activePage > 1) {
          scrollToPage(activePage - 1)
        }
      } else if (e.key === "ArrowRight" || e.key === "PageDown") {
        e.preventDefault()
        if (activePage < totalPages) {
          scrollToPage(activePage + 1)
        }
      } else if (e.key === "+" || e.key === "=") {
        e.preventDefault()
        setZoom((prev) => Math.min(1.8, prev + 0.1))
      } else if (e.key === "-") {
        e.preventDefault()
        setZoom((prev) => Math.max(0.4, prev - 0.1))
      } else if (e.key === "0") {
        e.preventDefault()
        setZoom(1.0)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, activePage, totalPages, onClose])

  const scrollToPage = (pageNum: number) => {
    const target = scrollContainerRef.current?.querySelector(
      `[data-page="${pageNum}"]`
    )
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  const handleZoomIn = () => setZoom((prev) => Math.min(1.8, prev + 0.1))
  const handleZoomOut = () => setZoom((prev) => Math.max(0.4, prev - 0.1))
  const handleZoomReset = () => setZoom(1.0)
  const handleFitWidth = () => {
    if (!scrollContainerRef.current) return
    const containerWidth = scrollContainerRef.current.clientWidth - 80
    const a4WidthPx = 794 // 210mm @ 96DPI standard A4 CSS px
    const fitScale = Math.max(0.5, Math.min(1.5, containerWidth / a4WidthPx))
    setZoom(Number(fitScale.toFixed(2)))
  }

  if (!isOpen) return null

  const modalContent = (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Full Screen PDF Document Preview"
      className="fixed inset-0 z-50 flex animate-in flex-col bg-zinc-950/98 text-zinc-100 duration-200 fade-in-0 select-none"
    >
      {/* 1. Immersive Top Navigation & Control Toolbar */}
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-zinc-800/80 bg-zinc-900/90 px-4 backdrop-blur-xl sm:px-6">
        {/* Left: Close Button, Document Identity & Pill */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="cursor-pointer gap-2 rounded-xl text-zinc-300 hover:bg-zinc-800 hover:text-white"
            title="Exit Full Screen (Esc)"
            icon={<IconX size={18} />}
          >
            {/* <span className="hidden sm:inline font-medium text-xs">Exit Full Screen</span> */}
            <kbd className="hidden rounded bg-zinc-800 px-1.5 py-0.5 font-mono text-[10px] text-zinc-400 sm:inline">
              Esc
            </kbd>
          </Button>

          <div className="hidden h-4 w-px bg-zinc-800 sm:block" />

          <div className="hidden items-center gap-2 md:flex">
            <span className="text-xs font-semibold text-white">
              {brand.brandName || "Brand Architecture"}
            </span>
            <span className="rounded-full border border-zinc-800 bg-zinc-800/50 px-2 py-0.5 text-[10px] font-medium tracking-wide text-zinc-400 uppercase">
              {styleTheme.replace("-", " ")}
            </span>
          </div>
        </div>

        {/* Center: Page Counter & Pager Controls */}
        <div className="flex items-center gap-1 rounded-full border border-zinc-800 bg-zinc-900 px-2 py-1 shadow-xs">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              if (activePage > 1) scrollToPage(activePage - 1)
            }}
            disabled={activePage <= 1}
            className="size-7 p-0 text-zinc-400 hover:bg-zinc-800 hover:text-white"
            title="Previous Page (←)"
          >
            <IconChevronLeft size={16} />
          </Button>

          <span className="min-w-24 text-center font-mono text-xs font-medium text-zinc-300">
            {activePage} / {totalPages}
          </span>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              if (activePage < totalPages) scrollToPage(activePage + 1)
            }}
            disabled={activePage >= totalPages}
            className="size-7 p-0 text-zinc-400 hover:bg-zinc-800 hover:text-white"
            title="Next Page (→)"
          >
            <IconChevronRight size={16} />
          </Button>
        </div>

        {/* Right: Zoom Scale & Quick Action Controls */}
        <div className="flex items-center gap-2">
          {/* Zoom controls */}
          <div className="hidden items-center gap-1 rounded-full border border-zinc-800 bg-zinc-900 px-2 py-0.5 sm:flex">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleZoomOut}
              className="size-7 p-0 text-zinc-400 hover:bg-zinc-800 hover:text-white"
              title="Zoom Out (-)"
            >
              <IconZoomOut size={14} />
            </Button>

            <span className="w-12 text-center font-mono text-xs text-zinc-300">
              {Math.round(zoom * 100)}%
            </span>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleZoomIn}
              className="size-7 p-0 text-zinc-400 hover:bg-zinc-800 hover:text-white"
              title="Zoom In (+)"
            >
              <IconZoomIn size={14} />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleZoomReset}
              className="size-7 p-0 text-zinc-400 hover:bg-zinc-800 hover:text-white"
              title="Actual Size (100% / 0)"
            >
              <IconZoomReset size={14} />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleFitWidth}
              className="size-7 p-0 text-zinc-400 hover:bg-zinc-800 hover:text-white"
              title="Fit to Width"
            >
              <IconArrowsHorizontal size={14} />
            </Button>
          </div>

          {/* Print document shortcut */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.print()}
            className="cursor-pointer border-zinc-800 bg-zinc-900 text-zinc-300 hover:bg-zinc-800 hover:text-white"
            title="Print PDF"
          >
            <IconPrinter size={14} />
          </Button>

          {/* Download PDF button */}
          <Button
            variant="shiny"
            size="sm"
            onClick={onDownloadPdf}
            disabled={isDownloadingPdf}
            className="cursor-pointer"
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
              ? downloadProgress || "Compiling..."
              : "Download PDF"}
          </Button>
        </div>
      </header>

      {/* 2. Main Full-Screen Document Canvas Area */}
      <div className="relative min-h-0 flex-1 overflow-hidden">
        {/* Floating Quick Page Scrubber Rail */}
        <aside
          aria-label="Quick Page Rail"
          className="absolute top-6 right-6 z-30 hidden flex-col gap-1.5 rounded-2xl border border-zinc-800/80 bg-zinc-900/90 p-1.5 shadow-2xl backdrop-blur-xl lg:flex"
        >
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => {
            const isCurrent = activePage === num
            return (
              <button
                key={num}
                type="button"
                onClick={() => scrollToPage(num)}
                title={`Jump to Page ${num}`}
                className={`group relative flex size-7 cursor-pointer items-center justify-center rounded-xl font-mono text-[11px] transition-all ${
                  isCurrent
                    ? "scale-105 bg-primary font-bold text-primary-foreground shadow-md"
                    : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
                }`}
              >
                <span>{num}</span>
              </button>
            )
          })}
        </aside>

        {/* Scrollable Document Container */}
        <main
          ref={scrollContainerRef}
          className="custom-scrollbar flex h-full w-full flex-col items-center overflow-x-auto overflow-y-auto scroll-smooth px-4 py-12"
        >
          <div
            className="origin-top space-y-12 pb-24 transition-transform duration-200 ease-out"
            style={{ transform: `scale(${zoom})` }}
          >
            <PdfDocumentPagesList styleTheme={styleTheme} />
          </div>
        </main>
      </div>
    </div>
  )

  return createPortal(modalContent, document.body)
}
