import React, { useRef, useState } from 'react'
import { useBrandStore } from '../../../store/brandStore'
import { ingestBrandFile } from '../../../lib/extractor'
import { Button } from '../../ui/button'
import {
  IconUpload,
  IconCheck,
  IconX,
  IconPlus,
  IconGridDots,
  IconEye,
  IconSun,
  IconMoon,
} from '@tabler/icons-react'
/**
 * Deep studio tab for managing brand logo geometry, assets, clearspace, and rules.
 * Features:
 * - Direct vector SVG and image asset ingestion with metadata extraction.
 * - Clearspace multiplier slider with interactive perimeter guide visualization.
 * - Contrast verification on light and dark background tiles.
 * - Comprehensive Do's and Don'ts guideline manager with custom addition/removal.
 *
 * @component
 * @returns {React.ReactElement} The rendered logo system studio tab.
 */
export const LogoSystemTab: React.FC = () => {
  const brand = useBrandStore()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  // Do's & Don'ts form state
  const [newType, setNewType] = useState<'do' | 'dont'>('do')
  const [newRule, setNewRule] = useState('')
  const [newDetail, setNewDetail] = useState('')

  const handleFileUpload = async (file: File) => {
    try {
      setIsProcessing(true)
      const extracted = await ingestBrandFile(file)
      await brand.setLogoData({
        svgContent: extracted.svgDataUri ? atob(extracted.svgDataUri.split(',')[1] || '') : undefined,
        rasterDataUri: extracted.rasterDataUri,
        isVector: extracted.isVector,
        aspectRatio: extracted.aspectRatio,
      })
      if (extracted.colors.length) {
        brand.setColorPalette(extracted.colors)
      }
      if (extracted.brandName && extracted.brandName !== 'Acme Brand') {
        brand.setBrandName(extracted.brandName)
      }
    } catch (err) {
      console.error('File ingest error:', err)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleAddRule = (e: React.FormEvent) => {
    e.preventDefault()
    if (newRule.trim()) {
      brand.addDoDont({
        type: newType,
        rule: newRule.trim(),
        detail: newDetail.trim() || 'Ensure brand integrity is preserved across all communications.',
      })
      setNewRule('')
      setNewDetail('')
    }
  }

  const logoSrc = brand.svgContent
    ? `data:image/svg+xml;utf8,${encodeURIComponent(brand.svgContent)}`
    : brand.rasterDataUri || '/Brandio.svg'

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Master Lockup & Variant Matrix */}
      <div className="rounded-2xl border border-border bg-card p-6 md:p-8 space-y-6 shadow-xs text-card-foreground">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <IconEye size={20} className="text-primary" />
              Master Lockup &amp; Auto-Inverted Variants
            </h2>
            <p className="text-xs text-muted-foreground mt-1">
              Derived high-contrast iterations calibrated for varying ambient luminance and print requirements.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="file"
              ref={fileInputRef}
              accept=".svg,.png,.jpg,.jpeg,.webp"
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.[0]) handleFileUpload(e.target.files[0])
              }}
            />
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={isProcessing}
              variant="outline"
              className="border-border bg-muted/30 hover:bg-muted text-xs"
            >
              <IconUpload size={14} className="mr-1.5" />
              {isProcessing ? 'Processing...' : 'Upload New Logo'}
            </Button>
          </div>
        </div>

        {/* 4 Variant Tiles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 1. Dark Background */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-6 flex flex-col items-center justify-center min-h-[180px] relative group">
            <div className="absolute top-3 left-3 flex items-center gap-1.5 text-[11px] text-zinc-400 font-medium">
              <IconMoon size={13} className="text-indigo-400" />
              Dark Canvas
            </div>
            <div className="h-20 w-full flex items-center justify-center p-2">
              <img
                src={logoSrc}
                alt={`${brand.brandName} Dark`}
                className="max-h-full max-w-full object-contain filter drop-shadow-md"
              />
            </div>
            <span className="text-[10px] text-zinc-500 font-mono mt-3">Primary High Contrast</span>
          </div>

          {/* 2. Light Background */}
          <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-100 p-6 flex flex-col items-center justify-center min-h-[180px] relative group">
            <div className="absolute top-3 left-3 flex items-center gap-1.5 text-[11px] text-zinc-600 font-medium">
              <IconSun size={13} className="text-amber-500" />
              Light Canvas
            </div>
            <div className="h-20 w-full flex items-center justify-center p-2">
              <img
                src={logoSrc}
                alt={`${brand.brandName} Light`}
                className="max-h-full max-w-full object-contain"
              />
            </div>
            <span className="text-[10px] text-zinc-500 font-mono mt-3">Editorial / Print Spec</span>
          </div>

          {/* 3. Monochrome White */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6 flex flex-col items-center justify-center min-h-[180px] relative group">
            <div className="absolute top-3 left-3 text-[11px] text-zinc-400 font-medium">
              Mono White
            </div>
            <div className="h-20 w-full flex items-center justify-center p-2">
              <img
                src={logoSrc}
                alt={`${brand.brandName} Mono White`}
                className="max-h-full max-w-full object-contain brightness-0 invert"
              />
            </div>
            <span className="text-[10px] text-zinc-500 font-mono mt-3">1-Bit Inverted</span>
          </div>

          {/* 4. Monochrome Black */}
          <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-100 p-6 flex flex-col items-center justify-center min-h-[180px] relative group">
            <div className="absolute top-3 left-3 text-[11px] text-zinc-700 font-medium">
              Mono Black
            </div>
            <div className="h-20 w-full flex items-center justify-center p-2">
              <img
                src={logoSrc}
                alt={`${brand.brandName} Mono Black`}
                className="max-h-full max-w-full object-contain brightness-0"
              />
            </div>
            <span className="text-[10px] text-zinc-500 font-mono mt-3">1-Bit Silhouette</span>
          </div>
        </div>
      </div>

      {/* Clearspace Exclusion Grid */}
      <div className="rounded-2xl border border-border bg-card p-6 md:p-8 space-y-6 shadow-xs text-card-foreground">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
              <IconGridDots size={18} className="text-chart-2" />
              Clearspace &amp; Exclusion Grid
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              Minimum protective boundary required around the symbol to prevent visual collision.
            </p>
          </div>

          {/* Multiplier Slider */}
          <div className="flex items-center gap-4 bg-muted/40 px-4 py-2 rounded-xl border border-border">
            <span className="text-xs text-muted-foreground font-medium">Margin Ratio:</span>
            <input
              type="range"
              min="0.5"
              max="2.0"
              step="0.25"
              value={brand.clearspaceMultiplier}
              onChange={(e) => brand.setClearspaceMultiplier(parseFloat(e.target.value))}
              className="accent-primary w-28 cursor-pointer"
            />
            <span className="text-xs font-mono font-bold text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/20">
              {brand.clearspaceMultiplier}X
            </span>
          </div>
        </div>

        {/* Live Grid Canvas */}
        <div className="relative rounded-xl border border-dashed border-primary/40 bg-muted/20 p-12 flex items-center justify-center overflow-hidden min-h-[260px]">
          {/* Blueprint Grid pattern */}
          <div
            className="absolute inset-0 opacity-15 pointer-events-none"
            style={{
              backgroundImage: 'linear-gradient(to right, var(--primary) 1px, transparent 1px), linear-gradient(to bottom, var(--primary) 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />

          {/* Clearspace Exclusion Box */}
          <div
            className="relative border border-dashed border-primary rounded-lg flex items-center justify-center bg-primary/5 transition-all duration-200"
            style={{
              padding: `${brand.clearspaceMultiplier * 36}px`,
            }}
          >
            {/* Corner Indicators */}
            <span className="absolute -top-3 -left-3 text-[10px] font-mono text-primary bg-card border border-primary/40 px-1.5 py-0.5 rounded shadow-xs">
              {brand.clearspaceMultiplier}X
            </span>
            <span className="absolute -bottom-3 -right-3 text-[10px] font-mono text-primary bg-card border border-primary/40 px-1.5 py-0.5 rounded shadow-xs">
              {brand.clearspaceMultiplier}X
            </span>

            {/* Inner Logo */}
            <div className="h-24 w-48 flex items-center justify-center bg-card rounded-md border border-border p-2 shadow-inner">
              <img
                src={logoSrc}
                alt={brand.brandName}
                className="max-h-full max-w-full object-contain"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Do's and Don'ts Section */}
      <div className="rounded-2xl border border-border bg-card p-6 md:p-8 space-y-6 shadow-xs text-card-foreground">
        <div>
          <h3 className="text-lg font-bold text-foreground">Usage Guidelines (Do&apos;s &amp; Don&apos;ts)</h3>
          <p className="text-xs text-muted-foreground mt-1">
            Rules to maintain consistent execution across internal teams and external agency partners.
          </p>
        </div>

        {/* List of Rules */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {brand.dosAndDonts.map((item) => {
            const isDo = item.type === 'do'
            return (
              <div
                key={item.id}
                className={`p-4 rounded-xl border flex items-start justify-between gap-3 ${
                  isDo
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300'
                    : 'bg-rose-500/10 border-rose-500/30 text-rose-700 dark:text-rose-300'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`p-1.5 rounded-lg shrink-0 ${
                      isDo ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' : 'bg-rose-500/20 text-rose-600 dark:text-rose-400'
                    }`}
                  >
                    {isDo ? <IconCheck size={16} /> : <IconX size={16} />}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
                      {isDo ? 'DO: ' : "DON'T: "}
                      {item.rule}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{item.detail}</p>
                  </div>
                </div>

                <button
                  onClick={() => brand.removeDoDont(item.id)}
                  className="text-muted-foreground hover:text-foreground transition cursor-pointer"
                  title="Remove rule"
                >
                  <IconX size={14} />
                </button>
              </div>
            )
          })}
        </div>

        {/* Add Rule Form */}
        <form onSubmit={handleAddRule} className="p-4 rounded-xl bg-muted/30 border border-border space-y-3">
          <h4 className="text-xs font-semibold text-foreground flex items-center gap-1.5">
            <IconPlus size={14} className="text-primary" /> Add Custom Guideline Rule
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <select
              value={newType}
              onChange={(e) => setNewType(e.target.value as 'do' | 'dont')}
              className="bg-background border border-border rounded-lg px-3 py-2 text-xs text-foreground outline-none focus:border-primary"
            >
              <option value="do">DO Rule (Approved)</option>
              <option value="dont">DON&apos;T Rule (Prohibited)</option>
            </select>

            <input
              type="text"
              value={newRule}
              onChange={(e) => setNewRule(e.target.value)}
              placeholder="Rule title (e.g. Maintain Contrast)"
              className="sm:col-span-1 bg-background border border-border rounded-lg px-3 py-2 text-xs text-foreground outline-none focus:border-primary"
            />

            <input
              type="text"
              value={newDetail}
              onChange={(e) => setNewDetail(e.target.value)}
              placeholder="Detailed description"
              className="sm:col-span-2 bg-background border border-border rounded-lg px-3 py-2 text-xs text-foreground outline-none focus:border-primary"
            />
          </div>

          <div className="flex justify-end">
            <Button type="submit" size="sm" className="bg-primary hover:opacity-90 text-primary-foreground text-xs">
              Add Rule
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
