import { ChevronUp } from "@boxicons/react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import Lenis from "lenis"
import * as React from "react"
import { useEffect, useRef } from "react"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}
export function ScrollManager({ children }: { children: React.ReactNode }) {
  const circleRef = useRef<SVGCircleElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const lenisRef = useRef<Lenis>(null)

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1.1,
      touchMultiplier: 1.5,
    })

    lenisRef.current = lenis

    lenis.on("scroll", (e: any) => {
      ScrollTrigger.update()

      // Update circular progress via refs to avoid React re-renders on scroll
      const progress = e.progress // 0 to 1
      if (circleRef.current) {
        // Circumference of r=46 is approx 289.026
        const dashoffset = 289.026 - progress * 289.026
        circleRef.current.style.strokeDashoffset = `${dashoffset}`
      }

      // Show button only when user has scrolled down
      if (buttonRef.current) {
        if (progress > 0.04) {
          buttonRef.current.style.opacity = "1"
          buttonRef.current.style.pointerEvents = "auto"
        } else {
          buttonRef.current.style.opacity = "0"
          buttonRef.current.style.pointerEvents = "none"
        }
      }
    })

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000)
    })

    gsap.ticker.lagSmoothing(0)

    return () => {
      lenis.destroy()
      gsap.ticker.remove((time) => lenis.raf(time * 1000))
    }
  }, [])

  const scrollToTop = () => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, {
        duration: 1.5,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      })
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  return (
    <>
      {children}

      {/* Sleek Scroll-to-Top Button */}
      <button
        ref={buttonRef}
        onClick={scrollToTop}
        style={{ opacity: 0, pointerEvents: "none" }}
        className="fixed right-6 bottom-6 z-50 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-border/80 bg-background/90 shadow-lg backdrop-blur-md transition-all duration-300 hover:scale-110 active:scale-95"
        aria-label="Scroll to top"
      >
        <svg
          className="absolute inset-0 h-full w-full -rotate-90 transform"
          viewBox="0 0 100 100"
        >
          <circle
            cx="50"
            cy="50"
            r="46"
            className="fill-none stroke-muted stroke-8"
          />
          <circle
            ref={circleRef}
            cx="50"
            cy="50"
            r="46"
            className="fill-none stroke-primary stroke-8"
            strokeLinecap="round"
            strokeDasharray="289.026 289.026"
            style={{ strokeDashoffset: 289.026 }}
          />
        </svg>
        <ChevronUp className="relative z-10 h-5 w-5 text-foreground" />
      </button>
    </>
  )
}
