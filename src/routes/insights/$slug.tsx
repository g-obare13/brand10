/**
 * @file $slug.tsx
 * @description Dynamic editorial article route with SEO metadata generation and detail view.
 */

import { createFileRoute } from "@tanstack/react-router"
import { mediaData } from "@/data/insights"
import Header from "@/components/shared/Header"
import InsightsDetails from "@/components/hero/InsightsDetails"
import { DEFAULT_OG_IMAGE, DEFAULT_OG_IMAGE_ALT, SITE_URL } from "@/data/seo"

export const Route = createFileRoute("/insights/$slug")({
  head: ({ params }) => {
    const post = mediaData.find((p) => p.slug === params.slug) || mediaData[0]
    const title = `${post.title} | Brand10 Insights`
    const description = post.excerpt
    const canonicalUrl = `${SITE_URL}/insights/${post.slug}`

    return {
      meta: [
        { title },
        { name: "description", content: description },
        {
          name: "keywords",
          content: `${post.title}, ${post.category}, UX design, brand perception, living design systems, Brand10`,
        },
        // Open Graph
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:image", content: DEFAULT_OG_IMAGE },
        { property: "og:image:secure_url", content: DEFAULT_OG_IMAGE },
        { property: "og:type", content: "article" },
        {
          property: "og:url",
          content: canonicalUrl,
        },
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
  component: BlogDetailsPage,
})

function BlogDetailsPage() {
  const { slug } = Route.useParams()
  const post = mediaData.find((p) => p.slug === slug) || mediaData[0]

  const newsJsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: post.title,
    image: [
      DEFAULT_OG_IMAGE,
      post.image.startsWith("http") ? post.image : `${SITE_URL}${post.image}`,
    ],
    datePublished: new Date().toISOString().split("T")[0],
    author: [
      {
        "@type": "Person",
        name: post.author,
      },
    ],
    publisher: {
      "@type": "Organization",
      name: "Brand10 Studio",
      logo: {
        "@type": "ImageObject",
        url: DEFAULT_OG_IMAGE,
      },
    },
    description: post.excerpt,
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(newsJsonLd) }}
      />
      <Header />
      <main className="relative z-10 bg-background pt-32 pb-24">
        <InsightsDetails slug={slug} />
      </main>
    </div>
  )
}
