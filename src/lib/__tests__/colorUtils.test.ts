import { describe, it, expect } from 'vitest'
import {
  hexToCmyk,
  hexToHsl,
  getWcagContrast,
  getReadableTextColor,
  createColorSwatch,
  generateTonalShades,
} from '@/lib/colorUtils'

describe('colorUtils', () => {
  describe('hexToCmyk', () => {
    it('correctly converts pure black to 100% K', () => {
      const cmyk = hexToCmyk('#000000')
      expect(cmyk).toEqual({ c: 0, m: 0, y: 0, k: 100 })
    })

    it('correctly converts pure white to 0% CMYK', () => {
      const cmyk = hexToCmyk('#ffffff')
      expect(cmyk).toEqual({ c: 0, m: 0, y: 0, k: 0 })
    })

    it('handles invalid hex gracefully', () => {
      const cmyk = hexToCmyk('invalid')
      expect(cmyk).toEqual({ c: 0, m: 0, y: 0, k: 100 })
    })
  })

  describe('hexToHsl', () => {
    it('correctly converts pure red', () => {
      const hsl = hexToHsl('#ff0000')
      expect(hsl.h).toBe(0)
      expect(hsl.s).toBe(100)
      expect(hsl.l).toBe(50)
    })

    it('correctly converts pure green', () => {
      const hsl = hexToHsl('#00ff00')
      expect(hsl.h).toBe(120)
      expect(hsl.s).toBe(100)
      expect(hsl.l).toBe(50)
    })
  })

  describe('getWcagContrast', () => {
    it('calculates maximum 21:1 contrast for black on white', () => {
      const result = getWcagContrast('#000000', '#ffffff')
      expect(result.ratio).toBe(21)
      expect(result.aaNormal).toBe(true)
      expect(result.aaaNormal).toBe(true)
      expect(result.rating).toBe('AAA')
    })

    it('calculates 1:1 contrast for identical colors', () => {
      const result = getWcagContrast('#ffffff', '#ffffff')
      expect(result.ratio).toBe(1)
      expect(result.aaNormal).toBe(false)
      expect(result.rating).toBe('Fail')
    })
  })

  describe('getReadableTextColor', () => {
    it('returns black text on bright background', () => {
      expect(getReadableTextColor('#ffffff')).toBe('#000000')
      expect(getReadableTextColor('#fef08a')).toBe('#000000')
    })

    it('returns white text on dark background', () => {
      expect(getReadableTextColor('#000000')).toBe('#ffffff')
      expect(getReadableTextColor('#0f172a')).toBe('#ffffff')
    })
  })

  describe('generateTonalShades', () => {
    it('generates a complete 50-950 swatch scale', () => {
      const shades = generateTonalShades('#6366f1')
      const expectedSteps = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950']
      expectedSteps.forEach((step) => {
        expect(shades[step]).toBeDefined()
        expect(shades[step]).toMatch(/^#[0-9a-f]{6}$/i)
      })
    })
  })

  describe('createColorSwatch', () => {
    it('creates a complete color swatch object with all color spaces', () => {
      const swatch = createColorSwatch('#6366f1', 'primary', 'Indigo')
      expect(swatch.role).toBe('primary')
      expect(swatch.name).toBe('Indigo')
      expect(swatch.hex.toLowerCase()).toBe('#6366f1')
      expect(swatch.rgb).toHaveProperty('r')
      expect(swatch.cmyk).toHaveProperty('c')
      expect(swatch.hsl).toHaveProperty('h')
      expect(swatch.shades['500']).toBeDefined()
    })
  })
})
