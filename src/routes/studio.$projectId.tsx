import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { useShallow } from "zustand/react/shallow"
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
import { PdfPreviewStudio } from "@/components/wizard/preview/PdfPreviewStudio"
import { Button } from "@/components/ui/button"
import { Loader } from "@/components/ui/loader"
import GlassPanel from "@/components/shared/GlassPanel"
import { cn } from "@/lib/utils"
import {
  extractColorsFromSvg,
  clusterDistinctColors,
  syncExtractedColorsToPalette,
} from "@/lib/extractor"
import {
  IconArrowLeft,
  IconArrowRight,
} from "@tabler/icons-react"

interface StudioSearchParams {
  step?: number
}

export const Route = createFileRoute("/studio/$projectId")({
  validateSearch: (search: Record<string, unknown>): StudioSearchParams => {
    const rawStep = Number(search.step)
    const step =
      Number.isInteger(rawStep) && rawStep >= 1 && rawStep <= 6 ? rawStep : 1
    return { step }
  },
  head: () => ({
    meta: [
      {
        title: "Brand Studio & Guidelines Wizard | Brand10",
      },
      {
        name: "description",
        content:
          "Configure visual foundations, color palettes, typography scales, iconography, and export production-ready brand guidelines.",
      },
    ],
  }),
  component: StudioPage,
})

/**
 * Studio & Wizard route container for a brand project (/studio/:projectId).
 * Features:
 * - Direct hydration from Supabase or IndexedDB based on route projectId.
 * - Two-column responsive wizard layout (step configuration on left, dynamic live bento preview on right).
 * - Step progression, URL query sync, validation, and auto-save on finish.
 *
 * @component
 * @returns {React.ReactElement} The rendered studio / wizard page.
 */
function StudioPage() {
  const { projectId } = Route.useParams()
  const search = Route.useSearch()
  const currentStep = search.step ?? 1
  const brand = useBrandStore(
    useShallow((state) => ({
      isLoading: state.isLoading,
      projectId: state.projectId,
      loadFromProject: state.loadFromProject,
      svgContent: state.svgContent,
      secondarySvgContent: state.secondarySvgContent,
      colorPalette: state.colorPalette,
      setColorPalette: state.setColorPalette,
      stagedFontFiles: state.stagedFontFiles,
      uploadStagedFonts: state.uploadStagedFonts,
      saveToSupabase: state.saveToSupabase,
    }))
  )
  const navigate = useNavigate()
  const [isSaving, setIsSaving] = useState(false)

  const isProjectLoading =
    brand.isLoading || (!!projectId && brand.projectId !== projectId)

  useEffect(() => {
    if (projectId && brand.projectId !== projectId) {
      brand.loadFromProject(projectId)
    }
  }, [projectId, brand.projectId])

  const goToStep = (step: number) => {
    const safeStep = Math.min(Math.max(1, step), 6)
    navigate({
      to: "/studio/$projectId",
      params: { projectId },
      search: { step: safeStep },
    })
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

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
        goToStep(currentStep + 1)
      } catch (err) {
        console.error("Failed to advance wizard step:", err)
        toast.error("Failed to advance wizard step. Please check your changes.")
      } finally {
        setIsSaving(false)
      }
    }
  }

  const handleBack = () => {
    if (isProjectLoading || isSaving) return
    if (currentStep > 1) {
      goToStep(currentStep - 1)
    }
  }

  const handleSkipStep = () => {
    if (isProjectLoading || isSaving) return
    if (currentStep < 6) {
      goToStep(currentStep + 1)
    }
  }

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-background text-foreground transition-colors duration-200 selection:bg-primary/20 selection:text-primary">
      {/* Dynamic Ambient Background Glow */}
      <DashboardBackground />

      {/* Shared Navigation Header (Same as Dashboard & Studio) */}
      <Header action="logout" />

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 pt-20 pb-32 md:pt-24">
        <Container
          className={cn(
            "space-y-8",
            currentStep === 6 && "max-w-[1680px] px-4 sm:px-6"
          )}
        >
          {/* Sub-Header Control & Step Indicator Strip */}
          <WizardHeader
            currentStep={currentStep}
            onStepSelect={(step) => goToStep(step)}
            projectId={projectId}
          />

          {/* Step 6: 3-Column Interactive Brand PDF Preview Studio */}
          {currentStep === 6 ? (
            <PdfPreviewStudio projectId={projectId} />
          ) : (
            /* Main Wizard Split Layout for Steps 1-5 */
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
                  </div>

                  {/* Bottom Step Actions - Pinned to bottom of the card */}
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
                        onClick={handleSkipStep}
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
                          ) : currentStep === 5 ? null : (
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
          )}
        </Container>
      </main>
    </div>
  )
}
