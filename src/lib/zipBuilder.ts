import JSZip from 'jszip'
import fileSaver from 'file-saver'
const saveAs = fileSaver.saveAs || fileSaver
import type { ColorSwatch } from './colorUtils'

export interface ZipExportOptions {
  brandName: string
  tagline: string
  mission: string
  vision: string
  coreValues: string[]
  colors: ColorSwatch[]
  displayFont: string
  bodyFont: string
  monoFont: string
  baseFontSize: number
  typeScaleRatio: number
  isVector: boolean
  svgContent?: string
  rasterDataUri?: string
}

/**
 * Render an image/svg into a canvas and export as PNG Blob at given width/height
 */
async function renderToPngBlob(
  sourceUri: string,
  width: number,
  height: number
): Promise<Blob | null> {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')
    if (!ctx) return resolve(null)

    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      ctx.clearRect(0, 0, width, height)
      ctx.drawImage(img, 0, 0, width, height)
      canvas.toBlob((blob) => resolve(blob), 'image/png')
    }
    img.onerror = () => resolve(null)
    img.src = sourceUri
  })
}

/**
 * Generate Tailwind CSS v3 (CommonJS) configuration
 */
export function generateTailwindConfig(options: ZipExportOptions): string {
  const colorsObject: Record<string, Record<string, string>> = {}

  options.colors.forEach((c) => {
    const key = c.role === 'custom' ? c.name.toLowerCase().replace(/[^a-z0-9]/g, '-') : c.role
    colorsObject[key] = {
      DEFAULT: c.hex,
      ...c.shades,
    }
  })

  return `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx,html}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: ${JSON.stringify(colorsObject, null, 8).replace(/"/g, "'")},
      fontFamily: {
        display: ['"${options.displayFont}"', 'sans-serif'],
        sans: ['"${options.bodyFont}"', 'sans-serif'],
        mono: ['"${options.monoFont}"', 'monospace'],
      },
    },
  },
  plugins: [],
};
`
}

/**
 * Generate W3C Design Tokens JSON
 */
export function generateTokensJson(options: ZipExportOptions): string {
  const colorTokens: Record<string, any> = {}

  options.colors.forEach((c) => {
    const tokenKey = c.role === 'custom' ? c.name.toLowerCase().replace(/[^a-z0-9]/g, '-') : c.role
    colorTokens[tokenKey] = {
      value: c.hex,
      type: 'color',
      description: `${c.name} (${c.role})`,
      attributes: {
        rgb: `rgb(${c.rgb.r}, ${c.rgb.g}, ${c.rgb.b})`,
        cmyk: `cmyk(${c.cmyk.c}%, ${c.cmyk.m}%, ${c.cmyk.y}%, ${c.cmyk.k}%)`,
        hsl: `hsl(${c.hsl.h}, ${c.hsl.s}%, ${c.hsl.l}%)`,
      },
      shades: Object.entries(c.shades).reduce((acc, [step, val]) => {
        acc[step] = { value: val, type: 'color' }
        return acc
      }, {} as Record<string, any>),
    }
  })

  const tokens = {
    $schema: 'https://design-tokens.github.io/community-group/format/',
    name: `${options.brandName} Design Tokens`,
    color: colorTokens,
    typography: {
      fontFamily: {
        display: { value: options.displayFont, type: 'fontFamily' },
        body: { value: options.bodyFont, type: 'fontFamily' },
        mono: { value: options.monoFont, type: 'fontFamily' },
      },
      baseSize: { value: `${options.baseFontSize}px`, type: 'dimension' },
      scaleRatio: { value: options.typeScaleRatio, type: 'number' },
    },
  }

  return JSON.stringify(tokens, null, 2)
}

/**
 * Generate CSS Custom Properties (:root)
 */
export function generateCssTokens(options: ZipExportOptions): string {
  const lines = [':root {']

  options.colors.forEach((c) => {
    const prefix = `--color-${c.role === 'custom' ? c.name.toLowerCase().replace(/[^a-z0-9]/g, '-') : c.role}`
    lines.push(`  ${prefix}: ${c.hex};`)
    lines.push(`  ${prefix}-rgb: ${c.rgb.r}, ${c.rgb.g}, ${c.rgb.b};`)
    Object.entries(c.shades).forEach(([step, hexVal]) => {
      lines.push(`  ${prefix}-${step}: ${hexVal};`)
    })
  })

  lines.push(`  --font-display: '${options.displayFont}', sans-serif;`)
  lines.push(`  --font-body: '${options.bodyFont}', sans-serif;`)
  lines.push(`  --font-mono: '${options.monoFont}', monospace;`)
  lines.push('}')

  return lines.join('\n')
}

