-- Supabase Storage RLS Policies for product-images bucket
-- Run ALL these steps in your Supabase Dashboard!

-- =============================================
-- STEP 1: CREATE THE BUCKET (if not exists)
-- =============================================
-- Run this in Supabase Dashboard > SQL Editor
-- Or create manually in Storage > New Bucket
-- Name: product-images
-- Public: YES (toggle on)

-- =============================================
-- STEP 2: APPLY RLS POLICIES
-- =============================================
-- Run these in Supabase Dashboard > SQL Editor

-- Policy 1: Public can view all images in product-images bucket
CREATE POLICY "Public can view product images"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');

-- Policy 2: Authenticated admins can upload images
CREATE POLICY "Admins can upload product images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'product-images'
  AND auth.role() = 'authenticated'
);

-- Policy 3: Authenticated admins can update images
CREATE POLICY "Admins can update product images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'product-images'
  AND auth.role() = 'authenticated'
);

-- Policy 4: Authenticated admins can delete images
CREATE POLICY "Admins can delete product images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'product-images'
  AND auth.role() = 'authenticated'
);

-- =============================================
-- STEP 3: VERIFY BUCKET IS PUBLIC
-- =============================================
-- Go to: Supabase Dashboard > Storage > product-images > Settings
-- Make sure "Public bucket" is toggled ON!

