import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Pencil } from 'lucide-react';
import { Reservation } from '@/modules/reservation/hooks/useReservations';
import { useCourses } from '@/modules/courses/hooks/useCourses';

interface EditReservationDialogProps {
  reservation: Reservation;
  onUpdate: (id: string, updates: Partial<Reservation>) => Promise<void>;
}

export function EditReservationDialog({ reservation, onUpdate }: EditReservationDialogProps) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState(reservation.customer_email);
  const [phone, setPhone] = useState(reservation.customer_phone || '');
  const [courseId, setCourseId] = useState<string | undefined>(reservation.course_id || undefined);
  const [specialRequests, setSpecialRequests] = useState(reservation.special_requests || '');
  const [loading, setLoading] = useState(false);
  const { courses } = useCourses();

  useEffect(() => {
    if (open) {
      setEmail(reservation.customer_email);
      setPhone(reservation.customer_phone || '');
      setCourseId(reservation.course_id || undefined);
      setSpecialRequests(reservation.special_requests || '');
    }
  }, [open, reservation]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await onUpdate(reservation.id, {
        customer_email: email,
        customer_phone: phone || null,
        course_id: courseId || null,
        special_requests: specialRequests || null,
      });
      setOpen(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Pencil className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>予約情報を編集</DialogTitle>
          <DialogDescription>
            {reservation.customer_name}様の予約情報を編集します。
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">メールアドレス *</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">電話番号</Label>
            <Input
              id="phone"
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="course">コース</Label>
            <Select
              value={courseId}
              onValueChange={(value) => setCourseId(value === 'none' ? undefined : value)}
            >
              <SelectTrigger id="course">
                <SelectValue placeholder="選択なし" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">選択なし</SelectItem>
                {courses.map((course) => (
                  <SelectItem key={course.id} value={course.id}>
                    {course.name}
                    {course.price > 0 && ` (¥${course.price.toLocaleString()})`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="specialRequests">特別なご要望</Label>
            <Textarea
              id="specialRequests"
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
              rows={4}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              キャンセル
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? '保存中...' : '保存'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
