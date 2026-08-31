"use client"

import * as React from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { cn } from "@/lib/utils"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

interface BlurRevealProps {
  text?: string
  children?: React.ReactNode
  className?: string
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "div"
  delay?: number
  stagger?: number
  duration?: number
  blurAmount?: number // in pixels, defaults to 12
  yOffset?: number // vertical translation, defaults to 20
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

const segmenter =
  typeof Intl !== "undefined" && "Segmenter" in Intl
    ? new Intl.Segmenter(undefined, { granularity: "grapheme" })
    : null

function splitGraphemes(str: string): Array<string> {
  if (segmenter) {
    return Array.from(segmenter.segment(str), (s) => s.segment)
  }
  // fallback for environments without Intl.Segmenter
  return Array.from(str)
}

function splitIntoCharacters(children: React.ReactNode): React.ReactNode {
  return React.Children.map(children, (child) => {
    if (child === null || child === undefined || typeof child === "boolean") {
      return null
    }

    if (typeof child === "string" || typeof child === "number") {
      const textVal = String(child)
      const words = textVal.split(/(\s+)/)
      return words.map((word, wordIndex) => {
        if (!word) return null
        if (/^\s+$/.test(word)) {
          return <span key={`space-${wordIndex}`}>{word}</span>
        }
        return (
          <span
            key={`word-${wordIndex}`}
            className="inline-block whitespace-nowrap"
          >
            {splitGraphemes(word).map((char, charIndex) => (
              <span
                key={`char-${charIndex}`}
                className="reveal-char inline-block origin-bottom will-change-[transform,opacity,filter]"
                style={{ opacity: 0 }}
              >
                {char}
              </span>
            ))}
          </span>
        )
      })
    }

    if (React.isValidElement(child)) {
      if (child.props && (child.props as any).children) {
        return React.cloneElement(
          child,
          { ...child.props },
          splitIntoCharacters((child.props as any).children)
        )
      }
      return child
    }

    return child
  })
}

export function BlurReveal({
  text,
  children,
  className = "",
  as = "p",
  delay = 0,
  stagger = 0.04,
  duration = 0.8,
  blurAmount = 12,
  yOffset = 20,
  start = "top 85%",
  trigger = null,
  active,
  disableScrollTrigger = false,
  retrigger = true,
}: BlurRevealProps) {
  const containerRef = React.useRef<HTMLElement>(null)
  const content = children !== undefined ? children : text || ""
  const stableText = React.useMemo(
    () => getTextFromChildren(content),
    [content]
  )

  React.useEffect(() => {
    if (!containerRef.current) return
    const container = containerRef.current
    const chars = container.querySelectorAll(".reveal-char")

    if (active !== undefined && !active) {
      gsap.killTweensOf(chars)
      gsap.set(chars, {
        opacity: 0,
        y: yOffset,
        filter: `blur(${blurAmount}px)`,
      })
      return
    }

    const resolvedTrigger =
      trigger && typeof trigger === "object" && "current" in trigger
        ? trigger.current
        : trigger

    const ctx = gsap.context(() => {
      const config: gsap.TweenVars = {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration,
        ease: "power2.out",
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

      gsap.fromTo(
        chars,
        {
          opacity: 0,
          y: yOffset,
          filter: `blur(${blurAmount}px)`,
        },
        config
      )
    }, container)

    return () => ctx.revert()
  }, [
    stableText,
    delay,
    stagger,
    duration,
    blurAmount,
    yOffset,
    start,
    trigger,
    active,
    disableScrollTrigger,
    retrigger,
  ])

  const Component = as

  return (
    <Component
      ref={containerRef as any}
      className={cn("inline-block", className)}
    >
      {splitIntoCharacters(content)}
    </Component>
  )
}

export default BlurReveal
