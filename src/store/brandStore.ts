import { create } from 'zustand'
import { temporal } from 'zundo'
import { get as idbGet, set as idbSet, del as idbDel } from 'idb-keyval'
import { toast } from 'sonner'
import type { ColorSwatch } from '@/lib/colorUtils'
import { createColorSwatch } from '@/lib/colorUtils'
import { supabase } from '@/lib/supabase'
import { IMAGERY_MOOD_IMAGE_ARRAYS } from '@/data/wizard'

import {
  DEFAULT_DOS_AND_DONTS,
  PRESET_BRANDS,
} from "@/data/presets"
import type { BrandDoDontItem } from "@/data/presets"

export interface BrandToneRatings {
  formal: number // 0 (Ultra Casual) to 100 (Formal Corporate)
  playful: number // 0 (Dead Serious) to 100 (Playful & Fun)
  minimalist: number // 0 (Ornate & Rich) to 100 (Ultra Minimal)
  bold: number // 0 (Subtle & Quiet) to 100 (Loud & Disruptive)
}

export {
  DEFAULT_DOS_AND_DONTS,
  PRESET_BRANDS,
}
export type { BrandDoDontItem }

export interface BrandPillar {
  title: string
  desc: string
}

export interface BrandState {
  projectId: string
  brandName: string
  tagline: string
  mission: string
  vision: string
  coreValues: string[]
  brandPillars: BrandPillar[]
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
  setBrandPillars: (pillars: BrandPillar[]) => void
  setPillar: (index: number, pillar: Partial<BrandPillar>) => void
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
  setDosAndDonts: (rules: BrandDoDontItem[]) => void

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
  }) => void | Promise<void>
  addCustomFont: (font: { family: string; url: string; target: 'display' | 'body' }) => void
  stageFontFile: (staged: { file: File; family: string; target: 'display' | 'body' }) => void
  removeStagedFontFile: (family: string) => void | Promise<void>
  removeCustomFont: (family: string) => Promise<void>
  uploadCustomFont: (file: File, family: string, target: 'display' | 'body') => Promise<void>
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
 * Helper to delete SVG/raster logo from Supabase Storage bucket 'brand-logos'
 */
