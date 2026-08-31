import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

const getElements = (
  targets: string | Element | Array<Element> | NodeListOf<Element>
): Array<Element> => {
  if (typeof window === "undefined" || !targets) return []
  if (typeof targets === "string") {
    return Array.from(document.querySelectorAll(targets))
  }
  if (targets instanceof NodeList || targets instanceof HTMLCollection) {
    return Array.from(targets)
  }
  if (Array.isArray(targets)) {
    return targets
  }
  if (typeof targets === "object" && "length" in targets) {
    return Array.from(targets as any)
  }
  return [targets]
}

export const animateFadeUp = (
  targets: string | Element | Array<Element> | NodeListOf<Element>,
  options?: {
    y?: number
    duration?: number
    stagger?: number
    delay?: number
    ease?: string
    trigger?: string | Element | null
    start?: string
    end?: string
    scrub?: boolean | number
    retrigger?: boolean
  }
) => {
  const elements = getElements(targets)
  if (elements.length === 0) return

  const {
    y = 40,
    duration = 1.5,
    stagger = 0,
    delay = 0,
    ease = "expo.out",
    trigger,
    start = "top 80%",
    end,
    scrub,
    retrigger,
  } = options || {}

  const config: gsap.TweenVars = {
    y: 0,
    opacity: 1,
    duration,
    stagger: stagger > 0 ? stagger : undefined,
    ease,
    delay,
  }

  if (trigger) {
    if (typeof trigger === "string" && !document.querySelector(trigger)) {
      // If trigger is a selector and doesn't exist, don't use scrollTrigger to avoid warnings
    } else {
      config.scrollTrigger = {
        trigger,
        start,
        ...(end && { end }),
        ...(scrub !== undefined && { scrub }),
        ...(retrigger && { toggleActions: "restart none none reverse" }),
      }
    }
  }

  return gsap.fromTo(elements, { y, opacity: 0 }, config)
}

export const animateFadeIn = (
  targets: string | Element | Array<Element> | NodeListOf<Element>,
  options?: {
    duration?: number
    delay?: number
    ease?: string
    trigger?: string | Element | null
    start?: string
    end?: string
    scrub?: boolean | number
    retrigger?: boolean
  }
) => {
  const elements = getElements(targets)
  if (elements.length === 0) return

  const {
    duration = 1,
    delay = 0,
    ease = "power2.out",
    trigger,
    start = "top 80%",
    end,
    scrub,
    retrigger,
  } = options || {}

  const config: gsap.TweenVars = {
    opacity: 1,
    duration,
    ease,
    delay,
  }

  if (trigger) {
    if (typeof trigger === "string" && !document.querySelector(trigger)) {
      // Avoid missing trigger warnings
    } else {
      config.scrollTrigger = {
        trigger,
        start,
        ...(end && { end }),
        ...(scrub !== undefined && { scrub }),
        ...(retrigger && { toggleActions: "restart none none reverse" }),
      }
    }
  }

  return gsap.fromTo(elements, { opacity: 0 }, config)
}

export const animateParallax = (
  targets: string | Element | Array<Element> | NodeListOf<Element>,
  options: {
    yPercent?: number
    trigger: string | Element | null
    start?: string
    end?: string
    scrub?: boolean | number
    ease?: string
    retrigger?: boolean
  }
) => {
  const elements = getElements(targets)
  if (elements.length === 0) return

  const {
    yPercent = 20,
    trigger,
    start = "top top",
    end = "bottom top",
    scrub = true,
    ease = "none",
    retrigger,
  } = options

  if (
    trigger &&
    typeof trigger === "string" &&
    !document.querySelector(trigger)
  ) {
    return
  }

  return gsap.to(elements, {
    yPercent,
    ease,
    scrollTrigger: {
      trigger,
      start,
      end,
      scrub,
      ...(retrigger && { toggleActions: "restart none none reverse" }),
    },
  })
}

export const animateScaleIn = (
  targets: string | Element | Array<Element> | NodeListOf<Element>,
  options?: {
    scale?: number
    duration?: number
    ease?: string
    delay?: number
  }
) => {
  const elements = getElements(targets)
  if (elements.length === 0) return

  const {
    scale = 1.1,
    duration = 2.5,
    ease = "expo.out",
    delay = 0,
  } = options || {}

  return gsap.fromTo(elements, { scale }, { scale: 1, duration, ease, delay })
}

export const animateTextColor = (
  targets: string | Element | Array<Element> | NodeListOf<Element>,
  options: {
    color: string
    trigger: string | Element | null
    start?: string
    end?: string
    scrub?: boolean | number
  }
) => {
  const elements = getElements(targets)
  if (elements.length === 0) return

  const {
    color,
    trigger,
    start = "top center",
    end = "center center",
    scrub = true,
  } = options

  if (
    trigger &&
    typeof trigger === "string" &&
    !document.querySelector(trigger)
  ) {
    return
  }

  return gsap.to(elements, {
    color,
    scrollTrigger: {
      trigger,
      start,
      end,
      scrub,
    },
  })
}

