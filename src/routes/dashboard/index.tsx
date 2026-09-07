/**
 * @file index.tsx
 * @description Root dashboard route index redirecting directly to the primary projects tab.
 */

import { createFileRoute, Navigate } from "@tanstack/react-router"

export const Route = createFileRoute("/dashboard/")({
  component: DashboardIndexRoute,
})

/**
 * Dashboard index component redirecting to /dashboard/projects.
 */
function DashboardIndexRoute() {
  return <Navigate to="/dashboard/projects" replace />
}
