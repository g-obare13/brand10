import { StepFoundationPreview } from "./previews/StepFoundationPreview"
import { StepLogoPreview } from "./previews/StepLogoPreview"
import { StepColorsPreview } from "./previews/StepColorsPreview"
import { StepTypographyPreview } from "./previews/StepTypographyPreview"
import { StepImageryPreview } from "./previews/StepImageryPreview"
import { StepSummaryPreview } from "./previews/StepSummaryPreview"

export interface WizardBentoPreviewProps {
  currentStep?: number
  isLoading?: boolean
}

/**
 * Container component orchestrating the step-by-step interactive preview panel in the brand wizard.
 * Features:
 * - Dynamic rendering of step-specific bento previews (Foundation, Logo, Colors, Typography, Imagery, Summary).
 * - Sticky position pin when scrolling through long wizard forms.
 * - Loading state pass-through to preview skeletons.
 *
 * @component
 * @param {WizardBentoPreviewProps} props - The component props.
 * @param {number} [props.currentStep=1] - Currently active wizard step index (1-6).
 * @param {boolean} [props.isLoading=false] - Whether project/brand data is loading.
 * @returns {React.ReactElement} The active step preview panel.
 */
export function WizardBentoPreview({
  currentStep = 1,
  isLoading = false,
}: WizardBentoPreviewProps) {
  return (
    <div className="sticky top-24 space-y-4">
      {/* Dynamic Step Preview Content */}
      <div className="transition-all duration-300">
        {currentStep === 1 && <StepFoundationPreview isLoading={isLoading} />}
        {currentStep === 2 && <StepLogoPreview />}
        {currentStep === 3 && <StepColorsPreview />}
        {currentStep === 4 && <StepTypographyPreview />}
        {currentStep === 5 && <StepImageryPreview />}
        {currentStep === 6 && <StepSummaryPreview />}
      </div>
    </div>
  )
}
