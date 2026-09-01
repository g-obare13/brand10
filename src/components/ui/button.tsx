"use client"

import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { Link } from "@tanstack/react-router"
import gsap from "gsap"
import * as React from "react"
import { buttonVariants } from "./button-variants"
import type { VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Loader } from "@/components/ui/loader"

type ColorVariant = "primary" | "emerald" | "purple" | "orange"

interface GradientColors {
  dark: {
    border: string
    overlay: string
    accent: string
    text: string
    glow: string
    textGlow: string
    hover: string
  }
  light: {
    border: string
    base: string
    overlay: string
    accent: string
    text: string
    glow: string
    hover: string
  }
}

const gradientColors: Record<ColorVariant, GradientColors> = {
  primary: {
    dark: {
      border: "from-primary-700 via-neutral-950 to-primary-800",
      overlay: "from-primary-800/40 via-neutral-950 to-primary-950/30",
      accent: "from-primary-400/10 via-neutral-950 to-primary-900/50",
      text: "from-primary-200 to-primary-300",
      glow: "color-mix(in_srgb,var(--palette-500)_10%,transparent)",
      textGlow: "color-mix(in_srgb,var(--palette-400)_40%,transparent)",
      hover: "from-primary-900/20 via-primary-500/10 to-primary-900/20",
    },
    light: {
      border: "from-primary-400 via-primary-300 to-primary-200",
      base: "from-primary-50 via-primary-50/80 to-primary-50/90",
      overlay: "from-primary-300/30 via-primary-200/20 to-primary-400/20",
      accent: "from-primary-400/20 via-primary-300/10 to-primary-200/30",
      text: "from-primary-700 to-primary-600",
      glow: "color-mix(in_srgb,var(--palette-500)_20%,transparent)",
      hover: "from-primary-300/30 via-primary-200/20 to-primary-300/30",
    },
  },
  emerald: {
    dark: {
      border: "from-[#336C4F] via-[#0C1F21] to-[#0D6437]",
      overlay: "from-[#347B52]/40 via-[#0C1F21] to-[#0D6437]/30",
      accent: "from-[#87F6B7]/10 via-[#0C1F21] to-[#17362A]/50",
      text: "from-[#8AEECA] to-[#73F8A8]",
      glow: "rgba(135,246,183,0.1)",
      textGlow: "rgba(135,246,183,0.4)",
      hover: "from-[#17362A]/20 via-[#87F6B7]/10 to-[#17362A]/20",
    },
    light: {
      border: "from-emerald-400 via-emerald-300 to-emerald-200",
      base: "from-emerald-50 via-emerald-50/80 to-emerald-50/90",
      overlay: "from-emerald-300/30 via-emerald-200/20 to-emerald-400/20",
      accent: "from-emerald-400/20 via-emerald-300/10 to-emerald-200/30",
      text: "from-emerald-700 to-emerald-600",
      glow: "rgba(52,211,153,0.2)",
      hover: "from-emerald-300/30 via-emerald-200/20 to-emerald-300/30",
    },
  },
  purple: {
    dark: {
      border: "from-[#6B46C1] via-[#0C1F21] to-[#553C9A]",
      overlay: "from-[#7E22CE]/40 via-[#0C1F21] to-[#6B46C1]/30",
      accent: "from-[#E9D8FD]/10 via-[#0C1F21] to-[#44337A]/50",
      text: "from-[#E9D8FD] to-[#D6BCFA]",
      glow: "rgba(159,122,234,0.1)",
      textGlow: "rgba(159,122,234,0.4)",
      hover: "from-[#44337A]/20 via-[#B794F4]/10 to-[#44337A]/20",
    },
    light: {
      border: "from-purple-400 via-purple-300 to-purple-200",
      base: "from-purple-50 via-purple-50/80 to-purple-50/90",
      overlay: "from-purple-300/30 via-purple-200/20 to-purple-400/20",
      accent: "from-purple-400/20 via-purple-300/10 to-purple-200/30",
      text: "from-purple-700 to-purple-600",
      glow: "rgba(159,122,234,0.2)",
      hover: "from-purple-300/30 via-purple-200/20 to-purple-300/30",
    },
  },
  orange: {
    dark: {
      border: "from-[#C05621] via-[#0C1F21] to-[#9C4221]",
      overlay: "from-[#DD6B20]/40 via-[#0C1F21] to-[#C05621]/30",
      accent: "from-[#FED7AA]/10 via-[#0C1F21] to-[#7B341E]/50",
      text: "from-[#FED7AA] to-[#FBD38D]",
      glow: "rgba(237,137,54,0.1)",
      textGlow: "rgba(237,137,54,0.4)",
      hover: "from-[#7B341E]/20 via-[#ED8936]/10 to-[#7B341E]/20",
    },
    light: {
      border: "from-orange-400 via-orange-300 to-orange-200",
      base: "from-orange-50 via-orange-50/80 to-orange-50/90",
      overlay: "from-orange-300/30 via-orange-200/20 to-orange-400/20",
      accent: "from-orange-400/20 via-orange-300/10 to-orange-200/30",
      text: "from-orange-700 to-orange-600",
      glow: "rgba(237,137,54,0.2)",
      hover: "from-orange-300/30 via-orange-200/20 to-orange-300/30",
    },
  },
}

