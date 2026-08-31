import React, { useEffect, useState } from 'react'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useAuthStore } from '../store/authStore'
import { useProjectsStore } from '../store/projectsStore'
import type { BrandProjectItem } from '../store/projectsStore'
import { Button } from '../components/ui/button'
import { Logo } from '../components/shared/Logo'
import { ThemeToggler } from '../components/shared/theme-toggler'
import {
  IconPlus,
  IconSparkles,
  IconTrash,
  IconCopy,
  IconArrowRight,
  IconLock,
  IconLogout,
  IconFolder,
} from '@tabler/icons-react'

export const Route = createFileRoute('/dashboard')({
  component: DashboardPage,
})

function DashboardPage() {
  const navigate = useNavigate()
  const auth = useAuthStore()
  const projectsStore = useProjectsStore()

  const [newProjectName, setNewProjectName] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [createError, setCreateError] = useState<string | null>(null)

  useEffect(() => {
    auth.initialize().then(() => {
      projectsStore.fetchProjects(auth.user?.id)
    })
  }, [auth.user?.id])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setCreateError(null)

    if (projectsStore.isLimitReached()) {
      setCreateError('You have reached the maximum limit of 2 brand projects.')
      return
    }

    const { project, error } = await projectsStore.createProject(newProjectName, auth.user?.id)
    if (error) {
      setCreateError(error)
    } else if (project) {
      setShowCreateModal(false)
      setNewProjectName('')
      navigate({
        to: '/studio/$projectId',
        params: { projectId: project.id },
      })
    }
  }

  const isLimitReached = projectsStore.isLimitReached()

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary/20 selection:text-primary transition-colors duration-200">
      {/* Top Navbar */}
      <header className="border-b border-border/70 bg-background/80 backdrop-blur sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 hover:opacity-90 transition-opacity">
            <Logo className="h-7 w-auto text-foreground" />
          </Link>

          <div className="flex items-center gap-3 sm:gap-4">
            <div className="text-xs text-muted-foreground hidden sm:block">
              {auth.user?.email ? (
                <span className="font-mono px-2.5 py-1 rounded-lg bg-muted/50 border border-border">{auth.user.email}</span>
              ) : (
                <span className="text-amber-500 dark:text-amber-400 font-medium px-2 py-0.5 rounded-md bg-amber-500/10">Guest Mode</span>
              )}
            </div>

            <ThemeToggler />

            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                auth.signOut()
                navigate({ to: '/auth/login' })
              }}
              className="border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground text-xs h-8"
            >
              <IconLogout size={14} className="mr-1.5" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10 flex-1 w-full space-y-8">
        {/* Dashboard Header Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-8 rounded-3xl border border-border bg-card shadow-sm relative overflow-hidden text-card-foreground">
          <div className="space-y-1.5 relative z-10 max-w-xl">
            <h1 className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight">
              Brand Guidelines &amp; Identity Workspaces
            </h1>
            <p className="text-xs md:text-sm text-muted-foreground">
              Select a brand project to edit color matrices, typography hierarchies, logo specs, and export kits.
            </p>
          </div>

          <div className="flex items-center gap-3 relative z-10">
            {/* Project Limit Indicator */}
            <div className="px-3.5 py-2 rounded-xl bg-muted/50 border border-border text-xs font-mono">
              <span className="text-muted-foreground">Plan Limit: </span>
              <span className={isLimitReached ? 'text-amber-500 font-bold' : 'text-emerald-500 font-bold'}>
                {projectsStore.projects.length} / 2 Brands
              </span>
            </div>

            <Button
              disabled={isLimitReached}
              onClick={() => setShowCreateModal(true)}
              className="bg-primary hover:opacity-90 text-primary-foreground font-semibold text-xs px-4 h-10 rounded-xl shadow-md"
            >
              <IconPlus size={16} className="mr-1.5" />
              New Brand
            </Button>
          </div>
        </div>

        {/* Limit Reached Warning Alert */}
        {isLimitReached && (
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-300 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <IconLock size={16} className="text-amber-500" />
              <span>
                <strong>Project Limit Reached:</strong> Your account is currently at the 2-brand project maximum. Delete an existing brand to create another.
              </span>
            </div>
          </div>
        )}

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projectsStore.projects.map((project: BrandProjectItem) => {
            return (
              <div
                key={project.id}
                className="rounded-2xl border border-border bg-card p-6 flex flex-col justify-between hover:border-primary/50 hover:shadow-lg transition-all duration-200 group shadow-xs text-card-foreground"
              >
                <div className="space-y-4">
                  {/* Top card bar */}
                  <div className="flex items-center justify-between">
                    <div
                      className="w-8 h-8 rounded-lg shadow-xs flex items-center justify-center font-bold text-white text-xs border border-white/10"
                      style={{ backgroundColor: project.primary_color || '#4f46e5' }}
                    >
                      {(project.brand_name || project.name || 'B').charAt(0).toUpperCase()}
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => projectsStore.duplicateProject(project.id)}
                        disabled={isLimitReached}
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition disabled:opacity-40"
                        title="Duplicate Brand"
                      >
                        <IconCopy size={15} />
                      </button>

                      <button
                        onClick={() => projectsStore.deleteProject(project.id)}
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition"
                        title="Delete Brand"
                      >
                        <IconTrash size={15} />
                      </button>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition">
                      {project.brand_name || project.name}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Last edited {new Date(project.updated_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="pt-6 mt-4 border-t border-border/60 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-muted-foreground bg-muted/40 px-2 py-1 rounded border border-border">
                    System v1.0
                  </span>

                  <Link
                    to="/studio/$projectId"
                    params={{ projectId: project.id }}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary group-hover:opacity-80 transition"
                  >
                    Open Studio
                    <IconArrowRight size={14} className="group-hover:translate-x-0.5 transition" />
                  </Link>
                </div>
              </div>
            )
          })}

          {/* Quick Launch Pre-Built Template Card */}
          <div
            onClick={() => {
              navigate({
                to: '/studio/$projectId',
                params: { projectId: 'demo-apex' },
              })
            }}
            className="rounded-2xl border border-dashed border-border bg-muted/10 p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-primary/50 hover:bg-muted/30 transition min-h-[220px]"
          >
            <div className="p-3 rounded-full bg-primary/10 text-primary border border-primary/20 mb-3">
              <IconSparkles size={20} />
            </div>
            <h4 className="text-sm font-bold text-foreground">Explore Instant Sample Brand</h4>
            <p className="text-xs text-muted-foreground mt-1 max-w-[200px]">
              Load pre-configured Apex Cloud design system to test live exports.
            </p>
          </div>
        </div>
      </main>

      {/* Create Project Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 text-card-foreground">
            <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
              <IconFolder size={20} className="text-primary" />
              Create New Brand Studio
            </h3>

            {createError && (
              <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs">
                {createError}
              </div>
            )}

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">Brand / Project Name</label>
                <input
                  type="text"
                  required
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  placeholder="e.g. Lumina AI, Solstice Motors"
                  className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs text-foreground outline-none focus:border-primary"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowCreateModal(false)}
                  className="border-border text-xs"
                >
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="bg-primary text-primary-foreground text-xs">
                  Create Studio
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
