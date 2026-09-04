import React from "react"
import { cn } from "@/lib/utils"

export type PreviewStyleId = "minimal" | "cinematic" | "vibrant" | "candid"

interface A4PageFrameProps {
  id: string
  pageNumber: number
  totalPages: number
  sectionNumber: string
  sectionTitle: string
  brandName: string
  styleTheme: PreviewStyleId
  displayFont: string
  bodyFont: string
  monoFont: string
  children: React.ReactNode
  isCover?: boolean
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
  sectionNumber,
  sectionTitle,
  brandName,
  styleTheme,
  displayFont,
  bodyFont,
  monoFont,
  children,
  isCover = false,
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

  return (
    <div
      id={id}
      data-page={pageNumber}
      className={cn(
        "preview-a4-page relative mx-auto flex flex-col justify-between overflow-hidden shadow-2xl transition-all duration-300 print:shadow-none print:m-0",
        "w-[794px] min-h-[1123px] max-h-[1123px] p-12 border",
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
      {/* Top Header - Omitted on Cover for artistic presentation */}
      {!isCover && (
        <header
          className={cn(
            "flex items-center justify-between pb-4 border-b text-xs transition-colors shrink-0",
            currentTheme.headerBorder,
            currentTheme.metaColor
          )}
        >
          <div className="flex items-center gap-3">
            <span className="font-mono font-semibold tracking-wider uppercase">
              {sectionNumber}
            </span>
            <span className="h-3 w-px bg-current opacity-30" />
            <span className="font-medium tracking-wide uppercase">
              {sectionTitle}
            </span>
          </div>

          <div className="flex items-center gap-3 font-mono text-[11px]">
            <span className="font-semibold">{brandName || "Brand System"}</span>
            <span className="opacity-40">|</span>
            <span className="tracking-widest uppercase">Guidelines</span>
          </div>
        </header>
      )}

      {/* Main Page Content Body */}
      <main className="flex-1 py-6 flex flex-col justify-between overflow-hidden">
        {children}
      </main>

      {/* Bottom Footer */}
      <footer
        className={cn(
          "flex items-center justify-between pt-4 border-t text-[11px] font-mono shrink-0",
          currentTheme.footerBorder,
          currentTheme.metaColor
        )}
      >
        <div className="flex items-center gap-2">
          <span>{brandName || "Brand"} Guidelines</span>
          <span className="opacity-30">•</span>
          <span className="capitalize">{styleTheme} Edition</span>
        </div>

        <div className="flex items-center gap-4">
          <span className="opacity-70">Confidential</span>
          <span className="font-semibold">
            {pageNumber.toString().padStart(2, "0")} /{" "}
            {totalPages.toString().padStart(2, "0")}
          </span>
        </div>
      </footer>
    </div>
  )
}
