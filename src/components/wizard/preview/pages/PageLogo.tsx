import {
  Item,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item"
import type { BrandDoDontItem } from "@/store/brandStore"
import { DEFAULT_DOS_AND_DONTS } from "@/store/brandStore"
import type { PreviewStyleId } from "./A4PageFrame"
import { A4PageFrame } from "./A4PageFrame"
import { BlueprintFrame } from "./BlueprintFrame"

interface PageLogoProps {
  brandName: string
  primaryColor: string
  svgContent?: string
  rasterDataUri?: string
  dosAndDonts?: BrandDoDontItem[]
  styleTheme: PreviewStyleId
  displayFont: string
  bodyFont: string
  monoFont: string
  pageNumber?: number
  totalPages?: number
  websiteUrl?: string
}

export function PageLogo({
  brandName,
  primaryColor,
  svgContent,
  rasterDataUri,
  dosAndDonts,
  styleTheme,
  displayFont,
  bodyFont,
  monoFont,
  pageNumber = 4,
  totalPages = 8,
  websiteUrl,
}: PageLogoProps) {
  const activeRules =
    dosAndDonts && dosAndDonts.length > 0 ? dosAndDonts : DEFAULT_DOS_AND_DONTS

  return (
    <A4PageFrame
      id="page-logo"
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
            <h2 className="text-primary-900 uppercase"> PRIMARY MARK</h2>
            <div className="h-0.5 w-16 bg-zinc-500" />
          </div>

          <p className="max-w-xl text-zinc-600">
            The primary brandmark is the authoritative core of the{" "}
            {brandName || "brand"} visual identity. Crafted upon precise
            geometric proportions and architectural gridlines, it requires
            consistent clearspace and strict contrast governance to preserve
            legibility across media.
          </p>
        </div>

        {/* Blueprint Showcase Stage (Exact preview from logo creation) */}
        <div className="my-auto space-y-4 py-2">
          {/* Large Architectural Blueprint Stage */}
          <div className="relative flex flex-col items-center justify-center overflow-hidden p-8">
            <div className="relative z-10 flex flex-col items-center gap-5 py-3">
              <BlueprintFrame
                svgContent={svgContent}
                rasterDataUri={rasterDataUri}
                brandName={brandName}
                primaryColor={primaryColor}
                size="lg"
                className="rounded-lg bg-white px-8 py-4"
              />

              <div className="text-[11px] font-bold tracking-wider text-zinc-500 uppercase">
                Primary Vector Geometry & Construction Grid
              </div>
            </div>
          </div>

          {/* Dual Contrast Canvases: Light & Dark Presentation */}
          <div className="grid grid-cols-2 gap-4">
            {/* Light Presentation */}
            <div className="flex flex-col items-center justify-center">
              <span className="mb-2 text-[10px] font-bold text-zinc-400 uppercase">
                Light Presentation
              </span>
              <BlueprintFrame
                svgContent={svgContent}
                rasterDataUri={rasterDataUri}
                brandName={brandName}
                primaryColor={primaryColor}
                size="sm"
                className="bg-white"
              />
            </div>

            {/* Dark Presentation */}
            <div className="flex flex-col items-center justify-center rounded-xl border border-zinc-800 bg-zinc-950 p-4 text-zinc-50">
              <span className="mb-2 text-[10px] font-bold text-zinc-500 uppercase">
                Dark Contrast Reversed
              </span>
              <BlueprintFrame
                svgContent={svgContent}
                rasterDataUri={rasterDataUri}
                brandName={brandName}
                primaryColor={primaryColor}
                size="sm"
                isDark={true}
                className="bg-zinc-950"
              />
            </div>
          </div>
        </div>

        {/* Usage Rules & Governance (Broken into 2 balanced columns) */}
        <div className="space-y-3 border-t border-zinc-200 pt-5">
          <div className="flex items-center justify-between">
            <div className="text-xs font-bold text-zinc-500 uppercase">
              Brandmark Usage Governance
            </div>
            <span className="text-[11px] font-medium text-zinc-400">
              Implementation Standards
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {activeRules.slice(0, 6).map((item) => (
              <div
                key={item.id}
                className="flex items-start justify-between gap-3 transition-colors"
              >
                <Item variant="outline" key={item.id}>
                  <ItemContent>
                    <ItemTitle>{item.rule}</ItemTitle>
                    {item.detail ? (
                      <ItemDescription>{item.detail}</ItemDescription>
                    ) : null}
                  </ItemContent>
                </Item>
              </div>
            ))}
          </div>
        </div>
      </div>
    </A4PageFrame>
  )
}
