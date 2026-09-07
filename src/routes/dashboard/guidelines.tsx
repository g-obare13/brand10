/**
 * @file guidelines.tsx
 * @description Dashboard guidelines route rendering the brand architecture blueprint tab.
 */

import { createFileRoute } from "@tanstack/react-router"
import { GuidelinesTab } from "@/components/dashboard/tabs/GuidelinesTab"
import { useProjectsStore } from "@/store/projectsStore"

export const Route = createFileRoute("/dashboard/guidelines")({
  component: DashboardGuidelinesRoute,
})

/**
 * Dashboard guidelines view component connected to project creation actions.
 */
function DashboardGuidelinesRoute() {
  const openCreateModal = useProjectsStore((s) => s.openCreateModal)

  return <GuidelinesTab onOpenCreateModal={openCreateModal} />
}
