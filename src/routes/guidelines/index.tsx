/**
 * @file index.tsx
 * @description Standalone public route rendering the 8 core design system guidelines catalog.
 */

import { createFileRoute } from "@tanstack/react-router"
import { Header } from "@/components/shared/Header"
import Container from "@/components/ui/container"
import { GuidelinesTab } from "@/components/dashboard/tabs/GuidelinesTab"
import { DEFAULT_OG_IMAGE, DEFAULT_OG_IMAGE_ALT, SITE_URL } from "@/data/seo"

export const Route = createFileRoute("/guidelines/")({
  head: () => ({
    meta: [
      {
        title: "Design System Guidelines | Brand10",
      },
      {
        name: "description",
        content:
          "The 8 architectural pillars for constructing scalable, accessible, and unified living design systems.",
      },
      {
        property: "og:title",
        content: "Design System Guidelines | Brand10",
      },
      {
        property: "og:description",
        content:
          "The 8 architectural pillars for constructing scalable, accessible, and unified living design systems.",
      },
      {
        property: "og:url",
        content: `${SITE_URL}/guidelines`,
      },
      {
        property: "og:image",
        content: DEFAULT_OG_IMAGE,
      },
      {
        property: "og:image:secure_url",
        content: DEFAULT_OG_IMAGE,
      },
      {
        name: "twitter:card",
        content: "summary_large_image",
      },
      {
        name: "twitter:title",
        content: "Design System Guidelines | Brand10",
      },
      {
        name: "twitter:description",
        content:
          "The 8 architectural pillars for constructing scalable, accessible, and unified living design systems.",
      },
      {
        name: "twitter:image",
        content: DEFAULT_OG_IMAGE,
      },
      {
        name: "twitter:image:alt",
        content: DEFAULT_OG_IMAGE_ALT,
      },
    ],
    links: [
      {
        rel: "canonical",
        href: `${SITE_URL}/guidelines`,
      },
    ],
  }),
  component: GuidelinesPage,
})

/**
 * Public standalone guidelines page component rendering the 8 architectural categories.
 *
 * @component
 * @returns {React.ReactElement} The rendered guidelines catalog page.
 */
function GuidelinesPage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-background">
      <Header />
      <main className="relative z-10 bg-background pt-28 pb-24">
        <Container>
          <GuidelinesTab />
        </Container>
      </main>
    </div>
  )
}

