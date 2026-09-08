/**
 * @file ApiKeyModal.tsx
 * @description Modal allowing users to securely manage their API keys for
 * Google Gemini, Anthropic Claude, DeepSeek, and OpenAI.
 * Encrypts keys locally using AES-GCM without sending credentials to any cloud server.
 */

import { useState, useEffect } from "react"
import { AI_PROVIDERS } from "@/data/aiProviders"
import { getApiKey, removeApiKey, saveApiKey } from "@/lib/ai/keyStorage"
import { testOpenApiConnection } from "@/lib/ai/openApiClient"
import { useAiAgentStore } from "@/store/aiAgentStore"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader } from "@/components/ui/loader"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import {
  IconKey,
  IconShieldLock,
  IconCheck,
  IconAlertCircle,
  IconEye,
  IconEyeOff,
  IconExternalLink,
  IconTrash,
} from "@tabler/icons-react"
import type { AiProviderId } from "@/types/ai"

interface ApiKeyModalProps {
  isOpen: boolean
  onClose: () => void
}

/**
 * Dialog for BYOK key configuration, encryption, and provider connection testing.
 *
 * @component
 * @param {ApiKeyModalProps} props - Component properties.
 * @returns {React.ReactElement}
 */
export function ApiKeyModal({ isOpen, onClose }: ApiKeyModalProps) {
  const {
    activeProviderId,
    setProvider,
    checkConfiguredKey,
  } = useAiAgentStore()

  const [selectedProvider, setSelectedProvider] = useState<AiProviderId>(activeProviderId)
  const [keyInput, setKeyInput] = useState("")
  const [showKey, setShowKey] = useState(false)
  const [isTesting, setIsTesting] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [testResult, setTestResult] = useState<{ ok: boolean; message: string } | null>(null)

  const providerConfig = AI_PROVIDERS[selectedProvider]

  // Load current saved key when provider changes or modal opens
  useEffect(() => {
    let isMounted = true
    async function loadKey() {
      setTestResult(null)
      const existingKey = await getApiKey(selectedProvider)
      if (isMounted) {
        setKeyInput(existingKey || "")
      }
    }
    if (isOpen) {
      setSelectedProvider(activeProviderId)
      void loadKey()
    }
    return () => {
      isMounted = false
    }
  }, [isOpen, selectedProvider, activeProviderId])

  const handleTest = async () => {
    setIsTesting(true)
    setTestResult(null)

    try {
      const result = await testOpenApiConnection(providerConfig.baseUrl, keyInput)
      setTestResult(result)
      if (result.ok) {
        toast.success("Connection test passed")
      } else {
        toast.error("Connection failed", { description: result.message })
      }
    } finally {
      setIsTesting(false)
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await saveApiKey(selectedProvider, keyInput)
      setProvider(selectedProvider)
      await checkConfiguredKey()

      toast.success("API key stored securely", {
        description: "Your key is encrypted locally with AES-GCM and will never be shared.",
      })
      onClose()
    } catch (err) {
      console.error("Failed to store API key:", err)
      toast.error("Failed to save key")
    } finally {
      setIsSaving(false)
    }
  }

  const handleClear = async () => {
    await removeApiKey(selectedProvider)
    setKeyInput("")
    setTestResult(null)
    await checkConfiguredKey()
    toast.info("Stored key removed")
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md rounded-2xl border border-border/80 bg-card p-6 shadow-2xl">
        <DialogHeader className="space-y-2">
          <div className="flex items-center gap-2 text-primary">
            <IconShieldLock size={20} />
            <Badge variant="secondary" className="px-2 py-0 text-[10px] uppercase font-mono">
              Local BYOK Encryption
            </Badge>
          </div>
          <DialogTitle className="font-heading text-lg font-bold text-foreground">
            Configure AI Provider Key
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Paste your API key for {providerConfig.name}. Keys are encrypted on your local device using WebCrypto AES-GCM and never sent to any cloud database.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-3">
          {/* Provider Selector Tabs */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              Select Provider
            </label>
            <div className="grid grid-cols-4 gap-1.5 rounded-xl border border-border/70 bg-muted/30 p-1">
              {(Object.keys(AI_PROVIDERS) as AiProviderId[]).map((pid) => {
                const isSelected = selectedProvider === pid
                return (
                  <button
                    key={pid}
                    type="button"
                    onClick={() => {
                      setSelectedProvider(pid)
                      setTestResult(null)
                    }}
                    className={`rounded-lg px-2 py-1.5 text-xs font-medium transition-all ${
                      isSelected
                        ? "bg-background text-foreground shadow-xs font-semibold"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {AI_PROVIDERS[pid].name.split(" ")[0]}
                  </button>
                )
              })}
            </div>
          </div>

          {/* API Key Input */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-foreground">
                {providerConfig.name} API Key
              </label>
              {providerConfig.docsUrl && (
                <a
                  href={providerConfig.docsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] text-primary hover:underline"
                >
                  <span>Get {providerConfig.name.split(" ")[0]} Key</span>
                  <IconExternalLink size={10} />
                </a>
              )}
            </div>

            <div className="relative">
              <Input
                type={showKey ? "text" : "password"}
                value={keyInput}
                onChange={(e) => {
                  setKeyInput(e.target.value)
                  setTestResult(null)
                }}
                placeholder={providerConfig.keyPlaceholder}
                className="pr-10 font-mono text-xs"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground transition hover:text-foreground"
                aria-label={showKey ? "Hide API key" : "Show API key"}
              >
                {showKey ? <IconEyeOff size={16} /> : <IconEye size={16} />}
              </button>
            </div>
          </div>

          {/* Test Status Banner */}
          {testResult && (
            <div
              className={`flex items-start gap-2 rounded-xl border p-2.5 text-xs ${
                testResult.ok
                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                  : "border-destructive/30 bg-destructive/10 text-destructive"
              }`}
            >
              {testResult.ok ? (
                <IconCheck size={16} className="shrink-0 mt-0.5" />
              ) : (
                <IconAlertCircle size={16} className="shrink-0 mt-0.5" />
              )}
              <span>{testResult.message}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-2 border-t border-border/60">
            <div>
              {keyInput && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleClear}
                  className="text-xs text-destructive hover:bg-destructive/10 hover:text-destructive"
                >
                  <IconTrash size={14} className="mr-1" />
                  Clear Key
                </Button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleTest}
                disabled={isTesting || !keyInput}
                className="text-xs"
              >
                {isTesting ? (
                  <>
                    <Loader size="sm" className="mr-1.5 size-3" />
                    <span>Testing...</span>
                  </>
                ) : (
                  <span>Test Connection</span>
                )}
              </Button>

              <Button
                type="button"
                variant="default"
                size="sm"
                onClick={handleSave}
                disabled={isSaving || !keyInput}
                className="text-xs font-semibold"
              >
                {isSaving ? (
                  <>
                    <Loader size="sm" className="mr-1.5 size-3" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <IconKey size={14} className="mr-1.5" />
                    <span>Save Key</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
