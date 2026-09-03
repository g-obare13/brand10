"use client"

import * as React from "react"
import { SimilarInsights } from "./SimilarInsights"
import ImageComponentOptimized from "@/components/shared/ImageComponentOptimized"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import Container from "@/components/ui/container"
import { ShareButtons } from "@/components/ui/share-buttons"
import { mediaData } from "@/data/insights"
import WordReveal from "../shared/WordReveal"

interface InsightsDetailsProps {
  slug?: string
}

export function InsightsDetails({ slug }: InsightsDetailsProps) {
  // Safe client-side parsing of the parameters
  const [resolvedSlug, setResolvedSlug] = React.useState(slug || "")

  React.useEffect(() => {
    if (slug) {
      setResolvedSlug(slug)
      return
    }

    const pathPart = window.location.pathname.split("/").pop()
    const searchParams = new URLSearchParams(window.location.search)
    const slugParam = searchParams.get("slug")
    const idParam = searchParams.get("id")

    if (
      pathPart &&
      pathPart !== "insights-details" &&
      pathPart !== "insights"
    ) {
      setResolvedSlug(pathPart)
    } else if (slugParam) {
      setResolvedSlug(slugParam)
    } else if (idParam) {
      const parsedId = parseInt(idParam, 10)
      if (!isNaN(parsedId) && parsedId >= 0 && parsedId < mediaData.length) {
        setResolvedSlug(mediaData[parsedId].slug)
      }
    }
  }, [slug])

  const targetSlug = slug || resolvedSlug
  const article =
    mediaData.find((item) => item.slug === targetSlug) || mediaData[0]

  // Get similar articles (excluding current one)
  const similarArticles = mediaData.filter((item) => item.slug !== article.slug)

  return (
    <Container className="max-w-5xl space-y-16">
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
          stagger={0.03}
          duration={1.4}
          start="top 90%"
          retrigger={false}
        >
          {article.excerpt}
        </WordReveal>

        {/* Author Meta */}
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

      {/* Featured Large Hero Image */}
      <div className="relative aspect-video w-full overflow-hidden rounded-3xl border border-border/40">
        <ImageComponentOptimized
          src={article.image}
          alt={article.title}
          className="absolute inset-0 h-full w-full"
          imageClassName="h-full w-full object-cover"
          layout="fullWidth"
          cursorEffect="magnifier"
        />
      </div>

      {/* Grid Layout: Sticky Share Sidebar & Article Body */}
      <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-[50px_1fr]">
        <div className="flex flex-col gap-6 lg:sticky lg:top-28">
          <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            Share
          </span>
          <ShareButtons layout="column" title={article.title} />
        </div>

        {/* Article Body (Right Column) */}
        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-12">
          {article.sections.length > 0 ? (
            article.sections.map((section, sIdx) => (
              <div key={sIdx} className="space-y-5">
                <h4>{section.title}</h4>

                {section.paragraphs.map((para, pIdx) => (
                  <p key={pIdx}>{para}</p>
                ))}

                {section.bullets && section.bullets.length > 0 && (
                  <ul className="my-6 space-y-3 pl-4">
                    {section.bullets.map((bullet, bIdx) => (
                      <li key={bIdx} className="text-foreground/90">
                        <strong className="text-foreground">
                          {bullet.label}:{" "}
                        </strong>
                        {bullet.text}
                      </li>
                    ))}
                  </ul>
                )}

                {section.quote && (
                  <blockquote className="my-8 rounded-r-2xl border-l-4 border-primary bg-primary/5 px-6 py-4 text-lg text-foreground italic">
                    "{section.quote.text}"
                    {section.quote.author && (
                      <span className="mt-2 block text-xs font-semibold tracking-wider text-muted-foreground uppercase not-italic">
                        - {section.quote.author}
                      </span>
                    )}
                  </blockquote>
                )}

                {section.image && (
                  <div className="relative my-8 aspect-video w-full overflow-hidden rounded-2xl border border-border/30">
                    <ImageComponentOptimized
                      src={section.image}
                      alt={section.imageAlt || section.title}
                      className="absolute inset-0 h-full w-full"
                      imageClassName="h-full w-full object-cover"
                      layout="fullWidth"
                      cursorEffect="magnifier"
                    />
                  </div>
                )}
              </div>
            ))
          ) : (
            <p>{article.excerpt}</p>
          )}
        </div>
      </div>

      {/* Similar Articles Section */}
      <SimilarInsights articles={similarArticles} />
    </Container>
  )
}

export default InsightsDetails
