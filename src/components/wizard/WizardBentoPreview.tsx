import { StepFoundationPreview } from "./previews/StepFoundationPreview"
import { StepLogoPreview } from "./previews/StepLogoPreview"
import { StepColorsPreview } from "./previews/StepColorsPreview"
import { StepTypographyPreview } from "./previews/StepTypographyPreview"
import { StepImageryPreview } from "./previews/StepImageryPreview"
import { StepIconographyPreview } from "./previews/StepIconographyPreview"
import { StepSummaryPreview } from "./previews/StepSummaryPreview"

interface WizardBentoPreviewProps {
  currentStep?: number
}

const STEP_TITLES: Record<number, string> = {
  1: "Strategic Foundation Preview",
  2: "Logo Geometry & Contrast Preview",
  3: "Color Palette & Contrast Preview",
  4: "Typography Hierarchy Preview",
  5: "Imagery & Mood Preview",
  6: "Iconography System Preview",
  7: "Brand System Master Overview",
}

export function WizardBentoPreview({
  currentStep = 1,
}: WizardBentoPreviewProps) {
  return (
    <div className="sticky top-24 space-y-4">
      {/* Dynamic Step Preview Content */}
      <div className="transition-all duration-300">
        {currentStep === 1 && <StepFoundationPreview />}
        {currentStep === 2 && <StepLogoPreview />}
        {currentStep === 3 && <StepColorsPreview />}
        {currentStep === 4 && <StepTypographyPreview />}
        {currentStep === 5 && <StepImageryPreview />}
        {currentStep === 6 && <StepIconographyPreview />}
        {currentStep === 7 && <StepSummaryPreview />}
      </div>
    </div>
  )
}
