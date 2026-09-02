import { createFileRoute } from "@tanstack/react-router"
import { ProjectsTab } from "@/components/dashboard/tabs/ProjectsTab"
import { useProjectsStore } from "@/store/projectsStore"

export const Route = createFileRoute("/dashboard/projects")({
  component: DashboardProjectsRoute,
})

function DashboardProjectsRoute() {
  const openCreateModal = useProjectsStore((s) => s.openCreateModal)

  return <ProjectsTab onOpenCreateModal={openCreateModal} />
}
