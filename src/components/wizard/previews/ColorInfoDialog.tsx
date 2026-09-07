import { useState } from "react"
import type { ReactNode } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  calculateApca,
  formatOklch,
  formatHsl,
  getReadableTextColor,
  generateTonalShades,
} from "@/lib/colorUtils"
import { IconCheck, IconCopy, IconInfoCircle } from "@tabler/icons-react"
import { toast } from "sonner"
import { Shield } from "@boxicons/react"
import { SHADE_KEYS } from "@/data/preview"

interface ColorInfoDialogProps {
  label: string
  role: string
  hex: string
  shades: Record<string, string>
  children?: ReactNode
}
/**
 * An inspector modal displaying comprehensive color space metrics and contrast ratings.
 * Features:
 * - Tabulated breakdown of all 11 tonal shades (HEX, HSL, OKLCH).
 * - APCA lightness contrast calculation and WCAG AA / AAA compliance.
 * - One-click clipboard copy for color values.
 * - Visual swatch sample column with calculated readable foreground colors.
 *
 * @component
 * @param {ColorInfoDialogProps} props - The component props.
 * @param {string} props.label - Color role name or label.
 * @param {"primary" | "secondary"} props.role - Brand color role.
 * @param {string} props.hex - Base hex code of the color.
 * @param {Record<string, string>} props.shades - 11-step tonal ramp shades.
 * @param {ReactNode} [props.children] - Trigger element for the dialog.
 * @returns {React.ReactElement} The color metrics dialog modal.
 */
