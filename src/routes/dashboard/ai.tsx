import { createFileRoute } from "@tanstack/react-router"
import { AiAssistanceTab } from "@/components/dashboard/tabs/AiAssistanceTab"
import { useProjectsStore } from "@/store/projectsStore"

export const Route = createFileRoute("/dashboard/ai")({
  component: DashboardAiRoute,
})

function DashboardAiRoute() {
  const openCreateModal = useProjectsStore((s) => s.openCreateModal)

  return <AiAssistanceTab onOpenCreateModal={openCreateModal} />
}
