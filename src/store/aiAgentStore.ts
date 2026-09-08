/**
 * @file aiAgentStore.ts
 * @description Centralized Zustand state management for the OpenAPI Brand Guidelines Copilot.
 * Manages active conversation, streaming tokens, interactive tabbed draft state,
 * and seamless synchronization with the main brandStudio state.
 */

import { toast } from "sonner"
import { create } from "zustand"
import { AI_PROVIDERS, INITIAL_BRAND_DRAFT } from "@/data/aiProviders"
import { getApiKey, hasApiKey } from "@/lib/ai/keyStorage"
import { streamOpenApiCompletions } from "@/lib/ai/openApiClient"
import { createColorSwatch } from "@/lib/colorUtils"
import { useBrandStore } from "@/store/brandStore"
import type {
  AiChatMessage,
  AiProviderId,
  AiTabId,
  AiToolInvocation,
  GeneratedBrandDraft,
} from "@/types/ai"

interface AiAgentStoreState {
  activeTab: AiTabId
  activeProviderId: AiProviderId
  customBaseUrl: string
  selectedModel: string
  messages: AiChatMessage[]
  draft: GeneratedBrandDraft
  isGenerating: boolean
  generationError: string | null
  isKeyModalOpen: boolean
  hasConfiguredKey: boolean
  abortController: AbortController | null

  // Actions
  setActiveTab: (tab: AiTabId) => void
  setProvider: (providerId: AiProviderId) => void
  setSelectedModel: (model: string) => void
  setCustomBaseUrl: (url: string) => void
  setKeyModalOpen: (open: boolean) => void
  checkConfiguredKey: () => Promise<void>
  updateDraft: (updater: (prev: GeneratedBrandDraft) => GeneratedBrandDraft) => void
  updateDraftField: <TKey extends keyof GeneratedBrandDraft>(
    key: TKey,
    value: GeneratedBrandDraft[TKey]
  ) => void
  syncToBrandStore: () => void
  sendMessage: (prompt: string) => Promise<void>
  stopGeneration: () => void
  resetDraft: () => void
  clearMessages: () => void
}

