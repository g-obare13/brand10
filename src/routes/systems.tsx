/**
 * @file systems.tsx
 * @description Standalone public route displaying world-class design systems and brand style guides.
 */

import { createFileRoute } from "@tanstack/react-router"
import { Header } from "@/components/shared/Header"
import Container from "@/components/ui/container"
import { SystemsTab } from "@/components/dashboard/tabs/SystemsTab"

export const Route = createFileRoute("/systems")({
  head: () => ({
    meta: [
      {
        title: "Design Systems & Guidelines | Brand10",
      },
      {
        name: "description",
        content:
          "Explore world-class living design systems and brand style guides from leading industry pioneers.",
      },
      {
        property: "og:title",
        content: "Design Systems & Guidelines | Brand10",
      },
      {
        property: "og:description",
        content:
          "Explore world-class living design systems and brand style guides from leading industry pioneers.",
      },
    ],
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

