import AnimatedUnderline from "@/components/ui/animated-underline"
import Container from "@/components/ui/container"
import WordReveal from "@/components/shared/WordReveal"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { faqData } from "@/data/menu"
import { Plus } from "@boxicons/react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import * as React from "react"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

/**
 * Brand10 FAQ accordion section.
 * Displays a two-column layout with a title and description on the left,
 * and a collapsible accordion of frequently asked questions on the right.
 * Uses GSAP for smooth entrance animations.
 */
export const FAQSection = () => {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const accordionContainerRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    const ctx = gsap.context(() => {
      const items = accordionContainerRef.current?.querySelectorAll(
        ".faq-accordion-item"
      )
      if (items && items.length > 0) {
        gsap.fromTo(
          items,
          { y: 36, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: accordionContainerRef.current,
              start: "top 85%",
            },
            clearProps: "transform,opacity",
          }
        )
      }
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={containerRef} className="py-24">
      <Container>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-24">
          {/* Left Column */}
          <div className="faq-left-content flex flex-col justify-start gap-6 py-2">
            <div className="flex max-w-md flex-col gap-4">
              <WordReveal
                text={faqData.title}
                as="h3"
                trigger={containerRef.current}
                stagger={0.02}
                duration={1.1}
                start="top 90%"
              />
              <WordReveal
                text={faqData.description}
                as="p"
                trigger={containerRef.current}
                stagger={0.015}
                duration={1.2}
                start="top 90%"
              />
            </div>
          </div>

          {/* Right Column - Accordion */}
          <div
            ref={accordionContainerRef}
            className="faq-accordion-container flex flex-col"
          >
            <Accordion
              type="single"
              collapsible
              className="space-y-4 border-none"
            >
              {faqData.items.map((item, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="faq-accordion-item overflow-hidden rounded-2xl border transition-all duration-300"
                >
                  <AccordionTrigger
                    className="group flex w-full items-center justify-between text-left hover:no-underline"
                    icon={
                      <div className="flex h-8 w-8 items-center justify-center rounded-full border bg-neutral-200 transition-transform duration-300 group-aria-expanded/accordion-trigger:rotate-45 dark:border-neutral-800 dark:bg-card">
                        <Plus className="h-3! w-3!" />
                      </div>
                    }
                  >
                    <h6 className="max-w-[85%] font-normal">
                      <AnimatedUnderline>{item.question}</AnimatedUnderline>
                    </h6>
                  </AccordionTrigger>
                  <AccordionContent>
                    <p>{item.answer}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </Container>
    </section>
  )
}

export default FAQSection
