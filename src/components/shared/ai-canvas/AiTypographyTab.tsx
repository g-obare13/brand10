/**
 * @file AiTypographyTab.tsx
 * @description Interactive canvas tab for inspecting and modifying
 * the generated typography system, testing font specimens, and applying curated pairings.
 */

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CURATED_PAIRINGS } from "@/data/fonts"
import { SUPPORTED_FONT_FAMILIES } from "@/lib/ai/agentTools"
import { useAiAgentStore } from "@/store/aiAgentStore"
import { IconTypography, IconSparkles } from "@tabler/icons-react"
import { useState } from "react"
import type React from "react"
import type { FontPairing } from "@/data/fonts"

/**
 * Interactive typography system canvas.
 *
 * @component
 * @returns {React.ReactElement}
 */
export function AiTypographyTab(): React.ReactElement {
  const { draft, updateDraftField } = useAiAgentStore()
  const [sampleHeading, setSampleHeading] = useState("Crafting timeless digital visual systems")
  const [sampleBody, setSampleBody] = useState(
    "Good design is as little design as possible. Less, but better, because it concentrates on the essential aspects, and the products are not burdened with non-essentials."
  )

  const handleApplyPairing = (pairing: FontPairing) => {
    updateDraftField("displayFont", pairing.display)
    updateDraftField("bodyFont", pairing.body)
    updateDraftField("monoFont", pairing.mono)
  }

  return (
    <div className="space-y-6">
      {/* Font Selectors Toolbar */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* Display Font */}
        <div className="space-y-1.5 rounded-xl border border-border/80 bg-card p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-foreground">
              Display Font (Headings)
            </span>
            <Badge variant="secondary" className="text-[10px] font-mono py-0 px-1.5">
              H1 - H4
            </Badge>
          </div>
          <select
            value={draft.displayFont}
            onChange={(e) => updateDraftField("displayFont", e.target.value)}
            className="h-8 w-full rounded-md border border-border bg-background px-2 text-xs font-semibold text-foreground"
          >
            {SUPPORTED_FONT_FAMILIES.map((f) => (
              <option key={`display-${f}`} value={f}>
                {f}
              </option>
            ))}
          </select>
        </div>

        {/* Body Font */}
        <div className="space-y-1.5 rounded-xl border border-border/80 bg-card p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-foreground">
              Body Font (Paragraphs)
            </span>
            <Badge variant="secondary" className="text-[10px] font-mono py-0 px-1.5">
              Text
            </Badge>
          </div>
          <select
            value={draft.bodyFont}
            onChange={(e) => updateDraftField("bodyFont", e.target.value)}
            className="h-8 w-full rounded-md border border-border bg-background px-2 text-xs font-semibold text-foreground"
          >
            {SUPPORTED_FONT_FAMILIES.map((f) => (
              <option key={`body-${f}`} value={f}>
                {f}
              </option>
            ))}
          </select>
        </div>

        {/* Mono Font */}
        <div className="space-y-1.5 rounded-xl border border-border/80 bg-card p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-foreground">
              Monospace Font (Labels &amp; Code)
            </span>
            <Badge variant="secondary" className="text-[10px] font-mono py-0 px-1.5">
              Code
            </Badge>
          </div>
          <select
            value={draft.monoFont}
            onChange={(e) => updateDraftField("monoFont", e.target.value)}
            className="h-8 w-full rounded-md border border-border bg-background px-2 text-xs font-semibold text-foreground"
          >
            {SUPPORTED_FONT_FAMILIES.map((f) => (
              <option key={`mono-${f}`} value={f}>
                {f}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Live Specimen Playground */}
      <div className="space-y-4 rounded-2xl border border-border/80 bg-card p-6 shadow-xs">
        <div className="flex items-center justify-between border-b border-border/60 pb-3">
          <div className="flex items-center gap-2 text-primary">
            <IconTypography size={18} />
            <h6 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Live Specimen Playground
            </h6>
          </div>
          <span className="text-[11px] text-muted-foreground font-mono">
            {draft.displayFont} / {draft.bodyFont} / {draft.monoFont}
          </span>
        </div>

        <div className="space-y-6 pt-2">
          {/* Heading Specimen */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Display Heading (Editable)</span>
              <span className="font-mono text-[10px]">{draft.displayFont} Bold</span>
            </div>
            <input
              type="text"
              value={sampleHeading}
              onChange={(e) => setSampleHeading(e.target.value)}
              style={{ fontFamily: draft.displayFont }}
              className="w-full bg-transparent text-2xl sm:text-3xl font-bold tracking-tight text-foreground outline-none border-b border-border/40 focus:border-primary pb-1"
            />
          </div>

          {/* Body Specimen */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Body Paragraph (Editable)</span>
              <span className="font-mono text-[10px]">{draft.bodyFont} Regular</span>
            </div>
            <textarea
              value={sampleBody}
              onChange={(e) => setSampleBody(e.target.value)}
              style={{ fontFamily: draft.bodyFont }}
              rows={3}
              className="w-full bg-transparent text-sm leading-relaxed text-muted-foreground outline-none border-b border-border/40 focus:border-primary pb-1 resize-none"
            />
          </div>

          {/* Monospace Specimen */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Monospace Specimen</span>
              <span className="font-mono text-[10px]">{draft.monoFont} Regular</span>
            </div>
            <div
              style={{ fontFamily: draft.monoFont }}
              className="rounded-xl border border-border/60 bg-muted/40 p-3 text-xs text-foreground font-mono"
            >
              <code>
                TOKEN_BRAND_NAME = &quot;{draft.brandName}&quot;;<br />
                SCALE_DISPLAY_RATIO = 1.250; /* Major Third */<br />
                BASE_FONT_SIZE = 16px;
              </code>
            </div>
          </div>
        </div>
      </div>

      {/* Curated Pairings Recommendations */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <IconSparkles size={16} className="text-primary" />
          <h6 className="text-xs font-bold uppercase tracking-wider text-foreground">
            Curated Font Pairings
          </h6>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {CURATED_PAIRINGS.slice(0, 6).map((pairing) => {
            const isCurrent =
              draft.displayFont === pairing.display &&
              draft.bodyFont === pairing.body

            return (
              <div
                key={pairing.id}
                className={`flex flex-col justify-between rounded-xl border p-4 shadow-xs transition-all ${
                  isCurrent
                    ? "border-primary bg-primary/5"
                    : "border-border/70 bg-card hover:border-primary/40"
                }`}
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-foreground">
                      {pairing.name}
                    </span>
                    <Badge variant="outline" className="text-[10px] py-0 px-1.5">
                      {pairing.category}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    {pairing.description}
                  </p>
                  <p className="text-[11px] font-mono font-semibold text-foreground pt-1">
                    {pairing.display} + {pairing.body}
                  </p>
                </div>

                <div className="pt-3 border-t border-border/50 mt-3 flex justify-end">
                  <Button
                    type="button"
                    variant={isCurrent ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleApplyPairing(pairing)}
                    className="text-xs h-7"
                  >
                    {isCurrent ? "Active Pairing" : "Apply Pairing"}
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
