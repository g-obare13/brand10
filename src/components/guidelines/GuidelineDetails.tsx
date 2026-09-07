/**
 * @file GuidelineDetails.tsx
 * @description Editorial article view for brand guidelines, structured like the insights reader.
 * Strictly follows the format:
 * - What the guideline is
 * - Key concepts
 * - How to use it
 * No cover image included, per user specification.
 */

import * as React from "react"
import { Link } from "@tanstack/react-router"
import {
  IconArrowLeft,
  IconChevronRight,
  IconCheck,
  IconX,
} from "@tabler/icons-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import Container from "@/components/ui/container"
import { Button } from "@/components/ui/button"
import { ShareButtons } from "@/components/ui/share-buttons"
import WordReveal from "@/components/shared/WordReveal"
import { GUIDELINE_ARTICLES } from "@/data/guidelines"
import type { GuidelineArticle } from "@/data/guidelines"

interface GuidelineDetailsProps {
  slug?: string
}

/**
 * Editorial article component rendering a structured brand guideline.
 *
 * @component
 * @param {GuidelineDetailsProps} props - Component properties.
 * @returns {React.ReactElement} The rendered guideline article view.
 */
export function GuidelineDetails({ slug }: GuidelineDetailsProps) {
  const [resolvedSlug, setResolvedSlug] = React.useState(slug || "")

  React.useEffect(() => {
    if (slug) {
      setResolvedSlug(slug)
      return
    }

    const pathPart = window.location.pathname.split("/").pop()
    const searchParams = new URLSearchParams(window.location.search)
    const slugParam = searchParams.get("slug")

    if (pathPart && pathPart !== "guidelines") {
      setResolvedSlug(pathPart)
    } else if (slugParam) {
      setResolvedSlug(slugParam)
    }
  }, [slug])

  const targetSlug = slug || resolvedSlug
  const article: GuidelineArticle =
    GUIDELINE_ARTICLES.find((item) => item.slug === targetSlug) ||
    GUIDELINE_ARTICLES[0]

  const currentIndex = GUIDELINE_ARTICLES.findIndex(
    (item) => item.slug === article.slug
  )
  const nextArticle =
    currentIndex >= 0 && currentIndex < GUIDELINE_ARTICLES.length - 1
      ? GUIDELINE_ARTICLES[currentIndex + 1]
      : GUIDELINE_ARTICLES[0]

  return (
    <Container className="max-w-5xl space-y-12">
      {/* Top Back Navigation */}
      <div>
        <Link to="/guidelines">
          <Button
            variant="outline"
            size="pill"
            gsapFill
            className="rounded-full px-4 text-xs font-semibold"
            icon={<IconArrowLeft size={14} />}
            iconPlacement="left"
          >
            Back to Guidelines
          </Button>
        </Link>
      </div>

      {/* Article Header */}
      <div className="space-y-6">
        <WordReveal
          as="h1"
          stagger={0.03}
          duration={1.4}
          start="top 90%"
          retrigger={false}
        >
          {article.title}
        </WordReveal>

        <WordReveal
          as="p"
          stagger={0.02}
          duration={1.2}
          start="top 90%"
          retrigger={false}
        >
          {article.excerpt}
        </WordReveal>

        {/* Author Metadata Row */}
        <div className="flex items-center gap-4 border-t border-border/60 pt-4">
          <Avatar className="h-12 w-12 border border-border">
            {article.avatar && (
              <AvatarImage src={article.avatar} alt={article.author} />
            )}
            <AvatarFallback>
              {article.author
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <h6 className="font-semibold text-foreground">{article.author}</h6>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>{article.date}</span>
              <span>•</span>
              <span>{article.readTime}</span>
              <span>•</span>
              <Badge variant="outline">{article.category}</Badge>
            </div>
          </div>
        </div>
      </div>

      {/* 2-Column Layout: Sticky Share Sidebar & Article Content */}
      <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-[50px_1fr]">
        {/* Sticky Share Sidebar */}
        <div className="flex flex-col gap-6 lg:sticky lg:top-28">
          <span>Share</span>
          <ShareButtons layout="column" title={article.title} />
        </div>

        {/* Article Body */}
        <div className="space-y-12">
          {/* Section 1: What the guideline is */}
          <section className="space-y-5">
            <h3>{article.sections.whatItIs.title}</h3>

            {article.sections.whatItIs.paragraphs.map((para, pIdx) => (
              <p key={pIdx}>{para}</p>
            ))}

            {article.sections.whatItIs.quote && (
              <blockquote className="my-6 rounded-r-lg border-l-2 border-primary/60 bg-muted/20 py-3 pl-4 text-base leading-relaxed text-foreground/90">
                <p>"{article.sections.whatItIs.quote.text}"</p>
                {article.sections.whatItIs.quote.author && (
                  <span className="mt-2 block text-xs font-semibold text-muted-foreground">
                    - {article.sections.whatItIs.quote.author}
                  </span>
                )}
              </blockquote>
            )}
          </section>

          {/* Section 2: Key concepts */}
          <section className="space-y-5 pt-8">
            <h3>{article.sections.keyConcepts.title}</h3>

            {article.sections.keyConcepts.paragraphs.map((para, pIdx) => (
              <p key={pIdx} className="leading-relaxed">
                {para}
              </p>
            ))}

            {article.sections.keyConcepts.bullets && (
              <ul className="list-inside list-disc gap-4 pt-2">
                {article.sections.keyConcepts.bullets.map((bullet, bIdx) => (
                  <li key={bIdx} className="space-y-1 px-5 py-2">
                    <span className="text-sm font-semibold text-foreground">
                      {bullet.label}
                    </span>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {bullet.text}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Section 3: How to use it */}
          <section className="space-y-5 pt-8">
            <h3>{article.sections.howToUseIt.title}</h3>

            {article.sections.howToUseIt.paragraphs.map((para, pIdx) => (
              <p key={pIdx}>{para}</p>
            ))}

            {article.sections.howToUseIt.bullets && (
              <div className="grid grid-cols-1 gap-3 pt-2">
                {article.sections.howToUseIt.bullets.map((bullet, bIdx) => {
                  const isDo = bullet.label.toLowerCase() === "do"
                  const isAvoid = bullet.label.toLowerCase() === "avoid"
                  return (
                    <div
                      key={bIdx}
                      className={`flex items-start gap-3 rounded-lg border p-4 text-xs sm:text-sm ${
                        isDo
                          ? "border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-950/20"
                          : isAvoid
                            ? "border-rose-500/30 bg-rose-500/5 dark:bg-rose-950/20"
                            : "border-border/60 bg-muted/20"
                      }`}
                    >
                      {isDo && (
                        <span className="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                          <IconCheck size={12} strokeWidth={3} />
                        </span>
                      )}
                      {isAvoid && (
                        <span className="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-rose-500/20 text-rose-600 dark:text-rose-400">
                          <IconX size={12} strokeWidth={3} />
                        </span>
                      )}
                      <div>
                        <strong className="mr-1.5 text-foreground">
                          {bullet.label}:
                        </strong>
                        <span className="leading-relaxed text-muted-foreground">
                          {bullet.text}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </section>

          {/* Strategic Takeaways Box */}
          <div className="space-y-6">
            <h4>Strategic Takeaways</h4>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              <div className="space-y-1.5">
                <h6>UX Impact</h6>
                <p>{article.takeaways.uxImpact}</p>
              </div>
              <div className="space-y-1.5">
                <h6>Brand Perception</h6>
                <p>{article.takeaways.brandPerception}</p>
              </div>
              <div className="space-y-1.5">
                <h6>Recommendation</h6>
                <p>{article.takeaways.realWorldRecommendation}</p>
              </div>
            </div>
          </div>

          {/* Bottom Next Article Pager */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <span>Next Guideline</span>
              <p className="font-heading text-base font-semibold text-foreground">
                {nextArticle.title}
              </p>
            </div>
            <Link to="/guidelines/$slug" params={{ slug: nextArticle.slug }}>
              <Button
                variant="outline"
                size="pill"
                gsapFill
                className="rounded-full px-4 text-xs font-semibold"
                icon={<IconChevronRight size={14} />}
                iconPlacement="right"
              >
                Read Next
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Container>
  )
}
