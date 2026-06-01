-- Run this in Supabase Dashboard > SQL Editor to add stock_status column to products table
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS stock_status TEXT DEFAULT 'In Stock';
