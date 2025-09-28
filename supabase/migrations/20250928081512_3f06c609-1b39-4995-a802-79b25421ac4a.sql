-- Add policy to allow public reservation creation
CREATE POLICY "Anyone can create reservations" 
ON public.reservations 
FOR INSERT 
WITH CHECK (true);

-- Create a function to check reservation availability without exposing customer data
CREATE OR REPLACE FUNCTION public.get_reservation_availability(check_date date)
RETURNS TABLE(reservation_date date, reservation_count bigint)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    r.reservation_date,
    COUNT(*) as reservation_count
  FROM public.reservations r
  WHERE r.reservation_date = check_date
    AND r.status != 'cancelled'
  GROUP BY r.reservation_date;
$$;

-- Create a function to get all dates with reservation counts for calendar display
CREATE OR REPLACE FUNCTION public.get_reservation_counts_by_date(start_date date, end_date date)
RETURNS TABLE(reservation_date date, reservation_count bigint)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    r.reservation_date,
    COUNT(*) as reservation_count
  FROM public.reservations r
  WHERE r.reservation_date BETWEEN start_date AND end_date
    AND r.status != 'cancelled'
  GROUP BY r.reservation_date
  ORDER BY r.reservation_date;
$$;