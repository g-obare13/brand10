/**
 * @file $slug.tsx
 * @description Dynamic route rendering full-length brand guideline articles.
 * Follows the format: What it is, Key concepts, How to use it.
 */

import { createFileRoute } from "@tanstack/react-router"
import { Header } from "@/components/shared/Header"
import { GuidelineDetails } from "@/components/guidelines/GuidelineDetails"
import { GUIDELINE_ARTICLES } from "@/data/guidelines"
import { DEFAULT_OG_IMAGE, DEFAULT_OG_IMAGE_ALT, SITE_URL } from "@/data/seo"

export const Route = createFileRoute("/guidelines/$slug")({
  head: ({ params }) => {
    const article =
      GUIDELINE_ARTICLES.find((p) => p.slug === params.slug) ||
      GUIDELINE_ARTICLES[0]
    const title = `${article.title} | Brand10 Guidelines`
    const description = article.excerpt
    const canonicalUrl = `${SITE_URL}/guidelines/${params.slug}`

    return {
      meta: [
        { title },
        { name: "description", content: description },
        {
          name: "keywords",
          content: `${article.title}, ${article.category}, design system guidelines, Brand10`,
        },
        // Open Graph
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { property: "og:url", content: canonicalUrl },
        { property: "og:image", content: DEFAULT_OG_IMAGE },
        { property: "og:image:secure_url", content: DEFAULT_OG_IMAGE },
        // Twitter
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
        { name: "twitter:image", content: DEFAULT_OG_IMAGE },
        { name: "twitter:image:alt", content: DEFAULT_OG_IMAGE_ALT },
      ],
      links: [
        {
          rel: "canonical",
          href: canonicalUrl,
        },
      ],
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
