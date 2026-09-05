import React, { useState } from 'react'
import { toast } from 'sonner'
import { useBrandStore } from '@/store/brandStore'
import { buildAndDownloadZip, generateTailwindConfig, generateTokensJson, generateCssTokens } from '@/lib/zipBuilder'
import { exportBrandManualPdf } from "@/lib/pdfExportService"
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { IconPackage, IconFileText, IconCode, IconDownload, IconCheck, IconCopy } from '@tabler/icons-react'

interface ExportModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

/**
 * Multi-format brand asset export modal dialog.
 * Features:
 * - Production ZIP download containing SVG/PNG logos, CSS variables, tokens.json, and tailwind.config.js.
 * - Multi-page vector PDF Brand Guidelines Deck generation with @react-pdf/renderer.
 * - Live copyable code snippets for Tailwind config, W3C Design Tokens JSON, and CSS Custom Properties.
 *
 * @component
 * @param {ExportModalProps} props - The component props.
 * @param {boolean} props.open - Whether modal dialog is open.
 * @param {(open: boolean) => void} props.onOpenChange - Open state change callback.
 * @returns {React.ReactElement} The rendered export dialog modal.
 */
export const ExportModal: React.FC<ExportModalProps> = ({ open, onOpenChange }) => {
  const brand = useBrandStore()
  const [isZipping, setIsZipping] = useState(false)
  const [isPdfing, setIsPdfing] = useState(false)
  const [copiedKey, setCopiedKey] = useState<string | null>(null)

  const handleZipDownload = async () => {
    try {
      setIsZipping(true)
      await buildAndDownloadZip({
        brandName: brand.brandName,
        tagline: brand.tagline,
        mission: brand.mission,
        vision: brand.vision,
        coreValues: brand.coreValues,
        colors: brand.colorPalette,
        displayFont: brand.displayFont,
        bodyFont: brand.bodyFont,
        monoFont: brand.monoFont,
        baseFontSize: brand.baseFontSize,
        typeScaleRatio: brand.typeScaleRatio,
        isVector: brand.isVector,
        svgContent: brand.svgContent,
        rasterDataUri: brand.rasterDataUri,
      })
      toast.success('Production asset package downloaded.')
    } catch (err) {
      console.error('ZIP compilation error:', err)
      toast.error('Failed to generate ZIP archive. Please try again.')
    } finally {
      setIsZipping(false)
    }
  }

  const handlePdfDownload = async () => {
    try {
      setIsPdfing(true)
      await exportBrandManualPdf({
        brandName: brand.brandName || "Brand",
      })
      toast.success('Brand guidelines PDF generated.')
    } catch (err) {
      console.error('PDF export error:', err)
      toast.error('Failed to generate PDF deck. Please try again.')
    } finally {
      setIsPdfing(false)
    }
  }

  const handleCopyCode = (key: string, content: string) => {
    navigator.clipboard.writeText(content)
    setCopiedKey(key)
    setTimeout(() => setCopiedKey(null), 2000)
  }

  const tailwindCode = generateTailwindConfig({
    brandName: brand.brandName,
    tagline: brand.tagline,
    mission: brand.mission,
    vision: brand.vision,
    coreValues: brand.coreValues,
    colors: brand.colorPalette,
    displayFont: brand.displayFont,
    bodyFont: brand.bodyFont,
    monoFont: brand.monoFont,
    baseFontSize: brand.baseFontSize,
    typeScaleRatio: brand.typeScaleRatio,
    isVector: brand.isVector,
  })

  const tokensJsonCode = generateTokensJson({
    brandName: brand.brandName,
    tagline: brand.tagline,
    mission: brand.mission,
    vision: brand.vision,
    coreValues: brand.coreValues,
    colors: brand.colorPalette,
    displayFont: brand.displayFont,
    bodyFont: brand.bodyFont,
    monoFont: brand.monoFont,
    baseFontSize: brand.baseFontSize,
    typeScaleRatio: brand.typeScaleRatio,
    isVector: brand.isVector,
  })

  const cssCode = generateCssTokens({
    brandName: brand.brandName,
    tagline: brand.tagline,
    mission: brand.mission,
    vision: brand.vision,
    coreValues: brand.coreValues,
    colors: brand.colorPalette,
    displayFont: brand.displayFont,
    bodyFont: brand.bodyFont,
    monoFont: brand.monoFont,
    baseFontSize: brand.baseFontSize,
    typeScaleRatio: brand.typeScaleRatio,
    isVector: brand.isVector,
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl bg-card border-border text-foreground p-0 overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-border bg-muted/30">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-foreground flex items-center gap-2.5">
              <span className="p-2 rounded-lg bg-primary/10 text-primary border border-primary/20">
                <IconPackage size={20} />
              </span>
              Export Brand Asset Engine
            </DialogTitle>
            <DialogDescription className="text-muted-foreground text-sm mt-1">
              Export high-res production packages, design tokens, and presentation-ready decks for {brand.brandName}.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Main Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* ZIP Asset Kit */}
            <div className="p-5 rounded-2xl bg-card border border-primary/40 flex flex-col justify-between hover:border-primary transition-all shadow-xs">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-1 text-xs font-semibold rounded-md bg-primary/10 text-primary border border-primary/20">
                    Complete Bundle
                  </span>
                  <IconPackage className="text-primary" size={22} />
                </div>
                <h3 className="font-bold text-foreground text-base mb-1">1-Click ZIP Asset Kit</h3>
                <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                  Includes master vector logos, high-res PNG fallbacks (1x, 2x, 4x), favicons, Tailwind v3 config, and W3C tokens.json.
                </p>
              </div>
              <Button
                onClick={handleZipDownload}
                disabled={isZipping}
                className="w-full bg-primary hover:opacity-90 text-primary-foreground font-medium shadow-sm cursor-pointer"
              >
                <IconDownload size={16} className="mr-2" />
                {isZipping ? 'Compiling ZIP...' : 'Download Full ZIP Kit'}
              </Button>
            </div>

            {/* PDF Brand Book */}
            <div className="p-5 rounded-2xl bg-card border border-border flex flex-col justify-between hover:border-primary/50 transition-all shadow-xs">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-1 text-xs font-semibold rounded-md bg-muted text-muted-foreground border border-border">
                    Presentation Deck
                  </span>
                  <IconFileText className="text-muted-foreground" size={22} />
                </div>
                <h3 className="font-bold text-foreground text-base mb-1">16:9 PDF Brand Book</h3>
                <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                  Agency-grade presentation deck covering brand strategy, color matrix, clearspace specifications, and typography hierarchy.
                </p>
              </div>
              <Button
                onClick={handlePdfDownload}
                disabled={isPdfing}
                variant="outline"
                className="w-full border-border bg-muted/40 hover:bg-muted text-foreground cursor-pointer"
              >
                <IconDownload size={16} className="mr-2" />
                {isPdfing ? 'Rendering PDF...' : 'Export Landscape PDF'}
              </Button>
            </div>
          </div>

          {/* Quick Copy Code Snippets */}
          <div className="space-y-4 pt-2">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <IconCode size={16} className="text-primary" />
              Developer Tokens &amp; Config
            </h4>

            {/* Tailwind config */}
            <div className="rounded-xl border border-border bg-muted/30 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-foreground">tailwind.config.js (Tailwind v3)</span>
                <button
                  onClick={() => handleCopyCode('tailwind', tailwindCode)}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground px-2 py-1 rounded bg-card border border-border transition cursor-pointer"
                >
                  {copiedKey === 'tailwind' ? <IconCheck size={14} className="text-emerald-500" /> : <IconCopy size={14} />}
                  {copiedKey === 'tailwind' ? 'Copied' : 'Copy'}
                </button>
              </div>
              <pre className="text-[11px] text-muted-foreground font-mono overflow-x-auto max-h-32 p-2 bg-background rounded border border-border">
                {tailwindCode}
              </pre>
            </div>

            {/* Design Tokens JSON */}
            <div className="rounded-xl border border-border bg-muted/30 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-foreground">tokens.json (W3C Design Tokens)</span>
                <button
                  onClick={() => handleCopyCode('tokens', tokensJsonCode)}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground px-2 py-1 rounded bg-card border border-border transition cursor-pointer"
                >
                  {copiedKey === 'tokens' ? <IconCheck size={14} className="text-emerald-500" /> : <IconCopy size={14} />}
                  {copiedKey === 'tokens' ? 'Copied' : 'Copy'}
                </button>
              </div>
              <pre className="text-[11px] text-muted-foreground font-mono overflow-x-auto max-h-32 p-2 bg-background rounded border border-border">
                {tokensJsonCode}
              </pre>
            </div>

            {/* CSS Variables */}
            <div className="rounded-xl border border-border bg-muted/30 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-foreground">colors.css (:root variables)</span>
                <button
                  onClick={() => handleCopyCode('css', cssCode)}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground px-2 py-1 rounded bg-card border border-border transition cursor-pointer"
                >
                  {copiedKey === 'css' ? <IconCheck size={14} className="text-emerald-500" /> : <IconCopy size={14} />}
                  {copiedKey === 'css' ? 'Copied' : 'Copy'}
                </button>
              </div>
              <pre className="text-[11px] text-muted-foreground font-mono overflow-x-auto max-h-32 p-2 bg-background rounded border border-border">
                {cssCode}
              </pre>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
