
-- Fix RLS and product policies

-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Allow public read access to all products
DROP POLICY IF EXISTS "Public can view all products" ON products;
CREATE POLICY "Public can view all products"
ON products FOR SELECT
USING (true);

-- Allow public read access to categories
DROP POLICY IF EXISTS "Public can view all categories" ON categories;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view all categories"
ON categories FOR SELECT
USING (true);

-- Ensure all products have is_active = true (if not set)
UPDATE products 
SET is_active = true 
WHERE is_active IS NULL OR is_active = false;

-- Ensure all categories have is_active = true
UPDATE categories 
SET is_active = true 
WHERE is_active IS NULL OR is_active = false;