export async function deleteLogoFromSupabase(
  projectId: string,
  slot: 'primary' | 'secondary' = 'primary',
  currentLogoUrl?: string
): Promise<void> {
  if (!supabase || !projectId || projectId.startsWith('demo-') || projectId === 'current') {
    return
  }

  try {
    const bucket = 'brand-logos'
    const pathsToDelete = new Set<string>()

    // 1. If a public URL is provided, extract the direct storage path
    if (currentLogoUrl && currentLogoUrl.includes(`/${bucket}/`)) {
      const parts = currentLogoUrl.split(`/${bucket}/`)
      if (parts[1]) {
        const rawPath = decodeURIComponent(parts[1].split('?')[0])
        if (rawPath) {
          pathsToDelete.add(rawPath)
        }
      }
    }

    // 2. Query bucket for any existing files for this project & slot (cleaning up any orphaned versions)
    const { data: authData } = await supabase.auth.getUser()
    const userId = authData.user?.id

    const searchLocations = [
      ...(userId ? [{ path: userId, prefix: `${projectId}_${slot}_` }] : []),
      { path: projectId, prefix: `${slot}_logo_` },
      { path: projectId, prefix: `${projectId}_${slot}_` },
    ]

    for (const loc of searchLocations) {
      const { data, error } = await supabase.storage
        .from(bucket)
        .list(loc.path, { limit: 100, search: loc.prefix })

      if (!error) {
        data
          .filter((f) => f.name.startsWith(loc.prefix))
          .forEach((f) => pathsToDelete.add(`${loc.path}/${f.name}`))
      }
    }

    if (pathsToDelete.size > 0) {
      const { error: removeError } = await supabase.storage
        .from(bucket)
        .remove(Array.from(pathsToDelete))
      if (removeError) {
        console.warn('Failed to remove logo from Supabase storage:', removeError.message)
      }
    }
  } catch (err) {
    console.warn('Failed to delete logo from Supabase storage:', err)
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

/**
 * Helper to delete custom font files directly from Supabase Storage bucket 'brand-fonts'
 */
export async function deleteCustomFontFromSupabase(
  projectId: string,
  fontFamily: string,
  fontUrl?: string
): Promise<void> {
  if (!supabase || !projectId || projectId.startsWith('demo-') || projectId === 'current') {
    return
  }

  try {
    const bucket = 'brand-fonts'
    const pathsToDelete = new Set<string>()

    // 1. If explicit fontUrl provided, extract storage relative path
    if (fontUrl) {
      try {
        const marker = `/${bucket}/`
        const idx = fontUrl.indexOf(marker)
        if (idx !== -1) {
          const rawPath = fontUrl.substring(idx + marker.length).split('?')[0]
          if (rawPath) {
            pathsToDelete.add(decodeURIComponent(rawPath))
          }
        }
      } catch (e) {
        console.warn('Failed to parse fontUrl path:', e)
      }
    }

    // 2. Search by prefix in user & project storage locations
    const { data: authData } = await supabase.auth.getUser()
    const userId = authData.user?.id
    const cleanFamily = fontFamily.toLowerCase().replace(/[^a-z0-9]/g, '_')

    const searchLocations = [
      ...(userId ? [{ path: userId, prefix: `${projectId}_font_${cleanFamily}_` }] : []),
      { path: projectId, prefix: `font_${cleanFamily}_` },
      { path: projectId, prefix: `${projectId}_font_${cleanFamily}_` },
    ]

    for (const loc of searchLocations) {
      const { data, error } = await supabase.storage
        .from(bucket)
        .list(loc.path, { limit: 100, search: loc.prefix })

      if (!error) {
        data
          .filter((f) => f.name.startsWith(loc.prefix))
          .forEach((f) => pathsToDelete.add(`${loc.path}/${f.name}`))
      }
    }

    if (pathsToDelete.size > 0) {
      const { error: removeError } = await supabase.storage
        .from(bucket)
        .remove(Array.from(pathsToDelete))
      if (removeError) {
        console.warn('Failed to remove custom font from Supabase storage:', removeError.message)
      }
    }
  } catch (err) {
    console.warn('Failed to delete custom font from Supabase storage:', err)
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
      coreValues: [],
      brandPillars: [],
      toneRatings: { formal: 60, playful: 20, minimalist: 85, bold: 90 },
      designMovement: 'quiet-precision',

      // Logo
      isVector: true,
      aspectRatio: 1.0,
      clearspaceMultiplier: 1.0,
      dosAndDonts: DEFAULT_DOS_AND_DONTS,

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
      setBrandPillars: (pillars) => {
        set({
          brandPillars: pillars,
          coreValues: pillars.map((p) => p.title).filter(Boolean),
        })
      },
      setPillar: (index, pillar) => {
        const current = [...get().brandPillars]
        while (current.length <= index) {
          current.push({ title: '', desc: '' })
        }
        const existing = current[index] ?? { title: '', desc: '' }
        current[index] = {
          title: pillar.title !== undefined ? pillar.title : existing.title,
          desc: pillar.desc !== undefined ? pillar.desc : existing.desc,
        }
        set({
          brandPillars: current,
          coreValues: current.map((p) => p.title).filter(Boolean),
        })
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
        const currentUrl = get().logoUrl
        try {
          await idbDel(`brand_svg_${id}`)
          await idbDel(`brand_raster_${id}`)
        } catch {}

        if (id && id !== 'current') {
          await deleteLogoFromSupabase(id, 'primary', currentUrl)
        }

        set({ svgContent: undefined, rasterDataUri: undefined, logoUrl: undefined })
        await get().saveToSupabase()
      },

      removeSecondaryLogo: async () => {
        const id = get().projectId || 'current'
        const currentUrl = get().secondaryLogoUrl
        try {
          await idbDel(`brand_secondary_svg_${id}`)
        } catch {}

        if (id && id !== 'current') {
          await deleteLogoFromSupabase(id, 'secondary', currentUrl)
        }

        set({ secondarySvgContent: undefined, secondaryLogoUrl: undefined })
        await get().saveToSupabase()
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
      setDosAndDonts: (rules) => {
        set({ dosAndDonts: rules })
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

      setTypography: async (updates) => {
        const state = get()
        const id = state.projectId || 'current'

        // Detect if a custom font is being replaced on display or body
        const fontsToCleanUp: { family: string; url?: string }[] = []

        if (updates.displayFont && updates.displayFont !== state.displayFont) {
          const oldDisplayCustom = (state.customFonts || []).find((cf) => cf.family === state.displayFont)
          const oldDisplayStaged = (state.stagedFontFiles || []).find((sf) => sf.family === state.displayFont)
          const oldFamily = oldDisplayCustom?.family || oldDisplayStaged?.family
          if (oldFamily && updates.bodyFont !== oldFamily && state.bodyFont !== oldFamily) {
            fontsToCleanUp.push({ family: oldFamily, url: oldDisplayCustom?.url })
          }
        }

        if (updates.bodyFont && updates.bodyFont !== state.bodyFont) {
          const oldBodyCustom = (state.customFonts || []).find((cf) => cf.family === state.bodyFont)
          const oldBodyStaged = (state.stagedFontFiles || []).find((sf) => sf.family === state.bodyFont)
          const oldFamily = oldBodyCustom?.family || oldBodyStaged?.family
          if (oldFamily && updates.displayFont !== oldFamily && state.displayFont !== oldFamily) {
            if (!fontsToCleanUp.some((f) => f.family === oldFamily)) {
              fontsToCleanUp.push({ family: oldFamily, url: oldBodyCustom?.url })
            }
          }
        }

        const familiesToPurge = new Set(fontsToCleanUp.map((f) => f.family))
        const remainingCustom = (state.customFonts || []).filter((f) => !familiesToPurge.has(f.family))
        const remainingStaged = (state.stagedFontFiles || []).filter((f) => !familiesToPurge.has(f.family))

        set({
          displayFont: updates.displayFont || state.displayFont,
          bodyFont: updates.bodyFont || state.bodyFont,
          monoFont: updates.monoFont || state.monoFont,
          baseFontSize: updates.baseFontSize || state.baseFontSize,
          typeScaleRatio: updates.typeScaleRatio || state.typeScaleRatio,
          customFonts: familiesToPurge.size > 0 ? remainingCustom : (updates.customFonts || state.customFonts),
          stagedFontFiles: familiesToPurge.size > 0 ? remainingStaged : state.stagedFontFiles,
        })

        if (familiesToPurge.size > 0 && id && id !== 'current' && !id.startsWith('demo-')) {
          for (const item of fontsToCleanUp) {
            await deleteCustomFontFromSupabase(id, item.family, item.url)
          }
          await get().saveToSupabase()
        }
      },

      addCustomFont: (font) => {
        set((state) => {
          const current = state.customFonts || []
          const filtered = current.filter((f) => f.family !== font.family && f.target !== font.target)
          return {
            customFonts: [...filtered, font],
            ...(font.target === 'display' ? { displayFont: font.family } : { bodyFont: font.family }),
          }
        })
      },

      stageFontFile: (staged) => {
        set((state) => {
          const current = state.stagedFontFiles || []
          const filtered = current.filter((f) => f.family !== staged.family && f.target !== staged.target)
          return {
            stagedFontFiles: [...filtered, staged],
            ...(staged.target === 'display' ? { displayFont: staged.family } : { bodyFont: staged.family }),
          }
        })
      },

      removeCustomFont: async (family) => {
        const state = get()
        const id = state.projectId || 'current'

        const targetCustomFonts = (state.customFonts || []).filter((f) => f.family === family)
        const remainingCustomFonts = (state.customFonts || []).filter((f) => f.family !== family)
        const remainingStaged = (state.stagedFontFiles || []).filter((f) => f.family !== family)

        const updates: Partial<BrandState> = {
          customFonts: remainingCustomFonts,
          stagedFontFiles: remainingStaged,
        }

        if (state.displayFont === family) {
          updates.displayFont = 'Inter'
        }
        if (state.bodyFont === family) {
          updates.bodyFont = 'Inter'
        }

        set(updates)

        if (id && id !== 'current' && !id.startsWith('demo-')) {
          for (const cf of targetCustomFonts) {
            await deleteCustomFontFromSupabase(id, family, cf.url)
          }
          if (targetCustomFonts.length === 0) {
            await deleteCustomFontFromSupabase(id, family)
          }
        }

        await get().saveToSupabase()
      },

      removeStagedFontFile: async (family) => {
        await get().removeCustomFont(family)
      },

      uploadCustomFont: async (file, family, target) => {
        const state = get()
        const id = state.projectId || 'current'

        // Check if there was an existing custom font for this target slot
        const oldCustom = (state.customFonts || []).find((cf) => cf.target === target && cf.family !== family)
        const oldStaged = (state.stagedFontFiles || []).find((sf) => sf.target === target && sf.family !== family)
        const oldFamily = oldCustom?.family || oldStaged?.family

        let publicUrl: string | null = null
        if (id && id !== 'current' && !id.startsWith('demo-')) {
          publicUrl = await uploadCustomFontToSupabase(file, id, family)
        }

        set((prev) => {
          const currentCustom = prev.customFonts || []
          const filteredCustom = currentCustom.filter((cf) => cf.family !== family && cf.target !== target)
          const currentStaged = prev.stagedFontFiles || []
          const filteredStaged = currentStaged.filter((sf) => sf.family !== family && sf.target !== target)

          const nextCustomFonts = publicUrl
            ? [...filteredCustom, { family, url: publicUrl, target }]
            : filteredCustom

          const nextStagedFiles = publicUrl
            ? filteredStaged
            : [...filteredStaged, { file, family, target }]

          return {
            customFonts: nextCustomFonts,
            stagedFontFiles: nextStagedFiles,
            ...(target === 'display' ? { displayFont: family } : { bodyFont: family }),
          }
        })

        // Clean up old family from Supabase if no longer in use
        if (oldFamily && id && id !== 'current' && !id.startsWith('demo-')) {
          const otherFont = target === 'display' ? get().bodyFont : get().displayFont
          if (otherFont !== oldFamily) {
            await deleteCustomFontFromSupabase(id, oldFamily, oldCustom?.url)
          }
        }

        await get().saveToSupabase()
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
        await get().saveToSupabase()
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
              coreValues: data.core_values || [],
              brandPillars: data.brand_pillars || [],
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
              dosAndDonts:
                Array.isArray(data.dos_and_donts) && data.dos_and_donts.length > 0
                  ? data.dos_and_donts
                  : DEFAULT_DOS_AND_DONTS,
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
            // If no brand_data row exists yet, retrieve project details from brand_projects
            const { data: projData } = await supabase
              .from('brand_projects')
              .select('name, brand_name, logo_url, primary_color, vision')
              .eq('id', projectId)
              .maybeSingle()

            const brandName = projData?.brand_name || projData?.name || 'Untitled Brand'

            let svgContent = cachedSvg || undefined
            if (!svgContent && projData?.logo_url) {
              try {
                const res = await fetch(projData.logo_url)
                if (res.ok) {
                  svgContent = await res.text()
                  await idbSet(`brand_svg_${id}`, svgContent)
                }
              } catch {}
            }

            const activeColors = projData?.primary_color
              ? [
                  createColorSwatch(projData.primary_color, 'primary', 'Primary Brand Color'),
                  ...defaultApex.colors.filter((c) => c.role !== 'primary'),
                ]
              : defaultApex.colors

            set({
              projectId,
              brandName,
              tagline: '',
              mission: '',
              vision: projData?.vision || '',
              coreValues: ['Excellence', 'Innovation', 'Integrity', 'Velocity'],
              brandPillars: [],
              toneRatings: { formal: 60, playful: 20, minimalist: 85, bold: 90 },
              designMovement: 'quiet-precision',
              logoUrl: projData?.logo_url || undefined,
              secondaryLogoUrl: undefined,
              svgContent,
              secondarySvgContent: cachedSecondarySvg || undefined,
              rasterDataUri: cachedRaster || undefined,
              colorPalette: activeColors,
              displayFont: defaultApex.displayFont,
              bodyFont: defaultApex.bodyFont,
              monoFont: defaultApex.monoFont,
              baseFontSize: 16,
              typeScaleRatio: 1.25,
              customFonts: [],
              clearspaceMultiplier: 1.0,
              dosAndDonts: DEFAULT_DOS_AND_DONTS,
              imageryMood: 'minimal',
              imageryOverlay: 'none',
              imageryLinks: IMAGERY_MOOD_IMAGE_ARRAYS.minimal,
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

        const effectiveDosAndDonts =
          state.dosAndDonts.length > 0
            ? state.dosAndDonts
            : DEFAULT_DOS_AND_DONTS

        if (state.dosAndDonts.length === 0) {
          set({ dosAndDonts: DEFAULT_DOS_AND_DONTS })
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
            brand_pillars: state.brandPillars,
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
            dos_and_donts: effectiveDosAndDonts,
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
                        logo_url: primaryLogo || undefined,
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
