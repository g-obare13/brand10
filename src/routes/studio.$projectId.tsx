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
import { StepSummary } from "@/components/wizard/steps/StepSummary"
import { Button } from "@/components/ui/button"
import { Loader } from "@/components/ui/loader"
import GlassPanel from "@/components/shared/GlassPanel"
import {
  extractColorsFromSvg,
  clusterDistinctColors,
  syncExtractedColorsToPalette,
} from "@/lib/extractor"
import {
  IconArrowLeft,
  IconArrowRight,
  IconSparkles,
} from "@tabler/icons-react"

export const Route = createFileRoute("/studio/$projectId")({
  component: StudioPage,
})

function StudioPage() {
  const { projectId } = Route.useParams()
  const brand = useBrandStore()
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSaving, setIsSaving] = useState(false)

  const isProjectLoading =
    brand.isLoading || (!!projectId && brand.projectId !== projectId)

  useEffect(() => {
    if (projectId && brand.projectId !== projectId) {
      brand.loadFromProject(projectId)
    }
  }, [projectId, brand.projectId])

  const handleNext = async () => {
    if (isProjectLoading || isSaving) return
    if (currentStep < 6) {
      try {
        setIsSaving(true)
        // Automatically sync logo colors to color matrix when leaving Step 2 (Logo step)
        if (
          currentStep === 2 &&
          (brand.svgContent || brand.secondarySvgContent)
        ) {
          const primaryColors = brand.svgContent
            ? await extractColorsFromSvg(brand.svgContent, 4)
            : []
          const secondaryColors = brand.secondarySvgContent
            ? await extractColorsFromSvg(brand.secondarySvgContent, 4)
            : []
          const combined = clusterDistinctColors(
            [...primaryColors, ...secondaryColors],
            5
          )
          if (combined.length > 0) {
            const updatedPalette = syncExtractedColorsToPalette(
              combined,
              brand.colorPalette
            )
            brand.setColorPalette(updatedPalette)
          }
        }

        // Upload any staged custom fonts to Supabase when leaving Step 4 (Typography step)
        if (
          currentStep === 4 &&
          brand.stagedFontFiles &&
          brand.stagedFontFiles.length > 0
        ) {
          await brand.uploadStagedFonts()
        }

        await brand.saveToSupabase()
        setCurrentStep((prev) => prev + 1)
        window.scrollTo({ top: 0, behavior: "smooth" })
      } catch (err) {
        console.error("Failed to advance wizard step:", err)
      } finally {
        setIsSaving(false)
      }
    }
  }

  const handleBack = () => {
    if (isProjectLoading || isSaving) return
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
            <div className="flex flex-col lg:col-span-5">
              <GlassPanel
                blur="none"
                noise
                noiseOpacity={0.02}
                className="flex h-full flex-col justify-between rounded-3xl border border-border/80 bg-card/85 p-6 shadow-sm backdrop-blur-xl sm:p-8"
              >
                <div className="flex-1">
                  {currentStep === 1 && (
                    <StepFoundation isLoading={isProjectLoading} />
                  )}
                  {currentStep === 2 && <StepLogo />}
                  {currentStep === 3 && <StepColors />}
                  {currentStep === 4 && <StepTypography />}
                  {currentStep === 5 && <StepImagery />}
                  {currentStep === 6 && <StepSummary projectId={projectId} />}
                </div>

                {/* Bottom Step Actions - Pinned to bottom of the card */}
                {currentStep < 6 && (
                  <div className="mt-auto flex items-center justify-between pt-6">
                    <Button
                      variant="outline"
                      size="pill"
                      gsapFill
                      onClick={handleBack}
                      disabled={
                        currentStep === 1 || isProjectLoading || isSaving
                      }
                      className="cursor-pointer rounded-full px-4 text-xs font-semibold disabled:opacity-30"
                      icon={<IconArrowLeft size={14} />}
                      iconPlacement="left"
                    >
                      Back
                    </Button>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="pill"
                        gsapFill
                        onClick={handleSkipToStudio}
                        disabled={isProjectLoading || isSaving}
                        className="cursor-pointer rounded-full px-4 text-xs font-semibold text-muted-foreground hover:text-foreground disabled:opacity-30"
                      >
                        Skip Step
                      </Button>

                      <Button
                        variant="shiny"
                        size="pill"
                        gsapFill
                        onClick={handleNext}
                        disabled={isProjectLoading || isSaving}
                        className="cursor-pointer rounded-full px-6 text-xs font-semibold disabled:opacity-30"
                        icon={
                          isSaving ? (
                            <Loader size="sm" />
                          ) : currentStep === 5 ? (
                            <IconSparkles size={14} />
                          ) : (
                            <IconArrowRight size={14} />
                          )
                        }
                        iconPlacement="right"
                      >
                        {isSaving
                          ? "Saving..."
                          : currentStep === 5
                            ? "Preview Brand"
                            : "Continue"}
                      </Button>
                    </div>
                  </div>
                )}
              </GlassPanel>
            </div>

            {/* Right Column: Sticky Live Step Preview (7 cols) */}
            <div className="lg:col-span-7">
              <WizardBentoPreview
                currentStep={currentStep}
                isLoading={isProjectLoading}
              />
            </div>
          </div>
        </Container>
      </main>
    </div>
  )
}
