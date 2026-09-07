/**
 * @file systems.tsx
 * @description Redirects /dashboard/systems to top-level /systems route.
 */

import { createFileRoute, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/dashboard/systems")({
  beforeLoad: () => {
    throw redirect({
      to: "/systems",
    })
  },
})

