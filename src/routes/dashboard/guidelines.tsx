import { createFileRoute } from "@tanstack/react-router"
import { GuidelinesTab } from "@/components/dashboard/tabs/GuidelinesTab"
import { useProjectsStore } from "@/store/projectsStore"

export const Route = createFileRoute("/dashboard/guidelines")({
  component: DashboardGuidelinesRoute,
})

function DashboardGuidelinesRoute() {
  const openCreateModal = useProjectsStore((s) => s.openCreateModal)

  return <GuidelinesTab onOpenCreateModal={openCreateModal} />
}
