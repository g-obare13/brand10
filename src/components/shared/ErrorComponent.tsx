import { Button } from "@/components/ui/button"
import type { ErrorComponentProps } from "@tanstack/react-router"
import { useEffect, useRef } from "react"
import { DashboardBackground } from "@/components/dashboard"
import Container from "@/components/ui/container"
import { Header } from "./Header"
import WordReveal from "./WordReveal"
import { gsap } from "gsap"

/**
 * Standardized 500 / Runtime Error Component for Brand10.
 * Adheres to the system design language:
 * - Dynamic ambient gradient glows with dark/light mode integration.
 * - Glassmorphic card styling with rounded surfaces.
 * - Actionable buttons (Retry, Go to Home, Copy Error Log).
 * - Optional collapsible error stack trace for debugging.
 *
 * @component
 * @param {ErrorComponentProps} props - TanStack Router error component props.
 * @returns {React.ReactElement} The rendered error page.
 */
export function GeneralErrorComponent({ reset }: ErrorComponentProps) {
  // const errorMessage =
  //   error instanceof Error
  //     ? error.message
  //     : "An unexpected server error occurred."
  // const errorStack = error instanceof Error ? error.stack : undefined

  const ctaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ctaRef.current) return
    const ctx = gsap.context(() => {
      const buttons = ctaRef.current?.querySelectorAll(".hero-cta-btn")
      if (buttons && buttons.length > 0) {
        gsap.fromTo(
          buttons,
          { y: 20, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            stagger: 0.12,
            delay: 0.35,
            ease: "power3.out",
            clearProps: "opacity,transform",
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
                500
              </h2>
            </WordReveal>

            <WordReveal as="h4" stagger={0.03} duration={1.4} start="top 90%">
              Something went wrong
            </WordReveal>

            <WordReveal as="p" stagger={0.03} duration={1.4} start="top 90%">
              We encountered an unexpected error while processing your request.
              Our systems have logged this issue.
            </WordReveal>
          </div>

          {/* Quick links */}
          <div
            ref={ctaRef}
            className="mt-8 flex w-full flex-col items-center justify-center gap-2.5 sm:flex-row"
          >
            <Button
              onClick={() => reset()}
              variant={"shiny"}
              size={"pill"}
              gsapFill
              style={{ opacity: 0 }}
              className={"hero-cta-btn rounded-full px-12! py-8!"}
            >
              Try Again
            </Button>

            <Button
              variant={"outline"}
              size={"pill"}
              gsapFill
              style={{ opacity: 0 }}
              className={"hero-cta-btn rounded-full px-12! py-8!"}
              href="/"
            >
              Return Home
            </Button>
          </div>
        </div>
      </Container>

      {/* Footer */}
      <footer className="relative z-10 py-6 text-center text-xs text-foreground">
        © {new Date().getFullYear()} Brand10. All rights reserved.
      </footer>
    </div>
  )
}
