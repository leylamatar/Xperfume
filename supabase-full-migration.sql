-- Complete Supabase Migration
-- Run this entire file in your Supabase SQL Editor!

-- 1. Create products table with multilingual support
CREATE TABLE IF NOT EXISTS products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    name_ar TEXT,
    description TEXT,
    description_ar TEXT,
    short_description TEXT,
    short_description_ar TEXT,
    price NUMERIC NOT NULL,
    size_ml INTEGER,
    category TEXT,
    gender TEXT,
    image_url TEXT,
    slug TEXT,
    is_featured BOOLEAN DEFAULT FALSE,
    is_best_seller BOOLEAN DEFAULT FALSE,
    stock INTEGER DEFAULT 0,
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

-- 3. Create orders table
CREATE TABLE IF NOT EXISTS orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT,
    customer_address TEXT,
    total NUMERIC NOT NULL,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL,
    price NUMERIC NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Create admin_roles table
CREATE TABLE IF NOT EXISTS admin_roles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE
);

-- 6. Create site_settings table
CREATE TABLE IF NOT EXISTS site_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    key TEXT UNIQUE NOT NULL,
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
CREATE POLICY "Public can view products" ON products
    FOR SELECT USING (true);

-- Allow public read access to categories
CREATE POLICY "Public can view categories" ON categories
    FOR SELECT USING (true);

-- Allow public read access to site_settings
CREATE POLICY "Public can view site_settings" ON site_settings
    FOR SELECT USING (true);

-- Allow public read access to translations
CREATE POLICY "Public can view translations" ON translations
    FOR SELECT USING (true);

-- Allow authenticated users to insert orders (for checkout)
CREATE POLICY "Users can create orders" ON orders
    FOR INSERT WITH CHECK (true);

-- Allow authenticated users to insert order items
CREATE POLICY "Users can create order items" ON order_items
    FOR INSERT WITH CHECK (true);

-- 10. Insert default site settings
INSERT INTO site_settings (key, value_en, value_ar)
VALUES
    ('hero_title', 'Discover True Elegance', 'Gerçek Zarafeti Keşfedin'),
    ('hero_subtitle', 'Exquisite fragrances crafted with passion', 'Tutkuyla üretilen seçkin parfümler'),
    ('hero_description', 'Each scent tells a story of luxury, heritage, and timeless beauty.', 'Her koku lüks, miras ve zamansız güzelliğin bir hikayesini anlatır.'),
    ('hero_button', 'Explore Collection', 'Koleksiyonu Keşfet'),
    ('featured_title', 'Our Featured Selection', 'Öne Çıkan Seçimimiz'),
    ('best_sellers_title', 'Best Sellers', 'Çok Satanlar'),
    ('footer_description', 'Since 1847, creating fragrances that transcend time.', '1847\'den beri zamansız parfümler yaratıyoruz.'),
    ('whatsapp_number', '+1234567890', '+1234567890')
ON CONFLICT (key) DO NOTHING;

-- 11. Insert default categories
INSERT INTO categories (name, name_ar, description, description_ar)
VALUES
    ('Women', 'Kadın', 'Feminine and elegant fragrances', 'Kadınsı ve şık parfümler'),
    ('Men', 'Erkek', 'Bold and sophisticated scents', 'Cesur ve sofistikeli kokular'),
    ('Unisex', 'Unisex', 'Fragrances for everyone', 'Herkes için parfümler')
ON CONFLICT DO NOTHING;
