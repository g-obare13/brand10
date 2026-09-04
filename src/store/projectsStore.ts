import { create } from "zustand"
import { supabase } from "@/lib/supabase"
import { del as idbDel, get as idbGet } from "idb-keyval"
import { IMAGERY_MOOD_IMAGE_ARRAYS } from "@/data/wizard"

export interface BrandProjectItem {
  id: string
  name: string
  created_at: string
  updated_at: string
  logo_url?: string
  brand_name?: string
  primary_color?: string
  vision?: string
}

async function deleteProjectStorageAssets(projectId: string, userId?: string) {
  if (!supabase) return

  const storageTargets = [
    { bucket: "brand-logos", path: userId || projectId, prefix: `${projectId}_` },
    { bucket: "brand-fonts", path: userId || projectId, prefix: `${projectId}_` },
  ]

  for (const target of storageTargets) {
    const { data, error } = await supabase.storage
      .from(target.bucket)
      .list(target.path, { limit: 1000, search: target.prefix })

    if (error) throw error

    const matchingPaths = data
      .filter((file) => file.name.startsWith(target.prefix))
      .map((file) => `${target.path}/${file.name}`)

    if (matchingPaths.length > 0) {
      const { error: removeError } = await supabase.storage
        .from(target.bucket)
        .remove(matchingPaths)
      if (removeError) throw removeError
    }
  }

  if (userId) {
    for (const bucket of ["brand-logos", "brand-fonts"]) {
      const { data, error } = await supabase.storage
        .from(bucket)
        .list(projectId, { limit: 1000 })
      if (error) throw error

      const legacyPaths = data.map((file) => `${projectId}/${file.name}`)
      if (legacyPaths.length > 0) {
        const { error: removeError } = await supabase.storage
          .from(bucket)
          .remove(legacyPaths)
        if (removeError) throw removeError
      }
    }
  }
}

async function deleteProjectLocalAssets(projectId: string) {
  try {
    localStorage.removeItem(`brandio_local_brand_${projectId}`)
    await Promise.all([
      idbDel(`brand_svg_${projectId}`),
      idbDel(`brand_raster_${projectId}`),
      idbDel(`brand_secondary_svg_${projectId}`),
    ])
  } catch {}
}

async function findProjectLogoInStorage(projectId: string, userId: string) {
  if (!supabase) return undefined

  const locations = [
    { path: userId, prefix: `${projectId}_` },
    { path: projectId, prefix: "" },
  ]

  for (const location of locations) {
    const { data, error } = await supabase.storage
      .from("brand-logos")
      .list(location.path, { limit: 1000 })

    if (error) continue

    const logoName = data
      .filter((file) => {
        const isSupportedLogo = /\.(svg|png|jpe?g|webp)$/i.test(file.name)
        return isSupportedLogo && file.name.startsWith(location.prefix)
      })
      .sort((a, b) =>
        (b.created_at || b.updated_at || "").localeCompare(
          a.created_at || a.updated_at || ""
        )
      )[0]?.name

    if (logoName) {
      const filePath = `${location.path}/${logoName}`
      return supabase.storage.from("brand-logos").getPublicUrl(filePath).data
        .publicUrl
    }
  }

  return undefined
}

interface ProjectsState {
  projects: BrandProjectItem[]
  loading: boolean
  error: string | null
  isCreateModalOpen: boolean
  openCreateModal: () => void
  closeCreateModal: () => void
  fetchProjects: (userId?: string) => Promise<void>
  createProject: (
    name: string,
    userId?: string
  ) => Promise<{ project: BrandProjectItem | null; error: string | null }>
  deleteProject: (id: string, userId?: string) => Promise<void>
  isLimitReached: () => boolean
}

/**
 * Zustand store managing the user's collection of brand projects.
 * Features:
 * - Real-time project query from Supabase with IndexedDB offline caching.
 * - Project creation and deletion.
 * - Account project limit enforcement (e.g. 2-brand free tier limit).
 * - Create modal visibility management.
 */
