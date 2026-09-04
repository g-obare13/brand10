import type { BrandPillar } from "@/store/brandStore"
import type { PreviewStyleId } from "./A4PageFrame"
import { A4PageFrame } from "./A4PageFrame"

interface PageFoundationProps {
  brandName: string
  tagline?: string
  mission?: string
  vision?: string
  coreValues?: string[]
  brandPillars?: BrandPillar[]
  styleTheme: PreviewStyleId
  displayFont: string
  bodyFont: string
  monoFont: string
  pageNumber?: number
  totalPages?: number
  websiteUrl?: string
}

const DEFAULT_MISSION =
  "To empower audiences through deliberate craftsmanship, thoughtful design, and disciplined execution across every touchpoint."

const DEFAULT_VISION =
  "To establish an enduring standard of clarity, reliability, and timeless excellence in modern brand architecture."

const DEFAULT_VALUES = [
  {
    num: "01",
    title: "Precision",
    desc: "Rigorous attention to detail and proportion in every output.",
  },
  {
    num: "02",
    title: "Clarity",
    desc: "Communicating purpose without unnecessary decoration or friction.",
  },
  {
    num: "03",
    title: "Authenticity",
    desc: "Honest expression of materials, identity, and customer promises.",
  },
]

export function PageFoundation({
  brandName,
  tagline,
  mission,
  vision,
  coreValues,
  brandPillars,
  styleTheme,
  displayFont,
  bodyFont,
  monoFont,
  pageNumber = 3,
  totalPages = 8,
  websiteUrl,
}: PageFoundationProps) {
  const trimmedMission = mission?.trim()
  const trimmedVision = vision?.trim()
  const hasMission = Boolean(trimmedMission)
  const hasVision = Boolean(trimmedVision)
  const isMissingEither = !hasMission || !hasVision

  const activeMission = hasMission ? trimmedMission : DEFAULT_MISSION
  const activeVision = hasVision ? trimmedVision : DEFAULT_VISION

  // Active pillars list with fallback
  const pillarsList =
    brandPillars &&
    brandPillars.length > 0 &&
    brandPillars.some((p) => p.title.trim())
      ? brandPillars.slice(0, 3).map((p, idx) => ({
          num: `0${idx + 1}`,
          title: p.title || DEFAULT_VALUES[idx]?.title || `Pillar 0${idx + 1}`,
          desc:
            p.desc ||
            DEFAULT_VALUES[idx]?.desc ||
            `Core guiding pillar anchoring the ${brandName || "brand"} experience.`,
        }))
      : coreValues && coreValues.length > 0
        ? coreValues.slice(0, 3).map((val, idx) => ({
            num: `0${idx + 1}`,
            title: val,
            desc:
              DEFAULT_VALUES[idx]?.desc ||
              `Core guiding pillar anchoring the ${brandName || "brand"} experience.`,
          }))
        : DEFAULT_VALUES

  return (
    <A4PageFrame
      id="page-foundation"
      pageNumber={pageNumber}
      totalPages={totalPages}
      sectionNumber="01"
      sectionTitle="Brand Strategy & Foundation"
      brandName={brandName}
      styleTheme={styleTheme}
      displayFont={displayFont}
      bodyFont={bodyFont}
      monoFont={monoFont}
      websiteUrl={websiteUrl}
      className="overflow-hidden border border-zinc-200 bg-white p-12 text-black shadow-2xl"
    >
      <div className="flex h-full flex-col justify-between py-6">
        {/* Page Title & Introductory Statement */}
        <div className="space-y-4 pt-2">
          <div className="space-y-2">
            <h2 className="text-4xl font-bold text-black uppercase sm:text-5xl">
              FOUNDATION
            </h2>
            <div className="h-0.5 w-16 bg-black" />
          </div>

          <div className="space-y-1 pt-1">
            {tagline && (
              <div className="text-base font-semibold text-zinc-900">
                {tagline}
              </div>
            )}
            <p className="max-w-xl text-base text-zinc-600">
              The foundation defines the strategic purpose and ideological north
              star of {brandName || "the brand"}. Every visual asset, tone
              directive, and interactive touchpoint across this system derives
              directly from these commitments.
            </p>
          </div>
        </div>

        {/* Mission & Vision Section */}
        <div className="my-auto space-y-6 py-2">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Mission Block */}
            <div className="flex flex-col justify-between border-t-2 border-black pt-4">
              <div className="space-y-3">
                <div className="text-xs font-bold text-zinc-500 uppercase">
                  01 / Mission Statement
                </div>
                <div className="text-lg font-bold text-black sm:text-xl">
                  {activeMission}
                </div>
              </div>

              {!hasMission && (
                <div className="pt-3 text-xs text-zinc-400">
                  [Placeholder text - Add vision and mission in step 1]
                </div>
              )}
            </div>

            {/* Vision Block */}
            <div className="flex flex-col justify-between border-t-2 border-black pt-4">
              <div className="space-y-3">
                <div className="text-xs font-bold text-zinc-500 uppercase">
                  02 / Strategic Vision
                </div>
                <div className="text-lg font-bold text-black sm:text-xl">
                  {activeVision}
                </div>
              </div>

              {!hasVision && (
                <div className="pt-3 text-xs text-zinc-400">
                  [Placeholder text - Add vision and mission in step 1]
                </div>
              )}
            </div>
          </div>

          {/* Combined disclaimer note if both were missing */}
          {isMissingEither && !hasMission && !hasVision && (
            <div className="rounded border border-dashed border-zinc-200 bg-zinc-50 px-4 py-2 text-xs text-zinc-500">
              Note: Mission and Vision are currently using default placeholders.
              You can customize them anytime in Step 1 (Foundation).
            </div>
          )}
        </div>

        {/* Core Values / Brand Pillars */}
        <div className="space-y-3 pt-6">
          <div className="text-xs font-bold text-zinc-500 uppercase">
            Core Brand Pillars
          </div>

          <div className="grid grid-cols-3 gap-6">
            {pillarsList.map((val) => (
              <div key={val.num} className="space-y-1">
                <div className="text-sm font-bold text-black">{val.title}</div>
                <p className="text-xs text-zinc-600">{val.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </A4PageFrame>
  )
}
