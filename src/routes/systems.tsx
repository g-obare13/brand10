/**
 * @file systems.tsx
 * @description Standalone public route displaying world-class design systems and brand style guides.
 */

import { createFileRoute } from "@tanstack/react-router"
import { Header } from "@/components/shared/Header"
import Container from "@/components/ui/container"
import { SystemsTab } from "@/components/dashboard/tabs/SystemsTab"
import { SITE_URL, buildSeoLinks, buildSeoMeta } from "@/data/seo"

export const Route = createFileRoute("/systems")({
  head: () => ({
    meta: buildSeoMeta({
      title: "Design Systems & Guidelines | Brand10",
      description:
        "Explore world-class living design systems and brand style guides from leading industry pioneers.",
      url: `${SITE_URL}/systems`,
    }),
    links: buildSeoLinks({
      canonicalUrl: `${SITE_URL}/systems`,
    }),
  }),
  component: SystemsPage,
})

/**
 * Public standalone systems catalog page displaying real-world design systems.
 *
 * @component
 * @returns {React.ReactElement} The rendered systems showcase page.
 */
function SystemsPage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-background">
      <Header />
      <main className="relative z-10 bg-background pt-28 pb-24">
        <Container>
          <SystemsTab />
        </Container>
      </main>
    </div>
  )
}
