import type { ReactNode } from 'react'
import GlassPanel from '../shared/GlassPanel'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip'
import {
  IconSparkles,
  IconVectorBezier2,
  IconPalette,
  IconTypography,
  IconDeviceLaptop,
} from '@tabler/icons-react'

export type StudioTab = 'overview' | 'logo' | 'colors' | 'typography' | 'mockups'

interface StudioTabItem {
  id: StudioTab
  label: string
  icon: ReactNode
}

export const STUDIO_TABS: StudioTabItem[] = [
  {
    id: 'overview',
    label: 'Strategy & Tone',
    icon: <IconSparkles size={18} />,
  },
  {
    id: 'logo',
    label: 'Logo System',
    icon: <IconVectorBezier2 size={18} />,
  },
  {
    id: 'colors',
    label: 'Color Matrix',
    icon: <IconPalette size={18} />,
  },
  {
    id: 'typography',
    label: 'Typography',
    icon: <IconTypography size={18} />,
  },
  {
    id: 'mockups',
    label: 'Live Mockups',
    icon: <IconDeviceLaptop size={18} />,
  },
]

interface StudioToolbarProps {
  activeTab: StudioTab
  onTabChange: (tab: StudioTab) => void
}

/**
 * Floating bottom dock navigation toolbar for the Brand Studio.
 * Features:
 * - Tab switching buttons for Strategy, Logo, Colors, Typography, and Mockups.
 * - GlassPanel dock container with subtle border highlights and tooltips.
 *
 * @component
 * @param {StudioToolbarProps} props - The component props.
 * @param {StudioTab} props.activeTab - Currently active studio tab.
 * @param {(tab: StudioTab) => void} props.onTabChange - Handler to switch tabs.
 * @returns {React.ReactElement} The rendered studio bottom toolbar.
 */
export function StudioToolbar({ activeTab, onTabChange }: StudioToolbarProps) {
  return (
    <nav
      aria-label="Studio bottom navigation"
      className="fixed bottom-6 left-1/2 z-40 -translate-x-1/2"
    >
      <TooltipProvider delay={100}>
        <GlassPanel
          blur="none"
          noise
          noiseOpacity={0.02}
          contentClassName="flex flex-row items-center gap-1.5 sm:gap-2"
          className="rounded-full border border-border/80 bg-card/85 p-2 backdrop-blur-xl shadow-2xl"
        >
          <div className="flex flex-row items-center gap-1.5 sm:gap-2">
            {STUDIO_TABS.map((item) => {
              const isActive = activeTab === item.id
              return (
                <Tooltip key={item.id}>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      onClick={() => onTabChange(item.id)}
                      className={`flex size-9 cursor-pointer items-center justify-center rounded-full p-2 transition-all duration-300 ${
                        isActive
                          ? 'scale-105 bg-foreground text-background shadow-md'
                          : 'text-muted-foreground hover:bg-muted/80 hover:text-foreground'
                      }`}
                      aria-label={item.label}
                    >
                      {item.icon}
                    </button>
                  </TooltipTrigger>
                  <TooltipContent
                    side="top"
                    sideOffset={14}
                    className="text-xs font-medium shadow-xl"
                  >
                    {item.label}
                  </TooltipContent>
                </Tooltip>
              )
            })}
          </div>
        </GlassPanel>
      </TooltipProvider>
    </nav>
  )
}
