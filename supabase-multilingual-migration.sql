-- Multilingual Support Migration
-- Run this in Supabase Dashboard > SQL Editor

-- Add Arabic fields to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS name_ar TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS description_ar TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS short_description_ar TEXT;


-- Add Arabic fields to categories table
ALTER TABLE categories ADD COLUMN IF NOT EXISTS name_ar TEXT;
ALTER TABLE categories ADD COLUMN IF NOT EXISTS description_ar TEXT;
