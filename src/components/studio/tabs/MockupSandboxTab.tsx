import React, { useState } from "react"
import { useBrandStore } from "@/store/brandStore"
import { getReadableTextColor } from "@/lib/colorUtils"
import {
  IconDeviceLaptop,
  IconShare,
  IconDeviceMobile,
  IconId,
  IconArrowRight,
  IconSparkles,
} from "@tabler/icons-react"
/**
 * Deep studio tab for previewing brand assets in realistic product mockups.
 * Features:
 * - Mockup environments: SaaS Web Hero, Social Share Card, Mobile App Screen, and Business Card.
 * - Dynamic color, typography, and logo injection across all simulated surfaces.
 *
 * @component
 * @returns {React.ReactElement} The rendered mockup sandbox studio tab.
 */
export const MockupSandboxTab: React.FC = () => {
  const brand = useBrandStore()
  const [selectedMockup, setSelectedMockup] = useState<
    "web" | "social" | "mobile" | "card"
  >("web")

  const primaryColor =
    brand.colorPalette.find((c) => c.role === "primary")?.hex || "#6366f1"
  const secondaryColor =
    brand.colorPalette.find((c) => c.role === "secondary")?.hex || "#06b6d4"
  const accentColor =
    brand.colorPalette.find((c) => c.role === "accent")?.hex || "#10b981"
  const neutralColor =
    brand.colorPalette.find((c) => c.role === "neutral")?.hex || "#0f172a"
  const bgColor =
    brand.colorPalette.find((c) => c.role === "background")?.hex || "#ffffff"

  const logoSrc = brand.svgContent
    ? `data:image/svg+xml;utf8,${encodeURIComponent(brand.svgContent)}`
    : brand.rasterDataUri || "/Brand10.svg"

  return (
    <div className="animate-in space-y-8 duration-300 fade-in">
      {/* Mockup Selector Pills */}
      <div className="flex w-fit flex-wrap items-center gap-2 rounded-2xl border border-border bg-card p-1.5 shadow-xs">
        <button
          onClick={() => setSelectedMockup("web")}
          className={`flex cursor-pointer items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition ${
            selectedMockup === "web"
              ? "bg-primary text-primary-foreground shadow-xs"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
        >
          <IconDeviceLaptop size={16} />
          SaaS Web Hero
        </button>

        <button
          onClick={() => setSelectedMockup("social")}
          className={`flex cursor-pointer items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition ${
            selectedMockup === "social"
              ? "bg-primary text-primary-foreground shadow-xs"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
        >
          <IconShare size={16} />
          Social Share Card (1200x630)
        </button>

        <button
          onClick={() => setSelectedMockup("mobile")}
          className={`flex cursor-pointer items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition ${
            selectedMockup === "mobile"
              ? "bg-primary text-primary-foreground shadow-xs"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
        >
          <IconDeviceMobile size={16} />
          Mobile App Screen
        </button>

        <button
          onClick={() => setSelectedMockup("card")}
          className={`flex cursor-pointer items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition ${
            selectedMockup === "card"
              ? "bg-primary text-primary-foreground shadow-xs"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
        >
          <IconId size={16} />
          Executive Business Card
        </button>
      </div>

      {/* Render Selected Mockup */}
      <div className="relative flex min-h-[520px] items-center justify-center overflow-hidden rounded-3xl border border-border bg-card p-6 text-card-foreground shadow-xl md:p-10">
        {/* Background glow */}
        <div
          className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full opacity-20 blur-3xl transition-all duration-700"
          style={{ backgroundColor: primaryColor }}
        />

        {/* 1. SAAS WEB HERO */}
        {selectedMockup === "web" && (
          <div className="w-full max-w-4xl overflow-hidden rounded-2xl border border-border bg-background shadow-2xl backdrop-blur">
            {/* Browser topbar */}
            <div className="flex items-center justify-between border-b border-border bg-muted/40 px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-rose-500/80" />
                <span className="h-3 w-3 rounded-full bg-amber-500/80" />
                <span className="h-3 w-3 rounded-full bg-emerald-500/80" />
              </div>

              {/* Logo in Navbar with Safe Zone */}
              <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-1">
                <div className="flex h-4 w-16 items-center justify-center">
                  <img
                    src={logoSrc}
                    alt={brand.brandName}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                <span className="font-mono text-xs text-muted-foreground">
                  app.{brand.brandName.toLowerCase().replace(/\s+/g, "")}.io
                </span>
              </div>

              <div className="w-12" />
            </div>

            {/* Hero Body */}
            <div className="space-y-6 p-8 text-center md:p-14">
              <div
                className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold shadow-xs"
                style={{
                  backgroundColor: `${primaryColor}15`,
                  borderColor: `${primaryColor}40`,
                  color: primaryColor,
                }}
              >
                <IconSparkles size={14} />
                Now in Public Beta
              </div>

              <h2
                className="mx-auto max-w-2xl text-3xl leading-tight font-extrabold tracking-tight text-foreground md:text-5xl"
                style={{ fontFamily: `"${brand.displayFont}", sans-serif` }}
              >
                {brand.tagline ||
                  `The next generation platform for ${brand.brandName}.`}
              </h2>

              <p
                className="mx-auto max-w-lg text-sm leading-relaxed text-muted-foreground md:text-base"
                style={{ fontFamily: `"${brand.bodyFont}", sans-serif` }}
              >
                {brand.mission ||
                  "Engineered with meticulous attention to speed, developer experience, and architectural integrity."}
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  className="flex transform cursor-pointer items-center gap-2 rounded-xl px-6 py-3 text-xs font-bold shadow-lg transition hover:-translate-y-0.5"
                  style={{
                    backgroundColor: primaryColor,
                    color: getReadableTextColor(primaryColor),
                  }}
                >
                  Start Building Free
                  <IconArrowRight size={14} />
                </button>
                <button className="cursor-pointer rounded-xl bg-muted px-6 py-3 text-xs font-medium text-foreground transition hover:bg-muted/80">
                  Book Live Demo
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 2. SOCIAL SHARE CARD */}
        {selectedMockup === "social" && (
          <div
            className="relative flex aspect-[1.91/1] w-full max-w-2xl flex-col justify-between overflow-hidden rounded-2xl border border-border p-8 shadow-2xl"
            style={{
              backgroundColor: neutralColor,
            }}
          >
            <div
              className="pointer-events-none absolute -top-20 -right-20 h-80 w-80 rounded-full opacity-30 blur-3xl"
              style={{ backgroundColor: primaryColor }}
            />

            {/* Top row */}
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex h-8 max-w-[140px] items-center rounded-lg border border-white/10 bg-black/40 px-3 py-1.5 backdrop-blur">
                <img
                  src={logoSrc}
                  alt={brand.brandName}
                  className="max-h-full max-w-full object-contain"
                />
              </div>
              <span
                className="rounded-md px-2.5 py-1 font-mono text-xs font-semibold tracking-widest uppercase"
                style={{
                  backgroundColor: `${accentColor}25`,
                  color: accentColor,
                  border: `1px solid ${accentColor}50`,
                }}
              >
                Official Release
              </span>
            </div>

            {/* Center Content */}
            <div className="relative z-10 space-y-2">
              <h3
                className="text-2xl leading-tight font-extrabold text-white md:text-3xl"
                style={{ fontFamily: `"${brand.displayFont}", sans-serif` }}
              >
                {brand.tagline ||
                  `${brand.brandName} — Modern Intelligence Engine`}
              </h3>
              <p
                className="line-clamp-2 max-w-lg text-xs text-zinc-300 md:text-sm"
                style={{ fontFamily: `"${brand.bodyFont}", sans-serif` }}
              >
                {brand.mission}
              </p>
            </div>

            {/* Bottom row */}
            <div className="relative z-10 flex items-center justify-between border-t border-white/10 pt-4 font-mono text-xs text-zinc-400">
              <span>
                {brand.brandName.toLowerCase().replace(/\s+/g, "")}.com
              </span>
              <span style={{ color: primaryColor }}>
                #DesignTokens #BrandSystem
              </span>
            </div>
          </div>
        )}

        {/* 3. MOBILE APP SCREEN */}
        {selectedMockup === "mobile" && (
          <div className="w-72 space-y-4 rounded-[36px] border-4 border-border bg-card p-4 shadow-2xl">
            {/* Dynamic Island / Notch */}
            <div className="flex justify-center">
              <div className="h-4 w-24 rounded-full bg-muted" />
            </div>

            {/* App Nav */}
            <div className="flex items-center justify-between px-1">
              <div className="flex h-6 w-20 items-center">
                <img
                  src={logoSrc}
                  alt={brand.brandName}
                  className="max-h-full max-w-full object-contain"
                />
              </div>
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-muted text-[10px] font-bold text-foreground">
                JD
              </div>
            </div>

            {/* Balance Card */}
            <div
              className="space-y-3 rounded-2xl p-4 shadow-lg"
              style={{
                background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
                color: "#ffffff",
              }}
            >
              <span className="font-mono text-[10px] uppercase opacity-80">
                Total Brand Assets
              </span>
              <div className="font-mono text-2xl font-black">14,280 USD</div>
              <div className="flex justify-between pt-1 text-[11px] opacity-90">
                <span>Active Workspace</span>
                <span>Tier: Enterprise</span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="grid grid-cols-2 gap-2">
              <button
                className="cursor-pointer rounded-xl py-2.5 text-xs font-bold shadow-xs transition"
                style={{
                  backgroundColor: primaryColor,
                  color: getReadableTextColor(primaryColor),
                }}
              >
                New Project
              </button>
              <button className="cursor-pointer rounded-xl border border-border bg-muted py-2.5 text-xs font-medium text-foreground">
                Analytics
              </button>
            </div>
          </div>
        )}

        {/* 4. BUSINESS CARD */}
        {selectedMockup === "card" && (
          <div className="grid w-full max-w-3xl grid-cols-1 gap-6 md:grid-cols-2">
            {/* Front */}
            <div
              className="flex aspect-[1.75/1] flex-col justify-between rounded-2xl border border-white/10 p-6 shadow-2xl"
              style={{
                backgroundColor: neutralColor,
              }}
            >
              <div className="flex h-8 w-24 items-center">
                <img
                  src={logoSrc}
                  alt={brand.brandName}
                  className="max-h-full max-w-full object-contain"
                />
              </div>
              <div>
                <h4
                  className="text-lg font-bold text-white"
                  style={{ fontFamily: `"${brand.displayFont}", sans-serif` }}
                >
                  {brand.brandName}
                </h4>
                <p className="text-[11px] text-zinc-400">
                  {brand.tagline || "Design & Engineering"}
                </p>
              </div>
            </div>

            {/* Back */}
            <div
              className="flex aspect-[1.75/1] flex-col justify-between rounded-2xl border border-border p-6 shadow-2xl"
              style={{
                backgroundColor: bgColor === "#ffffff" ? "#ffffff" : "#18181b",
                color: getReadableTextColor(
                  bgColor === "#ffffff" ? "#ffffff" : "#18181b"
                ),
              }}
            >
              <div className="space-y-0.5">
                <h4 className="text-sm font-bold">Alex Mercer</h4>
                <p
                  className="text-[10px] opacity-70"
                  style={{ color: primaryColor }}
                >
                  Chief Brand Architect
                </p>
              </div>

              <div className="space-y-1 font-mono text-[10px] opacity-80">
                <p>
                  alex@{brand.brandName.toLowerCase().replace(/\s+/g, "")}.com
                </p>
                <p>+1 (555) 019-2834</p>
                <p>{brand.brandName.toLowerCase().replace(/\s+/g, "")}.com</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
