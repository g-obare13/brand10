import { useState, useRef, useEffect } from "react"
import { useBrandStore } from "@/store/brandStore"
import { extractColorsFromSvg, clusterDistinctColors } from "@/lib/extractor"
import { createColorSwatch } from "@/lib/colorUtils"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  IconVectorBezier2,
  IconSun,
  IconMoon,
  IconLayersLinked,
  IconUpload,
  IconTrash,
  IconRefresh,
  IconPalette,
  IconAlertCircle,
  IconCheck,
  IconSparkles,
  IconFileCode,
} from "@tabler/icons-react"
import { cn } from "@/lib/utils"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import WordReveal from "@/components/shared/WordReveal"

const MAX_SVG_BYTES = 1 * 1024 * 1024 // 1MB

export function StepLogo() {
  const brand = useBrandStore()
  const primaryColor =
    brand.colorPalette.find((c) => c.role === "primary")?.hex || "#6366f1"

  const [activeSlot, setActiveSlot] = useState<"primary" | "secondary">(
    "primary"
  )
  const [extractedColors, setExtractedColors] = useState<string[]>([])
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [dragOverSlot, setDragOverSlot] = useState<
    "primary" | "secondary" | null
  >(null)

  const primaryInputRef = useRef<HTMLInputElement>(null)
  const secondaryInputRef = useRef<HTMLInputElement>(null)

  // Extract up to 2 dominant colors from primary and secondary SVGs
  const refreshExtractedColors = async (
    primarySvg?: string | null,
    secondarySvg?: string | null
  ) => {
    const primaryColors = primarySvg
      ? await extractColorsFromSvg(primarySvg, 2)
      : []
    const secondaryColors = secondarySvg
      ? await extractColorsFromSvg(secondarySvg, 2)
      : []

    const combined = clusterDistinctColors(
      [...primaryColors, ...secondaryColors],
      4
    )
    setExtractedColors(combined)
  }

  useEffect(() => {
    if (brand.svgContent || brand.secondarySvgContent) {
      refreshExtractedColors(brand.svgContent, brand.secondarySvgContent)
    } else {
      setExtractedColors([])
    }
  }, [brand.svgContent, brand.secondarySvgContent])

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

      // Save to store and refresh dominant colors
      if (slot === "primary") {
        await brand.setLogoData({
          svgContent: text,
          isVector: true,
          aspectRatio,
        })
        await refreshExtractedColors(text, brand.secondarySvgContent)
      } else {
        await brand.setSecondaryLogoData({
          svgContent: text,
        })
        await refreshExtractedColors(brand.svgContent, text)
      }
    } catch (err) {
      console.error("SVG Processing Error:", err)
      setErrorMsg("An unexpected error occurred while reading the SVG file.")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleApplySingleColor = (
    hex: string,
    role: "primary" | "secondary" | "accent" | "neutral" | "background"
  ) => {
    const existingIndex = brand.colorPalette.findIndex((c) => c.role === role)
    if (existingIndex >= 0) {
      brand.updateColorSwatch(brand.colorPalette[existingIndex].id, { hex })
    } else {
      brand.addColorSwatch(hex, role)
    }
  }

  const handleSyncAllExtractedColors = () => {
    if (!extractedColors.length) return
    const roles: Array<
      "primary" | "secondary" | "accent" | "neutral" | "background"
    > = ["primary", "secondary", "accent", "neutral", "background"]
    const updatedPalette = extractedColors.map((hex, index) => {
      const role = roles[index] || "custom"
      return createColorSwatch(hex, role)
    })
    // Ensure we preserve background and neutral if few colors
    if (updatedPalette.length < 4) {
      if (!updatedPalette.some((c) => c.role === "neutral")) {
        updatedPalette.push(
          createColorSwatch("#0f172a", "neutral", "Midnight Neutral")
        )
      }
      if (!updatedPalette.some((c) => c.role === "background")) {
        updatedPalette.push(
          createColorSwatch("#ffffff", "background", "Clean Canvas")
        )
      }
    }
    brand.setColorPalette(updatedPalette)
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
        <WordReveal
          as="h4"
          stagger={0.03}
          duration={1.2}
          disableScrollTrigger={true}
          className="mb-2"
        >
          Logo Assets &amp; Color Extraction
        </WordReveal>
        <WordReveal
          as="p"
          stagger={0.03}
          duration={1.2}
          disableScrollTrigger={true}
          className="mb-2"
        >
          Upload vector marks (SVG only, max 1MB) for primary and secondary
          brand lockups. Colors are auto-extracted from mark geometry.
        </WordReveal>
      </div>

      {/* Error Alert */}
      {errorMsg && (
        <div className="flex items-center gap-2.5 rounded-2xl border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">
          <IconAlertCircle size={16} className="shrink-0" />
          <span className="font-medium">{errorMsg}</span>
        </div>
      )}

      {/* Dual Logo Slot Switcher Tabs */}
      <Tabs
        value={activeSlot}
        onValueChange={(val) => setActiveSlot(val as "primary" | "secondary")}
        className="w-full space-y-4"
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
                      refreshExtractedColors(null, brand.secondarySvgContent)
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
                      refreshExtractedColors(brand.svgContent, null)
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

      {/* 3. COLOR EXTRACTION & PALETTE PICKER */}
      {extractedColors.length > 0 &&
        Boolean(brand.svgContent || brand.secondarySvgContent) && (
          <div className="space-y-3 rounded-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                <span>Extracted Colors from SVG</span>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleSyncAllExtractedColors}
                className="cursor-pointer rounded-full border-primary/30 text-[11px] font-semibold text-primary hover:bg-primary/10"
                icon={<IconPalette size={13} />}
                iconPlacement="left"
              >
                Sync All to Palette
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
              {extractedColors.map((hex, idx) => {
                return (
                  <div
                    key={idx}
                    className="group relative flex flex-col items-center rounded-xl text-center transition-all hover:border-primary/50"
                  >
                    <div
                      className="size-8 rounded-lg shadow-xs transition-transform group-hover:scale-105"
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
    </div>
  )
}
