import { create } from 'zustand'
import { temporal } from 'zundo'
import { get as idbGet, set as idbSet, del as idbDel } from 'idb-keyval'
import { toast } from 'sonner'
import type { ColorSwatch } from '@/lib/colorUtils'
import { createColorSwatch } from '@/lib/colorUtils'
import { supabase } from '@/lib/supabase'
import { IMAGERY_MOOD_IMAGE_ARRAYS } from '@/data/wizard'

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
  designMovement?: string

  // Logo System
  logoUrl?: string
  svgContent?: string
  secondaryLogoUrl?: string
  secondarySvgContent?: string
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
  customFonts?: { family: string; url: string; target: 'display' | 'body' }[]
  stagedFontFiles?: { file: File; family: string; target: 'display' | 'body' }[]

  // Imagery & Photography System
  imageryMood: 'minimal' | 'cinematic' | 'vibrant' | 'editorial'
  imageryOverlay: 'none' | 'tint' | 'duotone'
  imageryLinks: string[]

  // Iconography System
  iconStyle: 'stroke' | 'solid' | 'duotone'
  iconRadius: number
  iconStroke: number

  // UI state
  activeTab: 'overview' | 'logo' | 'colors' | 'typography' | 'mockups'
  isSaving: boolean
  isLoading: boolean
  lastSavedAt: string | null
  syncStatus: 'idle' | 'saving' | 'saved' | 'offline' | 'error'
  saveError: string | null

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
  setDesignMovement: (movementId: string | null) => void

  // Logo actions
  setLogoData: (data: {
    svgContent?: string
    rasterDataUri?: string
    isVector: boolean
    aspectRatio: number
    logoUrl?: string
  }) => Promise<void>
  setSecondaryLogoData: (data: {
    svgContent?: string
    logoUrl?: string
  }) => Promise<void>
  removeLogo: () => Promise<void>
  removeSecondaryLogo: () => Promise<void>
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
    customFonts?: { family: string; url: string; target: 'display' | 'body' }[]
  }) => void
  addCustomFont: (font: { family: string; url: string; target: 'display' | 'body' }) => void
  stageFontFile: (staged: { file: File; family: string; target: 'display' | 'body' }) => void
  removeStagedFontFile: (family: string) => void
  uploadStagedFonts: () => Promise<void>

  // Imagery actions
  setImagery: (updates: {
    mood?: 'minimal' | 'cinematic' | 'vibrant' | 'editorial'
    overlay?: 'none' | 'tint' | 'duotone'
    links?: string[]
  }) => void

  // Iconography actions
  setIconography: (updates: {
    style?: 'stroke' | 'solid' | 'duotone'
    radius?: number
    stroke?: number
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

/**
 * Helper to upload SVG/raster logo directly to Supabase Storage bucket 'brand-logos'
 */
export async function uploadLogoToSupabase(
  contentOrUri: string,
  projectId: string,
  slot: 'primary' | 'secondary' = 'primary',
  isSvg = true
): Promise<string | null> {
  if (!supabase || !projectId || projectId.startsWith('demo-') || projectId === 'current') {
    return null
  }

  try {
    const bucket = 'brand-logos'
    const ext = isSvg ? 'svg' : 'png'
    
    // Check if authenticated to satisfy RLS: (storage.foldername(name))[1] = auth.uid()
    const { data: authData } = await supabase.auth.getUser()
    const userId = authData.user?.id
    const fileName = userId
      ? `${userId}/${projectId}_${slot}_${Date.now()}.${ext}`
      : `${projectId}/${slot}_logo_${Date.now()}.${ext}`

    let fileBody: Blob
    if (isSvg) {
      fileBody = new Blob([contentOrUri], { type: 'image/svg+xml' })
    } else {
      const res = await fetch(contentOrUri)
      fileBody = await res.blob()
    }

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(fileName, fileBody, {
        contentType: isSvg ? 'image/svg+xml' : 'image/png',
        upsert: true,
      })

    if (uploadError) {
      console.warn(`Supabase Storage upload to '${bucket}' returned:`, uploadError.message)
      return null
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(fileName)
    return data.publicUrl || null
  } catch (err) {
    console.warn('Failed to upload logo to Supabase storage:', err)
    return null
  }
}

/**
 * Helper to upload custom font files (woff2, woff, ttf, otf) directly to Supabase Storage bucket 'brand-fonts'
 */
export async function uploadCustomFontToSupabase(
  file: File,
  projectId: string,
  fontFamily: string
): Promise<string | null> {
  if (!supabase || !projectId || projectId.startsWith('demo-') || projectId === 'current') {
    return null
  }

  try {
    const bucket = 'brand-fonts'
    const ext = file.name.split('.').pop()?.toLowerCase() || 'woff2'
    const cleanFamily = fontFamily.toLowerCase().replace(/[^a-z0-9]/g, '_')
    
    // Check if authenticated to satisfy RLS: (storage.foldername(name))[1] = auth.uid()
    const { data: authData } = await supabase.auth.getUser()
    const userId = authData.user?.id
    const fileName = userId
      ? `${userId}/${projectId}_font_${cleanFamily}_${Date.now()}.${ext}`
      : `${projectId}/font_${cleanFamily}_${Date.now()}.${ext}`

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, {
        contentType: file.type || 'font/woff2',
        upsert: true,
      })

    if (uploadError) {
      console.warn(`Supabase Storage upload to '${bucket}' returned:`, uploadError.message)
      return null
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(fileName)
    return data.publicUrl || null
  } catch (err) {
    console.warn('Failed to upload custom font to Supabase storage:', err)
    return null
  }
}


const defaultApex = PRESET_BRANDS.apex

/**
 * Master Zustand store with temporal (undo/redo) middleware managing the active brand identity system.
 * Features:
 * - Brand positioning tokens (Name, Tagline, Mission, Vision, Core Values, Tone Ratings).
 * - Logo geometry, SVG markup, vector states, clearspace, and usage guidelines.
 * - Color swatch matrix with real-time harmonic shade calculations.
 * - Typographic scale parameters, Google Fonts pairings, and custom font uploads.
 * - Imagery and iconography style system preferences.
 * - Bidirectional persistence with IndexedDB and Supabase PostgreSQL & Storage buckets.
 */
export const useBrandStore = create<BrandState>()(
  temporal(
    (set, get) => ({
      projectId: '',
      brandName: '',
      tagline: '',
      mission: '',
      vision: '',
      coreValues: ['Excellence', 'Innovation', 'Integrity', 'Velocity'],
      toneRatings: { formal: 60, playful: 20, minimalist: 85, bold: 90 },
      designMovement: 'quiet-precision',

      // Logo
      isVector: true,
      aspectRatio: 1.0,
      clearspaceMultiplier: 1.0,
      dosAndDonts: [
        {
          id: '1',
          type: 'dont',
          rule: "Don't use outdated versions",
          detail:
            'If the brand has had past logo iterations, only the current approved version should appear.',
        },
        {
          id: '2',
          type: 'dont',
          rule: "Don't add effects",
          detail:
            "No drop shadows, gradients, outlines, bevels, or glows unless that's part of the actual logo design.",
        },
        {
          id: '3',
          type: 'dont',
          rule: "Don't recolor outside the approved palette",
          detail: 'No random or off-brand colors applied to the mark.',
        },
        {
          id: '4',
          type: 'dont',
          rule: "Don't rotate",
          detail:
            'Keep the logo at its intended orientation unless a rotated lockup is explicitly part of the system.',
        },
        {
          id: '5',
          type: 'dont',
          rule: "Don't stretch or distort",
          detail:
            'Never scale non-proportionally (squishing horizontally or vertically).',
        },
      ],

      // Colors
      colorPalette: defaultApex.colors,

      // Typography
      displayFont: defaultApex.displayFont,
      bodyFont: defaultApex.bodyFont,
      monoFont: defaultApex.monoFont,
      baseFontSize: defaultApex.baseFontSize,
      typeScaleRatio: defaultApex.typeScaleRatio,

      // Imagery & Photography
      imageryMood: 'minimal',
      imageryOverlay: 'none',
      imageryLinks: IMAGERY_MOOD_IMAGE_ARRAYS.minimal,

      // Iconography
      iconStyle: 'stroke',
      iconRadius: 4,
      iconStroke: 2.0,

      // UI
      activeTab: 'overview',
      isSaving: false,
      isLoading: false,
      lastSavedAt: null,
      syncStatus: 'idle',
      saveError: null,

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
      setDesignMovement: (movementId) => {
        set({ designMovement: movementId || undefined })
      },

      setLogoData: async ({ svgContent, rasterDataUri, isVector, aspectRatio, logoUrl }) => {
        const id = get().projectId || 'current'
        if (svgContent) {
          await idbSet(`brand_svg_${id}`, svgContent)
        }
        if (rasterDataUri) {
          await idbSet(`brand_raster_${id}`, rasterDataUri)
        }

        let uploadedUrl = logoUrl
        if (!uploadedUrl && (svgContent || rasterDataUri)) {
          const content = svgContent || rasterDataUri || ''
          const remoteUrl = await uploadLogoToSupabase(content, id, 'primary', Boolean(svgContent))
          if (remoteUrl) {
            uploadedUrl = remoteUrl
          }
        }

        const fallbackUrl = svgContent
          ? `data:image/svg+xml;utf8,${encodeURIComponent(svgContent)}`
          : rasterDataUri

        set({
          svgContent,
          rasterDataUri,
          isVector,
          aspectRatio: aspectRatio || 1.0,
          logoUrl: uploadedUrl || fallbackUrl,
        })
        await get().saveToSupabase()
      },

      setSecondaryLogoData: async ({ svgContent, logoUrl }) => {
        const id = get().projectId || 'current'
        if (svgContent) {
          await idbSet(`brand_secondary_svg_${id}`, svgContent)
        }

        let uploadedUrl = logoUrl
        if (!uploadedUrl && svgContent) {
          const remoteUrl = await uploadLogoToSupabase(svgContent, id, 'secondary', true)
          if (remoteUrl) {
            uploadedUrl = remoteUrl
          }
        }

        const fallbackSecondaryUrl = svgContent
          ? `data:image/svg+xml;utf8,${encodeURIComponent(svgContent)}`
          : undefined

        set({
          secondarySvgContent: svgContent,
          secondaryLogoUrl: uploadedUrl || fallbackSecondaryUrl,
        })
        await get().saveToSupabase()
      },

      removeLogo: async () => {
        const id = get().projectId || 'current'
        try {
          await idbDel(`brand_svg_${id}`)
          await idbDel(`brand_raster_${id}`)
        } catch {}
        set({ svgContent: undefined, rasterDataUri: undefined, logoUrl: undefined })
      },

      removeSecondaryLogo: async () => {
        const id = get().projectId || 'current'
        try {
          await idbDel(`brand_secondary_svg_${id}`)
        } catch {}
        set({ secondarySvgContent: undefined, secondaryLogoUrl: undefined })
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
          colorPalette: get().colorPalette.map((swatch) =>
            swatch.id === id ? { ...swatch, ...updates } : swatch
          ),
        })
      },
      addColorSwatch: (hex, role = 'custom') => {
        const newSwatch = createColorSwatch(hex, role)
        set({ colorPalette: [...get().colorPalette, newSwatch] })
      },
      removeColorSwatch: (id) => {
        set({
          colorPalette: get().colorPalette.filter((s) => s.id !== id),
        })
      },

      setTypography: (updates) => {
        set((state) => ({
          displayFont: updates.displayFont || state.displayFont,
          bodyFont: updates.bodyFont || state.bodyFont,
          monoFont: updates.monoFont || state.monoFont,
          baseFontSize: updates.baseFontSize || state.baseFontSize,
          typeScaleRatio: updates.typeScaleRatio || state.typeScaleRatio,
          customFonts: updates.customFonts || state.customFonts,
        }))
      },

      addCustomFont: (font) => {
        set((state) => {
          const current = state.customFonts || []
          const filtered = current.filter((f) => f.family !== font.family)
          return {
            customFonts: [...filtered, font],
            ...(font.target === 'display' ? { displayFont: font.family } : { bodyFont: font.family }),
          }
        })
      },

      stageFontFile: (staged) => {
        set((state) => {
          const current = state.stagedFontFiles || []
          const filtered = current.filter((f) => f.family !== staged.family)
          return {
            stagedFontFiles: [...filtered, staged],
            ...(staged.target === 'display' ? { displayFont: staged.family } : { bodyFont: staged.family }),
          }
        })
      },

      removeStagedFontFile: (family) => {
        set((state) => {
          const current = state.stagedFontFiles || []
          const removedItem = current.find((f) => f.family === family)
          const filtered = current.filter((f) => f.family !== family)
          const updates: Partial<BrandState> = { stagedFontFiles: filtered }

          if (removedItem) {
            if (removedItem.target === 'display' && state.displayFont === family) {
              updates.displayFont = 'Inter'
            } else if (removedItem.target === 'body' && state.bodyFont === family) {
              updates.bodyFont = 'Inter'
            }
          } else {
            if (state.displayFont === family) updates.displayFont = 'Inter'
            if (state.bodyFont === family) updates.bodyFont = 'Inter'
          }

          return updates
        })
      },

      uploadStagedFonts: async () => {
        const state = get()
        if (!state.stagedFontFiles || state.stagedFontFiles.length === 0) return
        if (!state.projectId || state.projectId.startsWith('demo-') || state.projectId === 'current') return

        for (const staged of state.stagedFontFiles) {
          const publicUrl = await uploadCustomFontToSupabase(staged.file, state.projectId, staged.family)
          if (publicUrl) {
            get().addCustomFont({
              family: staged.family,
              url: publicUrl,
              target: staged.target,
            })
          }
        }
        set({ stagedFontFiles: [] })
      },

      setImagery: (updates) => {
        set((state) => {
          const newMood = updates.mood || state.imageryMood
          const newLinks =
            updates.links ||
            (updates.mood && updates.mood in IMAGERY_MOOD_IMAGE_ARRAYS
              ? IMAGERY_MOOD_IMAGE_ARRAYS[updates.mood]
              : state.imageryLinks)
          return {
            imageryMood: newMood,
            imageryOverlay: updates.overlay || state.imageryOverlay,
            imageryLinks: newLinks,
          }
        })
      },

      setIconography: (updates) => {
        set((state) => ({
          iconStyle: updates.style || state.iconStyle,
          iconRadius: updates.radius !== undefined ? updates.radius : state.iconRadius,
          iconStroke: updates.stroke !== undefined ? updates.stroke : state.iconStroke,
        }))
      },

      setActiveTab: (tab) => set({ activeTab: tab }),

      loadPreset: (presetName) => {
        const preset = PRESET_BRANDS[presetName]
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

      loadFromProject: async (projectId: string) => {
        if (!projectId) return

        set({ isLoading: true })

        // Check if demo or local project fallback
        if (!supabase || projectId.startsWith('demo-') || projectId.startsWith('project-')) {
          try {
            const raw = localStorage.getItem(`brandio_local_brand_${projectId}`)
            if (raw) {
              const parsed = JSON.parse(raw)
              set({
                ...parsed,
                projectId,
                isLoading: false,
              })
              return
            } else {
              set({
                projectId,
                brandName: 'Apex Cloud',
                tagline: 'Next-Generation Autonomous Cloud Infrastructure',
                mission: 'To make distributed cloud computing instant, zero-maintenance, and universally accessible.',
                vision: 'A world where developers build world-scale intelligence without server operational friction.',
                coreValues: ['Radical Velocity', 'Architectural Elegance', 'Zero Trust Security', 'Developer Empathy'],
                toneRatings: { formal: 60, playful: 20, minimalist: 85, bold: 90 },
                colorPalette: defaultApex.colors,
                displayFont: defaultApex.displayFont,
                bodyFont: defaultApex.bodyFont,
                monoFont: defaultApex.monoFont,
                baseFontSize: 16,
                typeScaleRatio: 1.25,
                isLoading: false,
              })
              return
            }
          } catch {}
          set({ isLoading: false })
          return
        }

        try {
          const id = projectId || 'current'
          const [cachedSvg, cachedSecondarySvg, cachedRaster] = await Promise.all([
            idbGet(`brand_svg_${id}`).catch(() => null),
            idbGet(`brand_secondary_svg_${id}`).catch(() => null),
            idbGet(`brand_raster_${id}`).catch(() => null),
          ])

          const { data, error } = await supabase
            .from('brand_data')
            .select('*')
            .eq('project_id', projectId)
            .maybeSingle()

          if (error) throw error

          if (data) {
            let svgContent = cachedSvg || undefined
            let secondarySvgContent = cachedSecondarySvg || undefined

            // If not in local cache but remote URL is present, fetch SVG text
            if (!svgContent && data.logo_url) {
              try {
                const res = await fetch(data.logo_url)
                if (res.ok) {
                  svgContent = await res.text()
                  await idbSet(`brand_svg_${id}`, svgContent)
                }
              } catch {}
            }

            const secondaryUrl = data.logo_variants?.secondary_url || data.secondary_logo_url
            if (!secondarySvgContent && secondaryUrl) {
              try {
                const res = await fetch(secondaryUrl)
                if (res.ok) {
                  secondarySvgContent = await res.text()
                  await idbSet(`brand_secondary_svg_${id}`, secondarySvgContent)
                }
              } catch {}
            }

            set({
              projectId,
              brandName: data.brand_name || 'Untitled Brand',
              tagline: data.tagline || '',
              mission: data.mission || '',
              vision: data.vision || '',
              coreValues: data.core_values || ['Excellence', 'Innovation', 'Integrity', 'Velocity'],
              toneRatings: data.tone_ratings || defaultApex.toneRatings,
              designMovement: data.design_movement || data.tone_ratings?.design_movement || 'quiet-precision',
              logoUrl: data.logo_url,
              secondaryLogoUrl: secondaryUrl,
              svgContent,
              secondarySvgContent,
              rasterDataUri: cachedRaster || undefined,
              clearspaceMultiplier: Number(data.clearspace_multiplier) || 1.0,
              colorPalette: data.color_palette || defaultApex.colors,
              displayFont: data.display_font || defaultApex.displayFont,
              bodyFont: data.body_font || defaultApex.bodyFont,
              monoFont: data.monospace_font || defaultApex.monoFont,
              baseFontSize: Number(data.base_font_size) || 16,
              typeScaleRatio: Number(data.type_scale_ratio) || 1.25,
              customFonts: data.logo_variants?.custom_fonts || [],
              dosAndDonts: data.dos_and_donts || get().dosAndDonts,
              imageryMood: data.imagery_mood || 'minimal',
              imageryOverlay: data.imagery_overlay || 'none',
              imageryLinks:
                data.logo_variants?.imagery_links ||
                (data.imagery_mood && data.imagery_mood in IMAGERY_MOOD_IMAGE_ARRAYS
                  ? IMAGERY_MOOD_IMAGE_ARRAYS[data.imagery_mood as keyof typeof IMAGERY_MOOD_IMAGE_ARRAYS]
                  : IMAGERY_MOOD_IMAGE_ARRAYS.minimal),
              iconStyle: data.icon_style || 'stroke',
              iconRadius: Number(data.icon_radius) || 4,
              iconStroke: Number(data.icon_stroke) || 2.0,
              lastSavedAt: data.updated_at,
              syncStatus: 'saved',
              saveError: null,
              isLoading: false,
            })
          } else {
            // If no brand_data row exists yet, retrieve project name from brand_projects
            const { data: projData } = await supabase
              .from('brand_projects')
              .select('name')
              .eq('id', projectId)
              .maybeSingle()

            const brandName = projData?.name || 'Untitled Brand'

            set({
              projectId,
              brandName,
              tagline: '',
              mission: '',
              vision: '',
              coreValues: ['Excellence', 'Innovation', 'Integrity', 'Velocity'],
              toneRatings: { formal: 60, playful: 20, minimalist: 85, bold: 90 },
              designMovement: 'quiet-precision',
              colorPalette: defaultApex.colors,
              displayFont: defaultApex.displayFont,
              bodyFont: defaultApex.bodyFont,
              monoFont: defaultApex.monoFont,
              baseFontSize: 16,
              typeScaleRatio: 1.25,
              clearspaceMultiplier: 1.0,
              dosAndDonts: get().dosAndDonts,
              imageryMood: 'minimal',
              imageryOverlay: 'none',
              iconStyle: 'stroke',
              iconRadius: 4,
              iconStroke: 2.0,
              lastSavedAt: new Date().toISOString(),
              syncStatus: 'saved',
              saveError: null,
              isLoading: false,
            })
          }
        } catch (err) {
          console.warn('Failed to load project from Supabase, attempting local draft fallback:', err)
          try {
            const rawDraft = localStorage.getItem(`brandio_local_brand_${projectId}`)
            if (rawDraft) {
              const draft = JSON.parse(rawDraft)
              set({
                ...draft,
                projectId,
                syncStatus: 'offline',
                saveError: null,
                isLoading: false,
              })
              toast.info('Loaded local offline draft for this brand.')
              return
            }
          } catch {}
          set({ isLoading: false, syncStatus: 'error', saveError: 'Failed to load project from Supabase' })
          toast.error('Failed to load brand project from cloud.')
        }
      },

      saveToSupabase: async () => {
        const state = get()
        if (state.isLoading || !state.projectId || state.projectId === 'demo-project' || !state.brandName) return

        if (!supabase || state.projectId.startsWith('demo-') || state.projectId.startsWith('project-')) {
          set({ isSaving: false, syncStatus: 'offline', saveError: null, lastSavedAt: new Date().toISOString() })
          try {
            localStorage.setItem(`brandio_local_brand_${state.projectId}`, JSON.stringify(state))
            const localProjects = JSON.parse(
              localStorage.getItem('brandio_local_projects') || '[]'
            )
            const updated = localProjects.map((p: any) =>
              p.id === state.projectId
                ? {
                    ...p,
                    name: state.brandName,
                    brand_name: state.brandName,
                    logo_url: state.logoUrl || (state.svgContent ? `data:image/svg+xml;utf8,${encodeURIComponent(state.svgContent)}` : p.logo_url),
                    primary_color: state.colorPalette.find((c: any) => c.role === 'primary')?.hex || p.primary_color,
                    vision: state.vision || p.vision,
                    updated_at: new Date().toISOString(),
                  }
                : p
            )
            localStorage.setItem('brandio_local_projects', JSON.stringify(updated))
          } catch {}
          return
        }

        set({ isSaving: true, syncStatus: 'saving', saveError: null })
        try {
          const primaryLogo =
            state.logoUrl ||
            (state.svgContent
              ? `data:image/svg+xml;utf8,${encodeURIComponent(state.svgContent)}`
              : state.rasterDataUri)

          const secondaryLogo =
            state.secondaryLogoUrl ||
            (state.secondarySvgContent
              ? `data:image/svg+xml;utf8,${encodeURIComponent(state.secondarySvgContent)}`
              : undefined)

          const payload = {
            project_id: state.projectId,
            brand_name: state.brandName,
            tagline: state.tagline,
            mission: state.mission,
            vision: state.vision,
            core_values: state.coreValues,
            tone_ratings: {
              ...state.toneRatings,
              design_movement: state.designMovement,
            },
            design_movement: state.designMovement,
            logo_url: primaryLogo,
            logo_variants: {
              secondary_url: secondaryLogo,
              custom_fonts: state.customFonts || [],
              imagery_links: state.imageryLinks,
            },
            clearspace_multiplier: state.clearspaceMultiplier,
            color_palette: state.colorPalette,
            display_font: state.displayFont,
            body_font: state.bodyFont,
            monospace_font: state.monoFont,
            base_font_size: state.baseFontSize,
            type_scale_ratio: state.typeScaleRatio,
            dos_and_donts: state.dosAndDonts,
            imagery_mood: state.imageryMood,
            imagery_overlay: state.imageryOverlay,
            icon_style: state.iconStyle,
            icon_radius: state.iconRadius,
            icon_stroke: state.iconStroke,
            updated_at: new Date().toISOString(),
          }

          const { error } = await supabase
            .from('brand_data')
            .upsert(payload, { onConflict: 'project_id' })

          if (error) throw error

          // Also update project updated_at and name
          await supabase
            .from('brand_projects')
            .update({ name: state.brandName, updated_at: new Date().toISOString() })
            .eq('id', state.projectId)

          // Keep in-memory projectsStore synchronized
          try {
            const { useProjectsStore } = await import('./projectsStore')
            const projects = useProjectsStore.getState().projects
            if (projects.some((p) => p.id === state.projectId)) {
              useProjectsStore.setState({
                projects: projects.map((p) =>
                  p.id === state.projectId
                    ? {
                        ...p,
                        logo_url: primaryLogo || p.logo_url,
                        brand_name: state.brandName || p.brand_name,
                        name: state.brandName || p.name,
                        primary_color:
                          state.colorPalette.find((c) => c.role === 'primary')?.hex ||
                          p.primary_color,
                      }
                    : p
                ),
              })
            }
          } catch {}

          // Cache draft locally as fallback resilience
          try {
            localStorage.setItem(`brandio_local_brand_${state.projectId}`, JSON.stringify(state))
          } catch {}

          set({ isSaving: false, syncStatus: 'saved', saveError: null, lastSavedAt: new Date().toISOString() })
        } catch (err: any) {
          console.error('Failed to save to Supabase:', err)
          const errMsg = err?.message || 'Failed to save to Supabase'
          try {
            localStorage.setItem(`brandio_local_brand_${state.projectId}`, JSON.stringify(state))
          } catch {}
          set({ isSaving: false, syncStatus: 'error', saveError: errMsg })
          toast.error('Cloud sync failed. Draft saved locally.', {
            action: {
              label: 'Retry',
              onClick: () => {
                get().saveToSupabase()
              },
            },
          })
        }
      },
    }),
    {
      // zundo temporal config: track changes to brand state for undo/redo
      limit: 40,
    }
  )
)
