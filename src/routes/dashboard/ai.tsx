/**
 * @file ai.tsx
 * @description Dashboard AI assistance route rendering generation and extractor tools.
 */

import { createFileRoute } from "@tanstack/react-router"
import { AiAssistanceTab } from "@/components/dashboard/tabs/AiAssistanceTab"
import { useProjectsStore } from "@/store/projectsStore"

export const Route = createFileRoute("/dashboard/ai")({
  component: DashboardAiRoute,
})

/**
 * Dashboard AI assistance view component connected to project creation actions.
 */
function DashboardAiRoute() {
  const openCreateModal = useProjectsStore((s) => s.openCreateModal)

  return <AiAssistanceTab onOpenCreateModal={openCreateModal} />
}
