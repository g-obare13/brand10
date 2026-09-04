export interface DesignMovement {
  id: string
  label: string
  badge: string
  vibe: string
  bestFor: string
  description: string
  tagline: string
  image: string
  tones: {
    formal: number
    playful: number
    minimalist: number
    bold: number
  }
}

export const DESIGN_MOVEMENTS: DesignMovement[] = [
  {
    id: "quiet-precision",
    label: "Quiet Precision",
    badge: "Clarity",
    vibe: "Clean, disciplined, and systematically structured.",
    bestFor: "Enterprise SaaS, modern dashboards, and high-performance digital tools.",
    description:
      "Stripped of unnecessary ornamentation, Quiet Precision relies on mathematical grid alignment, crisp typography, and generous negative space to cultivate effortless cognitive focus.",
    tagline:
      "Intentional whitespace, structured grids, and uncompromising clarity.",
    image: "/showcases/semi-flat.avif",
    tones: { formal: 75, playful: 20, minimalist: 90, bold: 50 },
  },
  {
    id: "expressive-energy",
    label: "Expressive Energy",
    badge: "Dynamic",
    vibe: "Bold, vibrant, and unapologetically confident.",
    bestFor:
      "Creative software, forward-thinking fintech, and culture-shaping brands.",
    description:
      "Harnesses high-contrast boundaries, saturated chromatic accents, and kinetic typographic scale to make an indelible brand statement that commands user attention.",
    tagline:
      "High-voltage contrast, saturated palettes, and kinetic presence.",
    image: "/showcases/maximalism.avif",
    tones: { formal: 15, playful: 90, minimalist: 20, bold: 95 },
  },
  {
    id: "soft-tactility",
    label: "Soft Tactility",
    badge: "Physical",
    vibe: "Organic, ambient, and gently dimensional.",
    bestFor:
      "Hardware companions, wellness platforms, and spatial interface concepts.",
    description:
      "Merges digital minimalism with soft physical affordance. Components emerge naturally from the background canvas with dual inner and outer ambient shadows that mimic smooth physical extrusion.",
    tagline:
      "Molded surfaces, soft ambient shadows, and organic physical depth.",
    image: "/showcases/neumorphism.avif",
    tones: { formal: 50, playful: 40, minimalist: 80, bold: 45 },
  },
  {
    id: "editorial-character",
    label: "Editorial Character",
    badge: "Curated",
    vibe: "Sophisticated, cultured, and thoughtfully literary.",
    bestFor:
      "Luxury publications, creative studios, and narrative-driven commerce.",
    description:
      "Translates the timeless restraint of high-end editorial print into digital space, pairing expressive serif-led typography with delicate hairline rules and generous, literary composition.",
    tagline:
      "Publication poise, refined typography, and narrative sophistication.",
    image: "/showcases/minimalist.jpg",
    tones: { formal: 85, playful: 15, minimalist: 85, bold: 40 },
  },
]

export interface ImageryMoodOption {
  id: "minimal" | "cinematic" | "vibrant" | "editorial"
  title: string
  desc: string
  badge: string
}

export const IMAGERY_MOOD_OPTIONS: readonly ImageryMoodOption[] = [
  {
    id: "minimal",
    title: "Studio Minimal",
    desc: "Clean soft shadows, high-key ambient light, pure neutral backdrops.",
    badge: "Modern Clean",
  },
  {
    id: "cinematic",
    title: "Moody & Cinematic",
    desc: "Dramatic high contrast, directional rim lighting, deep obsidian blacks.",
    badge: "High Contrast",
  },
  {
    id: "vibrant",
    title: "Vibrant & 3D Glass",
    desc: "Translucent frosted glass, chromatic gradients, dynamic perspectives.",
    badge: "Playful Tech",
  },
  {
    id: "editorial",
    title: "Editorial & Candid",
    desc: "Authentic human moments, natural sunlight, warm tactile grain.",
    badge: "Human Story",
  },
] as const

export interface ImageryBentoArticle {
  title: string
  tag: string
  image: string
}

