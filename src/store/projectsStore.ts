import { create } from 'zustand'
import { supabase } from '../lib/supabase'

export interface BrandProjectItem {
  id: string
  name: string
  created_at: string
  updated_at: string
  logo_url?: string
  brand_name?: string
  primary_color?: string
}

interface ProjectsState {
  projects: BrandProjectItem[]
  loading: boolean
  error: string | null
  isCreateModalOpen: boolean
  openCreateModal: () => void
  closeCreateModal: () => void
  fetchProjects: (userId?: string) => Promise<void>
  createProject: (name: string, userId?: string) => Promise<{ project: BrandProjectItem | null; error: string | null }>
  deleteProject: (id: string, userId?: string) => Promise<void>
  duplicateProject: (id: string, userId?: string) => Promise<void>
  isLimitReached: () => boolean
}

export const useProjectsStore = create<ProjectsState>((set, get) => ({
  projects: [],
  loading: false,
  error: null,
  isCreateModalOpen: false,

  openCreateModal: () => set({ isCreateModalOpen: true }),
  closeCreateModal: () => set({ isCreateModalOpen: false }),

  isLimitReached: () => {
    return get().projects.length >= 2
  },

  fetchProjects: async (userId) => {
    set({ loading: true, error: null })
    if (!supabase || !userId) {
      // Local fallback in memory or localStorage
      try {
        const saved = localStorage.getItem('brandio_local_projects')
        if (saved) {
          set({ projects: JSON.parse(saved), loading: false })
          return
        }
      } catch {}

      // Default to empty for new users
      set({ projects: [], loading: false })
      return
    }

    try {
      const { data, error } = await supabase
        .from('brand_projects')
        .select(`
          id,
          name,
          created_at,
          updated_at,
          brand_data (
            brand_name,
            logo_url,
            color_palette
          )
        `)
        .order('updated_at', { ascending: false })

      if (error) throw error

      const formatted: BrandProjectItem[] = data.map((item: any) => {
        const bd = Array.isArray(item.brand_data) ? item.brand_data[0] : item.brand_data
        const palette = bd?.color_palette || []
        const primaryColor = palette.find((c: any) => c.role === 'primary')?.hex || '#4f46e5'

        return {
          id: item.id,
          name: item.name || 'Untitled Brand',
          created_at: item.created_at,
          updated_at: item.updated_at,
          logo_url: bd?.logo_url,
          brand_name: bd?.brand_name || item.name,
          primary_color: primaryColor,
        }
      })

      set({ projects: formatted, loading: false })
    } catch (err: any) {
      console.warn('Failed to fetch Supabase projects:', err)
      set({ error: err.message || 'Could not load projects', loading: false })
    }
  },

  createProject: async (name, userId) => {
    if (get().isLimitReached()) {
      return { project: null, error: 'Maximum of 2 projects allowed on this plan.' }
    }

    const newId = `project-${Math.random().toString(36).substring(2, 9)}`
    const now = new Date().toISOString()
    const newProject: BrandProjectItem = {
      id: newId,
      name: name.trim() || 'Untitled Brand',
      brand_name: name.trim() || 'Untitled Brand',
      created_at: now,
      updated_at: now,
      primary_color: '#4f46e5',
    }

    if (!supabase || !userId) {
      const updated = [newProject, ...get().projects].slice(0, 2)
      set({ projects: updated })
      try {
        localStorage.setItem('brandio_local_projects', JSON.stringify(updated))
      } catch {}
      return { project: newProject, error: null }
    }

    try {
      const { data, error } = await supabase
        .from('brand_projects')
        .insert([{ user_id: userId, name: name.trim() || 'Untitled Brand' }])
        .select()
        .single()

      if (error) throw error

      const initialPalette = [
        {
          id: 'primary',
          hex: '#4f46e5',
          name: 'Primary Indigo',
          role: 'primary',
          rgb: { r: 79, g: 70, b: 229 },
          cmyk: { c: 66, m: 69, y: 0, k: 10 },
          hsl: { h: 243, s: 75, l: 59 },
          shades: {
            50: '#eef2ff',
            100: '#e0e7ff',
            200: '#c7d2fe',
            300: '#a5b4fc',
            400: '#818cf8',
            500: '#6366f1',
            600: '#4f46e5',
            700: '#4338ca',
            800: '#3730a3',
            900: '#312e81',
            950: '#1e1b4b',
          },
        },
        {
          id: 'secondary',
          hex: '#06b6d4',
          name: 'Cyber Cyan',
          role: 'secondary',
          rgb: { r: 6, g: 182, b: 212 },
          cmyk: { c: 97, m: 14, y: 0, k: 17 },
          hsl: { h: 189, s: 94, l: 43 },
          shades: {},
        },
        {
          id: 'neutral',
          hex: '#0f172a',
          name: 'Midnight Slate',
          role: 'neutral',
          rgb: { r: 15, g: 23, b: 42 },
          cmyk: { c: 64, m: 45, y: 0, k: 84 },
          hsl: { h: 222, s: 47, l: 11 },
          shades: {},
        },
        {
          id: 'background',
          hex: '#ffffff',
          name: 'Pure Surface',
          role: 'background',
          rgb: { r: 255, g: 255, b: 255 },
          cmyk: { c: 0, m: 0, y: 0, k: 0 },
          hsl: { h: 0, s: 0, l: 100 },
          shades: {},
        },
      ]

      // Initialize brand_data row with user-chosen name and sensible defaults
      await supabase.from('brand_data').insert([
        {
          project_id: data.id,
          brand_name: data.name,
          tagline: '',
          mission: '',
          vision: '',
          core_values: ['Excellence', 'Innovation', 'Integrity', 'Velocity'],
          tone_ratings: { formal: 60, playful: 20, minimalist: 85, bold: 90 },
          color_palette: initialPalette,
          display_font: 'Plus Jakarta Sans',
          body_font: 'Inter',
          monospace_font: 'JetBrains Mono',
          base_font_size: 16,
          type_scale_ratio: 1.25,
          clearspace_multiplier: 1.0,
        },
      ])

      const createdItem: BrandProjectItem = {
        id: data.id,
        name: data.name,
        created_at: data.created_at,
        updated_at: data.updated_at,
        brand_name: data.name,
        primary_color: '#4f46e5',
      }

      set({ projects: [createdItem, ...get().projects] })
      return { project: createdItem, error: null }
    } catch (err: any) {
      return { project: null, error: err.message || 'Could not create project' }
    }
  },

  deleteProject: async (id: string, userId?: string) => {
    const filtered = get().projects.filter((p) => p.id !== id)
    set({ projects: filtered })
    try {
      localStorage.setItem('brandio_local_projects', JSON.stringify(filtered))
      localStorage.removeItem(`brandio_local_brand_${id}`)
    } catch {}

    if (supabase) {
      try {
        // Delete child brand_data explicitly and then brand_projects
        await supabase.from('brand_data').delete().eq('project_id', id)
        const { error } = await supabase.from('brand_projects').delete().eq('id', id)
        if (error) {
          console.error('Failed to delete project from Supabase:', error)
          if (userId) {
            get().fetchProjects(userId)
          }
        }
      } catch (err) {
        console.error('Failed to delete project:', err)
      }
    }
  },

  duplicateProject: async (id: string, userId?: string) => {
    if (get().isLimitReached()) {
      return
    }
    const source = get().projects.find((p) => p.id === id)
    if (!source) return

    const { project } = await get().createProject(`${source.name} (Copy)`, userId)
    if (!project) return

    // Copy brand_data if available
    if (supabase && project.id) {
      try {
        const { data: sourceData } = await supabase
          .from('brand_data')
          .select('*')
          .eq('project_id', id)
          .maybeSingle()

        if (sourceData) {
          const { id: _unusedId, project_id: _unusedProjId, ...rest } = sourceData
          await supabase
            .from('brand_data')
            .update({
              ...rest,
              brand_name: `${source.name} (Copy)`,
              updated_at: new Date().toISOString(),
            })
            .eq('project_id', project.id)
        }
      } catch (err) {
        console.warn('Failed to copy full brand data for duplicate:', err)
      }
    }
  },
}))
