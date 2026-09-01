import { createFileRoute } from "@tanstack/react-router"
import { SettingsTab } from "../../components/dashboard/tabs/SettingsTab"

export const Route = createFileRoute("/dashboard/settings")({
  component: DashboardSettingsRoute,
})

function DashboardSettingsRoute() {
  return <SettingsTab />
}
