/**
 * @file guidelines.tsx
 * @description Redirects /dashboard/guidelines to top-level /guidelines route.
 */

import { createFileRoute, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/dashboard/guidelines")({
  beforeLoad: () => {
    throw redirect({
      to: "/guidelines",
    })
  },
})

