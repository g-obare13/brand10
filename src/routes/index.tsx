import { createFileRoute, Link, useNavigate } from "@tanstack/react-router"
import React, { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"
import { Header } from "../components/shared/Header"
import Container from "../components/ui/container"
import { ingestBrandFile } from "../lib/extractor"
import { useBrandStore } from "../store/brandStore"
import { Button } from "@/components/ui/button"
import { ArrowRight, ArrowRightStroke } from "@boxicons/react"
import BlurReveal from "@/components/shared/BlurReveal"
import WordReveal from "@/components/shared/WordReveal"
import { animateFadeUp } from "@/lib/gsap-animations"
import Auralis from "@/components/shared/Auralis"

export const Route = createFileRoute("/")({
  component: LandingPage,
})

function LandingPage() {
  const navigate = useNavigate()
  const brand = useBrandStore()

  const [brandName, setBrandName] = useState("")
  const [isDragging, setIsDragging] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
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

  const handleProcessFile = async (file: File) => {
    try {
      setIsProcessing(true)
      const extracted = await ingestBrandFile(file)

      // Create new project ID
      const newProjectId = `project-${Math.random().toString(36).substring(2, 9)}`
      brand.setProjectId(newProjectId)

      const finalName = brandName.trim() || extracted.brandName || "My Brand"
      brand.setBrandName(finalName)

      await brand.setLogoData({
        svgContent: extracted.svgDataUri
          ? atob(extracted.svgDataUri.split(",")[1] || "")
          : undefined,
        rasterDataUri: extracted.rasterDataUri,
        isVector: extracted.isVector,
        aspectRatio: extracted.aspectRatio,
      })

      if (extracted.colors.length) {
        brand.setColorPalette(extracted.colors)
      }

      navigate({
        to: "/studio/$projectId",
        params: { projectId: newProjectId },
      })
    } catch (err) {
      console.error("File ingestion error:", err)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleLaunchPreset = (presetKey: "apex" | "bloom" | "nova") => {
    const projectId = `demo-${presetKey}`
    brand.setProjectId(projectId)
    brand.loadPreset(presetKey)
    navigate({
      to: "/studio/$projectId",
      params: { projectId },
    })
  }

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-background text-foreground transition-colors duration-200 selection:bg-primary/20 selection:text-primary">
      {/* Soft Luminous Ethereal Aurora Glow (Dynamic WebGL Auralis Ambient Mesh) */}
      <div className="pointer-events-none absolute top-0 right-0 z-0 h-screen w-full overflow-hidden [mask-image:radial-gradient(ellipse_at_top_right,black_35%,transparent_75%)] opacity-70 md:w-[60vw] dark:opacity-85">
        <Auralis
          className="absolute inset-0 h-full w-full"
          colors={["#6366f1", "#a855f7", "#38bdf8"]}
          speed={0.25}
          grain={0.35}
        />
        {/* Soft atmospheric gradient blur layer */}
        <div className="absolute -top-24 right-0 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-indigo-500/20 via-sky-400/15 to-purple-500/20 blur-[140px]" />
        <div className="absolute top-48 -right-12 h-[420px] w-[420px] rounded-full bg-gradient-to-bl from-orange-400/15 via-rose-400/15 to-amber-300/10 blur-[120px]" />
      </div>

      {/* Floating Glass Navigation Header with Use Cases dropdown */}
      <Header />

      {/* Main Content using Container */}
      <main className="relative z-10 flex-1 py-12 md:py-20">
        <Container className="space-y-16">
          {/* Hero Section */}
          <div className="max-w-4xl space-y-6 pt-4 sm:pt-8">
            <WordReveal as="h1" stagger={0.03} duration={1.4} start="top 90%">
              Create comprehensive brand guidelines in minutes with Brand
              <span className="font-heading text-5xl font-semibold text-primary lg:text-6xl">
                i
              </span>
              <span className="font-heading text-5xl font-semibold text-olive-400 lg:text-6xl">
                o
              </span>
              .
            </WordReveal>

            <WordReveal as="p" stagger={0.03} duration={1.4} start="top 90%">
              Brandio is your AI brand studio. Automatically generate and manage
              logo clearspace rules, accessible color palettes, typography
              systems, and exportable brand decks in one unified workspace.
            </WordReveal>

            {/* Hero CTA Action Buttons */}
            <div
              ref={ctaRef}
              className="flex flex-wrap items-center gap-4 pt-2"
            >
              <Button
                onClick={() => fileInputRef.current?.click()}
                variant={"shiny"}
                size={"pill"}
                gsapFill
                className={"hero-cta-btn rounded-full px-12! py-8!"}
              >
                Start building free
              </Button>

              <Button
                onClick={() => handleLaunchPreset("apex")}
                variant={"outline"}
                size={"pill"}
                gsapFill
                className={"hero-cta-btn rounded-full px-12! py-8!"}
                icon={<ArrowRightStroke />}
              >
                See use cases
              </Button>
            </div>
          </div>
        </Container>
      </main>
    </div>
  )
}
