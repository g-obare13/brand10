import { useState, useEffect, useRef } from 'react'
import { useBrandStore } from '@/store/brandStore'
import {
  IconSparkles,
  IconTarget,
  IconCompass,
  IconPlus,
  IconX,
  IconAdjustmentsHorizontal,
} from '@tabler/icons-react'
import { gsap } from 'gsap'
import { animateFadeUp } from '@/lib/gsap-animations'
import GlassPanel from '@/components/shared/GlassPanel'
/**
 * Deep studio tab for managing brand strategy, mission, vision, core values, and voice tones.
 * Features:
 * - Brand positioning inputs (tagline, mission, vision statements).
 * - Interactive voice & tone sliders with dynamic descriptor labels.
 * - Dynamic core values tag manager with instant addition and removal.
 *
 * @component
 * @returns {React.ReactElement} The rendered strategy & tone studio tab.
 */
export const OverviewTab: React.FC = () => {
  const brand = useBrandStore()
  const [newValue, setNewValue] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return
    const ctx = gsap.context(() => {
      const cards = containerRef.current?.querySelectorAll('.overview-card')
      if (cards && cards.length > 0) {
        animateFadeUp(cards, {
          y: 25,
          duration: 0.9,
          stagger: 0.08,
          ease: 'power3.out',
        })
      }
    }, containerRef)

    return () => ctx.revert()
  }, [])

  const handleAddValue = (e: React.FormEvent) => {
    e.preventDefault()
    if (newValue.trim()) {
      brand.addCoreValue(newValue.trim())
      setNewValue('')
    }
  }

  const getToneDescriptor = (
    key: 'formal' | 'playful' | 'minimalist' | 'bold',
    val: number
  ) => {
    switch (key) {
      case 'formal':
        return val > 65
          ? 'Corporate & Traditional'
          : val < 35
            ? 'Casual & Approachable'
            : 'Balanced Professional'
      case 'playful':
        return val > 65
          ? 'Vibrant & Witty'
          : val < 35
            ? 'Methodical & Serious'
            : 'Engaging & Grounded'
      case 'minimalist':
        return val > 65
          ? 'Radically Simple'
          : val < 35
            ? 'Ornate & Expressive'
            : 'Clean & Structured'
      case 'bold':
        return val > 65
          ? 'Disruptive & Loud'
          : val < 35
            ? 'Subtle & Sophisticated'
            : 'Confident Stature'
    }
  }

  return (
    <div ref={containerRef} className="space-y-8">
      {/* Hero Brand Statement */}
      <GlassPanel
        blur="none"
        noise
        noiseOpacity={0.02}
        className="overview-card relative overflow-hidden rounded-3xl border border-border/80 bg-card/85 p-6 shadow-xs backdrop-blur-xl md:p-8"
      >
        <div className="pointer-events-none absolute top-0 right-0 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            <IconSparkles size={14} />
            Strategic Positioning
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Brand Tagline
            </label>
            <input
              type="text"
              value={brand.tagline}
              onChange={(e) => brand.setTagline(e.target.value)}
              placeholder="e.g. Next-Generation Autonomous Cloud Infrastructure"
              className="w-full border-b border-border/80 bg-transparent pb-2 text-xl font-bold text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary md:text-2xl"
            />
          </div>
        </div>
      </GlassPanel>

      {/* Mission & Vision Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Mission */}
        <GlassPanel
          blur="none"
          noise
          noiseOpacity={0.02}
          className="overview-card space-y-3 rounded-3xl border border-border/80 bg-card/85 p-6 shadow-xs backdrop-blur-xl transition hover:border-primary/50"
        >
          <div className="flex items-center gap-2 text-sm font-semibold text-primary">
            <div className="rounded-lg border border-primary/20 bg-primary/10 p-1.5">
              <IconTarget size={16} />
            </div>
            Brand Mission
          </div>
          <textarea
            value={brand.mission}
            onChange={(e) => brand.setMission(e.target.value)}
            rows={4}
            placeholder="What purpose does your brand exist to fulfill?"
            className="w-full resize-none rounded-2xl border border-border bg-background/50 p-3.5 text-sm leading-relaxed text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </GlassPanel>

        {/* Vision */}
        <GlassPanel
          blur="none"
          noise
          noiseOpacity={0.02}
          className="overview-card space-y-3 rounded-3xl border border-border/80 bg-card/85 p-6 shadow-xs backdrop-blur-xl transition hover:border-emerald-500/50"
        >
          <div className="flex items-center gap-2 text-sm font-semibold text-emerald-500">
            <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-1.5">
              <IconCompass size={16} />
            </div>
            Brand Vision
          </div>
          <textarea
            value={brand.vision}
            onChange={(e) => brand.setVision(e.target.value)}
            rows={4}
            placeholder="What future world is your brand actively building?"
            className="w-full resize-none rounded-2xl border border-border bg-background/50 p-3.5 text-sm leading-relaxed text-foreground outline-none transition placeholder:text-muted-foreground focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
          />
        </GlassPanel>
      </div>

      {/* Core Values Tag Manager */}
      <GlassPanel
        blur="none"
        noise
        noiseOpacity={0.02}
        className="overview-card space-y-4 rounded-3xl border border-border/80 bg-card/85 p-6 shadow-xs backdrop-blur-xl"
      >
        <div className="space-y-1">
          <h3 className="text-base font-bold text-foreground">Core Values</h3>
          <p className="text-xs text-muted-foreground">
            Guiding behavioral principles that define brand conduct.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {brand.coreValues.map((val, idx) => (
            <span
              key={idx}
              className="group inline-flex items-center gap-1.5 rounded-xl border border-border bg-muted/60 px-3 py-1.5 text-xs font-medium text-foreground transition hover:border-primary/50"
            >
              {val}
              <button
                type="button"
                onClick={() => brand.removeCoreValue(idx)}
                className="cursor-pointer text-muted-foreground transition hover:text-destructive"
                title="Remove value"
              >
                <IconX size={13} />
              </button>
            </span>
          ))}

          <form onSubmit={handleAddValue} className="inline-flex items-center">
            <input
              type="text"
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              placeholder="+ Add Core Value"
              className="rounded-xl border border-border bg-background/60 px-3 py-1.5 text-xs text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary"
            />
            {newValue.trim() && (
              <button
                type="submit"
                className="ml-1.5 cursor-pointer rounded-xl bg-primary p-1.5 text-primary-foreground transition hover:opacity-90"
              >
                <IconPlus size={14} />
              </button>
            )}
          </form>
        </div>
      </GlassPanel>

      {/* Brand Tone Dimensions Sliders */}
      <GlassPanel
        blur="none"
        noise
        noiseOpacity={0.02}
        className="overview-card space-y-6 rounded-3xl border border-border/80 bg-card/85 p-6 shadow-xs backdrop-blur-xl"
      >
        <div className="flex items-center gap-2.5">
          <div className="rounded-lg border border-amber-500/20 bg-amber-500/10 p-1.5 text-amber-500">
            <IconAdjustmentsHorizontal size={16} />
          </div>
          <div className="space-y-0.5">
            <h3 className="text-base font-bold text-foreground">
              Tone of Voice Dimensions
            </h3>
            <p className="text-xs text-muted-foreground">
              Fine-tune the brand’s psychological register across 4 axes.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Formal vs Casual */}
          <div className="space-y-2.5 rounded-2xl border border-border/80 bg-muted/30 p-4">
            <div className="flex justify-between text-xs font-semibold text-foreground">
              <span>Casual &amp; Intimate</span>
              <span className="text-primary font-bold">
                {getToneDescriptor('formal', brand.toneRatings.formal)}
              </span>
              <span>Corporate Formal</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={brand.toneRatings.formal}
              onChange={(e) =>
                brand.setToneRating('formal', Number(e.target.value))
              }
              className="h-2 w-full cursor-pointer rounded-lg bg-muted accent-primary"
            />
          </div>

          {/* Playful vs Serious */}
          <div className="space-y-2.5 rounded-2xl border border-border/80 bg-muted/30 p-4">
            <div className="flex justify-between text-xs font-semibold text-foreground">
              <span>Methodical &amp; Serious</span>
              <span className="font-bold text-emerald-500">
                {getToneDescriptor('playful', brand.toneRatings.playful)}
              </span>
              <span>Playful &amp; Witty</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={brand.toneRatings.playful}
              onChange={(e) =>
                brand.setToneRating('playful', Number(e.target.value))
              }
              className="h-2 w-full cursor-pointer rounded-lg bg-muted accent-emerald-500"
            />
          </div>

          {/* Minimalist vs Ornate */}
          <div className="space-y-2.5 rounded-2xl border border-border/80 bg-muted/30 p-4">
            <div className="flex justify-between text-xs font-semibold text-foreground">
              <span>Rich &amp; Detailed</span>
              <span className="font-bold text-cyan-500">
                {getToneDescriptor('minimalist', brand.toneRatings.minimalist)}
              </span>
              <span>Ultra Minimalist</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={brand.toneRatings.minimalist}
              onChange={(e) =>
                brand.setToneRating('minimalist', Number(e.target.value))
              }
              className="h-2 w-full cursor-pointer rounded-lg bg-muted accent-cyan-500"
            />
          </div>

          {/* Bold vs Subtle */}
          <div className="space-y-2.5 rounded-2xl border border-border/80 bg-muted/30 p-4">
            <div className="flex justify-between text-xs font-semibold text-foreground">
              <span>Subtle &amp; Understated</span>
              <span className="font-bold text-amber-500">
                {getToneDescriptor('bold', brand.toneRatings.bold)}
              </span>
              <span>Loud &amp; Disruptive</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={brand.toneRatings.bold}
              onChange={(e) =>
                brand.setToneRating('bold', Number(e.target.value))
              }
              className="h-2 w-full cursor-pointer rounded-lg bg-muted accent-amber-500"
            />
          </div>
        </div>
      </GlassPanel>
    </div>
  )
}
