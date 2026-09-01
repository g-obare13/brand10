import { IconLock, IconPlus } from "@tabler/icons-react"
import GlassPanel from "../shared/GlassPanel"
import WordReveal from "../shared/WordReveal"
import { Button } from "../ui/button"

interface DashboardHeroProps {
  userEmail?: string
  projectCount: number
  isLimitReached: boolean
  onOpenCreateModal: () => void
}

export function DashboardHero({
  userEmail,
  projectCount,
  isLimitReached,
  onOpenCreateModal,
}: DashboardHeroProps) {
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
