import React, { useState, useEffect, useRef } from "react"
import { useBrandStore } from "@/store/brandStore"
import { Label } from "@/components/ui/label"
import { IconUpload, IconFileText, IconSparkles } from "@tabler/icons-react"
import { cn } from "@/lib/utils"
import WordReveal from "@/components/shared/WordReveal"
import { fetchGoogleFonts, registerCustomFontFace } from "@/lib/googleFonts"
import type { GoogleFontItem } from "@/lib/googleFonts"
import { loadGoogleFont } from "@/lib/fontLoader"
import { toast } from "sonner"

import {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxEmpty,
} from "@/components/ui/combobox"
import { Check, X } from "@boxicons/react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { gsap } from "gsap"

interface FontComboboxProps {
  label: string
  subtitle?: string
  value: string
  onSelect: (fontName: string) => void
  fonts: GoogleFontItem[]
  isLoading?: boolean
}

function FontCombobox({
  label,
  subtitle,
  value,
  onSelect,
  fonts,
  isLoading,
}: FontComboboxProps) {
  const [query, setQuery] = useState("")

  const filtered = fonts.filter((f) =>
    f.family.toLowerCase().includes(query.toLowerCase())
  )

  const handleValueChange = (selected: string | null) => {
    if (selected) {
      loadGoogleFont(selected)
      onSelect(selected)
    }
  }

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <Label>{label}</Label>
      </div>

      <Combobox
        value={value}
        onValueChange={handleValueChange}
        onInputValueChange={(search) => setQuery(search)}
      >
        <ComboboxInput
          placeholder={value || "Search font..."}
          className="px-4"
          style={{ fontFamily: value ? `"${value}", sans-serif` : undefined }}
        />
        <ComboboxContent className="z-50 w-full">
          <ComboboxList className="max-h-60 overflow-y-auto p-1">
            {isLoading && fonts.length === 0 ? (
              <div className="p-3 text-center text-xs text-muted-foreground">
                Fetching Google Fonts catalog...
              </div>
            ) : (
              <>
                <ComboboxEmpty className="p-3 text-center text-xs text-muted-foreground">
                  No fonts found for "{query}"
                </ComboboxEmpty>
                {filtered.slice(0, 50).map((font) => (
                  <ComboboxItem
                    key={font.family}
                    value={font.family}
                    className="flex cursor-pointer items-center justify-between py-2 text-xs"
                  >
                    <span
                      className="truncate"
                      style={{ fontFamily: `"${font.family}", sans-serif` }}
                    >
                      {font.family}
                    </span>
                    <span className="ml-2 shrink-0 rounded bg-muted px-1.5 py-0.5 font-mono text-[9px] tracking-wider text-muted-foreground uppercase">
                      {font.category}
                    </span>
                  </ComboboxItem>
                ))}
              </>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>

      {subtitle && (
        <span className="text-sm text-muted-foreground">{subtitle}</span>
      )}
    </div>
  )
}

export function StepTypography() {
  const brand = useBrandStore()
  const [googleFonts, setGoogleFonts] = useState<GoogleFontItem[]>([])
  const [isLoadingFonts, setIsLoadingFonts] = useState(true)
  const [uploadTarget, setUploadTarget] = useState<"display" | "body">(
    "display"
  )
  const fileInputRef = useRef<HTMLInputElement>(null)
  const stepContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!stepContainerRef.current) return
    const ctx = gsap.context(() => {
      const cards = stepContainerRef.current?.querySelectorAll(".step-typo-anim")
      if (cards && cards.length > 0) {
        gsap.fromTo(
          cards,
          { y: 16, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.5,
            stagger: 0.08,
            ease: "power2.out",
          }
        )
      }
    }, stepContainerRef)

    return () => ctx.revert()
  }, [])

  useEffect(() => {
    let isMounted = true
    fetchGoogleFonts()
      .then((fonts) => {
        if (isMounted) {
          setGoogleFonts(fonts)
          setIsLoadingFonts(false)
        }
      })
      .catch(() => {
        if (isMounted) setIsLoadingFonts(false)
      })

    // Pre-load active fonts into DOM
    loadGoogleFont(brand.displayFont)
    loadGoogleFont(brand.bodyFont)
    loadGoogleFont(brand.monoFont)

    return () => {
      isMounted = false
    }
  }, [brand.displayFont, brand.bodyFont, brand.monoFont])

  const handleCustomFontUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0]
    if (!file) return

    const ext = file.name.split(".").pop()?.toLowerCase()
    if (!["woff2", "woff", "ttf", "otf"].includes(ext || "")) {
      toast.error(
        "Please upload a valid font file (.woff2, .woff, .ttf, or .otf)"
      )
      return
    }

    try {
      // Derive a clean font family name from file name
      const rawName = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]+/g, " ")
      const cleanFamily = rawName.charAt(0).toUpperCase() + rawName.slice(1)

      // Create blob URL for immediate FontFace registration
      const blobUrl = URL.createObjectURL(file)
      const success = await registerCustomFontFace(cleanFamily, blobUrl)

      if (success) {
        // Stage font file in store so it persists to Supabase on Continue
        brand.stageFontFile({
          file,
          family: cleanFamily,
          target: uploadTarget,
        })

        toast.success(
          `Custom font "${cleanFamily}" loaded and applied to ${uploadTarget === "display" ? "Display" : "Body"}!`
        )
      } else {
        toast.error("Could not register font in browser. Please check format.")
      }
    } catch (err) {
      console.error("Font upload error:", err)
      toast.error("Failed to process font file.")
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  return (
    <div ref={stepContainerRef} className="space-y-6">
      <div className="space-y-1">
        <WordReveal
          as="h4"
          stagger={0.03}
          duration={1.2}
          disableScrollTrigger={true}
          className="mb-2"
        >
          Hierarchy &amp; Type Scale
        </WordReveal>
        <WordReveal
          as="p"
          stagger={0.03}
          duration={1.2}
          disableScrollTrigger={true}
          className="mb-2"
        >
          Select cohesive Google Font pairings, search the live catalog, or
          upload custom brand typefaces (.woff2, .woff, .ttf, .otf).
        </WordReveal>
      </div>

      <div className="space-y-5">
        {/* Searchable Google Font Selectors */}
        <div className="step-typo-anim space-y-3">
          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
            <FontCombobox
              label="Primary / Display Font"
              subtitle="Headings (H1 - H6)"
              value={brand.displayFont}
              onSelect={(family) =>
                brand.setTypography({ displayFont: family })
              }
              fonts={googleFonts}
              isLoading={isLoadingFonts}
            />

            <FontCombobox
              label="Secondary / Body Font"
              subtitle="Body & Subtitles"
              value={brand.bodyFont}
              onSelect={(family) => brand.setTypography({ bodyFont: family })}
              fonts={googleFonts}
              isLoading={isLoadingFonts}
            />
          </div>
        </div>

        {/* Custom Font Upload Area */}
        <div className="step-typo-anim space-y-3 rounded-2xl border border-dashed border-border/90 bg-card/40 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <IconUpload size={16} className="text-primary" />
              <Label>Upload Custom Font</Label>
            </div>
            <div className="flex items-center gap-1 rounded-full border border-border bg-muted/40 p-0.5 text-[10px]">
              <Button
                variant={uploadTarget === "display" ? "default" : "outline"}
                onClick={() => setUploadTarget("display")}
                size={"sm"}
                className={"rounded-full"}
              >
                Apply to Display
              </Button>
              <Button
                variant={uploadTarget === "body" ? "default" : "outline"}
                onClick={() => setUploadTarget("body")}
                size={"sm"}
                className={"rounded-full"}
              >
                Apply to Body
              </Button>
            </div>
          </div>

          <div
            onClick={() => fileInputRef.current?.click()}
            className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-border/60 bg-muted/20 px-3 py-4 text-center transition hover:border-primary/50 hover:bg-muted/40"
          >
            <IconFileText size={22} className="mb-1 text-muted-foreground" />
            <p className="text-xs font-medium text-foreground">
              Click to browse custom font files
            </p>
            <p className="text-[10px] text-muted-foreground">
              Supports .woff2, .woff, .ttf, .otf · Persisted to cloud on
              Continue
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".woff2,.woff,.ttf,.otf,font/woff2,font/woff,font/ttf,font/otf"
              onChange={handleCustomFontUpload}
              className="hidden"
            />
          </div>

          {brand.stagedFontFiles && brand.stagedFontFiles.length > 0 && (
            <div className="space-y-1">
              <div className="flex flex-wrap gap-1.5">
                {brand.stagedFontFiles.map((staged) => (
                  <Badge
                    key={staged.family}
                    variant={"outline"}
                    icon={<X className="cursor-pointer transition hover:text-destructive" />}
                    onClick={() => {
                      brand.removeStagedFontFile(staged.family)
                      toast.info(`Removed custom font "${staged.family}" (reset to Inter)`)
                    }}
                    className="cursor-pointer transition hover:border-destructive/50 hover:bg-destructive/10"
                  >
                    {staged.family} ({staged.target})
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Type Scale Ratio Slider */}
        <div className="step-typo-anim space-y-3 rounded-2xl border border-border/80 bg-card/60 p-4">
          <div className="flex items-center justify-between text-xs font-bold text-foreground">
            <span>Modular Scale Multiplier</span>
            <span className="text-primary">
              {brand.typeScaleRatio} (
              {brand.typeScaleRatio >= 1.333
                ? "Perfect Fourth"
                : brand.typeScaleRatio >= 1.25
                  ? "Major Third"
                  : "Minor Third"}
              )
            </span>
          </div>

          <Slider
            min={1.15}
            max={1.414}
            step={0.025}
            value={brand.typeScaleRatio}
            onValueChange={(val) => {
              const nextVal = typeof val === "number" ? val : Array.isArray(val) ? val[0] : 1.25
              brand.setTypography({ typeScaleRatio: nextVal })
            }}
            className="py-1"
          />

          <p className="text-sm text-muted-foreground">
            Controls mathematical proportional stepping from H1 (36px+) down to
            caption copy (11px).
          </p>
        </div>
      </div>
    </div>
  )
}