export interface ImageryBentoCardData {
  // Card 1: Top Left - App / Workflow feature card with inner photo preview
  heroFeature: {
    title: string
    subtitle: string
    image: string
    badge: string
  }
  // Card 2: Top Right - Dynamic punchy statement card with frosted pill / overlay
  scaleCard: {
    headline: string
    highlight: string
    image: string
    tag: string
  }
  // Card 3: Middle Left - Editorial / Article list card with 3 visual rows
  articleList: {
    header: string
    items: ImageryBentoArticle[]
  }
  // Card 4: Middle Right - High impact portrait campaign card with glowing gradient overlay
  campaignCard: {
    headline: string
    subheadline: string
    image: string
    accentLabel: string
  }
  // Card 5: Bottom Full Width - Horizon panoramic banner showcase
  panoramicBanner: {
    title: string
    caption: string
    image: string
    meta: string
  }
}

export const IMAGERY_MOOD_IMAGE_ARRAYS: Record<
  "minimal" | "cinematic" | "vibrant" | "editorial",
  string[]
> = {
  minimal: [
    "https://images.unsplash.com/photo-1633849790922-3c9406b0f7cf?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1623872246644-ae088daf3874?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1708493667176-d7c567b78f59?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1566350299168-56563182725f?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1633145114292-9399e99c5f01?auto=format&fit=crop&w=800&q=80",
  ],
  cinematic: [
    "https://images.unsplash.com/photo-1781239000580-e5e0110bed0d?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1698342399831-40d94d2c8890?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1600048836390-2cfdf8d4f15a?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1732914903654-7860818cca48?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1587837354461-e54af5adabbd?auto=format&fit=crop&w=800&q=80",
  ],
  vibrant: [
    "https://images.unsplash.com/photo-1775305234761-ffb5c9033dbd?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1688964444999-3177551bf188?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1656188690096-0e63dfcd3ee9?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1775305234763-5283c5638982?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1652318429483-cfcd2f6ee25c?auto=format&fit=crop&w=800&q=80",
  ],
  editorial: [
    "https://images.unsplash.com/photo-1779733811202-92c765b1d33d?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1752213071488-d6417eb6a291?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1779733811189-e1c31fdcd505?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1770664068221-2832d62e3222?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1779733811134-e53d4a43c60a?auto=format&fit=crop&w=800&q=80",
  ],
}

export const IMAGERY_BENTO_SHOWCASES: Record<
  "minimal" | "cinematic" | "vibrant" | "editorial",
  ImageryBentoCardData
