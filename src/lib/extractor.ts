import chroma from 'chroma-js'
import { getPalette } from 'colorthief'
import type { ColorSwatch } from './colorUtils'
import { createColorSwatch } from './colorUtils'

export interface ExtractedBrandData {
  brandName: string
  colors: ColorSwatch[]
  isVector: boolean
  aspectRatio: number
  svgDataUri?: string
  rasterDataUri?: string
}

/**
 * Clean and normalize hex/rgb color strings found in SVG attributes or inline styles
 */
function normalizeColor(colorStr: string): string | null {
  if (!colorStr) return null
  const cleaned = colorStr.trim().toLowerCase()
  if (
    cleaned === 'none' ||
    cleaned === 'transparent' ||
    cleaned === 'currentcolor' ||
    cleaned === 'inherit'
  ) {
    return null
  }
  try {
    if (chroma.valid(cleaned)) {
      return chroma(cleaned).hex()
    }
  } catch {
    return null
  }
  return null
}

/**
 * Filter out near-white and near-black colors to find vivid brand accents
 */
function isInterestingColor(hex: string): boolean {
  try {
    const color = chroma(hex)
    const lum = color.luminance()
    const sat = color.get('hsl.s')
    // Exclude absolute whites/blacks unless no other colors exist
    if (lum > 0.96 || lum < 0.04) return false
    if (sat < 0.05 && (lum > 0.9 || lum < 0.1)) return false
    return true
  } catch {
    return false
  }
}

/**
 * Cluster similar colors together and return top distinct colors
 */
export function clusterDistinctColors(hexColors: string[], maxCount = 2): string[] {
  if (!hexColors.length) return []

  const distinct: string[] = []

  for (const hex of hexColors) {
    const isClose = distinct.some((existing) => {
      try {
        return chroma.deltaE(hex, existing) < 14
      } catch {
        return false
      }
    })
    if (!isClose) {
      distinct.push(hex)
    }
    if (distinct.length >= maxCount) break
  }

  return distinct
}

/**
 * Dual Path 1: Vector (SVG) Dominant Color Extractor
 * Extracts only the most dominant colors present in the SVG (default max 2)
 */
export async function extractColorsFromSvg(
  svgText: string,
  maxCount = 2
): Promise<string[]> {
  if (!svgText) return []
  try {
    const parser = new DOMParser()
    const doc = parser.parseFromString(svgText, 'image/svg+xml')
    if (doc.querySelector('parsererror')) return []

    const colorCounts = new Map<string, number>()

    const recordColor = (raw: string | null) => {
      if (!raw) return
      const hex = normalizeColor(raw)
      if (hex) {
        colorCounts.set(hex, (colorCounts.get(hex) || 0) + 1)
      }
    }

    // 1. Traverse all elements and tally color occurrences
    const elements = doc.querySelectorAll('*')
    elements.forEach((el) => {
      recordColor(el.getAttribute('fill'))
      recordColor(el.getAttribute('stroke'))
      recordColor(el.getAttribute('stop-color'))

      const style = el.getAttribute('style')
      if (style) {
        const fillMatch = style.match(/fill\s*:\s*([^;]+)/i)
        if (fillMatch) recordColor(fillMatch[1])
        const strokeMatch = style.match(/stroke\s*:\s*([^;]+)/i)
        if (strokeMatch) recordColor(strokeMatch[1])
        const stopMatch = style.match(/stop-color\s*:\s*([^;]+)/i)
        if (stopMatch) recordColor(stopMatch[1])
      }
    })

    if (!colorCounts.size) return []

    // 2. Sort colors by frequency/dominance (most used first)
    const sortedColors = Array.from(colorCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([color]) => color)

    // 3. Separate vivid/saturated brand colors from pure black/white/grays
    const vividColors = sortedColors.filter(isInterestingColor)
    const candidateColors = vividColors.length > 0 ? vividColors : sortedColors

    // 4. Return top distinct dominant colors (no artificial filler colors)
    return clusterDistinctColors(candidateColors, maxCount)
  } catch (err) {
    console.error('Failed to extract SVG colors:', err)
    return []
  }
}

/**
 * Dual Path 2: Raster (PNG, JPG, WebP) Color Extractor
 */
