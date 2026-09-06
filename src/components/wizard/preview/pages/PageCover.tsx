import type { PreviewStyleId } from "./A4PageFrame"
import { A4PageFrame } from "./A4PageFrame"
import { Badge } from "@/components/ui/badge"
import { getPdfTheme } from "./pdfPageTheme"
import type { ColorSwatch } from "@/lib/colorUtils"
import { getPerceptualTextColor } from "./pdfColorMatrix"

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
  colors?: ColorSwatch[]
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
  colors,
}: PageCoverProps) {
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
      className={pageFrameClass}
      colors={colors}
    >
      <div
        className={
          isSoftTactility
            ? "relative flex h-full w-full flex-col justify-between overflow-hidden bg-[#fafaf9] p-12 text-stone-900 select-none"
            : isEditorial
              ? "relative flex h-full w-full flex-col justify-between overflow-hidden bg-[#faf8f5] p-12 text-stone-950 select-none"
              : "relative flex h-full w-full flex-col justify-between overflow-hidden bg-white p-12 text-black select-none"
        }
      >
        {/* Subtle Decorative Logo Watermark Shape (3.5% opacity, grayscale) */}
        <div className="pointer-events-none absolute top-1/2 -right-90 flex size-180 -translate-y-1/2 items-center justify-center overflow-hidden opacity-[0.035] contrast-50 grayscale select-none">
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
            <div className="text-[500px] leading-none font-bold text-primary-950 select-none">
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
                  className={
                    isExpressive
                      ? "flex size-14 shrink-0 items-center justify-center rounded-xl border-2 border-black text-lg font-black shadow-[3px_3px_0px_0px_#000]"
                      : isSoftTactility
                        ? "flex size-14 shrink-0 items-center justify-center rounded-2xl border border-stone-200/80 text-lg font-bold shadow-[3px_3px_8px_rgba(0,0,0,0.1)]"
                        : isEditorial
                          ? "flex size-14 shrink-0 items-center justify-center rounded-none border border-stone-950 text-lg font-bold"
                          : "flex size-14 shrink-0 items-center justify-center rounded-xl text-lg font-bold shadow-xs"
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

            {/* Current Year at far end */}
            {isExpressive ? (
              <Badge className={theme.badgeLime}>
                {currentYear}
              </Badge>
            ) : isSoftTactility ? (
              <Badge className={theme.badgePrimary}>
                {currentYear}
              </Badge>
            ) : isEditorial ? (
              <span className="font-mono text-xs uppercase tracking-widest text-stone-600">
                {currentYear}
              </span>
            ) : (
              <div className="text-sm font-semibold text-primary-950/80">
                {currentYear}
              </div>
            )}
          </div>
        </div>

        {/* Hero Title Section with Brand Name beneath */}
        <div className="relative z-10 my-auto max-w-xl space-y-4 py-8">
          {isExpressive ? (
            <>
              <h1 className="text-6xl font-black uppercase tracking-tight text-black sm:text-7xl lg:text-8xl">
                Brand
                <br />
                Guidelines.
              </h1>
              <div className="pt-2">
                <Badge className="border-2 border-black pdf-badge-expressive-primary font-black text-xl px-4 py-1.5 shadow-[3px_3px_0px_0px_#000] rounded-lg">
                  {brandName || "Brand Architecture"}
                </Badge>
              </div>
            </>
          ) : isSoftTactility ? (
            <>
              <h1 className="text-6xl font-bold tracking-tight text-stone-900 sm:text-7xl lg:text-8xl">
                Brand
                <br />
                Guidelines.
              </h1>
              <div className="pt-2">
                <Badge className="rounded-full border border-stone-200/80 bg-stone-100 px-4 py-1.5 text-xl font-semibold text-stone-800 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.06),inset_-1px_-1px_2px_rgba(255,255,255,0.9)]">
                  {brandName || "Brand Architecture"}
                </Badge>
              </div>
            </>
          ) : isEditorial ? (
            <>
              <h1 className="text-6xl text-stone-950 sm:text-7xl lg:text-8xl">
                Brand
                <br />
                Guidelines.
              </h1>
              <p className="text-2xl font-semibold text-stone-800 sm:text-3xl">
                {brandName || "Brand Architecture"}
              </p>
            </>
          ) : (
            <>
              <h1 className="text-6xl text-primary-950 sm:text-7xl lg:text-8xl">
                Brand
                <br />
                Guidelines.
              </h1>
              <p className="text-2xl font-semibold text-primary-700 sm:text-3xl">
                {brandName || "Brand Architecture"}
              </p>
            </>
          )}
        </div>

        {/* Bottom Footer Colophon Card on Cover */}
        <div
          className={
            isExpressive
              ? "relative z-10 w-full space-y-4 rounded-xl border-2 border-black bg-white p-6 text-black shadow-[6px_6px_0px_0px_#000]"
              : isSoftTactility
                ? "relative z-10 w-full space-y-4 rounded-3xl border border-stone-200/80 bg-white/95 p-6 text-stone-900 shadow-[6px_6px_20px_rgba(0,0,0,0.05),-4px_-4px_16px_rgba(255,255,255,0.9)]"
                : isEditorial
                  ? "relative z-10 w-full space-y-4 rounded-none border-t border-b border-stone-400 bg-transparent p-6 text-stone-950"
                  : "relative z-10 w-full space-y-4 rounded-none border border-primary-800 bg-primary-950 p-6 text-white"
          }
        >
          {/* Top 2-Column Meta Details */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-12">
            {/* Left Column: Prepared for & Organization */}
            <div className="space-y-1 sm:col-span-7">
              <div
                className={
                  isExpressive
                    ? "text-xs font-mono font-bold text-zinc-500 uppercase"
                    : isSoftTactility
                      ? "text-xs font-medium text-stone-500 uppercase"
                      : isEditorial
                        ? "text-[10px] font-mono tracking-widest text-stone-500 uppercase"
                        : "text-xs text-primary-200"
                }
              >
                Prepared for:
              </div>
              <div
                className={
                  isExpressive
                    ? "text-xl font-black tracking-tight text-black uppercase"
                    : isSoftTactility
                      ? "text-lg font-bold tracking-tight text-stone-900"
                      : isEditorial
                        ? "text-lg font-bold tracking-tight text-stone-950"
                        : "text-lg font-bold tracking-tight text-white"
                }
              >
                {brandName || "Brand Identity System"}
              </div>
            </div>

            {/* Right Column: Issued Date & Validity */}
            <div className="space-y-3 sm:col-span-5 sm:text-right">
              <div>
                <div
                  className={
                    isExpressive
                      ? "text-xs font-mono text-zinc-500 uppercase"
                      : isSoftTactility
                        ? "text-xs text-stone-500 uppercase"
                        : isEditorial
                          ? "text-[10px] font-mono tracking-widest text-stone-500 uppercase"
                          : "text-xs text-zinc-200"
                  }
                >
                  Documentation Issued:
                </div>
                {isExpressive ? (
                  <Badge className={theme.badgeAmber}>
                    {currentYear} Release
                  </Badge>
                ) : isSoftTactility ? (
                  <Badge className={theme.badgePrimary}>
                    {currentYear} Release
                  </Badge>
                ) : isEditorial ? (
                  <Badge className={theme.badgeAmber}>
                    {currentYear} Release
                  </Badge>
                ) : (
                  <div className="text-xs font-semibold text-white">
                    {currentYear} Release
                  </div>
                )}
              </div>

              <div>
                <div
                  className={
                    isExpressive
                      ? "text-xs font-mono text-zinc-500 uppercase"
                      : isSoftTactility
                        ? "text-xs text-stone-500 uppercase"
                        : isEditorial
                          ? "text-[10px] font-mono tracking-widest text-stone-500 uppercase"
                          : "text-xs text-zinc-200"
                  }
                >
                  Governance Status:
                </div>
                {isExpressive ? (
                  <Badge className={theme.badgeLime}>
                    Active Standard
                  </Badge>
                ) : isSoftTactility ? (
                  <Badge className={theme.badgeSecondary}>
                    Active Standard
                  </Badge>
                ) : isEditorial ? (
                  <Badge className={theme.badgeLime}>
                    Active Standard
                  </Badge>
                ) : (
                  <div className="text-xs font-semibold text-white">
                    Active Standard
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Statement of Confidentiality Divider & Disclaimer */}
          <div
            className={
              isExpressive
                ? "space-y-1 border-t-2 border-black pt-3"
                : isSoftTactility
                  ? "space-y-1 border-t border-stone-200 pt-3"
                  : isEditorial
                    ? "space-y-1 border-t border-stone-300 pt-3"
                    : "space-y-1 border-t border-zinc-800/80 pt-3"
            }
          >
            <div
              className={
                isExpressive
                  ? "text-xs font-mono font-black text-black uppercase"
                  : isSoftTactility
                    ? "text-xs font-semibold text-stone-800"
                    : isEditorial
                      ? "text-[10px] font-mono tracking-widest text-stone-900 uppercase"
                      : "text-xs font-medium text-zinc-200"
              }
            >
              Statement of Confidentiality
            </div>
            <p
              className={
                isExpressive
                  ? "text-[10px] leading-relaxed text-zinc-700 font-medium"
                  : isSoftTactility
                    ? "text-[10px] leading-relaxed text-stone-600 font-normal"
                    : isEditorial
                      ? "text-[10px] leading-relaxed text-stone-700 font-normal"
                      : "text-[10px] leading-relaxed text-primary-100"
              }
            >
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
