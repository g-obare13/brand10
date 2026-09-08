/**
 * @file AiChat.tsx
 * @description Fixed bottom-docked AI Brand Copilot chat bar and interactive canvas.
 * Implements authentication gate, automatic "Untitled Project" initialization,
 * local BYOK API key configuration, guided onboarding questions, and real-time model switching.
 */

import { ApiKeyModal } from "@/components/shared/ApiKeyModal"
import { AiColorsTab } from "@/components/shared/ai-canvas/AiColorsTab"
import { AiGuidelinesTab } from "@/components/shared/ai-canvas/AiGuidelinesTab"
import { AiLogTab } from "@/components/shared/ai-canvas/AiLogTab"
import { AiStrategyTab } from "@/components/shared/ai-canvas/AiStrategyTab"
import { AiTypographyTab } from "@/components/shared/ai-canvas/AiTypographyTab"
import type { AutosizeTextAreaRef } from "@/components/ui/autosize-textarea"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Loader } from "@/components/ui/loader"
import { Textarea } from "@/components/ui/textarea"
import {
  AI_PROVIDERS,
  BRAND_PROMPT_CARDS,
  GUIDED_BRAND_QUESTIONS,
} from "@/data/aiProviders"
import { cn } from "@/lib/utils"
import { useAiAgentStore } from "@/store/aiAgentStore"
import { useAuthStore } from "@/store/authStore"
import { useBrandStore } from "@/store/brandStore"
import { useProjectsStore } from "@/store/projectsStore"
import type { AiProviderId, AiTabId } from "@/types/ai"
import { ArrowRightStroke, Check, ChevronDown, Robot } from "@boxicons/react"
import {
  IconCloudCheck,
  IconExternalLink,
  IconKey,
  IconListCheck,
  IconPalette,
  IconPlayerStop,
  IconRotate,
  IconSparkles,
  IconTerminal2,
  IconTypography,
} from "@tabler/icons-react"
import { Link } from "@tanstack/react-router"
import type React from "react"
import { useEffect, useRef, useState } from "react"
import { toast } from "sonner"

export function OpenAiIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-label="OpenAI icon"
      className={cn("h-4 w-4 fill-current", className)}
      viewBox="0 0 256 260"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>OpenAI</title>
      <path d="M239.184 106.203a64.716 64.716 0 0 0-5.576-53.103C219.452 28.459 191 15.784 163.213 21.74A65.586 65.586 0 0 0 52.096 45.22a64.716 64.716 0 0 0-43.23 31.36c-14.31 24.602-11.061 55.634 8.033 76.74a64.665 64.665 0 0 0 5.525 53.102c14.174 24.65 42.644 37.324 70.446 31.36a64.72 64.72 0 0 0 48.754 21.744c28.481.025 53.714-18.361 62.414-45.481a64.767 64.767 0 0 0 43.229-31.36c14.137-24.558 10.875-55.423-8.083-76.483Zm-97.56 136.338a48.397 48.397 0 0 1-31.105-11.255l1.535-.87 51.67-29.825a8.595 8.595 0 0 0 4.247-7.367v-72.85l21.845 12.636c.218.111.37.32.409.563v60.367c-.056 26.818-21.783 48.545-48.601 48.601Zm-104.466-44.61a48.345 48.345 0 0 1-5.781-32.589l1.534.921 51.722 29.826a8.339 8.339 0 0 0 8.441 0l63.181-36.425v25.221a.87.87 0 0 1-.358.665l-52.335 30.184c-23.257 13.398-52.97 5.431-66.404-17.803ZM23.549 85.38a48.499 48.499 0 0 1 25.58-21.333v61.39a8.288 8.288 0 0 0 4.195 7.316l62.874 36.272-21.845 12.636a.819.819 0 0 1-.767 0L41.353 151.53c-23.211-13.454-31.171-43.144-17.804-66.405v.256Zm179.466 41.695-63.08-36.63L161.73 77.86a.819.819 0 0 1 .768 0l52.233 30.184a48.6 48.6 0 0 1-7.316 87.635v-61.391a8.544 8.544 0 0 0-4.4-7.213Zm21.742-32.69-1.535-.922-51.619-30.081a8.39 8.39 0 0 0-8.492 0L99.98 99.808V74.587a.716.716 0 0 1 .307-.665l52.233-30.133a48.652 48.652 0 0 1 72.236 50.391v.205ZM88.061 139.097l-21.845-12.585a.87.87 0 0 1-.41-.614V65.685a48.652 48.652 0 0 1 79.757-37.346l-1.535.87-51.67 29.825a8.595 8.595 0 0 0-4.246 7.367l-.051 72.697Zm11.868-25.58 28.138-16.217 28.188 16.218v32.434l-28.086 16.218-28.188-16.218-.052-32.434Z" />
    </svg>
  )
}

