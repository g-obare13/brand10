import type { ColorSwatch } from '@/lib/colorUtils'
import type { BrandDoDontItem } from '@/store/brandStore'

/**
 * Normalized canonical brand export specification model.
 * Consumed symmetrically by:
 * - PDF Brand Guidelines Deck generator (@react-pdf/renderer)
 * - Production ZIP Archive compiler (JSZip)
 * - Design Tokens JSON (W3C standard format)
 * - Tailwind CSS theme config generator
 * - CSS Custom Properties generator
 * - Markdown Brand System documentation
 */
export interface BrandExportModel {
  // Positioning & Identity
  brandName: string
  tagline: string
  mission: string
  vision: string
  coreValues: string[]

  // Tone & Movement
  designMovement?: string
  toneRatings: {
    formal: number
    playful: number
    minimalist: number
    bold: number
  }

  // Logo System
  logoUrl?: string
  svgContent?: string
  rasterDataUri?: string
  secondaryLogoUrl?: string
  secondarySvgContent?: string
  isVector: boolean
  aspectRatio: number
  clearspaceMultiplier: number
  dosAndDonts: BrandDoDontItem[]

  // Color System
  colors: ColorSwatch[]

  // Typography System
  displayFont: string
  bodyFont: string
  monoFont: string
  baseFontSize: number
  typeScaleRatio: number

  // Imagery & Iconography Styling
  imageryMood: 'minimal' | 'cinematic' | 'vibrant' | 'editorial'
  imageryOverlay: 'none' | 'tint' | 'duotone'
  iconStyle: 'stroke' | 'solid' | 'duotone'
  iconRadius: number
  iconStroke: number

  // Metadata
  exportedAt?: string
}
