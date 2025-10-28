import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ReservationFilters as FilterType } from '@/modules/reservation/hooks/useReservations';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, addDays } from 'date-fns';
import { ja } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DateRange } from 'react-day-picker';

interface ReservationFiltersProps {
  onFiltersChange: (filters: FilterType) => void;
  currentFilters: FilterType;
}

export const ReservationFilters = ({ onFiltersChange, currentFilters }: ReservationFiltersProps) => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>(() => {
    if (currentFilters.startDate && currentFilters.endDate) {
      return {
        from: new Date(currentFilters.startDate),
        to: new Date(currentFilters.endDate)
      };
    }
    // Default: today to 1 week later
    return {
      from: new Date(),
      to: addDays(new Date(), 7)
    };
  });
  const [status, setStatus] = useState<string>(currentFilters.status || 'all');

  const handleQuickRange = (rangeType: 'today' | 'thisWeek' | 'thisMonth' | 'thisYear') => {
    const now = new Date();
    let newRange: DateRange | undefined;

    switch (rangeType) {
      case 'today':
        newRange = { from: now, to: now };
        break;
      case 'thisWeek':
        newRange = { from: startOfWeek(now, { locale: ja }), to: endOfWeek(now, { locale: ja }) };
        break;
      case 'thisMonth':
        newRange = { from: startOfMonth(now), to: endOfMonth(now) };
        break;
      case 'thisYear':
        newRange = { from: startOfYear(now), to: endOfYear(now) };
        break;
    }

    setDateRange(newRange);
    applyFilters(newRange, status);
  };

  const applyFilters = (range: DateRange | undefined, selectedStatus: string) => {
    const filters: FilterType = {};

    if (range?.from) {
      filters.startDate = format(range.from, 'yyyy-MM-dd');
    }
    if (range?.to) {
      filters.endDate = format(range.to, 'yyyy-MM-dd');
    }
    if (selectedStatus !== 'all') {
      filters.status = selectedStatus as 'pending' | 'approved' | 'cancelled';
    }

    onFiltersChange(filters);
  };

  const handleApply = () => {
    applyFilters(dateRange, status);
  };

  const handleClear = () => {
    setDateRange(undefined);
    setStatus('all');
    onFiltersChange({});
  };

  const handleStatusChange = (value: string) => {
    setStatus(value);
  };

  return (
    <div className="mb-6 space-y-4">
      {/* Main filter controls */}
      <div className="flex flex-wrap items-center gap-4">
        {/* Date Range Picker */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "justify-start text-left font-normal min-w-[260px]",
                !dateRange && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateRange?.from ? (
                dateRange.to ? (
                  <>
                    {format(dateRange.from, 'yyyy/MM/dd', { locale: ja })} ~{' '}
                    {format(dateRange.to, 'yyyy/MM/dd', { locale: ja })}
                  </>
                ) : (
                  format(dateRange.from, 'yyyy/MM/dd', { locale: ja })
                )
              ) : (
                <span>期間を選択</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="range"
              selected={dateRange}
              onSelect={setDateRange}
              numberOfMonths={2}
              locale={ja}
              className="pointer-events-auto"
            />
          </PopoverContent>
        </Popover>

        {/* Status Select */}
        <Select value={status} onValueChange={handleStatusChange}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="ステータス" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全てのステータス</SelectItem>
            <SelectItem value="pending">承認待ち</SelectItem>
            <SelectItem value="approved">承認済み</SelectItem>
            <SelectItem value="cancelled">キャンセル</SelectItem>
          </SelectContent>
        </Select>

        {/* Apply Button */}
        <Button onClick={handleApply} variant="default">
          絞り込み
        </Button>

        {/* Clear Button */}
        <Button onClick={handleClear} variant="outline">
          クリア
        </Button>
      </div>

      {/* Quick select buttons */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleQuickRange('today')}
          className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
        >
          今日
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleQuickRange('thisWeek')}
          className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
        >
          今週
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleQuickRange('thisMonth')}
          className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
        >
          今月
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleQuickRange('thisYear')}
          className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
        >
          今年
        </Button>
      </div>
    </div>
  );
};
