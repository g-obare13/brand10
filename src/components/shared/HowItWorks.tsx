"use client"

import { useRef, useEffect } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import Container from "@/components/ui/container"
import ImageComponentOptimized from "./ImageComponentOptimized"
import { Badge } from "@/components/ui/badge"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

export type Project = {
  title: string
  img: string
  link: string
  contribution: "contributed" | "led"
  leftText: string
  rightList: string[]
  location: string
  description: string
  stroke1: string
}

const DEFAULT_PROJECTS: Project[] = [
  {
    title: "Foundation & Logo",
    link: "#",
    contribution: "led",
    img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop",
    leftText: "Brand Identity",
    rightList: ["#svg-ingestion", "#brand-foundation", "#clearspace-rules"],
    location: "Step 01",
    description:
      "Upload your logo or vector SVG to automatically extract colors and geometry. Establish core values, tone ratings, design movements, and clearspace rules in minutes.",
    stroke1: "#101828",
  },
  {
    title: "Tokens & Typography",
    link: "#",
    contribution: "led",
    img: "https://images.unsplash.com/photo-1481437156560-3205f6a55735?q=80&w=3495&auto=format&fit=crop",
    leftText: "Design Systems",
    rightList: ["#color-palette", "#modular-typography", "#wcag-contrast"],
    location: "Step 02",
    description:
      "Generate accessible WCAG-compliant color palettes and responsive typography scales. Fine-tune contrast ratios, modular sizing, and photography art direction with live interactive previews.",
    stroke1: "#5B91FF",
  },
  {
    title: "Guidelines & Export",
    link: "#",
    contribution: "led",
    img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=3540&auto=format&fit=crop",
    leftText: "Asset Delivery",
    rightList: ["#pdf-brand-deck", "#tailwind-tokens", "#vector-packages"],
    location: "Step 03",
    description:
      "Instantly compile your living design system into exportable deliverables. Download print-ready PDF brand decks, production token bundles for Tailwind/CSS, and structured vector packages.",
    stroke1: "#E7EBEB",
  },
]

// Internal Project Card component
const Card = ({ item }: { item: Project; linkText?: string }) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="relative aspect-4/3 w-full overflow-hidden rounded-2xl border border-border/40 bg-muted/50">
        <ImageComponentOptimized
          src={item.img}
          alt={item.title}
          className="h-full w-full object-cover"
          imageClassName="h-full w-full object-cover"
        />
      </div>
      <div className="flex flex-col gap-2 px-2">
        <div className="flex items-center justify-between">
          <h4>{item.title}</h4>
          <span className="text-xs font-semibold tracking-wider text-primary uppercase">
            {item.leftText}
          </span>
        </div>
        <p className="text-muted-foreground">{item.description}</p>
      </div>
    </div>
  )
}

interface GsapProjectsSectionProps {
  projects?: Project[]
  title?: string
}

