/**
 * @file AiColorsTab.tsx
 * @description Interactive canvas tab for inspecting and modifying
 * the generated color matrix, calculating real-time WCAG contrast, and role distribution.
 */

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAiAgentStore } from "@/store/aiAgentStore"
import { IconPalette, IconPlus, IconTrash, IconCheck, IconCopy } from "@tabler/icons-react"
import chroma from "chroma-js"
import { useState } from "react"
import type React from "react"
import { createColorSwatch } from "@/lib/colorUtils"
import type { ColorSwatch } from "@/lib/colorUtils"

/**
 * Interactive color system canvas.
 *
 * @component
 * @returns {React.ReactElement}
 */
export function AiColorsTab(): React.ReactElement {
  const { draft, updateDraftField } = useAiAgentStore()
  const [copiedHex, setCopiedHex] = useState<string | null>(null)

  const handleCopy = (hex: string) => {
    void navigator.clipboard.writeText(hex)
    setCopiedHex(hex)
    setTimeout(() => setCopiedHex(null), 2000)
  }

  const handleUpdateSwatch = (index: number, updates: Partial<ColorSwatch>) => {
    const nextPalette = draft.colorPalette.map((s, i) =>
      i === index ? { ...s, ...updates } : s
    )
    updateDraftField("colorPalette", nextPalette)
  }

  const handleAddSwatch = () => {
    const newSwatch = createColorSwatch("#3B82F6", "accent", "New Accent")
    updateDraftField("colorPalette", [...draft.colorPalette, newSwatch])
  }

  const handleRemoveSwatch = (index: number) => {
    if (draft.colorPalette.length <= 2) return
    const nextPalette = draft.colorPalette.filter((_, i) => i !== index)
    updateDraftField("colorPalette", nextPalette)
  }

  return (
    <div className="space-y-6">
      {/* Top Header & Distribution Bar */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <IconPalette size={16} className="text-primary" />
            <h6 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Color Matrix ({draft.colorPalette.length} Swatches)
            </h6>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddSwatch}
            className="text-xs h-7"
          >
            <IconPlus size={14} className="mr-1" />
            Add Swatch
          </Button>
        </div>

        {/* Visual Palette Spectrum Bar */}
        <div className="flex h-5 w-full overflow-hidden rounded-xl border border-border shadow-xs">
          {draft.colorPalette.map((swatch) => (
            <div
              key={swatch.id}
              className="h-full transition-all duration-300 relative group cursor-pointer"
              style={{
                backgroundColor: swatch.hex,
                flex: 1,
              }}
              title={`${swatch.name} (${swatch.hex})`}
            />
          ))}
        </div>
      </div>

      {/* Swatches Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {draft.colorPalette.map((swatch, idx) => {
          let contrastWhite = 1
          let contrastBlack = 21
          let isValid = false

          try {
            if (chroma.valid(swatch.hex)) {
              isValid = true
              contrastWhite = Math.round(chroma.contrast(swatch.hex, "#FFFFFF") * 10) / 10
              contrastBlack = Math.round(chroma.contrast(swatch.hex, "#000000") * 10) / 10
            }
          } catch {
            isValid = false
          }

          const passesAA = contrastWhite >= 4.5 || contrastBlack >= 4.5
          const passesAAA = contrastWhite >= 7 || contrastBlack >= 7

          return (
            <div
              key={swatch.id}
              className="overflow-hidden rounded-2xl border border-border/80 bg-card shadow-xs transition-all hover:border-primary/40 flex flex-col justify-between"
            >
              {/* Color Block Header */}
              <div
                className="relative h-28 w-full p-3 flex flex-col justify-between"
                style={{ backgroundColor: isValid ? swatch.hex : "#888888" }}
              >
                <div className="flex items-center justify-between">
                  <Badge
                    variant="outline"
                    className="bg-black/40 text-white border-white/20 backdrop-blur-md px-2 py-0 text-[10px] uppercase font-mono"
                  >
                    {swatch.role}
                  </Badge>

                  {draft.colorPalette.length > 2 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveSwatch(idx)}
                      className="rounded-full bg-black/40 p-1 text-white/80 transition hover:bg-black/70 hover:text-white"
                      title="Remove swatch"
                    >
                      <IconTrash size={12} />
                    </button>
                  )}
                </div>

                <div className="flex items-center justify-between text-white drop-shadow-sm">
                  <span className="font-mono text-xs font-bold tracking-wider">
                    {swatch.hex.toUpperCase()}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(swatch.hex)}
                    className="rounded-md bg-black/30 p-1 text-white/90 backdrop-blur-xs transition hover:bg-black/60"
                    title="Copy hex code"
                  >
                    {copiedHex === swatch.hex ? (
                      <IconCheck size={12} className="text-emerald-400" />
                    ) : (
                      <IconCopy size={12} />
                    )}
                  </button>
                </div>
              </div>

              {/* Swatch Details */}
              <div className="p-3.5 space-y-3">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">
                    Swatch Name
                  </label>
                  <Input
                    value={swatch.name}
                    onChange={(e) => handleUpdateSwatch(idx, { name: e.target.value })}
                    className="h-7 text-xs font-semibold px-2"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">
                      Hex
                    </label>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="color"
                        value={isValid ? swatch.hex : "#000000"}
                        onChange={(e) => handleUpdateSwatch(idx, { hex: e.target.value })}
                        className="size-6 cursor-pointer rounded border border-border bg-transparent p-0"
                      />
                      <Input
                        value={swatch.hex}
                        onChange={(e) => handleUpdateSwatch(idx, { hex: e.target.value })}
                        className="h-7 text-xs font-mono px-1.5"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">
                      Role
                    </label>
                    <select
                      value={swatch.role}
                      onChange={(e) =>
                        handleUpdateSwatch(idx, {
                          role: e.target.value as ColorSwatch["role"],
                        })
                      }
                      className="h-7 w-full rounded-md border border-border bg-background px-2 text-xs text-foreground"
                    >
                      <option value="primary">Primary</option>
                      <option value="secondary">Secondary</option>
                      <option value="accent">Accent</option>
                      <option value="neutral">Neutral</option>
                      <option value="surface">Surface</option>
                    </select>
                  </div>
                </div>

                {/* WCAG Accessibility Rating */}
                <div className="flex items-center justify-between pt-1 border-t border-border/50 text-[11px]">
                  <span className="text-muted-foreground">WCAG 2.2</span>
                  <div className="flex items-center gap-1">
                    {passesAAA ? (
                      <Badge variant="success" className="px-1.5 py-0 text-[10px] font-mono">
                        AAA ({contrastWhite >= 7 ? `${contrastWhite}:1 on W` : `${contrastBlack}:1 on B`})
                      </Badge>
                    ) : passesAA ? (
                      <Badge variant="secondary" className="px-1.5 py-0 text-[10px] font-mono">
                        AA ({contrastWhite >= 4.5 ? `${contrastWhite}:1 on W` : `${contrastBlack}:1 on B`})
                      </Badge>
                    ) : (
                      <Badge variant="destructive" className="px-1.5 py-0 text-[10px] font-mono">
                        Low Contrast
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
