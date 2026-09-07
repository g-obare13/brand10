/**
 * @file projects.tsx
 * @description Primary dashboard workspace route displaying active brand projects.
 */

import { createFileRoute } from "@tanstack/react-router"
import { ProjectsTab } from "@/components/dashboard/tabs/ProjectsTab"
import { useProjectsStore } from "@/store/projectsStore"

export const Route = createFileRoute("/dashboard/projects")({
  component: DashboardProjectsRoute,
})

/**
 * Dashboard projects workspace view component.
 */
function DashboardProjectsRoute() {
  const openCreateModal = useProjectsStore((s) => s.openCreateModal)

  return <ProjectsTab onOpenCreateModal={openCreateModal} />
}
