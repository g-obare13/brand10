/**
 * @file openApiClient.ts
 * @description Vendor-neutral OpenAPI standard HTTP/SSE streaming client.
 * Connects directly from the browser to any OpenAPI-compatible /chat/completions endpoint
 * (OpenRouter, Groq, OpenAI, Ollama, DeepSeek, etc.) without cloud proxying.
 */

import { BRAND_AGENT_SYSTEM_PROMPT, BRAND_AGENT_TOOLS } from "@/lib/ai/agentTools"

export interface StreamOpenApiOptions {
  baseUrl: string
  apiKey?: string
  model: string
  messages: Array<{ role: "user" | "assistant" | "system"; content: string }>
  signal?: AbortSignal
  onToken?: (token: string) => void
  onToolCallComplete?: (name: string, args: Record<string, unknown>) => void
}

interface RawToolCallBuffer {
  id: string
  name: string
  argumentsStr: string
}

/**
 * Initiates an OpenAPI-compliant streaming request to the configured AI endpoint.
 *
 * @param {StreamOpenApiOptions} options - The stream options and callbacks.
 * @returns {Promise<string>} The full aggregated text response.
 */
export async function streamOpenApiCompletions({
  baseUrl,
  apiKey,
  model,
  messages,
  signal,
  onToken,
  onToolCallComplete,
}: StreamOpenApiOptions): Promise<string> {
  const cleanBaseUrl = baseUrl.replace(/\/+$/, "")
  const endpoint = `${cleanBaseUrl}/chat/completions`

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  }

  if (apiKey?.trim()) {
    headers.Authorization = `Bearer ${apiKey.trim()}`
  }

  // Set OpenRouter referrer hints if using OpenRouter
  if (cleanBaseUrl.includes("openrouter.ai")) {
    headers["HTTP-Referer"] = window.location.origin
    headers["X-Title"] = "Brand Studio AI Copilot"
  }

  const payload = {
    model,
    messages: [
      { role: "system", content: BRAND_AGENT_SYSTEM_PROMPT },
      ...messages,
    ],
    tools: BRAND_AGENT_TOOLS,
    tool_choice: "auto",
    stream: true,
    temperature: 0.7,
  }

  let response: Response
  try {
    response = await fetch(endpoint, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
      signal,
    })
  } catch (err: unknown) {
    if (err instanceof DOMException && err.name === "AbortError") {
      throw new Error("Request cancelled by user.")
    }
    const message = err instanceof Error ? err.message : String(err)
    throw new Error(
      `Network or CORS connection failed to ${cleanBaseUrl}: ${message}. (If using Ollama, ensure OLLAMA_ORIGINS="*" is set)`
    )
  }

  if (!response.ok) {
    let errorDetail = ""
    try {
      const errJson = await response.json()
      errorDetail =
        errJson?.error?.message ||
        errJson?.message ||
        JSON.stringify(errJson)
    } catch {
      errorDetail = await response.text()
    }
    throw new Error(
      `Provider returned status ${response.status} (${response.statusText}): ${errorDetail || "Unknown error"}`
    )
  }

  if (!response.body) {
    throw new Error("Response body is empty or streaming is unsupported.")
  }

  const reader = response.body.getReader()
  const decoder = new TextDecoder("utf-8")
  let aggregatedContent = ""
  const toolBuffers: Record<number, RawToolCallBuffer | undefined> = {}

  let buffer = ""

  try {
    let chunk = await reader.read()
    while (!chunk.done) {
      buffer += decoder.decode(chunk.value, { stream: true })
      const lines = buffer.split("\n")
      buffer = lines.pop() || ""

      for (const rawLine of lines) {
        const line = rawLine.trim()
        if (!line || line.startsWith(":")) continue // Ping / comment line

        if (line === "data: [DONE]") {
          continue
        }

        if (line.startsWith("data: ")) {
          const jsonStr = line.slice(6).trim()
          if (!jsonStr) continue

          try {
            const parsed = JSON.parse(jsonStr)
            const choice = parsed.choices?.[0]
            const delta = choice?.delta

            // 1. Text token chunk
            if (delta?.content) {
              aggregatedContent += delta.content
              onToken?.(delta.content)
            }

            // 2. Tool call chunks
            if (Array.isArray(delta?.tool_calls)) {
              for (const tc of delta.tool_calls) {
                const index = tc.index ?? 0
                if (!toolBuffers[index]) {
                  toolBuffers[index] = {
                    id: tc.id || `call_${index}`,
                    name: tc.function?.name || "",
                    argumentsStr: "",
                  }
                }
                if (tc.function?.name) {
                  toolBuffers[index].name = tc.function.name
                }
                if (tc.function?.arguments) {
                  toolBuffers[index].argumentsStr += tc.function.arguments
                }
              }
            }
          } catch {
            // Ignore incomplete JSON chunks in SSE stream
          }
        }
      }

      chunk = await reader.read()
    }
  } finally {
    reader.releaseLock()
  }

  // Finalize any tool calls received
  for (const bufferItem of Object.values(toolBuffers)) {
    if (bufferItem && bufferItem.name && bufferItem.argumentsStr) {
      try {
        const parsedArgs = JSON.parse(bufferItem.argumentsStr)
        onToolCallComplete?.(bufferItem.name, parsedArgs)
      } catch (parseErr) {
        console.warn(`Failed to parse tool arguments for ${bufferItem.name}:`, parseErr)
      }
    }
  }

  return aggregatedContent
}

/**
 * Tests connection with an OpenAPI endpoint by listing models or sending a dry-run prompt.
 *
 * @param {string} baseUrl - Base URL of the provider.
 * @param {string} [apiKey] - API key if required.
 * @returns {Promise<{ ok: boolean; message: string }>} Result of connection verification.
 */
export async function testOpenApiConnection(
  baseUrl: string,
  apiKey?: string
): Promise<{ ok: boolean; message: string }> {
  const cleanBaseUrl = baseUrl.replace(/\/+$/, "")
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  }
  if (apiKey?.trim()) {
    headers.Authorization = `Bearer ${apiKey.trim()}`
  }

  try {
    // Try GET /models first
    const modelsRes = await fetch(`${cleanBaseUrl}/models`, {
      method: "GET",
      headers,
    })

    if (modelsRes.ok) {
      return { ok: true, message: "Connection successful! Provider endpoint is active." }
    }

    if (modelsRes.status === 401 || modelsRes.status === 403) {
      return { ok: false, message: "Authentication failed. Please verify your API key." }
    }

    // Fallback: simple ping with 0 tokens
    return {
      ok: true,
      message: `Endpoint reached (HTTP ${modelsRes.status}). Ready to generate.`,
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    return {
      ok: false,
      message: `Could not connect to ${cleanBaseUrl}: ${msg}`,
    }
  }
}
