-- Supabase SQL Migration

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create products table
CREATE TABLE products (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    short_description TEXT,
    price NUMERIC NOT NULL DEFAULT 0,
    old_price NUMERIC,
    category TEXT,
    gender TEXT,
    size_ml INTEGER,
    stock INTEGER DEFAULT 0,
    image_url TEXT,
    gallery_urls TEXT[],
    is_featured BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create orders table
CREATE TABLE orders (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    order_number TEXT UNIQUE NOT NULL,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_email TEXT,
    customer_address TEXT NOT NULL,
    city TEXT NOT NULL,
    district TEXT NOT NULL,
    payment_method TEXT DEFAULT 'bank_transfer',
    payment_status TEXT DEFAULT 'pending',
    order_status TEXT DEFAULT 'new',
    total_amount NUMERIC NOT NULL,
    note TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create order_items table
CREATE TABLE order_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
    product_id UUID REFERENCES products(id) NOT NULL,
    product_name TEXT NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_price NUMERIC NOT NULL,
    total_price NUMERIC NOT NULL
);

-- Create site_settings table
CREATE TABLE site_settings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    key TEXT UNIQUE NOT NULL,
    value TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create admin_roles table
CREATE TABLE admin_roles (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    role TEXT DEFAULT 'admin',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default site settings
INSERT INTO site_settings (key, value) VALUES
('whatsapp_number', '905000000000'),
('iban', 'TR00 0000 0000 0000 0000 0000 00'),
('account_holder', 'Élégance Absolue Parfümcülük'),
('bank_name', 'Example Bank'),
('contact_email', 'clients@eleganceabsolue.com'),
('contact_phone', '+33 1 42 68 24 00'),
('hero_title', 'Discover Timeless Fragrances'),
('hero_description', 'Experience the art of perfumery with our exclusive collection of niche fragrances, crafted with the world\s finest ingredients.');

-- Add missing columns to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS stock_status TEXT DEFAULT 'In Stock';

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_roles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for products
CREATE POLICY "Public can view active products" ON products FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage products" ON products ALL USING (
    EXISTS (
        SELECT 1 FROM admin_roles WHERE user_id = auth.uid()
    )
);

-- RLS Policies for orders
CREATE POLICY "Public can create orders" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view and manage orders" ON orders ALL USING (
    EXISTS (
        SELECT 1 FROM admin_roles WHERE user_id = auth.uid()
    )
);

-- RLS Policies for order_items
CREATE POLICY "Public can create order items" ON order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view and manage order items" ON order_items ALL USING (
    EXISTS (
        SELECT 1 FROM admin_roles WHERE user_id = auth.uid()
    )
);

-- RLS Policies for site_settings
CREATE POLICY "Public can view public settings" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Admins can manage site settings" ON site_settings ALL USING (
    EXISTS (
        SELECT 1 FROM admin_roles WHERE user_id = auth.uid()
    )
);

-- RLS Policies for admin_roles
CREATE POLICY "Users can view their own admin role" ON admin_roles FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Admins can insert admin roles" ON admin_roles FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Create Storage bucket for product images
-- Run this in Supabase Dashboard > Storage
-- CREATE BUCKET product-images WITH (PUBLIC = true);
