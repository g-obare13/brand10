/**
 * @file settings.tsx
 * @description Dashboard settings route for account, studio, and team preferences.
 */

import { createFileRoute } from "@tanstack/react-router"
import { SettingsTab } from "@/components/dashboard/tabs/SettingsTab"

export const Route = createFileRoute("/dashboard/settings")({
  component: DashboardSettingsRoute,
})

/**
 * Dashboard settings view component.
 */
function DashboardSettingsRoute() {
  return <SettingsTab />
}
