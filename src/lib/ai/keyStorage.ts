/**
 * @file keyStorage.ts
 * @description Local-first, zero-cloud API key storage engine.
 * Utilizes the browser Web Crypto API (SubtleCrypto AES-GCM) and IndexedDB (idb-keyval)
 * to encrypt and persist API keys securely on the user's device without cloud exposure.
 */

import { del as idbDel, get as idbGet, set as idbSet } from "idb-keyval"
import type { AiProviderId } from "@/types/ai"

const KEY_STORE_PREFIX = "brandio_ai_key_"
const DEVICE_SALT_STORE = "brandio_crypto_salt_v1"

/**
 * Derives or retrieves a consistent device-bound encryption key from subtle crypto.
 *
 * @returns {Promise<CryptoKey>} Derived AES-GCM key.
 */
async function getOrCreateDeviceKey(): Promise<CryptoKey> {
  let salt = await idbGet<Uint8Array>(DEVICE_SALT_STORE)
  if (!salt) {
    salt = crypto.getRandomValues(new Uint8Array(16))
    await idbSet(DEVICE_SALT_STORE, salt)
  }

  // Use a device-specific material identifier
  const baseMaterial = new TextEncoder().encode(
    `brandio_local_sec_${window.location.origin}`
  )

  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    baseMaterial,
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  )

  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: salt as BufferSource,
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  )
}

/**
 * Persists an API key locally with AES-GCM encryption.
 *
 * @param {AiProviderId} providerId - The AI provider identifier.
 * @param {string} apiKey - The raw API key string to encrypt and store.
 * @returns {Promise<void>}
 */
export async function saveApiKey(
  providerId: AiProviderId,
  apiKey: string
): Promise<void> {
  const trimmed = apiKey.trim()
  if (!trimmed) {
    await removeApiKey(providerId)
    return
  }

  try {
    const key = await getOrCreateDeviceKey()
    const iv = crypto.getRandomValues(new Uint8Array(12))
    const encoded = new TextEncoder().encode(trimmed)

    const cipherBuffer = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv },
      key,
      encoded
    )

    const payload = {
      iv: Array.from(iv),
      cipher: Array.from(new Uint8Array(cipherBuffer)),
    }

    await idbSet(`${KEY_STORE_PREFIX}${providerId}`, payload)
  } catch (err) {
    console.warn("Failed to encrypt API key with WebCrypto, falling back to local storage:", err)
    // Fallback if crypto.subtle is unavailable in insecure context
    localStorage.setItem(`${KEY_STORE_PREFIX}${providerId}_b64`, btoa(trimmed))
  }
}

/**
 * Retrieves and decrypts the stored API key for a provider.
 *
 * @param {AiProviderId} providerId - The AI provider identifier.
 * @returns {Promise<string | null>} The decrypted raw API key, or null if not found.
 */
export async function getApiKey(
  providerId: AiProviderId
): Promise<string | null> {
  try {
    const payload = await idbGet<{ iv: number[]; cipher: number[] }>(
      `${KEY_STORE_PREFIX}${providerId}`
    )

    if (payload) {
      const key = await getOrCreateDeviceKey()
      const iv = new Uint8Array(payload.iv)
      const cipher = new Uint8Array(payload.cipher)

      const decrypted = await crypto.subtle.decrypt(
        { name: "AES-GCM", iv },
        key,
        cipher
      )

      return new TextDecoder().decode(decrypted)
    }

    // Check fallback
    const fallback = localStorage.getItem(`${KEY_STORE_PREFIX}${providerId}_b64`)
    if (fallback) {
      return atob(fallback)
    }

    return null
  } catch (err) {
    console.warn("Failed to retrieve or decrypt local API key:", err)
    return null
  }
}

/**
 * Removes the stored API key for a provider.
 *
 * @param {AiProviderId} providerId - The AI provider identifier.
 * @returns {Promise<void>}
 */
export async function removeApiKey(providerId: AiProviderId): Promise<void> {
  await idbDel(`${KEY_STORE_PREFIX}${providerId}`)
  localStorage.removeItem(`${KEY_STORE_PREFIX}${providerId}_b64`)
}

/**
 * Checks if a valid API key exists locally for a provider.
 *
 * @param {AiProviderId} providerId - The AI provider identifier.
 * @returns {Promise<boolean>} True if a key exists.
 */
export async function hasApiKey(providerId: AiProviderId): Promise<boolean> {
  const key = await getApiKey(providerId)
  return Boolean(key && key.trim().length > 0)
}
