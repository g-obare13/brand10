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
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import {
  IconKey,
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
  const { activeProviderId, setProvider, checkConfiguredKey } =
    useAiAgentStore()

  const [selectedProvider, setSelectedProvider] =
    useState<AiProviderId>(activeProviderId)
  const [keyInput, setKeyInput] = useState("")
  const [showKey, setShowKey] = useState(false)
  const [isTesting, setIsTesting] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [testResult, setTestResult] = useState<{
    ok: boolean
    message: string
  } | null>(null)

  const providerConfig = AI_PROVIDERS[selectedProvider]

  // Reset to activeProviderId only when modal opens
  useEffect(() => {
    if (isOpen) {
      const initialProvider = AI_PROVIDERS[activeProviderId].hidden
        ? "openapi"
        : activeProviderId
      setSelectedProvider(initialProvider)
      setTestResult(null)
    }
  }, [isOpen, activeProviderId])

  // Load current saved key when provider changes or modal opens
  useEffect(() => {
    if (!isOpen) return
    let isMounted = true
    async function loadKey() {
      setTestResult(null)
      const existingKey = await getApiKey(selectedProvider)
      if (isMounted) {
        setKeyInput(existingKey || "")
      }
    }
    void loadKey()
    return () => {
      isMounted = false
    }
  }, [isOpen, selectedProvider])

  const handleTest = async () => {
    setIsTesting(true)
    setTestResult(null)

    try {
      const result = await testOpenApiConnection(
        providerConfig.baseUrl,
        keyInput
      )
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
        description:
          "Your key is encrypted locally with AES-GCM and will never be shared.",
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
          {/* <div className="flex items-center gap-2 text-primary">
            <IconShieldLock size={20} />
            <Badge variant="secondary" className="px-2 py-0 text-[10px] uppercase font-mono">
              Local BYOK Encryption
            </Badge>
          </div> */}
          <DialogTitle className="font-heading text-lg font-bold text-foreground">
            Configure AI Provider Key
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Paste your API key for {providerConfig.name}. Keys are encrypted on
            your local device using WebCrypto AES-GCM and never sent to any
            cloud database.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-3">
          {/* Provider Selector Tabs */}
          <div className="space-y-1.5">
            <Label>Select Provider</Label>
            <Tabs
              value={selectedProvider}
              onValueChange={(val) => {
                if (val) {
                  setSelectedProvider(val as AiProviderId)
                  setTestResult(null)
                }
              }}
              className="w-full"
            >
              <TabsList className="grid h-auto w-full grid-cols-3 rounded-xl p-1">
                {(Object.keys(AI_PROVIDERS) as AiProviderId[])
                  .filter((pid) => !AI_PROVIDERS[pid].hidden)
                  .map((pid) => (
                    <TabsTrigger
                      key={pid}
                      value={pid}
                      className="rounded-lg px-2 py-1.5 text-xs font-medium data-active:bg-background data-active:font-semibold data-active:text-foreground data-active:shadow-xs"
                    >
                      {AI_PROVIDERS[pid].name.split(" ")[0]}
                    </TabsTrigger>
                  ))}
              </TabsList>
            </Tabs>
          </div>

          {/* API Key Input */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label>{providerConfig.name} API Key</Label>
              {providerConfig.docsUrl && (
                <a
                  href={providerConfig.docsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
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
              />
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                onClick={() => setShowKey(!showKey)}
                className="absolute top-1/2 right-2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label={showKey ? "Hide API key" : "Show API key"}
                icon={
                  showKey ? <IconEyeOff size={16} /> : <IconEye size={16} />
                }
              />
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
                <IconCheck size={16} className="mt-0.5 shrink-0" />
              ) : (
                <IconAlertCircle size={16} className="mt-0.5 shrink-0" />
              )}
              <span>{testResult.message}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between border-t border-border/60 pt-2">
            <div>
              {keyInput && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleClear}
                  className="text-xs text-destructive hover:bg-destructive/10 hover:text-destructive"
                  icon={<IconTrash size={14} />}
                  iconPlacement="left"
                >
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
                loading={isTesting}
                iconPlacement="left"
                className="text-xs"
              >
                {isTesting ? "Testing..." : "Test Connection"}
              </Button>

              <Button
                type="button"
                variant="default"
                size="sm"
                onClick={handleSave}
                disabled={isSaving || !keyInput}
                loading={isSaving}
                icon={<IconKey size={14} />}
                iconPlacement="left"
                className="text-xs font-semibold"
              >
                {isSaving ? "Saving..." : "Save Key"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
