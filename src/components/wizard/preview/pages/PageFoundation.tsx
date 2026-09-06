import type { BrandPillar } from "@/store/brandStore"
import type { PreviewStyleId } from "./A4PageFrame"
import { A4PageFrame } from "./A4PageFrame"
import { Badge } from "@/components/ui/badge"
import { getPdfTheme } from "./pdfPageTheme"

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

  const theme = getPdfTheme(styleTheme)
  const isExpressive = theme.isExpressive
  const isSoftTactility = theme.isSoftTactility
  const isEditorial = theme.isEditorial

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
      className={theme.pageFrame}
    >
      <div className="flex h-full flex-col justify-between py-6">
        {/* Page Title & Introductory Statement */}
        <div className="space-y-4">
          <div className="space-y-2">
            <h2 className={theme.title}>FOUNDATION</h2>
            <div className={theme.accentBar} />
          </div>

          <div className="space-y-1 pt-1">
            {tagline && (
              <div
                className={
                  isExpressive
                    ? "text-base font-black text-black uppercase"
                    : isSoftTactility
                      ? "text-base font-semibold text-stone-900 tracking-tight"
                      : isEditorial
                        ? "text-base font-semibold text-stone-900 tracking-tight"
                        : "text-base font-semibold text-primary-900"
                }
              >
                {tagline}
              </div>
            )}
            <p className={theme.introText}>
              The foundation defines the strategic purpose and ideological north
              star of {brandName || "the brand"}. Every visual asset, tone
              directive, and interactive touchpoint across this system derives
              directly from these commitments.
            </p>
          </div>
        </div>

        {/* Vision & Mission Row */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Mission Block */}
            <div
              className={
                isExpressive
                  ? "flex flex-col justify-between rounded-xl border-2 border-black bg-white p-5 shadow-[4px_4px_0px_0px_#000]"
                  : isSoftTactility
                    ? "flex flex-col justify-between rounded-3xl border border-stone-200/70 bg-white/90 p-5 shadow-[6px_6px_16px_rgba(0,0,0,0.05),-4px_-4px_12px_rgba(255,255,255,0.9)]"
                    : isEditorial
                      ? "flex flex-col justify-between border-t border-stone-900 bg-transparent pt-4"
                      : "flex flex-col justify-between border-t-2 border-primary-900 pt-4"
              }
            >
              <div className="space-y-3">
                {isExpressive ? (
                  <Badge className={theme.badgeAmber}>
                    01 / Core Mission
                  </Badge>
                ) : isSoftTactility ? (
                  <Badge className={theme.badgePrimary}>
                    01 / Core Mission
                  </Badge>
                ) : isEditorial ? (
                  <Badge className={theme.badgeAmber}>
                    01 / Core Mission
                  </Badge>
                ) : (
                  <div className="text-xs font-bold text-zinc-500 uppercase">
                    01 / Core Mission
                  </div>
                )}
                <div
                  className={
                    isExpressive
                      ? "text-base font-bold text-black sm:text-lg leading-snug"
                      : isSoftTactility
                        ? "text-base font-semibold text-stone-900 sm:text-lg leading-snug"
                        : isEditorial
                          ? "text-lg font-bold text-stone-950 sm:text-xl"
                          : "text-lg font-bold text-primary-900 sm:text-xl"
                  }
                >
                  &ldquo;{activeMission}&rdquo;
                </div>
              </div>

              {!hasMission && (
                <div className="pt-3 text-xs text-zinc-400">
                  [Placeholder text - Add vision and mission in step 1]
                </div>
              )}
            </div>

            {/* Vision Block */}
            <div
              className={
                isExpressive
                  ? "flex flex-col justify-between rounded-xl border-2 border-black bg-white p-5 shadow-[4px_4px_0px_0px_#000]"
                  : isSoftTactility
                    ? "flex flex-col justify-between rounded-3xl border border-stone-200/70 bg-white/90 p-5 shadow-[6px_6px_16px_rgba(0,0,0,0.05),-4px_-4px_12px_rgba(255,255,255,0.9)]"
                    : isEditorial
                      ? "flex flex-col justify-between border-t border-stone-900 bg-transparent pt-4"
                      : "flex flex-col justify-between border-t-2 border-primary-900 pt-4"
              }
            >
              <div className="space-y-3">
                {isExpressive ? (
                  <Badge className={theme.badgeLime}>
                    02 / Strategic Vision
                  </Badge>
                ) : isSoftTactility ? (
                  <Badge className={theme.badgeSecondary}>
                    02 / Strategic Vision
                  </Badge>
                ) : isEditorial ? (
                  <Badge className={theme.badgeSecondary}>
                    02 / Strategic Vision
                  </Badge>
                ) : (
                  <div className="text-xs font-bold text-zinc-500 uppercase">
                    02 / Strategic Vision
                  </div>
                )}
                <div
                  className={
                    isExpressive
                      ? "text-base font-bold text-black sm:text-lg leading-snug"
                      : isSoftTactility
                        ? "text-base font-semibold text-stone-900 sm:text-lg leading-snug"
                        : isEditorial
                          ? "text-lg font-bold text-stone-950 sm:text-xl"
                          : "text-lg font-bold text-primary-900 sm:text-xl"
                  }
                >
                  &ldquo;{activeVision}&rdquo;
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
            <div
              className={
                isExpressive
                  ? "rounded-lg border-2 border-dashed border-black bg-amber-50 px-4 py-2 text-xs font-medium text-black"
                  : isSoftTactility
                    ? "rounded-2xl border border-dashed border-stone-300 bg-stone-50 px-4 py-2 text-xs text-stone-600"
                    : isEditorial
                      ? "rounded-none border-b border-dashed border-stone-400 bg-transparent px-2 py-2 font-mono text-[11px] text-stone-600"
                      : "rounded border border-dashed border-zinc-200 bg-zinc-50 px-4 py-2 text-xs text-zinc-500"
              }
            >
              Note: Mission and Vision are currently using default placeholders.
              You can customize them anytime in Step 1 (Foundation).
            </div>
          )}
        </div>

        {/* Core Values / Brand Pillars */}
        <div className="space-y-3 pt-6">
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
              Core Brand Pillars
            </div>
            {isExpressive ? (
              <Badge className={theme.badgeAmber}>
                3 Pillars
              </Badge>
            ) : isSoftTactility ? (
              <Badge className={theme.badgePrimary}>
                3 Pillars
              </Badge>
            ) : isEditorial ? (
              <Badge className={theme.badgePrimary}>
                3 Pillars
              </Badge>
            ) : null}
          </div>

          <div className="grid grid-cols-3 gap-6">
            {pillarsList.map((val) => (
              <div
                key={val.num}
                className={
                  isExpressive
                    ? "flex flex-col justify-between space-y-2 rounded-xl border-2 border-black bg-white p-4 shadow-[3px_3px_0px_0px_#000]"
                    : isSoftTactility
                      ? "flex flex-col justify-between space-y-2 rounded-2xl border border-stone-200/60 bg-white/90 p-4 shadow-[4px_4px_12px_rgba(0,0,0,0.04),-3px_-3px_8px_rgba(255,255,255,0.9)]"
                      : isEditorial
                        ? "flex flex-col justify-between space-y-2 border-l-2 border-stone-900 bg-transparent py-2 pl-4 pr-1"
                        : "space-y-1"
                }
              >
                {isExpressive ? (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-black text-black">
                        {val.num}
                      </span>
                    </div>
                    <div className="text-sm font-black uppercase text-black">
                      {val.title}
                    </div>
                    <p className="text-xs font-medium text-zinc-700">{val.desc}</p>
                  </>
                ) : isSoftTactility ? (
                  <>
                    <div className="flex items-center justify-between">
                      <Badge className="rounded-full border border-stone-200/80 bg-stone-100 px-2 py-0.5 text-[10px] font-mono font-semibold text-stone-700">
                        {val.num}
                      </Badge>
                    </div>
                    <div className="text-sm font-semibold text-stone-900">
                      {val.title}
                    </div>
                    <p className="text-xs text-stone-600 font-normal leading-relaxed">{val.desc}</p>
                  </>
                ) : isEditorial ? (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] uppercase tracking-widest text-stone-500">
                        {val.num}
                      </span>
                    </div>
                    <div className="text-sm font-bold text-stone-950">
                      {val.title}
                    </div>
                    <p className="text-xs text-stone-600 leading-relaxed">{val.desc}</p>
                  </>
                ) : (
                  <>
                    <div className="text-sm font-bold text-primary-900">
                      {val.title}
                    </div>
                    <p className="text-xs text-zinc-600">{val.desc}</p>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </A4PageFrame>
  )
}
