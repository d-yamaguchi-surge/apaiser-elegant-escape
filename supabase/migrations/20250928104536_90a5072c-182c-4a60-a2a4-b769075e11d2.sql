-- 営業日管理のための包括的なテーブル設計

-- 1. 定休日設定テーブル（曜日ベース）
CREATE TABLE public.recurring_closed_days (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6), -- 0=日曜日, 1=月曜日, ..., 6=土曜日
  reason TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 2. 期間指定休業テーブル
CREATE TABLE public.period_closures (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  reason TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT valid_period CHECK (end_date >= start_date)
);

-- 3. 営業日設定テーブル（基本設定）
CREATE TABLE public.business_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key TEXT NOT NULL UNIQUE,
  setting_value TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- RLS設定
ALTER TABLE public.recurring_closed_days ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.period_closures ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_settings ENABLE ROW LEVEL SECURITY;

-- RLSポリシー設定
-- recurring_closed_days
CREATE POLICY "Anyone can read recurring closed days" 
ON public.recurring_closed_days 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage recurring closed days" 
ON public.recurring_closed_days 
FOR ALL 
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- period_closures
CREATE POLICY "Anyone can read period closures" 
ON public.period_closures 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage period closures" 
ON public.period_closures 
FOR ALL 
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- business_settings
CREATE POLICY "Anyone can read business settings" 
ON public.business_settings 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage business settings" 
ON public.business_settings 
FOR ALL 
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- トリガー設定
CREATE TRIGGER update_recurring_closed_days_updated_at
BEFORE UPDATE ON public.recurring_closed_days
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_period_closures_updated_at
BEFORE UPDATE ON public.period_closures
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_business_settings_updated_at
BEFORE UPDATE ON public.business_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- 営業日判定関数
CREATE OR REPLACE FUNCTION public.is_business_day(check_date date)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT NOT EXISTS (
    -- 定休日チェック
    SELECT 1 FROM public.recurring_closed_days 
    WHERE day_of_week = EXTRACT(DOW FROM check_date)::integer 
      AND is_active = true
  ) AND NOT EXISTS (
    -- 期間指定休業チェック
    SELECT 1 FROM public.period_closures 
    WHERE check_date >= start_date
      AND check_date < end_date + interval '1 day'
      AND is_active = true
  );
$$;

-- 予約可能日判定関数
CREATE OR REPLACE FUNCTION public.is_reservation_available(check_date date)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.is_business_day(check_date) AND NOT EXISTS (
    -- 個別予約不可日チェック
    SELECT 1 FROM public.blocked_dates 
    WHERE blocked_date = check_date
  );
$$;

-- 初期データ挿入（デフォルト設定）
INSERT INTO public.business_settings (setting_key, setting_value, description) VALUES
('default_business_hours', '11:30-22:00', 'デフォルト営業時間'),
('max_advance_reservation_days', '30', '最大予約可能日数（日前）');