interface ButtonProps
  extends
    React.ComponentPropsWithoutRef<typeof ButtonPrimitive>,
    VariantProps<typeof buttonVariants> {
  href?: string
  icon?: React.ElementType | React.ReactNode
  iconPlacement?: "left" | "right"
  hideIcon?: boolean
  showLine?: boolean
  loading?: boolean
  gsapFill?: boolean
  gsapMagnetic?: boolean
  gsapSlideText?: boolean
  gsapGlow?: boolean
  labelClassName?: string
  gradientColor?: ColorVariant
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      href,
      icon: Icon,
      iconPlacement = "right",
      hideIcon,
      showLine,
      loading = false,
      children,
      disabled,
      gsapFill,
      gsapMagnetic,
      gsapSlideText,
      gsapGlow,
      labelClassName,
      gradientColor = "primary",
      ...props
    },
    ref
  ) => {
    const isGradient = variant === "gradient"
    const colors = gradientColors[gradientColor]
    const isIconOnly = !children && (!!Icon || loading)
    const renderIcon = !hideIcon && (!!Icon || loading)

    const renderIconContent = (icon: any, iconClassName?: string) => {
      if (loading) {
        return <Loader size="sm" className={iconClassName} />
      }

      if (!icon) return null

      if (React.isValidElement(icon)) {
        return React.cloneElement(icon as any, {
          className: cn(
            (icon.props as any).className,
            iconClassName,
            "text-current [&_*]:stroke-current [&_*]:text-current"
          ),
        })
      }

      const IconComponent = icon

      return (
        <IconComponent
          className={cn(
            iconClassName,
            "text-current [&_*]:stroke-current [&_*]:text-current"
          )}
        />
      )
    }

    const iconElement = renderIcon && (
      <span
        className={cn(
          "relative z-10 inline-flex size-4 items-center justify-center",
          // For gradient: use a solid representative color instead of text-transparent
          isGradient
            ? cn(
                {
                  primary: "text-primary-300 dark:text-primary-200",
                  emerald: "text-emerald-600 dark:text-[#73F8A8]",
                  purple: "text-purple-600 dark:text-[#D6BCFA]",
                  orange: "text-orange-600 dark:text-[#FBD38D]",
                }[gradientColor]
              )
            : "text-current",
          iconPlacement === "left" ? "mr-1" : "ml-1"
        )}
      >
        {renderIconContent(Icon, "size-4")}
      </span>
    )

    const labelContent =
      gsapSlideText && children && typeof children === "string" ? (
        <span className="vertical-align-middle relative inline-block h-[1.25em] overflow-hidden leading-normal">
          <span data-text-primary className="block select-none">
            {children}
          </span>
          <span
            data-text-secondary
            className="absolute top-full left-0 block select-none"
          >
            {children}
          </span>
        </span>
      ) : (
        children
      )

    const content = isIconOnly ? (
      <span className="flex h-full w-full items-center justify-center text-current">
        {renderIconContent(Icon, "size-5")}
      </span>
    ) : isGradient ? (
      <>
        {/* Background borders and overlays for Gradient variant */}
        <div
          className={cn(
            "absolute inset-0 rounded-md bg-linear-to-b p-[2px]",
            "dark:bg-none",
            colors.light.border,
            colors.dark.border
          )}
        >
          <div
            className={cn(
              "absolute inset-0 rounded-md opacity-90",
              "bg-white/80",
              "dark:bg-[#0C1F21]"
            )}
          />
        </div>

        <div
          className={cn(
            "absolute inset-[2px] rounded-md opacity-95",
            "bg-white/80",
            "dark:bg-[#0C1F21]"
          )}
        />

        <div
          className={cn(
            "absolute inset-[2px] rounded-md bg-linear-to-r opacity-90",
            colors.light.base,
            "dark:from-[#0C1F21] dark:via-[#0C1F21] dark:to-[#0C1F21]"
          )}
        />
        <div
          className={cn(
            "absolute inset-[2px] rounded-md bg-linear-to-b opacity-80",
            colors.light.overlay,
            colors.dark.overlay
          )}
        />
        <div
          className={cn(
            "absolute inset-[2px] rounded-md bg-linear-to-br",
            colors.light.accent,
            colors.dark.accent
          )}
        />

        <div
          className={cn(
            "absolute inset-[2px] rounded-md",
            `shadow-[inset_0_0_10px_${colors.light.glow}]`,
            `dark:shadow-[inset_0_0_10px_${colors.dark.glow}]`
          )}
        />

        {/* Text/Label & Icons */}
        <div className="relative z-10 flex items-center justify-center gap-2">
          {iconPlacement === "left" && iconElement}
          <span
            className={cn(
              "bg-linear-to-b bg-clip-text font-medium text-transparent",
              colors.light.text,
              colors.dark.text,
              `dark:drop-shadow-[0_0_12px_${colors.dark.textGlow}]`,
              labelClassName
            )}
          >
            {loading ? "Saving..." : labelContent}
          </span>
          {iconPlacement === "right" && iconElement}
        </div>

        {/* Hover Overlay */}
        <div
          className={cn(
            "absolute inset-[2px] rounded-md bg-linear-to-r opacity-0 transition-opacity duration-300 group-hover:opacity-100",
            colors.light.hover,
            colors.dark.hover
          )}
        />
      </>
    ) : (
      <>
        {gsapFill && (
          <span
            data-fill
            className="pointer-events-none absolute inset-0 z-0 bg-foreground mix-blend-normal"
            style={{
              clipPath: "circle(0% at 50% 50%)",
            }}
          />
        )}

        {gsapGlow && (
          <span
            data-glow
            className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_120px_at_var(--x,0px)_var(--y,0px),var(--primary)_0%,transparent_100%)] opacity-0 mix-blend-screen transition-opacity duration-300"
            style={
              {
                "--x": "0px",
                "--y": "0px",
              } as React.CSSProperties
            }
          />
        )}

        {iconPlacement === "left" && iconElement}

        <span
          className={cn(
            "relative z-10 text-sm font-medium text-current",
            labelClassName
          )}
        >
          {loading ? "Saving..." : labelContent}
        </span>

        {iconPlacement === "right" && iconElement}

        {showLine && (
          <span className="absolute -bottom-1 left-0 z-0 h-[1.5px] w-full origin-left scale-x-0 bg-current transition-transform duration-300 group-hover/button:scale-x-100" />
        )}
      </>
    )

    const classes = cn(
      "group/button relative inline-flex items-center justify-center gap-2 overflow-hidden text-current no-underline transition-all duration-300",
      buttonVariants({ variant, size }),
      isIconOnly && "aspect-square justify-center px-0",
      className
    )

    const handleMouseEnter = (e: React.MouseEvent<HTMLElement>) => {
      if (gsapFill) {
        const fill = e.currentTarget.querySelector("[data-fill]")
        if (fill instanceof HTMLElement) {
          const rect = e.currentTarget.getBoundingClientRect()
          const x = e.clientX - rect.left
          const y = e.clientY - rect.top

          gsap.killTweensOf(fill)
          gsap.set(fill, {
            clipPath: `circle(0% at ${x}px ${y}px)`,
          })
          gsap.to(fill, {
            clipPath: `circle(150% at ${x}px ${y}px)`,
            duration: 0.6,
            ease: "power4.out",
          })
          gsap.set(e.currentTarget, { color: "var(--background)" })
        }
      }

      if (gsapSlideText) {
        const primary = e.currentTarget.querySelector("[data-text-primary]")
        const secondary = e.currentTarget.querySelector("[data-text-secondary]")
        if (primary && secondary) {
          gsap.killTweensOf([primary, secondary])
          gsap.to(primary, {
            yPercent: -100,
            duration: 0.3,
            ease: "power2.inOut",
          })
          gsap.to(secondary, {
            yPercent: -100,
            duration: 0.3,
            ease: "power2.inOut",
          })
        }
      }

      props.onMouseEnter?.(e as any)
    }

    const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
      const rect = e.currentTarget.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      if (gsapGlow) {
        const glow = e.currentTarget.querySelector("[data-glow]")
        if (glow instanceof HTMLElement) {
          glow.style.setProperty("--x", `${x}px`)
          glow.style.setProperty("--y", `${y}px`)
          gsap.to(glow, { opacity: 0.25, duration: 0.2 })
        }
      }

      if (gsapMagnetic) {
        const deltaX = x - rect.width / 2
        const deltaY = y - rect.height / 2
        gsap.to(e.currentTarget, {
          x: deltaX * 0.35,
          y: deltaY * 0.35,
          duration: 0.3,
          ease: "power2.out",
        })
      }

      props.onMouseMove?.(e as any)
    }

    const handleMouseLeave = (e: React.MouseEvent<HTMLElement>) => {
      if (gsapFill) {
        const fill = e.currentTarget.querySelector("[data-fill]")
        if (fill instanceof HTMLElement) {
          const rect = e.currentTarget.getBoundingClientRect()
          const x = e.clientX - rect.left
          const y = e.clientY - rect.top

          gsap.killTweensOf(fill)
          gsap.to(fill, {
            clipPath: `circle(0% at ${x}px ${y}px)`,
            duration: 0.45,
            ease: "power3.inOut",
          })
          gsap.set(e.currentTarget, { clearProps: "color" })
        }
      }

      if (gsapSlideText) {
        const primary = e.currentTarget.querySelector("[data-text-primary]")
        const secondary = e.currentTarget.querySelector("[data-text-secondary]")
        if (primary && secondary) {
          gsap.killTweensOf([primary, secondary])
          gsap.to(primary, { yPercent: 0, duration: 0.3, ease: "power2.inOut" })
          gsap.to(secondary, {
            yPercent: 0,
            duration: 0.3,
            ease: "power2.inOut",
          })
        }
      }

      if (gsapGlow) {
        const glow = e.currentTarget.querySelector("[data-glow]")
        if (glow instanceof HTMLElement) {
          gsap.to(glow, { opacity: 0, duration: 0.4 })
        }
      }

      if (gsapMagnetic) {
        gsap.to(e.currentTarget, {
          x: 0,
          y: 0,
          duration: 0.5,
          ease: "elastic.out(1.1, 0.4)",
        })
      }

      props.onMouseLeave?.(e as any)
    }

    if (href) {
      return (
        <Link
          to={href}
          className={classes}
          onMouseEnter={handleMouseEnter}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          {content}
        </Link>
      )
    }

    const { dangerouslySetInnerHTML, ...cleanProps } = props as any

    return (
      <ButtonPrimitive
        ref={ref}
        className={classes}
        disabled={disabled || loading}
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        {...cleanProps}
      >
        {content}
      </ButtonPrimitive>
    )
  }
)

Button.displayName = "Button"

export { Button }
