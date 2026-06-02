-- FORCE FIX SQL: Run this in Supabase SQL Editor if you get "column not found" errors

-- 1. Fix Orders table - Make customer_address and customer_email optional
ALTER TABLE orders ALTER COLUMN customer_address DROP NOT NULL;
ALTER TABLE orders ALTER COLUMN customer_email DROP NOT NULL;

-- 2. Add missing required columns
ALTER TABLE orders ADD COLUMN IF NOT EXISTS order_number TEXT UNIQUE;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_name TEXT NOT NULL;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_email TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_phone TEXT NOT NULL;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_address TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS total_amount NUMERIC NOT NULL;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS note TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS order_status TEXT DEFAULT 'new';
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending';

-- Remove redundant columns if they exist (optional, but keeps it clean)
-- ALTER TABLE orders DROP COLUMN IF EXISTS status;
-- ALTER TABLE orders DROP COLUMN IF EXISTS total;

-- 3. Fix Order Items table
ALTER TABLE order_items ADD COLUMN IF NOT EXISTS product_name TEXT;
ALTER TABLE order_items ADD COLUMN IF NOT EXISTS quantity INTEGER;
ALTER TABLE order_items ADD COLUMN IF NOT EXISTS price NUMERIC;
ALTER TABLE order_items ADD COLUMN IF NOT EXISTS total_price NUMERIC;

-- 4. Fix Products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS name_ar TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS description_ar TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS short_description_ar TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS old_price NUMERIC;
ALTER TABLE products ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;
ALTER TABLE products ADD COLUMN IF NOT EXISTS stock_status TEXT DEFAULT 'In Stock';

-- 5. Fix Site Settings table
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS value_en TEXT;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS value_ar TEXT;
