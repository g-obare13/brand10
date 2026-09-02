-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Brand Projects table
CREATE TABLE IF NOT EXISTS brand_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT 'Untitled Brand',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Brand Data table
CREATE TABLE IF NOT EXISTS brand_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES brand_projects(id) ON DELETE CASCADE UNIQUE,
  brand_name TEXT,
  tagline TEXT,
  mission TEXT,
  vision TEXT,
  core_values JSONB DEFAULT '[]',
  tone_ratings JSONB DEFAULT '{"formal": 50, "playful": 50, "minimalist": 50, "bold": 50}',
  design_movement TEXT DEFAULT 'semi-flat',
  logo_url TEXT,
  logo_variants JSONB DEFAULT '{}',
  clearspace_multiplier NUMERIC DEFAULT 1.0,
  color_palette JSONB DEFAULT '[]',
  display_font TEXT,
  body_font TEXT,
  monospace_font TEXT,
  base_font_size NUMERIC DEFAULT 16,
  type_scale_ratio NUMERIC DEFAULT 1.25,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ensure design_movement exists if table was already created
ALTER TABLE brand_data ADD COLUMN IF NOT EXISTS design_movement TEXT DEFAULT 'semi-flat';

-- Enable Row-Level Security
ALTER TABLE brand_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE brand_data ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Projects
DROP POLICY IF EXISTS "Users can view own projects" ON brand_projects;
CREATE POLICY "Users can view own projects" ON brand_projects FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create own projects" ON brand_projects;
CREATE POLICY "Users can create own projects" ON brand_projects FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own projects" ON brand_projects;
CREATE POLICY "Users can update own projects" ON brand_projects FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own projects" ON brand_projects;
CREATE POLICY "Users can delete own projects" ON brand_projects FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for Brand Data
DROP POLICY IF EXISTS "Users can view own brand data" ON brand_data;
CREATE POLICY "Users can view own brand data" ON brand_data FOR SELECT USING (EXISTS (SELECT 1 FROM brand_projects WHERE brand_projects.id = brand_data.project_id AND brand_projects.user_id = auth.uid()));

DROP POLICY IF EXISTS "Users can insert own brand data" ON brand_data;
CREATE POLICY "Users can insert own brand data" ON brand_data FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM brand_projects WHERE brand_projects.id = brand_data.project_id AND brand_projects.user_id = auth.uid()));

DROP POLICY IF EXISTS "Users can update own brand data" ON brand_data;
CREATE POLICY "Users can update own brand data" ON brand_data FOR UPDATE USING (EXISTS (SELECT 1 FROM brand_projects WHERE brand_projects.id = brand_data.project_id AND brand_projects.user_id = auth.uid()));

DROP POLICY IF EXISTS "Users can delete own brand data" ON brand_data;
CREATE POLICY "Users can delete own brand data" ON brand_data FOR DELETE USING (EXISTS (SELECT 1 FROM brand_projects WHERE brand_projects.id = brand_data.project_id AND brand_projects.user_id = auth.uid()));

-- Storage Bucket for Logos
INSERT INTO storage.buckets (id, name, public) 
VALUES ('brand-logos', 'brand-logos', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Users can upload own logos" ON storage.objects;
CREATE POLICY "Users can upload own logos" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'brand-logos' AND (storage.foldername(name))[1] = auth.uid()::text);

DROP POLICY IF EXISTS "Users can view own logos" ON storage.objects;
CREATE POLICY "Users can view own logos" ON storage.objects FOR SELECT USING (bucket_id = 'brand-logos');

DROP POLICY IF EXISTS "Users can delete own logos" ON storage.objects;
CREATE POLICY "Users can delete own logos" ON storage.objects FOR DELETE USING (bucket_id = 'brand-logos' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Trigger to enforce max 2 projects per user
CREATE OR REPLACE FUNCTION check_project_limit()
RETURNS TRIGGER AS $$
BEGIN
  IF (SELECT COUNT(*) FROM brand_projects WHERE user_id = NEW.user_id) >= 2 THEN
    RAISE EXCEPTION 'Maximum of 2 projects allowed per user';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS enforce_project_limit ON brand_projects;
CREATE TRIGGER enforce_project_limit
  BEFORE INSERT ON brand_projects
  FOR EACH ROW
  EXECUTE FUNCTION check_project_limit();
