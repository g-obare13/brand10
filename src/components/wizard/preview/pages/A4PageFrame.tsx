import React from "react"
import { cn } from "@/lib/utils"

export type PreviewStyleId =
  | "quiet-precision"
  | "expressive-energy"
  | "soft-tactility"
  | "editorial-character"
  | "minimal"
  | "cinematic"
  | "vibrant"
  | "candid"

interface A4PageFrameProps {
  id: string
  pageNumber: number
  totalPages: number
  sectionNumber?: string
  sectionTitle?: string
  brandName: string
  styleTheme: PreviewStyleId
  displayFont: string
  bodyFont: string
  monoFont: string
  children: React.ReactNode
  isCover?: boolean
  websiteUrl?: string
  className?: string
}

/**
 * Standardized A4 Page Container Frame.
 * Dimensions: 210mm x 297mm (Standard ISO 216 A4 ratio: 1 : 1.4142)
 * Rendered at 794px x 1123px (Standard 96 DPI CSS print/screen scale)
 */
export function A4PageFrame({
  id,
  pageNumber,
  totalPages,
  sectionNumber: _sectionNumber,
  sectionTitle,
  brandName,
  styleTheme,
  displayFont,
  bodyFont,
  monoFont,
  children,
  isCover = false,
  websiteUrl: _websiteUrl = "www.brand10.vercel.app",
  className,
}: A4PageFrameProps) {
  // Determine page theme classes based on selected style
  const themeStyles: Record<
    PreviewStyleId,
    {
      pageBg: string
      headerBorder: string
      footerBorder: string
      metaColor: string
    }
  > = {
    "quiet-precision": {
      pageBg: "bg-white text-zinc-900 border-zinc-200",
      headerBorder: "border-zinc-200",
      footerBorder: "border-zinc-200",
      metaColor: "text-zinc-500",
    },
    "expressive-energy": {
      pageBg: "bg-zinc-950 text-zinc-50 border-zinc-800",
      headerBorder: "border-zinc-800/80",
      footerBorder: "border-zinc-800/80",
      metaColor: "text-zinc-400",
    },
    "soft-tactility": {
      pageBg: "bg-[#f8f9fa] text-zinc-900 border-zinc-200",
      headerBorder: "border-zinc-200",
      footerBorder: "border-zinc-200",
      metaColor: "text-zinc-500",
    },
    "editorial-character": {
      pageBg: "bg-[#faf8f5] text-zinc-900 border-[#eae5dc]",
      headerBorder: "border-[#e5dfd5]",
      footerBorder: "border-[#e5dfd5]",
      metaColor: "text-stone-500",
    },
    minimal: {
      pageBg: "bg-white text-zinc-900 border-zinc-200",
      headerBorder: "border-zinc-200",
      footerBorder: "border-zinc-200",
      metaColor: "text-zinc-500",
    },
    cinematic: {
      pageBg: "bg-zinc-950 text-zinc-50 border-zinc-800",
      headerBorder: "border-zinc-800/80",
      footerBorder: "border-zinc-800/80",
      metaColor: "text-zinc-400",
    },
    vibrant: {
      pageBg: "bg-stone-50 text-zinc-900 border-stone-200",
      headerBorder: "border-stone-200",
      footerBorder: "border-stone-200",
      metaColor: "text-stone-500",
    },
    candid: {
      pageBg: "bg-[#faf8f5] text-zinc-900 border-[#eae5dc]",
      headerBorder: "border-[#e5dfd5]",
      footerBorder: "border-[#e5dfd5]",
      metaColor: "text-stone-500",
    },
  }

  const currentTheme = themeStyles[styleTheme]
  const currentYear = new Date().getFullYear()

  return (
    <div
      id={id}
      data-page={pageNumber}
      className={cn(
        "preview-a4-page relative mx-auto flex flex-col justify-between overflow-hidden shadow-2xl transition-all duration-300 print:shadow-none print:m-0",
        "w-[794px] min-w-[794px] max-w-[794px] h-[1123px] min-h-[1123px] max-h-[1123px] p-12 border",
        currentTheme.pageBg,
        className
      )}
      style={
        {
          "--active-display-font": `"${displayFont}", sans-serif`,
          "--active-body-font": `"${bodyFont}", sans-serif`,
          "--active-mono-font": `"${monoFont}", monospace`,
        } as React.CSSProperties
      }
    >
      {/* Top Header - Omitted on Cover */}
      {!isCover && (
        <header className="shrink-0 space-y-2 pb-2">
          <div className="flex items-center justify-between text-xs tracking-tight text-black">
            <div className="font-semibold uppercase tracking-wider text-[11px] text-zinc-900">
              {sectionTitle || "Brand Guidelines"}
            </div>

            <div className="text-xs font-semibold text-black/80">
              {currentYear}
            </div>
          </div>

          {/* Custom line UI in header: thin hairline on left, gap, thick black accent bar on right */}
          <div className="flex w-full items-end gap-3 pt-0.5">
            <div className="h-px flex-1 bg-zinc-300" />
            <div className="h-1 w-28 bg-black" />
          </div>
        </header>
      )}

      {/* Main Page Content Body */}
      <main className="flex-1 py-4 flex flex-col justify-between overflow-hidden">
        {children}
      </main>

      {/* Bottom Footer - Omitted on Cover */}
      {!isCover && (
        <footer className="shrink-0 space-y-3 pt-2">
          {/* Custom line UI in footer: thin hairline on left, gap, thick black accent bar on right */}
          <div className="flex w-full items-end gap-3">
            <div className="h-px flex-1 bg-zinc-300" />
            <div className="h-1 w-28 bg-black" />
          </div>

          <div className="flex items-center justify-between text-xs text-black">
            <div className="font-semibold tracking-tight text-zinc-900">
              {brandName || "Brand"}
            </div>

            <div className="text-xs text-zinc-600 font-medium">
              <span>
                {pageNumber.toString().padStart(2, "0")} /{" "}
                {totalPages.toString().padStart(2, "0")}
              </span>
            </div>
          </div>
        </footer>
      )}
    </div>
  )
}
