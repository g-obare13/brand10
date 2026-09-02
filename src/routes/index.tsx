import { createFileRoute } from "@tanstack/react-router"
import { Header } from "@/components/shared/Header"
import { Hero } from "@/components/hero"
import HowItWorks from "@/components/shared/HowItWorks"

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title: "Brand10 - Modern Brand Identity Studio & Living Design Systems",
      },
      {
        name: "description",
        content:
          "Transform brand assets into living design systems. Real-time token synchronization, responsive typography calculators, SVG palette clustering, and exportable PDF decks.",
      },
      {
        property: "og:title",
        content:
          "Brand10 - Modern Brand Identity Studio & Living Design Systems",
      },
      {
        property: "og:description",
        content:
          "Transform brand assets into living design systems. Real-time token synchronization, responsive typography calculators, SVG palette clustering, and exportable PDF decks.",
      },
    ],
  }),
  component: LandingPage,
})

/**
 * Public landing page for the Brand Studio application.
 * Features:
 * - Floating glass header with navigation and modals.
 * - Hero section with typography reveal effects and direct CTA actions.
 * - HowItWorks interactive showcase section.
 *
 * @component
 * @returns {React.ReactElement} The landing page view.
 */
function LandingPage() {
  return (
    <div className="relative min-h-screen bg-background text-foreground transition-colors duration-200 selection:bg-primary/20 selection:text-primary">
      {/* Floating Glass Navigation Header with Use Cases dropdown */}
      <Header />

      {/* Main Content */}
      <main>
        <Hero />
        {/* Curtain container that rolls over the sticky hero */}
        <div className="relative z-10 bg-background">
          <HowItWorks />
        </div>
      </main>
    </div>
  )
}
