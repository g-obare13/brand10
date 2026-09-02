-- Migration: Add missing brand fields to brand_data table
-- Persists rules, imagery configuration, and iconography settings

ALTER TABLE brand_data
  ADD COLUMN IF NOT EXISTS dos_and_donts JSONB DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS imagery_mood TEXT DEFAULT 'minimal',
  ADD COLUMN IF NOT EXISTS imagery_overlay TEXT DEFAULT 'none',
  ADD COLUMN IF NOT EXISTS icon_style TEXT DEFAULT 'stroke',
  ADD COLUMN IF NOT EXISTS icon_radius NUMERIC DEFAULT 4,
  ADD COLUMN IF NOT EXISTS icon_stroke NUMERIC DEFAULT 2.0;
