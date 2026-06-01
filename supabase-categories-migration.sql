-- Categories Table Migration
-- Run this in Supabase Dashboard > SQL Editor

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add new columns to products table
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES categories(id);

ALTER TABLE products 
ADD COLUMN IF NOT EXISTS is_best_seller BOOLEAN DEFAULT FALSE;

ALTER TABLE products 
ADD COLUMN IF NOT EXISTS featured_order INTEGER DEFAULT NULL;

ALTER TABLE products 
ADD COLUMN IF NOT EXISTS best_seller_order INTEGER DEFAULT NULL;

-- Enable RLS on categories
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- RLS Policies for categories
-- Public can view active categories
CREATE POLICY "Public can view active categories" 
ON categories FOR SELECT 
USING (is_active = true);

-- Admins can manage categories
CREATE POLICY "Admins can manage categories" 
ON categories ALL 
USING (
  EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid()
  )
);

-- Insert default categories
INSERT INTO categories (name, slug, description, sort_order) VALUES
('Women Perfume', 'women-perfume', 'Luxury fragrances for women', 1),
('Men Perfume', 'men-perfume', 'Sophisticated scents for men', 2),
('Unisex Perfume', 'unisex-perfume', 'Fragrances for everyone', 3),
('Niche Perfume', 'niche-perfume', 'Exclusive and rare fragrances', 4),
('Gift Sets', 'gift-sets', 'Perfect gift packages', 5),
('Body Mist', 'body-mist', 'Light and refreshing body mists', 6),
('Mini Perfume', 'mini-perfume', 'Travel-sized fragrances', 7),
('Best Sellers', 'best-sellers', 'Our most popular fragrances', 8),
('New Arrivals', 'new-arrivals', 'Latest additions to our collection', 9)
ON CONFLICT (slug) DO NOTHING;
