import type { PreviewStyleId } from "./A4PageFrame"
import { A4PageFrame } from "./A4PageFrame"
import { BlueprintFrame } from "./BlueprintFrame"
import { Badge } from "@/components/ui/badge"
import { getPdfTheme } from "./pdfPageTheme"
import type { ColorSwatch } from "@/lib/colorUtils"

interface PageSecondaryLogoProps {
  brandName: string
  primaryColor: string
  secondarySvgContent?: string
  secondaryLogoUrl?: string
  styleTheme: PreviewStyleId
  displayFont: string
  bodyFont: string
  monoFont: string
  pageNumber?: number
  totalPages?: number
  websiteUrl?: string
  colors?: ColorSwatch[]
}

export function PageSecondaryLogo({
  brandName,
  primaryColor,
  secondarySvgContent,
  secondaryLogoUrl,
  styleTheme,
  displayFont,
  bodyFont,
  monoFont,
  pageNumber = 5,
  totalPages = 9,
  websiteUrl,
  colors,
}: PageSecondaryLogoProps) {
  const theme = getPdfTheme(styleTheme)
  const isExpressive = theme.isExpressive
  const isSoftTactility = theme.isSoftTactility
  const isEditorial = theme.isEditorial

  return (
    <A4PageFrame
      id="page-secondary-logo"
      pageNumber={pageNumber}
      totalPages={totalPages}
      sectionNumber="02"
      sectionTitle="Logo System & Geometry"
      brandName={brandName}
      styleTheme={styleTheme}
      displayFont={displayFont}
      bodyFont={bodyFont}
      monoFont={monoFont}
      websiteUrl={websiteUrl}
      className={theme.pageFrame}
      colors={colors}
    >
      <div className="flex h-full flex-col justify-between py-6">
        {/* Title & Introduction */}
        <div className="space-y-3 pt-2">
          <div className="space-y-2">
            <h2 className={theme.title}> SECONDARY MARK</h2>
            <div className={theme.accentBar} />
          </div>

          <p className={theme.introText}>
            The secondary lockup provides an alternate horizontal arrangement
            tailored for digital headers, narrow horizontal strips, and
            co-branded environments. It retains identical brand equity while
            optimizing for compact vertical space.
          </p>
        </div>

        {/* Blueprint Showcase Stage */}
        <div className="my-auto space-y-4 py-2">
          {/* Large Architectural Blueprint Stage */}
          <div
            className={
              isExpressive
                ? "relative flex flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-black bg-white p-6 shadow-[5px_5px_0px_0px_#000]"
                : isSoftTactility
                  ? "relative flex flex-col items-center justify-center overflow-hidden rounded-3xl border border-stone-200/70 bg-stone-50/80 p-6 shadow-[inset_2px_2px_6px_rgba(0,0,0,0.04),inset_-2px_-2px_6px_rgba(255,255,255,0.8)]"
                  : isEditorial
                    ? "relative flex flex-col items-center justify-center overflow-hidden rounded-none border border-stone-300 bg-stone-100/40 p-6"
                    : "relative flex flex-col items-center justify-center overflow-hidden"
            }
          >
            <div className="relative z-10 flex flex-col items-center gap-5 py-3">
              <BlueprintFrame
                svgContent={secondarySvgContent}
                rasterDataUri={secondaryLogoUrl}
                brandName={brandName}
                primaryColor={primaryColor}
                isSecondary={true}
                size="lg"
                className={
                  isExpressive
                    ? "rounded-xl border-2 border-black bg-white px-8 py-4 shadow-[3px_3px_0px_0px_#000]"
                    : isSoftTactility
                      ? "rounded-2xl border border-stone-200/80 bg-white px-8 py-4 shadow-[4px_4px_12px_rgba(0,0,0,0.04),-3px_-3px_8px_rgba(255,255,255,0.9)]"
                      : isEditorial
                        ? "rounded-none border border-stone-300 bg-white px-8 py-4"
                        : "rounded-lg bg-white px-8 py-4 shadow-xs"
                }
              />

              {isExpressive ? (
                <Badge className={theme.badgeAmber}>
                  Secondary Lockup Construction &amp; Alignment
                </Badge>
              ) : isSoftTactility ? (
                <Badge className={theme.badgePrimary}>
                  Secondary Lockup Construction &amp; Alignment
                </Badge>
              ) : isEditorial ? (
                <Badge className={theme.badgeAmber}>
                  Secondary Lockup Construction &amp; Alignment
                </Badge>
              ) : (
                <div className="text-[11px] font-bold tracking-wider text-zinc-500 uppercase">
                  Secondary Lockup Construction &amp; Alignment
                </div>
              )}
            </div>
          </div>

          {/* Dual Contrast Canvases: Light & Dark */}
          <div className="grid grid-cols-2 gap-4">
            {/* Light Presentation */}
            <div
              className={
                isExpressive
                  ? "flex flex-col items-center justify-center rounded-xl border-2 border-black bg-white p-4 shadow-[4px_4px_0px_0px_#000]"
                  : isSoftTactility
                    ? "flex flex-col items-center justify-center rounded-2xl border border-stone-200/80 bg-white p-4 shadow-[4px_4px_12px_rgba(0,0,0,0.04),-3px_-3px_8px_rgba(255,255,255,0.9)]"
                    : isEditorial
                      ? "flex flex-col items-center justify-center rounded-none border border-stone-300 bg-white p-4"
                      : "flex flex-col items-center justify-center"
              }
            >
              {isExpressive ? (
                <Badge className="mb-2 border-2 border-black pdf-badge-expressive-primary font-black uppercase text-[10px] shadow-[2px_2px_0px_0px_#000] rounded-md">
                  Light Presentation
                </Badge>
              ) : isSoftTactility ? (
                <Badge className="mb-2 rounded-full border border-stone-200/80 bg-stone-100 px-3 py-0.5 text-stone-800 text-[10px]">
                  Light Presentation
                </Badge>
              ) : isEditorial ? (
                <Badge className="mb-2 rounded-none border border-stone-400 bg-transparent px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-widest text-stone-700">
                  Light Presentation
                </Badge>
              ) : (
                <span className="mb-2 text-[10px] font-bold text-zinc-400 uppercase">
                  Light Presentation
                </span>
              )}
              <BlueprintFrame
                svgContent={secondarySvgContent}
                rasterDataUri={secondaryLogoUrl}
                brandName={brandName}
                primaryColor={primaryColor}
                isSecondary={true}
                size="sm"
                className="bg-white"
              />
            </div>

            {/* Dark Presentation */}
            <div
              className={
                isExpressive
                  ? "flex flex-col items-center justify-center rounded-xl border-2 border-black bg-black p-4 text-white shadow-[4px_4px_0px_0px_#000]"
                  : isSoftTactility
                    ? "flex flex-col items-center justify-center rounded-2xl border border-stone-800 bg-stone-900 p-4 text-white shadow-[4px_4px_12px_rgba(0,0,0,0.15)]"
                    : isEditorial
                      ? "flex flex-col items-center justify-center rounded-none border border-stone-900 bg-stone-950 p-4 text-white"
                      : "flex flex-col items-center justify-center rounded-xl border border-zinc-800 bg-zinc-950 p-4 text-zinc-50 shadow-xs"
              }
            >
              {isExpressive ? (
                <Badge className="mb-2 border-2 border-white pdf-badge-expressive-secondary font-black uppercase text-[10px] shadow-[2px_2px_0px_0px_#fff] rounded-md">
                  Dark Contrast Reversed
                </Badge>
              ) : isSoftTactility ? (
                <Badge className="mb-2 rounded-full border border-stone-700 bg-stone-800 px-3 py-0.5 text-stone-200 text-[10px]">
                  Dark Contrast Reversed
                </Badge>
              ) : isEditorial ? (
                <Badge className="mb-2 rounded-none border border-stone-700 bg-transparent px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-widest text-stone-300">
                  Dark Contrast Reversed
                </Badge>
              ) : (
                <span className="mb-2 text-[10px] font-bold text-zinc-500 uppercase">
                  Dark Contrast Reversed
                </span>
              )}
              <BlueprintFrame
                svgContent={secondarySvgContent}
                rasterDataUri={secondaryLogoUrl}
                brandName={brandName}
                primaryColor={primaryColor}
                isSecondary={true}
                size="sm"
                isDark={true}
                className={
                  isExpressive
                    ? "bg-black"
                    : isSoftTactility
                      ? "bg-stone-900"
                      : isEditorial
                        ? "bg-stone-950"
                        : "bg-zinc-950"
                }
              />
            </div>
          </div>
        </div>

        {/* Lockup Deployment Specs & Guidelines */}
        <div
          className={
            isExpressive
              ? "space-y-3 border-t-2 border-black pt-4"
              : isSoftTactility
                ? "space-y-3 border-t border-stone-200 pt-4"
                : isEditorial
                  ? "space-y-3 border-t border-stone-300 pt-4"
                  : "space-y-3 pt-5"
          }
        >
          <div className="flex items-center justify-between">
            <div
              className={
                isExpressive
                  ? "font-mono text-xs font-black uppercase text-black"
                  : isSoftTactility
                    ? "text-xs font-semibold uppercase text-stone-600 tracking-wider"
                    : isEditorial
                      ? "font-mono text-[10px] uppercase tracking-widest text-stone-500"
                      : "text-xs font-bold text-zinc-500 uppercase"
              }
            >
              Lockup Deployment Specifications
            </div>
            {isExpressive ? (
              <Badge className={theme.badgeLime}>
                Application Criteria
              </Badge>
            ) : isSoftTactility ? (
              <Badge className={theme.badgeSecondary}>
                Application Criteria
              </Badge>
            ) : isEditorial ? (
              <Badge className={theme.badgeLime}>
                Application Criteria
              </Badge>
            ) : (
              <span className="text-[11px] font-medium text-zinc-400">
                Application Criteria
              </span>
            )}
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div
              className={
                isExpressive
                  ? "rounded-xl border-2 border-black bg-white p-3 shadow-[3px_3px_0px_0px_#000] space-y-1"
                  : isSoftTactility
                    ? "rounded-2xl border border-stone-200/60 bg-white/90 p-3 shadow-[3px_3px_8px_rgba(0,0,0,0.03)] space-y-1"
                    : isEditorial
                      ? "border-l-2 border-stone-900 bg-transparent py-1.5 pl-3 pr-1 space-y-1"
                      : "space-y-1"
              }
            >
              <div
                className={
                  isExpressive
                    ? "text-xs font-black uppercase text-black"
                    : isSoftTactility
                      ? "text-xs font-semibold text-stone-900"
                      : isEditorial
                        ? "text-xs font-semibold text-stone-950"
                        : "text-xs font-bold text-primary-900"
                }
              >
                Horizontal Viewports
              </div>
              <p
                className={
                  isExpressive
                    ? "text-[11px] font-medium text-zinc-700"
                    : isSoftTactility
                      ? "text-[11px] text-stone-600 font-normal leading-relaxed"
                      : isEditorial
                        ? "text-[11px] text-stone-600 leading-relaxed"
                        : "text-[11px] text-zinc-600"
                }
              >
                Mandatory for top navigation bars and mobile headers where
                vertical space is under 60px.
              </p>
            </div>

            <div
              className={
                isExpressive
                  ? "rounded-xl border-2 border-black bg-white p-3 shadow-[3px_3px_0px_0px_#000] space-y-1"
                  : isSoftTactility
                    ? "rounded-2xl border border-stone-200/60 bg-white/90 p-3 shadow-[3px_3px_8px_rgba(0,0,0,0.03)] space-y-1"
                    : isEditorial
                      ? "border-l-2 border-stone-900 bg-transparent py-1.5 pl-3 pr-1 space-y-1"
                      : "space-y-1"
              }
            >
              <div
                className={
                  isExpressive
                    ? "text-xs font-black uppercase text-black"
                    : isSoftTactility
                      ? "text-xs font-semibold text-stone-900"
                      : isEditorial
                        ? "text-xs font-semibold text-stone-950"
                        : "text-xs font-bold text-primary-900"
                }
              >
                Proportional Scaling
              </div>
              <p
                className={
                  isExpressive
                    ? "text-[11px] font-medium text-zinc-700"
                    : isSoftTactility
                      ? "text-[11px] text-stone-600 font-normal leading-relaxed"
                      : isEditorial
                        ? "text-[11px] text-stone-600 leading-relaxed"
                        : "text-[11px] text-zinc-600"
                }
              >
                Minimum digital rendering height is 24px (print minimum 8mm) to
                ensure symbol and wordmark legibility.
              </p>
            </div>

            <div
              className={
                isExpressive
                  ? "rounded-xl border-2 border-black bg-white p-3 shadow-[3px_3px_0px_0px_#000] space-y-1"
                  : isSoftTactility
                    ? "rounded-2xl border border-stone-200/60 bg-white/90 p-3 shadow-[3px_3px_8px_rgba(0,0,0,0.03)] space-y-1"
                    : isEditorial
                      ? "border-l-2 border-stone-900 bg-transparent py-1.5 pl-3 pr-1 space-y-1"
                      : "space-y-1"
              }
            >
              <div
                className={
                  isExpressive
                    ? "text-xs font-black uppercase text-black"
                    : isSoftTactility
                      ? "text-xs font-semibold text-stone-900"
                      : isEditorial
                        ? "text-xs font-semibold text-stone-950"
                        : "text-xs font-bold text-primary-900"
                }
              >
                Exclusion Geometry
              </div>
              <p
                className={
                  isExpressive
                    ? "text-[11px] font-medium text-zinc-700"
                    : isSoftTactility
                      ? "text-[11px] text-stone-600 font-normal leading-relaxed"
                      : isEditorial
                        ? "text-[11px] text-stone-600 leading-relaxed"
                        : "text-[11px] text-zinc-600"
                }
              >
                Maintain standard exclusion perimeter around both symbol and
                typography simultaneously.
              </p>
            </div>
          </div>
        </div>
      </div>
    </A4PageFrame>
  )
}
