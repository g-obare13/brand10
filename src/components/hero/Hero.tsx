import WordReveal from "@/components/shared/WordReveal"
import { Button } from "@/components/ui/button"
import { ArrowRightStroke } from "@boxicons/react"
import { useNavigate } from "@tanstack/react-router"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useEffect, useRef } from "react"
import Container from "@/components/ui/container"
import { useBrandStore } from "@/store/brandStore"
import { useAuthStore } from "@/store/authStore"
import { DashboardBackground } from "@/components/dashboard"
import { MagneticCards } from "@/components/shared/MagneticCards"
import { HERO_MAGNETIC_ITEMS } from "@/data/marketing"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

/**
 * Brand Studio homepage hero section.
 * Renders a full-screen ambient hero with sticky curtain parallax effect,
 * typography reveal effects, and primary CTA action buttons.
 *
 * @component
 * @returns {React.ReactElement} The rendered hero section.
 */
export function Hero() {
  const navigate = useNavigate()
  const brand = useBrandStore()
  const { user, setLoginModalOpen } = useAuthStore()

  const heroRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!heroRef.current) return
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

      // Gentle parallax depth as the curtain below rolls up over the hero
      if (contentRef.current) {
        gsap.to(contentRef.current, {
          yPercent: -15,
          // opacity: 0.35,
          ease: "none",
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        })
      }
    }, heroRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={heroRef}
      className="sticky top-0 z-0 flex h-screen min-h-screen w-full flex-col justify-start overflow-hidden pt-28 sm:pt-36 lg:pt-40"
    >
      {/* Ambient background canvas */}
      <DashboardBackground position="absolute" opacity="opacity-75" />

      {/* Magnetic Cards anchored to the bottom-right of the full screen height */}
      <div className="pointer-events-auto absolute right-4 bottom-2 z-0 hidden h-80 w-full max-w-2xl md:block lg:right-8 lg:bottom-6 lg:h-96 lg:max-w-2xl xl:right-16">
        <MagneticCards items={HERO_MAGNETIC_ITEMS} />
      </div>

      <Container className="relative z-10 flex w-full flex-col items-start justify-start">
        {/* Hero Content with curtain parallax depth */}
        <div
          ref={contentRef}
          className="relative z-10 w-full max-w-4xl space-y-6 text-left"
        >
          <WordReveal as="h1" stagger={0.03} duration={1.4} start="top 90%">
            Create comprehensive brand guidelines in minutes with Brand
            <span className="font-heading text-5xl font-semibold text-primary lg:text-6xl">
              1
            </span>
            <span className="font-heading text-5xl font-semibold text-olive-400 lg:text-6xl">
              0
            </span>
          </WordReveal>

          <WordReveal as="p" stagger={0.03} duration={1.4} start="top 90%">
            Brand10 is your AI brand studio. Automatically generate and manage
            logo clearspace rules, accessible color palettes, typography
            systems, and exportable brand decks in one unified workspace.
          </WordReveal>

          {/* Hero CTA Action Buttons */}
          <div ref={ctaRef} className="flex flex-wrap items-center gap-4 pt-2">
            <Button
              onClick={() => {
                if (user) {
                  navigate({ to: "/dashboard/projects" })
                } else {
                  setLoginModalOpen(true)
                }
              }}
              variant={"shiny"}
              size={"pill"}
              gsapFill
              style={{ opacity: 0 }}
              className={"hero-cta-btn rounded-full px-12! py-8!"}
            >
              Start building free
            </Button>

            <Button
              href="/ai"
              variant={"outline"}
              size={"pill"}
              gsapFill
              style={{ opacity: 0 }}
              className={"hero-cta-btn rounded-full px-12! py-8!"}
              icon={<ArrowRightStroke />}
            >
              Explore AI
            </Button>
          </div>
        </div>
      </Container>
    </section>
  )
}

export default Hero
