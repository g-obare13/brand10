import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { useEffect, useState } from "react"
import { useBrandStore } from "@/store/brandStore"
import { Header } from "@/components/shared/Header"
import { DashboardBackground } from "@/components/dashboard/DashboardBackground"
import Container from "@/components/ui/container"
import { WizardHeader } from "@/components/wizard/WizardHeader"
import { WizardBentoPreview } from "@/components/wizard/WizardBentoPreview"
import { StepFoundation } from "@/components/wizard/steps/StepFoundation"
import { StepLogo } from "@/components/wizard/steps/StepLogo"
import { StepColors } from "@/components/wizard/steps/StepColors"
import { StepTypography } from "@/components/wizard/steps/StepTypography"
import { StepImagery } from "@/components/wizard/steps/StepImagery"
import { StepIconography } from "@/components/wizard/steps/StepIconography"
import { StepSummary } from "@/components/wizard/steps/StepSummary"
import { Button } from "@/components/ui/button"
import GlassPanel from "@/components/shared/GlassPanel"
import { IconArrowLeft, IconArrowRight, IconSparkles } from "@tabler/icons-react"

export const Route = createFileRoute("/studio/$projectId_/wizard")({
  component: StudioWizardRoute,
})

function StudioWizardRoute() {
  const { projectId } = Route.useParams()
  const brand = useBrandStore()
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)

  useEffect(() => {
    if (projectId && brand.projectId !== projectId) {
      brand.loadFromProject(projectId)
    }
  }, [projectId])

  const handleNext = async () => {
    if (currentStep < 7) {
      await brand.saveToSupabase()
      setCurrentStep((prev) => prev + 1)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const handleSkipToStudio = () => {
    navigate({
      to: "/studio/$projectId",
      params: { projectId },
    })
  }

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-background text-foreground transition-colors duration-200 selection:bg-primary/20 selection:text-primary">
      {/* Dynamic Ambient Background Glow */}
      <DashboardBackground />

      {/* Shared Navigation Header (Same as Dashboard & Studio) */}
      <Header action="logout" />

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 pt-20 pb-32 md:pt-24">
        <Container className="space-y-8">
          {/* Sub-Header Control & Step Indicator Strip */}
          <WizardHeader
            currentStep={currentStep}
            onStepSelect={(step) => setCurrentStep(step)}
            projectId={projectId}
          />

          {/* Main Wizard Split Layout */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            {/* Left Column: Step Configuration Form (5 cols) */}
            <div className="lg:col-span-5 space-y-8">
              <GlassPanel
                blur="none"
                noise
                noiseOpacity={0.02}
                className="rounded-3xl border border-border/80 bg-card/85 p-6 shadow-sm sm:p-8 backdrop-blur-xl"
              >
                {currentStep === 1 && <StepFoundation />}
                {currentStep === 2 && <StepLogo />}
                {currentStep === 3 && <StepColors />}
                {currentStep === 4 && <StepTypography />}
                {currentStep === 5 && <StepImagery />}
                {currentStep === 6 && <StepIconography />}
                {currentStep === 7 && <StepSummary projectId={projectId} />}

                {/* Bottom Step Actions */}
                {currentStep < 7 && (
                  <div className="mt-8 flex items-center justify-between border-t border-border/60 pt-5">
                    <Button
                      variant="outline"
                      size="pill"
                      gsapFill
                      onClick={handleBack}
                      disabled={currentStep === 1}
                      className="cursor-pointer rounded-full px-4 text-xs font-semibold disabled:opacity-30"
                      icon={<IconArrowLeft size={14} />}
                    >
                      Back
                    </Button>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="pill"
                        gsapFill
                        onClick={handleSkipToStudio}
                        className="cursor-pointer rounded-full px-4 text-xs font-semibold text-muted-foreground hover:text-foreground"
                      >
                        Skip Step
                      </Button>

                      <Button
                        variant="shiny"
                        size="pill"
                        gsapFill
                        onClick={handleNext}
                        className="cursor-pointer rounded-full px-6 text-xs font-semibold"
                        icon={
                          currentStep === 6 ? (
                            <IconSparkles size={14} />
                          ) : (
                            <IconArrowRight size={14} />
                          )
                        }
                        iconPlacement="right"
                      >
                        {currentStep === 6 ? "Generate Identity" : "Continue"}
                      </Button>
                    </div>
                  </div>
                )}
              </GlassPanel>
            </div>

            {/* Right Column: Sticky Live Step Preview (7 cols) */}
            <div className="lg:col-span-7">
              <WizardBentoPreview currentStep={currentStep} />
            </div>
          </div>
        </Container>
      </main>
    </div>
  )
}
