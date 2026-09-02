import { useAuthStore } from "@/store/authStore"
import { useProjectsStore } from "@/store/projectsStore"
import { IconCheck } from "@tabler/icons-react"
/**
 * Dashboard settings tab displaying workspace tier, quotas, and preferences.
 * Features:
 * - Active session information (auth email vs guest local storage).
 * - Quota usage meters for project limits.
 * - System feature switches and defaults overview.
 *
 * @component
 * @returns {React.ReactElement} The rendered settings panel tab.
 */
export function SettingsTab() {
  const auth = useAuthStore()
  const projectsStore = useProjectsStore()

  return (
    <div className="max-w-2xl space-y-6">
      <div className="border-b border-border/60 pb-3">
        <h2 className="font-heading text-xl font-bold tracking-tight text-foreground">
          Workspace &amp; Account Settings
        </h2>
        <p className="text-xs text-muted-foreground">
          Manage your subscription tier, brand asset defaults, and account
          details.
        </p>
      </div>

      <div className="space-y-4 rounded-3xl border border-border/80 bg-card p-7 text-card-foreground backdrop-blur-md dark:bg-card/70">
        <div className="flex items-center justify-between border-b border-border/60 pb-4">
          <div>
            <h4 className="text-sm font-semibold text-foreground">
              Active Account
            </h4>
            <p className="text-xs text-muted-foreground">
              {auth.user?.email || "Guest Session (Local Storage)"}
            </p>
          </div>
          <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-500">
            Active
          </span>
        </div>

        <div className="flex items-center justify-between border-b border-border/60 pb-4">
          <div>
            <h4 className="text-sm font-semibold text-foreground">
              Current Plan
            </h4>
            <p className="text-xs text-muted-foreground">
              Free Community Plan (2 brand projects limit)
            </p>
          </div>
          <span className="font-mono text-xs font-bold text-foreground">
            {projectsStore.projects.length} / 2 Used
          </span>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div>
            <h4 className="text-sm font-semibold text-foreground">
              Export PDF Engine
            </h4>
            <p className="text-xs text-muted-foreground">
              Vector SVG &amp; high-DPI raster compilation enabled
            </p>
          </div>
          <span className="flex items-center gap-1 text-xs font-medium text-emerald-500">
            <IconCheck size={16} /> Ready
          </span>
        </div>
      </div>
    </div>
  )
}
