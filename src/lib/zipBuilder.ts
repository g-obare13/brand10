import JSZip from "jszip"
import fileSaver from "file-saver"
import type { ColorSwatch } from "./colorUtils"

const saveAs = fileSaver.saveAs

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
  secondarySvgContent?: string
  secondaryRasterDataUri?: string
}

/**
 * Extract intrinsic SVG width, height, or viewBox dimensions
 */
export function getSvgIntrinsicDimensions(
  svgString: string
): { width: number; height: number } | null {
  try {
    const parser = new DOMParser()
    const doc = parser.parseFromString(svgString, "image/svg+xml")
    const svgEl = doc.querySelector("svg")
    if (!svgEl) return null

    const widthAttr = parseFloat(svgEl.getAttribute("width") || "")
    const heightAttr = parseFloat(svgEl.getAttribute("height") || "")
    if (widthAttr > 0 && heightAttr > 0) {
      return { width: widthAttr, height: heightAttr }
    }

    const viewBox = svgEl.getAttribute("viewBox")
    if (viewBox) {
      const parts = viewBox.trim().split(/[\s,]+/).map(Number)
      if (parts.length === 4 && parts[2] > 0 && parts[3] > 0) {
        return { width: parts[2], height: parts[3] }
      }
    }
  } catch {}
  return null
}

interface RenderOptions {
  /**
   * "native": Scales image to fit within target bounds while matching its exact aspect ratio (no letterbox padding).
   * "contain": Retains exact target canvas dimensions (e.g. 1:1 square for favicons/icons) and proportionally centers the image with safe padding.
   */
  fit?: "contain" | "native"
  /** Safe padding ratio (e.g. 0.08 = 8% padding) */
  paddingPercent?: number
  intrinsicWidth?: number
  intrinsicHeight?: number
}

/**
 * Render an image/svg into a canvas and export as PNG Blob with strict aspect-ratio preservation
 */
