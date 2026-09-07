/**
 * @file ai.tsx
 * @description Redirects /dashboard/ai to top-level /ai route.
 */

import { createFileRoute, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/dashboard/ai")({
  beforeLoad: () => {
    throw redirect({
      to: "/ai",
    })
  },
})

