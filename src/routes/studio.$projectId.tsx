import { useEffect, useRef } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useBrandStore } from '../store/brandStore'
import { StudioHeader } from '../components/studio/StudioHeader'
import { OverviewTab } from '../components/studio/tabs/OverviewTab'
import { LogoSystemTab } from '../components/studio/tabs/LogoSystemTab'
import { ColorSystemTab } from '../components/studio/tabs/ColorSystemTab'
import { TypographyTab } from '../components/studio/tabs/TypographyTab'
import { MockupSandboxTab } from '../components/studio/tabs/MockupSandboxTab'

type StudioTab = 'overview' | 'logo' | 'colors' | 'typography' | 'mockups'

interface StudioSearchParams {
  tab?: StudioTab
}

export const Route = createFileRoute('/studio/$projectId')({
  validateSearch: (search: Record<string, unknown>): StudioSearchParams => {
    const validTabs: StudioTab[] = ['overview', 'logo', 'colors', 'typography', 'mockups']
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
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // 1. Load project data on mount or project switch
  useEffect(() => {
    brand.loadFromProject(projectId)
  }, [projectId])

  // 2. Debounced auto-save on brand store changes (500ms debounce)
  useEffect(() => {
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
    <div className="min-h-screen bg-background text-foreground flex flex-col antialiased transition-colors duration-200">
      {/* Fixed Studio Header */}
      <StudioHeader activeTab={tab} onTabChange={handleTabChange} />

      {/* Main Studio Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full">
        {tab === 'overview' && <OverviewTab />}
        {tab === 'logo' && <LogoSystemTab />}
        {tab === 'colors' && <ColorSystemTab />}
        {tab === 'typography' && <TypographyTab />}
        {tab === 'mockups' && <MockupSandboxTab />}
      </main>
    </div>
  )
}
