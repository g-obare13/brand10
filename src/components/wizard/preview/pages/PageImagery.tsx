import { IMAGERY_MOOD_IMAGE_ARRAYS } from "@/data/wizard"
import type { PreviewStyleId } from "./A4PageFrame"
import { A4PageFrame } from "./A4PageFrame"
import { Badge } from "@/components/ui/badge"
import { getPdfTheme } from "./pdfPageTheme"
import type { ColorSwatch } from "@/lib/colorUtils"

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
  colors?: ColorSwatch[]
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
  colors,
}: PageImageryProps) {
  const theme = getPdfTheme(styleTheme)
  const isExpressive = theme.isExpressive
  const isSoftTactility = theme.isSoftTactility
  const isEditorial = theme.isEditorial

  const moodInfo = MOOD_DETAILS[imageryMood]
  const fallbackImages = IMAGERY_MOOD_IMAGE_ARRAYS[imageryMood]
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
      sectionTitle="Imagery & Art Direction"
      brandName={brandName}
      styleTheme={styleTheme}
      displayFont={displayFont}
      bodyFont={bodyFont}
      monoFont={monoFont}
      className={theme.pageFrame}
      colors={colors}
    >
      <div className="flex h-full flex-col justify-between py-6">
        {/* Header Section */}
        <div className="space-y-3 pt-2">
          <div className="space-y-2">
            <h2 className={theme.title}>ART DIRECTION</h2>
            <div className={theme.accentBar} />
          </div>

          <p className={theme.introText}>
            Visual standards and aesthetic direction for brand photography,
            ambient tone, and compositional balance across all print and digital
            surfaces.
          </p>
        </div>

        {/* Selected Mood Showcase Banner */}
        <div className="my-auto space-y-4 py-1">
          <div
            className={
              isExpressive
                ? "flex items-center justify-between rounded-xl border-2 border-black bg-white p-4 shadow-[4px_4px_0px_0px_#000]"
                : isSoftTactility
                  ? "flex items-center justify-between rounded-2xl border border-stone-200/80 bg-white/90 p-4 shadow-[4px_4px_16px_rgba(0,0,0,0.04)]"
                  : isEditorial
                    ? "flex items-center justify-between border-t border-b border-stone-300 py-3"
                    : "flex items-center justify-between rounded-xl border border-zinc-200 bg-zinc-50 p-4"
            }
          >
            <div>
              <span
                className={
                  isExpressive
                    ? "font-mono text-[10px] font-black text-zinc-500 uppercase"
                    : isSoftTactility
                      ? "text-[10px] font-semibold tracking-wider text-stone-500 uppercase"
                      : isEditorial
                        ? "font-mono text-[10px] tracking-widest text-stone-500 uppercase"
                        : "text-[10px] font-semibold tracking-wider text-zinc-400 uppercase"
                }
              >
                Art Direction Aesthetic
              </span>
              <div
                className={
                  isExpressive
                    ? "text-2xl font-black text-black uppercase"
                    : isSoftTactility
                      ? "text-2xl font-bold text-stone-900"
                      : isEditorial
                        ? "text-2xl font-bold text-stone-950"
                        : "text-2xl font-bold text-primary-900"
                }
              >
                {moodInfo.title}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Badge
                className={
                  isExpressive
                    ? theme.badgeAmber
                    : isSoftTactility
                      ? theme.badgePrimary
                      : isEditorial
                        ? theme.badgePrimary
                        : theme.badgeOutline
                }
              >
                {moodInfo.badge}
              </Badge>
              <div className="text-right">
                {isExpressive ? (
                  <Badge className={theme.badgeLime}>{moodInfo.lighting}</Badge>
                ) : isSoftTactility ? (
                  <Badge className={theme.badgeSecondary}>{moodInfo.lighting}</Badge>
                ) : isEditorial ? (
                  <span className="font-mono text-xs text-stone-700 uppercase tracking-wider">
                    {moodInfo.lighting}
                  </span>
                ) : (
                  <span className="text-xs font-bold text-zinc-800">
                    {moodInfo.lighting}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Editorial Photographic Gallery */}
          <div className="space-y-2.5">
            {/* Top Asymmetric Pair (Hero 62% / Detail 38%) */}
            <div className="grid grid-cols-12 gap-3">
              {/* Hero Landscape Shot */}
              <div className="col-span-7 space-y-1">
                <div
                  className={
                    isExpressive
                      ? "relative h-56 overflow-hidden rounded-xl border-2 border-black bg-zinc-100 shadow-[3px_3px_0px_0px_#000]"
                      : isSoftTactility
                        ? "relative h-56 overflow-hidden rounded-2xl border border-stone-200/80 bg-stone-100 shadow-[4px_4px_12px_rgba(0,0,0,0.06)]"
                        : isEditorial
                          ? "relative h-56 overflow-hidden rounded-none border border-stone-300 bg-stone-100"
                          : "relative h-56 overflow-hidden bg-zinc-100"
                  }
                >
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
                <div
                  className={
                    isExpressive
                      ? "flex items-center justify-between font-mono text-[10px] font-bold text-black"
                      : isSoftTactility
                        ? "flex items-center justify-between text-[10px] text-stone-500"
                        : isEditorial
                          ? "flex items-center justify-between font-mono text-[10px] uppercase tracking-wider text-stone-600"
                          : "flex items-center justify-between text-[10px] text-zinc-400"
                  }
                >
                  <span>01 / Atmospheric Hero Specimen</span>
                  <span>16:9 Landscape</span>
                </div>
              </div>

              {/* Detail / Portrait Shot */}
              <div className="col-span-5 space-y-1">
                <div
                  className={
                    isExpressive
                      ? "relative h-56 overflow-hidden rounded-xl border-2 border-black bg-zinc-100 shadow-[3px_3px_0px_0px_#000]"
                      : isSoftTactility
                        ? "relative h-56 overflow-hidden rounded-2xl border border-stone-200/80 bg-stone-100 shadow-[4px_4px_12px_rgba(0,0,0,0.06)]"
                        : isEditorial
                          ? "relative h-56 overflow-hidden rounded-none border border-stone-300 bg-stone-100"
                          : "relative h-56 overflow-hidden bg-zinc-100"
                  }
                >
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
                <div
                  className={
                    isExpressive
                      ? "flex items-center justify-between font-mono text-[10px] font-bold text-black"
                      : isSoftTactility
                        ? "flex items-center justify-between text-[10px] text-stone-500"
                        : isEditorial
                          ? "flex items-center justify-between font-mono text-[10px] uppercase tracking-wider text-stone-600"
                          : "flex items-center justify-between text-[10px] text-zinc-400"
                  }
                >
                  <span>02 / Texture &amp; Form</span>
                  <span>4:5 Portrait</span>
                </div>
              </div>
            </div>

            {/* Bottom 3-Column Auxiliary Specimens */}
            <div className="grid grid-cols-3 gap-3 pt-0.5">
              <div className="space-y-1">
                <div
                  className={
                    isExpressive
                      ? "relative h-32 overflow-hidden rounded-xl border-2 border-black bg-zinc-100 shadow-[2px_2px_0px_0px_#000]"
                      : isSoftTactility
                        ? "relative h-32 overflow-hidden rounded-2xl border border-stone-200/80 bg-stone-100 shadow-[3px_3px_10px_rgba(0,0,0,0.05)]"
                        : isEditorial
                          ? "relative h-32 overflow-hidden rounded-none border border-stone-300 bg-stone-100"
                          : "relative h-32 overflow-hidden bg-zinc-100"
                  }
                >
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
                <div
                  className={
                    isExpressive
                      ? "flex items-center justify-between font-mono text-[10px] font-bold text-black"
                      : isSoftTactility
                        ? "flex items-center justify-between text-[10px] text-stone-500"
                        : isEditorial
                          ? "flex items-center justify-between font-mono text-[10px] uppercase tracking-wider text-stone-600"
                          : "flex items-center justify-between text-[10px] text-zinc-400"
                  }
                >
                  <span>03 / Environment</span>
                  <span>Context</span>
                </div>
              </div>

              <div className="space-y-1">
                <div
                  className={
                    isExpressive
                      ? "relative h-32 overflow-hidden rounded-xl border-2 border-black bg-zinc-100 shadow-[2px_2px_0px_0px_#000]"
                      : isSoftTactility
                        ? "relative h-32 overflow-hidden rounded-2xl border border-stone-200/80 bg-stone-100 shadow-[3px_3px_10px_rgba(0,0,0,0.05)]"
                        : isEditorial
                          ? "relative h-32 overflow-hidden rounded-none border border-stone-300 bg-stone-100"
                          : "relative h-32 overflow-hidden bg-zinc-100"
                  }
                >
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
                <div
                  className={
                    isExpressive
                      ? "flex items-center justify-between font-mono text-[10px] font-bold text-black"
                      : isSoftTactility
                        ? "flex items-center justify-between text-[10px] text-stone-500"
                        : isEditorial
                          ? "flex items-center justify-between font-mono text-[10px] uppercase tracking-wider text-stone-600"
                          : "flex items-center justify-between text-[10px] text-zinc-400"
                  }
                >
                  <span>04 / Atmosphere</span>
                  <span>Lighting</span>
                </div>
              </div>

              <div className="space-y-1">
                <div
                  className={
                    isExpressive
                      ? "relative h-32 overflow-hidden rounded-xl border-2 border-black bg-zinc-100 shadow-[2px_2px_0px_0px_#000]"
                      : isSoftTactility
                        ? "relative h-32 overflow-hidden rounded-2xl border border-stone-200/80 bg-stone-100 shadow-[3px_3px_10px_rgba(0,0,0,0.05)]"
                        : isEditorial
                          ? "relative h-32 overflow-hidden rounded-none border border-stone-300 bg-stone-100"
                          : "relative h-32 overflow-hidden bg-zinc-100"
                  }
                >
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
                <div
                  className={
                    isExpressive
                      ? "flex items-center justify-between font-mono text-[10px] font-bold text-black"
                      : isSoftTactility
                        ? "flex items-center justify-between text-[10px] text-stone-500"
                        : isEditorial
                          ? "flex items-center justify-between font-mono text-[10px] uppercase tracking-wider text-stone-600"
                          : "flex items-center justify-between text-[10px] text-zinc-400"
                  }
                >
                  <span>05 / Perspective</span>
                  <span>Geometry</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Art Direction Principles & Production Governance (3 Columns) */}
        <div className="space-y-2 pt-4">
          <div
            className={
              isExpressive
                ? "flex items-center justify-between border-b-2 border-black pb-1 font-mono text-[10px] font-bold text-black uppercase"
                : isSoftTactility
                  ? "flex items-center justify-between border-b border-stone-200 pb-1 text-[10px] font-semibold text-stone-500 uppercase"
                  : isEditorial
                    ? "flex items-center justify-between border-b border-stone-300 pb-1 font-mono text-[10px] uppercase tracking-widest text-stone-600"
                    : "flex items-center justify-between border-b border-zinc-200 pb-1 text-[10px] text-zinc-400 uppercase"
            }
          >
            <span>Art Direction Principles</span>
            <span>Production Standards</span>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-1">
            <div
              className={
                isExpressive
                  ? "space-y-1.5 rounded-xl border-2 border-black bg-white p-3 shadow-[3px_3px_0px_0px_#000]"
                  : isSoftTactility
                    ? "space-y-1.5 rounded-2xl border border-stone-200/80 bg-white/90 p-3 shadow-[3px_3px_10px_rgba(0,0,0,0.04)]"
                    : isEditorial
                      ? "space-y-1.5 rounded-none border-l-2 border-stone-900 pl-3 py-1 bg-transparent"
                      : "space-y-1"
              }
            >
              <div
                className={
                  isExpressive
                    ? "font-mono text-[10px] font-black text-black uppercase"
                    : isSoftTactility
                      ? "text-[10px] font-semibold text-stone-500 uppercase"
                      : isEditorial
                        ? "font-mono text-[10px] tracking-widest text-stone-500 uppercase"
                        : "text-[10px] font-semibold text-zinc-400 uppercase"
                }
              >
                01 Lighting &amp; Exposure
              </div>
              <div
                className={
                  isExpressive
                    ? "text-xs font-black text-black uppercase"
                    : isSoftTactility
                      ? "text-xs font-bold text-stone-900"
                      : isEditorial
                        ? "text-xs font-bold text-stone-950"
                        : "text-xs font-bold text-primary-900"
                }
              >
                Natural Diffused Light
              </div>
              <p
                className={
                  isExpressive
                    ? "text-[11px] leading-relaxed text-zinc-700"
                    : isSoftTactility
                      ? "text-[11px] leading-relaxed text-stone-600"
                      : isEditorial
                        ? "text-[11px] leading-relaxed text-stone-700"
                        : "text-[11px] text-zinc-600"
                }
              >
                Calibrate capture around authentic daylight or soft ambient
                illumination. Avoid harsh direct flash, oversaturated synthetic
                color casts, and aggressive vignetting.
              </p>
            </div>

            <div
              className={
                isExpressive
                  ? "space-y-1.5 rounded-xl border-2 border-black bg-white p-3 shadow-[3px_3px_0px_0px_#000]"
                  : isSoftTactility
                    ? "space-y-1.5 rounded-2xl border border-stone-200/80 bg-white/90 p-3 shadow-[3px_3px_10px_rgba(0,0,0,0.04)]"
                    : isEditorial
                      ? "space-y-1.5 rounded-none border-l-2 border-stone-900 pl-3 py-1 bg-transparent"
                      : "space-y-1"
              }
            >
              <div
                className={
                  isExpressive
                    ? "font-mono text-[10px] font-black text-black uppercase"
                    : isSoftTactility
                      ? "text-[10px] font-semibold text-stone-500 uppercase"
                      : isEditorial
                        ? "font-mono text-[10px] tracking-widest text-stone-500 uppercase"
                        : "text-[10px] font-semibold text-zinc-400 uppercase"
                }
              >
                02 Framing &amp; Balance
              </div>
              <div
                className={
                  isExpressive
                    ? "text-xs font-black text-black uppercase"
                    : isSoftTactility
                      ? "text-xs font-bold text-stone-900"
                      : isEditorial
                        ? "text-xs font-bold text-stone-950"
                        : "text-xs font-bold text-primary-900"
                }
              >
                Deliberate Negative Space
              </div>
              <p
                className={
                  isExpressive
                    ? "text-[11px] leading-relaxed text-zinc-700"
                    : isSoftTactility
                      ? "text-[11px] leading-relaxed text-stone-600"
                      : isEditorial
                        ? "text-[11px] leading-relaxed text-stone-700"
                        : "text-[11px] text-zinc-600"
                }
              >
                Preserve generous visual breathing room around primary focal
                subjects to maintain editorial composure and allow typography
                overlays without visual conflict.
              </p>
            </div>

            <div
              className={
                isExpressive
                  ? "space-y-1.5 rounded-xl border-2 border-black bg-white p-3 shadow-[3px_3px_0px_0px_#000]"
                  : isSoftTactility
                    ? "space-y-1.5 rounded-2xl border border-stone-200/80 bg-white/90 p-3 shadow-[3px_3px_10px_rgba(0,0,0,0.04)]"
                    : isEditorial
                      ? "space-y-1.5 rounded-none border-l-2 border-stone-900 pl-3 py-1 bg-transparent"
                      : "space-y-1"
              }
            >
              <div
                className={
                  isExpressive
                    ? "font-mono text-[10px] font-black text-black uppercase"
                    : isSoftTactility
                      ? "text-[10px] font-semibold text-stone-500 uppercase"
                      : isEditorial
                        ? "font-mono text-[10px] tracking-widest text-stone-500 uppercase"
                        : "text-[10px] font-semibold text-zinc-400 uppercase"
                }
              >
                03 Material Authenticity
              </div>
              <div
                className={
                  isExpressive
                    ? "text-xs font-black text-black uppercase"
                    : isSoftTactility
                      ? "text-xs font-bold text-stone-900"
                      : isEditorial
                        ? "text-xs font-bold text-stone-950"
                        : "text-xs font-bold text-primary-900"
                }
              >
                Tactile Texture Fidelity
              </div>
              <p
                className={
                  isExpressive
                    ? "text-[11px] leading-relaxed text-zinc-700"
                    : isSoftTactility
                      ? "text-[11px] leading-relaxed text-stone-600"
                      : isEditorial
                        ? "text-[11px] leading-relaxed text-stone-700"
                        : "text-[11px] text-zinc-600"
                }
              >
                Retain genuine physical textures, organic surface grain, and
                realistic shadow gradients. Post-processing must remain
                disciplined and true to material reality.
              </p>
            </div>
          </div>
        </div>

        {/* Unsplash Attribution & Rights Disclaimer */}
        <div
          className={
            isExpressive
              ? "flex items-center justify-between pt-3 font-mono text-[10px] font-bold text-zinc-600"
              : isSoftTactility
                ? "flex items-center justify-between pt-3 text-[10px] text-stone-500"
                : isEditorial
                  ? "flex items-center justify-between pt-3 font-mono text-[10px] text-stone-600 uppercase tracking-wider"
                  : "flex items-center justify-between pt-3 text-[10px] text-zinc-500"
          }
        >
          <div className="flex items-center gap-2">
            <span>
              Photography sourced via Unsplash. All copyrights and intellectual
              property are attributed to their respective creators.
            </span>
          </div>
          {isExpressive ? (
            <Badge className={theme.badgeLime}>Unsplash License</Badge>
          ) : isSoftTactility ? (
            <Badge className={theme.badgeSecondary}>Unsplash License</Badge>
          ) : isEditorial ? (
            <Badge className={theme.badgeAmber}>Unsplash License</Badge>
          ) : (
            <span className="text-zinc-400">Unsplash License</span>
          )}
        </div>
      </div>
    </A4PageFrame>
  )
}
