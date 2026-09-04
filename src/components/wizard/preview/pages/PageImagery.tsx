import { Badge } from "@/components/ui/badge"
import { A4PageFrame  } from "./A4PageFrame"
import type {PreviewStyleId} from "./A4PageFrame";
import { IMAGERY_MOOD_IMAGE_ARRAYS } from "@/data/wizard"
import { cn } from "@/lib/utils"

interface PageImageryProps {
  brandName: string
  imageryMood?: "minimal" | "cinematic" | "vibrant" | "editorial"
  imageryOverlay: "none" | "tint" | "duotone"
  primaryColor: string
  styleTheme: PreviewStyleId
  displayFont: string
  bodyFont: string
  monoFont: string
  pageNumber?: number
  totalPages?: number
}

export function PageImagery({
  brandName,
  imageryOverlay = "none",
  primaryColor,
  styleTheme,
  displayFont,
  bodyFont,
  monoFont,
  pageNumber = 7,
  totalPages = 8,
}: PageImageryProps) {
  // Map styleTheme to available imagery mood arrays
  const moodMap: Record<PreviewStyleId, "minimal" | "cinematic" | "vibrant" | "editorial"> = {
    "quiet-precision": "minimal",
    "expressive-energy": "vibrant",
    "soft-tactility": "minimal",
    "editorial-character": "editorial",
    minimal: "minimal",
    cinematic: "cinematic",
    vibrant: "vibrant",
    candid: "editorial",
  }
  const resolvedMood = moodMap[styleTheme]
  const images = IMAGERY_MOOD_IMAGE_ARRAYS[resolvedMood]

  const moodDescriptions: Record<PreviewStyleId, { title: string; desc: string }> = {
    "quiet-precision": {
      title: "Quiet Precision & Architectural",
      desc: "Intentional whitespace, structured grids, and uncompromising clarity.",
    },
    "expressive-energy": {
      title: "Expressive Energy & Chromatic",
      desc: "High-voltage contrast, saturated palettes, and kinetic presence.",
    },
    "soft-tactility": {
      title: "Soft Tactility & Dimensional",
      desc: "Molded surfaces, soft ambient shadows, and organic physical depth.",
    },
    "editorial-character": {
      title: "Editorial Character & Poise",
      desc: "Publication poise, refined typography, and narrative sophistication.",
    },
    minimal: {
      title: "Studio Minimal & High-Key",
      desc: "Clean soft shadows, high-key ambient light, pure neutral backdrops, and deliberate negative space.",
    },
    cinematic: {
      title: "Dramatic & High Contrast",
      desc: "Obsidian deep tones, intense directional lighting, film grain texture, and cinematic perspective.",
    },
    vibrant: {
      title: "Chromatic & 3D Glass",
      desc: "Prismatic highlights, frosted glass refraction, dynamic geometric forms, and high color energy.",
    },
    candid: {
      title: "Authentic & Tactile Editorial",
      desc: "Warm sunlight, candid human expression, natural textures, and documentary-style composition.",
    },
  }

  const activeMoodInfo = moodDescriptions[styleTheme]

  return (
    <A4PageFrame
      id="page-05"
      pageNumber={pageNumber}
      totalPages={totalPages}
      sectionNumber="05"
      sectionTitle="Imagery & Mood Direction"
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
              Photography Art Direction
            </Badge>
            <Badge variant="default" className="text-[10px] capitalize">
              {styleTheme} Style
            </Badge>
          </div>
          <h2>{activeMoodInfo.title}</h2>
          <p className="text-xs opacity-75">
            {activeMoodInfo.desc}
          </p>
        </div>

        {/* Moodboard Imagery Grid */}
        <div className="grid grid-cols-3 gap-3">
          {/* Main Hero Photo (2 cols wide) */}
          <div className="col-span-2 relative h-52 overflow-hidden rounded-2xl border border-black/10 shadow-xs">
            <img
              src={images[0]}
              alt="Primary mood shot"
              className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
            />
            {imageryOverlay === "tint" && (
              <div
                className="absolute inset-0 opacity-20 mix-blend-multiply"
                style={{ backgroundColor: primaryColor }}
              />
            )}
            <div className="absolute bottom-3 left-3">
              <Badge variant="secondary" className="text-[10px] font-mono bg-black/60 text-white border-black/20 backdrop-blur-xs">
                Hero Signature Visual
              </Badge>
            </div>
          </div>

          {/* Right Side Stacked Photo */}
          <div className="relative h-52 overflow-hidden rounded-2xl border border-black/10 shadow-xs">
            <img
              src={images[1]}
              alt="Detail mood shot"
              className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
            />
            {imageryOverlay === "tint" && (
              <div
                className="absolute inset-0 opacity-20 mix-blend-multiply"
                style={{ backgroundColor: primaryColor }}
              />
            )}
          </div>

          {/* Bottom 3 Photos */}
          <div className="relative h-36 overflow-hidden rounded-2xl border border-black/10 shadow-xs">
            <img
              src={images[2] || images[0]}
              alt="Texture mood shot"
              className="h-full w-full object-cover"
            />
          </div>

          <div className="relative h-36 overflow-hidden rounded-2xl border border-black/10 shadow-xs">
            <img
              src={images[3] || images[1]}
              alt="Atmosphere shot"
              className="h-full w-full object-cover"
            />
          </div>

          <div className="relative h-36 overflow-hidden rounded-2xl border border-black/10 shadow-xs">
            <img
              src={images[4] || images[0]}
              alt="Perspective shot"
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        {/* Photography Treatment & Treatment Rules */}
        <div
          className={cn(
            "grid grid-cols-3 gap-4 rounded-2xl border p-4",
            styleTheme === "cinematic"
              ? "border-zinc-800 bg-zinc-900/60"
              : "border-zinc-200 bg-white"
          )}
        >
          <div className="space-y-1">
            <span className="font-mono text-[10px] font-semibold uppercase opacity-60">
              01 Light & Contrast
            </span>
            <p className="text-xs font-medium">Natural Diffused Light</p>
            <p className="text-[11px] opacity-70">
              Avoid aggressive flash or artificial saturated tints.
            </p>
          </div>

          <div className="space-y-1">
            <span className="font-mono text-[10px] font-semibold uppercase opacity-60">
              02 Composition
            </span>
            <p className="text-xs font-medium">Intentional Framing</p>
            <p className="text-[11px] opacity-70">
              Generous negative space allowing editorial text overlays.
            </p>
          </div>

          <div className="space-y-1">
            <span className="font-mono text-[10px] font-semibold uppercase opacity-60">
              03 Surface Overlay
            </span>
            <p className="text-xs font-medium capitalize">{imageryOverlay} Overlay</p>
            <p className="text-[11px] opacity-70">
              Subtle tonal grading matching primary token {primaryColor}.
            </p>
          </div>
        </div>
      </div>
    </A4PageFrame>
  )
}