/**
 * Generate Brand Guidelines Markdown Document
 */
export function generateGuidelinesMarkdown(options: ZipExportOptions): string {
  return `# ${options.brandName} - Brand Guidelines & Identity Spec

> ${options.tagline || 'Crafting the future with precision.'}

---

## 1. Brand Strategy
- **Mission:** ${options.mission || 'To empower and inspire through excellence.'}
- **Vision:** ${options.vision || 'To lead the industry in quality, accessibility, and modern design.'}
- **Core Values:** ${options.coreValues?.length ? options.coreValues.join(', ') : 'Excellence, Innovation, Integrity, Craftsmanship'}

---

## 2. Color System
| Role | Name | HEX | RGB | CMYK | HSL |
| :--- | :--- | :--- | :--- | :--- | :--- |
${options.colors
  .map(
    (c) =>
      `| **${c.role}** | ${c.name} | \`${c.hex}\` | rgb(${c.rgb.r}, ${c.rgb.g}, ${c.rgb.b}) | cmyk(${c.cmyk.c}%, ${c.cmyk.m}%, ${c.cmyk.y}%, ${c.cmyk.k}%) | hsl(${c.hsl.h}, ${c.hsl.s}%, ${c.hsl.l}%) |`
  )
  .join('\n')}

---

## 3. Typography System
- **Display / Heading Font:** ${options.displayFont}
- **Body / Interface Font:** ${options.bodyFont}
- **Monospace / Code Font:** ${options.monoFont}
- **Base Font Size:** ${options.baseFontSize}px
- **Modular Scale Ratio:** ${options.typeScaleRatio}

---

Generated by **Brandio Brand Studio Engine** on ${new Date().toLocaleDateString()}.
`
}

/**
 * Build and download complete 1-Click ZIP Brand Package
 */
export async function buildAndDownloadZip(options: ZipExportOptions): Promise<void> {
  const zip = new JSZip()
  const slug = options.brandName.toLowerCase().replace(/[^a-z0-9]+/g, '-')

  // 1. /tokens/ folder
  const tokensFolder = zip.folder('tokens')
  if (tokensFolder) {
    tokensFolder.file('tailwind.config.js', generateTailwindConfig(options))
    tokensFolder.file('tokens.json', generateTokensJson(options))
    tokensFolder.file('colors.css', generateCssTokens(options))
  }

  // 2. /brand-guide/ folder
  const guideFolder = zip.folder('brand-guide')
  if (guideFolder) {
    guideFolder.file('README.md', generateGuidelinesMarkdown(options))
  }

  // 3. /logos/ and /favicons/
  const logosFolder = zip.folder('logos')
  const faviconsFolder = zip.folder('favicons')

  const imageSource = options.svgContent
    ? `data:image/svg+xml;utf8,${encodeURIComponent(options.svgContent)}`
    : options.rasterDataUri

  if (logosFolder && imageSource) {
    if (options.isVector && options.svgContent) {
      logosFolder.file(`${slug}-logo-master.svg`, options.svgContent)
      if (faviconsFolder) {
        faviconsFolder.file('favicon.svg', options.svgContent)
      }
    }

    // Generate high-res raster fallbacks (1x, 2x, 4x)
    const blob1x = await renderToPngBlob(imageSource, 512, 512)
    if (blob1x) logosFolder.file(`${slug}-logo-512x512.png`, blob1x)

    const blob1024 = await renderToPngBlob(imageSource, 1024, 1024)
    if (blob1024) logosFolder.file(`${slug}-logo-1024x1024.png`, blob1024)

    // Generate favicons (16, 32, 180 Apple Touch Icon)
    if (faviconsFolder) {
      const fav16 = await renderToPngBlob(imageSource, 16, 16)
      if (fav16) faviconsFolder.file('favicon-16x16.png', fav16)

      const fav32 = await renderToPngBlob(imageSource, 32, 32)
      if (fav32) faviconsFolder.file('favicon-32x32.png', fav32)

      const appleTouch = await renderToPngBlob(imageSource, 180, 180)
      if (appleTouch) faviconsFolder.file('apple-touch-icon.png', appleTouch)

      faviconsFolder.file(
        'site.webmanifest',
        JSON.stringify(
          {
            name: options.brandName,
            short_name: options.brandName,
            icons: [
              { src: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
              { src: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
              { src: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
            ],
            theme_color: options.colors[0]?.hex || '#000000',
            background_color: '#ffffff',
            display: 'standalone',
          },
          null,
          2
        )
      )
    }
  }

  // Generate and trigger download
  const content = await zip.generateAsync({ type: 'blob' })
  saveAs(content, `${slug}-brand-kit.zip`)
}
