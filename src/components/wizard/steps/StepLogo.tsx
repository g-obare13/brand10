import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item"
import { Label } from "@/components/ui/label"
import { Loader } from "@/components/ui/loader"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  extractColorsFromSvg,
  syncExtractedColorsToPalette,
} from "@/lib/extractor"
import { cn } from "@/lib/utils"
import { useBrandStore } from "@/store/brandStore"
import {
  IconAlertCircle,
  IconPlus,
  IconRefresh,
  IconTrash,
  IconUpload,
  IconX,
} from "@tabler/icons-react"
import { useEffect, useRef, useState } from "react"

const MAX_SVG_BYTES = 1 * 1024 * 1024 // 1MB

export interface StepLogoProps {
  isLoading?: boolean
}

/**
 * Step 2 Wizard form component for configuring primary and secondary brand logo marks.
 * Features:
 * - Drag-and-drop SVG file uploads with validation and size limit enforcement.
 * - In-browser vector color extraction with clustering into brand color swatches.
 * - Real-time Loader indicators during mark processing and palette extraction.
 * - Logo clearspace multiplier adjustments and lockup previews.
 * - Brand guidelines Do's and Don'ts manager for logo usage rules.
 *
 * @component
 * @param {StepLogoProps} [props] - The component props.
 * @param {boolean} [props.isLoading] - Optional manual override for loading state.
 * @returns {React.ReactElement} The rendered logo configuration form.
 */
