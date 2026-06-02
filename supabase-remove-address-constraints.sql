-- Run this in Supabase SQL Editor to make address-related columns nullable (SAFE VERSION)

DO $$ 
BEGIN
    -- Make customer_address nullable if it exists and is NOT NULL
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'orders' 
        AND column_name = 'customer_address' 
        AND is_nullable = 'NO'
    ) THEN
        ALTER TABLE orders ALTER COLUMN customer_address DROP NOT NULL;
    END IF;

    -- Make city nullable if it exists and is NOT NULL
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'orders' 
        AND column_name = 'city' 
        AND is_nullable = 'NO'
    ) THEN
        ALTER TABLE orders ALTER COLUMN city DROP NOT NULL;
    END IF;

    -- Make district nullable if it exists and is NOT NULL
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'orders' 
        AND column_name = 'district' 
        AND is_nullable = 'NO'
    ) THEN
        ALTER TABLE orders ALTER COLUMN district DROP NOT NULL;
    END IF;

    -- Make country_id nullable if it exists and is NOT NULL
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'orders' 
        AND column_name = 'country_id' 
        AND is_nullable = 'NO'
    ) THEN
        ALTER TABLE orders ALTER COLUMN country_id DROP NOT NULL;
    END IF;

    -- Make country nullable if it exists and is NOT NULL
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'orders' 
        AND column_name = 'country' 
        AND is_nullable = 'NO'
    ) THEN
        ALTER TABLE orders ALTER COLUMN country DROP NOT NULL;
    END IF;
END $$;
