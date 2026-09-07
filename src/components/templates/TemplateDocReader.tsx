/**
 * @file TemplateDocReader.tsx
 * @description Editorial article reader component modeled after high-quality publication layouts.
 * Presents authentic Apple Style Guide documentation as a structured, comfortable reading experience
 * with clean typography, numbered chapters, callouts, tables, and a sticky sidebar table of contents.
 */

import { useState, useEffect } from "react"
import { Link } from "@tanstack/react-router"
import { toast } from "sonner"
import {
  IconArrowLeft,
  IconCheck,
  IconX,
  IconMoodSad,
  IconMoodEmpty,
  IconMoodSmile,
  IconChevronRight,
  IconBook,
} from "@tabler/icons-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { AppleStyleGuideDocument } from "@/data/templates"

interface TemplateDocReaderProps {
  document: AppleStyleGuideDocument
  backTo?: string
}

/**
 * Editorial article reader displaying official brand and style guides.
 *
 * @component
 * @param {TemplateDocReaderProps} props - Component properties.
 * @returns {React.ReactElement} The rendered article reader.
 */
export function TemplateDocReader({
  document: doc,
  backTo = "/systems",
}: TemplateDocReaderProps) {
  const [activeSectionId, setActiveSectionId] = useState<string>(
    doc.sections[0]?.id || "about-this-guide"
  )
  const [feedbackState, setFeedbackState] = useState<"idle" | "submitted">("idle")
  const [selectedReaction, setSelectedReaction] = useState<
    "sad" | "neutral" | "smile" | null
  >(null)

  // Scrollspy to dynamically update active table of contents item while scrolling
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 160

      for (let i = doc.sections.length - 1; i >= 0; i--) {
        const section = doc.sections[i]
        const element = window.document.getElementById(section.id)
        if (element && element.offsetTop <= scrollPosition) {
          setActiveSectionId(section.id)
          break
        }
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [doc.sections])

  const scrollToSection = (id: string) => {
    const element = window.document.getElementById(id)
    if (element) {
      const yOffset = -80
      const y =
        element.getBoundingClientRect().top + window.pageYOffset + yOffset
      window.scrollTo({ top: y, behavior: "smooth" })
      setActiveSectionId(id)
    }
  }

  const handleFeedback = (type: "sad" | "neutral" | "smile") => {
    setSelectedReaction(type)
    setFeedbackState("submitted")
    toast.success("Thank you for your feedback!")
  }

  const currentSectionIndex = doc.sections.findIndex(
    (s) => s.id === activeSectionId
  )
  const nextSection =
    currentSectionIndex >= 0 && currentSectionIndex < doc.sections.length - 1
      ? doc.sections[currentSectionIndex + 1]
      : null

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 lg:py-12 font-sf-pro">
      {/* Top Header & Breadcrumb */}
      <div className="mb-8 flex items-center justify-between">
        <Link
          to={backTo}
          className="group inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <IconArrowLeft
            size={16}
            className="transition-transform group-hover:-translate-x-0.5"
          />
          <span>Back to Guidelines</span>
        </Link>
        <div className="flex items-center gap-2">
          <Badge variant="outline">{doc.edition}</Badge>
          <Badge variant="secondary">{doc.category}</Badge>
        </div>
      </div>

      {/* 2-Column Article Layout */}
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-14">
        {/* Main Article Column (Left 72%) */}
        <article className="lg:col-span-8 xl:col-span-9 space-y-10">
          {/* Article Header */}
          <header className="space-y-6">
            <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
              {doc.title}
            </h1>

            {/* Author / Metadata Row */}
            <div className="flex items-center gap-3.5 border-b border-border/50 pb-6">
              <div className="size-11 shrink-0 rounded-full bg-foreground text-background flex items-center justify-center p-2.5 shadow-sm">
                <svg
                  viewBox="0 0 170 170"
                  fill="currentColor"
                  className="size-5"
                  aria-label="Apple Insignia"
                >
                  <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.08-7.71-7.94-12.04-14.59-6.08-9.42-10.74-20.15-13.98-32.2-3.24-12.04-4.86-23.23-4.86-33.56 0-14.53 3.69-26.47 11.08-35.83 7.38-9.36 16.7-14.15 27.95-14.37 4.58 0 9.87 1.25 15.89 3.75 6.02 2.5 9.77 3.75 11.26 3.75 1.13 0 4.96-1.28 11.49-3.85 6.53-2.57 11.95-3.72 16.27-3.45 12.5.87 22.39 5.75 29.68 14.65-10.96 6.64-16.32 15.77-16.08 27.38.27 9.17 3.84 16.89 10.71 23.16 6.87 6.27 15.08 9.8 24.63 10.6-2.18 6.53-4.86 13.08-8.04 19.64zM119.22 31.84c0-7.3 2.65-14.11 7.95-20.43 5.3-6.32 11.9-10.45 19.8-12.41.27 1.09.41 2.05.41 2.88 0 7.34-2.77 14.28-8.31 20.82-5.54 6.54-12.23 10.43-20.08 11.68-.23-.84-.37-1.68-.37-2.54z" />
                </svg>
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-foreground">
                    {doc.author}
                  </span>
                  <span className="text-xs text-muted-foreground">•</span>
                  <span className="text-xs text-muted-foreground">
                    {doc.curator}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>Last updated {doc.lastUpdated}</span>
                  <span>•</span>
                  <span>{doc.readTime}</span>
                </div>
              </div>
            </div>

            {/* Lead Narrative Paragraph */}
            <div className="space-y-3">
              <h2 className="font-heading text-xl sm:text-2xl font-semibold text-foreground">
                {doc.subtitle}
              </h2>
              <p className="text-base sm:text-lg leading-relaxed text-muted-foreground">
                {doc.overview}
              </p>
            </div>
          </header>

          <hr className="border-border/60" />

          {/* Article Chapters / Numbered Sections */}
          <div className="space-y-16">
            {doc.sections.map((section) => (
              <section
                key={section.id}
                id={section.id}
                className="scroll-mt-24 space-y-6"
              >
                {/* Chapter Heading */}
                <div className="border-b border-border/40 pb-3 space-y-1">
                  <h2 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-foreground flex items-baseline gap-2.5">
                    <span className="text-primary font-mono text-xl sm:text-2xl">
                      {section.number}.
                    </span>
                    <span>{section.title}</span>
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {section.lead}
                  </p>
                </div>

                {/* Subsections Content */}
                <div className="space-y-8">
                  {section.subsections.map((sub) => (
                    <div key={sub.id} className="space-y-4">
                      <h3 className="font-heading text-lg sm:text-xl font-semibold text-foreground tracking-tight">
                        {sub.title}
                      </h3>

                      {/* Paragraphs */}
                      {sub.paragraphs.map((p, pIdx) => (
                        <p
                          key={pIdx}
                          className="text-[15px] sm:text-base leading-relaxed text-foreground/85"
                        >
                          {p}
                        </p>
                      ))}

                      {/* Editorial Quote */}
                      {sub.quote && (
                        <blockquote className="border-l-2 border-primary/60 bg-muted/20 pl-4 py-2 my-4 rounded-r-md italic text-foreground/90 text-sm sm:text-base leading-relaxed">
                          {sub.quote}
                        </blockquote>
                      )}

                      {/* Editorial Rules & Examples */}
                      {sub.rules && sub.rules.length > 0 && (
                        <div className="space-y-3 pt-1">
                          {sub.rules.map((rule, rIdx) => (
                            <div
                              key={rIdx}
                              className="rounded-lg border border-border/50 bg-muted/20 p-4 space-y-2.5"
                            >
                              <div>
                                <h4 className="font-heading text-sm font-semibold text-foreground">
                                  {rule.title}
                                </h4>
                                <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                                  {rule.explanation}
                                </p>
                              </div>

                              {rule.examples && rule.examples.length > 0 && (
                                <div className="space-y-2 pt-1">
                                  {rule.examples.map((ex, exIdx) => (
                                    <div
                                      key={exIdx}
                                      className="space-y-1 text-xs font-mono rounded bg-background/60 p-2.5 border border-border/40"
                                    >
                                      {ex.correct && (
                                        <div className="flex items-start gap-2 text-emerald-600 dark:text-emerald-400">
                                          <IconCheck
                                            size={14}
                                            className="shrink-0 mt-0.5"
                                          />
                                          <span>
                                            <strong>Correct:</strong> {ex.correct}
                                          </span>
                                        </div>
                                      )}
                                      {ex.avoid && (
                                        <div className="flex items-start gap-2 text-amber-600 dark:text-amber-400">
                                          <IconChevronRight
                                            size={14}
                                            className="shrink-0 mt-0.5"
                                          />
                                          <span>
                                            <strong>Avoid:</strong> {ex.avoid}
                                          </span>
                                        </div>
                                      )}
                                      {ex.incorrect && (
                                        <div className="flex items-start gap-2 text-rose-600 dark:text-rose-400">
                                          <IconX
                                            size={14}
                                            className="shrink-0 mt-0.5"
                                          />
                                          <span>
                                            <strong>Incorrect:</strong> {ex.incorrect}
                                          </span>
                                        </div>
                                      )}
                                      {ex.note && (
                                        <div className="text-muted-foreground pl-5 text-[11px] font-sans">
                                          Note: {ex.note}
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Editorial Tables */}
                      {sub.table && (
                        <div className="space-y-2 pt-2">
                          {sub.table.caption && (
                            <span className="block text-xs font-semibold text-muted-foreground">
                              {sub.table.caption}
                            </span>
                          )}
                          <div className="overflow-x-auto rounded-lg border border-border/60">
                            <table className="w-full text-left text-xs">
                              <thead className="bg-muted/60 border-b border-border/60 text-foreground font-semibold">
                                <tr>
                                  {sub.table.headers.map((h, hIdx) => (
                                    <th key={hIdx} className="px-4 py-3">
                                      {h}
                                    </th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-border/40 text-muted-foreground">
                                {sub.table.rows.map((row, rowIdx) => (
                                  <tr
                                    key={rowIdx}
                                    className="hover:bg-muted/20 transition-colors"
                                  >
                                    {row.map((cell, cIdx) => (
                                      <td
                                        key={cIdx}
                                        className={`px-4 py-2.5 ${
                                          cIdx === 0
                                            ? "font-medium text-foreground"
                                            : ""
                                        }`}
                                      >
                                        {cell}
                                      </td>
                                    ))}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>

          {/* Bottom Next Navigation */}
          {nextSection && (
            <div className="mt-14 flex items-center justify-between rounded-xl border border-border/60 bg-muted/15 p-6">
              <div className="space-y-1">
                <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
                  Next Section
                </span>
                <p className="font-heading text-base font-semibold text-foreground">
                  {nextSection.number}. {nextSection.title}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => scrollToSection(nextSection.id)}
                icon={<IconChevronRight size={14} />}
              >
                Continue
              </Button>
            </div>
          )}
        </article>

        {/* Right Sticky Sidebar (Table of Contents & Feedback) */}
        <aside className="lg:col-span-4 xl:col-span-3">
          <div className="sticky top-24 space-y-6">
            {/* Table of Contents */}
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="text-left font-semibold text-sm text-primary hover:underline transition-colors block"
              >
                {doc.title}
              </button>

              <nav className="space-y-1" aria-label="Table of contents">
                <ol className="space-y-2 text-xs">
                  {doc.sections.map((section) => {
                    const isActive = activeSectionId === section.id
                    return (
                      <li key={section.id}>
                        <button
                          type="button"
                          onClick={() => scrollToSection(section.id)}
                          className={`flex w-full items-baseline gap-2 text-left transition-colors py-1 ${
                            isActive
                              ? "text-primary font-medium"
                              : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          <span className="font-mono text-[11px] text-muted-foreground">
                            {section.number}.
                          </span>
                          <span className="truncate">{section.title}</span>
                        </button>
                      </li>
                    )
                  })}
                </ol>
              </nav>

              {nextSection && (
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => scrollToSection(nextSection.id)}
                    className="text-xs text-primary font-medium hover:underline inline-flex items-center gap-1"
                  >
                    <span>Next: {nextSection.title}</span>
                    <IconChevronRight size={12} />
                  </button>
                </div>
              )}
            </div>

            <hr className="border-border/60" />

            {/* Feedback Widget (Matching Reference Image) */}
            <div className="space-y-2.5 rounded-xl border border-border/50 bg-muted/20 p-4">
              <span className="text-xs font-semibold text-foreground">
                Was this helpful?
              </span>

              {feedbackState === "idle" ? (
                <div className="flex items-center gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => handleFeedback("sad")}
                    className="flex size-9 items-center justify-center rounded-lg border border-border/60 text-muted-foreground hover:border-destructive hover:bg-destructive/10 hover:text-destructive transition-colors"
                    title="Needs improvement"
                    aria-label="Needs improvement"
                  >
                    <IconMoodSad size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleFeedback("neutral")}
                    className="flex size-9 items-center justify-center rounded-lg border border-border/60 text-muted-foreground hover:border-amber-500 hover:bg-amber-500/10 hover:text-amber-500 transition-colors"
                    title="Neutral"
                    aria-label="Neutral"
                  >
                    <IconMoodEmpty size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleFeedback("smile")}
                    className="flex size-9 items-center justify-center rounded-lg border border-border/60 text-muted-foreground hover:border-emerald-500 hover:bg-emerald-500/10 hover:text-emerald-500 transition-colors"
                    title="Very helpful"
                    aria-label="Very helpful"
                  >
                    <IconMoodSmile size={18} />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 font-medium pt-1">
                  <IconCheck size={14} strokeWidth={3} />
                  <span>Feedback recorded. Thank you!</span>
                </div>
              )}
            </div>

            {/* Source Reference Badge */}
            <div className="rounded-xl border border-border/40 bg-muted/20 p-4 space-y-2">
              <div className="flex items-center gap-1.5 text-xs text-foreground font-semibold">
                <IconBook size={14} className="text-primary" />
                <span>Reference Standard</span>
              </div>
              <p className="text-[11px] leading-relaxed text-muted-foreground">
                Official Apple corporate identity, editorial voice, and interface copywriting guide (June 2026).
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
