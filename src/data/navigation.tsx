/**
 * @file navigation.tsx
 * @description Centralized navigation definitions, route permissions,
 * studio workspace tabs, and dashboard navigation items.
 */

import type { ReactNode } from "react"
import {
  IconSparkles,
  IconVectorBezier2,
  IconPalette,
  IconTypography,
  IconDevices,
} from "@tabler/icons-react"
import {
  AppsAlt,
  Cog,
  GridCircleDiagonalLeft,
  LayoutCheck,
  SparklesAlt,
} from "@boxicons/react"

/**
 * Publicly accessible route paths bypassing mandatory authentication guards.
 */
export const PUBLIC_ROUTES = [
  "/",
  "/login",
  "/auth/callback",
  "/insights",
  "/templates",
] as const

/**
 * Studio workspace navigation tab identifiers.
 */
export type StudioTab =
  | "overview"
  | "logo"
  | "colors"
  | "typography"
  | "mockups"

/**
 * Studio workspace navigation tab item specification.
 */
export interface StudioTabItem {
  id: StudioTab
  label: string
  icon: ReactNode
}

/**
 * Studio editor navigation tab configurations.
 */
export const STUDIO_TABS: StudioTabItem[] = [
  {
    id: "overview",
    label: "Strategy & Tone",
    icon: <IconSparkles size={18} />,
  },
  {
    id: "logo",
    label: "Logo System",
    icon: <IconVectorBezier2 size={18} />,
  },
  {
    id: "colors",
    label: "Color Matrix",
    icon: <IconPalette size={18} />,
  },
  {
    id: "typography",
    label: "Typography",
    icon: <IconTypography size={18} />,
  },
  {
    id: "mockups",
    label: "Brand Showcase",
    icon: <IconDevices size={18} />,
  },
]

/**
 * Dashboard route navigation item specification.
 */
export interface DashboardRouteItem {
  to: string
  label: string
  icon: ReactNode
}

/**
 * Primary dashboard navigation route items.
 */
export const DASHBOARD_NAV_ROUTES: DashboardRouteItem[] = [
  {
    to: "/dashboard/projects",
    label: "Projects",
    icon: <GridCircleDiagonalLeft />,
  },
  {
    to: "/dashboard/systems",
    label: "Systems",
    icon: <AppsAlt />,
  },
  {
    to: "/dashboard/guidelines",
    label: "Guidelines",
    icon: <LayoutCheck />,
  },
  {
    to: "/dashboard/ai",
    label: "AI Assistance",
    icon: <SparklesAlt />,
  },
  {
    to: "/dashboard/settings",
    label: "Settings",
    icon: <Cog />,
  },
]
