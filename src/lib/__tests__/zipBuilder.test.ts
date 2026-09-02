import { describe, it, expect } from 'vitest'
import {
  generateTailwindConfig,
  generateTokensJson,
  generateCssTokens,
  generateGuidelinesMarkdown,
} from '@/lib/zipBuilder'
import type { ZipExportOptions } from '@/lib/zipBuilder'
import { createColorSwatch } from '@/lib/colorUtils'

describe('zipBuilder generators', () => {
  const mockOptions: ZipExportOptions = {
    brandName: 'Acme Studio',
    tagline: 'Precision engineered branding',
    mission: 'Empower creators worldwide',
    vision: 'A unified visual language',
    coreValues: ['Precision', 'Velocity', 'Simplicity'],
    colors: [
      createColorSwatch('#6366f1', 'primary', 'Indigo'),
      createColorSwatch('#10b981', 'secondary', 'Emerald'),
    ],
    displayFont: 'Inter',
    bodyFont: 'Inter',
    monoFont: 'JetBrains Mono',
    baseFontSize: 16,
    typeScaleRatio: 1.25,
    isVector: true,
  }

  describe('generateTailwindConfig', () => {
    it('produces valid Tailwind config string referencing brand colors and fonts', () => {
      const config = generateTailwindConfig(mockOptions)
      expect(config).toContain('module.exports = {')
      expect(config).toContain("'primary':")
      expect(config).toContain("'secondary':")
      expect(config).toContain("display: ['\"Inter\"', 'sans-serif']")
      expect(config).toContain("mono: ['\"JetBrains Mono\"', 'monospace']")
    })
  })

  describe('generateTokensJson', () => {
    it('produces valid parseable JSON adhering to design tokens structure', () => {
      const jsonStr = generateTokensJson(mockOptions)
      const parsed = JSON.parse(jsonStr)
      expect(parsed).toHaveProperty('color')
      expect(parsed.color).toHaveProperty('primary')
      expect(parsed.color.primary.value).toBe('#6366f1')
      expect(parsed.color.primary.type).toBe('color')
      expect(parsed).toHaveProperty('typography')
      expect(parsed.typography.fontFamily.display.value).toBe('Inter')
    })
  })

  describe('generateCssTokens', () => {
    it('generates standard CSS custom properties within :root', () => {
      const css = generateCssTokens(mockOptions)
      expect(css).toContain(':root {')
      expect(css).toContain('--color-primary: #6366f1;')
      expect(css).toContain("--font-display: 'Inter', sans-serif;")
      expect(css).toContain("--font-mono: 'JetBrains Mono', monospace;")
      expect(css).toContain('}')
    })
  })

  describe('generateGuidelinesMarkdown', () => {
    it('generates structured Markdown documentation with strategy, colors, and typography', () => {
      const md = generateGuidelinesMarkdown(mockOptions)
      expect(md).toContain('# Acme Studio - Brand Guidelines & Identity Spec')
      expect(md).toContain('## 1. Brand Strategy')
      expect(md).toContain('Empower creators worldwide')
      expect(md).toContain('## 2. Color System')
      expect(md).toContain('## 3. Typography System')
    })
  })
})
