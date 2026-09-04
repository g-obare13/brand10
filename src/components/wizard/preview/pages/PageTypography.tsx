import { Badge } from "@/components/ui/badge"
import { A4PageFrame  } from "./A4PageFrame"
import type {PreviewStyleId} from "./A4PageFrame";
import { cn } from "@/lib/utils"

interface PageTypographyProps {
  brandName: string
  displayFont: string
  bodyFont: string
  monoFont: string
  typeScaleRatio: number
  baseFontSize: number
  styleTheme: PreviewStyleId
}

export function PageTypography({
  brandName,
  displayFont,
  bodyFont,
  monoFont,
  typeScaleRatio,
  baseFontSize = 16,
  styleTheme,
}: PageTypographyProps) {
  const displayFamily = displayFont || "Inter"
  const bodyFamily = bodyFont || "Inter"
  const monoFamily = monoFont || "JetBrains Mono"

  return (
    <A4PageFrame
      id="page-04"
      pageNumber={4}
      totalPages={6}
      sectionNumber="04"
      sectionTitle="Typography & Scale Hierarchy"
      brandName={brandName}
      styleTheme={styleTheme}
      displayFont={displayFamily}
      bodyFont={bodyFamily}
      monoFont={monoFamily}
    >
      <div className="flex h-full flex-col justify-between space-y-6">
        {/* Intro */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-[10px] font-mono uppercase">
              Type System
            </Badge>
            <Badge variant="default" className="text-[10px]">
              Ratio: {typeScaleRatio || 1.25} Modular Scale
            </Badge>
          </div>
          <h2>Typographic Architecture</h2>
          <p className="text-xs opacity-75">
            A cohesive typographic hierarchy balancing display distinction with body readability and clean code notation.
          </p>
        </div>

        {/* Primary Type Families Overview Cards */}
        <div className="grid grid-cols-3 gap-4">
          <div
            className={cn(
              "rounded-2xl border p-4 space-y-2",
              styleTheme === "cinematic"
                ? "border-zinc-800 bg-zinc-900/60"
                : "border-zinc-200 bg-white"
            )}
          >
            <span className="font-mono text-[10px] uppercase tracking-wider opacity-60">
              01 Display Voice
            </span>
            <div style={{ fontFamily: `"${displayFamily}", sans-serif` }}>
              <div className="text-2xl font-bold tracking-tight">{displayFamily}</div>
            </div>
            <p className="text-[11px] opacity-70">
              Headings, banners, and hero statements.
            </p>
          </div>

          <div
            className={cn(
              "rounded-2xl border p-4 space-y-2",
              styleTheme === "cinematic"
                ? "border-zinc-800 bg-zinc-900/60"
                : "border-zinc-200 bg-white"
            )}
          >
            <span className="font-mono text-[10px] uppercase tracking-wider opacity-60">
              02 Body Interface
            </span>
            <div style={{ fontFamily: `"${bodyFamily}", sans-serif` }}>
              <div className="text-2xl font-semibold tracking-tight">{bodyFamily}</div>
            </div>
            <p className="text-[11px] opacity-70">
              Paragraphs, UI labels, and long-form prose.
            </p>
          </div>

          <div
            className={cn(
              "rounded-2xl border p-4 space-y-2",
              styleTheme === "cinematic"
                ? "border-zinc-800 bg-zinc-900/60"
                : "border-zinc-200 bg-white"
            )}
          >
            <span className="font-mono text-[10px] uppercase tracking-wider opacity-60">
              03 Technical Mono
            </span>
            <div style={{ fontFamily: `"${monoFamily}", monospace` }}>
              <div className="text-2xl font-mono tracking-tight">{monoFamily}</div>
            </div>
            <p className="text-[11px] opacity-70">
              Code blocks, metrics, and data coordinates.
            </p>
          </div>
        </div>

        {/* Typographic Scale Specimens */}
        <div
          className={cn(
            "rounded-2xl border p-5 space-y-3",
            styleTheme === "cinematic"
              ? "border-zinc-800 bg-zinc-900/40"
              : "border-zinc-200 bg-zinc-50/70"
          )}
        >
          <div className="flex items-center justify-between border-b pb-2 text-[10px] font-mono opacity-60">
            <span>SPECIMEN HIERARCHY</span>
            <span>BASE SIZE: {baseFontSize}px • SCALE: {typeScaleRatio}</span>
          </div>

          <div className="space-y-3">
            {/* Display XL */}
            <div className="flex items-baseline justify-between border-b border-black/5 pb-2">
              <span className="w-20 font-mono text-[10px] opacity-50">Display XL</span>
              <div
                className="flex-1 truncate text-3xl font-extrabold tracking-tight"
                style={{ fontFamily: `"${displayFamily}", sans-serif` }}
              >
                Forward Thinking System
              </div>
              <span className="font-mono text-[10px] opacity-40">48px / 1.1</span>
            </div>

            {/* Heading 1 */}
            <div className="flex items-baseline justify-between border-b border-black/5 pb-2">
              <span className="w-20 font-mono text-[10px] opacity-50">Heading 1</span>
              <div
                className="flex-1 truncate text-2xl font-bold tracking-tight"
                style={{ fontFamily: `"${displayFamily}", sans-serif` }}
              >
                Coherent Visual Clarity
              </div>
              <span className="font-mono text-[10px] opacity-40">36px / 1.2</span>
            </div>

            {/* Heading 2 */}
            <div className="flex items-baseline justify-between border-b border-black/5 pb-2">
              <span className="w-20 font-mono text-[10px] opacity-50">Heading 2</span>
              <div
                className="flex-1 truncate text-lg font-semibold tracking-tight"
                style={{ fontFamily: `"${displayFamily}", sans-serif` }}
              >
                Structured Foundations for Scale
              </div>
              <span className="font-mono text-[10px] opacity-40">24px / 1.3</span>
            </div>

            {/* Body */}
            <div className="flex items-baseline justify-between border-b border-black/5 pb-2">
              <span className="w-20 font-mono text-[10px] opacity-50">Body Regular</span>
              <div
                className="flex-1 text-xs opacity-80"
                style={{ fontFamily: `"${bodyFamily}", sans-serif` }}
              >
                Design systems exist to unlock velocity while safeguarding craft and user empathy.
              </div>
              <span className="font-mono text-[10px] opacity-40">16px / 1.6</span>
            </div>

            {/* Monospace Code */}
            <div className="flex items-baseline justify-between">
              <span className="w-20 font-mono text-[10px] opacity-50">Mono Code</span>
              <div
                className="flex-1 font-mono text-xs opacity-75"
                style={{ fontFamily: `"${monoFamily}", monospace` }}
              >
                const tokens = {"{"} font: &quot;{displayFamily}&quot;, ratio: {typeScaleRatio} {"}"}
              </div>
              <span className="font-mono text-[10px] opacity-40">13px / 1.5</span>
            </div>
          </div>
        </div>

        {/* Character Set Specimen */}
        <div
          className={cn(
            "rounded-2xl border p-4 space-y-1.5",
            styleTheme === "cinematic"
              ? "border-zinc-800 bg-zinc-900/60"
              : "border-zinc-200 bg-white"
          )}
        >
          <span className="font-mono text-[10px] font-semibold uppercase tracking-wider opacity-60">
            Glyph Range Specimen ({displayFamily})
          </span>
          <div
            className="tracking-wider text-xs leading-relaxed opacity-70"
            style={{ fontFamily: `"${displayFamily}", sans-serif` }}
          >
            A B C D E F G H I J K L M N O P Q R S T U V W X Y Z<br />
            a b c d e f g h i j k l m n o p q r s t u v w x y z<br />
            0 1 2 3 4 5 6 7 8 9 &amp; @ # $ % ! ? / ( ) [ ]
          </div>
        </div>
      </div>
    </A4PageFrame>
  )
}
