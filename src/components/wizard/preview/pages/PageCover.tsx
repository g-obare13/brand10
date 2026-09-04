import { Badge } from "@/components/ui/badge"
import { A4PageFrame  } from "./A4PageFrame"
import type {PreviewStyleId} from "./A4PageFrame";
import { cn } from "@/lib/utils"

interface PageCoverProps {
  brandName: string
  tagline: string
  mission: string
  vision: string
  coreValues: string[]
  primaryColor: string
  secondaryColor?: string
  svgContent?: string
  rasterDataUri?: string
  styleTheme: PreviewStyleId
  displayFont: string
  bodyFont: string
  monoFont: string
}

export function PageCover({
  brandName,
  tagline,
  mission,
  vision,
  coreValues,
  primaryColor,
  secondaryColor = "#0ea5e9",
  svgContent,
  rasterDataUri,
  styleTheme,
  displayFont,
  bodyFont,
  monoFont,
}: PageCoverProps) {
  const monogram = (brandName || "Brand").charAt(0).toUpperCase()
  const activeYear = new Date().getFullYear()

  return (
    <A4PageFrame
      id="page-01"
      pageNumber={1}
      totalPages={6}
      sectionNumber="01"
      sectionTitle="Identity Overview"
      brandName={brandName}
      styleTheme={styleTheme}
      displayFont={displayFont}
      bodyFont={bodyFont}
      monoFont={monoFont}
      isCover
    >
      <div className="flex h-full flex-col justify-between py-6">
        {/* Top Cover Header Bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="font-mono text-[11px] uppercase tracking-wider">
              Brand Guidelines
            </Badge>
            <Badge variant="default" className="capitalize text-[11px]">
              {styleTheme} Edition
            </Badge>
          </div>
          <span className="font-mono text-xs opacity-60">Vol. {activeYear}</span>
        </div>

        {/* Hero Identity Centerpiece */}
        <div className="my-auto space-y-8">
          {/* Logo / Monogram Lockup */}
          <div className="flex items-center gap-6">
            {svgContent ? (
              <div
                className="flex size-20 items-center justify-center rounded-2xl border border-black/10 bg-white p-3 shadow-md dark:border-white/10 dark:bg-zinc-900"
                dangerouslySetInnerHTML={{ __html: svgContent }}
              />
            ) : rasterDataUri ? (
              <img
                src={rasterDataUri}
                alt={brandName}
                className="size-20 rounded-2xl border border-black/10 object-contain p-2 shadow-md dark:border-white/10"
              />
            ) : (
              <div
                className="flex size-20 items-center justify-center rounded-2xl font-bold text-3xl text-white shadow-lg"
                style={{ backgroundColor: primaryColor }}
              >
                {monogram}
              </div>
            )}

            <div className="space-y-1">
              <span className="font-mono text-[11px] font-semibold tracking-widest uppercase opacity-60">
                Official Brand Manual
              </span>
              <div className="h-1 w-12 rounded-full" style={{ backgroundColor: primaryColor }} />
            </div>
          </div>

          {/* Brand Name Title */}
          <div className="space-y-3">
            <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl">
              {brandName || "Brand Architecture"}
            </h1>
            <p className="lead max-w-xl text-lg font-light">
              {tagline || "Comprehensive visual design systems, tokens, and brand governance specifications."}
            </p>
          </div>

          {/* Mission & Vision Pillars */}
          <div className="grid grid-cols-2 gap-6 pt-4">
            <div
              className={cn(
                "rounded-2xl border p-5 transition-colors",
                styleTheme === "cinematic"
                  ? "border-zinc-800 bg-zinc-900/60"
                  : "border-zinc-200/80 bg-zinc-50/70"
              )}
            >
              <div className="mb-2 flex items-center justify-between">
                <Badge variant="outline" className="text-[10px] uppercase font-mono">
                  Mission
                </Badge>
              </div>
              <p className="text-xs leading-relaxed opacity-80">
                {mission || "Empowering users with coherent, accessible, and delightful design systems built for modern digital scale."}
              </p>
            </div>

            <div
              className={cn(
                "rounded-2xl border p-5 transition-colors",
                styleTheme === "cinematic"
                  ? "border-zinc-800 bg-zinc-900/60"
                  : "border-zinc-200/80 bg-zinc-50/70"
              )}
            >
              <div className="mb-2 flex items-center justify-between">
                <Badge variant="outline" className="text-[10px] uppercase font-mono">
                  Vision
                </Badge>
              </div>
              <p className="text-xs leading-relaxed opacity-80">
                {vision || "Setting the benchmark for cross-platform visual harmony and effortless brand identity expression."}
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Metadata & Core Values */}
        <div className="space-y-4 pt-8">
          {coreValues.length > 0 && (
            <div className="space-y-2">
              <span className="font-mono text-[10px] font-semibold tracking-widest uppercase opacity-60">
                Guiding Core Values
              </span>
              <div className="flex flex-wrap gap-2">
                {coreValues.map((val, idx) => (
                  <Badge key={idx} variant="outline" className="text-xs font-normal">
                    {val}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between border-t border-current/10 pt-4 font-mono text-[11px] opacity-60">
            <span>Standard A4 Specification</span>
            <div className="flex items-center gap-2">
              <span
                className="inline-block size-2 rounded-full"
                style={{ backgroundColor: primaryColor }}
              />
              <span
                className="inline-block size-2 rounded-full"
                style={{ backgroundColor: secondaryColor }}
              />
              <span>Color Harmonized</span>
            </div>
            <span>Published {activeYear}</span>
          </div>
        </div>
      </div>
    </A4PageFrame>
  )
}
