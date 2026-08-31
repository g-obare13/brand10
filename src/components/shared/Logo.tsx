"use client"

import React from "react"
import { LogoSvg } from "./LogoSvg"
import { LogoSvgLight } from "./LogoSvgLight"
import { useTheme } from "./theme-provider"

export interface LogoProps {
  className?: string
  color?: string
}

/**
 * The primary branded Logo component for Kuzafy.
 * Uses LogoSvg for light mode and LogoSvgLight for dark mode.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {string} [props.className="h-8 w-auto"] - CSS classes for the container and svg.
 * @param {string} [props.color] - Custom color override for the SVG.
 * @returns {React.ReactElement} The rendered logo.
 */
export const Logo: React.FC<LogoProps> = ({ className = "h-8 w-auto", color }) => {
  const { theme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const isDark =
    mounted &&
    (theme === "dark" ||
      (theme === "system" &&
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches))

  return (
    <div
      className={`inline-flex items-center focus:ring-0 focus:outline-hidden ${className}`}
      aria-label="Kuzafy Logo"
    >
      {isDark ? (
        <LogoSvgLight color={color} className="w-full h-full" />
      ) : (
        <LogoSvg color={color} className="w-full h-full" />
      )}
    </div>
  )
}
