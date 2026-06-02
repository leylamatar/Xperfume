-- Complete Supabase Migration
-- Run this entire file in your Supabase SQL Editor!

CREATE TABLE IF NOT EXISTS products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    name_ar TEXT,
    description TEXT,
    description_ar TEXT,
    short_description TEXT,
    short_description_ar TEXT,
    price NUMERIC NOT NULL,
    old_price NUMERIC,
    size_ml INTEGER,
    category TEXT,
    category_id UUID,
    gender TEXT,
    image_url TEXT,
    slug TEXT,
    is_featured BOOLEAN DEFAULT FALSE,
    is_best_seller BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    stock INTEGER DEFAULT 0,
    stock_status TEXT DEFAULT 'In Stock',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create categories table with multilingual support
CREATE TABLE IF NOT EXISTS categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    name_ar TEXT,
    description TEXT,
    description_ar TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_number TEXT UNIQUE NOT NULL,
    customer_name TEXT NOT NULL,
    customer_email TEXT,
    customer_phone TEXT NOT NULL,
    customer_address TEXT,
    total_amount NUMERIC NOT NULL,
    note TEXT,
    order_status TEXT DEFAULT 'new',
    payment_status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    product_name TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    price NUMERIC NOT NULL,
    total_price NUMERIC NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Create admin_roles table
CREATE TABLE IF NOT EXISTS admin_roles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE
);

-- 6. Create site_settings table with multilingual support
CREATE TABLE IF NOT EXISTS site_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    key TEXT UNIQUE NOT NULL,
    value TEXT,
    value_en TEXT,
    value_ar TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Create translations table (for dynamic translations)
CREATE TABLE IF NOT EXISTS translations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    translation_key TEXT UNIQUE NOT NULL,
    value_en TEXT,
    value_ar TEXT,
    section TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Enable Row Level Security (RLS) on all tables
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE translations ENABLE ROW LEVEL SECURITY;

-- 9. Create RLS policies (everyone can read products/categories/settings/translations, only admins can write)
-- Allow public read access to products
CREATE POLICY IF NOT EXISTS "Public can view products" ON products
    FOR SELECT USING (true);

-- Allow public read access to categories
CREATE POLICY IF NOT EXISTS "Public can view categories" ON categories
    FOR SELECT USING (true);

-- Allow public read access to site_settings
CREATE POLICY IF NOT EXISTS "Public can view site_settings" ON site_settings
    FOR SELECT USING (true);

-- Allow public read access to translations
CREATE POLICY IF NOT EXISTS "Public can view translations" ON translations
    FOR SELECT USING (true);

-- Allow authenticated users to insert orders (for checkout)
CREATE POLICY IF NOT EXISTS "Users can create orders" ON orders
    FOR INSERT WITH CHECK (true);

-- Allow authenticated users to insert order items
CREATE POLICY IF NOT EXISTS "Users can create order items" ON order_items
    FOR INSERT WITH CHECK (true);

-- 10. Insert default site settings
INSERT INTO site_settings (key, value, value_en, value_ar)
VALUES
    ('hero_title', 'Discover True Elegance', 'Discover True Elegance', 'Gerçek Zarafeti Keşfedin'),
    ('hero_subtitle', 'Exquisite fragrances crafted with passion', 'Exquisite fragrances crafted with passion', 'Tutkuyla üretilen seçkin parfümler'),
    ('hero_description', 'Each scent tells a story of luxury, heritage, and timeless beauty.', 'Each scent tells a story of luxury, heritage, and timeless beauty.', 'Her koku lüks, miras ve zamansız güzelliğin bir hikayesini anlatır.'),
    ('hero_button', 'Explore Collection', 'Explore Collection', 'Koleksiyonu Keşfet'),
    ('featured_title', 'Our Featured Selection', 'Our Featured Selection', 'Öne Çıkan Seçimimiz'),
    ('best_sellers_title', 'Best Sellers', 'Best Sellers', 'Çok Satanlar'),
    ('footer_description', 'Since 1847, creating fragrances that transcend time.', 'Since 1847, creating fragrances that transcend time.', '1847\'den beri zamansız parfümler yaratıyoruz.'),
    ('whatsapp_number', '+1234567890', '+1234567890', '+1234567890'),
    ('hero_title_ar', 'Gerçek Zarafeti Keşfedin', 'Gerçek Zarafeti Keşfedin', 'Gerçek Zarafeti Keşfedin'),
    ('hero_subtitle_ar', 'Tutkuyla üretilen seçkin parfümler', 'Tutkuyla üretilen seçkin parfümler', 'Tutkuyla üretilen seçkin parfümler'),
    ('hero_description_ar', 'Her koku lüks, miras ve zamansız güzelliğin bir hikayesini anlatır.', 'Her koku lüks, miras ve zamansız güzelliğin bir hikayesini anlatır.', 'Her koku lüks, miras ve zamansız güzelliğin bir hikayesini anlatır.'),
    ('hero_button_text', 'Explore Collection', 'Explore Collection', 'Koleksiyonu Keşfet'),
    ('hero_button_text_ar', 'Koleksiyonu Keşfet', 'Koleksiyonu Keşfet', 'Koleksiyonu Keşfet'),
    ('featured_title_ar', 'Öne Çıkan Seçimimiz', 'Öne Çıkan Seçimimiz', 'Öne Çıkan Seçimimiz'),
    ('best_sellers_title_ar', 'Çok Satanlar', 'Çok Satanlar', 'Çok Satanlar'),
    ('footer_description_ar', '1847\'den beri zamansız parfümler yaratıyoruz.', '1847\'den beri zamansız parfümler yaratıyoruz.', '1847\'den beri zamansız parfümler yaratıyoruz.')
ON CONFLICT (key) DO NOTHING;

-- 11. Insert default categories
INSERT INTO categories (name, name_ar, description, description_ar)
VALUES
    ('Women', 'Kadın', 'Feminine and elegant fragrances', 'Kadınsı ve şık parfümler'),
    ('Men', 'Erkek', 'Bold and sophisticated scents', 'Cesur ve sofistikeli kokular'),
    ('Unisex', 'Unisex', 'Fragrances for everyone', 'Herkes için parfümler')
ON CONFLICT DO NOTHING;

-- 12. Admin-only policies (only users in admin_roles can modify data)
-- First, create a function to check admin status
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_roles
    WHERE user_id = auth.uid() AND is_active = TRUE
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Allow admins to do anything on products
CREATE POLICY IF NOT EXISTS "Admins can manage products" ON products
  FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- Allow admins to do anything on categories
CREATE POLICY IF NOT EXISTS "Admins can manage categories" ON categories
  FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- Allow admins to do anything on orders
CREATE POLICY IF NOT EXISTS "Admins can manage orders" ON orders
  FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- Allow admins to do anything on order_items
CREATE POLICY IF NOT EXISTS "Admins can manage order_items" ON order_items
  FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- Allow admins to do anything on site_settings
CREATE POLICY IF NOT EXISTS "Admins can manage site_settings" ON site_settings
  FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- Allow admins to do anything on translations
CREATE POLICY IF NOT EXISTS "Admins can manage translations" ON translations
  FOR ALL USING (is_admin()) WITH CHECK (is_admin());
