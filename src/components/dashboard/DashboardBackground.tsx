import Auralis from "@/components/shared/Auralis"
import { cn } from "@/lib/utils"

const DASHBOARD_BACKGROUND_COLORS = ["#6366f1", "#a855f7", "#38bdf8"]

/**
 * Ambient visual background canvas for the main dashboard views.
 * Features:
 * - Auralis shader mesh with customizable speed, grain, and color gradients.
 * - Soft radial blurred ambient glow spheres.
 * - Non-interactive pointer-events-none layout.
 *
 * @component
 * @returns {React.ReactElement} The rendered ambient background.
 */

interface DashboardBackgroundProps {
  speed?: number
  grain?: number
  opacity?: string
  className?: string
  position?: "fixed" | "absolute"
}

export function DashboardBackground({
  opacity = "opacity-10",
  speed = 0.05,
  grain = 0.35,
  className = "",
  position = "fixed",
}: DashboardBackgroundProps) {
  return (
    <div
      className={cn(
        "pointer-events-none z-0 w-full overflow-hidden [mask-image:radial-gradient(ellipse_at_top,black_40%,transparent_85%)] opacity-70 dark:opacity-85",
        position === "fixed" ? "fixed inset-0 h-screen" : "absolute inset-0 h-full",
        className
      )}
    >
      <Auralis
        className={`absolute inset-0 h-full w-full ${opacity}`}
        colors={DASHBOARD_BACKGROUND_COLORS}
        speed={speed}
        grain={grain}
      />
      <div className="absolute -top-32 -left-20 h-[80vh] w-[80vw] rounded-full bg-linear-to-br from-indigo-500/20 via-sky-400/15 to-purple-500/20 blur-[150px]" />
      <div className="absolute -top-24 right-0 h-[80vh] w-[80vw] rounded-full bg-linear-to-bl from-orange-400/15 via-rose-400/15 to-amber-300/10 blur-[140px]" />
    </div>
  )
}

{
  /* <div className="pointer-events-none absolute top-0 right-0 z-0 h-screen w-full overflow-hidden [mask-image:radial-gradient(ellipse_at_top_right,black_35%,transparent_75%)] opacity-70 md:w-[60vw] dark:opacity-85">
        <Auralis
          className="absolute inset-0 h-full w-full"
          colors={["#6366f1", "#a855f7", "#38bdf8"]}
          speed={0.25}
          grain={0.35}
        />
        <div className="absolute -top-24 right-0 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-indigo-500/20 via-sky-400/15 to-purple-500/20 blur-[140px]" />
        <div className="absolute top-48 -right-12 h-[420px] w-[420px] rounded-full bg-gradient-to-bl from-orange-400/15 via-rose-400/15 to-amber-300/10 blur-[120px]" />
      </div> */
}
