import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useReservations, Reservation } from '@/modules/reservation/hooks/useReservations';
import { Plus } from 'lucide-react';

interface AddReservationDialogProps {
  onReservationAdded: () => void;
}

export const AddReservationDialog = ({ onReservationAdded }: AddReservationDialogProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    reservation_date: '',
    reservation_time: '',
    party_size: 1,
    status: 'pending' as const,
    special_requests: '',
  });
  const { addReservation } = useReservations();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await addReservation(formData);
      setFormData({
        customer_name: '',
        customer_email: '',
        customer_phone: '',
        reservation_date: '',
        reservation_time: '',
        party_size: 1,
        status: 'pending',
        special_requests: '',
      });
      setOpen(false);
      onReservationAdded();
    } catch (error) {
      console.error('Failed to add reservation:', error);
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          新規予約追加
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>新規予約追加</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="customer_name">氏名 *</Label>
            <Input
              id="customer_name"
              value={formData.customer_name}
              onChange={(e) => handleChange('customer_name', e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="customer_email">メール *</Label>
            <Input
              id="customer_email"
              type="email"
              value={formData.customer_email}
              onChange={(e) => handleChange('customer_email', e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="customer_phone">電話番号</Label>
            <Input
              id="customer_phone"
              type="tel"
              value={formData.customer_phone}
              onChange={(e) => handleChange('customer_phone', e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="reservation_date">予約日 *</Label>
              <Input
                id="reservation_date"
                type="date"
                value={formData.reservation_date}
                onChange={(e) => handleChange('reservation_date', e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="reservation_time">時間 *</Label>
              <Input
                id="reservation_time"
                type="time"
                value={formData.reservation_time}
                onChange={(e) => handleChange('reservation_time', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="party_size">人数 *</Label>
              <Select value={formData.party_size.toString()} onValueChange={(value) => handleChange('party_size', parseInt(value))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 10 }, (_, i) => i + 1).map(num => (
                    <SelectItem key={num} value={num.toString()}>{num}名</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="status">ステータス</Label>
              <Select value={formData.status} onValueChange={(value) => handleChange('status', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">未承認</SelectItem>
                  <SelectItem value="approved">承認済み</SelectItem>
                  <SelectItem value="cancelled">キャンセル</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="special_requests">備考・特別なご要望</Label>
            <Textarea
              id="special_requests"
              value={formData.special_requests}
              onChange={(e) => handleChange('special_requests', e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              キャンセル
            </Button>
            <Button type="submit">
              追加
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};