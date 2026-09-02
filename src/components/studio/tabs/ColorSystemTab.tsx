import React, { useState } from 'react'
import { useBrandStore } from '@/store/brandStore'
import type { ColorSwatch } from '@/lib/colorUtils'
import { createColorSwatch, getWcagContrast, getReadableTextColor } from '@/lib/colorUtils'
import { Button } from '@/components/ui/button'
import {
  IconPalette,
  IconPlus,
  IconTrash,
  IconCheck,
  IconX,
  IconLayersSubtract,
  IconShieldCheck,
} from '@tabler/icons-react'
/**
 * Deep studio tab for managing brand color matrix, harmony algorithms, and contrast compliance.
 * Features:
 * - Color swatch list with primary, secondary, accent, background, and surface roles.
 * - Interactive color picker and hex/rgb/cmyk/hsl coordinate inspector.
 * - 11-step tonal shades generator and live WCAG AA/AAA contrast matrix against background.
 * - Swatch creation and removal with instantaneous state synchronization.
 *
 * @component
 * @returns {React.ReactElement} The rendered color system studio tab.
 */
export const ColorSystemTab: React.FC = () => {
  const brand = useBrandStore()
  const [selectedSwatchId, setSelectedSwatchId] = useState<string>(
    brand.colorPalette[0] ? brand.colorPalette[0].id : ''
  )
  const [newColorHex, setNewColorHex] = useState('#6366f1')
  const [newColorRole, setNewColorRole] = useState<ColorSwatch['role']>('custom')

  const selectedSwatch =
    brand.colorPalette.find((c) => c.id === selectedSwatchId) ?? brand.colorPalette[0]

  const handleAddColor = (e: React.FormEvent) => {
    e.preventDefault()
    brand.addColorSwatch(newColorHex, newColorRole)
  }

  const handleUpdateHex = (id: string, hex: string) => {
    const target = brand.colorPalette.find((c) => c.id === id) ?? selectedSwatch
    const updated = createColorSwatch(hex, target.role, target.name)
    brand.updateColorSwatch(id, {
      hex: updated.hex,
      rgb: updated.rgb,
      cmyk: updated.cmyk,
      hsl: updated.hsl,
      shades: updated.shades,
    })
  }

  const bgHex = brand.colorPalette.find((c) => c.role === 'background')?.hex || '#090d16'
  const secHex = brand.colorPalette.find((c) => c.role === 'secondary')?.hex || '#334155'
  const primHex = brand.colorPalette.find((c) => c.role === 'primary')?.hex || '#6366f1'

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* 60-30-10 Visual Balance Bar */}
      <div className="rounded-2xl border border-border bg-card p-6 space-y-4 shadow-xs text-card-foreground">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <IconLayersSubtract size={18} className="text-primary" />
              60-30-10 Color Hierarchy Distribution
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Recommended architectural balance for interfaces: 60% Dominant Canvas, 30% Structural Secondary, 10% Intentional Accent.
            </p>
          </div>
        </div>

        {/* Visual Bar */}
        <div className="h-6 w-full rounded-xl overflow-hidden flex border border-border shadow-inner">
          <div
            className="h-full flex items-center justify-center text-[10px] font-bold transition-all"
            style={{
              width: '60%',
              backgroundColor: bgHex,
              color: getReadableTextColor(bgHex),
            }}
          >
            60% Canvas / Neutral
          </div>
          <div
            className="h-full flex items-center justify-center text-[10px] font-bold transition-all"
            style={{
              width: '30%',
              backgroundColor: secHex,
              color: getReadableTextColor(secHex),
            }}
          >
            30% Secondary Structure
          </div>
          <div
            className="h-full flex items-center justify-center text-[10px] font-bold transition-all"
            style={{
              width: '10%',
              backgroundColor: primHex,
              color: getReadableTextColor(primHex),
            }}
          >
            10% Accent
          </div>
        </div>
      </div>

      {/* Swatch Grid & Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Swatches List */}
        <div className="lg:col-span-2 rounded-2xl border border-border bg-card p-6 space-y-4 shadow-xs text-card-foreground">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <IconPalette size={18} className="text-primary" />
              Palette Swatches ({brand.colorPalette.length})
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {brand.colorPalette.map((swatch) => {
              const isSelected = swatch.id === selectedSwatch.id
              return (
                <div
                  key={swatch.id}
                  onClick={() => setSelectedSwatchId(swatch.id)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                    isSelected
                      ? 'border-primary bg-primary/5 shadow-xs'
                      : 'border-border bg-muted/20 hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-lg shadow-xs border border-black/10 shrink-0"
                      style={{ backgroundColor: swatch.hex }}
                    />
                    <div>
                      <h4 className="text-xs font-bold text-foreground">{swatch.name}</h4>
                      <span className="text-[10px] uppercase font-mono text-muted-foreground">
                        {swatch.role} • {swatch.hex.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  {brand.colorPalette.length > 2 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        brand.removeColorSwatch(swatch.id)
                      }}
                      className="text-muted-foreground hover:text-destructive transition p-1 cursor-pointer"
                      title="Remove swatch"
                    >
                      <IconTrash size={15} />
                    </button>
                  )}
                </div>
              )
            })}
          </div>

          {/* Add New Color Form */}
          <form onSubmit={handleAddColor} className="pt-4 border-t border-border flex flex-wrap gap-2 items-center">
            <input
              type="color"
              value={newColorHex}
              onChange={(e) => setNewColorHex(e.target.value)}
              className="w-9 h-9 rounded-lg cursor-pointer bg-transparent border-0"
            />
            <input
              type="text"
              value={newColorHex}
              onChange={(e) => setNewColorHex(e.target.value)}
              className="w-24 bg-background border border-border rounded-lg px-2.5 py-1.5 text-xs font-mono text-foreground uppercase"
            />
            <select
              value={newColorRole}
              onChange={(e) => setNewColorRole(e.target.value as ColorSwatch['role'])}
              className="bg-background border border-border rounded-lg px-2.5 py-1.5 text-xs text-foreground"
            >
              <option value="primary">Primary</option>
              <option value="secondary">Secondary</option>
              <option value="accent">Accent</option>
              <option value="neutral">Neutral</option>
              <option value="background">Background</option>
              <option value="custom">Custom</option>
            </select>
            <Button type="submit" size="sm" className="bg-primary hover:opacity-90 text-primary-foreground text-xs h-8">
              <IconPlus size={14} className="mr-1" /> Add Swatch
            </Button>
          </form>
        </div>

        {/* Right: Selected Swatch Tints, Shades & Space Models */}
        <div className="rounded-2xl border border-border bg-card p-6 space-y-5 shadow-xs text-card-foreground">
          <div>
            <span className="text-[10px] uppercase tracking-wider font-semibold text-primary">Selected Color</span>
            <div className="flex items-center gap-3 mt-1">
              <input
                type="color"
                value={selectedSwatch.hex}
                onChange={(e) => handleUpdateHex(selectedSwatch.id, e.target.value)}
                className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
              />
              <input
                type="text"
                value={selectedSwatch.name}
                onChange={(e) => brand.updateColorSwatch(selectedSwatch.id, { name: e.target.value })}
                className="text-sm font-bold text-foreground bg-transparent border-b border-border focus:border-primary outline-none pb-0.5"
              />
            </div>
          </div>

          {/* Model Breakdown */}
          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <div className="p-2 rounded-lg bg-muted/40 border border-border">
              <span className="text-[10px] text-muted-foreground block">HEX</span>
              <span className="text-foreground font-bold">{selectedSwatch.hex.toUpperCase()}</span>
            </div>
            <div className="p-2 rounded-lg bg-muted/40 border border-border">
              <span className="text-[10px] text-muted-foreground block">RGB</span>
              <span className="text-foreground">
                {selectedSwatch.rgb.r}, {selectedSwatch.rgb.g}, {selectedSwatch.rgb.b}
              </span>
            </div>
            <div className="p-2 rounded-lg bg-muted/40 border border-border">
              <span className="text-[10px] text-muted-foreground block">CMYK</span>
              <span className="text-foreground">
                {selectedSwatch.cmyk.c}, {selectedSwatch.cmyk.m}, {selectedSwatch.cmyk.y}, {selectedSwatch.cmyk.k}
              </span>
            </div>
            <div className="p-2 rounded-lg bg-muted/40 border border-border">
              <span className="text-[10px] text-muted-foreground block">HSL</span>
              <span className="text-foreground">
                {selectedSwatch.hsl.h}°, {selectedSwatch.hsl.s}%, {selectedSwatch.hsl.l}%
              </span>
            </div>
          </div>

          {/* 11-step Tonal Scale */}
          <div className="space-y-2 pt-2">
            <h4 className="text-xs font-semibold text-foreground">11-Step Tonal Scale (Tailwind)</h4>
            <div className="grid grid-cols-6 gap-1 rounded-xl overflow-hidden p-1 bg-muted/30 border border-border">
              {Object.entries(selectedSwatch.shades).map(([step, shadeHex]) => (
                <div
                  key={step}
                  className="h-10 rounded flex flex-col items-center justify-between p-1 text-[9px] font-mono transition hover:scale-105"
                  style={{
                    backgroundColor: shadeHex,
                    color: getReadableTextColor(shadeHex),
                  }}
                  title={`${step}: ${shadeHex}`}
                >
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* WCAG 2.1 Accessibility Matrix */}
      <div className="rounded-2xl border border-border bg-card p-6 md:p-8 space-y-4 shadow-xs text-card-foreground">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <IconShieldCheck size={18} className="text-emerald-500" />
              WCAG 2.1 Accessibility &amp; Contrast Matrix
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Live contrast verification ensuring readable text pairings across light and dark substrates.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-border bg-card">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-muted-foreground font-semibold">
                <th className="p-3">Foreground Swatch</th>
                <th className="p-3">Background</th>
                <th className="p-3">Contrast Ratio</th>
                <th className="p-3">AA Normal (≥4.5)</th>
                <th className="p-3">AA Large (≥3.0)</th>
                <th className="p-3">AAA Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border font-mono">
              {brand.colorPalette.map((fg) => {
                const onDark = getWcagContrast(fg.hex, '#090d16')
                const onWhite = getWcagContrast(fg.hex, '#ffffff')
                return (
                  <React.Fragment key={fg.id}>
                    {/* On Dark */}
                    <tr className="hover:bg-muted/20">
                      <td className="p-3 flex items-center gap-2">
                        <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: fg.hex }} />
                        <span className="text-foreground font-sans font-medium">{fg.name}</span>
                      </td>
                      <td className="p-3 text-muted-foreground">Dark (#090d16)</td>
                      <td className="p-3 font-bold text-foreground">{onDark.ratio}:1</td>
                      <td className="p-3">
                        {onDark.aaNormal ? (
                          <span className="inline-flex items-center gap-1 text-emerald-500"><IconCheck size={14} /> Pass</span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-rose-500"><IconX size={14} /> Fail</span>
                        )}
                      </td>
                      <td className="p-3">
                        {onDark.aaLarge ? (
                          <span className="inline-flex items-center gap-1 text-emerald-500"><IconCheck size={14} /> Pass</span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-rose-500"><IconX size={14} /> Fail</span>
                        )}
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] ${
                          onDark.rating === 'AAA' ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-300' : 'bg-muted text-muted-foreground'
                        }`}>
                          {onDark.rating}
                        </span>
                      </td>
                    </tr>

                    {/* On White */}
                    <tr className="hover:bg-muted/20">
                      <td className="p-3 flex items-center gap-2">
                        <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: fg.hex }} />
                        <span className="text-foreground font-sans font-medium">{fg.name}</span>
                      </td>
                      <td className="p-3 text-muted-foreground">Light (#FFFFFF)</td>
                      <td className="p-3 font-bold text-foreground">{onWhite.ratio}:1</td>
                      <td className="p-3">
                        {onWhite.aaNormal ? (
                          <span className="inline-flex items-center gap-1 text-emerald-500"><IconCheck size={14} /> Pass</span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-rose-500"><IconX size={14} /> Fail</span>
                        )}
                      </td>
                      <td className="p-3">
                        {onWhite.aaLarge ? (
                          <span className="inline-flex items-center gap-1 text-emerald-500"><IconCheck size={14} /> Pass</span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-rose-500"><IconX size={14} /> Fail</span>
                        )}
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] ${
                          onWhite.rating === 'AAA' ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-300' : 'bg-muted text-muted-foreground'
                        }`}>
                          {onWhite.rating}
                        </span>
                      </td>
                    </tr>
                  </React.Fragment>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
