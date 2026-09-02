import WordReveal from "@/components/shared/WordReveal"
import AiChat from "@/components/shared/AiChat"

interface AiAssistanceTabProps {
  onOpenCreateModal?: () => void
}

/**
 * Dashboard tab providing an interactive AI copilot chat interface for brand generation.
 * Features:
 * - Animated headline and subtitle with WordReveal.
 * - Embedded AiChat component for intelligent brand queries and guidelines assistance.
 *
 * @component
 * @param {AiAssistanceTabProps} [_props] - The component props.
 * @returns {React.ReactElement} The rendered AI assistance tab.
 */
export function AiAssistanceTab(_props: AiAssistanceTabProps = {}) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center justify-center gap-6 text-center">
        <div className="max-w-3xl space-y-4 pt-4 sm:pt-8">
          <WordReveal as="h2" stagger={0.03} duration={1.4} start="top 90%">
            AI Studio Assistance &amp; Generators
          </WordReveal>

          <WordReveal as="p" stagger={0.02} duration={1.2} start="top 90%">
            Automated brand extraction, contrast computation, and voice
            synthesis.
          </WordReveal>
        </div>
      </div>

      <div className="flex w-full items-center justify-center py-6">
        <AiChat />
      </div>
    </div>
  )
}