export default function HowItWorks({
  projects = DEFAULT_PROJECTS,
  title = "How It Works",
}: GsapProjectsSectionProps) {
  const container = useRef<HTMLDivElement>(null)

  const totalProjectCount = projects.length

  useEffect(() => {
    if (typeof window === "undefined" || window.innerWidth < 1024) return
    const spotlightSection = container.current
    if (!spotlightSection) return

    const ctx = gsap.context(() => {
      const projectIndex =
        spotlightSection.querySelector<HTMLElement>(".project-index h1")
      const projectImagesContainer =
        spotlightSection.querySelector<HTMLElement>(".project-images")
      const projectNamesContainer =
        spotlightSection.querySelector<HTMLElement>(".project-names")
      const projectNames = gsap.utils.toArray<HTMLElement>(".project-names p")

      if (
        !projectIndex ||
        !projectImagesContainer ||
        !projectNamesContainer ||
        totalProjectCount === 0
      )
        return

      let moveDistanceIndex = 0
      let moveDistanceNames = 0
      let moveDistanceImages = 0

      const calculateMetrics = () => {
        const spotlightSectionHeight = spotlightSection.offsetHeight
        const spotlightSectionPadding =
          parseFloat(getComputedStyle(spotlightSection).paddingTop) || 0
        const projectIndexHeight = projectIndex.offsetHeight
        const containerHeight = projectNamesContainer.offsetHeight
        const imagesHeight = projectImagesContainer.offsetHeight

        moveDistanceIndex =
          spotlightSectionHeight -
          spotlightSectionPadding * 2 -
          projectIndexHeight
        moveDistanceNames =
          spotlightSectionHeight - spotlightSectionPadding * 2 - containerHeight

        // Ensure image container moves appropriately
        moveDistanceImages = Math.min(
          window.innerHeight - imagesHeight,
          -(imagesHeight - window.innerHeight * 0.7)
        )
      }

      calculateMetrics()
      ScrollTrigger.addEventListener("refreshInit", calculateMetrics)

      const st = ScrollTrigger.create({
        trigger: spotlightSection,
        start: "top top",
        end: () => `+=${window.innerHeight * 2}px`,
        pin: true,
        pinSpacing: true,
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress
          const currentIndex = Math.min(
            Math.floor(progress * totalProjectCount) + 1,
            totalProjectCount
          )

          projectIndex.innerHTML = `${String(currentIndex).padStart(2, "0")}<span class="text-[28px] tracking-tight font-normal text-zinc-400">/${String(totalProjectCount).padStart(2, "0")}</span>`

          gsap.set(projectIndex, { y: progress * moveDistanceIndex })
          gsap.set(projectImagesContainer, { y: progress * moveDistanceImages })

          projectNames.forEach((p, index) => {
            const startProgress = index / totalProjectCount
            const endProgress = (index + 1) / totalProjectCount
            const projectProgress = Math.max(
              0,
              Math.min(
                1,
                (progress - startProgress) / (endProgress - startProgress)
              )
            )
            gsap.set(p, { y: -projectProgress * moveDistanceNames })

            if (projectProgress > 0 && projectProgress < 1) {
              gsap.set(p, { color: "white" })
            } else {
              gsap.set(p, { color: "gray" })
            }
          })
        },
      })

      return () => {
        ScrollTrigger.removeEventListener("refreshInit", calculateMetrics)
        st.kill()
      }
    }, container)

    return () => ctx.revert()
  }, [projects, totalProjectCount])

  return (
    <Container className="">
      <section
        className="relative w-full overflow-hidden pt-32 text-foreground max-lg:h-auto max-sm:pt-12"
        id="works"
      >
        <div className="relative mx-auto">
          <div className="absolute top-0 left-0 max-lg:static max-lg:mb-20 max-lg:px-0 max-md:mb-12">
            <h2 className="relative mb-[-13svh] inline-block uppercase max-lg:mb-0">
              {title}
            </h2>
          </div>
        </div>

        <div
          ref={container}
          className="relative mx-auto h-full min-h-svh w-full px-4 pt-36 pb-10 max-lg:min-h-auto max-lg:px-0 max-lg:pt-0 lg:px-12"
        >
          <div className="relative flex items-center justify-between max-lg:hidden">
            <div className="project-index z-50 text-white mix-blend-difference dark:text-black dark:mix-blend-normal">
              <h1 className="text-[140px] leading-none font-light tracking-tighter text-zinc-900 dark:text-zinc-50">
                01
                <span className="text-[28px] text-muted-foreground">
                  /0{projects.length}
                </span>
              </h1>
            </div>
          </div>

          <div className="project-images absolute top-0 left-1/2 z-10 flex w-[45%] -translate-x-1/2 flex-col gap-32 px-0 pt-[30svh] pb-[30svh] max-lg:static max-lg:w-full max-lg:translate-x-0 max-lg:gap-16 max-lg:py-0 max-lg:pt-0 max-md:gap-10">
            {projects.map((item) => (
              <Card key={item.title} item={item} linkText="VISIT" />
            ))}
          </div>

          <div className="project-names absolute right-8 bottom-8 flex translate-y-4 flex-col gap-2 text-2xl whitespace-nowrap text-zinc-400 max-lg:hidden">
            {projects.map(({ title }, i) => (
              <p
                key={i}
                className="font-medium text-zinc-300 transition-colors duration-300 data-[active=true]:text-zinc-900 dark:text-zinc-700 dark:data-[active=true]:text-zinc-100"
              >
                {title}
              </p>
            ))}
          </div>
        </div>
      </section>
    </Container>
  )
}
