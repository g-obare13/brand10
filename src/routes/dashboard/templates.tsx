import { createFileRoute } from "@tanstack/react-router"
import { TemplatesTab } from "@/components/dashboard/tabs/TemplatesTab"
import { useProjectsStore } from "@/store/projectsStore"

export const Route = createFileRoute("/dashboard/templates")({
  component: DashboardTemplatesRoute,
})

function DashboardTemplatesRoute() {
  const openCreateModal = useProjectsStore((s) => s.openCreateModal)

  return <TemplatesTab onOpenCreateModal={openCreateModal} />
}
