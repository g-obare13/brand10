/**
 * @file aiProviders.ts
 * @description Static provider configurations, model catalogs, and prompt templates
 * for the OpenAPI-compliant brand guideline AI agent.
 */

import { createColorSwatch } from "@/lib/colorUtils"
import type {
  AiProviderConfig,
  AiProviderId,
  BrandPromptCardItem,
  GeneratedBrandDraft,
} from "@/types/ai"

/**
 * Whitelisted OpenAPI provider presets.
 */
export const AI_PROVIDERS: Record<AiProviderId, AiProviderConfig> = {
  gemini: {
    id: "gemini",
    name: "Google Gemini",
    baseUrl: "https://generativelanguage.googleapis.com/v1beta/openai",
    defaultModel: "gemini-2.5-flash",
    models: [
      "gemini-2.5-flash",
      "gemini-2.5-pro",
      "gemini-2.0-flash",
    ],
    keyPlaceholder: "AIzaSy...",
    docsUrl: "https://aistudio.google.com/app/apikey",
    requiresKey: true,
  },
  claude: {
    id: "claude",
    name: "Anthropic Claude",
    baseUrl: "https://api.anthropic.com/v1",
    defaultModel: "claude-3-7-sonnet-20250219",
    models: [
      "claude-3-7-sonnet-20250219",
      "claude-3-5-sonnet-20241022",
      "claude-3-5-haiku-20241022",
    ],
    keyPlaceholder: "sk-ant-api03-...",
    docsUrl: "https://console.anthropic.com/settings/keys",
    requiresKey: true,
  },
  deepseek: {
    id: "deepseek",
    name: "DeepSeek",
    baseUrl: "https://api.deepseek.com/v1",
    defaultModel: "deepseek-chat",
    models: [
      "deepseek-chat",
      "deepseek-reasoner",
      "deepseek-coder",
    ],
    keyPlaceholder: "sk-...",
    docsUrl: "https://platform.deepseek.com/api_keys",
    requiresKey: true,
  },
  openapi: {
    id: "openapi",
    name: "OpenAI / OpenAPI",
    baseUrl: "https://api.openai.com/v1",
    defaultModel: "gpt-4o",
    models: [
      "gpt-4o",
      "gpt-4o-mini",
      "o3-mini",
    ],
    keyPlaceholder: "sk-proj-...",
    docsUrl: "https://platform.openai.com/api-keys",
    requiresKey: true,
  },
}

/**
 * Targeted onboarding questions to guide brand generation.
 */
export const GUIDED_BRAND_QUESTIONS: string[] = [
  "What is your brand or company name (or should I brainstorm options)?",
  "Who is your target audience and what is your core product or service?",
  "What visual aesthetic or emotion should it convey (e.g. Minimalist, Bold Tech, Organic, Editorial Luxury)?",
  "Do you have any preferred colors or fonts, or should I design the initial palette and pairing?",
]

/**
 * 4 curated brand prompt cards displayed by default on the AI assistant interface.
 */
export const BRAND_PROMPT_CARDS: BrandPromptCardItem[] = [
  {
    id: "nordic-coffee",
    title: "Nordic Specialty Coffee",
    category: "Minimalist & Hospitality",
    prompt:
      "A minimalist Scandinavian coffee roastery focused on ethically sourced beans, ceramic aesthetics, and calm, mindful cafe experiences.",
    tags: ["Minimalist", "Warm Earth", "Calm Editorial"],
    iconType: "coffee",
  },
  {
    id: "cybersecurity-platform",
    title: "Cybersecurity Platform",
    category: "Enterprise Infrastructure",
    prompt:
      "An enterprise zero-trust cloud infrastructure security startup with a confident, cryptographic, and high-precision aesthetic.",
    tags: ["Zero Trust", "Precision", "High Contrast"],
    iconType: "security",
  },
  {
    id: "eco-luxury-skincare",
    title: "Eco Luxury Skincare",
    category: "Botanical & Wellness",
    prompt:
      "A high-end botanical skincare brand packaged in recycled sea-glass, blending French dermatology science with wild alpine herbs.",
    tags: ["Botanical", "Serif Hierarchy", "Luxury"],
    iconType: "skincare",
  },
  {
    id: "neo-brutalist-web3",
    title: "Neo-Brutalist Web3 Studio",
    category: "Creative Engineering",
    prompt:
      "A high-energy creative engineering studio building on-chain protocols, featuring high-contrast neo-brutalist typography and vibrant neon accents.",
    tags: ["Neo-Brutalist", "Monospace", "Vibrant Accent"],
    iconType: "web3",
  },
]

/**
 * Quick prompt starters for users to kickstart a brand generation.
 */
export const BRAND_PROMPT_STARTERS: Array<{ title: string; prompt: string }> = BRAND_PROMPT_CARDS.map(
  (card) => ({
    title: card.title,
    prompt: card.prompt,
  })
)

/**
 * Initial empty draft brand structure before AI generation.
 */
export const INITIAL_BRAND_DRAFT: GeneratedBrandDraft = {
  brandName: "Aetheria",
  tagline: "Precision engineered visual intelligence.",
  mission:
    "To democratize world-class design systems and visual standards through intelligent, automated creative tools.",
  vision:
    "A world where every creator and enterprise crafts distinct, accessible, and timeless brand identities effortlessly.",
  coreValues: [
    "Uncompromising Simplicity",
    "Radical Craftsmanship",
    "Universal Accessibility",
  ],
  brandPillars: [
    {
      title: "Quiet Precision",
      desc: "Every pixel, margin, and type scale serves an intentional functional purpose.",
    },
    {
      title: "Tactile Digital",
      desc: "Digital interfaces engineered with the sensory warmth and texture of fine editorial print.",
    },
    {
      title: "Inclusive Architecture",
      desc: "Accessible color contrast and readable typography baked in from day zero.",
    },
  ],
  toneRatings: {
    formal: 65,
    playful: 30,
    minimalist: 85,
    bold: 70,
  },
  colorPalette: [
    createColorSwatch("#1B4332", "primary", "Deep Pine"),
    createColorSwatch("#2D6A4F", "secondary", "Forest Emerald"),
    createColorSwatch("#74C69D", "accent", "Mint Highlight"),
    createColorSwatch("#F8F9FA", "neutral", "Off-White Cloud"),
  ],
  displayFont: "Plus Jakarta Sans",
  bodyFont: "Inter",
  monoFont: "JetBrains Mono",
  dosAndDonts: [
    {
      id: "rule-1",
      type: "do",
      rule: "Maintain mark clearspace",
      detail: "Maintain at least 1.5x logo height in clearspace around all brand marks.",
    },
    {
      id: "rule-2",
      type: "dont",
      rule: "Do not distort wordmark",
      detail: "Never skew, stretch, or rotate the brand wordmark under any circumstances.",
    },
    {
      id: "rule-3",
      type: "do",
      rule: "Ensure high contrast readability",
      detail: "Always ensure body text passes WCAG 2.2 AA contrast standards (minimum 4.5:1).",
    },
    {
      id: "rule-4",
      type: "dont",
      rule: "Avoid accent fills for body copy",
      detail: "Do not use accent colors for long paragraph text or background surface fills.",
    },
  ],
}