export const useAiAgentStore = create<AiAgentStoreState>((set, get) => ({
  activeTab: "strategy",
  activeProviderId: "openapi",
  customBaseUrl: "https://api.openai.com/v1",
  selectedModel: AI_PROVIDERS.openapi.defaultModel,
  messages: [
    {
      id: "welcome-1",
      role: "assistant",
      content:
        "Welcome to the Brand Copilot. Describe your brand concept, target audience, or desired aesthetic to generate a complete visual guideline system in real time.",
      timestamp: new Date().toISOString(),
    },
  ],
  draft: INITIAL_BRAND_DRAFT,
  isGenerating: false,
  generationError: null,
  isKeyModalOpen: false,
  hasConfiguredKey: false,
  abortController: null,

  setActiveTab: (tab) => set({ activeTab: tab }),

  setProvider: (providerId) => {
    const config = AI_PROVIDERS[providerId]
    set({
      activeProviderId: providerId,
      selectedModel: config.defaultModel,
    })
    void get().checkConfiguredKey()
  },

  setSelectedModel: (model) => set({ selectedModel: model }),

  setCustomBaseUrl: (url) => set({ customBaseUrl: url }),

  setKeyModalOpen: (open) => set({ isKeyModalOpen: open }),

  checkConfiguredKey: async () => {
    const { activeProviderId } = get()
    const config = AI_PROVIDERS[activeProviderId]
    if (!config.requiresKey) {
      set({ hasConfiguredKey: true })
      return
    }
    const hasKey = await hasApiKey(activeProviderId)
    set({ hasConfiguredKey: hasKey })
  },

  updateDraft: (updater) => {
    set((state) => ({ draft: updater(state.draft) }))
  },

  updateDraftField: (key, value) => {
    set((state) => ({
      draft: { ...state.draft, [key]: value },
    }))
  },

  syncToBrandStore: () => {
    const { draft } = get()
    const brand = useBrandStore.getState()

    try {
      brand.setBrandName(draft.brandName)
      brand.setTagline(draft.tagline)
      brand.setMission(draft.mission)
      brand.setVision(draft.vision)
      brand.setCoreValues(draft.coreValues)
      brand.setBrandPillars(draft.brandPillars)

      // Apply tone ratings
      brand.setToneRating("formal", draft.toneRatings.formal)
      brand.setToneRating("playful", draft.toneRatings.playful)
      brand.setToneRating("minimalist", draft.toneRatings.minimalist)
      brand.setToneRating("bold", draft.toneRatings.bold)

      // Apply color palette
      brand.setColorPalette(draft.colorPalette)

      // Apply typography
      void brand.setTypography({
        displayFont: draft.displayFont,
        bodyFont: draft.bodyFont,
        monoFont: draft.monoFont,
      })

      // Apply rules
      brand.setDosAndDonts(draft.dosAndDonts)

      toast.success("Brand guidelines synced to Studio", {
        description: `Successfully applied "${draft.brandName}" system to your current project.`,
      })
    } catch (err) {
      console.error("Failed to sync draft to brandStore:", err)
      toast.error("Failed to sync guidelines to Studio")
    }
  },

  sendMessage: async (userPrompt: string) => {
    const prompt = userPrompt.trim()
    if (!prompt) return

    const {
      activeProviderId,
      customBaseUrl,
      selectedModel,
      messages,
      isGenerating,
    } = get()

    if (isGenerating) return

    const config = AI_PROVIDERS[activeProviderId]
    const baseUrl =
      activeProviderId === "openapi" && customBaseUrl.trim()
        ? customBaseUrl.trim()
        : config.baseUrl

    // Check key requirements
    let apiKey: string | null = null
    if (config.requiresKey) {
      apiKey = await getApiKey(activeProviderId)
      if (!apiKey) {
        set({ isKeyModalOpen: true })
        toast.warning(`Please enter your ${config.name} API key to start generating.`)
        return
      }
    }

    const userMessage: AiChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: prompt,
      timestamp: new Date().toISOString(),
    }

    const assistantId = `assistant-${Date.now()}`
    const assistantMessage: AiChatMessage = {
      id: assistantId,
      role: "assistant",
      content: "",
      timestamp: new Date().toISOString(),
      isStreaming: true,
      toolInvocations: [],
    }

    const updatedMessages = [...messages, userMessage, assistantMessage]
    const abortController = new AbortController()

    set({
      messages: updatedMessages,
      isGenerating: true,
      generationError: null,
      abortController,
    })

    const toolCallsCollector: AiToolInvocation[] = []

    try {
      await streamOpenApiCompletions({
        baseUrl,
        apiKey: apiKey ?? undefined,
        model: selectedModel,
        messages: updatedMessages
          .filter((m) => m.content.trim().length > 0)
          .map((m) => ({ role: m.role, content: m.content })),
        signal: abortController.signal,
        onToken: (token) => {
          set((state) => ({
            messages: state.messages.map((m) =>
              m.id === assistantId ? { ...m, content: m.content + token } : m
            ),
          }))
        },
        onToolCallComplete: (toolName, toolArgs) => {
          const invId = `inv_${Date.now()}_${toolCallsCollector.length}`
          const toolInvocation: AiToolInvocation = {
            id: invId,
            name: toolName,
            arguments: toolArgs,
            status: "success",
          }
          toolCallsCollector.push(toolInvocation)

          // Mutate draft state based on tool
          set((state) => {
            const nextDraft = { ...state.draft }

            if (toolName === "updateBrandStrategy") {
              if (typeof toolArgs.brandName === "string")
                nextDraft.brandName = toolArgs.brandName
              if (typeof toolArgs.tagline === "string")
                nextDraft.tagline = toolArgs.tagline
              if (typeof toolArgs.mission === "string")
                nextDraft.mission = toolArgs.mission
              if (typeof toolArgs.vision === "string")
                nextDraft.vision = toolArgs.vision
              if (Array.isArray(toolArgs.coreValues))
                nextDraft.coreValues = toolArgs.coreValues as string[]
              if (Array.isArray(toolArgs.brandPillars))
                nextDraft.brandPillars = toolArgs.brandPillars as GeneratedBrandDraft["brandPillars"]
              if (toolArgs.toneRatings && typeof toolArgs.toneRatings === "object") {
                nextDraft.toneRatings = {
                  ...nextDraft.toneRatings,
                  ...(toolArgs.toneRatings as Partial<GeneratedBrandDraft["toneRatings"]>),
                }
              }
              toolInvocation.summary = `Updated strategy pillars for ${nextDraft.brandName}`
            } else if (toolName === "updateColorPalette") {
              if (Array.isArray(toolArgs.colorPalette)) {
                nextDraft.colorPalette = (toolArgs.colorPalette as Array<{
                  name?: string
                  hex?: string
                  role?: "primary" | "secondary" | "accent" | "neutral" | "surface"
                }>).map((c, i) =>
                  createColorSwatch(
                    c.hex || "#000000",
                    c.role || "primary",
                    c.name || `Color ${i + 1}`
                  )
                )
                toolInvocation.summary = `Generated ${nextDraft.colorPalette.length} swatches`
              }
            } else if (toolName === "updateTypography") {
              if (typeof toolArgs.displayFont === "string")
                nextDraft.displayFont = toolArgs.displayFont
              if (typeof toolArgs.bodyFont === "string")
                nextDraft.bodyFont = toolArgs.bodyFont
              if (typeof toolArgs.monoFont === "string")
                nextDraft.monoFont = toolArgs.monoFont
              toolInvocation.summary = `Paired ${nextDraft.displayFont} + ${nextDraft.bodyFont}`
            } else if (toolName === "updateGuidelines") {
              if (Array.isArray(toolArgs.dosAndDonts)) {
                nextDraft.dosAndDonts = (toolArgs.dosAndDonts as Array<{
                  rule?: string
                  type?: "do" | "dont"
                  detail?: string
                }>).map((d, i) => ({
                  id: `rule-${Date.now()}-${i}`,
                  rule: d.rule || "",
                  type: d.type || "do",
                  detail: d.detail || d.rule || "",
                }))
                toolInvocation.summary = `Defined ${nextDraft.dosAndDonts.length} rules`
              }
            }

            return {
              draft: nextDraft,
              messages: state.messages.map((m) =>
                m.id === assistantId
                  ? { ...m, toolInvocations: [...toolCallsCollector] }
                  : m
              ),
            }
          })
        },
      })

      set((state) => ({
        isGenerating: false,
        abortController: null,
        messages: state.messages.map((m) =>
          m.id === assistantId ? { ...m, isStreaming: false } : m
        ),
      }))
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err)
      set((state) => ({
        isGenerating: false,
        generationError: errorMsg,
        abortController: null,
        messages: state.messages.map((m) =>
          m.id === assistantId
            ? {
                ...m,
                content:
                  m.content ||
                  `Generation encountered an issue: ${errorMsg}. Please check your API key or model availability.`,
                isStreaming: false,
              }
            : m
        ),
      }))
      toast.error("Generation error", { description: errorMsg })
    }
  },

  stopGeneration: () => {
    const { abortController } = get()
    if (abortController) {
      abortController.abort()
      set({ isGenerating: false, abortController: null })
      toast.info("Generation stopped")
    }
  },

  resetDraft: () => {
    set({ draft: INITIAL_BRAND_DRAFT })
    toast.info("Brand draft reset to default blueprint")
  },

  clearMessages: () => {
    set({
      messages: [
        {
          id: `welcome-${Date.now()}`,
          role: "assistant",
          content:
            "Brand Copilot initialized. What brand vision should we create today?",
          timestamp: new Date().toISOString(),
        },
      ],
      generationError: null,
    })
  },
}))
