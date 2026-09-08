/**
 * @file AiStrategyTab.tsx
 * @description Interactive canvas tab for viewing, editing, and refining
 * the brand strategy, mission, vision, pillars, and tonal sliders.
 */

import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useAiAgentStore } from "@/store/aiAgentStore"
import { IconTarget, IconSparkles, IconCompass, IconHeartHandshake } from "@tabler/icons-react"
import type React from "react"

/**
 * Interactive strategy canvas component.
 *
 * @component
 * @returns {React.ReactElement}
 */
export function AiStrategyTab(): React.ReactElement {
  const { draft, updateDraftField, isGenerating } = useAiAgentStore()

  const handlePillarChange = (
    index: number,
    field: "title" | "desc",
    val: string
  ) => {
    const nextPillars = draft.brandPillars.map((p, i) =>
      i === index ? { ...p, [field]: val } : p
    )
    updateDraftField("brandPillars", nextPillars)
  }

  const handleToneChange = (
    key: keyof typeof draft.toneRatings,
    val: number
  ) => {
    updateDraftField("toneRatings", {
      ...draft.toneRatings,
      [key]: val,
    })
  }

  return (
    <div className="space-y-6">
      {/* Brand Name & Tagline */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="space-y-1.5 sm:col-span-1">
          <label className="text-xs font-semibold text-foreground">
            Brand Name
          </label>
          <Input
            value={draft.brandName}
            onChange={(e) => updateDraftField("brandName", e.target.value)}
            placeholder="e.g. Acme Corp"
            className="font-bold text-sm"
          />
        </div>

        <div className="space-y-1.5 sm:col-span-2">
          <label className="text-xs font-semibold text-foreground">
            Tagline / Punchline
          </label>
          <Input
            value={draft.tagline}
            onChange={(e) => updateDraftField("tagline", e.target.value)}
            placeholder="Short memorable phrase"
            className="text-sm"
          />
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2 rounded-xl border border-border/80 bg-card p-4 shadow-xs">
          <div className="flex items-center gap-2 text-primary">
            <IconTarget size={16} />
            <h6 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Mission Statement
            </h6>
          </div>
          <Textarea
            value={draft.mission}
            onChange={(e) => updateDraftField("mission", e.target.value)}
            rows={3}
            className="resize-none text-xs leading-relaxed"
            placeholder="What does your company exist to do?"
          />
        </div>

        <div className="space-y-2 rounded-xl border border-border/80 bg-card p-4 shadow-xs">
          <div className="flex items-center gap-2 text-primary">
            <IconCompass size={16} />
            <h6 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Vision Declaration
            </h6>
          </div>
          <Textarea
            value={draft.vision}
            onChange={(e) => updateDraftField("vision", e.target.value)}
            rows={3}
            className="resize-none text-xs leading-relaxed"
            placeholder="What future does your brand aim to create?"
          />
        </div>
      </div>

      {/* Core Values */}
      <div className="space-y-2.5 rounded-xl border border-border/80 bg-card p-4 shadow-xs">
        <div className="flex items-center gap-2 text-primary">
          <IconHeartHandshake size={16} />
          <h6 className="text-xs font-bold uppercase tracking-wider text-foreground">
            Core Values
          </h6>
        </div>
        <div className="flex flex-wrap gap-2">
          {draft.coreValues.map((val, idx) => (
            <Badge
              key={`${val}-${idx}`}
              variant="secondary"
              className="px-3 py-1 text-xs font-medium"
            >
              {val}
            </Badge>
          ))}
          {draft.coreValues.length === 0 && (
            <span className="text-xs text-muted-foreground">
              No core values defined yet.
            </span>
          )}
        </div>
      </div>

      {/* Brand Pillars Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <IconSparkles size={16} className="text-primary" />
            <h6 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Brand Pillars ({draft.brandPillars.length})
            </h6>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {draft.brandPillars.map((pillar, idx) => (
            <div
              key={`pillar-${idx}`}
              className="flex flex-col justify-between rounded-xl border border-border/70 bg-card p-4 shadow-xs transition-all hover:border-primary/40"
            >
              <div className="space-y-2">
                <Input
                  value={pillar.title}
                  onChange={(e) => handlePillarChange(idx, "title", e.target.value)}
                  placeholder={`Pillar ${idx + 1}`}
                  className="font-bold text-xs h-7 px-2"
                />
                <Textarea
                  value={pillar.desc}
                  onChange={(e) => handlePillarChange(idx, "desc", e.target.value)}
                  rows={3}
                  placeholder="Pillar rationale and principles"
                  className="resize-none text-xs leading-relaxed"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Brand Voice Tone Sliders */}
      <div className="space-y-4 rounded-xl border border-border/80 bg-card p-4 shadow-xs">
        <h6 className="text-xs font-bold uppercase tracking-wider text-foreground">
          Voice &amp; Tone Spectrum
        </h6>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Formal vs Casual */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Casual</span>
              <span className="font-mono font-semibold text-foreground">
                {draft.toneRatings.formal}%
              </span>
              <span className="text-muted-foreground">Formal Corporate</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={draft.toneRatings.formal}
              onChange={(e) => handleToneChange("formal", Number(e.target.value))}
              disabled={isGenerating}
              className="w-full accent-primary cursor-pointer"
            />
          </div>

          {/* Serious vs Playful */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Dead Serious</span>
              <span className="font-mono font-semibold text-foreground">
                {draft.toneRatings.playful}%
              </span>
              <span className="text-muted-foreground">Playful &amp; Fun</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={draft.toneRatings.playful}
              onChange={(e) => handleToneChange("playful", Number(e.target.value))}
              disabled={isGenerating}
              className="w-full accent-primary cursor-pointer"
            />
          </div>

          {/* Ornate vs Minimalist */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Ornate &amp; Rich</span>
              <span className="font-mono font-semibold text-foreground">
                {draft.toneRatings.minimalist}%
              </span>
              <span className="text-muted-foreground">Ultra Minimal</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={draft.toneRatings.minimalist}
              onChange={(e) => handleToneChange("minimalist", Number(e.target.value))}
              disabled={isGenerating}
              className="w-full accent-primary cursor-pointer"
            />
          </div>

          {/* Subtle vs Bold */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Subtle &amp; Quiet</span>
              <span className="font-mono font-semibold text-foreground">
                {draft.toneRatings.bold}%
              </span>
              <span className="text-muted-foreground">Loud &amp; Bold</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={draft.toneRatings.bold}
              onChange={(e) => handleToneChange("bold", Number(e.target.value))}
              disabled={isGenerating}
              className="w-full accent-primary cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
