/**
 * @file router.tsx
 * @description Factory for TanStack Router instance with full TypeScript route-tree
 * integration, intent preloading, and scroll restoration.
 */

import { createRouter as createTanStackRouter } from "@tanstack/react-router"
import { routeTree } from "./routeTree.gen"

/**
 * Creates and configures the application router instance.
 *
 * @returns Configured TanStack Router with registered route definitions.
 */
export function getRouter() {
  const router = createTanStackRouter({
    routeTree,

    scrollRestoration: true,
    defaultPreload: "intent",
    defaultPreloadStaleTime: 0,
  })

  return router
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof getRouter>
  }
}
