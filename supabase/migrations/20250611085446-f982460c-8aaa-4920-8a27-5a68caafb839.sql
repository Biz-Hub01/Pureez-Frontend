
-- Check if seller_profiles table exists, if not create it
CREATE TABLE IF NOT EXISTS public.seller_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  business_name TEXT,
  phone TEXT,
  address TEXT,
  verified BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security for seller_profiles if not already enabled
ALTER TABLE public.seller_profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist and recreate them
DROP POLICY IF EXISTS "Users can view their own seller profile" ON public.seller_profiles;
DROP POLICY IF EXISTS "Users can insert their own seller profile" ON public.seller_profiles;
DROP POLICY IF EXISTS "Users can update their own seller profile" ON public.seller_profiles;

-- RLS policies for seller_profiles
CREATE POLICY "Users can view their own seller profile" 
  ON public.seller_profiles 
  FOR SELECT 
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own seller profile" 
  ON public.seller_profiles 
  FOR INSERT 
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own seller profile" 
  ON public.seller_profiles 
  FOR UPDATE 
  USING (user_id = auth.uid());

-- Create or replace function to automatically create seller profile when product is created
CREATE OR REPLACE FUNCTION public.create_seller_profile_if_not_exists()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.seller_profiles (user_id)
  VALUES (NEW.seller_id)
  ON CONFLICT (user_id) DO NOTHING;
  
  RETURN NEW;
END;
$$;

-- Drop existing trigger if it exists and recreate it
DROP TRIGGER IF EXISTS trigger_create_seller_profile ON public.products;
CREATE TRIGGER trigger_create_seller_profile
  BEFORE INSERT ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION public.create_seller_profile_if_not_exists();
