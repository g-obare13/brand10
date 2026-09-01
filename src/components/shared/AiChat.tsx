"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import {
  ArrowRightStroke,
  Check,
  ChevronDown,
  Paperclip,
  Robot,
} from "@boxicons/react"

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
      <title>Anthropic</title>
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
      <title>Gemini</title>
      <defs>
        <linearGradient
          id="gemini-icon-fill"
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
        fill="url(#gemini-icon-fill)"
        fillRule="nonzero"
      />
    </svg>
  )
}

interface AIPromptProps {
  models?: string[]
  defaultModel?: string
  placeholder?: string
  headerText?: string
  headerAction?: string
  onSubmit?: (value: string, model: string) => void
  className?: string
}

const DEFAULT_MODELS = [
  "Gemini 3 Pro",
  "GPT-5.6 Mini",
  "Claude Fable 5",
  "GPT-5.6 Codex",
  "GPT-5.6",
]

export function AiChat({
  models = DEFAULT_MODELS,
  defaultModel = "Claude Fable 5",
  placeholder = "What can I do for you?",
  headerText = "is free this weekend!",
  headerAction = "Ship Now!",
  onSubmit,
  className,
}: AIPromptProps) {
  const [value, setValue] = useState("")
  const [selectedModel, setSelectedModel] = useState(defaultModel)

  const MODEL_ICONS: Record<string, React.ReactNode> = {
    "GPT-5.6 Mini": <OpenAiIcon className="h-3.5 w-3.5" />,
    "Gemini 3 Pro": <GeminiIcon className="h-3.5 w-3.5" />,
    "Claude Fable 5": <AnthropicIcon className="h-3.5 w-3.5" />,
    "GPT-5.6 Codex": <OpenAiIcon className="h-3.5 w-3.5" />,
    "GPT-5.6": <OpenAiIcon className="h-3.5 w-3.5" />,
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      if (!value.trim()) return
      onSubmit?.(value, selectedModel)
      setValue("")
    }
  }

  const handleSend = () => {
    if (!value.trim()) return
    onSubmit?.(value, selectedModel)
    setValue("")
  }

  return (
    <div className={cn("w-full max-w-2xl py-4", className)}>
      <div className="rounded-2xl border bg-neutral-100 p-1.5 pt-4 backdrop-blur-xl dark:bg-neutral-900/75">
        <div className="mx-2 mb-2.5 flex items-center gap-2">
          <div className="flex flex-1 items-center gap-2">
            <OpenAiIcon className="h-3.5 w-3.5 text-foreground" />
            <h6 className="text-xs">{headerText}</h6>
          </div>
          <p className="text-xs text-primary">{headerAction}</p>
        </div>
        <div className="relative">
          <div className="relative flex flex-col gap-0 overflow-hidden rounded-xl bg-neutral-200/75 dark:bg-neutral-950/75">
            <div className="overflow-y-auto">
              <Textarea
                className={cn(
                  "w-full resize-none rounded-xl rounded-b-none border-none bg-transparent p-3 text-foreground dark:bg-neutral-950/75"
                )}
                id="ai-input-15"
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                value={value}
              />
            </div>

            <div className="flex h-14 items-center rounded-b-xl px-3">
              <div className="flex w-full items-center justify-between">
                <div className="flex items-center gap-2">
                  <DropdownMenu modal={false}>
                    <DropdownMenuTrigger asChild>
                      <Button
                        className="flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-xs text-foreground hover:bg-muted/80 focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-0"
                        variant="ghost"
                      >
                        <div className="flex items-center gap-1.5">
                          {MODEL_ICONS[selectedModel] || (
                            <Robot className="h-3.5 w-3.5 opacity-60" />
                          )}
                          <span className="font-medium">{selectedModel}</span>
                          <ChevronDown className="h-3 w-3 opacity-50" />
                        </div>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="min-w-44 border-border/80 bg-popover text-popover-foreground shadow-xl">
                      {models.map((model) => (
                        <DropdownMenuItem
                          className="flex cursor-pointer items-center justify-between gap-2"
                          key={model}
                          onSelect={() => setSelectedModel(model)}
                        >
                          <div className="flex items-center gap-2">
                            {MODEL_ICONS[model] || (
                              <Robot className="h-3.5 w-3.5 opacity-60" />
                            )}
                            <span>{model}</span>
                          </div>
                          {selectedModel === model && (
                            <Check className="h-3.5 w-3.5 text-primary" />
                          )}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <div className="mx-0.5 h-4 w-px bg-border" />
                  <label
                    aria-label="Attach file"
                    className="cursor-pointer rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-0"
                  >
                    <input className="hidden" type="file" />
                    <Paperclip className="h-4 w-4" />
                  </label>
                </div>
                <Button
                  variant={"outline"}
                  aria-label="Send message"
                  onClick={handleSend}
                  className={cn(
                    "cursor-pointer rounded-lg p-2 transition-all hover:bg-muted focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-0",
                    value.trim()
                      ? "text-primary"
                      : "cursor-not-allowed text-muted-foreground opacity-40"
                  )}
                  disabled={!value.trim()}
                  type="button"
                >
                  <ArrowRightStroke className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AiChat
