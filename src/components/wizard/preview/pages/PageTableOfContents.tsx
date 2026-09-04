import type { PreviewStyleId } from "./A4PageFrame"
import { A4PageFrame } from "./A4PageFrame"

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
      className="overflow-hidden border border-zinc-200 bg-white p-12 text-black shadow-2xl"
    >
      <div className="flex h-full flex-col justify-between py-6">
        {/* Page Title */}
        <div className="space-y-2 pt-2">
          <h2 className="text-4xl font-extrabold text-black uppercase sm:text-5xl">
            CONTENTS
          </h2>
          <div className="h-0.5 w-16 bg-black" />
        </div>

        {/* Contents List */}
        <div className="my-auto space-y-7 py-6">
          {sections.map((item) => (
            <div key={item.num} className="group flex items-start gap-6">
              {/* Number Index */}
              <div className="w-12 shrink-0 pt-0.5 text-2xl font-bold text-black transition-colors group-hover:text-zinc-600">
                {item.num}
              </div>

              {/* Title & Description */}
              <div className="space-y-1">
                <div className="text-lg font-bold tracking-tight text-black sm:text-xl">
                  {item.title}
                </div>
                <p className="max-w-lg text-xs text-zinc-600">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Subtitle / Info */}
        <div className="pt-4 text-xs text-zinc-500">
          Brand Architecture & Visual Guidelines Manual
        </div>
      </div>
    </A4PageFrame>
  )
}
