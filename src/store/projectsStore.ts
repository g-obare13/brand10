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
  fetchProjects: (userId?: string) => Promise<void>
  createProject: (name: string, userId?: string) => Promise<{ project: BrandProjectItem | null; error: string | null }>
  deleteProject: (id: string) => Promise<void>
  duplicateProject: (id: string) => Promise<void>
  isLimitReached: () => boolean
}

export const useProjectsStore = create<ProjectsState>((set, get) => ({
  projects: [],
  loading: false,
  error: null,

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

      // Default demo projects
      const demoProjects: BrandProjectItem[] = [
        {
          id: 'demo-apex',
          name: 'Apex Studio',
          brand_name: 'Apex Studio',
          created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
          updated_at: new Date(Date.now() - 86400000).toISOString(),
          primary_color: '#4f46e5',
        },
      ]
      set({ projects: demoProjects, loading: false })
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

      const formatted: BrandProjectItem[] = (data || []).map((item: any) => {
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

      const createdItem: BrandProjectItem = {
        id: data.id,
        name: data.name,
        created_at: data.created_at,
        updated_at: data.updated_at,
        primary_color: '#4f46e5',
      }

      set({ projects: [createdItem, ...get().projects] })
      return { project: createdItem, error: null }
    } catch (err: any) {
      return { project: null, error: err.message || 'Could not create project' }
    }
  },

  deleteProject: async (id) => {
    if (!supabase) {
      const filtered = get().projects.filter((p) => p.id !== id)
      set({ projects: filtered })
      try {
        localStorage.setItem('brandio_local_projects', JSON.stringify(filtered))
      } catch {}
      return
    }

    try {
      await supabase.from('brand_projects').delete().eq('id', id)
      set({ projects: get().projects.filter((p) => p.id !== id) })
    } catch (err) {
      console.error('Failed to delete project:', err)
    }
  },

  duplicateProject: async (id) => {
    if (get().isLimitReached()) {
      return
    }
    const source = get().projects.find((p) => p.id === id)
    if (!source) return
    await get().createProject(`${source.name} (Copy)`)
  },
}))
