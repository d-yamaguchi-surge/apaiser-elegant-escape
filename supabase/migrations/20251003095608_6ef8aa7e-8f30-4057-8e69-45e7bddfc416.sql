-- コーステーブルを作成
CREATE TABLE public.courses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  price INTEGER NOT NULL,
  description TEXT,
  image_path TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- RLSを有効化
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

-- 誰でもアクティブなコースを閲覧可能
CREATE POLICY "Anyone can read active courses"
ON public.courses
FOR SELECT
USING (is_active = true OR has_role(auth.uid(), 'admin'::app_role));

-- 管理者はコースを管理可能
CREATE POLICY "Admins can manage courses"
ON public.courses
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- 予約テーブルにcourse_idを追加
ALTER TABLE public.reservations
ADD COLUMN course_id UUID REFERENCES public.courses(id) ON DELETE SET NULL;

-- コメントを追加
COMMENT ON COLUMN public.reservations.course_id IS 'Selected course for the reservation. NULL means table-only reservation.';

-- coursesテーブルのupdated_atを自動更新するトリガー
CREATE TRIGGER update_courses_updated_at
BEFORE UPDATE ON public.courses
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- デフォルトコース「席のみ」を追加
INSERT INTO public.courses (name, price, description, is_active, display_order)
VALUES ('席のみ', 0, 'コース料理なしの席のみのご予約', true, 0);