async function renderToPngBlob(
  sourceUri: string,
  targetWidth: number,
  targetHeight: number,
  options: RenderOptions = {}
): Promise<Blob | null> {
  const {
    fit = "contain",
    paddingPercent = 0,
    intrinsicWidth,
    intrinsicHeight,
  } = options

  return new Promise((resolve) => {
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = () => {
      let naturalW =
        intrinsicWidth || img.naturalWidth || img.width || targetWidth
      let naturalH =
        intrinsicHeight || img.naturalHeight || img.height || targetHeight

      if (naturalW <= 0 || naturalH <= 0) {
        naturalW = targetWidth
        naturalH = targetHeight
      }

      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")
      if (!ctx) return resolve(null)

      if (fit === "native") {
        const aspect = naturalW / naturalH
        let finalW = targetWidth
        let finalH = Math.round(targetWidth / aspect)

        if (finalH > targetHeight) {
          finalH = targetHeight
          finalW = Math.round(targetHeight * aspect)
        }

        canvas.width = Math.max(1, finalW)
        canvas.height = Math.max(1, finalH)

        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.imageSmoothingEnabled = true
        ctx.imageSmoothingQuality = "high"
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      } else {
        canvas.width = targetWidth
        canvas.height = targetHeight

        const pad = Math.round(
          paddingPercent * Math.min(targetWidth, targetHeight)
        )
        const availW = Math.max(1, targetWidth - pad * 2)
        const availH = Math.max(1, targetHeight - pad * 2)

        const aspect = naturalW / naturalH
        const targetAspect = availW / availH

        let drawW: number
        let drawH: number

        if (aspect > targetAspect) {
          drawW = availW
          drawH = Math.round(availW / aspect)
        } else {
          drawH = availH
          drawW = Math.round(availH * aspect)
        }

        const offsetX = Math.round((targetWidth - drawW) / 2)
        const offsetY = Math.round((targetHeight - drawH) / 2)

        ctx.clearRect(0, 0, targetWidth, targetHeight)
        ctx.imageSmoothingEnabled = true
        ctx.imageSmoothingQuality = "high"
        ctx.drawImage(img, offsetX, offsetY, drawW, drawH)
      }

      canvas.toBlob((blob) => resolve(blob), "image/png")
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
    const key =
      c.role === "custom"
        ? c.name.toLowerCase().replace(/[^a-z0-9]/g, "-")
        : c.role
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
    const tokenKey =
      c.role === "custom"
        ? c.name.toLowerCase().replace(/[^a-z0-9]/g, "-")
        : c.role
    colorTokens[tokenKey] = {
      value: c.hex,
      type: "color",
      description: `${c.name} (${c.role})`,
      attributes: {
        rgb: `rgb(${c.rgb.r}, ${c.rgb.g}, ${c.rgb.b})`,
        cmyk: `cmyk(${c.cmyk.c}%, ${c.cmyk.m}%, ${c.cmyk.y}%, ${c.cmyk.k}%)`,
        hsl: `hsl(${c.hsl.h}, ${c.hsl.s}%, ${c.hsl.l}%)`,
      },
      shades: Object.entries(c.shades).reduce(
        (acc, [step, val]) => {
          acc[step] = { value: val, type: "color" }
          return acc
        },
        {} as Record<string, any>
      ),
    }
  })

  const tokens = {
    $schema: "https://design-tokens.github.io/community-group/format/",
    name: `${options.brandName} Design Tokens`,
    color: colorTokens,
    typography: {
      fontFamily: {
        display: { value: options.displayFont, type: "fontFamily" },
        body: { value: options.bodyFont, type: "fontFamily" },
        mono: { value: options.monoFont, type: "fontFamily" },
      },
      baseSize: { value: `${options.baseFontSize}px`, type: "dimension" },
      scaleRatio: { value: options.typeScaleRatio, type: "number" },
    },
  }

  return JSON.stringify(tokens, null, 2)
}

/**
 * Generate CSS Custom Properties (:root)
 */
export function generateCssTokens(options: ZipExportOptions): string {
  const lines = [":root {"]

  options.colors.forEach((c) => {
    const prefix = `--color-${c.role === "custom" ? c.name.toLowerCase().replace(/[^a-z0-9]/g, "-") : c.role}`
    lines.push(`  ${prefix}: ${c.hex};`)
    lines.push(`  ${prefix}-rgb: ${c.rgb.r}, ${c.rgb.g}, ${c.rgb.b};`)
    Object.entries(c.shades).forEach(([step, hexVal]) => {
      lines.push(`  ${prefix}-${step}: ${hexVal};`)
    })
  })

  lines.push(`  --font-display: '${options.displayFont}', sans-serif;`)
  lines.push(`  --font-body: '${options.bodyFont}', sans-serif;`)
  lines.push(`  --font-mono: '${options.monoFont}', monospace;`)
  lines.push("}")

  return lines.join("\n")
}

/**
 * Generate Brand Guidelines Markdown Document
 */
export function generateGuidelinesMarkdown(options: ZipExportOptions): string {
  return `# ${options.brandName} - Brand Guidelines & Identity Spec

> ${options.tagline || "Crafting the future with precision."}

---

## 1. Brand Strategy
- **Mission:** ${options.mission || "To empower and inspire through excellence."}
- **Vision:** ${options.vision || "To lead the industry in quality, accessibility, and modern design."}
- **Core Values:** ${options.coreValues.length ? options.coreValues.join(", ") : "Excellence, Innovation, Integrity, Craftsmanship"}

---

## 2. Color System
| Role | Name | HEX | RGB | CMYK | HSL |
| :--- | :--- | :--- | :--- | :--- | :--- |
${options.colors
  .map(
    (c) =>
      `| **${c.role}** | ${c.name} | \`${c.hex}\` | rgb(${c.rgb.r}, ${c.rgb.g}, ${c.rgb.b}) | cmyk(${c.cmyk.c}%, ${c.cmyk.m}%, ${c.cmyk.y}%, ${c.cmyk.k}%) | hsl(${c.hsl.h}, ${c.hsl.s}%, ${c.hsl.l}%) |`
  )
  .join("\n")}

---

## 3. Typography System
- **Display / Heading Font:** ${options.displayFont}
- **Body / Interface Font:** ${options.bodyFont}
- **Monospace / Code Font:** ${options.monoFont}
- **Base Font Size:** ${options.baseFontSize}px
- **Modular Scale Ratio:** ${options.typeScaleRatio}

---

