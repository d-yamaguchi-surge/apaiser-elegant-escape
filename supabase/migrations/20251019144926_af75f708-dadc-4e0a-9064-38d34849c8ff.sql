-- Clean up duplicate policies and ensure proper RLS protection for reservations table
-- This ensures customer contact information (emails, phone numbers) is only accessible to admins

-- Drop duplicate SELECT policies
DROP POLICY IF EXISTS "Admins can view all reservations" ON public.reservations;

-- The "Only admins can view reservations" policy already exists and is correct
-- The "Admins can manage reservations" policy (ALL command) already provides full admin access
-- The "Anyone can create reservations" policy (INSERT) is correct for public reservation creation

-- Verify RLS is enabled
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;