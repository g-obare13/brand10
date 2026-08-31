import React, { useState } from 'react'
import { useBrandStore } from '../../../store/brandStore'
import { getReadableTextColor } from '../../../lib/colorUtils'
import {
  IconDeviceLaptop,
  IconShare,
  IconDeviceMobile,
  IconId,
  IconArrowRight,
  IconSparkles,
} from '@tabler/icons-react'

export const MockupSandboxTab: React.FC = () => {
  const brand = useBrandStore()
  const [selectedMockup, setSelectedMockup] = useState<'web' | 'social' | 'mobile' | 'card'>('web')

  const primaryColor = brand.colorPalette.find((c) => c.role === 'primary')?.hex || '#6366f1'
  const secondaryColor = brand.colorPalette.find((c) => c.role === 'secondary')?.hex || '#06b6d4'
  const accentColor = brand.colorPalette.find((c) => c.role === 'accent')?.hex || '#10b981'
  const neutralColor = brand.colorPalette.find((c) => c.role === 'neutral')?.hex || '#0f172a'
  const bgColor = brand.colorPalette.find((c) => c.role === 'background')?.hex || '#ffffff'

  const logoSrc = brand.svgContent
    ? `data:image/svg+xml;utf8,${encodeURIComponent(brand.svgContent)}`
    : brand.rasterDataUri || '/Brandio.svg'

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Mockup Selector Pills */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-card border border-border w-fit shadow-xs">
        <button
          onClick={() => setSelectedMockup('web')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
            selectedMockup === 'web'
              ? 'bg-primary text-primary-foreground shadow-xs'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted'
          }`}
        >
          <IconDeviceLaptop size={16} />
          SaaS Web Hero
        </button>

        <button
          onClick={() => setSelectedMockup('social')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
            selectedMockup === 'social'
              ? 'bg-primary text-primary-foreground shadow-xs'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted'
          }`}
        >
          <IconShare size={16} />
          Social Share Card (1200x630)
        </button>

        <button
          onClick={() => setSelectedMockup('mobile')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
            selectedMockup === 'mobile'
              ? 'bg-primary text-primary-foreground shadow-xs'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted'
          }`}
        >
          <IconDeviceMobile size={16} />
          Mobile App Screen
        </button>

        <button
          onClick={() => setSelectedMockup('card')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
            selectedMockup === 'card'
              ? 'bg-primary text-primary-foreground shadow-xs'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted'
          }`}
        >
          <IconId size={16} />
          Executive Business Card
        </button>
      </div>

      {/* Render Selected Mockup */}
      <div className="rounded-3xl border border-border bg-card p-6 md:p-10 flex items-center justify-center min-h-[520px] overflow-hidden shadow-xl relative text-card-foreground">
        {/* Background glow */}
        <div
          className="absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-20 blur-3xl pointer-events-none transition-all duration-700"
          style={{ backgroundColor: primaryColor }}
        />

        {/* 1. SAAS WEB HERO */}
        {selectedMockup === 'web' && (
          <div className="w-full max-w-4xl rounded-2xl border border-border bg-background shadow-2xl overflow-hidden backdrop-blur">
            {/* Browser topbar */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/40">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
              </div>

              {/* Logo in Navbar with Safe Zone */}
              <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-card border border-border">
                <div className="h-4 w-16 flex items-center justify-center">
                  <img src={logoSrc} alt={brand.brandName} className="max-h-full max-w-full object-contain" />
                </div>
                <span className="text-xs font-mono text-muted-foreground">app.{brand.brandName.toLowerCase().replace(/\s+/g, '')}.io</span>
              </div>

              <div className="w-12" />
            </div>

            {/* Hero Body */}
            <div className="p-8 md:p-14 text-center space-y-6">
              <div
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border shadow-xs"
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
                className="text-3xl md:text-5xl font-extrabold tracking-tight text-foreground max-w-2xl mx-auto leading-tight"
                style={{ fontFamily: `"${brand.displayFont}", sans-serif` }}
              >
                {brand.tagline || `The next generation platform for ${brand.brandName}.`}
              </h2>

              <p
                className="text-sm md:text-base text-muted-foreground max-w-lg mx-auto leading-relaxed"
                style={{ fontFamily: `"${brand.bodyFont}", sans-serif` }}
              >
                {brand.mission || 'Engineered with meticulous attention to speed, developer experience, and architectural integrity.'}
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  className="px-6 py-3 rounded-xl font-bold text-xs shadow-lg transition transform hover:-translate-y-0.5 flex items-center gap-2 cursor-pointer"
                  style={{
                    backgroundColor: primaryColor,
                    color: getReadableTextColor(primaryColor),
                  }}
                >
                  Start Building Free
                  <IconArrowRight size={14} />
                </button>
                <button className="px-6 py-3 rounded-xl font-medium text-xs bg-muted text-foreground hover:bg-muted/80 transition cursor-pointer">
                  Book Live Demo
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 2. SOCIAL SHARE CARD */}
        {selectedMockup === 'social' && (
          <div
            className="w-full max-w-2xl aspect-[1.91/1] rounded-2xl border border-border shadow-2xl p-8 flex flex-col justify-between relative overflow-hidden"
            style={{
              backgroundColor: neutralColor,
            }}
          >
            <div
              className="absolute -right-20 -top-20 w-80 h-80 rounded-full opacity-30 blur-3xl pointer-events-none"
              style={{ backgroundColor: primaryColor }}
            />

            {/* Top row */}
            <div className="flex items-center justify-between relative z-10">
              <div className="h-8 max-w-[140px] flex items-center bg-black/40 px-3 py-1.5 rounded-lg border border-white/10 backdrop-blur">
                <img src={logoSrc} alt={brand.brandName} className="max-h-full max-w-full object-contain" />
              </div>
              <span
                className="text-xs font-mono uppercase tracking-widest px-2.5 py-1 rounded-md font-semibold"
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
            <div className="space-y-2 relative z-10">
              <h3
                className="text-2xl md:text-3xl font-extrabold text-white leading-tight"
                style={{ fontFamily: `"${brand.displayFont}", sans-serif` }}
              >
                {brand.tagline || `${brand.brandName} — Modern Intelligence Engine`}
              </h3>
              <p
                className="text-xs md:text-sm text-zinc-300 line-clamp-2 max-w-lg"
                style={{ fontFamily: `"${brand.bodyFont}", sans-serif` }}
              >
                {brand.mission}
              </p>
            </div>

            {/* Bottom row */}
            <div className="flex items-center justify-between text-xs text-zinc-400 font-mono border-t border-white/10 pt-4 relative z-10">
              <span>{brand.brandName.toLowerCase().replace(/\s+/g, '')}.com</span>
              <span style={{ color: primaryColor }}>#DesignTokens #BrandSystem</span>
            </div>
          </div>
        )}

        {/* 3. MOBILE APP SCREEN */}
        {selectedMockup === 'mobile' && (
          <div className="w-72 rounded-[36px] border-4 border-border bg-card p-4 shadow-2xl space-y-4">
            {/* Dynamic Island / Notch */}
            <div className="flex justify-center">
              <div className="w-24 h-4 bg-muted rounded-full" />
            </div>

            {/* App Nav */}
            <div className="flex items-center justify-between px-1">
              <div className="h-6 w-20 flex items-center">
                <img src={logoSrc} alt={brand.brandName} className="max-h-full max-w-full object-contain" />
              </div>
              <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold text-foreground">
                JD
              </div>
            </div>

            {/* Balance Card */}
            <div
              className="p-4 rounded-2xl shadow-lg space-y-3"
              style={{
                background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
                color: '#ffffff',
              }}
            >
              <span className="text-[10px] uppercase font-mono opacity-80">Total Brand Assets</span>
              <div className="text-2xl font-black font-mono">14,280 USD</div>
              <div className="flex justify-between text-[11px] pt-1 opacity-90">
                <span>Active Workspace</span>
                <span>Tier: Enterprise</span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="grid grid-cols-2 gap-2">
              <button
                className="py-2.5 rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
                style={{
                  backgroundColor: primaryColor,
                  color: getReadableTextColor(primaryColor),
                }}
              >
                New Project
              </button>
              <button className="py-2.5 rounded-xl text-xs font-medium bg-muted text-foreground border border-border cursor-pointer">
                Analytics
              </button>
            </div>
          </div>
        )}

        {/* 4. BUSINESS CARD */}
        {selectedMockup === 'card' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
            {/* Front */}
            <div
              className="aspect-[1.75/1] rounded-2xl p-6 shadow-2xl flex flex-col justify-between border border-white/10"
              style={{
                backgroundColor: neutralColor,
              }}
            >
              <div className="h-8 w-24 flex items-center">
                <img src={logoSrc} alt={brand.brandName} className="max-h-full max-w-full object-contain" />
              </div>
              <div>
                <h4
                  className="text-lg font-bold text-white"
                  style={{ fontFamily: `"${brand.displayFont}", sans-serif` }}
                >
                  {brand.brandName}
                </h4>
                <p className="text-[11px] text-zinc-400">{brand.tagline || 'Design & Engineering'}</p>
              </div>
            </div>

            {/* Back */}
            <div
              className="aspect-[1.75/1] rounded-2xl p-6 shadow-2xl flex flex-col justify-between border border-border"
              style={{
                backgroundColor: bgColor === '#ffffff' ? '#ffffff' : '#18181b',
                color: getReadableTextColor(bgColor === '#ffffff' ? '#ffffff' : '#18181b'),
              }}
            >
              <div className="space-y-0.5">
                <h4 className="text-sm font-bold">Alex Mercer</h4>
                <p className="text-[10px] opacity-70" style={{ color: primaryColor }}>
                  Chief Brand Architect
                </p>
              </div>

              <div className="space-y-1 text-[10px] font-mono opacity-80">
                <p>alex@{brand.brandName.toLowerCase().replace(/\s+/g, '')}.com</p>
                <p>+1 (555) 019-2834</p>
                <p>{brand.brandName.toLowerCase().replace(/\s+/g, '')}.com</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
