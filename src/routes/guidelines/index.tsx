/**
 * @file index.tsx
 * @description Standalone public route rendering the 8 core design system guidelines catalog.
 */

import { createFileRoute } from "@tanstack/react-router"
import { Header } from "@/components/shared/Header"
import Container from "@/components/ui/container"
import { GuidelinesTab } from "@/components/dashboard/tabs/GuidelinesTab"
import { SITE_URL, buildSeoLinks, buildSeoMeta } from "@/data/seo"

export const Route = createFileRoute("/guidelines/")({
  head: () => ({
    meta: buildSeoMeta({
      title: "Design System Guidelines | Brand10",
      description:
        "The 8 architectural pillars for constructing scalable, accessible, and unified living design systems.",
      url: `${SITE_URL}/guidelines`,
    }),
    links: buildSeoLinks({
      canonicalUrl: `${SITE_URL}/guidelines`,
    }),
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
