import { createFileRoute, Navigate } from "@tanstack/react-router"

export const Route = createFileRoute("/dashboard/")({
  component: DashboardIndexRoute,
})

function DashboardIndexRoute() {
  return <Navigate to="/dashboard/projects" replace />
}
