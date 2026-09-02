import { IconLock } from "@tabler/icons-react"
import GlassPanel from "../shared/GlassPanel"

interface DashboardHeroProps {
  userEmail?: string
  projectCount: number
  isLimitReached: boolean
  onOpenCreateModal: () => void
}

/**
 * Header section for the main dashboard display.
 * Features:
 * - Dynamic warning banner when project creation tier limit is reached.
 * - GlassPanel styled visual alerts.
 *
 * @component
 * @param {DashboardHeroProps} props - The component props.
 * @param {string} [props.userEmail] - Current authenticated user email address.
 * @param {number} props.projectCount - Total number of user projects.
 * @param {boolean} props.isLimitReached - Whether the account is at project quota.
 * @param {() => void} props.onOpenCreateModal - Callback to trigger project creation.
 * @returns {React.ReactElement} The rendered dashboard hero section.
 */
export function DashboardHero({ isLimitReached }: DashboardHeroProps) {
  return (
    <div className="space-y-6 pt-12">
      {/* Limit Reached Warning Alert */}
      {isLimitReached && (
        <GlassPanel
          blur="none"
          noise
          noiseOpacity={0.02}
          className="flex items-center justify-between rounded-2xl border-amber-500/20 bg-amber-500/10 p-4 text-xs text-amber-600 dark:text-amber-300"
        >
          <div className="flex items-center gap-2.5">
            <IconLock size={18} className="text-amber-500" />
            <span>
              <strong>Project Limit Reached:</strong> Your account is currently
              at the 2-brand project maximum.
            </span>
          </div>
        </GlassPanel>
      )}
    </div>
  )
}
