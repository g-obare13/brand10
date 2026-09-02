import { Button } from "@/components/ui/button"
import { useEffect, useRef } from "react"
import { DashboardBackground } from "../dashboard"
import Container from "../ui/container"
import { Header } from "./Header"
import WordReveal from "./WordReveal"
import { gsap } from "gsap"

/**
 * Standardized 404 Not Found Component for Brandio.
 * Features:
 * - Ambient gradient glows and futuristic glassmorphic container.
 * - Bold typographic presentation with design system color palette.
 * - Quick navigational shortcuts (Home, Dashboard, Projects).
 *
 * @component
 * @returns {React.ReactElement} The rendered 404 page.
 */
export function NotFoundComponent() {
  const ctaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ctaRef.current) return
    const ctx = gsap.context(() => {
      const buttons = ctaRef.current?.querySelectorAll(".hero-cta-btn")
      if (buttons && buttons.length > 0) {
        gsap.fromTo(
          buttons,
          { y: 25, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.1,
            stagger: 0.12,
            delay: 0.25,
            ease: "power3.out",
          }
        )
      }
    }, ctaRef)

    return () => ctx.revert()
  }, [])

  return (
    <div className="relative flex min-h-screen flex-col justify-between overflow-hidden bg-background text-foreground transition-colors duration-200 selection:bg-primary/20 selection:text-primary">
      {/* Dynamic WebGL Aurora Ambient Glow */}
      <DashboardBackground />

      {/* Navigation Header */}
      <Header />

      {/* Main 404 presentation */}
      <Container className="relative z-10 mx-auto flex w-full flex-1 flex-col items-center justify-center">
        <div className="flex max-w-xl flex-col items-center gap-3 text-center">
          {/* Big 404 Headline */}
          <div className="relative my-2 select-none">
            <WordReveal as="h2" stagger={0.03} duration={1.4} start="top 90%">
              <h2 className="bg-linear-to-b from-foreground via-foreground/70 to-foreground/20 bg-clip-text font-mono text-7xl sm:text-8xl">
                404
              </h2>
            </WordReveal>

            <WordReveal as="h4" stagger={0.03} duration={1.4} start="top 90%">
              Lost in creative space
            </WordReveal>

            <WordReveal as="p" stagger={0.03} duration={1.4} start="top 90%">
              The brand guideline, workspace, or asset deck you are looking for
              doesn&apos;t exist or might have been relocated.
            </WordReveal>
          </div>

          {/* Quick links */}
          <div
            ref={ctaRef}
            className="mt-8 flex w-full flex-col items-center justify-center gap-2.5 sm:flex-row"
          >
            <Button
              href="/"
              variant={"shiny"}
              size={"pill"}
              gsapFill
              className={"hero-cta-btn rounded-full px-12! py-8!"}
            >
              Return to Home
            </Button>

            <Button
              variant={"outline"}
              size={"pill"}
              gsapFill
              className={"hero-cta-btn rounded-full px-12! py-8!"}
              href="/dashboard/projects"
            >
              Open Projects
            </Button>
          </div>
        </div>
      </Container>

      {/* Footer */}
      <footer className="relative z-10 py-6 text-center text-xs text-foreground">
        © {new Date().getFullYear()} Brandio. All rights reserved.
      </footer>
    </div>
  )
}
