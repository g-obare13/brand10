# AI Brand Guidelines TODO

This file captures the implementation backlog for a user-supplied-key AI workflow that generates complete brand guidelines and feeds the existing project, preview, and export systems.

## Current Architecture Findings

- The app already has an OpenAPI-compatible streaming client and provider selection.
- User API keys are stored locally through WebCrypto and IndexedDB, with a base64 `localStorage` fallback.
- The AI canvas already has editable strategy, colors, typography, guidelines, and chat views.
- `GeneratedBrandDraft` is separate from the canonical `BrandExportModel`.
- AI drafts are held in `aiAgentStore`; saved projects are handled by `brandStore` and `projectsStore`.
- Supabase persists owned projects and brand data with RLS policies.
- The existing PDF and ZIP exporters depend on the normalized brand export model.

## Priority 1: Make AI Output Production-Safe

- [ ] Unify `GeneratedBrandDraft` with `BrandExportModel`, or add one explicit, tested draft-to-export adapter.
- [ ] Expand AI output to cover logo guidance, clearspace, aspect ratio, imagery, iconography, and all fields required by the PDF manual.
- [ ] Add runtime validation at the tool-call boundary; TypeScript casts alone are insufficient.
- [ ] Validate required strings, array lengths, enum values, font support, hex colors, contrast ratios, and numeric ranges.
- [ ] Reject or repair invalid model output without mutating the canonical project.
- [ ] Add tests for valid output, malformed tool arguments, invalid colors, unsupported fonts, and missing fields.

## Priority 2: Build the Generation Workflow

- [ ] Define a structured brand brief covering company, audience, market, positioning, personality, competitors, visual direction, and constraints.
- [ ] Generate the document in sections: foundation, voice and tone, color, typography, logo usage, imagery, iconography, and do/don't rules.
- [ ] Add an explicit generation plan and progress state so users can see which sections are complete.
- [ ] Keep the AI canvas as the review surface rather than creating a parallel editor.
- [ ] Add section-level regeneration, such as alternate palettes, revised mission statements, and different visual directions.
- [ ] Add an explicit `Apply to project` action before changing the canonical brand store.
- [ ] Make applying a draft a validated, atomic state transition that can be cancelled or retried.
- [ ] Preserve user edits when regenerating an unrelated section.

## Priority 3: Persist AI Documents and Revisions

- [ ] Add a project-scoped `brand_guideline_documents` record for the complete generated document.
- [ ] Add `brand_generation_runs` for provider, model, prompt/intake version, output, validation result, timestamp, and optional cost metadata.
- [ ] Add `brand_generation_revisions` or document versioning for user edits and rollback.
- [ ] Store source references and provenance for generated sections where applicable.
- [ ] Ensure all AI records inherit project ownership and use strict Supabase RLS policies.
- [ ] Never store user API keys in Supabase or send them to the application API.
- [ ] Add schema/data versions so future document changes can be migrated safely.
- [ ] Add tests for save/load round trips and revision recovery.

## BYOK Security and Provider Support

- [ ] Keep direct browser-to-provider requests for the initial BYOK release.
- [ ] Remove the base64 `localStorage` API-key fallback, or clearly disable BYOK in environments without WebCrypto.
- [ ] Never log API keys, request headers, or complete provider payloads containing secrets.
- [ ] Add provider capability checks before generation, including tool-calling, streaming, JSON, and model availability.
- [ ] Add provider-specific adapters for OpenAPI-compatible services with non-standard behavior.
- [ ] Handle CORS, authentication, rate limits, cancellation, and provider error messages explicitly.
- [ ] Explain that browser-stored keys are accessible to page JavaScript and should be revocable.
- [ ] Consider an optional server proxy later for providers without CORS, team-managed keys, rate limiting, and usage tracking.

## Curated Knowledge Before RAG

- [ ] Create a compact internal knowledge layer for design movements, supported fonts, accessibility rules, guideline sections, templates, and export requirements.
- [ ] Inject that knowledge as structured prompt context instead of adding embeddings immediately.
- [ ] Keep the knowledge versioned so generated documents can be traced to the rules used.
- [ ] Use the existing design movements, font data, presets, and export model as authoritative constraints.

## RAG: Add Only When Reference Sources Are Needed

RAG is not required for the first complete release. Add it when users can provide meaningful reference material.

- [ ] Support project-scoped uploads for existing brand manuals, websites, product descriptions, research, competitor notes, and messaging guidelines.
- [ ] Extract text from uploaded files and URLs with size, type, and timeout limits.
- [ ] Chunk and embed content per project; never mix private project material in shared retrieval.
- [ ] Retrieve only the relevant source chunks for each generated section.
- [ ] Show source references or provenance indicators in the AI canvas.
- [ ] Allow users to delete source files and all derived chunks/embeddings.
- [ ] Add RLS and deletion tests for uploaded sources and embeddings.
- [ ] Use a server-side pipeline for extraction and embeddings rather than exposing embedding provider keys in the browser.

## Recommended Implementation Order

1. Unify the AI draft and export document schemas.
2. Add runtime validation and an explicit draft-to-project adapter.
3. Complete the AI canvas fields required by the PDF and ZIP exporters.
4. Add structured intake, full-document generation, and section regeneration.
5. Add the validated `Apply to project` flow.
6. Persist generation runs and document revisions.
7. Harden BYOK storage and provider capability handling.
8. Add curated internal knowledge.
9. Add project-scoped RAG after reference uploads are a real user workflow.

## Definition of Done

- [ ] A user can enter a structured brief and generate a complete guideline document with their own provider key.
- [ ] The result passes runtime validation before it enters the project store.
- [ ] The user can edit or regenerate individual sections without losing unrelated edits.
- [ ] The applied result loads correctly in the existing studio, PDF preview, PDF export, ZIP export, and token export.
- [ ] Projects, generation runs, and revisions are private to the owning user.
- [ ] API keys never leave the browser or enter application logs/database records.
- [ ] Failed generation, validation, persistence, and export operations preserve the last valid user state.