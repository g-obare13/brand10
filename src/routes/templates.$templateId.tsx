/**
 * @file templates.$templateId.tsx
 * @description Dynamic route rendering authentic real-world brand guidelines showcase documents.
 * Headlined by the official Apple Brand Identity & Style Guide (June 2026).
 */

import { createFileRoute } from "@tanstack/react-router"
import { Header } from "@/components/shared/Header"
import { TemplateDocReader } from "@/components/templates/TemplateDocReader"
import { APPLE_BRAND_GUIDELINES } from "@/data/templates"
import { DEFAULT_OG_IMAGE, DEFAULT_OG_IMAGE_ALT, SITE_URL } from "@/data/seo"

export const Route = createFileRoute("/templates/$templateId")({
  head: ({ params }) => {
    const isApple = params.templateId === "apple"
    const title = isApple
      ? "Apple Style Guide & Brand Guidelines (Official Reference) | Brand10"
      : `${params.templateId} Brand Guidelines | Brand10`
    const description =
      "Official Apple Brand Guidelines and style standard reference, demonstrating real-world brand foundation, typography scale, logo clear space, and trademark governance."
    const canonicalUrl = `${SITE_URL}/templates/${params.templateId}`

    return {
      meta: [
        { title },
        { name: "description", content: description },
        {
          name: "keywords",
          content:
            "Apple brand guidelines, Apple style guide, San Francisco typography, Apple design system, logo clear space, Brand10",
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
  component: TemplateDetailPage,
})

/**
 * Dynamic brand showcase document detail view.
 */
function TemplateDetailPage() {
  // Sourced document (headlined by Apple Brand Guidelines)
  const document = APPLE_BRAND_GUIDELINES

  return (
    <div className="min-h-screen overflow-x-hidden bg-background">
      <Header />
      <main className="relative z-10 bg-background pt-28 pb-24">
        <TemplateDocReader document={document} backTo="/systems" />
      </main>
    </div>
  )
}
