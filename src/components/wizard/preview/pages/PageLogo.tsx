import { Badge } from "@/components/ui/badge"
import { A4PageFrame  } from "./A4PageFrame"
import type {PreviewStyleId} from "./A4PageFrame";
import type { BrandDoDontItem } from "@/store/brandStore"
import { cn } from "@/lib/utils"
import { IconCheck, IconX } from "@tabler/icons-react"

interface PageLogoProps {
  brandName: string
  primaryColor: string
  svgContent?: string
  rasterDataUri?: string
  secondarySvgContent?: string
  isVector: boolean
  clearspaceMultiplier: number
  dosAndDonts: BrandDoDontItem[]
  styleTheme: PreviewStyleId
  displayFont: string
  bodyFont: string
  monoFont: string
}

export function PageLogo({
  brandName,
  primaryColor,
  svgContent,
  rasterDataUri,
  secondarySvgContent,
  isVector,
  clearspaceMultiplier,
  dosAndDonts,
  styleTheme,
  displayFont,
  bodyFont,
  monoFont,
}: PageLogoProps) {
  const monogram = (brandName || "Brand").charAt(0).toUpperCase()
  const paddingMultiplier = Math.max(1, clearspaceMultiplier || 1.5)

  return (
    <A4PageFrame
      id="page-02"
      pageNumber={2}
      totalPages={6}
      sectionNumber="02"
      sectionTitle="Logo System & Geometry"
      brandName={brandName}
      styleTheme={styleTheme}
      displayFont={displayFont}
      bodyFont={bodyFont}
      monoFont={monoFont}
    >
      <div className="flex h-full flex-col justify-between space-y-6">
        {/* Intro */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-[10px] font-mono uppercase">
              Brand Mark
            </Badge>
            <Badge variant="default" className="text-[10px]">
              {isVector ? "Vector SVG Ready" : "Raster Asset"}
            </Badge>
          </div>
          <h2>Primary & Secondary Marks</h2>
          <p className="text-xs opacity-75">
            The brandmark serves as the cornerstone of our visual identity. Maintain correct clearspace, proportions, and background contrast.
          </p>
        </div>

        {/* Dual Canvas Presentation: Light & Dark */}
        <div className="grid grid-cols-2 gap-4">
          {/* Light Theme Stage */}
          <div className="flex flex-col items-center justify-center rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs">
            <span className="mb-3 font-mono text-[10px] uppercase tracking-wider text-zinc-400">
              Light Background Presentation
            </span>
            <div className="flex h-28 w-full items-center justify-center">
              {svgContent ? (
                <div
                  className="max-h-24 max-w-44 flex items-center justify-center [&>svg]:max-h-24 [&>svg]:w-auto"
                  dangerouslySetInnerHTML={{ __html: svgContent }}
                />
              ) : rasterDataUri ? (
                <img
                  src={rasterDataUri}
                  alt={brandName}
                  className="max-h-24 max-w-44 object-contain"
                />
              ) : (
                <div
                  className="flex size-20 items-center justify-center rounded-2xl text-2xl font-bold text-white shadow-sm"
                  style={{ backgroundColor: primaryColor }}
                >
                  {monogram}
                </div>
              )}
            </div>
            <span className="mt-3 font-mono text-[10px] text-zinc-400">
              Primary Lockup
            </span>
          </div>

          {/* Dark Theme Stage */}
          <div className="flex flex-col items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-xs text-zinc-50">
            <span className="mb-3 font-mono text-[10px] uppercase tracking-wider text-zinc-500">
              Dark Background Presentation
            </span>
            <div className="flex h-28 w-full items-center justify-center">
              {secondarySvgContent ? (
                <div
                  className="max-h-24 max-w-44 flex items-center justify-center [&>svg]:max-h-24 [&>svg]:w-auto"
                  dangerouslySetInnerHTML={{ __html: secondarySvgContent }}
                />
              ) : svgContent ? (
                <div
                  className="max-h-24 max-w-44 flex items-center justify-center brightness-125 [&>svg]:max-h-24 [&>svg]:w-auto"
                  dangerouslySetInnerHTML={{ __html: svgContent }}
                />
              ) : (
                <div
                  className="flex size-20 items-center justify-center rounded-2xl border border-white/20 text-2xl font-bold text-white shadow-sm"
                  style={{ backgroundColor: primaryColor }}
                >
                  {monogram}
                </div>
              )}
            </div>
            <span className="mt-3 font-mono text-[10px] text-zinc-500">
              High-Contrast Reverse
            </span>
          </div>
        </div>

        {/* Clearspace & Safe Zone Geometry */}
        <div
          className={cn(
            "rounded-2xl border p-5",
            styleTheme === "cinematic"
              ? "border-zinc-800 bg-zinc-900/40"
              : "border-zinc-200 bg-zinc-50/60"
          )}
        >
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h4 className="text-sm font-semibold">Clearspace & Exclusion Zone</h4>
              <p className="text-[11px] opacity-70">
                Maintain minimum exclusion perimeter equal to {paddingMultiplier}X the mark height.
              </p>
            </div>
            <Badge variant="outline" className="font-mono text-[10px]">
              Ratio: {paddingMultiplier}X
            </Badge>
          </div>

          <div className="relative flex h-24 items-center justify-center overflow-hidden rounded-xl border border-dashed border-primary/40 bg-card/60 p-4">
            {/* Grid overlay lines */}
            <div className="absolute inset-2 border border-dashed border-primary/30 pointer-events-none" />
            <div className="relative flex items-center gap-3">
              <span className="font-mono text-[10px] text-primary">X</span>
              <div
                className="flex size-12 items-center justify-center rounded-lg text-white font-bold text-sm shadow-xs"
                style={{ backgroundColor: primaryColor }}
              >
                {monogram}
              </div>
              <span className="font-mono text-[10px] text-primary">X</span>
            </div>
          </div>
        </div>

        {/* Do's & Don'ts Guidelines */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold">Brandmark Usage Governance</h4>
            <span className="font-mono text-[10px] opacity-60">Rule Checklist</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {dosAndDonts.length > 0 ? (
              dosAndDonts.slice(0, 4).map((item) => (
                <div
                  key={item.id}
                  className={cn(
                    "flex items-start gap-2.5 rounded-xl border p-3 text-xs",
                    item.type === "do"
                      ? "border-emerald-500/30 bg-emerald-500/5 text-emerald-950 dark:text-emerald-200"
                      : "border-rose-500/30 bg-rose-500/5 text-rose-950 dark:text-rose-200"
                  )}
                >
                  <div
                    className={cn(
                      "mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full text-white",
                      item.type === "do" ? "bg-emerald-500" : "bg-rose-500"
                    )}
                  >
                    {item.type === "do" ? (
                      <IconCheck size={10} className="stroke-[3]" />
                    ) : (
                      <IconX size={10} className="stroke-[3]" />
                    )}
                  </div>
                  <div>
                    <span className="block font-semibold">{item.rule}</span>
                    <span className="block text-[11px] opacity-75">{item.detail}</span>
                  </div>
                </div>
              ))
            ) : (
              <>
                <div className="flex items-start gap-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-3 text-xs">
                  <div className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white">
                    <IconCheck size={10} className="stroke-[3]" />
                  </div>
                  <div>
                    <span className="block font-semibold">Preserve Proportions</span>
                    <span className="block text-[11px] opacity-75">
                      Always scale vector paths uniformly without stretching.
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 rounded-xl border border-rose-500/30 bg-rose-500/5 p-3 text-xs">
                  <div className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-rose-500 text-white">
                    <IconX size={10} className="stroke-[3]" />
                  </div>
                  <div>
                    <span className="block font-semibold">Do Not Distort</span>
                    <span className="block text-[11px] opacity-75">
                      Never apply drop-shadow filters, outlines, or unapproved gradients.
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </A4PageFrame>
  )
}
