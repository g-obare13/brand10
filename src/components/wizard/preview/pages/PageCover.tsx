import type { PreviewStyleId } from "./A4PageFrame"
import { A4PageFrame } from "./A4PageFrame"

interface PageCoverProps {
  brandName: string
  tagline: string
  mission: string
  vision: string
  coreValues: string[]
  primaryColor?: string
  secondaryColor?: string
  svgContent?: string
  rasterDataUri?: string
  styleTheme: PreviewStyleId
  displayFont: string
  bodyFont: string
  monoFont: string
  totalPages?: number
  websiteUrl?: string
}

export function PageCover({
  brandName,
  primaryColor = "#18181b",
  svgContent,
  rasterDataUri,
  styleTheme,
  displayFont,
  bodyFont,
  monoFont,
  totalPages = 9,
  websiteUrl = "www.brand10.vercel.app",
}: PageCoverProps) {
  const currentYear = new Date().getFullYear()

  return (
    <A4PageFrame
      id="page-01"
      pageNumber={1}
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
        {/* Subtle Decorative Logo Watermark Shape (3.5% opacity, grayscale) */}
        <div className="pointer-events-none absolute top-1/2 -right-[360px] flex size-[720px] -translate-y-1/2 items-center justify-center overflow-hidden select-none opacity-[0.035] grayscale contrast-50">
          {svgContent ? (
            <div
              className="flex size-full items-center justify-center [&_*]:!fill-black [&_*]:!stroke-transparent [&_svg]:size-full [&_svg]:max-h-full [&_svg]:max-w-full"
              dangerouslySetInnerHTML={{ __html: svgContent }}
            />
          ) : rasterDataUri ? (
            <img
              src={rasterDataUri}
              alt=""
              className="size-full object-contain"
            />
          ) : (
            <div className="text-[500px] leading-none font-bold text-black select-none">
              {(brandName || "B").charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        {/* Top Header Bar on Cover with line UI */}
        <div className="relative z-10 space-y-4">
          <div className="flex items-center justify-between">
            {/* Logo on the far left */}
            <div className="flex items-center">
              {svgContent ? (
                <div
                  className="flex h-14 max-w-[280px] items-center justify-start overflow-hidden [&_svg]:h-full [&_svg]:w-auto [&_svg]:max-w-full [&_svg]:object-contain"
                  dangerouslySetInnerHTML={{ __html: svgContent }}
                />
              ) : rasterDataUri ? (
                <img
                  src={rasterDataUri}
                  alt={brandName}
                  className="h-14 w-auto max-w-[280px] object-contain"
                />
              ) : (
                <div
                  className="flex size-14 shrink-0 items-center justify-center rounded-xl text-lg font-bold text-white shadow-xs"
                  style={{ backgroundColor: primaryColor || "#18181b" }}
                >
                  {(brandName || "B").charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            {/* Current Year at far end */}
            <div className="text-sm font-semibold text-black/80">
              {currentYear}
            </div>
          </div>

          {/* Custom line UI in header: thin hairline on left, gap, thick black accent bar on right */}
          <div className="flex w-full items-end gap-3 pt-1">
            <div className="h-px flex-1 bg-zinc-300" />
            <div className="h-1 w-28 bg-black" />
          </div>
        </div>

        {/* Hero Title Section with Brand Name beneath */}
        <div className="relative z-10 my-auto max-w-xl space-y-4 py-8">
          <h1 className="text-6xl text-black sm:text-7xl lg:text-8xl">
            Brand
            <br />
            Guidelines.
          </h1>
          <p className="text-2xl font-semibold text-zinc-700 sm:text-3xl">
            {brandName || "Brand Architecture"}
          </p>
        </div>

        {/* Bottom Footer Colophon Card on Cover */}
        <div className="relative z-10 w-full space-y-4 rounded-none border border-zinc-800 bg-zinc-950 p-6 text-white shadow-xl">
          {/* Top 2-Column Meta Details */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-12">
            {/* Left Column: Prepared for & Organization */}
            <div className="space-y-1 sm:col-span-7">
              <div className="text-xs text-zinc-400">Prepared for:</div>
              <div className="text-lg font-bold tracking-tight text-white">
                {brandName || "Brand Identity System"}
              </div>
            </div>

            {/* Right Column: Issued Date & Validity */}
            <div className="space-y-3 sm:col-span-5 sm:text-right">
              <div>
                <div className="text-xs text-zinc-400">
                  Documentation Issued:
                </div>
                <div className="text-xs font-semibold text-white">
                  {currentYear} Release
                </div>
              </div>

              <div>
                <div className="text-xs text-zinc-400">Governance Status:</div>
                <div className="text-xs font-semibold text-white">
                  Active Standard
                </div>
              </div>
            </div>
          </div>

          {/* Statement of Confidentiality Divider & Disclaimer */}
          <div className="space-y-1 border-t border-zinc-800/80 pt-3">
            <div className="text-xs font-medium text-zinc-300">
              Statement of Confidentiality
            </div>
            <p className="text-[10px] leading-relaxed text-zinc-400">
              This brand manual and supporting identity assets contain
              proprietary standards for {brandName || "this organization"}.
              These materials are published for official brand implementation,
              digital design, print production, and authorized ecosystem
              partners.
            </p>
          </div>
        </div>
      </div>
    </A4PageFrame>
  )
}
