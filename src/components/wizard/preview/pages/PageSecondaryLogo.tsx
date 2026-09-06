import type { PreviewStyleId } from "./A4PageFrame"
import { A4PageFrame } from "./A4PageFrame"
import { BlueprintFrame } from "./BlueprintFrame"

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
}: PageSecondaryLogoProps) {
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
      className="overflow-hidden border border-zinc-200 bg-white p-12 text-primary-900 shadow-2xl"
    >
      <div className="flex h-full flex-col justify-between py-6">
        {/* Title & Introduction */}
        <div className="space-y-3 pt-2">
          <div className="space-y-2">
            <h2 className="text-primary-900 uppercase"> SECONDARY MARK</h2>
            <div className="h-0.5 w-16 bg-zinc-500" />
          </div>

          <p className="max-w-xl text-zinc-600">
            The secondary lockup provides an alternate horizontal arrangement
            tailored for digital headers, narrow horizontal strips, and
            co-branded environments. It retains identical brand equity while
            optimizing for compact vertical space.
          </p>
        </div>

        {/* Blueprint Showcase Stage */}
        <div className="my-auto space-y-4 py-2">
          {/* Large Architectural Blueprint Stage */}
          <div className="relative flex flex-col items-center justify-center overflow-hidden">
            <div className="relative z-10 flex flex-col items-center gap-5 py-3">
              <BlueprintFrame
                svgContent={secondarySvgContent}
                rasterDataUri={secondaryLogoUrl}
                brandName={brandName}
                primaryColor={primaryColor}
                isSecondary={true}
                size="lg"
                className="rounded-lg bg-white px-8 py-4 shadow-xs"
              />

              <div className="text-[11px] font-bold tracking-wider text-zinc-500 uppercase">
                Secondary Lockup Construction & Alignment
              </div>
            </div>
          </div>

          {/* Dual Contrast Canvases: Light & Dark */}
          <div className="grid grid-cols-2 gap-4">
            {/* Light Presentation */}
            <div className="flex flex-col items-center justify-center">
              <span className="mb-2 text-[10px] font-bold text-zinc-400 uppercase">
                Light Presentation
              </span>
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
            <div className="flex flex-col items-center justify-center rounded-xl border border-zinc-800 bg-zinc-950 p-4 text-zinc-50 shadow-xs">
              <span className="mb-2 text-[10px] font-bold text-zinc-500 uppercase">
                Dark Contrast Reversed
              </span>
              <BlueprintFrame
                svgContent={secondarySvgContent}
                rasterDataUri={secondaryLogoUrl}
                brandName={brandName}
                primaryColor={primaryColor}
                isSecondary={true}
                size="sm"
                isDark={true}
                className="bg-zinc-950"
              />
            </div>
          </div>
        </div>

        {/* Lockup Deployment Specs & Guidelines */}
        <div className="space-y-3 pt-5">
          <div className="flex items-center justify-between">
            <div className="text-xs font-bold text-zinc-500 uppercase">
              Lockup Deployment Specifications
            </div>
            <span className="text-[11px] font-medium text-zinc-400">
              Application Criteria
            </span>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1">
              <div className="text-xs font-bold text-primary-900">
                Horizontal Viewports
              </div>
              <p className="text-[11px] text-zinc-600">
                Mandatory for top navigation bars and mobile headers where
                vertical space is under 60px.
              </p>
            </div>

            <div className="space-y-1">
              <div className="text-xs font-bold text-primary-900">
                Proportional Scaling
              </div>
              <p className="text-[11px] text-zinc-600">
                Minimum digital rendering height is 24px (print minimum 8mm) to
                ensure symbol and wordmark legibility.
              </p>
            </div>

            <div className="space-y-1">
              <div className="text-xs font-bold text-primary-900">
                Exclusion Geometry
              </div>
              <p className="text-[11px] text-zinc-600">
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
