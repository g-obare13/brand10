import React, { useState } from 'react'
import { useBrandStore } from '../../../store/brandStore'
import { IconSparkles, IconTarget, IconCompass, IconPlus, IconX, IconAdjustmentsHorizontal } from '@tabler/icons-react'

export const OverviewTab: React.FC = () => {
  const brand = useBrandStore()
  const [newValue, setNewValue] = useState('')

  const handleAddValue = (e: React.FormEvent) => {
    e.preventDefault()
    if (newValue.trim()) {
      brand.addCoreValue(newValue.trim())
      setNewValue('')
    }
  }

  const getToneDescriptor = (key: 'formal' | 'playful' | 'minimalist' | 'bold', val: number) => {
    switch (key) {
      case 'formal':
        return val > 65 ? 'Corporate & Traditional' : val < 35 ? 'Casual & Approachable' : 'Balanced Professional'
      case 'playful':
        return val > 65 ? 'Vibrant & Witty' : val < 35 ? 'Methodical & Serious' : 'Engaging & Grounded'
      case 'minimalist':
        return val > 65 ? 'Radically Simple' : val < 35 ? 'Ornate & Expressive' : 'Clean & Structured'
      case 'bold':
        return val > 65 ? 'Disruptive & Loud' : val < 35 ? 'Subtle & Sophisticated' : 'Confident Stature'
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Hero Brand Statement */}
      <div className="rounded-2xl border border-border bg-card p-6 md:p-8 relative overflow-hidden shadow-xs">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 blur-3xl pointer-events-none rounded-full" />

        <div className="max-w-3xl space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold">
            <IconSparkles size={14} />
            Strategic Positioning
          </div>

          <div>
            <label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-1 block">Brand Tagline</label>
            <input
              type="text"
              value={brand.tagline}
              onChange={(e) => brand.setTagline(e.target.value)}
              placeholder="e.g. Next-Generation Autonomous Cloud Infrastructure"
              className="w-full text-xl md:text-2xl font-bold text-foreground bg-transparent border-b border-border focus:border-primary outline-none pb-2 transition placeholder:text-muted-foreground"
            />
          </div>
        </div>
      </div>

      {/* Mission & Vision Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Mission */}
        <div className="rounded-2xl border border-border bg-card p-6 space-y-3 shadow-xs hover:border-primary/50 transition">
          <div className="flex items-center gap-2 text-primary font-semibold text-sm">
            <div className="p-1.5 rounded-md bg-primary/10 border border-primary/20">
              <IconTarget size={16} />
            </div>
            Brand Mission
          </div>
          <textarea
            value={brand.mission}
            onChange={(e) => brand.setMission(e.target.value)}
            rows={4}
            placeholder="What purpose does your brand exist to fulfill?"
            className="w-full bg-background border border-border rounded-xl p-3 text-sm text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary transition leading-relaxed placeholder:text-muted-foreground resize-none"
          />
        </div>

        {/* Vision */}
        <div className="rounded-2xl border border-border bg-card p-6 space-y-3 shadow-xs hover:border-emerald-500/50 transition">
          <div className="flex items-center gap-2 text-emerald-500 font-semibold text-sm">
            <div className="p-1.5 rounded-md bg-emerald-500/10 border border-emerald-500/20">
              <IconCompass size={16} />
            </div>
            Brand Vision
          </div>
          <textarea
            value={brand.vision}
            onChange={(e) => brand.setVision(e.target.value)}
            rows={4}
            placeholder="What future world is your brand actively building?"
            className="w-full bg-background border border-border rounded-xl p-3 text-sm text-foreground outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition leading-relaxed placeholder:text-muted-foreground resize-none"
          />
        </div>
      </div>

      {/* Core Values Tag Manager */}
      <div className="rounded-2xl border border-border bg-card p-6 space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-foreground">Core Values</h3>
            <p className="text-xs text-muted-foreground">Guiding behavioral principles that define brand conduct.</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2.5 items-center">
          {brand.coreValues.map((val, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted/60 border border-border text-xs font-medium text-foreground group hover:border-primary/50 transition"
            >
              {val}
              <button
                onClick={() => brand.removeCoreValue(idx)}
                className="text-muted-foreground hover:text-destructive transition cursor-pointer"
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
              className="px-3 py-1.5 rounded-lg bg-background border border-border text-xs text-foreground placeholder:text-muted-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
            {newValue.trim() && (
              <button
                type="submit"
                className="ml-1.5 p-1.5 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition cursor-pointer"
              >
                <IconPlus size={14} />
              </button>
            )}
          </form>
        </div>
      </div>

      {/* Brand Tone Dimensions Sliders */}
      <div className="rounded-2xl border border-border bg-card p-6 space-y-6 shadow-xs">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-500">
            <IconAdjustmentsHorizontal size={16} />
          </div>
          <div>
            <h3 className="text-base font-bold text-foreground">Tone of Voice Dimensions</h3>
            <p className="text-xs text-muted-foreground">Fine-tune the brand’s psychological register across 4 axes.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Formal vs Casual */}
          <div className="space-y-2 p-4 rounded-xl bg-muted/30 border border-border">
            <div className="flex justify-between text-xs font-semibold text-foreground">
              <span>Casual &amp; Intimate</span>
              <span className="text-primary">{getToneDescriptor('formal', brand.toneRatings.formal)}</span>
              <span>Corporate Formal</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={brand.toneRatings.formal}
              onChange={(e) => brand.setToneRating('formal', Number(e.target.value))}
              className="w-full accent-primary h-2 bg-muted rounded-lg cursor-pointer"
            />
          </div>

          {/* Playful vs Serious */}
          <div className="space-y-2 p-4 rounded-xl bg-muted/30 border border-border">
            <div className="flex justify-between text-xs font-semibold text-foreground">
              <span>Methodical &amp; Serious</span>
              <span className="text-emerald-500">{getToneDescriptor('playful', brand.toneRatings.playful)}</span>
              <span>Playful &amp; Witty</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={brand.toneRatings.playful}
              onChange={(e) => brand.setToneRating('playful', Number(e.target.value))}
              className="w-full accent-emerald-500 h-2 bg-muted rounded-lg cursor-pointer"
            />
          </div>

          {/* Minimalist vs Ornate */}
          <div className="space-y-2 p-4 rounded-xl bg-muted/30 border border-border">
            <div className="flex justify-between text-xs font-semibold text-foreground">
              <span>Rich &amp; Detailed</span>
              <span className="text-cyan-500">{getToneDescriptor('minimalist', brand.toneRatings.minimalist)}</span>
              <span>Ultra Minimalist</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={brand.toneRatings.minimalist}
              onChange={(e) => brand.setToneRating('minimalist', Number(e.target.value))}
              className="w-full accent-cyan-500 h-2 bg-muted rounded-lg cursor-pointer"
            />
          </div>

          {/* Bold vs Subtle */}
          <div className="space-y-2 p-4 rounded-xl bg-muted/30 border border-border">
            <div className="flex justify-between text-xs font-semibold text-foreground">
              <span>Subtle &amp; Understated</span>
              <span className="text-amber-500">{getToneDescriptor('bold', brand.toneRatings.bold)}</span>
              <span>Loud &amp; Disruptive</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={brand.toneRatings.bold}
              onChange={(e) => brand.setToneRating('bold', Number(e.target.value))}
              className="w-full accent-amber-500 h-2 bg-muted rounded-lg cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
