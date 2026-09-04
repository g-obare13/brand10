import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  extractColorsFromSvg,
  syncExtractedColorsToPalette,
} from "@/lib/extractor"
import { cn } from "@/lib/utils"
import { useBrandStore } from "@/store/brandStore"
import {
  IconAlertCircle,
  IconCheck,
  IconPlus,
  IconRefresh,
  IconTrash,
  IconUpload,
  IconX,
} from "@tabler/icons-react"
import { useEffect, useRef, useState } from "react"

const MAX_SVG_BYTES = 1 * 1024 * 1024 // 1MB

/**
 * Step 2 Wizard form component for configuring primary and secondary brand logo marks.
 * Features:
 * - Drag-and-drop SVG file uploads with validation and size limit enforcement.
 * - In-browser vector color extraction with clustering into brand color swatches.
 * - Logo clearspace multiplier adjustments and lockup previews.
 * - Brand guidelines Do's and Don'ts manager for logo usage rules.
 *
 * @component
 * @returns {React.ReactElement} The rendered logo configuration form.
 */
export function StepLogo() {
  const brand = useBrandStore()

  const [activeSlot, setActiveSlot] = useState<"primary" | "secondary">(
    "primary"
  )
  const [extractedColors, setExtractedColors] = useState<string[]>([])
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [, setIsProcessing] = useState(false)
  const [dragOverSlot, setDragOverSlot] = useState<
    "primary" | "secondary" | null
  >(null)

  const primaryInputRef = useRef<HTMLInputElement>(null)
  const secondaryInputRef = useRef<HTMLInputElement>(null)
  const lastExtractedPrimarySvg = useRef<string | null>(null)

  const [isAddingRule, setIsAddingRule] = useState(false)
  const [newRuleType, setNewRuleType] = useState<"do" | "dont">("dont")
  const [newRuleTitle, setNewRuleTitle] = useState("")
  const [newRuleDetail, setNewRuleDetail] = useState("")

  const handleAddRule = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newRuleTitle.trim()) return

    brand.addDoDont({
      type: newRuleType,
      rule: newRuleTitle.trim(),
      detail:
        newRuleDetail.trim() ||
        (newRuleType === "dont"
          ? "Prohibited logo treatment."
          : "Recommended logo treatment."),
    })

    setNewRuleTitle("")
    setNewRuleDetail("")
    setIsAddingRule(false)
  }

  const extractPrimaryColors = async (svg: string, syncPalette: boolean) => {
    const colors = await extractColorsFromSvg(svg, 4)
    setExtractedColors(colors)

    if (syncPalette && colors.length > 0) {
      const updated = syncExtractedColorsToPalette(colors, brand.colorPalette)
      brand.setColorPalette(updated)
    }
  }

  useEffect(() => {
    if (!brand.svgContent) {
      lastExtractedPrimarySvg.current = null
      setExtractedColors([])
      return
    }

    if (lastExtractedPrimarySvg.current === brand.svgContent) return
    lastExtractedPrimarySvg.current = brand.svgContent
    void extractPrimaryColors(brand.svgContent, false)
  }, [brand.svgContent])

  const handleSvgFile = async (file: File, slot: "primary" | "secondary") => {
    setErrorMsg(null)

    // 1. Validation: File Type (.svg)
    const isSvg =
      file.type === "image/svg+xml" || file.name.toLowerCase().endsWith(".svg")
    if (!isSvg) {
      setErrorMsg(
        "Invalid file type: Please upload an SVG (.svg) vector file only."
      )
      return
    }

    // 2. Validation: Max 1MB Size
    if (file.size > MAX_SVG_BYTES) {
      const sizeKb = (file.size / 1024).toFixed(0)
      setErrorMsg(
        `File too large (${sizeKb} KB): Maximum allowed SVG size is 1MB.`
      )
      return
    }

    setIsProcessing(true)

    try {
      const text = await file.text()

      // Validate SVG XML
      const parser = new DOMParser()
      const doc = parser.parseFromString(text, "image/svg+xml")
      const parserError = doc.querySelector("parsererror")
      if (parserError) {
        setErrorMsg("Corrupt SVG file: Unable to parse XML structure.")
        setIsProcessing(false)
        return
      }

      // Calculate Aspect Ratio
      let aspectRatio = 1.0
      const svgEl = doc.querySelector("svg")
      if (svgEl) {
        const viewBox = svgEl.getAttribute("viewBox")
        if (viewBox) {
          const parts = viewBox.split(/[\s,]+/).map(Number)
          if (parts.length === 4 && parts[2] > 0 && parts[3] > 0) {
            aspectRatio = parts[2] / parts[3]
          }
        } else {
          const width = parseFloat(svgEl.getAttribute("width") || "0")
          const height = parseFloat(svgEl.getAttribute("height") || "0")
          if (width > 0 && height > 0) {
            aspectRatio = width / height
          }
        }
      }

      // The primary mark is the single source of truth for the brand palette.
      if (slot === "primary") {
        lastExtractedPrimarySvg.current = text
        await extractPrimaryColors(text, true)
        await brand.setLogoData({
          svgContent: text,
          isVector: true,
          aspectRatio,
        })
      } else {
        await brand.setSecondaryLogoData({
          svgContent: text,
        })
      }
    } catch (err) {
      console.error("SVG Processing Error:", err)
      setErrorMsg("An unexpected error occurred while reading the SVG file.")
    } finally {
      setIsProcessing(false)
    }
  }

  const primarySvgUri = brand.svgContent
    ? `data:image/svg+xml;utf8,${encodeURIComponent(brand.svgContent)}`
    : null

  const secondarySvgUri = brand.secondarySvgContent
    ? `data:image/svg+xml;utf8,${encodeURIComponent(brand.secondarySvgContent)}`
    : null

  return (
    <div className="relative flex h-full flex-col space-y-6">
      {/* Step Header */}
      <div className="space-y-1">
        <h4 className="mb-2">Logo Assets &amp; Color Extraction</h4>
        <p className="mb-2">
          Upload vector marks (SVG only, max 1MB) for primary and secondary
          brand lockups. Colors are auto-extracted from mark geometry.
        </p>
      </div>

      {/* Error Alert */}
      {errorMsg && (
        <div className="logo-item-anim flex items-center gap-2.5 rounded-2xl border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">
          <IconAlertCircle size={16} className="shrink-0" />
          <span className="font-medium">{errorMsg}</span>
        </div>
      )}

      {/* Dual Logo Slot Switcher Tabs */}
      <Tabs
        value={activeSlot}
        onValueChange={(val) => setActiveSlot(val as "primary" | "secondary")}
        className="logo-item-anim w-full space-y-4"
      >
        <TabsList className="w-full">
          <TabsTrigger value="primary">
            <span>Primary Logo</span>
          </TabsTrigger>

          <TabsTrigger value="secondary">
            <span>Secondary Logo</span>
          </TabsTrigger>
        </TabsList>

        {/* 1. PRIMARY LOGO UPLOAD / PREVIEW */}
        <TabsContent value="primary" className="mb-3 space-y-3">
          <input
            ref={primaryInputRef}
            type="file"
            accept=".svg,image/svg+xml"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) handleSvgFile(file, "primary")
            }}
          />

          {brand.svgContent && primarySvgUri ? (
            <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-card/80 p-4 transition-all">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex size-16 items-center justify-center rounded-xl border border-border/60 bg-muted/30 p-2">
                    <img
                      src={primarySvgUri}
                      alt="Primary Logo"
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-foreground">
                        Primary Logo
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => primaryInputRef.current?.click()}
                    className="cursor-pointer rounded-full text-xs"
                    icon={<IconRefresh size={13} />}
                    iconPlacement="left"
                  >
                    Replace
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      brand.removeLogo()
                      lastExtractedPrimarySvg.current = null
                      setExtractedColors([])
                    }}
                    className="cursor-pointer rounded-full text-xs text-destructive hover:bg-destructive/10"
                  >
                    <IconTrash size={13} />
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div
              onDragOver={(e) => {
                e.preventDefault()
                setDragOverSlot("primary")
              }}
              onDragLeave={() => setDragOverSlot(null)}
              onDrop={(e) => {
                e.preventDefault()
                setDragOverSlot(null)
                const file = e.dataTransfer.files.item(0)
                if (file) handleSvgFile(file, "primary")
              }}
              onClick={() => primaryInputRef.current?.click()}
              className={cn(
                "flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed p-6 text-center transition-all",
                dragOverSlot === "primary"
                  ? "scale-[1.01] border-primary bg-primary/10"
                  : "border-border/80 bg-card/40 hover:border-primary/50 hover:bg-card/70"
              )}
            >
              <div className="mb-2 flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <IconUpload size={20} />
              </div>
              <span className="text-xs font-bold text-foreground">
                Upload Primary Logo
              </span>
              <span className="mt-1 text-xs text-foreground">
                Drag &amp; drop or click to browse • Max 1MB (.svg only)
              </span>
            </div>
          )}
        </TabsContent>

        {/* 2. SECONDARY LOGO UPLOAD / PREVIEW */}
        <TabsContent value="secondary" className="space-y-3">
          <input
            ref={secondaryInputRef}
            type="file"
            accept=".svg,image/svg+xml"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) handleSvgFile(file, "secondary")
            }}
          />

          {brand.secondarySvgContent && secondarySvgUri ? (
            <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-card/80 p-4 transition-all">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex size-16 items-center justify-center rounded-xl border border-border/60 bg-muted/30 p-2">
                    <img
                      src={secondarySvgUri}
                      alt="Secondary Logo"
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-foreground">
                        Secondary Logo
                      </span>
                      <Badge className="border-primary/20 bg-primary/10 py-0 text-[10px] text-primary">
                        Alternate Lockup
                      </Badge>
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      Vector mark active • Wordmark / Horizontal
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => secondaryInputRef.current?.click()}
                    className="cursor-pointer rounded-full text-xs"
                    icon={<IconRefresh size={13} />}
                    iconPlacement="left"
                  >
                    Replace
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      brand.removeSecondaryLogo()
                    }}
                    className="cursor-pointer rounded-full text-xs text-destructive hover:bg-destructive/10"
                  >
                    <IconTrash size={13} />
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div
              onDragOver={(e) => {
                e.preventDefault()
                setDragOverSlot("secondary")
              }}
              onDragLeave={() => setDragOverSlot(null)}
              onDrop={(e) => {
                e.preventDefault()
                setDragOverSlot(null)
                const file = e.dataTransfer.files.item(0)
                if (file) handleSvgFile(file, "secondary")
              }}
              onClick={() => secondaryInputRef.current?.click()}
              className={cn(
                "flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed p-6 text-center transition-all",
                dragOverSlot === "secondary"
                  ? "scale-[1.01] border-primary bg-primary/10"
                  : "border-border/80 bg-card/40 hover:border-primary/50 hover:bg-card/70"
              )}
            >
              <div className="mb-2 flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <IconUpload size={20} />
              </div>
              <span className="text-xs font-bold text-foreground">
                Upload Secondary Logo
              </span>
              <span className="mt-1 text-xs text-foreground">
                Alternate mark, wordmark, or badge • Max 1MB (.svg only)
              </span>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* 3. EXTRACTED COLORS PREVIEW */}
      {extractedColors.length > 0 &&
        Boolean(brand.svgContent || brand.secondarySvgContent) && (
          <div className="logo-item-anim space-y-3 rounded-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-foreground">
                  Extracted Colors from Primary Logo
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {extractedColors.map((hex, idx) => {
                return (
                  <div
                    key={idx}
                    className="group relative flex flex-col items-center rounded-xl border border-border/50 bg-background/50 p-2 text-center transition-all hover:border-primary/40"
                  >
                    <div
                      className="size-7 rounded-lg shadow-xs transition-transform group-hover:scale-105"
                      style={{ backgroundColor: hex }}
                    />
                    <span className="mt-1.5 font-mono text-[10px] font-bold text-foreground uppercase">
                      {hex}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        )}

      {/* 4. LOGO USAGE CONSTRAINTS / DO'S & DON'TS */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <div>
            <Label>Logo Usage Guardrails &amp; Constraints</Label>
            <p className="text-xs text-muted-foreground">
              Define reproduction rules, safe alignments, and prohibited
              treatments.
            </p>
          </div>
          <Badge variant="outline" className="rounded-full">
            {brand.dosAndDonts.length} Rules
          </Badge>
        </div>

        {/* Existing Rules List */}
        <div className="space-y-2.5">
          {brand.dosAndDonts.map((item) => {
            const isDo = item.type === "do"
            return (
              <div
                key={item.id}
                className={cn(
                  "flex items-start justify-between gap-3 rounded-2xl border p-3.5 transition-colors",
                  isDo
                    ? "border-emerald-500/20 bg-emerald-500/5 hover:border-emerald-500/40"
                    : "border-border/80 bg-card/60 hover:border-rose-500/40"
                )}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={cn(
                      "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full text-xs",
                      isDo
                        ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                        : "bg-rose-500/20 text-rose-600 dark:text-rose-400"
                    )}
                  >
                    {isDo ? <IconCheck size={12} /> : <IconX size={12} />}
                  </div>
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-foreground">
                        {item.rule}
                      </span>
                      <Badge
                        variant="outline"
                        className={cn(
                          "rounded-full px-1.5 py-0 text-[10px] font-bold uppercase",
                          isDo
                            ? "border-emerald-500/40 text-emerald-600 dark:text-emerald-400"
                            : "border-rose-500/40 text-rose-600 dark:text-rose-400"
                        )}
                      >
                        {isDo ? "Do" : "Don't"}
                      </Badge>
                    </div>
                    <p className="text-xs leading-relaxed text-muted-foreground">
                      {item.detail}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => brand.removeDoDont(item.id)}
                  className="cursor-pointer rounded-lg p-1 text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive"
                  title="Remove rule"
                >
                  <IconTrash size={14} />
                </button>
              </div>
            )
          })}
        </div>

        {/* Add New Rule Form / Toggle */}
        {isAddingRule ? (
          <form
            onSubmit={handleAddRule}
            className="space-y-3 rounded-2xl border border-primary/30 bg-card/80 p-4 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-foreground">
                Add New Constraint Rule
              </span>
              <button
                type="button"
                onClick={() => setIsAddingRule(false)}
                className="cursor-pointer text-muted-foreground hover:text-foreground"
              >
                <IconX size={14} />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="space-y-1">
                <Label className="text-[11px]">Rule Type</Label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant={newRuleType === "dont" ? "default" : "outline"}
                    className="flex-1 text-xs"
                    onClick={() => setNewRuleType("dont")}
                  >
                    Don&apos;t (Prohibited)
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant={newRuleType === "do" ? "default" : "outline"}
                    className="flex-1 text-xs"
                    onClick={() => setNewRuleType("do")}
                  >
                    Do (Approved)
                  </Button>
                </div>
              </div>

              <div className="space-y-1 sm:col-span-2">
                <Label className="text-[11px]">Rule Title</Label>
                <Input
                  value={newRuleTitle}
                  onChange={(e) => setNewRuleTitle(e.target.value)}
                  placeholder="e.g. Don't invert trademark emblem"
                  className="text-xs"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-[11px]">Guideline Detail</Label>
              <Input
                value={newRuleDetail}
                onChange={(e) => setNewRuleDetail(e.target.value)}
                placeholder="e.g. The trademark mark must never be inverted or mirrored horizontally."
                className="text-xs"
              />
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsAddingRule(false)}
              >
                Cancel
              </Button>
              <Button type="submit" size="sm">
                Add Rule
              </Button>
            </div>
          </form>
        ) : (
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsAddingRule(true)}
            className="w-full cursor-pointer gap-1.5 rounded-xl border-dashed py-2.5 text-xs font-semibold"
            icon={<IconPlus size={14} />}
          >
            Add Constraint Rule
          </Button>
        )}
      </div>
    </div>
  )
}
