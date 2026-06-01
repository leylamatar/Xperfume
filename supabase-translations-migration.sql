-- Translations Table Migration
-- Run this in your Supabase SQL Editor

-- Create the translations table
CREATE TABLE IF NOT EXISTS translations (
    id SERIAL PRIMARY KEY,
    key TEXT NOT NULL,
    value TEXT NOT NULL,
    lang TEXT NOT NULL CHECK (lang IN ('en', 'ar')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add unique constraint on key and lang
ALTER TABLE translations ADD CONSTRAINT unique_translation_key_lang UNIQUE (key, lang);

-- Enable row level security (RLS)
ALTER TABLE translations ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read (for frontend)
CREATE POLICY "Allow public read access"
    ON translations
    FOR SELECT
    USING (true);

-- Create policy to allow authenticated users to update/insert/delete (for admin panel)
CREATE POLICY "Allow authenticated users full access"
    ON translations
    FOR ALL
    USING (auth.uid() IS NOT NULL)
    WITH CHECK (auth.uid() IS NOT NULL);
