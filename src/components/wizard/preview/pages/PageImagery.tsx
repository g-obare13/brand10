import { IMAGERY_MOOD_IMAGE_ARRAYS } from "@/data/wizard"
import type { PreviewStyleId } from "./A4PageFrame"
import { A4PageFrame } from "./A4PageFrame"

interface PageImageryProps {
  brandName: string
  imageryMood?: "minimal" | "cinematic" | "vibrant" | "editorial"
  imageryOverlay: "none" | "tint" | "duotone"
  imageryLinks?: string[]
  primaryColor: string
  styleTheme: PreviewStyleId
  displayFont: string
  bodyFont: string
  monoFont: string
  pageNumber?: number
  totalPages?: number
}

const MOOD_DETAILS: Record<
  "minimal" | "cinematic" | "vibrant" | "editorial",
  { title: string; subtitle: string; lighting: string; badge: string }
> = {
  minimal: {
    title: "Studio Minimal & Architectural",
    subtitle:
      "High-key ambient daylight, subtle shadow gradation, and intentional negative space.",
    lighting: "Diffused Daylight & High-Key Ambient",
    badge: "Architectural Minimal",
  },
  cinematic: {
    title: "Moody & Cinematic Direction",
    subtitle:
      "Dramatic directional lighting, deep obsidian contrast, and filmic composition.",
    lighting: "Low-Key Directional & Rim Highlights",
    badge: "Cinematic Drama",
  },
  vibrant: {
    title: "Vibrant & Prismatic Chromatics",
    subtitle:
      "Refractive frosted glass, vivid accent reflections, and dynamic tactile energy.",
    lighting: "High-Energy Chromatic & Prismatic Speculars",
    badge: "Chromatic Vitality",
  },
  editorial: {
    title: "Editorial & Authentic Human Poise",
    subtitle:
      "Natural golden-hour sunlight, tactile grain, and documentary-style composition.",
    lighting: "Natural Golden Hour & Soft Ambient",
    badge: "Tactile Editorial",
  },
}

