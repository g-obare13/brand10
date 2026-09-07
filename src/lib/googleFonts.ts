import { POPULAR_FALLBACK_FONTS } from "@/data/fonts"
import type { GoogleFontItem } from "@/data/fonts"

export { POPULAR_FALLBACK_FONTS }
export type { GoogleFontItem }

let cachedGoogleFonts: GoogleFontItem[] | null = null
let fetchPromise: Promise<GoogleFontItem[]> | null = null

/**
 * Fetch all available Google Fonts using the Developer API key
 * Falls back to popular fonts if offline or on network error
 */
export async function fetchGoogleFonts(): Promise<GoogleFontItem[]> {
  if (cachedGoogleFonts && cachedGoogleFonts.length > 0) {
    return cachedGoogleFonts
  }

  // Check sessionStorage cache to avoid repeated network overhead
  if (typeof window !== "undefined") {
    try {
      const stored = sessionStorage.getItem("brand_studio_google_fonts")
      if (stored) {
        const parsed = JSON.parse(stored) as GoogleFontItem[]
        if (Array.isArray(parsed) && parsed.length > 0) {
          cachedGoogleFonts = parsed
          return parsed
        }
      }
    } catch {
      // Ignore sessionStorage parsing errors
    }
  }

  if (fetchPromise) {
    return fetchPromise
  }

  const apiKey = import.meta.env.VITE_GOOGLE_FONTS_API_KEY

  fetchPromise = (async () => {
    try {
      if (!apiKey) {
        cachedGoogleFonts = POPULAR_FALLBACK_FONTS
        return POPULAR_FALLBACK_FONTS
      }

      const response = await fetch(
        `https://www.googleapis.com/webfonts/v1/webfonts?sort=popularity&key=${apiKey}`
      )

      if (!response.ok) {
        console.warn(
          "Google Fonts API responded with status:",
          response.status,
          "Using fallback font catalog."
        )
        cachedGoogleFonts = POPULAR_FALLBACK_FONTS
        return POPULAR_FALLBACK_FONTS
      }

      const data = await response.json()
      if (data && Array.isArray(data.items)) {
        cachedGoogleFonts = data.items
        if (typeof window !== "undefined") {
          try {
            sessionStorage.setItem(
              "brand_studio_google_fonts",
              JSON.stringify(data.items.slice(0, 300)) // cache top 300 in session
            )
          } catch {
            // Ignore quota errors
          }
        }
        return data.items
      }

      cachedGoogleFonts = POPULAR_FALLBACK_FONTS
      return POPULAR_FALLBACK_FONTS
    } catch (err) {
      console.warn("Failed to fetch Google Fonts list:", err)
      cachedGoogleFonts = POPULAR_FALLBACK_FONTS
      return POPULAR_FALLBACK_FONTS
    } finally {
      fetchPromise = null
    }
  })()

  return fetchPromise
}

/**
 * Register a custom uploaded font (WOFF2, WOFF, TTF, OTF) dynamically into document.fonts
 */
export async function registerCustomFontFace(
  fontFamily: string,
  sourceUrlOrBuffer: string | ArrayBuffer
): Promise<boolean> {
  if (typeof window === "undefined") return false

  try {
    const source =
      typeof sourceUrlOrBuffer === "string"
        ? `url(${sourceUrlOrBuffer})`
        : sourceUrlOrBuffer

    // Register for standard weights and normal weight so bold headings (H1-H6) match
    const weights = ["400", "500", "600", "700", "800"]
    for (const weight of weights) {
      try {
        const fontFace = new FontFace(fontFamily, source, { weight, style: "normal" })
        const loadedFace = await fontFace.load()
        document.fonts.add(loadedFace)
      } catch (innerErr) {
        console.warn(`Could not register weight ${weight} for '${fontFamily}':`, innerErr)
      }
    }

    // Also register default without descriptors as baseline
    const baseFace = new FontFace(fontFamily, source)
    const loadedBase = await baseFace.load()
    document.fonts.add(loadedBase)

    return true
  } catch (err) {
    console.error(`Failed to register custom font face '${fontFamily}':`, err)
    return false
  }
}
