import { Badge } from "@/components/ui/badge"
import type { PreviewStyleId } from "./A4PageFrame"
import { A4PageFrame } from "./A4PageFrame"
import { getPdfTheme } from "./pdfPageTheme"
import type { ColorSwatch } from "@/lib/colorUtils"

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
  colors?: ColorSwatch[]
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
  colors,
}: PageTypographyBodyProps) {
  const theme = getPdfTheme(styleTheme)
  const isExpressive = theme.isExpressive
  const isSoftTactility = theme.isSoftTactility
  const isEditorial = theme.isEditorial

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
      className={theme.pageFrame}
      colors={colors}
    >
      <div className="flex h-full flex-col justify-between py-6">
        {/* Title & Introduction */}
        <div className="space-y-3 pt-2">
          <div className="space-y-2">
            <h2 className={theme.title}>BODY &amp; INTERFACE</h2>
            <div className={theme.accentBar} />
          </div>

          <p className={theme.introText}>
            The secondary and body type system governs reading stamina, user
            interface density, and long-form comprehension. Calibrated to ensure
            clarity across interfaces, editorial publications, and printed
            touchpoints.
          </p>
        </div>

        {/* Main Content Area */}
        <div className="my-auto space-y-5 py-2">
          {/* Primary Body Typeface Header Row */}
          <div
            className={
              isExpressive
                ? "flex items-baseline justify-between rounded-xl border-2 border-black bg-white p-4 shadow-[4px_4px_0px_0px_#000]"
                : isSoftTactility
                  ? "flex items-baseline justify-between rounded-3xl border border-stone-200/70 bg-white/90 p-5 shadow-[6px_6px_16px_rgba(0,0,0,0.05),-4px_-4px_12px_rgba(255,255,255,0.9)]"
                  : isEditorial
                    ? "flex items-baseline justify-between rounded-none border-t border-b border-stone-300 bg-transparent p-4"
                    : "flex items-baseline justify-between border-b border-zinc-200 pb-3"
            }
          >
            <div className="space-y-0.5">
              <span
                className={
                  isExpressive
                    ? "font-mono text-[10px] font-black uppercase text-zinc-500"
                    : isSoftTactility
                      ? "text-[10px] font-semibold tracking-wider text-stone-500 uppercase"
                      : isEditorial
                        ? "font-mono text-[10px] uppercase tracking-widest text-stone-500"
                        : "text-[10px] font-semibold tracking-wider text-zinc-400 uppercase"
                }
              >
                Primary Body Typeface
              </span>
              <div
                className={
                  isExpressive
                    ? "text-3xl font-black uppercase text-black"
                    : isSoftTactility
                      ? "text-3xl font-semibold text-stone-900"
                      : isEditorial
                        ? "text-3xl font-bold text-stone-950"
                        : "text-3xl font-bold text-primary-900"
                }
                style={{ fontFamily: `"${bodyFamily}", sans-serif` }}
              >
                {bodyFamily}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <span
                  className={
                    isExpressive
                      ? "block font-mono text-[10px] font-black uppercase text-zinc-500"
                      : isSoftTactility
                        ? "block text-[10px] text-stone-500 uppercase"
                        : isEditorial
                          ? "block font-mono text-[10px] uppercase tracking-widest text-stone-500"
                          : "block text-[10px] text-zinc-400 uppercase"
                  }
                >
                  Default Base &amp; Leading
                </span>
                <span
                  className={
                    isExpressive
                      ? "font-mono text-xs font-bold text-black"
                      : isSoftTactility
                        ? "text-xs font-semibold text-stone-800"
                        : isEditorial
                          ? "font-mono text-xs text-stone-700"
                          : "text-xs font-bold text-zinc-800"
                  }
                >
                  {baseFontSize}px / 1.60 Leading
                </span>
              </div>
              {isExpressive ? (
                <Badge className={theme.badgeAmber}>
                  Secondary / Reading Voice
                </Badge>
              ) : isSoftTactility ? (
                <Badge className={theme.badgePrimary}>
                  Secondary / Reading Voice
                </Badge>
              ) : isEditorial ? (
                <Badge className={theme.badgeAmber}>
                  Secondary / Reading Voice
                </Badge>
              ) : (
                <Badge className={theme.badgeOutline}>
                  Secondary / Reading Voice
                </Badge>
              )}
            </div>
          </div>

          {/* Weight Spectrum */}
          <div className="space-y-2">
            <div
              className={
                isExpressive
                  ? "flex items-center justify-between border-b-2 border-black pb-1.5 font-mono text-[10px] font-black uppercase text-black"
                  : isSoftTactility
                    ? "flex items-center justify-between border-b border-stone-200 pb-1.5 text-[10px] font-semibold text-stone-600 uppercase tracking-wider"
                    : isEditorial
                      ? "flex items-center justify-between border-b border-stone-400 pb-1.5 font-mono text-[10px] uppercase tracking-widest text-stone-600"
                      : "flex items-center justify-between border-b border-zinc-200 pb-1.5 text-[10px] text-zinc-400 uppercase"
              }
            >
              <span>Weight Spectrum</span>
              <span>Application &amp; Optical Function</span>
            </div>

            <div className="grid grid-cols-2 gap-x-6 gap-y-3 pt-1">
              {/* Regular 400 */}
              <div
                className={
                  isExpressive
                    ? "space-y-1 rounded-xl border-2 border-black bg-white p-3 shadow-[3px_3px_0px_0px_#000]"
                    : isSoftTactility
                      ? "space-y-1 rounded-2xl border border-stone-200/60 bg-white/90 p-3 shadow-[3px_3px_8px_rgba(0,0,0,0.03)]"
                      : isEditorial
                        ? "space-y-1 border-l-2 border-stone-900 bg-transparent py-1.5 pl-3 pr-1"
                        : "space-y-1 border-b border-zinc-100 pb-2.5"
                }
              >
                <div className="flex items-center justify-between text-[10px]">
                  {isExpressive ? (
                    <Badge className={theme.badgeLime}>Regular 400</Badge>
                  ) : isSoftTactility ? (
                    <Badge className="rounded-full border border-stone-200 bg-stone-100 px-2 py-0.5 text-[9px] font-mono font-semibold text-stone-700">
                      Regular 400
                    </Badge>
                  ) : isEditorial ? (
                    <Badge className="rounded-none border border-stone-400 bg-transparent px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-stone-700">
                      Regular 400
                    </Badge>
                  ) : (
                    <span className="font-semibold text-zinc-500 uppercase">
                      Regular 400
                    </span>
                  )}
                  <span
                    className={
                      isExpressive
                        ? "font-mono font-bold text-black"
                        : isSoftTactility
                          ? "text-stone-500 text-[10px]"
                          : isEditorial
                            ? "font-mono text-[10px] text-stone-500"
                            : "text-zinc-400"
                    }
                  >
                    Continuous Prose
                  </span>
                </div>
                <div
                  className={
                    isExpressive
                      ? "text-base font-normal text-black"
                      : isSoftTactility
                        ? "text-base font-normal text-stone-900"
                        : isEditorial
                          ? "text-base font-normal text-stone-950"
                          : "text-base font-normal text-primary-900"
                  }
                  style={{ fontFamily: `"${bodyFamily}", sans-serif` }}
                >
                  Clear long-form readability and balanced optical texture.
                </div>
                <div
                  className={
                    isExpressive
                      ? "text-[10px] font-medium text-zinc-700"
                      : isSoftTactility
                        ? "text-[10px] text-stone-600 font-normal leading-relaxed"
                        : isEditorial
                          ? "text-[10px] text-stone-600 leading-relaxed"
                          : "text-[10px] text-zinc-500"
                  }
                >
                  Editorial articles, narrative descriptions, documentation
                </div>
              </div>

              {/* Medium 500 */}
              <div
                className={
                  isExpressive
                    ? "space-y-1 rounded-xl border-2 border-black bg-white p-3 shadow-[3px_3px_0px_0px_#000]"
                    : isSoftTactility
                      ? "space-y-1 rounded-2xl border border-stone-200/60 bg-white/90 p-3 shadow-[3px_3px_8px_rgba(0,0,0,0.03)]"
                      : isEditorial
                        ? "space-y-1 border-l-2 border-stone-900 bg-transparent py-1.5 pl-3 pr-1"
                        : "space-y-1 border-b border-zinc-100 pb-2.5"
                }
              >
                <div className="flex items-center justify-between text-[10px]">
                  {isExpressive ? (
                    <Badge className={theme.badgeLime}>Medium 500</Badge>
                  ) : isSoftTactility ? (
                    <Badge className="rounded-full border border-stone-200 bg-stone-100 px-2 py-0.5 text-[9px] font-mono font-semibold text-stone-700">
                      Medium 500
                    </Badge>
                  ) : isEditorial ? (
                    <Badge className="rounded-none border border-stone-400 bg-transparent px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-stone-700">
                      Medium 500
                    </Badge>
                  ) : (
                    <span className="font-semibold text-zinc-500 uppercase">
                      Medium 500
                    </span>
                  )}
                  <span
                    className={
                      isExpressive
                        ? "font-mono font-bold text-black"
                        : isSoftTactility
                          ? "text-stone-500 text-[10px]"
                          : isEditorial
                            ? "font-mono text-[10px] text-stone-500"
                            : "text-zinc-400"
                    }
                  >
                    Body Emphasis
                  </span>
                </div>
                <div
                  className={
                    isExpressive
                      ? "text-base font-medium text-black"
                      : isSoftTactility
                        ? "text-base font-medium text-stone-900"
                        : isEditorial
                          ? "text-base font-medium text-stone-950"
                          : "text-base font-medium text-primary-900"
                  }
                  style={{ fontFamily: `"${bodyFamily}", sans-serif` }}
                >
                  Elevated legibility for dense interface environments.
                </div>
                <div
                  className={
                    isExpressive
                      ? "text-[10px] font-medium text-zinc-700"
                      : isSoftTactility
                        ? "text-[10px] text-stone-600 font-normal leading-relaxed"
                        : isEditorial
                          ? "text-[10px] text-stone-600 leading-relaxed"
                          : "text-[10px] text-zinc-500"
                  }
                >
                  Form controls, navigation links, table cells, bullet points
                </div>
              </div>

              {/* SemiBold 600 */}
              <div
                className={
                  isExpressive
                    ? "space-y-1 rounded-xl border-2 border-black bg-white p-3 shadow-[3px_3px_0px_0px_#000]"
                    : isSoftTactility
                      ? "space-y-1 rounded-2xl border border-stone-200/60 bg-white/90 p-3 shadow-[3px_3px_8px_rgba(0,0,0,0.03)]"
                      : isEditorial
                        ? "space-y-1 border-l-2 border-stone-900 bg-transparent py-1.5 pl-3 pr-1"
                        : "space-y-1 border-b border-zinc-100 pb-2.5"
                }
              >
                <div className="flex items-center justify-between text-[10px]">
                  {isExpressive ? (
                    <Badge className={theme.badgeLime}>SemiBold 600</Badge>
                  ) : isSoftTactility ? (
                    <Badge className="rounded-full border border-stone-200 bg-stone-100 px-2 py-0.5 text-[9px] font-mono font-semibold text-stone-700">
                      SemiBold 600
                    </Badge>
                  ) : isEditorial ? (
                    <Badge className="rounded-none border border-stone-400 bg-transparent px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-stone-700">
                      SemiBold 600
                    </Badge>
                  ) : (
                    <span className="font-semibold text-zinc-500 uppercase">
                      SemiBold 600
                    </span>
                  )}
                  <span
                    className={
                      isExpressive
                        ? "font-mono font-bold text-black"
                        : isSoftTactility
                          ? "text-stone-500 text-[10px]"
                          : isEditorial
                            ? "font-mono text-[10px] text-stone-500"
                            : "text-zinc-400"
                    }
                  >
                    Interactive
                  </span>
                </div>
                <div
                  className={
                    isExpressive
                      ? "text-base font-semibold text-black"
                      : isSoftTactility
                        ? "text-base font-semibold text-stone-900"
                        : isEditorial
                          ? "text-base font-semibold text-stone-950"
                          : "text-base font-semibold text-primary-900"
                  }
                  style={{ fontFamily: `"${bodyFamily}", sans-serif` }}
                >
                  Direct typographic emphasis without excessive weight.
                </div>
                <div
                  className={
                    isExpressive
                      ? "text-[10px] font-medium text-zinc-700"
                      : isSoftTactility
                        ? "text-[10px] text-stone-600 font-normal leading-relaxed"
                        : isEditorial
                          ? "text-[10px] text-stone-600 leading-relaxed"
                          : "text-[10px] text-zinc-500"
                  }
                >
                  Button actions, card headings, accordion triggers, badges
                </div>
              </div>

              {/* Bold 700 */}
              <div
                className={
                  isExpressive
                    ? "space-y-1 rounded-xl border-2 border-black bg-white p-3 shadow-[3px_3px_0px_0px_#000]"
                    : isSoftTactility
                      ? "space-y-1 rounded-2xl border border-stone-200/60 bg-white/90 p-3 shadow-[3px_3px_8px_rgba(0,0,0,0.03)]"
                      : isEditorial
                        ? "space-y-1 border-l-2 border-stone-900 bg-transparent py-1.5 pl-3 pr-1"
                        : "space-y-1 border-b border-zinc-100 pb-2.5"
                }
              >
                <div className="flex items-center justify-between text-[10px]">
                  {isExpressive ? (
                    <Badge className={theme.badgeLime}>Bold 700</Badge>
                  ) : isSoftTactility ? (
                    <Badge className="rounded-full border border-stone-200 bg-stone-100 px-2 py-0.5 text-[9px] font-mono font-semibold text-stone-700">
                      Bold 700
                    </Badge>
                  ) : isEditorial ? (
                    <Badge className="rounded-none border border-stone-400 bg-transparent px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-stone-700">
                      Bold 700
                    </Badge>
                  ) : (
                    <span className="font-semibold text-zinc-500 uppercase">
                      Bold 700
                    </span>
                  )}
                  <span
                    className={
                      isExpressive
                        ? "font-mono font-bold text-black"
                        : isSoftTactility
                          ? "text-stone-500 text-[10px]"
                          : isEditorial
                            ? "font-mono text-[10px] text-stone-500"
                            : "text-zinc-400"
                    }
                  >
                    Callouts
                  </span>
                </div>
                <div
                  className={
                    isExpressive
                      ? "text-base font-bold text-black"
                      : isSoftTactility
                        ? "text-base font-semibold text-stone-900"
                        : isEditorial
                          ? "text-base font-bold text-stone-950"
                          : "text-base font-bold text-primary-900"
                  }
                  style={{ fontFamily: `"${bodyFamily}", sans-serif` }}
                >
                  High contrast accents and prominent structural anchors.
                </div>
                <div
                  className={
                    isExpressive
                      ? "text-[10px] font-medium text-zinc-700"
                      : isSoftTactility
                        ? "text-[10px] text-stone-600 font-normal leading-relaxed"
                        : isEditorial
                          ? "text-[10px] text-stone-600 leading-relaxed"
                          : "text-[10px] text-zinc-500"
                  }
                >
                  Key performance metrics, pull quotes, lead callout boxes
                </div>
              </div>
            </div>
          </div>

          {/* Reading Prose Specimen */}
          <div
            className={
              isExpressive
                ? "space-y-2 rounded-xl border-2 border-black bg-white p-4 shadow-[3px_3px_0px_0px_#000]"
                : isSoftTactility
                  ? "space-y-2 rounded-3xl border border-stone-200/70 bg-white/90 p-5 shadow-[4px_4px_12px_rgba(0,0,0,0.04),-3px_-3px_8px_rgba(255,255,255,0.9)]"
                  : isEditorial
                    ? "space-y-2 border-t border-b border-stone-300 py-3 bg-transparent"
                    : "space-y-2 pt-1"
            }
          >
            <div
              className={
                isExpressive
                  ? "flex items-center justify-between border-b-2 border-black pb-1.5 font-mono text-[10px] font-black uppercase text-black"
                  : isSoftTactility
                    ? "flex items-center justify-between border-b border-stone-200 pb-1.5 text-[10px] font-semibold text-stone-600 uppercase tracking-wider"
                    : isEditorial
                      ? "flex items-center justify-between border-b border-stone-400 pb-1.5 font-mono text-[10px] uppercase tracking-widest text-stone-600"
                      : "flex items-center justify-between border-b border-zinc-200 pb-1.5 text-[10px] text-zinc-400 uppercase"
              }
            >
              <span>Editorial Reading Specimen</span>
              <span>Base: {baseFontSize}px / 1.60 Leading</span>
            </div>

            {/* Subtitle / Lead */}
            <div
              className={
                isExpressive
                  ? "pt-1 text-base font-bold text-black"
                  : isSoftTactility
                    ? "pt-1 text-base font-semibold text-stone-900"
                    : isEditorial
                      ? "pt-1 text-base font-semibold text-stone-950"
                      : "pt-1 text-base font-semibold text-zinc-900"
              }
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
              className={
                isExpressive
                  ? "text-xs font-medium text-zinc-800"
                  : isSoftTactility
                    ? "text-xs text-stone-600 font-normal leading-relaxed"
                    : isEditorial
                      ? "text-xs text-stone-700 leading-relaxed"
                      : "text-xs text-zinc-700"
              }
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
              className={
                isExpressive
                  ? "pt-0.5 text-[11px] font-medium text-zinc-600"
                  : isSoftTactility
                    ? "pt-0.5 text-[11px] text-stone-500"
                    : isEditorial
                      ? "pt-0.5 text-[11px] text-stone-600"
                      : "pt-0.5 text-[11px] text-zinc-500"
              }
              style={{
                fontFamily: `"${bodyFamily}", sans-serif`,
                lineHeight: 1.5,
              }}
            >
              Caption 01: Metadata annotations, table captions, and tertiary
              interface labels requiring crisp legibility at reduced scale.
            </div>
          </div>

          {/* Complete Glyph Set in Body Font */}
          <div
            className={
              isExpressive
                ? "space-y-1.5 rounded-xl border-2 border-black bg-white p-3.5 shadow-[3px_3px_0px_0px_#000]"
                : isSoftTactility
                  ? "space-y-1.5 rounded-2xl border border-stone-200/60 bg-white/80 p-3.5 shadow-[3px_3px_8px_rgba(0,0,0,0.03)]"
                  : isEditorial
                    ? "space-y-1.5 border-t border-stone-300 pt-2 bg-transparent"
                    : "space-y-1.5 pt-1"
            }
          >
            <div
              className={
                isExpressive
                  ? "flex items-center justify-between border-b-2 border-black pb-1 font-mono text-[10px] font-black uppercase text-black"
                  : isSoftTactility
                    ? "flex items-center justify-between border-b border-stone-200 pb-1 text-[10px] font-semibold text-stone-600 uppercase tracking-wider"
                    : isEditorial
                      ? "flex items-center justify-between border-b border-stone-400 pb-1 font-mono text-[10px] uppercase tracking-widest text-stone-600"
                      : "flex items-center justify-between border-b border-zinc-200 pb-1 text-[10px] text-zinc-400 uppercase"
              }
            >
              <span>Character &amp; Symbol Specimen ({bodyFamily})</span>
              <span>UTF-8 Standard</span>
            </div>
            <div
              className={
                isExpressive
                  ? "pt-1 text-[11px] tracking-wider text-black"
                  : isSoftTactility
                    ? "pt-1 text-[11px] tracking-wider text-stone-900"
                    : isEditorial
                      ? "pt-1 text-[11px] tracking-wider text-stone-950"
                      : "pt-1 text-[11px] tracking-wider text-zinc-800"
              }
              style={{ fontFamily: `"${bodyFamily}", sans-serif` }}
            >
              <div className="font-semibold tracking-widest">
                A B C D E F G H I J K L M N O P Q R S T U V W X Y Z
              </div>
              <div className="pt-0.5 font-normal tracking-widest">
                a b c d e f g h i j k l m n o p q r s t u v w x y z
              </div>
              <div
                className={
                  isExpressive
                    ? "pt-0.5 text-[10px] tracking-wider text-zinc-600"
                    : isSoftTactility
                      ? "pt-0.5 text-[10px] tracking-wider text-stone-500"
                      : isEditorial
                        ? "pt-0.5 font-mono text-[10px] tracking-wider text-stone-500"
                        : "pt-0.5 text-[10px] tracking-wider text-zinc-500"
                }
              >
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
