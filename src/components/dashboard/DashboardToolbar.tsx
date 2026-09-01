import { Link } from "@tanstack/react-router"
import type { ReactNode } from "react"
import GlassPanel from "../shared/GlassPanel"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip"
import {
  AppsAlt,
  Cog,
  GridCircleDiagonalLeft,
  LayoutCheck,
  SparklesAlt,
} from "@boxicons/react"

interface DashboardRouteItem {
  to: string
  label: string
  icon: ReactNode
}

export const DASHBOARD_NAV_ROUTES: DashboardRouteItem[] = [
  {
    to: "/dashboard/projects",
    label: "Projects",
    icon: <GridCircleDiagonalLeft />,
  },
  {
    to: "/dashboard/templates",
    label: "Templates",
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

export function DashboardToolbar() {
  return (
    <nav
      aria-label="Dashboard bottom navigation"
      className="fixed bottom-6 left-1/2 z-40 -translate-x-1/2"
    >
      <TooltipProvider delay={100}>
        <GlassPanel
          blur="none"
          noise
          noiseOpacity={0.02}
          contentClassName="flex flex-row items-center gap-1.5 sm:gap-2"
          className="rounded-full border border-border/80 bg-card/85 p-3 backdrop-blur-xl"
        >
          <div className="flex flex-row items-center gap-6">
            {DASHBOARD_NAV_ROUTES.map((item) => (
              <Tooltip key={item.to}>
                <TooltipTrigger asChild>
                  <Link
                    to={item.to}
                    activeProps={{
                      className: "scale-105 bg-primary-900 text-background",
                    }}
                    inactiveProps={{
                      className:
                        "text-muted-foreground hover:bg-muted/80 hover:text-foreground",
                    }}
                    className="flex size-9 cursor-pointer items-center justify-center rounded-full p-2 transition-all duration-300"
                    aria-label={item.label}
                  >
                    {item.icon}
                  </Link>
                </TooltipTrigger>
                <TooltipContent
                  side="top"
                  sideOffset={14}
                  className="text-xs font-medium shadow-xl"
                >
                  {item.label}
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </GlassPanel>
      </TooltipProvider>
    </nav>
  )
}
