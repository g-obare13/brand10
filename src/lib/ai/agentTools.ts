/**
 * @file agentTools.ts
 * @description OpenAPI-compliant tool specifications and system prompts
 * for generating, mutating, and structuring brand identity states.
 */

import { CURATED_PAIRINGS } from "@/data/fonts"

/**
 * List of verified supported Google font family names in Brand Studio.
 */
export const SUPPORTED_FONT_FAMILIES = Array.from(
  new Set(
    CURATED_PAIRINGS.flatMap((pairing) => [
      pairing.display,
      pairing.body,
      pairing.mono,
    ])
  )
)

/**
 * OpenAPI-compatible tool schema definitions for the brand guideline agent.
 */
export const BRAND_AGENT_TOOLS = [
  {
    type: "function",
    function: {
      name: "updateBrandStrategy",
      description:
        "Update the core brand strategic pillars, name, tagline, mission, vision, and tonal voice ratings.",
      parameters: {
        type: "object",
        properties: {
          brandName: { type: "string", description: "The official name of the brand." },
          tagline: { type: "string", description: "Short memorable brand tagline or elevator punchline." },
          mission: { type: "string", description: "Comprehensive mission statement of what the company does." },
          vision: { type: "string", description: "Aspirational long-term vision declaration." },
          coreValues: {
            type: "array",
            items: { type: "string" },
            description: "3 to 5 core brand cultural and operational values.",
          },
          brandPillars: {
            type: "array",
            items: {
              type: "object",
              properties: {
                title: { type: "string", description: "Pillar title." },
                desc: { type: "string", description: "Pillar description and reasoning." },
              },
              required: ["title", "desc"],
            },
            description: "3 to 4 defining strategic brand pillars.",
          },
          toneRatings: {
            type: "object",
            properties: {
              formal: { type: "number", minimum: 0, maximum: 100, description: "0 (Casual) to 100 (Formal)." },
              playful: { type: "number", minimum: 0, maximum: 100, description: "0 (Serious) to 100 (Playful)." },
              minimalist: { type: "number", minimum: 0, maximum: 100, description: "0 (Ornate) to 100 (Minimal)." },
              bold: { type: "number", minimum: 0, maximum: 100, description: "0 (Subtle) to 100 (Disruptive)." },
            },
            required: ["formal", "playful", "minimalist", "bold"],
            description: "Brand voice position across 4 semantic axes.",
          },
        },
        required: ["brandName", "tagline", "mission", "vision", "coreValues", "brandPillars", "toneRatings"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "updateColorPalette",
      description:
        "Update the brand color system with 4 to 6 harmonious, high-contrast swatches with designated functional roles.",
      parameters: {
        type: "object",
        properties: {
          colorPalette: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: { type: "string", description: "Evocative human-friendly name (e.g. Deep Forest)." },
                hex: { type: "string", description: "6-character hex code starting with '#' (e.g. #1B4332)." },
                role: {
                  type: "string",
                  enum: ["primary", "secondary", "accent", "neutral", "surface"],
                  description: "Designated role in the design system.",
                },
                usagePercent: { type: "number", description: "Approximate percentage distribution (summing to 100)." },
              },
              required: ["name", "hex", "role"],
            },
            description: "Array of brand swatches with primary, secondary, accent, and neutral colors.",
          },
        },
        required: ["colorPalette"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "updateTypography",
      description:
        "Select harmonious display, body, and monospace font pairings from the studio font library.",
      parameters: {
        type: "object",
        properties: {
          displayFont: {
            type: "string",
            description: `Heading font. Must be one of: ${SUPPORTED_FONT_FAMILIES.join(", ")}`,
          },
          bodyFont: {
            type: "string",
            description: `Body font. Must be one of: ${SUPPORTED_FONT_FAMILIES.join(", ")}`,
          },
          monoFont: {
            type: "string",
            description: `Monospace font. Must be one of: ${SUPPORTED_FONT_FAMILIES.join(", ")}`,
          },
        },
        required: ["displayFont", "bodyFont", "monoFont"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "updateGuidelines",
      description:
        "Set actionable visual design do's and don'ts for logos, color contrast, and brand voice.",
      parameters: {
        type: "object",
        properties: {
          dosAndDonts: {
            type: "array",
            items: {
              type: "object",
              properties: {
                rule: { type: "string", description: "Short actionable rule title (e.g. Maintain mark clearspace)." },
                type: { type: "string", enum: ["do", "dont"], description: "Whether this is a recommended Do or a forbidden Don't." },
                detail: {
                  type: "string",
                  description: "Specific explanation, measurements, or context for the rule.",
                },
              },
              required: ["rule", "type", "detail"],
            },
            description: "List of 4 to 8 explicit visual and tactical guidelines.",
          },
        },
        required: ["dosAndDonts"],
      },
    },
  },
]

/**
 * System prompt instructing the AI agent on personality, design principles, and tool usage.
 */
export const BRAND_AGENT_SYSTEM_PROMPT = `You are the Lead Brand Systems Architect at Brand Studio.
Your mission is to craft world-class, coherent, accessible, and timeless brand identities for users based on their vision.

When a user provides a brief, brand idea, or feedback:
1. Provide a succinct, inspiring, and professional editorial response outlining your strategic concept.
2. In the SAME turn, call the available tools to update the brand draft:
   - Call \`updateBrandStrategy\` with the brand name, tagline, mission, vision, core values, pillars, and voice tone ratings (0-100).
   - Call \`updateColorPalette\` with 4 to 5 cohesive swatches (60% primary, 30% secondary/neutral, 10% accent). Always ensure high contrast compliance with WCAG standards.
   - Call \`updateTypography\` choosing from the whitelisted font catalog: ${SUPPORTED_FONT_FAMILIES.join(", ")}.
   - Call \`updateGuidelines\` providing 4 to 6 explicit, actionable Do's and Don'ts for mark clearspace, color rules, and layout hierarchy.

If the user only asks for a specific modification (e.g. "make the accent color brighter" or "adjust the tone to be more casual"):
- Only call the specific tool related to their request (e.g. \`updateColorPalette\` or \`updateBrandStrategy\`).
- Explain the visual rationale behind the refinement concisely.

Tone and style:
- Speak like an executive creative director: clear, decisive, sophisticated, and articulate.
- Avoid generic cliches.
- Never use em dashes in your response; use colons or parentheticals instead.
`
