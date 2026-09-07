/**
 * @file ai.tsx
 * @description Standalone public route rendering the AI studio copilot and assistant interface.
 */

import { createFileRoute } from "@tanstack/react-router"
import { Header } from "@/components/shared/Header"
import Container from "@/components/ui/container"
import { AiAssistanceTab } from "@/components/dashboard/tabs/AiAssistanceTab"

export const Route = createFileRoute("/ai")({
  head: () => ({
    meta: [
      {
        title: "AI Studio Assistance & Generators | Brand10",
      },
      {
        name: "description",
        content:
          "Automated brand extraction, contrast computation, and voice synthesis powered by AI.",
      },
      {
        property: "og:title",
        content: "AI Studio Assistance & Generators | Brand10",
      },
      {
        property: "og:description",
        content:
          "Automated brand extraction, contrast computation, and voice synthesis powered by AI.",
      },
    ],
  }),
  component: AiPage,
})

/**
 * Public standalone AI assistance page component rendering interactive brand AI tooling.
 *
 * @component
 * @returns {React.ReactElement} The rendered AI assistance page.
 */
function AiPage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-background">
      <Header />
      <main className="relative z-10 bg-background pt-28 pb-24">
        <Container>
          <AiAssistanceTab />
        </Container>
      </main>
    </div>
  )
}