> = {
  minimal: {
    heroFeature: {
      title: "Streamlined Workflows",
      subtitle: "Effortless team alignment captured in high-key, ambient daylight.",
      image: IMAGERY_MOOD_IMAGE_ARRAYS.minimal[0],
      badge: "Pure Clarity",
    },
    scaleCard: {
      headline: "Craft intentional design",
      highlight: "without friction.",
      image: IMAGERY_MOOD_IMAGE_ARRAYS.minimal[1],
      tag: "Minimal Studio",
    },
    articleList: {
      header: "Design Dispatch",
      items: [
        {
          title: "The Art of Restraint in Modern Systems",
          tag: "Architecture",
          image: IMAGERY_MOOD_IMAGE_ARRAYS.minimal[2],
        },
        {
          title: "Balancing Negative Space and Typography",
          tag: "Editorial",
          image: IMAGERY_MOOD_IMAGE_ARRAYS.minimal[3],
        },
        {
          title: "Designing for Focus and Cognitive Calm",
          tag: "Product",
          image: IMAGERY_MOOD_IMAGE_ARRAYS.minimal[4],
        },
      ],
    },
    campaignCard: {
      headline: "Elevate your perspective",
      subheadline: "with serene simplicity.",
      image: IMAGERY_MOOD_IMAGE_ARRAYS.minimal[4],
      accentLabel: "Natural Radiance",
    },
    panoramicBanner: {
      title: "Purity of Architecture & Form",
      caption: "Neutral negative space, high-key ambient light, and structural minimalism.",
      image: IMAGERY_MOOD_IMAGE_ARRAYS.minimal[0],
      meta: "Studio Minimal",
    },
  },

  cinematic: {
    heroFeature: {
      title: "Precision Telemetry",
      subtitle: "Directional rim illumination and deep obsidian black accents.",
      image: IMAGERY_MOOD_IMAGE_ARRAYS.cinematic[0],
      badge: "Deep Noir",
    },
    scaleCard: {
      headline: "Master the dark",
      highlight: "with sculpted light.",
      image: IMAGERY_MOOD_IMAGE_ARRAYS.cinematic[1],
      tag: "Chiaroscuro",
    },
    articleList: {
      header: "Shadow & Edge",
      items: [
        {
          title: "Directional Lighting for High-End Hardware",
          tag: "Optics",
          image: IMAGERY_MOOD_IMAGE_ARRAYS.cinematic[2],
        },
        {
          title: "Visual Drama: Crafting Moody Hero Scenes",
          tag: "Cinematography",
          image: IMAGERY_MOOD_IMAGE_ARRAYS.cinematic[3],
        },
        {
          title: "High Contrast Ratios in Modern Interfaces",
          tag: "UI Science",
          image: IMAGERY_MOOD_IMAGE_ARRAYS.cinematic[4],
        },
      ],
    },
    campaignCard: {
      headline: "Command the room",
      subheadline: "with unapologetic presence.",
      image: IMAGERY_MOOD_IMAGE_ARRAYS.cinematic[4],
      accentLabel: "Rim Spotlight",
    },
    panoramicBanner: {
      title: "Midnight Horizon & Form",
      caption: "High-contrast rim lighting piercing dense atmospheric shadows.",
      image: IMAGERY_MOOD_IMAGE_ARRAYS.cinematic[0],
      meta: "Moody & Cinematic",
    },
  },

  vibrant: {
    heroFeature: {
      title: "Playful Dimensions",
      subtitle: "Translucent frosted glass and radiant prismatic reflections.",
      image: IMAGERY_MOOD_IMAGE_ARRAYS.vibrant[0],
      badge: "Chromatic Flow",
    },
    scaleCard: {
      headline: "Refract bold energy",
      highlight: "into every interaction.",
      image: IMAGERY_MOOD_IMAGE_ARRAYS.vibrant[1],
      tag: "Prism Lab",
    },
    articleList: {
      header: "Color & Dimension",
      items: [
        {
          title: "Designing Multi-Layered Glass Interfaces",
          tag: "WebGL",
          image: IMAGERY_MOOD_IMAGE_ARRAYS.vibrant[2],
        },
        {
          title: "Vibrant Color Ramps That Command Attention",
          tag: "Branding",
          image: IMAGERY_MOOD_IMAGE_ARRAYS.vibrant[3],
        },
        {
          title: "Dynamic Light Physics in Modern Product UI",
          tag: "Motion",
          image: IMAGERY_MOOD_IMAGE_ARRAYS.vibrant[4],
        },
      ],
    },
    campaignCard: {
      headline: "Ignite creativity",
      subheadline: "with vivid expression.",
      image: IMAGERY_MOOD_IMAGE_ARRAYS.vibrant[4],
      accentLabel: "Chromatic Wash",
    },
    panoramicBanner: {
      title: "Prismatic Spectrum in Motion",
      caption: "Vivid multi-angle refraction through frosted sculptural glass.",
      image: IMAGERY_MOOD_IMAGE_ARRAYS.vibrant[0],
      meta: "Vibrant & 3D Glass",
    },
  },

  editorial: {
    heroFeature: {
      title: "Shared Ambition",
      subtitle: "Authentic team collaboration captured under warm golden sunlight.",
      image: IMAGERY_MOOD_IMAGE_ARRAYS.editorial[0],
      badge: "Human Story",
    },
    scaleCard: {
      headline: "Tell stories that resonate",
      highlight: "and endure.",
      image: IMAGERY_MOOD_IMAGE_ARRAYS.editorial[1],
      tag: "Tactile Story",
    },
    articleList: {
      header: "The Journal",
      items: [
        {
          title: "Candid Moments: Why Authenticity Wins Trust",
          tag: "Storytelling",
          image: IMAGERY_MOOD_IMAGE_ARRAYS.editorial[2],
        },
        {
          title: "Warm Tactile Aesthetics in a Digital Era",
          tag: "Culture",
          image: IMAGERY_MOOD_IMAGE_ARRAYS.editorial[3],
        },
        {
          title: "Building Community Through Human-Centered Art",
          tag: "Community",
          image: IMAGERY_MOOD_IMAGE_ARRAYS.editorial[4],
        },
      ],
    },
    campaignCard: {
      headline: "Celebrate the real",
      subheadline: "and beautifully imperfect.",
      image: IMAGERY_MOOD_IMAGE_ARRAYS.editorial[4],
      accentLabel: "Warm Daylight",
    },
    panoramicBanner: {
      title: "Authentic Human Narrative",
      caption: "Candid moments, tactile analog grain, and authentic documentary warmth.",
      image: IMAGERY_MOOD_IMAGE_ARRAYS.editorial[0],
      meta: "Editorial & Candid",
    },
  },
}

