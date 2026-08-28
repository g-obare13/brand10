"use client"

import React from "react"
import { LogoSvg } from "./LogoSvg"

export interface LogoProps {
  className?: string
  color?: string
}

/**
 * The primary branded Logo component for Kuzafy.
 * Wraps the LogoSvg with consistent styling and accessibility labels.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {string} [props.className=""] - CSS classes for the container and svg.
 * @param {string} [props.color] - Custom color override for the SVG.
 * @returns {React.ReactElement} The rendered logo.
 */
export const Logo: React.FC<LogoProps> = ({ className = "", color }) => {
  // const { theme } = useTheme();

  // const isDarkMode = theme === "dark";

  return (
    <div
      // to="/"
      className={`inline-block focus:ring-0 focus:outline-hidden ${className}`}
      aria-label="Kuzafy"
    >
      {/* {isDarkMode ? <LogoSvgLight /> : <LogoSvg />} */}
      <LogoSvg color={color} className={className} />
    </div>
  )
}
