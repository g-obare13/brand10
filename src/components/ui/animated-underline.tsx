import * as React from "react"
import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { cn } from "@/lib/utils"

// Register scroll trigger if not done
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

interface AnimatedUnderlineProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode
  color?: string
  height?: string
  duration?: number
  ease?: string
  animation?: "left" | "center" | "flow"
  as?: "span" | "div" | "p" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "a"
  active?: boolean
}

export function AnimatedUnderline({
  children,
  className,
  color = "currentColor",
  height = "1px",
  duration = 0.75,
  ease = "power2.out",
  animation = "flow",
  as: Component = "span",
  active = false,
  ...props
}: AnimatedUnderlineProps) {
  const containerRef = useRef<any>(null)
  const hoverRef = useRef<any>(null)

  const hasLineClamp = className?.includes("line-clamp")

  useEffect(() => {
    const animTarget = containerRef.current
    const trigger = hoverRef.current
    if (!animTarget || !trigger) return

    gsap.killTweensOf(animTarget)

    if (active) {
      gsap.set(animTarget, {
        backgroundImage: `linear-gradient(${color}, ${color})`,
        backgroundPosition: "0% 100%",
        backgroundRepeat: "no-repeat",
        backgroundSize: `100% ${height}`,
      })
      return
    }

    // Set initial custom inline styles
    const initialPos = animation === "center" ? "50% 100%" : "0% 100%"
    gsap.set(animTarget, {
      backgroundImage: `linear-gradient(${color}, ${color})`,
      backgroundPosition: initialPos,
      backgroundRepeat: "no-repeat",
      backgroundSize: `0% ${height}`,
    })

    const onMouseEnter = () => {
      gsap.killTweensOf(animTarget)
      if (animation === "flow") {
        gsap.set(animTarget, { backgroundPosition: "0% 100%" })
      }
      gsap.to(animTarget, {
        backgroundSize: `100% ${height}`,
        duration: duration,
        ease: ease,
      })
    }

    const onMouseLeave = () => {
      gsap.killTweensOf(animTarget)
      if (animation === "flow") {
        // Change position to right so it retracts forward
        gsap.set(animTarget, { backgroundPosition: "100% 100%" })
        gsap.to(animTarget, {
          backgroundSize: `0% ${height}`,
          duration: duration,
          ease: ease,
        })
      } else {
        gsap.to(animTarget, {
          backgroundSize: `0% ${height}`,
          duration: duration,
          ease: ease,
        })
      }
    }

    trigger.addEventListener("mouseenter", onMouseEnter)
    trigger.addEventListener("mouseleave", onMouseLeave)

    return () => {
      trigger.removeEventListener("mouseenter", onMouseEnter)
      trigger.removeEventListener("mouseleave", onMouseLeave)
    }
  }, [active, animation, duration, ease, color, height])

  if (hasLineClamp) {
    return (
      <Component
        ref={hoverRef}
        className={cn("cursor-pointer pb-[3px]", className)}
        style={{
          ...props.style,
        }}
        {...props}
      >
        <span ref={containerRef} className="inline pb-0.5 [&_*]:inline">
          {children}
        </span>
      </Component>
    )
  }

  return (
    <Component
      ref={(el: any) => {
        containerRef.current = el
        hoverRef.current = el
      }}
      className={cn("inline cursor-pointer pb-0.5 [&_*]:inline", className)}
      style={{
        ...props.style,
      }}
      {...props}
    >
      {children}
    </Component>
  )
}

export default AnimatedUnderline
