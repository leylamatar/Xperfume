-- Fix RLS policies to allow public order placement
DROP POLICY IF EXISTS "Users can create orders" ON orders;
DROP POLICY IF EXISTS "Users can create order items" ON order_items;
DROP POLICY IF EXISTS "Public can create orders" ON orders;
DROP POLICY IF EXISTS "Public can create order items" ON order_items;

-- Allow ANYONE to insert orders (for checkout without login)
CREATE POLICY "Public can create orders" ON orders
    FOR INSERT WITH CHECK (true);

-- Allow ANYONE to insert order items
CREATE POLICY "Public can create order items" ON order_items
    FOR INSERT WITH CHECK (true);
