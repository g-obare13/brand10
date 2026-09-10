/**
 * @file seo.ts
 * @description Centralized SEO configurations, site metadata, Open Graph presets,
 * canonical URL definitions, and metadata tag builders for Brand10.
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
 * Official platform Twitter / X creator handle.
 */
export const TWITTER_HANDLE = "@Black_Gr00t"

/**
 * Standard Open Graph and Twitter Card social preview image (1200x630 JPEG, ~60KB optimized for WhatsApp/Twitter).
 */
export const DEFAULT_OG_IMAGE = `${SITE_URL}/SEO.jpg`

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
export const DEFAULT_OG_IMAGE_TYPE = "image/jpeg"

/**
 * Default accessibility alternative text for the primary social preview image.
 */
export const DEFAULT_OG_IMAGE_ALT =
  "Brand10 - Modern Brand Identity Studio & Living Design Systems"

/**
 * Default SEO description.
 */
export const DEFAULT_SEO_DESCRIPTION =
  "Transform brand assets into living design systems. Real-time token synchronization, responsive typography calculators, SVG palette clustering, and exportable PDF decks."

/**
 * Default SEO keywords.
 */
export const DEFAULT_SEO_KEYWORDS =
  "brand identity, design system, brand guidelines, typography scale, color palette generator, brand kit, SVG logo, Brand10"

/**
 * Configuration options for generating standardized SEO and social graph metadata tags.
 */
export interface SeoMetaOptions {
  /** Page title for title tag, og:title, and twitter:title */
  title?: string
  /** Page description for description meta, og:description, and twitter:description */
  description?: string
  /** Targeted search keywords */
  keywords?: string
  /** Canonical page URL */
  url?: string
  /** Absolute URL to the social share preview image */
  image?: string
  /** Alternative text for screen readers on social preview cards */
  imageAlt?: string
  /** Image width in pixels */
  imageWidth?: string
  /** Image height in pixels */
  imageHeight?: string
  /** MIME type of the preview image (e.g. image/jpeg, image/png) */
  imageType?: string
  /** Open Graph resource type */
  type?: "website" | "article"
  /** Twitter card display layout */
  twitterCard?: "summary" | "summary_large_image"
  /** Whether to inject charSet and viewport meta (used by root document) */
  includeCharsetViewport?: boolean
}

/**
 * Tag descriptor interface conforming to TanStack Router head meta specification.
 */
export interface MetaTagDescriptor {
  charSet?: string
  name?: string
  property?: string
  content?: string
  title?: string
}

/**
 * Constructs a fully compliant, ordered array of meta tags for Open Graph, Twitter Cards,
 * and search engines. Ensures strict og:image child property association and universal
 * compatibility across WhatsApp, Twitter, Facebook, and LinkedIn.
 *
 * @param {SeoMetaOptions} [options] - Custom metadata overrides for the route.
 * @returns {MetaTagDescriptor[]} Standardized meta tag collection.
 */
export function buildSeoMeta(
  options: SeoMetaOptions = {}
): MetaTagDescriptor[] {
  const title =
    options.title ??
    `${SITE_NAME} - Modern Brand Identity Studio & Living Design Systems`
  const description = options.description ?? DEFAULT_SEO_DESCRIPTION
  const keywords = options.keywords ?? DEFAULT_SEO_KEYWORDS
  const url = options.url ?? SITE_URL
  const image = options.image ?? DEFAULT_OG_IMAGE
  const imageAlt = options.imageAlt ?? DEFAULT_OG_IMAGE_ALT
  const imageWidth = options.imageWidth ?? DEFAULT_OG_IMAGE_WIDTH
  const imageHeight = options.imageHeight ?? DEFAULT_OG_IMAGE_HEIGHT
  const imageType = options.imageType ?? DEFAULT_OG_IMAGE_TYPE
  const type = options.type ?? "website"
  const twitterCard = options.twitterCard ?? "summary_large_image"

  const meta: MetaTagDescriptor[] = []

  if (options.includeCharsetViewport) {
    meta.push(
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" }
    )
  }

  meta.push(
    { title },
    { name: "description", content: description },
    { name: "keywords", content: keywords },
    { name: "author", content: SITE_NAME },
    { name: "theme-color", content: "#090d16" },

    // Open Graph protocol (WhatsApp, Facebook, LinkedIn, Discord)
    { property: "og:type", content: type },
    { property: "og:site_name", content: SITE_NAME },
    { property: "og:url", content: url },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    // og:image must be declared before its structured properties (width, height, type, alt)
    { property: "og:image", content: image },
    { property: "og:image:secure_url", content: image },
    { property: "og:image:type", content: imageType },
    { property: "og:image:width", content: imageWidth },
    { property: "og:image:height", content: imageHeight },
    { property: "og:image:alt", content: imageAlt },

    // Twitter Card (X)
    { name: "twitter:card", content: twitterCard },
    { name: "twitter:site", content: TWITTER_HANDLE },
    { name: "twitter:creator", content: TWITTER_HANDLE },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: image },
    { name: "twitter:image:alt", content: imageAlt }
  )

  return meta
}

/**
 * Configuration options for link tags.
 */
export interface SeoLinkOptions {
  /** Canonical route URL */
  canonicalUrl?: string
  /** Fallback image URL for scrapers reading <link rel="image_src"> */
  imageUrl?: string
}

/**
 * Generates canonical and WhatsApp/legacy image_src link tags for social crawler fallbacks.
 *
 * @param {SeoLinkOptions} [options] - Link configuration options.
 * @returns {Array<{ rel: string; href: string }>} Standardized link descriptors.
 */
export function buildSeoLinks(options: SeoLinkOptions = {}) {
  const canonicalUrl = options.canonicalUrl ?? SITE_URL
  const imageUrl = options.imageUrl ?? DEFAULT_OG_IMAGE

  return [
    {
      rel: "canonical",
      href: canonicalUrl,
    },
    {
      rel: "image_src",
      href: imageUrl,
    },
  ]
}