export async function extractColorsFromRaster(imageSrc: string): Promise<string[]> {
  return new Promise((resolve) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = async () => {
      try {
        const palette = await getPalette(img, { colorCount: 8 })
        if (!palette || !palette.length) {
          resolve(['#4f46e5', '#06b6d4', '#10b981', '#f59e0b', '#64748b'])
          return
        }

        const hexColors = palette.map((colorItem: any) => {
          if (typeof colorItem?.hex === 'function') {
            return colorItem.hex()
          }
          if (Array.isArray(colorItem)) {
            return chroma.rgb(colorItem[0], colorItem[1], colorItem[2]).hex()
          }
          if (colorItem && typeof colorItem === 'object' && 'r' in colorItem) {
            return chroma.rgb(colorItem.r, colorItem.g, colorItem.b).hex()
          }
          return chroma(colorItem).hex()
        })
        const interestingColors = hexColors.filter(isInterestingColor)
        const candidateColors = interestingColors.length > 0 ? interestingColors : hexColors
        resolve(clusterDistinctColors(candidateColors, 5))
      } catch (err) {
        console.warn('ColorThief extraction fallback:', err)
        resolve(['#4f46e5', '#06b6d4', '#10b981', '#f59e0b', '#64748b'])
      }
    }
    img.onerror = () => {
      resolve(['#4f46e5', '#06b6d4', '#10b981', '#f59e0b', '#64748b'])
    }
    img.src = imageSrc
  })
}

/**
 * Infer Brand Name from filename or SVG metadata
 */
export function inferBrandName(fileName: string, svgContent?: string): string {
  if (svgContent) {
    const parser = new DOMParser()
    const doc = parser.parseFromString(svgContent, 'image/svg+xml')
    const title = doc.querySelector('title')?.textContent.trim()
    if (title && title.length > 1 && title.length < 40) {
      return title
    }
  }

  const base = fileName.replace(/\.[^/.]+$/, '')
  const sanitized = base
    .replace(/[-_]/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .trim()

  if (!sanitized || sanitized.toLowerCase() === 'logo' || sanitized.toLowerCase() === 'brand') {
    return 'Acme Brand'
  }

  return sanitized
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

/**
 * Main High-Level Ingestion Pipeline for any File (SVG / Raster)
 */
export async function ingestBrandFile(file: File): Promise<ExtractedBrandData> {
  const isVector = file.type === 'image/svg+xml' || file.name.toLowerCase().endsWith('.svg')
  let brandName = inferBrandName(file.name)
  let rawHexColors: string[] = []
  let svgDataUri: string | undefined
  let rasterDataUri: string | undefined
  let aspectRatio = 1.0

  if (isVector) {
    const text = await file.text()
    brandName = inferBrandName(file.name, text)
    rawHexColors = await extractColorsFromSvg(text)
    svgDataUri = `data:image/svg+xml;utf8,${encodeURIComponent(text)}`

    // Extract aspect ratio from viewBox or width/height
    const parser = new DOMParser()
    const doc = parser.parseFromString(text, 'image/svg+xml')
    const svgEl = doc.querySelector('svg')
    if (svgEl) {
      const viewBox = svgEl.getAttribute('viewBox')
      if (viewBox) {
        const parts = viewBox.split(/[\s,]+/).map(Number)
        if (parts.length === 4 && parts[2] > 0 && parts[3] > 0) {
          aspectRatio = parts[2] / parts[3]
        }
      } else {
        const width = parseFloat(svgEl.getAttribute('width') || '0')
        const height = parseFloat(svgEl.getAttribute('height') || '0')
        if (width > 0 && height > 0) {
          aspectRatio = width / height
        }
      }
    }
  } else {
    // Raster (PNG/JPEG)
    rasterDataUri = await new Promise<string>((resolve) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.readAsDataURL(file)
    })

    rawHexColors = await extractColorsFromRaster(rasterDataUri)

    // Calculate aspect ratio
    await new Promise<void>((resolve) => {
      const img = new Image()
      img.onload = () => {
        if (img.naturalWidth && img.naturalHeight) {
          aspectRatio = img.naturalWidth / img.naturalHeight
        }
        resolve()
      }
      img.onerror = () => resolve()
      img.src = rasterDataUri!
    })
  }

  // Convert raw hex colors to full ColorSwatch array with roles
  const roles: ColorSwatch['role'][] = ['primary', 'secondary', 'accent', 'neutral', 'background']
  const colors: ColorSwatch[] = rawHexColors.map((hex, index) => {
    const role = roles[index] || 'custom'
    return createColorSwatch(hex, role)
  })

  // Ensure we have at least 4 core roles
  if (colors.length < 4) {
    if (!colors.some((c) => c.role === 'neutral')) {
      colors.push(createColorSwatch('#64748b', 'neutral', 'Slate Neutral'))
    }
    if (!colors.some((c) => c.role === 'background')) {
      colors.push(createColorSwatch('#f8fafc', 'background', 'Clean Canvas'))
    }
  }

  return {
    brandName,
    colors,
    isVector,
    aspectRatio,
    svgDataUri,
    rasterDataUri,
  }
}
