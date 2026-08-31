import { create } from 'zustand'
import { temporal } from 'zundo'
import { get as idbGet, set as idbSet } from 'idb-keyval'
import type { ColorSwatch } from '../lib/colorUtils'
import { createColorSwatch } from '../lib/colorUtils'
import { supabase } from '../lib/supabase'

export interface BrandToneRatings {
  formal: number // 0 (Ultra Casual) to 100 (Formal Corporate)
  playful: number // 0 (Dead Serious) to 100 (Playful & Fun)
  minimalist: number // 0 (Ornate & Rich) to 100 (Ultra Minimal)
  bold: number // 0 (Subtle & Quiet) to 100 (Loud & Disruptive)
}

export interface BrandDoDontItem {
  id: string
  type: 'do' | 'dont'
  rule: string
  detail: string
}

export interface BrandState {
  projectId: string
  brandName: string
  tagline: string
  mission: string
  vision: string
  coreValues: string[]
  toneRatings: BrandToneRatings

  // Logo System
  logoUrl?: string
  svgContent?: string
  rasterDataUri?: string
  isVector: boolean
  aspectRatio: number
  clearspaceMultiplier: number
  dosAndDonts: BrandDoDontItem[]

  // Color System
  colorPalette: ColorSwatch[]

  // Typography System
  displayFont: string
  bodyFont: string
  monoFont: string
  baseFontSize: number
  typeScaleRatio: number

  // UI state
  activeTab: 'overview' | 'logo' | 'colors' | 'typography' | 'mockups'
  isSaving: boolean
  lastSavedAt: string | null

  // Actions
  setProjectId: (id: string) => void
  setBrandName: (name: string) => void
  setTagline: (tagline: string) => void
  setMission: (mission: string) => void
  setVision: (vision: string) => void
  setCoreValues: (values: string[]) => void
  addCoreValue: (val: string) => void
  removeCoreValue: (index: number) => void
  setToneRating: (key: keyof BrandToneRatings, value: number) => void

  // Logo actions
  setLogoData: (data: {
    svgContent?: string
    rasterDataUri?: string
    isVector: boolean
    aspectRatio: number
    logoUrl?: string
  }) => Promise<void>
  setClearspaceMultiplier: (multiplier: number) => void
  addDoDont: (item: Omit<BrandDoDontItem, 'id'>) => void
  removeDoDont: (id: string) => void

  // Color actions
  setColorPalette: (colors: ColorSwatch[]) => void
  updateColorSwatch: (id: string, updates: Partial<ColorSwatch>) => void
  addColorSwatch: (hex: string, role?: ColorSwatch['role']) => void
  removeColorSwatch: (id: string) => void

  // Typography actions
  setTypography: (updates: {
    displayFont?: string
    bodyFont?: string
    monoFont?: string
    baseFontSize?: number
    typeScaleRatio?: number
  }) => void

  setActiveTab: (tab: BrandState['activeTab']) => void
  loadPreset: (presetName: 'apex' | 'bloom' | 'nova') => void
  loadFromProject: (projectId: string) => Promise<void>
  saveToSupabase: () => Promise<void>
}

export const PRESET_BRANDS = {
  apex: {
    brandName: 'Apex Cloud',
    tagline: 'Next-Generation Autonomous Cloud Infrastructure',
    mission: 'To make distributed cloud computing instant, zero-maintenance, and universally accessible.',
    vision: 'A world where developers build world-scale intelligence without server operational friction.',
    coreValues: ['Radical Velocity', 'Architectural Elegance', 'Zero Trust Security', 'Developer Empathy'],
    toneRatings: { formal: 60, playful: 20, minimalist: 85, bold: 90 },
    displayFont: 'Plus Jakarta Sans',
    bodyFont: 'Inter',
    monoFont: 'JetBrains Mono',
    baseFontSize: 16,
    typeScaleRatio: 1.25,
    colors: [
      createColorSwatch('#6366f1', 'primary', 'Electric Indigo'),
      createColorSwatch('#06b6d4', 'secondary', 'Cyber Cyan'),
      createColorSwatch('#10b981', 'accent', 'Emerald Spark'),
      createColorSwatch('#0f172a', 'neutral', 'Midnight Slate'),
      createColorSwatch('#ffffff', 'background', 'Pure Surface'),
    ],
  },
  bloom: {
    brandName: 'Bloom Botanicals',
    tagline: 'Pure Organic Regenerative Skincare & Rituals',
    mission: 'To restore balance to skin and soil through zero-chemical bio-fermented botanicals.',
    vision: 'Setting the gold standard for luxury sustainable wellness that gives back to the earth.',
    coreValues: ['Bio-Integrity', 'Earth Stewardship', 'Mindful Craftsmanship', 'Radical Transparency'],
    toneRatings: { formal: 35, playful: 60, minimalist: 70, bold: 30 },
    displayFont: 'Playfair Display',
    bodyFont: 'Outfit',
    monoFont: 'DM Mono',
    baseFontSize: 16,
    typeScaleRatio: 1.333,
    colors: [
      createColorSwatch('#84cc16', 'primary', 'Moss Botanical'),
      createColorSwatch('#d97706', 'secondary', 'Golden Amber'),
      createColorSwatch('#ec4899', 'accent', 'Wild Rose'),
      createColorSwatch('#292524', 'neutral', 'Warm Earth'),
      createColorSwatch('#fefce8', 'background', 'Warm Cream'),
    ],
  },
  nova: {
    brandName: 'Nova Capital',
    tagline: 'Conviction-Driven Ventures for Deep Tech Founders',
    mission: 'To fund and accelerate frontier technology breakthroughs that define the next century.',
    vision: 'Catalyzing humanity’s greatest leaps across aerospace, quantum computing, and bio-engineering.',
    coreValues: ['Deep Conviction', 'Scientific Rigor', 'Founder Sovereignity', 'Generational Horizon'],
    toneRatings: { formal: 85, playful: 15, minimalist: 90, bold: 80 },
    displayFont: 'Syne',
    bodyFont: 'Space Grotesk',
    monoFont: 'Space Mono',
    baseFontSize: 16,
    typeScaleRatio: 1.25,
    colors: [
      createColorSwatch('#2563eb', 'primary', 'Frontier Blue'),
      createColorSwatch('#f59e0b', 'secondary', 'Solar Flare'),
      createColorSwatch('#8b5cf6', 'accent', 'Quantum Violet'),
      createColorSwatch('#09090b', 'neutral', 'Carbon Black'),
      createColorSwatch('#f4f4f5', 'background', 'Platinum White'),
    ],
  },
}

