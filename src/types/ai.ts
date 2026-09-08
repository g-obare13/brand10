/**
 * @file ai.ts
 * @description Type definitions for OpenAPI AI agent, provider configurations,
 * chat messages, streaming tokens, tool schemas, and generated brand draft states.
 */

import type { BrandDoDontItem } from "@/data/presets"
import type { ColorSwatch } from "@/lib/colorUtils"
import type { BrandPillar, BrandToneRatings } from "@/store/brandStore"

/**
 * Identifier for supported OpenAPI AI providers.
 */
export type AiProviderId = "gemini" | "claude" | "deepseek" | "openapi"

/**
 * Configuration options for an OpenAPI AI provider.
 */
export interface AiProviderConfig {
  id: AiProviderId
  name: string
  baseUrl: string
  defaultModel: string
  models: string[]
  keyPlaceholder: string
  docsUrl: string
  requiresKey: boolean
  hidden?: boolean
}

/**
 * Single chat message exchanged in the AI copilot conversation.
 */
export interface AiChatMessage {
  id: string
  role: "user" | "assistant" | "system"
  content: string
  toolInvocations?: AiToolInvocation[]
  timestamp: string
  isStreaming?: boolean
}

/**
 * Record of a tool called by the AI during generation.
 */
export interface AiToolInvocation {
  id: string
  name: string
  arguments: Record<string, unknown>
  status: "calling" | "success" | "error"
  summary?: string
}

/**
 * Staged brand draft created and refined by the AI before committing to main studio.
 */
export interface GeneratedBrandDraft {
  brandName: string
  tagline: string
  mission: string
  vision: string
  coreValues: string[]
  brandPillars: BrandPillar[]
  toneRatings: BrandToneRatings
  colorPalette: ColorSwatch[]
  displayFont: string
  bodyFont: string
  monoFont: string
  dosAndDonts: BrandDoDontItem[]
}

/**
 * Active view tab inside the interactive AI studio canvas.
 */
export type AiTabId = "strategy" | "colors" | "typography" | "guidelines" | "log"

/**
 * Structured brand prompt card starter item for the default AI prompt view.
 */
export interface BrandPromptCardItem {
  id: string
  title: string
  category: string
  prompt: string
  tags: string[]
  iconType: "coffee" | "security" | "skincare" | "web3"
}