Generated by **Brand10 Brand Studio Engine** on ${new Date().toLocaleDateString()}.
`
}

/**
 * Build and download complete 1-Click ZIP Brand Package
 */
export async function buildAndDownloadZip(
  options: ZipExportOptions
): Promise<void> {
  const zip = new JSZip()
  const slug = options.brandName.toLowerCase().replace(/[^a-z0-9]+/g, "-")

  // 1. /tokens/ folder
  const tokensFolder = zip.folder("tokens")
  if (tokensFolder) {
    tokensFolder.file("tailwind.config.js", generateTailwindConfig(options))
    tokensFolder.file("tokens.json", generateTokensJson(options))
    tokensFolder.file("colors.css", generateCssTokens(options))
  }

  // 2. /brand-guide/ folder
  const guideFolder = zip.folder("brand-guide")
  if (guideFolder) {
    guideFolder.file("README.md", generateGuidelinesMarkdown(options))
  }

  // 3. /logos/ and /favicons/
  const logosFolder = zip.folder("logos")
  const faviconsFolder = zip.folder("favicons")

  const imageSource = options.svgContent
    ? `data:image/svg+xml;utf8,${encodeURIComponent(options.svgContent)}`
    : options.rasterDataUri

  const intrinsicDims = options.svgContent
    ? getSvgIntrinsicDimensions(options.svgContent)
    : null
  const intrinsicWidth = intrinsicDims?.width
  const intrinsicHeight = intrinsicDims?.height

  if (logosFolder && imageSource) {
    if (options.isVector && options.svgContent) {
      logosFolder.file(`${slug}-logo-master.svg`, options.svgContent)
    }

    // 1. High-resolution raster fallbacks at natural aspect ratio (no letterbox, no distortion)
    const blobNative = await renderToPngBlob(imageSource, 1600, 1600, {
      fit: "native",
      intrinsicWidth,
      intrinsicHeight,
    })
    if (blobNative) {
      logosFolder.file(`${slug}-logo-primary.png`, blobNative)
    }

    const blobNative2x = await renderToPngBlob(imageSource, 3200, 3200, {
      fit: "native",
      intrinsicWidth,
      intrinsicHeight,
    })
    if (blobNative2x) {
      logosFolder.file(`${slug}-logo-primary-2x.png`, blobNative2x)
    }

    // 2. Square container variants (512x512 and 1024x1024) with proportional contain and safe breathing room
    const blob512 = await renderToPngBlob(imageSource, 512, 512, {
      fit: "contain",
      paddingPercent: 0.08,
      intrinsicWidth,
      intrinsicHeight,
    })
    if (blob512) {
      logosFolder.file(`${slug}-logo-square-512x512.png`, blob512)
    }

    const blob1024 = await renderToPngBlob(imageSource, 1024, 1024, {
      fit: "contain",
      paddingPercent: 0.08,
      intrinsicWidth,
      intrinsicHeight,
    })
    if (blob1024) {
      logosFolder.file(`${slug}-logo-square-1024x1024.png`, blob1024)
    }

    // 3. Secondary mark or icon lockup if available
    const secondarySource = options.secondarySvgContent
      ? `data:image/svg+xml;utf8,${encodeURIComponent(options.secondarySvgContent)}`
      : options.secondaryRasterDataUri

    const secDims = options.secondarySvgContent
      ? getSvgIntrinsicDimensions(options.secondarySvgContent)
      : null

    if (secondarySource) {
      if (options.secondarySvgContent) {
        logosFolder.file(`${slug}-mark-master.svg`, options.secondarySvgContent)
      }

      const secBlobNative = await renderToPngBlob(secondarySource, 1200, 1200, {
        fit: "native",
        intrinsicWidth: secDims?.width,
        intrinsicHeight: secDims?.height,
      })
      if (secBlobNative) {
        logosFolder.file(`${slug}-mark-primary.png`, secBlobNative)
      }

      const secBlob512 = await renderToPngBlob(secondarySource, 512, 512, {
        fit: "contain",
        paddingPercent: 0.08,
        intrinsicWidth: secDims?.width,
        intrinsicHeight: secDims?.height,
      })
      if (secBlob512) {
        logosFolder.file(`${slug}-mark-square-512x512.png`, secBlob512)
      }
    }

    // 4. Favicon generation (uses secondary mark if present for high optical clarity, else primary)
    if (faviconsFolder) {
      const favSource = secondarySource || imageSource
      const favDims = secondarySource ? secDims : intrinsicDims

      if (options.isVector) {
        const favSvgContent = options.secondarySvgContent || options.svgContent
        if (favSvgContent) {
          faviconsFolder.file("favicon.svg", favSvgContent)
        }
      }

      const fav16 = await renderToPngBlob(favSource, 16, 16, {
        fit: "contain",
        paddingPercent: 0.06,
        intrinsicWidth: favDims?.width,
        intrinsicHeight: favDims?.height,
      })
      if (fav16) faviconsFolder.file("favicon-16x16.png", fav16)

      const fav32 = await renderToPngBlob(favSource, 32, 32, {
        fit: "contain",
        paddingPercent: 0.06,
        intrinsicWidth: favDims?.width,
        intrinsicHeight: favDims?.height,
      })
      if (fav32) faviconsFolder.file("favicon-32x32.png", fav32)

      const appleTouch = await renderToPngBlob(favSource, 180, 180, {
        fit: "contain",
        paddingPercent: 0.08,
        intrinsicWidth: favDims?.width,
        intrinsicHeight: favDims?.height,
      })
      if (appleTouch) faviconsFolder.file("apple-touch-icon.png", appleTouch)

      faviconsFolder.file(
        "site.webmanifest",
        JSON.stringify(
          {
            name: options.brandName,
            short_name: options.brandName,
            icons: [
              { src: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
              { src: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
              {
                src: "/apple-touch-icon.png",
                sizes: "180x180",
                type: "image/png",
              },
            ],
            theme_color: options.colors[0]?.hex || "#000000",
            background_color: "#ffffff",
            display: "standalone",
          },
          null,
          2
        )
      )
    }
  }

  // Generate and trigger download
  const content = await zip.generateAsync({ type: "blob" })
  saveAs(content, `${slug}-brand-kit.zip`)
}
