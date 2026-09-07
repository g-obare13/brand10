import { useEffect, useRef, useState } from "react"
import { useBrandStore } from "@/store/brandStore"
import { generateTonalShades } from "@/lib/colorUtils"
import GlassPanel from "@/components/shared/GlassPanel"
import { DESIGN_MOVEMENTS } from "@/data/wizard"
import { getPreviewTheme } from "./previewTheme"
import chroma from "chroma-js"
import { Badge } from "@/components/ui/badge"
import { Shield } from "@boxicons/react"
import { Button } from "@/components/ui/button"
import { IconCheck } from "@tabler/icons-react"
import { toast } from "sonner"
import { ColorInfoDialog } from "./ColorInfoDialog"
import { cn } from "@/lib/utils"
import { SHADE_KEYS } from "@/data/preview"

function findClosestShade(
  baseHex: string,
  shades: Record<string, string>
): string {
  try {
    let closestKey = "500"
    let minDelta = Infinity
    for (const [key, hex] of Object.entries(shades)) {
      const d = chroma.deltaE(baseHex, hex)
      if (d < minDelta) {
        minDelta = d
        closestKey = key
      }
    }
    return closestKey
  } catch {
    return "500"
  }
}

function getCardTextColor(shadeHex: string, darkestShadeHex: string): string {
  try {
    const lum = chroma(shadeHex).luminance()
    if (lum > 0.42) {
      return chroma(darkestShadeHex).darken(0.3).hex()
    }
    return "#ffffff"
  } catch {
    return "#ffffff"
  }
}

function getApproximateColorName(hex: string, defaultName?: string): string {
  try {
    const c = chroma(hex)
    const [h, s, l] = c.hsl()
    if (isNaN(h) || s < 0.08) {
      if (l > 0.85) return "Porcelain White"
      if (l < 0.15) return "Obsidian Black"
      return "Slate Gray"
    }
    if (h < 15 || h >= 345)
      return l < 0.35
        ? "Crimson Velvet"
        : l > 0.7
          ? "Rose Blossom"
          : "Persian Pink"
    if (h < 40) return l > 0.7 ? "Peach Nectar" : "Persian Orange"
    if (h < 65) return l > 0.7 ? "Vanilla Cream" : "Amber Gold"
    if (h < 150)
      return l > 0.7 ? "Mint Foam" : l < 0.3 ? "Forest Pine" : "Emerald Green"
    if (h < 200) return l > 0.7 ? "Sky Cyan" : "Teal Lagoon"
    if (h < 260)
      return l > 0.7 ? "Ice Blue" : l < 0.3 ? "Navy Marine" : "Electric Royal"
    if (h < 300) return l > 0.7 ? "Lavender Frost" : "Deep Indigo"
    if (h < 345) return l > 0.7 ? "Persian Pink" : "Magenta Pulse"
    return defaultName || "Brand Tone"
  } catch {
    return defaultName || "Brand Tone"
  }
}

interface ColorShadeScaleRowProps {
  label: string
  role: string
  hex: string
  shades: Record<string, string>
}

/**
 * Row component displaying a full 50-950 tonal shade scale with click-to-copy functionality.
 *
 * @component
 * @param {ColorShadeScaleRowProps} props - The component props.
 * @param {string} props.label - Display label for the color role.
 * @param {"primary" | "secondary"} props.role - The brand color role.
 * @param {string} props.hex - The source hex code for the swatch.
 * @param {Record<string, string>} props.shades - Map of shade keys (50-950) to hex strings.
 * @returns {React.ReactElement} The interactive tonal shade scale row.
 */
