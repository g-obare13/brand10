/**
 * @file templates.$templateId.tsx
 * @description Dynamic route rendering authentic real-world brand guidelines showcase documents.
 * Headlined by the official Apple Brand Identity & Style Guide (June 2026).
 */

import { createFileRoute } from "@tanstack/react-router"
import { Header } from "@/components/shared/Header"
import { TemplateDocReader } from "@/components/templates/TemplateDocReader"
import { APPLE_BRAND_GUIDELINES } from "@/data/templates"
import { SITE_URL, buildSeoLinks, buildSeoMeta } from "@/data/seo"

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
      meta: buildSeoMeta({
        title,
        description,
        keywords:
          "Apple brand guidelines, Apple style guide, San Francisco typography, Apple design system, logo clear space, Brand10",
        url: canonicalUrl,
        type: "article",
      }),
      links: buildSeoLinks({
        canonicalUrl,
      }),
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