export function ColorInfoDialog({
  label,
  role,
  hex,
  shades,
  children,
}: ColorInfoDialogProps) {
  const [open, setOpen] = useState(false)
  const [copiedKey, setCopiedKey] = useState<string | null>(null)

  const safeShades =
    Object.keys(shades).length === 11 ? shades : generateTonalShades(hex)

  const handleCopy = (key: string, value: string, title: string) => {
    navigator.clipboard.writeText(value)
    setCopiedKey(key)
    toast.success(`${title} copied: ${value}`, {
      position: "bottom-right",
      icon: <IconCheck size={16} />,
    })
    setTimeout(() => {
      setCopiedKey((curr) => (curr === key ? null : curr))
    }, 1500)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen} modal={false}>
      <DialogTrigger asChild>
        {children || <Button variant="ghost">Color info</Button>}
      </DialogTrigger>

      <DialogContent className="flex max-h-[90vh] flex-col rounded-3xl border border-border/80 bg-background/95 p-6 shadow-2xl backdrop-blur-md sm:max-w-3xl md:max-w-4xl">
        <DialogHeader className="space-y-1.5 border-b border-border/40 pb-2">
          <div className="flex items-center gap-3">
            <div
              className="size-4.5 rounded-full shadow-xs ring-1 ring-border"
              style={{ backgroundColor: hex }}
            />
            <DialogTitle className="text-lg font-semibold tracking-tight">
              {label} Color Info
            </DialogTitle>
            <Badge
              variant="outline"
              className="rounded-full text-xs capitalize"
              icon={<Shield />}
            >
              {role}
            </Badge>
          </div>
          <DialogDescription className="text-foreground">
            APCA L<sup>c</sup> is a contrast score that shows how readable text
            is on a background based on human perception.
          </DialogDescription>
        </DialogHeader>

        <TooltipProvider delay={100}>
          <div className="-mx-6 max-h-[62vh] overflow-x-auto overflow-y-auto px-6">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-border/50 hover:bg-transparent">
                  <TableHead className="w-14 text-xs font-semibold text-foreground">
                    #
                  </TableHead>
                  <TableHead className="min-w-55 text-xs font-semibold text-foreground">
                    <div className="flex items-center gap-1.5">
                      <span>
                        APCA L<sup>c</sup>
                      </span>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="inline-flex cursor-help text-muted-foreground transition-colors hover:text-foreground">
                            <IconInfoCircle size={15} />
                          </span>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="max-w-xs">
                          APCA LC is a contrast score that shows how readable
                          text is on a background based on human perception.
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </TableHead>
                  <TableHead className="min-w-47.5 text-xs font-semibold text-foreground">
                    OKLCH
                  </TableHead>
                  <TableHead className="min-w-30 text-xs font-semibold text-foreground">
                    Hexcode
                  </TableHead>
                  <TableHead className="min-w-42.5 text-xs font-semibold text-foreground">
                    HSL
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {SHADE_KEYS.map((step) => {
                  const shadeHex = safeShades[step] || hex
                  const oklchStr = formatOklch(shadeHex)
                  const hslStr = formatHsl(shadeHex)
                  const hexStr = shadeHex.toLowerCase()

                  // APCA contrast scores matching the 4 values
                  const shadeOnBlack = calculateApca(shadeHex, "#000000")
                  const shadeOnWhite = calculateApca(shadeHex, "#ffffff")
                  const whiteOnShade = calculateApca("#ffffff", shadeHex)
                  const blackOnShade = calculateApca("#000000", shadeHex)

                  const pillTextColor = getReadableTextColor(shadeHex)

                  return (
                    <TableRow
                      key={step}
                      className="border-b border-border/30 transition-colors hover:bg-muted/30"
                    >
                      {/* Step Number */}
                      <TableCell className="py-3 text-xs font-semibold text-muted-foreground">
                        {step}
                      </TableCell>

                      {/* APCA Lc Column */}
                      <TableCell className="py-3">
                        <div className="flex items-center gap-3">
                          {/* Colored Pill with two contrast scores */}
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div
                                className="flex cursor-default items-center gap-3 rounded-full px-3.5 py-1.5 text-xs font-semibold shadow-2xs select-none"
                                style={{
                                  backgroundColor: shadeHex,
                                  color: pillTextColor,
                                }}
                              >
                                <span>{shadeOnBlack}</span>
                                <span>{shadeOnWhite}</span>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent side="top" className="text-xs">
                              Shade on Black: L<sup>c</sup> {shadeOnBlack} •
                              Shade on White: L<sup>c</sup> {shadeOnWhite}
                            </TooltipContent>
                          </Tooltip>

                          {/* Contrast of white text on shade */}
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span
                                className="cursor-default text-xs font-semibold select-none"
                                style={{ color: shadeHex }}
                              >
                                {whiteOnShade}
                              </span>
                            </TooltipTrigger>
                            <TooltipContent side="top" className="text-xs">
                              White text on shade: L<sup>c</sup> {whiteOnShade}
                            </TooltipContent>
                          </Tooltip>

                          {/* Black circle with contrast of black text on shade */}
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="flex size-6.5 cursor-default items-center justify-center rounded-full bg-black text-xs font-semibold text-white shadow-xs select-none">
                                {blackOnShade}
                              </div>
                            </TooltipTrigger>
                            <TooltipContent side="top" className="text-xs">
                              Black text on shade: L<sup>c</sup> {blackOnShade}
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      </TableCell>

                      {/* OKLCH Column */}
                      <TableCell className="py-3 text-xs text-foreground/90">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              type="button"
                              variant="ghost"
                              size="xs"
                              onClick={() =>
                                handleCopy(`${step}-oklch`, oklchStr, "OKLCH")
                              }
                              className="group h-7 cursor-pointer text-xs font-normal text-foreground/90 hover:text-foreground"
                              icon={
                                copiedKey === `${step}-oklch` ? (
                                  <IconCheck
                                    size={13}
                                    className="text-emerald-500"
                                  />
                                ) : (
                                  <IconCopy
                                    size={13}
                                    className="text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
                                  />
                                )
                              }
                            >
                              <span>{oklchStr}</span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="top">
                            {copiedKey === `${step}-oklch`
                              ? "Copied OKLCH!"
                              : "Click to copy OKLCH"}
                          </TooltipContent>
                        </Tooltip>
                      </TableCell>

                      {/* Hexcode Column */}
                      <TableCell className="py-3 text-xs text-foreground/90">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              type="button"
                              variant="ghost"
                              size="xs"
                              onClick={() =>
                                handleCopy(`${step}-hex`, hexStr, "Hex")
                              }
                              className="group h-7 cursor-pointer text-xs font-normal text-foreground/90 hover:text-foreground"
                              icon={
                                copiedKey === `${step}-hex` ? (
                                  <IconCheck
                                    size={13}
                                    className="text-emerald-500"
                                  />
                                ) : (
                                  <IconCopy
                                    size={13}
                                    className="text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
                                  />
                                )
                              }
                            >
                              <span>{hexStr}</span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="top">
                            {copiedKey === `${step}-hex`
                              ? "Copied Hexcode!"
                              : "Click to copy Hexcode"}
                          </TooltipContent>
                        </Tooltip>
                      </TableCell>

                      {/* HSL Column */}
                      <TableCell className="py-3 text-xs text-foreground/90">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              type="button"
                              variant="ghost"
                              size="xs"
                              onClick={() =>
                                handleCopy(`${step}-hsl`, hslStr, "HSL")
                              }
                              className="group h-7 cursor-pointer text-xs font-normal text-foreground/90 hover:text-foreground"
                              icon={
                                copiedKey === `${step}-hsl` ? (
                                  <IconCheck
                                    size={13}
                                    className="text-emerald-500"
                                  />
                                ) : (
                                  <IconCopy
                                    size={13}
                                    className="text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
                                  />
                                )
                              }
                            >
                              <span>{hslStr}</span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="top">
                            {copiedKey === `${step}-hsl`
                              ? "Copied HSL!"
                              : "Click to copy HSL"}
                          </TooltipContent>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </TooltipProvider>
      </DialogContent>
    </Dialog>
  )
}