function ColorShadeScaleRow({
  label,
  role,
  hex,
  shades,
}: ColorShadeScaleRowProps) {
  const [copiedStep, setCopiedStep] = useState<string | null>(null)
  const copyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current)
      }
    }
  }, [])

  const handleCopy = (step: string, hexValue: string) => {
    navigator.clipboard.writeText(hexValue)
    setCopiedStep(step)
    if (copyTimeoutRef.current) {
      clearTimeout(copyTimeoutRef.current)
    }
    copyTimeoutRef.current = setTimeout(() => {
      setCopiedStep(null)
    }, 1500)
  }

  const safeShades =
    Object.keys(shades).length === 11 ? shades : generateTonalShades(hex)

  const closestShade = findClosestShade(hex, safeShades)
  const darkestShade = safeShades["950"] || safeShades["900"] || "#000000"

  return (
    <div className="space-y-3.5">
      {/* Header Row: Name, Badge and Modal Triggers */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="text-base font-semibold">{label}</span>
          <Badge
            className="rounded-full!"
            variant={"outline"}
            icon={<Shield />}
          >
            {role}
          </Badge>
        </div>

        <div className="flex items-center gap-5 sm:gap-6">
          <ColorInfoDialog
            label={label}
            role={role}
            hex={hex}
            shades={safeShades}
          >
            <Button variant={"ghost"}>Color info</Button>
          </ColorInfoDialog>
        </div>
      </div>

      {/* 11-Step Monochrome / Tonal Shade Cards Row */}
      <div className="grid grid-cols-11 gap-1">
        {SHADE_KEYS.map((step) => {
          const shadeHex = safeShades[step] || hex
          const isBase = step === closestShade
          const isCopied = copiedStep === step
          const textColor = getCardTextColor(shadeHex, darkestShade)
          const cleanHex = shadeHex.replace("#", "").toUpperCase()
          const copyValue = shadeHex.toUpperCase()

          return (
            <button
              type="button"
              key={step}
              onClick={() => {
                handleCopy(step, copyValue)
                toast.success(`${copyValue} Copied to clipboard`, {
                  position: "bottom-right",
                  icon: <IconCheck size={16} />,
                })
              }}
              title={`Click to copy ${copyValue}`}
              aria-label={`Copy shade ${step} (${copyValue}) to clipboard`}
              className="group relative flex min-h-24 cursor-pointer flex-col justify-between rounded-xl p-2 text-left transition-all select-none hover:scale-[1.03] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary active:scale-95 sm:p-2.5"
              style={{ backgroundColor: shadeHex }}
            >
              {/* Active Base Shade Indicator Dot or Copied Checkmark */}
              <div className="flex h-3 items-center justify-between">
                {isBase ? (
                  <div
                    className="size-1.5 rounded-full shadow-xs"
                    style={{ backgroundColor: textColor }}
                  />
                ) : (
                  <span />
                )}
                {isCopied && (
                  <IconCheck
                    size={13}
                    stroke={3}
                    style={{ color: textColor }}
                    className="animate-in duration-150 zoom-in-75 fade-in"
                  />
                )}
              </div>

              {/* Bottom Step Number and Uppercase Hex Value */}
              <div className="space-y-0.5" style={{ color: textColor }}>
                <span className="block text-[11px] leading-tight font-bold sm:text-xs">
                  {step}
                </span>
                <span className="block text-[9px] font-medium tracking-tight uppercase sm:text-[10px]">
                  {isCopied ? "COPIED" : cleanHex}
                </span>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

/**
 * Interactive live preview for brand color system, showing swatches, contrast ratios, and shades.
 * Features:
 * - Real-time WCAG accessibility / contrast ratings with Shield badges.
 * - 11-step tonal ramp generation (50 to 950) with click-to-copy hex functionality.
 * - Comprehensive ColorInfoDialog inspector for deep colorimetry metrics.
 * - Preview cards demonstrating primary and secondary color applications in UI contexts.
 *
 * @component
 * @returns {React.ReactElement} The rendered color system preview panel.
 */
export function StepColorsPreview() {
  const brand = useBrandStore()

  const brandSwatches = brand.colorPalette.filter(
    (c) => c.role !== "neutral" && c.role !== "background"
  )
  const displaySwatches =
    brandSwatches.length > 0
      ? brandSwatches
      : brand.colorPalette.slice(0, 2).length > 0
        ? brand.colorPalette.slice(0, 2)
        : [
            {
              id: "primary",
              role: "primary" as const,
              name: "Primary Brand",
              hex: "#6366f1",
              shades: generateTonalShades("#6366f1"),
            },
            {
              id: "secondary",
              role: "secondary" as const,
              name: "Secondary Accent",
              hex: "#06b6d4",
              shades: generateTonalShades("#06b6d4"),
            },
          ]

  const activeMovement =
    (brand.designMovement
      ? DESIGN_MOVEMENTS.find((m) => m.id === brand.designMovement)
      : null) ||
    DESIGN_MOVEMENTS.find((m) =>
      Object.entries(m.tones).every(
        ([k, v]) => brand.toneRatings[k as keyof typeof brand.toneRatings] === v
      )
    ) ||
    DESIGN_MOVEMENTS[0]

  const theme = getPreviewTheme(activeMovement.id)
  const primaryHex = displaySwatches[0]?.hex || "#6366f1"

  return (
    <div className={theme.container}>
      <GlassPanel
        blur="none"
        noise
        noiseOpacity={0.02}
        className={cn(
          "preview-card-anim relative flex flex-col space-y-8 overflow-hidden",
          theme.heroCard
        )}
      >
        {/* Ambient Glow */}
        {theme.heroGlow !== "hidden" && (
          <div
            className={theme.heroGlow}
            style={{
              backgroundColor: primaryHex,
            }}
          />
        )}

        {displaySwatches.map((swatch, idx) => {
          const name = getApproximateColorName(swatch.hex, swatch.name)

          return (
            <div key={swatch.id || idx}>
              {idx > 0 && <div className="h-8" />}
              <ColorShadeScaleRow
                label={name}
                role={swatch.role}
                hex={swatch.hex}
                shades={swatch.shades}
              />
            </div>
          )
        })}
      </GlassPanel>
    </div>
  )
}
