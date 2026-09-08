/**
 * @file dashboard.tsx
 * @description Master layout wrapper for all dashboard tab views (/dashboard/*).
 */

import { createFileRoute, Outlet } from "@tanstack/react-router"
import { useEffect } from "react"
import {
  CreateProjectModal,
  DashboardHero,
  DashboardToolbar,
} from "@/components/dashboard"
import { Header } from "@/components/shared/Header"
import Container from "@/components/ui/container"
import { useAuthStore } from "@/store/authStore"
import { useProjectsStore } from "@/store/projectsStore"
import { DEFAULT_OG_IMAGE, DEFAULT_OG_IMAGE_ALT, SITE_URL } from "@/data/seo"

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      {
        title: "Dashboard | Brand10",
      },
      {
        name: "description",
        content:
          "Manage, customize, and view all your brand guidelines, design projects, and live tokens in one central dashboard.",
      },
      {
        property: "og:title",
        content: "Dashboard | Brand10",
      },
      {
        property: "og:description",
        content:
          "Manage, customize, and view all your brand guidelines, design projects, and live tokens in one central dashboard.",
      },
      {
        property: "og:url",
        content: `${SITE_URL}/dashboard`,
      },
      {
        property: "og:image",
        content: DEFAULT_OG_IMAGE,
      },
      {
        property: "og:image:secure_url",
        content: DEFAULT_OG_IMAGE,
      },
      {
        name: "twitter:card",
        content: "summary_large_image",
      },
      {
        name: "twitter:title",
        content: "Dashboard | Brand10",
      },
      {
        name: "twitter:description",
        content:
          "Manage, customize, and view all your brand guidelines, design projects, and live tokens in one central dashboard.",
      },
      {
        name: "twitter:image",
        content: DEFAULT_OG_IMAGE,
      },
      {
        name: "twitter:image:alt",
        content: DEFAULT_OG_IMAGE_ALT,
      },
    ],
    links: [
      {
        rel: "canonical",
        href: `${SITE_URL}/dashboard`,
      },
    ],
  }),
  component: DashboardLayout,
})

/**
 * Master layout wrapper for all dashboard tab views (/dashboard/*).
 * Features:
 * - Dynamic ambient WebGL background and global application header.
 * - Project quota and limit calculation passed into DashboardHero.
 * - Bottom floating navigation dock for sub-routes.
 * - Global CreateProjectModal mount point.
 *
 * @component
 * @returns {React.ReactElement} The dashboard layout shell.
 */
function DashboardLayout() {
  const authUserId = useAuthStore((state) => state.user?.id)
  const authUserEmail = useAuthStore((state) => state.user?.email)
  const authLoading = useAuthStore((state) => state.loading)
  const initializeAuth = useAuthStore((state) => state.initialize)
  const projectCount = useProjectsStore((state) => state.projects.length)
  const isCreateModalOpen = useProjectsStore((state) => state.isCreateModalOpen)
  const openCreateModal = useProjectsStore((state) => state.openCreateModal)
  const closeCreateModal = useProjectsStore((state) => state.closeCreateModal)
  const fetchProjects = useProjectsStore((state) => state.fetchProjects)

  useEffect(() => {
    initializeAuth()
  }, [initializeAuth])

  useEffect(() => {
    if (!authLoading) {
      fetchProjects(authUserId)
    }
  }, [authLoading, authUserId, fetchProjects])

  const isLimitReached = projectCount >= 2

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-background text-foreground transition-colors duration-200 selection:bg-primary/20 selection:text-primary">
      {/* Dynamic WebGL Aurora Ambient Glow */}
      {/* <DashboardBackground /> */}

      {/* Navigation Header */}
      <Header action="logout" />

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 pt-8 pb-32 md:pt-12">
        <Container className="space-y-12">
          <DashboardHero
            userEmail={authUserEmail}
            projectCount={projectCount}
            isLimitReached={isLimitReached}
            onOpenCreateModal={openCreateModal}
          />

          {/* Child Route Content */}
          <Outlet />
        </Container>
      </main>

      {/* Floating Bottom Center Toolbar with Direct Route Links */}
      <DashboardToolbar />

      {/* Create Project Modal */}
      <CreateProjectModal
        isOpen={isCreateModalOpen}
        onClose={closeCreateModal}
      />
    </div>
  )
}
