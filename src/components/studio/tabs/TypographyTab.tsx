import React, { useEffect, useState } from 'react'
import { useBrandStore } from '@/store/brandStore'
import {
  CURATED_PAIRINGS,
  POPULAR_GOOGLE_FONTS,
  MODULAR_SCALES,
  loadGoogleFont,
  computeTypeScale,
} from '@/lib/fontLoader'
import { IconTypography, IconSparkles, IconDeviceDesktop, IconCheck } from '@tabler/icons-react'
/**
 * Deep studio tab for managing brand typography pairing, scale ratios, and specimen testing.
 * Features:
 * - Curated harmonic font pairings (Display, Body, Mono) with one-click adoption.
 * - Modular scale ratio selector (Minor Second up to Golden Ratio).
 * - Live font playground with editable text sandbox and responsive size specs.
 *
 * @component
 * @returns {React.ReactElement} The rendered typography studio tab.
 */
export const TypographyTab: React.FC = () => {
  const brand = useBrandStore()
  const [sandboxText, setSandboxText] = useState(
    'The quick brown fox jumps over the lazy dog. 0123456789 — Radical architecture designed for velocity.'
  )

  // Dynamically load selected fonts
  useEffect(() => {
    loadGoogleFont(brand.displayFont)
    loadGoogleFont(brand.bodyFont)
    loadGoogleFont(brand.monoFont)
  }, [brand.displayFont, brand.bodyFont, brand.monoFont])

  const typeScale = computeTypeScale(brand.baseFontSize, brand.typeScaleRatio)

  const handleApplyPreset = (preset: (typeof CURATED_PAIRINGS)[0]) => {
    brand.setTypography({
      displayFont: preset.display,
      bodyFont: preset.body,
      monoFont: preset.mono,
    })
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Curated Font Pairings */}
      <div className="rounded-2xl border border-border bg-card p-6 md:p-8 space-y-4 shadow-xs text-card-foreground">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <IconSparkles size={18} className="text-primary" />
              Curated Harmonic Pairings
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Tested pairings combining distinctive display typography with high-legibility interface fonts.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {CURATED_PAIRINGS.map((preset) => {
            const isActive =
              brand.displayFont === preset.display && brand.bodyFont === preset.body
            return (
              <div
                key={preset.id}
                onClick={() => handleApplyPreset(preset)}
                className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                  isActive
                    ? 'border-primary bg-primary/5 shadow-xs'
                    : 'border-border bg-muted/20 hover:border-primary/50'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-primary">
                      {preset.category}
                    </span>
                    {isActive && <IconCheck size={16} className="text-primary" />}
                  </div>
                  <h4 className="text-sm font-bold text-foreground mb-1">{preset.name}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-3">{preset.description}</p>
                </div>

                <div className="text-[11px] font-mono text-foreground bg-muted/40 p-2 rounded border border-border space-y-1">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Display:</span>
                    <span className="font-semibold text-foreground">{preset.display}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Body:</span>
                    <span className="text-foreground">{preset.body}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Mono:</span>
                    <span className="text-muted-foreground">{preset.mono}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Font Family Customizer & Scale Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls */}
        <div className="rounded-2xl border border-border bg-card p-6 space-y-5 shadow-xs text-card-foreground">
          <h3 className="text-base font-bold text-foreground flex items-center gap-2">
            <IconTypography size={18} className="text-chart-2" />
            Type Configurator
          </h3>

          {/* Display Font */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">Display / Heading Font</label>
            <select
              value={brand.displayFont}
              onChange={(e) => brand.setTypography({ displayFont: e.target.value })}
              className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs text-foreground outline-none focus:border-primary"
            >
              {POPULAR_GOOGLE_FONTS.map((font) => (
                <option key={font} value={font}>
                  {font}
                </option>
              ))}
            </select>
          </div>

          {/* Body Font */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">Body / Interface Font</label>
            <select
              value={brand.bodyFont}
              onChange={(e) => brand.setTypography({ bodyFont: e.target.value })}
              className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs text-foreground outline-none focus:border-primary"
            >
              {POPULAR_GOOGLE_FONTS.map((font) => (
                <option key={font} value={font}>
                  {font}
                </option>
              ))}
            </select>
          </div>

          {/* Mono Font */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">Monospace / Code Font</label>
            <select
              value={brand.monoFont}
              onChange={(e) => brand.setTypography({ monoFont: e.target.value })}
              className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs text-foreground outline-none focus:border-primary"
            >
              {POPULAR_GOOGLE_FONTS.map((font) => (
                <option key={font} value={font}>
                  {font}
                </option>
              ))}
            </select>
          </div>

          {/* Modular Scale Ratio */}
          <div className="space-y-1.5 pt-2 border-t border-border">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-foreground">Modular Scale Ratio</span>
              <span className="font-mono text-primary font-bold">{brand.typeScaleRatio}</span>
            </div>
            <select
              value={brand.typeScaleRatio}
              onChange={(e) => brand.setTypography({ typeScaleRatio: parseFloat(e.target.value) })}
              className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs text-foreground outline-none focus:border-primary"
            >
              {MODULAR_SCALES.map((scale) => (
                <option key={scale.name} value={scale.ratio}>
                  {scale.name} ({scale.ratio})
                </option>
              ))}
            </select>
          </div>

          {/* Base Size */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-foreground">Base Root Size</span>
              <span className="font-mono text-primary font-bold">{brand.baseFontSize}px</span>
            </div>
            <input
              type="range"
              min="14"
              max="20"
              value={brand.baseFontSize}
              onChange={(e) => brand.setTypography({ baseFontSize: parseInt(e.target.value) })}
              className="w-full accent-primary h-2 bg-muted rounded-lg cursor-pointer"
            />
          </div>
        </div>

        {/* Live Hierarchy Spec Sheet */}
        <div className="lg:col-span-2 rounded-2xl border border-border bg-card p-6 space-y-4 shadow-xs text-card-foreground">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <IconDeviceDesktop size={18} className="text-primary" />
              Harmonic Type Hierarchy &amp; Spec Sheet
            </h3>
          </div>

          <div className="space-y-3 divide-y divide-border">
            {typeScale.map((step) => {
              const isHeading = step.ratioPower >= 1
              const currentFont = isHeading ? brand.displayFont : brand.bodyFont
              return (
                <div key={step.name} className="pt-3 first:pt-0 flex flex-col md:flex-row md:items-baseline justify-between gap-2">
                  <div className="w-32 shrink-0">
                    <span className="text-xs font-semibold text-muted-foreground block">{step.name}</span>
                    <span className="text-[10px] font-mono text-muted-foreground">
                      {step.fontSizePx}px • LH {step.lineHeight}
                    </span>
                  </div>

                  <div
                    className="text-foreground flex-1 truncate"
                    style={{
                      fontFamily: `"${currentFont}", sans-serif`,
                      fontSize: `${Math.min(36, step.fontSizePx)}px`,
                      lineHeight: step.lineHeight,
                      letterSpacing: step.letterSpacing,
                      fontWeight: step.fontWeight,
                    }}
                  >
                    {brand.brandName} Architecture
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Interactive Text Sandbox */}
      <div className="rounded-2xl border border-border bg-card p-6 md:p-8 space-y-4 shadow-xs text-card-foreground">
        <div>
          <h3 className="text-base font-bold text-foreground">Live Typographic Tester</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Type custom copy to test kerning, rhythm, and optical texture.</p>
        </div>

        <textarea
          value={sandboxText}
          onChange={(e) => setSandboxText(e.target.value)}
          rows={3}
          className="w-full bg-background border border-border rounded-xl p-4 text-base text-foreground outline-none focus:border-primary transition"
          style={{ fontFamily: `"${brand.bodyFont}", sans-serif` }}
        />
      </div>
    </div>
  )
}
