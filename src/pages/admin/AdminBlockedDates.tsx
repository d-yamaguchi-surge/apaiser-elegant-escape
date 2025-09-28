import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { Calendar, Trash2, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { useBlockedDates } from '@/modules/blockedDates/hooks/useBlockedDates';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const AdminBlockedDates = () => {
  const { blockedDates, loading, addBlockedDate, deleteBlockedDate, refetch } = useBlockedDates();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [reason, setReason] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate) {
      toast({
        title: 'エラー',
        description: '日付を選択してください。',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await addBlockedDate({
        blocked_date: format(selectedDate, 'yyyy-MM-dd'),
        reason: reason.trim() || null,
      });
      setSelectedDate(undefined);
      setReason('');
      toast({
        title: '成功',
        description: '予約不可日を追加しました。',
      });
    } catch (error) {
      console.error('Error adding blocked date:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    
    try {
      await deleteBlockedDate(deleteId);
      toast({
        title: '成功',
        description: '予約不可日を削除しました。',
      });
    } catch (error) {
      console.error('Error deleting blocked date:', error);
    }
    setDeleteId(null);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-playfair text-3xl font-bold text-foreground mb-2">
          予約不可日管理
        </h1>
        <p className="text-muted-foreground">
          予約を受け付けない日付を管理します
        </p>
      </div>

      {/* Add New Blocked Date */}
      <Card className="border-gold/20 shadow-elegant">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5 text-gold" />
            予約不可日を追加
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="date">日付 *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !selectedDate && 'text-muted-foreground'
                      )}
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {selectedDate 
                        ? format(selectedDate, 'yyyy年M月d日 (EEEE)', { locale: ja })
                        : '日付を選択してください'
                      }
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      locale={ja}
                      className="rounded-md border-gold/20"
                      disabled={(date) => {
                        // Disable past dates and already blocked dates
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        if (date < today) return true;
                        
                        const dateString = format(date, 'yyyy-MM-dd');
                        return blockedDates.some(bd => bd.blocked_date === dateString);
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reason">理由（任意）</Label>
                <Textarea
                  id="reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="例: 臨時休業、貸切営業など"
                  className="resize-none"
                  rows={3}
                />
              </div>
            </div>

            <Button 
              type="submit" 
              variant="gold" 
              disabled={!selectedDate || isSubmitting}
              className="w-full md:w-auto"
            >
              {isSubmitting ? (
                <>
                  <LoadingSpinner />
                  追加中...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  予約不可日を追加
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Blocked Dates List */}
      <Card className="border-gold/20 shadow-elegant">
        <CardHeader>
          <CardTitle>現在の予約不可日</CardTitle>
        </CardHeader>
        <CardContent>
          {blockedDates.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              予約不可日が設定されていません
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>日付</TableHead>
                    <TableHead>理由</TableHead>
                    <TableHead>追加日時</TableHead>
                    <TableHead className="w-24">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {blockedDates
                    .sort((a, b) => new Date(a.blocked_date).getTime() - new Date(b.blocked_date).getTime())
                    .map((blockedDate) => (
                      <TableRow key={blockedDate.id}>
                        <TableCell className="font-medium">
                          {format(new Date(blockedDate.blocked_date), 'yyyy年M月d日 (EEEE)', { locale: ja })}
                        </TableCell>
                        <TableCell>
                          {blockedDate.reason || (
                            <span className="text-muted-foreground">理由なし</span>
                          )}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {format(new Date(blockedDate.created_at), 'yyyy/MM/dd HH:mm')}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setDeleteId(blockedDate.id)}
                            className="text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="予約不可日を削除"
        description="この予約不可日を削除してもよろしいですか？この操作は取り消せません。"
        confirmText="削除"
        cancelText="キャンセル"
      />
    </div>
  );
};

export default AdminBlockedDates;