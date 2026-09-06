import type { PreviewStyleId } from "./A4PageFrame"
import { A4PageFrame } from "./A4PageFrame"
import { Badge } from "@/components/ui/badge"
import { getPdfTheme } from "./pdfPageTheme"
import type { ColorSwatch } from "@/lib/colorUtils"
import { getPerceptualTextColor } from "./pdfColorMatrix"

interface PageBackCoverProps {
  brandName: string
  tagline?: string
  mission?: string
  primaryColor?: string
  secondaryColor?: string
  svgContent?: string
  rasterDataUri?: string
  styleTheme: PreviewStyleId
  displayFont: string
  bodyFont: string
  monoFont: string
  pageNumber?: number
  totalPages?: number
  websiteUrl?: string
  colors?: ColorSwatch[]
}

export function PageBackCover({
  brandName,
  tagline,
  mission,
  primaryColor = "#18181b",
  svgContent,
  rasterDataUri,
  styleTheme,
  displayFont,
  bodyFont,
  monoFont,
  pageNumber = 10,
  totalPages = 10,
  websiteUrl = "www.brand10.vercel.app",
  colors,
}: PageBackCoverProps) {
  const currentYear = new Date().getFullYear()
  const theme = getPdfTheme(styleTheme)
  const isExpressive = theme.isExpressive
  const isSoftTactility = theme.isSoftTactility
  const isEditorial = theme.isEditorial
  const logoLetterColor = getPerceptualTextColor(primaryColor || "#18181b")

  const pageFrameClass = isExpressive
    ? "overflow-hidden border-2 border-black bg-white p-0 shadow-2xl"
    : isSoftTactility
      ? "overflow-hidden rounded-3xl border border-stone-200/80 bg-[#fafaf9] p-0 shadow-[10px_10px_30px_rgba(0,0,0,0.06),-8px_-8px_24px_rgba(255,255,255,0.9)]"
      : isEditorial
        ? "overflow-hidden rounded-none border border-stone-300 bg-[#faf8f5] p-0 shadow-2xl"
        : "overflow-hidden border border-zinc-200 bg-white p-0 shadow-2xl"

  return (
    <A4PageFrame
      id="page-back-cover"
      pageNumber={pageNumber}
      totalPages={totalPages}
      brandName={brandName}
      styleTheme={styleTheme}
      displayFont={displayFont}
      bodyFont={bodyFont}
      monoFont={monoFont}
      isCover
      websiteUrl={websiteUrl}
      className={pageFrameClass}
      colors={colors}
    >
      <div
        className={
          isSoftTactility
            ? "relative flex h-full w-full flex-col justify-between overflow-hidden bg-[#fafaf9] p-12 text-stone-900 select-none"
            : isEditorial
              ? "relative flex h-full w-full flex-col justify-between overflow-hidden bg-[#faf8f5] p-12 text-stone-950 select-none"
              : "relative flex h-full w-full flex-col justify-between overflow-hidden bg-white p-12 text-primary-900 select-none"
        }
      >
        {/* Subtle Decorative Logo Watermark Shape (3% opacity, grayscale) */}
        <div className="pointer-events-none absolute top-1/2 left-1/2 flex size-[680px] -translate-x-1/2 -translate-y-1/2 items-center justify-center overflow-hidden opacity-[0.03] contrast-50 grayscale select-none">
          {svgContent ? (
            <div
              className="flex size-full items-center justify-center [&_*]:!fill-primary-900 [&_*]:!stroke-transparent [&_svg]:size-full [&_svg]:max-h-full [&_svg]:max-w-full"
              dangerouslySetInnerHTML={{ __html: svgContent }}
            />
          ) : rasterDataUri ? (
            <img
              src={rasterDataUri}
              alt=""
              className="size-full object-contain"
            />
          ) : (
            <div className="text-[500px] leading-none font-bold text-primary-900 select-none">
              {(brandName || "B").charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        {/* Top Header Bar with Custom Line UI matching front cover */}
        <div className="relative z-10 space-y-4">
          <div className="flex items-center justify-between">
            {/* Logo Mark on left */}
            <div className="flex items-center">
              {svgContent ? (
                <div
                  className="flex h-12 max-w-[240px] items-center justify-start overflow-hidden [&_svg]:h-full [&_svg]:w-auto [&_svg]:max-w-full [&_svg]:object-contain"
                  dangerouslySetInnerHTML={{ __html: svgContent }}
                />
              ) : rasterDataUri ? (
                <img
                  src={rasterDataUri}
                  alt={brandName}
                  className="h-12 w-auto max-w-[240px] object-contain"
                />
              ) : (
                <div
                  className={
                    isExpressive
                      ? "flex size-12 shrink-0 items-center justify-center rounded-xl border-2 border-black text-lg font-black shadow-[2px_2px_0px_0px_#000]"
                      : isSoftTactility
                        ? "flex size-12 shrink-0 items-center justify-center rounded-2xl border border-stone-200/80 text-lg font-bold shadow-[3px_3px_8px_rgba(0,0,0,0.1)]"
                        : isEditorial
                          ? "flex size-12 shrink-0 items-center justify-center rounded-none border border-stone-950 text-lg font-bold"
                          : "flex size-12 shrink-0 items-center justify-center rounded-xl text-lg font-bold shadow-xs"
                  }
                  style={{
                    backgroundColor: primaryColor || "#18181b",
                    color: logoLetterColor,
                  }}
                >
                  {(brandName || "B").charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            {/* Document Index Notation */}
            {isExpressive ? (
              <Badge className={theme.badgeLime}>
                Brand Manual · Concluding Index
              </Badge>
            ) : isSoftTactility ? (
              <Badge className={theme.badgePrimary}>
                Brand Manual · Concluding Index
              </Badge>
            ) : isEditorial ? (
              <Badge className={theme.badgeAmber}>
                Brand Manual · Concluding Index
              </Badge>
            ) : (
              <div className="text-xs font-semibold tracking-wider text-zinc-500 uppercase">
                Brand Manual · Concluding Index
              </div>
            )}
          </div>

          {/* Line UI */}
          {isExpressive ? (
            <div className="flex w-full items-end gap-3 pt-1">
              <div className="h-2 w-28 bg-black shadow-[2px_2px_0px_0px_#000]" />
              <div className="h-[2px] flex-1 bg-black" />
            </div>
          ) : isSoftTactility ? (
            <div className="flex w-full items-end gap-3 pt-1">
              <div className="h-1.5 w-28 rounded-full bg-stone-800" />
              <div className="h-px flex-1 rounded-full bg-stone-300" />
            </div>
          ) : isEditorial ? (
            <div className="flex w-full items-end gap-3 pt-1">
              <div className="h-0.5 w-28 bg-stone-900" />
              <div className="h-[0.5px] flex-1 bg-stone-400" />
            </div>
          ) : (
            <div className="flex w-full items-end gap-3 pt-1">
              <div className="h-1 w-28 bg-primary-900" />
              <div className="h-px flex-1 bg-zinc-300" />
            </div>
          )}
        </div>

        {/* Center Architectural Statement & Brand Poise */}
        {isExpressive ? (
          <div className="relative z-10 my-auto w-full space-y-6 rounded-2xl border-2 border-black bg-white p-8 shadow-[6px_6px_0px_0px_#000]">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Badge className={theme.badgeAmber}>
                  Visual Identity &amp; System Architecture
                </Badge>
              </div>

              <h1 className="text-5xl font-black tracking-tight text-black uppercase sm:text-6xl">
                {brandName || "Brand Architecture"}
              </h1>

              {tagline && (
                <div>
                  <Badge className="inline-block rounded-md border-2 border-black pdf-badge-expressive-secondary px-3 py-1 text-lg font-black shadow-[2px_2px_0px_0px_#000]">
                    {tagline}
                  </Badge>
                </div>
              )}
            </div>

            {mission && (
              <div className="border-l-4 border-black pl-4">
                <p className="max-w-lg text-xs leading-relaxed font-medium text-zinc-700">
                  {mission}
                </p>
              </div>
            )}
          </div>
        ) : isSoftTactility ? (
          <div className="relative z-10 my-auto w-full space-y-6 rounded-3xl border border-stone-200/80 bg-white/95 p-8 shadow-[6px_6px_20px_rgba(0,0,0,0.05),-4px_-4px_16px_rgba(255,255,255,0.9)]">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Badge className={theme.badgePrimary}>
                  Visual Identity &amp; System Architecture
                </Badge>
              </div>

              <h1 className="text-5xl font-extrabold tracking-tight text-stone-900 sm:text-6xl">
                {brandName || "Brand Architecture"}
              </h1>

              {tagline && (
                <div
                  className="text-xl font-medium text-stone-700 sm:text-2xl"
                  style={{ fontFamily: `"${displayFont}", sans-serif` }}
                >
                  {tagline}
                </div>
              )}
            </div>

            {mission && (
              <div className="border-l-2 border-stone-400 pl-4">
                <p className="max-w-lg text-xs leading-relaxed text-stone-600">
                  {mission}
                </p>
              </div>
            )}
          </div>
        ) : isEditorial ? (
          <div className="relative z-10 my-auto w-full space-y-6 rounded-none border-t border-b border-stone-400 bg-transparent p-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge className={theme.badgeAmber}>
                  Visual Identity &amp; System Architecture
                </Badge>
              </div>

              <h1 className="text-5xl font-extrabold tracking-tight text-stone-950 sm:text-6xl">
                {brandName || "Brand Architecture"}
              </h1>

              {tagline && (
                <div
                  className="text-xl font-medium text-stone-800 sm:text-2xl"
                  style={{ fontFamily: `"${displayFont}", sans-serif` }}
                >
                  {tagline}
                </div>
              )}
            </div>

            {mission && (
              <div className="border-l-2 border-stone-900 pl-4">
                <p className="max-w-lg text-xs leading-relaxed text-stone-700">
                  {mission}
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="relative z-10 my-auto w-full space-y-6 py-12">
            {/* Centered / Prominent Mark Display */}
            <div className="space-y-4">
              <div className="text-xs font-bold tracking-widest text-zinc-400 uppercase">
                Visual Identity &amp; System Architecture
              </div>

              <h1 className="text-5xl font-extrabold tracking-tight text-primary-900 sm:text-6xl">
                {brandName || "Brand Architecture"}
              </h1>

              {tagline && (
                <div
                  className="text-xl font-medium text-zinc-700 sm:text-2xl"
                  style={{ fontFamily: `"${displayFont}", sans-serif` }}
                >
                  {tagline}
                </div>
              )}
            </div>

            {mission && (
              <div className="border-l-2 border-primary-900 pl-4">
                <p className="max-w-lg text-xs leading-relaxed text-zinc-600">
                  {mission}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Bottom Colophon Card */}
        <div
          className={
            isExpressive
              ? "relative z-10 w-full space-y-4 rounded-xl border-2 border-black bg-black p-6 text-white shadow-[6px_6px_0px_0px_#000]"
              : isSoftTactility
                ? "relative z-10 w-full space-y-4 rounded-3xl border border-stone-200/80 bg-white/95 p-6 text-stone-900 shadow-[6px_6px_20px_rgba(0,0,0,0.05),-4px_-4px_16px_rgba(255,255,255,0.9)]"
                : isEditorial
                  ? "relative z-10 w-full space-y-4 rounded-none border-t border-b border-stone-400 bg-transparent p-6 text-stone-950"
                  : "relative z-10 w-full space-y-4 rounded-none border border-zinc-800 bg-zinc-950 p-6 text-white shadow-xl"
          }
        >
          {/* 2-Column Meta & Distribution Grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-12">
            {/* Left Column: Organization & Domain */}
            <div className="space-y-2 sm:col-span-7">
              <div>
                <div
                  className={
                    isExpressive
                      ? "font-mono text-xs font-bold text-zinc-400 uppercase"
                      : isSoftTactility
                        ? "text-xs font-medium text-stone-500 uppercase"
                        : isEditorial
                          ? "text-[10px] font-mono tracking-widest text-stone-500 uppercase"
                          : "text-xs text-zinc-400"
                  }
                >
                  Published by:
                </div>
                <div
                  className={
                    isExpressive
                      ? "text-base font-black tracking-tight text-white uppercase"
                      : isSoftTactility
                        ? "text-base font-bold tracking-tight text-stone-900"
                        : isEditorial
                          ? "text-base font-bold tracking-tight text-stone-950"
                          : "text-base font-bold tracking-tight text-white"
                  }
                >
                  {brandName || "Brand Identity System"}
                </div>
              </div>
            </div>

            {/* Right Column: Governance & Copyright */}
            <div className="space-y-2 sm:col-span-5 sm:text-right">
              <div>
                <div
                  className={
                    isExpressive
                      ? "font-mono text-xs font-bold text-zinc-400 uppercase"
                      : isSoftTactility
                        ? "text-xs font-medium text-stone-500 uppercase"
                        : isEditorial
                          ? "text-[10px] font-mono tracking-widest text-stone-500 uppercase"
                          : "text-xs text-zinc-400"
                  }
                >
                  Release Version:
                </div>
                {isExpressive ? (
                  <Badge className={theme.badgeAmber}>
                    v1.0.0 (Living Standard)
                  </Badge>
                ) : isSoftTactility ? (
                  <Badge className={theme.badgePrimary}>
                    v1.0.0 (Living Standard)
                  </Badge>
                ) : isEditorial ? (
                  <Badge className={theme.badgeAmber}>
                    v1.0.0 (Living Standard)
                  </Badge>
                ) : (
                  <div className="text-xs font-semibold text-white">
                    v1.0.0 (Living Standard)
                  </div>
                )}
              </div>

              <div
                className={
                  isExpressive
                    ? "font-mono text-[11px] font-bold text-zinc-400"
                    : isSoftTactility
                      ? "text-[11px] text-stone-500"
                      : isEditorial
                        ? "font-mono text-[11px] text-stone-600"
                        : "text-[11px] text-zinc-400"
                }
              >
                &copy; {currentYear} {brandName || "Brand Identity"}. All rights
                reserved.
              </div>
            </div>
          </div>

          {/* Governance Notice */}
          <div
            className={
              isExpressive
                ? "border-t-2 border-zinc-800 pt-3"
                : isSoftTactility
                  ? "border-t border-stone-200 pt-3"
                  : isEditorial
                    ? "border-t border-stone-300 pt-3"
                    : "border-t border-zinc-800/80 pt-3"
            }
          >
            <p
              className={
                isSoftTactility
                  ? "text-[10px] leading-relaxed text-stone-600"
                  : isEditorial
                    ? "text-[10px] leading-relaxed text-stone-700"
                    : "text-[10px] leading-relaxed text-zinc-400"
              }
            >
              This document concludes the foundational brand manual for{" "}
              {brandName || "this organization"}. All design tokens, modular
              scale hierarchies, colorimetry metrics, and art direction
              guidelines contained herein represent authoritative standards for
              digital interfaces, physical collateral, and ecosystem
              touchpoints.
            </p>
          </div>
        </div>
      </div>
    </A4PageFrame>
  )
}
