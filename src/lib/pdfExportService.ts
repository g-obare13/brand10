import { jsPDF } from "jspdf"
import { toJpeg } from "html-to-image"
import React from "react"
import { createRoot } from "react-dom/client"
import { PdfDocumentCanvas } from "@/components/wizard/preview/PdfDocumentCanvas"
import type { PreviewStyleId } from "@/components/wizard/preview/pages/A4PageFrame"

export interface ExportPdfOptions {
  brandName?: string
  styleTheme?: PreviewStyleId
  onProgress?: (current: number, total: number, message: string) => void
}

/**
 * Capture and compile all rendered .preview-a4-page elements into a high-fidelity A4 PDF.
 * Ensures 1:1 visual parity with the live web preview studio.
 * If pages are not currently mounted in the viewport, mounts an offscreen canvas automatically.
 */
export async function exportBrandManualPdf({
  brandName = "brand",
  styleTheme = "quiet-precision",
  onProgress,
}: ExportPdfOptions = {}): Promise<void> {
  let offscreenContainer: HTMLDivElement | null = null
  let root: ReturnType<typeof createRoot> | null = null

  try {
    // 1. Find or dynamically mount A4 pages in document
    let pageElements = Array.from(
      document.querySelectorAll<HTMLElement>(".preview-a4-page")
    )

    if (pageElements.length === 0) {
      onProgress?.(0, 10, "Initializing offscreen render engine...")
      offscreenContainer = document.createElement("div")
      offscreenContainer.id = "offscreen-pdf-renderer"
      offscreenContainer.style.position = "fixed"
      offscreenContainer.style.left = "-9999px"
      offscreenContainer.style.top = "0"
      offscreenContainer.style.width = "794px"
      offscreenContainer.style.opacity = "0"
      offscreenContainer.style.pointerEvents = "none"
      offscreenContainer.style.zIndex = "-9999"
      document.body.appendChild(offscreenContainer)

      root = createRoot(offscreenContainer)
      root.render(
        React.createElement(PdfDocumentCanvas, {
          styleTheme,
          activePage: 1,
          onPageChange: () => {},
          onDownloadPdf: () => {},
        })
      )

      // Wait for fonts, images, and DOM nodes to mount
      await new Promise((resolve) => setTimeout(resolve, 800))

      pageElements = Array.from(
        offscreenContainer.querySelectorAll<HTMLElement>(".preview-a4-page")
      )
    }

    if (pageElements.length === 0) {
      throw new Error(
        "Failed to discover or render preview pages for PDF compilation."
      )
    }

    const total = pageElements.length
    onProgress?.(0, total, `Preparing ${total} pages for export...`)

    // 2. Initialize jsPDF for standard ISO 216 A4 portrait (210mm x 297mm)
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
      compress: true,
    })

    pdf.setProperties({
      title: `${brandName} - Brand Guidelines Manual`,
      subject: "Brand Identity System & Architecture Standards",
      author: "Brand10 Studio",
      creator: "Brand10 Living Design System",
    })

    // 3. Sequential capture of each A4 page
    for (let i = 0; i < total; i++) {
      const pageEl = pageElements[i]
      onProgress?.(i + 1, total, `Rendering page ${i + 1} of ${total}...`)

      try {
        // High-resolution JPEG capture (2x pixel ratio for crisp 200-300 DPI print quality)
        const dataUrl = await toJpeg(pageEl, {
          quality: 0.94,
          pixelRatio: 2,
          cacheBust: true,
          backgroundColor: "#ffffff",
          width: 794,
          height: 1123,
          style: {
            margin: "0",
            transform: "none",
          },
        })

        if (i > 0) {
          pdf.addPage("a4", "portrait")
        }

        // Add full-bleed image to standard A4 sheet
        pdf.addImage(dataUrl, "JPEG", 0, 0, 210, 297, undefined, "FAST")
      } catch (pageErr) {
        console.warn(
          `Primary capture failed on page ${i + 1}, falling back:`,
          pageErr
        )
        // Attempt fallback capture
        const fallbackUrl = await toJpeg(pageEl, {
          quality: 0.88,
          pixelRatio: 1.5,
          backgroundColor: "#ffffff",
        })
        if (i > 0) {
          pdf.addPage("a4", "portrait")
        }
        pdf.addImage(fallbackUrl, "JPEG", 0, 0, 210, 297, undefined, "FAST")
      }
    }

    onProgress?.(total, total, "Assembling document & finalizing download...")

    // 4. Trigger download with clean slugified name
    const slug = brandName.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "brand"
    const filename = `${slug}-brand-manual.pdf`

    pdf.save(filename)
  } finally {
    // Cleanup any offscreen container
    if (root) {
      try {
        root.unmount()
      } catch {}
    }
    if (offscreenContainer) {
      try {
        offscreenContainer.remove()
      } catch {}
    }
  }
}

/**
 * Triggers native browser print dialog configured with pristine A4 print media styles.
 * Allows users to generate selectable, vector-based PDFs.
 */
export function triggerPrintBrandManual(): void {
  window.print()
}