export const useProjectsStore = create<ProjectsState>((set, get) => ({
  projects: [],
  loading: true,
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
        const saved = localStorage.getItem("brandio_local_projects")
        if (saved) {
          const parsed: BrandProjectItem[] = JSON.parse(saved)
          const withLogos = await Promise.all(
            parsed.map(async (p) => {
              if (p.logo_url) return p
              try {
                const cachedSvg = await idbGet(`brand_svg_${p.id}`)
                if (cachedSvg) {
                  return {
                    ...p,
                    logo_url: `data:image/svg+xml;utf8,${encodeURIComponent(cachedSvg)}`,
                  }
                }
                const cachedRaster = await idbGet(`brand_raster_${p.id}`)
                if (cachedRaster) {
                  return {
                    ...p,
                    logo_url: cachedRaster,
                  }
                }
              } catch {}
              return p
            })
          )
          set({ projects: withLogos, loading: false })
          return
        }
      } catch {}

      // Default to empty for new users
      set({ projects: [], loading: false })
      return
    }

    try {
      const { data, error } = await supabase
        .from("brand_projects")
        .select(
          `
          id,
          name,
          created_at,
          updated_at,
          brand_data (
            brand_name,
            logo_url,
            color_palette,
            vision
          )
        `
        )
        .order("updated_at", { ascending: false })

      if (error) throw error

      const formatted: BrandProjectItem[] = await Promise.all(
        data.map(async (item: any) => {
          const bd = Array.isArray(item.brand_data)
            ? item.brand_data[0]
            : item.brand_data
          const palette = bd?.color_palette || []
          const primaryColor =
            palette.find((c: any) => c.role === "primary")?.hex || "#624b59"

          let logoUrl = bd?.logo_url
          if (!logoUrl) {
            try {
              const cachedSvg = await idbGet(`brand_svg_${item.id}`)
              if (cachedSvg) {
                logoUrl = `data:image/svg+xml;utf8,${encodeURIComponent(cachedSvg)}`
              } else {
                const cachedRaster = await idbGet(`brand_raster_${item.id}`)
                if (cachedRaster) {
                  logoUrl = cachedRaster
                }
              }
            } catch {}
          }

          if (!logoUrl && userId) {
            logoUrl = await findProjectLogoInStorage(item.id, userId)
          }

          return {
            id: item.id,
            name: item.name || "Untitled Brand",
            created_at: item.created_at,
            updated_at: item.updated_at,
            logo_url: logoUrl,
            brand_name: bd?.brand_name || item.name,
            primary_color: primaryColor,
            vision: bd?.vision || undefined,
          }
        })
      )

      set({ projects: formatted, loading: false })
    } catch (err: any) {
      console.warn("Failed to fetch Supabase projects:", err)
      set({ error: err.message || "Could not load projects", loading: false })
    }
  },

  createProject: async (name, userId) => {
    if (get().isLimitReached()) {
      return {
        project: null,
        error: "Maximum of 2 projects allowed on this plan.",
      }
    }

    const trimmedName = name.trim() || "Untitled Brand"
    const newId = `project-${Math.random().toString(36).substring(2, 9)}`
    const now = new Date().toISOString()
    const newProject: BrandProjectItem = {
      id: newId,
      name: trimmedName,
      brand_name: trimmedName,
      created_at: now,
      updated_at: now,
      primary_color: "#624b59",
    }

    if (!supabase || !userId) {
      const updated = [newProject, ...get().projects].slice(0, 2)
      set({ projects: updated })
      try {
        localStorage.setItem("brandio_local_projects", JSON.stringify(updated))
        const initialBrandState = {
          projectId: newId,
          brandName: trimmedName,
          tagline: "",
          mission: "",
          vision: "",
          coreValues: ["Excellence", "Innovation", "Integrity", "Velocity"],
          toneRatings: { formal: 60, playful: 20, minimalist: 85, bold: 90 },
          displayFont: "Plus Jakarta Sans",
          bodyFont: "Inter",
          monoFont: "JetBrains Mono",
          baseFontSize: 16,
          typeScaleRatio: 1.25,
          clearspaceMultiplier: 1.0,
          dosAndDonts: [
            {
              id: "1",
              type: "dont",
              rule: "Don't use outdated versions",
              detail:
                "If the brand has had past logo iterations, only the current approved version should appear.",
            },
            {
              id: "2",
              type: "dont",
              rule: "Don't add effects",
              detail:
                "No drop shadows, gradients, outlines, bevels, or glows unless that's part of the actual logo design.",
            },
            {
              id: "3",
              type: "dont",
              rule: "Don't recolor outside the approved palette",
              detail: "No random or off-brand colors applied to the mark.",
            },
            {
              id: "4",
              type: "dont",
              rule: "Don't rotate",
              detail:
                "Keep the logo at its intended orientation unless a rotated lockup is explicitly part of the system.",
            },
            {
              id: "5",
              type: "dont",
              rule: "Don't stretch or distort",
              detail:
                "Never scale non-proportionally (squishing horizontally or vertically).",
            },
          ],
          colorPalette: [
            {
              id: "primary",
              hex: "#624b59",
              name: "Primary Indigo",
              role: "primary",
              rgb: { r: 79, g: 70, b: 229 },
              cmyk: { c: 66, m: 69, y: 0, k: 10 },
              hsl: { h: 243, s: 75, l: 59 },
              shades: {
                50: "#eef2ff",
                100: "#e0e7ff",
                200: "#c7d2fe",
                300: "#a5b4fc",
                400: "#818cf8",
                500: "#6366f1",
                600: "#624b59",
                700: "#4338ca",
                800: "#3730a3",
                900: "#312e81",
                950: "#1e1b4b",
              },
            },
            {
              id: "secondary",
              hex: "#06b6d4",
              name: "Cyber Cyan",
              role: "secondary",
              rgb: { r: 6, g: 182, b: 212 },
              cmyk: { c: 97, m: 14, y: 0, k: 17 },
              hsl: { h: 189, s: 94, l: 43 },
              shades: {},
            },
            {
              id: "neutral",
              hex: "#0f172a",
              name: "Midnight Slate",
              role: "neutral",
              rgb: { r: 15, g: 23, b: 42 },
              cmyk: { c: 64, m: 45, y: 0, k: 84 },
              hsl: { h: 222, s: 47, l: 11 },
              shades: {},
            },
            {
              id: "background",
              hex: "#ffffff",
              name: "Pure Surface",
              role: "background",
              rgb: { r: 255, g: 255, b: 255 },
              cmyk: { c: 0, m: 0, y: 0, k: 0 },
              hsl: { h: 0, s: 0, l: 100 },
              shades: {},
            },
          ],
          imageryMood: "minimal",
          imageryOverlay: "none",
          imageryLinks: IMAGERY_MOOD_IMAGE_ARRAYS.minimal,
          activeTab: "overview",
          isSaving: false,
          lastSavedAt: now,
        }
        localStorage.setItem(
          `brandio_local_brand_${newId}`,
          JSON.stringify(initialBrandState)
        )
      } catch {}
      return { project: newProject, error: null }
    }

    try {
      const { data, error } = await supabase
        .from("brand_projects")
        .insert([{ user_id: userId, name: trimmedName }])
        .select()
        .single()

      if (error) throw error

      const initialPalette = [
        {
          id: "primary",
          hex: "#624b59",
          name: "Primary Indigo",
          role: "primary",
          rgb: { r: 79, g: 70, b: 229 },
          cmyk: { c: 66, m: 69, y: 0, k: 10 },
          hsl: { h: 243, s: 75, l: 59 },
          shades: {
            50: "#eef2ff",
            100: "#e0e7ff",
            200: "#c7d2fe",
            300: "#a5b4fc",
            400: "#818cf8",
            500: "#6366f1",
            600: "#624b59",
            700: "#4338ca",
            800: "#3730a3",
            900: "#312e81",
            950: "#1e1b4b",
          },
        },
        {
          id: "secondary",
          hex: "#06b6d4",
          name: "Cyber Cyan",
          role: "secondary",
          rgb: { r: 6, g: 182, b: 212 },
          cmyk: { c: 97, m: 14, y: 0, k: 17 },
          hsl: { h: 189, s: 94, l: 43 },
          shades: {},
        },
        {
          id: "neutral",
          hex: "#0f172a",
          name: "Midnight Slate",
          role: "neutral",
          rgb: { r: 15, g: 23, b: 42 },
          cmyk: { c: 64, m: 45, y: 0, k: 84 },
          hsl: { h: 222, s: 47, l: 11 },
          shades: {},
        },
        {
          id: "background",
          hex: "#ffffff",
          name: "Pure Surface",
          role: "background",
          rgb: { r: 255, g: 255, b: 255 },
          cmyk: { c: 0, m: 0, y: 0, k: 0 },
          hsl: { h: 0, s: 0, l: 100 },
          shades: {},
        },
      ]

      // Initialize brand_data row with user-chosen name and sensible defaults
      await supabase.from("brand_data").insert([
        {
          project_id: data.id,
          brand_name: data.name,
          tagline: "",
          mission: "",
          vision: "",
          core_values: ["Excellence", "Innovation", "Integrity", "Velocity"],
          tone_ratings: { formal: 60, playful: 20, minimalist: 85, bold: 90 },
          color_palette: initialPalette,
          display_font: "Plus Jakarta Sans",
          body_font: "Inter",
          monospace_font: "JetBrains Mono",
          base_font_size: 16,
          type_scale_ratio: 1.25,
          clearspace_multiplier: 1.0,
          imagery_mood: "minimal",
          imagery_overlay: "none",
          logo_variants: {
            imagery_links: IMAGERY_MOOD_IMAGE_ARRAYS.minimal,
          },
        },
      ])

      const createdItem: BrandProjectItem = {
        id: data.id,
        name: data.name,
        created_at: data.created_at,
        updated_at: data.updated_at,
        brand_name: data.name,
        primary_color: "#624b59",
      }

      set({ projects: [createdItem, ...get().projects] })
      return { project: createdItem, error: null }
    } catch (err: any) {
      return { project: null, error: err.message || "Could not create project" }
    }
  },

  deleteProject: async (id: string, userId?: string) => {
    const filtered = get().projects.filter((p) => p.id !== id)
    set({ projects: filtered })
    try {
      localStorage.setItem("brandio_local_projects", JSON.stringify(filtered))
    } catch {}

    await deleteProjectLocalAssets(id)

    if (supabase) {
      try {
        await deleteProjectStorageAssets(id, userId)
        // Delete child brand_data explicitly and then brand_projects
        await supabase.from("brand_data").delete().eq("project_id", id)
        const { error } = await supabase
          .from("brand_projects")
          .delete()
          .eq("id", id)
        if (error) {
          console.error("Failed to delete project from Supabase:", error)
          if (userId) {
            get().fetchProjects(userId)
          }
        }
      } catch (err) {
        console.error("Failed to delete project:", err)
      }
    }
  },
}))
