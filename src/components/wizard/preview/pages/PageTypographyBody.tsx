import { Badge } from "@/components/ui/badge"
import type { PreviewStyleId } from "./A4PageFrame"
import { A4PageFrame } from "./A4PageFrame"

interface PageTypographyBodyProps {
  brandName: string
  displayFont: string
  bodyFont: string
  monoFont: string
  typeScaleRatio: number
  baseFontSize?: number
  styleTheme: PreviewStyleId
  pageNumber?: number
  totalPages?: number
}

export function PageTypographyBody({
  brandName,
  displayFont,
  bodyFont,
  monoFont,
  typeScaleRatio: _typeScaleRatio,
  baseFontSize = 16,
  styleTheme,
  pageNumber = 9,
  totalPages = 10,
}: PageTypographyBodyProps) {
  const displayFamily = displayFont || "Plus Jakarta Sans"
  const bodyFamily = bodyFont || "Inter"

  return (
    <A4PageFrame
      id="page-typography-body"
      pageNumber={pageNumber}
      totalPages={totalPages}
      sectionNumber="04"
      sectionTitle="Typography Hierarchy"
      brandName={brandName}
      styleTheme={styleTheme}
      displayFont={displayFamily}
      bodyFont={bodyFamily}
      monoFont={monoFont}
      className="overflow-hidden border border-zinc-200 bg-white p-12 text-primary-900 shadow-2xl"
    >
      <div className="flex h-full flex-col justify-between py-6">
        {/* Title & Introduction */}
        <div className="space-y-3 pt-2">
          <div className="space-y-2">
            <h2 className="text-primary-900 uppercase">BODY &amp; INTERFACE</h2>
            <div className="h-0.5 w-16 bg-zinc-500" />
          </div>

          <p className="max-w-xl text-zinc-600">
            Body typography and functional interface copy are calibrated for
            effortless reading endurance, optimal line length, and technical
            clarity across interfaces, editorial publications, and printed
            touchpoints.
          </p>
        </div>

        {/* Main Content Area - Clean Swiss Typographic Layout without card boxes */}
        <div className="my-auto space-y-5 py-2">
          {/* Primary Body Typeface Header Row */}
          <div className="flex items-baseline justify-between border-b border-zinc-200 pb-3">
            <div className="space-y-0.5">
              <span className="text-[10px] font-semibold tracking-wider text-zinc-400 uppercase">
                Primary Body Typeface
              </span>
              <div
                className="text-3xl font-bold text-primary-900"
                style={{ fontFamily: `"${bodyFamily}", sans-serif` }}
              >
                {bodyFamily}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <span className="block text-[10px] text-zinc-400 uppercase">
                  Default Base &amp; Leading
                </span>
                <span className="text-xs font-bold text-zinc-800">
                  {baseFontSize}px / 1.60 Leading
                </span>
              </div>
              <Badge variant="outline" className="text-xs">
                Secondary / Reading Voice
              </Badge>
            </div>
          </div>

          {/* Weight Spectrum - Clean Flat Grid with Dividing Rules */}
          <div className="space-y-2">
            <div className="flex items-center justify-between border-b border-zinc-200 pb-1.5 text-[10px] text-zinc-400 uppercase">
              <span>Weight Spectrum</span>
              <span>Application &amp; Optical Function</span>
            </div>

            <div className="grid grid-cols-2 gap-x-8 gap-y-3 pt-1">
              {/* Regular 400 */}
              <div className="space-y-1 border-b border-zinc-100 pb-2.5">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="font-semibold text-zinc-500 uppercase">
                    Regular 400
                  </span>
                  <span className="text-zinc-400">Continuous Prose</span>
                </div>
                <div
                  className="text-base font-normal text-primary-900"
                  style={{ fontFamily: `"${bodyFamily}", sans-serif` }}
                >
                  Clear long-form readability and balanced optical texture.
                </div>
                <div className="text-[10px] text-zinc-500">
                  Editorial articles, narrative descriptions, documentation
                </div>
              </div>

              {/* Medium 500 */}
              <div className="space-y-1 border-b border-zinc-100 pb-2.5">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="font-semibold text-zinc-500 uppercase">
                    Medium 500
                  </span>
                  <span className="text-zinc-400">UI &amp; Lists</span>
                </div>
                <div
                  className="text-base font-medium text-primary-900"
                  style={{ fontFamily: `"${bodyFamily}", sans-serif` }}
                >
                  Elevated legibility for dense interface environments.
                </div>
                <div className="text-[10px] text-zinc-500">
                  Form controls, navigation links, table cells, bullet points
                </div>
              </div>

              {/* SemiBold 600 */}
              <div className="space-y-1 border-b border-zinc-100 pb-2.5">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="font-semibold text-zinc-500 uppercase">
                    SemiBold 600
                  </span>
                  <span className="text-zinc-400">Interactive</span>
                </div>
                <div
                  className="text-base font-semibold text-primary-900"
                  style={{ fontFamily: `"${bodyFamily}", sans-serif` }}
                >
                  Direct typographic emphasis without excessive weight.
                </div>
                <div className="text-[10px] text-zinc-500">
                  Button actions, card headings, accordion triggers, badges
                </div>
              </div>

              {/* Bold 700 */}
              <div className="space-y-1 border-b border-zinc-100 pb-2.5">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="font-semibold text-zinc-500 uppercase">
                    Bold 700
                  </span>
                  <span className="text-zinc-400">Callouts</span>
                </div>
                <div
                  className="text-base font-bold text-primary-900"
                  style={{ fontFamily: `"${bodyFamily}", sans-serif` }}
                >
                  High contrast accents and prominent structural anchors.
                </div>
                <div className="text-[10px] text-zinc-500">
                  Key performance metrics, pull quotes, lead callout boxes
                </div>
              </div>
            </div>
          </div>

          {/* Reading Prose Specimen - Clean Editorial Block */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between border-b border-zinc-200 pb-1.5 text-[10px] text-zinc-400 uppercase">
              <span>Editorial Reading Specimen</span>
              <span>Base: {baseFontSize}px / 1.60 Leading</span>
            </div>

            {/* Subtitle / Lead */}
            <div
              className="pt-1 text-base font-semibold text-zinc-900"
              style={{
                fontFamily: `"${bodyFamily}", sans-serif`,
                lineHeight: 1.45,
              }}
            >
              Design systems exist to unlock team velocity while safeguarding
              visual craft, institutional consistency, and human empathy.
            </div>

            {/* Paragraph Body */}
            <div
              className="text-xs text-zinc-700"
              style={{
                fontFamily: `"${bodyFamily}", sans-serif`,
                lineHeight: 1.65,
              }}
            >
              A coherent typography system bridges the divide between brand
              expression and everyday product execution. By formalizing
              typographic rhythm, optical measure, and intentional contrast,
              teams maintain brand integrity across digital interfaces and
              physical touchpoints without compounding design debt.
            </div>

            {/* Caption / Metadata */}
            <div
              className="pt-0.5 text-[11px] text-zinc-500"
              style={{
                fontFamily: `"${bodyFamily}", sans-serif`,
                lineHeight: 1.5,
              }}
            >
              Caption 01: Metadata annotations, table captions, and tertiary
              interface labels requiring crisp legibility at reduced scale.
            </div>
          </div>

          {/* Complete Glyph Set in Body Font - Clean Flat Section */}
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between border-b border-zinc-200 pb-1 text-[10px] text-zinc-400 uppercase">
              <span>Character &amp; Symbol Specimen ({bodyFamily})</span>
              <span>UTF-8 Standard</span>
            </div>
            <div
              className="pt-1 text-[11px] tracking-wider text-zinc-800"
              style={{ fontFamily: `"${bodyFamily}", sans-serif` }}
            >
              <div className="font-semibold tracking-widest">
                A B C D E F G H I J K L M N O P Q R S T U V W X Y Z
              </div>
              <div className="pt-0.5 font-normal tracking-widest">
                a b c d e f g h i j k l m n o p q r s t u v w x y z
              </div>
              <div className="pt-0.5 text-[10px] tracking-wider text-zinc-500">
                0 1 2 3 4 5 6 7 8 9 &amp; @ # $ % ! ? / ( ) [ ] &#123; &#125; ,
                . ; : &quot; &apos; - + =
              </div>
            </div>
          </div>
        </div>
      </div>
    </A4PageFrame>
  )
}
