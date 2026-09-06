import React from "react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import type { ColorSwatch } from "@/lib/colorUtils"
import {
  getPdfColorVariables,
  resolvePdfColorMatrix,
} from "./pdfColorMatrix"

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
  colors?: ColorSwatch[]
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
  colors,
}: A4PageFrameProps) {
  const isExpressive = styleTheme === "expressive-energy"
  const isSoftTactility = styleTheme === "soft-tactility"
  const isEditorial = styleTheme === "editorial-character"

  const resolvedColors = resolvePdfColorMatrix(colors)
  const colorVars = getPdfColorVariables(resolvedColors)

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
      pageBg:
        "bg-white text-black border-2 border-black shadow-[8px_8px_0px_0px_#000]",
      headerBorder: "border-black",
      footerBorder: "border-black",
      metaColor: "text-zinc-700",
    },
    "soft-tactility": {
      pageBg:
        "bg-[#fafaf9] text-stone-900 border-stone-200/80 shadow-[10px_10px_30px_rgba(0,0,0,0.06),-8px_-8px_24px_rgba(255,255,255,0.9)] rounded-3xl",
      headerBorder: "border-stone-200/80",
      footerBorder: "border-stone-200/80",
      metaColor: "text-stone-500",
    },
    "editorial-character": {
      pageBg:
        "bg-[#faf8f5] text-stone-950 border-stone-300 rounded-none shadow-2xl",
      headerBorder: "border-stone-300",
      footerBorder: "border-stone-300",
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
      data-pdf-page="true"
      className={cn(
        "preview-a4-page relative mx-auto flex flex-col justify-between overflow-hidden shadow-2xl transition-all duration-300 print:m-0 print:shadow-none",
        "h-[1123px] max-h-[1123px] min-h-[1123px] w-[794px] max-w-[794px] min-w-[794px] p-12",
        isExpressive
          ? "border-2 border-black"
          : isSoftTactility
            ? "rounded-3xl border border-stone-200/80"
            : isEditorial
              ? "rounded-none border border-stone-300"
              : "border",
        currentTheme.pageBg,
        className
      )}
      style={
        {
          "--active-display-font": `"${displayFont}", sans-serif`,
          "--active-body-font": `"${bodyFont}", sans-serif`,
          "--active-mono-font": `"${monoFont}", monospace`,
          ...colorVars,
        } as React.CSSProperties
      }
    >
      {/* Top Header - Omitted on Cover */}
      {!isCover && (
        <header className="shrink-0 space-y-2 pb-2">
          {isExpressive ? (
            <div className="flex items-center justify-between text-xs tracking-tight text-black">
              <Badge className="rounded-md border-2 border-black pdf-badge-expressive-primary text-[10px] font-black tracking-wider uppercase shadow-[2px_2px_0px_0px_#000]">
                {sectionTitle || "Brand Guidelines"}
              </Badge>

              <Badge className="rounded-md border-2 border-black pdf-badge-expressive-secondary font-mono text-[10px] font-black shadow-[2px_2px_0px_0px_#000]">
                {currentYear}
              </Badge>
            </div>
          ) : isSoftTactility ? (
            <div className="flex items-center justify-between text-xs tracking-tight text-stone-800">
              <Badge className="rounded-full border border-stone-200/80 bg-stone-100/90 px-3 py-0.5 text-[11px] font-semibold text-stone-800 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.06),inset_-1px_-1px_2px_rgba(255,255,255,0.9)]">
                {sectionTitle || "Brand Guidelines"}
              </Badge>

              <Badge className="rounded-full border border-stone-200/80 bg-stone-100/90 px-2.5 py-0.5 font-mono text-[10px] text-stone-600 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.06),inset_-1px_-1px_2px_rgba(255,255,255,0.9)]">
                {currentYear}
              </Badge>
            </div>
          ) : isEditorial ? (
            <div className="flex items-center justify-between text-xs tracking-tight text-stone-950">
              <Badge className="rounded-none border border-stone-950 bg-transparent px-2.5 py-0.5 font-mono text-[10px] tracking-widest text-stone-950 uppercase">
                {sectionTitle || "Brand Guidelines"}
              </Badge>

              <div className="font-mono text-xs text-stone-600">
                {currentYear}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between text-xs tracking-tight text-black">
              <div className="text-[11px] font-semibold tracking-wider text-zinc-900 uppercase">
                {sectionTitle || "Brand Guidelines"}
              </div>

              <div className="text-xs font-semibold text-black/80">
                {currentYear}
              </div>
            </div>
          )}

          {/* Custom line UI in header */}
          {isExpressive ? (
            <div className="flex w-full items-end gap-3 pt-0.5">
              <div className="h-0.5 flex-1 bg-black" />
              <div className="h-2 w-28 bg-black shadow-[2px_2px_0px_0px_#000]" />
            </div>
          ) : isSoftTactility ? (
            <div className="flex w-full items-end gap-3 pt-0.5">
              <div className="h-1 flex-1 rounded-full bg-stone-200 shadow-inner" />
              <div className="h-1.5 w-24 rounded-full bg-stone-400 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.15)]" />
            </div>
          ) : isEditorial ? (
            <div className="flex w-full items-end gap-3 pt-0.5">
              <div className="h-px flex-1 bg-stone-300" />
              <div className="h-px w-28 bg-stone-950" />
            </div>
          ) : (
            <div className="flex w-full items-end gap-3 pt-0.5">
              <div className="h-px flex-1 bg-zinc-300" />
              <div className="h-1 w-28 bg-black" />
            </div>
          )}
        </header>
      )}

      {/* Main Page Content Body */}
      <main className="flex flex-1 flex-col justify-between overflow-hidden">
        {children}
      </main>

      {/* Bottom Footer - Omitted on Cover */}
      {!isCover && (
        <footer className="shrink-0 space-y-3 pt-2">
          {/* Custom line UI in footer */}
          {isExpressive ? (
            <div className="flex w-full items-end gap-3">
              <div className="h-0.5 flex-1 bg-black" />
              <div className="h-2 w-28 bg-black shadow-[2px_2px_0px_0px_#000]" />
            </div>
          ) : isSoftTactility ? (
            <div className="flex w-full items-end gap-3">
              <div className="h-1 flex-1 rounded-full bg-stone-200 shadow-inner" />
              <div className="h-1.5 w-24 rounded-full bg-stone-400 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.15)]" />
            </div>
          ) : isEditorial ? (
            <div className="flex w-full items-end gap-3">
              <div className="h-px flex-1 bg-stone-300" />
              <div className="h-px w-28 bg-stone-950" />
            </div>
          ) : (
            <div className="flex w-full items-end gap-3">
              <div className="h-px flex-1 bg-zinc-300" />
              <div className="h-1 w-28 bg-black" />
            </div>
          )}

          <div className="flex items-center justify-between text-xs text-black">
            {isExpressive ? (
              <div className="font-mono text-xs font-black tracking-wider text-black uppercase">
                {brandName || "Brand"}
              </div>
            ) : isSoftTactility ? (
              <div className="font-medium tracking-tight text-stone-800">
                {brandName || "Brand"}
              </div>
            ) : isEditorial ? (
              <div className="font-semibold text-xs tracking-tight text-stone-950">
                {brandName || "Brand"}
              </div>
            ) : (
              <div className="font-semibold tracking-tight text-zinc-900">
                {brandName || "Brand"}
              </div>
            )}

            <div>
              {isExpressive ? (
                <Badge className="rounded-md border-2 border-black pdf-badge-expressive-secondary font-mono text-[10px] font-black shadow-[2px_2px_0px_0px_#000]">
                  {pageNumber.toString().padStart(2, "0")} /{" "}
                  {totalPages.toString().padStart(2, "0")}
                </Badge>
              ) : isSoftTactility ? (
                <Badge className="rounded-full border border-stone-200/80 bg-stone-100/90 px-2.5 py-0.5 font-mono text-[10px] text-stone-700 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.06),inset_-1px_-1px_2px_rgba(255,255,255,0.9)]">
                  {pageNumber.toString().padStart(2, "0")} /{" "}
                  {totalPages.toString().padStart(2, "0")}
                </Badge>
              ) : isEditorial ? (
                <span className="font-mono text-xs text-stone-600">
                  {pageNumber.toString().padStart(2, "0")} /{" "}
                  {totalPages.toString().padStart(2, "0")}
                </span>
              ) : (
                <span className="text-xs font-medium text-zinc-600">
                  {pageNumber.toString().padStart(2, "0")} /{" "}
                  {totalPages.toString().padStart(2, "0")}
                </span>
              )}
            </div>
          </div>
        </footer>
      )}
    </div>
  )
}
