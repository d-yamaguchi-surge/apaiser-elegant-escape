import { useState, useEffect } from 'react';
import { format, parse } from "date-fns";
import { ja } from 'date-fns/locale';
import { Calendar, Trash2, Plus, Clock, CalendarDays, Settings } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { useBlockedDates } from '@/modules/blockedDates/hooks/useBlockedDates';
import { useBusinessDays } from '@/modules/businessDays/hooks/useBusinessDays';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const dayOfWeekNames = ['日', '月', '火', '水', '木', '金', '土'];

const AdminBusinessDays = () => {
  const { blockedDates, loading: blockedLoading, addBlockedDate, deleteBlockedDate } = useBlockedDates();
  const { 
    recurringClosedDays, 
    periodClosures, 
    loading: businessLoading, 
    addRecurringClosedDay,
    updateRecurringClosedDay,
    deleteRecurringClosedDay,
    addPeriodClosure,
    deletePeriodClosure
  } = useBusinessDays();

  // State for blocked dates (individual dates)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [reason, setReason] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State for recurring closed days
  const [selectedDayOfWeek, setSelectedDayOfWeek] = useState<string>('');
  const [recurringReason, setRecurringReason] = useState('');
  const [isSubmittingRecurring, setIsSubmittingRecurring] = useState(false);

  // State for period closures
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [periodReason, setPeriodReason] = useState('');
  const [isSubmittingPeriod, setIsSubmittingPeriod] = useState(false);

  const loading = blockedLoading || businessLoading;

  // Individual blocked dates handlers
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

  // Recurring closed days handlers
  const handleRecurringSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDayOfWeek) {
      toast({
        title: 'エラー',
        description: '曜日を選択してください。',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmittingRecurring(true);
    try {
      await addRecurringClosedDay({
        day_of_week: parseInt(selectedDayOfWeek),
        reason: recurringReason.trim() || null,
        is_active: true,
      });
      setSelectedDayOfWeek('');
      setRecurringReason('');
      toast({
        title: '成功',
        description: '定休日を追加しました。',
      });
    } catch (error) {
      console.error('Error adding recurring closed day:', error);
    } finally {
      setIsSubmittingRecurring(false);
    }
  };

  const toggleRecurringDay = async (id: string, isActive: boolean) => {
    try {
      await updateRecurringClosedDay(id, { is_active: !isActive });
      toast({
        title: '成功',
        description: isActive ? '定休日を無効にしました。' : '定休日を有効にしました。',
      });
    } catch (error) {
      console.error('Error toggling recurring day:', error);
    }
  };

  // Period closures handlers
  const handlePeriodSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !endDate) {
      toast({
        title: 'エラー',
        description: '開始日と終了日を選択してください。',
        variant: 'destructive',
      });
      return;
    }

    if (startDate > endDate) {
      toast({
        title: 'エラー',
        description: '開始日は終了日より前の日付を選択してください。',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmittingPeriod(true);
    try {
      await addPeriodClosure({
        start_date: format(startDate, 'yyyy-MM-dd'),
        end_date: format(endDate, 'yyyy-MM-dd'),
        reason: periodReason.trim(),
        is_active: true,
      });
      setStartDate(undefined);
      setEndDate(undefined);
      setPeriodReason('');
      toast({
        title: '成功',
        description: '期間休業を追加しました。',
      });
    } catch (error) {
      console.error('Error adding period closure:', error);
    } finally {
      setIsSubmittingPeriod(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-playfair text-3xl font-bold text-foreground mb-2">
          営業日管理
        </h1>
        <p className="text-muted-foreground">
          営業日・定休日・期間休業・予約不可日を管理します
        </p>
      </div>

      <Tabs defaultValue="recurring" className="space-y-8">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="recurring" className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4" />
            定休日設定
          </TabsTrigger>
          <TabsTrigger value="period" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            期間休業
          </TabsTrigger>
          <TabsTrigger value="individual" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            個別予約不可日
          </TabsTrigger>
        </TabsList>

        {/* 定休日設定タブ */}
        <TabsContent value="recurring" className="space-y-6">
          <Card className="border-gold/20 shadow-elegant">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5 text-gold" />
                定休日を追加
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleRecurringSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="dayOfWeek">曜日 *</Label>
                    <Select value={selectedDayOfWeek} onValueChange={setSelectedDayOfWeek}>
                      <SelectTrigger>
                        <SelectValue placeholder="曜日を選択してください" />
                      </SelectTrigger>
                      <SelectContent>
                        {dayOfWeekNames.map((day, index) => (
                          <SelectItem key={index} value={index.toString()}>
                            {day}曜日
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="recurringReason">理由（任意）</Label>
                    <Input
                      id="recurringReason"
                      value={recurringReason}
                      onChange={(e) => setRecurringReason(e.target.value)}
                      placeholder="例: 定休日、メンテナンス日など"
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  variant="gold" 
                  disabled={!selectedDayOfWeek || isSubmittingRecurring}
                  className="w-full md:w-auto"
                >
                  {isSubmittingRecurring ? (
                    <>
                      <LoadingSpinner />
                      追加中...
                    </>
                  ) : (
                    <>
                      <Plus className="mr-2 h-4 w-4" />
                      定休日を追加
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="border-gold/20 shadow-elegant">
            <CardHeader>
              <CardTitle>現在の定休日設定</CardTitle>
            </CardHeader>
            <CardContent>
              {recurringClosedDays.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  定休日が設定されていません
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>曜日</TableHead>
                        <TableHead>理由</TableHead>
                        <TableHead>状態</TableHead>
                        <TableHead className="w-24">操作</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recurringClosedDays.map((closedDay) => (
                        <TableRow key={closedDay.id}>
                          <TableCell className="font-medium">
                            {dayOfWeekNames[closedDay.day_of_week]}曜日
                          </TableCell>
                          <TableCell>
                            {closedDay.reason || (
                              <span className="text-muted-foreground">理由なし</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Switch
                                checked={closedDay.is_active}
                                onCheckedChange={() => toggleRecurringDay(closedDay.id, closedDay.is_active)}
                              />
                              <span className={closedDay.is_active ? 'text-destructive' : 'text-muted-foreground'}>
                                {closedDay.is_active ? '休業' : '営業'}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => deleteRecurringClosedDay(closedDay.id)}
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
        </TabsContent>

        {/* 期間休業タブ */}
        <TabsContent value="period" className="space-y-6">
          <Card className="border-gold/20 shadow-elegant">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5 text-gold" />
                期間休業を追加
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePeriodSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">開始日 *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            'w-full justify-start text-left font-normal',
                            !startDate && 'text-muted-foreground'
                          )}
                        >
                          <Calendar className="mr-2 h-4 w-4" />
                          {startDate 
                            ? format(startDate, 'yyyy年M月d日', { locale: ja })
                            : '開始日を選択'
                          }
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                          mode="single"
                          selected={startDate}
                          onSelect={setStartDate}
                          locale={ja}
                          className="rounded-md border-gold/20"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="endDate">終了日 *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            'w-full justify-start text-left font-normal',
                            !endDate && 'text-muted-foreground'
                          )}
                        >
                          <Calendar className="mr-2 h-4 w-4" />
                          {endDate 
                            ? format(endDate, 'yyyy年M月d日', { locale: ja })
                            : '終了日を選択'
                          }
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                          mode="single"
                          selected={endDate}
                          onSelect={setEndDate}
                          locale={ja}
                          className="rounded-md border-gold/20"
                          disabled={startDate ? (date) => date < startDate : undefined}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="periodReason">理由 *</Label>
                    <Input
                      id="periodReason"
                      value={periodReason}
                      onChange={(e) => setPeriodReason(e.target.value)}
                      placeholder="例: 年末年始休業、改装工事など"
                      required
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  variant="gold" 
                  disabled={!startDate || !endDate || !periodReason.trim() || isSubmittingPeriod}
                  className="w-full md:w-auto"
                >
                  {isSubmittingPeriod ? (
                    <>
                      <LoadingSpinner />
                      追加中...
                    </>
                  ) : (
                    <>
                      <Plus className="mr-2 h-4 w-4" />
                      期間休業を追加
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="border-gold/20 shadow-elegant">
            <CardHeader>
              <CardTitle>現在の期間休業設定</CardTitle>
            </CardHeader>
            <CardContent>
              {periodClosures.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  期間休業が設定されていません
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>期間</TableHead>
                        <TableHead>理由</TableHead>
                        <TableHead>追加日時</TableHead>
                        <TableHead className="w-24">操作</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {periodClosures
                        .sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime())
                        .map((closure) => (
                          <TableRow key={closure.id}>
                            <TableCell className="font-medium">
                              {format(parse(closure.start_date, 'yyyy-MM-dd', new Date()), 'yyyy年M月d日', { locale: ja })}
                              {' ～ '}
                              {format(parse(closure.end_date, 'yyyy-MM-dd', new Date()), 'yyyy年M月d日', { locale: ja })}
                            </TableCell>
                            <TableCell>{closure.reason}</TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {format(new Date(closure.created_at), 'yyyy/MM/dd HH:mm')}
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => deletePeriodClosure(closure.id)}
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
        </TabsContent>

        {/* 個別予約不可日タブ */}
        <TabsContent value="individual" className="space-y-6">
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
                        .sort(
                          (a, b) =>
                            parse(a.blocked_date, 'yyyy-MM-dd', new Date()).getTime() -
                            parse(b.blocked_date, 'yyyy-MM-dd', new Date()).getTime()
                        )
                        .map((blockedDate) => (
                          <TableRow key={blockedDate.id}>
                            <TableCell className="font-medium">
                              {format(parse(blockedDate.blocked_date, 'yyyy-MM-dd', new Date()), 'yyyy年M月d日 (EEEE)', { locale: ja })}
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
        </TabsContent>
      </Tabs>

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

export default AdminBusinessDays;