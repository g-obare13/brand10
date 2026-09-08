/**
 * @file seo.ts
 * @description Centralized SEO configurations, site metadata, Open Graph presets,
 * and canonical URL definitions for Brand10.
 */

/**
 * Canonical production website URL for Brand10.
 */
export const SITE_URL = "https://brand10.vercel.app"

/**
 * Primary platform brand display name.
 */
export const SITE_NAME = "Brand10"

/**
 * Standard Open Graph and Twitter Card social preview image (1200x630).
 */
export const DEFAULT_OG_IMAGE = `${SITE_URL}/SEO.png`

/**
 * Open Graph image pixel width.
 */
export const DEFAULT_OG_IMAGE_WIDTH = "1200"

/**
 * Open Graph image pixel height.
 */
export const DEFAULT_OG_IMAGE_HEIGHT = "630"

/**
 * Open Graph image MIME type.
 */
export const DEFAULT_OG_IMAGE_TYPE = "image/png"

/**
 * Default accessibility alternative text for the primary social preview image.
 */
export const DEFAULT_OG_IMAGE_ALT =
  "Brand10 - Modern Brand Identity Studio & Living Design Systems"
