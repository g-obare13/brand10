/**
 * @file templates.tsx
 * @description Dashboard templates route displaying pre-configured brand archetypes.
 */

import { createFileRoute } from "@tanstack/react-router"
import { TemplatesTab } from "@/components/dashboard/tabs/TemplatesTab"
import { useProjectsStore } from "@/store/projectsStore"

export const Route = createFileRoute("/dashboard/templates")({
  component: DashboardTemplatesRoute,
})

/**
 * Dashboard templates view component.
 */
function DashboardTemplatesRoute() {
  const openCreateModal = useProjectsStore((s) => s.openCreateModal)

  return <TemplatesTab onOpenCreateModal={openCreateModal} />
}
