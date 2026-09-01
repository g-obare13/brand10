import { useEffect, useRef, useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useBrandStore } from '../store/brandStore'
import { Header } from '../components/shared/Header'
import { DashboardBackground } from '../components/dashboard/DashboardBackground'
import Container from '../components/ui/container'
import { StudioHero } from '../components/studio/StudioHero'
import type { StudioTab } from '../components/studio/StudioToolbar'
import { StudioToolbar } from '../components/studio/StudioToolbar'
import { ExportModal } from '../components/export/ExportModal'
import { OverviewTab } from '../components/studio/tabs/OverviewTab'
import { LogoSystemTab } from '../components/studio/tabs/LogoSystemTab'
import { ColorSystemTab } from '../components/studio/tabs/ColorSystemTab'
import { TypographyTab } from '../components/studio/tabs/TypographyTab'
import { MockupSandboxTab } from '../components/studio/tabs/MockupSandboxTab'

interface StudioSearchParams {
  tab?: StudioTab
}

export const Route = createFileRoute('/studio/$projectId')({
  validateSearch: (search: Record<string, unknown>): StudioSearchParams => {
    const validTabs: StudioTab[] = [
      'overview',
      'logo',
      'colors',
      'typography',
      'mockups',
    ]
    const tab = search.tab as StudioTab
    return {
      tab: validTabs.includes(tab) ? tab : 'overview',
    }
  },
  component: StudioPage,
})

function StudioPage() {
  const { projectId } = Route.useParams()
  const { tab = 'overview' } = Route.useSearch()
  const navigate = useNavigate()
  const brand = useBrandStore()
  const isLoadedRef = useRef(false)
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [exportOpen, setExportOpen] = useState(false)

  // 1. Load project data on mount or project switch
  useEffect(() => {
    isLoadedRef.current = false
    brand.loadFromProject(projectId).then(() => {
      isLoadedRef.current = true
    })
  }, [projectId])

  // 2. Debounced auto-save on brand store changes (500ms debounce)
  useEffect(() => {
    if (
      !isLoadedRef.current ||
      brand.isLoading ||
      brand.projectId !== projectId ||
      !brand.brandName
    ) {
      return
    }

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
    }

    saveTimeoutRef.current = setTimeout(() => {
      brand.saveToSupabase()
    }, 500)

    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current)
    }
  }, [
    projectId,
    brand.isLoading,
    brand.projectId,
    brand.brandName,
    brand.tagline,
    brand.mission,
    brand.vision,
    brand.coreValues,
    brand.toneRatings,
    brand.colorPalette,
    brand.displayFont,
    brand.bodyFont,
    brand.monoFont,
    brand.baseFontSize,
    brand.typeScaleRatio,
    brand.clearspaceMultiplier,
    brand.dosAndDonts,
  ])

  const handleTabChange = (newTab: StudioTab) => {
    brand.setActiveTab(newTab)
    navigate({
      search: { tab: newTab } as any,
      replace: true,
    })
  }

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-background text-foreground transition-colors duration-200 selection:bg-primary/20 selection:text-primary">
      {/* Dynamic Ambient Background Glow */}
      <DashboardBackground />

      {/* Navigation Header (Same as Dashboard) */}
      <Header action="logout" />

      {/* Main Studio Body Area */}
      <main className="relative z-10 flex-1 pt-20 pb-32 md:pt-24">
        <Container className="space-y-8">
          <StudioHero onOpenExport={() => setExportOpen(true)} />

          {/* Active Tab View */}
          <div className="w-full">
            {tab === 'overview' && <OverviewTab />}
            {tab === 'logo' && <LogoSystemTab />}
            {tab === 'colors' && <ColorSystemTab />}
            {tab === 'typography' && <TypographyTab />}
            {tab === 'mockups' && <MockupSandboxTab />}
          </div>
        </Container>
      </main>

      {/* Floating Bottom Center Navigation Toolbar */}
      <StudioToolbar activeTab={tab} onTabChange={handleTabChange} />

      {/* Export Modal */}
      <ExportModal open={exportOpen} onOpenChange={setExportOpen} />
    </div>
  )
}

export default StudioPage
