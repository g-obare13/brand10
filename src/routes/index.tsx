/**
 * @file index.tsx
 * @description Landing page route for Brand10 showcasing brand identity engine, living design systems, and workflow.
 */

import { Hero } from "@/components/hero"
import FAQSection from "@/components/hero/FAQSection"
import HowItWorks from "@/components/hero/HowItWorks"
import InsightsSection from "@/components/hero/InsightsSection"
import { Header } from "@/components/shared/Header"
import { DEFAULT_OG_IMAGE, DEFAULT_OG_IMAGE_ALT, SITE_URL } from "@/data/seo"
import { useAuthStore } from "@/store/authStore"
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { useEffect } from "react"

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
      {
        property: "og:url",
        content: SITE_URL,
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
        content:
          "Brand10 - Modern Brand Identity Studio & Living Design Systems",
      },
      {
        name: "twitter:description",
        content:
          "Transform brand assets into living design systems. Real-time token synchronization, responsive typography calculators, SVG palette clustering, and exportable PDF decks.",
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
        href: SITE_URL,
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
 * - Automatic redirect to /dashboard/projects when logged in.
 *
 * @component
 * @returns {React.ReactElement} The landing page view.
 */
function LandingPage() {
  const { user, loading } = useAuthStore()
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading && user) {
      navigate({ to: "/dashboard/projects" })
    }
  }, [user, loading, navigate])
  return (
    <div className="relative min-h-screen bg-background text-foreground transition-colors duration-200 selection:bg-primary/20 selection:text-primary">
      {/* Floating Glass Navigation Header with Use Cases dropdown */}
      <Header />

      {/* Main Content */}
      <main>
        <Hero />
        {/* Curtain container that rolls over the sticky hero */}
        <div className="relative z-10 w-full bg-background">
          <HowItWorks />
          <InsightsSection />
          <FAQSection />
        </div>
      </main>
    </div>
  )
}
