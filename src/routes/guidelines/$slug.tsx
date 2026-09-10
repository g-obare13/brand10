/**
 * @file $slug.tsx
 * @description Dynamic route rendering full-length brand guideline articles.
 * Follows the format: What it is, Key concepts, How to use it.
 */

import { createFileRoute } from "@tanstack/react-router"
import { Header } from "@/components/shared/Header"
import { GuidelineDetails } from "@/components/guidelines/GuidelineDetails"
import { GUIDELINE_ARTICLES } from "@/data/guidelines"
import { SITE_URL, buildSeoLinks, buildSeoMeta } from "@/data/seo"

export const Route = createFileRoute("/guidelines/$slug")({
  head: ({ params }) => {
    const article =
      GUIDELINE_ARTICLES.find((p) => p.slug === params.slug) ||
      GUIDELINE_ARTICLES[0]
    const title = `${article.title} | Brand10 Guidelines`
    const description = article.excerpt
    const canonicalUrl = `${SITE_URL}/guidelines/${params.slug}`

    return {
      meta: buildSeoMeta({
        title,
        description,
        keywords: `${article.title}, ${article.category}, design system guidelines, Brand10`,
        url: canonicalUrl,
        type: "article",
      }),
      links: buildSeoLinks({
        canonicalUrl,
      }),
    }
  },
  component: GuidelineArticlePage,
})

/**
 * Guideline article page view component.
 */
function GuidelineArticlePage() {
  const { slug } = Route.useParams()

  return (
    <div className="min-h-screen overflow-x-hidden bg-background">
      <Header />
      <main className="relative z-10 bg-background pt-28 pb-24">
        <GuidelineDetails slug={slug} />
      </main>
    </div>
  )
}
