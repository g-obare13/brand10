/**
 * @file templates.tsx
 * @description Redirects legacy /dashboard/templates route to /dashboard/systems.
 */

import { createFileRoute, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/dashboard/templates")({
  beforeLoad: () => {
    throw redirect({
      to: "/dashboard/systems",
    })
  },
})