export function AnthropicIcon({ className }: { className?: string }) {
  return (
    <svg
      className={cn("h-4 w-4 fill-current", className)}
      fillRule="evenodd"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Anthropic Claude</title>
      <path d="M13.827 3.52h3.603L24 20h-3.603l-6.57-16.48zm-7.258 0h3.767L16.906 20h-3.674l-1.343-3.461H5.017l-1.344 3.46H0L6.57 3.522zm4.132 9.959L8.453 7.687 6.205 13.48H10.7z" />
    </svg>
  )
}

export function GeminiIcon({ className }: { className?: string }) {
  return (
    <svg
      className={cn("h-4 w-4", className)}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Google Gemini</title>
      <defs>
        <linearGradient
          id="gemini-icon-fill-nav"
          x1="0%"
          x2="68.73%"
          y1="100%"
          y2="30.395%"
        >
          <stop offset="0%" stopColor="#1C7DFF" />
          <stop offset="52.021%" stopColor="#1C69FF" />
          <stop offset="100%" stopColor="#F0DCD6" />
        </linearGradient>
      </defs>
      <path
        d="M12 24A14.304 14.304 0 000 12 14.304 14.304 0 0012 0a14.305 14.305 0 0012 12 14.305 14.305 0 00-12 12"
        fill="url(#gemini-icon-fill-nav)"
        fillRule="nonzero"
      />
    </svg>
  )
}

export function DeepSeekIcon({ className }: { className?: string }) {
  return (
    <svg
      className={cn("h-4 w-4 fill-current", className)}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>DeepSeek</title>
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
    </svg>
  )
}

interface AiChatProps {
  className?: string
}

/**
 * AI Brand Copilot interface featuring sticky bottom prompt bar and live tabbed canvas.
 *
 * @component
 * @param {AiChatProps} [props] - Component properties.
 * @returns {React.ReactElement}
 */
