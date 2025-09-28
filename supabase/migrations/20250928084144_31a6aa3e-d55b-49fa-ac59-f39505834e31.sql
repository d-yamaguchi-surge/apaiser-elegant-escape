-- Create blocked_dates table for managing unavailable reservation dates
CREATE TABLE public.blocked_dates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  blocked_date DATE NOT NULL,
  reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(blocked_date)
);

-- Enable Row Level Security
ALTER TABLE public.blocked_dates ENABLE ROW LEVEL SECURITY;

-- Create policies for blocked_dates
CREATE POLICY "Anyone can read blocked dates" 
ON public.blocked_dates 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage blocked dates" 
ON public.blocked_dates 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_blocked_dates_updated_at
BEFORE UPDATE ON public.blocked_dates
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();