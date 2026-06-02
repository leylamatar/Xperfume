-- Fix orders table schema to allow optional address fields
ALTER TABLE orders 
ALTER COLUMN customer_address DROP NOT NULL;

ALTER TABLE orders 
ALTER COLUMN city DROP NOT NULL;

ALTER TABLE orders 
ALTER COLUMN district DROP NOT NULL;

-- Also, let's make sure we have all columns from full migration
ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_address TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS city TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS district TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_method TEXT DEFAULT 'bank_transfer';
