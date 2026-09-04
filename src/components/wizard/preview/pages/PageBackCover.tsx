import type { PreviewStyleId } from "./A4PageFrame"
import { A4PageFrame } from "./A4PageFrame"

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
}: PageBackCoverProps) {
  const currentYear = new Date().getFullYear()

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
      className="overflow-hidden border border-zinc-200 bg-white p-0 shadow-2xl"
    >
      <div className="relative flex h-full w-full flex-col justify-between overflow-hidden bg-white p-12 text-black select-none lg:p-16">
        {/* Subtle Decorative Logo Watermark Shape (Centered Watermark) */}
        <div className="pointer-events-none absolute top-1/2 left-1/2 flex size-[840px] -translate-x-1/2 -translate-y-1/2 items-center justify-center overflow-hidden select-none">
          {svgContent ? (
            <div
              className="flex size-full items-center justify-center text-zinc-100 opacity-60 [&_*]:!fill-current [&_*]:!stroke-current [&_svg]:size-full [&_svg]:max-h-full [&_svg]:max-w-full"
              dangerouslySetInnerHTML={{ __html: svgContent }}
            />
          ) : rasterDataUri ? (
            <img
              src={rasterDataUri}
              alt=""
              className="size-full object-contain opacity-10 grayscale"
            />
          ) : (
            <div className="text-[600px] leading-none font-bold text-zinc-100 select-none">
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
                  className="flex size-12 shrink-0 items-center justify-center rounded-xl text-lg font-bold text-white shadow-xs"
                  style={{ backgroundColor: primaryColor || "#18181b" }}
                >
                  {(brandName || "B").charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            {/* Document Index Notation */}
            <div className="font-mono text-xs font-semibold tracking-wider text-zinc-500 uppercase">
              Brand Manual · Concluding Index
            </div>
          </div>

          {/* Line UI: thick accent bar on left, gap, thin hairline on right (mirrored from front cover) */}
          <div className="flex w-full items-end gap-3 pt-1">
            <div className="h-1 w-28 bg-black" />
            <div className="h-px flex-1 bg-zinc-300" />
          </div>
        </div>

        {/* Center Architectural Statement & Brand Poise */}
        <div className="relative z-10 my-auto max-w-xl space-y-6 py-12">
          {/* Centered / Prominent Mark Display */}
          <div className="space-y-4">
            <div className="font-mono text-xs font-bold tracking-widest text-zinc-400 uppercase">
              Visual Identity &amp; System Architecture
            </div>

            <h1 className="text-5xl font-extrabold tracking-tight text-black sm:text-6xl">
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
            <div className="border-l-2 border-black pl-4">
              <p className="max-w-lg text-xs leading-relaxed text-zinc-600">
                {mission}
              </p>
            </div>
          )}
        </div>

        {/* Bottom Colophon Card (Matching Front Cover dark aesthetic) */}
        <div className="relative z-10 w-full space-y-4 rounded-none border border-zinc-800 bg-zinc-950 p-6 text-white shadow-xl">
          {/* 2-Column Meta & Distribution Grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-12">
            {/* Left Column: Organization & Domain */}
            <div className="space-y-2 sm:col-span-7">
              <div>
                <div className="text-xs text-zinc-400">Published by:</div>
                <div className="text-base font-bold tracking-tight text-white">
                  {brandName || "Brand Identity System"}
                </div>
              </div>

              <div className="text-xs text-zinc-400">
                Design System Repository:{" "}
                <span className="font-mono text-zinc-200">{websiteUrl}</span>
              </div>
            </div>

            {/* Right Column: Governance & Copyright */}
            <div className="space-y-2 sm:col-span-5 sm:text-right">
              <div>
                <div className="text-xs text-zinc-400">Release Version:</div>
                <div className="font-mono text-xs font-semibold text-white">
                  v1.0.0 (Living Standard)
                </div>
              </div>

              <div className="font-mono text-[11px] text-zinc-400">
                &copy; {currentYear} {brandName || "Brand Identity"}. All rights reserved.
              </div>
            </div>
          </div>

          {/* Governance Notice */}
          <div className="border-t border-zinc-800/80 pt-3">
            <p className="text-[10px] leading-relaxed text-zinc-400">
              This document concludes the foundational brand manual for{" "}
              {brandName || "this organization"}. All design tokens, modular scale
              hierarchies, colorimetry metrics, and art direction guidelines
              contained herein represent authoritative standards for digital
              interfaces, physical collateral, and ecosystem touchpoints.
            </p>
          </div>
        </div>
      </div>
    </A4PageFrame>
  )
}
