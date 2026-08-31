import React, { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { useBrandStore } from '../../store/brandStore'
import { Button } from '../ui/button'
import { ExportModal } from '../export/ExportModal'
import { ThemeToggler } from '../shared/theme-toggler'
import {
  IconArrowLeft,
  IconArrowBackUp,
  IconArrowForwardUp,
  IconCheck,
  IconCloudUpload,
  IconSparkles,
  IconDownload,
  IconFileText,
  IconPalette,
  IconTypography,
  IconDeviceLaptop,
} from '@tabler/icons-react'

interface StudioHeaderProps {
  activeTab: 'overview' | 'logo' | 'colors' | 'typography' | 'mockups'
  onTabChange: (tab: 'overview' | 'logo' | 'colors' | 'typography' | 'mockups') => void
}

export const StudioHeader: React.FC<StudioHeaderProps> = ({ activeTab, onTabChange }) => {
  const brand = useBrandStore()
  // Temporal store for undo/redo
  const temporal = useBrandStore.temporal
  const [exportOpen, setExportOpen] = useState(false)
  const [isEditingName, setIsEditingName] = useState(false)

  const tabs = [
    { id: 'overview', label: 'Strategy & Tone', icon: IconSparkles },
    { id: 'logo', label: 'Logo System', icon: IconFileText },
    { id: 'colors', label: 'Color Matrix', icon: IconPalette },
    { id: 'typography', label: 'Typography', icon: IconTypography },
    { id: 'mockups', label: 'Live Mockups', icon: IconDeviceLaptop },
  ] as const

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-border/80 bg-background/80 backdrop-blur-xl transition-all">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          {/* Left: Back & Project Title */}
          <div className="flex items-center gap-4">
            <Link
              to="/dashboard"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:border-border hover:text-foreground transition"
              title="Return to Dashboard"
            >
              <IconArrowLeft size={18} />
            </Link>

            <div className="flex items-center gap-2.5">
              {isEditingName ? (
                <input
                  type="text"
                  value={brand.brandName}
                  onChange={(e) => brand.setBrandName(e.target.value)}
                  onBlur={() => setIsEditingName(false)}
                  onKeyDown={(e) => e.key === 'Enter' && setIsEditingName(false)}
                  autoFocus
                  className="rounded-md border border-primary bg-background px-2 py-1 text-sm font-semibold text-foreground outline-none focus:ring-1 focus:ring-primary"
                />
              ) : (
                <div
                  onClick={() => setIsEditingName(true)}
                  className="group flex cursor-pointer items-center gap-2 rounded-md px-2 py-1 hover:bg-muted/50 transition"
                  title="Click to rename brand"
                >
                  <h1 className="text-sm font-bold text-foreground group-hover:text-primary transition">
                    {brand.brandName || 'Untitled Brand'}
                  </h1>
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-mono bg-muted/60 px-1.5 py-0.5 rounded border border-border">
                    Edit
                  </span>
                </div>
              )}

              {/* Save status badge */}
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground pl-2">
                {brand.isSaving ? (
                  <span className="flex items-center gap-1 text-amber-500 animate-pulse">
                    <IconCloudUpload size={14} />
                    Saving...
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-emerald-500">
                    <IconCheck size={14} />
                    Saved
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Center: Tabs Switcher */}
          <nav className="hidden lg:flex items-center gap-1 rounded-xl border border-border bg-muted/40 p-1">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium transition-all cursor-pointer ${
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-xs font-semibold'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <Icon size={15} />
                  {tab.label}
                </button>
              )
            })}
          </nav>

          {/* Right: Undo/Redo, Theme & Export */}
          <div className="flex items-center gap-2">
            {/* Undo */}
            <button
              onClick={() => temporal.getState().undo()}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted transition cursor-pointer"
              title="Undo (Ctrl+Z)"
            >
              <IconArrowBackUp size={16} />
            </button>

            {/* Redo */}
            <button
              onClick={() => temporal.getState().redo()}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted transition cursor-pointer"
              title="Redo (Ctrl+Y)"
            >
              <IconArrowForwardUp size={16} />
            </button>

            <ThemeToggler />

            {/* Export CTA */}
            <Button
              onClick={() => setExportOpen(true)}
              className="bg-primary hover:opacity-90 text-primary-foreground font-medium text-xs px-4 h-9 shadow-xs"
            >
              <IconDownload size={15} className="mr-1.5" />
              Export Assets
            </Button>
          </div>
        </div>

        {/* Mobile Tab bar */}
        <div className="flex lg:hidden overflow-x-auto border-t border-border px-4 py-2 gap-1 no-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition cursor-pointer ${
                  isActive ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'
                }`}
              >
                <Icon size={14} />
                {tab.label}
              </button>
            )
          })}
        </div>
      </header>

      {/* Export Modal */}
      <ExportModal open={exportOpen} onOpenChange={setExportOpen} />
    </>
  )
}
