/**
 * @file systems.tsx
 * @description Dashboard systems route displaying world-class design systems and brand style guides.
 */

import { createFileRoute } from "@tanstack/react-router"
import { SystemsTab } from "@/components/dashboard/tabs/SystemsTab"
import { useProjectsStore } from "@/store/projectsStore"

export const Route = createFileRoute("/dashboard/systems")({
  head: () => ({
    meta: [
      {
        title: "Design Systems & Guidelines | Brand10",
      },
      {
        name: "description",
        content:
          "Explore world-class living design systems and brand style guides from leading industry pioneers.",
      },
    ],
  }),
  component: DashboardSystemsRoute,
})

/**
 * Dashboard systems view component.
 */
function DashboardSystemsRoute() {
  const openCreateModal = useProjectsStore((s) => s.openCreateModal)

  return <SystemsTab onOpenCreateModal={openCreateModal} />
}