const defaultApex = PRESET_BRANDS.apex

export const useBrandStore = create<BrandState>()(
  temporal(
    (set, get) => ({
      projectId: 'demo-project',
      brandName: defaultApex.brandName,
      tagline: defaultApex.tagline,
      mission: defaultApex.mission,
      vision: defaultApex.vision,
      coreValues: defaultApex.coreValues,
      toneRatings: defaultApex.toneRatings,

      // Logo
      isVector: true,
      aspectRatio: 1.0,
      clearspaceMultiplier: 1.0,
      dosAndDonts: [
        { id: '1', type: 'do', rule: 'Maintain Clearspace', detail: 'Always leave at least 1x clear margin around the symbol.' },
        { id: '2', type: 'do', rule: 'Use On High Contrast', detail: 'Ensure the logo is placed on backgrounds with WCAG AA compliance.' },
        { id: '3', type: 'dont', rule: 'Do Not Distort', detail: 'Never stretch, skew, or alter the proportional aspect ratio.' },
        { id: '4', type: 'dont', rule: 'Do Not Re-color Elements', detail: 'Do not apply unapproved gradient or shadow effects.' },
      ],

      // Colors
      colorPalette: defaultApex.colors,

      // Typography
      displayFont: defaultApex.displayFont,
      bodyFont: defaultApex.bodyFont,
      monoFont: defaultApex.monoFont,
      baseFontSize: defaultApex.baseFontSize,
      typeScaleRatio: defaultApex.typeScaleRatio,

      // UI
      activeTab: 'overview',
      isSaving: false,
      lastSavedAt: null,

      setProjectId: (id) => set({ projectId: id }),
      setBrandName: (name) => set({ brandName: name }),
      setTagline: (tagline) => set({ tagline }),
      setMission: (mission) => set({ mission }),
      setVision: (vision) => set({ vision }),
      setCoreValues: (values) => set({ coreValues: values }),
      addCoreValue: (val) => {
        if (!val.trim()) return
        set({ coreValues: [...get().coreValues, val.trim()] })
      },
      removeCoreValue: (index) => {
        set({ coreValues: get().coreValues.filter((_, i) => i !== index) })
      },
      setToneRating: (key, value) => {
        set({ toneRatings: { ...get().toneRatings, [key]: value } })
      },

      setLogoData: async ({ svgContent, rasterDataUri, isVector, aspectRatio, logoUrl }) => {
        const id = get().projectId || 'current'
        if (svgContent) {
          await idbSet(`brand_svg_${id}`, svgContent)
        }
        if (rasterDataUri) {
          await idbSet(`brand_raster_${id}`, rasterDataUri)
        }
        set({
          svgContent,
          rasterDataUri,
          isVector,
          aspectRatio: aspectRatio || 1.0,
          logoUrl,
        })
      },

      setClearspaceMultiplier: (multiplier) => set({ clearspaceMultiplier: multiplier }),
      addDoDont: (item) => {
        const newItem: BrandDoDontItem = {
          ...item,
          id: `rule-${Math.random().toString(36).substring(2, 7)}`,
        }
        set({ dosAndDonts: [...get().dosAndDonts, newItem] })
      },
      removeDoDont: (id) => {
        set({ dosAndDonts: get().dosAndDonts.filter((r) => r.id !== id) })
      },

      setColorPalette: (colors) => set({ colorPalette: colors }),
      updateColorSwatch: (id, updates) => {
        set({
          colorPalette: get().colorPalette.map((c) => (c.id === id ? { ...c, ...updates } : c)),
        })
      },
      addColorSwatch: (hex, role = 'custom') => {
        const newSwatch = createColorSwatch(hex, role)
        set({ colorPalette: [...get().colorPalette, newSwatch] })
      },
      removeColorSwatch: (id) => {
        set({ colorPalette: get().colorPalette.filter((c) => c.id !== id) })
      },

      setTypography: (updates) => {
        set({
          displayFont: updates.displayFont ?? get().displayFont,
          bodyFont: updates.bodyFont ?? get().bodyFont,
          monoFont: updates.monoFont ?? get().monoFont,
          baseFontSize: updates.baseFontSize ?? get().baseFontSize,
          typeScaleRatio: updates.typeScaleRatio ?? get().typeScaleRatio,
        })
      },

      setActiveTab: (tab) => set({ activeTab: tab }),

      loadPreset: (presetKey) => {
        const preset = PRESET_BRANDS[presetKey]
        if (!preset) return
        set({
          brandName: preset.brandName,
          tagline: preset.tagline,
          mission: preset.mission,
          vision: preset.vision,
          coreValues: preset.coreValues,
          toneRatings: preset.toneRatings,
          displayFont: preset.displayFont,
          bodyFont: preset.bodyFont,
          monoFont: preset.monoFont,
          baseFontSize: preset.baseFontSize,
          typeScaleRatio: preset.typeScaleRatio,
          colorPalette: preset.colors,
        })
      },

      loadFromProject: async (projectId) => {
        set({ projectId })
        // Load cached images from IndexedDB if available
        try {
          const cachedSvg = await idbGet<string>(`brand_svg_${projectId}`)
          const cachedRaster = await idbGet<string>(`brand_raster_${projectId}`)
          if (cachedSvg) set({ svgContent: cachedSvg, isVector: true })
          if (cachedRaster) set({ rasterDataUri: cachedRaster })
        } catch (e) {
          console.warn('Could not read images from IndexedDB', e)
        }

        if (!supabase) return

        try {
          const { data, error } = await supabase
            .from('brand_data')
            .select('*')
            .eq('project_id', projectId)
            .maybeSingle()

          if (error) throw error
          if (data) {
            set({
              brandName: data.brand_name || 'Untitled Brand',
              tagline: data.tagline || '',
              mission: data.mission || '',
              vision: data.vision || '',
              coreValues: data.core_values || [],
              toneRatings: data.tone_ratings || defaultApex.toneRatings,
              logoUrl: data.logo_url,
              clearspaceMultiplier: Number(data.clearspace_multiplier) || 1.0,
              colorPalette: data.color_palette || defaultApex.colors,
              displayFont: data.display_font || defaultApex.displayFont,
              bodyFont: data.body_font || defaultApex.bodyFont,
              monoFont: data.monospace_font || defaultApex.monoFont,
              baseFontSize: Number(data.base_font_size) || 16,
              typeScaleRatio: Number(data.type_scale_ratio) || 1.25,
              lastSavedAt: data.updated_at,
            })
          }
        } catch (err) {
          console.warn('Failed to load project from Supabase:', err)
        }
      },

      saveToSupabase: async () => {
        const state = get()
        if (!supabase || !state.projectId || state.projectId.startsWith('demo-')) {
          set({ lastSavedAt: new Date().toISOString() })
          return
        }

        set({ isSaving: true })
        try {
          const payload = {
            project_id: state.projectId,
            brand_name: state.brandName,
            tagline: state.tagline,
            mission: state.mission,
            vision: state.vision,
            core_values: state.coreValues,
            tone_ratings: state.toneRatings,
            logo_url: state.logoUrl,
            clearspace_multiplier: state.clearspaceMultiplier,
            color_palette: state.colorPalette,
            display_font: state.displayFont,
            body_font: state.bodyFont,
            monospace_font: state.monoFont,
            base_font_size: state.baseFontSize,
            type_scale_ratio: state.typeScaleRatio,
            updated_at: new Date().toISOString(),
          }

          const { error } = await supabase
            .from('brand_data')
            .upsert(payload, { onConflict: 'project_id' })

          if (error) throw error

          // Also update project updated_at
          await supabase
            .from('brand_projects')
            .update({ name: state.brandName, updated_at: new Date().toISOString() })
            .eq('id', state.projectId)

          set({ isSaving: false, lastSavedAt: new Date().toISOString() })
        } catch (err) {
          console.error('Failed to save to Supabase:', err)
          set({ isSaving: false })
        }
      },
    }),
    {
      // zundo temporal config: track changes to brand state for undo/redo
      limit: 40,
    }
  )
)
