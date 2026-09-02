import { createFileRoute, Outlet } from "@tanstack/react-router"
import { useEffect } from "react"
import {
  CreateProjectModal,
  DashboardBackground,
  DashboardHero,
  DashboardToolbar,
} from "../components/dashboard"
import { Header } from "../components/shared/Header"
import Container from "../components/ui/container"
import { useAuthStore } from "../store/authStore"
import { useProjectsStore } from "../store/projectsStore"

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
  const auth = useAuthStore()
  const projectsStore = useProjectsStore()

  useEffect(() => {
    auth.initialize().then(() => {
      projectsStore.fetchProjects(auth.user?.id)
    })
  }, [auth.user?.id])

  const isLimitReached = projectsStore.isLimitReached()

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-background text-foreground transition-colors duration-200 selection:bg-primary/20 selection:text-primary">
      {/* Dynamic WebGL Aurora Ambient Glow */}
      <DashboardBackground />

      {/* Navigation Header */}
      <Header action="logout" />

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 pt-8 pb-32 md:pt-12">
        <Container className="space-y-12">
          <DashboardHero
            userEmail={auth.user?.email}
            projectCount={projectsStore.projects.length}
            isLimitReached={isLimitReached}
            onOpenCreateModal={projectsStore.openCreateModal}
          />

          {/* Child Route Content */}
          <Outlet />
        </Container>
      </main>

      {/* Floating Bottom Center Toolbar with Direct Route Links */}
      <DashboardToolbar />

      {/* Create Project Modal */}
      <CreateProjectModal
        isOpen={projectsStore.isCreateModalOpen}
        onClose={projectsStore.closeCreateModal}
      />
    </div>
  )
}
