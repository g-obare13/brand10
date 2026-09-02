import GlassPanel from "@/components/shared/GlassPanel"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useBrandStore } from "@/store/brandStore"
import { IconArrowLeft, IconCheck } from "@tabler/icons-react"

export const WIZARD_STEPS = [
  { id: 1, title: "Foundation", subtitle: "Identity & Vibe" },
  { id: 2, title: "Logo System", subtitle: "Marks & Geometry" },
  { id: 3, title: "Color Matrix", subtitle: "Palette & Contrast" },
  { id: 4, title: "Typography", subtitle: "Pairings & Scale" },
  { id: 5, title: "Imagery", subtitle: "Mood & Photography" },
  { id: 6, title: "Preview", subtitle: "Brand System Master Overview" },
] as const

interface WizardHeaderProps {
  currentStep: number
  onStepSelect: (step: number) => void
  projectId: string
}

/**
 * Wizard progress bar and header navigation controller.
 * Features:
 * - Step pills with completion checkmarks and click navigation.
 * - Back to Dashboard and direct Skip to Studio actions.
 * - Current brand name and progress status indicator.
 *
 * @component
 * @param {WizardHeaderProps} props - The component props.
 * @param {number} props.currentStep - Currently active wizard step (1-6).
 * @param {(step: number) => void} props.onStepSelect - Callback invoked when clicking a step pill.
 * @param {string} props.projectId - Active project identifier.
 * @returns {React.ReactElement} The rendered wizard header controller.
 */
export function WizardHeader({
  currentStep,
  onStepSelect,
}: WizardHeaderProps) {
  const brand = useBrandStore()

  return (
    <div className="space-y-4 pt-2 sm:pt-4">
      {/* Top Control Bar Below Main Fixed Header */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        {/* Left: Back Link & Brand Name Display */}
        <div className="flex flex-row items-center gap-3">
          <GlassPanel
            blur="none"
            noise
            noiseOpacity={0.02}
            className="flex items-center rounded-full p-1 shadow-xs"
          >
            <Button
              variant={"outline"}
              gsapFill
              href="/dashboard/projects"
              title="Return to Dashboard"
              aria-label="Return to Dashboard"
              className={"rounded-full"}
            >
              <IconArrowLeft size={18} />
            </Button>
          </GlassPanel>
          <h4>{brand.brandName || "Brand Workspace"}</h4>
        </div>

        {/* Right: Stepper Pills & Skip CTA */}
        <div className="flex flex-row items-center gap-2">
          {/* Stepper Pills */}
          <GlassPanel
            blur="none"
            noise
            noiseOpacity={0.02}
            className="hidden rounded-full p-1 md:flex"
            contentClassName="flex flex-row items-center gap-1"
          >
            {WIZARD_STEPS.map((step) => {
              const isCompleted = currentStep > step.id
              const isCurrent = currentStep === step.id

              return (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => onStepSelect(step.id)}
                  className={cn(
                    "flex shrink-0 cursor-pointer items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-all",
                    isCurrent
                      ? "bg-foreground font-semibold text-background shadow-xs"
                      : isCompleted
                        ? "bg-primary/15 text-primary hover:bg-primary/25"
                        : "text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                  )}
                >
                  {isCompleted ? (
                    <IconCheck size={13} className="stroke-[2.5]" />
                  ) : (
                    <span className="flex size-4 items-center justify-center rounded-full bg-current/10 text-[10px] font-bold">
                      {step.id}
                    </span>
                  )}
                  <span>{step.title}</span>
                </button>
              )
            })}
          </GlassPanel>
        </div>
      </div>

      {/* Mobile Step Status */}
      <div className="flex items-center justify-between rounded-2xl border border-border/80 bg-card/60 px-4 py-2.5 text-xs md:hidden">
        <span className="font-semibold text-foreground">
          Step {Math.min(currentStep, 6)} of 6:{" "}
          {WIZARD_STEPS.find((s) => s.id === currentStep)?.title || "Complete"}
        </span>
        <span className="font-mono text-[11px] text-muted-foreground">
          {Math.round((Math.min(currentStep, 6) / 6) * 100)}% Complete
        </span>
      </div>
    </div>
  )
}
