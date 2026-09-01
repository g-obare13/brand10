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
    id: "semi-flat",
    label: "Flat Design",
    badge: "Semi-Flat",
    vibe: "Clean, functional, and highly polished.",
    bestFor: "Corporate web apps, SaaS dashboards, and e-commerce platforms.",
    description:
      "The absolute baseline for the modern web. Strips away heavy real-world textures to focus on crisp vector shapes, highly readable typography, and structured grids with subtle soft drop shadows.",
    tagline:
      "Precision-engineered structured grid for modern digital products.",
    image: "/showcases/semi-flat.avif",
    tones: { formal: 65, playful: 25, minimalist: 75, bold: 60 },
  },
  {
    id: "minimalism",
    label: "Minimalism",
    badge: "Less is More",
    vibe: "Premium, calm, and sophisticated.",
    bestFor:
      "Luxury brand sites, creative portfolios, and clean editorial publications.",
    description:
      "The discipline of 'less is more'. Handles visual hierarchy by stripping away container boxes and borders completely in favor of massive whitespace, careful alignment, and elegant typography.",
    tagline:
      "Pure elegance through massive whitespace and high-contrast typography.",
    image: "/showcases/minimalist.jpg",
    tones: { formal: 80, playful: 10, minimalist: 95, bold: 35 },
  },
  {
    id: "neumorphism",
    label: "Neumorphism",
    badge: "Soft UI",
    vibe: "Futuristic, monochromatic, and softly tactile.",
    bestFor:
      "Smart-home dashboards, fitness trackers, and custom financial tool concepts.",
    description:
      "A style that merges flat simplicity with tactile feel. Components look molded directly out of the screen material using paired soft inner and outer shadows to look extruded or physically pressed.",
    tagline:
      "Tactile interface components extruded smoothly from ambient soft shadows.",
    image: "/showcases/neumorphism.avif",
    tones: { formal: 45, playful: 45, minimalist: 85, bold: 45 },
  },
  {
    id: "neo-brutalism",
    label: "Neo-Brutalism",
    badge: "Raw & Edgy",
    vibe: "Edgy, loud, and intentionally unpolished.",
    bestFor:
      "Creative software, modern fintech platforms, and web3 interfaces.",
    description:
      "A highly usable, commercial adaptation of web brutalism. Explicitly breaks standard corporate templates with thick unblurred black outlines, solid background colors, and high-voltage contrast.",
    tagline:
      "Raw HTML energy, unblurred solid drop shadows, and high-voltage contrast.",
    image: "/showcases/neo-brutalism.jpg",
    tones: { formal: 15, playful: 85, minimalist: 30, bold: 95 },
  },
  {
    id: "maximalism",
    label: "Maximalism",
    badge: "Sensory Heavy",
    vibe: "Bold, saturated, and sensory-heavy.",
    bestFor:
      "Creative portfolios, experimental interfaces, and attention-dominating brands.",
    description:
      "The direct visual counter-movement to minimalism. Rejects empty whitespace in favor of packed layouts, dense typography, overlapping textures, and massive, layered visual collages.",
    tagline:
      "Rich visual density, unapologetic chromatic saturation, and sensory collages.",
    image: "/showcases/maximalism.avif",
    tones: { formal: 10, playful: 95, minimalist: 10, bold: 100 },
  },
]
