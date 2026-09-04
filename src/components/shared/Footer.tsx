import { Behance, Dribbble, Github, GlobeAlt, Linkedin } from "@boxicons/react"
import { gsap } from "gsap"
import * as React from "react"
import { animateFadeUp } from "@/lib/gsap-animations"
import Container from "@/components/ui/container"
import { Button } from "@/components/ui/button"

/**
 * Brand10 site footer.
 * Renders the logo, description, link groups with navigation items,
 * copyright notice, and a large decorative brand name. Uses GSAP for
 * staggered fade-up and scroll-triggered animations.
 */
export function Footer() {
  const containerRef = React.useRef<HTMLElement>(null)

  React.useEffect(() => {
    const ctx = gsap.context(() => {
      // Fade up footer content in stagger
      animateFadeUp(".footer-cta, .footer-link-col, .footer-bottom-row", {
        y: 40,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
        trigger: containerRef.current,
        retrigger: true,
        start: "top 80%",
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  const socialLinks = [
    {
      icon: <GlobeAlt className="h-5 w-5" />,
      href: "https://obare27.com",
      label: "Portfolio",
    },
    {
      icon: <Linkedin className="h-5 w-5" />,
      href: "https://www.linkedin.com/in/obare13",
      label: "LinkedIn",
    },
    {
      icon: <Github className="h-5 w-5" />,
      href: "https://github.com/g-obare13",
      label: "LinkedIn",
    },
    {
      icon: <Dribbble className="h-5 w-5" />,
      href: "https://dribbble.com/Obare13",
      label: "Dribbble",
    },
    {
      icon: <Behance className="h-5 w-5" />,
      href: "http://behance.net/obare13",
      label: "Behance",
    },
  ]

  return (
    <footer
      ref={containerRef}
      className="overflow-hidden bg-background pt-24 pb-8"
    >
      <Container className="space-y-20">
        {/* Top Content: CTA Left, Links Right */}
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-3 lg:gap-8">
          {/* Left CTA */}
          <div className="footer-cta space-y-8">
            {/* Giant Logo */}
            <div className="shrink-0 leading-none select-none">
              <h2>Brand10</h2>
            </div>
            {/* <div className="w-fit border-b! border-foreground pt-4">
              <Button
                variant={"ghost"}
                size={"pill"}
                gsapSlideText
                href="/creative-agency/contact"
                icon={<IconArrowRight />}
                className={"bg-transparent!"}
              >
                Schedule a Free Call
              </Button>
            </div> */}
          </div>

          {/* Vertical Socials Column */}
          <div className="footer-link-col items-center justify-center space-y-5">
            <ul className="mx-auto grid w-3/4 grid-cols-5 gap-3">
              {socialLinks.map((social, index) => (
                <li key={index}>
                  <a href={social.href} target="_blank">
                    <Button
                      variant={"outline"}
                      className={"size-12 rounded-full"}
                      gsapFill
                      aria-label={social.label}
                    >
                      {social.icon}
                    </Button>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-link-col space-y-5">
            {/* Copyright/Credits */}
            <div className="space-y-2 text-left text-xs font-medium text-muted-foreground md:text-right">
              <p>© {new Date().getFullYear()} Brand10. All Rights Reserved.</p>
              <p>
                Design by{" "}
                <span className="font-semibold text-foreground">Obare</span> •
                Powered by{" "}
                <span className="font-semibold text-foreground">Brand10</span>
              </p>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  )
}

export default Footer