export function PageImagery({
  brandName,
  imageryMood = "minimal",
  imageryOverlay = "none",
  imageryLinks,
  primaryColor,
  styleTheme,
  displayFont,
  bodyFont,
  monoFont,
  pageNumber = 10,
  totalPages = 10,
}: PageImageryProps) {
  const resolvedMood = imageryMood

  const moodInfo = MOOD_DETAILS[resolvedMood]

  const fallbackImages = IMAGERY_MOOD_IMAGE_ARRAYS[resolvedMood]
  const images =
    imageryLinks && imageryLinks.length > 0 ? imageryLinks : fallbackImages

  const img0 = images[0] || fallbackImages[0]
  const img1 = images[1] || fallbackImages[1]
  const img2 = images[2] || fallbackImages[2]
  const img3 = images[3] || fallbackImages[3]
  const img4 = images[4] || fallbackImages[4]

  return (
    <A4PageFrame
      id="page-imagery"
      pageNumber={pageNumber}
      totalPages={totalPages}
      sectionNumber="05"
      sectionTitle="Imagery &amp; Art Direction"
      brandName={brandName}
      styleTheme={styleTheme}
      displayFont={displayFont}
      bodyFont={bodyFont}
      monoFont={monoFont}
      className="overflow-hidden border border-zinc-200 bg-white p-12 text-black shadow-2xl"
    >
      <div className="flex h-full flex-col justify-between py-6">
        {/* Header Section */}
        <div className="space-y-3 pt-2">
          <div className="space-y-2">
            <h2 className="text-4xl font-bold text-black uppercase sm:text-5xl">
              IMAGERY &amp; ART DIRECTION
            </h2>
            <div className="h-0.5 w-16 bg-black" />
          </div>

          <p className="max-w-xl text-zinc-600">
            Visual art direction and photographic treatments establish the
            atmosphere, tonal fidelity, and human resonance of the brand. Visual
            assets strictly adhere to architectural framing, natural
            illumination, and authentic material texture.
          </p>
        </div>

        {/* Content Body */}
        <div className="my-auto space-y-5 py-2">
          {/* Active Mood Specification Bar */}
          <div className="flex items-baseline justify-between pb-3">
            <div className="space-y-0.5">
              <span className="font-mono text-[10px] font-semibold tracking-wider text-zinc-400 uppercase">
                Art Direction Aesthetic
              </span>
              <div className="text-2xl font-bold text-black">
                {moodInfo.title}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <span className="block font-mono text-[10px] text-zinc-400 uppercase">
                  Lighting Caliber
                </span>
                <span className="font-mono text-xs font-bold text-zinc-800">
                  {moodInfo.lighting}
                </span>
              </div>
            </div>
          </div>

          {/* Editorial Photographic Gallery */}
          <div className="space-y-2.5">
            {/* Top Asymmetric Pair (Hero 62% / Detail 38%) */}
            <div className="grid grid-cols-12 gap-3">
              {/* Hero Landscape Shot */}
              <div className="col-span-7 space-y-1">
                <div className="relative h-56 overflow-hidden bg-zinc-100">
                  <img
                    src={img0}
                    alt="Signature Hero Shot"
                    className="h-full w-full object-cover"
                  />
                  {imageryOverlay === "tint" && (
                    <div
                      className="absolute inset-0 opacity-20 mix-blend-multiply"
                      style={{ backgroundColor: primaryColor }}
                    />
                  )}
                </div>
                <div className="flex items-center justify-between font-mono text-[10px] text-zinc-400">
                  <span>01 / Atmospheric Hero Specimen</span>
                  <span>16:9 Landscape</span>
                </div>
              </div>

              {/* Detail / Portrait Shot */}
              <div className="col-span-5 space-y-1">
                <div className="relative h-56 overflow-hidden bg-zinc-100">
                  <img
                    src={img1}
                    alt="Detail Specimen"
                    className="h-full w-full object-cover"
                  />
                  {imageryOverlay === "tint" && (
                    <div
                      className="absolute inset-0 opacity-20 mix-blend-multiply"
                      style={{ backgroundColor: primaryColor }}
                    />
                  )}
                </div>
                <div className="flex items-center justify-between font-mono text-[10px] text-zinc-400">
                  <span>02 / Texture &amp; Form</span>
                  <span>4:5 Portrait</span>
                </div>
              </div>
            </div>

            {/* Bottom 3-Column Auxiliary Specimens */}
            <div className="grid grid-cols-3 gap-3 pt-0.5">
              <div className="space-y-1">
                <div className="relative h-32 overflow-hidden bg-zinc-100">
                  <img
                    src={img2}
                    alt="Environmental Context"
                    className="h-full w-full object-cover"
                  />
                  {imageryOverlay === "tint" && (
                    <div
                      className="absolute inset-0 opacity-20 mix-blend-multiply"
                      style={{ backgroundColor: primaryColor }}
                    />
                  )}
                </div>
                <div className="flex items-center justify-between font-mono text-[10px] text-zinc-400">
                  <span>03 / Environment</span>
                  <span>Context</span>
                </div>
              </div>

              <div className="space-y-1">
                <div className="relative h-32 overflow-hidden bg-zinc-100">
                  <img
                    src={img3}
                    alt="Spatial Atmosphere"
                    className="h-full w-full object-cover"
                  />
                  {imageryOverlay === "tint" && (
                    <div
                      className="absolute inset-0 opacity-20 mix-blend-multiply"
                      style={{ backgroundColor: primaryColor }}
                    />
                  )}
                </div>
                <div className="flex items-center justify-between font-mono text-[10px] text-zinc-400">
                  <span>04 / Atmosphere</span>
                  <span>Lighting</span>
                </div>
              </div>

              <div className="space-y-1">
                <div className="relative h-32 overflow-hidden bg-zinc-100">
                  <img
                    src={img4}
                    alt="Perspective & Poise"
                    className="h-full w-full object-cover"
                  />
                  {imageryOverlay === "tint" && (
                    <div
                      className="absolute inset-0 opacity-20 mix-blend-multiply"
                      style={{ backgroundColor: primaryColor }}
                    />
                  )}
                </div>
                <div className="flex items-center justify-between font-mono text-[10px] text-zinc-400">
                  <span>05 / Perspective</span>
                  <span>Geometry</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Art Direction Principles & Production Governance (3 Columns) */}
        <div className="space-y-2 pt-4">
          <div className="flex items-center justify-between border-b border-zinc-200 pb-1 font-mono text-[10px] text-zinc-400 uppercase">
            <span>Art Direction Principles</span>
            <span>Production Standards</span>
          </div>

          <div className="grid grid-cols-3 gap-6 pt-1">
            <div className="space-y-1">
              <div className="font-mono text-[10px] font-semibold text-zinc-400 uppercase">
                01 Lighting &amp; Exposure
              </div>
              <div className="text-xs font-bold text-black">
                Natural Diffused Light
              </div>
              <p className="text-[11px] text-zinc-600">
                Calibrate capture around authentic daylight or soft ambient
                illumination. Avoid harsh direct flash, oversaturated synthetic
                color casts, and aggressive vignetting.
              </p>
            </div>

            <div className="space-y-1">
              <div className="font-mono text-[10px] font-semibold text-zinc-400 uppercase">
                02 Framing &amp; Balance
              </div>
              <div className="text-xs font-bold text-black">
                Deliberate Negative Space
              </div>
              <p className="text-[11px] text-zinc-600">
                Preserve generous visual breathing room around primary focal
                subjects to maintain editorial composure and allow typography
                overlays without visual conflict.
              </p>
            </div>

            <div className="space-y-1">
              <div className="font-mono text-[10px] font-semibold text-zinc-400 uppercase">
                03 Material Authenticity
              </div>
              <div className="text-xs font-bold text-black">
                Tactile Texture Fidelity
              </div>
              <p className="text-[11px] text-zinc-600">
                Retain genuine physical textures, organic surface grain, and
                realistic shadow gradients. Post-processing must remain
                disciplined and true to material reality.
              </p>
            </div>
          </div>
        </div>

        {/* Unsplash Attribution & Rights Disclaimer */}
        <div className="flex items-center justify-between pt-3 text-[10px] text-zinc-500">
          <div className="flex items-center gap-2">
            <span>
              Photography sourced via Unsplash. All copyrights and intellectual
              property are attributed to their respective creators.
            </span>
          </div>
          <span className="font-mono text-zinc-400">Unsplash License</span>
        </div>
      </div>
    </A4PageFrame>
  )
}
