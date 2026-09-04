import { Badge } from "@/components/ui/badge"
import { A4PageFrame  } from "./A4PageFrame"
import type {PreviewStyleId} from "./A4PageFrame";
import { cn } from "@/lib/utils"
import {
  IconCompass,
  IconLayersLinked,
  IconShieldCheck,
  IconSparkles,
  IconDeviceLaptop,
  IconFileCode,
  IconPrinter,
  IconCheck,
} from "@tabler/icons-react"

interface PageTouchpointsProps {
  brandName: string
  iconStyle: "stroke" | "solid" | "duotone"
  iconRadius: number
  iconStroke: number
  primaryColor: string
  styleTheme: PreviewStyleId
  displayFont: string
  bodyFont: string
  monoFont: string
}

export function PageTouchpoints({
  brandName,
  iconStyle = "stroke",
  iconRadius = 8,
  iconStroke = 1.75,
  primaryColor,
  styleTheme,
  displayFont,
  bodyFont,
  monoFont,
}: PageTouchpointsProps) {
  const activeYear = new Date().getFullYear()

  return (
    <A4PageFrame
      id="page-06"
      pageNumber={6}
      totalPages={6}
      sectionNumber="06"
      sectionTitle="System Specs & Governance"
      brandName={brandName}
      styleTheme={styleTheme}
      displayFont={displayFont}
      bodyFont={bodyFont}
      monoFont={monoFont}
    >
      <div className="flex h-full flex-col justify-between space-y-6">
        {/* Intro */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-[10px] font-mono uppercase">
              Production Tokens
            </Badge>
            <Badge variant="default" className="text-[10px]">
              System Version 1.0.0
            </Badge>
          </div>
          <h2>Iconography & Touchpoint Specs</h2>
          <p className="text-xs opacity-75">
            Technical guidelines for iconography geometry, code token integration, and print-to-digital parity.
          </p>
        </div>

        {/* Iconography System Showcase */}
        <div
          className={cn(
            "rounded-2xl border p-5 space-y-4",
            styleTheme === "cinematic"
              ? "border-zinc-800 bg-zinc-900/60"
              : "border-zinc-200 bg-white"
          )}
        >
          <div className="flex items-center justify-between border-b pb-3">
            <div>
              <h4 className="text-sm font-semibold">Icon Geometry & Stroke Rules</h4>
              <p className="text-[11px] opacity-70">
                Optimized on a 24x24 pixel grid with uniform line weight.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-[10px] font-mono capitalize">
                Style: {iconStyle}
              </Badge>
              <Badge variant="outline" className="text-[10px] font-mono">
                Radius: {iconRadius}px
              </Badge>
              <Badge variant="outline" className="text-[10px] font-mono">
                Weight: {iconStroke}px
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-3">
            {[
              { icon: <IconCompass size={22} stroke={iconStroke} />, label: "Navigation" },
              { icon: <IconLayersLinked size={22} stroke={iconStroke} />, label: "Integration" },
              { icon: <IconShieldCheck size={22} stroke={iconStroke} />, label: "Security" },
              { icon: <IconSparkles size={22} stroke={iconStroke} />, label: "Intelligence" },
            ].map((item, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center justify-center rounded-xl border border-black/5 bg-zinc-500/5 p-4 text-center transition-transform hover:scale-105"
                style={{ borderRadius: `${iconRadius}px` }}
              >
                <div
                  className="mb-2 flex size-10 items-center justify-center rounded-lg shadow-xs"
                  style={{
                    backgroundColor: `${primaryColor}15`,
                    color: primaryColor,
                    borderRadius: `${Math.max(4, iconRadius - 2)}px`,
                  }}
                >
                  {item.icon}
                </div>
                <span className="font-mono text-[10px] font-semibold opacity-70">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Digital & Print Production Matrix */}
        <div className="grid grid-cols-3 gap-3">
          <div
            className={cn(
              "rounded-xl border p-4 space-y-1.5",
              styleTheme === "cinematic"
                ? "border-zinc-800 bg-zinc-900/40"
                : "border-zinc-200 bg-zinc-50/60"
            )}
          >
            <div className="flex items-center gap-2 text-primary">
              <IconDeviceLaptop size={16} />
              <span className="font-mono text-[10px] font-bold uppercase">Digital Web & Mobile</span>
            </div>
            <p className="text-xs font-semibold">CSS Variables & Tailwind</p>
            <p className="text-[11px] opacity-70">
              Auto-generated CSS Custom Properties with HSL/OKLCH color variables and modular rem font scales.
            </p>
          </div>

          <div
            className={cn(
              "rounded-xl border p-4 space-y-1.5",
              styleTheme === "cinematic"
                ? "border-zinc-800 bg-zinc-900/40"
                : "border-zinc-200 bg-zinc-50/60"
            )}
          >
            <div className="flex items-center gap-2 text-primary">
              <IconFileCode size={16} />
              <span className="font-mono text-[10px] font-bold uppercase">Design Tokens JSON</span>
            </div>
            <p className="text-xs font-semibold">W3C Format Specification</p>
            <p className="text-[11px] opacity-70">
              Standard JSON design tokens consumable directly by Figma Tokens Studio, iOS, and Android.
            </p>
          </div>

          <div
            className={cn(
              "rounded-xl border p-4 space-y-1.5",
              styleTheme === "cinematic"
                ? "border-zinc-800 bg-zinc-900/40"
                : "border-zinc-200 bg-zinc-50/60"
            )}
          >
            <div className="flex items-center gap-2 text-primary">
              <IconPrinter size={16} />
              <span className="font-mono text-[10px] font-bold uppercase">Print & Collateral</span>
            </div>
            <p className="text-xs font-semibold">ISO 216 A4 & 300 DPI</p>
            <p className="text-[11px] opacity-70">
              Precision vector export compatible with press printing, vector PDFs, and physical packaging.
            </p>
          </div>
        </div>

        {/* Governance & Signoff */}
        <div
          className={cn(
            "flex items-center justify-between rounded-2xl border p-4 font-mono text-xs",
            styleTheme === "cinematic"
              ? "border-zinc-800 bg-zinc-900/60"
              : "border-zinc-200 bg-white"
          )}
        >
          <div className="flex items-center gap-3">
            <div className="flex size-7 items-center justify-center rounded-full bg-emerald-500 text-white">
              <IconCheck size={14} className="stroke-[3]" />
            </div>
            <div>
              <span className="block font-bold">System Certified & Approved</span>
              <span className="block text-[10px] opacity-60">Ready for team-wide implementation</span>
            </div>
          </div>

          <div className="text-right text-[11px] opacity-70">
            <div>Owner: {brandName || "Brand Core"}</div>
            <div>Verified: {activeYear} Edition</div>
          </div>
        </div>
      </div>
    </A4PageFrame>
  )
}