export const animateWordReveal = (
  targets: string | Element | Array<Element> | NodeListOf<Element>,
  options?: {
    duration?: number
    stagger?: number
    delay?: number
    ease?: string
    trigger?: string | Element | null
    start?: string
    retrigger?: boolean
  }
) => {
  const elements = getElements(targets)
  if (elements.length === 0) return

  const {
    duration = 1.2,
    stagger = 0.02,
    delay = 0,
    ease = "power4.out",
    trigger,
    start = "top 85%",
    retrigger,
  } = options || {}

  elements.forEach((el) => {
    if (!(el instanceof HTMLElement)) return
    const originalText = el.textContent || ""
    if (!originalText.trim()) return

    const words = originalText.split(" ")
    el.innerHTML = ""

    words.forEach((word) => {
      const wrapper = document.createElement("span")
      wrapper.style.display = "inline-block"
      wrapper.style.overflow = "hidden"
      wrapper.style.marginRight = "0.25em"
      wrapper.style.paddingBottom = "0.05em"

      const inner = document.createElement("span")
      inner.className = "reveal-word-js"
      inner.style.display = "inline-block"
      inner.style.transform = "translateY(100%)"
      inner.textContent = word

      wrapper.appendChild(inner)
      el.appendChild(wrapper)
    })

    const innerWords = el.querySelectorAll(".reveal-word-js")

    if (
      trigger &&
      typeof trigger === "string" &&
      !document.querySelector(trigger)
    ) {
      // Skip if trigger doesn't exist
      return
    }

    gsap.fromTo(
      innerWords,
      { yPercent: 100 },
      {
        yPercent: 0,
        duration,
        ease,
        stagger,
        delay,
        scrollTrigger: {
          trigger: trigger || el,
          start,
          toggleActions: retrigger
            ? "restart none none reverse"
            : "play none none none",
        },
      }
    )
  })
}

export const animateHoverCircleFill = (
  targets: string | Element | Array<Element> | NodeListOf<Element>,
  options?: {
    fillColor?: "foreground" | "primary" | string
  }
) => {
  const elements = getElements(targets)
  if (elements.length === 0) return

  const { fillColor = "foreground" } = options || {}

  let mappedColor = fillColor
  if (fillColor === "foreground") {
    mappedColor = "var(--foreground)"
  } else if (fillColor === "primary") {
    mappedColor = "var(--primary)"
  }

  const cleanups = elements.map((el) => {
    if (!(el instanceof HTMLElement)) return () => {}

    // Ensure container styling is correct
    el.style.position = "relative"
    el.style.overflow = "hidden"

    // Get or create fill span
    let fill = el.querySelector<HTMLElement>("[data-fill]")
    if (!fill) {
      fill = document.createElement("div")
      fill.setAttribute("data-fill", "")
      fill.style.pointerEvents = "none"
      fill.style.position = "absolute"
      fill.style.inset = "0"
      fill.style.width = "100%"
      fill.style.height = "100%"
      fill.style.zIndex = "1"
      fill.style.display = "block"
      fill.style.setProperty("clip-path", "circle(0% at 50% 50%)")
      fill.style.setProperty("-webkit-clip-path", "circle(0% at 50% 50%)")
      fill.style.backgroundColor = mappedColor
      el.insertBefore(fill, el.firstChild)
    } else {
      fill.style.backgroundColor = mappedColor
    }

    // Ensure other direct children are on top (z-index)
    Array.from(el.children).forEach((child) => {
      if (child !== fill && child instanceof HTMLElement) {
        if (!child.style.position || child.style.position === "static") {
          child.style.position = "relative"
        }
        child.style.zIndex = "2"
      }
    })

    const onMouseEnter = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      gsap.killTweensOf(fill)
      gsap.set(fill, {
        clipPath: `circle(0% at ${x}px ${y}px)`,
        webkitClipPath: `circle(0% at ${x}px ${y}px)`,
      })
      gsap.to(fill, {
        clipPath: `circle(150% at ${x}px ${y}px)`,
        webkitClipPath: `circle(150% at ${x}px ${y}px)`,
        duration: 0.6,
        ease: "power4.out",
      })
    }

    const onMouseLeave = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      gsap.killTweensOf(fill)
      gsap.to(fill, {
        clipPath: `circle(0% at ${x}px ${y}px)`,
        webkitClipPath: `circle(0% at ${x}px ${y}px)`,
        duration: 0.45,
        ease: "power3.inOut",
      })
    }

    el.addEventListener("mouseenter", onMouseEnter)
    el.addEventListener("mouseleave", onMouseLeave)

    return () => {
      el.removeEventListener("mouseenter", onMouseEnter)
      el.removeEventListener("mouseleave", onMouseLeave)
    }
  })

  // Return a single cleanup function for all targets
  return () => {
    cleanups.forEach((cleanup) => cleanup())
  }
}
