import type { PreviewStyleId } from "./A4PageFrame"
import { A4PageFrame } from "./A4PageFrame"
import { Badge } from "@/components/ui/badge"
import { getPdfTheme } from "./pdfPageTheme"

interface TableOfContentItem {
  num: string
  title: string
  desc: string
}

const DEFAULT_SECTIONS: TableOfContentItem[] = [
  {
    num: "01",
    title: "Brand Strategy & Foundation",
    desc: "Core mission, vision, brand personality attributes, and guiding brand values.",
  },
  {
    num: "02",
    title: "Logo System & Geometry",
    desc: "Primary mark, secondary lockup, construction grid, clearspace margins, and sizing.",
  },
  {
    num: "03",
    title: "Color Palette & Harmony",
    desc: "Primary, secondary, and accent swatches with tonal colorimetry and accessibility standards.",
  },
  {
    num: "04",
    title: "Typography Hierarchy",
    desc: "Modular scale display headings, secondary body systems, character sets, and typesetting rules.",
  },
  {
    num: "05",
    title: "Imagery & Art Direction",
    desc: "Photography art direction, ambient lighting, compositional balance, and asset attribution.",
  },
]

interface PageTableOfContentsProps {
  brandName: string
  styleTheme: PreviewStyleId
  displayFont: string
  bodyFont: string
  monoFont: string
  totalPages?: number
  websiteUrl?: string
  sections?: TableOfContentItem[]
}

export function PageTableOfContents({
  brandName,
  styleTheme,
  displayFont,
  bodyFont,
  monoFont,
  totalPages = 8,
  websiteUrl = "www.brand10.vercel.app",
  sections = DEFAULT_SECTIONS,
}: PageTableOfContentsProps) {
  const theme = getPdfTheme(styleTheme)
  const isExpressive = theme.isExpressive
  const isSoftTactility = theme.isSoftTactility
  const isEditorial = theme.isEditorial

  return (
    <A4PageFrame
      id="page-02"
      pageNumber={2}
      totalPages={totalPages}
      sectionTitle="Table of Contents"
      brandName={brandName}
      styleTheme={styleTheme}
      displayFont={displayFont}
      bodyFont={bodyFont}
      monoFont={monoFont}
      websiteUrl={websiteUrl}
      className={theme.pageFrame}
    >
      <div className="flex h-full flex-col justify-between py-6">
        {/* Page Title */}
        <div className="space-y-2">
          <h2 className={theme.title}>CONTENTS</h2>
          <div className={theme.accentBar} />
        </div>

        {/* Contents List */}
        <div
          className={
            isExpressive
              ? "my-auto space-y-4 py-4"
              : isSoftTactility
                ? "my-auto space-y-4 py-4"
                : isEditorial
                  ? "my-auto space-y-5 py-4"
                  : "my-auto space-y-7 py-6"
          }
        >
          {sections.map((item) => (
            <div
              key={item.num}
              className={
                isExpressive
                  ? "group flex items-start gap-4 rounded-xl border-2 border-black bg-white p-3.5 shadow-[3px_3px_0px_0px_#000]"
                  : isSoftTactility
                    ? "group flex items-start gap-4 rounded-2xl border border-stone-200/70 bg-white/80 p-3.5 shadow-[4px_4px_12px_rgba(0,0,0,0.04),-3px_-3px_8px_rgba(255,255,255,0.9)]"
                    : isEditorial
                      ? "group flex items-start gap-6 border-b border-stone-300 pb-3 pt-1"
                      : "group flex items-start gap-6"
              }
            >
              {/* Number Index */}
              {isExpressive ? (
                <Badge className="flex size-9 shrink-0 items-center justify-center rounded-lg border-2 border-black bg-amber-300 p-0 font-mono text-base font-black text-black shadow-[2px_2px_0px_0px_#000]">
                  {item.num}
                </Badge>
              ) : isSoftTactility ? (
                <Badge className="flex size-9 shrink-0 items-center justify-center rounded-full border border-stone-200/80 bg-stone-100 p-0 font-mono text-sm font-semibold text-stone-800 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.06),inset_-1px_-1px_2px_rgba(255,255,255,0.9)]">
                  {item.num}
                </Badge>
              ) : isEditorial ? (
                <div className="w-8 shrink-0 font-mono text-sm uppercase tracking-widest text-stone-500 pt-0.5">
                  {item.num}
                </div>
              ) : (
                <div className="w-12 shrink-0 pt-0.5 text-2xl font-bold text-primary-900 transition-colors group-hover:text-primary-950">
                  {item.num}
                </div>
              )}

              {/* Title & Description */}
              <div className="space-y-1">
                <h5
                  className={
                    isExpressive
                      ? "font-black uppercase tracking-tight text-black"
                      : isSoftTactility
                        ? "font-semibold text-stone-900 tracking-tight"
                        : isEditorial
                          ? "font-semibold text-stone-950 tracking-tight"
                          : "text-primary-900"
                  }
                >
                  {item.title}
                </h5>
                <p
                  className={
                    isExpressive
                      ? "max-w-lg text-xs font-medium text-zinc-700"
                      : isSoftTactility
                        ? "max-w-lg text-xs text-stone-600 font-normal leading-relaxed"
                        : isEditorial
                          ? "max-w-lg text-xs text-stone-600 font-normal leading-relaxed"
                          : "max-w-lg text-zinc-600"
                  }
                >
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Subtitle / Info */}
        <div
          className={
            isExpressive
              ? "pt-4 font-mono text-xs font-black uppercase text-black"
              : isSoftTactility
                ? "pt-4 text-xs font-medium text-stone-500"
                : isEditorial
                  ? "pt-4 font-mono text-[10px] uppercase tracking-widest text-stone-500"
                  : "pt-4 text-xs text-zinc-500"
          }
        >
          Brand Architecture &amp; Visual Guidelines Manual
        </div>
      </div>
    </A4PageFrame>
  )
}