export function AiChat({ className = "" }: AiChatProps): React.ReactElement {
  const {
    activeTab,
    setActiveTab,
    activeProviderId,
    setProvider,
    selectedModel,
    setSelectedModel,
    draft,
    messages,
    isGenerating,
    isKeyModalOpen,
    setKeyModalOpen,
    hasConfiguredKey,
    checkConfiguredKey,
    syncToBrandStore,
    sendMessage,
    stopGeneration,
    resetDraft,
  } = useAiAgentStore()

  const user = useAuthStore((state) => state.user)
  const setLoginModalOpen = useAuthStore((state) => state.setLoginModalOpen)
  const activeProjectId = useBrandStore((state) => state.projectId)
  const activeBrandName = useBrandStore((state) => state.brandName)
  const setProjectId = useBrandStore((state) => state.setProjectId)
  const setBrandName = useBrandStore((state) => state.setBrandName)
  const projects = useProjectsStore((state) => state.projects)
  const createProject = useProjectsStore((state) => state.createProject)

  const [inputPrompt, setInputPrompt] = useState("")
  const textareaRef = useRef<AutosizeTextAreaRef>(null)

  useEffect(() => {
    if (AI_PROVIDERS[activeProviderId].hidden) {
      setProvider("openapi")
      setSelectedModel(AI_PROVIDERS.openapi.defaultModel)
      return
    }
    void checkConfiguredKey()
  }, [checkConfiguredKey, activeProviderId, setProvider, setSelectedModel])

  const providerConfig = AI_PROVIDERS[activeProviderId]

  /**
   * Verifies authentication, auto-initializes "Untitled Project N" if needed,
   * and verifies that the provider API key is present.
   */
  const handleInteractionGate = async (): Promise<boolean> => {
    // 1. Auth check
    if (!user) {
      setLoginModalOpen(true)
      toast.info("Please sign in to initialize your brand project")
      return false
    }

    // 2. Project check & auto-creation
    if (
      !activeProjectId ||
      activeProjectId.startsWith("demo-") ||
      activeProjectId === "current"
    ) {
      const nextIndex = projects.length + 1
      const sampleName = `Untitled Project ${nextIndex}`
      const { project, error } = await createProject(sampleName, user.id)
      if (error) {
        toast.error(error)
        return false
      }
      if (project) {
        setProjectId(project.id)
        setBrandName(project.name || sampleName)
        toast.success(`Initialized project "${project.name || sampleName}"`)
      }
    }

    // 3. Key check
    if (!hasConfiguredKey && providerConfig.requiresKey) {
      setKeyModalOpen(true)
      toast.warning(
        `Please paste your ${providerConfig.name} API key to start generating`
      )
      return false
    }

    return true
  }

  const [viewMode, setViewMode] = useState<"prompts" | "canvas">("prompts")

  const handleSelectPrompt = (promptText: string) => {
    setInputPrompt(promptText)
    textareaRef.current?.textArea.focus()
  }


  const handleReset = () => {
    resetDraft()
    setViewMode("prompts")
  }

  const handleSend = async () => {
    if (!inputPrompt.trim() || isGenerating) return

    const ready = await handleInteractionGate()
    if (!ready) return

    const promptToSend = inputPrompt
    setInputPrompt("")
    setViewMode("canvas")
    await sendMessage(promptToSend)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      void handleSend()
    }
  }

  const handleQuestionClick = async (question: string) => {
    const ready = await handleInteractionGate()
    if (!ready) return
    setInputPrompt(question)
    textareaRef.current?.textArea.focus()
  }

  const PROVIDER_ICONS: Record<AiProviderId, React.ReactNode> = {
    gemini: <GeminiIcon className="h-4 w-4" />,
    claude: (
      <AnthropicIcon className="h-4 w-4 text-amber-600 dark:text-amber-400" />
    ),
    deepseek: <DeepSeekIcon className="h-4 w-4 text-blue-500" />,
    openapi: <OpenAiIcon className="h-4 w-4" />,
  }


  const tabsConfig: Array<{
    id: AiTabId
    label: string
    icon: React.ReactNode
  }> = [
    {
      id: "strategy",
      label: draft.brandName || "Strategy & Tone",
      icon: <IconSparkles size={15} />,
    },
    {
      id: "colors",
      label: `Colors (${draft.colorPalette.length})`,
      icon: <IconPalette size={15} />,
    },
    {
      id: "typography",
      label: "Typography",
      icon: <IconTypography size={15} />,
    },
    {
      id: "guidelines",
      label: `Rules (${draft.dosAndDonts.length})`,
      icon: <IconListCheck size={15} />,
    },
    {
      id: "log",
      label: `Agent Log (${messages.length})`,
      icon: <IconTerminal2 size={15} />,
    },
  ]

  const renderPromptInput = (isEmbedded = false) => (
    <div
      className={cn(
        "rounded-2xl border border-border/80 bg-neutral-100 p-1.5 pt-3.5 backdrop-blur-xl transition-all dark:bg-neutral-900/90"
        // isEmbedded ? "w-full shadow-md" : "shadow-2xl"
      )}
    >
      {/* Top Info Bar */}
      <div className="mx-2 mb-2 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {PROVIDER_ICONS[activeProviderId]}
          <h6 className="text-xs font-semibold text-foreground">
            {activeBrandName || "Untitled Brand Project"}
          </h6>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setKeyModalOpen(true)}
            className="inline-flex cursor-pointer items-center gap-1 text-[11px] text-muted-foreground transition hover:text-foreground"
            title="Configure API key"
          >
            <IconKey size={12} />
            {hasConfiguredKey ? (
              <span className="font-medium text-emerald-500">Key Active</span>
            ) : (
              <span className="font-medium text-amber-500">Add Key</span>
            )}
          </button>
        </div>
      </div>

      {/* Text Input Container */}
      <div className="relative">
        <div className="relative flex flex-col gap-0 overflow-hidden rounded-xl border border-border/40 bg-neutral-200/75 dark:bg-neutral-950/75">
          <div className="overflow-y-auto">
            <Textarea
              ref={textareaRef}
              id={isEmbedded ? "ai-input-embedded" : "ai-input-fixed"}
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              onFocus={() => void handleInteractionGate()}
              onKeyDown={handleKeyDown}
              placeholder={
                hasConfiguredKey
                  ? "Describe your brand idea, target audience, or aesthetic..."
                  : "Click here to sign in and set up your provider key..."
              }
              rows={isEmbedded ? 3 : 2}
              className="w-full resize-none rounded-xl rounded-b-none border-none bg-transparent p-3 text-foreground placeholder:text-muted-foreground focus-visible:ring-0"
            />
          </div>

          {/* Bottom Action Row */}
          <div className="flex h-12 items-center rounded-b-xl border-t border-border/30 bg-background/20 px-3">
            <div className="flex w-full items-center justify-between">
              {/* Left: Model Dropdown Selector */}
              <div className="flex items-center gap-2">
                <DropdownMenu modal={false}>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex h-8 items-center gap-1.5 rounded-lg px-2 text-xs text-foreground hover:bg-muted/80"
                    >
                      <div className="flex items-center gap-1.5">
                        {PROVIDER_ICONS[activeProviderId] || (
                          <Robot className="h-3.5 w-3.5 opacity-60" />
                        )}
                        <span className="font-mono text-[11px] font-semibold">
                          {selectedModel}
                        </span>
                        <ChevronDown className="h-3 w-3 opacity-50" />
                      </div>
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent className="max-h-80 min-w-64 overflow-y-auto border-border/80 bg-popover text-popover-foreground shadow-xl">
                    {(Object.keys(AI_PROVIDERS) as AiProviderId[])
                      .filter((pid) => !AI_PROVIDERS[pid].hidden)
                      .map((pid) => {
                        const config = AI_PROVIDERS[pid]
                        return (
                          <DropdownMenuGroup key={pid}>
                            <DropdownMenuLabel className="flex items-center gap-2 text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
                              {PROVIDER_ICONS[pid]}
                              <span>{config.name}</span>
                            </DropdownMenuLabel>

                            {config.models.map((modelId) => {
                              const isSelected =
                                activeProviderId === pid &&
                                selectedModel === modelId

                              return (
                                <DropdownMenuItem
                                  key={modelId}
                                  onSelect={() => {
                                    setProvider(pid)
                                    setSelectedModel(modelId)
                                  }}
                                  className="flex cursor-pointer items-center justify-between gap-2 py-1.5 font-mono text-xs"
                                >
                                  <span>{modelId}</span>
                                  {isSelected && (
                                    <Check className="h-3.5 w-3.5 text-primary" />
                                  )}
                                </DropdownMenuItem>
                              )
                            })}
                            <DropdownMenuSeparator />
                          </DropdownMenuGroup>
                        )
                      }
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>

                <div className="mx-0.5 h-4 w-px bg-border/60" />

                {/* <label
                  aria-label="Attach brand asset"
                  className="cursor-pointer rounded-lg p-1.5 text-muted-foreground transition hover:bg-muted hover:text-foreground"
                >
                  <input className="hidden" type="file" />
                  <Paperclip className="h-4 w-4" />
                </label> */}
              </div>

              {/* Right: Submit or Stop Button */}
              {isGenerating ? (
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={stopGeneration}
                  className="h-8 px-2.5 text-xs"
                >
                  <IconPlayerStop size={13} className="mr-1" />
                  Stop
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => void handleSend()}
                  disabled={!inputPrompt.trim()}
                  className={cn(
                    "h-8 w-8 cursor-pointer rounded-lg p-0 transition-all",
                    inputPrompt.trim()
                      ? "border-primary/40 text-primary hover:bg-primary/10"
                      : "cursor-not-allowed text-muted-foreground opacity-40"
                  )}
                >
                  <ArrowRightStroke className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  // DEFAULT VIEW: Show the 4 cards that look like prompts (do not show current canvas layout)
  if (viewMode === "prompts") {
    return (
      <div className={`mx-auto w-full max-w-4xl space-y-8 ${className}`}>
        {/* Centered Prompt Input */}
        {renderPromptInput(true)}

        {/* 4 Cards that look like prompts */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {BRAND_PROMPT_CARDS.map((card) => (
              <div
                key={card.id}
                onClick={() => handleSelectPrompt(card.prompt)}
                className="group relative flex cursor-pointer flex-col justify-between rounded-2xl border border-border/80 bg-card/30 p-5 text-left backdrop-blur-xs transition-all duration-200"
              >
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    {/* <h6>{card.title}</h6> */}
                    <p className="line-clamp-3 text-xs">
                      &ldquo;{card.prompt}&rdquo;
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Local BYOK API Key Modal */}
        <ApiKeyModal
          isOpen={isKeyModalOpen}
          onClose={() => setKeyModalOpen(false)}
        />
      </div>
    )
  }

  // CANVAS VIEW: Triggered when user runs a prompt or opens the studio canvas
  return (
    <div className={`w-full max-w-5xl space-y-6 pb-52 ${className}`}>
      {/* Top Workspace Header */}
      <div className="flex flex-col gap-3 rounded-2xl border border-border/80 bg-card p-4 shadow-xs sm:flex-row sm:items-center sm:justify-between">
        {/* Active Project & Status */}
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary">
            <IconSparkles size={18} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-bold text-foreground">
                {activeBrandName || draft.brandName || "Untitled Project"}
              </h1>
              {activeProjectId && !activeProjectId.startsWith("demo-") && (
                <Link
                  to="/studio/$projectId"
                  params={{ projectId: activeProjectId }}
                  search={{ step: 1 }}
                  className="inline-flex items-center gap-1 text-[11px] text-primary hover:underline"
                >
                  <span>Open in Studio</span>
                  <IconExternalLink size={11} />
                </Link>
              )}
            </div>
            <p className="text-[11px] text-muted-foreground">
              Connected model:{" "}
              <span className="font-mono font-medium text-foreground">
                {selectedModel}
              </span>
            </p>
          </div>
        </div>

        {/* Studio Actions */}
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setViewMode("prompts")}
            className="h-8 text-xs font-medium"
            title="View prompt starters"
          >
            <IconSparkles size={14} className="mr-1.5 text-primary" />
            Prompts
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="h-8 text-xs text-muted-foreground hover:text-foreground"
            title="Reset to default blueprint"
          >
            <IconRotate size={14} className="mr-1" />
            Reset
          </Button>

          <Button
            type="button"
            variant="default"
            size="sm"
            onClick={syncToBrandStore}
            className="h-8 text-xs font-semibold shadow-xs"
          >
            <IconCloudCheck size={14} className="mr-1.5" />
            Sync to Studio
          </Button>
        </div>
      </div>

      {/* Interactive Tabs Navigation */}
      <div className="flex items-center gap-1.5 overflow-x-auto border-b border-border/80 pb-2">
        {tabsConfig.map((tab) => {
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex shrink-0 cursor-pointer items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all ${
                isActive
                  ? "bg-foreground text-background shadow-xs"
                  : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* Streaming Status Alert */}
      {isGenerating && (
        <div className="flex items-center justify-between rounded-xl border border-primary/30 bg-primary/10 px-4 py-2.5 text-xs text-primary shadow-xs">
          <div className="flex items-center gap-2">
            <Loader size="sm" className="size-3.5" />
            <span className="font-semibold">
              AI Agent is streaming brand updates into the canvas...
            </span>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={stopGeneration}
            className="h-6 border-primary/40 bg-background px-2 text-[11px] text-foreground"
          >
            <IconPlayerStop size={12} className="mr-1" />
            Stop Stream
          </Button>
        </div>
      )}

      {/* Main Tab Content Panel */}
      <div className="min-h-[380px] rounded-2xl border border-border/80 bg-card/60 p-5 shadow-xs backdrop-blur-xs">
        {activeTab === "strategy" && <AiStrategyTab />}
        {activeTab === "colors" && <AiColorsTab />}
        {activeTab === "typography" && <AiTypographyTab />}
        {activeTab === "guidelines" && <AiGuidelinesTab />}
        {activeTab === "log" && <AiLogTab />}
      </div>

      {/* Fixed Sticky Bottom Bar */}
      <div className="pointer-events-auto fixed bottom-6 left-1/2 z-40 w-full max-w-2xl -translate-x-1/2 px-4">
        {/* Guided Onboarding Questions Pills Carousel */}
        {messages.length <= 1 && (
          <div className="mb-2 flex [scrollbar-width:none] items-center gap-1.5 overflow-x-auto pb-1">
            {GUIDED_BRAND_QUESTIONS.map((question, i) => (
              <button
                key={`q-${i}`}
                type="button"
                onClick={() => handleQuestionClick(question)}
                className="inline-flex shrink-0 cursor-pointer items-center gap-1 rounded-full border border-border/70 bg-card/90 px-3 py-1 text-[11px] font-medium text-muted-foreground backdrop-blur-md transition hover:border-primary/50 hover:bg-muted hover:text-foreground"
              >
                <span className="font-bold text-primary">{i + 1}.</span>
                <span>{question}</span>
              </button>
            ))}
          </div>
        )}

        {renderPromptInput(false)}
      </div>

      {/* Local BYOK API Key Modal */}
      <ApiKeyModal
        isOpen={isKeyModalOpen}
        onClose={() => setKeyModalOpen(false)}
      />
    </div>
  )
}

export default AiChat
