"use client"

import * as React from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}
interface WordRevealProps {
  text?: string
  children?: React.ReactNode
  className?: string
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "div"
  delay?: number
  stagger?: number
  duration?: number
  start?: string
  trigger?: string | Element | React.RefObject<Element | null> | null
  active?: boolean
  disableScrollTrigger?: boolean
  retrigger?: boolean
}

function getTextFromChildren(children: React.ReactNode): string {
  let text = ""
  React.Children.forEach(children, (child) => {
    if (typeof child === "string" || typeof child === "number") {
      text += child
    } else if (React.isValidElement(child) && (child.props as any)?.children) {
      text += getTextFromChildren((child.props as any).children)
    }
  })
  return text
}

function splitChildren(children: React.ReactNode): React.ReactNode {
  return React.Children.map(children, (child) => {
    if (child === null || child === undefined || typeof child === "boolean") {
      return null
    }

    if (typeof child === "string" || typeof child === "number") {
      const textVal = String(child)
      const parts = textVal.split(/(\s+)/)
      return parts.map((part, index) => {
        if (!part) return null
        if (/^\s+$/.test(part)) {
          return part
        }
        return (
          <span
            key={index}
            className="vertical-align-bottom inline-block overflow-hidden pb-[0.05em] font-[inherit] text-[inherit]"
          >
            <span
              className="reveal-word inline-block font-[inherit] text-[inherit]"
              style={{ opacity: 0 }}
            >
              {part}
            </span>
          </span>
        )
      })
    }

    if (React.isValidElement(child)) {
      if (child.props && (child.props as any).children) {
        return React.cloneElement(
          child,
          { ...child.props },
          splitChildren((child.props as any).children)
        )
      }
      return child
    }

    return child
  })
}

export function WordReveal({
  text,
  children,
  className = "",
  as = "p",
  delay = 0,
  stagger = 0.02,
  duration = 1.2,
  start = "top 85%",
  trigger = null,
  active,
  disableScrollTrigger = false,
  retrigger = true,
}: WordRevealProps) {
  const containerRef = React.useRef<HTMLElement>(null)
  const content = children !== undefined ? children : text || ""
  const stableText = React.useMemo(
    () => getTextFromChildren(content),
    [content]
  )

  React.useEffect(() => {
    if (!containerRef.current) return
    const container = containerRef.current
    const words = container.querySelectorAll(".reveal-word")

    if (active !== undefined && !active) {
      gsap.killTweensOf(words)
      gsap.set(words, { yPercent: 100, opacity: 0 })
      return
    }

    const resolvedTrigger =
      trigger && typeof trigger === "object" && "current" in trigger
        ? trigger.current
        : trigger

    const ctx = gsap.context(() => {
      const config: gsap.TweenVars = {
        yPercent: 0,
        opacity: 1,
        duration,
        ease: "power4.out",
        stagger,
        delay,
      }

      if (!disableScrollTrigger) {
        config.scrollTrigger = {
          trigger: resolvedTrigger || container,
          start,
          toggleActions: retrigger
            ? "restart none none reverse"
            : "play none none none",
        }
      }

      gsap.fromTo(words, { yPercent: 100, opacity: 0 }, config)
    }, container)

    return () => ctx.revert()
  }, [
    stableText,
    delay,
    stagger,
    duration,
    start,
    trigger,
    active,
    disableScrollTrigger,
    retrigger,
  ])

  const Component = as

  return (
    <Component ref={containerRef as any} className={className}>
      {splitChildren(content)}
    </Component>
  )
}

export default WordReveal