export function StepLogo({ isLoading }: StepLogoProps = {}) {
  const brand = useBrandStore()
  const effectiveLoading = isLoading ?? (brand.isLoading || !brand.projectId)

  const [activeSlot, setActiveSlot] = useState<"primary" | "secondary">(
    "primary"
  )
  const [extractedColors, setExtractedColors] = useState<string[]>([])
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [processingSlot, setProcessingSlot] = useState<
    "primary" | "secondary" | null
  >(null)
  const isProcessing = processingSlot !== null
  const [isExtractingColors, setIsExtractingColors] = useState(false)
  const [dragOverSlot, setDragOverSlot] = useState<
    "primary" | "secondary" | null
  >(null)

  const primaryInputRef = useRef<HTMLInputElement>(null)
  const secondaryInputRef = useRef<HTMLInputElement>(null)
  const lastExtractedPrimarySvg = useRef<string | null>(null)

  const [isAddingRule, setIsAddingRule] = useState(false)
  const [newRuleTitle, setNewRuleTitle] = useState("")
  const [newRuleDetail, setNewRuleDetail] = useState("")

  const handleAddRule = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmedTitle = newRuleTitle.trim()
    if (!trimmedTitle) return

    brand.addDoDont({
      type: "dont",
      rule: trimmedTitle,
      detail: newRuleDetail.trim(),
    })

    setNewRuleTitle("")
    setNewRuleDetail("")
    setIsAddingRule(false)
  }

  const handleDeleteLogo = async (slot: "primary" | "secondary") => {
    setProcessingSlot(slot)
    try {
      if (slot === "primary") {
        await brand.removeLogo()
        lastExtractedPrimarySvg.current = null
        setExtractedColors([])
      } else {
        await brand.removeSecondaryLogo()
      }
    } catch (err) {
      console.error(`Failed to remove ${slot} logo:`, err)
    } finally {
      setProcessingSlot(null)
    }
  }

  const extractPrimaryColors = async (svg: string, syncPalette: boolean) => {
    setIsExtractingColors(true)
    try {
      const colors = await extractColorsFromSvg(svg, 4)
      setExtractedColors(colors)

      if (syncPalette && colors.length > 0) {
        const updated = syncExtractedColorsToPalette(colors, brand.colorPalette)
        brand.setColorPalette(updated)
      }
    } catch (err) {
      console.error("Color extraction error:", err)
    } finally {
      setIsExtractingColors(false)
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

    setProcessingSlot(slot)

    try {
      const text = await file.text()

      // Validate SVG XML
      const parser = new DOMParser()
      const doc = parser.parseFromString(text, "image/svg+xml")
      const parserError = doc.querySelector("parsererror")
      if (parserError) {
        setErrorMsg("Corrupt SVG file: Unable to parse XML structure.")
        setProcessingSlot(null)
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
      setProcessingSlot(null)
    }
  }

  const primarySvgUri = brand.svgContent
    ? `data:image/svg+xml;utf8,${encodeURIComponent(brand.svgContent)}`
    : null

  const secondarySvgUri = brand.secondarySvgContent
    ? `data:image/svg+xml;utf8,${encodeURIComponent(brand.secondarySvgContent)}`
    : null

  if (effectiveLoading) {
    return (
      <div className="flex h-full min-h-96 flex-col items-center justify-center space-y-4 rounded-2xl p-8 text-center">
        <Loader size="lg" />
        <div className="space-y-1">
          <p className="text-sm font-semibold text-foreground">
            Loading Logo Configuration...
          </p>
          <p className="text-xs text-muted-foreground">
            Retrieving vector marks, clearspace settings, and brand guidelines
          </p>
        </div>
      </div>
    )
  }

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

          {primarySvgUri ? (
            <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-card/80 p-4 transition-all">
              {processingSlot === "primary" && (
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-2 bg-background/85 backdrop-blur-xs">
                  <Loader size="sm" />
                  <span className="text-xs font-semibold text-foreground">
                    Deleting logo...
                  </span>
                </div>
              )}
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
                    variant="destructive_outline"
                    size="sm"
                    disabled={isProcessing}
                    onClick={() => handleDeleteLogo("primary")}
                    className="cursor-pointer rounded-full text-xs text-destructive hover:bg-destructive/10"
                    icon={
                      processingSlot === "primary" ? (
                        <Loader size="sm" className="size-3.5" />
                      ) : (
                        <IconTrash size={13} />
                      )
                    }
                    iconPlacement="left"
                  ></Button>
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
              onClick={() => {
                if (!isProcessing) primaryInputRef.current?.click()
              }}
              className={cn(
                "flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed p-6 text-center transition-all",
                dragOverSlot === "primary"
                  ? "scale-[1.01] border-primary bg-primary/10"
                  : "border-border/80 bg-card/40 hover:border-primary/50 hover:bg-card/70",
                isProcessing && "pointer-events-none opacity-80"
              )}
            >
              {processingSlot === "primary" ? (
                <div className="flex flex-col items-center justify-center space-y-2 py-2">
                  <Loader size="md" />
                  <span className="text-xs font-bold text-foreground">
                    Processing Primary Logo...
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Analyzing vector geometry &amp; extracting colors
                  </span>
                </div>
              ) : (
                <>
                  <div className="mb-2 flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <IconUpload size={20} />
                  </div>
                  <span className="text-xs font-bold text-foreground">
                    Upload Primary Logo
                  </span>
                  <span className="mt-1 text-xs text-foreground">
                    Drag &amp; drop or click to browse • Max 1MB (.svg only)
                  </span>
                </>
              )}
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

          {secondarySvgUri ? (
            <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-card/80 p-4 transition-all">
              {processingSlot === "secondary" && (
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-2 bg-background/85 backdrop-blur-xs">
                  <Loader size="sm" />
                  <span className="text-xs font-semibold text-foreground">
                    Deleting secondary logo...
                  </span>
                </div>
              )}
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
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={isProcessing}
                    onClick={() => handleDeleteLogo("secondary")}
                    className="cursor-pointer rounded-full text-xs text-destructive hover:bg-destructive/10"
                    icon={
                      processingSlot === "secondary" ? (
                        <Loader size="sm" className="size-3.5" />
                      ) : (
                        <IconTrash size={13} />
                      )
                    }
                    iconPlacement="left"
                  ></Button>
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
              onClick={() => {
                if (!isProcessing) secondaryInputRef.current?.click()
              }}
              className={cn(
                "flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed p-6 text-center transition-all",
                dragOverSlot === "secondary"
                  ? "scale-[1.01] border-primary bg-primary/10"
                  : "border-border/80 bg-card/40 hover:border-primary/50 hover:bg-card/70",
                isProcessing && "pointer-events-none opacity-80"
              )}
            >
              {processingSlot === "secondary" ? (
                <div className="flex flex-col items-center justify-center space-y-2 py-2">
                  <Loader size="md" />
                  <span className="text-xs font-bold text-foreground">
                    Processing Secondary Logo...
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Parsing vector mark &amp; dimensions
                  </span>
                </div>
              ) : (
                <>
                  <div className="mb-2 flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <IconUpload size={20} />
                  </div>
                  <span className="text-xs font-bold text-foreground">
                    Upload Secondary Logo
                  </span>
                  <span className="mt-1 text-xs text-foreground">
                    Alternate mark, wordmark, or badge • Max 1MB (.svg only)
                  </span>
                </>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* 3. EXTRACTED COLORS PREVIEW */}
      {(Boolean(brand.svgContent) || isExtractingColors) && (
        <div className="logo-item-anim space-y-3 rounded-2xl border border-border/80 bg-card/60 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-foreground">
                Extracted Colors from Primary Logo
              </span>
              {isExtractingColors ? (
                <Badge
                  variant="outline"
                  className="flex items-center gap-1.5 border-primary/30 bg-primary/10 text-[10px] text-primary"
                >
                  <Loader size="sm" className="size-3" />
                  Extracting...
                </Badge>
              ) : extractedColors.length > 0 ? (
                <Badge variant="ghost" className="text-[10px]">
                  {extractedColors.length} Swatches
                </Badge>
              ) : null}
            </div>

            {brand.svgContent && !isExtractingColors && (
              <Button
                type="button"
                variant="outline"
                className={"rounded-full"}
                size="sm"
                onClick={() => {
                  if (brand.svgContent) {
                    void extractPrimaryColors(brand.svgContent, true)
                  }
                }}
                icon={<IconRefresh size={12} />}
                iconPlacement="left"
              >
                Re-extract
              </Button>
            )}
          </div>

          {isExtractingColors ? (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <Loader size="sm" className="mb-2" />
              <span className="text-xs font-medium text-foreground">
                Analyzing vector paths &amp; clustering colors...
              </span>
              <span className="mt-1 text-[11px] text-muted-foreground">
                Auto-syncing extracted hues with your primary &amp; secondary
                brand swatches
              </span>
            </div>
          ) : extractedColors.length > 0 ? (
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
          ) : (
            <div className="py-2 text-center text-xs text-muted-foreground">
              No distinct accent colors detected in vector mark geometry.
            </div>
          )}
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
            return (
              <div
                key={item.id}
                className="flex items-start justify-between gap-3 transition-colors"
              >
                <Item variant="outline" key={item.id}>
                  <ItemContent>
                    <ItemTitle>{item.rule}</ItemTitle>
                    {item.detail ? (
                      <ItemDescription>{item.detail}</ItemDescription>
                    ) : null}
                  </ItemContent>
                  <ItemActions>
                    <Button
                      size="sm"
                      variant={"destructive_outline"}
                      onClick={() => brand.removeDoDont(item.id)}
                      className={"size-8 rounded-full"}
                    >
                      <IconTrash size={14} />
                    </Button>
                  </ItemActions>
                </Item>
              </div>
            )
          })}
        </div>

        {/* Add New Rule Form / Toggle */}
        {isAddingRule ? (
          <form
            onSubmit={handleAddRule}
            className="space-y-3 rounded-2xl border border-primary/30 bg-card/80 p-4"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-foreground">
                Add New Constraint Rule
              </span>
              <Button
                type="button"
                size="icon-sm"
                variant="outline"
                onClick={() => setIsAddingRule(false)}
              >
                <IconX size={14} />
              </Button>
            </div>

            <div className="space-y-1">
              <Label className="text-[11px]">Rule Title</Label>
              <Input
                value={newRuleTitle}
                onChange={(e) => setNewRuleTitle(e.target.value)}
                placeholder="e.g. Don't invert trademark emblem, or Keep clearspace intact"
                className="text-xs"
                required
                autoFocus
              />
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
