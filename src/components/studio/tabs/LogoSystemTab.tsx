import React, { useRef, useState } from "react"
import { useBrandStore } from "@/store/brandStore"
import { ingestBrandFile } from "@/lib/extractor"
import { Button } from "@/components/ui/button"
import {
  IconUpload,
  IconCheck,
  IconX,
  IconPlus,
  IconGridDots,
  IconEye,
  IconSun,
  IconMoon,
} from "@tabler/icons-react"
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
  const [newType, setNewType] = useState<"do" | "dont">("do")
  const [newRule, setNewRule] = useState("")
  const [newDetail, setNewDetail] = useState("")

  const handleFileUpload = async (file: File) => {
    try {
      setIsProcessing(true)
      const extracted = await ingestBrandFile(file)
      await brand.setLogoData({
        svgContent: extracted.svgDataUri
          ? atob(extracted.svgDataUri.split(",")[1] || "")
          : undefined,
        rasterDataUri: extracted.rasterDataUri,
        isVector: extracted.isVector,
        aspectRatio: extracted.aspectRatio,
      })
      if (extracted.colors.length) {
        brand.setColorPalette(extracted.colors)
      }
      if (extracted.brandName && extracted.brandName !== "Acme Brand") {
        brand.setBrandName(extracted.brandName)
      }
    } catch (err) {
      console.error("File ingest error:", err)
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
        detail:
          newDetail.trim() ||
          "Ensure brand integrity is preserved across all communications.",
      })
      setNewRule("")
      setNewDetail("")
    }
  }

  const logoSrc = brand.svgContent
    ? `data:image/svg+xml;utf8,${encodeURIComponent(brand.svgContent)}`
    : brand.rasterDataUri || "/Brand10.svg"

  return (
    <div className="animate-in space-y-8 duration-300 fade-in">
      {/* Master Lockup & Variant Matrix */}
      <div className="space-y-6 rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-xs md:p-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h2 className="flex items-center gap-2 text-xl font-bold text-foreground">
              <IconEye size={20} className="text-primary" />
              Master Lockup &amp; Auto-Inverted Variants
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Derived high-contrast iterations calibrated for varying ambient
              luminance and print requirements.
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
              className="border-border bg-muted/30 text-xs hover:bg-muted"
            >
              <IconUpload size={14} className="mr-1.5" />
              {isProcessing ? "Processing..." : "Upload New Logo"}
            </Button>
          </div>
        </div>

        {/* 4 Variant Tiles */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* 1. Dark Background */}
          <div className="group relative flex min-h-[180px] flex-col items-center justify-center rounded-xl border border-zinc-800 bg-zinc-950 p-6">
            <div className="absolute top-3 left-3 flex items-center gap-1.5 text-[11px] font-medium text-zinc-400">
              <IconMoon size={13} className="text-indigo-400" />
              Dark Canvas
            </div>
            <div className="flex h-20 w-full items-center justify-center p-2">
              <img
                src={logoSrc}
                alt={`${brand.brandName} Dark`}
                className="max-h-full max-w-full object-contain drop-shadow-md filter"
              />
            </div>
            <span className="mt-3 font-mono text-[10px] text-zinc-500">
              Primary High Contrast
            </span>
          </div>

          {/* 2. Light Background */}
          <div className="group relative flex min-h-[180px] flex-col items-center justify-center rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-100">
            <div className="absolute top-3 left-3 flex items-center gap-1.5 text-[11px] font-medium text-zinc-600">
              <IconSun size={13} className="text-amber-500" />
              Light Canvas
            </div>
            <div className="flex h-20 w-full items-center justify-center p-2">
              <img
                src={logoSrc}
                alt={`${brand.brandName} Light`}
                className="max-h-full max-w-full object-contain"
              />
            </div>
            <span className="mt-3 font-mono text-[10px] text-zinc-500">
              Editorial / Print Spec
            </span>
          </div>

          {/* 3. Monochrome White */}
          <div className="group relative flex min-h-[180px] flex-col items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900 p-6">
            <div className="absolute top-3 left-3 text-[11px] font-medium text-zinc-400">
              Mono White
            </div>
            <div className="flex h-20 w-full items-center justify-center p-2">
              <img
                src={logoSrc}
                alt={`${brand.brandName} Mono White`}
                className="max-h-full max-w-full object-contain brightness-0 invert"
              />
            </div>
            <span className="mt-3 font-mono text-[10px] text-zinc-500">
              1-Bit Inverted
            </span>
          </div>

          {/* 4. Monochrome Black */}
          <div className="group relative flex min-h-[180px] flex-col items-center justify-center rounded-xl border border-zinc-200 bg-zinc-100 p-6 dark:border-zinc-800">
            <div className="absolute top-3 left-3 text-[11px] font-medium text-zinc-700">
              Mono Black
            </div>
            <div className="flex h-20 w-full items-center justify-center p-2">
              <img
                src={logoSrc}
                alt={`${brand.brandName} Mono Black`}
                className="max-h-full max-w-full object-contain brightness-0"
              />
            </div>
            <span className="mt-3 font-mono text-[10px] text-zinc-500">
              1-Bit Silhouette
            </span>
          </div>
        </div>
      </div>

      {/* Clearspace Exclusion Grid */}
      <div className="space-y-6 rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-xs md:p-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h3 className="flex items-center gap-2 text-lg font-bold text-foreground">
              <IconGridDots size={18} className="text-chart-2" />
              Clearspace &amp; Exclusion Grid
            </h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Minimum protective boundary required around the symbol to prevent
              visual collision.
            </p>
          </div>

          {/* Multiplier Slider */}
          <div className="flex items-center gap-4 rounded-xl border border-border bg-muted/40 px-4 py-2">
            <span className="text-xs font-medium text-muted-foreground">
              Margin Ratio:
            </span>
            <input
              type="range"
              min="0.5"
              max="2.0"
              step="0.25"
              value={brand.clearspaceMultiplier}
              onChange={(e) =>
                brand.setClearspaceMultiplier(parseFloat(e.target.value))
              }
              className="w-28 cursor-pointer accent-primary"
            />
            <span className="rounded border border-primary/20 bg-primary/10 px-2 py-0.5 font-mono text-xs font-bold text-primary">
              {brand.clearspaceMultiplier}X
            </span>
          </div>
        </div>

        {/* Live Grid Canvas */}
        <div className="relative flex min-h-[260px] items-center justify-center overflow-hidden rounded-xl border border-dashed border-primary/40 bg-muted/20 p-12">
          {/* Blueprint Grid pattern */}
          <div
            className="pointer-events-none absolute inset-0 opacity-15"
            style={{
              backgroundImage:
                "linear-gradient(to right, var(--primary) 1px, transparent 1px), linear-gradient(to bottom, var(--primary) 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />

          {/* Clearspace Exclusion Box */}
          <div
            className="relative flex items-center justify-center rounded-lg border border-dashed border-primary bg-primary/5 transition-all duration-200"
            style={{
              padding: `${brand.clearspaceMultiplier * 36}px`,
            }}
          >
            {/* Corner Indicators */}
            <span className="absolute -top-3 -left-3 rounded border border-primary/40 bg-card px-1.5 py-0.5 font-mono text-[10px] text-primary shadow-xs">
              {brand.clearspaceMultiplier}X
            </span>
            <span className="absolute -right-3 -bottom-3 rounded border border-primary/40 bg-card px-1.5 py-0.5 font-mono text-[10px] text-primary shadow-xs">
              {brand.clearspaceMultiplier}X
            </span>

            {/* Inner Logo */}
            <div className="flex h-24 w-48 items-center justify-center rounded-md border border-border bg-card p-2 shadow-inner">
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
      <div className="space-y-6 rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-xs md:p-8">
        <div>
          <h3 className="text-lg font-bold text-foreground">
            Usage Guidelines (Do&apos;s &amp; Don&apos;ts)
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Rules to maintain consistent execution across internal teams and
            external agency partners.
          </p>
        </div>

        {/* List of Rules */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {brand.dosAndDonts.map((item) => {
            const isDo = item.type === "do"
            return (
              <div
                key={item.id}
                className={`flex items-start justify-between gap-3 rounded-xl border p-4 ${
                  isDo
                    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                    : "border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-300"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`shrink-0 rounded-lg p-1.5 ${
                      isDo
                        ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                        : "bg-rose-500/20 text-rose-600 dark:text-rose-400"
                    }`}
                  >
                    {isDo ? <IconCheck size={16} /> : <IconX size={16} />}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold tracking-wider text-foreground uppercase">
                      {isDo ? "DO: " : "DON'T: "}
                      {item.rule}
                    </h4>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                      {item.detail}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => brand.removeDoDont(item.id)}
                  className="cursor-pointer text-muted-foreground transition hover:text-foreground"
                  title="Remove rule"
                >
                  <IconX size={14} />
                </button>
              </div>
            )
          })}
        </div>

        {/* Add Rule Form */}
        <form
          onSubmit={handleAddRule}
          className="space-y-3 rounded-xl border border-border bg-muted/30 p-4"
        >
          <h4 className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
            <IconPlus size={14} className="text-primary" /> Add Custom Guideline
            Rule
          </h4>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
            <select
              value={newType}
              onChange={(e) => setNewType(e.target.value as "do" | "dont")}
              className="rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground outline-none focus:border-primary"
            >
              <option value="do">DO Rule (Approved)</option>
              <option value="dont">DON&apos;T Rule (Prohibited)</option>
            </select>

            <input
              type="text"
              value={newRule}
              onChange={(e) => setNewRule(e.target.value)}
              placeholder="Rule title (e.g. Maintain Contrast)"
              className="rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground outline-none focus:border-primary sm:col-span-1"
            />

            <input
              type="text"
              value={newDetail}
              onChange={(e) => setNewDetail(e.target.value)}
              placeholder="Detailed description"
              className="rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground outline-none focus:border-primary sm:col-span-2"
            />
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              size="sm"
              className="bg-primary text-xs text-primary-foreground hover:opacity-90"
            >
              Add Rule
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
