/**
 * @file AiLogTab.tsx
 * @description Interactive canvas tab presenting the raw streaming transcript,
 * message history, and structured tool invocation steps.
 */

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Loader } from "@/components/ui/loader"
import { useAiAgentStore } from "@/store/aiAgentStore"
import {
  IconMessageCircle,
  IconTerminal2,
  IconSparkles,
  IconUser,
  IconTrash,
  IconCheck,
} from "@tabler/icons-react"
import type React from "react"

/**
 * Agent log and conversation history component.
 *
 * @component
 * @returns {React.ReactElement}
 */
export function AiLogTab(): React.ReactElement {
  const { messages, clearMessages, isGenerating } = useAiAgentStore()

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-border/60 pb-3">
        <div className="flex items-center gap-2">
          <IconTerminal2 size={16} className="text-primary" />
          <h6 className="text-xs font-bold uppercase tracking-wider text-foreground">
            Agent Turn Log &amp; Invocations
          </h6>
        </div>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={clearMessages}
          disabled={isGenerating || messages.length <= 1}
          className="text-xs h-7 text-muted-foreground hover:text-foreground"
        >
          <IconTrash size={12} className="mr-1" />
          Clear Log
        </Button>
      </div>

      <div className="space-y-4">
        {messages.map((msg) => {
          const isAssistant = msg.role === "assistant"

          return (
            <div
              key={msg.id}
              className={`rounded-2xl border p-4 shadow-xs transition-all ${
                isAssistant
                  ? "border-border/80 bg-card"
                  : "border-primary/20 bg-primary/5"
              }`}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div
                    className={`flex size-6 items-center justify-center rounded-full text-xs ${
                      isAssistant
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground"
                    }`}
                  >
                    {isAssistant ? (
                      <IconSparkles size={12} />
                    ) : (
                      <IconUser size={12} />
                    )}
                  </div>
                  <span className="text-xs font-bold text-foreground">
                    {isAssistant ? "Brand Copilot" : "You"}
                  </span>
                </div>

                <span className="text-[10px] text-muted-foreground font-mono">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </span>
              </div>

              {/* Message Content */}
              <div className="text-xs leading-relaxed text-foreground whitespace-pre-wrap">
                {msg.content}
                {msg.isStreaming && (
                  <span className="inline-flex items-center ml-2 text-primary">
                    <Loader size="sm" className="size-3.5 inline-block" />
                  </span>
                )}
              </div>

              {/* Tool Invocations */}
              {msg.toolInvocations && msg.toolInvocations.length > 0 && (
                <div className="mt-3 space-y-1.5 border-t border-border/50 pt-2.5">
                  <div className="text-[10px] font-mono font-semibold uppercase tracking-wider text-muted-foreground">
                    Executed Tool Invocations
                  </div>
                  <div className="space-y-1">
                    {msg.toolInvocations.map((inv) => (
                      <div
                        key={inv.id}
                        className="flex items-center justify-between rounded-lg border border-border/60 bg-muted/40 px-2.5 py-1.5 text-[11px]"
                      >
                        <div className="flex items-center gap-1.5">
                          <IconCheck size={12} className="text-emerald-500" />
                          <code className="font-mono text-primary font-semibold">
                            {inv.name}()
                          </code>
                          {inv.summary && (
                            <span className="text-muted-foreground ml-1">
                              {inv.summary}
                            </span>
                          )}
                        </div>
                        <Badge variant="secondary" className="px-1.5 py-0 text-[10px] font-mono">
                          Applied
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )
        })}

        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
            <IconMessageCircle size={24} className="mb-2 opacity-50" />
            <p className="text-xs">No conversation entries yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}
